import * as React from "react";
import { Loader2, MessageSquare } from "lucide-react";
import type { ConversationListItem } from "../api/types";
import type { AiChatLabels } from "../types";
import { cn } from "../lib/cn";

export interface ConversationPickerProps {
  load: () => Promise<ConversationListItem[]>;
  onPick: (conversationId: string) => void;
  activeId: string | null;
  labels: AiChatLabels;
}

/** "3 นาทีที่แล้ว" reads faster than a timestamp when picking which thread to resume. */
function relativeTime(iso: string): string {
  const date = new Date(iso);
  const seconds = (Date.now() - date.getTime()) / 1000;
  if (seconds < 60) return "เมื่อสักครู่";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} นาทีที่แล้ว`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} ชม.ที่แล้ว`;
  return date.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Resume picker — loads on open, so a closed drawer never costs a request. */
export function ConversationPicker({ load, onPick, activeId, labels }: ConversationPickerProps) {
  const [items, setItems] = React.useState<ConversationListItem[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    load()
      .then((result) => {
        if (!cancelled) setItems(result);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      });
    return () => {
      cancelled = true;
    };
  }, [load]);

  if (error) {
    return <p className="px-4 py-3 text-caption text-error-red-600">{error}</p>;
  }

  if (!items) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="size-4 animate-spin text-gray-400" />
      </div>
    );
  }

  if (items.length === 0) {
    return <p className="px-4 py-3 text-caption text-gray-500">{labels.emptyHint}</p>;
  }

  return (
    <ul data-slot="ai-chat-history" className="max-h-64 overflow-y-auto border-b border-border-subtle">
      {items.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => onPick(item.id)}
            className={cn(
              "flex w-full items-start gap-2 px-4 py-2.5 text-left transition-colors cursor-pointer",
              "hover:bg-brand-subtle",
              item.id === activeId && "bg-brand-subtle",
            )}
          >
            <MessageSquare className="mt-0.5 size-3.5 shrink-0 text-gray-400" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-body-sm text-black">
                {item.title || item.preview || "(ไม่มีชื่อ)"}
              </span>
              <span className="block text-[11px] text-gray-400">{relativeTime(item.createdAt)}</span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
