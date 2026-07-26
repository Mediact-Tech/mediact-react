import * as React from "react";
import type { ContextUsage } from "../api/types";
import type { AiChatLabels } from "../types";
import { cn } from "../lib/cn";

/**
 * How full this conversation's memory is.
 *
 * The line it draws is not the model's context window — it is the point where ai-service starts dropping
 * the conversation's OLDEST turns to make room. Crossing it is something users feel and cannot explain
 * ("why did it forget the department I told it at the start?"), so the meter exists to make it visible
 * beforehand, and to say plainly when it has already happened.
 *
 * Renders nothing until the service reports a measurement — an invented number here would be worse than
 * no number, because the whole point is to be trusted about when memory is lost.
 */

/** Past this share of the budget the next few turns are likely to start pushing history out. */
const WARN_AT = 0.8;

export interface ContextMeterProps {
  usage: ContextUsage | null;
  labels: AiChatLabels;
  className?: string;
}

export function ContextMeter({ usage, labels, className }: ContextMeterProps) {
  if (!usage || usage.limit <= 0) return null;

  const ratio = usage.used / usage.limit;
  const percent = Math.round(ratio * 100);
  const state = usage.trimmed || ratio >= 1 ? "over" : ratio >= WARN_AT ? "warn" : "ok";
  const tooltip = [
    fill(labels.contextTooltip, { used: format(usage.used), limit: format(usage.limit) }),
    usage.trimmed ? labels.contextTrimmed : null,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <div
      data-slot="ai-chat-context-meter"
      title={tooltip}
      aria-label={tooltip}
      className={cn("flex shrink-0 items-center gap-1.5", className)}
    >
      <div className="h-1 w-10 overflow-hidden rounded-full bg-gray-200">
        <div
          // Clamped so an over-budget conversation still reads as "full" rather than overflowing its track;
          // the true figure stays in the tooltip and in the percentage beside it.
          style={{ width: `${Math.min(100, Math.max(2, percent))}%` }}
          className={cn(
            "h-full rounded-full transition-[width] duration-500",
            state === "over" ? "bg-error-red-600" : state === "warn" ? "bg-warning-yellow-400" : "bg-brand-active",
          )}
        />
      </div>
      <span
        className={cn(
          "text-[11px] tabular-nums",
          state === "over" ? "text-error-red-600" : state === "warn" ? "text-warning-yellow-800" : "text-gray-500",
        )}
      >
        {percent}%
      </span>
    </div>
  );
}

/** 12400 → "12,400" — a token count is only readable grouped. */
function format(value: number): string {
  return value.toLocaleString("en-US");
}

function fill(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce(
    (text, [name, value]) => text.split(`{${name}}`).join(value),
    template,
  );
}
