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
      className="flex items-end gap-2 border-t border-border-subtle bg-bg-default px-3.5 py-3"
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
          /* แคปซูล ไม่ใช่สี่เหลี่ยม — ช่องพิมพ์เป็นของชิ้นเดียวในแผงที่รับคำสั่งอิสระ ทรงต่างจากการ์ด
           * และตารางรอบตัวจึงหาเจอเร็วกว่า · `rounded-3xl` แทน `rounded-full` เพราะช่องนี้ยืดได้ถึง 40
           * เมื่อพิมพ์หลายบรรทัด — วงกลมเต็มจะบวมเป็นแคปซูลสูงที่มุมโค้งกินตัวหนังสือ
           * พื้น `bg-bg-subtle` แทนขาว: แถบล่างเป็นพื้นขาวอยู่แล้ว ช่องขาวบนขาวต้องพึ่งเส้นขอบอย่างเดียว */
          "max-h-40 min-h-9 flex-1 resize-none rounded-3xl border border-border-default bg-bg-subtle px-4 py-2 text-body-sm",
          "outline-none placeholder:text-text-tertiary",
          "focus-visible:border-brand-active focus-visible:bg-bg-default focus-visible:ring-1 focus-visible:ring-brand-active",
          "disabled:bg-bg-subtle disabled:text-text-tertiary",
        )}
      />
      <button
        type="button"
        onClick={busy ? onCancel : submit}
        disabled={disabled || (!busy && !value.trim())}
        aria-label={busy ? labels.cancel : labels.send}
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full transition-colors cursor-pointer",
          "disabled:pointer-events-none disabled:opacity-40",
          busy
            ? "bg-overlay-hover text-text-body hover:bg-overlay-press"
            : /* ไอคอนดำหมึกบนมิ้นต์ ไม่ใช่ขาว — เหตุผลเดียวกับฟองของผู้ใช้ (ขาวบนมิ้นต์ = 1.93:1)
               * ไอคอนไม่ใช่ข้อความก็จริง แต่เกณฑ์ 3:1 ของ non-text ก็ยังไม่ผ่านอยู่ดี
               * hover เป็น `brand-hover` ซึ่งเข้มพอให้กลับไปใช้ตัวขาวได้ */
              "bg-brand text-text-black hover:bg-brand-hover hover:text-brand-foreground",
        )}
      >
        {busy ? <Square className="size-4 fill-current" /> : <Send className="size-4" />}
      </button>
    </div>
  );
}
