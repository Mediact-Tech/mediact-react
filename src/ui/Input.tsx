import * as React from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { cn } from "../lib/cn";
import {
  FloatingFieldShell,
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
  leftAdornment?: React.ReactNode;
  rightAdornment?: React.ReactNode;
  /** Show a clear (×) button when value is non-empty. */
  clearable?: boolean;
  containerClassName?: string;
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
      leftAdornment={leftAdornment}
      rightAdornment={
        showClear || isPassword || rightAdornment ? (
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
                className="rounded-full p-0.5 hover:bg-black/5"
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
                className="rounded-full p-0.5 hover:bg-black/5"
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </button>
            )}
            {!showClear && !isPassword && rightAdornment}
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
          leftAdornment && "pl-9",
          (showClear || isPassword || rightAdornment) && "pr-9",
          className,
        )}
        {...props}
      />
    </FloatingFieldShell>
  );
});

Input.displayName = "Input";

export { Input };
