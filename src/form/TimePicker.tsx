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
  alwaysFloatLabel?: boolean;
  value?: TimeValue | null;
  defaultValue?: TimeValue;
  onChange?: (value: TimeValue) => void;
  /** Minute step in the popover (e.g. 5 → 0, 5, 10…). Default `1`. */
  minuteStep?: number;
  /** @deprecated use `minuteStep` */
  step?: number;
  disabled?: boolean;
  size?: FieldSize;
  className?: string;
  containerClassName?: string;
};

const heights: Record<FieldSize, string> = {
  sm: "h-9 text-sm",
  md: "h-11 text-sm",
  lg: "h-12 text-base",
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

function TimePicker({
  id,
  label,
  hint,
  error,
  required,
  hideLabel,
  alwaysFloatLabel = true,
  value,
  defaultValue,
  onChange,
  minuteStep,
  step,
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

  // Local string state for inputs so users can type freely (e.g. "1" before
  // committing to "01"). Only commit/normalize on change of the parent value
  // or on input blur via the parent's `onChange`.
  const [hStr, setHStr] = React.useState(() => (h != null ? pad2(h) : ""));
  const [mStr, setMStr] = React.useState(() => (m != null ? pad2(m) : ""));

  // Sync local string state ONLY when the parent value differs from what the
  // user has typed (e.g. external change, popover pick). Without this guard,
  // typing "3" would commit "03:00" → useEffect would overwrite hStr "3" with
  // "03" mid-typing, jamming the cursor at the end and blocking further input.
  React.useEffect(() => {
    const localH = hStr === "" ? null : parseInt(hStr, 10);
    if (localH !== h) {
      setHStr(h != null ? pad2(h) : "");
    }
    const localM = mStr === "" ? null : parseInt(mStr, 10);
    if (localM !== m) {
      setMStr(m != null ? pad2(m) : "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [h, m]);

  const commit = (nextH: string, nextM: string) => {
    const safeH =
      nextH === "" ? null : clamp(parseInt(nextH, 10) || 0, 0, 23);
    const safeM =
      nextM === "" ? null : clamp(parseInt(nextM, 10) || 0, 0, 59);
    const next = format24(safeH, safeM);
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const handleHourChange = (raw: string) => {
    const cleaned = raw.replace(/\D/g, "").slice(0, 2);
    setHStr(cleaned);
    commit(cleaned, mStr);
  };
  const handleMinuteChange = (raw: string) => {
    const cleaned = raw.replace(/\D/g, "").slice(0, 2);
    setMStr(cleaned);
    commit(hStr, cleaned);
  };
  const handleHourBlur = () => {
    if (hStr !== "" && hStr.length === 1) setHStr(pad2(parseInt(hStr, 10)));
  };
  const handleMinuteBlur = () => {
    if (mStr !== "" && mStr.length === 1) setMStr(pad2(parseInt(mStr, 10)));
  };

  return (
    <FloatingFieldShell
      label={label}
      hint={hint}
      error={error}
      required={required}
      hideLabel={hideLabel}
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
              className="flex h-56 w-40 divide-x divide-border-default text-sm"
              role="dialog"
              aria-label="Pick time"
            >
              <TimeColumn
                ariaLabel="Hours"
                count={24}
                step={1}
                selected={h}
                onPick={(next) => commit(pad2(next), mStr)}
              />
              <TimeColumn
                ariaLabel="Minutes"
                count={60}
                step={stepEffective}
                selected={m}
                onPick={(next) => commit(hStr, pad2(next))}
              />
            </div>
          </PopoverContent>
        </Popover>
      }
    >
      <div
        className={cn(
          "flex w-full items-center gap-1 rounded-sm border bg-white pl-3 pr-3 transition-colors",
          "focus-within:outline-none focus-within:ring-1",
          disabled && "cursor-not-allowed bg-gray-50",
          heights[size],
          hasError
            ? "border-cherry-red-600 focus-within:border-cherry-red-600 focus-within:ring-cherry-red-600/40"
            : "border-border-strong focus-within:border-brand focus-within:ring-brand/30",
          className,
        )}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
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
        {/* spacer so the right-adornment clock icon doesn't overlap inputs */}
        <span className="ml-auto" aria-hidden="true" />
      </div>
    </FloatingFieldShell>
  );
}

function TimeColumn({
  ariaLabel,
  count,
  step,
  selected,
  onPick,
}: {
  ariaLabel: string;
  count: number;
  step: number;
  selected: number | null;
  onPick: (n: number) => void;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const items = React.useMemo(() => {
    const out: number[] = [];
    for (let i = 0; i < count; i += step) out.push(i);
    return out;
  }, [count, step]);

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
      {items.map((n) => {
        const isSelected = n === selected;
        return (
          <button
            key={n}
            type="button"
            data-value={n}
            role="option"
            aria-selected={isSelected || undefined}
            onClick={() => onPick(n)}
            className={cn(
              "mx-2 my-0.5 flex h-8 shrink-0 items-center justify-center rounded-md text-center font-medium tabular-nums transition-colors",
              isSelected
                ? "bg-brand-active text-white"
                : "text-text-primary hover:bg-brand-subtle",
            )}
          >
            {pad2(n)}
          </button>
        );
      })}
    </div>
  );
}

export { TimePicker };
