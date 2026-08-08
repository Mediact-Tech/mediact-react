import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ChatEvent, TranscriptMessage } from "../api/types";
import { ChatSendTimeoutError } from "../realtime/chatTransport";
import { useAiChatSession } from "./useAiChatSession";

/**
 * The turn lifecycle around a send whose ACK was lost.
 *
 * This is the one that cost a scenario run. Centrifuge caps every command at 5s by default, and
 * accepting a turn takes longer than that — the service writes the message, marks the mode boundary
 * and creates the run before it can answer. The call then rejected with the bare word `timeout`,
 * which the transport read as a dropped socket, and the hook closed the turn as failed. Nothing had
 * dropped: the run was accepted, and its answer arrived on the channel moments later — into a
 * transcript with no streaming turn left to hold it, so `applyDone` returned early and the reply was
 * discarded. From the outside: "the reply is in the database but the screen shows a connection
 * error." So the rule under test is that a timed-out send leaves the turn OPEN.
 */

const CONVERSATION = "conv-1";
let sendResult: (() => Promise<{ runId: string }>) | null = null;
let emit: ((event: ChatEvent) => void) | null = null;
/** What `GET /conversations/:id/messages` returns — the source a follower tab resyncs from. */
let transcript: TranscriptMessage[] = [];

vi.mock("../api/aiChatApi", () => ({
  createAiChatApi: () => ({
    createConversation: async () => ({ id: CONVERSATION }),
    getMessages: async () => transcript,
    connectInfo: async () => ({
      wsUrl: "ws://test/connection/websocket",
      channels: { chat: `chat:${CONVERSATION}`, task: `task:${CONVERSATION}` },
    }),
    listConversations: async () => [],
  }),
}));

vi.mock("../realtime/chatTransport", async () => {
  const actual = await vi.importActual<typeof import("../realtime/chatTransport")>(
    "../realtime/chatTransport",
  );
  return {
    ...actual,
    ChatTransport: class {
      constructor(private readonly config: { onEvent: (e: ChatEvent, k: "chat" | "task") => void }) {
        emit = (event) => this.config.onEvent(event, "chat");
      }
      connect = async () => undefined;
      disconnect = () => undefined;
      send = async () => sendResult!();
      get currentStatus() {
        return "connected" as const;
      }
    },
  };
});

async function startedSession() {
  const hook = renderHook(() =>
    useAiChatSession({ baseUrl: "http://ai.test", getToken: () => "jwt" }),
  );
  await act(async () => {
    await hook.result.current.start();
  });
  return hook;
}

/** The last assistant bubble — the one a turn streams into. */
const reply = (hook: Awaited<ReturnType<typeof startedSession>>) =>
  [...hook.result.current.state.messages].reverse().find((m) => m.role === "assistant");

