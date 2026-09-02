import * as React from "react";
import { CircleAlert, Loader2, TriangleAlert } from "lucide-react";
import type {
  ConfirmWidget,
  ErrorCardWidget,
  ScheduleDiffWidget,
  StaffPickerWidget,
  SummaryStatsWidget,
  WidgetEnvelope,
} from "../api/types";
import { cn } from "../lib/cn";

/**
 * Renders the frozen §3 widget payloads. The service owns the shapes; how they look is ours.
 *
 * Interaction contract (Wave 0): a widget's buttons answer by SENDING A NORMAL TURN — the agent
 * loop reads the reply like any other user message. When the real producers land (F-A.2 confirm /
 * F-A.4 rule_form) and carry a resume op, swap `onAction` for that call — the payloads already
 * carry `resumeToken` / `opRef` for it.
 */
export interface WidgetRendererProps {
  widget: WidgetEnvelope;
  onAction: (reply: string) => void;
  disabled?: boolean;
  /**
   * A NEWER confirm card in the same turn replaced this one. The service holds one pending proposal per
   * conversation — every staging supersedes the previous one — so the buttons of an older card answer a
   * proposal that no longer exists. Seen live (31 Aug): one turn staged the same rule three times and all
   * three cards sat pressable; two of them were corpses. The summary stays as a record; the buttons give
   * way to `supersededNote`.
   */
  superseded?: boolean;
  /** The caption shown in place of the buttons when `superseded` (labels.cardSuperseded). */
  supersededNote?: string;
  /**
   * Shown in place of the buttons while ANOTHER turn is running and this card was never pressed
   * (labels.cardWaiting).
   *
   * 🔴 Dimmed buttons alone were unreadable: "the system is busy, wait" and "this card is dead" looked
   * identical, so the reflex is to press again to find out which. Removing the buttons and saying what is
   * happening answers the question the greying-out only raised.
   */
  waitingNote?: string;
}

export function WidgetRenderer({
  widget,
  onAction,
  disabled,
  superseded,
  supersededNote,
  waitingNote,
}: WidgetRendererProps) {
  switch (widget.type) {
    case "confirm":
      return (
        <ConfirmCard
          payload={widget.payload as ConfirmWidget}
          onAction={onAction}
          disabled={disabled}
          superseded={superseded}
          supersededNote={supersededNote}
          waitingNote={waitingNote}
        />
      );
    case "error_card":
      return (
        <ErrorCard
          payload={widget.payload as ErrorCardWidget}
          onAction={onAction}
          disabled={disabled}
          waitingNote={waitingNote}
        />
      );
    case "staff_picker":
      return (
        <StaffPicker
          payload={widget.payload as StaffPickerWidget}
          onAction={onAction}
          disabled={disabled}
          waitingNote={waitingNote}
        />
      );
    case "summary_stats":
      return <SummaryStats payload={widget.payload as SummaryStatsWidget} />;
    case "schedule_diff":
      return <ScheduleDiff payload={widget.payload as ScheduleDiffWidget} />;
    default:
      // rule_form / extraction_review have no producer yet — show that something arrived
      // rather than silently swallowing a turn's payload.
      return (
        <Frame>
          <p className="text-caption text-gray-500">ข้อมูลประกอบ ({widget.type})</p>
        </Frame>
      );
  }
}

function Frame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      data-slot="ai-chat-widget"
      className={cn("mt-2 rounded-md border border-border-default bg-white p-3", className)}
    >
      {children}
    </div>
  );
}

/**
 * 🔴 `loading` and `disabled` are different states on purpose (the same split `Button` makes).
 *
 * The card used to answer a press by going 40% grey — identical to the state it wears when some OTHER
 * turn is in flight and this card was never touched. Two opposite meanings, one appearance: "we are
 * working on what you asked" and "you may not press this". The button the user actually pressed now
 * keeps full opacity, keeps its label, and grows a spinner; only its siblings dim.
 */
function ActionButton({
  children,
  onClick,
  variant = "primary",
  disabled,
  loading,
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-sm px-3 text-body-sm font-semibold transition-colors cursor-pointer",
        "disabled:pointer-events-none disabled:opacity-40",
        /* ปุ่มที่กำลังทำงานต้อง **ไม่จาง** — จางแล้วอ่านว่า "กดไม่ได้" ซึ่งเป็นคนละเรื่องกับ "กำลังทำให้อยู่"
         * `disabled:opacity-100` ชนะกฎบนได้เพราะเป็น variant เดียวกันแต่มาทีหลัง */
        loading && "disabled:opacity-100 disabled:cursor-progress",
        variant === "primary"
          ? "bg-brand text-brand-foreground hover:bg-brand-hover"
          : "border border-brand bg-white text-brand hover:bg-brand-subtle",
      )}
    >
      {loading && <Loader2 aria-hidden className="size-3.5 animate-spin" />}
      {children}
    </button>
  );
}

