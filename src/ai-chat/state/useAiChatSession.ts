import * as React from "react";
import { createAiChatApi, type AiChatApi } from "../api/aiChatApi";
import type {
  ChatEvent,
  ContextUsage,
  ChatMode,
  ConversationListItem,
  DonePayload,
  TranscriptMessage,
} from "../api/types";
import {
  extractEnterMode,
  extractRedirect,
  hasExitMode,
  stripSentinels,
  type ScheduleSeed,
} from "../lib/sentinels";
import { buildScheduleGreeting, resolveLabels } from "../labels";
import {
  ChatSendTimeoutError,
  ChatTransport,
  type TransportStatus,
} from "../realtime/chatTransport";
import type { AiChatConfig, ChatMessage, SessionStatus } from "../types";

/**
 * The whole client-side turn lifecycle in one hook: open a conversation, hold the socket,
 * send a turn, fold the §4 event stream into renderable messages, cancel an in-flight run.
 *
 * Rules that shape it:
 *  • The socket is opened lazily — mounting the widget on every page must cost nothing until
 *    the user actually opens the drawer.
 *  • Events fold into the LAST assistant turn. `done` closes it; a fresh send opens the next.
 *  • Mode lives HERE, not in the view: the `start_scheduling` tool can flip the conversation into
 *    scheduling mode mid-turn via an `[[ENTER_MODE:…]]` sentinel, and every later turn must carry
 *    that mode + its seeded scope.
 */

/** Mirrors the backend's own `system` boundary markers (chat.usecase `appendModeMarker`). */
const MODE_ENTER_TEXT = "🗓️ เข้าสู่โหมดจัดเวร";
const MODE_EXIT_TEXT = "ออกจากโหมดจัดเวร";
const NO_ANSWER_TEXT = "(ไม่มีคำตอบ)";

/**
 * How long a turn whose ack was lost waits for the channel to prove it is alive. Generous: the
 * answer it is waiting for is a whole agent run, and the cost of being wrong is a turn closed as
 * failed while its reply is still on the way — the failure this path was built to stop.
 */
const UNACKED_GRACE_MS = 150_000;
const UNACKED_EXPIRED_TEXT =
  "ไม่ได้รับคำตอบจากระบบค่ะ ข้อความอาจไม่ได้ถูกส่งถึง ลองส่งใหม่อีกครั้งนะคะ";

interface SessionState {
  conversationId: string | null;
  messages: ChatMessage[];
  status: SessionStatus;
  transportStatus: TransportStatus;
  activeRunId: string | null;
  error: string | null;
  mode: ChatMode;
  scheduleSeed: ScheduleSeed | null;
  /**
   * Conversation context fill, as of the last `done`. Per conversation, so switching or starting one
   * clears it — and it stays null until the first turn answers, because only the service can measure it.
   */
  contextUsage: ContextUsage | null;
}

type Action =
  | { type: "starting" }
  | {
      type: "started";
      conversationId: string;
      history: ChatMessage[];
      mode: ChatMode;
      seed: ScheduleSeed | null;
    }
  | { type: "transport"; status: TransportStatus }
  | { type: "user_turn"; message: ChatMessage; placeholder: ChatMessage }
  | { type: "run_accepted"; runId: string }
  | { type: "event"; event: Exclude<ChatEvent, { event: "done" }> }
  | {
      type: "done";
      payload: DonePayload;
      content: string;
      seed: ScheduleSeed | null;
      exit: boolean;
      /** Onboarding text to append when this turn hands over into scheduling mode. */
      greeting: string;
    }
  | { type: "set_mode"; mode: ChatMode; seed: ScheduleSeed | null; greeting: string }
  | { type: "error"; message: string }
  /** The send RPC timed out — the turn may be running. Keeps it open; see the reducer case. */
  | { type: "send_unacked"; message: string }
  | { type: "reset" };

const initialState: SessionState = {
  conversationId: null,
  messages: [],
  status: "idle",
  transportStatus: "idle",
  activeRunId: null,
  error: null,
  mode: "assistant",
  scheduleSeed: null,
  contextUsage: null,
};

