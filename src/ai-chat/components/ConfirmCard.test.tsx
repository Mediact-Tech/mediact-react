import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { WidgetRenderer } from "./WidgetRenderer";
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
