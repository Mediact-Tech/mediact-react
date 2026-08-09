import * as React from "react";
import { cn } from "../lib/cn";
import { SkeletonBox } from "../feedback/Skeleton";

export type FieldSize = "sm" | "md" | "lg";

/**
 * id ของป้าย — ใช้กับ trigger ที่**ไม่ใช่ element ที่ label ผูกได้**
 *
 * 🔴 `<label htmlFor>` ผูกได้เฉพาะ element ที่ labellable ตามสเปก HTML
 * (`input` `select` `textarea` `button` …) — **`<div role="combobox">` ผูกไม่ได้**
 * ช่องแบบเลือกหลายอันใช้ `div` เป็น trigger เพราะต้องใส่ chip หลายบรรทัด
 * ⇒ ต้องผูกด้วย `aria-labelledby` แทน ไม่งั้นโปรแกรมอ่านหน้าจอไม่รู้ว่าช่องนี้คืออะไร
 *
 * เจอตอนเขียน unit test ของ `EntityAutocomplete` (2026-08-08)
 */
export function fieldLabelId(htmlFor?: string) {
  return htmlFor ? `${htmlFor}-label` : undefined;
}

export type FloatingFieldShellProps = {
  /** Floating label — sits inside the field as placeholder, floats up when filled/focused. */
  label?: React.ReactNode;
  /** Helper text under the field. Hidden when `error` is set. */
  hint?: React.ReactNode;
  /** Error message — switches the field shell to error styling. */
  error?: React.ReactNode;
  /** Marks the label with a red asterisk. Caller controls actual HTML required. */
  required?: boolean;
  /** Visually hide the label but keep it for screen readers. */
  hideLabel?: boolean;
  /** id of the inner field — wired to label via `htmlFor`. */
  htmlFor?: string;
  /** Size variant — affects height and label vertical positioning. */
  size?: FieldSize;
  /** Should the label be in the floated position right now? Caller computes from focused/hasValue/alwaysFloat. */
  floating: boolean;
  /** Is the field currently focused — used for label color while floating. */
  focused?: boolean;
  /** Whether the field has an error (controls border/label color). Derived from `error` if not supplied. */
  hasError?: boolean;
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
  /** Left-side icon/element rendered absolutely inside the field. */
  leftAdornment?: React.ReactNode;
  /** Right-side icon/element rendered absolutely inside the field. */
  rightAdornment?: React.ReactNode;
  /** Wrapper className (the outer flex column). */
  containerClassName?: string;
  /** When true, position the rest label near the top (for textareas) instead of vertically centered. */
  multiline?: boolean;
  /** The actual interactive element (input / textarea / button). */
  children: React.ReactNode;
};

const sizeClasses: Record<FieldSize, { labelTextRest: string; labelTextFloat: string }> = {
  sm: { labelTextRest: "text-body-sm", labelTextFloat: "text-[11px]" },
  md: { labelTextRest: "text-body-sm", labelTextFloat: "text-caption" },
  lg: { labelTextRest: "text-body-md", labelTextFloat: "text-caption" },
};

/**
 * Shared shell for any text-like field with a floating label
 * (Input / Textarea / Select / DatePicker / TimePicker / ...).
 *
 * The shell renders:
 *   - the label (positioned absolutely, animates between rest and float positions)
 *   - any left/right adornments
 *   - hint or error text below
 *
 * The caller renders the interactive element as `children` and is responsible for:
 *   - matching `id` with `htmlFor`
 *   - computing `floating` / `focused`
 *   - applying its own padding (the shell does not enforce the field's internal padding,
 *     but does shift the rest-position label right when `leftAdornment` is provided)
 */
