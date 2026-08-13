/** @doc ../ui/Calendar.md */
import * as React from "react";
import { format, isValid } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar, startOfMonth, type CalendarLabels } from "../ui/Calendar";
import { cn } from "../lib/cn";
import {
  FloatingFieldShell,
  fieldShapeClasses,
  type FieldSize,
} from "./FloatingFieldShell";
import { FieldIconSlot } from "./field-icon-slot";
import { Popover, PopoverContent, PopoverTrigger } from "../overlay/Popover";

export type DatePickerProps = {
  id?: string;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  hideLabel?: boolean;
  alwaysFloatLabel?: boolean;
  /** Placeholder text shown inside the field when label has floated. */
  placeholder?: string;
  value?: Date | null;
  defaultValue?: Date;
  onChange?: (date: Date | undefined) => void;
  /** date-fns format string. Default `"PPP"` (e.g. "May 9, 2026"). */
  displayFormat?: string;
  disabledDate?: (date: Date) => boolean;
  minDate?: Date;
  maxDate?: Date;
  /**
   * ให้ล้างค่าได้จากในช่อง — **X สลับที่กับไอคอนปฏิทิน ไม่ได้โผล่มาอยู่ข้างกัน**
   *
   * ไอคอนสองตัวซ้อนช่องเดียวกัน เห็นทีละตัว: ปกติเป็นปฏิทิน · เอาเมาส์วางบนช่อง
   * (หรือแท็บเข้ามา) แล้วมีค่าอยู่ ⇒ กลายเป็น X · ทรงอยู่ที่ `form/field-icon-slot.tsx`
   * ตัวเดียวกับที่ `DateRangePicker` ใช้ เพื่อไม่ให้สองตัวเพี้ยนออกจากกัน
   *
   * 🔴 **นี่คือทางเดียวที่จะล้างค่าของ `DatePicker`** — ต่างจาก `DateRangePicker`
   * ที่มีปุ่ม "ล้าง" ในฟุตเตอร์ของ popover อยู่แล้ว · ตัวนี้คลิกเดียวจบและปิดทันที
   * จึงไม่มีฟุตเตอร์ให้วางปุ่ม ⇒ ถ้าจอไหนต้อง "ไม่ระบุวัน" ได้ ต้องเปิด prop นี้
   *
   * ⚠️ **บนทัชไม่มี hover** ⇒ X กดไม่ได้ (จงใจ — ไม่งั้นแตะตรงไอคอนแล้วโดนล้างค่า
   * ทั้งที่ตั้งใจเปิดปฏิทิน) ⇒ จอที่ต้องล้างได้บนมือถือยังต้องมีทางอื่นให้ผู้ใช้
   *
   * ⚠️ เปิดแล้ว **กดตรงไอคอนเพื่อ _เปิด_ ปฏิทินไม่ได้อีก** เพราะต้องเอาเมาส์ไปวางก่อน
   * แล้วมันก็กลายเป็น X ไปแล้ว — เปิดปฏิทินใช้กดที่ตัวช่อง ซึ่งกดได้ทั้งแถบ (antd เหมือนกัน)
   * @default false
   */
  showClearInField?: boolean;
  /** ข้อความ a11y ของปุ่มล้าง — แอปส่งคำแปลมาเอง @default "Clear" */
  clearLabel?: string;
  disabled?: boolean;
  size?: FieldSize;
  /** BCP-47 locale ของปฏิทิน · `th-TH` = ปี พ.ศ. อัตโนมัติ @default "th-TH" */
  calendarLocale?: string;
  /** วันแรกของสัปดาห์ในปฏิทิน @default 0 (อาทิตย์) */
  weekStartsOn?: 0 | 1;
  /** ข้อความ a11y ของปุ่มในปฏิทิน — แอปส่งคำแปลมาเอง */
  calendarLabels?: Partial<CalendarLabels>;
  className?: string;
  containerClassName?: string;
};

