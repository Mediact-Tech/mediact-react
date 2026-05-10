import * as React from "react";
import { cn } from "../lib/cn";
import {
  FloatingFieldShell,
  type FieldSize,
} from "../form/FloatingFieldShell";

export type TextareaProps = React.ComponentProps<"textarea"> & {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  hideLabel?: boolean;
  alwaysFloatLabel?: boolean;
  size?: FieldSize;
  /** Show character count in the hint slot (requires `maxLength`). */
  showCount?: boolean;
  containerClassName?: string;
};

const minHeights: Record<FieldSize, string> = {
  sm: "min-h-[72px]",
  md: "min-h-[88px]",
  lg: "min-h-[104px]",
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      id,
      className,
      containerClassName,
      label,
      hint,
      error,
      required,
      hideLabel,
      alwaysFloatLabel,
      size = "md",
      showCount,
      maxLength,
      value,
      defaultValue,
      placeholder,
      onFocus,
      onBlur,
      onChange,
      disabled,
      ...props
    },
    ref,
  ) {
    const reactId = React.useId();
    const inputId = id ?? reactId;
    const [focused, setFocused] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");

    const hasError = Boolean(error);
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    const hasValue = currentValue != null && String(currentValue).length > 0;
    const floating =
      Boolean(alwaysFloatLabel) || focused || hasValue || Boolean(placeholder);

    const length = currentValue == null ? 0 : String(currentValue).length;
    const counter =
      showCount && maxLength != null ? `${length} / ${maxLength}` : null;
    const hintWithCounter = counter ? (
      <span className="flex justify-between gap-2">
        <span>{hint}</span>
        <span>{counter}</span>
      </span>
    ) : (
      hint
    );

    return (
      <FloatingFieldShell
        label={label}
        hint={hintWithCounter}
        error={error}
        required={required}
        hideLabel={hideLabel}
        htmlFor={inputId}
        size={size}
        floating={floating}
        focused={focused}
        hasError={hasError}
        containerClassName={containerClassName}
        multiline
      >
        <textarea
          ref={ref}
          id={inputId}
          value={isControlled ? value : internalValue}
          maxLength={maxLength}
          disabled={disabled}
          placeholder={floating ? placeholder : undefined}
          aria-invalid={hasError || undefined}
          aria-required={required || undefined}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          onChange={(e) => {
            if (!isControlled) setInternalValue(e.target.value);
            onChange?.(e);
          }}
          className={cn(
            "w-full rounded-sm border bg-white px-3 py-2.5 text-sm font-medium transition-colors resize-y",
            "focus:outline-none focus:ring-1",
            "disabled:cursor-not-allowed disabled:bg-gray-50",
            minHeights[size],
            hasError
              ? "border-cherry-red-600 focus:border-cherry-red-600 focus:ring-cherry-red-600/40"
              : "border-border-strong focus:border-brand focus:ring-brand/30",
            className,
          )}
          {...props}
        />
      </FloatingFieldShell>
    );
  },
);

export { Textarea };
