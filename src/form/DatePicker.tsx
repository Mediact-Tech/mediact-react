import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { format, isValid } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";

/** Slim chevron used for nav arrows + caption dropdowns inside the calendar. */
function CalendarChevron({
  orientation = "right",
  className,
}: {
  orientation?: "up" | "down" | "left" | "right";
  className?: string;
}) {
  const Icon =
    orientation === "up"
      ? ChevronUp
      : orientation === "down"
        ? ChevronDown
        : orientation === "left"
          ? ChevronLeft
          : ChevronRight;
  return <Icon className={className} strokeWidth={1.75} />;
}
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
  /** Caption layout for the calendar header. Default `"dropdown"` (month + year dropdowns). */
  captionLayout?: "label" | "dropdown" | "dropdown-months" | "dropdown-years";
  /** Earliest year selectable in the year dropdown. Default: current year − 100. */
  fromYear?: number;
  /** Latest year selectable in the year dropdown. Default: current year + 10. */
  toYear?: number;
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
  captionLayout = "dropdown",
  fromYear,
  toYear,
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

  const handleSelect = (date: Date | undefined) => {
    if (!isControlled) setInternal(date);
    onChange?.(date);
    if (date) setOpen(false);
  };

  const display =
    selected && isValid(selected) ? format(selected, displayFormat) : "";

  const dpDisabled = React.useMemo(() => {
    const list: Array<(d: Date) => boolean> = [];
    if (disabledDate) list.push(disabledDate);
    if (minDate) list.push((d) => d < minDate);
    if (maxDate) list.push((d) => d > maxDate);
    return list.length === 0 ? undefined : (d: Date) => list.some((f) => f(d));
  }, [disabledDate, minDate, maxDate]);

  const currentYear = new Date().getFullYear();
  const startMonth =
    minDate ?? new Date((fromYear ?? currentYear - 100), 0, 1);
  const endMonth = maxDate ?? new Date((toYear ?? currentYear + 10), 11, 31);

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
      <Popover open={open} onOpenChange={setOpen}>
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
        <PopoverContent className="p-0" align="start">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            disabled={dpDisabled}
            defaultMonth={selected}
            captionLayout={captionLayout}
            startMonth={startMonth}
            endMonth={endMonth}
            className="p-3 [&_.rdp-caption_label]:font-medium [&_.rdp-caption_label]:text-base"
            components={{ Chevron: CalendarChevron }}
            style={
              {
                "--rdp-accent-color": "var(--color-brand)",
                "--rdp-accent-background-color": "var(--color-brand-subtle)",
                "--rdp-selected-border": "0",
                "--rdp-today-color": "var(--color-brand)",
                "--rdp-range_middle-background-color": "var(--color-brand-subtle)",
                "--rdp-range_middle-color": "var(--color-brand)",
              } as React.CSSProperties
            }
          />
        </PopoverContent>
      </Popover>
    </FloatingFieldShell>
  );
}

export { DatePicker };