/**
 * Which button on THIS card was pressed, until the run it started finishes.
 *
 * Local on purpose: `disabled` arrives as "a turn is in flight", which is true for every card on screen,
 * including ones from ten minutes ago. Only the card that was clicked may claim to be working — otherwise
 * the whole transcript sprouts spinners for one press.
 */
/** สปินเนอร์ + คำอธิบาย ที่ขึ้นแทนแถวปุ่มระหว่างรอเทิร์นอื่น */
function WaitingRow({ note }: { note: string }) {
  return (
    <p
      data-slot="ai-chat-widget-waiting"
      aria-live="polite"
      className="mt-3 flex items-center gap-1.5 text-caption text-text-body"
    >
      <Loader2 aria-hidden className="size-3.5 shrink-0 animate-spin" />
      {note}
    </p>
  );
}

function usePressed(disabled?: boolean) {
  const [pressed, setPressed] = React.useState<string | null>(null);
  // The run ended (or the card was re-enabled) — drop the claim, or a finished card keeps spinning.
  React.useEffect(() => {
    if (!disabled) setPressed(null);
  }, [disabled]);
  return [pressed, setPressed] as const;
}

function ConfirmCard({
  payload,
  onAction,
  disabled,
  superseded,
  supersededNote,
  waitingNote,
}: {
  payload: ConfirmWidget;
  onAction: (reply: string) => void;
  disabled?: boolean;
  superseded?: boolean;
  supersededNote?: string;
  waitingNote?: string;
}) {
  const [pressed, setPressed] = usePressed(disabled);
  /* ล็อกอยู่ และการ์ดใบนี้ไม่ใช่ต้นเหตุ ⇒ ไม่มีปุ่มให้กด มีแต่คำบอกว่าต้องรอ
     ⛔ ถ้าเป็นการ์ดที่ผู้ใช้เพิ่งกดเอง ปุ่มต้องอยู่ต่อ — คนต้องเห็นว่าตัวเองกดปุ่มไหนไป */
  const waiting = Boolean(disabled) && pressed === null && Boolean(waitingNote);
  const answer = (label: string) => {
    setPressed(label);
    onAction(label);
  };

  return (
    <Frame className={superseded ? "opacity-70" : undefined}>
      <p className="text-body-sm font-semibold text-black">{payload.title_th}</p>
      <p className="mt-1 whitespace-pre-wrap text-body-sm text-gray-600">{payload.summary_th}</p>
      {superseded ? (
        <p className="mt-2 text-caption text-text-tertiary" data-slot="ai-chat-superseded">
          {supersededNote}
        </p>
      ) : waiting ? (
        <WaitingRow note={waitingNote!} />
      ) : (
        <div className="mt-3 flex gap-2">
          <ActionButton
            onClick={() => answer(payload.confirmLabel)}
            disabled={disabled}
            loading={Boolean(disabled) && pressed === payload.confirmLabel}
          >
            {payload.confirmLabel}
          </ActionButton>
          <ActionButton
            variant="secondary"
            onClick={() => answer(payload.cancelLabel)}
            disabled={disabled}
            loading={Boolean(disabled) && pressed === payload.cancelLabel}
          >
            {payload.cancelLabel}
          </ActionButton>
        </div>
      )}
    </Frame>
  );
}

