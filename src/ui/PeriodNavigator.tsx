/** @doc ./PeriodNavigator.md */
import * as React from "react";
import { DateNavigator, type DateNavigatorProps } from "./DateNavigator";
import { Text } from "./Text";

/* ─────────────────────────────────────────────────────────────────── */

/**
 * งวดหนึ่งในรายการ — **แถวที่หลังบ้านให้มา** ⛔ ไม่ใช่เดือนปฏิทิน
 *
 * 🔴 วันที่เป็น `YYYY-MM-DD` = **วันตามปฏิทินที่คนเห็น ไม่ใช่จุดเวลา** ⇒ แปลงด้วย
 * `parseDateOnly` เท่านั้น · `new Date("2026-08-18")` คิดบนสเกล UTC แล้วเลื่อนวัน
 * ไป 1 วันในไทย (โรคเดียวกับ `toISOString()` ที่ `Calendar.dayKey` กันไว้)
 */
export type PeriodNavigatorItem = {
  id: string | number;
  /** วันเริ่มงวด `YYYY-MM-DD` */
  startDate: string;
  /** วันตัดงวด `YYYY-MM-DD` — **เดือนของงวดอ่านจากค่านี้** */
  endDate: string;
  /**
   * ชื่องวดจากหลังบ้าน (เช่น "งวดสิงหาคม 2569")
   *
   * ใช้เป็น `title` ของป้ายกลางเท่านั้น ⛔ ไม่ใช่ตัวป้าย — ป้ายคือ *ช่วงวัน* เพราะคนที่
   * เปิดจอกำลังจะตอบว่า "ข้อมูลที่เห็นครอบวันไหนบ้าง" ซึ่งชื่อเดือนตอบไม่ได้เลยเมื่อ
   * วันตัดงวดไม่ใช่สิ้นเดือน
   */
  label?: string;
  /** ต่อท้ายป้ายกลาง เช่น "(ปิดแล้ว)" — ผู้เรียกแปลเอง */
  suffix?: string;
};

export type PeriodNavigatorLabels = {
  /** aria ของ ‹ — "งวดก่อนหน้า" ⛔ ไม่ใช่ "เดือนก่อนหน้า" */
  prev: string;
  next: string;
  /** ยังไม่มีงวดสักแถว ⇒ ป้ายกลางอ่านว่าอะไร */
  empty: string;
  /** ชื่อกลุ่มของตาราง 12 เดือน (โปรแกรมอ่านหน้าจอ) */
  monthGrid: string;
  /**
   * บรรทัดสรุปใต้ปฏิทิน — `{month}` และ `{range}` ถูกแทนที่
   *
   * มีไว้เพราะตาราง 12 เดือนบอกได้แค่ *เดือน* ซึ่งไม่ใช่ช่วงวันของงวด
   */
  footer: string;
  /** ส่งต่อให้ปฏิทิน */
  prevYear: string;
  nextYear: string;
  chooseYear: string;
  prevYears: string;
  nextYears: string;
};

const DEFAULT_LABELS: PeriodNavigatorLabels = {
  prev: "Previous period",
  next: "Next period",
  empty: "No periods yet",
  monthGrid: "Choose period by month",
  footer: "{month} · {range}",
  prevYear: "Previous year",
  nextYear: "Next year",
  chooseYear: "Choose year",
  prevYears: "Previous years",
  nextYears: "Next years",
};

/** `YYYY-MM-DD` → `Date` เที่ยงคืนตามเวลาท้องถิ่น · `null` เมื่อรูปแบบไม่ตรง */
const parseDateOnly = (value: string | null | undefined): Date | null => {
  if (!value) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
};

/** เดือนของงวด = เดือนของ **วันตัดงวด** — งวด `26 ก.ค. – 25 ส.ค.` อยู่เดือน ส.ค. */
const monthOfPeriod = (period: PeriodNavigatorItem): Date | null => {
  const end = parseDateOnly(period.endDate);
  return end ? new Date(end.getFullYear(), end.getMonth(), 1) : null;
};

/** ลำดับเดือนบนเส้นเวลา — เทียบเดือนกับเดือนโดยไม่ต้องสนวันที่ */
const monthIndexOf = (d: Date) => d.getFullYear() * 12 + d.getMonth();

/* ─────────────────────────────────────────────────────────────────── */

export type PeriodNavigatorProps = Omit<
  DateNavigatorProps,
  | "value"
  | "onChange"
  | "unit"
  | "label"
  | "minDate"
  | "maxDate"
  | "calendar"
  | "children"
  | "confirmLabel"
  | "onConfirm"
