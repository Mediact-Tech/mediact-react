import * as React from "react";
import { Sparkles } from "lucide-react";
import type { AiChatLabels, ChatMessage } from "../types";
import { cn } from "../lib/cn";
import { MessageBubble } from "./MessageBubble";

export interface MessageListProps {
  messages: ChatMessage[];
  labels: AiChatLabels;
  onWidgetAction: (reply: string) => void;
  busy?: boolean;
  /** Example questions shown on the empty state — tapping one sends it. */
  suggestions?: string[];
}

export function MessageList({
  messages,
  labels,
  onWidgetAction,
  busy,
  suggestions,
}: MessageListProps) {
  const endRef = React.useRef<HTMLDivElement>(null);

  // Follow the stream. `messages` is replaced on every token, so this fires per delta —
  // cheap enough, and it keeps the newest text in view without a scroll-position heuristic.
  React.useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
        <Sparkles className="size-8 text-brand-active" />
        <p className="text-sm font-semibold text-black">{labels.emptyTitle}</p>
        <p className="text-xs text-gray-500">{labels.emptyHint}</p>

        {/* A blank box is the hardest prompt to answer — offer real starting questions. */}
        {suggestions && suggestions.length > 0 && (
          <div className="mt-4 flex w-full flex-col gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                disabled={busy}
                onClick={() => onWidgetAction(suggestion)}
                className={cn(
                  "rounded-lg border border-border-default bg-white px-3 py-2 text-left text-sm text-black",
                  "transition-colors hover:border-brand-active hover:bg-brand-subtle cursor-pointer",
                  "disabled:pointer-events-none disabled:opacity-40",
                )}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      data-slot="ai-chat-messages"
      className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
    >
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          labels={labels}
          onWidgetAction={onWidgetAction}
          busy={busy}
        />
      ))}
      <div ref={endRef} />
    </div>
  );
}
