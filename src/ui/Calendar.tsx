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

export type CalendarView = "day" | "month" | "year";

export type CalendarLabels = {
  prevMonth: string;
  nextMonth: string;
  prevYear: string;
  nextYear: string;
  chooseMonth: string;
  /** ปุ่มหัวปฏิทินตอนอยู่มุมมอง 12 เดือน — กดแล้วไปตารางปี */
  chooseYear: string;
  /** ลูกศรในมุมมองปี — เลื่อนทีละ 12 ปี ไม่ใช่ทีละปี */
  prevYears: string;
  nextYears: string;
};

const DEFAULT_LABELS: CalendarLabels = {
  prevMonth: "Previous month",
  nextMonth: "Next month",
  prevYear: "Previous year",
  nextYear: "Next year",
  chooseMonth: "Choose month",
  chooseYear: "Choose year",
  prevYears: "Previous years",
  nextYears: "Next years",
};

/** จำนวนปีต่อหน้าในมุมมองปี
 *
 * 12 ไม่ใช่เลขสุ่ม — เท่ากับจำนวนช่องของตาราง 12 เดือนพอดี ⇒ ตารางปีใช้ทรงเดียวกัน
 * (3 คอลัมน์ × 4 แถว) **ความสูงของ popover จึงไม่กระโดดตอนสลับมุมมอง** */
const YEARS_PER_PAGE = 12;

/** ทรงของช่องในตาราง 12 ช่อง — เดือนกับปีใช้ร่วมกัน
 *
 * 🔴 แยกออกมาเพราะสองตารางนี้ต้องเท่ากันเสมอ ถ้าต่างคนต่างถือ class มันจะเพี้ยน
 * ออกจากกันแบบเงียบ ๆ (บทเรียนเดียวกับ checkbox/radio ที่ `ui/toggle-parts.tsx` แก้) */
const GRID_CELL_BASE = "h-11 rounded-[10px] text-body-sm transition-colors";
/* 🔴 **ขาวตายตัว ⛔ ไม่ใช่ `text-brand-foreground`** (ผู้ใช้เคาะ 2026-08-18 จากจอ Mediwork จริง)
 * — theme ของ Mediwork ตั้ง `brand-foreground` เป็น `neutral-900` โดยตั้งใจ เพราะขาวบน
 * เขียวมิ้นต์วัดได้ **1.93:1** · ผลคือช่องเดือนที่เลือกอยู่เป็นตัวหนังสือเกือบดำที่นั่น
 * ขณะที่อีก 3 แอปเป็นขาว ⇒ ตัวควบคุมเดียวกันดูคนละสถานะกันคนละแอป
 * **ราคาที่รับ: contrast ของช่องที่เลือกบน Mediwork ต่ำกว่าเกณฑ์** — ยอมได้เพราะสถานะนี้
 * ยังอ่านออกจาก *พื้นสี* ไม่ได้พึ่งตัวอักษรอย่างเดียว (ช่องอื่นพื้นเทาอ่อนหมด) */
const GRID_CELL_SELECTED = "cursor-pointer bg-brand font-bold text-white";
const GRID_CELL_IDLE =
  "cursor-pointer bg-overlay-hover text-text-black hover:bg-overlay-press";
/** นอกขอบ `minDate`/`maxDate` หรือถูก `disabledMonth` ปิด
 *
 * ⛔ **ห้าม `pointer-events-none`** — มันตัด hit-test ทิ้ง เมาส์จึงไม่เคย "อยู่บน" ช่อง
 * และ `cursor-not-allowed` ก็ไม่มีวันทำงาน · `disabled` ของปุ่มกันการกดอยู่แล้ว */
