import * as React from "react";
import * as RadixRadio from "@radix-ui/react-radio-group";
import { cn } from "../lib/cn";
import { FormField } from "../form/FormField";

export type RadioOption<V extends string = string> = {
  value: V;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
};

export type RadioGroupProps<V extends string = string> = Omit<
  React.ComponentProps<typeof RadixRadio.Root>,
  "asChild" | "children"
> & {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  /** Options to render. Pass children directly for custom layouts. */
  options?: RadioOption<V>[];
  /** Layout direction. Default `vertical`. */
  orientation?: "vertical" | "horizontal";
  containerClassName?: string;
  children?: React.ReactNode;
};

function RadioGroup<V extends string = string>({
  id,
  className,
  containerClassName,
  label,
  hint,
  error,
  required,
  options,
  orientation = "vertical",
  children,
  ...props
}: RadioGroupProps<V>) {
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
        aria-invalid={hasError || undefined}
        className={cn(
          "flex gap-4",
          orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
          className,
        )}
        {...props}
      >
        {options
          ? options.map((opt) => (
              <RadioGroupItem
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                description={opt.description}
              >
                {opt.label}
              </RadioGroupItem>
            ))
          : children}
      </RadixRadio.Root>
    </FormField>
  );
}

type RadioGroupItemProps = Omit<
  React.ComponentProps<typeof RadixRadio.Item>,
  "asChild"
> & {
  description?: React.ReactNode;
};

const RadioGroupItem = React.forwardRef<HTMLButtonElement, RadioGroupItemProps>(
  function RadioGroupItem(
    { id, value, disabled, description, children, className, ...props },
    ref,
  ) {
    const reactId = React.useId();
    const itemId = id ?? reactId;
    return (
      <label
        htmlFor={itemId}
        className={cn(
          "inline-flex cursor-pointer items-start gap-2 text-sm font-medium text-text-primary",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <RadixRadio.Item
          ref={ref}
          id={itemId}
          value={value}
          disabled={disabled}
          className={cn(
            "mt-0.5 size-4 shrink-0 rounded-full border border-border-input bg-white transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
            "data-[state=checked]:border-brand",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          {...props}
        >
          <RadixRadio.Indicator className="flex size-full items-center justify-center after:size-2 after:rounded-full after:bg-brand" />
        </RadixRadio.Item>
        <span className="flex flex-col gap-0.5 leading-tight">
          {children}
          {description != null && (
            <span className="text-xs font-normal text-text-tertiary">
              {description}
            </span>
          )}
        </span>
      </label>
    );
  },
);

export { RadioGroup, RadioGroupItem };