function ErrorCard({
  payload,
  onAction,
  disabled,
  waitingNote,
}: {
  payload: ErrorCardWidget;
  onAction: (reply: string) => void;
  disabled?: boolean;
  waitingNote?: string;
}) {
  const [pressed, setPressed] = usePressed(disabled);
  const waiting = Boolean(disabled) && pressed === null && Boolean(waitingNote);
  const isError = payload.severity === "error";
  return (
    <Frame
      className={
        isError
          ? "border-error-red-100 bg-error-red-50"
          : "border-warning-yellow-200 bg-warning-yellow-50"
      }
    >
      <div className="flex items-start gap-2">
        {isError ? (
          <CircleAlert className="mt-0.5 size-4 shrink-0 text-error-red-600" />
        ) : (
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning-normal" />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-body-sm font-semibold text-black">
            {payload.code} — {payload.message_th}
          </p>
          {payload.location && (
            <p className="mt-1 text-caption text-gray-600">
              {payload.location.date} · เวร {payload.location.shiftType}
            </p>
          )}
          {payload.fixActions.length > 0 && waiting && <WaitingRow note={waitingNote!} />}
          {payload.fixActions.length > 0 && !waiting && (
            <div className="mt-2 flex flex-wrap gap-2">
              {payload.fixActions.map((fix) => (
                <ActionButton
                  key={fix.opRef}
                  variant="secondary"
                  onClick={() => {
                    setPressed(fix.label_th);
                    onAction(fix.label_th);
                  }}
                  disabled={disabled}
                  loading={Boolean(disabled) && pressed === fix.label_th}
                >
                  {fix.label_th}
                </ActionButton>
              ))}
            </div>
          )}
        </div>
      </div>
    </Frame>
  );
}

function StaffPicker({
  payload,
  onAction,
  disabled,
  waitingNote,
}: {
  payload: StaffPickerWidget;
  onAction: (reply: string) => void;
  disabled?: boolean;
  waitingNote?: string;
}) {
  const [pressed, setPressed] = usePressed(disabled);
  const waiting = Boolean(disabled) && pressed === null && Boolean(waitingNote);
  return (
    <Frame>
      <p className="text-body-sm text-gray-700">{payload.prompt_th}</p>
      <div className="mt-2 flex flex-col gap-1">
        {payload.candidates.map((candidate) => {
          const busy = Boolean(disabled) && pressed === candidate.displayName;
          return (
          <button
            key={candidate.userId}
            type="button"
            disabled={disabled}
            aria-busy={busy || undefined}
            onClick={() => {
              setPressed(candidate.displayName);
              onAction(candidate.displayName);
            }}
            className={cn(
              "flex items-baseline gap-2 rounded-sm border border-border-subtle px-2 py-1.5 text-left",
              "hover:bg-brand-subtle disabled:pointer-events-none disabled:opacity-40 cursor-pointer",
              busy && "disabled:opacity-100 border-brand bg-brand-subtle",
            )}
          >
            {busy && <Loader2 aria-hidden className="size-3.5 shrink-0 animate-spin text-brand" />}
            <span className="text-body-sm font-medium text-black">{candidate.displayName}</span>
            {candidate.subUnit && <span className="text-caption text-gray-500">{candidate.subUnit}</span>}
            {candidate.hint && <span className="text-caption text-gray-400">{candidate.hint}</span>}
          </button>
          );
        })}
      </div>
      {/* รายชื่อคือ "เนื้อหา" ไม่ใช่ปุ่มล้วน — ซ่อนทิ้งแล้วผู้ใช้อ่านไม่ได้ว่ามีใครให้เลือกบ้าง
          ⇒ คงรายการไว้ (จางตามปกติ) แล้วเติมบรรทัดบอกว่าต้องรอ */}
      {waiting && <WaitingRow note={waitingNote!} />}
    </Frame>
  );
}

function SummaryStats({ payload }: { payload: SummaryStatsWidget }) {
  return (
    <Frame>
      <dl className="grid grid-cols-2 gap-2">
        {payload.stats.map((stat) => (
          <div key={stat.label_th} className="rounded-sm bg-gray-50 px-2 py-1.5">
            <dt className="text-caption text-gray-500">{stat.label_th}</dt>
            <dd
              className={cn(
                "text-body-sm font-semibold",
                stat.flag === "high" && "text-error-red-600",
                stat.flag === "low" && "text-warning-normal",
                !stat.flag && "text-black",
              )}
            >
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
      {payload.warnings_th.length > 0 && (
        <ul className="mt-2 flex flex-col gap-1">
          {payload.warnings_th.map((warning) => (
            <li key={warning} className="text-caption text-warning-normal">
              • {warning}
            </li>
          ))}
        </ul>
      )}
    </Frame>
  );
}

function ScheduleDiff({ payload }: { payload: ScheduleDiffWidget }) {
  return (
    <Frame className="overflow-x-auto">
      <p className="mb-2 text-caption text-gray-500">
        ตารางเวร #{payload.scheduleId} · เวอร์ชัน {payload.version} · {payload.changes.length} รายการ
      </p>
      <table className="w-full border-collapse text-body-sm">
        <tbody>
          {payload.changes.map((change, index) => (
            <tr key={`${change.date}-${change.userId}-${index}`} className="border-b border-border-subtle">
              <td className="py-1 pr-2 whitespace-nowrap text-gray-600">{change.date}</td>
              <td className="py-1 pr-2 text-gray-400 line-through">{change.before ?? "—"}</td>
              <td className="py-1 font-medium text-black">{change.after ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Frame>
  );
}
