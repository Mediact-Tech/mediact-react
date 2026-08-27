import * as React from "react";
import * as RadixSelect from "@radix-ui/react-select";
import { Check, ChevronDown, Plus, X } from "lucide-react";
import { cn } from "../lib/cn";
import {
  FloatingFieldShell,
  FieldSkeleton,
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
  /**
   * Shows a × button once a value is set, resetting the field to `""`
   * (same "no selection" sentinel already used by `hasValue`/floating-label logic).
   * `onChange`'s signature is unchanged — for typed unions narrower than `string`,
   * treat an `onChange("")` call as "cleared".
   */
  clearable?: boolean;
  /**
   * ตัวเลือกยังมาไม่ถึง — แทนช่องด้วยโครงร่างที่สูงเท่ากันทุกประการ
   *
   * ต่างจาก `disabled`: `disabled` แปลว่า "เลือกไม่ได้" (ผู้ใช้ต้องเข้าใจว่าทำไม)
   * ส่วน `isLoading` แปลว่า "ยังไม่รู้ว่ามีอะไรให้เลือกบ้าง"
   * ⇒ dropdown ที่รอ API อยู่ต้องใช้ตัวนี้ ไม่ใช่ `disabled`
   */
  isLoading?: boolean;
  /**
   * จองที่ว่างใต้ช่องไว้ 1 บรรทัดเสมอ กันเลย์เอาต์กระโดดตอนขึ้น error · ค่าเริ่มต้น `true`
   *
   * 🔴 **ปิดเมื่ออยู่ในแถบเครื่องมือ** (แถบแบ่งหน้า ตัวกรอง ฯลฯ) — ที่นั่นไม่มี error
   * มาแสดงอยู่แล้ว บรรทัดที่จองไว้จึงเป็นที่ว่างเปล่าที่ดันแถบสูงขึ้นเฉย ๆ
   * (วัดแล้ว: ช่องสูง 36 แต่กินที่ 56 ⇒ แถบแบ่งหน้าสูง 73px ทั้งที่ของจริงใช้ 32px)
   */
  /** บอกว่า "ช่องนี้ผิด" โดยไม่ต้องมีข้อความ — ดู `InputProps.invalid` */
  invalid?: boolean;
  reserveMessageSpace?: boolean;
  /**
   * ข้อความตอนไม่มีตัวเลือกให้เลือก · ค่าเริ่มต้น `"No options"`
   *
   * 🔴 เดิม `options=[]` ได้ **กล่องเปล่าไม่มีอะไรเลย** — ผู้ใช้กดแล้วไม่รู้ว่า
   * โหลดไม่มา ระบบพัง หรือไม่มีข้อมูลจริง ๆ
   * (ของจริงเรียกสิ่งนี้ว่า `noOptionsText` อยู่แล้ว 6 จุดบน Mediwork และ
   *  `no_options` บน Portal — DS เป็นตัวเดียวที่ไม่มี)
   */
  emptyText?: React.ReactNode;
  /**
   * ทางออกในสถานะว่าง — ปุ่มที่พาไปสร้างของที่ยังไม่มี
   *
   * 🔴 **dropdown ว่างที่ไม่มีทางออกคือทางตัน** — บันทึกไว้ตอน dev MediHR F3:
   * โรงพยาบาลที่ยังไม่เคยตั้งนโยบายเวลาทำงานเปิด dropdown แล้วเจอช่องว่าง
   * แล้วไปต่อไม่ได้ ทั้งที่ทางแก้คือไปสร้างที่หน้าตั้งค่า
   *
   * ```tsx
   * emptyAction={{ label: "เพิ่มหน่วยงาน", onClick: () => router.push("/sub-units") }}
   * ```
   */
  emptyAction?: {
    label: React.ReactNode;
    onClick: () => void;
    /** ไอคอนหน้าป้าย — ไม่ส่ง = เครื่องหมายบวก */
    icon?: React.ReactNode;
  };
  /** วาดสถานะว่างเอง — ชนะ `emptyText`/`emptyAction` */
  renderEmpty?: () => React.ReactNode;
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
  clearable,
  isLoading,
  invalid,
  reserveMessageSpace,
  emptyText = "No options",
  emptyAction,
  renderEmpty,
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
  const hasError = invalid ?? Boolean(error);
  const floating =
    Boolean(alwaysFloatLabel) || open || hasValue || Boolean(placeholder);

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isControlled) setInternalValue("" as V);
    onChange?.("" as V);
  };

  /* โครงร่างใช้ shell ตัวเดียวกับของจริง ⇒ สูงเท่ากันโดยโครงสร้าง
   * ไม่ใส่ chevron ตอนโหลด — ลูกศรบอกว่า "กดแล้วจะมีอะไรให้เลือก" ซึ่งตอนนี้ยังไม่จริง */
  if (isLoading) {
    return (
      <FieldSkeleton
        label={label}
        hint={hint}
        required={required}
        hideLabel={hideLabel}
        size={size}
        containerClassName={containerClassName}
      />
    );
  }

  return (
    <FloatingFieldShell
      disabled={disabled}
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
      reserveMessageSpace={reserveMessageSpace}
      containerClassName={containerClassName}
      rightAdornment={
        <>
          {clearable && hasValue && !disabled && (
            /* 🔴🔴 **`pointer-events-auto` ที่นี่คือสิ่งที่ทำให้ปุ่มนี้กดได้จริง**
             *
             * `FloatingFieldShell` ห่อ `rightAdornment` ด้วย `pointer-events-none` โดยเจตนา (คลิก
             * ตรงไอคอนต้องทะลุไปเปิดช่อง) และเขียนกำกับไว้เองว่า *"adornment ที่เป็นปุ่มจริงต้องเปิด
             * `pointer-events-auto` ที่ตัวมันเอง"* — `TimePicker` กับปุ่มล้างของ `DateRangePicker`
             * ทำแบบนั้นอยู่ก่อนแล้ว **แต่ตัวนี้ตกไป** ⇒ คลิกทะลุไปโดน trigger ⇒ **แผงเปิดขึ้นมา
             * แทนที่จะล้างค่า** และ `stopPropagation` ใน `handleClear` ช่วยไม่ได้เพราะ event
             * ไม่เคยถึงปุ่มเลย (ยืนยันจากจอจริงของ mediact-web-backoffice 2026-08-18)
             *
             * 🔑 **ปุ่มนี้อยู่นอก `RadixSelect.Trigger`** (shell วาง adornment เป็น sibling แบบ
             * `absolute`) ⇒ ไม่ใช่ปุ่มซ้อนปุ่ม และเปิด pointer events ได้โดยไม่ทำให้ HTML ผิด
             *
             * 🔴 **ถอด `tabIndex={-1}` ออก** — เดิมคีย์บอร์ดเข้าไม่ถึงปุ่มล้างเลย ⇒ คนที่ใช้ Tab
             * ล้างค่าไม่ได้ทั้งที่เห็นปุ่มอยู่ · ปุ่มอยู่หลัง trigger ในลำดับ DOM อยู่แล้ว
             * ⇒ ลำดับ Tab ที่ได้คือ "ช่อง → ปุ่มล้าง" ซึ่งเป็นลำดับที่อ่านจากซ้ายไปขวาพอดี */
            <button
              type="button"
              aria-label="Clear"
              onClick={handleClear}
              /* `cursor-pointer` ต้องเขียนเอง — Tailwind v4 เปลี่ยน preflight ของ `button`
               * จาก `cursor: pointer` (v3) เป็น `cursor: default` ตาม UA stylesheet
               * ⇒ ปุ่มทุกตัวที่ไม่ประกาศเองจะได้ลูกศรธรรมดา ซึ่งอ่านเหมือนกดไม่ได้ */
              className="pointer-events-auto cursor-pointer rounded-full p-0.5 hover:bg-overlay-press"
            >
              <X />
            </button>
          )}
          <ChevronDown />
        </>
      }
    >
      <RadixSelect.Root
        // The clear (×) button lives outside `Root` and can only reach it via
        // `value` — so once `clearable` is on, drive Root off `currentValue`
        // (our own controlled+uncontrolled-merged state) instead of leaving
        // Radix to manage its own copy when uncontrolled.
        value={clearable ? currentValue : isControlled ? value : undefined}
        defaultValue={defaultValue}
        onValueChange={(v) => {
          if (!isControlled) setInternalValue(v as V);
          onChange?.(v as V);
        }}
        /* 🔴 คุม `open` เอง ไม่ใช่แค่ฟัง `onOpenChange` — ปุ่มในสถานะว่างต้องสั่งปิด
         * dropdown ได้ก่อนพาไปหน้าอื่น/เปิด modal ไม่งั้นลิสต์จะค้างทับสิ่งที่เพิ่งเปิด
         * (วัดแล้ว: ก่อนแก้ กดปุ่มแล้ว `[role=listbox]` ยังอยู่) */
        open={open}
        onOpenChange={setOpen}
        disabled={disabled}
      >
        <RadixSelect.Trigger
          id={triggerId}
          aria-invalid={hasError || undefined}
          className={cn(
            fieldShapeClasses({ hasError, size }),
            /* `cursor-pointer` — ตัวเปิดเป็นปุ่มที่กดแล้วมีเมนูโผล่ ไม่ใช่ช่องพิมพ์
             * เคอร์เซอร์ลูกศรทำให้ผู้ใช้อ่านว่าเป็นข้อความอ่านอย่างเดียว
             * (`disabled:` ของ shell คุมเคสปิดใช้งานไว้แล้ว) */
            "flex cursor-pointer items-center justify-between gap-2 text-left",
            clearable ? "pr-14" : "pr-9",
            "data-[placeholder]:text-text-tertiary",
            className,
          )}
        >
          {/* 🔴 ค่าที่เลือกเป็นข้อความจากข้อมูลจริง จึงยาวเกินช่องได้เสมอ (ชื่อแผนก/หน่วยงาน
            * ของโรงพยาบาลจริงยาวกว่าที่ mock ไว้ทุกที) · ถ้าไม่ตัด ข้อความจะล้นทะลุกรอบปุ่ม
            * ไปทับหัวลูกศร — `<button>` ไม่ตัดเนื้อหาให้เองเหมือน `<input>`
            *
            * ⚠️ ต้องห่อสแปนของเราเอง **ใส่ `className` ให้ `RadixSelect.Value` ตรง ๆ ไม่ได้**
            * — Radix รุ่นนี้ไม่ส่ง `className` ต่อ มันวาด `<span style="pointer-events:none">`
            * ของมันเองแล้วทิ้งคลาสไป (พิสูจน์ด้วยการ dump DOM: สแปนนั้นไม่มี class เลย)
            * ⚠️ `min-w-0` สำคัญพอ ๆ กับ `truncate` — flex item มี `min-width:auto` เป็นค่าตั้งต้น
            * ซึ่งห้ามมันหดต่ำกว่าความกว้างเนื้อหา ⇒ `truncate` เฉย ๆ จะไม่มีผล */}
          <span className="min-w-0 truncate">
            <RadixSelect.Value placeholder={floating ? placeholder ?? "" : ""} />
          </span>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            sideOffset={4}
            className="z-50 max-h-72 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-sm border border-border-default bg-bg-default shadow-lg"
          >
            <RadixSelect.Viewport className="p-1">
              {options
                ? options.length > 0
                  ? options.map((opt) => (
                      <SelectItem
                        key={opt.value}
                        value={opt.value}
                        disabled={opt.disabled}
                      >
                        {opt.label}
                      </SelectItem>
                    ))
                  : (renderEmpty?.() ?? (
                      <SelectEmpty
                        text={emptyText}
                        action={emptyAction}
                        onActed={() => setOpen(false)}
                      />
                    ))
                : children}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </FloatingFieldShell>
  );
}

