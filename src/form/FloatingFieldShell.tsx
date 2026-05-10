import * as React from "react";
import { cn } from "../lib/cn";

export type FieldSize = "sm" | "md" | "lg";

export type FloatingFieldShellProps = {
  /** Floating label — sits inside the field as placeholder, floats up when filled/focused. */
  label?: React.ReactNode;
  /** Helper text under the field. Hidden when `error` is set. */
  hint?: React.ReactNode;
  /** Error message — switches the field shell to error styling. */
  error?: React.ReactNode;
  /** Marks the label with a red asterisk. Caller controls actual HTML required. */
  required?: boolean;
  /** Visually hide the label but keep it for screen readers. */
  hideLabel?: boolean;
  /** id of the inner field — wired to label via `htmlFor`. */
  htmlFor?: string;
  /** Size variant — affects height and label vertical positioning. */
  size?: FieldSize;
  /** Should the label be in the floated position right now? Caller computes from focused/hasValue/alwaysFloat. */
  floating: boolean;
  /** Is the field currently focused — used for label color while floating. */
  focused?: boolean;
  /** Whether the field has an error (controls border/label color). Derived from `error` if not supplied. */
  hasError?: boolean;
  /** Left-side icon/element rendered absolutely inside the field. */
  leftAdornment?: React.ReactNode;
  /** Right-side icon/element rendered absolutely inside the field. */
  rightAdornment?: React.ReactNode;
  /** Wrapper className (the outer flex column). */
  containerClassName?: string;
  /** When true, position the rest label near the top (for textareas) instead of vertically centered. */
  multiline?: boolean;
  /** The actual interactive element (input / textarea / button). */
  children: React.ReactNode;
};

const sizeClasses: Record<FieldSize, { labelTextRest: string; labelTextFloat: string }> = {
  sm: { labelTextRest: "text-sm", labelTextFloat: "text-[11px]" },
  md: { labelTextRest: "text-sm", labelTextFloat: "text-xs" },
  lg: { labelTextRest: "text-base", labelTextFloat: "text-xs" },
};

/**
 * Shared shell for any text-like field with a floating label
 * (Input / Textarea / Select / DatePicker / TimePicker / ...).
 *
 * The shell renders:
 *   - the label (positioned absolutely, animates between rest and float positions)
 *   - any left/right adornments
 *   - hint or error text below
 *
 * The caller renders the interactive element as `children` and is responsible for:
 *   - matching `id` with `htmlFor`
 *   - computing `floating` / `focused`
 *   - applying its own padding (the shell does not enforce the field's internal padding,
 *     but does shift the rest-position label right when `leftAdornment` is provided)
 */
export function FloatingFieldShell({
  label,
  hint,
  error,
  required,
  hideLabel,
  htmlFor,
  size = "md",
  floating,
  focused,
  hasError: hasErrorProp,
  leftAdornment,
  rightAdornment,
  containerClassName,
  multiline,
  children,
}: FloatingFieldShellProps) {
  const hasError = hasErrorProp ?? Boolean(error);
  const sz = sizeClasses[size];
  const showLabel = label != null && !hideLabel;

  return (
    <div className={cn("flex w-full flex-col gap-1", containerClassName)}>
      <div className="relative w-full">
        {showLabel && (
          <label
            htmlFor={htmlFor}
            className={cn(
              "pointer-events-none absolute truncate transition-all duration-150 ease-out",
              "max-w-[calc(100%-1.5rem)]",
              floating
                ? cn(
                    "-top-1.5 left-2 px-1.5 font-medium bg-white",
                    sz.labelTextFloat,
                    hasError
                      ? "text-cherry-red-600"
                      : focused
                        ? "text-brand"
                        : "text-text-body",
                  )
                : cn(
                    "font-normal",
                    multiline ? "top-3" : "top-1/2 -translate-y-1/2",
                    sz.labelTextRest,
                    "text-text-tertiary",
                    leftAdornment ? "left-9" : "left-3",
                  ),
            )}
          >
            {label}
            {required && <span className="ml-0.5 text-cherry-red-600">*</span>}
          </label>
        )}

        {leftAdornment && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary [&_svg]:size-4">
            {leftAdornment}
          </span>
        )}

        {children}

        {rightAdornment && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-text-tertiary [&_svg]:size-4">
            {rightAdornment}
          </span>
        )}
      </div>

      {hasError ? (
        <p
          id={htmlFor ? `${htmlFor}-error` : undefined}
          role="alert"
          className="text-xs font-medium text-cherry-red-600"
        >
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-text-tertiary">{hint}</p>
      ) : null}
    </div>
  );
}

/**
 * Field shape classes shared by all interactive elements (input/textarea/button).
 * Apply to the inner element so border/focus ring/error states stay consistent.
 */
export function fieldShapeClasses({
  hasError,
  size,
}: {
  hasError: boolean;
  size: FieldSize;
}) {
  const heights: Record<FieldSize, string> = {
    sm: "h-9 text-sm",
    md: "h-11 text-sm",
    lg: "h-12 text-base",
  };
  return [
    "w-full rounded-sm border bg-white px-3 font-medium transition-colors",
    "focus:outline-none focus:ring-1",
    "disabled:cursor-not-allowed disabled:bg-gray-50",
    heights[size],
    hasError
      ? "border-cherry-red-600 focus:border-cherry-red-600 focus:ring-cherry-red-600/40"
      : "border-border-strong focus:border-brand focus:ring-brand/30",
  ].join(" ");
}
