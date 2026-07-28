import type { ChatMode } from "../api/types";

/**
 * Host → widget bridge. The drawer is mounted ONCE at the app root, but the moments that want to
 * open it live deep inside feature screens (a diagnostics banner, an error toast). Threading an
 * `open` prop through every layer would couple all of them to the root layout, so the bridge is a
 * window CustomEvent instead: any host code calls `openAiChat(...)`, the mounted widget listens.
 */
export const AI_CHAT_OPEN_EVENT = "mediact-ai-chat:open";

export interface AiChatOpenDetail {
  /** Sent as the user's turn once the session is ready. Omit to just open the drawer. */
  message?: string;
  /** Switch the conversation to this mode before sending (e.g. `schedule` for roster work). */
  mode?: ChatMode;
}

/**
 * Open the chat drawer — and, with `message`, send it as the user once the session connects.
 * Returns false when no widget is mounted to receive it, so callers can fall back to their own hint
 * instead of silently doing nothing.
 */
export function openAiChat(detail: AiChatOpenDetail = {}): boolean {
  if (typeof window === "undefined") return false;
  const event = new CustomEvent<AiChatOpenDetail>(AI_CHAT_OPEN_EVENT, {
    detail,
    cancelable: true,
  });
  window.dispatchEvent(event);
  // The widget acks by cancelling — an uncancelled event means nobody was listening.
  return event.defaultPrevented;
}
