/** @doc ./toggle.md */
import * as React from "react";
import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "../lib/cn";
import { SkeletonBox } from "../feedback/Skeleton";
import {
  ToggleText,
  TOGGLE_GLYPH_STROKE,
  checkboxShapeClasses,
  toggleAlignClass,
  toggleGlyphClass,
  toggleLabelClasses,
  type ToggleSize,
} from "./toggle-parts";

export type CheckboxProps = Omit<
  React.ComponentProps<typeof RadixCheckbox.Root>,
  "asChild"
> & {
  /** ข้อความข้างกล่อง กดที่ข้อความก็ติ๊กได้ */
  label?: React.ReactNode;
  /** คำอธิบายใต้ป้ายกำกับ */
  description?: React.ReactNode;
  /** ข้อความผิดพลาด — ใส่แล้วสลับไปสไตล์ error */
  error?: React.ReactNode;
  /** ขนาดตัวควบคุม `md` 20px (ค่าเริ่มต้น) · `sm` 16px สำหรับแถวตารางที่แน่น */
  size?: ToggleSize;
  /** ยังไม่มีข้อมูล — แสดงโครงร่างแทนทั้งแถว */
  isLoading?: boolean;
  /** className ของกล่องนอก */
  containerClassName?: string;
};

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  function Checkbox(
    {
      id,
      className,
      containerClassName,
      label,
      description,
      error,
      size = "md",
      isLoading,
      checked,
      disabled,
      ...props
    },
    ref,
  ) {
    const reactId = React.useId();
    const inputId = id ?? reactId;
    const hasError = Boolean(error);
    const isIndeterminate = checked === "indeterminate";
    const hasText = label != null || description != null;

    const box = (
      <RadixCheckbox.Root
        ref={ref}
        id={inputId}
        checked={checked}
        disabled={disabled}
        aria-invalid={hasError || undefined}
        className={cn(
          checkboxShapeClasses(size),
          hasText && toggleAlignClass(size),
          hasError && "border-cherry-red-600",
          className,
        )}
        {...props}
      >
        {/* 🔴 `Indicator` ของ Radix จะ render **ก็ต่อเมื่อ** state เป็น
         * checked หรือ indeterminate เท่านั้น
         * ⇒ สถานะ "เลือกบางส่วน" ต้องส่งผ่าน `checked="indeterminate"`
         * ห้ามทำเป็น prop แยกโดยที่ `checked` ยังเป็น false
         * (พิสูจน์แล้ว: ทำแบบนั้นได้ `data-state="unchecked"` · `aria-checked="false"`
         * และ **ไม่มี indicator ในหน้าเลย** — หัวตารางของ Portal · MediHR ·
         * Medimatch ตอนเลือกบางแถวจึงว่างเปล่าอยู่ทุกวันนี้) */}
        <RadixCheckbox.Indicator className="text-brand-foreground">
          {isIndeterminate ? (
            <Minus
              className={toggleGlyphClass(size)}
              strokeWidth={TOGGLE_GLYPH_STROKE}
            />
          ) : (
            <Check
              className={toggleGlyphClass(size)}
              strokeWidth={TOGGLE_GLYPH_STROKE}
            />
          )}
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
    );

    if (isLoading) {
      /* โครงร่างสวมทรงของ "ทั้งแถว" แล้วเก็บเนื้อหาจริงไว้ใน DOM แบบ invisible
       * ⇒ กว้างเท่าของจริงเป๊ะ ไม่ต้องเดาความกว้างของป้ายกำกับ
       * ไม่มีป้ายกำกับ ⇒ โครงร่างคือกล่องติ๊กเปล่า ๆ ขนาดเท่าเดิม */
      return hasText ? (
        <SkeletonBox
          shape="inline-flex items-start gap-2 rounded-xs text-body-sm"
          className={containerClassName}
        >
          <span
            className={cn(checkboxShapeClasses(size), toggleAlignClass(size))}
          />
          <ToggleText description={description}>{label}</ToggleText>
        </SkeletonBox>
      ) : (
        <SkeletonBox
          shape={checkboxShapeClasses(size)}
          className={containerClassName}
        />
      );
    }

    if (!hasText && error == null) return box;

    return (
      <div className={cn("flex flex-col gap-1", containerClassName)}>
        <label htmlFor={inputId} className={toggleLabelClasses(disabled)}>
          {box}
          <ToggleText description={description}>{label}</ToggleText>
        </label>
        {hasError && (
          <p role="alert" className="text-caption font-medium text-cherry-red-600">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