function reducer(state: SessionState, action: Action): SessionState {
  switch (action.type) {
    case "starting":
      return { ...state, status: "starting", error: null };

    case "started":
      return {
        ...state,
        conversationId: action.conversationId,
        messages: action.history,
        status: "ready",
        error: null,
        mode: action.mode,
        scheduleSeed: action.seed,
        // A replayed transcript carries no `done` events, so the meter has nothing to show until the
        // next turn answers. Better blank than a stale number from another conversation.
        contextUsage: null,
      };

    case "transport": {
      // S11-F2: `error` had no exit but a full restart, so a dead broker left the composer disabled
      // FOREVER — even after the connection came back. The socket returning IS the recovery signal:
      // unlock the room. (The hook also resyncs the transcript from the server at this moment, so
      // any reply that finished while the screen was dark surfaces on its own.)
      if (action.status === "connected" && state.status === "error") {
        return { ...state, transportStatus: action.status, status: "ready", error: null };
      }
      return { ...state, transportStatus: action.status };
    }

    case "user_turn":
      return {
        ...state,
        messages: [...state.messages, action.message, action.placeholder],
        status: "sending",
        error: null,
      };

    case "run_accepted":
      return { ...state, activeRunId: action.runId };

    case "event":
      return applyEvent(state, action.event);

    case "done":
      return applyDone(state, action);

    case "set_mode": {
      // No-op on a same-mode call: the host syncs its `mode` prop through here on every change,
      // and a repeat must not stamp another boundary divider into the log.
      if (action.mode === state.mode) return state;
      const entering = action.mode === "schedule";
      const messages = [...state.messages];
      // Skip the boundary marker on an empty log (e.g. the host starting in scheduling mode) —
      // there is no boundary to draw yet, but the guidance is still worth showing.
      if (messages.length) messages.push(divider(entering ? MODE_ENTER_TEXT : MODE_EXIT_TEXT));
      if (entering) messages.push(assistantNote(action.greeting));

      return {
        ...state,
        mode: action.mode,
        // Re-entering scheduling by hand keeps whatever scope a previous hand-off resolved.
        scheduleSeed: entering ? (action.seed ?? state.scheduleSeed) : null,
        messages,
      };
    }

    case "error":
      return {
        ...state,
        status: "error",
        error: action.message,
        // Put the reason INSIDE the turn that failed. Closing the placeholder silently leaves an
        // empty bubble on screen, and a status banner alone gets overwritten by whatever event
        // arrives next — the user is then left with a blank reply and no explanation.
        messages: failStreamingTurn(state.messages, action.message),
        activeRunId: null,
      };

    // The send RPC timed out. Unlike `error`, this says nothing about whether the turn is running,
    // so the placeholder stays STREAMING: the answer arrives as publications on a channel keyed by
    // conversation, not by run, and it lands with or without the runId the RPC never returned.
    // Closing the turn here is what threw real answers away — `applyDone` folds `done` into the
    // last streaming message, so with none left it dropped the reply and rendered nothing. The
    // note goes in `error` for the banner only; the composer stays locked (status "sending")
    // because a turn IS in flight. The caller arms a grace timer so this cannot hang forever —
    // if no publication arrives it dispatches a real `error`, which is the way out (S11-F2).
    case "send_unacked":
      return { ...state, error: action.message };

    case "reset":
      return { ...initialState };
  }
}

/** Fold one streaming event into the open assistant turn. */
function applyEvent(
  state: SessionState,
  event: Exclude<ChatEvent, { event: "done" }>,
): SessionState {
  const index = lastStreamingIndex(state.messages);
  if (index < 0) return state;

  const messages = [...state.messages];
  const turn = messages[index]!;

  switch (event.event) {
    case "token":
      // Deltas CONCATENATE (agent-loop streams chunk-by-chunk and sends only the remainder at the
      // end) — replacing would drop everything but the last chunk on a streamed answer.
      messages[index] = { ...turn, content: turn.content + event.payload.delta };
      return { ...state, messages, status: "streaming" };

    case "tool_call": {
      const tools = [...(turn.tools ?? [])];
      // A tool reports twice (start → done/error); collapse onto the same label instead of stacking.
      const open = tools.findIndex(
        (t) => t.label_th === event.payload.label_th && t.status === "start",
      );
      if (open >= 0 && event.payload.status !== "start") {
        tools[open] = { ...event.payload, startedAt: tools[open]!.startedAt };
      } else {
        tools.push({ ...event.payload, startedAt: Date.now() });
      }
      messages[index] = { ...turn, tools };
      return { ...state, messages, status: "streaming" };
    }

    case "widget":
      messages[index] = { ...turn, widgets: [...(turn.widgets ?? []), event.payload] };
      return { ...state, messages, status: "streaming" };

    case "proposal":
      // No dedicated surface yet — keep the summary visible rather than dropping the turn's point.
      messages[index] = {
        ...turn,
        content: turn.content
          ? `${turn.content}\n\n${event.payload.summary_th}`
          : event.payload.summary_th,
      };
      return { ...state, messages, status: "streaming" };

    case "task_state":
      return state;
  }
}

