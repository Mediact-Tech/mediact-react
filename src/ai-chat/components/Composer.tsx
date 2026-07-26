import * as React from "react";
import { Send, Square } from "lucide-react";
import type { AiChatLabels } from "../types";
import { cn } from "../lib/cn";

export interface ComposerProps {
  onSend: (text: string) => void;
  onCancel: () => void;
  /** A run is in flight — the send button becomes stop. */
  busy: boolean;
  disabled?: boolean;
  labels: AiChatLabels;
  /** Overrides the default hint (scheduling mode accepts different input). */
  placeholder?: string;
}

export function Composer({
  onSend,
  onCancel,
  busy,
  disabled,
  labels,
  placeholder = labels.placeholder,
}: ComposerProps) {
  const [value, setValue] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const submit = () => {
    const text = value.trim();
    if (!text || busy || disabled) return;
    onSend(text);
    setValue("");
    // Collapse the auto-grown box back to one row.
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends; Shift+Enter is a newline. IME composition must never submit mid-word —
    // Thai/Japanese input would otherwise send a half-typed syllable.
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  };

  const autoGrow = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
    const el = event.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  return (
    <div
      data-slot="ai-chat-composer"
      className="flex items-end gap-2 border-t border-border-subtle bg-white px-3 py-3"
    >
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={autoGrow}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        aria-label={placeholder}
        className={cn(
          "max-h-40 min-h-9 flex-1 resize-none rounded-md border border-border-input px-3 py-2 text-sm",
          "outline-none placeholder:text-gray-400",
          "focus-visible:border-brand-active focus-visible:ring-1 focus-visible:ring-brand-active",
          "disabled:bg-gray-50 disabled:text-gray-400",
        )}
      />
      <button
        type="button"
        onClick={busy ? onCancel : submit}
        disabled={disabled || (!busy && !value.trim())}
        aria-label={busy ? labels.cancel : labels.send}
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-md transition-colors cursor-pointer",
          "disabled:pointer-events-none disabled:opacity-40",
          busy
            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
            : "bg-brand text-brand-foreground hover:bg-brand-hover",
        )}
      >
        {busy ? <Square className="size-4 fill-current" /> : <Send className="size-4" />}
      </button>
    </div>
  );
}
