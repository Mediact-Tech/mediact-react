/** @doc ./toggle.md */
import * as React from "react";
import * as RadixRadio from "@radix-ui/react-radio-group";
import { cn } from "../lib/cn";
import { FormField } from "../form/FormField";
import { SkeletonBox } from "../feedback/Skeleton";
import {
  ToggleText,
  radioDotClasses,
  radioShapeClasses,
  toggleAlignClass,
  toggleLabelClasses,
  type ToggleSize,
} from "./toggle-parts";

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
  /** ตัวเลือกที่จะแสดง — ส่ง children เองได้ถ้าต้องการเลย์เอาต์พิเศษ */
  options?: RadioOption<V>[];
  /** ทิศทางการเรียง ค่าเริ่มต้น `vertical` */
  orientation?: "vertical" | "horizontal";
  /** ขนาดตัวควบคุม `md` 20px (ค่าเริ่มต้น) · `sm` 16px */
  size?: ToggleSize;
  /** ยังไม่มีข้อมูล — แสดงโครงร่างแทนทั้งกลุ่ม */
  isLoading?: boolean;
  containerClassName?: string;
  children?: React.ReactNode;
};

/** ส่งขนาดลงไปให้ `RadioGroupItem` โดยไม่ต้องให้ผู้เรียกมาใส่ซ้ำทุกตัว */
const RadioSizeContext = React.createContext<ToggleSize>("md");

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
  size = "md",
  isLoading,
  children,
  ...props
}: RadioGroupProps<V>) {
  const reactId = React.useId();
  const groupId = id ?? reactId;
  const hasError = Boolean(error);

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
          {/* จำนวนโครงร่าง = จำนวนตัวเลือกที่รู้อยู่แล้ว ถ้ายังไม่รู้ใช้ 3
           * ⇒ ตอนข้อมูลมาถึงความสูงไม่กระโดด ถ้าผู้เรียกรู้จำนวนล่วงหน้า */}
          {Array.from({ length: options?.length || 3 }).map((_, i) => (
            <SkeletonBox
              key={i}
              shape="inline-flex items-start gap-2 rounded-full text-body-sm"
            >
              <span className={cn(radioShapeClasses(size), toggleAlignClass(size))} />
              <ToggleText description={options?.[i]?.description}>
                {options?.[i]?.label ?? "ตัวเลือก"}
              </ToggleText>
            </SkeletonBox>
          ))}
        </div>
      ) : (
        <RadixRadio.Root
          id={groupId}
          aria-invalid={hasError || undefined}
          className={layout}
          {...props}
        >
          <RadioSizeContext.Provider value={size}>
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
          </RadioSizeContext.Provider>
        </RadixRadio.Root>
      )}
    </FormField>
  );
}

type RadioGroupItemProps = Omit<
  React.ComponentProps<typeof RadixRadio.Item>,
  "asChild"
> & {
  description?: React.ReactNode;
  /** ทับขนาดที่ได้จากกลุ่ม — ปกติไม่ต้องใส่ */
  size?: ToggleSize;
};

const RadioGroupItem = React.forwardRef<HTMLButtonElement, RadioGroupItemProps>(
  function RadioGroupItem(
    { id, value, disabled, description, size, children, className, ...props },
    ref,
  ) {
    const reactId = React.useId();
    const itemId = id ?? reactId;
    const groupSize = React.useContext(RadioSizeContext);
    const resolved = size ?? groupSize;
    return (
      <label htmlFor={itemId} className={toggleLabelClasses(disabled)}>
        <RadixRadio.Item
          ref={ref}
          id={itemId}
          value={value}
          disabled={disabled}
          className={cn(
            radioShapeClasses(resolved),
            toggleAlignClass(resolved),
            className,
          )}
          {...props}
        >
          <RadixRadio.Indicator className={radioDotClasses(resolved)} />
        </RadixRadio.Item>
        <ToggleText description={description}>{children}</ToggleText>
      </label>
    );
  },
);

RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
