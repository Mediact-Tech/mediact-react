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
        <p className="text-body-sm font-semibold text-text-black">{labels.emptyTitle}</p>
        <p className="text-caption text-text-body">{labels.emptyHint}</p>

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
                  "rounded-lg border border-border-default bg-bg-default px-3 py-2 text-left text-body-sm text-text-black",
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
      /* ระยะระหว่างเทิร์น 14 (`gap-3.5`) ไม่ใช่ 12 — คำตอบของผู้ช่วยเลิกมีกล่องแล้ว (ดู `MessageBubble`)
         ⇒ ช่องไฟกลายเป็นสิ่งเดียวที่บอกว่าเทิร์นจบตรงไหน · แน่นกว่านี้แล้วบทสนทนาอ่านเป็นก้อนเดียว */
      className="flex flex-1 flex-col gap-3.5 overflow-y-auto px-4 py-4"
    >
      {messages.map((message, index) => (
        <MessageBubble
          key={message.id}
          message={message}
          labels={labels}
          onWidgetAction={onWidgetAction}
          // A card is answerable only while it is the LAST thing that happened. Seen live: cancelling a
          // change left its own card sitting above the "ยกเลิกแล้ว" reply with both buttons still pressable —
          // Confirm then answered a proposal that no longer existed. Anything after the card (the reply to
          // it, the next question) means it has been dealt with; the summary stays, the buttons do not.
          widgetsDisabled={busy || index !== messages.length - 1}
        />
      ))}
      <div ref={endRef} />
    </div>
  );
}
