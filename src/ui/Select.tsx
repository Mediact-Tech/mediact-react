import * as React from "react";
import * as RadixSelect from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";
import {
  FloatingFieldShell,
  fieldShapeClasses,
  type FieldSize,
} from "../form/FloatingFieldShell";

export type SelectOption<V extends string = string> = {
  value: V;
  label: React.ReactNode;
  disabled?: boolean;
};

export type SelectProps<V extends string = string> = {
  id?: string;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  hideLabel?: boolean;
  /** Force the label into the floated position. */
  alwaysFloatLabel?: boolean;
  /** Placeholder shown when nothing selected and label has floated. */
  placeholder?: string;
  /** Controlled value. */
  value?: V;
  defaultValue?: V;
  onChange?: (value: V) => void;
  options?: SelectOption<V>[];
  disabled?: boolean;
  size?: FieldSize;
  className?: string;
  containerClassName?: string;
  /** When passing children directly (for grouping/custom items). */
  children?: React.ReactNode;
};

function Select<V extends string = string>({
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
  options,
  disabled,
  size = "md",
  className,
  containerClassName,
  children,
}: SelectProps<V>) {
  const reactId = React.useId();
  const triggerId = id ?? reactId;
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState<V | undefined>(
    defaultValue,
  );
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const hasValue = currentValue != null && currentValue !== "";
  const hasError = Boolean(error);
  const floating =
    Boolean(alwaysFloatLabel) || open || hasValue || Boolean(placeholder);

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
      rightAdornment={<ChevronDown />}
    >
      <RadixSelect.Root
        value={isControlled ? value : undefined}
        defaultValue={defaultValue}
        onValueChange={(v) => {
          if (!isControlled) setInternalValue(v as V);
          onChange?.(v as V);
        }}
        onOpenChange={setOpen}
        disabled={disabled}
      >
        <RadixSelect.Trigger
          id={triggerId}
          aria-invalid={hasError || undefined}
          className={cn(
            fieldShapeClasses({ hasError, size }),
            "flex items-center justify-between gap-2 text-left pr-9",
            "data-[placeholder]:text-text-tertiary",
            className,
          )}
        >
          <RadixSelect.Value placeholder={floating ? placeholder ?? "" : ""} />
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            sideOffset={4}
            className="z-50 max-h-72 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-sm border border-border-default bg-white shadow-lg"
          >
            <RadixSelect.Viewport className="p-1">
              {options
                ? options.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      disabled={opt.disabled}
                    >
                      {opt.label}
                    </SelectItem>
                  ))
                : children}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </FloatingFieldShell>
  );
}

type SelectItemProps = React.ComponentProps<typeof RadixSelect.Item>;

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  function SelectItem({ className, children, ...props }, ref) {
    return (
      <RadixSelect.Item
        ref={ref}
        className={cn(
          "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none",
          "focus:bg-brand-subtle data-[highlighted]:bg-brand-subtle",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          className,
        )}
        {...props}
      >
        <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
        <span className="absolute right-2 flex size-4 items-center justify-center">
          <RadixSelect.ItemIndicator>
            <Check className="size-4 text-text-primary" />
          </RadixSelect.ItemIndicator>
        </span>
      </RadixSelect.Item>
    );
  },
);

export { Select, SelectItem };
