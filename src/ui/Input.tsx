import * as React from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { cn } from "../lib/cn";
import {
  FloatingFieldShell,
  FieldSkeleton,
  fieldShapeClasses,
  type FieldSize,
} from "../form/FloatingFieldShell";

type NativeInputProps = Omit<React.ComponentProps<"input">, "size">;

export type InputProps = NativeInputProps & {
  /** Floating label — sits inside the field as placeholder, floats up on focus or when filled. */
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  /**
   * บอกว่า "ช่องนี้ผิด" โดยไม่ต้องมีข้อความ — แอปที่เก็บ `hasError:boolean` กับ
   * `errorMessage?:string` เป็นคนละตัวจะได้ไม่ต้องปลอมข้อความว่างเพื่อให้กรอบแดง
   * ไม่ส่งมา = คิดจาก `error` เหมือนเดิม
   */
  invalid?: boolean;
  /**
   * จองที่หนึ่งบรรทัดใต้ช่องไว้เสมอ กันเลย์เอาต์กระตุกตอนข้อความผิดโผล่/หาย
   * ค่าตั้งต้นของ shell คือ `true` — ส่ง `false` เมื่อฟอร์มเดิมคิดความสูงบนสมมติฐานว่า
   * "ไม่มีข้อความ = ไม่กินที่" (ฟอร์มของทั้ง 3 แอปวันนี้เป็นแบบนั้น)
   */
  reserveMessageSpace?: boolean;
  required?: boolean;
  hideLabel?: boolean;
  /** Force the label into the floated position (e.g. for fields with fixed prefixes/masks). */
  alwaysFloatLabel?: boolean;
  size?: FieldSize;
  /** ไอคอนหน้าช่องกรอก — ป้ายที่ยังไม่ลอยจะขยับไปทางขวาให้เอง */
  prefixIcon?: React.ReactNode;
  /** ไอคอนท้ายช่องกรอก — ถ้ามีปุ่มล้างค่าหรือปุ่มดูรหัสผ่าน สองตัวนั้นมาก่อน */
  suffixIcon?: React.ReactNode;
  /** @deprecated ใช้ `prefixIcon` — ชื่อเดิมไม่มีแอปไหนเรียกเลย ส่วน `prefixIcon` ถูกเรียก 27 จุด */
  leftAdornment?: React.ReactNode;
  /** @deprecated ใช้ `suffixIcon` — ชื่อเดิมไม่มีแอปไหนเรียกเลย ส่วน `suffixIcon` ถูกเรียก 29 จุด */
  rightAdornment?: React.ReactNode;
  /** Show a clear (×) button when value is non-empty. */
  clearable?: boolean;
  containerClassName?: string;
  /** ข้อมูลยังมาไม่ถึง — แทนช่องกรอกด้วยโครงร่างที่สูงเท่ากันทุกประการ */
  isLoading?: boolean;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    id,
    className,
    containerClassName,
    type = "text",
    label,
    hint,
    error,
    invalid,
    reserveMessageSpace,
    required,
    hideLabel,
    alwaysFloatLabel,
    size = "md",
    prefixIcon,
    suffixIcon,
    leftAdornment,
    rightAdornment,
    clearable,
    value,
    defaultValue,
    onFocus,
    onBlur,
    onChange,
    disabled,
    placeholder,
    isLoading,
    ...props
  },
  ref,
) {
  const reactId = React.useId();
  const inputId = id ?? reactId;
  const [focused, setFocused] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");

  const isPassword = type === "password";
  const effectiveType = isPassword && showPassword ? "text" : type;
  const hasError = invalid ?? Boolean(error);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const hasValue = currentValue != null && String(currentValue).length > 0;
  const floating =
    Boolean(alwaysFloatLabel) || focused || hasValue || Boolean(placeholder);
  const showClear = Boolean(clearable && hasValue && !disabled);
  // ชื่อใหม่ชนะเสมอ ชื่อเดิมยังรับได้เพื่อไม่ให้ของที่เขียนไปแล้วพัง
  const prefix = prefixIcon ?? leftAdornment;
  const suffix = suffixIcon ?? rightAdornment;

  /* โครงร่างใช้ shell ตัวเดียวกับของจริง ⇒ สูงเท่ากันโดยโครงสร้าง */
  if (isLoading) {
    return (
      <FieldSkeleton
        label={label}
        hint={hint}
        required={required}
        hideLabel={hideLabel}
        size={size}
        leftAdornment={prefix}
        containerClassName={containerClassName}
      />
    );
  }

  return (
    <FloatingFieldShell
      label={label}
      hint={hint}
      error={error}
      reserveMessageSpace={reserveMessageSpace}
      required={required}
      hideLabel={hideLabel}
      htmlFor={inputId}
      size={size}
      floating={floating}
      focused={focused}
      hasError={hasError}
      leftAdornment={prefix}
      rightAdornment={
        showClear || isPassword || suffix ? (
          <>
            {showClear && (
              <button
                type="button"
                aria-label="Clear"
                /* ⚠️ คง `tabIndex={-1}` ไว้ตามเดิมโดยเจตนา — `Input` ถูกใช้กว้างมาก
                 * การเพิ่มจุดหยุด Tab จะเปลี่ยนลำดับคีย์บอร์ดของฟอร์มทั้งระบบ ซึ่งเกินขอบเขต
                 * ของบั๊กที่พิสูจน์ได้ (กดด้วยเมาส์ไม่ได้) */
                tabIndex={-1}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isControlled) setInternalValue("");
                  onChange?.({
                    target: { value: "" },
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
                /* 🔴 **บั๊กเดียวกับปุ่มล้างของ `Select`** — `FloatingFieldShell` ห่อ `rightAdornment`
                 * ด้วย `pointer-events-none` (เขียนกำกับไว้เองว่า adornment ที่เป็นปุ่มจริงต้องเปิด
                 * กลับที่ตัวมันเอง) ⇒ ของเดิม **กดด้วยเมาส์ไม่ได้เลย** และเงียบสนิทเพราะ event
                 * ไม่เคยถึงปุ่ม · `cursor-pointer` ต้องเขียนเองเพราะ Tailwind v4 เปลี่ยน preflight
                 * ของ `button` เป็น `cursor: default` (v3 เป็น `pointer`) */
                className="pointer-events-auto cursor-pointer rounded-full p-0.5 hover:bg-overlay-hover"
              >
                <X />
              </button>
            )}
            {isPassword && (
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
                onClick={() => setShowPassword((s) => !s)}
                /* กดไม่ได้ด้วยเหตุเดียวกับปุ่มล้างข้างบน — ปุ่มแสดง/ซ่อนรหัสผ่านของทุกฟอร์มล็อกอิน
                 * อยู่ใต้ตัวห่อ `pointer-events-none` เหมือนกัน */
                className="pointer-events-auto cursor-pointer rounded-full p-0.5 hover:bg-overlay-hover"
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </button>
            )}
            {!showClear && !isPassword && suffix}
          </>
        ) : null
      }
      containerClassName={containerClassName}
    >
      <input
        ref={ref}
        id={inputId}
        type={effectiveType}
        value={isControlled ? value : internalValue}
        disabled={disabled}
        placeholder={floating ? placeholder : undefined}
        aria-invalid={hasError || undefined}
        aria-required={required || undefined}
        aria-label={hideLabel && typeof label === "string" ? label : undefined}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        onChange={(e) => {
          if (!isControlled) setInternalValue(e.target.value);
          onChange?.(e);
        }}
        className={cn(
          fieldShapeClasses({ hasError, size }),
          prefix && "pl-9",
          (showClear || isPassword || suffix) && "pr-9",
          className,
        )}
        {...props}
      />
    </FloatingFieldShell>
  );
});

Input.displayName = "Input";

export { Input };
