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
      containerClassName={containerClassName}
      rightAdornment={<CalendarIcon />}
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
              "flex items-center text-left pr-9",
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
