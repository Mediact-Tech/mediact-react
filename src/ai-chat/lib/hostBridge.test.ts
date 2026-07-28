import { afterEach, describe, expect, it, vi } from "vitest";
import { AI_CHAT_OPEN_EVENT, openAiChat, type AiChatOpenDetail } from "./hostBridge";

/**
 * The bridge's one promise: the return value tells the caller whether a widget actually took the
 * request. A banner that shows "ส่งให้ AI แล้ว" when nothing was mounted is worse than no button.
 */
describe("openAiChat", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns false when nothing is listening", () => {
    expect(openAiChat({ message: "ช่วยตรวจกฎ" })).toBe(false);
  });

  it("returns true once a mounted widget acks by cancelling the event", () => {
    const seen: AiChatOpenDetail[] = [];
    const onOpen = (event: Event) => {
      event.preventDefault();
      seen.push((event as CustomEvent<AiChatOpenDetail>).detail);
    };
    window.addEventListener(AI_CHAT_OPEN_EVENT, onOpen);
    try {
      expect(openAiChat({ message: "ช่วยตรวจกฎ", mode: "schedule" })).toBe(true);
      expect(seen).toEqual([{ message: "ช่วยตรวจกฎ", mode: "schedule" }]);
    } finally {
      window.removeEventListener(AI_CHAT_OPEN_EVENT, onOpen);
    }
  });

  it("opens without a message — an empty detail still reaches the widget", () => {
    const onOpen = (event: Event) => event.preventDefault();
    window.addEventListener(AI_CHAT_OPEN_EVENT, onOpen);
    try {
      expect(openAiChat()).toBe(true);
    } finally {
      window.removeEventListener(AI_CHAT_OPEN_EVENT, onOpen);
    }
  });
});
