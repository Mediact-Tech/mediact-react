import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-medium",
  {
    variants: {
      /* 🔄 **สามโทนเดินตามจานสีของดีไซน์ (2026-08-20 · เจ้าของเคาะ)**
       *   success `#0BB767` บน `#E7F8F0` · warning `#AE7008` บน `#FEF5E7` · danger `#F52D0A` บน `#FEEAE7`
       *
       * 🔴 **แก้ที่ tone ของ component นี้ ⛔ ไม่ใช่ทับค่าใน palette** — `warning-yellow-800`,
       * `success-green-800`, `cherry-red-*` ที่ใช้อยู่เดิมถูกแชร์กับ `Toast` · `Chip` · `EmptyState`
       * · `ConfirmDialog` · `hover` ของปุ่ม destructive · `TopNav` · ai-chat ⇒ ทาสีทับที่ palette
       * เท่ากับเปลี่ยนสีของ component เหล่านั้นทั้ง 4 แอปในที่ที่ไม่มีใครขอ
       *
       * 🔑 ทุกค่าเป็น **token** ⛔ ไม่มี hex ในไฟล์นี้ · 3 ตัวมีอยู่แล้วในจานสี (success ทั้งคู่ +
       * `error-red-icon`) อีก 3 ตัวเพิ่มใหม่ที่ `@mediact/tokens` ในรอบเดียวกัน
       *
       * 📐 contrast ที่วัดได้จริง (สูตร WCAG จากค่า hex ไม่ใช่ประมาณ) — **ต่ำกว่า 4.5:1 ทั้งสามใบ**
       * และตัวอักษรของป้ายเป็น `text-caption` (12px) ซึ่งเกณฑ์คือ 4.5:1:
       *   warning `#AE7008`/`#FEF5E7` = **3.79:1** · danger `#F52D0A`/`#FEEAE7` = **3.45:1**
       *   success `#0BB767`/`#E7F8F0` = **2.39:1** ⇐ ต่ำสุด ตกเกณฑ์ 3:1 ของกราฟิกด้วย
       * ⇒ เป็นการตัดสินใจของเจ้าของดีไซน์ที่รับความเสี่ยงนี้ไว้ · ถ้าวันหนึ่งต้องผ่าน AA
       * ให้ขยับ **ตัวอักษร** ให้เข้มขึ้น (พื้นอ่อนคือส่วนที่ดีไซน์สื่อความ) เช่น success → `#067F47`
       * ⛔ อย่าแก้ด้วยการทำพื้นให้เข้ม — ป้ายจะกลายเป็นปุ่ม */
      tone: {
        neutral: "bg-nuetral-light-50 text-text-secondary",
        success: "bg-success-green-background-50 text-success-green-primary",
        warning: "bg-warning-yellow-background-50 text-warning-yellow-700",
        danger: "bg-error-red-background-50 text-error-red-icon",
        info: "bg-info-blue-50 text-info-blue-800",
      },
      size: {
        sm: "h-6 px-2.5 text-caption",
        md: "h-7 px-3 text-body-sm",
      },
    },
    defaultVariants: { tone: "neutral", size: "sm" },
  },
);

export type StatusBadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof statusBadgeVariants> & {
    /** Hide the leading dot. */
    hideDot?: boolean;
  };

/**
 * Dot + label status pill, e.g. "● Published", "● Draft",
 * "● มีการแก้ไขที่ยังไม่บันทึก". Dot inherits the tone's text color.
 */
const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  function StatusBadge({ className, tone, size, hideDot, children, ...props }, ref) {
    return (
      <span
        ref={ref}
        className={cn(statusBadgeVariants({ tone, size }), className)}
        {...props}
      >
        {!hideDot && (
          <span
            aria-hidden="true"
            className="size-1.5 shrink-0 rounded-full bg-current"
          />
        )}
        {children}
      </span>
    );
  },
);

StatusBadge.displayName = "StatusBadge";

export { StatusBadge, statusBadgeVariants };
