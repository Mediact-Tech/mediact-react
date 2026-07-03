// src/ui/Button.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

// src/lib/cn.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// src/ui/Button.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all rounded-sm cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-40 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-brand text-brand-foreground shadow-xs hover:bg-brand-hover",
        secondary: "border border-brand text-brand bg-white shadow-xs hover:bg-brand-subtle",
        ghost: "bg-transparent hover:bg-gray-50",
        destructive: "bg-red-600 text-white shadow-xs hover:bg-red-800",
        success: "bg-success-green-primary text-white shadow-sm hover:bg-success-green-primary-hover",
        warning: "bg-warning-normal text-white shadow-md hover:bg-warning-hover"
      },
      size: {
        xs: "h-7 px-2 text-sm [&_svg:not([class*='size-'])]:size-4",
        sm: "h-8 px-3 text-sm [&_svg:not([class*='size-'])]:size-4",
        md: "h-9 px-3 text-sm [&_svg:not([class*='size-'])]:size-4",
        lg: "h-11 px-4 text-base [&_svg:not([class*='size-'])]:size-5",
        xl: "h-12 px-5 text-base [&_svg:not([class*='size-'])]:size-6"
      },
      fullWidth: {
        true: "w-full"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);
var Spinner = () => /* @__PURE__ */ jsxs(
  "svg",
  {
    className: "size-4 animate-spin",
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": "true",
    children: [
      /* @__PURE__ */ jsx(
        "circle",
        {
          cx: "12",
          cy: "12",
          r: "10",
          stroke: "currentColor",
          strokeWidth: "3",
          opacity: "0.25"
        }
      ),
      /* @__PURE__ */ jsx(
        "path",
        {
          fill: "currentColor",
          d: "M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
        }
      )
    ]
  }
);
var Button = React.forwardRef(
  ({
    className,
    variant,
    size,
    fullWidth,
    asChild = false,
    loading = false,
    disabled,
    leftIcon,
    rightIcon,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;
    return /* @__PURE__ */ jsxs(
      Comp,
      {
        ref,
        "data-slot": "button",
        "data-loading": loading || void 0,
        className: cn(buttonVariants({ variant, size, fullWidth, className })),
        disabled: isDisabled,
        "aria-busy": loading || void 0,
        ...props,
        children: [
          loading ? /* @__PURE__ */ jsx(Spinner, {}) : leftIcon,
          children,
          !loading && rightIcon
        ]
      }
    );
  }
);
Button.displayName = "Button";

// src/ui/AddButton.tsx
import * as React3 from "react";
import { Slot as Slot3 } from "@radix-ui/react-slot";
import { Plus } from "lucide-react";

// src/ui/SolidButton.tsx
import * as React2 from "react";
import { Slot as Slot2 } from "@radix-ui/react-slot";
import { cva as cva2 } from "class-variance-authority";
import { jsx as jsx2 } from "react/jsx-runtime";
var solidButtonVariants = cva2(
  "cursor-pointer inline-flex shrink-0 items-center justify-center gap-1 whitespace-nowrap px-3 py-2 text-sm font-medium leading-6 tracking-normal text-slate-50 transition-all outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-30 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        info: "rounded-md bg-brand-active shadow-sm hover:bg-info-blue-primary-hover disabled:hover:bg-brand-active",
        warning: "rounded-md bg-warning-normal shadow-md hover:bg-warning-hover disabled:hover:bg-warning-normal",
        success: "rounded-sm bg-success-green-primary shadow-sm hover:bg-success-green-primary-hover disabled:hover:bg-success-green-primary",
        primary: "rounded-sm bg-brand shadow-xs hover:bg-brand-hover disabled:hover:bg-brand"
      },
      size: {
        sm: "h-8 [&_svg:not([class*='size-'])]:size-4",
        md: "h-9 [&_svg:not([class*='size-'])]:size-4",
        lg: "h-11 [&_svg:not([class*='size-'])]:size-5"
      }
    },
    defaultVariants: {
      variant: "info",
      size: "lg"
    }
  }
);
var SolidButton = React2.forwardRef(
  ({ className, variant, size, asChild = false, label, children, ...props }, ref) => {
    const Comp = asChild ? Slot2 : "button";
    return /* @__PURE__ */ jsx2(
      Comp,
      {
        ref,
        "data-slot": "button",
        className: cn(solidButtonVariants({ variant, size, className })),
        ...props,
        children: children ?? label
      }
    );
  }
);
SolidButton.displayName = "SolidButton";

// src/ui/AddButton.tsx
import { Fragment, jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
var AddButton = React3.forwardRef(
  ({ className, variant, size, asChild = false, label, children, ...props }, ref) => {
    const Comp = asChild ? Slot3 : "button";
    return /* @__PURE__ */ jsx3(
      Comp,
      {
        ref,
        "data-slot": "button",
        className: cn(solidButtonVariants({ variant, size, className })),
        ...props,
        children: asChild ? children : /* @__PURE__ */ jsxs2(Fragment, { children: [
          /* @__PURE__ */ jsx3(Plus, { className: "size-4", "aria-hidden": "true" }),
          children ?? label
        ] })
      }
    );
  }
);
AddButton.displayName = "AddButton";

// src/ui/OutlineButton.tsx
import * as React4 from "react";
import { Slot as Slot4 } from "@radix-ui/react-slot";
import { cva as cva3 } from "class-variance-authority";
import { jsx as jsx4 } from "react/jsx-runtime";
var outlineButtonVariants = cva3(
  "cursor-pointer inline-flex shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-md border bg-white px-3 py-2 text-sm font-medium leading-6 tracking-normal shadow-xs transition-all outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        brand: "border-brand-active text-brand-active hover:bg-brand-active/10",
        neutral: "border-slate-200 text-slate-900 hover:bg-gray-100"
      },
      size: {
        sm: "h-8 [&_svg:not([class*='size-'])]:size-4",
        md: "h-9 [&_svg:not([class*='size-'])]:size-4",
        lg: "h-11 [&_svg:not([class*='size-'])]:size-5"
      }
    },
    defaultVariants: {
      variant: "brand",
      size: "lg"
    }
  }
);
var OutlineButton = React4.forwardRef(
  ({ className, variant, size, asChild = false, label, children, ...props }, ref) => {
    const Comp = asChild ? Slot4 : "button";
    return /* @__PURE__ */ jsx4(
      Comp,
      {
        ref,
        "data-slot": "button",
        className: cn(outlineButtonVariants({ variant, size, className })),
        ...props,
        children: children ?? label
      }
    );
  }
);
OutlineButton.displayName = "OutlineButton";

// src/ui/Input.tsx
import * as React5 from "react";
import { Eye, EyeOff, X } from "lucide-react";

