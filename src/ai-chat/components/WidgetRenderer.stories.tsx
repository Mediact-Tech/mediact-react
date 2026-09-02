import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { WidgetRenderer } from "./WidgetRenderer";
import type { ConfirmWidget, WidgetEnvelope } from "../api/types";

/**
 * The cards the agent sends mid-conversation. The one that matters here is `confirm` — the proposal card
 * a head nurse presses to commit a change.
 *
 * 🔴 `Working` is the state this file exists for: "we are doing what you asked" used to render exactly
 * like "you may not press this" (both 40% grey), so after pressing ยืนยัน there was no way to tell the
 * system had taken the request. Compare `Working` against `LockedByAnotherTurn` side by side.
 */
const meta = {
  title: "AI Chat/Proposal card",
  component: WidgetRenderer,
  parameters: { layout: "padded" },
} satisfies Meta<typeof WidgetRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

const card: WidgetEnvelope = {
  type: "confirm",
  payload: {
    title_th: "ตรวจสอบก่อนบันทึก",
    summary_th: "เปิดกฎชั่วโมงต่อเนื่อง — แผนก «ICU»\nมีผลกับเวรของเดือน ก.ย. 2569",
    confirmLabel: "ยืนยัน",
    cancelLabel: "ยกเลิก",
    proposalId: "p-42",
    resumeToken: "p-42",
  } satisfies ConfirmWidget,
};

export const Idle: Story = {
  args: { widget: card, onAction: () => {} },
};

/**
 * Locked because some other turn is in flight and this card was never pressed: the buttons are GONE and a
 * spinner says to wait. Dimmed buttons used to sit here saying nothing about which of the two it meant.
 */
export const LockedByAnotherTurn: Story = {
  args: {
    widget: card,
    onAction: () => {},
    disabled: true,
    waitingNote: "รอให้รายการก่อนหน้าเสร็จก่อน…",
  },
};

/**
 * The user pressed ยืนยัน and the run is going. Press it in the story: the button keeps its label at full
 * opacity with a spinner, its sibling dims — the difference that did not exist before.
 */
export const Working: Story = {
  args: { widget: card, onAction: () => {} },
  render: () => {
    const [busy, setBusy] = React.useState(false);
    return (
      <WidgetRenderer
        widget={card}
        disabled={busy}
        waitingNote="รอให้รายการก่อนหน้าเสร็จก่อน…"
        onAction={() => {
          setBusy(true);
          setTimeout(() => setBusy(false), 4000);
        }}
      />
    );
  },
};

/** A newer proposal replaced this one — buttons give way to a note, no spinner is possible. */
export const Superseded: Story = {
  args: {
    widget: card,
    onAction: () => {},
    superseded: true,
    supersededNote: "รายการนี้ถูกแทนที่ด้วยรายการใหม่กว่าแล้ว",
  },
};
