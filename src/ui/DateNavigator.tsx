import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";
import { Button } from "./Button";
import { Calendar, startOfMonth, type CalendarProps } from "./Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../overlay/Popover";

/* 📐 ทรงยึดตาม `NavigatorShell` ของ Mediwork (ตัวเดียวกับที่หน้า productivity ใช้):
 * สูง 40 · มุม 8 · ขอบ 1px `#E5E7EB` · พื้นขาว · **มีเส้นคั่นตั้งขนาบตรงกลาง**
 * ลูกศรเต็มความสูง ไม่มีมุมโค้ง — ไม่ใช่ปุ่มกลมลอยแบบของเดิมที่นี่ */
const dateNavigatorVariants = cva(
  "inline-flex items-stretch overflow-hidden rounded-lg border border-border-default bg-bg-default",
  {
    variants: {
      size: { sm: "h-9", md: "h-10" },
      fullWidth: { true: "w-full" },
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
    /** เรียกพร้อม Date ใหม่เมื่อกด ‹ › หรือเลือกจากปฏิทิน */
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
     *
     * ของจริงในหน้า productivity ใส่สองส่วนในบรรทัดเดียว ("18 ส.ค. 2569 · เวรบ่าย")
     * โดยครึ่งหลังเป็นสีแบรนด์ — รับ ReactNode จึงทำแบบนั้นได้
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

    /* ── ปฏิทิน ─────────────────────────────────────────────── */
    /**
     * กดตรงกลางแล้วเปิดปฏิทิน
     *
     * `unit="month"` จะเปิดมาที่ตาราง 12 เดือนและเลือกจบที่เดือนเลย
     * @default false — ตัวเลื่อนแบบอ่านอย่างเดียวยังมีอยู่จริง (การ์ดตารางแพทย์)
     */
    calendar?: boolean;
    /** หัวข้อเหนือปฏิทิน — ไม่ส่งก็ไม่มี */
    calendarTitle?: React.ReactNode;
    /**
     * เนื้อหาเพิ่มใต้ปฏิทิน — เช่นแถวปุ่มเลือกเวรของหน้า productivity
     *
     * DS ไม่รู้จักเวร/แผนก/อะไรก็ตามที่แอปเอามาวาง จึงเป็นสล็อตเปล่า
     * state ของสิ่งที่วางเป็นของผู้เรียกทั้งหมด
     */
    children?: React.ReactNode;
    /**
     * มีข้อความนี้ = **โหมดร่าง** — เลือกวันแล้วยังไม่ commit จนกดปุ่มนี้
     *
     * ใช้เมื่อ popover มีมากกว่าวันที่ (เช่นวัน + เวร) เพราะถ้า commit ทันที
     * ที่กดวัน หน้าจอข้างหลังจะโหลดใหม่ทั้งที่ผู้ใช้ยังเลือกไม่ครบคู่
     * ไม่ส่ง = กดวันแล้ว commit และปิดทันที (แบบ DatePicker)
     */
    confirmLabel?: React.ReactNode;
    /** เรียกตอนกดปุ่มยืนยัน · ไม่ส่งจะ fallback ไปที่ `onChange` */
    onConfirm?: (date: Date) => void;
    /** คุมการเปิด/ปิดปฏิทินเอง */
    calendarOpen?: boolean;
    onCalendarOpenChange?: (open: boolean) => void;
    /** ส่งต่อให้ `Calendar` (เช่น `weekStartsOn`, `labels`) */
    calendarProps?: Omit<
      CalendarProps,
      "month" | "onMonthChange" | "selected" | "onSelect" | "minDate" | "maxDate"
    >;
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
 * `‹ label ›` stepper สำหรับเลื่อนเดือน/วัน — กดตรงกลางเปิดปฏิทินได้
 *
 * 2 โหมดของ label:
 * - **Controlled (แนะนำ):** ส่ง `value` + `onChange` — format ไทย/พ.ศ. ให้เอง
 *   ผ่าน Intl ตาม `locale` และ step ตาม `unit`
 * - **Manual:** ส่ง `label` + `onPrev`/`onNext` — ควบคุมเองทั้งหมด
 */
const DateNavigator = React.forwardRef<HTMLDivElement, DateNavigatorProps>(
  function DateNavigator(
    {
      className,
      size,
      fullWidth,
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
      calendar,
      calendarTitle,
      children,
      confirmLabel,
      onConfirm,
      calendarOpen,
      onCalendarOpenChange,
      calendarProps,
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

    /* ── สถานะปฏิทิน ─────────────────────────────────────────── */
    const [internalOpen, setInternalOpen] = React.useState(false);
    const open = calendarOpen ?? internalOpen;
    const setOpen = (next: boolean) => {
      if (calendarOpen === undefined) setInternalOpen(next);
      onCalendarOpenChange?.(next);
    };

    const isDraft = confirmLabel != null;
    /* ร่าง = สิ่งที่เลือกไว้แต่ยังไม่ commit · ตั้งค่าใหม่ทุกครั้งที่เปิด
     * จากค่าปัจจุบัน ไม่ใช่ค่าที่ค้างจากรอบก่อน */
    const [draft, setDraft] = React.useState<Date | undefined>(current);
    const [month, setMonth] = React.useState<Date>(
      () => startOfMonth(current ?? new Date()),
    );

    const openCalendar = () => {
      setDraft(current);
      setMonth(startOfMonth(current ?? new Date()));
      setOpen(true);
    };

    const pick = (day: Date) => {
      if (isDraft) {
        setDraft(day);
        return;
      }
      onChange?.(unit === "month" ? startOfMonth(day) : day);
      setOpen(false);
    };

    const confirm = () => {
      const picked = draft ?? current;
      if (picked) (onConfirm ?? onChange)?.(picked);
      setOpen(false);
    };

    const arrowClass =
      "flex w-6 shrink-0 cursor-pointer items-center justify-center text-text-body transition-colors hover:bg-overlay-hover disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand/40 [&_svg]:size-5";
    /* เส้นคั่นตั้งขนาบตรงกลาง — จุดที่ทำให้ทรงนี้ต่างจาก "ปุ่มลูกศรสองข้าง" เฉย ๆ */
    const ruleClass = "w-px shrink-0 self-stretch bg-border-default";
    const centreClass =
      "flex min-w-0 flex-1 items-center justify-center px-3 text-center text-body-sm font-semibold text-text-black";

    const centre = calendar ? (
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={openCalendar}
          aria-haspopup="dialog"
          aria-expanded={open}
          className={cn(
            centreClass,
            "min-w-28 cursor-pointer transition-colors hover:bg-overlay-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand/40",
          )}
        >
          <span className="truncate">{displayLabel}</span>
        </button>
      </PopoverTrigger>
    ) : (
      <span className={cn(centreClass, "min-w-28")}>{displayLabel}</span>
    );

    const shell = (
      <div
        ref={ref}
        className={cn(
          dateNavigatorVariants({ size, fullWidth }),
          className,
        )}
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
        <span aria-hidden className={ruleClass} />
        {centre}
        <span aria-hidden className={ruleClass} />
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

    if (!calendar) return shell;

    return (
      <Popover open={open} onOpenChange={setOpen}>
        {shell}
        <PopoverContent
          align="center"
          sideOffset={8}
          /* เงาใช้ `shadow-lg` ที่ `PopoverContent` มีอยู่แล้ว ไม่ก๊อป
           * `0 8px 24px rgba(15,23,42,.12)` ของแอปมา — ค่านั้นเป็นสีดิบ และ
           * popover ทุกตัวของ DS ควรทิ้งเงาแบบเดียวกัน */
          className="w-auto rounded-2xl p-0"
        >
          {calendarTitle != null && (
            <p className="px-4 pt-4 text-body-sm font-semibold text-text-black">
              {calendarTitle}
            </p>
          )}
          <Calendar
            {...calendarProps}
            month={month}
            onMonthChange={setMonth}
            selected={isDraft ? draft : current}
            minDate={minDate}
            maxDate={maxDate}
            onSelect={pick}
            locale={calendarProps?.locale ?? locale}
            defaultView={
              calendarProps?.defaultView ?? (unit === "month" ? "month" : "day")
            }
            selectMonth={calendarProps?.selectMonth ?? unit === "month"}
          />
          {(children != null || isDraft) && (
            /* กว้างเท่าปฏิทินเป๊ะ — ปล่อยให้ hug จะโดนแถวปุ่มที่ผู้เรียกวางมา
             * ดันจนลิ้นชักกว้างกว่าปฏิทิน แล้วปฏิทินจะลอยไม่เต็มกล่อง */
            <div className="w-[340px] px-4 pb-4 pt-3">
              {children}
              {isDraft && (
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={confirm}
                  className="mt-4 text-[15px] font-semibold"
                >
                  {confirmLabel}
                </Button>
              )}
            </div>
          )}
        </PopoverContent>
      </Popover>
    );
  },
);

DateNavigator.displayName = "DateNavigator";

export { DateNavigator };
