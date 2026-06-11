import * as React from "react";
import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "../lib/cn";

export type CheckboxProps = Omit<
  React.ComponentProps<typeof RadixCheckbox.Root>,
  "asChild"
> & {
  /** Label rendered to the right of the box. Click toggles the checkbox. */
  label?: React.ReactNode;
  /** Description rendered under the label. */
  description?: React.ReactNode;
  /** Error message — switches to error styling. */
  error?: React.ReactNode;
  /** Wrapper className (the outer label). */
  containerClassName?: string;
};

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  function Checkbox(
    {
      id,
      className,
      containerClassName,
      label,
      description,
      error,
      checked,
      disabled,
      ...props
    },
    ref,
  ) {
    const reactId = React.useId();
    const inputId = id ?? reactId;
    const hasError = Boolean(error);
    const isIndeterminate = checked === "indeterminate";

    const box = (
      <RadixCheckbox.Root
        ref={ref}
        id={inputId}
        checked={checked}
        disabled={disabled}
        aria-invalid={hasError || undefined}
        className={cn(
          "peer relative flex size-5 shrink-0 items-center justify-center rounded-sm border bg-white transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "data-[state=checked]:bg-brand data-[state=checked]:border-brand",
          "data-[state=indeterminate]:bg-brand data-[state=indeterminate]:border-brand",
          hasError
            ? "border-cherry-red-600"
            : "border-border-input",
          className,
        )}
        {...props}
      >
        <RadixCheckbox.Indicator className="text-white">
          {isIndeterminate ? <Minus className="size-3.5" /> : <Check className="size-3.5" />}
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
    );

    if (label == null && description == null && error == null) {
      return box;
    }

    return (
      <div className={cn("flex flex-col gap-1", containerClassName)}>
        <label
          htmlFor={inputId}
          className={cn(
            "inline-flex items-start gap-2 text-sm font-medium text-text-primary",
            disabled && "cursor-not-allowed opacity-60",
          )}
        >
          {box}
          {(label != null || description != null) && (
            <span className="flex flex-col gap-0.5 leading-tight">
              {label != null && <span>{label}</span>}
              {description != null && (
                <span className="text-xs font-normal text-text-tertiary">
                  {description}
                </span>
              )}
            </span>
          )}
        </label>
        {hasError && (
          <p role="alert" className="text-xs font-medium text-cherry-red-600">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
