import * as React from "react";
import { AiChatApiError } from "./api/aiChatApi";
import type { AudioClip } from "./api/types";
import { resolveTokenProvider } from "./auth/selfAuth";
import { ChatDrawer } from "./components/ChatDrawer";
import { FloatingButton } from "./components/FloatingButton";
import { resolveLabels } from "./labels";
import { AI_CHAT_OPEN_EVENT, type AiChatOpenDetail } from "./lib/hostBridge";
import { useAiChatSession } from "./state/useAiChatSession";
import type { AiChatConfig, AiChatLocale } from "./types";

/**
 * Roster-flavoured openers — the assistant's most common real questions.
 *
 * 🔴 These are sent verbatim as the user's first message, so they follow the UI language rather than
 * the model's: a chip the user reads in English then watches send Thai reads as a bug in the widget.
 */
const SUGGESTIONS_BY_LOCALE: Record<AiChatLocale, string[]> = {
  th: [
    "วันที่ 6 ใครขึ้นเวรเช้าบ้าง",
    "เดือนนี้มีเวรไหนคนไม่พอ",
    "ตอนนี้แผนกเปิดกฎอะไรอยู่บ้าง",
  ],
  en: [
    "Who is on the morning shift on the 6th?",
    "Which shifts are short-staffed this month?",
    "Which rules is this department running?",
  ],
};

export interface AiChatWidgetProps extends AiChatConfig {
  /** Controlled open state. Omit to let the widget own it. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Hide the built-in launcher when the host opens the drawer from its own button. */
  hideLauncher?: boolean;
  className?: string;
}

/**
 * The single component every app mounts — floating launcher + chat drawer, one import.
 *
 * Mount it once, high in the tree (Portal `_app`, Mediwork/Medimatch root layout). Nothing
 * happens until the user opens it: no socket, no request. Everything the widget needs from
 * the host arrives as props (`baseUrl`, `getToken`, `scope`), so it stays free of any app's
 * auth wiring, HTTP client or router.
 */
