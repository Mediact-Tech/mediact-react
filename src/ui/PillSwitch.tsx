import * as React from "react";
import * as RadixRadio from "@radix-ui/react-radio-group";
import { cn } from "../lib/cn";
import { FormField } from "../form/FormField";

export type PillSwitchOption<V extends string = string> = {
  value: V;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
};

export type PillSwitchProps<V extends string = string> = Omit<
  React.ComponentProps<typeof RadixRadio.Root>,
  | "asChild"
  | "children"
  | "value"
  | "defaultValue"
  | "onValueChange"
  | "orientation"
> & {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  /** Controlled selected value. */
  value?: V;
  /** Initial selected value (uncontrolled). */
  defaultValue?: V;
  onValueChange?: (value: V) => void;
  /**
   * Exactly 2 options today — PillSwitch is a binary segmented toggle (both
   * labels always visible, selected one highlighted). Typed as a fixed tuple
   * so a 3rd option is a compile error now.
   *
   * Designed to extend to N options later without a breaking change: it's
   * already `value`/`defaultValue`/`onValueChange` + an `options` list on top
   * of a real Radix `RadioGroup` (which gives roving-tabindex arrow-key nav
   * and `role="radiogroup"`/`role="radio"` for free, and already scales to
   * any option count). The only change needed to support N options is
   * widening this type to `PillSwitchOption<V>[]` — every existing 2-option
   * caller stays source-compatible since a 2-tuple is assignable to an array.
   */
  options: readonly [PillSwitchOption<V>, PillSwitchOption<V>];
  containerClassName?: string;
};

function PillSwitch<V extends string = string>({
  id,
  className,
  containerClassName,
  label,
  hint,
  error,
  required,
  options,
  disabled,
  ...props
}: PillSwitchProps<V>) {
  const reactId = React.useId();
  const groupId = id ?? reactId;
  const hasError = Boolean(error);

  return (
    <FormField
      label={label}
      hint={hint}
      error={error}
      required={required}
      htmlFor={groupId}
      className={containerClassName}
    >
      <RadixRadio.Root
        id={groupId}
        disabled={disabled}
        orientation="horizontal"
        aria-invalid={hasError || undefined}
        className={cn(
          "inline-flex w-fit items-center gap-1 rounded-full bg-gray-100 p-1",
          disabled && "opacity-60",
          className,
        )}
        {...props}
      >
        {options.map((opt) => (
          <RadixRadio.Item
            key={opt.value}
            value={opt.value}
            disabled={opt.disabled}
            className={cn(
              "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-body-sm font-medium text-text-tertiary transition-colors",
              "hover:text-brand",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "data-[state=checked]:bg-white data-[state=checked]:text-brand data-[state=checked]:shadow-sm",
            )}
          >
            {opt.icon != null && <span className="shrink-0">{opt.icon}</span>}
            {opt.label}
          </RadixRadio.Item>
        ))}
      </RadixRadio.Root>
    </FormField>
  );
}

PillSwitch.displayName = "PillSwitch";

export { PillSwitch };
