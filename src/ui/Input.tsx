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
  const hasError = Boolean(error);
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
                tabIndex={-1}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isControlled) setInternalValue("");
                  onChange?.({
                    target: { value: "" },
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
                className="rounded-full p-0.5 hover:bg-overlay-hover"
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
                className="rounded-full p-0.5 hover:bg-overlay-hover"
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
