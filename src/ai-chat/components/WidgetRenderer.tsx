import * as React from "react";
import { CircleAlert, TriangleAlert } from "lucide-react";
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
}

export function WidgetRenderer({ widget, onAction, disabled, superseded, supersededNote }: WidgetRendererProps) {
  switch (widget.type) {
    case "confirm":
      return (
        <ConfirmCard
          payload={widget.payload as ConfirmWidget}
          onAction={onAction}
          disabled={disabled}
          superseded={superseded}
          supersededNote={supersededNote}
        />
      );
    case "error_card":
      return <ErrorCard payload={widget.payload as ErrorCardWidget} onAction={onAction} disabled={disabled} />;
    case "staff_picker":
      return <StaffPicker payload={widget.payload as StaffPickerWidget} onAction={onAction} disabled={disabled} />;
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

function ActionButton({
  children,
  onClick,
  variant = "primary",
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-8 rounded-sm px-3 text-body-sm font-semibold transition-colors cursor-pointer",
        "disabled:pointer-events-none disabled:opacity-40",
        variant === "primary"
          ? "bg-brand text-brand-foreground hover:bg-brand-hover"
          : "border border-brand bg-white text-brand hover:bg-brand-subtle",
      )}
    >
      {children}
    </button>
  );
}

function ConfirmCard({
  payload,
  onAction,
  disabled,
  superseded,
  supersededNote,
}: {
  payload: ConfirmWidget;
  onAction: (reply: string) => void;
  disabled?: boolean;
  superseded?: boolean;
  supersededNote?: string;
}) {
  return (
    <Frame className={superseded ? "opacity-70" : undefined}>
      <p className="text-body-sm font-semibold text-black">{payload.title_th}</p>
      <p className="mt-1 whitespace-pre-wrap text-body-sm text-gray-600">{payload.summary_th}</p>
      {superseded ? (
        <p className="mt-2 text-caption text-text-tertiary" data-slot="ai-chat-superseded">
          {supersededNote}
        </p>
      ) : (
        <div className="mt-3 flex gap-2">
          <ActionButton onClick={() => onAction(payload.confirmLabel)} disabled={disabled}>
            {payload.confirmLabel}
          </ActionButton>
          <ActionButton
            variant="secondary"
            onClick={() => onAction(payload.cancelLabel)}
            disabled={disabled}
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
}: {
  payload: ErrorCardWidget;
  onAction: (reply: string) => void;
  disabled?: boolean;
}) {
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
          {payload.fixActions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {payload.fixActions.map((fix) => (
                <ActionButton
                  key={fix.opRef}
                  variant="secondary"
                  onClick={() => onAction(fix.label_th)}
                  disabled={disabled}
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
}: {
  payload: StaffPickerWidget;
  onAction: (reply: string) => void;
  disabled?: boolean;
}) {
  return (
    <Frame>
      <p className="text-body-sm text-gray-700">{payload.prompt_th}</p>
      <div className="mt-2 flex flex-col gap-1">
        {payload.candidates.map((candidate) => (
          <button
            key={candidate.userId}
            type="button"
            disabled={disabled}
            onClick={() => onAction(candidate.displayName)}
            className={cn(
              "flex items-baseline gap-2 rounded-sm border border-border-subtle px-2 py-1.5 text-left",
              "hover:bg-brand-subtle disabled:pointer-events-none disabled:opacity-40 cursor-pointer",
            )}
          >
            <span className="text-body-sm font-medium text-black">{candidate.displayName}</span>
            {candidate.subUnit && <span className="text-caption text-gray-500">{candidate.subUnit}</span>}
            {candidate.hint && <span className="text-caption text-gray-400">{candidate.hint}</span>}
          </button>
        ))}
      </div>
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