beforeEach(() => {
  emit = null;
  transcript = [];
  sendResult = async () => ({ runId: "run-1" });
  // `start()` remembers the last conversation here. Left standing between tests it makes the next `start()`
  // replay a transcript that test never set up — which is how one of these passed for the wrong reason.
  window.localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("useAiChatSession — a send whose ack timed out", () => {
  it("keeps the turn open so the answer still has somewhere to land", async () => {
    sendResult = async () => {
      throw new ChatSendTimeoutError();
    };
    const hook = await startedSession();

    await act(async () => {
      await hook.result.current.send("เดือนนี้ใครขึ้นเวรดึกบ้าง");
    });

    // Open, not failed: the run may well be executing.
    expect(reply(hook)?.streaming).toBe(true);
    expect(reply(hook)?.failed).toBeUndefined();

    // …and the answer the service publishes lands normally.
    await act(async () => {
      emit!({ event: "token", payload: { delta: "เวรดึกวันนี้มี 2 คนค่ะ" } } as ChatEvent);
      emit!({ event: "done", payload: {} } as ChatEvent);
    });

    await waitFor(() => expect(reply(hook)?.streaming).toBe(false));
    expect(reply(hook)?.content).toBe("เวรดึกวันนี้มี 2 คนค่ะ");
    expect(hook.result.current.state.status).toBe("ready");
  });

  // The old failure mode, asserted directly: with the turn closed, `done` had no streaming message
  // to fold into and the reply vanished. A regression here is silent, which is why it is pinned.
  it("does not discard the reply the way a failed turn did", async () => {
    sendResult = async () => {
      throw new ChatSendTimeoutError();
    };
    const hook = await startedSession();
    await act(async () => {
      await hook.result.current.send("ถามอะไรสักอย่าง");
    });
    await act(async () => {
      emit!({ event: "done", payload: {} } as ChatEvent);
    });

    expect(reply(hook)?.content).not.toBe("");
  });

  // The escape hatch. Leaving a turn open forever recreates S11-F2 — a locked composer with no way
  // out — so silence past the grace window closes it as a real failure.
  it("gives up when nothing ever arrives on the channel", async () => {
    vi.useFakeTimers();
    sendResult = async () => {
      throw new ChatSendTimeoutError();
    };
    const hook = await startedSession();
    await act(async () => {
      await hook.result.current.send("ข้อความที่ไม่มีใครได้รับ");
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(150_000);
    });

    expect(hook.result.current.state.status).toBe("error");
    expect(reply(hook)?.failed).toBe(true);
  });

  it("a genuine send failure still fails the turn immediately", async () => {
    sendResult = async () => {
      throw new Error("4403 permission denied");
    };
    const hook = await startedSession();
    await act(async () => {
      await hook.result.current.send("ทำอะไรที่ไม่มีสิทธิ์");
    });

    expect(hook.result.current.state.status).toBe("error");
    expect(reply(hook)?.failed).toBe(true);
  });
});

/**
 * Two tabs, one conversation.
 *
 * `chat:{conversationId}` is per conversation, not per client, so every tab the user has open receives
 * every publication — measured on dev: the second tab took all 25 frames of a turn, `done` included, and
 * rendered none of them. It had no streaming bubble, because only `send` ever made one, so `applyEvent`
 * and `applyDone` both returned early and the whole turn went on the floor. On screen that reads as the
 * tab having dropped out of the chat: still connected, still subscribed, permanently empty.
 */
describe("useAiChatSession — a turn started in another tab", () => {
  it("renders the turn instead of dropping it on the floor", async () => {
    const hook = await startedSession();

    await act(async () => {
      emit!({ event: "token", payload: { delta: "เวรดึกวันนี้มี 2 คนค่ะ" }, turnId: "run-9" } as ChatEvent);
    });
    await waitFor(() => expect(reply(hook)?.streaming).toBe(true));

    await act(async () => {
      emit!({ event: "done", payload: {}, turnId: "run-9" } as ChatEvent);
    });

    await waitFor(() => expect(reply(hook)?.streaming).toBe(false));
    expect(reply(hook)?.content).toBe("เวรดึกวันนี้มี 2 คนค่ะ");
    expect(hook.result.current.state.status).toBe("ready");
  });

  // The question rides the channel ahead of the answer, so a follower hears the whole turn in order
  // instead of having to go read the missing half back over HTTP.
  it("shows the question typed in the other tab, above the answer", async () => {
    const hook = await startedSession();

    await act(async () => {
      emit!({
        event: "user_turn",
        payload: { message: "เดือนนี้ใครขึ้นเวรดึกบ้าง" },
        turnId: "run-9",
      } as ChatEvent);
      emit!({ event: "token", payload: { delta: "2 คนค่ะ" }, turnId: "run-9" } as ChatEvent);
    });

    const roles = hook.result.current.state.messages.map((m) => `${m.role}:${m.content}`);
    expect(roles).toEqual(["user:เดือนนี้ใครขึ้นเวรดึกบ้าง", "assistant:2 คนค่ะ"]);
  });

  // The sender already drew the question when it hit send; the echo must not draw it a second time.
  it("does not echo the question back onto the tab that typed it", async () => {
    const hook = await startedSession();
    await act(async () => {
      await hook.result.current.send("ถามเอง");
    });

    await act(async () => {
      emit!({ event: "user_turn", payload: { message: "ถามเอง" }, turnId: "run-1" } as ChatEvent);
    });

    expect(hook.result.current.state.messages.filter((m) => m.role === "user")).toHaveLength(1);
  });

  // ai-service deploys on its own schedule, so an event name this build has never heard of is a normal
  // event. It used to fall off the end of `applyEvent`'s switch and return undefined — which the reducer
  // then made the entire session state, white-screening the drawer.
  it("survives an event name it does not know", async () => {
    const hook = await startedSession();
    await act(async () => {
      await hook.result.current.send("ถามอะไรสักอย่าง");
    });

    await act(async () => {
      emit!({ event: "something_from_the_future", payload: { x: 1 } } as unknown as ChatEvent);
    });

    expect(hook.result.current.state.messages.length).toBeGreaterThan(0);
    expect(reply(hook)?.streaming).toBe(true);
  });

  it("locks the composer while the other tab's turn runs", async () => {
    const hook = await startedSession();
    await act(async () => {
      emit!({ event: "token", payload: { delta: "กำลังดูให้ค่ะ" }, turnId: "run-9" } as ChatEvent);
    });

    expect(hook.result.current.state.status).toBe("streaming");

    // A second run on one conversation replays a history that does not contain the first one's answer yet.
    const before = hook.result.current.state.messages.length;
    await act(async () => {
      await hook.result.current.send("ขอถามซ้อนหน่อย");
    });
    expect(hook.result.current.state.messages.length).toBe(before);
  });

  // A redirect is the answer to something somebody asked HERE. Firing it on every open tab pops up
  // windows nobody asked for — and the passive tab used to do exactly that, since it parsed the
  // sentinels off a stream it was accumulating even while rendering none of it.
  it("does not open a redirect the other tab asked for", async () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    const hook = await startedSession();

    await act(async () => {
      emit!({
        event: "token",
        payload: { delta: "เปิดหน้าตารางให้แล้วค่ะ [[REDIRECT:/schedules]]" },
        turnId: "run-9",
      } as ChatEvent);
      emit!({ event: "done", payload: {}, turnId: "run-9" } as ChatEvent);
    });

    expect(open).not.toHaveBeenCalled();
    // The directive is still stripped from what the follower shows.
    expect(reply(hook)?.content).not.toContain("REDIRECT");
  });

  it("still opens a redirect for the turn this tab sent", async () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    const hook = await startedSession();
    await act(async () => {
      await hook.result.current.send("เปิดหน้าตารางให้หน่อย");
    });
    await act(async () => {
      emit!({ event: "token", payload: { delta: "[[REDIRECT:/schedules]]" }, turnId: "run-1" } as ChatEvent);
      emit!({ event: "done", payload: {}, turnId: "run-1" } as ChatEvent);
    });

    expect(open).toHaveBeenCalledWith("/schedules", "_blank", "noopener,noreferrer");
  });

  // Back-compat: a service that predates `turnId` sends none, and the session falls back to the old
  // guess — an open bubble means the turn is ours.
  it("treats an unstamped event as its own turn when one is open", async () => {
    const hook = await startedSession();
    await act(async () => {
      await hook.result.current.send("ถามอะไรสักอย่าง");
    });
    const before = hook.result.current.state.messages.length;

    await act(async () => {
      emit!({ event: "token", payload: { delta: "ตอบค่ะ" } } as ChatEvent);
    });

    // Folded into the turn we already had, not given a bubble of its own.
    expect(hook.result.current.state.messages.length).toBe(before);
    expect(reply(hook)?.content).toBe("ตอบค่ะ");
  });

  it("does not fold another turn's tokens into the one this tab sent", async () => {
    sendResult = async () => ({ runId: "run-mine" });
    const hook = await startedSession();
    await act(async () => {
      await hook.result.current.send("คำถามของแท็บนี้");
    });

    await act(async () => {
      emit!({ event: "token", payload: { delta: "คำตอบของอีกแท็บ" }, turnId: "run-other" } as ChatEvent);
    });

    // Ours was closed rather than being garbled with someone else's answer, and the newcomer got its
    // own bubble — two assistant turns, not one containing both.
    const assistants = hook.result.current.state.messages.filter((m) => m.role === "assistant");
    expect(assistants).toHaveLength(2);
    expect(assistants[0]?.streaming).toBe(false);
    expect(assistants[1]?.content).toBe("คำตอบของอีกแท็บ");
  });
});