> & {
  /** รายการงวด — เรียงมาแบบไหนก็ได้ ⛔ component ไม่พึ่งลำดับ */
  periods: PeriodNavigatorItem[];
  /** `null` = ยังไม่เลือก ⇒ ป้ายกลางอ่านว่า "ยังไม่มีงวด" */
  value: string | number | null;
  onChange: (periodId: string | number) => void;
  /** BCP-47 · ค่าเริ่มต้น `th-TH` = ปี พ.ศ. อัตโนมัติ */
  locale?: string;
  labels?: Partial<PeriodNavigatorLabels>;
  /** บรรทัดสรุปใต้ปฏิทิน @default true */
  showFooter?: boolean;
  /**
   * ปิดทั้งอันชั่วคราว — ลูกศรกดไม่ได้และปฏิทินไม่เปิด **แต่ป้ายกลางยังบอกงวดเดิม**
   *
   * ใช้ตอนรายการงวดกำลังโหลดใหม่ · ⛔ ไม่ใช่การส่ง `periods={[]}` ซึ่งจะทำให้ป้ายพลิกไปเป็น
   * "ยังไม่มีงวด" ทั้งที่งวดมีอยู่ แล้วจอกะพริบทุกครั้งที่ refetch
   */
  disabled?: boolean;
};

/**
 * ตัวเลื่อน **งวด** — `‹ 26 ก.ค. – 25 ส.ค. 2569 ›` + ตาราง 12 เดือนที่กดตรงกลางแล้วเปิด
 *
 * 🔴 **งวดคือแถวในฐานข้อมูล ไม่ใช่เดือนปฏิทิน** — เดือนที่เลือกได้คือเดือนที่ *มีแถวงวดจริง*
 * เท่านั้น ⛔ ไม่ใช่การคิดขอบเองจากปฏิทิน ซึ่งจะกลายเป็นกฎชุดที่สองที่ drift จากหลังบ้าน
 *
 * 🔑 **ลูกศรเดินทีละ _งวด_ ⛔ ไม่ใช่ทีละเดือน** — เดือนหนึ่งมี 1 หรือ 2 งวดก็ได้ และเดือนที่
 * ไม่มีงวดเลยก็มีจริง · ถ้าเดินทีละเดือนแล้วหางวดไม่เจอ ปุ่มจะกลายเป็น "กดแล้วอยู่ที่เดิม"
 * ซึ่งผู้ใช้อ่านว่าจอค้าง
 */
