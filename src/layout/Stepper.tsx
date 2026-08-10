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
  className?: string;
  /** Allow click on completed steps to navigate. */
  onStepClick?: (index: number) => void;
};

function Stepper({
  steps,
  current,
  orientation = "horizontal",
  connector = "fill",
  className,
  onStepClick,
}: StepperProps) {
  const isVertical = orientation === "vertical";
  const isFixed = !isVertical && connector === "fixed";

  return (
    <ol
      className={cn(
        "flex",
        isVertical
          ? "flex-col gap-4"
          : isFixed
            ? "items-center justify-center gap-6 py-1.5"
            : "items-center gap-3",
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
            {showCheck ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
          </div>
        );

        return (
          <li
            key={i}
            className={cn(
              "flex",
              isVertical ? "items-start gap-3" : "items-center gap-2",
              !isVertical && !isFixed && !isLast && "flex-1",
            )}
          >
            <div
              className={cn(
                "flex",
                isVertical ? "flex-col items-center" : "items-center gap-2",
              )}
            >
              {clickable ? (
                <button
                  type="button"
                  onClick={() => onStepClick?.(i)}
                  className="cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-brand-active/40"
                >
                  {circle}
                </button>
              ) : (
                circle
              )}
              {isVertical && !isLast && (
                <div
                  className={cn(
                    "mt-1 w-px flex-1 min-h-6",
                    status === "done" ? "bg-brand-active" : "bg-border-default",
                  )}
                />
              )}
              {!isVertical && (
                <div
                  className={cn(
                    "text-body-sm",
                    status === "todo"
                      ? "text-text-tertiary font-normal"
                      /* 🔴 สีเนื้อความปกติ — `text-text-primary` alias ไป `--color-brand`
                       * ⇒ ป้ายขั้นตอนเปลี่ยนสีตามแอป · ความต่างจากขั้นที่ยังไม่ถึง
                       * มาจาก **น้ำหนัก** กับเทาที่อ่อนกว่า ไม่ต้องพึ่งสีแบรนด์ */
                      : "text-text-body font-semibold",
                  )}
                >
                  {step.label}
                  {step.description && (
                    <div className="text-caption font-normal text-text-tertiary">
                      {step.description}
                    </div>
                  )}
                </div>
              )}
            </div>

            {isVertical && (
              <div className="min-w-0 pb-4">
                <div
                  className={cn(
                    "text-body-sm",
                    status === "todo"
                      ? "text-text-tertiary font-normal"
                      /* 🔴 สีเนื้อความปกติ — `text-text-primary` alias ไป `--color-brand`
                       * ⇒ ป้ายขั้นตอนเปลี่ยนสีตามแอป · ความต่างจากขั้นที่ยังไม่ถึง
                       * มาจาก **น้ำหนัก** กับเทาที่อ่อนกว่า ไม่ต้องพึ่งสีแบรนด์ */
                      : "text-text-body font-semibold",
                  )}
                >
                  {step.label}
                </div>
                {step.description && (
                  <div className="text-caption text-text-tertiary">
                    {step.description}
                  </div>
                )}
              </div>
            )}

            {!isVertical && !isLast && (
              <div
                className={cn(
                  "h-px bg-border-default",
                  /* `fixed` = เส้น 22×2 ตามที่วัดจาก MediHR — ความยาวคงที่ ไม่ยืดตามพื้นที่ */
                  isFixed ? "h-0.5 w-5.5 shrink-0" : "flex-1",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export { Stepper };