function DatePicker({
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
  displayFormat = "PPP",
  disabledDate,
  minDate,
  maxDate,
  showClearInField = false,
  clearLabel = "Clear",
  disabled,
  size = "md",
  calendarLocale = "th-TH",
  weekStartsOn,
  calendarLabels,
  className,
  containerClassName,
}: DatePickerProps) {
  const reactId = React.useId();
  const triggerId = id ?? reactId;
  const [open, setOpen] = React.useState(false);
  const [internal, setInternal] = React.useState<Date | undefined>(defaultValue);

  const isControlled = value !== undefined;
  const selected = isControlled ? (value ?? undefined) : internal;
  const hasError = Boolean(error);
  const hasValue = selected != null;
  const floating =
    Boolean(alwaysFloatLabel) || open || hasValue || Boolean(placeholder);

  /* หนึ่งคลิกคือทั้งการตัดสินใจ — commit แล้วปิดเลย ไม่มีปุ่ม OK
   * (ปุ่มยืนยันเป็นเรื่องของช่วงวัน/วัน+เวร ซึ่งเลือกครั้งเดียวยังไม่ครบคู่) */
  const handleSelect = (date: Date) => {
    if (disabledDate?.(date)) return;
    if (!isControlled) setInternal(date);
    onChange?.(date);
    setOpen(false);
  };

  /* `undefined` = ยังไม่เลือก ซึ่งเป็นค่าเดียวกับที่ `onChange` ใช้อยู่แล้ว
   * (ลายเซ็นเดิม `(date: Date | undefined) => void` — ไม่ต้องเปลี่ยนสัญญา) */
  const handleClear = () => {
    if (!isControlled) setInternal(undefined);
    onChange?.(undefined);
  };

  const display =
    selected && isValid(selected) ? format(selected, displayFormat) : "";

  /* เดือนที่ปฏิทินเปิดค้างอยู่ — เปิดใหม่ทุกครั้งที่เดือนของค่าที่เลือกอยู่
   * ไม่ใช่เดือนที่ค้างจากรอบก่อน */
  const [month, setMonth] = React.useState<Date>(() =>
    startOfMonth(selected ?? new Date()),
  );
  const handleOpenChange = (next: boolean) => {
    if (next) setMonth(startOfMonth(selected ?? new Date()));
    setOpen(next);
  };

  return (
    <FloatingFieldShell
      label={label}
      hint={hint}
      error={error}
      required={required}
      hideLabel={hideLabel}
      htmlFor={triggerId}
      size={size}
      floating={floating}
      focused={open}
      hasError={hasError}
      /* `group` — X ต้องเผยตอนเอาเมาส์วางบน **ทั้งช่อง** ไม่ใช่เฉพาะบนไอคอน */
      containerClassName={cn("group", containerClassName)}
      rightAdornment={
        <FieldIconSlot
          icon={<CalendarIcon />}
          showClear={showClearInField && hasValue && !disabled}
          clearLabel={clearLabel}
          onClear={handleClear}
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
              /* `cursor-pointer` — ตัวเปิดเป็นปุ่มที่กดแล้วปฏิทินโผล่ ไม่ใช่ช่องพิมพ์
               * เคอร์เซอร์ลูกศรทำให้อ่านว่าเป็นข้อความอ่านอย่างเดียว (คู่เดียวกับ `Select`) */
              "flex cursor-pointer items-center text-left pr-9",
              !display && "text-text-tertiary",
              className,
            )}
          >
            <span className="truncate">
              {display || (floating ? placeholder ?? "" : "")}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={8}
          /* สิทธิ์รับ pointer ในโมดัลย้ายไปอยู่ที่ `PopoverContent` ของ DS แล้ว (เหตุผลเต็มอยู่ที่นั่น)
           * — ที่นี่เหลือแค่รูปทรงของกล่องปฏิทิน */
          className="w-auto rounded-2xl p-0 pb-4"
        >
          <Calendar
            month={month}
            onMonthChange={setMonth}
            selected={selected ?? null}
            minDate={minDate ?? null}
            maxDate={maxDate ?? null}
            disabledDate={disabledDate}
            onSelect={handleSelect}
            locale={calendarLocale}
            weekStartsOn={weekStartsOn}
            labels={calendarLabels}
          />
        </PopoverContent>
      </Popover>
    </FloatingFieldShell>
  );
}

export { DatePicker };
