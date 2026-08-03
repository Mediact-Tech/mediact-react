import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChatDrawer, type ChatDrawerProps } from "./ChatDrawer";
import { defaultLabels } from "../labels";

/**
 * The dismiss affordance, which is a correctness question rather than a styling one.
 *
 * Hiding the drawer KEEPS the thread — `start()` resumes the remembered conversation, so reopening lands
 * back in the same transcript. An ✕ in the top-right corner said the opposite: it is the universal "close
 * this / discard it" glyph, and users read it as ending the chat, then started over by hand and lost the
 * continuity the widget was preserving for them.
 */
const props = (over: Partial<ChatDrawerProps> = {}): ChatDrawerProps => ({
  open: true,
  onOpenChange: vi.fn(),
  messages: [],
  status: "ready",
  transportStatus: "connected",
  error: null,
  labels: defaultLabels,
  position: "bottom-right",
  onSend: vi.fn(),
  onCancel: vi.fn(),
  onNewChat: vi.fn(),
  onPickConversation: vi.fn(),
  onRetry: vi.fn(),
  loadConversations: () => Promise.resolve([]),
  activeConversationId: "c1",
  mode: "assistant",
  ...over,
});

describe("ChatDrawer — putting the panel away", () => {
  it("offers a collapse chevron, never an ✕", () => {
    const { container } = render(<ChatDrawer {...props()} />);
    expect(screen.getByRole("button", { name: defaultLabels.minimize })).toBeTruthy();
    expect(container.ownerDocument.querySelector(".lucide-chevrons-right")).toBeTruthy();
    expect(container.ownerDocument.querySelector(".lucide-x")).toBeNull();
  });

  it("points the chevron at the edge the drawer actually came from", () => {
    const { container } = render(<ChatDrawer {...props({ position: "bottom-left" })} />);
    expect(container.ownerDocument.querySelector(".lucide-chevrons-left")).toBeTruthy();
    expect(container.ownerDocument.querySelector(".lucide-chevrons-right")).toBeNull();
  });

  it("says in words that the conversation survives — the label is the other half of the fix", () => {
    expect(defaultLabels.minimize).toContain("ย่อ");
    expect(defaultLabels.minimize).not.toContain("ปิด");
  });

  it("still dismisses, and is kept distinct from starting a new chat", () => {
    const onOpenChange = vi.fn();
    const onNewChat = vi.fn();
    render(<ChatDrawer {...props({ onOpenChange, onNewChat })} />);

    screen.getByRole("button", { name: defaultLabels.minimize }).click();
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onNewChat).not.toHaveBeenCalled(); // hiding is not starting over — that is its own button
  });
});
