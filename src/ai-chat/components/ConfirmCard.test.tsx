import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
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
