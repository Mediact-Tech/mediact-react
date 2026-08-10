import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "../lib/cn";
import { FloatingFieldShell, type FieldSize } from "./FloatingFieldShell";
import { Popover, PopoverContent, PopoverTrigger } from "../overlay/Popover";

/** "HH:mm" string in 24-hour format. */
export type TimeValue = string;

export type TimePickerProps = {
  id?: string;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  hideLabel?: boolean;
  /**
   * จองที่หนึ่งบรรทัดใต้ช่องไว้เสมอ กันเลย์เอาต์กระตุกตอนข้อความผิดโผล่/หาย
   * ค่าตั้งต้นของ shell คือ `true` — ส่ง `false` เมื่อช่องนี้อยู่ในแถวที่ต้องเรียงกับ
   * ของอื่น (สวิตช์ · ปุ่ม) ที่ไม่มีที่ว่างนั้น แล้วกรอบที่ตาเห็นจะลอยไม่ตรงกัน
   */
  reserveMessageSpace?: boolean;
  alwaysFloatLabel?: boolean;
  value?: TimeValue | null;
  defaultValue?: TimeValue;
  onChange?: (value: TimeValue) => void;
  /** Minute step in the popover (e.g. 5 → 0, 5, 10…). Default `1`. */
  minuteStep?: number;
  /** @deprecated use `minuteStep` */
  step?: number;
  /**
   * Earliest selectable time, inclusive — 24h "HH:mm" string (e.g. "08:00").
   * Disables out-of-range hour/minute options in the popover and snaps a
   * typed value back into range once focus leaves the field. `value`/`onChange`
   * always stay 24h "HH:mm" regardless.
   */
  minTime?: TimeValue;
  /**
   * Latest selectable time, inclusive — 24h "HH:mm" string (e.g. "17:00").
   * See `minTime`.
   */
  maxTime?: TimeValue;
  /**
   * Display the field + popover in 12-hour format with an AM/PM toggle.
   * Display-only — the committed `value`/`onChange` shape never changes,
   * it stays 24h "HH:mm".
   * @default false
   */
  ampm?: boolean;
  disabled?: boolean;
  size?: FieldSize;
  className?: string;
  containerClassName?: string;
};

const heights: Record<FieldSize, string> = {
  sm: "h-9 text-body-sm",
  md: "h-11 text-body-sm",
  lg: "h-12 text-body-md",
};

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function parseTime(v: TimeValue | null | undefined): {
  h: number | null;
  m: number | null;
} {
  if (!v) return { h: null, m: null };
  const [hStr, mStr] = v.split(":");
  const h = hStr === undefined ? NaN : parseInt(hStr, 10);
  const m = mStr === undefined ? NaN : parseInt(mStr, 10);
  return {
    h: Number.isFinite(h) && h >= 0 && h <= 23 ? h : null,
    m: Number.isFinite(m) && m >= 0 && m <= 59 ? m : null,
  };
}

function format24(h: number | null, m: number | null): TimeValue {
  if (h == null && m == null) return "";
  return `${pad2(h ?? 0)}:${pad2(m ?? 0)}`;
}

type Period = "AM" | "PM";

function to12Hour(h: number): { h12: number; period: Period } {
  const period: Period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return { h12, period };
}

function from12Hour(h12: number, period: Period): number {
  const base = h12 % 12;
  return period === "PM" ? base + 12 : base;
}

function timeToMinutes(v: TimeValue | undefined): number | null {
  const { h, m } = parseTime(v);
  if (h == null || m == null) return null;
  return h * 60 + m;
}

function clampMinutesToRange(
  total: number,
  min: number | null,
  max: number | null,
) {
  let v = total;
  if (min != null && v < min) v = min;
  if (max != null && v > max) v = max;
  return v;
}

