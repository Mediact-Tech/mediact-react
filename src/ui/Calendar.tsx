/** @doc ./Calendar.md */
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";

/* ─────────────────────────────────────────────────────────────────── */
/* วันที่ — คำนวณตาม local time เสมอ                                    */
/* ─────────────────────────────────────────────────────────────────── */

/** 🔴 ห้ามใช้ `toISOString()` ทำ key — มันแปลงเป็น UTC ก่อน ⇒ ไทย (UTC+7)
 * ได้วันที่ย้อนไป 1 วันทุกครั้งที่เวลาต่ำกว่า 07:00 */
export const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth() + n, 1);
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const startOfWeek = (d: Date, weekStartsOn: 0 | 1) =>
  addDays(d, -((d.getDay() - weekStartsOn + 7) % 7));

const isSameDay = (a?: Date | null, b?: Date | null) =>
  !!a &&
  !!b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/** 42 ช่อง = เดือนนั้นเติมให้ครบสัปดาห์ · คงที่ 6 แถวเสมอ ไม่งั้นความสูงของ
 * ปฏิทินกระโดดระหว่าง 5/6 แถวตอนเปลี่ยนเดือน */
const buildGrid = (month: Date, weekStartsOn: 0 | 1) => {
  const first = startOfWeek(startOfMonth(month), weekStartsOn);
  return Array.from({ length: 42 }, (_, i) => addDays(first, i));
};

/* ─────────────────────────────────────────────────────────────────── */

export type CalendarView = "day" | "month";

export type CalendarLabels = {
  prevMonth: string;
  nextMonth: string;
  prevYear: string;
  nextYear: string;
  chooseMonth: string;
};

const DEFAULT_LABELS: CalendarLabels = {
  prevMonth: "Previous month",
  nextMonth: "Next month",
  prevYear: "Previous year",
  nextYear: "Next year",
  chooseMonth: "Choose month",
};

export type CalendarProps = {
  /** เดือนที่กำลังแสดง — ผู้เรียกถือ state เอง เพื่อให้อยู่รอดตอน popover re-render */
  month: Date;
  onMonthChange: (month: Date) => void;
  /** วันที่เลือก (หรือปลายต้นของช่วง) */
  selected?: Date | null;
  /** ปลายท้ายของช่วง — ส่งมาเมื่อเลือกเป็นช่วงวัน จะวาดแถบเชื่อม */
  rangeEnd?: Date | null;
  /** พรีวิวปลายท้ายระหว่างลากเลือก — ไม่มีผลถ้าไม่ได้เลือกเป็นช่วง */
  hoverEnd?: Date | null;
  minDate?: Date | null;
  maxDate?: Date | null;
  /** ปิดวันเป็นราย ๆ นอกเหนือจากช่วง min/max (เช่นวันหยุด) */
  disabledDate?: (day: Date) => boolean;
  onSelect?: (day: Date) => void;
  onDayHover?: (day: Date | null) => void;
  /** มุมมองเริ่มต้น · `month` = เปิดมาที่ตาราง 12 เดือนเลย */
  defaultView?: CalendarView;
  /**
   * เลือกเดือนแล้วจบเลย ไม่ต้องลงไปเลือกวัน
   *
   * ใช้กับตัวเลื่อนเดือน (`DateNavigator unit="month"`) ซึ่งหน่วยของมันคือเดือน
   * ไม่ใช่วัน — ถ้าไม่มีอันนี้ผู้ใช้ต้องกดเดือนแล้วกดวันอีกทีทั้งที่วันไม่มีความหมาย
   */
  selectMonth?: boolean;
  /** BCP-47 · ค่าเริ่มต้น `th-TH` = ปี พ.ศ. อัตโนมัติ */
  locale?: string;
  /** วันแรกของสัปดาห์ · ค่าเริ่มต้น 0 = อาทิตย์ (ตรงกับของจริงในแอป) */
  weekStartsOn?: 0 | 1;
  labels?: Partial<CalendarLabels>;
  className?: string;
};