// src/form/FloatingFieldShell.tsx
import { jsx as jsx5, jsxs as jsxs3 } from "react/jsx-runtime";
var sizeClasses = {
  sm: { labelTextRest: "text-sm", labelTextFloat: "text-[11px]" },
  md: { labelTextRest: "text-sm", labelTextFloat: "text-xs" },
  lg: { labelTextRest: "text-base", labelTextFloat: "text-xs" }
};
function FloatingFieldShell({
  label,
  hint,
  error,
  required,
  hideLabel,
  htmlFor,
  size = "md",
  floating,
  focused,
  hasError: hasErrorProp,
  leftAdornment,
  rightAdornment,
  containerClassName,
  multiline,
  children
}) {
  const hasError = hasErrorProp ?? Boolean(error);
  const sz = sizeClasses[size];
  const showLabel = label != null && !hideLabel;
  return /* @__PURE__ */ jsxs3("div", { className: cn("flex w-full flex-col gap-1", containerClassName), children: [
    /* @__PURE__ */ jsxs3("div", { className: "relative w-full", children: [
      showLabel && /* @__PURE__ */ jsxs3(
        "label",
        {
          htmlFor,
          className: cn(
            "pointer-events-none absolute truncate transition-all duration-150 ease-out",
            "max-w-[calc(100%-1.5rem)]",
            floating ? cn(
              "-top-1.5 left-2 px-1.5 font-medium bg-white",
              sz.labelTextFloat,
              hasError ? "text-cherry-red-600" : focused ? "text-brand" : "text-text-body"
            ) : cn(
              "font-normal",
              multiline ? "top-3" : "top-1/2 -translate-y-1/2",
              sz.labelTextRest,
              "text-text-tertiary",
              leftAdornment ? "left-9" : "left-3"
            )
          ),
          children: [
            label,
            required && /* @__PURE__ */ jsx5("span", { className: "ml-0.5 text-cherry-red-600", children: "*" })
          ]
        }
      ),
      leftAdornment && /* @__PURE__ */ jsx5("span", { className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary [&_svg]:size-4", children: leftAdornment }),
      children,
      rightAdornment && /* @__PURE__ */ jsx5("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-text-tertiary [&_svg]:size-4", children: rightAdornment })
    ] }),
    hasError ? /* @__PURE__ */ jsx5(
      "p",
      {
        id: htmlFor ? `${htmlFor}-error` : void 0,
        role: "alert",
        className: "text-xs font-medium text-cherry-red-600",
        children: error
      }
    ) : hint ? /* @__PURE__ */ jsx5("p", { className: "text-xs text-text-tertiary", children: hint }) : null
  ] });
}
function fieldShapeClasses({
  hasError,
  size
}) {
  const heights2 = {
    sm: "h-9 text-sm",
    md: "h-11 text-sm",
    lg: "h-12 text-base"
  };
  return [
    "w-full rounded-sm border bg-white px-3 font-medium transition-colors",
    "focus:outline-none focus:ring-1",
    "disabled:cursor-not-allowed disabled:bg-gray-50",
    heights2[size],
    hasError ? "border-cherry-red-600 focus:border-cherry-red-600 focus:ring-cherry-red-600/40" : "border-border-strong focus:border-brand focus:ring-brand/30"
  ].join(" ");
}

// src/ui/Input.tsx
import { Fragment as Fragment2, jsx as jsx6, jsxs as jsxs4 } from "react/jsx-runtime";
var Input = React5.forwardRef(function Input2({
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
}, ref) {
  const reactId = React5.useId();
  const inputId = id ?? reactId;
  const [focused, setFocused] = React5.useState(false);
  const [showPassword, setShowPassword] = React5.useState(false);
  const [internalValue, setInternalValue] = React5.useState(defaultValue ?? "");
  const isPassword = type === "password";
  const effectiveType = isPassword && showPassword ? "text" : type;
  const hasError = Boolean(error);
  const isControlled = value !== void 0;
  const currentValue = isControlled ? value : internalValue;
  const hasValue = currentValue != null && String(currentValue).length > 0;
  const floating = Boolean(alwaysFloatLabel) || focused || hasValue || Boolean(placeholder);
  const showClear = Boolean(clearable && hasValue && !disabled);
  return /* @__PURE__ */ jsx6(
    FloatingFieldShell,
    {
      label,
      hint,
      error,
      required,
      hideLabel,
      htmlFor: inputId,
      size,
      floating,
      focused,
      hasError,
      leftAdornment,
      rightAdornment: showClear || isPassword || rightAdornment ? /* @__PURE__ */ jsxs4(Fragment2, { children: [
        showClear && /* @__PURE__ */ jsx6(
          "button",
          {
            type: "button",
            "aria-label": "Clear",
            tabIndex: -1,
            onClick: (e) => {
              e.stopPropagation();
              if (!isControlled) setInternalValue("");
              onChange?.({
                target: { value: "" }
              });
            },
            className: "rounded-full p-0.5 hover:bg-black/5",
            children: /* @__PURE__ */ jsx6(X, {})
          }
        ),
        isPassword && /* @__PURE__ */ jsx6(
          "button",
          {
            type: "button",
            "aria-label": showPassword ? "Hide password" : "Show password",
            tabIndex: -1,
            onClick: () => setShowPassword((s) => !s),
            className: "rounded-full p-0.5 hover:bg-black/5",
            children: showPassword ? /* @__PURE__ */ jsx6(Eye, {}) : /* @__PURE__ */ jsx6(EyeOff, {})
          }
        ),
        !showClear && !isPassword && rightAdornment
      ] }) : null,
      containerClassName,
      children: /* @__PURE__ */ jsx6(
        "input",
        {
          ref,
          id: inputId,
          type: effectiveType,
          value: isControlled ? value : internalValue,
          disabled,
          placeholder: floating ? placeholder : void 0,
          "aria-invalid": hasError || void 0,
          "aria-required": required || void 0,
          "aria-label": hideLabel && typeof label === "string" ? label : void 0,
          onFocus: (e) => {
            setFocused(true);
            onFocus?.(e);
          },
          onBlur: (e) => {
            setFocused(false);
            onBlur?.(e);
          },
          onChange: (e) => {
            if (!isControlled) setInternalValue(e.target.value);
            onChange?.(e);
          },
          className: cn(
            fieldShapeClasses({ hasError, size }),
            leftAdornment && "pl-9",
            (showClear || isPassword || rightAdornment) && "pr-9",
            className
          ),
          ...props
        }
      )
    }
  );
});
Input.displayName = "Input";

// src/ui/Textarea.tsx
import * as React6 from "react";
import { jsx as jsx7, jsxs as jsxs5 } from "react/jsx-runtime";
var minHeights = {
  sm: "min-h-[72px]",
  md: "min-h-[88px]",
  lg: "min-h-[104px]"
};
var Textarea = React6.forwardRef(
  function Textarea2({
    id,
    className,
    containerClassName,
    label,
    hint,
    error,
    required,
    hideLabel,
    alwaysFloatLabel,
    size = "md",
    showCount,
    maxLength,
    value,
    defaultValue,
    placeholder,
    onFocus,
    onBlur,
    onChange,
    disabled,
    ...props
  }, ref) {
    const reactId = React6.useId();
    const inputId = id ?? reactId;
    const [focused, setFocused] = React6.useState(false);
    const [internalValue, setInternalValue] = React6.useState(defaultValue ?? "");
    const hasError = Boolean(error);
    const isControlled = value !== void 0;
    const currentValue = isControlled ? value : internalValue;
    const hasValue = currentValue != null && String(currentValue).length > 0;
    const floating = Boolean(alwaysFloatLabel) || focused || hasValue || Boolean(placeholder);
    const length = currentValue == null ? 0 : String(currentValue).length;
    const counter = showCount && maxLength != null ? `${length} / ${maxLength}` : null;
    const hintWithCounter = counter ? /* @__PURE__ */ jsxs5("span", { className: "flex justify-between gap-2", children: [
      /* @__PURE__ */ jsx7("span", { children: hint }),
      /* @__PURE__ */ jsx7("span", { children: counter })
    ] }) : hint;
    return /* @__PURE__ */ jsx7(
      FloatingFieldShell,
      {
        label,
        hint: hintWithCounter,
        error,
        required,
        hideLabel,
        htmlFor: inputId,
        size,
        floating,
        focused,
        hasError,
        containerClassName,
        multiline: true,
        children: /* @__PURE__ */ jsx7(
          "textarea",
          {
            ref,
            id: inputId,
            value: isControlled ? value : internalValue,
            maxLength,
            disabled,
            placeholder: floating ? placeholder : void 0,
            "aria-invalid": hasError || void 0,
            "aria-required": required || void 0,
            onFocus: (e) => {
              setFocused(true);
              onFocus?.(e);
            },
            onBlur: (e) => {
              setFocused(false);
              onBlur?.(e);
            },
            onChange: (e) => {
              if (!isControlled) setInternalValue(e.target.value);
              onChange?.(e);
            },
            className: cn(
              "w-full rounded-sm border bg-white px-3 py-2.5 text-sm font-medium transition-colors resize-y",
              "focus:outline-none focus:ring-1",
              "disabled:cursor-not-allowed disabled:bg-gray-50",
              minHeights[size],
              hasError ? "border-cherry-red-600 focus:border-cherry-red-600 focus:ring-cherry-red-600/40" : "border-border-strong focus:border-brand focus:ring-brand/30",
              className
            ),
            ...props
          }
        )
      }
    );
  }
);
Textarea.displayName = "Textarea";

// src/ui/Checkbox.tsx
import * as React7 from "react";
import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { jsx as jsx8, jsxs as jsxs6 } from "react/jsx-runtime";
var Checkbox = React7.forwardRef(
  function Checkbox2({
    id,
    className,
    containerClassName,
    label,
    description,
    error,
    checked,
    disabled,
    ...props
  }, ref) {
    const reactId = React7.useId();
    const inputId = id ?? reactId;
    const hasError = Boolean(error);
    const isIndeterminate = checked === "indeterminate";
    const box = /* @__PURE__ */ jsx8(
      RadixCheckbox.Root,
      {
        ref,
        id: inputId,
        checked,
        disabled,
        "aria-invalid": hasError || void 0,
        className: cn(
          "peer relative flex size-5 shrink-0 items-center justify-center rounded-sm border bg-white transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "data-[state=checked]:bg-brand data-[state=checked]:border-brand",
          "data-[state=indeterminate]:bg-brand data-[state=indeterminate]:border-brand",
          hasError ? "border-cherry-red-600" : "border-border-input",
          className
        ),
        ...props,
        children: /* @__PURE__ */ jsx8(RadixCheckbox.Indicator, { className: "text-white", children: isIndeterminate ? /* @__PURE__ */ jsx8(Minus, { className: "size-3.5" }) : /* @__PURE__ */ jsx8(Check, { className: "size-3.5" }) })
      }
    );
    if (label == null && description == null && error == null) {
      return box;
    }
    return /* @__PURE__ */ jsxs6("div", { className: cn("flex flex-col gap-1", containerClassName), children: [
      /* @__PURE__ */ jsxs6(
        "label",
        {
          htmlFor: inputId,
          className: cn(
            "inline-flex items-start gap-2 text-sm font-medium text-text-primary",
            disabled && "cursor-not-allowed opacity-60"
          ),
          children: [
            box,
            (label != null || description != null) && /* @__PURE__ */ jsxs6("span", { className: "flex flex-col gap-0.5 leading-tight", children: [
              label != null && /* @__PURE__ */ jsx8("span", { children: label }),
              description != null && /* @__PURE__ */ jsx8("span", { className: "text-xs font-normal text-text-tertiary", children: description })
            ] })
          ]
        }
      ),
      hasError && /* @__PURE__ */ jsx8("p", { role: "alert", className: "text-xs font-medium text-cherry-red-600", children: error })
    ] });
  }
);
Checkbox.displayName = "Checkbox";

// src/ui/Switch.tsx
import * as React8 from "react";
import * as RadixSwitch from "@radix-ui/react-switch";
import { jsx as jsx9, jsxs as jsxs7 } from "react/jsx-runtime";
var Switch = React8.forwardRef(function Switch2({
  id,
  className,
  containerClassName,
  label,
  description,
  error,
  labelPosition = "right",
  disabled,
  ...props
}, ref) {
  const reactId = React8.useId();
  const inputId = id ?? reactId;
  const hasError = Boolean(error);
  const sw = /* @__PURE__ */ jsx9(
    RadixSwitch.Root,
    {
      ref,
      id: inputId,
      disabled,
      "aria-invalid": hasError || void 0,
      className: cn(
        "peer relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-brand data-[state=unchecked]:bg-gray-300",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx9(
        RadixSwitch.Thumb,
        {
          className: cn(
            "pointer-events-none block size-5 rounded-full bg-white shadow ring-0 transition-transform",
            "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
          )
        }
      )
    }
  );
  if (label == null && description == null && error == null) {
    return sw;
  }
  const labelEl = (label != null || description != null) && /* @__PURE__ */ jsxs7("span", { className: "flex flex-col gap-0.5 leading-tight", children: [
    label != null && /* @__PURE__ */ jsx9("span", { className: "text-sm font-medium text-text-primary", children: label }),
    description != null && /* @__PURE__ */ jsx9("span", { className: "text-xs text-text-tertiary", children: description })
  ] });
  return /* @__PURE__ */ jsxs7("div", { className: cn("flex flex-col gap-1", containerClassName), children: [
    /* @__PURE__ */ jsxs7(
      "label",
      {
        htmlFor: inputId,
        className: cn(
          "inline-flex items-center gap-3",
          disabled && "cursor-not-allowed opacity-60"
        ),
        children: [
          labelPosition === "left" && labelEl,
          sw,
          labelPosition === "right" && labelEl
        ]
      }
    ),
    hasError && /* @__PURE__ */ jsx9("p", { role: "alert", className: "text-xs font-medium text-cherry-red-600", children: error })
  ] });
});
Switch.displayName = "Switch";

// src/ui/RadioGroup.tsx
import * as React9 from "react";
import * as RadixRadio from "@radix-ui/react-radio-group";

// src/form/FormField.tsx
import { Label } from "@radix-ui/react-label";
import { jsx as jsx10, jsxs as jsxs8 } from "react/jsx-runtime";
function FormField({
  label,
  hint,
  error,
  required,
  htmlFor,
  hideLabel,
  className,
  children
}) {
  const showError = Boolean(error);
  return /* @__PURE__ */ jsxs8("div", { className: cn("flex w-full flex-col gap-1.5", className), children: [
    label != null && /* @__PURE__ */ jsxs8(
      Label,
      {
        htmlFor,
        className: cn(
          "text-sm font-medium text-text-primary",
          hideLabel && "sr-only"
        ),
        children: [
          label,
          required && /* @__PURE__ */ jsx10("span", { className: "ml-1 text-cherry-red-600", children: "*" })
        ]
      }
    ),
    children,
    showError ? /* @__PURE__ */ jsx10(
      "p",
      {
        role: "alert",
        className: "text-xs font-medium text-cherry-red-600",
        children: error
      }
    ) : hint ? /* @__PURE__ */ jsx10("p", { className: "text-xs text-text-tertiary", children: hint }) : null
  ] });
}

// src/ui/RadioGroup.tsx
import { jsx as jsx11, jsxs as jsxs9 } from "react/jsx-runtime";
function RadioGroup({
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
}) {
  const reactId = React9.useId();
  const groupId = id ?? reactId;
  const hasError = Boolean(error);
  return /* @__PURE__ */ jsx11(
    FormField,
    {
      label,
      hint,
      error,
      required,
      htmlFor: groupId,
      className: containerClassName,
      children: /* @__PURE__ */ jsx11(
        RadixRadio.Root,
        {
          id: groupId,
          "aria-invalid": hasError || void 0,
          className: cn(
            "flex gap-4",
            orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
            className
          ),
          ...props,
          children: options ? options.map((opt) => /* @__PURE__ */ jsx11(
            RadioGroupItem,
            {
              value: opt.value,
              disabled: opt.disabled,
              description: opt.description,
              children: opt.label
            },
            opt.value
          )) : children
        }
      )
    }
  );
}
var RadioGroupItem = React9.forwardRef(
  function RadioGroupItem2({ id, value, disabled, description, children, className, ...props }, ref) {
    const reactId = React9.useId();
    const itemId = id ?? reactId;
    return /* @__PURE__ */ jsxs9(
      "label",
      {
        htmlFor: itemId,
        className: cn(
          "inline-flex cursor-pointer items-start gap-2 text-sm font-medium text-text-primary",
          disabled && "cursor-not-allowed opacity-60"
        ),
        children: [
          /* @__PURE__ */ jsx11(
            RadixRadio.Item,
            {
              ref,
              id: itemId,
              value,
              disabled,
              className: cn(
                "mt-0.5 size-4 shrink-0 rounded-full border border-border-input bg-white transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
                "data-[state=checked]:border-brand",
                "disabled:cursor-not-allowed disabled:opacity-50",
                className
              ),
              ...props,
              children: /* @__PURE__ */ jsx11(RadixRadio.Indicator, { className: "flex size-full items-center justify-center after:size-2 after:rounded-full after:bg-brand" })
            }
          ),
          /* @__PURE__ */ jsxs9("span", { className: "flex flex-col gap-0.5 leading-tight", children: [
            children,
            description != null && /* @__PURE__ */ jsx11("span", { className: "text-xs font-normal text-text-tertiary", children: description })
          ] })
        ]
      }
    );
  }
);
RadioGroupItem.displayName = "RadioGroupItem";

// src/ui/Select.tsx
import * as React10 from "react";
import * as RadixSelect from "@radix-ui/react-select";
import { Check as Check2, ChevronDown } from "lucide-react";
import { jsx as jsx12, jsxs as jsxs10 } from "react/jsx-runtime";
function Select({
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
  children
}) {
  const reactId = React10.useId();
  const triggerId = id ?? reactId;
  const [open, setOpen] = React10.useState(false);
  const [internalValue, setInternalValue] = React10.useState(
    defaultValue
  );
  const isControlled = value !== void 0;
  const currentValue = isControlled ? value : internalValue;
  const hasValue = currentValue != null && currentValue !== "";
  const hasError = Boolean(error);
  const floating = Boolean(alwaysFloatLabel) || open || hasValue || Boolean(placeholder);
  return /* @__PURE__ */ jsx12(
    FloatingFieldShell,
    {
      label,
      hint,
      error,
      required,
      hideLabel,
      htmlFor: triggerId,
      size,
      floating,
      focused: open,
      hasError,
      containerClassName,
      rightAdornment: /* @__PURE__ */ jsx12(ChevronDown, {}),
      children: /* @__PURE__ */ jsxs10(
        RadixSelect.Root,
        {
          value: isControlled ? value : void 0,
          defaultValue,
          onValueChange: (v) => {
            if (!isControlled) setInternalValue(v);
            onChange?.(v);
          },
          onOpenChange: setOpen,
          disabled,
          children: [
            /* @__PURE__ */ jsx12(
              RadixSelect.Trigger,
              {
                id: triggerId,
                "aria-invalid": hasError || void 0,
                className: cn(
                  fieldShapeClasses({ hasError, size }),
                  "flex items-center justify-between gap-2 text-left pr-9",
                  "data-[placeholder]:text-text-tertiary",
                  className
                ),
                children: /* @__PURE__ */ jsx12(RadixSelect.Value, { placeholder: floating ? placeholder ?? "" : "" })
              }
            ),
            /* @__PURE__ */ jsx12(RadixSelect.Portal, { children: /* @__PURE__ */ jsx12(
              RadixSelect.Content,
              {
                position: "popper",
                sideOffset: 4,
                className: "z-50 max-h-72 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-sm border border-border-default bg-white shadow-lg",
                children: /* @__PURE__ */ jsx12(RadixSelect.Viewport, { className: "p-1", children: options ? options.map((opt) => /* @__PURE__ */ jsx12(
                  SelectItem,
                  {
                    value: opt.value,
                    disabled: opt.disabled,
                    children: opt.label
                  },
                  opt.value
                )) : children })
              }
            ) })
          ]
        }
      )
    }
  );
}
var SelectItem = React10.forwardRef(
  function SelectItem2({ className, children, ...props }, ref) {
    return /* @__PURE__ */ jsxs10(
      RadixSelect.Item,
      {
        ref,
        className: cn(
          "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none",
          "focus:bg-brand-subtle data-[highlighted]:bg-brand-subtle",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          className
        ),
        ...props,
        children: [
          /* @__PURE__ */ jsx12(RadixSelect.ItemText, { children }),
          /* @__PURE__ */ jsx12("span", { className: "absolute right-2 flex size-4 items-center justify-center", children: /* @__PURE__ */ jsx12(RadixSelect.ItemIndicator, { children: /* @__PURE__ */ jsx12(Check2, { className: "size-4 text-text-primary" }) }) })
        ]
      }
    );
  }
);
SelectItem.displayName = "SelectItem";

// src/ui/Chip.tsx
import * as React11 from "react";
import { X as X2 } from "lucide-react";
import { cva as cva4 } from "class-variance-authority";
import { jsx as jsx13, jsxs as jsxs11 } from "react/jsx-runtime";
var chipVariants = cva4(
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border font-medium transition-colors",
  {
    variants: {
      variant: {
        neutral: "border-border-default bg-white text-text-primary",
        primary: "border-brand/20 bg-brand-subtle text-brand",
        success: "border-success-green-200 bg-success-green-50 text-success-green-800",
        warning: "border-warning-yellow-200 bg-warning-yellow-50 text-warning-yellow-800",
        danger: "border-cherry-red-200 bg-cherry-red-50 text-cherry-red-800",
        info: "border-info-blue-200 bg-info-blue-50 text-info-blue-800"
      },
      size: {
        sm: "h-6 px-2 text-xs [&_svg]:size-3",
        md: "h-7 px-3 text-sm [&_svg]:size-3.5",
        lg: "h-8 px-3.5 text-sm [&_svg]:size-4"
      },
      interactive: {
        true: "cursor-pointer hover:opacity-80 active:scale-95",
        false: ""
      }
    },
    defaultVariants: {
      variant: "neutral",
      size: "md",
      interactive: false
    }
  }
);
var Chip = React11.forwardRef(function Chip2({
  className,
  variant,
  size,
  interactive,
  leftIcon,
  removable,
  onRemove,
  onClick,
  children,
  ...props
}, ref) {
  const isInteractive = interactive ?? Boolean(onClick);
  return /* @__PURE__ */ jsxs11(
    "span",
    {
      ref,
      onClick,
      className: cn(
        chipVariants({ variant, size, interactive: isInteractive }),
        className
      ),
      ...props,
      children: [
        leftIcon,
        children,
        removable && /* @__PURE__ */ jsx13(
          "button",
          {
            type: "button",
            "aria-label": "Remove",
            onClick: (e) => {
              e.stopPropagation();
              onRemove?.(e);
            },
            className: "-mr-1 rounded-full p-0.5 hover:bg-black/10",
            children: /* @__PURE__ */ jsx13(X2, {})
          }
        )
      ]
    }
  );
});
Chip.displayName = "Chip";

// src/ui/Avatar.tsx
import * as React12 from "react";
import * as RadixAvatar from "@radix-ui/react-avatar";
import { cva as cva5 } from "class-variance-authority";
import { jsx as jsx14, jsxs as jsxs12 } from "react/jsx-runtime";
var avatarVariants = cva5(
  "relative flex shrink-0 overflow-hidden rounded-full bg-gray-100 text-text-tertiary",
  {
    variants: {
      size: {
        xs: "size-6 text-[10px]",
        sm: "size-8 text-xs",
        md: "size-10 text-sm",
        lg: "size-12 text-base",
        xl: "size-16 text-lg"
      }
    },
    defaultVariants: { size: "md" }
  }
);
var TITLE_PREFIXES = /* @__PURE__ */ new Set([
  // Thai medical / academic / honorific
  "\u0E19\u0E1E",
  "\u0E1E\u0E0D",
  "\u0E17\u0E1E",
  "\u0E17\u0E1E\u0E0D",
  "\u0E20\u0E01",
  "\u0E20\u0E01\u0E0D",
  "\u0E2A\u0E1E",
  "\u0E2A\u0E1E\u0E0D",
  "\u0E14\u0E23",
  "\u0E1C\u0E28",
  "\u0E23\u0E28",
  "\u0E28",
  "\u0E19\u0E32\u0E22",
  "\u0E19\u0E32\u0E07",
  "\u0E19\u0E32\u0E07\u0E2A\u0E32\u0E27",
  "\u0E19\u0E2A",
  // English
  "mr",
  "mrs",
  "ms",
  "miss",
  "dr",
  "prof"
]);
function initials(name) {
  if (!name) return "";
  let parts = name.trim().split(/\s+/).filter(Boolean);
  while (parts.length > 1 && TITLE_PREFIXES.has(parts[0].replace(/\./g, "").toLowerCase())) {
    parts = parts.slice(1);
  }
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
var Avatar = React12.forwardRef(function Avatar2({ className, size, src, name, fallback, ...props }, ref) {
  return /* @__PURE__ */ jsxs12(
    RadixAvatar.Root,
    {
      ref,
      className: cn(avatarVariants({ size }), className),
      ...props,
      children: [
        src && /* @__PURE__ */ jsx14(
          RadixAvatar.Image,
          {
            src,
            alt: name ?? "",
            className: "size-full object-cover"
          }
        ),
        /* @__PURE__ */ jsx14(
          RadixAvatar.Fallback,
          {
            delayMs: src ? 200 : void 0,
            className: "flex size-full items-center justify-center font-semibold",
            children: fallback ?? initials(name)
          }
        )
      ]
    }
  );
});

// src/navigation/TopNav.tsx
import * as React14 from "react";
import { Bell, ChevronDown as ChevronDown2, LogOut } from "lucide-react";

// src/overlay/Popover.tsx
import * as React13 from "react";
import * as RadixPopover from "@radix-ui/react-popover";
import { jsx as jsx15 } from "react/jsx-runtime";
var Popover = RadixPopover.Root;
var PopoverTrigger = RadixPopover.Trigger;
var PopoverAnchor = RadixPopover.Anchor;
var PopoverClose = RadixPopover.Close;
var PopoverContent = React13.forwardRef(
  function PopoverContent2({ className, align = "start", sideOffset = 4, ...props }, ref) {
    return /* @__PURE__ */ jsx15(RadixPopover.Portal, { children: /* @__PURE__ */ jsx15(
      RadixPopover.Content,
      {
        ref,
        align,
        sideOffset,
        className: cn(
          "z-50 rounded-sm border border-border-default bg-white p-3 shadow-lg outline-none",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          className
        ),
        ...props
      }
    ) });
  }
);
PopoverContent.displayName = "PopoverContent";

// src/navigation/_app-icons/data.ts
var medi_careDataUrl = "data:image/webp;base64,UklGRioEAABXRUJQVlA4IB4EAADQFwCdASpLAFEAPo04mUelI6KhMjabEKARiWwAz5g0xofDeafTP7r4wO0SNtXm9QHmDfqT0l/Ml53WmzegB0w/7lejNms1oHG0HN3ZuVVSSxifQyYUUN6P3wbI0jDa1tm/WYmELhq32T65qA1LG351qSQeAiX+JiKDAqsYoL54n7MuPVHCLYWeAi+0dTN9xzMs8POYaeXw+O7F8ke1ay0l5mUaACIQD1dy8UjlNwTs1zvMCvaNcID7gxsvvFf3NvyYjcYqC4MAAP76vJbp3uMBTJ/TTZggCAY4t0lyb533iFuwh//RL0Ppd0jpuhY/DzQq+7nqeL17Qjv0cCVCtEOPFRQlo1GBuuBtx992pxbnnLPdatMoix7eDE1feefkpv/NIn61we5GNKRYyFagSTZs1EQHOZLRuzy+lXtmZwnaHyNsbdq6NdG/3I26AT/GT/+x1Wk/xt+w7tZO6LbxVXuLcQgeoia02NPB2t9UVQVzgcs2ol87esTpJQXzwPRgwvLxj8kLY4BBMaCkoGDGJGZs2fYRKrDiE2MPdO3hqWqrMLFiCAUktHjT3j+XHz4HmcovWnCrAwCImtHPRrVzFSe1vQyRSt9ETaISOCOLBUgMfCUJY0NdOq+d5RVrKL3lABWI6QLsPtlAqxuepVRG32Nhv4dyJ7RTuIjtXOtdtrGx6J1rm8gFeG3O99Qx+1Erv9ldgOq+yXTvoD0mkEgE/6eiZ/KnztELBibEBE+qRoaJ0r55Dwyzt/wcc0UIu3XKkg+720NzRez98X++b3A9UeBvs2XRhCEukYkLR0ppN9oB1/89kurJYJZJVTBGJ5aY00XI0cOUB/pIWrBI77+bRq9u2u8+0X5rZV2X5y1q3C1dYRiebmNgd9bkELkuVqTmo5oUsg/+eFV12+rLxQmy2GJ7cSQJ8dTc482Fv+pqPW1I919bBOdINQSmnqVa92P3kCVMYTfgDkc1uocUjYsZotxzsGTW6veFjDS0jAbvRL6XMgT4rHbaMXtvw63RKloo6NCqt91pa/C+nTOW4XHPPffiOMG3EKfLl0q/m1N2qiRGGQmpXGeBv32s6fo0UubvdqB9u+t/toczoZMIBZDfXLm0CbZ0b4UAT/woNlStMpwtFL8a7+GKzfQI+mZoJci8U5gnD8RGozlqp3gPYxlPUaW7ZDlWboCE3N2uQP3y3Bn9/HqdomNCvg5D5TfJd0vfjbjO4vdS9dpLNLXkms8KnGw8cuV8lcd3kbZRGssusLXP4w1102cR3xmsY8y6zpMBfq8r3mzCJ8Ey8ml4EuDMifTjggNT3HRC65lYzoFQiXgi4lXCKWCiSHVRgtDsAobFOTXFcULwrYDA58qU7USMvs7rrR8MiMsZhDFbidV4tnwLEP86F66AEX4AAAAAAAAA";
var medi_matchDataUrl = "data:image/webp;base64,UklGRggEAABXRUJQVlA4IPwDAABQFwCdASpUAFQAPpE+mkglo6KhLHScALASCWoA0fXA3X51fiuV35n8K8k2bbtPz8eh39AewB+mXSy8wHmxelP/SelV1I/oAeXP7LH97/62ElxxPsrlMBDDQJ04RdBv8xiaOPDjzUUSsCt1hFYOdPAYOpZG3UYFR+T5wEFtCVsBMJohd35mjMfM1EH/NOPmbyV+Hom6aQ+1MiT1T0ow33Vb+TIBPaPFRS/58HcIHBqPl4xTU67lbR/Tlx8NBBKlAOuk+gAA/vuUAR2E0+wqFnpUTcZ1xewQwWF/vWbPqohm1uuEOP3U9nmyofxsrqGmeFCrfsg+3lO2nnpmyLp/wuJ9TZr685jywa/xith+o2s/otTQH/JcscrYP+kaPNLOLKjTb37tOMpDND52fBlCHMTXrLJJRH4SeVk39KTIIcFABPFbMNGXsc/2sFkWpd9n0bCaFS+z2GmkLaHaVbD8XugehJ7km6cirEG+FRiO1Mil/c2921x8vXytym4q+bFqK+8s0I1RefZH1OXcMtjt3zqznqCro6um89JSKPB11wKoxt/v4u+pflP/Xt3VHv/BiEzfjv2+uttPgaJV5+YvKb7t5tlMVjF1FeSVP19xgzo61Zm/APBC8pnZXxSDneh60hDYvw++/eTSSwR9KMG8EJp9gV4/hUtx53hSM2nQS/Yg1EYuRlxw5IoX+VYTEXN86aSwXr99TNqU/r3OEnwDlRwp4jKqtIu/TR5KCE+QLI9R+joG4Dx9Xg8tr2b+SXanIOYMlJuvpLp94invjv/kU+MTkk91uO605yarpfiMx/lYoWiz8F5QZO8/EpLvXBIU9VBVLHF/DXpGHnWyT54B1ME3j+PstfmG2RapSKLlF692uwTVrj/wJZSd06FJ2ay9UEpLjkLj1IbK3z6k3yvcjP/lc2jOAvZRHJJjCE0b6AgvYnrCEUw5Svf9s1Qsn/T5rNWFB7F3ta/t14MSxsn46+VgQrUpq5lLTP3JNAMaZBy/vTFbhjNwC0ycOcJSQDS7eMkVZCDrqsd4miLpwssTWgw6KtaPOUMcaCDoSgep3j5ztgg+Cw/4Bgt2ZDe/7NPs/E62OERVbHs7ZGUvzLa6kPrGA0kRHeRIW7PdfRdVxTvBtj6XKeQOiGwUFfDSMC+4xYUmHio2a7O7neDD9EoMi8pzpY6KoyD/flHKfWt2tlfR1364+n/mVxD1FXtSKCzzUe5vecfCQHJCuuxcDHuBFjgqp0iNZiLtzopeKYO7THO0QCU/05ro8g7gSAPqTINI83MIzP9cTcjkP9OSVTmKNPWETPBjWFfOwSiGmN4Ybm4nT6lYPAfGwpZ/H6XnNeRHVjp8QIO+5M7kAAAAAAA=";
var medi_payDataUrl = "data:image/webp;base64,UklGRqACAABXRUJQVlA4IJQCAABwDwCdASo7ADgAPnkykkekoyGhO/pIAJAPCWwAtRttP09NuPg5MhEPnnDfV3tofMB+03qyfgB7u95s9ADpgTaN0nJ5H/GtWbnFWjS/ouihv//M/u2CVpmcwC8701lfadnrEOjEWwMgpwtSwqgKmsQyfLydjmWcO9XbiMEXfilzj4pGq0AA/v2+9DZtvvcX+rn5kklVCR2HgaYIFMPmeVRhMg73g7kiP3ttIL/fi2mJ//p6vxO4kNT/5+P+GIfeuk0PZIjPxKeILjlJKYV/aKXEfxpgf/UNqqRjzEdHxRmdbSKBUcISNA1BQCqObutNUHvxaeD24ivUGtRdGxsFMToyqymImu9RukqEzGvo4p+uL2QtKAsR7R2iJnHgv1GxqTCjvBS6abBxEYJ7PL5/Cyh6MjN4orYfVijGPsL6UI8U51+IYP8y2fzXtzcqwy+b5Whvm9vE7ZFrI2S/Oe5KTxTtKc73ZABioPcasXZubixWGz5P9Mms05cxng+0YLNnmW7jGGGDbribl9ygtQgukkfw5Xz6Gad1URisFXpEkdtIzRjkEnkvZ9ax19vfarVlBsjEtwNWrn7HARnYP61lhZDFv4RDbhO2z/g8GfCRWsTxJPKOGTrbeRAITbqwxwjxlg+T9t/wZq9g9fUW1UfSYiC1ae2Hf+VSOEFO+u49ttMQgHGz2Es/CiR0ivIEEcEMVaZAInjHbCClJ7uZHdnyNQ6Wagfs0tmNERnOYRZfIMo5n59NXYterjWsWeeSC2A+ZZSPh1/lfCAGmWOw8VND0co1rDEobw9tH18xMHSVFtO0rf85ZvlKwdRWurH+7Uqr7tSc/aFzVWJ0sGtU3v2b2kWpH3Z88Oi0/6KE5ilJLgjNgALEgAA=";
var medi_referDataUrl = "data:image/webp;base64,UklGRlIDAABXRUJQVlA4IEYDAACwEgCdASpOAEsAPnkykUekoyGhOFoeqJAPCWQAuGOmTfF3BCwI4H23g567TayP/d6VPol2+/d38eWy5StXMdhYH6DGZdfvsxCaY9IqgRuPGVe3qrZeGkTqyvG9LW2h9/Eb+Qli47rGLEoT6Qv3oB2kfeUwGAN1mWiSw+5bWyHvYfjymxgSeRbdJTxJ9vwB/V1uZDUoOTvY57Y8g3iwAAD+/pObLePyoP5i/Y63o1VoJtIBqc3MNOtOUj7w/dUOW00pMTlYfmvp6A7Cot5UaSm4o/qtkYVQva2CJBmBqV1XaByXG15tcd/bAHT2venOAjALzpbZueyrO7hFtoaF1QjXgHxguHRGJMGU+37CSO/MNRJZK8Lw5RZ2oV4vs9scJ+bqmAWnk+6/jB/2XpCNliWNEwIRaDHxlw7+ZqDBR87ugZ2PIT+yMyUmrxpQ2v0o09rkKz5qgOSbH/jlKxHAZX93asL8C2q9MN4sIkfE+w9ogLkhGms+5C/sJS8yN2Oal8/ClPessIBHlOofyN46spXRdh2ZopPp/L8jR7xATzuIwnHtJm4iPGeiBbxUD/NP1H4kTetVNvP04iHrg+OZVJC8SZ7uAYvHH35FtUKbIJVh0jm5L5ms5O9GG54l7YVtj7QsUUaeJ8ZPhegrajeJnurTB4FgrwqMn/Ctlejv/NKrXWVv+kXRpPMQFfpQ4cwDbmEwOenL5QzAmOH/AkJjlwuA4meDlsxQRBQJd55oIiYJ7YJQjDZaeX/5MHxBVa9mVBYQmOZ5UZ/a8s4qlj6VtULmS46LZElS2fnQkT/7wQbxtibRGWbwV946tV+PdwnrPkH67crhF1UiIBxB8t1sZRLVtUNY/cN7iIOCXzs76MxVqnmQnCy4TteCnqPNEkF0wB6Mcsxdph9AIxM2Sk7B+cLfBP6R/sfJJje1JXyKDpv0hmyVxDI2wg5PjI+i0Ktil/1e2f/KJPVALNMaVxtONOjRGGVY5eyu4QZw8mqdpQqSdtLaEe4NerAI/W+Oz0FP1C4a1ZXIWBKWuPaK6m06g7uebPQijlNbA52A51da8CpveZeaQ1yIfrFgYIe6FlCipfjIAvCzqXoSFoQEPxtZPHgUx4/BIAAA";
var medi_stockDataUrl = "data:image/webp;base64,UklGRs4CAABXRUJQVlA4IMICAADwDwCdASo7AD4APpFCmEklpCIhKhma6LASCWwAvnwrJPpu+rJ6gPtm3wHmA/ZD9bvfd9AG8Ab0Ev3pJ20wEfz1+mPMTtsjNaQcLkuhWqtX0liVzKZ8HMDXtgIgweKdAZheg2i9xraLJwfF/j94C7AlKuRb5L7J570Vv8G9koISMqLk1CsBD1AAAP77pSH3UfqYZ+cZXV7wXsQk7dT0UJ2GH/G4+zZSmT38klhp3mz/m6Xhv7VH/8q/Hkeebg3v9O/LR6eOc83Uop9v9PC8hgXoNgzdvuXbycMHe1sjQvZbE87wSLluhXK4vM/mPYp2lW7K4I2Ts+w8sGRI9tcp85yGZSZUHpSN1RJ7Y7eNWudhdkJkf3ihedRa+uvWf/eGp5QvHL6ePbgWQVnZqIGL7gbby3teoOxvxS7JmzTvVIwLofnQ5VwLKZtKHcZ32j/uJq7jckCrrFnOJ3psRnvSY8ohu+yQCCsbIqzGEa2goZyIk0Yc6oVOMPeVzveD/0DdOnno9D6SBTCgt42veDL2Tiu8PUdYpz2oVW7hwvjaQwWrf2T7rfaYcuzVZ99Y254hMsM85tNiMYRIJ7XhESwI1t6tV3//cXVII45zJ3gVInzTazUrWyBYjOyE5s0DBUkluh9TCi2Wqh783L52EPUs2TneWawhnAjGZlaMlNBi9NvyoiHt6XGFQ4ySaNxwtKS7BJs89kBVNLPsW6zwFIpuTsFIMgMg0gTuwQZCITtE1+W/P386uV3FuAmQdNKGfv7qFFN2MVf/ng+H9a0JJ52J6uojRAmhuYl0emUbCnxQL7X4mrqqAXOTGE0ZX822LDhpKNg1nqpFLBRkncmz+g8dGITFx1voNHVL14Wl9xGnu6WZNdrpThS06S7CeEmMxKKf4pd2+4pb0D9IOteNZrfNu7fKLAWBxEtGGm4LQqz5bksAAAAA";
var medi_workDataUrl = "data:image/webp;base64,UklGRtgDAABXRUJQVlA4IMwDAABwFgCdASpnAEQAPok6mEelI6KhMzbbaKARCWYAyP0G+3+ICyHbajzAedB6Q94x9ADphq0hkIeRXC3Kk4SaRFolDt/XJpSZ71/V4LrKwvSGaIX+ORd19tvit4DzRuRLe5gLL94Q0PExITwrd3exBk0vyv6q2Scnz5PgNpW6kHejV5b/k4A9DQpXE1v4tclGaTgRCz7Hi1FrZmrZOTmrZOpDhYjPyB5VqEUwSfOrQpKeCKTikGqFIv+/uku8QAD+/pOl9ho9yYnWOWyIr7R1+YwJf1mfG290QQYO94Tt/Db0/frEQnFS1Z6/8m8vcFHgMQgrfsfuopbWlDIUoyboVlwZCeBQDT8cR2WoTklcY5+D94CylvXs/yT4u1iZaaDvSxp4ApSD/XH/VxILA7OIH3bKq7U5HCI+jqnPNnS4f4u/moveWUJwXhL4gKiGQk0wBDWtd+g9uskg4MNyQwuUjP0JNachgi30yGus/X4AH2ExwMSPPgScHRJrht0tDa0n4bOHZeXOUNQOdz0ADCJp5zEs/d6tDgju92HmMQgNzuRrTuaZ+FmCGbWh2lQ2lD3Xz2NAJouKnv1JXkfLNOsrUfmxtQcbVm3Cx4rFc7ektzR87/641h/f1PH+fZNvtrCOetWOw0oF3C/liIuSKuc0VeIfIWWLc/c4o++uq60uJRBOBrBBgSj5JVHUSF7j25AsHiaDg5sZ8bVl9+lh6WQrlgrWGbZtPdBqI6hO/mDSo9I18Tl7gqyoM5fAGfBLpT2boMf8+kvcCQnf0lfCNon3gewt40+zg1FHSwWuewX93un0FexdPrXVNOUVH525bmaG2AuF7B39ygHcsMTnCeavxVRNyovQ/EDd7XuLmQOPGf7upifriz3ZeCXgNfUhIJMm4JS1TBf0AfCjVCpxN1wbwxPuuY50aDm/Hc+L3JOoZUqdkupxJnDYhgBpwP8+rLZK9738KEXZc8biGvk5xulpidMQZ2JvD6UoA8b8OymmsRd3UYcl+7aYfaLfzU8WRP2Vsjf8KUYnb8hbbstiYcZErHp2zdThFS98wgRtqUFDNQht2pPSmbyCWjLM5Sh1mmBtcjObc+yM7CRMv+aNe9zgroFphTANoeyb0O2w4e7IiDvSHTeDCW5178P37OTFRFLvSB0aUTl9ZHrNS76mZ+T3qWNR2ONtBK0010qzqtfEfz/n/lBrQnzcPxomS04Bqm/givlBEN350rjOMM3wpztb58Us6ohMGKcEb9htBQw2UAOWHlSkpzBW9RFXELD4eUBEhIqC/PtZFK8CuxLAAAA=";
var mediactDataUrl = "data:image/webp;base64,UklGRtQCAABXRUJQVlA4IMgCAACwEwCdASpdAEsAPo08mUelI6KhMjS6cKARiWgA0qBY+7eblaP8LvrBTe0/Il6uPyr6IHTZ8xHQe83TqR/Qa6YH7QAiyC3ZCE9Lyv5a5BNIoQy7ROS5GaK6SpBrErcoUY9RNdjdq/9kCswJrKkB93m6LLQLRulV9bjWZTue8UfYFYi7XWxhvU/fHpnAmJUlZyq97yy2QUQZEduzUsw6vmnU363bdNswAP779ggE1x+no8R9Ux4/6f4MoCLt//cbSyenHqDRUrQzw3Hk2caKvIgF7C+xvEhe8u6CsFyafal40GnyB6od2oL9724K5wvd4ZSbWUcPXz6BVHVhwGkdnGkF+xxF+mOxwuUXRkNgzYglJNAwQevjxKn00Pur0bKYrf2p31HdOD7nTX7Fmh7q32U3Idmm4SQastiT1CyWlc8ms3RMYn/LgTFN/3psJX/DeNHY+Uf3CilfP0QbyaQLWUTaZi+Cl0Vp+wsJIYosbu2FFMKmgOI4Vy8m0nb7B61hC+8B7XWzZWi08rwR5/QxpyJYZrZVQR7b3bQXEfPE3bu6SdId+ysaunHDlYByZMt3YP44Ci87S67HLtrDB0/jfZU2R+Wr5nejBW08c8pc/RN7GVH1v282aQ7EmpRhhQcWLAw/lmeuPs/kbxz6xC02xFlreNEPMfj6cfsQSUOOwfEuC3Kp37HSGl/JCHJIezjAOVtj9gK4rzLAjyLnzvFf9kQWu7bZIq/+6/1uL0ePcn9GMGV/UH/WFaY0bx/axrkFSp+HDgGUX1SxH2UANcplT3cOVZPg4+ETY2zUtu+0w+us68YpviiAMZkacV74hJj2ecZ/hjfw7eEBHYVa6I7yfCaL8/G0cEyFsbUlvDF8Sb1+nGnvn+v/NEOkv89TM6u2ZStu69JjrILV/GkBSZwo2hv8MO/IyP9dnqTyYAUwz+W54o9YB7FBdEAA";

// src/navigation/TopNav.tsx
import { Fragment as Fragment3, jsx as jsx16, jsxs as jsxs13 } from "react/jsx-runtime";
var TopNav = React14.forwardRef(function TopNav2({ className, floating, children, ...props }, ref) {
  return /* @__PURE__ */ jsx16(
    "header",
    {
      ref,
      className: cn(
        "flex h-16 w-full items-center gap-2 rounded-[15px] border border-border-subtle bg-white px-4 shadow-sm",
        floating && "sticky top-0 z-30",
        className
      ),
      ...props,
      children
    }
  );
});
var TopNavBrand = React14.forwardRef(
  function TopNavBrand2({ className, logo, children, ...props }, ref) {
    return /* @__PURE__ */ jsxs13(
      "div",
      {
        ref,
        className: cn("flex items-center gap-3 truncate", className),
        ...props,
        children: [
          logo && /* @__PURE__ */ jsx16("span", { className: "shrink-0", children: logo }),
          /* @__PURE__ */ jsx16("span", { className: "truncate text-xl font-semibold text-text-primary", children })
        ]
      }
    );
  }
);
var TopNavSpacer = ({ className }) => /* @__PURE__ */ jsx16("div", { className: cn("flex-1", className), "aria-hidden": "true" });
var iconButtonClass = "inline-flex size-10 shrink-0 items-center justify-center rounded-full text-text-body transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 [&_svg]:size-6";
var DEFAULT_APP_DEFS = {
  mediwork: { label: "Medi Work", src: medi_workDataUrl },
  medimatch: { label: "Medi Match", src: medi_matchDataUrl },
  medipay: { label: "Medi Pay", src: medi_payDataUrl },
  medistock: { label: "Medi Stock", src: medi_stockDataUrl },
  medicare: { label: "Medi Care", src: medi_careDataUrl },
  medirefer: { label: "Medi Refer", src: medi_referDataUrl }
};
var DEFAULT_APP_ORDER = [
  "mediwork",
  "medimatch",
  "medipay",
  "medistock",
  "medicare",
  "medirefer"
];
var NineDotIcon = (props) => /* @__PURE__ */ jsx16(
  "svg",
  {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": "true",
    ...props,
    children: [5, 12, 19].flatMap(
      (cy) => [5, 12, 19].map((cx) => /* @__PURE__ */ jsx16("circle", { cx, cy, r: "2.4" }, `${cx}-${cy}`))
    )
  }
);
function AppLauncher({
  apps,
  order = DEFAULT_APP_ORDER,
  onAppClick,
  label = "Apps",
  comingSoonText = "Coming Soon",
  className
}) {
  const visible = order.filter((key) => apps[key] != null);
  return /* @__PURE__ */ jsxs13(Popover, { children: [
    /* @__PURE__ */ jsx16(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsx16(
      "button",
      {
        type: "button",
        "aria-label": label,
        className: cn(iconButtonClass, className),
        children: /* @__PURE__ */ jsx16(NineDotIcon, {})
      }
    ) }),
    /* @__PURE__ */ jsxs13(
      PopoverContent,
      {
        align: "end",
        sideOffset: 16,
        className: "w-[340px] rounded-3xl border border-gray-50 p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)]",
        children: [
          /* @__PURE__ */ jsxs13("div", { className: "mb-6 flex items-center justify-center gap-1 border-b border-gray-200 pb-4", children: [
            /* @__PURE__ */ jsx16(
              "img",
              {
                src: mediactDataUrl,
                alt: "MediAct",
                className: "h-8 w-auto"
              }
            ),
            /* @__PURE__ */ jsx16("h2", { className: "text-lg font-semibold text-text-heading", children: "MediAct" })
          ] }),
          /* @__PURE__ */ jsx16("div", { className: "grid grid-cols-3 gap-x-2 gap-y-6", children: visible.map((key) => {
            const config = apps[key];
            const def = DEFAULT_APP_DEFS[key];
            return /* @__PURE__ */ jsx16(
              AppLauncherTile,
              {
                appKey: key,
                config,
                label: config.label ?? def.label,
                icon: config.icon ?? /* @__PURE__ */ jsx16(
                  "img",
                  {
                    src: def.src,
                    alt: def.label,
                    className: "size-full object-contain"
                  }
                ),
                comingSoonText,
                onClick: onAppClick
              },
              key
            );
          }) })
        ]
      }
    )
  ] });
}
function AppLauncherTile({
  appKey,
  config,
  label,
  icon,
  comingSoonText,
  onClick
}) {
  const isComingSoon = !!config.comingSoon;
  const disabled = config.disabled || isComingSoon || !config.baseUrl && !onClick;
  const tileClass = cn(
    "group flex flex-col items-center justify-start text-center",
    !disabled && "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 rounded-md",
    disabled && "cursor-not-allowed"
  );
  const iconBox = /* @__PURE__ */ jsx16(
    "span",
    {
      className: cn(
        "mb-2 flex size-12 items-center justify-center rounded-xl border border-gray-100 bg-white transition-transform",
        !disabled && "group-hover:scale-105",
        config.active && !disabled && "ring-2 ring-brand/40",
        config.disabled && "opacity-50 grayscale"
      ),
      children: /* @__PURE__ */ jsx16("span", { className: "flex size-8 items-center justify-center [&_img]:size-full [&_img]:object-contain", children: icon })
    }
  );
  const labelEl = /* @__PURE__ */ jsxs13(Fragment3, { children: [
    /* @__PURE__ */ jsx16("span", { className: "text-[13px] font-medium text-text-body", children: label }),
    isComingSoon && /* @__PURE__ */ jsx16("span", { className: "mt-0.5 text-[10px] text-gray-400", children: comingSoonText })
  ] });
  if (disabled) {
    return /* @__PURE__ */ jsxs13("div", { className: tileClass, "aria-disabled": "true", children: [
      iconBox,
      labelEl
    ] });
  }
  if (onClick) {
    return /* @__PURE__ */ jsxs13(
      "button",
      {
        type: "button",
        onClick: () => onClick(appKey, config),
        className: tileClass,
        children: [
          iconBox,
          labelEl
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs13("a", { href: config.baseUrl, className: tileClass, children: [
    iconBox,
    labelEl
  ] });
}
var NotificationBell = React14.forwardRef(function NotificationBell2({ hasUnread, unreadCount, label = "Notifications", className, ...props }, ref) {
  const showCount = unreadCount != null && unreadCount > 0;
  const showDot = !showCount && hasUnread;
  return /* @__PURE__ */ jsxs13(
    "button",
    {
      ref,
      type: "button",
      "aria-label": label,
      className: cn(iconButtonClass, "relative", className),
      ...props,
      children: [
        /* @__PURE__ */ jsx16(Bell, {}),
        showDot && /* @__PURE__ */ jsx16(
          "span",
          {
            "aria-hidden": "true",
            className: "absolute right-2.5 top-2.5 size-2 rounded-full bg-cherry-red-600 ring-2 ring-white"
          }
        ),
        showCount && /* @__PURE__ */ jsx16(
          "span",
          {
            "aria-hidden": "true",
            className: "absolute right-1 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-cherry-red-600 px-1 text-[10px] font-semibold text-white ring-2 ring-white",
            children: unreadCount > 99 ? "99+" : unreadCount
          }
        )
      ]
    }
  );
});
function UserMenu({
  user,
  items,
  onLogout,
  logoutLabel = "Log Out",
  bottomLeft,
  label = "Account",
  className
}) {
  return /* @__PURE__ */ jsxs13(Popover, { children: [
    /* @__PURE__ */ jsx16(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs13(
      "button",
      {
        type: "button",
        "aria-label": label,
        className: cn(
          "group inline-flex items-center gap-2 rounded-full p-0.5 pr-1 text-sm font-medium text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
          className
        ),
        children: [
          /* @__PURE__ */ jsx16(
            Avatar,
            {
              size: "md",
              src: user.src,
              name: user.name,
              className: "border-2 border-gray-100"
            }
          ),
          /* @__PURE__ */ jsx16(ChevronDown2, { className: "size-4 text-gray-400 transition-transform group-data-[state=open]:rotate-180 group-hover:text-gray-600" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs13(
      PopoverContent,
      {
        align: "end",
        sideOffset: 16,
        className: "w-[310px] rounded-3xl border border-gray-50 px-6 py-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)]",
        children: [
          /* @__PURE__ */ jsxs13("div", { className: "mb-5 flex flex-col items-center", children: [
            /* @__PURE__ */ jsx16(
              Avatar,
              {
                src: user.src,
                name: user.name,
                className: "mb-3 size-[60px] border-2 border-gray-100"
              }
            ),
            user.name && /* @__PURE__ */ jsx16("h3", { className: "text-lg font-semibold text-text-heading", children: user.name }),
            user.role && /* @__PURE__ */ jsx16("p", { className: "mt-0.5 text-[15px] font-medium text-text-tertiary", children: user.role })
          ] }),
          /* @__PURE__ */ jsx16("hr", { className: "mb-2 border-gray-100" }),
          items?.map((item, idx) => /* @__PURE__ */ jsx16(UserMenuItemButton, { item }, idx)),
          (bottomLeft || onLogout !== null) && /* @__PURE__ */ jsxs13(Fragment3, { children: [
            /* @__PURE__ */ jsx16("hr", { className: "mb-5 mt-2 border-gray-100" }),
            /* @__PURE__ */ jsxs13("div", { className: "flex items-center justify-between gap-3", children: [
              bottomLeft ?? /* @__PURE__ */ jsx16("span", {}),
              onLogout !== null && /* @__PURE__ */ jsxs13(
                "button",
                {
                  type: "button",
                  onClick: onLogout,
                  className: "flex cursor-pointer items-center gap-2 text-[16px] font-medium text-cherry-red-600 transition-colors hover:text-cherry-red-800",
                  children: [
                    /* @__PURE__ */ jsx16(LogOut, { className: "size-5" }),
                    logoutLabel
                  ]
                }
              )
            ] })
          ] })
        ]
      }
    )
  ] });
}
function UserMenuItemButton({ item }) {
  const className = "block w-full cursor-pointer text-left py-3 text-[16px] font-medium text-text-body transition-colors hover:text-text-primary";
  if (item.href) {
    return /* @__PURE__ */ jsx16("a", { href: item.href, className, children: item.label });
  }
  return /* @__PURE__ */ jsx16("button", { type: "button", onClick: item.onClick, className, children: item.label });
}
TopNav.displayName = "TopNav";
TopNavBrand.displayName = "TopNavBrand";
NotificationBell.displayName = "NotificationBell";

// src/navigation/Sidebar.tsx
import * as React15 from "react";
import { ChevronDown as ChevronDown3 } from "lucide-react";
import { Fragment as Fragment4, jsx as jsx17, jsxs as jsxs14 } from "react/jsx-runtime";
var SidebarContext = React15.createContext(
  void 0
);
function useSidebar() {
  const ctx = React15.useContext(SidebarContext);
  if (!ctx) throw new Error("Sidebar.* must be used inside <Sidebar>");
  return ctx;
}
var DepthContext = React15.createContext(0);
var Sidebar = React15.forwardRef(function Sidebar2({
  className,
  header,
  footer,
  activeItemId,
  onItemClick,
  collapsed = false,
  expandedWidth = 260,
  collapsedWidth = 72,
  children,
  style,
  ...props
}, ref) {
  const ctx = React15.useMemo(
    () => ({ isCollapsed: collapsed, activeItemId, onItemClick }),
    [collapsed, activeItemId, onItemClick]
  );
  const width = collapsed ? collapsedWidth : expandedWidth;
  return /* @__PURE__ */ jsx17(SidebarContext.Provider, { value: ctx, children: /* @__PURE__ */ jsxs14(
    "aside",
    {
      ref,
      style: {
        width: typeof width === "number" ? `${width}px` : width,
        ...style
      },
      className: cn(
        "flex h-full shrink-0 flex-col bg-state-700 text-white transition-[width] duration-300 ease-in-out",
        className
      ),
      ...props,
      children: [
        header && /* @__PURE__ */ jsx17(
          "div",
          {
            "aria-hidden": collapsed || void 0,
            className: "flex min-h-20 items-center justify-center px-6 py-6",
            children: !collapsed && header
          }
        ),
        /* @__PURE__ */ jsx17("nav", { className: "flex-1 space-y-1 overflow-y-auto px-3 pb-4", children }),
        footer && /* @__PURE__ */ jsx17("div", { className: "px-4 py-4 text-center text-xs text-white/40", children: footer })
      ]
    }
  ) });
});
function SidebarItem({
  id,
  label,
  icon: Icon,
  href,
  onClick,
  badge,
  className
}) {
  const { isCollapsed, activeItemId, onItemClick } = useSidebar();
  const depth = React15.useContext(DepthContext);
  const isActive = activeItemId === id;
  const isNested = depth > 0;
  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick();
      return;
    }
    if (onItemClick) {
      e.preventDefault();
      onItemClick(id, href);
    }
  };
  const content = /* @__PURE__ */ jsxs14(Fragment4, { children: [
    /* @__PURE__ */ jsx17("span", { className: "flex shrink-0 items-center justify-center", children: isCollapsed ? Icon ? /* @__PURE__ */ jsx17(Icon, { className: "size-6" }) : /* @__PURE__ */ jsx17("span", { className: "size-1.5 rounded-full bg-white" }) : isNested ? (
      // Nested items: bullet on level 1, dash on deeper levels
      depth === 1 ? /* @__PURE__ */ jsx17(
        "span",
        {
          className: cn(
            "size-1.5 rounded-full",
            isActive ? "bg-brand" : "bg-white"
          )
        }
      ) : /* @__PURE__ */ jsx17(
        "span",
        {
          className: cn(
            "h-px w-2",
            isActive ? "bg-brand" : "bg-white/80"
          )
        }
      )
    ) : Icon ? /* @__PURE__ */ jsx17(Icon, { className: "size-6" }) : null }),
    !isCollapsed && /* @__PURE__ */ jsxs14("span", { className: "flex flex-col items-start overflow-hidden text-left", children: [
      /* @__PURE__ */ jsx17("span", { className: "truncate text-[15px] font-semibold leading-tight", children: label }),
      badge && /* @__PURE__ */ jsx17(
        "span",
        {
          className: cn(
            "mt-0.5 text-[10px] font-medium",
            isActive ? "text-brand/70" : "text-white/60"
          ),
          children: badge
        }
      )
    ] })
  ] });
  const baseClass = cn(
    "flex w-full items-center gap-3 transition-colors",
    isCollapsed ? "justify-center rounded-md py-3" : isNested ? "rounded-full px-4 py-2 pl-8" : "rounded-lg px-3 py-3",
    isActive ? "bg-white text-brand" : "text-white/80 hover:bg-white/10 hover:text-white",
    className
  );
  if (href && !onClick && !onItemClick) {
    return /* @__PURE__ */ jsx17("a", { href, className: baseClass, children: content });
  }
  return /* @__PURE__ */ jsx17("button", { type: "button", onClick: handleClick, className: baseClass, children: content });
}
function SidebarGroup({
  id,
  label,
  icon: Icon,
  defaultExpanded = true,
  expanded,
  onExpandedChange,
  children,
  className
}) {
  const { isCollapsed } = useSidebar();
  const depth = React15.useContext(DepthContext);
  const isControlled = expanded !== void 0;
  const [internal, setInternal] = React15.useState(defaultExpanded);
  const isExpanded = isControlled ? expanded : internal;
  const isNested = depth > 0;
  const toggle = () => {
    if (!isControlled) setInternal((s) => !s);
    onExpandedChange?.(!isExpanded);
  };
  const headerClass = cn(
    "flex w-full items-center gap-3 font-semibold transition-colors text-white/90 hover:bg-white/10",
    isCollapsed ? "justify-center rounded-md py-3" : isNested ? "rounded-md px-3 py-2 pl-4 text-[14px]" : "rounded-lg px-3 py-3 text-[15px]",
    className
  );
  return /* @__PURE__ */ jsxs14("div", { className: "space-y-1", children: [
    /* @__PURE__ */ jsxs14(
      "button",
      {
        type: "button",
        onClick: toggle,
        "aria-expanded": isExpanded,
        "aria-controls": `${id}-content`,
        className: headerClass,
        children: [
          /* @__PURE__ */ jsx17("span", { className: "flex shrink-0 items-center justify-center", children: Icon ? /* @__PURE__ */ jsx17(Icon, { className: "size-6" }) : isNested && !isCollapsed ? /* @__PURE__ */ jsx17("span", { className: "size-1.5 rounded-full bg-white" }) : null }),
          !isCollapsed && /* @__PURE__ */ jsxs14(Fragment4, { children: [
            /* @__PURE__ */ jsx17("span", { className: "flex-1 truncate text-left", children: label }),
            /* @__PURE__ */ jsx17(
              ChevronDown3,
              {
                className: cn(
                  "size-4 transition-transform duration-200",
                  !isExpanded && "-rotate-90"
                )
              }
            )
          ] })
        ]
      }
    ),
    isExpanded && /* @__PURE__ */ jsx17(
      "div",
      {
        id: `${id}-content`,
        className: cn(!isCollapsed && "space-y-1 pl-2"),
        children: /* @__PURE__ */ jsx17(DepthContext.Provider, { value: depth + 1, children })
      }
    )
  ] });
}
Sidebar.displayName = "Sidebar";

// src/form/DatePicker.tsx
import * as React16 from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { format, isValid } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronDown as ChevronDown4,
  ChevronLeft,
  ChevronRight,
  ChevronUp
} from "lucide-react";
import { jsx as jsx18, jsxs as jsxs15 } from "react/jsx-runtime";
function CalendarChevron({
  orientation = "right",
  className
}) {
  const Icon = orientation === "up" ? ChevronUp : orientation === "down" ? ChevronDown4 : orientation === "left" ? ChevronLeft : ChevronRight;
  return /* @__PURE__ */ jsx18(Icon, { className, strokeWidth: 1.75 });
}
function DatePicker({
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
  displayFormat = "PPP",
  disabledDate,
  minDate,
  maxDate,
  disabled,
  size = "md",
  captionLayout = "dropdown",
  fromYear,
  toYear,
  className,
  containerClassName
}) {
  const reactId = React16.useId();
  const triggerId = id ?? reactId;
  const [open, setOpen] = React16.useState(false);
  const [internal, setInternal] = React16.useState(defaultValue);
  const isControlled = value !== void 0;
  const selected = isControlled ? value ?? void 0 : internal;
  const hasError = Boolean(error);
  const hasValue = selected != null;
  const floating = Boolean(alwaysFloatLabel) || open || hasValue || Boolean(placeholder);
  const handleSelect = (date) => {
    if (!isControlled) setInternal(date);
    onChange?.(date);
    if (date) setOpen(false);
  };
  const display = selected && isValid(selected) ? format(selected, displayFormat) : "";
  const dpDisabled = React16.useMemo(() => {
    const list = [];
    if (disabledDate) list.push(disabledDate);
    if (minDate) list.push((d) => d < minDate);
    if (maxDate) list.push((d) => d > maxDate);
    return list.length === 0 ? void 0 : (d) => list.some((f) => f(d));
  }, [disabledDate, minDate, maxDate]);
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const startMonth = minDate ?? new Date(fromYear ?? currentYear - 100, 0, 1);
  const endMonth = maxDate ?? new Date(toYear ?? currentYear + 10, 11, 31);
  return /* @__PURE__ */ jsx18(
    FloatingFieldShell,
    {
      label,
      hint,
      error,
      required,
      hideLabel,
      htmlFor: triggerId,
      size,
      floating,
      focused: open,
      hasError,
      containerClassName,
      rightAdornment: /* @__PURE__ */ jsx18(CalendarIcon, {}),
      children: /* @__PURE__ */ jsxs15(Popover, { open, onOpenChange: setOpen, children: [
        /* @__PURE__ */ jsx18(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsx18(
          "button",
          {
            id: triggerId,
            type: "button",
            disabled,
            "aria-invalid": hasError || void 0,
            className: cn(
              fieldShapeClasses({ hasError, size }),
              "flex items-center text-left pr-9",
              !display && "text-text-tertiary",
              className
            ),
            children: /* @__PURE__ */ jsx18("span", { className: "truncate", children: display || (floating ? placeholder ?? "" : "") })
          }
        ) }),
        /* @__PURE__ */ jsx18(PopoverContent, { className: "p-0", align: "start", children: /* @__PURE__ */ jsx18(
          DayPicker,
          {
            mode: "single",
            selected,
            onSelect: handleSelect,
            disabled: dpDisabled,
            defaultMonth: selected,
            captionLayout,
            startMonth,
            endMonth,
            className: "p-3 [&_.rdp-caption_label]:font-medium [&_.rdp-caption_label]:text-base",
            components: { Chevron: CalendarChevron },
            style: {
              "--rdp-accent-color": "var(--color-brand)",
              "--rdp-accent-background-color": "var(--color-brand-subtle)",
              "--rdp-selected-border": "0",
              "--rdp-today-color": "var(--color-brand)",
              "--rdp-range_middle-background-color": "var(--color-brand-subtle)",
              "--rdp-range_middle-color": "var(--color-brand)"
            }
          }
        ) })
      ] })
    }
  );
}

// src/form/TimePicker.tsx
import * as React17 from "react";
import { Clock } from "lucide-react";
import { jsx as jsx19, jsxs as jsxs16 } from "react/jsx-runtime";
var heights = {
  sm: "h-9 text-sm",
  md: "h-11 text-sm",
  lg: "h-12 text-base"
};
function pad2(n) {
  return n.toString().padStart(2, "0");
}
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}
function parseTime(v) {
  if (!v) return { h: null, m: null };
  const [hStr, mStr] = v.split(":");
  const h = hStr === void 0 ? NaN : parseInt(hStr, 10);
  const m = mStr === void 0 ? NaN : parseInt(mStr, 10);
  return {
    h: Number.isFinite(h) && h >= 0 && h <= 23 ? h : null,
    m: Number.isFinite(m) && m >= 0 && m <= 59 ? m : null
  };
}
function format24(h, m) {
  if (h == null && m == null) return "";
  return `${pad2(h ?? 0)}:${pad2(m ?? 0)}`;
}
function TimePicker({
  id,
  label,
  hint,
  error,
  required,
  hideLabel,
  alwaysFloatLabel = true,
  value,
  defaultValue,
  onChange,
  minuteStep,
  step,
  disabled,
  size = "md",
  className,
  containerClassName
}) {
  const reactId = React17.useId();
  const inputId = id ?? reactId;
  const isControlled = value !== void 0;
  const [internal, setInternal] = React17.useState(defaultValue ?? "");
  const [focused, setFocused] = React17.useState(false);
  const [open, setOpen] = React17.useState(false);
  const current = isControlled ? value ?? "" : internal;
  const { h, m } = parseTime(current);
  const hasError = Boolean(error);
  const hasValue = current !== "";
  const floating = Boolean(alwaysFloatLabel) || focused || hasValue;
  const stepEffective = minuteStep ?? step ?? 1;
  const [hStr, setHStr] = React17.useState(() => h != null ? pad2(h) : "");
  const [mStr, setMStr] = React17.useState(() => m != null ? pad2(m) : "");
  React17.useEffect(() => {
    const localH = hStr === "" ? null : parseInt(hStr, 10);
    if (localH !== h) {
      setHStr(h != null ? pad2(h) : "");
    }
    const localM = mStr === "" ? null : parseInt(mStr, 10);
    if (localM !== m) {
      setMStr(m != null ? pad2(m) : "");
    }
  }, [h, m]);
  const commit = (nextH, nextM) => {
    const safeH = nextH === "" ? null : clamp(parseInt(nextH, 10) || 0, 0, 23);
    const safeM = nextM === "" ? null : clamp(parseInt(nextM, 10) || 0, 0, 59);
    const next = format24(safeH, safeM);
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };
  const handleHourChange = (raw) => {
    const cleaned = raw.replace(/\D/g, "").slice(0, 2);
    setHStr(cleaned);
    commit(cleaned, mStr);
  };
  const handleMinuteChange = (raw) => {
    const cleaned = raw.replace(/\D/g, "").slice(0, 2);
    setMStr(cleaned);
    commit(hStr, cleaned);
  };
  const handleHourBlur = () => {
    if (hStr !== "" && hStr.length === 1) setHStr(pad2(parseInt(hStr, 10)));
  };
  const handleMinuteBlur = () => {
    if (mStr !== "" && mStr.length === 1) setMStr(pad2(parseInt(mStr, 10)));
  };
  return /* @__PURE__ */ jsx19(
    FloatingFieldShell,
    {
      label,
      hint,
      error,
      required,
      hideLabel,
      htmlFor: inputId,
      size,
      floating,
      focused,
      hasError,
      containerClassName,
      rightAdornment: /* @__PURE__ */ jsxs16(Popover, { open, onOpenChange: setOpen, children: [
        /* @__PURE__ */ jsx19(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsx19(
          "button",
          {
            type: "button",
            "aria-label": "Open time picker",
            disabled,
            className: "pointer-events-auto inline-flex size-6 items-center justify-center rounded-sm hover:bg-black/5 disabled:cursor-not-allowed [&_svg]:size-4",
            children: /* @__PURE__ */ jsx19(Clock, {})
          }
        ) }),
        /* @__PURE__ */ jsx19(PopoverContent, { align: "end", sideOffset: 6, className: "p-0", children: /* @__PURE__ */ jsxs16(
          "div",
          {
            className: "flex h-56 w-40 divide-x divide-border-default text-sm",
            role: "dialog",
            "aria-label": "Pick time",
            children: [
              /* @__PURE__ */ jsx19(
                TimeColumn,
                {
                  ariaLabel: "Hours",
                  count: 24,
                  step: 1,
                  selected: h,
                  onPick: (next) => commit(pad2(next), mStr)
                }
              ),
              /* @__PURE__ */ jsx19(
                TimeColumn,
                {
                  ariaLabel: "Minutes",
                  count: 60,
                  step: stepEffective,
                  selected: m,
                  onPick: (next) => commit(hStr, pad2(next))
                }
              )
            ]
          }
        ) })
      ] }),
      children: /* @__PURE__ */ jsxs16(
        "div",
        {
          className: cn(
            "flex w-full items-center gap-1 rounded-sm border bg-white pl-3 pr-3 transition-colors",
            "focus-within:outline-none focus-within:ring-1",
            disabled && "cursor-not-allowed bg-gray-50",
            heights[size],
            hasError ? "border-cherry-red-600 focus-within:border-cherry-red-600 focus-within:ring-cherry-red-600/40" : "border-border-strong focus-within:border-brand focus-within:ring-brand/30",
            className
          ),
          onFocus: () => setFocused(true),
          onBlur: (e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
          },
          children: [
            /* @__PURE__ */ jsx19(
              "input",
              {
                id: inputId,
                type: "text",
                inputMode: "numeric",
                maxLength: 2,
                disabled,
                value: hStr,
                onChange: (e) => handleHourChange(e.target.value),
                onBlur: handleHourBlur,
                placeholder: "HH",
                "aria-label": "Hours",
                className: "w-8 bg-transparent text-center font-medium tabular-nums outline-none disabled:cursor-not-allowed"
              }
            ),
            /* @__PURE__ */ jsx19("span", { className: "select-none text-text-tertiary", children: ":" }),
            /* @__PURE__ */ jsx19(
              "input",
              {
                type: "text",
                inputMode: "numeric",
                maxLength: 2,
                disabled,
                value: mStr,
                onChange: (e) => handleMinuteChange(e.target.value),
                onBlur: handleMinuteBlur,
                placeholder: "mm",
                "aria-label": "Minutes",
                className: "w-8 bg-transparent text-center font-medium tabular-nums outline-none disabled:cursor-not-allowed"
              }
            ),
            /* @__PURE__ */ jsx19("span", { className: "ml-auto", "aria-hidden": "true" })
          ]
        }
      )
    }
  );
}
function TimeColumn({
  ariaLabel,
  count,
  step,
  selected,
  onPick
}) {
  const containerRef = React17.useRef(null);
  const items = React17.useMemo(() => {
    const out = [];
    for (let i = 0; i < count; i += step) out.push(i);
    return out;
  }, [count, step]);
  React17.useEffect(() => {
    if (selected == null || !containerRef.current) return;
    const el = containerRef.current.querySelector(
      `[data-value="${selected}"]`
    );
    el?.scrollIntoView({ block: "center" });
  }, [selected]);
  return /* @__PURE__ */ jsx19(
    "div",
    {
      ref: containerRef,
      role: "listbox",
      "aria-label": ariaLabel,
      className: "flex flex-1 flex-col overflow-y-auto py-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300",
      children: items.map((n) => {
        const isSelected = n === selected;
        return /* @__PURE__ */ jsx19(
          "button",
          {
            type: "button",
            "data-value": n,
            role: "option",
            "aria-selected": isSelected || void 0,
            onClick: () => onPick(n),
            className: cn(
              "mx-2 my-0.5 flex h-8 shrink-0 items-center justify-center rounded-md text-center font-medium tabular-nums transition-colors",
              isSelected ? "bg-brand-active text-white" : "text-text-primary hover:bg-brand-subtle"
            ),
            children: pad2(n)
          },
          n
        );
      })
    }
  );
}

// src/form/ComboBox.tsx
import * as React18 from "react";
import { Command as CmdkRoot } from "cmdk";
import { Check as Check3, ChevronsUpDown } from "lucide-react";
import { jsx as jsx20, jsxs as jsxs17 } from "react/jsx-runtime";
function ComboBox({
  id,
  label,
  hint,
  error,
  required,
  hideLabel,
  alwaysFloatLabel,
  placeholder,
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  value,
  defaultValue,
  onChange,
  options,
  onSearch,
  disabled,
  size = "md",
  className,
  containerClassName
}) {
  const reactId = React18.useId();
  const triggerId = id ?? reactId;
  const [open, setOpen] = React18.useState(false);
  const [internal, setInternal] = React18.useState(defaultValue);
  const [query, setQuery] = React18.useState("");
  const isControlled = value !== void 0;
  const selected = isControlled ? value ?? void 0 : internal;
  const selectedOption = options.find((o) => o.value === selected);
  const hasError = Boolean(error);
  const hasValue = selected != null;
  const floating = Boolean(alwaysFloatLabel) || open || hasValue || Boolean(placeholder);
  const handleSelect = (next) => {
    const finalValue = next === selected ? void 0 : next;
    if (!isControlled) setInternal(finalValue);
    onChange?.(finalValue);
    setOpen(false);
  };
  return /* @__PURE__ */ jsx20(
    FloatingFieldShell,
    {
      label,
      hint,
      error,
      required,
      hideLabel,
      htmlFor: triggerId,
      size,
      floating,
      focused: open,
      hasError,
      containerClassName,
      rightAdornment: /* @__PURE__ */ jsx20(ChevronsUpDown, {}),
      children: /* @__PURE__ */ jsxs17(Popover, { open, onOpenChange: setOpen, children: [
        /* @__PURE__ */ jsx20(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsx20(
          "button",
          {
            id: triggerId,
            type: "button",
            disabled,
            "aria-invalid": hasError || void 0,
            "aria-expanded": open,
            className: cn(
              fieldShapeClasses({ hasError, size }),
              "flex items-center text-left pr-9",
              !selectedOption && "text-text-tertiary",
              className
            ),
            children: /* @__PURE__ */ jsx20("span", { className: "truncate", children: selectedOption ? selectedOption.label : floating ? placeholder ?? "" : "" })
          }
        ) }),
        /* @__PURE__ */ jsx20(
          PopoverContent,
          {
            className: "w-[var(--radix-popover-trigger-width)] p-0",
            align: "start",
            children: /* @__PURE__ */ jsxs17(CmdkRoot, { shouldFilter: !onSearch, className: "flex w-full flex-col", children: [
              /* @__PURE__ */ jsx20(
                CmdkRoot.Input,
                {
                  value: query,
                  onValueChange: (v) => {
                    setQuery(v);
                    onSearch?.(v);
                  },
                  placeholder: searchPlaceholder,
                  className: "border-b border-border-default px-3 py-2 text-sm outline-none placeholder:text-text-tertiary"
                }
              ),
              /* @__PURE__ */ jsxs17(CmdkRoot.List, { className: "max-h-64 overflow-auto p-1", children: [
                /* @__PURE__ */ jsx20(CmdkRoot.Empty, { className: "px-3 py-6 text-center text-sm text-text-tertiary", children: emptyText }),
                options.map((opt) => /* @__PURE__ */ jsxs17(
                  CmdkRoot.Item,
                  {
                    value: opt.label,
                    disabled: opt.disabled,
                    onSelect: () => handleSelect(opt.value),
                    className: cn(
                      "flex cursor-pointer items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm",
                      "data-[selected=true]:bg-brand-subtle",
                      "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
                    ),
                    children: [
                      /* @__PURE__ */ jsxs17("span", { className: "flex flex-col", children: [
                        /* @__PURE__ */ jsx20("span", { children: opt.label }),
                        opt.description && /* @__PURE__ */ jsx20("span", { className: "text-xs text-text-tertiary", children: opt.description })
                      ] }),
                      opt.value === selected && /* @__PURE__ */ jsx20(Check3, { className: "size-4 text-text-primary" })
                    ]
                  },
                  opt.value
                ))
              ] })
            ] })
          }
        )
      ] })
    }
  );
}

// src/form/MultiAutocomplete.tsx
import * as React19 from "react";
import { Command as CmdkRoot2 } from "cmdk";
import { Check as Check4, ChevronsUpDown as ChevronsUpDown2, X as X3 } from "lucide-react";
import { Fragment as Fragment5, jsx as jsx21, jsxs as jsxs18 } from "react/jsx-runtime";
var minHeights2 = {
  sm: "min-h-9",
  md: "min-h-11",
  lg: "min-h-12"
};
function MultiAutocomplete({
  id,
  label,
  hint,
  error,
  required,
  hideLabel,
  alwaysFloatLabel,
  placeholder,
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  value,
  defaultValue,
  onChange,
  options,
  onSearch,
  maxVisibleChips = 3,
  maxItems,
  disabled,
  size = "md",
  className,
  containerClassName
}) {
  const reactId = React19.useId();
  const triggerId = id ?? reactId;
  const [open, setOpen] = React19.useState(false);
  const [internal, setInternal] = React19.useState(defaultValue ?? []);
  const [query, setQuery] = React19.useState("");
  const isControlled = value !== void 0;
  const selected = isControlled ? value ?? [] : internal;
  const hasError = Boolean(error);
  const hasValue = selected.length > 0;
  const floating = Boolean(alwaysFloatLabel) || open || hasValue || Boolean(placeholder);
  const setSelected = (next) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };
  const toggle = (v) => {
    if (selected.includes(v)) {
      setSelected(selected.filter((x) => x !== v));
    } else {
      if (maxItems != null && selected.length >= maxItems) return;
      setSelected([...selected, v]);
    }
  };
  const remove = (v) => setSelected(selected.filter((x) => x !== v));
  const selectedLabels = selected.map(
    (v) => options.find((o) => o.value === v)?.label ?? String(v)
  );
  const visible = selectedLabels.slice(0, maxVisibleChips);
  const overflow = selectedLabels.length - visible.length;
  return /* @__PURE__ */ jsx21(
    FloatingFieldShell,
    {
      label,
      hint,
      error,
      required,
      hideLabel,
      htmlFor: triggerId,
      size,
      floating,
      focused: open,
      hasError,
      containerClassName,
      rightAdornment: /* @__PURE__ */ jsx21(ChevronsUpDown2, {}),
      children: /* @__PURE__ */ jsxs18(
        Popover,
        {
          open,
          onOpenChange: (next) => {
            if (disabled) return;
            setOpen(next);
          },
          children: [
            /* @__PURE__ */ jsx21(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsx21(
              "div",
              {
                id: triggerId,
                role: "combobox",
                tabIndex: disabled ? -1 : 0,
                "aria-disabled": disabled || void 0,
                "aria-invalid": hasError || void 0,
                "aria-expanded": open,
                onKeyDown: (e) => {
                  if (disabled) return;
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpen((o) => !o);
                  }
                },
                className: cn(
                  "flex w-full items-center gap-1.5 rounded-sm border bg-white px-3 py-1.5 pr-9 font-medium transition-colors cursor-pointer",
                  "focus:outline-none focus:ring-1",
                  "aria-disabled:cursor-not-allowed aria-disabled:bg-gray-50",
                  minHeights2[size],
                  hasError ? "border-cherry-red-600 focus:border-cherry-red-600 focus:ring-cherry-red-600/40" : "border-border-strong focus:border-brand focus:ring-brand/30",
                  className
                ),
                children: /* @__PURE__ */ jsx21("span", { className: "flex flex-1 flex-wrap items-center gap-1", children: selected.length === 0 ? /* @__PURE__ */ jsx21("span", { className: "text-sm text-text-tertiary", children: floating ? placeholder ?? "" : "" }) : /* @__PURE__ */ jsxs18(Fragment5, { children: [
                  visible.map((lbl, i) => {
                    const v = selected[i];
                    return /* @__PURE__ */ jsx21(
                      Chip,
                      {
                        size: "sm",
                        variant: "primary",
                        removable: true,
                        onRemove: (e) => {
                          e.stopPropagation();
                          remove(v);
                        },
                        children: lbl
                      },
                      v
                    );
                  }),
                  overflow > 0 && /* @__PURE__ */ jsxs18(Chip, { size: "sm", variant: "neutral", children: [
                    "+",
                    overflow
                  ] })
                ] }) })
              }
            ) }),
            /* @__PURE__ */ jsx21(
              PopoverContent,
              {
                className: "w-[var(--radix-popover-trigger-width)] p-0",
                align: "start",
                children: /* @__PURE__ */ jsxs18(CmdkRoot2, { shouldFilter: !onSearch, className: "flex w-full flex-col", children: [
                  /* @__PURE__ */ jsx21(
                    CmdkRoot2.Input,
                    {
                      value: query,
                      onValueChange: (v) => {
                        setQuery(v);
                        onSearch?.(v);
                      },
                      placeholder: searchPlaceholder,
                      className: "border-b border-border-default px-3 py-2 text-sm outline-none placeholder:text-text-tertiary"
                    }
                  ),
                  /* @__PURE__ */ jsxs18(CmdkRoot2.List, { className: "max-h-64 overflow-auto p-1", children: [
                    /* @__PURE__ */ jsx21(CmdkRoot2.Empty, { className: "px-3 py-6 text-center text-sm text-text-tertiary", children: emptyText }),
                    options.map((opt) => {
                      const checked = selected.includes(opt.value);
                      const capped = !checked && maxItems != null && selected.length >= maxItems;
                      return /* @__PURE__ */ jsxs18(
                        CmdkRoot2.Item,
                        {
                          value: opt.label,
                          disabled: opt.disabled || capped,
                          onSelect: () => toggle(opt.value),
                          className: cn(
                            "flex cursor-pointer items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm",
                            "data-[selected=true]:bg-brand-subtle",
                            "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
                          ),
                          children: [
                            /* @__PURE__ */ jsx21("span", { children: opt.label }),
                            checked && /* @__PURE__ */ jsx21(Check4, { className: "size-4 text-text-primary" })
                          ]
                        },
                        opt.value
                      );
                    })
                  ] }),
                  selected.length > 0 && /* @__PURE__ */ jsxs18("div", { className: "flex items-center justify-between border-t border-border-default px-2 py-1.5 text-xs", children: [
                    /* @__PURE__ */ jsxs18("span", { className: "text-text-tertiary", children: [
                      selected.length,
                      " selected",
                      maxItems != null && ` / ${maxItems}`
                    ] }),
                    /* @__PURE__ */ jsxs18(
                      "button",
                      {
                        type: "button",
                        onClick: () => setSelected([]),
                        className: "flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-cherry-red-600 hover:bg-cherry-red-50",
                        children: [
                          /* @__PURE__ */ jsx21(X3, { className: "size-3" }),
                          "Clear"
                        ]
                      }
                    )
                  ] })
                ] })
              }
            )
          ]
        }
      )
    }
  );
}

// src/data/Table.tsx
import * as React20 from "react";
import { jsx as jsx22 } from "react/jsx-runtime";
var Table = React20.forwardRef(function Table2({ className, ...props }, ref) {
  return /* @__PURE__ */ jsx22("div", { className: "relative w-full overflow-auto", children: /* @__PURE__ */ jsx22(
    "table",
    {
      ref,
      className: cn("w-full caption-bottom text-sm", className),
      ...props
    }
  ) });
});
var TableHeader = React20.forwardRef(function TableHeader2({ className, ...props }, ref) {
  return /* @__PURE__ */ jsx22(
    "thead",
    {
      ref,
      className: cn("[&_tr]:border-b border-border-default", className),
      ...props
    }
  );
});
var TableBody = React20.forwardRef(function TableBody2({ className, ...props }, ref) {
  return /* @__PURE__ */ jsx22(
    "tbody",
    {
      ref,
      className: cn("[&_tr:last-child]:border-0", className),
      ...props
    }
  );
});
var TableFooter = React20.forwardRef(function TableFooter2({ className, ...props }, ref) {
  return /* @__PURE__ */ jsx22(
    "tfoot",
    {
      ref,
      className: cn(
        "border-t border-border-default bg-gray-50 font-medium",
        className
      ),
      ...props
    }
  );
});
var TableRow = React20.forwardRef(function TableRow2({ className, ...props }, ref) {
  return /* @__PURE__ */ jsx22(
    "tr",
    {
      ref,
      className: cn(
        "border-b border-border-default transition-colors hover:bg-brand-subtle/50 data-[state=selected]:bg-brand-subtle",
        className
      ),
      ...props
    }
  );
});
var TableHead = React20.forwardRef(function TableHead2({ className, ...props }, ref) {
  return /* @__PURE__ */ jsx22(
    "th",
    {
      ref,
      className: cn(
        "h-10 px-3 text-left align-middle text-xs font-semibold uppercase tracking-wide text-text-tertiary",
        "[&:has([role=checkbox])]:pr-0",
        className
      ),
      ...props
    }
  );
});
var TableCell = React20.forwardRef(function TableCell2({ className, ...props }, ref) {
  return /* @__PURE__ */ jsx22(
    "td",
    {
      ref,
      className: cn(
        "px-3 py-2.5 align-middle text-sm text-text-primary",
        "[&:has([role=checkbox])]:pr-0",
        className
      ),
      ...props
    }
  );
});
var TableCaption = React20.forwardRef(function TableCaption2({ className, ...props }, ref) {
  return /* @__PURE__ */ jsx22(
    "caption",
    {
      ref,
      className: cn("mt-4 text-sm text-text-tertiary", className),
      ...props
    }
  );
});
Table.displayName = "Table";
TableHeader.displayName = "TableHeader";
TableBody.displayName = "TableBody";
TableFooter.displayName = "TableFooter";
TableRow.displayName = "TableRow";
TableHead.displayName = "TableHead";
TableCell.displayName = "TableCell";
TableCaption.displayName = "TableCaption";

// src/data/DataTable.tsx
import * as React22 from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft as ChevronLeft2,
  ChevronRight as ChevronRight2,
  ChevronsUpDown as ChevronsUpDown3
} from "lucide-react";

// src/feedback/Skeleton.tsx
import * as React21 from "react";
import { jsx as jsx23 } from "react/jsx-runtime";
var Skeleton = React21.forwardRef(
  function Skeleton2({ className, shape = "rect", style, ...props }, ref) {
    return /* @__PURE__ */ jsx23(
      "div",
      {
        ref,
        "aria-hidden": "true",
        className: cn(
          "animate-pulse bg-gray-200/80",
          shape === "rect" && "rounded-sm",
          shape === "text" && "h-4 rounded-sm",
          shape === "circle" && "rounded-full",
          className
        ),
        style,
        ...props
      }
    );
  }
);
Skeleton.displayName = "Skeleton";

// src/feedback/EmptyState.tsx
import { jsx as jsx24, jsxs as jsxs19 } from "react/jsx-runtime";
var toneBg = {
  info: "bg-info-blue-50",
  success: "bg-success-green-50",
  warning: "bg-warning-yellow-50",
  danger: "bg-cherry-red-50",
  neutral: "bg-gray-100",
  none: ""
};
function EmptyState({
  icon,
  title,
  description,
  action,
  iconTone = "info",
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx24(
    "div",
    {
      className: cn(
        "flex w-full justify-center p-3",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxs19("div", { className: "w-full max-w-[600px] rounded-xl bg-white p-8 text-center", children: [
        icon && /* @__PURE__ */ jsx24("div", { className: "mb-6 flex justify-center", children: iconTone === "none" ? icon : /* @__PURE__ */ jsx24(
          "div",
          {
            className: cn(
              "inline-flex items-center justify-center rounded-full p-6",
              toneBg[iconTone]
            ),
            children: icon
          }
        ) }),
        title && /* @__PURE__ */ jsx24("h2", { className: "mb-4 text-xl font-semibold leading-tight text-text-primary sm:text-2xl", children: title }),
        description && /* @__PURE__ */ jsx24("p", { className: "text-base leading-[1.7] text-text-tertiary", children: description }),
        action && /* @__PURE__ */ jsx24("div", { className: "mt-8 flex justify-center", children: action })
      ] })
    }
  );
}

// src/data/DataTable.tsx
import { Fragment as Fragment6, jsx as jsx25, jsxs as jsxs20 } from "react/jsx-runtime";
function DataTable({
  columns,
  data,
  isLoading,
  pagination,
  sorting: sortingProp,
  onSortingChange,
  manualSorting,
  enableSelection,
  rowSelection: rowSelectionProp,
  onRowSelectionChange,
  getRowId,
  onRowClick,
  stickyHeader,
  empty,
  className
}) {
  const [internalSorting, setInternalSorting] = React22.useState([]);
  const sorting = sortingProp ?? internalSorting;
  const handleSortingChange = onSortingChange ?? setInternalSorting;
  const [internalSelection, setInternalSelection] = React22.useState({});
  const rowSelection = rowSelectionProp ?? internalSelection;
  const handleSelectionChange = onRowSelectionChange ?? setInternalSelection;
  const finalColumns = React22.useMemo(() => {
    if (!enableSelection) return columns;
    const selectColumn = {
      id: "__select",
      size: 40,
      header: ({ table: table2 }) => /* @__PURE__ */ jsx25(
        Checkbox,
        {
          checked: table2.getIsAllRowsSelected() ? true : table2.getIsSomeRowsSelected() ? "indeterminate" : false,
          onCheckedChange: (v) => table2.toggleAllRowsSelected(v === true),
          "aria-label": "Select all"
        }
      ),
      cell: ({ row }) => /* @__PURE__ */ jsx25("div", { onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsx25(
        Checkbox,
        {
          checked: row.getIsSelected(),
          onCheckedChange: (v) => row.toggleSelected(v === true),
          "aria-label": "Select row"
        }
      ) }),
      enableSorting: false
    };
    return [selectColumn, ...columns];
  }, [columns, enableSelection]);
  const table = useReactTable({
    data,
    columns: finalColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: manualSorting ? void 0 : getSortedRowModel(),
    state: { sorting, rowSelection },
    onSortingChange: handleSortingChange,
    onRowSelectionChange: handleSelectionChange,
    enableRowSelection: enableSelection,
    manualSorting,
    manualPagination: !!pagination,
    rowCount: pagination?.rowCount,
    getRowId
  });
  const totalPages = pagination ? Math.max(1, Math.ceil(pagination.rowCount / pagination.pageSize)) : 1;
  const currentPage = pagination ? pagination.pageIndex + 1 : 1;
  return /* @__PURE__ */ jsxs20(
    "div",
    {
      className: cn(
        "flex flex-col rounded-md border border-border-default bg-white",
        className
      ),
      children: [
        /* @__PURE__ */ jsx25("div", { className: cn(stickyHeader && "max-h-[600px] overflow-auto"), children: /* @__PURE__ */ jsxs20(Table, { children: [
          /* @__PURE__ */ jsx25(
            TableHeader,
            {
              className: cn(
                stickyHeader && "sticky top-0 z-10 bg-white shadow-[0_1px_0_0_#0000001f]"
              ),
              children: table.getHeaderGroups().map((hg) => /* @__PURE__ */ jsx25(TableRow, { className: "hover:bg-transparent", children: hg.headers.map((header) => {
                const sortable = header.column.getCanSort();
                const sortDir = header.column.getIsSorted();
                return /* @__PURE__ */ jsx25(
                  TableHead,
                  {
                    style: header.column.columnDef.size ? { width: header.column.columnDef.size } : void 0,
                    children: header.isPlaceholder ? null : sortable ? /* @__PURE__ */ jsxs20(
                      "button",
                      {
                        type: "button",
                        onClick: header.column.getToggleSortingHandler(),
                        className: "inline-flex cursor-pointer items-center gap-1 hover:text-brand",
                        children: [
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          ),
                          sortDir === "asc" ? /* @__PURE__ */ jsx25(ArrowUp, { className: "size-3" }) : sortDir === "desc" ? /* @__PURE__ */ jsx25(ArrowDown, { className: "size-3" }) : /* @__PURE__ */ jsx25(ChevronsUpDown3, { className: "size-3 opacity-60" })
                        ]
                      }
                    ) : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )
                  },
                  header.id
                );
              }) }, hg.id))
            }
          ),
          /* @__PURE__ */ jsx25(TableBody, { children: isLoading ? /* @__PURE__ */ jsx25(
            SkeletonRows,
            {
              columnCount: finalColumns.length,
              rowCount: pagination?.pageSize ?? 5
            }
          ) : table.getRowModel().rows.length === 0 ? /* @__PURE__ */ jsx25(TableRow, { className: "hover:bg-transparent", children: /* @__PURE__ */ jsx25(
            TableCell,
            {
              colSpan: finalColumns.length,
              className: "p-0",
              children: empty ?? /* @__PURE__ */ jsx25(
                EmptyState,
                {
                  title: "No data",
                  description: "There's nothing to show here yet."
                }
              )
            }
          ) }) : table.getRowModel().rows.map((row, idx) => /* @__PURE__ */ jsx25(
            DataRow,
            {
              row,
              onClick: onRowClick ? () => onRowClick(row.original, idx) : void 0
            },
            row.id
          )) })
        ] }) }),
        pagination && /* @__PURE__ */ jsx25(
          PaginationFooter,
          {
            pagination,
            currentPage,
            totalPages,
            table
          }
        )
      ]
    }
  );
}
function DataRow({
  row,
  onClick
}) {
  return /* @__PURE__ */ jsx25(
    TableRow,
    {
      "data-state": row.getIsSelected() ? "selected" : void 0,
      onClick,
      className: onClick ? "cursor-pointer" : void 0,
      children: row.getVisibleCells().map((cell) => /* @__PURE__ */ jsx25(TableCell, { children: flexRender(cell.column.columnDef.cell, cell.getContext()) }, cell.id))
    }
  );
}
function SkeletonRows({
  columnCount,
  rowCount
}) {
  return /* @__PURE__ */ jsx25(Fragment6, { children: Array.from({ length: rowCount }).map((_, r) => /* @__PURE__ */ jsx25(TableRow, { className: "hover:bg-transparent", children: Array.from({ length: columnCount }).map((__, c) => /* @__PURE__ */ jsx25(TableCell, { children: /* @__PURE__ */ jsx25(Skeleton, { shape: "text", className: "w-full" }) }, c)) }, r)) });
}
function PaginationFooter({
  pagination,
  currentPage,
  totalPages,
  table
}) {
  const sizeOptions = pagination.pageSizeOptions ?? [10, 20, 50, 100];
  const start = pagination.pageIndex * pagination.pageSize + 1;
  const end = Math.min(
    pagination.rowCount,
    (pagination.pageIndex + 1) * pagination.pageSize
  );
  const selectedCount = table.getSelectedRowModel().rows.length;
  return /* @__PURE__ */ jsxs20("div", { className: "flex flex-wrap items-center justify-between gap-3 border-t border-border-default px-3 py-2 text-sm", children: [
    /* @__PURE__ */ jsxs20("div", { className: "flex items-center gap-3 text-text-tertiary", children: [
      selectedCount > 0 && /* @__PURE__ */ jsxs20("span", { className: "font-medium text-text-primary", children: [
        selectedCount,
        " selected"
      ] }),
      pagination.rowCount > 0 ? /* @__PURE__ */ jsxs20("span", { children: [
        start,
        "\u2013",
        end,
        " of ",
        pagination.rowCount
      ] }) : /* @__PURE__ */ jsx25("span", { children: "0 of 0" })
    ] }),
    /* @__PURE__ */ jsxs20("div", { className: "flex items-center gap-3", children: [
      pagination.onPageSizeChange && /* @__PURE__ */ jsxs20("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx25("span", { className: "text-text-tertiary", children: "Rows per page" }),
        /* @__PURE__ */ jsx25(
          Select,
          {
            size: "sm",
            value: String(pagination.pageSize),
            onChange: (v) => pagination.onPageSizeChange?.(Number(v)),
            options: sizeOptions.map((n) => ({
              value: String(n),
              label: String(n)
            })),
            className: "w-20"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs20("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsx25(
          Button,
          {
            variant: "ghost",
            size: "sm",
            disabled: pagination.pageIndex === 0,
            onClick: () => pagination.onPageChange(Math.max(0, pagination.pageIndex - 1)),
            leftIcon: /* @__PURE__ */ jsx25(ChevronLeft2, {}),
            children: "Prev"
          }
        ),
        /* @__PURE__ */ jsxs20("span", { className: "px-2 text-text-tertiary", children: [
          currentPage,
          " / ",
          totalPages
        ] }),
        /* @__PURE__ */ jsx25(
          Button,
          {
            variant: "ghost",
            size: "sm",
            disabled: pagination.pageIndex >= totalPages - 1,
            onClick: () => pagination.onPageChange(
              Math.min(totalPages - 1, pagination.pageIndex + 1)
            ),
            rightIcon: /* @__PURE__ */ jsx25(ChevronRight2, {}),
            children: "Next"
          }
        )
      ] })
    ] })
  ] });
}

// src/layout/Card.tsx
import * as React23 from "react";
import { cva as cva6 } from "class-variance-authority";
import { jsx as jsx26 } from "react/jsx-runtime";
var cardVariants = cva6("flex flex-col bg-white", {
  variants: {
    variant: {
      elevated: "rounded-md border border-border-subtle shadow-sm",
      outlined: "rounded-md border border-border-default",
      flat: "rounded-md"
    },
    padding: {
      none: "",
      sm: "p-3",
      md: "p-4",
      lg: "p-6"
    }
  },
  defaultVariants: { variant: "outlined", padding: "md" }
});
var Card = React23.forwardRef(function Card2({ className, variant, padding, ...props }, ref) {
  return /* @__PURE__ */ jsx26(
    "div",
    {
      ref,
      className: cn(cardVariants({ variant, padding }), className),
      ...props
    }
  );
});
var CardHeader = ({ className, ...props }) => /* @__PURE__ */ jsx26(
  "div",
  {
    className: cn("flex flex-col gap-1 pb-3", className),
    ...props
  }
);
var CardTitle = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx26(
  "h3",
  {
    className: cn("text-base font-semibold text-text-primary", className),
    ...props
  }
);
var CardDescription = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx26("p", { className: cn("text-sm text-text-body", className), ...props });
var CardContent = ({ className, ...props }) => /* @__PURE__ */ jsx26("div", { className: cn("flex-1", className), ...props });
var CardFooter = ({ className, ...props }) => /* @__PURE__ */ jsx26(
  "div",
  {
    className: cn("flex items-center gap-2 pt-3", className),
    ...props
  }
);
Card.displayName = "Card";

// src/layout/Tabs.tsx
import * as React24 from "react";
import * as RadixTabs from "@radix-ui/react-tabs";
import { cva as cva7 } from "class-variance-authority";
import { jsx as jsx27 } from "react/jsx-runtime";
var Tabs = RadixTabs.Root;
var tabsListVariants = cva7("inline-flex items-center", {
  variants: {
    variant: {
      underline: "w-full justify-start gap-1 border-b border-border-default",
      pill: "gap-1 rounded-md bg-gray-100 p-1"
    }
  },
  defaultVariants: { variant: "underline" }
});
var tabsTriggerVariants = cva7(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all outline-none disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-brand/40",
  {
    variants: {
      variant: {
        underline: "px-3 pb-2 pt-1 -mb-px border-b-2 border-transparent text-text-tertiary hover:text-brand data-[state=active]:border-brand data-[state=active]:text-brand",
        pill: "rounded-sm px-3 py-1.5 text-text-tertiary hover:text-brand data-[state=active]:bg-white data-[state=active]:text-brand data-[state=active]:shadow-sm"
      }
    },
    defaultVariants: { variant: "underline" }
  }
);
var TabsList = React24.forwardRef(
  function TabsList2({ className, variant, ...props }, ref) {
    return /* @__PURE__ */ jsx27(
      RadixTabs.List,
      {
        ref,
        "data-tabs-variant": variant ?? "underline",
        className: cn(tabsListVariants({ variant }), className),
        ...props
      }
    );
  }
);
var TabsTrigger = React24.forwardRef(
  function TabsTrigger2({ className, variant, ...props }, ref) {
    return /* @__PURE__ */ jsx27(
      RadixTabs.Trigger,
      {
        ref,
        className: cn(tabsTriggerVariants({ variant }), className),
        ...props
      }
    );
  }
);
var TabsContent = React24.forwardRef(function TabsContent2({ className, ...props }, ref) {
  return /* @__PURE__ */ jsx27(
    RadixTabs.Content,
    {
      ref,
      className: cn(
        "mt-4 outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
        className
      ),
      ...props
    }
  );
});
TabsList.displayName = "TabsList";
TabsTrigger.displayName = "TabsTrigger";
TabsContent.displayName = "TabsContent";

// src/layout/Breadcrumb.tsx
import * as React25 from "react";
import { MoreHorizontal } from "lucide-react";
import { Slot as Slot5 } from "@radix-ui/react-slot";
import { jsx as jsx28, jsxs as jsxs21 } from "react/jsx-runtime";
function Breadcrumb({
  items,
  separator,
  maxItems = 0,
  className,
  ...props
}) {
  const sep = separator ?? /* @__PURE__ */ jsx28("span", { className: "select-none text-text-tertiary", "aria-hidden": "true", children: "/" });
  let visible = items;
  if (maxItems > 0 && items.length > maxItems) {
    visible = [items[0], "ellipsis", ...items.slice(-(maxItems - 1))];
  }
  return /* @__PURE__ */ jsx28(
    "nav",
    {
      "aria-label": "Breadcrumb",
      className: cn("flex items-center text-base", className),
      ...props,
      children: /* @__PURE__ */ jsx28("ol", { className: "flex flex-wrap items-center gap-3", children: visible.map((item, i) => {
        const isLast = i === visible.length - 1;
        if (item === "ellipsis") {
          return /* @__PURE__ */ jsxs21("li", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx28(MoreHorizontal, { className: "size-4 text-text-tertiary" }),
            !isLast && sep
          ] }, `ellipsis-${i}`);
        }
        const itemBaseClass = "inline-flex items-center gap-2 leading-none [&_svg]:size-5";
        return /* @__PURE__ */ jsxs21("li", { className: "flex items-center gap-3 leading-none", children: [
          isLast ? /* @__PURE__ */ jsxs21(
            "span",
            {
              className: cn(
                itemBaseClass,
                "font-semibold text-brand"
              ),
              "aria-current": "page",
              children: [
                item.icon,
                item.label
              ]
            }
          ) : item.href ? /* @__PURE__ */ jsxs21(
            "a",
            {
              href: item.href,
              className: cn(
                itemBaseClass,
                "text-text-tertiary transition-colors hover:text-brand"
              ),
              children: [
                item.icon,
                item.label
              ]
            }
          ) : item.onClick ? /* @__PURE__ */ jsxs21(
            "button",
            {
              type: "button",
              onClick: item.onClick,
              className: cn(
                itemBaseClass,
                "text-text-tertiary transition-colors hover:text-brand"
              ),
              children: [
                item.icon,
                item.label
              ]
            }
          ) : /* @__PURE__ */ jsxs21("span", { className: cn(itemBaseClass, "text-text-tertiary"), children: [
            item.icon,
            item.label
          ] }),
          !isLast && sep
        ] }, i);
      }) })
    }
  );
}
var BreadcrumbRoot = ({ className, ...props }) => /* @__PURE__ */ jsx28(
  "nav",
  {
    "aria-label": "Breadcrumb",
    className: cn("flex items-center text-base", className),
    ...props
  }
);
var BreadcrumbLink = React25.forwardRef(function BreadcrumbLink2({ className, asChild, ...props }, ref) {
  const Comp = asChild ? Slot5 : "a";
  return /* @__PURE__ */ jsx28(
    Comp,
    {
      ref,
      className: cn(
        "text-text-tertiary transition-colors hover:text-brand",
        className
      ),
      ...props
    }
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";

// src/layout/Stepper.tsx
import { Check as Check5 } from "lucide-react";
import { jsx as jsx29, jsxs as jsxs22 } from "react/jsx-runtime";
function Stepper({
  steps,
  current,
  orientation = "horizontal",
  className,
  onStepClick
}) {
  const isVertical = orientation === "vertical";
  return /* @__PURE__ */ jsx29(
    "ol",
    {
      className: cn(
        "flex",
        isVertical ? "flex-col gap-4" : "items-center gap-3",
        className
      ),
      children: steps.map((step, i) => {
        const status = i < current ? "done" : i === current ? "active" : "todo";
        const isLast = i === steps.length - 1;
        const clickable = onStepClick && status !== "todo";
        const showCheck = status === "done" || status === "active";
        const circle = /* @__PURE__ */ jsx29(
          "div",
          {
            className: cn(
              "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
              status === "todo" ? "bg-gray-200 text-text-tertiary" : "bg-brand-active text-white"
            ),
            children: showCheck ? /* @__PURE__ */ jsx29(Check5, { className: "size-4", strokeWidth: 3 }) : i + 1
          }
        );
        return /* @__PURE__ */ jsxs22(
          "li",
          {
            className: cn(
              "flex",
              isVertical ? "items-start gap-3" : "items-center gap-2",
              !isVertical && !isLast && "flex-1"
            ),
            children: [
              /* @__PURE__ */ jsxs22(
                "div",
                {
                  className: cn(
                    "flex",
                    isVertical ? "flex-col items-center" : "items-center gap-2"
                  ),
                  children: [
                    clickable ? /* @__PURE__ */ jsx29(
                      "button",
                      {
                        type: "button",
                        onClick: () => onStepClick?.(i),
                        className: "rounded-full focus:outline-none focus:ring-2 focus:ring-brand-active/40",
                        children: circle
                      }
                    ) : circle,
                    isVertical && !isLast && /* @__PURE__ */ jsx29(
                      "div",
                      {
                        className: cn(
                          "mt-1 w-px flex-1 min-h-6",
                          status === "done" ? "bg-brand-active" : "bg-border-default"
                        )
                      }
                    ),
                    !isVertical && /* @__PURE__ */ jsxs22(
                      "div",
                      {
                        className: cn(
                          "text-sm",
                          status === "todo" ? "text-text-tertiary font-normal" : "text-text-primary font-semibold"
                        ),
                        children: [
                          step.label,
                          step.description && /* @__PURE__ */ jsx29("div", { className: "text-xs font-normal text-text-tertiary", children: step.description })
                        ]
                      }
                    )
                  ]
                }
              ),
              isVertical && /* @__PURE__ */ jsxs22("div", { className: "min-w-0 pb-4", children: [
                /* @__PURE__ */ jsx29(
                  "div",
                  {
                    className: cn(
                      "text-sm",
                      status === "todo" ? "text-text-tertiary font-normal" : "text-text-primary font-semibold"
                    ),
                    children: step.label
                  }
                ),
                step.description && /* @__PURE__ */ jsx29("div", { className: "text-xs text-text-tertiary", children: step.description })
              ] }),
              !isVertical && !isLast && /* @__PURE__ */ jsx29("div", { className: "h-px flex-1 bg-border-default" })
            ]
          },
          i
        );
      })
    }
  );
}

// src/feedback/Spinner.tsx
import * as React26 from "react";
import { jsx as jsx30, jsxs as jsxs23 } from "react/jsx-runtime";
var sizeClasses2 = {
  xs: "size-3",
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
  xl: "size-8"
};
var Spinner2 = React26.forwardRef(function Spinner3({ className, size = "md", label = "Loading", ...props }, ref) {
  return /* @__PURE__ */ jsx30(
    "span",
    {
      ref,
      role: "status",
      "aria-label": label,
      className: cn("inline-flex", className),
      ...props,
      children: /* @__PURE__ */ jsxs23(
        "svg",
        {
          className: cn("animate-spin text-current", sizeClasses2[size]),
          viewBox: "0 0 24 24",
          fill: "none",
          "aria-hidden": "true",
          children: [
            /* @__PURE__ */ jsx30(
              "circle",
              {
                cx: "12",
                cy: "12",
                r: "10",
                stroke: "currentColor",
                strokeWidth: "3",
                opacity: "0.25"
              }
            ),
            /* @__PURE__ */ jsx30(
              "path",
              {
                fill: "currentColor",
                d: "M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
              }
            )
          ]
        }
      )
    }
  );
});
function LoadingScreen({
  label = "Loading...",
  className
}) {
  return /* @__PURE__ */ jsxs23(
    "div",
    {
      role: "status",
      className: cn(
        "flex w-full flex-col items-center justify-center gap-3 py-16 text-text-tertiary",
        className
      ),
      children: [
        /* @__PURE__ */ jsx30(Spinner2, { size: "xl" }),
        label && /* @__PURE__ */ jsx30("span", { className: "text-sm", children: label })
      ]
    }
  );
}
Spinner2.displayName = "Spinner";

// src/feedback/Toast.tsx
import { Toaster as SonnerToaster } from "sonner";
import { CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";
import { toast } from "sonner";
import { jsx as jsx31 } from "react/jsx-runtime";
var baseToast = "flex items-center gap-3 rounded-sm border px-5 py-3 shadow-sm font-semibold text-base [&_svg]:size-6 [&_svg]:shrink-0";
var tones = {
  success: "bg-success-green-50! border-success-green-200! text-success-green-800! [&_svg]:text-success-green-primary!",
  error: "bg-cherry-red-50! border-cherry-red-200! text-cherry-red-800! [&_svg]:text-cherry-red-600!",
  warning: "bg-warning-yellow-50! border-warning-yellow-200! text-warning-yellow-800! [&_svg]:text-warning-yellow-600!",
  info: "bg-info-blue-50! border-info-blue-200! text-info-blue-800! [&_svg]:text-info-blue-primary!",
  default: "bg-white border-border-default text-brand [&_svg]:text-brand"
};
function Toaster(props) {
  return /* @__PURE__ */ jsx31(
    SonnerToaster,
    {
      position: "top-right",
      duration: 4e3,
      icons: {
        success: /* @__PURE__ */ jsx31(CheckCircle2, { strokeWidth: 2.25 }),
        error: /* @__PURE__ */ jsx31(XCircle, { strokeWidth: 2.25 }),
        warning: /* @__PURE__ */ jsx31(AlertTriangle, { strokeWidth: 2.25 }),
        info: /* @__PURE__ */ jsx31(Info, { strokeWidth: 2.25 })
      },
      toastOptions: {
        unstyled: true,
        classNames: {
          toast: baseToast,
          default: tones.default,
          success: tones.success,
          error: tones.error,
          warning: tones.warning,
          info: tones.info,
          title: "leading-tight",
          description: "text-sm font-medium opacity-90"
        }
      },
      ...props
    }
  );
}

// src/overlay/Dialog.tsx
import * as React27 from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { X as X4 } from "lucide-react";
import { jsx as jsx32, jsxs as jsxs24 } from "react/jsx-runtime";
var Dialog = RadixDialog.Root;
var DialogTrigger = RadixDialog.Trigger;
var DialogPortal = RadixDialog.Portal;
var DialogClose = RadixDialog.Close;
var DialogOverlay = React27.forwardRef(function DialogOverlay2({ className, ...props }, ref) {
  return /* @__PURE__ */ jsx32(
    RadixDialog.Overlay,
    {
      ref,
      className: cn(
        "fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        className
      ),
      ...props
    }
  );
});
var sizeClasses3 = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl"
};
var DialogContent = React27.forwardRef(
  function DialogContent2({ className, children, size = "md", showClose = true, ...props }, ref) {
    return /* @__PURE__ */ jsxs24(DialogPortal, { children: [
      /* @__PURE__ */ jsx32(DialogOverlay, {}),
      /* @__PURE__ */ jsxs24(
        RadixDialog.Content,
        {
          ref,
          className: cn(
            "fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2",
            "rounded-md border border-border-default bg-white p-6 shadow-xl outline-none",
            "data-[state=open]:animate-in data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:zoom-out-95",
            sizeClasses3[size],
            className
          ),
          ...props,
          children: [
            children,
            showClose && /* @__PURE__ */ jsx32(
              RadixDialog.Close,
              {
                "aria-label": "Close",
                className: "absolute right-4 top-4 rounded-sm p-1 text-text-tertiary opacity-70 transition-opacity hover:bg-black/5 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-brand/30",
                children: /* @__PURE__ */ jsx32(X4, { className: "size-4" })
              }
            )
          ]
        }
      )
    ] });
  }
);
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx32(
  "div",
  {
    className: cn("flex flex-col gap-1.5 pb-4 pr-6", className),
    ...props
  }
);
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsx32(
  "div",
  {
    className: cn(
      "flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end",
      className
    ),
    ...props
  }
);
var DialogTitle = React27.forwardRef(function DialogTitle2({ className, ...props }, ref) {
  return /* @__PURE__ */ jsx32(
    RadixDialog.Title,
    {
      ref,
      className: cn("text-lg font-semibold text-text-primary", className),
      ...props
    }
  );
});
var DialogDescription = React27.forwardRef(function DialogDescription2({ className, ...props }, ref) {
  return /* @__PURE__ */ jsx32(
    RadixDialog.Description,
    {
      ref,
      className: cn("text-sm text-text-body", className),
      ...props
    }
  );
});
DialogOverlay.displayName = "DialogOverlay";
DialogContent.displayName = "DialogContent";
DialogTitle.displayName = "DialogTitle";
DialogDescription.displayName = "DialogDescription";

// src/overlay/ConfirmDialog.tsx
import * as React28 from "react";
import { AlertTriangle as AlertTriangle2, Info as Info2, CheckCircle2 as CheckCircle22 } from "lucide-react";
import { jsx as jsx33, jsxs as jsxs25 } from "react/jsx-runtime";
var toneIcon = {
  info: /* @__PURE__ */ jsx33(Info2, { className: "size-5 text-brand-active" }),
  warning: /* @__PURE__ */ jsx33(AlertTriangle2, { className: "size-5 text-warning-yellow-600" }),
  danger: /* @__PURE__ */ jsx33(AlertTriangle2, { className: "size-5 text-cherry-red-600" }),
  success: /* @__PURE__ */ jsx33(CheckCircle22, { className: "size-5 text-success-green-primary" })
};
var toneIconBg = {
  info: "bg-info-blue-50",
  warning: "bg-warning-yellow-50",
  danger: "bg-cherry-red-50",
  success: "bg-success-green-50"
};
var toneConfirmVariant = {
  info: "primary",
  warning: "warning",
  danger: "destructive",
  success: "success"
};
function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  tone = "info",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  size = "sm"
}) {
  const [loading, setLoading] = React28.useState(false);
  const handleConfirm = async () => {
    if (!onConfirm) {
      onOpenChange(false);
      return;
    }
    try {
      setLoading(true);
      await onConfirm();
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };
  return /* @__PURE__ */ jsx33(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs25(DialogContent, { size, children: [
    /* @__PURE__ */ jsxs25("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsx33(
        "div",
        {
          className: cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full",
            toneIconBg[tone]
          ),
          children: toneIcon[tone]
        }
      ),
      /* @__PURE__ */ jsx33("div", { className: "flex-1", children: /* @__PURE__ */ jsxs25(DialogHeader, { className: "pb-1 pr-0", children: [
        /* @__PURE__ */ jsx33(DialogTitle, { children: title }),
        description && /* @__PURE__ */ jsx33(DialogDescription, { children: description })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs25(DialogFooter, { children: [
      /* @__PURE__ */ jsx33(Button, { variant: "ghost", onClick: handleCancel, disabled: loading, children: cancelLabel }),
      /* @__PURE__ */ jsx33(
        Button,
        {
          variant: toneConfirmVariant[tone],
          onClick: handleConfirm,
          loading,
          children: confirmLabel
        }
      )
    ] })
  ] }) });
}

// src/overlay/Filter.tsx
import { ListFilter } from "lucide-react";
import { jsx as jsx34, jsxs as jsxs26 } from "react/jsx-runtime";
function Filter({
  children,
  triggerLabel = "Filter",
  trigger,
  triggerProps,
  open,
  defaultOpen,
  onOpenChange,
  align = "end",
  side = "bottom",
  sideOffset = 8,
  contentClassName
}) {
  return /* @__PURE__ */ jsxs26(Popover, { open, defaultOpen, onOpenChange, children: [
    /* @__PURE__ */ jsx34(PopoverTrigger, { asChild: true, children: trigger ?? /* @__PURE__ */ jsx34(
      Button,
      {
        variant: "secondary",
        leftIcon: /* @__PURE__ */ jsx34(ListFilter, {}),
        ...triggerProps,
        children: triggerLabel
      }
    ) }),
    /* @__PURE__ */ jsx34(
      PopoverContent,
      {
        align,
        side,
        sideOffset,
        className: cn("w-[360px] p-6", contentClassName),
        children
      }
    )
  ] });
}

// src/overlay/Tooltip.tsx
import * as React29 from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { jsx as jsx35, jsxs as jsxs27 } from "react/jsx-runtime";
var TooltipProvider = RadixTooltip.Provider;
var TooltipRoot = RadixTooltip.Root;
var TooltipTrigger = RadixTooltip.Trigger;
var TooltipPortal = RadixTooltip.Portal;
var TooltipContent = React29.forwardRef(
  function TooltipContent2({ className, sideOffset = 8, arrow = true, children, ...props }, ref) {
    return /* @__PURE__ */ jsx35(TooltipPortal, { children: /* @__PURE__ */ jsxs27(
      RadixTooltip.Content,
      {
        ref,
        sideOffset,
        className: cn(
          "z-50 max-w-xs rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-brand-foreground shadow-lg",
          "data-[state=delayed-open]:animate-in data-[state=closed]:animate-out",
          className
        ),
        ...props,
        children: [
          children,
          arrow && /* @__PURE__ */ jsx35(
            RadixTooltip.Arrow,
            {
              width: 14,
              height: 7,
              className: "fill-brand"
            }
          )
        ]
      }
    ) });
  }
);
function Tooltip({
  content,
  children,
  side = "top",
  align = "center",
  delayDuration = 200,
  open,
  defaultOpen,
  onOpenChange,
  asChild = true,
  arrow = true
}) {
  return /* @__PURE__ */ jsx35(TooltipProvider, { delayDuration, children: /* @__PURE__ */ jsxs27(
    TooltipRoot,
    {
      open,
      defaultOpen,
      onOpenChange,
      children: [
        /* @__PURE__ */ jsx35(TooltipTrigger, { asChild, children }),
        /* @__PURE__ */ jsx35(TooltipContent, { side, align, arrow, children: content })
      ]
    }
  ) });
}
TooltipContent.displayName = "TooltipContent";

// src/overlay/DropdownMenu.tsx
import * as React30 from "react";
import * as RadixMenu from "@radix-ui/react-dropdown-menu";
import { Check as Check6, ChevronRight as ChevronRight3, Circle } from "lucide-react";
import { jsx as jsx36, jsxs as jsxs28 } from "react/jsx-runtime";
var DropdownMenu = RadixMenu.Root;
var DropdownMenuTrigger = RadixMenu.Trigger;
var DropdownMenuGroup = RadixMenu.Group;
var DropdownMenuRadioGroup = RadixMenu.RadioGroup;
var DropdownMenuPortal = RadixMenu.Portal;
var DropdownMenuSub = RadixMenu.Sub;
var DropdownMenuContent = React30.forwardRef(function DropdownMenuContent2({ className, sideOffset = 4, ...props }, ref) {
  return /* @__PURE__ */ jsx36(RadixMenu.Portal, { children: /* @__PURE__ */ jsx36(
    RadixMenu.Content,
    {
      ref,
      sideOffset,
      className: cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-sm border border-border-default bg-white p-1 shadow-lg",
        className
      ),
      ...props
    }
  ) });
});
var DropdownMenuItem = React30.forwardRef(
  function DropdownMenuItem2({ className, destructive, inset, ...props }, ref) {
    return /* @__PURE__ */ jsx36(
      RadixMenu.Item,
      {
        ref,
        className: cn(
          "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
          "focus:bg-brand-subtle data-[highlighted]:bg-brand-subtle",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          destructive && "text-cherry-red-600 focus:bg-cherry-red-50 data-[highlighted]:bg-cherry-red-50",
          inset && "pl-8",
          className
        ),
        ...props
      }
    );
  }
);
var DropdownMenuCheckboxItem = React30.forwardRef(function DropdownMenuCheckboxItem2({ className, children, ...props }, ref) {
  return /* @__PURE__ */ jsxs28(
    RadixMenu.CheckboxItem,
    {
      ref,
      className: cn(
        "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
        "focus:bg-brand-subtle data-[highlighted]:bg-brand-subtle",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx36("span", { className: "absolute left-2 flex size-4 items-center justify-center", children: /* @__PURE__ */ jsx36(RadixMenu.ItemIndicator, { children: /* @__PURE__ */ jsx36(Check6, { className: "size-4" }) }) }),
        children
      ]
    }
  );
});
var DropdownMenuRadioItem = React30.forwardRef(function DropdownMenuRadioItem2({ className, children, ...props }, ref) {
  return /* @__PURE__ */ jsxs28(
    RadixMenu.RadioItem,
    {
      ref,
      className: cn(
        "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
        "focus:bg-brand-subtle data-[highlighted]:bg-brand-subtle",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx36("span", { className: "absolute left-2 flex size-4 items-center justify-center", children: /* @__PURE__ */ jsx36(RadixMenu.ItemIndicator, { children: /* @__PURE__ */ jsx36(Circle, { className: "size-2 fill-current" }) }) }),
        children
      ]
    }
  );
});
var DropdownMenuLabel = React30.forwardRef(function DropdownMenuLabel2({ className, inset, ...props }, ref) {
  return /* @__PURE__ */ jsx36(
    RadixMenu.Label,
    {
      ref,
      className: cn(
        "px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-text-tertiary",
        inset && "pl-8",
        className
      ),
      ...props
    }
  );
});
var DropdownMenuSeparator = React30.forwardRef(function DropdownMenuSeparator2({ className, ...props }, ref) {
  return /* @__PURE__ */ jsx36(
    RadixMenu.Separator,
    {
      ref,
      className: cn("-mx-1 my-1 h-px bg-border-subtle", className),
      ...props
    }
  );
});
var DropdownMenuSubTrigger = React30.forwardRef(function DropdownMenuSubTrigger2({ className, children, ...props }, ref) {
  return /* @__PURE__ */ jsxs28(
    RadixMenu.SubTrigger,
    {
      ref,
      className: cn(
        "flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
        "focus:bg-brand-subtle data-[state=open]:bg-brand-subtle",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx36(ChevronRight3, { className: "ml-auto size-4" })
      ]
    }
  );
});
var DropdownMenuSubContent = React30.forwardRef(function DropdownMenuSubContent2({ className, ...props }, ref) {
  return /* @__PURE__ */ jsx36(
    RadixMenu.SubContent,
    {
      ref,
      className: cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-sm border border-border-default bg-white p-1 shadow-lg",
        className
      ),
      ...props
    }
  );
});
DropdownMenuContent.displayName = "DropdownMenuContent";
DropdownMenuItem.displayName = "DropdownMenuItem";
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";
DropdownMenuLabel.displayName = "DropdownMenuLabel";
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

// src/schedule/ScheduleAvatar.tsx
import * as React31 from "react";

// src/schedule/types.ts
var ASSIGNMENT_COLOR_CLASSES = {
  blue: "bg-info-blue-100 text-info-blue-800",
  green: "bg-success-green-200 text-text-dark-green",
  orange: "bg-active-yellow-100 text-text-brown",
  yellow: "bg-warning-yellow-100 text-warning-yellow-800",
  red: "bg-cherry-red-200 text-cherry-red-800",
  teal: "bg-surface text-teal-500",
  gray: "bg-gray-200 text-gray-700"
};

// src/schedule/ScheduleAvatar.tsx
import { jsx as jsx37 } from "react/jsx-runtime";
var ScheduleAvatar = React31.forwardRef(
  function ScheduleAvatar2({ color, label, className, ...props }, ref) {
    return /* @__PURE__ */ jsx37(
      Avatar,
      {
        ref,
        fallback: label,
        className: cn(ASSIGNMENT_COLOR_CLASSES[color], className),
        ...props
      }
    );
  }
);
ScheduleAvatar.displayName = "ScheduleAvatar";

// src/schedule/StatusBadge.tsx
import * as React32 from "react";
import { cva as cva8 } from "class-variance-authority";
import { jsx as jsx38, jsxs as jsxs29 } from "react/jsx-runtime";
var statusBadgeVariants = cva8(
  "inline-flex items-center gap-1.5 rounded-full font-medium",
  {
    variants: {
      tone: {
        neutral: "bg-nuetral-light-50 text-text-secondary",
        success: "bg-success-green-50 text-success-green-800",
        warning: "bg-warning-yellow-50 text-warning-yellow-800",
        danger: "bg-cherry-red-50 text-cherry-red-800",
        info: "bg-info-blue-50 text-info-blue-800"
      },
      size: {
        sm: "h-6 px-2.5 text-xs",
        md: "h-7 px-3 text-sm"
      }
    },
    defaultVariants: { tone: "neutral", size: "sm" }
  }
);
var StatusBadge = React32.forwardRef(
  function StatusBadge2({ className, tone, size, hideDot, children, ...props }, ref) {
    return /* @__PURE__ */ jsxs29(
      "span",
      {
        ref,
        className: cn(statusBadgeVariants({ tone, size }), className),
        ...props,
        children: [
          !hideDot && /* @__PURE__ */ jsx38(
            "span",
            {
              "aria-hidden": "true",
              className: "size-1.5 shrink-0 rounded-full bg-current"
            }
          ),
          children
        ]
      }
    );
  }
);
StatusBadge.displayName = "StatusBadge";

// src/schedule/DateNavigator.tsx
import * as React33 from "react";
import { ChevronLeft as ChevronLeft3, ChevronRight as ChevronRight4 } from "lucide-react";
import { cva as cva9 } from "class-variance-authority";
import { jsx as jsx39, jsxs as jsxs30 } from "react/jsx-runtime";
var dateNavigatorVariants = cva9(
  "inline-flex items-center justify-between rounded-lg border border-border-default bg-white",
  {
    variants: {
      size: {
        sm: "h-9 gap-1 px-1",
        md: "h-11 gap-2 px-1.5"
      }
    },
    defaultVariants: { size: "md" }
  }
);
function startOfUnit(date, unit) {
  return unit === "month" ? new Date(date.getFullYear(), date.getMonth(), 1) : new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
function addUnit(date, unit, amount) {
  return unit === "month" ? new Date(date.getFullYear(), date.getMonth() + amount, 1) : new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}
var DateNavigator = React33.forwardRef(
  function DateNavigator2({
    className,
    size,
    value,
    onChange,
    unit = "month",
    locale = "th-TH",
    minDate,
    maxDate,
    label,
    onPrev,
    onNext,
    prevDisabled,
    nextDisabled,
    prevLabel = "\u0E01\u0E48\u0E2D\u0E19\u0E2B\u0E19\u0E49\u0E32",
    nextLabel = "\u0E16\u0E31\u0E14\u0E44\u0E1B",
    ...props
  }, ref) {
    const formatter = React33.useMemo(
      () => new Intl.DateTimeFormat(
        locale,
        unit === "month" ? { month: "long", year: "numeric" } : { weekday: "long", day: "numeric", month: "long" }
      ),
      [locale, unit]
    );
    const current = value ? startOfUnit(value, unit) : void 0;
    const displayLabel = label ?? (current ? formatter.format(current) : "");
    const canStep = (amount) => {
      if (!current) return true;
      const target = addUnit(current, unit, amount);
      if (amount < 0 && minDate && target < startOfUnit(minDate, unit)) {
        return false;
      }
      if (amount > 0 && maxDate && target > startOfUnit(maxDate, unit)) {
        return false;
      }
      return true;
    };
    const step = (amount) => {
      if (current && onChange) onChange(addUnit(current, unit, amount));
      (amount < 0 ? onPrev : onNext)?.();
    };
    const isPrevDisabled = prevDisabled ?? !canStep(-1);
    const isNextDisabled = nextDisabled ?? !canStep(1);
    const arrowClass = "flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4";
    return /* @__PURE__ */ jsxs30(
      "div",
      {
        ref,
        className: cn(dateNavigatorVariants({ size }), className),
        ...props,
        children: [
          /* @__PURE__ */ jsx39(
            "button",
            {
              type: "button",
              "aria-label": prevLabel,
              disabled: isPrevDisabled,
              onClick: () => step(-1),
              className: arrowClass,
              children: /* @__PURE__ */ jsx39(ChevronLeft3, {})
            }
          ),
          /* @__PURE__ */ jsx39("span", { className: "min-w-28 text-center text-sm font-semibold text-text-primary", children: displayLabel }),
          /* @__PURE__ */ jsx39(
            "button",
            {
              type: "button",
              "aria-label": nextLabel,
              disabled: isNextDisabled,
              onClick: () => step(1),
              className: arrowClass,
              children: /* @__PURE__ */ jsx39(ChevronRight4, {})
            }
          )
        ]
      }
    );
  }
);
DateNavigator.displayName = "DateNavigator";

// src/schedule/AssignmentChip.tsx
import * as React34 from "react";
import { jsx as jsx40, jsxs as jsxs31 } from "react/jsx-runtime";
var AssignmentChip = React34.forwardRef(
  function AssignmentChip2({ slot, hideOrder, onClick, className, disabled, ...props }, ref) {
    const interactive = Boolean(onClick) && !disabled;
    const Comp = interactive ? "button" : "div";
    return /* @__PURE__ */ jsxs31(
      Comp,
      {
        ref,
        ...interactive ? { type: "button", onClick: () => onClick?.(slot) } : {},
        className: cn(
          "flex w-full items-center gap-2 rounded-lg border border-border-default bg-gray-50 px-2 py-1.5 text-left text-sm text-text-primary transition-colors",
          interactive && "cursor-pointer hover:border-success-green-600 hover:bg-success-green-600/20",
          className
        ),
        ...props,
        children: [
          !hideOrder && /* @__PURE__ */ jsx40("span", { className: "flex size-5 shrink-0 items-center justify-center rounded-md bg-success-green-600 text-xs font-bold text-brand-foreground", children: slot.order }),
          /* @__PURE__ */ jsx40(
            ScheduleAvatar,
            {
              size: "xs",
              color: slot.color,
              name: slot.name,
              label: slot.avatarLabel,
              src: slot.src
            }
          ),
          /* @__PURE__ */ jsx40("span", { className: "truncate font-medium", children: slot.name })
        ]
      }
    );
  }
);
AssignmentChip.displayName = "AssignmentChip";

// src/schedule/AddSlotButton.tsx
import * as React35 from "react";
import { Plus as Plus2 } from "lucide-react";
import { jsx as jsx41, jsxs as jsxs32 } from "react/jsx-runtime";
var AddSlotButton = React35.forwardRef(
  function AddSlotButton2({ className, label = "\u0E40\u0E1E\u0E34\u0E48\u0E21", icon, ...props }, ref) {
    return /* @__PURE__ */ jsxs32(
      "button",
      {
        ref,
        type: "button",
        className: cn(
          "flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dashed border-border-strong px-2 py-1.5 text-sm text-text-tertiary transition-colors hover:border-success-green-600 hover:bg-success-green-600/20 hover:text-success-green-600 disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4",
          className
        ),
        ...props,
        children: [
          icon ?? /* @__PURE__ */ jsx41(Plus2, {}),
          label
        ]
      }
    );
  }
);
AddSlotButton.displayName = "AddSlotButton";

// src/schedule/ShiftTable.tsx
import * as React36 from "react";
import { Pencil } from "lucide-react";
import { isToday as dateFnsIsToday, parseISO } from "date-fns";
import { Fragment as Fragment7, jsx as jsx42, jsxs as jsxs33 } from "react/jsx-runtime";
var ShiftTable = React36.forwardRef(
  function ShiftTable2({
    className,
    columns,
    days,
    onSlotClick,
    onAddSlot,
    onEditColumn,
    addLabel = "\u0E40\u0E1E\u0E34\u0E48\u0E21",
    dayColumnLabel = "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48",
    stickyHeader = true,
    maxHeight,
    minColumnWidth = 220,
    style,
    ...props
  }, ref) {
    const gridTemplateColumns = `88px repeat(${Math.max(columns.length, 1)}, minmax(${minColumnWidth}px, 1fr))`;
    const innerContent = /* @__PURE__ */ jsxs33(Fragment7, { children: [
      /* @__PURE__ */ jsxs33(
        "div",
        {
          role: "row",
          className: cn(
            "grid bg-gray-50 border-b border-border-default",
            stickyHeader && "sticky top-0 z-10"
          ),
          style: { gridTemplateColumns },
          children: [
            /* @__PURE__ */ jsx42(
              "div",
              {
                role: "columnheader",
                className: "sticky left-0 z-10 flex items-center justify-center border-r border-border-default bg-gray-50 px-2 py-3 text-sm font-semibold text-text-secondary",
                children: dayColumnLabel
              }
            ),
            columns.map((column) => /* @__PURE__ */ jsx42(
              "div",
              {
                role: "columnheader",
                className: "border-l border-border-default px-3 py-2",
                children: /* @__PURE__ */ jsxs33("div", { className: "flex items-start justify-between gap-2", children: [
                  /* @__PURE__ */ jsxs33("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsx42("div", { className: "truncate text-sm font-semibold text-text-primary", children: column.name }),
                    /* @__PURE__ */ jsxs33("div", { className: "text-xs text-text-tertiary", children: [
                      column.timeRange,
                      " \xB7 ",
                      column.slotCount,
                      " \u0E25\u0E33\u0E14\u0E31\u0E1A"
                    ] })
                  ] }),
                  onEditColumn && /* @__PURE__ */ jsx42(
                    "button",
                    {
                      type: "button",
                      "aria-label": `\u0E41\u0E01\u0E49\u0E44\u0E02 ${column.name}`,
                      onClick: () => onEditColumn(column.id),
                      className: "shrink-0 cursor-pointer rounded-md p-1 text-text-tertiary transition-colors hover:bg-success-green-600/20 hover:text-success-green-600 [&_svg]:size-3.5",
                      children: /* @__PURE__ */ jsx42(Pencil, {})
                    }
                  )
                ] })
              },
              column.id
            ))
          ]
        }
      ),
      days.map((day) => {
        const today = day.isToday ?? dateFnsIsToday(parseISO(day.id));
        return /* @__PURE__ */ jsxs33(
          "div",
          {
            role: "row",
            "data-today": today || void 0,
            "data-weekend": day.isWeekend || void 0,
            className: "relative z-0 grid border-b border-border-default last:border-b-0 data-[weekend=true]:bg-gray-50",
            style: { gridTemplateColumns },
            children: [
              /* @__PURE__ */ jsxs33(
                "div",
                {
                  role: "rowheader",
                  className: cn(
                    // sticky left-0: ตรึงคอลัมน์วันที่ไว้ขณะเลื่อนแนวนอน (frozen column)
                    // bg ต้องทึบเพื่อให้เนื้อหาคอลัมน์กะเลื่อนลอดใต้ได้สะอาด
                    "sticky left-0 z-[1] flex flex-col items-center justify-center gap-0.5 border-r border-border-default px-2 py-3",
                    day.isWeekend ? "bg-gray-50" : "bg-white",
                    today && "bg-success-green-50"
                  ),
                  children: [
                    /* @__PURE__ */ jsx42(
                      "span",
                      {
                        className: cn(
                          "text-lg font-bold",
                          today ? "text-success-green-main" : "text-text-primary"
                        ),
                        children: day.dayNumber
                      }
                    ),
                    /* @__PURE__ */ jsx42("span", { className: cn("text-xs text-text-tertiary", today && "text-success-green-600"), children: day.weekdayLabel })
                  ]
                }
              ),
              columns.map((column) => {
                const filled = day.slots[column.id] ?? [];
                const emptyCount = Math.max(column.slotCount - filled.length, 0);
                return /* @__PURE__ */ jsxs33(
                  "div",
                  {
                    role: "gridcell",
                    className: cn(
                      "flex flex-col gap-1.5 border-l border-border-default p-2"
                    ),
                    children: [
                      filled.map((slot) => /* @__PURE__ */ jsx42(
                        AssignmentChip,
                        {
                          slot,
                          onClick: onSlotClick ? (clicked) => onSlotClick(day.id, column.id, clicked) : void 0
                        },
                        slot.id
                      )),
                      onAddSlot && Array.from({ length: emptyCount }, (_, index) => {
                        const order = filled.length + index + 1;
                        return /* @__PURE__ */ jsx42(
                          AddSlotButton,
                          {
                            label: addLabel,
                            onClick: () => onAddSlot(day.id, column.id, order)
                          },
                          `add-slot-${order}`
                        );
                      })
                    ]
                  },
                  column.id
                );
              })
            ]
          },
          day.id
        );
      })
    ] });
    return (
      // Scroll container เดียวรับทั้ง 2 แกน — sticky header (top) + sticky วันที่ (left)
      // ทำงานเทียบ container นี้ตัวเดียว เป็น pattern มาตรฐานของตารางตรึงหัว+คอลัมน์แรก
      /* @__PURE__ */ jsx42(
        "div",
        {
          ref,
          role: "grid",
          "aria-label": props["aria-label"] ?? "\u0E15\u0E32\u0E23\u0E32\u0E07\u0E01\u0E30",
          className: cn(
            "overflow-auto rounded-xl border border-border-default bg-white",
            className
          ),
          style: { maxHeight, ...style },
          ...props,
          children: /* @__PURE__ */ jsx42("div", { className: "w-max min-w-full", children: innerContent })
        }
      )
    );
  }
);
ShiftTable.displayName = "ShiftTable";

// src/schedule/TimeGrid.tsx
import * as React37 from "react";
import { Clock as Clock2, DoorOpen, FileText, Pencil as Pencil2, UserPlus } from "lucide-react";

// src/schedule/time-grid-utils.ts
function parseTimeToMinutes(time) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) return NaN;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return NaN;
  return hours * 60 + minutes;
}
var MIN_RENDER_MINUTES = 15;
function computeEventLayouts(events, windowStart, windowEnd, pixelsPerMinute) {
  const winStart = parseTimeToMinutes(windowStart);
  const winEnd = parseTimeToMinutes(windowEnd);
  if (Number.isNaN(winStart) || Number.isNaN(winEnd) || winEnd <= winStart) {
    return [];
  }
  const valid = [];
  for (const event of events) {
    let startMin = parseTimeToMinutes(event.start);
    let endMin = parseTimeToMinutes(event.end);
    if (Number.isNaN(startMin) || Number.isNaN(endMin)) continue;
    if (endMin <= startMin) endMin = startMin + MIN_RENDER_MINUTES;
    if (endMin <= winStart || startMin >= winEnd) continue;
    startMin = Math.max(startMin, winStart);
    endMin = Math.min(endMin, winEnd);
    valid.push({ ...event, startMin, endMin, column: 0 });
  }
  valid.sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin);
  const layouts = [];
  let cluster = [];
  let clusterEnd = -1;
  const flushCluster = () => {
    if (cluster.length === 0) return;
    const totalColumns = Math.max(...cluster.map((event) => event.column)) + 1;
    for (const event of cluster) {
      layouts.push({
        id: event.id,
        top: (event.startMin - winStart) * pixelsPerMinute,
        height: Math.max(
          (event.endMin - event.startMin) * pixelsPerMinute,
          MIN_RENDER_MINUTES * pixelsPerMinute
        ),
        left: `${event.column * 100 / totalColumns}%`,
        width: `${100 / totalColumns}%`,
        column: event.column,
        totalColumns
      });
    }
    cluster = [];
  };
  for (const event of valid) {
    if (cluster.length > 0 && event.startMin >= clusterEnd) {
      flushCluster();
      clusterEnd = -1;
    }
    const used = new Set(
      cluster.filter((other) => other.endMin > event.startMin).map((other) => other.column)
    );
    let column = 0;
    while (used.has(column)) column += 1;
    event.column = column;
    cluster.push(event);
    clusterEnd = Math.max(clusterEnd, event.endMin);
  }
  flushCluster();
  return layouts;
}
function computeFreeGaps(events, windowStart, windowEnd, pixelsPerMinute, minMinutes = 30) {
  const winStart = parseTimeToMinutes(windowStart);
  const winEnd = parseTimeToMinutes(windowEnd);
  if (Number.isNaN(winStart) || Number.isNaN(winEnd) || winEnd <= winStart) {
    return [];
  }
  const intervals = events.map((event) => ({
    start: Math.max(parseTimeToMinutes(event.start), winStart),
    end: Math.min(parseTimeToMinutes(event.end), winEnd)
  })).filter(
    (interval) => !Number.isNaN(interval.start) && !Number.isNaN(interval.end) && interval.end > interval.start
  ).sort((a, b) => a.start - b.start);
  const gaps = [];
  let cursor = winStart;
  for (const interval of intervals) {
    if (interval.start - cursor >= minMinutes) {
      gaps.push({
        top: (cursor - winStart) * pixelsPerMinute,
        height: (interval.start - cursor) * pixelsPerMinute,
        startMinutes: cursor
      });
    }
    cursor = Math.max(cursor, interval.end);
  }
  if (winEnd - cursor >= minMinutes) {
    gaps.push({
      top: (cursor - winStart) * pixelsPerMinute,
      height: (winEnd - cursor) * pixelsPerMinute,
      startMinutes: cursor
    });
  }
  return gaps;
}

