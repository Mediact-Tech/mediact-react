import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "../lib/cn";

export type StepperStep = {
  label: React.ReactNode;
  description?: React.ReactNode;
};

export type StepperProps = {
  steps: StepperStep[];
  /** Zero-based index of the current (active) step. Steps before are "done". */
  current: number;
  orientation?: "horizontal" | "vertical";
  /**
   * เส้นเชื่อมระหว่างขั้น (แนวนอนเท่านั้น)
   *
   * `fill` — ยืดเต็มความกว้างที่มี ขั้นตอนกระจายเต็มแถว (ค่าเริ่มต้น)
   * `fixed` — เส้นสั้นคงที่ แล้วจัดทั้งแถบไว้กลาง · ใช้เมื่อ stepper อยู่ในโมดัลหรือกล่องแคบ
   *           ที่การยืดเต็มทำให้ป้ายลอยห่างกันจนอ่านเป็นกลุ่มเดียวไม่ได้
   */
  connector?: "fill" | "fixed";
  /**
   * ตำแหน่งป้ายเทียบกับวงกลม (แนวนอนเท่านั้น · แนวตั้งวางป้ายข้างวงกลมเสมอ)
   *
   * `bottom` — ตัวเลขอยู่บน ป้ายอยู่ใต้ จัดกลาง (ค่าเริ่มต้น · เคาะ 2026-11-03 ให้เป็นแบบเดียวกันทั้งระบบ)
   * `end` — ป้ายอยู่ข้างวงกลม (รูปแบบเดิมก่อน 2026-11-03 · มาจาก MediHR Figma 114-7410)
   */
  labelPlacement?: "bottom" | "end";
  className?: string;
  /** Allow click on completed steps to navigate. */
  onStepClick?: (index: number) => void;
};

/* ขั้นที่ยังไม่ถึง = เทาอ่อน · ขั้นที่ทำอยู่/ผ่านแล้ว = สีตัวหนังสือปกติ + หนา
 *
 * ขั้นที่ผ่านแล้ว/ทำอยู่ = `brand-active` **สีเดียวกับวงกลม** (เคาะ 2026-11-03 · เหมือน `CensusStepper` เดิมของ
 * Mediwork) · ขั้นที่ทำอยู่หนากว่า ⇒ แยกจากขั้นที่ผ่านแล้วได้ด้วยน้ำหนัก
 * 🔴 ไม่ใช้ `text-brand` / `text-text-primary` (alias ไป `--color-brand`) — มิ้นต์ของ Mediwork บนขาว 1.93:1
 * `brand-active` คือเฉดเข้มของแบรนด์ วัดบนขาว: Mediwork `#0c8670` 4.51 · Portal 11.99 · MediHR 17.14 ·
 * ⚠️ Medimatch `#0481a8` 4.46 (ขาด 4.5 นิดเดียว) · ⚠️ ธีมใหม่ `mediwork.css` (`teal-700` `#1ea78f`) 3.01 —
 * แอปที่ย้ายไปใช้ธีมนี้ต้องเข้มขึ้นก่อน */
function labelTone(status: "done" | "active" | "todo") {
  return status === "todo"
    ? "text-text-tertiary font-normal"
    : status === "active"
      ? "text-brand-active font-semibold"
      : "text-brand-active font-normal";
}

