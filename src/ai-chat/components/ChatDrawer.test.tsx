import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { ChatDrawer, type ChatDrawerProps } from "./ChatDrawer";
import { defaultLabels } from "../labels";
import type { ConversationListItem } from "../api/types";

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

/**
 * ประวัติ **แทนที่** บทสนทนา ไม่ได้แทรกทับ
 *
 * 🔴 ของเดิมเป็นรายการ `max-h-64` แทรกอยู่เหนือ transcript โดยที่ช่องพิมพ์ยังอยู่ข้างล่าง — ที่ 416px
 * เห็นได้ทีละ ~4 แถวและหัวข้อถูกตัดกลางคำ · เทสชุดนี้ล็อกว่า "แทนที่" ไม่ใช่ "ทับ" เพราะถ้าวันหนึ่ง
 * มีคนเปลี่ยนกลับเป็นแทรก จอจะยังดูใช้ได้ในสายตา แต่เหตุผลทั้งหมดของการเปลี่ยนหายไปเงียบ ๆ
 */
const conversations: ConversationListItem[] = [
  { id: "c1", title: "โอทีเกินเกณฑ์ วอร์ด 4", preview: "ใครทำโอทีเกิน 20 ชม.", createdAt: new Date().toISOString() },
  { id: "c2", title: "จัดเวรกันยายน", preview: "ช่วยจัดเวรเดือนกันยายน", createdAt: "2026-08-10T04:00:00.000Z" },
];

describe("ChatDrawer — ประวัติสลับทั้งแผง", () => {
  const openHistory = async (over: Partial<ChatDrawerProps> = {}) => {
    const view = render(
      <ChatDrawer {...props({ loadConversations: () => Promise.resolve(conversations), ...over })} />,
    );
    screen.getByRole("button", { name: defaultLabels.history }).click();
    await waitFor(() => expect(screen.getByText(conversations[0]!.title!)).toBeTruthy());
    return view;
  };

  it("ซ่อนช่องพิมพ์กับ transcript ตอนเปิดประวัติ — สลับ ไม่ใช่แทรกทับ", async () => {
    await openHistory();
    expect(screen.queryByRole("textbox", { name: defaultLabels.placeholder })).toBeNull();
    expect(screen.getByRole("searchbox", { name: defaultLabels.historySearch })).toBeTruthy();
  });

  it("มีทางกลับสองทาง และทั้งคู่คืนช่องพิมพ์ให้ โดยไม่ปิดแผงและไม่ล้างบทสนทนา", async () => {
    const onOpenChange = vi.fn();
    const onNewChat = vi.fn();
    await openHistory({ onOpenChange, onNewChat });

    screen.getByRole("button", { name: defaultLabels.historyBack }).click();
    await waitFor(() =>
      expect(screen.getByRole("textbox", { name: defaultLabels.placeholder })).toBeTruthy(),
    );

    screen.getByRole("button", { name: defaultLabels.history }).click();
    await waitFor(() => expect(screen.getByRole("button", { name: defaultLabels.historyClose })).toBeTruthy());
    screen.getByRole("button", { name: defaultLabels.historyClose }).click();
    await waitFor(() =>
      expect(screen.getByRole("textbox", { name: defaultLabels.placeholder })).toBeTruthy(),
    );

    expect(onOpenChange).not.toHaveBeenCalled();
    expect(onNewChat).not.toHaveBeenCalled();
  });

  it("ไม่วางปุ่มปิดประวัติกับปุ่มย่อแผงไว้ด้วยกัน — สองปุ่มที่หน้าตาเหมือน “ปิด” แต่ผลคนละเรื่อง", async () => {
    await openHistory();
    expect(screen.queryByRole("button", { name: defaultLabels.minimize })).toBeNull();
  });

  it("เลือกบทสนทนาแล้วกลับหน้าแชทพร้อมส่ง id ที่เลือก", async () => {
    const onPickConversation = vi.fn();
    await openHistory({ onPickConversation });

    screen.getByText(conversations[1]!.title!).click();
    expect(onPickConversation).toHaveBeenCalledWith("c2");
    await waitFor(() =>
      expect(screen.getByRole("textbox", { name: defaultLabels.placeholder })).toBeTruthy(),
    );
  });
});