// src/schedule/TimeGrid.tsx
import { Fragment as Fragment8, jsx as jsx43, jsxs as jsxs34 } from "react/jsx-runtime";
function formatTick(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
var TimeGrid = React37.forwardRef(
  function TimeGrid2({
    className,
    rooms,
    events,
    windowStart,
    windowEnd,
    tickMinutes = 30,
    pixelsPerMinute = 2,
    onEventClick,
    onEditRoom,
    onAddEvent,
    addLabel = "\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E41\u0E1E\u0E17\u0E22\u0E4C\u0E40\u0E27\u0E23",
    stickyHeader = true,
    maxHeight,
    minColumnWidth = 240,
    style,
    ...props
  }, ref) {
    const winStart = parseTimeToMinutes(windowStart);
    const winEnd = parseTimeToMinutes(windowEnd);
    const isValidWindow = !Number.isNaN(winStart) && !Number.isNaN(winEnd) && winEnd > winStart;
    const ticks = React37.useMemo(() => {
      if (!isValidWindow) return [];
      const result = [];
      for (let t = winStart; t <= winEnd; t += tickMinutes) result.push(t);
      return result;
    }, [isValidWindow, winStart, winEnd, tickMinutes]);
    const eventsByRoom = React37.useMemo(() => {
      const map = /* @__PURE__ */ new Map();
      for (const event of events) {
        const list = map.get(event.roomId);
        if (list) list.push(event);
        else map.set(event.roomId, [event]);
      }
      return map;
    }, [events]);
    if (!isValidWindow) return null;
    const bodyHeight = (winEnd - winStart) * pixelsPerMinute;
    const gridTemplateColumns = `64px repeat(${Math.max(rooms.length, 1)}, minmax(${minColumnWidth}px, 1fr))`;
    const innerContent = /* @__PURE__ */ jsxs34(Fragment8, { children: [
      /* @__PURE__ */ jsxs34(
        "div",
        {
          role: "row",
          className: cn(
            "grid bg-gray-50 border-b border-border-default",
            stickyHeader && "sticky top-0 z-20"
          ),
          style: { gridTemplateColumns },
          children: [
            /* @__PURE__ */ jsx43(
              "div",
              {
                role: "columnheader",
                "aria-label": "\u0E40\u0E27\u0E25\u0E32",
                className: "sticky left-0 z-10 flex items-center justify-center border-r border-border-default bg-gray-50 py-3 text-text-tertiary [&_svg]:size-4",
                children: /* @__PURE__ */ jsx43(Clock2, {})
              }
            ),
            rooms.map((room) => /* @__PURE__ */ jsxs34(
              "div",
              {
                role: "columnheader",
                className: "flex items-center justify-between gap-2 border-l border-border-default px-3 py-3",
                children: [
                  /* @__PURE__ */ jsxs34("div", { className: "flex min-w-0 items-center gap-2 text-sm font-semibold text-text-primary", children: [
                    /* @__PURE__ */ jsx43("span", { className: "shrink-0 text-text-tertiary [&_svg]:size-4", children: room.icon ?? /* @__PURE__ */ jsx43(DoorOpen, { className: "text-success-green-600" }) }),
                    /* @__PURE__ */ jsx43("span", { className: "truncate", children: room.name })
                  ] }),
                  onEditRoom && /* @__PURE__ */ jsx43(
                    "button",
                    {
                      type: "button",
                      "aria-label": `\u0E41\u0E01\u0E49\u0E44\u0E02 ${room.name}`,
                      onClick: () => onEditRoom(room.id),
                      className: "shrink-0 cursor-pointer rounded-md p-1 text-text-tertiary transition-colors hover:bg-success-green-600/20 hover:text-success-green-600 [&_svg]:size-3.5",
                      children: /* @__PURE__ */ jsx43(Pencil2, {})
                    }
                  )
                ]
              },
              room.id
            ))
          ]
        }
      ),
      /* @__PURE__ */ jsxs34("div", { className: "relative z-0 grid", style: { gridTemplateColumns }, children: [
        /* @__PURE__ */ jsx43("div", { className: "sticky left-0 z-[1] border-r border-border-default bg-white py-5", children: /* @__PURE__ */ jsx43("div", { className: "relative", style: { height: bodyHeight }, children: ticks.map((tick) => {
          const isHour = tick % 60 === 0;
          const labelOffset = tick === winStart ? 0 : tick === winEnd ? 16 : 8;
          return /* @__PURE__ */ jsx43(
            "span",
            {
              className: cn(
                "absolute right-2 block h-4 text-xs leading-4",
                isHour ? "font-semibold text-text-primary" : "text-text-tertiary"
              ),
              style: {
                top: (tick - winStart) * pixelsPerMinute - labelOffset
              },
              children: formatTick(tick)
            },
            tick
          );
        }) }) }),
        rooms.map((room) => {
          const roomEvents = eventsByRoom.get(room.id) ?? [];
          const layouts = computeEventLayouts(
            roomEvents,
            windowStart,
            windowEnd,
            pixelsPerMinute
          );
          const layoutById = new Map(layouts.map((l) => [l.id, l]));
          const gaps = onAddEvent ? computeFreeGaps(
            roomEvents,
            windowStart,
            windowEnd,
            pixelsPerMinute,
            tickMinutes
          ) : [];
          return /* @__PURE__ */ jsx43(
            "div",
            {
              role: "gridcell",
              className: "border-l border-border-default py-5",
              children: /* @__PURE__ */ jsxs34("div", { className: "relative", style: { height: bodyHeight }, children: [
                ticks.slice(1, -1).map((tick) => /* @__PURE__ */ jsx43(
                  "div",
                  {
                    "aria-hidden": "true",
                    className: cn(
                      "absolute inset-x-0 border-t",
                      tick % 60 === 0 ? "border-border-default" : "border-border-subtle"
                    ),
                    style: { top: (tick - winStart) * pixelsPerMinute }
                  },
                  tick
                )),
                gaps.map((gap) => /* @__PURE__ */ jsxs34(
                  "button",
                  {
                    type: "button",
                    onClick: () => onAddEvent?.(room.id, gap.startMinutes),
                    className: "absolute inset-x-1.5 flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dashed border-border-strong text-sm text-text-tertiary transition-colors hover:border-success-green-600 hover:bg-success-green-600/20 hover:text-success-green-600 [&_svg]:size-4",
                    style: {
                      top: gap.top + 4,
                      height: Math.min(gap.height - 8, 50)
                    },
                    children: [
                      /* @__PURE__ */ jsx43(UserPlus, {}),
                      addLabel
                    ]
                  },
                  gap.startMinutes
                )),
                roomEvents.map((event) => {
                  const layout = layoutById.get(event.id);
                  if (!layout) return null;
                  const interactive = Boolean(onEventClick);
                  return /* @__PURE__ */ jsxs34(
                    "div",
                    {
                      role: interactive ? "button" : void 0,
                      tabIndex: interactive ? 0 : void 0,
                      onClick: interactive ? () => onEventClick?.(event) : void 0,
                      onKeyDown: interactive ? (keyEvent) => {
                        if (keyEvent.key === "Enter" || keyEvent.key === " ") {
                          keyEvent.preventDefault();
                          onEventClick?.(event);
                        }
                      } : void 0,
                      className: cn(
                        "absolute overflow-hidden rounded-lg border border-success-green-primary bg-success-green-50 p-2",
                        interactive && "cursor-pointer transition-shadow hover:shadow-card focus-visible:ring-2"
                      ),
                      style: {
                        top: layout.top + 2,
                        height: layout.height - 4,
                        left: `calc(${layout.left} + 4px)`,
                        width: `calc(${layout.width} - 8px)`
                      },
                      children: [
                        /* @__PURE__ */ jsxs34("div", { className: "flex items-center gap-1.5 text-sm font-semibold text-text-primary", children: [
                          /* @__PURE__ */ jsx43(
                            ScheduleAvatar,
                            {
                              size: "xs",
                              color: event.color,
                              name: event.name,
                              label: event.avatarLabel,
                              src: event.src
                            }
                          ),
                          /* @__PURE__ */ jsx43("span", { className: "truncate", children: event.name })
                        ] }),
                        event.note && /* @__PURE__ */ jsxs34("div", { className: "mt-1 ml-7 flex items-center gap-1 text-xs text-text-secondary [&_svg]:size-3", children: [
                          /* @__PURE__ */ jsx43(FileText, {}),
                          /* @__PURE__ */ jsx43("span", { className: "truncate", children: event.note })
                        ] }),
                        /* @__PURE__ */ jsxs34("div", { className: "mt-1 ml-7 flex items-center gap-1 text-xs text-text-secondary [&_svg]:size-3", children: [
                          /* @__PURE__ */ jsx43(Clock2, {}),
                          event.timeLabel ?? `${event.start} \u2013 ${event.end}`
                        ] })
                      ]
                    },
                    event.id
                  );
                })
              ] })
            },
            room.id
          );
        })
      ] })
    ] });
    return (
      // Scroll container เดียวรับทั้ง 2 แกน — sticky header (top) + sticky แกนเวลา (left)
      // ทำงานเทียบ container นี้ตัวเดียว เป็น pattern มาตรฐานของตารางตรึงหัว+คอลัมน์แรก
      /* @__PURE__ */ jsx43(
        "div",
        {
          ref,
          role: "grid",
          "aria-label": props["aria-label"] ?? "\u0E15\u0E32\u0E23\u0E32\u0E07\u0E2B\u0E49\u0E2D\u0E07\u0E15\u0E23\u0E27\u0E08",
          className: cn(
            "overflow-auto rounded-xl border border-border-default bg-white",
            className
          ),
          style: { maxHeight, ...style },
          ...props,
          children: /* @__PURE__ */ jsx43("div", { className: "w-max min-w-full", children: innerContent })
        }
      )
    );
  }
);
TimeGrid.displayName = "TimeGrid";
export {
  ASSIGNMENT_COLOR_CLASSES,
  AddButton,
  AddSlotButton,
  AppLauncher,
  AssignmentChip,
  Avatar,
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbRoot,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Chip,
  ComboBox,
  ConfirmDialog,
  DataTable,
  DateNavigator,
  DatePicker,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  EmptyState,
  Filter,
  FormField,
  Input,
  LoadingScreen,
  MultiAutocomplete,
  NotificationBell,
  OutlineButton,
  Popover,
  PopoverAnchor,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
  RadioGroup,
  RadioGroupItem,
  ScheduleAvatar,
  Select,
  SelectItem,
  ShiftTable,
  Sidebar,
  SidebarGroup,
  SidebarItem,
  Skeleton,
  SolidButton,
  Spinner2 as Spinner,
  StatusBadge,
  Stepper,
  Switch,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  TimeGrid,
  TimePicker,
  Toaster,
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TopNav,
  TopNavBrand,
  TopNavSpacer,
  UserMenu,
  avatarVariants,
  buttonVariants,
  chipVariants,
  cn,
  computeEventLayouts,
  computeFreeGaps,
  outlineButtonVariants,
  parseTimeToMinutes,
  solidButtonVariants,
  statusBadgeVariants,
  toast
};
//# sourceMappingURL=index.js.map