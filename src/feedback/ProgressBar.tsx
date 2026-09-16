/** @doc ./ProgressBar.md */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";
import { SkeletonBox } from "./Skeleton";

/**
 * แถบบอกสัดส่วนที่ใช้ไป — **ไม่ใช่ `<progress>`**
 *
 * 🔴 `<progress>` ถูก UA stylesheet ของแต่ละเบราว์เซอร์วาดคนละแบบ และต้องรื้อด้วย
 * `-webkit-progress-bar` / `-moz-progress-bar` ซึ่งเขียนเป็น utility ไม่ได้ ⇒ DS จะ
 * ขึ้นกับ reset ของแอปปลายทาง ซึ่ง §9 ของ CLAUDE.md ห้ามไว้ตรง ๆ
 * (Mediwork ถอด preflight ทิ้งโดยตั้งใจ) · สอง `<div>` + ARIA ให้ผลเท่ากันและคุมได้เต็ม
 */
const trackVariants = cva("w-full overflow-hidden rounded-full bg-progress-track", {
  variants: {
    /* ความสูงเดียวที่มีของจริงคือ 8px (วัดจาก Medimatch 2026-09-11 ทั้งสองจุด)
     * `sm` เผื่อไว้สำหรับแถบในแถวตารางที่ 8px จะดันความสูงแถว — ยังไม่มีผู้ใช้ */
    size: { sm: "h-1", md: "h-2" },
  },
  defaultVariants: { size: "md" },
});

const fillVariants = cva("h-full rounded-full transition-[width] duration-300", {
  variants: {
    /* 🔴 `info` เป็นค่าตั้งต้นเพราะเป็นสิ่งที่แอปแรกที่ใช้แสดงอยู่จริง ไม่ใช่เพราะ
     * "ฟ้าดูเป็นกลาง" — Medimatch วาดแถบโควตาเครดิตด้วย `#06b5ed` ซึ่ง
     * `--color-progress-fill` ชี้ไปหาพอดี (ผ่าน `info-default`)
     *
     * อีก 3 โทนมีไว้เพราะแถบโควตา **เปลี่ยนความหมายตามระดับ** เป็นเรื่องปกติ
     * (ใกล้เต็ม = เตือน · เต็มแล้ว = อันตราย) และจอ "เครดิตหมด" ของ Medimatch
     * มีอยู่จริงแล้ว (`CreditLimitReachedBanner`) ⇒ ถ้าไม่ให้มาแต่แรก จุดแรกที่ต้องการ
     * จะ fork ด้วย `className` แล้วโทนจะกระจายกันเองทีละจอ
     * ⚠️ วันนี้ยังไม่มี call site ไหนใช้ 3 โทนนั้น — เขียนไว้ใน `.md` แล้ว */
    tone: {
      info: "bg-progress-fill",
      success: "bg-success-default",
      warning: "bg-warning-default",
      danger: "bg-danger-default",
    },
  },
  defaultVariants: { tone: "info" },
});

export type ProgressBarProps = Omit<React.ComponentProps<"div">, "role"> &
  VariantProps<typeof trackVariants> &
  VariantProps<typeof fillVariants> & {
    /** สัดส่วนที่ใช้ไป 0–100 — ค่านอกช่วงถูกหนีบ ไม่ปล่อยให้แถบล้นกรอบ */
    value: number;
    /**
     * ชื่อที่โปรแกรมอ่านหน้าจอจะอ่าน
     *
     * 🔴 **จำเป็น** — แถบเปล่า ๆ ไม่มีข้อความในตัว ถ้าไม่ตั้งชื่อ screen reader
     * จะอ่านได้แค่ "progress bar 40%" โดยไม่รู้ว่าเป็นโควตาอะไร
     * จอที่มีป้ายข้อความอยู่แล้วให้ส่ง `aria-labelledby` แทนได้
     */
    label?: string;
    /** ข้อมูลยังมาไม่ถึง — แทนด้วยแถบเทาสูงเท่ากัน ไม่ใช่แถบ 0% ซึ่งอ่านว่า "ยังไม่ใช้เลย" */
    isLoading?: boolean;
  };

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  function ProgressBar(
    { value, label, tone, size, isLoading, className, ...props },
    ref,
  ) {
    /* หนีบก่อนใช้ทุกครั้ง — `creditsUsed / creditsTotal` ที่ backend ส่งมาเกิน 100 ได้จริง
     * (ใช้เกินโควตา) และ `NaN` เกิดได้เมื่อ total = 0 ⇒ ปล่อยไปจะได้ `width: NaN%`
     * ซึ่งเบราว์เซอร์ทิ้งทั้งกฎ แถบเลยเต็มกรอบเงียบ ๆ แทนที่จะว่าง */
    const pct = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;

    if (isLoading) {
      return (
        <SkeletonBox className={cn(trackVariants({ size }), className)} />
      );
    }

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className={cn(trackVariants({ size }), className)}
        {...props}
      >
        <div className={fillVariants({ tone })} style={{ width: `${pct}%` }} />
      </div>
    );
  },
);

export { ProgressBar, trackVariants as progressBarVariants };
