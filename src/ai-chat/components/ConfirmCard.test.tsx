import { describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { WidgetRenderer } from "./WidgetRenderer";
import { MessageList } from "./MessageList";
import { defaultLabels } from "../labels";
import type { ConfirmWidget, WidgetEnvelope } from "../api/types";

/**
 * The confirm card is what replaced "พิมพ์ ยืนยัน เพื่อบันทึก" — a head nurse mid-shift should not have to
 * type an exact word into a chat box to save the change she just asked for.
 *
 * Wave 0 answers by SENDING the label as an ordinary turn, and that is the property worth pinning: every
 * guard behind it (same-turn commit, staleness, the anti-fabrication pair) is written against a normal user
 * message, so the button must not invent some other way to say yes.
 */
const card: WidgetEnvelope = {
  type: "confirm",
  payload: {
    title_th: "ตรวจสอบก่อนบันทึก",
    summary_th: "เปิดกฎชั่วโมงต่อเนื่อง — แผนก «ICU»",
    confirmLabel: "ยืนยัน",
    cancelLabel: "ยกเลิก",
    proposalId: "p-42",
    resumeToken: "p-42",
  } satisfies ConfirmWidget,
};

describe("WidgetRenderer — confirm", () => {
  it("shows the change and answers with the same words the user would have typed", () => {
    const onAction = vi.fn();
    render(<WidgetRenderer widget={card} onAction={onAction} />);

    expect(screen.getByText("เปิดกฎชั่วโมงต่อเนื่อง — แผนก «ICU»")).toBeTruthy();

    screen.getByRole("button", { name: "ยืนยัน" }).click();
    expect(onAction).toHaveBeenCalledWith("ยืนยัน");

    screen.getByRole("button", { name: "ยกเลิก" }).click();
    expect(onAction).toHaveBeenCalledWith("ยกเลิก");
  });

  it("goes dead while a turn is in flight — one confirm must not become two", () => {
    const onAction = vi.fn();
    render(<WidgetRenderer widget={card} onAction={onAction} disabled />);

    const confirm = screen.getByRole("button", { name: "ยืนยัน" }) as HTMLButtonElement;
    expect(confirm.disabled).toBe(true);
    confirm.click();
    expect(onAction).not.toHaveBeenCalled();
  });
});

/**
 * Found by running it: cancelling a change left its own card sitting above the "ยกเลิกแล้ว" reply with both
 * buttons still pressable, so Confirm could answer for a proposal that no longer existed. A card is live
 * only while it is the last thing that happened.
 */
describe("MessageList — only the newest card can be answered", () => {
  const turn = (id: string, content: string, withCard = false) => ({
    id,
    role: "assistant" as const,
    content,
    widgets: withCard ? [card] : undefined,
  });

  const pressable = (container: HTMLElement) =>
    Array.from(container.querySelectorAll<HTMLButtonElement>('[data-slot="ai-chat-widget"] button')).filter(
      (button) => !button.disabled,
    ).length;

  it("keeps the buttons live while the card is the last turn", () => {
    const { container } = render(
      <MessageList
        messages={[turn("m1", "เตรียมไว้แล้ว", true)]}
        labels={defaultLabels}
        busy={false}
        onWidgetAction={vi.fn()}
      />,
    );
    expect(pressable(container)).toBe(2);
  });

  it("un-presses a card once a reply has come after it", () => {
    const { container } = render(
      <MessageList
        messages={[turn("m1", "เตรียมไว้แล้ว", true), turn("m2", "ยกเลิกรายการที่เตรียมไว้แล้วค่ะ")]}
        labels={defaultLabels}
        busy={false}
        onWidgetAction={vi.fn()}
      />,
    );
    expect(pressable(container)).toBe(0);
    // …but the card is still THERE: the transcript must keep showing what was offered.
    expect(container.querySelectorAll('[data-slot="ai-chat-widget"]')).toHaveLength(1);
  });
});

describe("WidgetRenderer — superseded confirm", () => {
  it("keeps the summary but swaps the buttons for the replaced note", () => {
    const onAction = vi.fn();
    render(
      <WidgetRenderer
        widget={card}
        onAction={onAction}
        superseded
        supersededNote={defaultLabels.cardSuperseded}
      />,
    );

    // The record of what was asked stays readable…
    expect(screen.getByText("เปิดกฎชั่วโมงต่อเนื่อง — แผนก «ICU»")).toBeTruthy();
    expect(screen.getByText(defaultLabels.cardSuperseded)).toBeTruthy();
    // …but there is nothing left to press: the proposal behind it no longer exists.
    expect(screen.queryByRole("button", { name: "ยืนยัน" })).toBeNull();
    expect(screen.queryByRole("button", { name: "ยกเลิก" })).toBeNull();
  });

  it("within one turn only the LAST confirm card keeps its buttons (live 31 Aug: three staged cards, two corpses)", () => {
    const older: WidgetEnvelope = {
      type: "confirm",
      payload: { ...(card.payload as ConfirmWidget), proposalId: "p-41", resumeToken: "p-41" },
    };
    const onAction = vi.fn();
    render(
      <MessageList
        labels={defaultLabels}
        onWidgetAction={onAction}
        messages={[
          {
            id: "m1",
            role: "assistant",
            content: "จัดการให้แล้วค่ะ",
            widgets: [older, card],
          },
        ]}
      />,
    );

    // Exactly ONE pressable pair — the newest card's.
    expect(screen.getAllByRole("button", { name: "ยืนยัน" })).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: "ยกเลิก" })).toHaveLength(1);
    expect(screen.getByText(defaultLabels.cardSuperseded)).toBeTruthy();

    screen.getByRole("button", { name: "ยืนยัน" }).click();
    expect(onAction).toHaveBeenCalledWith("ยืนยัน");
  });
});

