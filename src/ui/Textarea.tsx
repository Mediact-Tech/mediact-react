import * as React from "react";
import { cn } from "../lib/cn";
import {
  FloatingFieldShell,
  FieldSkeleton,
  type FieldSize,
} from "../form/FloatingFieldShell";

export type TextareaProps = React.ComponentProps<"textarea"> & {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  /**
   * บอกว่า "ช่องนี้ผิด" โดยไม่ต้องมีข้อความ — แอปที่เก็บ `hasError:boolean` กับ
   * `errorMessage?:string` เป็นคนละตัวจะได้ไม่ต้องปลอมข้อความว่างเพื่อให้กรอบแดง
   * ไม่ส่งมา = คิดจาก `error` เหมือนเดิม
   */
  invalid?: boolean;
  /**
   * จองที่หนึ่งบรรทัดใต้ช่องไว้เสมอ กันเลย์เอาต์กระตุกตอนข้อความผิดโผล่/หาย
   * ค่าตั้งต้นของ shell คือ `true` — ส่ง `false` เมื่อฟอร์มเดิมคิดความสูงบนสมมติฐานว่า
   * "ไม่มีข้อความ = ไม่กินที่" (ฟอร์มของทั้ง 3 แอปวันนี้เป็นแบบนั้น)
   */
  reserveMessageSpace?: boolean;
  required?: boolean;
  hideLabel?: boolean;
  alwaysFloatLabel?: boolean;
  size?: FieldSize;
  /** Show character count in the hint slot (requires `maxLength`). */
  showCount?: boolean;
  containerClassName?: string;
  /** ข้อความยังมาไม่ถึง — แทนช่องด้วยโครงร่างที่สูงเท่ากันทุกประการ */
  isLoading?: boolean;
};

const minHeights: Record<FieldSize, string> = {
  sm: "min-h-[72px]",
  md: "min-h-[88px]",
  lg: "min-h-[104px]",
};

/**
 * รูปทรงของช่องข้อความยาว — แยกออกมาเพราะ **โครงร่างตอนโหลดต้องใช้ตัวเดียวกัน**
 * ถ้าปล่อยไว้ inline โครงร่างจะต้องเดาความสูงเอง แล้ววันที่ใครแก้ `minHeights`
 * โครงร่างจะเพี้ยนเงียบ ๆ (`Input` ใช้ `fieldShapeClasses` ด้วยเหตุผลเดียวกัน)
 */
export function textareaShapeClasses({
  hasError,
  size,
}: {
  hasError: boolean;
  size: FieldSize;
}) {
  return [
    /* 🔴 `block` จำเป็น ไม่ใช่ของประดับ — `<textarea>` เป็น `inline-block` นั่งบน
     * เส้นฐานโดยปริยาย กล่องแม่จึงได้ที่ว่างใต้เส้นฐานเพิ่ม **7px** (วัดแล้ว
     * กล่องแม่ 95px ทั้งที่ตัว textarea เอง 88px) = ที่ว่างเปล่าที่ไม่มีใครขอ
     * และทำให้โครงร่างตอนโหลด (ซึ่งเป็น <div> block) เตี้ยกว่าของจริง 7px */
    "block w-full rounded-sm border bg-bg-default px-3 py-2.5 text-body-sm font-medium transition-colors resize-y",
    "focus:outline-none focus:ring-1",
    /* พื้นตอนปิดใช้งานต้องเป็นค่าเดียวกับ `fieldShapeClasses` — เหตุผลอยู่ที่นั่น
     * (ของเดิม `bg-bg-subtle` เกือบขาว ⇒ ช่องที่แก้ไม่ได้ดูเหมือนช่องที่แก้ได้) */
    "disabled:cursor-not-allowed disabled:bg-bg-surface",
    minHeights[size],
    hasError
      ? "border-cherry-red-600 focus:border-cherry-red-600 focus:ring-cherry-red-600/40"
      : "border-border-strong focus:border-brand focus:ring-brand/30",
  ].join(" ");
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      id,
      className,
      containerClassName,
      label,
      hint,
      error,
    invalid,
    reserveMessageSpace,
      required,
      hideLabel,
      alwaysFloatLabel,
      size = "md",
      showCount,
      maxLength,
      value,
      defaultValue,
      placeholder,
      onFocus,
      onBlur,
      onChange,
      disabled,
      isLoading,
      ...props
    },
    ref,
  ) {
    const reactId = React.useId();
    const inputId = id ?? reactId;
    const [focused, setFocused] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");

    const hasError = invalid ?? Boolean(error);
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    const hasValue = currentValue != null && String(currentValue).length > 0;
    const floating =
      Boolean(alwaysFloatLabel) || focused || hasValue || Boolean(placeholder);

    const length = currentValue == null ? 0 : String(currentValue).length;
    const counter =
      showCount && maxLength != null ? `${length} / ${maxLength}` : null;
    const hintWithCounter = counter ? (
      <span className="flex justify-between gap-2">
        <span>{hint}</span>
        <span>{counter}</span>
      </span>
    ) : (
      hint
    );

    /* โครงร่างใช้ shell + รูปทรงตัวเดียวกับของจริง ⇒ สูงเท่ากันโดยโครงสร้าง */
    if (isLoading) {
      return (
        <FieldSkeleton
          label={label}
          hint={hintWithCounter}
          required={required}
          hideLabel={hideLabel}
          size={size}
          multiline
          shape={textareaShapeClasses({ hasError: false, size })}
          containerClassName={containerClassName}
        />
      );
    }

    return (
      <FloatingFieldShell
        disabled={disabled}
        label={label}
        hint={hintWithCounter}
        error={error}
      reserveMessageSpace={reserveMessageSpace}
        required={required}
        hideLabel={hideLabel}
        htmlFor={inputId}
        size={size}
        floating={floating}
        focused={focused}
        hasError={hasError}
        containerClassName={containerClassName}
        multiline
      >
        <textarea
          ref={ref}
          id={inputId}
          value={isControlled ? value : internalValue}
          maxLength={maxLength}
          disabled={disabled}
          placeholder={floating ? placeholder : undefined}
          aria-invalid={hasError || undefined}
          aria-required={required || undefined}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          onChange={(e) => {
            if (!isControlled) setInternalValue(e.target.value);
            onChange?.(e);
          }}
          className={cn(textareaShapeClasses({ hasError, size }), className)}
          {...props}
        />
      </FloatingFieldShell>
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