function applyDone(
  state: SessionState,
  action: Extract<Action, { type: "done" }>,
): SessionState {
  const index = lastStreamingIndex(state.messages);
  if (index < 0) return { ...state, status: "ready", activeRunId: null };

  const messages = [...state.messages];
  messages[index] = {
    ...messages[index]!,
    content: action.content || NO_ANSWER_TEXT,
    streaming: false,
    outcome: action.payload,
  };

  // A hand-off flips the conversation into scheduling mode and seeds its scope; an exit drops back.
  const enteringSchedule = Boolean(action.seed) && state.mode !== "schedule";
  const leavingSchedule = action.exit && state.mode === "schedule";
  if (enteringSchedule) {
    messages.push(divider(MODE_ENTER_TEXT), assistantNote(action.greeting));
  }
  if (leavingSchedule) messages.push(divider(MODE_EXIT_TEXT));

  return {
    ...state,
    messages,
    status: "ready",
    activeRunId: null,
    mode: action.seed ? "schedule" : action.exit ? "assistant" : state.mode,
    scheduleSeed: action.seed ?? (action.exit ? null : state.scheduleSeed),
    contextUsage: action.payload.context ?? state.contextUsage,
  };
}

function lastStreamingIndex(messages: ChatMessage[]): number {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i]?.streaming) return i;
  }
  return -1;
}

function failStreamingTurn(messages: ChatMessage[], reason: string): ChatMessage[] {
  const index = lastStreamingIndex(messages);
  if (index < 0) return messages;
  const next = [...messages];
  const turn = next[index]!;
  next[index] = {
    ...turn,
    streaming: false,
    failed: true,
    // Keep whatever streamed in before the failure; append the reason rather than losing it.
    content: turn.content ? `${turn.content}\n\n${reason}` : reason,
  };
  return next;
}

let messageSeq = 0;
const nextId = () => `m${++messageSeq}-${Date.now().toString(36)}`;
const divider = (text: string): ChatMessage => ({ id: nextId(), role: "system", content: text });
/** Client-authored guidance rendered as an assistant turn (never sent to the model). */
const assistantNote = (text: string): ChatMessage => ({
  id: nextId(),
  role: "assistant",
  content: text,
});

export interface AiChatSession {
  state: SessionState;
  /** Open (or resume) a conversation and connect the socket. Safe to call repeatedly. */
  start: (conversationId?: string) => Promise<void>;
  send: (text: string) => Promise<void>;
  cancel: () => Promise<void>;
  /** Drop the current thread and start a fresh one on the next `start()`. */
  newConversation: () => void;
  setMode: (mode: ChatMode, seed?: ScheduleSeed) => void;
  listConversations: () => Promise<ConversationListItem[]>;
  api: AiChatApi;
}

/**
 * What the session runs on. `getToken` is REQUIRED here even though it is optional on the public props:
 * by this point the widget has resolved self-auth vs the host's token into one function, and the session
 * must never have to ask which of the two it is holding.
 */
export type AiChatSessionConfig = AiChatConfig & { getToken: () => string | Promise<string> };