function TimePicker({
  id,
  label,
  hint,
  error,
  required,
  hideLabel,
  reserveMessageSpace,
  alwaysFloatLabel = true,
  value,
  defaultValue,
  onChange,
  minuteStep,
  step,
  minTime,
  maxTime,
  ampm = false,
  disabled,
  size = "md",
  className,
  containerClassName,
}: TimePickerProps) {
  const reactId = React.useId();
  const inputId = id ?? reactId;
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<TimeValue>(defaultValue ?? "");
  const [focused, setFocused] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const current = isControlled ? (value ?? "") : internal;
  const { h, m } = parseTime(current);
  const hasError = Boolean(error);
  const hasValue = current !== "";
  const floating = Boolean(alwaysFloatLabel) || focused || hasValue;

  const stepEffective = minuteStep ?? step ?? 1;

  const minMinutes = React.useMemo(() => timeToMinutes(minTime), [minTime]);
  const maxMinutes = React.useMemo(() => timeToMinutes(maxTime), [maxTime]);

  // AM/PM is display-only: `h`/`m` (derived from `current`, above) stay the single
  // source of truth in 24h. `manualPeriod` only matters while no hour has been
  // committed yet (e.g. user clicks "PM" before typing an hour) — once `h` is set,
  // the period is always derived from it so it can't drift out of sync.
  const [manualPeriod, setManualPeriod] = React.useState<Period>(() =>
    h != null ? to12Hour(h).period : "AM",
  );
  const period: Period = h != null ? to12Hour(h).period : manualPeriod;

  // Local string state for inputs so users can type freely (e.g. "1" before
  // committing to "01"). Only commit/normalize on change of the parent value
  // or on input blur via the parent's `onChange`. In `ampm` mode the hour box
  // displays 1-12 while `h` itself always stays 24h.
  const [hStr, setHStr] = React.useState(() => {
    const displayH = ampm ? (h != null ? to12Hour(h).h12 : null) : h;
    return displayH != null ? pad2(displayH) : "";
  });
  const [mStr, setMStr] = React.useState(() => (m != null ? pad2(m) : ""));

  // Sync local string state ONLY when the parent value differs from what the
  // user has typed (e.g. external change, popover pick). Without this guard,
  // typing "3" would commit "03:00" → useEffect would overwrite hStr "3" with
  // "03" mid-typing, jamming the cursor at the end and blocking further input.
  React.useEffect(() => {
    const displayH = ampm ? (h != null ? to12Hour(h).h12 : null) : h;
    const localH = hStr === "" ? null : parseInt(hStr, 10);
    if (localH !== displayH) {
      setHStr(displayH != null ? pad2(displayH) : "");
    }
    const localM = mStr === "" ? null : parseInt(mStr, 10);
    if (localM !== m) {
      setMStr(m != null ? pad2(m) : "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [h, m, ampm]);

  const applyValue = (safeH: number | null, safeM: number | null) => {
    const next = format24(safeH, safeM);
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const commit = (nextH: string, nextM: string) => {
    const safeH =
      nextH === "" ? null : clamp(parseInt(nextH, 10) || 0, 0, 23);
    const safeM =
      nextM === "" ? null : clamp(parseInt(nextM, 10) || 0, 0, 59);
    applyValue(safeH, safeM);
  };

  const commitAmPm = (nextH12: string, nextM: string, periodArg: Period) => {
    const safeH12 =
      nextH12 === "" ? null : clamp(parseInt(nextH12, 10) || 0, 1, 12);
    const safeM =
      nextM === "" ? null : clamp(parseInt(nextM, 10) || 0, 0, 59);
    const safeH = safeH12 == null ? null : from12Hour(safeH12, periodArg);
    applyValue(safeH, safeM);
  };

  const handleHourChange = (raw: string) => {
    const cleaned = raw.replace(/\D/g, "").slice(0, 2);
    setHStr(cleaned);
    if (ampm) commitAmPm(cleaned, mStr, period);
    else commit(cleaned, mStr);
  };
  const handleMinuteChange = (raw: string) => {
    const cleaned = raw.replace(/\D/g, "").slice(0, 2);
    setMStr(cleaned);
    if (ampm) commitAmPm(hStr, cleaned, period);
    else commit(hStr, cleaned);
  };
  const handleHourBlur = () => {
    if (hStr !== "" && hStr.length === 1) setHStr(pad2(parseInt(hStr, 10)));
  };
  const handleMinuteBlur = () => {
    if (mStr !== "" && mStr.length === 1) setMStr(pad2(parseInt(mStr, 10)));
  };

  const handlePeriodChange = (next: Period) => {
    setManualPeriod(next);
    if (h != null) {
      const { h12 } = to12Hour(h);
      applyValue(from12Hour(h12, next), m);
    }
  };

  // Bound the picker itself: hour / 12h-block / minute options outside
  // [minTime, maxTime] are disabled so they can't be picked at all — not just
  // rejected after the fact.
  const isHourBlockDisabled = (h24: number) => {
    if (minMinutes == null && maxMinutes == null) return false;
    const start = h24 * 60;
    const end = start + 59;
    if (maxMinutes != null && start > maxMinutes) return true;
    if (minMinutes != null && end < minMinutes) return true;
    return false;
  };
  const isMinuteDisabled = (mm: number) => {
    if (h == null || (minMinutes == null && maxMinutes == null)) return false;
    const total = h * 60 + mm;
    if (minMinutes != null && total < minMinutes) return true;
    if (maxMinutes != null && total > maxMinutes) return true;
    return false;
  };
  const isPeriodBlockDisabled = (p: Period) => {
    if (minMinutes == null && maxMinutes == null) return false;
    const start = (p === "AM" ? 0 : 12) * 60;
    const end = start + 12 * 60 - 1;
    if (maxMinutes != null && start > maxMinutes) return true;
    if (minMinutes != null && end < minMinutes) return true;
    return false;
  };

  // Typed entry stays free-form while the user is mid-type (no per-keystroke
  // snapping — that would fight typing "14" with minTime="09:00": the field
  // would jump to "09" right after the first "1"). Once focus leaves the whole
  // field group, snap a complete-but-out-of-range value back into bounds.
  const enforceBoundsOnBlur = () => {
    if ((minMinutes == null && maxMinutes == null) || h == null || m == null) {
      return;
    }
    const total = h * 60 + m;
    const clampedTotal = clampMinutesToRange(total, minMinutes, maxMinutes);
    if (clampedTotal !== total) {
      applyValue(Math.floor(clampedTotal / 60), clampedTotal % 60);
    }
  };

  const hourItems = React.useMemo(
    () =>
      ampm
        ? Array.from({ length: 12 }, (_, i) => i + 1)
        : Array.from({ length: 24 }, (_, i) => i),
    [ampm],
  );
  const minuteItems = React.useMemo(() => {
    const out: number[] = [];
    for (let i = 0; i < 60; i += stepEffective) out.push(i);
    return out;
  }, [stepEffective]);

  return (
    <FloatingFieldShell
      label={label}
      hint={hint}
      error={error}
      required={required}
      hideLabel={hideLabel}
      reserveMessageSpace={reserveMessageSpace}
      htmlFor={inputId}
      size={size}
      floating={floating}
      focused={focused}
      hasError={hasError}
      containerClassName={containerClassName}
      rightAdornment={
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="Open time picker"
              disabled={disabled}
              className="pointer-events-auto inline-flex size-6 items-center justify-center rounded-sm hover:bg-black/5 disabled:cursor-not-allowed [&_svg]:size-4"
            >
              <Clock />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" sideOffset={6} className="p-0">
            <div
              className={cn(
                "flex h-56 divide-x divide-border-default text-body-sm",
                ampm ? "w-56" : "w-40",
              )}
              role="dialog"
              aria-label="Pick time"
            >
              <TimeColumn
                ariaLabel="Hours"
                items={hourItems}
                selected={ampm ? (h != null ? to12Hour(h).h12 : null) : h}
                isDisabled={(item) =>
                  isHourBlockDisabled(ampm ? from12Hour(item, period) : item)
                }
                onPick={(next) =>
                  applyValue(ampm ? from12Hour(next, period) : next, m)
                }
              />
              <TimeColumn
                ariaLabel="Minutes"
                items={minuteItems}
                selected={m}
                isDisabled={isMinuteDisabled}
                onPick={(next) => applyValue(h, next)}
              />
              {ampm && (
                <TimeColumn
                  ariaLabel="Period"
                  items={["AM", "PM"] as const}
                  selected={h != null ? period : null}
                  isDisabled={isPeriodBlockDisabled}
                  onPick={handlePeriodChange}
                  formatLabel={(item) => item}
                />
              )}
            </div>
          </PopoverContent>
        </Popover>
      }
    >
      <div
        className={cn(
          /* 🔴 `pr-9` ไม่ใช่ `pr-3` — ปุ่มนาฬิกาถูกวางเป็น `absolute right-3` โดย shell
           * (ไอคอน 16px กินช่วง 12–28px จากขอบขวา) ถ้าเว้นขวาแค่ 12 **ตัวเลขนาทีจะอยู่
           * ใต้ปุ่มพอดี** อ่านไม่ออก และไม่มีอะไรฟ้อง — ไม่มี type error ไม่มี warning
           * (เจอของจริงในโมดัล "เพิ่มเวลาทำงาน" ตอนช่องกว้าง ~106px)
           * แก้ที่ระยะเว้น ไม่ใช่ตั้ง `min-width` เพราะ min-width แค่ทำให้ช่องกว้างพอ
           * "โดยบังเอิญ" แล้วพังอีกทันทีที่ใครใส่ไอคอนที่ใหญ่กว่าเดิม */
          "flex w-full items-center gap-1 rounded-sm border bg-white pl-3 pr-9 transition-colors",
          "focus-within:outline-none focus-within:ring-1",
          /* พื้นตอนปิดใช้งาน — ค่าเดียวกับ `fieldShapeClasses` (ของเดิม `gray-50` เป็นสีดิบ
           * และจางกว่าช่องอื่นในฟอร์มเดียวกัน) */
          disabled && "cursor-not-allowed bg-bg-surface",
          heights[size],
          hasError
            ? "border-cherry-red-600 focus-within:border-cherry-red-600 focus-within:ring-cherry-red-600/40"
            : "border-border-strong focus-within:border-brand focus-within:ring-brand/30",
          className,
        )}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setFocused(false);
            enforceBoundsOnBlur();
          }
        }}
      >
        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          maxLength={2}
          disabled={disabled}
          value={hStr}
          onChange={(e) => handleHourChange(e.target.value)}
          onBlur={handleHourBlur}
          placeholder="HH"
          aria-label="Hours"
          className="w-8 bg-transparent text-center font-medium tabular-nums outline-none disabled:cursor-not-allowed"
        />
        <span className="select-none text-text-tertiary">:</span>
        <input
          type="text"
          inputMode="numeric"
          maxLength={2}
          disabled={disabled}
          value={mStr}
          onChange={(e) => handleMinuteChange(e.target.value)}
          onBlur={handleMinuteBlur}
          placeholder="mm"
          aria-label="Minutes"
          className="w-8 bg-transparent text-center font-medium tabular-nums outline-none disabled:cursor-not-allowed"
        />
        {ampm && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => handlePeriodChange(period === "AM" ? "PM" : "AM")}
            aria-label="Toggle AM/PM"
            className="shrink-0 rounded-sm px-1 text-caption font-medium text-text-tertiary hover:bg-black/5 disabled:cursor-not-allowed"
          >
            {period}
          </button>
        )}
        {/* spacer so the right-adornment clock icon doesn't overlap inputs */}
        <span className="ml-auto" aria-hidden="true" />
      </div>
    </FloatingFieldShell>
  );
}

