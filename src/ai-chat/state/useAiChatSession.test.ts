import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ChatEvent } from "../api/types";
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

vi.mock("../api/aiChatApi", () => ({
  createAiChatApi: () => ({
    createConversation: async () => ({ id: CONVERSATION }),
    getMessages: async () => [],
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
  sendResult = async () => ({ runId: "run-1" });
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
