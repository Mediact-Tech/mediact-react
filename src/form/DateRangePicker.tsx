/** @doc ../ui/Calendar.md */
import * as React from "react";
import { format, isBefore, isValid, startOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar, startOfMonth, type CalendarLabels } from "../ui/Calendar";
import { cn } from "../lib/cn";
import { Button } from "../ui/Button";
import { FieldIconSlot } from "./field-icon-slot";
import {
  FloatingFieldShell,
  fieldShapeClasses,
  type FieldSize,
} from "./FloatingFieldShell";
import { Popover, PopoverContent, PopoverTrigger } from "../overlay/Popover";

/** A closed range. `to` is only ever `null` while a selection is half-made. */
export type DateRangeValue = { from: Date | null; to: Date | null };

const EMPTY_RANGE: DateRangeValue = { from: null, to: null };

export type DateRangePickerLabels = {
  /** Confirm button in the popover footer — commits the draft range. */
  confirm: string;
  /** Clear button in the popover footer, and the field's clear-icon `aria-label`. */
  clear: string;
};

const DEFAULT_LABELS: DateRangePickerLabels = {
  confirm: "OK",
  clear: "Clear",
};

export type DateRangePickerProps = {
  id?: string;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  hideLabel?: boolean;
  alwaysFloatLabel?: boolean;
  /** Placeholder shown at both ends of the dash when nothing is picked. */
  placeholder?: string;
  value?: DateRangeValue;
  defaultValue?: DateRangeValue;
  /** Fired once, when the user confirms or clears — never mid-selection. */
  onChange?: (value: DateRangeValue) => void;
  /**
   * date-fns format string per endpoint — an **override**.
   *
   * 🔴 Left unset, the field formats through `Intl` with `calendarLocale`, so the
   * text and the calendar always name the same year. Passing a date-fns format
   * opts out of that: date-fns has no Buddhist era, so `"PP"` under
   * `calendarLocale="th-TH"` prints **2026 in the field beside 2569 in the
   * calendar** — the two-calendars bug `Calendar.md` exists to prevent. Only pass
   * this when the field is deliberately not in the calendar's locale (a fixed
   * `"yyyy-MM-dd"` for an export screen, say).
   */
  displayFormat?: string;
  disabledDate?: (date: Date) => boolean;
  minDate?: Date;
  maxDate?: Date;
  /**
   * ให้ล้างค่าได้จากในช่อง — **X สลับที่กับไอคอนปฏิทิน ไม่ได้โผล่มาอยู่ข้างกัน**
   *
   * ไอคอนสองตัวซ้อนอยู่ช่องเดียวกัน เห็นทีละตัว: ปกติเป็นปฏิทิน · เอาเมาส์วางบนช่อง
   * (หรือโฟกัสเข้ามา) แล้วมีค่าอยู่ ⇒ กลายเป็น X
   *
   * 📐 ทรงนี้ยึดตาม **antd** ซึ่งใช้อยู่ใน `mediact-web-admin`
   * (`antd/lib/date-picker/style/index.js:190-217` — `-clear` เป็น `absolute`
   * `insetInlineEnd:0` `opacity:0` แล้วตอน `:hover` สลับ `-clear→1` `-suffix→0`)
   * ⇒ ไม่มี layout shift · ระยะเว้นขวาคงที่ `pr-9` ไม่ต้องสลับตามสถานะ
   *
   * 🔴 **ต่างจาก antd ตรงที่เพิ่ม `focus-within`** — antd ใช้ `:hover` อย่างเดียว
   * ซึ่งคนใช้คีย์บอร์ดไม่มีวันเห็นปุ่มนั้นเลย · ที่นี่แท็บเข้ามาก็เห็น
   *
   * ⚠️ **บนทัชไม่มี hover** ⇒ ยังเห็นปฏิทินตามเดิมและ X กดไม่ได้ (`pointer-events-none`
   * จนกว่าจะถูกเผย — จงใจ ไม่งั้นแตะตรงไอคอนแล้วโดนล้างทั้งที่ตั้งใจเปิดปฏิทิน)
   * การล้างบนทัชจึงไปทางปุ่ม "ล้าง" ในฟุตเตอร์ ซึ่งมีอยู่เสมอทุกโหมด
   *
   * ค่าเริ่มต้น **ปิด** เพราะไม่มี field ตัวไหนใน DS ให้ล้างจากในช่อง —
   * `ComboBox` · `EntityAutocomplete` · `DatePicker` · `TimePicker` ย้ายการล้าง
   * ไปไว้ในสิ่งที่เปิดออกมาทั้งหมด · `DateRangeField` ของ Mediwork มี X ในช่อง
   * **ย้ายจอนั้นมาต้องส่ง prop นี้** ไม่งั้นผู้ใช้เดิมเสียปุ่มที่เคยมี
   * @default false
   */
  showClearInField?: boolean;
  /**
   * จองที่หนึ่งบรรทัดใต้ช่องไว้เสมอ กันเลย์เอาต์กระตุกตอนข้อความผิดโผล่/หาย
   *
   * ค่าตั้งต้นของ shell คือ `true` — ส่ง `false` เมื่อช่องนี้อยู่ในแถบตัวกรองที่ไม่มี
   * validation หรือต้องเรียงความสูงให้ตรงกับช่องอื่นที่ปิดที่ว่างนั้นไว้
   *
   * 🔴 เดิมช่องวันที่รับ prop นี้ไม่ได้ ทั้งที่ `Select`/`Input` รับได้ ⇒ แถบตัวกรองที่มี
   * แผนก + หน่วยงาน + ช่วงวันที่ เรียงกัน ปิดที่ว่างได้แค่สองช่องแรก แล้วความสูงจะ
   * ไม่เท่ากัน 20px ในแถวเดียวกัน — ต้องยอมเปิดทิ้งไว้ทั้งแถวเพื่อให้เรียงตรง
   */
  reserveMessageSpace?: boolean;
  disabled?: boolean;
  size?: FieldSize;
  /** BCP-47 locale of the calendar · `th-TH` = Buddhist-era years automatically · @default "th-TH" */
  calendarLocale?: string;
  /** First day of the week in the calendar @default 0 (Sunday) */
  weekStartsOn?: 0 | 1;
  calendarLabels?: Partial<CalendarLabels>;
  /** Copy for the popover's footer buttons and the clear icon — the app sends its own translations. */
  labels?: Partial<DateRangePickerLabels>;
  className?: string;
  containerClassName?: string;
};

