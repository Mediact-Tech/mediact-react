import * as React from "react";
import { CircleCheck, CircleSlash } from "lucide-react";
import type { AiChatLabels, ChatMessage } from "../types";
import { cn } from "../lib/cn";
import { Markdown } from "./Markdown";
import { ToolTrail } from "./ToolTrail";
import { WidgetRenderer } from "./WidgetRenderer";

export interface MessageBubbleProps {
  message: ChatMessage;
  labels: AiChatLabels;
  onWidgetAction: (reply: string) => void;
  /**
   * Are this turn's widget buttons unanswerable? True while a turn is in flight, and for every card that is
   * no longer the last thing that happened — a card whose change has been confirmed or cancelled still shows
   * what it was, but pressing it would answer for a proposal that is gone.
   */
  widgetsDisabled?: boolean;
}

export function MessageBubble({ message, labels, onWidgetAction, widgetsDisabled }: MessageBubbleProps) {
  // `system` rows are the scheduling-span boundary markers the transcript replays — a divider, not a turn.
  if (message.role === "system") {
    return (
      <div className="my-2 flex items-center gap-2" data-slot="ai-chat-divider">
        <span className="h-px flex-1 bg-border-subtle" />
        <span className="text-[11px] text-text-tertiary">{message.content}</span>
        <span className="h-px flex-1 bg-border-subtle" />
      </div>
    );
  }

  const isUser = message.role === "user";
  // One pending proposal per conversation: each staging supersedes the previous, so within a turn only
  // the LAST confirm card is still answerable — live (31 Aug) three identical pressable cards stacked.
  const lastConfirm = lastConfirmIndex(message.widgets ?? []);

  return (
    <div
      data-slot="ai-chat-message"
      data-role={message.role}
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      {/* 🔴 ความกว้างไม่เท่ากันสองฝั่ง **โดยตั้งใจ** — คนถามสั้น ผู้ช่วยตอบยาว
        * ลิ้นชักกว้าง 26rem หัก padding เหลือ 384px · ของเดิมจำกัด 85% ทั้งคู่ ⇒ คำตอบเหลือ 354px
        * ทั้งที่เนื้อหาคือมาร์กดาวน์ ตาราง และการ์ดวิดเจ็ต · แบ่งเท่ากันเป็นความสมมาตรที่ไม่มีใครได้ประโยชน์ */}
      <div className={cn(isUser ? "flex max-w-[85%] flex-col items-end" : "w-full min-w-0")}>
        {/* ป้ายผู้พูด — สีกับด้านที่ชิดอย่างเดียวบอกไม่ได้ว่าใครพูด สำหรับคนที่แยกสีไม่ออก
          * หรืออ่านผ่านโปรแกรมอ่านหน้าจอ (คู่มือ chat UI ทุกเล่มลงตรงกันข้อนี้) */}
        <span
          className={cn(
            "mb-1 block text-[11px] font-semibold tracking-wide",
            isUser ? "text-text-tertiary" : "text-brand-hover",
          )}
        >
          {isUser ? labels.you : labels.assistant}
        </span>

        {!isUser && message.tools && <ToolTrail tools={message.tools} />}

        {(message.content || !isUser) && (
          <div
            className={cn(
              "text-body-sm break-words",
              isUser
                ? /* 🔴 `text-brand-foreground` ⛔ **ห้ามฮาร์ดโค้ดสีตายตัว** — พื้นเป็นสีแบรนด์ซึ่ง
                   * ต่างกัน 4 แอป และไม่มีสีตัวอักษรสีไหนถูกทั้งสี่ (วัดแล้ว):
                   *
                   *   Mediwork  #26d1b3   ขาว 1.93 ❌   เข้ม 8.77 ✅
                   *   Medimatch #0395d8   ขาว 3.34 ❌   เข้ม 5.09 ✅
                   *   Portal    #43596e   ขาว 7.26 ✅   เข้ม 2.42 ❌
                   *   MediHR    #0611ac   ขาว 12.47 ✅  เข้ม 1.41 ❌
                   *
                   * เคยฮาร์ดโค้ด `text-text-black` ไว้เพราะแก้เคสมิ้นต์ — ซึ่งทำให้ฟองบน MediHR
                   * ได้ **1.41:1** อ่านแทบไม่ออก · ตอนนี้แต่ละธีมตั้ง `--color-brand-foreground`
                   * ของตัวเองแล้ว ⇒ ที่นี่อ่าน token อย่างเดียว
                   *
                   * มุมล่างฝั่งที่ชิดขอบเหลือ 4 ⇒ ฟองชี้กลับไปหาคนพูด อ่านออกแม้เป็นขาวดำ */
                  "whitespace-pre-wrap rounded-xl rounded-br-sm bg-brand px-3.5 py-2.5 text-brand-foreground"
                : message.failed
                  ? "rounded-xl rounded-bl-sm border border-error-red-100 bg-error-red-50 px-3.5 py-2.5 text-error-red-800"
                  : /* ผู้ช่วยไม่มีกล่อง — พูดบนพื้นแผงตรง ๆ · ของเดิมเป็นการ์ดขาวมีขอบ `#0000000f`
                     * วางบนพื้น `#fbfbfd` ซึ่งเป็นขาวบนเกือบขาว: ขอบเขตอ่านไม่ออก แต่กินที่ทั้งสองข้าง */
                    "text-text-black",
            )}
          >
            {/* The user's own text is shown verbatim; only the assistant speaks markdown. */}
            {isUser ? (
              message.content
            ) : message.content ? (
              <Markdown text={message.content} labels={labels} />
            ) : message.streaming ? (
              <TypingDots label={labels.thinking} />
            ) : null}
          </div>
        )}

        {message.widgets?.map((widget, index) => (
          <WidgetRenderer
            key={`${widget.type}-${index}`}
            widget={widget}
            onAction={onWidgetAction}
            disabled={widgetsDisabled}
            superseded={widget.type === "confirm" && index !== lastConfirm}
            supersededNote={labels.cardSuperseded}
            waitingNote={labels.cardWaiting}
          />
        ))}

        {message.outcome && <OutcomeBadge outcome={message.outcome} labels={labels} />}
      </div>
    </div>
  );
}