function TimeColumn<T extends string | number>({
  ariaLabel,
  items,
  selected,
  isDisabled,
  onPick,
  formatLabel,
}: {
  ariaLabel: string;
  items: T[];
  selected: T | null;
  isDisabled?: (item: T) => boolean;
  onPick: (item: T) => void;
  formatLabel?: (item: T) => string;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (selected == null || !containerRef.current) return;
    const el = containerRef.current.querySelector<HTMLButtonElement>(
      `[data-value="${selected}"]`,
    );
    el?.scrollIntoView({ block: "center" });
  }, [selected]);

  return (
    <div
      ref={containerRef}
      role="listbox"
      aria-label={ariaLabel}
      className="flex flex-1 flex-col overflow-y-auto py-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300"
    >
      {items.map((item) => {
        const isSelected = item === selected;
        const disabled = isDisabled?.(item) ?? false;
        return (
          <button
            key={item}
            type="button"
            data-value={item}
            role="option"
            aria-selected={isSelected || undefined}
            aria-disabled={disabled || undefined}
            disabled={disabled}
            onClick={() => onPick(item)}
            className={cn(
              "mx-2 my-0.5 flex h-8 shrink-0 items-center justify-center rounded-md text-center font-medium tabular-nums transition-colors",
              disabled
                ? "cursor-not-allowed text-text-tertiary/40"
                : isSelected
                  ? "bg-brand-active text-white"
                  /* 🔴 สีเนื้อความปกติ — `text-text-primary` alias ไป `--color-brand`
                   * ⇒ รายการเวลาที่ยังไม่ถูกเลือกจะเป็นสีแบรนด์ อ่านเหมือนถูกเลือกไว้แล้ว
                   * ตัวที่เลือกจริงคือแถบทึบสีแบรนด์ตัวอักษรขาวในกิ่งด้านบน
                   * (ห้ามเขียนชื่อคลาสสีขาวตรง ๆ ในคอมเมนต์ — `tokens.guard` สแกนคอมเมนต์ด้วย) */
                  : "text-text-body hover:bg-brand-subtle",
            )}
          >
            {formatLabel
              ? formatLabel(item)
              : typeof item === "number"
                ? pad2(item)
                : String(item)}
          </button>
        );
      })}
    </div>
  );
}

export { TimePicker };