const GRID_CELL_DISABLED =
  "cursor-not-allowed bg-overlay-hover/40 text-text-muted";

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
  /**
   * ปิด **เดือน** เป็นราย ๆ ในตาราง 12 เดือน — คู่ขนานกับ `disabledDate` ของมุมมองวัน
   *
   * 🔑 มีไว้เพราะ `minDate`/`maxDate` ปิดได้แค่หัวท้าย ส่วนชุดเดือนที่เลือกได้จริง
   * **ไม่จำเป็นต้องต่อเนื่อง** — ตัวเลื่อนงวดมีเดือนที่ไม่มีงวดคั่นกลางได้ และเดือนแบบนั้น
   * ต้องกดไม่ได้ ไม่ใช่กดแล้วเงียบ
   *
   * รับ `Date` ที่เป็นวันที่ 1 ของเดือนเสมอ
   */
  disabledMonth?: (month: Date) => boolean;
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
  /**
   * วันที่ถือว่าเป็น "วันนี้" — วาดเป็น **วงแหวน ไม่ใช่วงกลมทึบ**
   *
   * 🔴 เป็นแค่ *ป้ายบอกตำแหน่ง* ไม่ใช่ค่าที่ถูกเลือก — ปฏิทินที่ไม่มีจุดอ้างอิงนี้
   * พอเลื่อนไปสองสามเดือนแล้วผู้ใช้ไม่รู้ว่าตัวเองอยู่ตรงไหนเทียบกับปัจจุบัน
   * ⇒ ทรงต้องต่างจากวันที่เลือกชัดเจน (ทึบ = ที่คุณเลือก · วงแหวน = วันนี้)
   * และถ้าวันนี้ถูกเลือกอยู่ด้วย **ทึบชนะ** ไม่ซ้อนสองสถานะบนช่องเดียว
   *
   * ⚠️ ส่ง `null` เพื่อปิด — จำเป็นกับ story/ภาพเทียบ visual ที่ต้องนิ่ง เพราะค่า
   * เริ่มต้นคือ `new Date()` ซึ่งขยับทุกวัน (กับดักเดียวกับที่ `DatePicker.stories`
   * เขียนเตือนไว้ว่า story ที่ผูกกับ `new Date()` จะให้ภาพต่างทุกเดือน)
   *
   * @default วันนี้ตามเครื่องผู้ใช้
   */
  today?: Date | null;
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
      disabledMonth,
      onSelect,
      onDayHover,
      defaultView = "day",
      selectMonth,
      today,
      locale = "th-TH",
      weekStartsOn = 0,
      labels,
      className,
    },
    ref,
  ) {
    const L = { ...DEFAULT_LABELS, ...labels };
    const [view, setView] = React.useState<CalendarView>(defaultView);

    /* `undefined` = ยังไม่ระบุ ⇒ ใช้วันนี้จริง · `null` = สั่งปิดป้ายวันนี้
     * แยกสองความหมายนี้ออกจากกันโดยตั้งใจ ไม่งั้นปิดไม่ได้เลย
     *
     * อ่านครั้งเดียวตอน mount — ปฏิทินที่เปิดค้างข้ามเที่ยงคืนแล้ววงแหวนกระโดดเอง
     * เป็นเรื่องที่ไม่มีใครขอ และการ re-render ทุกครั้งด้วย `new Date()` สด ๆ
     * ทำให้ผลลัพธ์ขึ้นกับจังหวะ render ซึ่งเทสจับไม่ได้ */
    const [todayValue] = React.useState(() =>
      today === undefined ? new Date() : today,
    );
    const todayDate = today === undefined ? todayValue : today;

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

    /* เลขลำดับเดือนบนเส้นเวลา — เทียบเดือนกับเดือนโดยไม่ต้องสน "วันที่เท่าไร"
     * (`minDate = 15 ส.ค.` ไม่ได้แปลว่าเดือน ส.ค. ทั้งเดือนถูกปิด) */
    const monthIndexOf = (d: Date) => d.getFullYear() * 12 + d.getMonth();

    const monthOutOfBounds = (d: Date) => {
      const i = monthIndexOf(d);
      return (
        (!!minDate && i < monthIndexOf(minDate)) ||
        (!!maxDate && i > monthIndexOf(maxDate)) ||
        !!disabledMonth?.(startOfMonth(d))
      );
    };

    /* ปีปิดก็ต่อเมื่อ **ทุกเดือนในปีนั้นปิด** ⛔ ไม่ใช่กฎชุดที่สองที่ดู min/max เอง —
     * มีสองสูตรเมื่อไหร่ก็มีที่ให้ตอบไม่ตรงกันเมื่อนั้น (ตารางปีบอกว่าเข้าได้
     * แล้วเข้าไปเจอ 12 ช่องเทาล้วน) · 12 ครั้ง × 12 ช่อง เกิดเฉพาะตอนอยู่มุมมองปี */
    const yearOutOfBounds = (d: Date) => {
      const year = d.getFullYear();
      for (let m = 0; m < 12; m += 1) {
        if (!monthOutOfBounds(new Date(year, m, 1))) return false;
      }
      return true;
    };

    /* ลูกศรพาไปหน้าไหน แล้วหน้านั้นยังมีอะไรให้เลือกไหม
     *
     * 🔴 ดูแค่ `minDate`/`maxDate` ⛔ ไม่ดู `disabledMonth` — ช่องว่างที่**อยู่ตรงกลาง**
     * ต้องเดินผ่านได้ ไม่งั้นเดือนที่มีข้อมูลอยู่อีกฝั่งของช่องว่างจะไปไม่ถึงเลย */
    const canStep = (dir: -1 | 1) => {
      const target = addMonths(
        month,
        dir *
          (view === "day" ? 1 : view === "month" ? 12 : 12 * YEARS_PER_PAGE),
      );
      let from: number;
      let to: number;
      if (view === "day") {
        from = to = monthIndexOf(target);
      } else if (view === "month") {
        from = monthIndexOf(new Date(target.getFullYear(), 0, 1));
        to = from + 11;
      } else {
        const pageStart =
          Math.floor(target.getFullYear() / YEARS_PER_PAGE) * YEARS_PER_PAGE;
        from = monthIndexOf(new Date(pageStart, 0, 1));
        to = monthIndexOf(new Date(pageStart + YEARS_PER_PAGE - 1, 11, 1));
      }
      if (minDate && to < monthIndexOf(minDate)) return false;
      if (maxDate && from > monthIndexOf(maxDate)) return false;
      return true;
    };

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

    /* ลูกศรเลื่อน "ทีละหนึ่งหน้าของสิ่งที่กำลังมองอยู่" เสมอ —
     * วัน→เดือน · เดือน→ปี · ปี→ช่วง 12 ปี */
    const stepMonth = (dir: -1 | 1) =>
      onMonthChange(
        addMonths(
          month,
          view === "day"
            ? dir
            : view === "month"
              ? dir * 12
              : dir * 12 * YEARS_PER_PAGE,
        ),
      );

    /* หน้าปีจัดเป็นบล็อกตายตัวตามปีจริง (…, 2556–2567, 2568–2579, …)
     * ไม่ใช่ "12 ปีนับจากปีที่เลือก" — ไม่งั้นกดลูกศรไป-กลับแล้วได้คนละช่วงทุกครั้ง */
    const yearPageStart =
      Math.floor(month.getFullYear() / YEARS_PER_PAGE) * YEARS_PER_PAGE;

    /* ตัวเลขปีล้วน — ไม่เอาคำนำหน้า "พ.ศ." ซ้ำอีก 12 ครั้งในตาราง (หัวปฏิทินบอกช่วงอยู่แล้ว)
     *
     * 🔴 ต้องดึงผ่าน `formatToParts` ไม่ใช่ `getFullYear()` — ปีที่ต้องแสดงคือปีของ
     * **ปฏิทินตาม locale** (th-TH = 2569) ส่วน `getFullYear()` คืนปี ค.ศ. เสมอ (2026)
     * ⇒ ใช้ตรง ๆ จะได้ตารางปี ค.ศ. อยู่ใต้หัวข้อ พ.ศ. ซึ่งเป็นบั๊ก "นับปีคนละอย่าง"
     * ตัวเดียวกับที่ทั้งไฟล์นี้มีไว้เพื่อกำจัด */
    const yearCellLabel = (d: Date) =>
      fmt.year.formatToParts(d).find((p) => p.type === "year")?.value ??
      String(d.getFullYear());

    const yearRangeLabel = () => {
      const first = new Date(yearPageStart, 0, 1);
      const last = new Date(yearPageStart + YEARS_PER_PAGE - 1, 0, 1);
      /* `formatRange` ยุบคำนำหน้าซ้ำให้เอง ("พ.ศ. 2556–2567" ไม่ใช่
       * "พ.ศ. 2556 – พ.ศ. 2567") · ไม่ใช่ทุก runtime ที่มี (happy-dom ในเทสไม่มี)
       * ⇒ มี fallback ที่อ่านออกเหมือนกัน แค่ยาวกว่า */
      try {
        return fmt.year.formatRange(first, last);
      } catch {
        return `${fmt.year.format(first)} – ${fmt.year.format(last)}`;
      }
    };

    const headerLabel =
      view === "day"
        ? fmt.month.format(month)
        : view === "month"
          ? fmt.year.format(month)
          : yearRangeLabel();

    /* หัวปฏิทินพาขึ้นไปทีละชั้น: วัน → 12 เดือน → 12 ปี
     * แล้ว **ถอยกลับทีละชั้น** ไม่ใช่วนรวดไปมุมมองวัน
     *
     * 🔴 เคยเขียนให้ปีวนกลับไปวันเลย แล้วป้าย a11y ของปุ่มหัวโกหกทันที — มันบอกว่า
     * "Choose month" ทั้งที่กดแล้วเด้งไปตารางวัน · ป้ายที่ตรงกับสิ่งที่จะเกิดขึ้นจริง
     * สำคัญกว่าการประหยัดคลิก และการลงจากปีไปเดือนก็คือเส้นทางที่ผู้ใช้เพิ่งเดินขึ้นมา
     * (ลงถึงวันได้ด้วยการกดเดือน ซึ่งเป็นขั้นที่ต้องเลือกอยู่แล้ว) */
    const nextView: Record<CalendarView, CalendarView> = {
      day: "month",
      month: "year",
      year: "month",
    };

    /* ⚠️ ของจริงใช้ `#F1F5F9` ซึ่ง DS ไม่มี token ตรง — ใช้ `overlay/hover`
     * (ดำ 5% ≈ `#f2f2f2` บนพื้นขาว) แทน เป็น token ที่ตั้งใจไว้ให้ใช้กับพื้นแบบนี้
     * และไม่พึ่งชื่อที่ชนกับ palette ของ Tailwind */
    const navClass =
      "flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-overlay-hover text-text-body transition-colors hover:bg-overlay-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-overlay-hover [&_svg]:size-[18px]";

    return (
      <div ref={ref} className={cn("w-[340px] p-4 pb-0", className)}>
        {/* หัวปฏิทิน — ‹ เดือน ปี › · ชื่อเดือนคือทางเข้าไปมุมมอง 12 เดือน */}
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            aria-label={
              view === "day"
                ? L.prevMonth
                : view === "month"
                  ? L.prevYear
                  : L.prevYears
            }
            disabled={!canStep(-1)}
            onClick={() => stepMonth(-1)}
            className={navClass}
          >
            <ChevronLeft />
          </button>

          <button
            type="button"
            aria-label={view === "month" ? L.chooseYear : L.chooseMonth}
            aria-expanded={view !== "day"}
            onClick={() => setView(nextView[view])}
            className="cursor-pointer rounded-lg px-2 py-1 text-[15px] font-bold text-text-black transition-colors hover:bg-overlay-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            {headerLabel}
          </button>

          <button
            type="button"
            aria-label={
              view === "day"
                ? L.nextMonth
                : view === "month"
                  ? L.nextYear
                  : L.nextYears
            }
            disabled={!canStep(1)}
            onClick={() => stepMonth(1)}
            className={navClass}
          >
            <ChevronRight />
          </button>
        </div>

        {view === "year" ? (
          /* ตารางปี — ทรงเดียวกับตารางเดือนเป๊ะ (3 คอลัมน์ × 4 แถว) ⇒ สลับมุมมอง
           * แล้วกล่องไม่กระโดด · เลือกปีแล้วลงไปมุมมองเดือนต่อ ไม่ใช่จบเลย เพราะ
           * หน่วยที่ผู้ใช้กำลังหาคือ "วัน" ปีเป็นแค่ทางผ่าน */
          <div className="grid grid-cols-3 gap-2 pb-2">
            {Array.from({ length: YEARS_PER_PAGE }, (_, i) => {
              const year = yearPageStart + i;
              const cell = new Date(year, month.getMonth(), 1);
              const isCurrent = month.getFullYear() === year;
              const isDisabled = yearOutOfBounds(cell);
              return (
                <button
                  key={year}
                  type="button"
                  aria-pressed={isCurrent}
                  disabled={isDisabled}
                  onClick={() => {
                    onMonthChange(cell);
                    setView("month");
                  }}
                  className={cn(
                    GRID_CELL_BASE,
                    isDisabled
                      ? GRID_CELL_DISABLED
                      : isCurrent
                        ? GRID_CELL_SELECTED
                        : GRID_CELL_IDLE,
                  )}
                >
                  {yearCellLabel(cell)}
                </button>
              );
            })}
          </div>
        ) : view === "month" ? (
          <div className="grid grid-cols-3 gap-2 pb-2">
            {Array.from({ length: 12 }, (_, i) => {
              const cell = new Date(month.getFullYear(), i, 1);
              const isCurrent = month.getMonth() === i;
              const isDisabled = monthOutOfBounds(cell);
              return (
                <button
                  key={i}
                  type="button"
                  aria-pressed={isCurrent}
                  disabled={isDisabled}
                  onClick={() => {
                    onMonthChange(cell);
                    if (selectMonth) onSelect?.(cell);
                    else setView("day");
                  }}
                  className={cn(
                    GRID_CELL_BASE,
                    isDisabled
                      ? GRID_CELL_DISABLED
                      : isCurrent
                        ? GRID_CELL_SELECTED
                        : GRID_CELL_IDLE,
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
                    /* วันของเดือนข้างเคียงไม่ต้องติดป้าย — มันจางและกดไม่ได้อยู่แล้ว
                     * วงแหวนบนช่องที่กดไม่ได้อ่านเป็น "กดได้แต่ยังไม่ได้เลือก" */
                    const isToday = !outside && isSameDay(day, todayDate);

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
                          /* โปรแกรมอ่านหน้าจอประกาศ "วันปัจจุบัน" ให้เอง —
                             วงแหวนอย่างเดียวสื่อได้แค่กับคนที่มองเห็น */
                          aria-current={isToday ? "date" : undefined}
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
                            /* `cursor-pointer` ต้องอยู่ **ทุกสาขาที่กดได้** — เดิมมีแค่สาขาปกติ
                             * ⇒ วันที่เป็นขอบของช่วงที่เลือกไว้ (ยังกดเปลี่ยนได้) ได้ลูกศรปกติ */
                            edge
                              ? "cursor-pointer bg-brand font-bold text-brand-foreground"
                              : disabled
                                ? "cursor-default text-text-disabled"
                                : "cursor-pointer text-text-black hover:bg-overlay-hover",
                            /* วันนี้ = วงแหวน · ที่เลือก = ทึบ · ถ้าเป็นวันเดียวกัน
                             * ทึบชนะ (ไม่ซ้อนสองสถานะบนช่องเดียวจนอ่านไม่ออกว่าอันไหนคืออะไร)
                             * `ring-inset` เพื่อไม่ให้วงแหวนล้นออกไปทับช่องข้าง ๆ ในแถบช่วงวัน */
                            isToday && !edge && "ring-1 ring-inset ring-brand font-bold",
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
