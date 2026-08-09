import * as React from "react";
import { Label } from "@radix-ui/react-label";
import { cn } from "../lib/cn";

export type FormFieldProps = {
  /** Field label rendered above the input. Omit for unlabeled fields. */
  label?: React.ReactNode;
  /** Helper text under the input. Hidden when `error` is set. */
  hint?: React.ReactNode;
  /** Error message — when truthy, switches the field to error styling. */
  error?: React.ReactNode;
  /** Marks the label with a red asterisk. Does NOT enforce HTML required (caller controls). */
  required?: boolean;
  /** id wired to the input via htmlFor — caller passes the same id to the input. */
  htmlFor?: string;
  /** Visually hide the label but keep it for screen readers. */
  hideLabel?: boolean;
  /**
   * Always reserve one line of height for the hint/error slot below the field, even when
   * neither is set — prevents layout shift when an error appears/disappears.
   *
   * ⚠️ Default is `true`, which matches what every real consumer app already does today
   * (spacer div or `helperText={error ?? ' '}` workarounds) — but it changes the rendered
   * height of every existing field using this shell that doesn't explicitly pass this prop.
   * Confirm this default with the team before relying on it in layouts that assumed the old
   * zero-height "no message" behavior.
   * @default true
   */
  reserveMessageSpace?: boolean;
  className?: string;
  children: React.ReactNode;
};

/**
 * Layout shell shared by every form primitive (Input, Textarea, Select, ...).
 * Renders: [Label] [children] [hint | error]
 */
export function FormField({
  label,
  hint,
  error,
  required,
  htmlFor,
  hideLabel,
  reserveMessageSpace = true,
  className,
  children,
}: FormFieldProps) {
  const showError = Boolean(error);
  const showHint = !showError && Boolean(hint);
  const showMessageSlot = showError || showHint || reserveMessageSpace;
  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      {label != null && (
        <Label
          htmlFor={htmlFor}
          className={cn(
            /* 🔴 `text-text-body` ไม่ใช่ `text-text-primary`
             * `--color-text-primary` ถูก alias ไปที่ `--color-brand` ใน `theme.css`
             * ⇒ ป้ายกำกับฟิลด์เปลี่ยนสีตามแบรนด์ของแอป วัดแล้ว: บน Mediwork
             * ออกมาเป็น `rgb(38,209,179)` เขียวมิ้นต์ **คอนทราสต์บนพื้นขาว 1.93:1**
             * ซึ่งอ่านแทบไม่ออก และคนอ่านว่าเป็นลิงก์
             * `FloatingFieldShell` ที่ Input/Select/Textarea ใช้ อยู่ที่ `text-text-body`
             * อยู่แล้ว — บรรทัดนี้จึงเป็นการทำให้ตรงกัน ไม่ใช่การเปลี่ยนดีไซน์ */
            "text-body-sm font-medium text-text-body",
            hideLabel && "sr-only",
          )}
        >
          {label}
          {required && <span className="ml-1 text-cherry-red-600">*</span>}
        </Label>
      )}
      {children}
      {showMessageSlot ? (
        <p
          role={showError ? "alert" : undefined}
          className={cn(
            "text-caption",
            showError ? "font-medium text-cherry-red-600" : "text-text-tertiary",
          )}
        >
          {showError ? error : showHint ? hint : " "}
        </p>
      ) : null}
    </div>
  );
}