/**
 * ตารางเดือน — ฐานเดียวของ `DatePicker` และ `DateNavigator`
 *
 * 📐 ทรงยึดตาม `PickerCalendar` ของ Mediwork (หน้า productivity) ทั้งหมด:
 * กว้าง 340 · ช่องวัน 40 สูง วงกลม 34 · ตาราง 12 เดือนช่องละ 44 มุม 10
 *
 * เขียนเองไม่ได้ใช้ `react-day-picker` / `DateCalendar` ด้วยเหตุผลเดียวกับที่แอป
 * เขียนเอง: ไม่มีตัวแปลง พ.ศ. และแถบช่วงวันเป็นสิ่งที่ทั้งสองตัวไม่มี · พอเขียนเพื่อ
 * ช่วงแล้ว วันเดี่ยวก็ใช้ตัวเดียวกัน ไม่งั้นแอปจะมีปฏิทินสองแบบที่นับปีคนละอย่าง
 *
 * โครง DOM เป็น `<table role="grid">` + `<td role="gridcell" data-day="YYYY-MM-DD">`
 * ตามสัญญาเดิมของ `react-day-picker` — เทสของ `DatePicker` ที่มีอยู่จึงใช้ได้ต่อ
 */
const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  function Calendar(
    {
      month,
      onMonthChange,
      selected = null,
      rangeEnd = null,
      hoverEnd = null,
      minDate = null,
      maxDate = null,
      disabledDate,
      onSelect,
      onDayHover,
      defaultView = "day",
      selectMonth,
      locale = "th-TH",
      weekStartsOn = 0,
      labels,
      className,
    },
    ref,
  ) {
    const L = { ...DEFAULT_LABELS, ...labels };
    const [view, setView] = React.useState<CalendarView>(defaultView);

    const fmt = React.useMemo(
      () => ({
        month: new Intl.DateTimeFormat(locale, {
          month: "short",
          year: "numeric",
        }),
        monthCell: new Intl.DateTimeFormat(locale, { month: "short" }),
        year: new Intl.DateTimeFormat(locale, { year: "numeric" }),
        weekday: new Intl.DateTimeFormat(locale, { weekday: "narrow" }),
        full: new Intl.DateTimeFormat(locale, { dateStyle: "full" }),
      }),
      [locale],
    );

    const outOfBounds = (d: Date) =>
      (!!minDate && startOfDay(d) < startOfDay(minDate)) ||
      (!!maxDate && startOfDay(d) > startOfDay(maxDate)) ||
      !!disabledDate?.(d);

    const end = rangeEnd ?? (selected && hoverEnd ? hoverEnd : null);
    const isSpan = !!(selected && end && !isSameDay(selected, end));
    const grid = React.useMemo(
      () => buildGrid(month, weekStartsOn),
      [month, weekStartsOn],
    );

    /* วันที่ tab เข้าถึงได้ — ปฏิทินทั้งเดือนต้องมีจุด tab เดียว ไม่ใช่ 42 จุด */
    const [focusDay, setFocusDay] = React.useState<Date>(
      () => selected ?? startOfMonth(month),
    );
    const focusRef = React.useRef<HTMLButtonElement | null>(null);
    const shouldFocus = React.useRef(false);
    React.useEffect(() => {
      if (shouldFocus.current) {
        focusRef.current?.focus();
        shouldFocus.current = false;
      }
    });

    const moveFocus = (next: Date) => {
      shouldFocus.current = true;
      setFocusDay(next);
      if (
        next.getMonth() !== month.getMonth() ||
        next.getFullYear() !== month.getFullYear()
      ) {
        onMonthChange(startOfMonth(next));
      }
    };

    const onGridKeyDown = (e: React.KeyboardEvent) => {
      const map: Record<string, number> = {
        ArrowLeft: -1,
        ArrowRight: 1,
        ArrowUp: -7,
        ArrowDown: 7,
      };
      if (e.key in map) {
        e.preventDefault();
        moveFocus(addDays(focusDay, map[e.key]!));
        return;
      }
      if (e.key === "Home" || e.key === "End") {
        e.preventDefault();
        const from = startOfWeek(focusDay, weekStartsOn);
        moveFocus(e.key === "Home" ? from : addDays(from, 6));
        return;
      }
      if (e.key === "PageUp" || e.key === "PageDown") {
        e.preventDefault();
        const delta = e.key === "PageUp" ? -1 : 1;
        const target = new Date(
          focusDay.getFullYear(),
          focusDay.getMonth() + delta,
          focusDay.getDate(),
        );
        moveFocus(target);
      }
    };

    /* มุมมองเดือน: ลูกศรเลื่อนทีละปี — หน่วยที่ผู้ใช้กำลังมองอยู่ */
    const stepMonth = (dir: -1 | 1) =>
      onMonthChange(addMonths(month, view === "day" ? dir : dir * 12));

    /* ⚠️ ของจริงใช้ `#F1F5F9` ซึ่ง DS ไม่มี token ตรง — ใช้ `overlay/hover`
     * (ดำ 5% ≈ `#f2f2f2` บนพื้นขาว) แทน เป็น token ที่ตั้งใจไว้ให้ใช้กับพื้นแบบนี้
     * และไม่พึ่งชื่อที่ชนกับ palette ของ Tailwind */
    const navClass =
      "flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-overlay-hover text-text-body transition-colors hover:bg-overlay-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 [&_svg]:size-[18px]";

    return (
      <div ref={ref} className={cn("w-[340px] p-4 pb-0", className)}>
        {/* หัวปฏิทิน — ‹ เดือน ปี › · ชื่อเดือนคือทางเข้าไปมุมมอง 12 เดือน */}
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            aria-label={view === "day" ? L.prevMonth : L.prevYear}
            onClick={() => stepMonth(-1)}
            className={navClass}
          >
            <ChevronLeft />
          </button>

          <button
            type="button"
            aria-label={L.chooseMonth}
            aria-expanded={view === "month"}
            onClick={() => setView(view === "day" ? "month" : "day")}
            className="cursor-pointer rounded-lg px-2 py-1 text-[15px] font-bold text-text-black transition-colors hover:bg-overlay-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            {view === "day" ? fmt.month.format(month) : fmt.year.format(month)}
          </button>

          <button
            type="button"
            aria-label={view === "day" ? L.nextMonth : L.nextYear}
            onClick={() => stepMonth(1)}
            className={navClass}
          >
            <ChevronRight />
          </button>
        </div>

        {view === "month" ? (
          <div className="grid grid-cols-3 gap-2 pb-2">
            {Array.from({ length: 12 }, (_, i) => {
              const cell = new Date(month.getFullYear(), i, 1);
              const isCurrent = month.getMonth() === i;
              return (
                <button
                  key={i}
                  type="button"
                  aria-pressed={isCurrent}
                  onClick={() => {
                    onMonthChange(cell);
                    if (selectMonth) onSelect?.(cell);
                    else setView("day");
                  }}
                  className={cn(
                    "h-11 cursor-pointer rounded-[10px] text-body-sm transition-colors",
                    isCurrent
                      ? "bg-brand font-bold text-brand-foreground"
                      : "bg-overlay-hover text-text-black hover:bg-overlay-press",
                  )}
                >
                  {fmt.monthCell.format(cell)}
                </button>
              );
            })}
          </div>
        ) : (
          /* 🔴 ระยะระหว่างแถว 4 มาจาก `rowGap` ของตารางจริง — `border-collapse`
           * ทำแบบนั้นไม่ได้ ต้อง `border-separate` + `border-spacing`
           * ถ้าไม่มี ระยะห่างแถวหายไป 4 ทุกแถว = ปฏิทินเตี้ยลง 24 และแถบช่วงวัน
           * กลายเป็นก้อนทึบแทนที่จะเป็นแถบต่อแถว */
          <table
            role="grid"
            /* `-mt-1` หักระยะ 4 ที่ `border-spacing` แถมไว้ **เหนือ**แถวแรก ซึ่ง
             * `rowGap` ของตารางจริงไม่มี · ของที่แถมไว้ใต้แถวสุดท้ายอีก 4 ปล่อยไว้
             * (`-mb-1` ไม่มีผลเพราะ margin collapse ออกนอกกล่องที่ `pb-0`)
             * ⇒ สูงกว่าของจริง 4 ที่ก้นปฏิทิน ซึ่งอยู่ในช่องว่างของ popover อยู่แล้ว */
            className="-mt-1 w-full border-separate border-spacing-x-0 border-spacing-y-1"
            onKeyDown={onGridKeyDown}
          >
            <thead>
              <tr>
                {grid.slice(0, 7).map((d) => (
                  <th
                    key={d.getDay()}
                    scope="col"
                    abbr={fmt.full.format(d)}
                    className="py-1 text-center text-caption font-normal text-text-tertiary"
                  >
                    {fmt.weekday.format(d)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }, (_, row) => (
                <tr key={row}>
                  {grid.slice(row * 7, row * 7 + 7).map((day) => {
                    /* 🔴 วันของเดือนข้างเคียงวาดไว้ (ไม่งั้นตารางกระโดด 5↔6 แถว)
                     * แต่ **กดไม่ได้** — กด "26" ตอนดูเดือน พ.ค. แล้วเด้งไปเมษายน
                     * ผู้ใช้จะอ่านว่าปฏิทินทำอย่างอื่น */
                    const outside = day.getMonth() !== month.getMonth();
                    const disabled = outside || outOfBounds(day);
                    const isStart = isSameDay(day, selected);
                    const isEnd = isSameDay(day, end);
                    const edge = isStart || isEnd;
                    const between =
                      !!selected &&
                      !!end &&
                      startOfDay(day) > startOfDay(selected) &&
                      startOfDay(day) < startOfDay(end);
                    const isFocus = isSameDay(day, focusDay);

                    return (
                      <td
                        key={dayKey(day)}
                        role="gridcell"
                        data-day={dayKey(day)}
                        aria-selected={edge || undefined}
                        /* แถบช่วงทาบทั้งช่องและวงกลมข้างใน เพื่อให้ช่วงหลายวัน
                         * อ่านเป็นแถบเดียวต่อเนื่อง ไม่ใช่วงกลมเรียงกัน */
                        className={cn(
                          "h-10 p-0 text-center align-middle",
                          (between || (edge && isSpan)) && "bg-brand-subtle",
                          isStart && isSpan && "rounded-l-full",
                          isEnd && isSpan && "rounded-r-full",
                        )}
                      >
                        <button
                          type="button"
                          ref={isFocus ? focusRef : undefined}
                          tabIndex={isFocus ? 0 : -1}
                          disabled={disabled}
                          aria-label={fmt.full.format(day)}
                          onClick={() => {
                            setFocusDay(day);
                            onSelect?.(day);
                          }}
                          onMouseEnter={() =>
                            !disabled && onDayHover?.(day)
                          }
                          onMouseLeave={() => onDayHover?.(null)}
                          className={cn(
                            "size-[34px] rounded-full text-body-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
                            edge
                              ? "bg-brand font-bold text-brand-foreground"
                              : disabled
                                ? "cursor-default text-text-disabled"
                                : "cursor-pointer text-text-black hover:bg-overlay-hover",
                          )}
                        >
                          {day.getDate()}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  },
);

Calendar.displayName = "Calendar";

export { Calendar, isSameDay, startOfMonth, addMonths };
