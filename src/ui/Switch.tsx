import * as React from "react";
import * as RadixSwitch from "@radix-ui/react-switch";
import { cn } from "../lib/cn";

export type SwitchProps = Omit<
  React.ComponentProps<typeof RadixSwitch.Root>,
  "asChild"
> & {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  /** Position of label relative to the switch. Default `right`. */
  labelPosition?: "left" | "right";
  containerClassName?: string;
};

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    id,
    className,
    containerClassName,
    label,
    description,
    error,
    labelPosition = "right",
    disabled,
    ...props
  },
  ref,
) {
  const reactId = React.useId();
  const inputId = id ?? reactId;
  const hasError = Boolean(error);

  const sw = (
    <RadixSwitch.Root
      ref={ref}
      id={inputId}
      disabled={disabled}
      aria-invalid={hasError || undefined}
      className={cn(
        "peer relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-brand data-[state=unchecked]:bg-gray-300",
        className,
      )}
      {...props}
    >
      <RadixSwitch.Thumb
        className={cn(
          "pointer-events-none block size-5 rounded-full bg-white shadow ring-0 transition-transform",
          "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
        )}
      />
    </RadixSwitch.Root>
  );

  if (label == null && description == null && error == null) {
    return sw;
  }

  const labelEl =
    (label != null || description != null) && (
      <span className="flex flex-col gap-0.5 leading-tight">
        {label != null && (
          <span className="text-sm font-medium text-text-primary">{label}</span>
        )}
        {description != null && (
          <span className="text-xs text-text-tertiary">{description}</span>
        )}
      </span>
    );

  return (
    <div className={cn("flex flex-col gap-1", containerClassName)}>
      <label
        htmlFor={inputId}
        className={cn(
          "inline-flex items-center gap-3",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        {labelPosition === "left" && labelEl}
        {sw}
        {labelPosition === "right" && labelEl}
      </label>
      {hasError && (
        <p role="alert" className="text-xs font-medium text-cherry-red-600">
          {error}
        </p>
      )}
    </div>
  );
});

Switch.displayName = "Switch";

export { Switch };