/**
 * 🔴 "กำลังทำให้อยู่" ต้องแยกออกจาก "กดไม่ได้"
 *
 * เดิมทั้งสองสถานะหน้าตาเหมือนกันเป๊ะ (จาง 40%) — ผู้ใช้กดยืนยันแล้วการ์ดจางลง แยกไม่ออกว่าระบบรับไปทำแล้ว
 * หรือปุ่มถูกล็อกเพราะเทิร์นอื่นค้างอยู่ · กติกาเดียวกับ `Button` ของ DS: `loading` คงป้ายไว้ ไม่จาง
 */
describe("WidgetRenderer — confirm ตอนกำลังทำงาน", () => {
  const renderCard = (disabled: boolean, onAction = vi.fn()) =>
    render(<WidgetRenderer widget={card} onAction={onAction} disabled={disabled} />);

  it("ปุ่มที่ถูกกดขึ้น aria-busy ส่วนปุ่มอีกข้างแค่ถูกล็อก", () => {
    const onAction = vi.fn();
    const view = renderCard(false, onAction);
    act(() => screen.getByRole("button", { name: /ยืนยัน/ }).click());
    view.rerender(<WidgetRenderer widget={card} onAction={onAction} disabled />);

    expect(screen.getByRole("button", { name: /ยืนยัน/ }).getAttribute("aria-busy")).toBe("true");
    expect(screen.getByRole("button", { name: "ยกเลิก" }).getAttribute("aria-busy")).toBeNull();
  });

  it("การ์ดที่ไม่ได้ถูกกด ไม่ขึ้นสถานะกำลังทำงาน แม้จะถูกล็อกพร้อมกัน", () => {
    renderCard(true);
    expect(screen.getByRole("button", { name: "ยืนยัน" }).getAttribute("aria-busy")).toBeNull();
    expect(screen.getByRole("button", { name: "ยกเลิก" }).getAttribute("aria-busy")).toBeNull();
  });

  it("รอบจบแล้วเลิกหมุน — ไม่ค้างเป็น spinner ถาวร", () => {
    const onAction = vi.fn();
    const view = renderCard(false, onAction);
    act(() => screen.getByRole("button", { name: /ยืนยัน/ }).click());
    view.rerender(<WidgetRenderer widget={card} onAction={onAction} disabled />);
    view.rerender(<WidgetRenderer widget={card} onAction={onAction} disabled={false} />);

    expect(screen.getByRole("button", { name: "ยืนยัน" }).getAttribute("aria-busy")).toBeNull();
  });

  /* 🔴 เคสที่ตัวเลือก `Boolean(disabled) && …` ตัวเดียวจับไม่ได้ — รอบใหม่ที่ผู้ใช้ไม่ได้กดการ์ดนี้
     ถ้าไม่ล้างความจำว่า "เคยกดปุ่มไหน" การ์ดเก่าจะขึ้น spinner ให้เทิร์นที่ไม่ใช่ของมัน */
  it("รอบถัดไปที่ผู้ใช้ไม่ได้กดการ์ดนี้ ต้องไม่กลับมาหมุนอีก", () => {
    const onAction = vi.fn();
    const view = renderCard(false, onAction);
    act(() => screen.getByRole("button", { name: /ยืนยัน/ }).click());
    view.rerender(<WidgetRenderer widget={card} onAction={onAction} disabled />);
    view.rerender(<WidgetRenderer widget={card} onAction={onAction} disabled={false} />);
    // ผู้ใช้พิมพ์คำถามใหม่เอง ไม่ได้แตะการ์ดนี้ → ล็อกทุกการ์ดอีกครั้ง
    view.rerender(<WidgetRenderer widget={card} onAction={onAction} disabled />);

    expect(screen.getByRole("button", { name: "ยืนยัน" }).getAttribute("aria-busy")).toBeNull();
  });

  it("ปุ่มที่กำลังทำงานยังอ่านป้ายเดิมได้ — ห้ามแทนที่ด้วย spinner เปล่า", () => {
    const onAction = vi.fn();
    const view = renderCard(false, onAction);
    act(() => screen.getByRole("button", { name: /ยืนยัน/ }).click());
    view.rerender(<WidgetRenderer widget={card} onAction={onAction} disabled />);

    expect(screen.getByRole("button", { name: /ยืนยัน/ }).textContent).toContain("ยืนยัน");
  });
});

