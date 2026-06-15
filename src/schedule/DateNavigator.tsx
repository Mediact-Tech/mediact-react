import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const dateNavigatorVariants = cva(
  "inline-flex items-center justify-between rounded-lg border border-border-default bg-white",
  {
    variants: {
      size: {
        sm: "h-9 gap-1 px-1",
        md: "h-11 gap-2 px-1.5",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export type DateNavigatorUnit = "month" | "day";

export type DateNavigatorProps = Omit<
  React.ComponentProps<"div">,
  "children" | "onChange"
> &
  VariantProps<typeof dateNavigatorVariants> & {
    /**
     * Controlled mode — เมื่อส่ง `value` มา component จะ format label
     * และคำนวณ ‹ › ให้เองตาม `unit` (สไตล์เดียวกับ MUI controlled component)
     */
    value?: Date;
    /** เรียกพร้อม Date ใหม่เมื่อกด ‹ › (เฉพาะ controlled mode) */
    onChange?: (date: Date) => void;
    /** Granularity ของ label และ step. @default "month" */
    unit?: DateNavigatorUnit;
    /**
     * BCP-47 locale สำหรับ format label.
     * @default "th-TH" — แสดงปีพุทธศักราชอัตโนมัติ (เช่น "มิถุนายน 2569")
     */
    locale?: string;
    /** ปุ่ม ‹ disable อัตโนมัติเมื่อ step ถัดไปต่ำกว่านี้ (controlled mode) */
    minDate?: Date;
    /** ปุ่ม › disable อัตโนมัติเมื่อ step ถัดไปเกินกว่านี้ (controlled mode) */
    maxDate?: Date;
    /**
     * Custom label — override การ format จาก `value`
     * (ใช้เมื่อ format มาตรฐานไม่ครอบ เช่น "สัปดาห์ที่ 24 / 2569")
     */
    label?: React.ReactNode;
    /** Hook เพิ่มเติมเมื่อกด ‹ (ทำงานร่วมกับ onChange ได้) */
    onPrev?: () => void;
    /** Hook เพิ่มเติมเมื่อกด › (ทำงานร่วมกับ onChange ได้) */
    onNext?: () => void;
    /** Override การ disable อัตโนมัติจาก minDate */
    prevDisabled?: boolean;
    /** Override การ disable อัตโนมัติจาก maxDate */
    nextDisabled?: boolean;
    /** aria-label ปุ่ม ‹ */
    prevLabel?: string;
    /** aria-label ปุ่ม › */
    nextLabel?: string;
  };

/** ตัด Date ลงเหลือจุดเริ่มของ unit (เดือน → วันที่ 1, วัน → เที่ยงคืน). */
function startOfUnit(date: Date, unit: DateNavigatorUnit): Date {
  return unit === "month"
    ? new Date(date.getFullYear(), date.getMonth(), 1)
    : new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addUnit(date: Date, unit: DateNavigatorUnit, amount: number): Date {
  return unit === "month"
    ? new Date(date.getFullYear(), date.getMonth() + amount, 1)
    : new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

/**
 * `‹ label ›` stepper สำหรับเลื่อนเดือน/วัน
 *
 * 2 โหมด:
 * - **Controlled (แนะนำ):** ส่ง `value` + `onChange` — format ไทย/พ.ศ. ให้เอง
 *   ผ่าน Intl ตาม `locale` และ step ตาม `unit`
 * - **Manual:** ส่ง `label` + `onPrev`/`onNext` — ควบคุมเองทั้งหมด
 */
const DateNavigator = React.forwardRef<HTMLDivElement, DateNavigatorProps>(
  function DateNavigator(
    {
      className,
      size,
      value,
      onChange,
      unit = "month",
      locale = "th-TH",
      minDate,
      maxDate,
      label,
      onPrev,
      onNext,
      prevDisabled,
      nextDisabled,
      prevLabel = "ก่อนหน้า",
      nextLabel = "ถัดไป",
      ...props
    },
    ref,
  ) {
    const formatter = React.useMemo(
      () =>
        new Intl.DateTimeFormat(
          locale,
          unit === "month"
            ? { month: "long", year: "numeric" }
            : { weekday: "long", day: "numeric", month: "long" },
        ),
      [locale, unit],
    );

    const current = value ? startOfUnit(value, unit) : undefined;
    const displayLabel = label ?? (current ? formatter.format(current) : "");

    const canStep = (amount: number) => {
      if (!current) return true;
      const target = addUnit(current, unit, amount);
      if (amount < 0 && minDate && target < startOfUnit(minDate, unit)) {
        return false;
      }
      if (amount > 0 && maxDate && target > startOfUnit(maxDate, unit)) {
        return false;
      }
      return true;
    };

    const step = (amount: number) => {
      if (current && onChange) onChange(addUnit(current, unit, amount));
      (amount < 0 ? onPrev : onNext)?.();
    };

    const isPrevDisabled = prevDisabled ?? !canStep(-1);
    const isNextDisabled = nextDisabled ?? !canStep(1);

    const arrowClass =
      "flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4";
    return (
      <div
        ref={ref}
        className={cn(dateNavigatorVariants({ size }), className)}
        {...props}
      >
        <button
          type="button"
          aria-label={prevLabel}
          disabled={isPrevDisabled}
          onClick={() => step(-1)}
          className={arrowClass}
        >
          <ChevronLeft />
        </button>
        <span className="min-w-28 text-center text-sm font-semibold text-text-primary">
          {displayLabel}
        </span>
        <button
          type="button"
          aria-label={nextLabel}
          disabled={isNextDisabled}
          onClick={() => step(1)}
          className={arrowClass}
        >
          <ChevronRight />
        </button>
      </div>
    );
  },
);

DateNavigator.displayName = "DateNavigator";

export { DateNavigator };