export function AiChatWidget({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  hideLauncher,
  className,
  ...config
}: AiChatWidgetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  // One provider per mount: `resolveTokenProvider` owns the widget's Keycloak adapter, so re-creating it
  // per render would re-run `init` (and its iframe) on every keystroke.
  const getToken = React.useMemo(
    () => resolveTokenProvider(config.auth, config.getToken, config.onError),
    [config.auth, config.getToken, config.onError],
  );
  const session = useAiChatSession(React.useMemo(() => ({ ...config, getToken }), [config, getToken]));
  const locale = config.locale ?? "th";
  const labels = React.useMemo(() => resolveLabels(config.labels, locale), [config.labels, locale]);
  const position = config.position ?? "bottom-right";
  const suggestions = config.suggestions ?? SUGGESTIONS_BY_LOCALE[locale] ?? SUGGESTIONS_BY_LOCALE.th;

  // Mode lives in the session, not here: the `start_scheduling` tool can flip it mid-turn.
  // The host's `mode` prop is the starting point, applied when it changes.
  const { setMode } = session;
  React.useEffect(() => {
    if (config.mode) setMode(config.mode);
  }, [config.mode, setMode]);

  /**
   * Voice input is optional on BOTH sides: the host can switch it off, and the service may not expose
   * `/v2/ai/stt` in this environment yet. A 404/501 is a permanent answer for this session, so the mic
   * retires after the first attempt instead of failing again under the user's finger every time.
   */
  const [sttMissing, setSttMissing] = React.useState(false);
  const { api } = session;
  const transcribe = React.useCallback(
    async (audio: AudioClip, signal?: AbortSignal) => {
      try {
        return await api.transcribe(audio, signal);
      } catch (cause) {
        if (cause instanceof AiChatApiError && (cause.status === 404 || cause.status === 501)) {
          setSttMissing(true);
        }
        throw cause;
      }
    },
    [api],
  );
  const voiceEnabled = (config.voiceInput ?? true) && !sttMissing;

  // Lazy connect: the socket opens the first time the drawer is opened, not on mount.
  React.useEffect(() => {
    if (open) void session.start();
  }, [open, session.start]);

  // Host bridge — `openAiChat()` anywhere in the app opens this drawer and queues a message.
  const [hostRequest, setHostRequest] = React.useState<AiChatOpenDetail | null>(null);
  React.useEffect(() => {
    const onOpen = (event: Event) => {
      // Ack by cancelling: this is how the dispatcher learns a widget is actually mounted.
      event.preventDefault();
      const detail = (event as CustomEvent<AiChatOpenDetail>).detail ?? {};
      if (detail.message?.trim()) setHostRequest(detail);
      setOpen(true);
    };
    window.addEventListener(AI_CHAT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(AI_CHAT_OPEN_EVENT, onOpen);
  }, [setOpen]);

  // A queued host message waits for the session to be ready (a busy turn finishes, a cold start
  // connects), flips the mode first when asked, then goes out as a normal user turn.
  const { status: sessionStatus, mode: sessionMode } = session.state;
  const { setMode: sessionSetMode, send: sessionSend } = session;
  React.useEffect(() => {
    if (!hostRequest?.message) return;
    if (sessionStatus === "error") {
      // A failed start must not fire a surprise send minutes later once the user retries.
      setHostRequest(null);
      return;
    }
    if (sessionStatus !== "ready") return;
    if (hostRequest.mode && sessionMode !== hostRequest.mode) {
      sessionSetMode(hostRequest.mode);
      return; // effect re-runs once the mode lands
    }
    setHostRequest(null);
    void sessionSend(hostRequest.message);
  }, [hostRequest, sessionStatus, sessionMode, sessionSetMode, sessionSend]);

  const handleSend = React.useCallback(
    (text: string) => {
      void session.send(text);
    },
    [session.send],
  );

  const handlePickConversation = React.useCallback(
    (conversationId: string) => {
      void session.start(conversationId);
    },
    [session.start],
  );

  const handleNewChat = React.useCallback(() => {
    session.newConversation();
    void session.start();
  }, [session.newConversation, session.start]);

  const handleRetry = React.useCallback(() => {
    // S11-F2: retry after a transport failure must KEEP the thread — restarting on the same
    // conversation replays the transcript (incl. replies that landed while the socket was down)
    // and re-opens the socket. Only a session that never got a conversation starts fresh.
    const current = session.state.conversationId;
    if (current) {
      void session.start(current);
      return;
    }
    session.newConversation();
    void session.start();
  }, [session.state.conversationId, session.newConversation, session.start]);

  return (
    <>
      {!hideLauncher && (
        <FloatingButton
          open={open}
          onClick={() => setOpen(!open)}
          // The button's job changes with the drawer: it opens the assistant, then it puts it away. A
          // screen reader that hears "ผู้ช่วย AI" on a button that hides the panel learns the same wrong
          // thing the ✕ used to teach sighted users.
          label={open ? labels.minimize : labels.launcher}
          position={position}
          className={className}
        />
      )}

      <ChatDrawer
        open={open}
        onOpenChange={setOpen}
        messages={session.state.messages}
        status={session.state.status}
        transportStatus={session.state.transportStatus}
        error={session.state.error}
        activeConversationId={session.state.conversationId}
        labels={labels}
        position={position}
        mode={session.state.mode}
        contextUsage={session.state.contextUsage}
        suggestions={suggestions}
        onSend={handleSend}
        onCancel={() => void session.cancel()}
        onTranscribe={voiceEnabled ? transcribe : undefined}
        onVoiceError={config.onError}
        onNewChat={handleNewChat}
        onPickConversation={handlePickConversation}
        onRetry={handleRetry}
        loadConversations={session.listConversations}
      />
    </>
  );
}