export function useAiChatSession(config: AiChatSessionConfig): AiChatSession {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  // Config changes (a new scope, a refreshed token closure) must reach in-flight callbacks
  // without tearing down the socket — so read it through a ref, not through closure capture.
  const configRef = React.useRef(config);
  configRef.current = config;

  const api = React.useMemo(
    () =>
      createAiChatApi({
        baseUrl: config.baseUrl,
        getToken: () => configRef.current.getToken(),
        fetchImpl: config.fetchImpl,
      }),
    [config.baseUrl, config.fetchImpl],
  );

  const labels = React.useMemo(() => resolveLabels(config.labels), [config.labels]);
  const labelsRef = React.useRef(labels);
  labelsRef.current = labels;

  const transportRef = React.useRef<ChatTransport | null>(null);
  const startingRef = React.useRef<Promise<void> | null>(null);
  // `start` for callbacks wired BEFORE `start` exists (the transport's own status handler) —
  // reconnect-resync must call the latest start, not a stale closure.
  const startRef = React.useRef<((conversationId?: string) => Promise<void>) | null>(null);
  // Latest state for stable callbacks that must read it (setMode keeps the resolved scope).
  const stateRef = React.useRef(state);
  stateRef.current = state;
  // Raw streamed text of the open turn — sentinels are parsed off THIS, not off rendered content.
  const streamRef = React.useRef("");
  const storageKey = `mediact-ai-chat:conversation:${config.baseUrl}`;

  const reportError = React.useCallback((error: unknown, fallback: string) => {
    const err = error instanceof Error ? error : new Error(fallback);
    configRef.current.onError?.(err);
    dispatch({ type: "error", message: err.message || fallback });
  }, []);

  // A send whose ack was lost leaves the turn open waiting for the channel. This is the deadline on
  // that wait: without it, a turn the service never actually received would spin forever with the
  // composer locked — the shape of S11-F2, re-created by the very fix for it.
  const unackedTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearUnackedGrace = React.useCallback(() => {
    if (!unackedTimerRef.current) return;
    clearTimeout(unackedTimerRef.current);
    unackedTimerRef.current = null;
  }, []);
  const armUnackedGrace = React.useCallback(() => {
    clearUnackedGrace();
    unackedTimerRef.current = setTimeout(() => {
      unackedTimerRef.current = null;
      dispatch({ type: "error", message: UNACKED_EXPIRED_TEXT });
    }, UNACKED_GRACE_MS);
  }, [clearUnackedGrace]);
  React.useEffect(() => clearUnackedGrace, [clearUnackedGrace]);

  const handleEvent = React.useCallback((event: ChatEvent) => {
    // Anything at all on the channel proves the turn is alive — stand the grace timer down.
    clearUnackedGrace();
    if (event.event !== "done") {
      if (event.event === "token") streamRef.current += event.payload.delta;
      dispatch({ type: "event", event });
      return;
    }

    // Terminal event: resolve the FE directives the reply carries, then close the turn.
    const raw = streamRef.current;
    streamRef.current = "";
    const redirect = extractRedirect(raw);
    if (redirect && typeof window !== "undefined") {
      // New tab — navigating away would kill the socket mid-conversation.
      window.open(redirect, "_blank", "noopener,noreferrer");
    }
    const seed = extractEnterMode(raw);
    dispatch({
      type: "done",
      payload: event.payload,
      content: stripSentinels(raw),
      seed,
      exit: hasExitMode(raw),
      greeting: buildScheduleGreeting(labelsRef.current, seed),
    });
  }, []);

  const start = React.useCallback(
    async (conversationId?: string) => {
      if (transportRef.current && !conversationId) return;
      if (startingRef.current) return startingRef.current;

      const run = (async () => {
        dispatch({ type: "starting" });
        try {
          // Switching threads: drop the old socket before opening the new one.
          transportRef.current?.disconnect();
          transportRef.current = null;

          // Resume what the user was last talking about — closing the drawer must not throw the
          // thread away. Falls back to a new conversation if that id is gone (deleted, other user).
          const remembered = conversationId ?? readStored(storageKey);
          let id: string;
          let transcript: TranscriptMessage[] = [];
          if (remembered) {
            try {
              transcript = await api.getMessages(remembered);
              id = remembered;
            } catch {
              id = (await api.createConversation()).id;
            }
          } else {
            id = (await api.createConversation()).id;
          }
          writeStored(storageKey, id);

          const { messages, mode, seed } = replayTranscript(transcript);

          const info = await api.connectInfo(id);
          if (!info.wsUrl) {
            throw new Error(
              "ai-service ยังไม่ได้ตั้งค่า transport (ไม่มี wsUrl) — ติดต่อผู้ดูแลระบบ",
            );
          }

          const transport = new ChatTransport({
            wsUrl: info.wsUrl,
            channels: info.channels,
            getToken: () => configRef.current.getToken(),
            debug: configRef.current.debug,
            onEvent: handleEvent,
            onStatusChange: (status) => {
              dispatch({ type: "transport", status });
              // S11-F2: while the screen sat in `error`, replies kept landing in the conversation
              // on the server (turns outlive a dead socket by design). Reconnecting is the moment
              // to fetch what was missed — a full re-start on the SAME conversation replays the
              // transcript from the source of truth. Guarded to the error state so a healthy
              // stream is never interrupted, and `startingRef` already serializes re-entry.
              if (status === "connected" && stateRef.current.status === "error") {
                const current = stateRef.current.conversationId;
                if (current) void startRef.current?.(current);
              }
            },
            onError: (error) => configRef.current.onError?.(error),
          });
          await transport.connect();
          transportRef.current = transport;

          dispatch({ type: "started", conversationId: id, history: messages, mode, seed });
        } catch (error) {
          reportError(error, "เปิดห้องสนทนาไม่สำเร็จ");
        } finally {
          startingRef.current = null;
        }
      })();

      startingRef.current = run;
      return run;
    },
    [api, handleEvent, reportError, storageKey],
  );
  startRef.current = start;

  const send = React.useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const transport = transportRef.current;
      const conversationId = state.conversationId;
      if (!transport || !conversationId) {
        reportError(new Error("ยังไม่ได้เชื่อมต่อห้องสนทนา"), "ยังไม่ได้เชื่อมต่อ");
        return;
      }

      streamRef.current = "";
      dispatch({
        type: "user_turn",
        message: { id: nextId(), role: "user", content: trimmed },
        placeholder: { id: nextId(), role: "assistant", content: "", streaming: true },
      });

      try {
        // `transport.send` owns the pre-flight: re-pin a refreshed token (the JWT forwarded to
        // revise-api is the connection's, not this call's) and wait for the socket.
        const { scope } = configRef.current;
        const ticket = await transport.send({
          conversationId,
          message: trimmed,
          mode: state.mode,
          ...scope,
          // A scheduling hand-off already resolved dept/month — carry it so the agent doesn't re-ask.
          ...(state.mode === "schedule" ? state.scheduleSeed : null),
        });
        dispatch({ type: "run_accepted", runId: ticket.runId });
      } catch (error) {
        // A timed-out send is not a failed turn (see ChatSendTimeoutError): the service answers on
        // the conversation's channel, so the reply still arrives — but only if the turn is left
        // open for it to land in. Arm a grace timer so an ack that never comes still has an exit.
        if (error instanceof ChatSendTimeoutError) {
          dispatch({ type: "send_unacked", message: error.message });
          armUnackedGrace();
          return;
        }
        reportError(error, "ส่งข้อความไม่สำเร็จ");
      }
    },
    [state.conversationId, state.mode, state.scheduleSeed, reportError, armUnackedGrace],
  );

  const cancel = React.useCallback(async () => {
    const runId = state.activeRunId;
    if (!runId) return;
    try {
      await api.cancelRun(runId);
    } catch (error) {
      // A failed cancel is not a failed turn — report it, but let the run keep streaming.
      configRef.current.onError?.(
        error instanceof Error ? error : new Error("ยกเลิกไม่สำเร็จ"),
      );
    }
  }, [api, state.activeRunId]);

  const newConversation = React.useCallback(() => {
    transportRef.current?.disconnect();
    transportRef.current = null;
    streamRef.current = "";
    writeStored(storageKey, null);
    dispatch({ type: "reset" });
  }, [storageKey]);

  const setMode = React.useCallback((mode: ChatMode, seed?: ScheduleSeed) => {
    const effectiveSeed = seed ?? stateRef.current.scheduleSeed;
    dispatch({
      type: "set_mode",
      mode,
      seed: seed ?? null,
      greeting: buildScheduleGreeting(labelsRef.current, effectiveSeed),
    });
  }, []);

  const listConversations = React.useCallback(() => api.listConversations(), [api]);

  React.useEffect(() => {
    return () => {
      transportRef.current?.disconnect();
      transportRef.current = null;
    };
  }, []);

  return {
    state,
    start,
    send,
    cancel,
    newConversation,
    setMode,
    listConversations,
    api,
  };
}

/**
 * Rebuild the log from a saved transcript AND re-derive the mode from it. Without the second half,
 * a reload mid-scheduling replays the text but drops back to assistant mode, so the next turn is
 * sent without the seed — the agent then re-asks for a department it already knows.
 */
function replayTranscript(transcript: TranscriptMessage[]): {
  messages: ChatMessage[];
  mode: ChatMode;
  seed: ScheduleSeed | null;
} {
  let seed: ScheduleSeed | null = null;

  const messages = transcript.map((message) => {
    if (message.role === "assistant") {
      const entered = extractEnterMode(message.content);
      if (entered) seed = entered;
      if (hasExitMode(message.content)) seed = null;
    }
    return {
      id: nextId(),
      role: message.role,
      // Sentinels are directives, never text — and replay must not re-trigger them either.
      content: message.role === "assistant" ? stripSentinels(message.content) : message.content,
    };
  });

  return { messages, mode: seed ? "schedule" : "assistant", seed };
}

function readStored(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key) || null;
  } catch {
    return null;
  }
}

function writeStored(key: string, value: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (value) window.localStorage.setItem(key, value);
    else window.localStorage.removeItem(key);
  } catch {
    /* private mode / storage disabled — the widget still works, it just won't resume */
  }
}