export function FloatingFieldShell({
  label,
  hint,
  error,
  required,
  hideLabel,
  htmlFor,
  size = "md",
  floating,
  focused,
  hasError: hasErrorProp,
  leftAdornment,
  rightAdornment,
  containerClassName,
  multiline,
  reserveMessageSpace = true,
  children,
}: FloatingFieldShellProps) {
  const hasError = hasErrorProp ?? Boolean(error);
  const sz = sizeClasses[size];

  /* ป้ายว่างต้องไม่ render อะไรเลย
   *
   * เดิมเช็คแค่ `label != null` ⇒ `label=""` (ซึ่งเกิดตลอดเวลาจาก
   * `label={t("...")}` ที่ยังไม่มีคำแปล หรือจากฟิลด์ที่ตั้งใจไม่มีป้าย)
   * จะ render <label> เปล่ากว้าง 12px พื้นขาว วางที่ top:-6px
   * = เจาะรูขาวบนเส้นขอบโดยไม่มีตัวอักษรอะไร (วัดแล้ว labelW=12)
   *
   * เช็คเฉพาะ string — ป้ายที่เป็น element ถือว่ามีเนื้อหาเสมอ
   */
  const labelIsEmpty =
    label == null || (typeof label === "string" && label.trim() === "");
  const showLabel = !labelIsEmpty && !hideLabel;
  const showHint = !hasError && Boolean(hint);
  const showMessageSlot = hasError || showHint || reserveMessageSpace;

  return (
    <div className={cn("flex w-full flex-col gap-1", containerClassName)}>
      <div className="relative w-full">
        {showLabel && (
          <label
            id={fieldLabelId(htmlFor)}
            htmlFor={htmlFor}
            className={cn(
              "pointer-events-none absolute truncate transition-all duration-150 ease-out",
              "max-w-[calc(100%-1.5rem)]",
              floating
                ? cn(
                    "-top-1.5 left-2 px-1.5 font-medium bg-bg-default",
                    sz.labelTextFloat,
                    hasError
                      ? "text-cherry-red-600"
                      : focused
                        ? "text-brand"
                        : "text-text-body",
                  )
                : cn(
                    "font-normal",
                    multiline ? "top-3" : "top-1/2 -translate-y-1/2",
                    sz.labelTextRest,
                    "text-text-tertiary",
                    leftAdornment ? "left-9" : "left-3",
                  ),
            )}
          >
            {label}
            {required && <span className="ml-0.5 text-cherry-red-600">*</span>}
          </label>
        )}

        {leftAdornment && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary [&_svg]:size-4">
            {leftAdornment}
          </span>
        )}

        {children}

        {rightAdornment && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-text-tertiary [&_svg]:size-4">
            {rightAdornment}
          </span>
        )}
      </div>

      {showMessageSlot ? (
        <p
          id={hasError && htmlFor ? `${htmlFor}-error` : undefined}
          role={hasError ? "alert" : undefined}
          className={cn(
            "text-caption",
            hasError ? "font-medium text-cherry-red-600" : "text-text-tertiary",
          )}
        >
          {hasError ? error : showHint ? hint : " "}
        </p>
      ) : null}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * FieldSkeleton — โครงร่างของช่องกรอกทุกชนิด
 *
 * 🔴 ห้ามประกอบโครงร่างขึ้นใหม่เอง — ต้องใช้ `FloatingFieldShell` ตัวเดียวกับของจริง
 *
 * เหตุผล: ในของจริง **ป้ายเป็น `position:absolute`** จึงไม่กินความสูงเลย
 * ความสูงจริง = ช่อง + gap + บรรทัดข้อความข้างล่าง (ซึ่งจองที่ไว้เสมอ)
 *
 * รุ่นก่อนหน้าประกอบเองเป็น flow: แถบป้าย 14px + gap 6px + ช่อง 44px = 64px
 * ซึ่ง**บังเอิญ**เท่าของจริง (44 + 4 + 16 = 64) เฉพาะตอนมีป้ายเท่านั้น —
 * พอไม่มีป้ายจะเหลือ 44px เทียบกับของจริง 64px ⇒ ฟอร์มกระโดด 20px
 *
 * ตัวนี้เท่ากันโดย**โครงสร้าง** ไม่ใช่โดยบังเอิญ: อะไรที่เปลี่ยนใน shell
 * โครงร่างเปลี่ยนตามเองทันที
 *
 * ⚠️ ป้ายยังแสดงเป็นตัวอักษรจริงตอนโหลด (ไม่ใช่แถบเทา) โดยตั้งใจ —
 *    ป้ายเป็นข้อความคงที่ที่รู้อยู่แล้วก่อนข้อมูลมาถึง สิ่งที่ยังไม่รู้คือ *ค่า*
 * ──────────────────────────────────────────────────────────────────────────── */
export type FieldSkeletonProps = Pick<
  FloatingFieldShellProps,
  | "label"
  | "hint"
  | "required"
  | "hideLabel"
  | "size"
  | "containerClassName"
  | "multiline"
  | "reserveMessageSpace"
  | "leftAdornment"
  | "rightAdornment"
> & {
  /** class รูปทรงของช่อง — ปกติคือ `fieldShapeClasses(...)` ตัวเดียวกับที่ component ใช้ */
  shape?: string;
};

export function FieldSkeleton({
  size = "md",
  shape,
  ...shellProps
}: FieldSkeletonProps) {
  return (
    <FloatingFieldShell
      {...shellProps}
      size={size}
      /* ป้ายลอยขึ้นตลอดตอนโหลด — ถ้าปล่อยให้อยู่ตำแหน่งพัก มันจะทับโครงร่างเทา */
      floating
      hasError={false}
    >
      <SkeletonBox shape={shape ?? fieldShapeClasses({ hasError: false, size })} />
    </FloatingFieldShell>
  );
}

/**
 * Field shape classes shared by all interactive elements (input/textarea/button).
 * Apply to the inner element so border/focus ring/error states stay consistent.
 */
export function fieldShapeClasses({
  hasError,
  size,
}: {
  hasError: boolean;
  size: FieldSize;
}) {
  const heights: Record<FieldSize, string> = {
    sm: "h-9 text-body-sm",
    md: "h-11 text-body-sm",
    lg: "h-12 text-body-md",
  };
  return [
    "w-full rounded-sm border bg-bg-default px-3 font-medium transition-colors",
    "focus:outline-none focus:ring-1",
    "disabled:cursor-not-allowed disabled:bg-bg-subtle",
    heights[size],
    hasError
      ? "border-cherry-red-600 focus:border-cherry-red-600 focus:ring-cherry-red-600/40"
      : "border-border-strong focus:border-brand focus:ring-brand/30",
  ].join(" ");
}
