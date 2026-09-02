import * as React from "react";
import { ArrowUp, Loader2, Mic, Square, Trash2 } from "lucide-react";
import type { AudioClip, TranscriptionResult } from "../api/types";
import type { AiChatLabels } from "../types";
import { useVoiceInput } from "../state/useVoiceInput";
import { VoiceWaveform } from "./VoiceWaveform";
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
  /**
   * Speech-to-text. Usually `session.api.transcribe`. Omitted (or unsupported browser) hides the mic
   * entirely — a control that can only fail is worse than no control.
   */
  onTranscribe?: (audio: AudioClip, signal?: AbortSignal) => Promise<TranscriptionResult>;
  /** Mirrors microphone/transcription failures to the host for logging. */
  onVoiceError?: (error: Error) => void;
  /**
   * Duration cap in seconds. Default **and maximum 120** (2 นาที) — a larger value is clamped by
   * `useVoiceInput`, and the label shows the clamped number, never the one that was asked for.
   */
  maxRecordingSeconds?: number;
}

export function Composer({
  onSend,
  onCancel,
  busy,
  disabled,
  labels,
  placeholder = labels.placeholder,
  onTranscribe,
  onVoiceError,
  maxRecordingSeconds = 120,
}: ComposerProps) {
  const [value, setValue] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  // Where the caret must land after a transcript is spliced in — applied post-render, because setting
  // selection on the value we are still about to render puts it at the wrong offset.
  const caretRef = React.useRef<number | null>(null);

  const submit = () => {
    const text = value.trim();
    if (!text || busy || disabled) return;
    onSend(text);
    setValue("");
    // Collapse the auto-grown box back to one row.
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  /**
   * Speech lands in the box, never in a turn.
   *
   * Thai transcription mangles domain words (measured: "worktree" → "เวิร์กทรี"), so the user has to see
   * and fix the text first. Auto-sending would put a mis-heard instruction in front of the assistant with
   * nobody having read it.
   */
  const insertTranscript = React.useCallback((text: string) => {
    const el = textareaRef.current;
    setValue((current) => {
      const start = el?.selectionStart ?? current.length;
      const end = el?.selectionEnd ?? current.length;
      const before = current.slice(0, start);
      const after = current.slice(end);
      // A space only where two words would otherwise collide — Thai has no inter-word space, so one
      // inserted mid-sentence is a visible defect, not a nicety.
      const lead = before && !/\s$/.test(before) ? " " : "";
      const next = `${before}${lead}${text}${after}`;
      caretRef.current = before.length + lead.length + text.length;
      return next;
    });
  }, []);

  const voice = useVoiceInput({
    transcribe: onTranscribe,
    onText: insertTranscript,
    onError: onVoiceError,
    maxSeconds: maxRecordingSeconds,
  });

  React.useLayoutEffect(() => {
    const caret = caretRef.current;
    const el = textareaRef.current;
    if (caret === null || !el) return;
    caretRef.current = null;
    el.focus();
    el.setSelectionRange(caret, caret);
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [value]);

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

  const recording = voice.status === "recording";
  const transcribing = voice.status === "transcribing";
  // Only a FAILURE gets a visible line. Recording has its own strip (waveform + clock); transcribing is
  // the spinner on the mic button, which says it already; a silent clip simply returns to idle — the
  // owner's call: a sentence for "nothing happened" is noise. Both still go to the live region below for
  // the user who cannot see the spinner or the strip.
  const voiceMessage =
    voice.error === "denied" ? labels.voiceDenied : voice.error === "failed" ? labels.voiceFailed : null;
  const spokenOnly = transcribing
    ? labels.voiceTranscribing
    : voice.notice === "silent"
      ? labels.voiceSilent
      : null;
  const voiceLimitText = labels.voiceLimit.replace("{seconds}", String(voice.limitSeconds));
  // The last ten seconds turn the clock red: the cap stops the recording by itself, and a user who is
  // mid-sentence when it does loses the end of what she said.
  const nearCap = recording && voice.limitSeconds - voice.seconds <= 10;

  return (
    <div
      data-slot="ai-chat-composer"
      className="border-t border-border-subtle bg-bg-default px-3.5 py-3"
    >
      {/* Recording strip: pulsing dot · clock · live waveform · the cap. The waveform is the point — a
          timer proves the clock runs, the bars prove the MICROPHONE does (a muted headset shows a
          counting timer and a flat strip). The words stay for screen readers only: `aria-live`, because
          nothing else tells that user recording started. */}
      {recording && (
        <div
          data-slot="ai-chat-voice-strip"
          className="mb-2 flex items-center gap-2.5 rounded-xl bg-bg-subtle px-3 py-1.5"
        >
          <span
            aria-hidden
            className="size-2 shrink-0 rounded-full bg-error-red-600 animate-pulse motion-reduce:animate-none"
          />
          <span
            aria-hidden
            title={voiceLimitText}
            className={cn(
              "shrink-0 text-caption tabular-nums",
              /* body = 6.99:1 บนพื้นขาว — เวลาที่กำลังเดินต้องอ่านออกจริง ไม่ใช่คำใบ้ประดับ (tertiary ตก 4.5) */
              nearCap ? "text-error-red-600" : "text-text-body",
            )}
          >
            {formatElapsed(voice.seconds)}
          </span>
          <VoiceWaveform stream={voice.stream} className="flex-1" />
          <span aria-hidden className="shrink-0 text-caption tabular-nums text-text-body">
            {formatElapsed(voice.limitSeconds)}
          </span>
          <span className="sr-only" aria-live="polite">
            {`${labels.voiceRecording} · ${formatElapsed(voice.seconds)} · ${voiceLimitText}`}
          </span>
        </div>
      )}

      {/* Visible only when the last attempt FAILED — the one moment a sentence earns its place. */}
      {voiceMessage && (
        <p aria-live="polite" className="mb-2 flex items-center gap-1.5 text-caption text-error-red-600">
          <span className="min-w-0 flex-1">{voiceMessage}</span>
        </p>
      )}
      {/* Heard, not seen: "turning speech into text" / "nothing was said" for screen readers. */}
      {spokenOnly && (
        <span className="sr-only" aria-live="polite">
          {spokenOnly}
        </span>
      )}

      {/* 🔴 กล่องเดียว ไม่ใช่ "ช่องพิมพ์ + ปุ่มข้าง ๆ"
       * ช่องพิมพ์กับปุ่มอยู่ในกรอบเดียวกัน ปุ่มควบคุมอยู่แถวล่างในกรอบ — ทรงเดียวกับผู้ช่วย AI ตัวอื่นที่ผู้ใช้เจอ
       * ทุกวัน · ได้ผลพลอยได้ที่สำคัญกว่าความคุ้นตา: ช่องพิมพ์ยืดได้เต็มความกว้างโดยปุ่มไม่ขยับ และปุ่มเพิ่ม
       * ทีหลัง (แนบไฟล์ · เลือกโหมด) มีที่ลงโดยไม่ต้องรื้อแถว */}
      <div
        data-slot="ai-chat-composer-box"
        className={cn(
          "rounded-2xl border border-border-default bg-bg-subtle px-3.5 pt-3 pb-2.5 transition-colors",
          "focus-within:border-brand-active focus-within:bg-bg-default focus-within:ring-1 focus-within:ring-brand-active",
        )}
      >
        <textarea
          ref={textareaRef}
          rows={2}
          value={value}
          onChange={autoGrow}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          aria-label={placeholder}
          className={cn(
            /* ไม่มีขอบ ไม่มีพื้นของตัวเอง — กรอบข้างนอกเป็นเจ้าของรูปทรง ถ้าช่องนี้มีขอบด้วยจะกลายเป็นกล่องซ้อนกล่อง
             * `field-sizing-content` ไม่ใช้: Safari ยังไม่รองรับ ⇒ ความสูงยังคุมด้วย scrollHeight ใน `autoGrow` */
            "block max-h-40 w-full resize-none border-0 bg-transparent p-0 text-body-sm",
            "outline-none placeholder:text-text-tertiary",
            "disabled:text-text-tertiary",
          )}
        />

        {/* แถวควบคุมล่าง: เครื่องมือชิดซ้าย · ส่งชิดขวา
         * ปุ่มส่งอยู่ **มุมขวาล่าง** ตำแหน่งเดิมเสมอ ไม่ว่าช่องพิมพ์จะสูงกี่บรรทัด */}
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-0.5">
            {voice.supported && (
              <button
                type="button"
                onClick={recording ? voice.stop : voice.start}
                disabled={disabled || transcribing}
                aria-label={recording ? labels.voiceStop : labels.voiceStart}
                title={recording ? labels.voiceStop : labels.voiceStart}
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors cursor-pointer",
                  "disabled:pointer-events-none disabled:opacity-40",
                  recording
                    ? "bg-error-red-50 text-error-red-600 hover:bg-error-red-100"
                    : /* ไอคอนของ control ที่กดได้ต้องได้ 3:1 ตามเกณฑ์ non-text — tertiary วัดได้ 2.78 */
                      "text-text-body hover:bg-overlay-hover hover:text-text-body",
                )}
              >
                {transcribing ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : recording ? (
                  <Square className="size-4 fill-current" />
                ) : (
                  <Mic className="size-4" />
                )}
              </button>
            )}

            {/* ปุ่มทิ้งอยู่ **หลัง** ปุ่มหยุด: ปุ่มที่ลบของต้องไม่อยู่ตรงที่นิ้ววางอยู่แล้วตอนจะกดหยุด */}
            {recording && (
              <button
                type="button"
                onClick={voice.discard}
                aria-label={labels.voiceDiscard}
                title={labels.voiceDiscard}
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors cursor-pointer",
                  "text-text-body hover:bg-overlay-hover hover:text-text-body",
                )}
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={busy ? onCancel : submit}
            disabled={disabled || (!busy && !value.trim())}
            aria-label={busy ? labels.cancel : labels.send}
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors cursor-pointer",
              "disabled:pointer-events-none disabled:opacity-40",
              busy
                ? "bg-overlay-hover text-text-body hover:bg-overlay-press"
                : /* ไอคอนดำหมึกบนมิ้นต์ ไม่ใช่ขาว — เหตุผลเดียวกับฟองของผู้ใช้ (ขาวบนมิ้นต์ = 1.93:1)
                   * ไอคอนไม่ใช่ข้อความก็จริง แต่เกณฑ์ 3:1 ของ non-text ก็ยังไม่ผ่านอยู่ดี
                   * hover เป็น `brand-hover` ซึ่งเข้มพอให้กลับไปใช้ตัวขาวได้ */
                  "bg-brand text-text-black hover:bg-brand-hover hover:text-brand-foreground",
            )}
          >
            {/* ลูกศรขึ้น ไม่ใช่เครื่องบินกระดาษ — ทิศทาง "ดันข้อความขึ้นไปในบทสนทนา" ตรงกับสิ่งที่เกิดบนจอ */}
            {busy ? <Square className="size-4 fill-current" /> : <ArrowUp className="size-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

/** 7 → `0:07`. Seconds-only would read as a count, not a clock, past a minute. */
function formatElapsed(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}
