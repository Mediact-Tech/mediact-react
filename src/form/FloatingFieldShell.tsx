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
  /**
   * ช่องถูกปิดใช้งานอยู่ — **ใช้เลือกสีพื้นของป้ายลอย ไม่ได้ใช้ปิดการทำงาน**
   *
   * 🔴 ป้ายลอยต้องมีพื้นทึบเพื่อ **ตัดเส้นขอบ** ไม่ให้เส้นขีดทับตัวหนังสือ (กล่องป้ายกิน
   * ตั้งแต่ −6 ถึง +10 ส่วนเส้นขอบอยู่ที่ 0–1 ⇒ ซ้อนกันเสมอ) · แต่ `bg-bg-default` ตายตัว
   * แปลว่าป้ายจะขาวเสมอ **แม้ช่องจะไม่ขาว** — ตอน `disabled` ช่องเป็น `bg-bg-surface`
   * ⇒ ป้ายกลายเป็นแถบขาวลอยอยู่บนช่องสีเทา เห็นได้ทุกแอป
   *
   * ⚠️ ตัวช่องปิดการทำงานด้วย `disabled` ของ element จริงอยู่แล้ว — prop นี้ไม่ได้ทำแทน
   */
  disabled?: boolean;
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
  disabled,
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
              /* 🔴 `z-10` — ตอนเป็นโครงร่าง (`FieldSkeleton`) กล่องเทาใช้ `animate-pulse`
               * ซึ่งเป็นแอนิเมชัน opacity ⇒ มันสร้าง stacking context ของตัวเอง แล้ว
               * ทับป้ายกำกับที่วางมาก่อนหน้าในลำดับ DOM
               * ผลที่เห็นคือป้ายโผล่มาแค่เสี้ยวบนสุด ที่เหลือจมอยู่ใต้กล่องเทา —
               * อ่านเป็น "ตัวหนังสือขาด" ไม่ใช่ป้ายกำกับ (ยืนยันด้วยภาพซูม 2026-08-10)
               * ป้ายมี `pointer-events-none` อยู่แล้ว การยกชั้นจึงไม่บังการคลิกของช่อง */
              "pointer-events-none absolute z-10 truncate transition-all duration-150 ease-out",
              "max-w-[calc(100%-1.5rem)]",
              floating
                ? cn(
                    /* พื้นของป้ายต้องเป็นสีเดียวกับพื้นช่องที่มันวางทับ ไม่ใช่ขาวตายตัว
                     * — `fieldShapeClasses` ใช้ `bg-bg-default` ตอนปกติ และ
                     * `disabled:bg-bg-surface` ตอนปิดใช้งาน ⇒ ป้ายเดินตามคู่กัน
                     *
                     * 🔴 **ตอนปิดใช้งานต้องเขียนเป็น `var()` พร้อมค่าสำรอง ไม่ใช่คลาส
                     * `bg-bg-surface` เปล่า ๆ** — `--color-bg-surface` เป็น token ของ
                     * ชั้น semantic ซึ่ง **แอปที่ใช้ `@mediact/tailwind-preset` ยังไม่มี**
                     * (preset → `tokens.css` → `@import "./theme.css"` ซึ่งเป็นชุดเก่า
                     * และไม่ได้ประกาศ token นี้ · ตรวจแล้วใน Storybook ของ DS เอง:
                     * สตริง `bg-bg-surface` ไม่ปรากฏใน CSS ที่ compile ออกมาเลยแม้แต่ครั้งเดียว)
                     * ⇒ ถ้าใช้คลาสเปล่า ป้ายจะ **โปร่งใส** แล้วเส้นขอบขีดทับตัวหนังสือ
                     * ซึ่งแย่กว่าอาการเดิม · `var(…, …)` ทำให้มันถอยไปเป็นสีเดียวกับช่อง
                     * ในที่ที่ token ยังไม่มี — ซึ่งเป็นที่เดียวกับที่ช่องก็ยังไม่เปลี่ยนสีเช่นกัน
                     *
                     * ⚠️ นี่คือเหตุผลที่ไม่มีใครเห็นบั๊กนี้มาก่อน: ใน Storybook ช่อง disabled
                     * **ไม่ได้เป็นสีเทาเลย** เพราะ `disabled:bg-bg-surface` ก็ไม่ทำงานเหมือนกัน
                     * ⇒ ป้ายขาวบนช่องขาว มองไม่ออก (เป็นข้อ 3 ใน open decisions ของ repo:
                     * DS ยังกิน token ชุดเก่าอยู่ ยังไม่ย้ายไป semantic) */
                    disabled
                      ? "bg-[var(--color-bg-surface,var(--color-bg-default))]"
                      : "bg-bg-default",
                    "-top-1.5 left-2 px-1.5 font-medium",
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
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary [&_svg:not([class*='size-'])]:size-4">
            {leftAdornment}
          </span>
        )}

        {children}

        {rightAdornment && (
          /* 🔴 `pointer-events-none` — ตัวห่อนี้ทับปุ่ม/ช่องที่อยู่ข้างล่างเสมอ
           * (`absolute right-3`) ถ้าไม่ปล่อยให้คลิกทะลุ **การกดตรงไอคอนจะไม่ทำอะไรเลย**
           * บนช่องที่ทั้งช่องมีหน้าที่ "กดแล้วเปิด" (`DatePicker` · `DateRangePicker` ·
           * `Select`/`ComboBox`) — ผู้ใช้กดตรงไอคอนเป็นเรื่องปกติที่สุด และของเดิม
           * เงียบสนิท ไม่มี error ให้เห็น (ยืนยันด้วย `elementFromPoint` ที่กลางไอคอน
           * ปฏิทินของ `DatePicker`: คืน `<span>` ตัวนี้ ไม่ใช่ปุ่ม trigger)
           *
           * ตรงกับ `leftAdornment` ที่เป็น `pointer-events-none` มาแต่แรก
           *
           * ⚠️ adornment ที่ **เป็นปุ่มจริง** ต้องเปิด `pointer-events-auto` ที่ตัวมันเอง
           * — `TimePicker` ทำแบบนั้นอยู่ก่อนแล้ว (เจอปัญหานี้มาก่อนแต่แก้เฉพาะจุด)
           * และปุ่มล้างของ `DateRangePicker` เปิดกลับมาเฉพาะตอนถูกเผย */
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-text-tertiary [&_svg:not([class*='size-'])]:size-4">
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
  containerClassName,
  ...shellProps
}: FieldSkeletonProps) {
  return (
    <FloatingFieldShell
      {...shellProps}
      /* 🔴 ป้ายกำกับตอนโหลด **ไม่มีพื้นขาว** — พื้นขาวของป้ายมีหน้าที่เดียวคือเจาะ
       * เส้นขอบของช่องให้ขาดตรงที่ป้ายทับ แต่โครงร่างตั้ง `border-transparent`
       * ไว้อยู่แล้ว ไม่มีเส้นให้เจาะ ⇒ เหลือแต่ผลข้างเคียง: แผ่นขาวปาดเข้าไปในกล่องเทา
       * เห็นเป็นรอยแหว่ง (ยืนยันด้วยภาพซูม 2026-08-10) */
      containerClassName={cn("[&_label]:bg-transparent", containerClassName)}
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
    /* 🔴 มุมโค้งอ่านจาก `--radius-field` โดยมีค่าสำรองเป็นของเดิม (4px) ⇒ **แอปที่ไม่ตั้งอะไร
     * ไม่เปลี่ยนเลยสักพิกเซล** · มีไว้เพราะของจริงในแอปไม่ตรงกัน: จอตั้งขอบเขต (แผนก/หน่วยงาน)
     * ของ Mediwork ทั้ง 3 จอใช้ **8px** มาตลอด (`components-v2/shared/selectionFieldSx.ts`)
     * ส่วน DS ใช้ 4px ⇒ ช่องของ DS ที่วางข้างของเดิมจะมุมคมกว่าอย่างเห็นได้
     *
     * ⚠️ ที่ **ไม่** เปลี่ยนค่าตั้งต้นเป็น 8px ให้ทุกแอค เพราะกฎข้อ 1 ของ repo นี้: ค่าที่ใช้
     * ร่วมกัน 4 แอปต้องวัดจากจอจริงของทั้ง 4 ก่อน · ตอนนี้มีตัวเลขจาก Mediwork แอปเดียว
     * ⇒ เปิดทางให้แต่ละแอปตั้งเองไปก่อน แล้วค่อยยุบเป็นค่าเดียวเมื่อวัดครบ */
    /* 🔴 `border-[1px]` ไม่ใช่ `border` เปล่า ๆ — **ชื่อคลาสชนกับ utility เก่าของ Mediwork**
     *
     * `styles/globals.css:226` ของแอปนั้นประกาศไว้ว่า
     *     .border { border: 1px solid #edeff5 !important; }
     * เป็น unlayered + `!important` ⇒ ชนะ utility ของ Tailwind ทุกกรณี และเพราะเป็น
     * **shorthand** มันกินทั้ง width/style/**color** ⇒ ทุก field ของ DS ในแอปนั้นได้เส้น
     * `#edeff5` ตายตัว และ `hover:border-brand` / `focus:border-brand` **ไม่มีทางทำงานเลย**
     * (วัดจากจอจริง 2026-08-14: ได้ `rgb(237,239,245)` ตรงกับค่าที่ hardcode ไว้เป๊ะ)
     *
     * อาการเงียบสนิท — ไม่มี error และช่องยังดูเหมือนช่องปกติ ต่างแค่สีเส้นกับการไม่ตอบ hover
     *
     * `border-[1px]` ให้ผลเท่ากันทุกประการในแอปที่ไม่มีคลาสชนกัน แต่ชื่อคลาสไม่ตรงกับ
     * ของเก่า ⇒ หลุดจากกฎ `!important` นั้น · ส่วน `border-style` ยังมาจาก reset
     * (preflight หรือที่แอปกู้เอง ซึ่งตั้ง `border: 0 solid` ให้ form element อยู่แล้ว)
     *
     * ⚠️ แอปนั้นมี utility ชื่อชนอีกหลายตัว (`.pl-*` `.pr-*` `.ml-*` …) ทุกตัวเป็น
     * `!important` — ถ้า DS ใช้คลาสพวกนี้ที่ไหนอีกจะเจออาการเดียวกัน */
    "w-full rounded-[var(--radius-field,0.25rem)] border-[1px] bg-bg-default px-3 font-medium transition-colors",
    "focus:outline-none focus:ring-1",
    /* 🔴 `bg-bg-surface` (#f3f4f6) ไม่ใช่ `bg-bg-subtle` (#fbfbfd) — ของเดิมต่างจากพื้นขาว
     * ของช่องปกติแค่ **1.5%** ⇒ ช่องที่แก้ไม่ได้ดูเหมือนช่องที่แก้ได้ทุกประการ ผู้ใช้จะรู้
     * ก็ต่อเมื่อคลิกแล้วพิมพ์ไม่ได้ · จอ "ข้อมูลองค์กร" มี 9 ช่องที่อ่านอย่างเดียวถาวร
     * เรียงติดกัน จึงเห็นปัญหานี้ชัดที่สุด (ดีไซน์ Figma 715-15581 วาดเป็นเทา #f0f0f0
     * — ห่างจาก token นี้ 3 หน่วย มองด้วยตาไม่ออก) */
    "disabled:cursor-not-allowed disabled:bg-bg-surface",
    heights[size],
    /* 🔴 **hover เส้นขอบเป็นสีแบรนด์ — ของที่ field ของ DS ไม่เคยมีเลย**
     *
     * ทุก field มีแต่สถานะ `focus` ⇒ เอาเมาส์ไปวางแล้วไม่มีอะไรตอบสนอง ซึ่งเป็นวิธีที่
     * ทั้งหน้าเว็บใช้เขียนคำว่า *กดไม่ได้* · ของจริงที่ผู้ใช้ใช้อยู่ทุกวันมี — จอตั้งขอบเขต
     * ทั้ง 3 จอของ Mediwork ตั้ง `'&:hover fieldset': {borderColor: var(--primaryColor)}`
     * ไว้ตรง ๆ (`selectionFieldSx.ts:27`) ⇒ ช่องของ DS ที่วางข้างกันดูตายกว่าอย่างชัดเจน
     *
     * `enabled:` สำคัญ — ช่องที่ปิดอยู่ต้องไม่ตอบสนองการ hover ไม่งั้นจะสัญญาสิ่งที่ทำไม่ได้
     * (ช่อง "หน่วยงาน" ถูกปิดไว้จนกว่าจะเลือกแผนก เป็นเคสที่เจอจริงบนจอ)
     * ⚠️ สถานะผิดพลาดไม่มี hover โดยตั้งใจ — เส้นแดงคือข้อความ ไม่ใช่ของตกแต่ง
     * ถ้าให้มันเปลี่ยนเป็นสีแบรนด์ตอนเอาเมาส์ไปวาง เท่ากับลบข้อความนั้นทิ้งชั่วคราว */
    hasError
      ? "border-cherry-red-600 focus:border-cherry-red-600 focus:ring-cherry-red-600/40"
      : "border-border-strong enabled:hover:border-brand focus:border-brand focus:ring-brand/30",
  ].join(" ");
}