function Stepper({
  steps,
  current,
  orientation = "horizontal",
  connector = "fill",
  labelPlacement = "bottom",
  className,
  onStepClick,
}: StepperProps) {
  const isVertical = orientation === "vertical";
  const isFixed = !isVertical && connector === "fixed";
  const isBottom = !isVertical && labelPlacement === "bottom";

  return (
    <ol
      className={cn(
        /* `m-0 p-0 list-none` — DS ห้ามพึ่ง reset ของแอป (ol ดิบมี margin 16 · padding 40 · เลขลำดับ) */
        "m-0 flex list-none p-0",
        isVertical
          ? "flex-col gap-4"
          : isFixed
            ? cn("justify-center gap-6 py-1.5", isBottom ? "items-start" : "items-center")
            : cn("gap-3", isBottom ? "items-start" : "items-center"),
        className,
      )}
    >
      {steps.map((step, i) => {
        const status: "done" | "active" | "todo" =
          i < current ? "done" : i === current ? "active" : "todo";
        const isLast = i === steps.length - 1;

        /* กดได้เฉพาะขั้นที่ทำเสร็จแล้ว — ขั้นที่กำลังทำอยู่กดแล้วไม่มีอะไรเกิดขึ้น
         * การทำให้มันดูกดได้จึงเป็นการสัญญาสิ่งที่ไม่เกิด */
        const clickable = Boolean(onStepClick) && status === "done";

        /* 🔴 เครื่องหมายถูกขึ้นเฉพาะขั้นที่ **เสร็จแล้ว** — ขั้นที่กำลังกรอกอยู่ยังไม่เสร็จ
         * ติ๊กถูกให้จึงบอกผู้ใช้ผิดตรง ๆ (ก่อนหน้านี้ติ๊กทั้ง done และ active)
         * ตัวเลขบอก "ลำดับ" · เครื่องหมายถูกบอก "ข้อมูลตรงนี้ครบแล้ว" — คนละหน้าที่กัน
         * ตรงกับ MediHR (Figma 114-7410) ซึ่งเป็นผู้ใช้จริงรายแรกของ component นี้ */
        const showCheck = status === "done";

        const circle = (
          <div
            className={cn(
              /* size-6 = 24px · วัดจาก MediHR ที่รันจริง (ก่อนหน้านี้ 28px ไม่ตรงดีไซน์ไหนเลย) */
              "flex size-6 shrink-0 items-center justify-center rounded-full text-caption font-bold transition-colors",
              status === "todo"
                /* ⚠️ MediHR ของจริงใช้ **เทากลาง #c2c9d4 + ตัวเลขขาว** (วัดจากเบราว์เซอร์ 2026-08-10)
                 * ซึ่งอ่านง่ายกว่าคู่นี้ — แต่เขียนเป็นคลาสสีดิบตรง ๆ จะเพิ่มหนี้สีดิบ 2 ตัว
                 * และชนด่าน `tokens.guard.test.ts` ที่ตั้งใจกันไว้
                 * ทางแก้ที่ถูกคือเพิ่ม token (เช่น `--color-step-upcoming`) เข้าเลเยอร์ที่แอป
                 * โหลดจริง แล้วค่อยเปลี่ยนที่นี่ที่เดียว — เป็นงานที่เจ้าของ token ต้องเคาะ
                 * 🔬 ระวัง: `semantic.css` **ไม่ได้ถูก import เข้าบันเดิล** (`tokens.css` ดึงแค่
                 * `theme.css`) ⇒ `border-input` / `text-inverse` ให้ค่าคนละตัวกับที่อ่านในซอร์ส
                 * (วัดสด: ดำโปร่ง 36% และตัวอักษรดำ) — อย่าเลือก token จากการอ่านไฟล์ */
                ? "bg-gray-200 text-text-tertiary"
                : "bg-brand-active text-white",
            )}
          >
            {showCheck ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : i + 1}
          </div>
        );

        if (isVertical) {
          return (
            <li
              key={i}
              aria-current={status === "active" ? "step" : undefined}
              className="flex items-start gap-3"
            >
              <div className="flex flex-col items-center">
                {clickable ? (
                  <button
                    type="button"
                    onClick={() => onStepClick?.(i)}
                    /* ปุ่มมีแค่วงกลม (เลข/เครื่องหมายถูก) ⇒ ไม่มีชื่อให้โปรแกรมอ่านหน้าจอ
                     * ยืมป้ายมาเป็นชื่อเมื่อป้ายเป็นข้อความล้วน */
                    aria-label={typeof step.label === "string" ? step.label : undefined}
                    className="cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-brand-active/40"
                  >
                    {circle}
                  </button>
                ) : (
                  circle
                )}
                {!isLast && (
                  <div
                    className={cn(
                      "mt-1 w-px flex-1 min-h-6",
                      status === "done" ? "bg-brand-active" : "bg-border-default",
                    )}
                  />
                )}
              </div>
              <div className="min-w-0 pb-4">
                <div className={cn("text-body-sm", labelTone(status))}>{step.label}</div>
                {step.description && (
                  <div className="text-caption text-text-tertiary">{step.description}</div>
                )}
              </div>
            </li>
          );
        }

        /* วงกลม + ป้าย เป็นก้อนเดียวกัน · ขั้นที่กดได้ ⇒ ทั้งก้อนเป็นปุ่ม (เป้ากดใหญ่ขึ้น
         * และชื่อปุ่มได้จากป้ายเองโดยไม่ต้องตั้ง aria-label) · ขั้นที่กดไม่ได้เป็น div ธรรมดา
         * ไม่ให้โปรแกรมอ่านหน้าจอบอกว่าเป็นของที่กดได้ */
        const stepClasses = cn(
          "flex",
          isBottom
            ? "flex-col items-center gap-1.5 text-center"
            : "items-center gap-2 text-left",
        );
        const stepBody = (
          <>
            {circle}
            <div className={cn("text-body-sm", labelTone(status), isBottom && "whitespace-nowrap")}>
              {step.label}
              {step.description && (
                <div className="text-caption font-normal text-text-tertiary">
                  {step.description}
                </div>
              )}
            </div>
          </>
        );

        return (
          <li
            key={i}
            aria-current={status === "active" ? "step" : undefined}
            className={cn(
              "flex gap-2",
              isBottom ? "items-start" : "items-center",
              !isFixed && !isLast && "flex-1",
            )}
          >
            {clickable ? (
              <button
                type="button"
                onClick={() => onStepClick?.(i)}
                className={cn(
                  stepClasses,
                  "cursor-pointer rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-active/40",
                  /* ป้ายขีดเส้นใต้ตอนชี้ — บอกว่ากดย้อนได้ (วงกลมสีเดียวกับขั้นที่ทำอยู่ ดูอย่างเดียวแยกไม่ออก) */
                  "hover:[&>div:last-child]:underline",
                )}
              >
                {stepBody}
              </button>
            ) : (
              <div className={stepClasses}>{stepBody}</div>
            )}

            {!isLast && (
              /* ห่อเส้นด้วยกล่องสูงเท่าวงกลม (`h-6`) ⇒ เส้นอยู่กลางวงกลมพอดีทั้งสองแบบ
               * (ตอนป้ายอยู่ใต้ ก้อนขั้นสูงกว่าวงกลม ⇒ จัดกลางทั้ง li จะได้เส้นตกไปกลางป้าย) */
              <div
                aria-hidden
                className={cn("flex h-6 items-center", isFixed ? "shrink-0" : "flex-1")}
              >
                <div
                  className={cn(
                    "bg-border-default",
                    /* `fixed` = เส้น 22×2 ตามที่วัดจาก MediHR — ความยาวคงที่ ไม่ยืดตามพื้นที่ */
                    isFixed ? "h-0.5 w-5.5" : "h-px w-full",
                  )}
                />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export { Stepper };