/**
 * A from–to date range in one field, with one calendar.
 *
 * `Calendar` already draws a range band (`rangeEnd` / `hoverEnd`) — this is the
 * thin wrapper that was still missing: the draft/confirm state machine, the
 * two-date field, and the footer. Grounded on Mediwork's hand-rolled
 * `DateRangeField` (`mediact-web-backoffice/src/components-v2/shared/DateRangeField.tsx`),
 * which exists because `@mui/x-date-pickers` has no range picker outside the
 * Pro licence — the same gap this package has no reason to leave open either.
 *
 * **The selection is a draft until "OK".** A range is half-nonsense while it
 * is being made (one date picked means "from here to nowhere"), so this does
 * not fire `onChange` on every click — a filter wired straight to it would
 * spend a request on a question nobody asked yet. The second click is always
 * the end; clicking before the start begins a new range rather than silently
 * swapping the pair.
 */
function DateRangePicker({
  id,
  label,
  hint,
  error,
  required,
  hideLabel,
  alwaysFloatLabel,
  placeholder,
  value,
  defaultValue,
  onChange,
  displayFormat,
  disabledDate,
  minDate,
  maxDate,
  showClearInField = false,
  reserveMessageSpace,
  disabled,
  size = "md",
  calendarLocale = "th-TH",
  weekStartsOn,
  calendarLabels,
  labels,
  className,
  containerClassName,
}: DateRangePickerProps) {
  const L = { ...DEFAULT_LABELS, ...labels };
  const reactId = React.useId();
  const triggerId = id ?? reactId;

  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<DateRangeValue>(
    defaultValue ?? EMPTY_RANGE,
  );
  const committed = isControlled ? (value ?? EMPTY_RANGE) : internal;

  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<DateRangeValue>(committed);
  const [hoverDay, setHoverDay] = React.useState<Date | null>(null);
  const [month, setMonth] = React.useState<Date>(() =>
    startOfMonth(committed.from ?? new Date()),
  );

  const hasError = Boolean(error);
  const hasValue = Boolean(committed.from || committed.to);
  const showClear = showClearInField && hasValue && !disabled;
  const floating =
    Boolean(alwaysFloatLabel) || open || hasValue || Boolean(placeholder);

  /* Opening always starts the draft from what is committed — an effect on
   * `value` couldn't tell a fresh open apart from the popover being dismissed
   * without confirming, which has to abandon the draft instead of keeping it. */
  const handleOpenChange = (next: boolean) => {
    if (next) {
      setDraft(committed);
      setHoverDay(null);
      setMonth(startOfMonth(committed.from ?? new Date()));
    }
    setOpen(next);
  };

  const handleDayClick = (day: Date) => {
    if (disabledDate?.(day)) return;
    // A complete range, no range at all, or a day before the start all mean
    // the next click begins a new range — the alternative for the last case
    // is silently swapping the pair under the user.
    if (!draft.from || draft.to || isBefore(startOfDay(day), startOfDay(draft.from))) {
      setDraft({ from: day, to: null });
      return;
    }
    setDraft({ from: draft.from, to: day });
  };

  const commit = (next: DateRangeValue) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const confirm = () => {
    // One date picked and confirmed is a single-day range, not half a range —
    // it's what the user sees highlighted, and leaving `to` empty would filter
    // from that day to forever.
    commit(draft.from ? { from: draft.from, to: draft.to ?? draft.from } : EMPTY_RANGE);
    setOpen(false);
  };

  const clear = () => {
    setDraft(EMPTY_RANGE);
    commit(EMPTY_RANGE);
    setOpen(false);
  };

  /* 🔴 ค่าเริ่มต้นเดินผ่าน `Intl` ด้วย `calendarLocale` ตัวเดียวกับปฏิทิน — ไม่ใช่ date-fns
   *
   * date-fns ไม่มี พ.ศ. ⇒ ถ้า format ที่นี่ด้วย `"PP"` ขณะปฏิทินเป็น `th-TH` ช่องจะขึ้น
   * **2026 ส่วนปฏิทินขึ้น 2569 พร้อมกันบนจอเดียว** (ยืนยันด้วยภาพจาก Storybook 2026-08-13)
   * เป็นบั๊กเดียวกับที่ `Calendar.md` บันทึกว่าแอปเคยเป็น "ตัวกรองขึ้น 69 ตารางข้าง ๆ ขึ้น 2026"
   * และเป็นเหตุผลที่ `Calendar` ถูกเขียนขึ้นมาตั้งแต่แรก · `DateRangeField` ของ Mediwork
   * ก็ผูกกับภาษาเหมือนกัน (`formatPickerDay(day, isThai)`)
   *
   * ⚠️ ต่างจาก `DatePicker` ซึ่ง default เป็น `"PPP"` (date-fns) ⇒ **`DatePicker` มีบั๊กนี้อยู่**
   * ไม่แก้ที่นี่เพราะเปลี่ยน default ของมันคือ breaking change ที่ต้องให้ทีมเคาะ */
  const intlFmt = React.useMemo(
    () =>
      new Intl.DateTimeFormat(calendarLocale, {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    [calendarLocale],
  );
  const fmt = (d: Date | null) =>
    d && isValid(d)
      ? displayFormat
        ? format(d, displayFormat)
        : intlFmt.format(d)
      : null;
  const display = committed.from
    ? `${fmt(committed.from)} – ${fmt(committed.to ?? committed.from)}`
    : "";
  const placeholderText = placeholder ? `${placeholder} – ${placeholder}` : "";

  return (
    <FloatingFieldShell
      label={label}
      hint={hint}
      error={error}
      required={required}
      hideLabel={hideLabel}
      reserveMessageSpace={reserveMessageSpace}
      htmlFor={triggerId}
      size={size}
      floating={floating}
      focused={open}
      hasError={hasError}
      /* `group` — X ต้องเผยตอนเอาเมาส์วางบน **ทั้งช่อง** ไม่ใช่เฉพาะบนไอคอน
       * (ของ antd ก็ผูกกับ `:hover` ของทั้ง picker เหมือนกัน) */
      containerClassName={cn("group", containerClassName)}
      rightAdornment={
        <FieldIconSlot
          icon={<CalendarIcon />}
          showClear={showClear}
          clearLabel={L.clear}
          onClear={clear}
        />
      }
    >
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <button
            id={triggerId}
            type="button"
            disabled={disabled}
            aria-invalid={hasError || undefined}
            className={cn(
              fieldShapeClasses({ hasError, size }),
              "flex cursor-pointer items-center text-left",
              /* 🔴 ต้องเว้นขวาให้พ้นไอคอน — shell วาง `rightAdornment` เป็น `absolute right-3`
               * ⇒ ตัวอักษรลอดไปอยู่ใต้ไอคอนได้โดยไม่มีอะไรฟ้อง (กับดักเดียวกับที่ `TimePicker`
               * เจอในโมดัล "เพิ่มเวลาทำงาน")
               *
               * **คงที่ 36 ทุกสถานะ** เพราะ X ซ้อนอยู่ที่เดียวกับปฏิทิน ไม่ได้ต่อแถวออกมา
               * (เคยเป็น `pr-14`/`pr-9` สลับกันตอนที่โชว์ทั้งสองตัว — พอสลับเป็นซ้อนกัน
               * ตามแบบ antd ความกว้างก็ไม่ขึ้นกับสถานะอีกต่อไป) */
              "pr-9",
              !display && "text-text-tertiary",
              className,
            )}
          >
            <span className="truncate">
              {display || (floating ? placeholderText : "")}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" sideOffset={8} className="w-auto rounded-2xl p-0">
          <Calendar
            month={month}
            onMonthChange={setMonth}
            selected={draft.from}
            rangeEnd={draft.to}
            hoverEnd={hoverDay}
            minDate={minDate ?? null}
            maxDate={maxDate ?? null}
            disabledDate={disabledDate}
            onSelect={handleDayClick}
            onDayHover={setHoverDay}
            locale={calendarLocale}
            weekStartsOn={weekStartsOn}
            labels={calendarLabels}
          />
          <div className="flex items-center justify-end gap-2 border-t border-border-default px-4 py-3">
            <Button type="button" variant="secondary" size="sm" onClick={clear}>
              {L.clear}
            </Button>
            <Button type="button" variant="primary" size="sm" onClick={confirm}>
              {L.confirm}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </FloatingFieldShell>
  );
}

export { DateRangePicker };
