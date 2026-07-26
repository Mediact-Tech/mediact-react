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
  busy?: boolean;
}

export function MessageBubble({ message, labels, onWidgetAction, busy }: MessageBubbleProps) {
  // `system` rows are the scheduling-span boundary markers the transcript replays — a divider, not a turn.
  if (message.role === "system") {
    return (
      <div className="my-2 flex items-center gap-2" data-slot="ai-chat-divider">
        <span className="h-px flex-1 bg-border-subtle" />
        <span className="text-[11px] text-gray-400">{message.content}</span>
        <span className="h-px flex-1 bg-border-subtle" />
      </div>
    );
  }

  const isUser = message.role === "user";

  return (
    <div
      data-slot="ai-chat-message"
      data-role={message.role}
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div className={cn("max-w-[85%]", isUser && "flex flex-col items-end")}>
        {!isUser && message.tools && <ToolTrail tools={message.tools} />}

        {(message.content || !isUser) && (
          <div
            className={cn(
              "rounded-lg px-3 py-2 text-sm break-words",
              isUser
                ? "bg-brand text-brand-foreground whitespace-pre-wrap"
                : message.failed
                  ? "border border-error-red-100 bg-error-red-50 text-error-red-800"
                  : "border border-border-subtle bg-white text-black",
            )}
          >
            {/* The user's own text is shown verbatim; only the assistant speaks markdown. */}
            {isUser ? (
              message.content
            ) : message.content ? (
              <Markdown text={message.content} />
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
            disabled={busy}
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
          : "bg-gray-100 text-gray-600",
      )}
    >
      {outcome.committed ? <CircleCheck className="size-3" /> : <CircleSlash className="size-3" />}
      {outcome.committed ? labels.committed : labels.notCommitted}
    </span>
  );
}

function TypingDots({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-1 text-gray-400" aria-label={label}>
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
