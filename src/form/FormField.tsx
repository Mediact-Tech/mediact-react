import * as React from "react";
import { Label } from "@radix-ui/react-label";
import { cn } from "../lib/cn";

export type FormFieldProps = {
  /** Field label rendered above the input. Omit for unlabeled fields. */
  label?: React.ReactNode;
  /** Helper text under the input. Hidden when `error` is set. */
  hint?: React.ReactNode;
  /** Error message — when truthy, switches the field to error styling. */
  error?: React.ReactNode;
  /** Marks the label with a red asterisk. Does NOT enforce HTML required (caller controls). */
  required?: boolean;
  /** id wired to the input via htmlFor — caller passes the same id to the input. */
  htmlFor?: string;
  /** Visually hide the label but keep it for screen readers. */
  hideLabel?: boolean;
  className?: string;
  children: React.ReactNode;
};

/**
 * Layout shell shared by every form primitive (Input, Textarea, Select, ...).
 * Renders: [Label] [children] [hint | error]
 */
export function FormField({
  label,
  hint,
  error,
  required,
  htmlFor,
  hideLabel,
  className,
  children,
}: FormFieldProps) {
  const showError = Boolean(error);
  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      {label != null && (
        <Label
          htmlFor={htmlFor}
          className={cn(
            "text-sm font-medium text-text-primary",
            hideLabel && "sr-only",
          )}
        >
          {label}
          {required && <span className="ml-1 text-cherry-red-600">*</span>}
        </Label>
      )}
      {children}
      {showError ? (
        <p
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