/**
 * 🔴 ล็อกเพราะเทิร์นอื่น = **ไม่มีปุ่ม** ไม่ใช่ปุ่มจาง
 *
 * ปุ่มจางที่ไม่มีคำอธิบายตอบไม่ได้ว่า "รอแป๊บ" หรือ "อันนี้ตายแล้ว" ผู้ใช้จึงกดซ้ำเพื่อทดสอบ
 * — ซึ่งเป็นสิ่งเดียวที่การปิดปุ่มพยายามจะห้าม
 */
describe("WidgetRenderer — confirm ตอนถูกล็อกด้วยเทิร์นอื่น", () => {
  const waitingNote = defaultLabels.cardWaiting;

  it("ไม่มีปุ่มให้กดเลย และบอกว่าต้องรอ", () => {
    render(<WidgetRenderer widget={card} onAction={vi.fn()} disabled waitingNote={waitingNote} />);

    expect(screen.queryByRole("button", { name: "ยืนยัน" })).toBeNull();
    expect(screen.queryByRole("button", { name: "ยกเลิก" })).toBeNull();
    expect(screen.getByText(waitingNote)).toBeTruthy();
  });

  it("การ์ดที่ผู้ใช้กดเอง ปุ่มต้องยังอยู่ — ต้องเห็นว่าตัวเองกดอะไรไป", () => {
    const onAction = vi.fn();
    const view = render(
      <WidgetRenderer widget={card} onAction={onAction} waitingNote={waitingNote} />,
    );
    act(() => screen.getByRole("button", { name: /ยืนยัน/ }).click());
    view.rerender(
      <WidgetRenderer widget={card} onAction={onAction} disabled waitingNote={waitingNote} />,
    );

    expect(screen.getByRole("button", { name: /ยืนยัน/ }).getAttribute("aria-busy")).toBe("true");
    expect(screen.queryByText(waitingNote)).toBeNull();
  });

  it("รอบจบแล้วปุ่มกลับมา", () => {
    const view = render(
      <WidgetRenderer widget={card} onAction={vi.fn()} disabled waitingNote={waitingNote} />,
    );
    view.rerender(<WidgetRenderer widget={card} onAction={vi.fn()} waitingNote={waitingNote} />);

    expect(screen.getByRole("button", { name: "ยืนยัน" })).toBeTruthy();
    expect(screen.queryByText(waitingNote)).toBeNull();
  });

  /* ถูกแทนที่แล้ว = จบถาวร · รอ = ชั่วคราว — สองอย่างนี้ต้องไม่โผล่พร้อมกัน ไม่งั้นการ์ดบอกทั้ง
     "รอสักครู่" และ "อันนี้ใช้ไม่ได้แล้ว" ในเวลาเดียวกัน */
  it("การ์ดที่ถูกแทนที่แล้ว ไม่ขึ้นข้อความรอ", () => {
    render(
      <WidgetRenderer
        widget={card}
        onAction={vi.fn()}
        disabled
        superseded
        supersededNote={defaultLabels.cardSuperseded}
        waitingNote={waitingNote}
      />,
    );

    expect(screen.getByText(defaultLabels.cardSuperseded)).toBeTruthy();
    expect(screen.queryByText(waitingNote)).toBeNull();
  });
});