const PeriodNavigator = React.forwardRef<HTMLDivElement, PeriodNavigatorProps>(
  function PeriodNavigator(
    {
      periods,
      value,
      onChange,
      locale = "th-TH",
      labels,
      showFooter = true,
      disabled,
      calendarProps,
      ...props
    },
    ref,
  ) {
    const L = { ...DEFAULT_LABELS, ...labels };

    const fmt = React.useMemo(
      () => ({
        full: new Intl.DateTimeFormat(locale, {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        noYear: new Intl.DateTimeFormat(locale, {
          day: "numeric",
          month: "short",
        }),
        monthCell: new Intl.DateTimeFormat(locale, { month: "short" }),
      }),
      [locale],
    );

    /** งวดที่เรียงตามเวลาจริง (เก่า → ใหม่) — ⛔ ไม่เชื่อลำดับที่ผู้เรียกส่งมา */
    const ordered = React.useMemo(
      () =>
        periods
          .map((period) => ({ period, month: monthOfPeriod(period) }))
          .filter(
            (entry): entry is { period: PeriodNavigatorItem; month: Date } =>
              entry.month !== null,
          )
          .sort((a, b) => monthIndexOf(a.month) - monthIndexOf(b.month)),
      [periods],
    );

    /* ขอบของปฏิทิน — เดือนเก่าสุด/ใหม่สุดที่มีงวด ⇒ เดือนและปีนอกช่วงจางและกดไม่ได้เอง */
    const bounds = ordered.length
      ? { min: ordered[0]!.month, max: ordered[ordered.length - 1]!.month }
      : null;

    /**
     * เดือนที่ **มีงวดจริง** → `id` · เดือนที่ไม่อยู่ในนี้คือเดือนที่กดไม่ได้
     *
     * ⚠️ เดือนหนึ่งมีได้หลายงวด — เก็บงวดแรกของเดือนไว้เป็นตัวแทน เพราะตารางเลือกได้
     * แค่ระดับเดือน (ตัวเลื่อน ‹ › ยังเดินถึงงวดที่เหลือได้ครบ)
     */
    const idByMonth = React.useMemo(() => {
      const map = new Map<number, string | number>();
      ordered.forEach(({ period, month }) => {
        const key = monthIndexOf(month);
        if (!map.has(key)) map.set(key, period.id);
      });
      return map;
    }, [ordered]);

    const selected =
      ordered.find((entry) => entry.period.id === value) ?? null;

    /**
     * ปฏิทินและลูกศรส่ง `Date` มา — แปลงกลับเป็น *งวด*
     *
     * 🔴 ตาราง 12 เดือนกดได้เฉพาะเดือนที่มีงวด (ปิดที่ `disabledMonth`) ⇒ เจอ exact เสมอ
     * ส่วนลูกศรก้าวทีละเดือนตามกลไกของ `DateNavigator` ซึ่งอาจตกลงบนเดือนที่ไม่มีงวด
     * ⇒ **เดินต่อไปทางเดิมจนเจองวดจริง** ⛔ ไม่ใช่ `return` เงียบ ๆ
     */
    const handleChange = (next: Date) => {
      const target = monthIndexOf(next);
      const exact = idByMonth.get(target);
      if (exact !== undefined) {
        onChange(exact);
        return;
      }
      if (!selected) return;
      const from = monthIndexOf(selected.month);
      if (target === from) return;
      const found =
        target > from
          ? ordered.find((entry) => monthIndexOf(entry.month) > from)
          : [...ordered]
              .reverse()
              .find((entry) => monthIndexOf(entry.month) < from);
      if (found) onChange(found.period.id);
    };

    /** "18 ส.ค. – 25 ก.ย. 2569" — ปีฝั่งซ้ายหายไปเมื่ออยู่ปีเดียวกัน */
    const rangeLabel = (period: PeriodNavigatorItem): string => {
      const start = parseDateOnly(period.startDate);
      const end = parseDateOnly(period.endDate);
      if (!start || !end) return period.label ?? "";
      /* `formatRange` ยุบส่วนที่ซ้ำให้เอง — ไม่ใช่ทุก runtime ที่มี (happy-dom ในเทสไม่มี)
       * ⇒ fallback อ่านออกเหมือนกัน แค่ประกอบเอง (กติกาเดียวกับ `Calendar.yearRangeLabel`) */
      try {
        return fmt.full.formatRange(start, end);
      } catch {
        const head =
          start.getFullYear() === end.getFullYear()
            ? fmt.noYear.format(start)
            : fmt.full.format(start);
        return `${head} – ${fmt.full.format(end)}`;
      }
    };

    const hasPeriods = ordered.length > 0;
    const centreLabel = selected
      ? [rangeLabel(selected.period), selected.period.suffix]
          .filter(Boolean)
          .join(" ")
      : L.empty;

    return (
      <DateNavigator
        ref={ref}
        unit="month"
        value={selected?.month}
        onChange={handleChange}
        minDate={bounds?.min}
        maxDate={bounds?.max}
        /**
         * 🔴🔴 **ส่ง `undefined` ตอนมีงวด ⛔ ไม่ใช่ `false`** — `DateNavigator` อ่านค่านี้เป็น
         * `prevDisabled ?? !canStep(-1)` ⇒ `false` คือการ *ทับตรรกะ `minDate`/`maxDate`
         * ทิ้งทั้งดุ้น* แล้วลูกศรจะกดได้แม้อยู่ที่งวดเก่าสุด/ใหม่สุดแล้ว
         */
        prevDisabled={hasPeriods && !disabled ? undefined : true}
        nextDisabled={hasPeriods && !disabled ? undefined : true}
        /* ยังไม่มีงวด = ไม่มีอะไรให้เลือก ⇒ ปิดปฏิทินทิ้ง ป้ายกลางจึงกดไม่ได้ด้วย */
        calendar={hasPeriods && !disabled}
        label={
          <span title={selected?.period.label} className="truncate">
            {centreLabel}
          </span>
        }
        prevLabel={L.prev}
        nextLabel={L.next}
        locale={locale}
        calendarProps={{
          ...calendarProps,
          defaultView: "month",
          selectMonth: true,
          /* เกณฑ์คือ "มีแถวงวดของเดือนนี้ไหม" ⛔ ไม่ใช่การเทียบวันที่เอง */
          disabledMonth: (month) => !idByMonth.has(monthIndexOf(month)),
          labels: {
            ...calendarProps?.labels,
            prevYear: L.prevYear,
            nextYear: L.nextYear,
            chooseYear: L.chooseYear,
            prevYears: L.prevYears,
            nextYears: L.nextYears,
          },
        }}
        {...props}
      >
        {showFooter && selected && (
          <div className="mt-3 border-t border-divider-gray pt-3">
            <Text as="span" variant="body-sm" tone="muted" numeric>
              {L.footer
                .replace("{month}", fmt.monthCell.format(selected.month))
                .replace("{range}", rangeLabel(selected.period))}
            </Text>
          </div>
        )}
      </DateNavigator>
    );
  },
);

PeriodNavigator.displayName = "PeriodNavigator";

export { PeriodNavigator };
