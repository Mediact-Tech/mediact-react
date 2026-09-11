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

export type RadioControlProps = Omit<
  React.ComponentProps<typeof RadixRadio.Item>,
  "asChild" | "children"
> & {
  /** ทับขนาดที่ได้จากกลุ่ม — ปกติไม่ต้องใส่ */
  size?: ToggleSize;
};

/**
 * **ตัวควบคุมเปล่า ๆ ไม่มีป้ายกำกับ** — วงกลม + จุดกลาง เท่านั้น
 *
 * 🔴 มีไว้เพราะ `RadioGroupItem` **ห่อ `<label>` + ข้อความมาให้เสมอ** ซึ่งใช้ไม่ได้กับจอ
 * ที่วางป้ายเอง (การ์ดที่มีไอคอน · ป้ายที่มี tooltip/ไอคอนกุญแจ · ตัวเลือกที่มีเนื้อหา
 * ซ้อนอยู่ข้างใต้) — เอา `RadioGroupItem` ไปใช้จะได้ `<label>` ซ้อนสองชั้น
 *
 * ⚠️ **ที่ผ่านมาไม่มีตัวนี้ ผลคือแอปไป import `@radix-ui/react-radio-group` เอง**
 * แล้วเขียนวงกลมกับจุดกลางขึ้นใหม่ · วัดจาก Medimatch (แอปเดียวที่ทำ) เมื่อ 2026-09-11:
 * มันเขียนจุดกลางเป็น `after:size-2.5 after:bg-brand` ด้วยมือ เพราะ DS มี
 * `radioDotClasses()` อยู่แล้วแต่ **ไม่ได้ re-export ออกจาก `index.ts`**
 * ⇒ วงกลม radio มีสองสูตรในแอปเดียว และเพี้ยนออกจากกันจริง (ขอบ `#bac2cb` ⇄ `#b9c2cb`)
 *
 * 🔴 **`RadioGroupItem` ประกอบจากตัวนี้** ไม่ได้เขียนวงกลมซ้ำ — สองตัวที่แชร์ทรงกันจะ
 * drift เสมอถ้าปล่อยให้ต่างคนต่างเขียน (บทเรียนเดียวกับที่ `toggle-parts.tsx` เกิดมา)
 */
const RadioControl = React.forwardRef<HTMLButtonElement, RadioControlProps>(
  function RadioControl({ size, className, ...props }, ref) {
    const groupSize = React.useContext(RadioSizeContext);
    const resolved = size ?? groupSize;
    return (
      <RadixRadio.Item
        ref={ref}
        className={cn(
          radioShapeClasses(resolved),
          toggleAlignClass(resolved),
          className,
        )}
        {...props}
      >
        <RadixRadio.Indicator className={radioDotClasses(resolved)} />
      </RadixRadio.Item>
    );
  },
);

RadioControl.displayName = "RadioControl";

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
    return (
      <label htmlFor={itemId} className={toggleLabelClasses(disabled)}>
        <RadioControl
          ref={ref}
          id={itemId}
          value={value}
          disabled={disabled}
          size={size}
          className={className}
          {...props}
        />
        <ToggleText description={description}>{children}</ToggleText>
      </label>
    );
  },
);

RadioGroupItem.displayName = "RadioGroupItem";

/**
 * รากของกลุ่มแบบเปล่า ๆ — ไม่มี `FormField` ไม่มีคลาสจัดเรียง
 *
 * `RadioGroup` ข้างบนห่อ `FormField` (ป้าย · hint · error) และใส่ `flex gap-4` ให้
 * ซึ่งถูกสำหรับฟอร์มทั่วไป แต่จอที่จัดเลย์เอาต์เอง (กริด 3 คอลัมน์ · การ์ดเรียงแถว)
 * ต้องการแค่ context ของกลุ่ม ⇒ เปิดรากออกมาตรง ๆ
 *
 * แบบเดียวกับที่ DS เปิด `Popover`/`Dialog`/`DropdownMenu` ของ Radix ออกมาทั้งชุด
 * — จุดประสงค์คือ **แอปไม่ต้องประกาศ `@radix-ui/*` เป็น dependency ของตัวเอง**
 */
const RadioGroupRoot = RadixRadio.Root;

export { RadioGroup, RadioGroupItem, RadioControl, RadioGroupRoot };