/**
 * The write-outcome badge reads `done.committed` — data, not prose. A model can phrase a failed
 * save as a success; the flag cannot, and it works in any language.
 *
 * Absent flag = this turn never touched the write handshake, so there is nothing to report: a question
 * that was only ever a question must not be labelled "not saved". The service omits the flag in exactly
 * that case, which is why the check below is `undefined`, not falsy.
 */
function OutcomeBadge({
  outcome,
  labels,
}: {
  outcome: NonNullable<ChatMessage["outcome"]>;
  labels: AiChatLabels;
}) {
  if (outcome.committed === undefined) return null;

  return (
    <span
      className={cn(
        "mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        outcome.committed
          ? "bg-success-green-background-50 text-success-green-800"
          : "bg-overlay-hover text-text-body",
      )}
    >
      {outcome.committed ? <CircleCheck className="size-3" /> : <CircleSlash className="size-3" />}
      {outcome.committed ? labels.committed : labels.notCommitted}
    </span>
  );
}

function TypingDots({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-1 text-text-tertiary" aria-label={label}>
      <Dot delay="0ms" />
      <Dot delay="150ms" />
      <Dot delay="300ms" />
    </span>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="inline-block size-1.5 animate-bounce rounded-full bg-current"
      style={{ animationDelay: delay }}
    />
  );
}

/** Index of the last confirm widget in the turn — the only one whose proposal still exists. */
function lastConfirmIndex(widgets: NonNullable<ChatMessage["widgets"]>): number {
  for (let index = widgets.length - 1; index >= 0; index -= 1) {
    if (widgets[index]?.type === "confirm") return index;
  }
  return -1;
}