/**
 * สถานะว่างในลิสต์ — ข้อความ + ทางออก
 *
 * 🔴 **ปิด dropdown ก่อนแล้วค่อยเรียก `onClick`** — ปุ่มนี้มักพาไปหน้าอื่นหรือเปิด modal
 * ถ้าไม่ปิดก่อน dropdown จะค้างทับสิ่งที่เพิ่งเปิดขึ้นมา
 *
 * ⚠️ ปุ่มอยู่ใน `RadixSelect.Content` ซึ่งเป็น listbox — ปุ่มธรรมดาในนั้นไม่อยู่ใน
 * ลำดับการกด Tab และ Radix ดัก key อยู่ ⇒ ต้องรับ `Enter`/`Space` เองด้วย
 * ไม่งั้นคนที่ใช้คีย์บอร์ดล้วนจะไปต่อไม่ได้ ซึ่งคือกลุ่มเดียวกับที่ทางตันนี้ทำร้ายอยู่แล้ว
 */
function SelectEmpty({
  text,
  action,
  onActed,
}: {
  text: React.ReactNode;
  action?: NonNullable<SelectProps["emptyAction"]>;
  onActed: () => void;
}) {
  const fire = () => {
    onActed();
    action?.onClick();
  };
  return (
    <div className="flex flex-col items-center gap-3 px-3 py-5 text-center">
      <p className="text-body-sm text-text-tertiary">{text}</p>
      {action && (
        <button
          type="button"
          tabIndex={0}
          onClick={fire}
          onPointerUp={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              fire();
            }
          }}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border-strong bg-bg-default px-3 text-body-sm font-medium text-text-secondary transition-colors hover:bg-bg-subtle focus:outline-none focus-visible:ring-1 focus-visible:ring-brand [&_svg]:size-4"
        >
          {action.icon ?? <Plus aria-hidden />}
          {action.label}
        </button>
      )}
    </div>
  );
}

type SelectItemProps = React.ComponentProps<typeof RadixSelect.Item>;

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  function SelectItem({ className, children, ...props }, ref) {
    return (
      <RadixSelect.Item
        ref={ref}
        className={cn(
          "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-body-sm outline-none",
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

SelectItem.displayName = "SelectItem";

export { Select, SelectItem };
