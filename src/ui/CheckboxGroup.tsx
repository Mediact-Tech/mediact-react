/** @doc ./toggle.md */
import * as React from "react";
import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "../lib/cn";
import { FormField } from "../form/FormField";
import { SkeletonBox } from "../feedback/Skeleton";
import {
  ToggleText,
  TOGGLE_GLYPH_STROKE,
  checkboxShapeClasses,
  toggleAlignClass,
  toggleGlyphClass,
  toggleLabelClasses,
  type ToggleSize,
} from "./toggle-parts";

export type CheckboxOption<V extends string = string> = {
  value: V;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
};

export type CheckboxGroupProps<V extends string = string> = {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  id?: string;
  /** Wired to each item's native `name` — useful for uncontrolled native form submission. */
  name?: string;
  /** Disables every item. A per-option `disabled` still wins for that item. */
  disabled?: boolean;
  /** Options to render. Pass children (`CheckboxGroupItem`) directly for custom layouts. */
  options?: CheckboxOption<V>[];
  /** Controlled selected values. */
  value?: V[];
  /** Initial selected values (uncontrolled). */
  defaultValue?: V[];
  /** Fires with the next array whenever an item toggles. */
  onValueChange?: (next: V[]) => void;
  /** Layout direction. Default `vertical`. */
  orientation?: "vertical" | "horizontal";
  /** ขนาดตัวควบคุม `md` 20px (ค่าเริ่มต้น) · `sm` 16px */
  size?: ToggleSize;
  /** ยังไม่มีข้อมูล — แสดงโครงร่างแทนทั้งกลุ่ม */
  isLoading?: boolean;
  className?: string;
  containerClassName?: string;
  children?: React.ReactNode;
};

type CheckboxGroupContextValue = {
  value: string[];
  toggle: (value: string) => void;
  disabled?: boolean;
  name?: string;
  size: ToggleSize;
};

const CheckboxGroupContext = React.createContext<CheckboxGroupContextValue | null>(
  null,
);

function CheckboxGroup<V extends string = string>({
  id,
  className,
  containerClassName,
  label,
  hint,
  error,
  required,
  name,
  disabled,
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  orientation = "vertical",
  size = "md",
  isLoading,
  children,
}: CheckboxGroupProps<V>) {
  const reactId = React.useId();
  const groupId = id ?? reactId;
  const hasError = Boolean(error);

  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = React.useState<V[]>(
    defaultValue ?? [],
  );
  const value = isControlled ? (valueProp as V[]) : internalValue;

  const toggle = React.useCallback(
    (raw: string) => {
      const v = raw as V;
      const next = value.includes(v)
        ? value.filter((x) => x !== v)
        : [...value, v];
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next);
    },
    [value, isControlled, onValueChange],
  );

  const ctx = React.useMemo<CheckboxGroupContextValue>(
    () => ({ value, toggle, disabled, name, size }),
    [value, toggle, disabled, name, size],
  );

  const layout = cn(
    "flex gap-4",
    orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
    className,
  );

  return (
    <FormField
      label={label}
      hint={hint}
      error={error}
      required={required}
      htmlFor={groupId}
      className={containerClassName}
    >
      {isLoading ? (
        <div className={layout}>
          {Array.from({ length: options?.length || 3 }).map((_, i) => (
            <SkeletonBox
              key={i}
              shape="inline-flex items-start gap-2 rounded-xs text-body-sm"
            >
              <span
                className={cn(checkboxShapeClasses(size), toggleAlignClass(size))}
              />
              <ToggleText description={options?.[i]?.description}>
                {options?.[i]?.label ?? "ตัวเลือก"}
              </ToggleText>
            </SkeletonBox>
          ))}
        </div>
      ) : (
        <CheckboxGroupContext.Provider value={ctx}>
          <div
            id={groupId}
            role="group"
            aria-invalid={hasError || undefined}
            className={layout}
          >
            {options
              ? options.map((opt) => (
                  <CheckboxGroupItem
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                    description={opt.description}
                  >
                    {opt.label}
                  </CheckboxGroupItem>
                ))
              : children}
          </div>
        </CheckboxGroupContext.Provider>
      )}
    </FormField>
  );
}

type CheckboxGroupItemProps = Omit<
  React.ComponentProps<typeof RadixCheckbox.Root>,
  "asChild" | "checked" | "onCheckedChange" | "value"
> & {
  value: string;
  description?: React.ReactNode;
};

const CheckboxGroupItem = React.forwardRef<
  HTMLButtonElement,
  CheckboxGroupItemProps
>(function CheckboxGroupItem(
  { id, value, disabled, description, children, className, ...props },
  ref,
) {
  const ctx = React.useContext(CheckboxGroupContext);
  if (ctx == null) {
    throw new Error(
      "CheckboxGroupItem must be rendered inside a CheckboxGroup",
    );
  }

  const reactId = React.useId();
  const itemId = id ?? reactId;
  const checked = ctx.value.includes(value);
  const isDisabled = disabled ?? ctx.disabled;

  return (
    <label htmlFor={itemId} className={toggleLabelClasses(isDisabled)}>
      <RadixCheckbox.Root
        ref={ref}
        id={itemId}
        value={value}
        name={ctx.name}
        checked={checked}
        disabled={isDisabled}
        onCheckedChange={() => ctx.toggle(value)}
        className={cn(
          checkboxShapeClasses(ctx.size),
          toggleAlignClass(ctx.size),
          className,
        )}
        {...props}
      >
        <RadixCheckbox.Indicator className="text-brand-foreground">
          <Check
            className={toggleGlyphClass(ctx.size)}
            strokeWidth={TOGGLE_GLYPH_STROKE}
          />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      <ToggleText description={description}>{children}</ToggleText>
    </label>
  );
});

CheckboxGroupItem.displayName = "CheckboxGroupItem";
CheckboxGroup.displayName = "CheckboxGroup";

export { CheckboxGroup, CheckboxGroupItem };
