import {
  TYPE_SCALE,
  TYPE_SCALE_DEFAULT_WEIGHT
} from "./chunk-55J7CLWB.js";

// src/ui/Button.tsx
import * as React2 from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

// src/lib/cn.ts
import { clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
var twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: Object.keys(TYPE_SCALE) }]
    }
  }
});
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// src/feedback/Skeleton.tsx
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var Skeleton = React.forwardRef(
  function Skeleton2({ className, shape = "rect", style, ...props }, ref) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        ref,
        "aria-hidden": "true",
        className: cn(
          "animate-pulse bg-bg-skeleton",
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
var SkeletonBox = React.forwardRef(
  function SkeletonBox2({ shape, className, label = "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14", children, ...props }, ref) {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ref,
        role: "status",
        "aria-busy": "true",
        "data-slot": "skeleton-box",
        className: cn(
          shape,
          /* ลบทุกอย่างที่เป็น "เนื้อหา" เหลือแต่กรอบ — เรียงหลัง shape เพื่อให้ชนะ
           * ⚠️ `border-transparent` ไม่ใช่ `border-0` — ตัวหลังลบ *ความกว้าง* ของเส้นขอบ
           * ทำให้ variant ที่มีขอบ (เช่น secondary) แคบกว่าของจริง 2px */
          "pointer-events-none animate-pulse border-transparent bg-bg-skeleton text-transparent shadow-none select-none",
          className
        ),
        ...props,
        children: [
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: label }),
          children != null && /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "invisible contents", children })
        ]
      }
    );
  }
);
SkeletonBox.displayName = "SkeletonBox";

// src/ui/Button.tsx
import { Fragment, jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var buttonVariants = cva(
  // `rounded-md` ยังตรงกับ SolidButton / OutlineButton / AddButton เหมือนเดิม — ปุ่มทุกตัวใน DS
  // ใช้รัศมีมุมเดียวกัน (ข้อสรุปเดิมจาก main ยังอยู่ครบ ไม่ได้ถูกกลืนตอน merge)
  // `shrink-0` — ให้เท่ากับพี่น้องอีก 3 ตัวในโฟลเดอร์เดียวกัน (SolidButton · OutlineButton ·
  // IconButton มีอยู่แล้ว) ปุ่มที่อยู่ในแถว flex ไม่ควรถูกบีบจนข้อความหาย
  // `ring-focus-ring/50` — เดิมเขียน `ring-2` เฉย ๆ ไม่ระบุสี ⇒ Tailwind ใช้ `currentcolor`
  // แปลว่าบนปุ่มพื้นทึบที่ตัวอักษรเป็นสีขาว วงแหวนก็ขาวไปด้วย = โฟกัสคีย์บอร์ดหายทั้งใบ
  "inline-flex shrink-0 items-center justify-center gap-1 whitespace-nowrap text-body-sm font-medium transition-all rounded-md cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/50 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-40 [&_svg]:shrink-0 [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-brand text-brand-foreground shadow-xs hover:bg-brand-hover",
        secondary: "border border-brand text-brand bg-bg-default shadow-xs hover:bg-brand-subtle",
        ghost: "bg-transparent shadow-none hover:bg-bg-subtle",
        /** ฟ้ากลาง ไม่ใช่สีแบรนด์ — 20 จุดในแอปจริงเรียก variant ชื่อนี้ */
        info: "bg-info-blue-primary text-white shadow-sm hover:bg-info-blue-primary-hover",
        destructive: "bg-cherry-red-600 text-white shadow-xs hover:bg-cherry-red-800",
        success: "bg-success-green-primary text-white shadow-sm hover:bg-success-green-primary-hover",
        warning: "bg-warning-normal text-white shadow-sm hover:bg-warning-hover"
      },
      /** คุมความสูงกับขนาดไอคอนเท่านั้น — padding เท่ากันทุกขนาดตามของจริง */
      size: {
        xs: "h-7 px-3 py-2 [&_svg:not([class*='size-'])]:size-4",
        sm: "h-8 px-3 py-2 [&_svg:not([class*='size-'])]:size-4",
        md: "h-9 px-3 py-2 [&_svg:not([class*='size-'])]:size-4",
        lg: "h-11 px-3 py-2 [&_svg:not([class*='size-'])]:size-5",
        xl: "h-12 px-3 py-2 [&_svg:not([class*='size-'])]:size-6"
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
var Spinner = () => /* @__PURE__ */ jsxs2(
  "svg",
  {
    className: "size-4 animate-spin",
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": "true",
    children: [
      /* @__PURE__ */ jsx2(
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
      /* @__PURE__ */ jsx2(
        "path",
        {
          fill: "currentColor",
          d: "M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
        }
      )
    ]
  }
);
var Button = React2.forwardRef(
  ({
    className,
    variant,
    size,
    fullWidth,
    asChild = false,
    loading = false,
    isLoading = false,
    disabled,
    leftIcon,
    rightIcon,
    children,
    ...props
  }, ref) => {
    const isDisabled = disabled || loading;
    if (isLoading) {
      return /* @__PURE__ */ jsxs2(
        SkeletonBox,
        {
          shape: cn(buttonVariants({ variant, size, fullWidth, className })),
          children: [
            leftIcon,
            children,
            rightIcon
          ]
        }
      );
    }
    const slot = (node, side) => /* @__PURE__ */ jsx2(
      "span",
      {
        "aria-hidden": "true",
        "data-slot": `button-icon-${side}`,
        className: "inline-flex shrink-0 items-center",
        children: node
      }
    );
    const content = /* @__PURE__ */ jsxs2(Fragment, { children: [
      loading ? /* @__PURE__ */ jsx2(Spinner, {}) : leftIcon ? slot(leftIcon, "left") : null,
      children,
      !loading && rightIcon ? slot(rightIcon, "right") : null
    ] });
    const shared = {
      "data-slot": "button",
      "data-loading": loading || void 0,
      className: cn(buttonVariants({ variant, size, fullWidth, className })),
      "aria-busy": loading || void 0,
      ...props
    };
    if (asChild) {
      const child = React2.isValidElement(children) ? children : null;
      return /* @__PURE__ */ jsx2(Slot, { ref, ...shared, children: child ? React2.cloneElement(
        child,
        void 0,
        /* @__PURE__ */ jsxs2(Fragment, { children: [
          loading ? /* @__PURE__ */ jsx2(Spinner, {}) : leftIcon ? slot(leftIcon, "left") : null,
          child.props.children,
          !loading && rightIcon ? slot(rightIcon, "right") : null
        ] })
      ) : /* @__PURE__ */ jsx2("span", { className: "inline-flex items-center gap-1", children: content }) });
    }
    return /* @__PURE__ */ jsx2("button", { ref, disabled: isDisabled, ...shared, children: content });
  }
);
Button.displayName = "Button";

// src/ui/AddButton.tsx
import * as React4 from "react";
import { Slot as Slot3 } from "@radix-ui/react-slot";
import { Plus } from "lucide-react";

// src/ui/SolidButton.tsx
import * as React3 from "react";
import { Slot as Slot2 } from "@radix-ui/react-slot";
import { cva as cva2 } from "class-variance-authority";
import { jsx as jsx3 } from "react/jsx-runtime";
var solidButtonVariants = cva2(
  "cursor-pointer inline-flex shrink-0 items-center justify-center gap-1 whitespace-nowrap px-3 py-2 text-body-sm font-medium leading-6 tracking-normal text-slate-50 transition-all outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/50 focus-visible:ring-offset-1 disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-30 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      // rounded-md on every variant. `success` and `primary` used to be rounded-sm, so a screen that
      // mixed variants — or mixed SolidButton with AddButton/OutlineButton — showed two different
      // corner radii on buttons of the same kind.
      variant: {
        info: "rounded-md bg-brand-active shadow-sm hover:bg-brand-active-hover disabled:hover:bg-brand-active",
        warning: "rounded-md bg-warning-normal shadow-md hover:bg-warning-hover disabled:hover:bg-warning-normal",
        success: "rounded-md bg-success-green-primary shadow-sm hover:bg-success-green-primary-hover disabled:hover:bg-success-green-primary",
        primary: "rounded-md bg-brand shadow-xs hover:bg-brand-hover disabled:hover:bg-brand"
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
var SolidButton = React3.forwardRef(
  ({ className, variant, size, asChild = false, label, children, ...props }, ref) => {
    const Comp = asChild ? Slot2 : "button";
    return /* @__PURE__ */ jsx3(
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
import { Fragment as Fragment2, jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
var AddButton = React4.forwardRef(
  ({ className, variant, size, asChild = false, label, children, ...props }, ref) => {
    const Comp = asChild ? Slot3 : "button";
    return /* @__PURE__ */ jsx4(
      Comp,
      {
        ref,
        "data-slot": "button",
        className: cn(solidButtonVariants({ variant, size, className })),
        ...props,
        children: asChild ? children : /* @__PURE__ */ jsxs3(Fragment2, { children: [
          /* @__PURE__ */ jsx4(Plus, { className: "size-4", "aria-hidden": "true" }),
          children ?? label
        ] })
      }
    );
  }
);
AddButton.displayName = "AddButton";

// src/ui/OutlineButton.tsx
import * as React5 from "react";
import { Slot as Slot4 } from "@radix-ui/react-slot";
import { cva as cva3 } from "class-variance-authority";
import { jsx as jsx5 } from "react/jsx-runtime";
var outlineButtonVariants = cva3(
  "cursor-pointer inline-flex shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-md border bg-white px-3 py-2 text-body-sm font-medium leading-6 tracking-normal shadow-xs transition-all outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/50 focus-visible:ring-offset-1 disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white [&_svg]:pointer-events-none [&_svg]:shrink-0",
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
var OutlineButton = React5.forwardRef(
  ({ className, variant, size, asChild = false, label, children, ...props }, ref) => {
    const Comp = asChild ? Slot4 : "button";
    return /* @__PURE__ */ jsx5(
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

// src/ui/FormatInput.tsx
import {
  NumberFormatBase,
  NumericFormat,
  PatternFormat
} from "react-number-format";

// src/ui/Input.tsx
import * as React6 from "react";
import { Eye, EyeOff, X } from "lucide-react";

// src/form/FloatingFieldShell.tsx
import { jsx as jsx6, jsxs as jsxs4 } from "react/jsx-runtime";
function fieldLabelId(htmlFor) {
  return htmlFor ? `${htmlFor}-label` : void 0;
}
var sizeClasses = {
  sm: { labelTextRest: "text-body-sm", labelTextFloat: "text-[11px]" },
  md: { labelTextRest: "text-body-sm", labelTextFloat: "text-caption" },
  lg: { labelTextRest: "text-body-md", labelTextFloat: "text-caption" }
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
  reserveMessageSpace = true,
  children
}) {
  const hasError = hasErrorProp ?? Boolean(error);
  const sz = sizeClasses[size];
  const labelIsEmpty = label == null || typeof label === "string" && label.trim() === "";
  const showLabel = !labelIsEmpty && !hideLabel;
  const showHint = !hasError && Boolean(hint);
  const showMessageSlot = hasError || showHint || reserveMessageSpace;
  return /* @__PURE__ */ jsxs4("div", { className: cn("flex w-full flex-col gap-1", containerClassName), children: [
    /* @__PURE__ */ jsxs4("div", { className: "relative w-full", children: [
      showLabel && /* @__PURE__ */ jsxs4(
        "label",
        {
          id: fieldLabelId(htmlFor),
          htmlFor,
          className: cn(
            /* 🔴 `z-10` — ตอนเป็นโครงร่าง (`FieldSkeleton`) กล่องเทาใช้ `animate-pulse`
             * ซึ่งเป็นแอนิเมชัน opacity ⇒ มันสร้าง stacking context ของตัวเอง แล้ว
             * ทับป้ายกำกับที่วางมาก่อนหน้าในลำดับ DOM
             * ผลที่เห็นคือป้ายโผล่มาแค่เสี้ยวบนสุด ที่เหลือจมอยู่ใต้กล่องเทา —
             * อ่านเป็น "ตัวหนังสือขาด" ไม่ใช่ป้ายกำกับ (ยืนยันด้วยภาพซูม 2026-08-10)
             * ป้ายมี `pointer-events-none` อยู่แล้ว การยกชั้นจึงไม่บังการคลิกของช่อง */
            "pointer-events-none absolute z-10 truncate transition-all duration-150 ease-out",
            "max-w-[calc(100%-1.5rem)]",
            floating ? cn(
              "-top-1.5 left-2 px-1.5 font-medium bg-bg-default",
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
            required && /* @__PURE__ */ jsx6("span", { className: "ml-0.5 text-cherry-red-600", children: "*" })
          ]
        }
      ),
      leftAdornment && /* @__PURE__ */ jsx6("span", { className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary [&_svg:not([class*='size-'])]:size-4", children: leftAdornment }),
      children,
      rightAdornment && /* 🔴 `pointer-events-none` — ตัวห่อนี้ทับปุ่ม/ช่องที่อยู่ข้างล่างเสมอ
       * (`absolute right-3`) ถ้าไม่ปล่อยให้คลิกทะลุ **การกดตรงไอคอนจะไม่ทำอะไรเลย**
       * บนช่องที่ทั้งช่องมีหน้าที่ "กดแล้วเปิด" (`DatePicker` · `DateRangePicker` ·
       * `Select`/`ComboBox`) — ผู้ใช้กดตรงไอคอนเป็นเรื่องปกติที่สุด และของเดิม
       * เงียบสนิท ไม่มี error ให้เห็น (ยืนยันด้วย `elementFromPoint` ที่กลางไอคอน
       * ปฏิทินของ `DatePicker`: คืน `<span>` ตัวนี้ ไม่ใช่ปุ่ม trigger)
       *
       * ตรงกับ `leftAdornment` ที่เป็น `pointer-events-none` มาแต่แรก
       *
       * ⚠️ adornment ที่ **เป็นปุ่มจริง** ต้องเปิด `pointer-events-auto` ที่ตัวมันเอง
       * — `TimePicker` ทำแบบนั้นอยู่ก่อนแล้ว (เจอปัญหานี้มาก่อนแต่แก้เฉพาะจุด)
       * และปุ่มล้างของ `DateRangePicker` เปิดกลับมาเฉพาะตอนถูกเผย */
      /* @__PURE__ */ jsx6("span", { className: "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-text-tertiary [&_svg:not([class*='size-'])]:size-4", children: rightAdornment })
    ] }),
    showMessageSlot ? /* @__PURE__ */ jsx6(
      "p",
      {
        id: hasError && htmlFor ? `${htmlFor}-error` : void 0,
        role: hasError ? "alert" : void 0,
        className: cn(
          "text-caption",
          hasError ? "font-medium text-cherry-red-600" : "text-text-tertiary"
        ),
        children: hasError ? error : showHint ? hint : "\xA0"
      }
    ) : null
  ] });
}
function FieldSkeleton({
  size = "md",
  shape,
  containerClassName,
  ...shellProps
}) {
  return /* @__PURE__ */ jsx6(
    FloatingFieldShell,
    {
      ...shellProps,
      containerClassName: cn("[&_label]:bg-transparent", containerClassName),
      size,
      floating: true,
      hasError: false,
      children: /* @__PURE__ */ jsx6(SkeletonBox, { shape: shape ?? fieldShapeClasses({ hasError: false, size }) })
    }
  );
}
function fieldShapeClasses({
  hasError,
  size
}) {
  const heights2 = {
    sm: "h-9 text-body-sm",
    md: "h-11 text-body-sm",
    lg: "h-12 text-body-md"
  };
  return [
    /* 🔴 มุมโค้งอ่านจาก `--radius-field` โดยมีค่าสำรองเป็นของเดิม (4px) ⇒ **แอปที่ไม่ตั้งอะไร
     * ไม่เปลี่ยนเลยสักพิกเซล** · มีไว้เพราะของจริงในแอปไม่ตรงกัน: จอตั้งขอบเขต (แผนก/หน่วยงาน)
     * ของ Mediwork ทั้ง 3 จอใช้ **8px** มาตลอด (`components-v2/shared/selectionFieldSx.ts`)
     * ส่วน DS ใช้ 4px ⇒ ช่องของ DS ที่วางข้างของเดิมจะมุมคมกว่าอย่างเห็นได้
     *
     * ⚠️ ที่ **ไม่** เปลี่ยนค่าตั้งต้นเป็น 8px ให้ทุกแอค เพราะกฎข้อ 1 ของ repo นี้: ค่าที่ใช้
     * ร่วมกัน 4 แอปต้องวัดจากจอจริงของทั้ง 4 ก่อน · ตอนนี้มีตัวเลขจาก Mediwork แอปเดียว
     * ⇒ เปิดทางให้แต่ละแอปตั้งเองไปก่อน แล้วค่อยยุบเป็นค่าเดียวเมื่อวัดครบ */
    /* 🔴 `border-[1px]` ไม่ใช่ `border` เปล่า ๆ — **ชื่อคลาสชนกับ utility เก่าของ Mediwork**
     *
     * `styles/globals.css:226` ของแอปนั้นประกาศไว้ว่า
     *     .border { border: 1px solid #edeff5 !important; }
     * เป็น unlayered + `!important` ⇒ ชนะ utility ของ Tailwind ทุกกรณี และเพราะเป็น
     * **shorthand** มันกินทั้ง width/style/**color** ⇒ ทุก field ของ DS ในแอปนั้นได้เส้น
     * `#edeff5` ตายตัว และ `hover:border-brand` / `focus:border-brand` **ไม่มีทางทำงานเลย**
     * (วัดจากจอจริง 2026-08-14: ได้ `rgb(237,239,245)` ตรงกับค่าที่ hardcode ไว้เป๊ะ)
     *
     * อาการเงียบสนิท — ไม่มี error และช่องยังดูเหมือนช่องปกติ ต่างแค่สีเส้นกับการไม่ตอบ hover
     *
     * `border-[1px]` ให้ผลเท่ากันทุกประการในแอปที่ไม่มีคลาสชนกัน แต่ชื่อคลาสไม่ตรงกับ
     * ของเก่า ⇒ หลุดจากกฎ `!important` นั้น · ส่วน `border-style` ยังมาจาก reset
     * (preflight หรือที่แอปกู้เอง ซึ่งตั้ง `border: 0 solid` ให้ form element อยู่แล้ว)
     *
     * ⚠️ แอปนั้นมี utility ชื่อชนอีกหลายตัว (`.pl-*` `.pr-*` `.ml-*` …) ทุกตัวเป็น
     * `!important` — ถ้า DS ใช้คลาสพวกนี้ที่ไหนอีกจะเจออาการเดียวกัน */
    "w-full rounded-[var(--radius-field,0.25rem)] border-[1px] bg-bg-default px-3 font-medium transition-colors",
    "focus:outline-none focus:ring-1",
    /* 🔴 `bg-bg-surface` (#f3f4f6) ไม่ใช่ `bg-bg-subtle` (#fbfbfd) — ของเดิมต่างจากพื้นขาว
     * ของช่องปกติแค่ **1.5%** ⇒ ช่องที่แก้ไม่ได้ดูเหมือนช่องที่แก้ได้ทุกประการ ผู้ใช้จะรู้
     * ก็ต่อเมื่อคลิกแล้วพิมพ์ไม่ได้ · จอ "ข้อมูลองค์กร" มี 9 ช่องที่อ่านอย่างเดียวถาวร
     * เรียงติดกัน จึงเห็นปัญหานี้ชัดที่สุด (ดีไซน์ Figma 715-15581 วาดเป็นเทา #f0f0f0
     * — ห่างจาก token นี้ 3 หน่วย มองด้วยตาไม่ออก) */
    "disabled:cursor-not-allowed disabled:bg-bg-surface",
    heights2[size],
    /* 🔴 **hover เส้นขอบเป็นสีแบรนด์ — ของที่ field ของ DS ไม่เคยมีเลย**
     *
     * ทุก field มีแต่สถานะ `focus` ⇒ เอาเมาส์ไปวางแล้วไม่มีอะไรตอบสนอง ซึ่งเป็นวิธีที่
     * ทั้งหน้าเว็บใช้เขียนคำว่า *กดไม่ได้* · ของจริงที่ผู้ใช้ใช้อยู่ทุกวันมี — จอตั้งขอบเขต
     * ทั้ง 3 จอของ Mediwork ตั้ง `'&:hover fieldset': {borderColor: var(--primaryColor)}`
     * ไว้ตรง ๆ (`selectionFieldSx.ts:27`) ⇒ ช่องของ DS ที่วางข้างกันดูตายกว่าอย่างชัดเจน
     *
     * `enabled:` สำคัญ — ช่องที่ปิดอยู่ต้องไม่ตอบสนองการ hover ไม่งั้นจะสัญญาสิ่งที่ทำไม่ได้
     * (ช่อง "หน่วยงาน" ถูกปิดไว้จนกว่าจะเลือกแผนก เป็นเคสที่เจอจริงบนจอ)
     * ⚠️ สถานะผิดพลาดไม่มี hover โดยตั้งใจ — เส้นแดงคือข้อความ ไม่ใช่ของตกแต่ง
     * ถ้าให้มันเปลี่ยนเป็นสีแบรนด์ตอนเอาเมาส์ไปวาง เท่ากับลบข้อความนั้นทิ้งชั่วคราว */
    hasError ? "border-cherry-red-600 focus:border-cherry-red-600 focus:ring-cherry-red-600/40" : "border-border-strong enabled:hover:border-brand focus:border-brand focus:ring-brand/30"
  ].join(" ");
}

// src/ui/Input.tsx
import { Fragment as Fragment3, jsx as jsx7, jsxs as jsxs5 } from "react/jsx-runtime";
var Input = React6.forwardRef(function Input2({
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
}, ref) {
  const reactId = React6.useId();
  const inputId = id ?? reactId;
  const [focused, setFocused] = React6.useState(false);
  const [showPassword, setShowPassword] = React6.useState(false);
  const [internalValue, setInternalValue] = React6.useState(defaultValue ?? "");
  const isPassword = type === "password";
  const effectiveType = isPassword && showPassword ? "text" : type;
  const hasError = invalid ?? Boolean(error);
  const isControlled = value !== void 0;
  const currentValue = isControlled ? value : internalValue;
  const hasValue = currentValue != null && String(currentValue).length > 0;
  const floating = Boolean(alwaysFloatLabel) || focused || hasValue || Boolean(placeholder);
  const showClear = Boolean(clearable && hasValue && !disabled);
  const prefix = prefixIcon ?? leftAdornment;
  const suffix = suffixIcon ?? rightAdornment;
  if (isLoading) {
    return /* @__PURE__ */ jsx7(
      FieldSkeleton,
      {
        label,
        hint,
        required,
        hideLabel,
        size,
        leftAdornment: prefix,
        containerClassName
      }
    );
  }
  return /* @__PURE__ */ jsx7(
    FloatingFieldShell,
    {
      label,
      hint,
      error,
      reserveMessageSpace,
      required,
      hideLabel,
      htmlFor: inputId,
      size,
      floating,
      focused,
      hasError,
      leftAdornment: prefix,
      rightAdornment: showClear || isPassword || suffix ? /* @__PURE__ */ jsxs5(Fragment3, { children: [
        showClear && /* @__PURE__ */ jsx7(
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
            className: "rounded-full p-0.5 hover:bg-overlay-hover",
            children: /* @__PURE__ */ jsx7(X, {})
          }
        ),
        isPassword && /* @__PURE__ */ jsx7(
          "button",
          {
            type: "button",
            "aria-label": showPassword ? "Hide password" : "Show password",
            tabIndex: -1,
            onClick: () => setShowPassword((s) => !s),
            className: "rounded-full p-0.5 hover:bg-overlay-hover",
            children: showPassword ? /* @__PURE__ */ jsx7(Eye, {}) : /* @__PURE__ */ jsx7(EyeOff, {})
          }
        ),
        !showClear && !isPassword && suffix
      ] }) : null,
      containerClassName,
      children: /* @__PURE__ */ jsx7(
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
            prefix && "pl-9",
            (showClear || isPassword || suffix) && "pr-9",
            className
          ),
          ...props
        }
      )
    }
  );
});
Input.displayName = "Input";

// src/ui/FormatInput.tsx
import { jsx as jsx8 } from "react/jsx-runtime";
var FORMAT_PRESETS = {
  /** เลขบัตรประชาชนไทย 13 หลัก — 1-2345-67890-12-3 */
  thaiId: { kind: "pattern", pattern: "#-####-#####-##-#", digits: 13 },
  /** เบอร์มือถือไทย 10 หลัก — 081-234-5678 */
  phone: { kind: "pattern", pattern: "###-###-####", digits: 10 },
  /** เลขบัญชีธนาคารไทย 10 หลัก — 123-4-56789-0 */
  bankAccount: { kind: "pattern", pattern: "###-#-#####-#", digits: 10 },
  /** จำนวนเงิน — ค่าเดียวกับที่ Medimatch ใช้อยู่กับช่องค่าจ้าง */
  currency: { kind: "numeric" }
};
var digitsOnly = (v) => v.replace(/\D/g, "");
function FormatInput({
  format: format3,
  value,
  onValueChange,
  showMask,
  thousandSeparator = ",",
  decimalScale = 2,
  allowNegative = false,
  ...rest
}) {
  const spec = typeof format3 === "string" && format3 in FORMAT_PRESETS ? FORMAT_PRESETS[format3] : format3;
  if (typeof spec === "object" && "format" in spec) {
    return /* @__PURE__ */ jsx8(
      NumberFormatBase,
      {
        customInput: Input,
        value,
        format: spec.format,
        removeFormatting: spec.removeFormatting ?? digitsOnly,
        onValueChange: (v) => onValueChange?.(v.value),
        ...rest
      }
    );
  }
  if (typeof spec === "object" && spec.kind === "numeric") {
    return /* @__PURE__ */ jsx8(
      NumericFormat,
      {
        customInput: Input,
        value,
        thousandSeparator,
        decimalScale,
        allowNegative,
        onValueChange: (v) => onValueChange?.(v.value),
        onWheel: (e) => e.target.blur(),
        ...rest
      }
    );
  }
  const pattern = typeof spec === "string" ? spec : spec.pattern;
  return /* @__PURE__ */ jsx8(
    PatternFormat,
    {
      customInput: Input,
      value,
      format: pattern,
      mask: showMask ? "_" : void 0,
      onValueChange: (v) => onValueChange?.(v.value),
      ...rest
    }
  );
}
FormatInput.displayName = "FormatInput";

// src/ui/Textarea.tsx
import * as React7 from "react";
import { jsx as jsx9, jsxs as jsxs6 } from "react/jsx-runtime";
var minHeights = {
  sm: "min-h-[72px]",
  md: "min-h-[88px]",
  lg: "min-h-[104px]"
};
function textareaShapeClasses({
  hasError,
  size
}) {
  return [
    /* 🔴 `block` จำเป็น ไม่ใช่ของประดับ — `<textarea>` เป็น `inline-block` นั่งบน
     * เส้นฐานโดยปริยาย กล่องแม่จึงได้ที่ว่างใต้เส้นฐานเพิ่ม **7px** (วัดแล้ว
     * กล่องแม่ 95px ทั้งที่ตัว textarea เอง 88px) = ที่ว่างเปล่าที่ไม่มีใครขอ
     * และทำให้โครงร่างตอนโหลด (ซึ่งเป็น <div> block) เตี้ยกว่าของจริง 7px */
    "block w-full rounded-sm border bg-bg-default px-3 py-2.5 text-body-sm font-medium transition-colors resize-y",
    "focus:outline-none focus:ring-1",
    /* พื้นตอนปิดใช้งานต้องเป็นค่าเดียวกับ `fieldShapeClasses` — เหตุผลอยู่ที่นั่น
     * (ของเดิม `bg-bg-subtle` เกือบขาว ⇒ ช่องที่แก้ไม่ได้ดูเหมือนช่องที่แก้ได้) */
    "disabled:cursor-not-allowed disabled:bg-bg-surface",
    minHeights[size],
    hasError ? "border-cherry-red-600 focus:border-cherry-red-600 focus:ring-cherry-red-600/40" : "border-border-strong focus:border-brand focus:ring-brand/30"
  ].join(" ");
}
var Textarea = React7.forwardRef(
  function Textarea2({
    id,
    className,
    containerClassName,
    label,
    hint,
    error,
    invalid,
    reserveMessageSpace,
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
    isLoading,
    ...props
  }, ref) {
    const reactId = React7.useId();
    const inputId = id ?? reactId;
    const [focused, setFocused] = React7.useState(false);
    const [internalValue, setInternalValue] = React7.useState(defaultValue ?? "");
    const hasError = invalid ?? Boolean(error);
    const isControlled = value !== void 0;
    const currentValue = isControlled ? value : internalValue;
    const hasValue = currentValue != null && String(currentValue).length > 0;
    const floating = Boolean(alwaysFloatLabel) || focused || hasValue || Boolean(placeholder);
    const length = currentValue == null ? 0 : String(currentValue).length;
    const counter = showCount && maxLength != null ? `${length} / ${maxLength}` : null;
    const hintWithCounter = counter ? /* @__PURE__ */ jsxs6("span", { className: "flex justify-between gap-2", children: [
      /* @__PURE__ */ jsx9("span", { children: hint }),
      /* @__PURE__ */ jsx9("span", { children: counter })
    ] }) : hint;
    if (isLoading) {
      return /* @__PURE__ */ jsx9(
        FieldSkeleton,
        {
          label,
          hint: hintWithCounter,
          required,
          hideLabel,
          size,
          multiline: true,
          shape: textareaShapeClasses({ hasError: false, size }),
          containerClassName
        }
      );
    }
    return /* @__PURE__ */ jsx9(
      FloatingFieldShell,
      {
        label,
        hint: hintWithCounter,
        error,
        reserveMessageSpace,
        required,
        hideLabel,
        htmlFor: inputId,
        size,
        floating,
        focused,
        hasError,
        containerClassName,
        multiline: true,
        children: /* @__PURE__ */ jsx9(
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
            className: cn(textareaShapeClasses({ hasError, size }), className),
            ...props
          }
        )
      }
    );
  }
);
Textarea.displayName = "Textarea";

// src/ui/Checkbox.tsx
import * as React8 from "react";
import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";

// src/ui/toggle-parts.tsx
import { jsx as jsx10, jsxs as jsxs7 } from "react/jsx-runtime";
var SIZES = {
  sm: {
    box: "size-4",
    /* เครื่องหมายถูก 12px ในกล่อง 16px = 75% — ของจริงใช้ `size-[70%]` */
    glyph: "size-3",
    /* จุดกลางของ radio 8px ในกล่อง 16px */
    dot: "after:size-2",
    /* กล่อง 16px เทียบกับบรรทัดข้อความ 20px ⇒ ต้องดัน 2px ให้อยู่กลางบรรทัด */
    align: "mt-0.5"
  },
  md: {
    box: "size-5",
    glyph: "size-3.5",
    dot: "after:size-2.5",
    /* กล่อง 20px = ความสูงบรรทัดข้อความพอดี ⇒ ไม่ต้องเลื่อน */
    align: "mt-0"
  }
};
var toggleGlyphClass = (size) => SIZES[size].glyph;
var TOGGLE_GLYPH_STROKE = 3;
var controlBase = [
  "peer relative flex shrink-0 items-center justify-center border bg-bg-default transition-colors",
  "cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
  /* 🔴 วงแหวนโฟกัสต้องเป็นสีของแบรนด์ **ไม่ใช่สีแดง**
   * ของจริงทั้ง Portal · MediHR · Medimatch ใช้ `ring-cherry-red-600/50`
   * (วัดแล้ว: `#e02c2c` ที่ 50%) ซึ่งเป็นสีเดียวกับข้อความผิดพลาด —
   * กด Tab มาถึงช่องติ๊กธรรมดาแล้วขึ้นวงแดง คนอ่านว่า "กรอกผิด"
   * เกือบแน่นอนว่าลอกมาจากสไตล์ error แล้วไม่มีใครกด Tab ดู */
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2"
].join(" ");
function checkboxShapeClasses(size = "md") {
  return cn(
    controlBase,
    SIZES[size].box,
    "rounded-xs border-border-input",
    "data-[state=checked]:border-brand data-[state=checked]:bg-brand",
    "data-[state=indeterminate]:border-brand data-[state=indeterminate]:bg-brand"
  );
}
function radioShapeClasses(size = "md") {
  return cn(
    controlBase,
    SIZES[size].box,
    "rounded-full border-border-input",
    "data-[state=checked]:border-brand"
  );
}
function radioDotClasses(size = "md") {
  return cn(
    "flex size-full items-center justify-center after:rounded-full after:bg-brand",
    SIZES[size].dot
  );
}
function toggleLabelClasses(disabled, align = "start") {
  return cn(
    "inline-flex gap-2 text-body-sm font-medium text-text-body",
    align === "center" ? "items-center" : "items-start",
    disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
  );
}
function ToggleText({ children, description }) {
  if (children == null && description == null) return null;
  return /* @__PURE__ */ jsxs7("span", { className: "flex flex-col gap-0.5", children: [
    children != null && /* @__PURE__ */ jsx10("span", { className: "leading-5", children }),
    description != null && /* @__PURE__ */ jsx10("span", { className: "text-caption font-normal leading-4 text-text-tertiary", children: description })
  ] });
}
var toggleAlignClass = (size) => SIZES[size].align;
var switchToneClasses = {
  success: "data-[state=checked]:bg-success-green-primary",
  info: "data-[state=checked]:bg-info-blue-primary",
  brand: "data-[state=checked]:bg-brand"
};
var switchTrackClasses = cn(
  "peer relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent transition-colors",
  "cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2",
  "bg-gray-200"
);
var switchThumbClasses = cn(
  "pointer-events-none flex size-5 items-center justify-center rounded-full bg-bg-default shadow-md ring-0 transition-transform",
  "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
);
var switchLabeledTrackClasses = cn(
  "group/switch peer relative inline-flex h-6 items-center gap-1 rounded-full px-0.5 transition-colors",
  "cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2",
  "bg-gray-200"
);
var switchLabeledThumbClasses = cn(
  "pointer-events-none flex size-5 shrink-0 items-center justify-center rounded-full bg-bg-default shadow",
  "order-1 group-data-[state=checked]/switch:order-2"
);
var switchTrackLabelClasses = cn(
  "grid px-1.5 text-caption font-semibold whitespace-nowrap",
  "order-2 group-data-[state=checked]/switch:order-1"
);
var switchTrackLabelItemClasses = "col-start-1 row-start-1";

// src/ui/Checkbox.tsx
import { jsx as jsx11, jsxs as jsxs8 } from "react/jsx-runtime";
var Checkbox = React8.forwardRef(
  function Checkbox2({
    id,
    className,
    containerClassName,
    label,
    description,
    error,
    size = "md",
    isLoading,
    checked,
    disabled,
    ...props
  }, ref) {
    const reactId = React8.useId();
    const inputId = id ?? reactId;
    const hasError = Boolean(error);
    const isIndeterminate = checked === "indeterminate";
    const hasText = label != null || description != null;
    const box = /* @__PURE__ */ jsx11(
      RadixCheckbox.Root,
      {
        ref,
        id: inputId,
        checked,
        disabled,
        "aria-invalid": hasError || void 0,
        className: cn(
          checkboxShapeClasses(size),
          hasText && toggleAlignClass(size),
          hasError && "border-cherry-red-600",
          className
        ),
        ...props,
        children: /* @__PURE__ */ jsx11(RadixCheckbox.Indicator, { className: "text-brand-foreground", children: isIndeterminate ? /* @__PURE__ */ jsx11(
          Minus,
          {
            className: toggleGlyphClass(size),
            strokeWidth: TOGGLE_GLYPH_STROKE
          }
        ) : /* @__PURE__ */ jsx11(
          Check,
          {
            className: toggleGlyphClass(size),
            strokeWidth: TOGGLE_GLYPH_STROKE
          }
        ) })
      }
    );
    if (isLoading) {
      return hasText ? /* @__PURE__ */ jsxs8(
        SkeletonBox,
        {
          shape: "inline-flex items-start gap-2 rounded-xs text-body-sm",
          className: containerClassName,
          children: [
            /* @__PURE__ */ jsx11(
              "span",
              {
                className: cn(checkboxShapeClasses(size), toggleAlignClass(size))
              }
            ),
            /* @__PURE__ */ jsx11(ToggleText, { description, children: label })
          ]
        }
      ) : /* @__PURE__ */ jsx11(
        SkeletonBox,
        {
          shape: checkboxShapeClasses(size),
          className: containerClassName
        }
      );
    }
    if (!hasText && error == null) return box;
    return /* @__PURE__ */ jsxs8("div", { className: cn("flex flex-col gap-1", containerClassName), children: [
      /* @__PURE__ */ jsxs8("label", { htmlFor: inputId, className: toggleLabelClasses(disabled), children: [
        box,
        /* @__PURE__ */ jsx11(ToggleText, { description, children: label })
      ] }),
      hasError && /* @__PURE__ */ jsx11("p", { role: "alert", className: "text-caption font-medium text-cherry-red-600", children: error })
    ] });
  }
);
Checkbox.displayName = "Checkbox";

// src/ui/Switch.tsx
import * as React10 from "react";
import * as RadixSwitch from "@radix-ui/react-switch";

// src/feedback/Spinner.tsx
import * as React9 from "react";
import { jsx as jsx12, jsxs as jsxs9 } from "react/jsx-runtime";
var sizeClasses2 = {
  xs: "size-3",
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
  xl: "size-8"
};
var Spinner2 = React9.forwardRef(function Spinner3({ className, size = "md", label = "Loading", ...props }, ref) {
  return /* @__PURE__ */ jsx12(
    "span",
    {
      ref,
      role: "status",
      "aria-label": label,
      className: cn("inline-flex", className),
      ...props,
      children: /* @__PURE__ */ jsxs9(
        "svg",
        {
          className: cn("animate-spin text-current", sizeClasses2[size]),
          viewBox: "0 0 24 24",
          fill: "none",
          "aria-hidden": "true",
          children: [
            /* @__PURE__ */ jsx12(
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
            /* @__PURE__ */ jsx12(
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
  return /* @__PURE__ */ jsxs9(
    "div",
    {
      role: "status",
      className: cn(
        "flex w-full flex-col items-center justify-center gap-3 py-16 text-text-tertiary",
        className
      ),
      children: [
        /* @__PURE__ */ jsx12(Spinner2, { size: "xl" }),
        label && /* @__PURE__ */ jsx12("span", { className: "text-body-sm", children: label })
      ]
    }
  );
}
Spinner2.displayName = "Spinner";

// src/ui/Switch.tsx
import { Fragment as Fragment4, jsx as jsx13, jsxs as jsxs10 } from "react/jsx-runtime";
var Switch = React10.forwardRef(function Switch2({
  id,
  className,
  containerClassName,
  label,
  description,
  error,
  labelPosition = "right",
  loading,
  isLoading,
  loadingLabel = "Saving",
  tone = "success",
  trackLabels,
  disabled,
  ...props
}, ref) {
  const reactId = React10.useId();
  const inputId = id ?? reactId;
  const hasError = Boolean(error);
  const hasText = label != null || description != null;
  const labeled = trackLabels != null;
  const trackShape = cn(
    labeled ? switchLabeledTrackClasses : switchTrackClasses,
    switchToneClasses[tone]
  );
  const sw = /* @__PURE__ */ jsxs10(
    RadixSwitch.Root,
    {
      ref,
      id: inputId,
      disabled: disabled || loading,
      "aria-busy": loading || void 0,
      "aria-invalid": hasError || void 0,
      className: cn(
        trackShape,
        /* ⚠️ ต้องเป็น `disabled:*` ทั้งคู่ เพราะตอน loading ปุ่มถูก `disabled` จริง
         * ⇒ กฎ `disabled:cursor-not-allowed`/`disabled:opacity-50` ที่อยู่ในรูปทรงหลัก
         * จะชนะเสมอ ถ้าเขียนเป็น `cursor-progress` เปล่า ๆ (วัดเจอ: cursor ออกมาเป็น
         * not-allowed ทั้งที่กำลังบันทึกอยู่ — tailwind-merge ไม่รวม variant ต่างชั้นให้) */
        loading && "disabled:cursor-progress disabled:opacity-100",
        hasError && "ring-2 ring-cherry-red-600/40",
        className
      ),
      ...props,
      children: [
        labeled && /* คำทั้งสองซ้อนกันในช่องเดียว ⇒ รางกว้างเท่าคำที่ยาวกว่าเสมอ ไม่กระตุกตอนสลับ
         * `aria-hidden` เพราะสถานะจริงประกาศผ่าน `role="switch"` + `aria-checked` อยู่แล้ว
         * ถ้าปล่อยให้อ่าน โปรแกรมอ่านหน้าจอจะพูดทั้ง "เปิดใช้งาน" และ "ปิดใช้งาน" ติดกัน */
        /* @__PURE__ */ jsxs10("span", { "aria-hidden": "true", className: switchTrackLabelClasses, children: [
          /* @__PURE__ */ jsx13(
            "span",
            {
              className: cn(
                switchTrackLabelItemClasses,
                /* 🔴 ตัวอักษร **ขาว** — คำว่า "เปิดใช้งาน" อยู่บนรางสีเขียวทึบ (#10b981)
                 * ของเดิม `text-text-black` อ่านได้ยากมากบนพื้นเข้ม (ดีไซน์ 544-16678 เป็นขาว)
                 * ใช้ token `text-inverse` (= #fff · วัดยืนยันในแอปแล้ว) ไม่ใช่ `text-white`
                 * เพราะ `white` เป็นสีดิบที่ด่าน `tokens.guard.test.ts` ตรึงจำนวนไว้ */
                "text-text-inverse group-data-[state=unchecked]/switch:invisible"
              ),
              children: trackLabels.on
            }
          ),
          /* @__PURE__ */ jsx13(
            "span",
            {
              className: cn(
                switchTrackLabelItemClasses,
                "text-text-body group-data-[state=checked]/switch:invisible"
              ),
              children: trackLabels.off
            }
          )
        ] }),
        /* @__PURE__ */ jsx13(
          RadixSwitch.Thumb,
          {
            className: labeled ? switchLabeledThumbClasses : switchThumbClasses,
            children: loading && /* @__PURE__ */ jsx13(
              Spinner2,
              {
                size: "xs",
                label: loadingLabel,
                className: "text-success-green-primary"
              }
            )
          }
        )
      ]
    }
  );
  const trackLabelGhost = labeled ? /* @__PURE__ */ jsxs10(Fragment4, { children: [
    /* @__PURE__ */ jsxs10("span", { className: switchTrackLabelClasses, children: [
      /* @__PURE__ */ jsx13("span", { className: switchTrackLabelItemClasses, children: trackLabels.on }),
      /* @__PURE__ */ jsx13("span", { className: switchTrackLabelItemClasses, children: trackLabels.off })
    ] }),
    /* @__PURE__ */ jsx13("span", { className: "size-5 shrink-0" })
  ] }) : null;
  if (isLoading) {
    return hasText ? /* @__PURE__ */ jsxs10(
      SkeletonBox,
      {
        shape: "inline-flex items-center gap-2 rounded-full text-body-sm",
        className: containerClassName,
        children: [
          labelPosition === "left" && /* @__PURE__ */ jsx13(ToggleText, { description, children: label }),
          /* @__PURE__ */ jsx13("span", { className: trackShape, children: labeled && trackLabelGhost }),
          labelPosition === "right" && /* @__PURE__ */ jsx13(ToggleText, { description, children: label })
        ]
      }
    ) : /* @__PURE__ */ jsx13(SkeletonBox, { shape: trackShape, className: containerClassName, children: labeled ? trackLabelGhost : null });
  }
  if (!hasText && error == null) return sw;
  const text = /* @__PURE__ */ jsx13(ToggleText, { description, children: label });
  return /* @__PURE__ */ jsxs10("div", { className: cn("flex flex-col gap-1", containerClassName), children: [
    /* @__PURE__ */ jsxs10(
      "label",
      {
        htmlFor: inputId,
        className: toggleLabelClasses(disabled, "center"),
        children: [
          labelPosition === "left" && text,
          sw,
          labelPosition === "right" && text
        ]
      }
    ),
    hasError && /* @__PURE__ */ jsx13("p", { role: "alert", className: "text-caption font-medium text-cherry-red-600", children: error })
  ] });
});
Switch.displayName = "Switch";

// src/ui/RadioGroup.tsx
import * as React11 from "react";
import * as RadixRadio from "@radix-ui/react-radio-group";

// src/form/FormField.tsx
import { Label } from "@radix-ui/react-label";
import { jsx as jsx14, jsxs as jsxs11 } from "react/jsx-runtime";
function FormField({
  label,
  hint,
  error,
  required,
  htmlFor,
  hideLabel,
  reserveMessageSpace = true,
  className,
  children
}) {
  const showError = Boolean(error);
  const showHint = !showError && Boolean(hint);
  const showMessageSlot = showError || showHint || reserveMessageSpace;
  return /* @__PURE__ */ jsxs11("div", { className: cn("flex w-full flex-col gap-1.5", className), children: [
    label != null && /* @__PURE__ */ jsxs11(
      Label,
      {
        htmlFor,
        className: cn(
          /* 🔴 `text-text-body` ไม่ใช่ `text-text-primary`
           * `--color-text-primary` ถูก alias ไปที่ `--color-brand` ใน `theme.css`
           * ⇒ ป้ายกำกับฟิลด์เปลี่ยนสีตามแบรนด์ของแอป วัดแล้ว: บน Mediwork
           * ออกมาเป็น `rgb(38,209,179)` เขียวมิ้นต์ **คอนทราสต์บนพื้นขาว 1.93:1**
           * ซึ่งอ่านแทบไม่ออก และคนอ่านว่าเป็นลิงก์
           * `FloatingFieldShell` ที่ Input/Select/Textarea ใช้ อยู่ที่ `text-text-body`
           * อยู่แล้ว — บรรทัดนี้จึงเป็นการทำให้ตรงกัน ไม่ใช่การเปลี่ยนดีไซน์ */
          "text-body-sm font-medium text-text-body",
          hideLabel && "sr-only"
        ),
        children: [
          label,
          required && /* @__PURE__ */ jsx14("span", { className: "ml-1 text-cherry-red-600", children: "*" })
        ]
      }
    ),
    children,
    showMessageSlot ? /* @__PURE__ */ jsx14(
      "p",
      {
        role: showError ? "alert" : void 0,
        className: cn(
          "text-caption",
          showError ? "font-medium text-cherry-red-600" : "text-text-tertiary"
        ),
        children: showError ? error : showHint ? hint : "\xA0"
      }
    ) : null
  ] });
}

// src/ui/RadioGroup.tsx
import { jsx as jsx15, jsxs as jsxs12 } from "react/jsx-runtime";
var RadioSizeContext = React11.createContext("md");
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
  size = "md",
  isLoading,
  children,
  ...props
}) {
  const reactId = React11.useId();
  const groupId = id ?? reactId;
  const hasError = Boolean(error);
  const layout = cn(
    "flex gap-4",
    orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
    className
  );
  return /* @__PURE__ */ jsx15(
    FormField,
    {
      label,
      hint,
      error,
      required,
      htmlFor: groupId,
      className: containerClassName,
      children: isLoading ? /* @__PURE__ */ jsx15("div", { className: layout, children: Array.from({ length: options?.length || 3 }).map((_, i) => /* @__PURE__ */ jsxs12(
        SkeletonBox,
        {
          shape: "inline-flex items-start gap-2 rounded-full text-body-sm",
          children: [
            /* @__PURE__ */ jsx15("span", { className: cn(radioShapeClasses(size), toggleAlignClass(size)) }),
            /* @__PURE__ */ jsx15(ToggleText, { description: options?.[i]?.description, children: options?.[i]?.label ?? "\u0E15\u0E31\u0E27\u0E40\u0E25\u0E37\u0E2D\u0E01" })
          ]
        },
        i
      )) }) : /* @__PURE__ */ jsx15(
        RadixRadio.Root,
        {
          id: groupId,
          "aria-invalid": hasError || void 0,
          className: layout,
          ...props,
          children: /* @__PURE__ */ jsx15(RadioSizeContext.Provider, { value: size, children: options ? options.map((opt) => /* @__PURE__ */ jsx15(
            RadioGroupItem,
            {
              value: opt.value,
              disabled: opt.disabled,
              description: opt.description,
              children: opt.label
            },
            opt.value
          )) : children })
        }
      )
    }
  );
}
var RadioGroupItem = React11.forwardRef(
  function RadioGroupItem2({ id, value, disabled, description, size, children, className, ...props }, ref) {
    const reactId = React11.useId();
    const itemId = id ?? reactId;
    const groupSize = React11.useContext(RadioSizeContext);
    const resolved = size ?? groupSize;
    return /* @__PURE__ */ jsxs12("label", { htmlFor: itemId, className: toggleLabelClasses(disabled), children: [
      /* @__PURE__ */ jsx15(
        RadixRadio.Item,
        {
          ref,
          id: itemId,
          value,
          disabled,
          className: cn(
            radioShapeClasses(resolved),
            toggleAlignClass(resolved),
            className
          ),
          ...props,
          children: /* @__PURE__ */ jsx15(RadixRadio.Indicator, { className: radioDotClasses(resolved) })
        }
      ),
      /* @__PURE__ */ jsx15(ToggleText, { description, children })
    ] });
  }
);
RadioGroupItem.displayName = "RadioGroupItem";

// src/ui/Select.tsx
import * as React12 from "react";
import * as RadixSelect from "@radix-ui/react-select";
import { Check as Check2, ChevronDown, Plus as Plus2, X as X2 } from "lucide-react";
import { Fragment as Fragment5, jsx as jsx16, jsxs as jsxs13 } from "react/jsx-runtime";
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
  children,
  clearable,
  isLoading,
  invalid,
  reserveMessageSpace,
  emptyText = "No options",
  emptyAction,
  renderEmpty
}) {
  const reactId = React12.useId();
  const triggerId = id ?? reactId;
  const [open, setOpen] = React12.useState(false);
  const [internalValue, setInternalValue] = React12.useState(
    defaultValue
  );
  const isControlled = value !== void 0;
  const currentValue = isControlled ? value : internalValue;
  const hasValue = currentValue != null && currentValue !== "";
  const hasError = invalid ?? Boolean(error);
  const floating = Boolean(alwaysFloatLabel) || open || hasValue || Boolean(placeholder);
  const handleClear = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isControlled) setInternalValue("");
    onChange?.("");
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx16(
      FieldSkeleton,
      {
        label,
        hint,
        required,
        hideLabel,
        size,
        containerClassName
      }
    );
  }
  return /* @__PURE__ */ jsx16(
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
      reserveMessageSpace,
      containerClassName,
      rightAdornment: /* @__PURE__ */ jsxs13(Fragment5, { children: [
        clearable && hasValue && !disabled && /* @__PURE__ */ jsx16(
          "button",
          {
            type: "button",
            "aria-label": "Clear",
            tabIndex: -1,
            onClick: handleClear,
            className: "rounded-full p-0.5 hover:bg-overlay-press",
            children: /* @__PURE__ */ jsx16(X2, {})
          }
        ),
        /* @__PURE__ */ jsx16(ChevronDown, {})
      ] }),
      children: /* @__PURE__ */ jsxs13(
        RadixSelect.Root,
        {
          value: clearable ? currentValue : isControlled ? value : void 0,
          defaultValue,
          onValueChange: (v) => {
            if (!isControlled) setInternalValue(v);
            onChange?.(v);
          },
          open,
          onOpenChange: setOpen,
          disabled,
          children: [
            /* @__PURE__ */ jsx16(
              RadixSelect.Trigger,
              {
                id: triggerId,
                "aria-invalid": hasError || void 0,
                className: cn(
                  fieldShapeClasses({ hasError, size }),
                  /* `cursor-pointer` — ตัวเปิดเป็นปุ่มที่กดแล้วมีเมนูโผล่ ไม่ใช่ช่องพิมพ์
                   * เคอร์เซอร์ลูกศรทำให้ผู้ใช้อ่านว่าเป็นข้อความอ่านอย่างเดียว
                   * (`disabled:` ของ shell คุมเคสปิดใช้งานไว้แล้ว) */
                  "flex cursor-pointer items-center justify-between gap-2 text-left",
                  clearable ? "pr-14" : "pr-9",
                  "data-[placeholder]:text-text-tertiary",
                  className
                ),
                children: /* @__PURE__ */ jsx16("span", { className: "min-w-0 truncate", children: /* @__PURE__ */ jsx16(RadixSelect.Value, { placeholder: floating ? placeholder ?? "" : "" }) })
              }
            ),
            /* @__PURE__ */ jsx16(RadixSelect.Portal, { children: /* @__PURE__ */ jsx16(
              RadixSelect.Content,
              {
                position: "popper",
                sideOffset: 4,
                className: "z-50 max-h-72 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-sm border border-border-default bg-bg-default shadow-lg",
                children: /* @__PURE__ */ jsx16(RadixSelect.Viewport, { className: "p-1", children: options ? options.length > 0 ? options.map((opt) => /* @__PURE__ */ jsx16(
                  SelectItem,
                  {
                    value: opt.value,
                    disabled: opt.disabled,
                    children: opt.label
                  },
                  opt.value
                )) : renderEmpty?.() ?? /* @__PURE__ */ jsx16(
                  SelectEmpty,
                  {
                    text: emptyText,
                    action: emptyAction,
                    onActed: () => setOpen(false)
                  }
                ) : children })
              }
            ) })
          ]
        }
      )
    }
  );
}
function SelectEmpty({
  text,
  action,
  onActed
}) {
  const fire = () => {
    onActed();
    action?.onClick();
  };
  return /* @__PURE__ */ jsxs13("div", { className: "flex flex-col items-center gap-3 px-3 py-5 text-center", children: [
    /* @__PURE__ */ jsx16("p", { className: "text-body-sm text-text-tertiary", children: text }),
    action && /* @__PURE__ */ jsxs13(
      "button",
      {
        type: "button",
        tabIndex: 0,
        onClick: fire,
        onPointerUp: (e) => e.stopPropagation(),
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            fire();
          }
        },
        className: "inline-flex h-8 items-center gap-1.5 rounded-md border border-border-strong bg-bg-default px-3 text-body-sm font-medium text-text-secondary transition-colors hover:bg-bg-subtle focus:outline-none focus-visible:ring-1 focus-visible:ring-brand [&_svg]:size-4",
        children: [
          action.icon ?? /* @__PURE__ */ jsx16(Plus2, { "aria-hidden": true }),
          action.label
        ]
      }
    )
  ] });
}
var SelectItem = React12.forwardRef(
  function SelectItem2({ className, children, ...props }, ref) {
    return /* @__PURE__ */ jsxs13(
      RadixSelect.Item,
      {
        ref,
        className: cn(
          "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-body-sm outline-none",
          "focus:bg-brand-subtle data-[highlighted]:bg-brand-subtle",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          className
        ),
        ...props,
        children: [
          /* @__PURE__ */ jsx16(RadixSelect.ItemText, { children }),
          /* @__PURE__ */ jsx16("span", { className: "absolute right-2 flex size-4 items-center justify-center", children: /* @__PURE__ */ jsx16(RadixSelect.ItemIndicator, { children: /* @__PURE__ */ jsx16(Check2, { className: "size-4 text-text-primary" }) }) })
        ]
      }
    );
  }
);
SelectItem.displayName = "SelectItem";

// src/ui/CheckboxGroup.tsx
import * as React13 from "react";
import * as RadixCheckbox2 from "@radix-ui/react-checkbox";
import { Check as Check3 } from "lucide-react";
import { jsx as jsx17, jsxs as jsxs14 } from "react/jsx-runtime";
var CheckboxGroupContext = React13.createContext(
  null
);
function CheckboxGroup({
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
  children
}) {
  const reactId = React13.useId();
  const groupId = id ?? reactId;
  const hasError = Boolean(error);
  const isControlled = valueProp !== void 0;
  const [internalValue, setInternalValue] = React13.useState(
    defaultValue ?? []
  );
  const value = isControlled ? valueProp : internalValue;
  const toggle = React13.useCallback(
    (raw) => {
      const v = raw;
      const next = value.includes(v) ? value.filter((x) => x !== v) : [...value, v];
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next);
    },
    [value, isControlled, onValueChange]
  );
  const ctx = React13.useMemo(
    () => ({ value, toggle, disabled, name, size }),
    [value, toggle, disabled, name, size]
  );
  const layout = cn(
    "flex gap-4",
    orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
    className
  );
  return /* @__PURE__ */ jsx17(
    FormField,
    {
      label,
      hint,
      error,
      required,
      htmlFor: groupId,
      className: containerClassName,
      children: isLoading ? /* @__PURE__ */ jsx17("div", { className: layout, children: Array.from({ length: options?.length || 3 }).map((_, i) => /* @__PURE__ */ jsxs14(
        SkeletonBox,
        {
          shape: "inline-flex items-start gap-2 rounded-xs text-body-sm",
          children: [
            /* @__PURE__ */ jsx17(
              "span",
              {
                className: cn(checkboxShapeClasses(size), toggleAlignClass(size))
              }
            ),
            /* @__PURE__ */ jsx17(ToggleText, { description: options?.[i]?.description, children: options?.[i]?.label ?? "\u0E15\u0E31\u0E27\u0E40\u0E25\u0E37\u0E2D\u0E01" })
          ]
        },
        i
      )) }) : /* @__PURE__ */ jsx17(CheckboxGroupContext.Provider, { value: ctx, children: /* @__PURE__ */ jsx17(
        "div",
        {
          id: groupId,
          role: "group",
          "aria-invalid": hasError || void 0,
          className: layout,
          children: options ? options.map((opt) => /* @__PURE__ */ jsx17(
            CheckboxGroupItem,
            {
              value: opt.value,
              disabled: opt.disabled,
              description: opt.description,
              children: opt.label
            },
            opt.value
          )) : children
        }
      ) })
    }
  );
}
var CheckboxGroupItem = React13.forwardRef(function CheckboxGroupItem2({ id, value, disabled, description, children, className, ...props }, ref) {
  const ctx = React13.useContext(CheckboxGroupContext);
  if (ctx == null) {
    throw new Error(
      "CheckboxGroupItem must be rendered inside a CheckboxGroup"
    );
  }
  const reactId = React13.useId();
  const itemId = id ?? reactId;
  const checked = ctx.value.includes(value);
  const isDisabled = disabled ?? ctx.disabled;
  return /* @__PURE__ */ jsxs14("label", { htmlFor: itemId, className: toggleLabelClasses(isDisabled), children: [
    /* @__PURE__ */ jsx17(
      RadixCheckbox2.Root,
      {
        ref,
        id: itemId,
        value,
        name: ctx.name,
        checked,
        disabled: isDisabled,
        onCheckedChange: () => ctx.toggle(value),
        className: cn(
          checkboxShapeClasses(ctx.size),
          toggleAlignClass(ctx.size),
          className
        ),
        ...props,
        children: /* @__PURE__ */ jsx17(RadixCheckbox2.Indicator, { className: "text-brand-foreground", children: /* @__PURE__ */ jsx17(
          Check3,
          {
            className: toggleGlyphClass(ctx.size),
            strokeWidth: TOGGLE_GLYPH_STROKE
          }
        ) })
      }
    ),
    /* @__PURE__ */ jsx17(ToggleText, { description, children })
  ] });
});
CheckboxGroupItem.displayName = "CheckboxGroupItem";
CheckboxGroup.displayName = "CheckboxGroup";

// src/ui/PillSwitch.tsx
import * as React14 from "react";
import * as RadixRadio2 from "@radix-ui/react-radio-group";
import { jsx as jsx18, jsxs as jsxs15 } from "react/jsx-runtime";
function PillSwitch({
  id,
  className,
  containerClassName,
  label,
  hint,
  error,
  required,
  options,
  disabled,
  ...props
}) {
  const reactId = React14.useId();
  const groupId = id ?? reactId;
  const hasError = Boolean(error);
  return /* @__PURE__ */ jsx18(
    FormField,
    {
      label,
      hint,
      error,
      required,
      htmlFor: groupId,
      className: containerClassName,
      children: /* @__PURE__ */ jsx18(
        RadixRadio2.Root,
        {
          id: groupId,
          disabled,
          orientation: "horizontal",
          "aria-invalid": hasError || void 0,
          className: cn(
            "inline-flex w-fit items-center gap-1 rounded-full bg-gray-100 p-1",
            disabled && "opacity-60",
            className
          ),
          ...props,
          children: options.map((opt) => /* @__PURE__ */ jsxs15(
            RadixRadio2.Item,
            {
              value: opt.value,
              disabled: opt.disabled,
              className: cn(
                "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-body-sm font-medium text-text-tertiary transition-colors",
                "hover:text-brand",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "data-[state=checked]:bg-white data-[state=checked]:text-brand data-[state=checked]:shadow-sm"
              ),
              children: [
                opt.icon != null && /* @__PURE__ */ jsx18("span", { className: "shrink-0", children: opt.icon }),
                opt.label
              ]
            },
            opt.value
          ))
        }
      )
    }
  );
}
PillSwitch.displayName = "PillSwitch";

// src/ui/Chip.tsx
import * as React15 from "react";
import { X as X3 } from "lucide-react";
import { cva as cva4 } from "class-variance-authority";
import { jsx as jsx19, jsxs as jsxs16 } from "react/jsx-runtime";
var chipVariants = cva4(
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border font-medium transition-colors",
  {
    variants: {
      variant: {
        /* 🔴 `text-text-secondary` ไม่ใช่ `text-text-primary` — ใน `theme.css` (ชั้นที่ DS
         * ยังกินอยู่) `--color-text-primary` ถูก alias ไปที่ `--color-brand` ⇒ ชิปโทน
         * "กลาง" จะได้ตัวอักษรสีแบรนด์ตามธีมแอป ซึ่งขัดกับคำว่ากลางในตัวมันเอง
         * (บน MediHR = ครามเข้ม #0611ac · บน Mediwork = มิ้นต์ contrast 1.9 อ่านไม่ออก)
         * เหตุผลเดียวกับที่ `feedback/EmptyState.tsx` เลือก `text-secondary` ให้หัวเรื่อง
         * — รากอยู่ที่ชั้น token ไม่ใช่ที่ component ตัวใดตัวหนึ่ง */
        neutral: "border-border-default bg-white text-text-secondary",
        primary: "border-brand/20 bg-brand-subtle text-brand",
        success: "border-success-green-200 bg-success-green-50 text-success-green-800",
        warning: "border-warning-yellow-200 bg-warning-yellow-50 text-warning-yellow-800",
        danger: "border-cherry-red-200 bg-cherry-red-50 text-cherry-red-800",
        info: "border-info-blue-200 bg-info-blue-50 text-info-blue-800"
      },
      /** Background weight. `subtle` (default) = tinted pastel, unchanged from before this axis existed. `solid` = filled tone, contrast-checked text per tone. */
      fill: {
        subtle: "",
        solid: ""
      },
      size: {
        sm: "h-6 px-2 text-caption [&_svg]:size-3",
        md: "h-7 px-3 text-body-sm [&_svg]:size-3.5",
        lg: "h-8 px-3.5 text-body-sm [&_svg]:size-4"
      },
      interactive: {
        true: "cursor-pointer hover:opacity-80 active:scale-95",
        false: ""
      }
    },
    compoundVariants: [
      // solid fill overrides border/bg/text per tone — chosen shades pass WCAG AA
      // (>=4.5:1) contrast against their paired text color; verified by manual
      // luminance calc since token scale here isn't a uniform 50-900 ramp.
      {
        variant: "neutral",
        fill: "solid",
        class: "border-transparent bg-gray-800 text-white"
      },
      {
        variant: "primary",
        fill: "solid",
        class: "border-transparent bg-brand text-brand-foreground"
      },
      {
        variant: "success",
        fill: "solid",
        class: "border-transparent bg-success-green-800 text-white"
      },
      {
        // warning-yellow has no shade that clears 4.5:1 with white text (even -800
        // reads brown, not "warning"); dark text on -600 is the accessible solid.
        variant: "warning",
        fill: "solid",
        class: "border-transparent bg-warning-yellow-600 text-black"
      },
      {
        variant: "danger",
        fill: "solid",
        class: "border-transparent bg-cherry-red-800 text-white"
      },
      {
        variant: "info",
        fill: "solid",
        class: "border-transparent bg-info-blue-800 text-white"
      }
    ],
    defaultVariants: {
      variant: "neutral",
      fill: "subtle",
      size: "md",
      interactive: false
    }
  }
);
var Chip = React15.forwardRef(function Chip2({
  className,
  variant,
  fill,
  size,
  interactive,
  leftIcon,
  removable,
  onRemove,
  onClick,
  children,
  isLoading,
  ...props
}, ref) {
  const isInteractive = interactive ?? Boolean(onClick);
  const isSolid = fill === "solid";
  if (isLoading) {
    return /* @__PURE__ */ jsxs16(SkeletonBox, { shape: cn(chipVariants({ variant, fill, size, interactive })), children: [
      leftIcon,
      children
    ] });
  }
  return /* @__PURE__ */ jsxs16(
    "span",
    {
      ref,
      onClick,
      className: cn(
        chipVariants({ variant, fill, size, interactive: isInteractive }),
        className
      ),
      ...props,
      children: [
        leftIcon,
        children,
        removable && /* @__PURE__ */ jsx19(
          "button",
          {
            type: "button",
            "aria-label": "Remove",
            onClick: (e) => {
              e.stopPropagation();
              onRemove?.(e);
            },
            className: cn(
              "-mr-1 rounded-full p-0.5",
              isSolid ? "hover:bg-white/20" : "hover:bg-black/10"
            ),
            children: /* @__PURE__ */ jsx19(X3, {})
          }
        )
      ]
    }
  );
});
Chip.displayName = "Chip";

// src/ui/Avatar.tsx
import * as React16 from "react";
import * as RadixAvatar from "@radix-ui/react-avatar";
import { cva as cva5 } from "class-variance-authority";
import { jsx as jsx20, jsxs as jsxs17 } from "react/jsx-runtime";
var avatarVariants = cva5(
  "relative flex shrink-0 overflow-hidden rounded-full bg-gray-100 text-text-tertiary",
  {
    variants: {
      size: {
        xs: "size-6 text-[10px]",
        sm: "size-8 text-caption",
        md: "size-10 text-body-sm",
        lg: "size-12 text-body-md",
        xl: "size-16 text-body-lg"
      }
    },
    defaultVariants: { size: "md" }
  }
);
var avatarTones = [
  "bg-avatar-1-bg text-avatar-1-fg",
  "bg-avatar-2-bg text-avatar-2-fg",
  "bg-avatar-3-bg text-avatar-3-fg",
  "bg-avatar-4-bg text-avatar-4-fg",
  "bg-avatar-5-bg text-avatar-5-fg",
  "bg-avatar-6-bg text-avatar-6-fg"
];
function avatarToneIndex(key) {
  if (typeof key === "number") {
    return Number.isFinite(key) ? Math.abs(Math.trunc(key)) % avatarTones.length : 0;
  }
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = hash * 33 + key.charCodeAt(i) | 0;
  }
  return Math.abs(hash) % avatarTones.length;
}
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
var Avatar = React16.forwardRef(function Avatar2({ className, size, src, name, fallback, colorKey, isLoading, ...props }, ref) {
  if (isLoading) {
    return /* @__PURE__ */ jsx20(
      SkeletonBox,
      {
        className: cn(avatarVariants({ size }), "rounded-full", className)
      }
    );
  }
  return /* @__PURE__ */ jsxs17(
    RadixAvatar.Root,
    {
      ref,
      className: cn(
        avatarVariants({ size }),
        /* หลัง variant เพื่อให้ทับคู่สีเทาตั้งต้นใน `avatarVariants` ได้
           แต่ยังก่อน `className` — ผู้เรียกยังบังคับสีเองได้อยู่
           (เขียนชื่อคลาสเทาตรง ๆ ไม่ได้ — ด่านกันสีดิบสแกนคอมเมนต์ด้วย) */
        colorKey !== void 0 && avatarTones[avatarToneIndex(colorKey)],
        className
      ),
      ...props,
      children: [
        src && /* @__PURE__ */ jsx20(
          RadixAvatar.Image,
          {
            src,
            alt: name ?? "",
            className: "size-full object-cover"
          }
        ),
        /* @__PURE__ */ jsx20(
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

// src/ui/IconButton.tsx
import * as React17 from "react";
import { Slot as Slot5 } from "@radix-ui/react-slot";
import { cva as cva6 } from "class-variance-authority";
import { jsx as jsx21, jsxs as jsxs18 } from "react/jsx-runtime";
var iconButtonVariants = cva6(
  "inline-flex shrink-0 items-center justify-center rounded-full transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/50 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        ghost: "bg-transparent text-slate-600 hover:bg-gray-100 hover:text-slate-900",
        solid: "bg-brand text-brand-foreground shadow-xs hover:bg-brand-hover",
        outline: "border border-border-default bg-white text-slate-700 hover:bg-gray-50",
        "ghost-destructive": "bg-transparent text-red-600 hover:bg-red-50 hover:text-red-800"
      },
      size: {
        sm: "size-8 [&_svg:not([class*='size-'])]:size-4",
        md: "size-9 [&_svg:not([class*='size-'])]:size-4",
        lg: "size-11 [&_svg:not([class*='size-'])]:size-5"
      }
    },
    defaultVariants: {
      variant: "ghost",
      size: "md"
    }
  }
);
var Spinner4 = () => /* @__PURE__ */ jsxs18("svg", { className: "animate-spin", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: [
  /* @__PURE__ */ jsx21(
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
  /* @__PURE__ */ jsx21("path", { fill: "currentColor", d: "M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" })
] });
var IconButton = React17.forwardRef(
  ({
    className,
    variant,
    size,
    asChild = false,
    loading = false,
    isLoading = false,
    disabled,
    icon,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot5 : "button";
    const isDisabled = disabled || loading;
    if (isLoading) {
      return /* @__PURE__ */ jsx21(
        SkeletonBox,
        {
          shape: cn(iconButtonVariants({ variant, size })),
          className: "rounded-full"
        }
      );
    }
    return /* @__PURE__ */ jsx21(
      Comp,
      {
        ref,
        "data-slot": "icon-button",
        "data-loading": loading || void 0,
        className: cn(iconButtonVariants({ variant, size, className })),
        disabled: isDisabled,
        "aria-busy": loading || void 0,
        ...props,
        children: asChild ? children : loading ? /* @__PURE__ */ jsx21(Spinner4, {}) : icon ?? children
      }
    );
  }
);
IconButton.displayName = "IconButton";

// src/ui/ButtonGroup.tsx
import * as React18 from "react";
import { cva as cva7 } from "class-variance-authority";
import { jsx as jsx22, jsxs as jsxs19 } from "react/jsx-runtime";
var buttonGroupVariants = cva7("flex items-center", {
  variants: {
    align: {
      start: "justify-start",
      end: "justify-end",
      between: "justify-between",
      // mirrors ConfirmModal's `flex-1`-on-both-buttons pattern: equal-width,
      // grows to fill the container instead of sitting at natural width.
      fill: "justify-between [&>*]:flex-1"
    },
    gap: {
      sm: "gap-2",
      md: "gap-3"
    }
  },
  defaultVariants: {
    align: "end",
    gap: "md"
  }
});
var ButtonGroup = React18.forwardRef(
  ({ className, align, gap, ...props }, ref) => /* @__PURE__ */ jsx22(
    "div",
    {
      ref,
      "data-slot": "button-group",
      className: cn(buttonGroupVariants({ align, gap, className })),
      ...props
    }
  )
);
ButtonGroup.displayName = "ButtonGroup";
var ConfirmCancelActions = React18.forwardRef(
  ({
    onConfirm,
    onCancel,
    confirmLabel,
    cancelLabel,
    confirmVariant = "primary",
    cancelVariant = "secondary",
    size = "md",
    isConfirmDisabled = false,
    isCancelDisabled = false,
    isLoading = false,
    align = "end",
    gap,
    className
  }, ref) => /* @__PURE__ */ jsxs19(ButtonGroup, { ref, align, gap, className, children: [
    /* @__PURE__ */ jsx22(
      Button,
      {
        type: "button",
        variant: cancelVariant,
        size,
        onClick: onCancel,
        disabled: isCancelDisabled || isLoading,
        children: cancelLabel
      }
    ),
    /* @__PURE__ */ jsx22(
      Button,
      {
        type: "button",
        variant: confirmVariant,
        size,
        onClick: onConfirm,
        disabled: isConfirmDisabled,
        loading: isLoading,
        children: confirmLabel
      }
    )
  ] })
);
ConfirmCancelActions.displayName = "ConfirmCancelActions";

// src/ui/Text.tsx
import * as React19 from "react";
import { cva as cva8 } from "class-variance-authority";
import { jsx as jsx23 } from "react/jsx-runtime";
var textVariants = cva8("m-0", {
  variants: {
    variant: {
      caption: "text-caption",
      "body-sm": "text-body-sm",
      "body-md": "text-body-md",
      "body-lg": "text-body-lg"
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold"
    },
    tone: {
      /* 🔴 `default` = **สีเนื้อความปกติ** ไม่ใช่ `text-text-primary`
       *
       * ใน `theme.css` (ชั้นที่ DS ยังกินอยู่) `--color-text-primary` ถูก alias ไปที่
       * `--color-brand` ⇒ `<Text>` ที่ไม่ได้ส่ง tone มา — ซึ่งคือ **ส่วนใหญ่ของทุกจอ** —
       * จะได้ตัวอักษรสีแบรนด์ตามแอป (MediHR คราม · Mediwork มิ้นต์ 1.93:1 อ่านไม่ออก)
       *
       * ตอนนี้ชี้ค่าเดียวกับ `body` โดยตั้งใจ: "ไม่เลือก tone = ได้สีเนื้อความ"
       * ใครอยากได้สีแบรนด์จริง ๆ ยังมี `tone="brand"` ให้เรียกตรง ๆ อยู่แล้ว */
      default: "text-text-body",
      body: "text-text-body",
      muted: "text-text-tertiary",
      disabled: "text-text-disabled",
      brand: "text-brand",
      link: "text-text-link",
      success: "text-success-green-600",
      warning: "text-warning-yellow-600",
      danger: "text-cherry-red-600",
      /** ไม่กำหนดสี — รับจาก parent (ใช้เมื่ออยู่บนพื้นสีหรือใน component ที่คุมสีเอง) */
      inherit: ""
    },
    truncate: {
      true: "truncate",
      false: ""
    },
    /** ตัวเลขเรียงเป็นคอลัมน์ (ตาราง, สรุปยอด) ให้ความกว้างตัวเลขเท่ากันทุกตัว */
    numeric: {
      true: "tabular-nums",
      false: ""
    }
  },
  defaultVariants: {
    variant: "body-md",
    weight: "normal",
    tone: "default",
    truncate: false,
    numeric: false
  }
});
var Text = React19.forwardRef(function Text2({
  as,
  className,
  variant,
  weight,
  tone,
  truncate,
  numeric,
  isLoading,
  skeletonWidth = "100%",
  ...props
}, ref) {
  const Comp = as ?? "p";
  if (isLoading) {
    return /* @__PURE__ */ jsx23(
      SkeletonBox,
      {
        style: { width: skeletonWidth },
        className: cn(
          textVariants({ variant, weight, tone }),
          "inline-block h-[1lh] max-w-full rounded-sm align-middle",
          className
        )
      }
    );
  }
  return /* @__PURE__ */ jsx23(
    Comp,
    {
      ref,
      className: cn(
        textVariants({ variant, weight, tone, truncate, numeric }),
        className
      ),
      ...props
    }
  );
});
Text.displayName = "Text";

// src/ui/Heading.tsx
import * as React20 from "react";
import { cva as cva9 } from "class-variance-authority";
import { jsx as jsx24 } from "react/jsx-runtime";
var headingVariants = cva9("m-0 text-balance", {
  variants: {
    size: {
      "title-sm": "text-title-sm",
      "title-md": "text-title-md",
      "title-lg": "text-title-lg",
      /** สำหรับหัวข้อย่อยที่เล็กกว่า title-sm — ยังเป็นหัวข้อทางความหมาย */
      "body-lg": "text-body-lg"
    },
    weight: {
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold"
    },
    tone: {
      /* 🔴 `default` = **สีหัวข้อปกติ** ไม่ใช่ `text-text-primary` ซึ่ง `theme.css`
       * alias ไป `--color-brand` ⇒ หัวข้อทุกอันที่ไม่ได้ส่ง tone จะเปลี่ยนสีตามแอป
       * ชี้ค่าเดียวกับ `heading` โดยตั้งใจ · อยากได้สีแบรนด์ใช้ `tone="brand"` */
      default: "text-text-heading",
      heading: "text-text-heading",
      brand: "text-brand",
      inherit: ""
    }
  },
  defaultVariants: {
    size: "title-md",
    weight: "semibold",
    tone: "default"
  }
});
var Heading = React20.forwardRef(
  function Heading2({
    level = 2,
    className,
    size,
    weight,
    tone,
    isLoading,
    skeletonWidth = "16rem",
    ...props
  }, ref) {
    if (isLoading) {
      return /* @__PURE__ */ jsx24(
        SkeletonBox,
        {
          style: { width: skeletonWidth },
          className: cn(
            headingVariants({ size, weight, tone }),
            "block h-[1lh] max-w-full rounded-sm",
            className
          )
        }
      );
    }
    const Comp = `h${level}`;
    return /* @__PURE__ */ jsx24(
      Comp,
      {
        ref,
        className: cn(headingVariants({ size, weight, tone }), className),
        ...props
      }
    );
  }
);
Heading.displayName = "Heading";

// src/navigation/TopNav.tsx
import * as React24 from "react";
import { Bell, ChevronDown as ChevronDown2, LogOut, Settings } from "lucide-react";

// src/overlay/Popover.tsx
import * as React21 from "react";
import * as RadixPopover from "@radix-ui/react-popover";
import { jsx as jsx25 } from "react/jsx-runtime";
var Popover = RadixPopover.Root;
var PopoverTrigger = RadixPopover.Trigger;
var PopoverAnchor = RadixPopover.Anchor;
var PopoverClose = RadixPopover.Close;
var PopoverContent = React21.forwardRef(
  function PopoverContent2({ className, align = "start", sideOffset = 4, ...props }, ref) {
    return /* @__PURE__ */ jsx25(RadixPopover.Portal, { children: /* @__PURE__ */ jsx25(
      RadixPopover.Content,
      {
        ref,
        "data-slot": "popover-content",
        align,
        sideOffset,
        className: cn(
          /* 🔴 `pointer-events-auto` — popover ที่เปิดอยู่**ในโมดัล**จะกดไม่ได้ทั้งใบถ้าไม่มีบรรทัดนี้
           *
           * Radix `Dialog` โหมด modal ตั้ง `pointer-events: none` ที่ `<body>` แล้วเปิดคืนเฉพาะ
           * `DialogContent` · แต่ `PopoverContent` portal ออกไปอยู่ใต้ `<body>` **นอก**
           * `DialogContent` จึงสืบทอด `none` มาเต็ม ๆ ⇒ คลิกทะลุไปโดนของที่อยู่ใต้โมดัลแทน
           * (วัดสด: `elementFromPoint` ที่ตัวเลือกชั่วโมง คืนแถวตารางที่อยู่ข้างหลังโมดัล)
           *
           * ⚠️ พังเงียบสนิท — popover เปิดออกมาสวยงามครบทุกอย่าง แค่กดไม่ติด
           * ไม่มี error ไม่มี warning · เคยแก้เฉพาะจุดที่ `DatePicker` มาก่อน แล้ว `TimePicker`
           * ก็เจอเรื่องเดียวกันอีก ⇒ ย้ายมาแก้ที่ primitive ตัวนี้ให้จบทีเดียวทุกตัวที่ใช้ `Popover` */
          "pointer-events-auto z-50 rounded-sm border border-border-default bg-white p-3 shadow-lg outline-none",
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
var mediactLogoDataUrl = "data:image/svg+xml;utf8,%3Csvg width='1230' height='285' viewBox='0 0 1230 285' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_2210_105)'%3E%3Cpath d='M354 78C363.24 78 372.48 78 382 78C394.097 100.95 406.068 123.964 418 147C420.425 144.083 422.517 141.333 424.156 137.91C424.533 137.137 424.909 136.365 425.297 135.569C425.694 134.742 426.091 133.915 426.5 133.062C430.599 124.693 434.945 116.493 439.443 108.332C443.61 100.756 447.638 93.1147 451.611 85.4358C452.042 84.6049 452.474 83.774 452.918 82.918C453.297 82.1834 453.676 81.4489 454.067 80.6921C455 79 455 79 456 78C465.24 78 474.48 78 484 78C484 120.57 484 163.14 484 207C475.09 207 466.18 207 457 207C456.67 181.59 456.34 156.18 456 130C453.257 135.362 450.514 140.725 447.688 146.25C442.377 156.6 437.055 166.937 431.438 177.125C430.769 178.338 430.769 178.338 430.087 179.575C427.148 184.852 427.148 184.852 426 186C423.47 186.073 420.967 186.092 418.438 186.062C417.371 186.056 417.371 186.056 416.283 186.049C414.522 186.037 412.761 186.019 411 186C400.54 167.23 390.787 148.129 381 129C380.67 154.74 380.34 180.48 380 207C371.42 207 362.84 207 354 207C354 164.43 354 121.86 354 78Z' fill='%2306B5ED'/%3E%3Cpath d='M0 160C41.25 160 82.5 160 125 160C125 201.25 125 242.5 125 285C108.633 283.741 98.4977 280.078 87.25 268.25C79.7905 259.337 76.6566 248.412 76.8047 237.004C76.8075 236.17 76.8103 235.337 76.8133 234.478C76.8244 231.839 76.8495 229.201 76.875 226.562C76.885 224.764 76.8942 222.965 76.9023 221.166C76.9243 216.777 76.9588 212.389 77 208C76.0736 208.016 75.1473 208.031 74.1929 208.048C70.6852 208.099 67.1779 208.137 63.6699 208.165C62.165 208.18 60.6601 208.2 59.1553 208.226C41.2537 208.531 25.7257 206.192 12.2578 193.379C2.90857 183.528 0 173.486 0 160Z' fill='%2326D1B3'/%3E%3Cpath d='M159 160C200.25 160 241.5 160 284 160C284 174.097 279.931 184.501 270.297 194.859C259.093 205.301 246.125 208.158 231.219 208.098C230.52 208.096 229.821 208.095 229.101 208.093C226.9 208.088 224.7 208.075 222.5 208.062C220.995 208.057 219.49 208.053 217.984 208.049C214.323 208.038 210.661 208.021 207 208C207.016 209.028 207.031 210.055 207.048 211.114C207.103 214.983 207.137 218.852 207.165 222.722C207.18 224.386 207.2 226.05 207.226 227.714C207.483 244.432 205.618 258.882 193.812 271.812C183.83 280.926 172.353 285 159 285C159 243.75 159 202.5 159 160Z' fill='%2306B5ED'/%3E%3Cpath d='M125 0C125 41.25 125 82.5 125 125C83.75 125 42.5 125 0 125C0 110.179 3.78907 100.722 13.9453 89.9336C23.1824 81.2761 33.9955 77.6516 46.4336 77.8047C47.3115 77.8075 48.1895 77.8103 49.094 77.8133C51.8753 77.8244 54.6563 77.8495 57.4375 77.875C59.3327 77.885 61.2279 77.8942 63.123 77.9023C67.7488 77.9243 72.3744 77.9588 77 78C76.9686 76.3754 76.9686 76.3754 76.9365 74.718C76.8633 70.6384 76.8179 66.5588 76.7803 62.4788C76.7604 60.7244 76.7332 58.9702 76.6982 57.2161C76.3757 40.6017 78.4341 26.1412 90.125 13.3125C99.9887 4.16266 111.67 0 125 0Z' fill='%2306B5ED'/%3E%3Cpath d='M159 0C174.577 1.29808 185.865 4.58247 196.254 16.6094C204.202 26.972 207.183 36.7698 207.098 49.6797C207.096 50.4925 207.095 51.3052 207.093 52.1426C207.088 54.7201 207.075 57.2975 207.062 59.875C207.057 61.6302 207.053 63.3854 207.049 65.1406C207.038 69.4271 207.021 73.7135 207 78C216 78 218.004 78.0479 223.5 78C236.514 77.8867 247.5 77.5 258 82C259.348 82.6833 259.348 82.6833 260.723 83.3804C276.418 91.7047 284 108.075 284 125C242.75 125 201.5 125 159 125C159 83.75 159 42.5 159 0Z' fill='%2326D1B3'/%3E%3Cpath d='M634 78C705.018 78 705.018 78 723 91C724.031 91.7425 725.062 92.485 726.125 93.25C739.155 105.714 744.38 123.244 745 140.844C745.224 157.799 740.972 175.72 729.16 188.378C718.108 199.617 698.5 207 691 207C672.19 207 653.38 207 634 207C634 164.43 634 121.86 634 78ZM660 102C660 128.73 660 155.46 660 183C687 183 693 182.5 706.184 173.98C717 163.5 718.395 152.923 718.215 139.809C717.357 128.598 713.95 119.12 706.438 110.75C691.756 98.3428 679.884 102 660 102Z' fill='%2306B5ED'/%3E%3Cpath d='M517 78C546.37 78 575.74 78 606 78C606 85.92 606 93.84 606 102C585.54 102 565.08 102 544 102C544 111.24 544 120.48 544 130C561.49 130 578.98 130 597 130C597 137.26 597 144.52 597 152C579.51 152 562.02 152 544 152C544 162.23 544 172.46 544 183C564.79 183 585.58 183 607 183C607 190.92 607 198.84 607 207C577.3 207 547.6 207 517 207C517 164.43 517 121.86 517 78Z' fill='%2306B5ED'/%3E%3Cpath d='M912 78C920.91 78 929.82 78 939 78C950.342 108.294 961.558 138.63 972.614 169.03C973.566 171.649 974.52 174.268 975.473 176.887C976.121 178.666 976.766 180.445 977.412 182.225C979.877 188.996 982.429 195.725 985.077 202.427C986 205 986 205 986 207C976.76 207 967.52 207 958 207C956.573 202.765 955.148 198.53 953.728 194.292C953.244 192.851 952.759 191.409 952.272 189.968C951.575 187.899 950.881 185.829 950.188 183.758C949.769 182.511 949.35 181.265 948.918 179.981C948 177 948 177 948 175C933.15 175.33 918.3 175.66 903 176C899.751 185.827 899.751 185.827 896.508 195.656C895.903 197.48 895.903 197.48 895.285 199.34C894.665 201.217 894.665 201.217 894.031 203.133C893 206 893 206 892 207C890 207.088 887.998 207.107 885.996 207.098C884.781 207.094 883.566 207.091 882.314 207.088C881.035 207.08 879.756 207.071 878.438 207.062C877.154 207.058 875.871 207.053 874.549 207.049C871.366 207.037 868.183 207.021 865 207C865.634 202.062 867.093 197.638 868.859 193.012C869.156 192.221 869.453 191.43 869.758 190.614C870.408 188.884 871.06 187.155 871.714 185.426C873.523 180.644 875.315 175.854 877.109 171.066C877.496 170.037 877.883 169.007 878.281 167.945C881.368 159.713 884.418 151.467 887.453 143.215C887.683 142.589 887.914 141.963 888.151 141.318C890.213 135.711 892.274 130.103 894.333 124.495C898.693 112.621 903.065 100.752 907.562 88.9297C907.897 88.049 908.232 87.1684 908.577 86.261C910.872 80.2569 910.872 80.2569 912 78ZM925 108C922.719 114.674 920.441 121.35 918.164 128.026C917.389 130.299 916.613 132.571 915.836 134.844C914.723 138.103 913.611 141.362 912.5 144.621C911.975 146.155 911.975 146.155 911.439 147.721C911.119 148.662 910.799 149.603 910.469 150.572C910.185 151.405 909.9 152.237 909.607 153.095C908.949 154.826 908.949 154.826 909 156C919.56 156 930.12 156 941 156C939.522 149.083 939.522 149.083 937.58 142.398C937.319 141.618 937.059 140.838 936.791 140.034C936.517 139.228 936.243 138.421 935.961 137.59C935.675 136.737 935.39 135.884 935.095 135.005C934.193 132.315 933.284 129.626 932.375 126.938C931.757 125.1 931.14 123.262 930.523 121.424C929.02 116.948 927.512 112.473 926 108C925.67 108 925.34 108 925 108Z' fill='%2306B5ED'/%3E%3Cpath d='M1095.22 88.5078C1100.53 92.7771 1105.75 99.8797 1109.5 105.5C1109.5 105.5 1109.04 105.721 1106.5 107.5C1101.5 111 1106.5 107.5 1101.5 111C1100.46 111.66 1099.57 112.32 1098.5 113C1097.45 113.66 1097 113.923 1096 114.5C1095 115.077 1096 114.5 1094.5 115.5C1091 117.521 1090.5 117.979 1087 120C1085.77 118.242 1085.77 118.242 1084.38 115.875C1079.72 108.727 1074.06 104.599 1065.77 102.473C1054.41 100.534 1045.31 102.266 1035.75 108.625C1026.92 115.763 1022.82 127.495 1021.62 138.484C1021.19 151.303 1024.85 164.209 1033.66 173.809C1041.64 181.096 1049.93 183.4 1060.55 183.27C1070.31 182.507 1077.54 178.251 1084 171C1085.33 168.99 1087.65 166.766 1088.5 164.5C1097.5 169.5 1096.67 169 1101 171.5C1102.38 172.299 1102.7 172.539 1103.5 173C1104.24 173.437 1105.24 174.05 1106 174.5C1106.68 174.897 1107.8 175.591 1108.5 176C1110.06 176.918 1111 177.5 1111 177.5C1105.36 190.112 1093.4 198.882 1081 204C1065.19 209.276 1048.19 210.249 1032.65 203.559C1025.06 199.731 1018.46 195.534 1012.5 189.5C1011.56 188.597 1011.45 188.421 1010.5 187.5C998.307 174.84 993.294 156.668 993.529 139.365C994.297 121.594 1001.55 105.753 1014 93C1037.01 73.0293 1070.12 71.4802 1095.22 88.5078Z' fill='%2306B5ED'/%3E%3Cpath d='M1123 78C1158.31 78 1193.62 78 1230 78C1230 85.92 1230 93.84 1230 102C1216.8 102 1203.6 102 1190 102C1190 136.65 1190 171.3 1190 207C1181.09 207 1172.18 207 1163 207C1163 172.35 1163 137.7 1163 102C1149.8 102 1136.6 102 1123 102C1123 94.08 1123 86.16 1123 78Z' fill='%2306B5ED'/%3E%3Cpath d='M771 78C779.58 78 788.16 78 797 78C797 120.57 797 163.14 797 207C788.42 207 779.84 207 771 207C771 164.43 771 121.86 771 78Z' fill='%2306B5ED'/%3E%3Cpath d='M271 230C277.87 233.982 281.559 240.598 284 248C285.447 258.008 283.851 267.143 277.75 275.312C271.309 281.607 264.326 284.931 255.25 285.375C246.622 285.152 238.938 282.037 232.723 276.039C226.398 268.553 224.427 260.27 225.187 250.621C226.436 243.144 230.537 237.518 235.75 232.187C247.205 224.478 258.614 223.855 271 230Z' fill='%2306B5ED'/%3E%3Cpath d='M271.199 4.18346C277.161 8.19173 281.357 14.07 283.633 20.8983C285.481 31.4734 284.1 40.1273 278 48.9999C272.965 55.0763 265.798 58.3788 258.043 59.3827C249.003 59.7308 241.792 57.4921 234.688 51.8749C228.249 45.7493 225.334 38.4717 224.938 29.66C225.15 20.5994 228.292 13.5497 234.855 7.2069C245.693 -1.55381 258.976 -2.39505 271.199 4.18346Z' fill='%2326D1B3'/%3E%3Cpath d='M47.0391 5.17988C52.6571 9.36246 55.8789 15.4346 58 22.0002C59.3333 31.8933 58.2287 39.6765 52.7148 47.9221C48.3669 53.5901 42.0732 57.6839 35 59.0002C24.7554 59.9165 16.7082 58.2675 8.62499 51.7502C3.52397 46.9686 0.274776 40.7571 -0.238289 33.7424C-0.423551 24.0893 0.7062 17.7579 6.24999 9.75019C17.8541 -1.85393 33.0363 -2.92131 47.0391 5.17988Z' fill='%2306B5ED'/%3E%3Cpath d='M47.3321 231.543C52.9773 236.12 55.7341 241.202 58 248C58.7926 258.836 58.0155 266.921 51.375 275.75C46.4326 281.171 39.0557 284.45 31.8086 285.238C23.4721 285.499 15.7863 283.5 9.12502 278.312C4.04977 273.53 0.272083 266.72 -0.238259 259.742C-0.439298 249.267 0.908883 241.52 8.15627 233.57C19.5448 223.871 34.9888 223.376 47.3321 231.543Z' fill='%2326D1B3'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_2210_105'%3E%3Crect width='1230' height='285' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E";
var medi_workDataUrl = "data:image/svg+xml;utf8,%3Csvg width='515' height='515' viewBox='0 0 515 515' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M350.761 163.492C350.761 163.492 383.816 163.418 383.498 130.059C383.179 96.6915 350.132 97.5017 350.132 97.5017C350.132 97.5017 317.184 98.0255 317.502 130.836C317.821 163.647 350.77 163.5 350.77 163.5L350.761 163.492Z' fill='url(%23paint0_linear_27_21)'/%3E%3Cpath d='M340.5 282.219L391.819 179.029C391.819 179.029 463.945 153.479 462.478 223.751C436.892 274.67 411.307 325.589 385.722 376.5C370.65 345.073 355.579 313.646 340.508 282.219H340.5Z' fill='url(%23paint1_linear_27_21)'/%3E%3Cpath d='M235.3 305.5C235.3 305.5 244.737 306.422 247.653 312.998C250.033 318.341 246.812 324.526 245.154 327.691C238.312 340.737 228.563 359.485 216.226 382.5C205.314 356.833 194.411 331.167 183.5 305.5H235.292H235.3Z' fill='url(%23paint2_linear_27_21)'/%3E%3Cpath d='M168.054 97.5001C168.054 97.5001 134.5 97.2545 134.5 130.623C134.5 163.991 168.054 163.5 168.054 163.5C168.054 163.5 201.5 163.295 201.5 130.483C201.5 97.6719 168.054 97.5082 168.054 97.5082V97.5001Z' fill='url(%23paint3_linear_27_21)'/%3E%3Cpath d='M218.5 213.287L313.983 407.047C313.983 407.047 377.726 429.335 386.5 374.186L288.229 180.072C288.229 180.072 224.42 154.394 218.5 213.287Z' fill='url(%23paint4_linear_27_21)'/%3E%3Cpath d='M219.534 203.5C210.198 223.976 200.862 244.46 191.526 264.936C191.526 264.936 185.585 281.324 202.292 286.5C219.362 285.772 236.431 285.053 253.5 284.325C242.184 257.381 230.859 230.444 219.542 203.5H219.534Z' fill='%234CBFAB'/%3E%3Cpath d='M52.6005 228.147L143.308 406.321C161.109 419.83 184.056 421.082 199.732 410.151C213.787 400.358 216.858 384.361 217.5 380.449C205.883 355.474 194.265 330.508 182.64 305.533L122.288 180.562C122.288 180.562 49.4306 155.892 52.6005 228.147Z' fill='url(%23paint5_linear_27_21)'/%3E%3Cdefs%3E%3ClinearGradient id='paint0_linear_27_21' x1='332.964' y1='120.811' x2='390.992' y2='152.328' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%234DC0AC'/%3E%3Cstop offset='0.41' stop-color='%234EC0AC'/%3E%3Cstop offset='0.55' stop-color='%2355C2AF'/%3E%3Cstop offset='0.66' stop-color='%2361C6B4'/%3E%3Cstop offset='0.74' stop-color='%2372CBBB'/%3E%3Cstop offset='0.82' stop-color='%2388D2C5'/%3E%3Cstop offset='0.88' stop-color='%23A3DAD0'/%3E%3Cstop offset='0.94' stop-color='%23C3E4DE'/%3E%3Cstop offset='0.99' stop-color='%23E8EFEE'/%3E%3Cstop offset='1' stop-color='%23F1F2F2'/%3E%3C/linearGradient%3E%3ClinearGradient id='paint1_linear_27_21' x1='326.344' y1='243.653' x2='439.748' y2='288.379' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='white'/%3E%3Cstop offset='0.03' stop-color='%23E8F6F4'/%3E%3Cstop offset='0.08' stop-color='%23C3EAE3'/%3E%3Cstop offset='0.13' stop-color='%23A3DED4'/%3E%3Cstop offset='0.2' stop-color='%2388D5C7'/%3E%3Cstop offset='0.27' stop-color='%2372CDBD'/%3E%3Cstop offset='0.35' stop-color='%2361C7B5'/%3E%3Cstop offset='0.46' stop-color='%2355C3B0'/%3E%3Cstop offset='0.6' stop-color='%234EC0AC'/%3E%3Cstop offset='1' stop-color='%234DC0AC'/%3E%3C/linearGradient%3E%3ClinearGradient id='paint2_linear_27_21' x1='183.508' y1='344' x2='248.503' y2='344' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%234DC0AC'/%3E%3Cstop offset='1' stop-color='%234DC0AC'/%3E%3C/linearGradient%3E%3ClinearGradient id='paint3_linear_27_21' x1='147.525' y1='130.492' x2='214.525' y2='130.492' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%234DC0AC'/%3E%3Cstop offset='0.41' stop-color='%234EC0AC'/%3E%3Cstop offset='0.55' stop-color='%2355C2AF'/%3E%3Cstop offset='0.66' stop-color='%2361C6B4'/%3E%3Cstop offset='0.74' stop-color='%2372CBBB'/%3E%3Cstop offset='0.82' stop-color='%2388D2C5'/%3E%3Cstop offset='0.88' stop-color='%23A3DAD0'/%3E%3Cstop offset='0.94' stop-color='%23C3E4DE'/%3E%3Cstop offset='0.99' stop-color='%23E8EFEE'/%3E%3Cstop offset='1' stop-color='%23F1F2F2'/%3E%3C/linearGradient%3E%3ClinearGradient id='paint4_linear_27_21' x1='362.103' y1='279.618' x2='197.959' y2='315.401' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%234CBFAB'/%3E%3Cstop offset='0.41' stop-color='%234DBFAB'/%3E%3Cstop offset='0.55' stop-color='%2354C1AE'/%3E%3Cstop offset='0.66' stop-color='%2360C5B3'/%3E%3Cstop offset='0.74' stop-color='%2371CABB'/%3E%3Cstop offset='0.81' stop-color='%2387D1C4'/%3E%3Cstop offset='0.88' stop-color='%23A2D9D0'/%3E%3Cstop offset='0.94' stop-color='%23C2E3DE'/%3E%3Cstop offset='0.99' stop-color='%23E7EFED'/%3E%3Cstop offset='1' stop-color='%23F1F2F2'/%3E%3C/linearGradient%3E%3ClinearGradient id='paint5_linear_27_21' x1='65.0083' y1='312.263' x2='226.217' y2='277.079' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%234DC0AC'/%3E%3Cstop offset='0.4' stop-color='%234EC0AC'/%3E%3Cstop offset='0.54' stop-color='%2355C3B0'/%3E%3Cstop offset='0.65' stop-color='%2361C7B5'/%3E%3Cstop offset='0.73' stop-color='%2372CDBD'/%3E%3Cstop offset='0.8' stop-color='%2388D5C7'/%3E%3Cstop offset='0.87' stop-color='%23A3DED4'/%3E%3Cstop offset='0.92' stop-color='%23C3EAE3'/%3E%3Cstop offset='0.97' stop-color='%23E8F6F4'/%3E%3Cstop offset='1' stop-color='white'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E";
var medi_matchDataUrl = "data:image/svg+xml;utf8,%3Csvg width='515' height='515' viewBox='0 0 515 515' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50.5567 391.705C50.5567 391.705 49.4568 416.555 70.9868 417.105L92.5168 417.655C92.5168 417.655 111.847 412.685 112.947 391.705L114.047 370.725C114.047 370.725 149.197 217.395 464.477 206.885C464.477 206.885 273.627 161.675 70.1367 307.355C70.1367 307.355 50.5568 324.165 50.5468 343.045V361.925V391.715L50.5567 391.705Z' fill='%2323B5E9'/%3E%3Cpath d='M50.5267 264.745V159.355C50.5267 159.355 49.8667 135.585 66.5867 135.585H108.987C108.987 135.585 113.127 133.965 120.867 141.895C128.607 149.825 177.387 220.925 177.387 220.925C177.387 220.925 179.907 229.385 171.627 233.525C163.347 237.665 135.267 251.885 135.267 251.885C135.267 251.885 124.107 251.705 122.487 245.765L120.867 239.825C120.867 239.825 115.317 237.485 114.137 241.625C112.957 245.765 114.137 260.885 114.137 260.885L56.7967 297.425C56.7967 297.425 50.3867 300.845 50.5267 289.685C50.6667 278.525 50.5267 264.755 50.5267 264.755V264.745Z' fill='url(%23paint0_linear_27_4)'/%3E%3Cpath d='M405.947 97.3447V127.275H374.947V153.645H405.947V182.495H430.527V153.645H461.527V129.055H432.307V97.3447H405.947Z' fill='url(%23paint1_radial_27_4)'/%3E%3Cpath d='M351.337 270.695V392.235C351.337 392.235 353.787 417.795 368.467 417.655C383.147 417.515 403.537 417.655 403.537 417.655C403.537 417.655 415.237 414.255 415.237 393.865V238.885C414.497 235.075 412.867 230.075 408.897 226.045C399.247 216.255 381.597 218.455 346.397 227.265C327.437 232.015 303.287 238.705 275.447 248.095C266.217 263.245 256.977 278.385 247.747 293.535C247.747 293.535 240.997 308.215 228.467 292.715L224.097 284.555C224.097 284.555 222.467 277.215 211.857 284.555C201.257 291.895 182.497 308.945 182.497 308.945C182.497 308.945 175.077 314.865 182.497 326.175C189.917 337.485 230.967 396.395 230.967 396.395C230.967 396.395 244.657 404.135 248.227 395.795L346.517 254.175C346.517 254.175 349.507 249.005 350.987 249.535C351.887 249.855 351.807 252.205 351.757 253.575C351.607 258.095 351.467 263.515 351.337 270.685V270.695Z' fill='url(%23paint2_linear_27_4)'/%3E%3Cpath d='M311.497 196.995C313.447 196.645 316.987 196.035 321.427 195.475C330.097 194.365 360.727 191.025 386.397 188.975C386.397 188.975 392.447 188.495 394.767 185.285C395.427 184.365 395.837 183.305 395.837 183.305C396.277 182.135 396.477 180.765 396.407 178.915L395.987 168.425C395.987 168.425 395.657 160.035 385.257 160.445L374.857 160.855C374.857 160.855 364.437 160.855 364.007 149.945L363.577 139.035C363.577 139.035 362.067 130.275 356.677 130.485C351.287 130.695 341.207 129.415 336.567 138.845C331.927 148.275 308.777 187.015 308.777 187.015C308.777 187.015 302.467 195.415 311.487 196.995H311.497Z' fill='url(%23paint3_linear_27_4)'/%3E%3Cdefs%3E%3ClinearGradient id='paint0_linear_27_4' x1='87.8467' y1='216.685' x2='215.067' y2='216.685' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%2320B5E9'/%3E%3Cstop offset='0.26' stop-color='%2322B5E9'/%3E%3Cstop offset='0.4' stop-color='%232AB8E9'/%3E%3Cstop offset='0.52' stop-color='%2338BCEB'/%3E%3Cstop offset='0.62' stop-color='%234BC3ED'/%3E%3Cstop offset='0.71' stop-color='%2365CBEF'/%3E%3Cstop offset='0.79' stop-color='%2384D6F2'/%3E%3Cstop offset='0.87' stop-color='%23A9E2F6'/%3E%3Cstop offset='0.94' stop-color='%23D3F0FA'/%3E%3Cstop offset='1' stop-color='%23FDFEFE'/%3E%3C/linearGradient%3E%3CradialGradient id='paint1_radial_27_4' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='translate(416.117 143.105) scale(53.93 53.93)'%3E%3Cstop stop-color='%2323B5E9'/%3E%3Cstop offset='0.39' stop-color='%2324B5E9'/%3E%3Cstop offset='0.53' stop-color='%232BB7E9'/%3E%3Cstop offset='0.63' stop-color='%2337BBE9'/%3E%3Cstop offset='0.71' stop-color='%2348C0EA'/%3E%3Cstop offset='0.78' stop-color='%235EC6EB'/%3E%3Cstop offset='0.84' stop-color='%2379CEEC'/%3E%3Cstop offset='0.9' stop-color='%239AD8EE'/%3E%3Cstop offset='0.95' stop-color='%23BFE3EF'/%3E%3Cstop offset='0.99' stop-color='%23E8EFF1'/%3E%3Cstop offset='1' stop-color='%23F1F2F2'/%3E%3C/radialGradient%3E%3ClinearGradient id='paint2_linear_27_4' x1='343.027' y1='314.185' x2='510.067' y2='147.415' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%2323B5E9'/%3E%3Cstop offset='0.12' stop-color='%2327B6E9'/%3E%3Cstop offset='0.26' stop-color='%2336BAE9'/%3E%3Cstop offset='0.41' stop-color='%234DC1EA'/%3E%3Cstop offset='0.56' stop-color='%236ECBEC'/%3E%3Cstop offset='0.72' stop-color='%2399D7EE'/%3E%3Cstop offset='0.89' stop-color='%23CCE7F0'/%3E%3Cstop offset='0.99' stop-color='%23F1F2F2'/%3E%3C/linearGradient%3E%3ClinearGradient id='paint3_linear_27_4' x1='343.277' y1='163.735' x2='433.067' y2='163.735' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%2320B5E9'/%3E%3Cstop offset='0.16' stop-color='%2323B5E9'/%3E%3Cstop offset='0.3' stop-color='%232DB9E9'/%3E%3Cstop offset='0.43' stop-color='%233FBEEA'/%3E%3Cstop offset='0.56' stop-color='%2358C5EB'/%3E%3Cstop offset='0.68' stop-color='%2379CFEC'/%3E%3Cstop offset='0.8' stop-color='%23A0DAEE'/%3E%3Cstop offset='0.92' stop-color='%23CEE8F0'/%3E%3Cstop offset='0.99' stop-color='%23F1F2F2'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E";
var medi_hrDataUrl = "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='4.06 4.76 38.48 38.48'%3E%3Cpath d='M33.25 34.8432C33.25 35.1617 33.0552 35.4384 32.6657 35.6731C32.2762 35.891 31.7818 36 31.1826 36H29.9691C29.3998 36 28.9054 35.891 28.486 35.6731C28.0964 35.4384 27.9017 35.1617 27.9017 34.8432V29.3107C27.9017 29.1095 27.7069 29.0089 27.3174 29.0089H19.2275C18.838 29.0089 18.6433 29.1095 18.6433 29.3107V34.8432C18.6433 35.1617 18.4335 35.4384 18.014 35.6731C17.6245 35.891 17.1451 36 16.5758 36H15.3174C14.7481 36 14.2537 35.891 13.8343 35.6731C13.4448 35.4384 13.25 35.1617 13.25 34.8432V20.1568C13.25 19.8215 13.4448 19.5449 13.8343 19.3269C14.2537 19.109 14.7481 19 15.3174 19H16.5758C17.1451 19 17.6245 19.109 18.014 19.3269C18.4335 19.5449 18.6433 19.8215 18.6433 20.1568V25.6642C18.6433 25.8989 18.838 26.0163 19.2275 26.0163H27.3174C27.7069 26.0163 27.9017 25.8989 27.9017 25.6642V20.1568C27.9017 19.8215 28.0964 19.5449 28.486 19.3269C28.9054 19.109 29.3998 19 29.9691 19H31.1826C31.7818 19 32.2762 19.109 32.6657 19.3269C33.0552 19.5449 33.25 19.8215 33.25 20.1568V34.8432Z' fill='%230611ac'/%3E%3Ccircle cx='30.75' cy='14.5' r='2.5' fill='%230611ac'/%3E%3Ccircle cx='15.75' cy='14.5' r='2.5' fill='%230611ac'/%3E%3C/svg%3E";
var sidebarHideDataUrl = "data:image/svg+xml;utf8,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='512' height='512'%3E%3Cpath d='M0 0 C0.67181535 -0.00226556 1.3436307 -0.00453111 2.03580409 -0.00686532 C4.2867297 -0.01319405 6.53759492 -0.01237661 8.78852844 -0.0115509 C10.40370766 -0.01454363 12.01888616 -0.01794643 13.63406372 -0.02172852 C18.02793113 -0.03057436 22.42177906 -0.03290725 26.81565452 -0.0335443 C29.57107287 -0.034256 32.32648632 -0.03639289 35.08190346 -0.03904152 C44.72630246 -0.0483062 54.37068764 -0.05237617 64.01509094 -0.05158997 C72.947656 -0.05099315 81.88015988 -0.0614636 90.81270951 -0.07733363 C98.51588014 -0.09052208 106.21903111 -0.09576898 113.9222129 -0.09513456 C118.50662208 -0.09488228 123.09097723 -0.09757899 127.67537498 -0.10831261 C176.1530246 -0.21371055 228.45261565 1.16843331 267.3092804 34.13371277 C268.30508118 34.91101746 268.30508118 34.91101746 269.32099915 35.70402527 C296.37972511 57.54859511 306.70381498 95.88361728 310.63278961 128.84797668 C312.57692577 147.46048184 312.60766137 166.06309886 312.5779314 184.75006866 C312.57276512 189.03306299 312.57759163 193.31605001 312.58070374 197.5990448 C312.58431314 204.78314278 312.57962482 211.96719926 312.57002258 219.15129089 C312.55914396 227.38391256 312.5626717 235.61643506 312.57367539 243.84905434 C312.58283562 250.9963953 312.58399144 258.14370691 312.57879806 265.29105186 C312.57572575 269.52526339 312.57513464 273.75942877 312.58187103 277.99363708 C312.64719632 325.67855921 310.66818764 376.99178797 278.3092804 415.13371277 C277.53197571 416.12951355 277.53197571 416.12951355 276.7389679 417.14543152 C254.89332568 444.20548582 216.58496959 454.50306684 183.62573242 458.45552254 C164.4286846 460.47387414 145.21421771 460.47795492 125.93708611 460.50115848 C123.24329719 460.50485417 120.54952555 460.51111941 117.85574341 460.51815987 C108.39005244 460.54249891 98.92441508 460.55567287 89.45869446 460.55924988 C80.74441632 460.56287629 72.03049213 460.5927483 63.31632185 460.63465446 C55.74252926 460.66975217 48.16885184 460.68480499 40.59497881 460.68549591 C36.1122212 460.68627525 31.62982651 460.69437342 27.14715576 460.72349358 C-17.76662844 460.99737298 -68.83305351 456.80914811 -103.6907196 425.13371277 C-104.46995789 424.42819275 -104.46995789 424.42819275 -105.26493835 423.7084198 C-137.1274219 394.48537595 -145.88571052 350.69920473 -147.6907196 309.13371277 C-147.81977045 303.82560163 -147.83812532 298.51949795 -147.83598328 293.21012878 C-147.83898645 291.69170043 -147.84239157 290.17327283 -147.84616089 288.65484619 C-147.85489001 284.57986069 -147.85733433 280.50489627 -147.85797668 276.42990232 C-147.85869383 273.86806035 -147.86084059 271.30622353 -147.86347389 268.74438286 C-147.87269253 259.76128177 -147.8768134 250.77819539 -147.87602234 241.79508972 C-147.87542335 233.49620206 -147.88594911 225.19737977 -147.901766 216.89850861 C-147.91495969 209.71313828 -147.9202013 202.527789 -147.91956693 195.34240669 C-147.91931527 191.07787289 -147.92197783 186.81339725 -147.93274498 182.54887581 C-148.04973135 132.67076579 -145.86834596 77.70034269 -108.6907196 40.13371277 C-108.02427429 39.40668152 -107.35782898 38.67965027 -106.67118835 37.93058777 C-83.17602995 12.80313415 -45.68411686 4.84602571 -13.01469421 1.44328308 C-10.76786107 1.20493744 -10.76786107 1.20493744 -8.96364117 0.62272167 C-5.94308523 -0.02713742 -3.09045569 0.00430613 0 0 Z M13.3092804 33.13371277 C13.3092804 163.15371277 13.3092804 293.17371277 13.3092804 427.13371277 C130.25970859 439.09953567 130.25970859 439.09953567 251.3092804 396.13371277 C281.34081882 365.32683342 279.64111648 315.40872076 279.5779314 275.58581924 C279.57277037 271.29701257 279.57759025 267.00821326 279.58070374 262.71940613 C279.5843146 255.52513565 279.57962088 248.3309066 279.57002258 241.13664246 C279.55914367 232.88868481 279.56267131 224.64082615 279.57367539 216.3928709 C279.58283135 209.23622399 279.58399347 202.0796064 279.57879806 194.92295551 C279.57572347 190.68149513 279.57514132 186.44008084 279.58187103 182.19862366 C279.63952472 140.00111536 279.49435937 93.41995979 248.3092804 61.13371277 C196.21034666 10.34599381 49.7086979 33.13371277 13.3092804 33.13371277 Z M-36.6907196 38.25871277 C-37.61554138 38.48317078 -38.54036316 38.70762878 -39.49320984 38.93888855 C-64.11375049 45.14467229 -84.32028318 57.61461525 -97.81181335 79.52824402 C-116.07632626 110.62878132 -115.01379556 149.16032165 -114.95937061 184.01700211 C-114.95421631 188.36767554 -114.95902768 192.71834163 -114.96214294 197.0690155 C-114.96575568 204.36761517 -114.96105504 211.66617402 -114.95146179 218.96476746 C-114.94058251 227.33712378 -114.94411001 235.7093826 -114.9551146 244.08173656 C-114.96426509 251.3411068 -114.96543527 258.60044812 -114.96023726 265.85982227 C-114.95715975 270.16442265 -114.95658908 274.46897759 -114.96331024 278.77357483 C-115.12990191 342.90146883 -115.12990191 342.90146883 -85.13945007 397.7084198 C-68.84363235 413.74060447 -42.31836573 424.13371277 -19.6907196 424.13371277 C-19.6907196 296.09371277 -19.6907196 168.05371277 -19.6907196 36.13371277 C-25.96763251 36.13371277 -30.71252012 36.80215646 -36.6907196 38.25871277 Z ' fill='currentColor' transform='translate(173.6907196044922,25.866287231445313)'/%3E%3Cpath d='M0 0 C3.88446678 2.58964452 6.69907021 5.64814041 8.8125 9.875 C9.05078125 12.265625 9.05078125 12.265625 9.125 15.125 C9.18107422 16.52492187 9.18107422 16.52492187 9.23828125 17.953125 C8.0982435 25.7765033 0.56419334 31.37988213 -4.765625 36.6484375 C-5.6921991 37.5721817 -6.61877319 38.4959259 -7.57342529 39.44766235 C-10.02179298 41.88843985 -12.47610908 44.32314771 -14.9317627 46.7565918 C-17.44254222 49.24681285 -19.9475807 51.74279477 -22.453125 54.23828125 C-27.35901617 59.12280406 -32.27122292 64.00093135 -37.1875 68.875 C-35.70055404 72.34786748 -33.73542018 74.54959815 -31.04492188 77.18115234 C-30.19063599 78.0223764 -29.3363501 78.86360046 -28.45617676 79.73031616 C-27.53220093 80.6314212 -26.6082251 81.53252625 -25.65625 82.4609375 C-24.69910443 83.40418261 -23.74269426 84.34817449 -22.7869873 85.2928772 C-18.73506806 89.29601709 -14.67211828 93.28781912 -10.60009766 97.27050781 C-8.10590557 99.71097867 -5.62167087 102.16123032 -3.14320374 104.61766434 C-1.74253155 105.99996782 -0.33075712 107.37099239 1.08117676 108.74179077 C1.93546265 109.58931915 2.78974854 110.43684753 3.66992188 111.31005859 C4.800047 112.41781143 4.800047 112.41781143 5.95300293 113.54794312 C8.55222433 116.80072375 9.72194332 120.06386637 9.9296875 124.21875 C9.23890977 130.36890014 7.53094545 134.48606309 2.75 138.6875 C-0.45157569 140.64975607 -3.25591091 141.07888169 -6.9375 141.1875 C-8.16726563 141.24357422 -8.16726563 141.24357422 -9.421875 141.30078125 C-15.87245156 140.30768401 -20.63405266 135.87125186 -25.07519531 131.37548828 C-25.61759857 130.83834198 -26.16000183 130.30119568 -26.71884155 129.74777222 C-28.49200649 127.98770461 -30.25409471 126.21701854 -32.015625 124.4453125 C-33.25352983 123.20943106 -34.49187949 121.97399503 -35.73065186 120.73898315 C-38.31752602 118.1565182 -40.89893108 115.56874026 -43.4765625 112.97705078 C-46.77386779 109.66263674 -50.084484 106.36189856 -53.39931107 103.06501961 C-55.95613053 100.51906051 -58.50573734 97.96597475 -61.05324554 95.41070175 C-62.27102505 94.19092741 -63.49101934 92.97335992 -64.71329498 91.75809097 C-66.42203938 90.05699997 -68.12081596 88.34652598 -69.81738281 86.63330078 C-70.31924103 86.13751526 -70.82109924 85.64172974 -71.33816528 85.13092041 C-75.63962025 80.75124532 -78.60547881 76.25411604 -78.6875 70 C-78.7184375 69.21882813 -78.749375 68.43765625 -78.78125 67.6328125 C-76.70270122 57.97850042 -67.63886824 50.87055732 -60.9140625 44.16796875 C-59.70450047 42.95383851 -58.49530871 41.73933928 -57.28646851 40.52449036 C-54.76140251 37.9905273 -52.230791 35.46226792 -49.69628906 32.93774414 C-46.45757602 29.71054516 -43.23503772 26.46771561 -40.01668739 23.22022533 C-37.52722511 20.71237926 -35.02847689 18.2139492 -32.52695847 15.71813393 C-31.33503005 14.52635831 -30.14617812 13.33149716 -28.96055984 12.13344383 C-27.3003845 10.45831094 -25.62785201 8.79653723 -23.95166016 7.13745117 C-23.47039169 6.64651474 -22.98912323 6.15557831 -22.49327087 5.64976501 C-16.0683848 -0.63929441 -8.64672907 -3.05178673 0 0 Z ' fill='currentColor' transform='translate(327.1875,186.125)'/%3E%3C/svg%3E";
var sidebarShowDataUrl = "data:image/svg+xml;utf8,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' width='512' height='512'%3E%3Cpath d='M0 0 C4.27985713 0.00516709 8.55970697 0.00033947 12.83956456 -0.00277233 C20.01946638 -0.00638191 27.19932668 -0.00169336 34.37922215 0.00790882 C42.60387145 0.0187833 50.82842145 0.01526278 59.05306834 0.00425601 C66.19532944 -0.00490875 73.33756117 -0.00605777 80.47982627 -0.00086665 C84.71015729 0.00220377 88.94044214 0.0028024 93.17076993 -0.00393963 C140.94315249 -0.0694955 192.18690877 1.83530498 230.41657567 34.26865101 C231.41237645 35.0459557 231.41237645 35.0459557 232.42829442 35.83896351 C260.03453796 58.12554552 270.28658604 97.33255764 273.99368119 131.06370163 C275.24376653 143.09390929 275.56671614 155.1043941 275.56183934 167.19223499 C275.56484252 168.71066334 275.56824764 170.22909094 275.57201695 171.74751759 C275.58074607 175.82250309 275.5831904 179.89746751 275.58383274 183.97246146 C275.5845499 186.53430343 275.58669666 189.09614025 275.58932996 191.65798092 C275.5985486 200.64108201 275.60266947 209.62416839 275.6018784 218.60727406 C275.60127941 226.90616172 275.61180517 235.20498401 275.62762207 243.50385517 C275.64081575 250.6892255 275.64605737 257.87457478 275.645423 265.05995709 C275.64517134 269.32449089 275.6478339 273.58896653 275.65860105 277.85348797 C275.77065831 325.63003291 273.84456858 377.04529391 241.41657567 415.26865101 C240.63927098 416.26445179 240.63927098 416.26445179 239.84626317 417.28036976 C218.35116186 443.90621133 180.20570603 454.79148701 147.64504743 458.59216022 C128.67493322 460.49065267 109.73862011 460.56764644 90.69882584 460.53730202 C86.41850666 460.53213125 82.13819475 460.53696334 77.85787511 460.54007435 C70.67975347 460.54368212 63.50167338 460.53899942 56.32355809 460.5293932 C48.09830002 460.51851072 39.87314118 460.52204579 31.6478855 460.53304601 C24.50477062 460.54220598 17.36168511 460.5433623 10.21856624 460.53816867 C5.98772306 460.53509676 1.75692606 460.53450417 -2.47391391 460.54124165 C-50.14911972 460.60661877 -101.45026563 458.62012125 -139.58342433 426.26865101 C-140.57922511 425.49134632 -140.57922511 425.49134632 -141.59514308 424.69833851 C-168.22080202 403.20338464 -179.10703534 365.05722921 -182.90693355 332.49655628 C-184.80386537 313.53742732 -184.88243119 294.61256357 -184.85207534 275.58383274 C-184.84690377 271.30665076 -184.85173695 267.02947603 -184.85484767 262.75229359 C-184.85845562 255.5783681 -184.8537727 248.4044842 -184.84416652 241.23056507 C-184.83328818 233.01327937 -184.83681603 224.79609304 -184.84781933 216.57880974 C-184.85698384 209.44077472 -184.85813335 202.30276909 -184.85294199 195.16473007 C-184.84987196 190.9377674 -184.84927185 186.71085093 -184.85601497 182.48389149 C-184.92149331 134.81563598 -183.07543478 83.36490357 -150.58342433 45.26865101 C-149.98014308 44.5197057 -149.37686183 43.77076038 -148.75529933 42.99911976 C-125.35485411 14.92841761 -85.3383557 4.63682755 -50.49554229 1.41690159 C-33.66387161 0.01547166 -16.8753593 -0.02687347 0 0 Z M-123.58342433 64.26865101 C-149.32523992 90.67505736 -151.74264314 132.37320453 -151.728688 167.09457874 C-151.73169028 168.61448211 -151.73509521 170.13438473 -151.73886561 171.65428638 C-151.74760397 175.73752815 -151.75003946 179.82074888 -151.7506814 183.90399909 C-151.75139804 186.47001561 -151.75354388 189.03602697 -151.75617862 191.6020422 C-151.76540046 200.59695359 -151.76951774 209.59185028 -151.76872706 218.58676624 C-151.76812805 226.90098989 -151.77865335 235.21514829 -151.79447073 243.52935547 C-151.80765829 250.72403175 -151.81290627 257.91868701 -151.81227165 265.11337525 C-151.81201981 269.38515787 -151.81469312 273.65688245 -151.82544971 277.92865276 C-151.92435365 320.20895045 -151.83840869 366.91003019 -120.58342433 399.26865101 C-71.5585396 447.05968797 53.06225019 427.26865101 93.41657567 427.26865101 C93.41657567 297.24865101 93.41657567 167.22865101 93.41657567 33.26865101 C-15.88824466 23.228069 -15.88824466 23.228069 -123.58342433 64.26865101 Z M125.41657567 34.26865101 C125.41657567 163.62865101 125.41657567 292.98865101 125.41657567 426.26865101 C137.55674583 426.31455729 137.55674583 426.31455729 149.47907567 425.14365101 C150.35974706 425.01240833 151.24041844 424.88116566 152.14777684 424.74594593 C177.20611351 420.72176861 203.61161138 411.09418017 219.47907567 390.20615101 C242.84766164 356.29150338 242.74818239 315.39910235 242.68522668 275.72075748 C242.68006565 271.43195081 242.68488553 267.1431515 242.68799901 262.85434437 C242.69160987 255.66007389 242.68691615 248.46584484 242.67731786 241.2715807 C242.66643894 233.02362305 242.66996658 224.77576439 242.68097067 216.52780914 C242.69012663 209.37116223 242.69128874 202.21454464 242.68609333 195.05789375 C242.68301874 190.81643337 242.68243659 186.57501908 242.68916631 182.3335619 C242.93727223 117.84028595 242.93727223 117.84028595 212.86970067 62.69394398 C195.44165753 45.59970408 171.89783969 38.88115317 148.41657567 35.26865101 C147.59286473 35.13716663 146.7691538 35.00568226 145.92048192 34.87021351 C139.04656569 33.93687442 132.45031167 34.26865101 125.41657567 34.26865101 Z ' fill='currentColor' transform='translate(210.5834243297577,25.731348991394043)'/%3E%3Cpath d='M0 0 C3.64340491 2.05267338 6.39438667 4.54807001 9.31170654 7.49031067 C9.88483078 8.05657166 10.45795502 8.62283264 11.04844666 9.20625305 C12.92939491 11.06898939 14.79914019 12.94250751 16.66815186 14.81721497 C17.9772149 16.1217143 19.28664855 17.42584182 20.59643555 18.72961426 C23.33487047 21.45912964 26.06757283 24.19423144 28.79656982 26.93318176 C32.29072212 30.43883568 35.80049765 33.92836277 39.31495285 37.41364765 C42.02090947 40.10124417 44.71748063 42.79810535 47.4114151 45.49774742 C48.70170479 46.78819028 49.99509524 48.0755406 51.29164886 49.35968971 C53.10367292 51.156806 54.90243994 52.96624698 56.69842529 54.77937317 C57.23350204 55.30478195 57.7685788 55.83019073 58.31987 56.371521 C62.17404346 60.30296547 63.97930544 63.84072731 64.46893311 69.32112122 C64.16456907 73.84946415 63.57438793 76.98166375 60.44989014 80.36653137 C59.81561096 81.05547485 59.18133179 81.74441833 58.52783203 82.45423889 C53.70903352 87.46975463 48.83588382 92.42629981 43.92596436 97.35237122 C43.0513172 98.23125944 43.0513172 98.23125944 42.1590004 99.12790298 C39.08254144 102.21924716 36.00330172 105.30778775 32.92156982 108.39387512 C29.74623894 111.57472335 26.58031803 114.76477088 23.4164257 117.9569912 C20.97133623 120.42069865 18.51957005 122.87767805 16.06592178 125.33285904 C14.8952716 126.50653026 13.72711627 127.68269555 12.56155014 128.86141586 C10.93465307 130.50538063 9.29854035 132.13960571 7.65985107 133.77180481 C6.73276337 134.70253815 5.80567566 135.63327148 4.85049438 136.59220886 C0.64968771 140.20022109 -3.06732167 141.3097606 -8.63262939 141.14143372 C-13.92238969 140.36209518 -17.68301914 138.03690746 -21.19122314 134.07893372 C-23.73612909 128.78552934 -24.41579129 124.32957939 -22.86383057 118.71003723 C-20.60184514 112.30155638 -15.84685511 108.17570233 -11.05450439 103.54377747 C-10.09340978 102.59389534 -9.13364746 101.64266348 -8.17515564 100.69015503 C-5.66804466 98.205781 -3.14344418 95.73997035 -0.61456299 93.27778625 C1.97045869 90.75451651 4.538247 88.21383721 7.10760498 85.67463684 C12.13724058 80.70904566 17.18558869 75.76289035 22.24627686 70.82893372 C20.78765292 67.45060295 18.93753469 65.30529907 16.30316162 62.75398254 C15.49214493 61.96248306 14.68112823 61.17098358 13.84553528 60.35549927 C12.96844406 59.50755295 12.09135284 58.65960663 11.18768311 57.78596497 C9.33878694 55.9721119 7.49049859 54.1576391 5.64276123 52.34260559 C2.72952026 49.48878538 -0.18940743 46.64107138 -3.12017822 43.80525208 C-5.95049429 41.06526546 -8.75626833 38.30080323 -11.56231689 35.53596497 C-12.43738388 34.6981398 -13.31245087 33.86031464 -14.21403503 32.99710083 C-19.93034934 27.32929189 -23.69555792 22.20921665 -23.78497314 13.93830872 C-22.23979642 7.07590622 -19.94889732 3.88804596 -13.94122314 0.01643372 C-8.95358448 -1.84170618 -4.93781066 -2.0998856 0 0 Z ' fill='currentColor' transform='translate(177.75372314453125,186.1710662841797)'/%3E%3C/svg%3E";
var medi_oncloudDataUrl = "data:image/svg+xml;utf8,%3Csvg%20preserveAspectRatio%3D%22none%22%20overflow%3D%22visible%22%20style%3D%22display%3A%20block%3B%22%20width%3D%2222.732%22%20height%3D%2232.3637%22%20viewBox%3D%220%200%2022.732%2032.3637%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20id%3D%22Group%201000004110%22%3E%3Cpath%20id%3D%22Vector%22%20d%3D%22M17.1704%2031.257C13.1576%2033.1425%208.30662%2032.572%204.78137%2029.903C0.451321%2026.6249%20-1.18327%2020.6746%200.898309%2015.6584C1.97619%2013.0509%203.92109%2010.8933%206.40593%209.54852C8.16808%208.59449%2010.6172%208.01684%2012.6296%208.09851C13.3016%208.1258%2015.11%208.45611%2015.7793%208.66398C17.5576%209.2164%2020.208%2010.6668%2021.1349%2012.3473C21.638%2013.271%2021.7017%2014.5892%2021.3716%2015.5761C20.8312%2017.1906%2019.2823%2018.2319%2017.5945%2018.2491C16.2665%2018.2626%2015.6359%2017.9122%2014.6282%2017.1297C12.4095%2015.4067%209.10923%2016.377%208.28248%2019.1168C7.97823%2020.1204%208.09209%2021.2039%208.5984%2022.1226C9.72386%2024.2016%2012.2812%2024.8717%2014.2668%2023.6255C14.7261%2023.3372%2015.1638%2022.8961%2015.6508%2022.6575C17.5497%2021.7269%2020.0331%2022.3944%2021.053%2024.2944C21.5894%2025.2236%2021.6517%2026.4986%2021.3768%2027.5219C20.9806%2028.9963%2019.2151%2030.1411%2017.959%2030.8819C17.8129%2030.968%2017.333%2031.2136%2017.1704%2031.257Z%22%20fill%3D%22%230E6B8D%22%2F%3E%3Cpath%20id%3D%22Vector%2057%22%20d%3D%22M7.92048%2019.9409C7.69729%2023.2711%2010.5555%2024.2036%2012.2915%2024.2345C2.09885%2024.9005%201.63596%2016.7073%203.64291%2012.9644C4.38695%2011.5768%207.62719%208.23969%2011.4544%208.1001C15.9862%207.93482%2018.9233%2010.0236%2020.1943%2011.2879C21.1552%2012.5521%2022.0331%2015.5659%2019.7267%2017.3421C19.0722%2017.8461%2016.8846%2019.0042%2014.9577%2017.3421C14.9577%2017.3421%2013.6555%2016.3169%2012.2915%2016.2244C10.9275%2016.1319%208.14368%2016.6107%207.92048%2019.9409Z%22%20fill%3D%22%231F95C0%22%2F%3E%3Ccircle%20id%3D%22Ellipse%202840%22%20cx%3D%2217.5302%22%20cy%3D%2226.392%22%20r%3D%224.04548%22%20fill%3D%22%230E6B8D%22%2F%3E%3Ccircle%20id%3D%22Ellipse%202841%22%20cx%3D%2217.5302%22%20cy%3D%2214.0633%22%20r%3D%224.04548%22%20fill%3D%22%231F95C0%22%2F%3E%3Ccircle%20id%3D%22Ellipse%202842%22%20cx%3D%2218.6865%22%20cy%3D%224.04548%22%20r%3D%224.04548%22%20fill%3D%22%230E6B8D%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E";
var medi_referDataUrl = "data:image/svg+xml;utf8,%3Csvg%20preserveAspectRatio%3D%22none%22%20overflow%3D%22visible%22%20style%3D%22display%3A%20block%3B%22%20width%3D%2228%22%20height%3D%2226%22%20viewBox%3D%220%200%2028%2026%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20id%3D%22Frame%201171277666%22%3E%3Cpath%20id%3D%22Vector%22%20d%3D%22M4.90555%200C8.4808%200.0452555%2012.1218%200.00758422%2015.7021%200.0064136L18.5379%200.0060702C19.5493%200.00634774%2020.793%20-0.0235112%2021.7825%200.240822C23.278%200.646363%2024.6414%201.50797%2025.7186%202.72822C28.8755%206.3234%2028.7375%2012.218%2025.4204%2015.6227C24.8146%2016.2445%2024.1216%2016.7635%2023.3914%2017.1876C23.2322%2017.2799%2023.114%2017.3904%2022.9367%2017.4768C23.1485%2017.6439%2023.7003%2018.2911%2023.9249%2018.5416L26.0292%2020.8642C26.1865%2021.036%2026.363%2021.2872%2026.5027%2021.4321L26.499%2024.4406C26.499%2024.9269%2026.4844%2025.5208%2026.5017%2026H25.889L20.969%2020.5078L19.7675%2019.1737C19.4842%2018.863%2019.0485%2018.4329%2018.8373%2018.0859C18.4577%2017.4623%2018.5114%2016.3077%2019.0349%2015.7931C19.4461%2015.3889%2019.9011%2015.1468%2020.3697%2014.8432C22.1347%2013.6998%2023.8397%2012.9735%2024.4475%2010.5614C24.5671%2010.0871%2024.6548%209.58667%2024.6637%209.09421C24.6873%207.69821%2024.2135%206.34824%2023.3451%205.33764C22.4463%204.30352%2021.1261%203.70032%2019.833%203.69002C15.4869%203.65539%2011.1315%203.73786%206.78635%203.68573C6.44896%203.02488%206.11547%202.35227%205.77489%201.69535C5.47007%201.10746%205.17321%200.622154%204.90555%200Z%22%20fill%3D%22%23856215%22%2F%3E%3Cpath%20id%3D%22Vector_2%22%20d%3D%22M9.15137%207.57565C11.3027%207.54795%2013.5033%207.5742%2015.6584%207.5742L17.636%207.57304C18.1323%207.57255%2019.0816%207.53996%2019.5199%207.67469C19.9492%207.81057%2020.3123%208.13002%2020.5294%208.56281C21.0004%209.48568%2020.6728%2010.5529%2019.8834%2011.103C19.6484%2011.2668%2019.4007%2011.4057%2019.16%2011.559L17.5313%2012.6045C15.7295%2013.7763%2013.9207%2014.935%2012.1051%2016.0805C11.1977%2016.7221%2010.1405%2017.339%209.20254%2017.9465L7.94224%2018.7682C7.75943%2018.8864%207.43921%2019.1055%207.25786%2019.1858C7.28001%2018.0872%207.24689%2016.9749%207.26324%2015.875C7.26794%2015.5575%207.27211%2015.2084%207.25204%2014.8945C7.53415%2014.7515%208.05811%2014.3797%208.35851%2014.1896L11.2633%2012.3334C11.7619%2012.0116%2012.3205%2011.6031%2012.8331%2011.3392C12.1291%2011.323%2011.4217%2011.3389%2010.7151%2011.3232C10.6242%2010.9944%2010.3856%2010.6021%2010.2265%2010.2895C9.75699%209.36691%209.27937%208.53%208.84812%207.58046L9.15137%207.57565Z%22%20fill%3D%22%23856215%22%2F%3E%3Cpath%20id%3D%22Vector_3%22%20d%3D%22M0.85358%206.19182C1.09831%206.22414%201.73565%206.20677%202.00983%206.20608L4.17167%206.19707C4.80634%207.38717%205.49815%208.65173%206.09713%209.85823C6.01292%209.91745%203.01349%209.90303%202.73582%209.88088C2.39425%209.15359%201.98217%208.39725%201.61491%207.67966C1.3524%207.16678%201.08533%206.73234%200.85358%206.19182Z%22%20fill%3D%22%23856215%22%2F%3E%3Cpath%20id%3D%22Vector_4%22%20d%3D%22M6.64472%203.70063C6.68283%203.69291%206.72885%203.70434%206.76808%203.71091C6.8409%203.76092%207.95604%205.89707%208.11757%206.17736C7.64642%206.23212%206.5528%206.20569%206.03157%206.20794C6.01009%206.20934%205.9859%206.21212%205.96462%206.20827C5.81297%206.18079%204.77132%204.04799%204.56389%203.71228L6.64472%203.70063Z%22%20fill%3D%22%23856215%22%2F%3E%3Cpath%20id%3D%22Vector_5%22%20d%3D%22M0%201.25267C0.56807%201.24868%201.13688%201.24462%201.705%201.24289C1.83986%201.2425%202.13722%201.22546%202.22587%201.34203L2.2353%201.35467C2.38931%201.55848%202.49992%201.84468%202.62358%202.0777C2.90153%202.60135%203.16322%203.19888%203.49419%203.67971C2.83532%203.72225%201.8897%203.69093%201.20745%203.68691C1.0637%203.35947%200.908823%203.03818%200.743202%202.72371C0.591302%202.4404%200.0676404%201.52622%200%201.25267Z%22%20fill%3D%22%23856215%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E";
var medi_payDataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFsAAABpCAYAAABVhF8/AAAb5UlEQVR4nO19C7RkZXXmt///P6de99H39rvpph9IgygYngIDEhTjRGLGKMTFyqiZhEmYxDWaSeZhZsY1JGEcM04eOkYzWTgLUTGaGR3FMTjICOIQkTaCYAM23bT0g37dR9+6VXUe/79n7f/cC11/dVfd6ntpLt2916pbq27VOXVqn332v/e3v70PMTOOJfIeEcFaizRNYfIuHz4OMW4h9wZkcFBKQxlNSimgZLCYpO1ocutgtYLJHDIF2Kd289jd34F9cCvs3nGozLZtTBy8Jgp2H7yPdiFqP3cqOJXh/hS7ru+zV7aCMYa11uChKrBqCez6pSitXwVsWI/KuZuQrRwgqxXrzJEyCsoBxipAM+RJjMywvMaCCh1p2fJbXJYjz3Le/+f/A+kXHoBJcsgnWspBad2XsokC5WBhle2t9wjRRnlFzT7ySINyC505lKChQDhcJfBZK7Hs4vPAV56H+HXnAtWIEtJcY0WaCQ4Widao4CVU9pTNWB9uYd/7Pwn3vacxaXJEDJR1BJvlHcrWgbJCl6QC7VGfyg6V2cuyrctf+J88DzsgZ4ecimcuG/nBQGoBa1GKqjg0WsLA9Vdi6c9dAbd5A3EEREoDDlA6POIFVHZrssEH/83tGL93C6JyCcrmcIrAzsFoDWddX8oOzg3QcTKwoJZNwf4S14IcYsVE4MxCaQMn+9AKpBQozxGzQeqARkQYvvAiuPdcg+rrN1NMGrTAPp9SZkQ5Q1zU/i/dz4dv/TwaeYpBFaEZuAHtHcqxf2yHssJ/BKKC/Xe838OSEWxvEGg7kF6G6ggo5UB28UYM3PwWmMsuItLkv1cxw2lRPnt3JLtSHWtUd6GMGZYtTCPjJ2+8FXhmH6YjYNRqJHItnULKzoh9EBCL25RdvekCjPzzG9BavwpDaURsWA66WBPA0OGl1EOUtt6n8dTWXYi37QcZjYjJf/GpJuUM0NUyplzqT1vpni3Y/+7bYD7/bUxxk4lJFgZv0ccTtSrKHSJWVP/BNrRiQmZzjIhVu/ZI41SQZix/UoxGFb+8TEcRhg8lmPzIncj/xccxfXCMCUXEQ31atQgl7ECOsf+Pv8jjd97XPbrocVn3WsBUTzfTfoJ7+cTQrYXS83iC7TvzhEBWj2LoP/wTxJed741czgjNJFPlVC6N7oG5IutAlhFHUfcvOi3A7kOo/86ncPhvv8u5y/xCKXF5ySmkpd6WrvwJkrhydKAtIeiWxp+qkmrAJi3kH7wdfNe93ILjA9p5RRlv6t1FSVrbVJaHLzj7tLJ7CIERJwkSlWL8o3eCbr8Pg1ZiIvZhYy8x8pkhCSYv3gR9zhk8/Pjz+KluYQXHaAQ+jsPYKVhEbZAjFue8iw/l0Ie2v3bB/ijw6bbDxwYxQrCIhcdjwu2D98OfG7FCZhSima+Z+G+fwcBgxvZdb4HOHWmvzWP7/rajWfab1+N5k2GUSjgULzAkdxKKalmk//FLoG9tQXQESnrMzx/5Yvm1F9EZ7/xZ1JMGaj6qb5fTPr1dBM6djhjjt96B5vadPBvtCCR9NGnTaFLWWP4vb8DIDdfA5XnHh08rGx1urpID0fgUGh/6NOr1undEovSjBRgdEGtDMVfrGfZ/9pvY9ZffQDyVwCiNumaUghOmdLhD11exgIL3ZbFue191nvAjJfz2kk+ji//L5ezjX1Ye8ZNIwqgi1hdgTQ7F9EhMZlzwMSX06bVfvBTRrbdQnCs45aBNCEkfeQYYyOGQynkhDbuvgYl7/h/yB7ci2/487HSrfeM+la2DtzuSjBAGpO7K7kiqiP13cCtF3mhBkHhZemRhk9/ptMO0YRgQBhMg6QHq9avsTDks/chvg667mMCEsu6i7CYcKr5UUWwoq7kcT5bl/ix1wiXdgaEenwYH4YENopUQkg0lvFTl5FPu2LYy5EmG6rNjOPTYT5A8/CQaTzyL2sRhfwJUHCFzuU9IFlLZsSVg7QjKX/h9UGWYyqWoi2XPQK0SN4qima2/5CQxliivVOqA/9GPcMdr7qr88P1QVOAGmIpgUZJo2VKuC+tyrkrMeqjO+x78O7S+cD/o0Z/CRaonatevsl3ukJoUK979NpgP3ESR+K1jKvskF7YOrTxD/duPc/qJu5HueA55TKg2U2SGO+L+DukB6WrKYU2ENI6w+gsfQrzuDBLku6kcKi7MIk5yYQKiUozBN15AS+/4XQz8s1+ASRlJNe5IyI5HclJwjRRDDYtDt9+NXLBvYq9o+e5TStmpUt5PS02VBks0css/ohWfej9KA0Pg7mvxnIRzwkClBptnwDceht5+gH0BhsWduVNL2eWsqLAkLoeRemRuYa58DS39yw+gfPa6ee+/qsqYbrUwbnJU0hxjd30bKTFL2CmR1inls0OxonqW+J/QfG4f7/vAx+Ce2gUVK+TIoZ2ZF34ejQxi+JsfRknXqN57RTi5RVvPy4Fji8q6lbTstptRWb7UZ4ZlO3+GTmtsEq37HwMrhzjqKP6fYqJ8OCZ0NZ9XRK9ZT7V/dxMkA2xE81d2HMdwX33E81aktHNKKzshiVDIJ74Si+jEYeDai0nd9AaY1vxRz1Qx7ENPolVPmIS3goUWWXlnstHMMXJnwXkOtuwXJEmSJFMUvCJj6+EB8Z3yQM9Hd3E5wzlG01k0crAkGS1nkYhjDghGIiXhf0itShU4iRG4QBOW3vw26OXLfHLHijwmlBlB08MHtz2chH5HPHRDYuwUlS0/BinXTqycr+TWQguLNLeoOCCR9BmEVMs6LNgEIbYgIcLAEqxyYGcLRMV/oocU3JhjivMsJ7l8IziyJOlwOSNPkJSIQIrn3UQSTaFw0IoRKt90Lacf/yKaeYZWuYS4kYDj/tQl++MkxYEtT2DVtZcurLINa3+wmdEC/ZDKGPFUxm7bLhx6YgfMjgPYt/cAT+85AK43ETUyb7Cz0G2vy0zN1PuO+f5ABdGm1TA/ez5WXX81pkfLiBVTDIVYsooeeYuHB8StsMXoDVfj6c9/FUvGUkzDoUYaUkDv142McISJ7//Erw0LGvoleY6IFNId+3nXfY/Afecp7Ht6B+KJFgZZo2VzCEVX7F0uUXLOI3ezD8G+uomS8KGLyJVTS/1FAx6tYfh9v4iV77iWmhV4V6B099PpnPOhoHYKiUux56N38pK7vocxTnxNTRbSYIu2Vzo4m6nRWNbIcHA4xvoHP0H9WXZq4WIh8DhPXY7E55L2GIE73OJD9z2GvV95EPaRbSg1cmSxmqHdGjT80egj6oAErV5ExbxbDbQtVIG2n9YjeFLWoTmrj4k6DvzB5zC99yBv/K23o1WJqBcF+AWIV4s/jzF67RXY/9mHoHWELHI+Hj9SCrjr2DVR4hyp1tCIYH+8h/tSdisCyg6oOHGH4kAV8umEd33977D/9ntQ3jUJaiSIyzGSoRiqtQA5cDdItQepxiOon7wHewerWHnz9X2T28uv3oR01RCqe8cRS9DSJ4U4zzyijrTRBA6O9eezS1YVi5q4gszi8Ld+xFv/+C4MPTOBShxjWs5+JfK4t27mxY99OYUZU8MlpB//GuKrz+dl523o74gGI9Kb1zDtGe8XTX6B0UVKw1iL5u79/YV+YkiphEo7D/CO3/sL3v6+T2JwV8NTHiZk/UktLBfYQxHKLaxwnyQiAZzcVMO3raR/dU/f36cUYfCcDVCx6aBPz0W0Uj5Ci0mhua+HZQuY7xdnYe17Kn6E9P6t/P3bPoclW8eRlQ0ywQOMgpFn8an+mFTxFPhYFegnD3kloU/u4Aa2H25Y2HHB5i2h9ZoY03JiHngCjfEGm6EqNbXjoZYjKne/sDPKubR+JSZaOXSlBM7Dul67XwrPv3IF9tKILEYn6z0sm4oDzkhBcYQ9X3yAH3vfn2HpEwcwtuTEd2JxD8sO35/lccij1WqBt+3yNcrYMWEO6TgRUVQtAbGZqVj1J1ZidiVEeqA13eihbLbQRIinwdv+69383L/9HLjBmK4ZVCeaPb9soakP3Of+PKxJ5Kv2Etalew556y+TOgqbqlOIFaJKCc4UBPh+xaoiy1TSFJUKEbPblxEhShnbPv2/sf/PvganSyAykKSsWVGLTtkcvC8KzrLMP4sIwpcoJ8UTXyKbU8JqNBLpiuueTx19e1OcZK9HHyIHfZA5McrSTOVpCgZ7Pnsfj//p3ZgulVDJBXxUYvCQTQv2xZF7Dy9N291Hq+DjoQ8O/qECn+16+PQYGnmWII2U7xtKVwxjKLMkeOdciJBi2a6VodIiT2BClnfnKobHkzg0I+O5KzoqtVt2rhglaWfTAqBonvzmj/jpP/kS6iWFarL4uX8cWPZhadcoxahkgBsoYcm5Z/qkzGflc/DBAi/VD0zCEXd0ys1FPH/bsu/m4GqgbOHQQw5CKcRPHcCjH7kLA2O5t7g87xcZwMvuZrTQoW3qWzLia86HGhmQAI7lkpCwrJcImSd7ZrfPfAWG6Fc8bCvooHij5cPtyo7YslWMtJnxU3/0WUTPTmFysIQlLUJWi15xyq5kgmcY1I3D+l//Bd/OUhb+vxUH1fv75CRNPP0sUrHM47FsKbl5GFchGh1q99mEKrEG9t31AKYf3OW5clEKTGgB1qVUH+zsaHtv21/Aj6aQLla8nlV0HqRpIdOCg5TUBolGVdot2Pq2uiiO0SSN6HATKz94I0qvWln0NMoHY0ErOiV11luwKFZAq+ZYg8uP78FhzjGQG+SmP/65JIAq1qg1HXj9ynZly6prDrb4uU99HVOUoPoS14I1U0dM3H0B7d4hPBY7xIJhQ6NVb/h+xtFbfh7L3nsdNUrgwR5Jt2wrwrpIyurf/zGSVoJSFIPD1X0O4ktuucOEyrF607p2Zcdk8Mx/vxfxnmYRWLzE3XlOYjCfoaqj09FUDyDKdwS9KMOtgjI2hRTx+hXYcMvbMfDOKyiLHA/mksj0OCCeAfwF1XSEia981y+k0rMv7rVfoZkJF1OrB8FLB4LQb/8kP/+5+zFR1lhSt7C9yG7zFFcyPvGYfYRZWu8O33YF5ENDqGxcgzVvuhAr/+FliIfL1DKMasLUih3KPXA3cUuZDEaAxvT2XTz90BMYMhGSJIGNdQcLt5eIcUSOsGzzBpiyIdNii5JMKYgVdv7NI6B6hihmzy92QdwquX5XfDm3PnzU0ubnKxNZkRhYWf0N1OZlWHPlz6B04QYs2Xwm1PKyP/tKa5LFyB2H9RwpOu403bJ8f1lcyxzEFpWa1Do8f8f/RZQVtVREBZIZxuahMYQUNi3VnTxD7eJzYGFgjPwjJkQth2e+/ACGrJBWBErt/8c6ozwfmlsyikIOToNiIL7mVdjwm9dj+fmbSKbbNNhySykM+dL2EQe3AHy7+YiEaAKeCdA/9vWHPLm+r6bUQKKMMRUDGy4811MljDjw3Cgc+t7TrHaMeRYmZbmfQKCC4S09D1ZQNrFio9Egh8rSKjbf+h4MX/daMi6D1QQnvOjcUlkmHJjFNVbIaYXylOW//8gdWNIEmvPkHngvt3E59NlrYH31Hsr7on1/uwUqkxU9w4AQrY4D+RcvoLXCZN7C0te+Cq/52LtR3bCG5JQpU0Im3DplfJnJE2Rm3dKMxXjLmofMl1Yjp/4nd3wF0SM7MGakKjU/y26Rw5rXXwAerpAYoXHGgaYsTz70uEe3pOTlgX8nfrvd8igouLrgMiv5CjRhyfoVuODj70V502p/dLN7KUmq3L7HtlcLPJKpp2ScwgqfxWrm3KJ176NofvJeNCPyWAr6xM+ly1cW+jwvJvqkxmHkzZcIudK3oCipdKc7D+DQnkPzzvBScT/G4rw//FXo9Stf7qJYbxEIVccy8oMmH9uO7X90J0w99YXjWnYc+LmSxTUvOqWMwtCGNcgu3YSSJThrYaTScuCxnTDSzdPDtHopXFLjle94PaKrz/IuYbGPHtAwmMozzu99FAd/73ZU8hz1ikIWKUxAEqRggx5uJHPWr1dyxds8x4obr0GjZFCtJ2wGYpJuOT78o2dRQtnTZLspN0w6Qh9mjMHaf/oWcJ5Aq3IwyG7xSdbI2H36XjzzF1/264hPZqAw0AQmTVHSapOw+zrUj1beuqXha2R0BNHbr0A5dZSXI6TsWHrAiH80wakp8Nv2fQdxpAAnR0g8k1QIQC6KHr5qM+L1y0lTMrNtf8t56ucvFaB98dyf5FIznVmoJVXOBXsv8H8kUnhVGrllRJbR3L6b9/6nr2L3d3+AYV1GIniIDwykFxSInGewt+2/o34Q4PdRrjDlMqxIgOi9b8DwcO2FnyDqNVLM3b97rzf9fhcoIUeKCGiTSPD+cz+DTOes5PTKRdJn6BTLNl5bMz+u7wo9e1aq72UBeRKRXPpC6ozEn4rreG6cd9x5D3Z/5X5Q3WGJqfhuZknH588yZQw5jbEza7joXW/qeNdQYpFM1gtl92lKwkYVV+J5esZg8NKNfqCVZFLlI9hOc5XEFERMUVUBTPW3vRS/mZ1cnySIYp2Za5bJ1lPe98MnkX3tcex4cAuWTDuMNEk4icizzF/6nsE6z1FNgoomWYqz3v9eTA/HGAzeN43xSY6VwmTS8rBkXzsHIzIGaZZhZHgEQ2uXU0m6hH2BtH83EDvptmpyc3wK2VTTp//9SDHm0yGvN7g1WUfzmYN46tFtnD+5C+ZgHalTGHDCaCUcLhNqvk+SirZq+a55mrY0K62+4gIM/fxl5EtmgQJMNJZh2hJqOvKW0Xbw4Y8JfFjEZRkM6Dtbm6sGX4ij57ouJuwQSSHIAeNbnuJ9f/1DPP/dv4eeaHiP39F+3VGTRI+JmC/+J6XI93Xk/hAZsW+wlZROFb5YZrd2FkGDlwEwJqF4HEFPtWAHSqhWCQO//3ZESiFRwvFrF+Or0GG0PkfxLsRXj4Fqtdr39iZNkU85fvhT/wvuMw+hbjOMqBIok3bu+WeUL7UIFXkiS7CsWkEy3cDK37kB1XM3kNAkjJzBAAI2fkLBcRBQRApFi8IZ0XEM9MqnLD92y8dgH94N4hiVGmFaqAdRgbNIs+ZLKZ15Q49YLxCh2pWNwYGsgTW/dBVW/+M3UwOONRkygiB2ZJhCkfJnof+DLUK+mSD+GANNusmT//5vcOD7P/UnynGGuGmhtWD8wiJSLwlfsC9l91ih04hQywnVczfijH91IxJDqDlNuZTrjrKtEYxaVu5E+v6COLqjxTj0oZFGZqXhvjKn1XCaLdcsqEHM03f/AIf+zyMoR8V8U4mEZvHxgifIPfFz19On91kTDY43/D7ZnRjAkDOYMBY6Z5TXLMPQR38VasUAlWbCOSnyHi2OPqHdYlWrKfFN84a23v4NvNJE5nBnFYNDnEBHBnq0hsH//B4sOWcddaT2R5ETmlCTnzyv2W0/iHTrft8buJgldDMtGZSY5BjIJIwrYf1/+Q1UL91MupHzVFVhsIffOaGWnWk/6YbGfrwTzZnpNot5aGMH6Se1GLAKycalOPMTv42By8+hxDlOK0SDQmvrId69iIH5+loHD6L99dEWLN//TTIWureyIq0xRczJ4WloK5lmUOMMCedB6BRKT58ehLThTCiBKrphHdI2KORIZQkmlf5Ni/yCNXjdH/wa6PwVPoyvzh7kHCjIJxaXs4ySTC6MDUuMGsYvHdbdb76+wFJSBhM28X2VkkANXncxNn3oV5CsrGI48dXkvuSEKtvNxOSVtUs9iHU8Y5FPpNQV48xmhLEKY/n7rscZv/5WiowAXMJqZZSwiJWdFXgK185ah9JwDelhMY/Fa9mDTcbYlRvx2g++C6XXnkHM0isk/ZrSxCqcvP72Z5xgvCz9iiV03PNHKsBdKUqCK8yMcZvDl2lOEVNMrVVVLL/ufN775e8JEAonvlGlcNxuKx1Yjeru0zuaVoNoJ+QqllH00OfSnRDFQJb4261Ia8vwyAhW/MbVWPfL16E5YEjuW0Md/PMFteyFvcyJit5yyew33vJW7Pnmo+BJGZau0dJaeEJdZaEtf1waQlmjKlN10tQv2NVaFetuugorfu2N4KVDMiGfpDmAFqAi3V3ZHbNf5keIV2IZM1efOXsZnfevf5m//YefwYpmBCP0hhMc/i1LDBKdo8HTGF23HKM3vRlrf+kK5CvKUiQkzlyRVcugARnQMk/j69Oy59l94FgmRnKNQSXrMHzjhbi2leHRD9/lbz5UNGmfOMuujyqsuOYSbLr+Qiy7/ByoakTiKthaP8BdKMaJzAoUMr2AYvNcQqSsWdwAzTfud79Ljw5a3a2QxKVRoee4w0LIKAHsC5K0VqhxQvHNV+GSV6/lZz/8PzG+dYfcycfTCxIhkodxdxgnu05u3Wy6UKwjxdQWyQGM9NGww+B5Z2DgkvVYdtlm1K46B+Vy2d/0TUC1Wbxe+/vRvDiTpNAF5i0va/1byXAK5zDw+jU4769/C+kPn8PO7/wQ6dPPozbeRBJMfOwcRh68m8tdljTK0mxVraIyUoJePozShlUYWLcMQ+dsBCpEeezQdAlXdZWOl+30ilN2QkJA92ks5ZHj6PINdP4l64uOA881DDbopQ95vxij5y+CKe3YzPQNi1VLbCVVf7kSq5aI1cyck5l+yZNa2SWpVwpc4BQiVaVUCaFzlmqbIuox3yNcUIUYOev2xYUMushrULB2SaiEWCf3SvMkCyMDMQpFYw5T3RdCDGS1lUkYZDumKEixoV3CgxECe7Fw5AEWPifRVIAzM94ilnM/c/pL+mjF5x73gTnGP2SUkj7qJ178PSfCshd3vnySyWlln0A5rewTKEYGfEscaj32Hd5LrP3D4QwnWeYlyZQztvig/8Unpy37BMppZZ9AOa3sEyim0HdBhBQ2Z/ckov2ldMEKPiFk29ku3dMyxwxyMVa4TyY5bY6LxrIXN4fmFSfGJRnkhu4pMuhgWmhHL3ZAPhAWa7NsMNRMgGzhJ+2cbGJk5IMgbzIDSdC2bhJavnBkZLCgb7SMTnukXqJMpYSGTXveCfpoks/M/RMI01YWe9fjyy9qeMUymGp5Tvl2yH2TqghmRu2v3njmiTjeV7SobEDR8lcPA7YEy+S5GlLLkGePmRzxcGTaHvI/yjWyssLIZStf7t+y6EXZKMd5N74J5OwLE23ELXTcm/EoIpB8zeag5THWXf26E3LAr2RRWjlseusFqF26HGnqb7v5wuzSXsKsMRU1cOXvvhNu+CWecXQSiFJJzsko44233YSRkRE/vmGuBVBpET37bf8Aa99xGWkXUNVOS4coUxmgqirR6EVr6aq/+hWYtRXELcFJjJQl/UAp6UVJtcIU5+DEgRK5HUqMDde/BpffdgOysmWd99eweipK29086siYtzXw8J98DTu/sQWc1lDKpFugaNCU/u+Gnka6VuOam9+Gs979BuJy5u/5qxFTvxTaU1rZLm/B+RlRhKmtB3jXt7Zh3092on7gECITYXjDGmy8fDNWX/MqJMPCbCru/uy7QyUMPO21565sGQ/hXINNpChnoc6Qb2mWapiMnpOZd36EnJPBGWLpqujElbZouTP0PCm1OMnl/wORC/Z3Q7qARAAAAABJRU5ErkJggg==";

// src/overlay/AppShowcaseDialog.tsx
import * as React23 from "react";
import { createPortal } from "react-dom";

// src/overlay/ContactSupportDialog.tsx
import { MessageCircle, Phone } from "lucide-react";

// src/overlay/Dialog.tsx
import * as React22 from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { X as X4 } from "lucide-react";
import { jsx as jsx26, jsxs as jsxs20 } from "react/jsx-runtime";
var Dialog = RadixDialog.Root;
var DialogTrigger = RadixDialog.Trigger;
var DialogPortal = RadixDialog.Portal;
var DialogClose = RadixDialog.Close;
var DialogOverlay = React22.forwardRef(function DialogOverlay2({ className, ...props }, ref) {
  return /* @__PURE__ */ jsx26(
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
var DialogContent = React22.forwardRef(
  function DialogContent2({ className, children, size = "md", showClose = true, ...props }, ref) {
    return /* @__PURE__ */ jsxs20(DialogPortal, { children: [
      /* @__PURE__ */ jsx26(DialogOverlay, {}),
      /* @__PURE__ */ jsxs20(
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
            showClose && /* @__PURE__ */ jsx26(
              RadixDialog.Close,
              {
                "aria-label": "Close",
                className: "absolute right-4 top-4 rounded-sm p-1 text-text-tertiary opacity-70 transition-opacity hover:bg-black/5 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-brand/30",
                children: /* @__PURE__ */ jsx26(X4, { className: "size-4" })
              }
            )
          ]
        }
      )
    ] });
  }
);
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx26(
  "div",
  {
    className: cn("flex flex-col gap-1.5 pb-4 pr-6", className),
    ...props
  }
);
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsx26(
  "div",
  {
    className: cn(
      "flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end",
      className
    ),
    ...props
  }
);
var DialogTitle = React22.forwardRef(function DialogTitle2({ className, ...props }, ref) {
  return /* @__PURE__ */ jsx26(
    RadixDialog.Title,
    {
      ref,
      className: cn(
        "m-0 text-body-lg font-semibold text-text-black",
        className
      ),
      ...props
    }
  );
});
var DialogDescription = React22.forwardRef(function DialogDescription2({ className, ...props }, ref) {
  return /* @__PURE__ */ jsx26(
    RadixDialog.Description,
    {
      ref,
      className: cn("m-0 text-body-sm text-text-body", className),
      ...props
    }
  );
});
DialogOverlay.displayName = "DialogOverlay";
DialogContent.displayName = "DialogContent";
DialogTitle.displayName = "DialogTitle";
DialogDescription.displayName = "DialogDescription";

// src/overlay/ContactSupportDialog.tsx
import { jsx as jsx27, jsxs as jsxs21 } from "react/jsx-runtime";
var MEDIACT_LINE_URL = "https://line.me/R/ti/p/@019bdeqs";
var MEDIACT_LINE_HANDLE = "@mediact";
var MEDIACT_SUPPORT_PHONE = "+66 94 124 9291";
var LINE_BRAND_GREEN = "#06C755";
var LINE_BRAND_GREEN_HOVER = "#05b34e";
var MEDIACT_LOGO_TEAL = "#14b8a6";
var MEDIACT_LOGO_TEAL_HOVER = "#0d9488";
var LineIcon = () => /* @__PURE__ */ jsx27(
  "svg",
  {
    className: "size-4 shrink-0",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": "true",
    children: /* @__PURE__ */ jsx27("path", { d: "M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61V9.863h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.105.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" })
  }
);
var SupportCard = ({
  icon,
  title,
  description,
  action
}) => /* @__PURE__ */ jsxs21("div", { className: "flex flex-col items-center gap-3 rounded-3xl border border-border-default p-6 text-center", children: [
  /* @__PURE__ */ jsx27("span", { className: "flex size-14 items-center justify-center rounded-full bg-info-blue-50 text-info-blue-primary", children: icon }),
  /* @__PURE__ */ jsx27(Text, { variant: "body-md", weight: "bold", tone: "body", children: title }),
  /* @__PURE__ */ jsx27(Text, { variant: "body-sm", tone: "muted", className: "leading-relaxed text-balance", children: description }),
  /* @__PURE__ */ jsx27("div", { className: "mt-auto pt-1", children: action })
] });
function ContactSupportDialog({
  open,
  onOpenChange,
  labels,
  logo,
  lineUrl = MEDIACT_LINE_URL,
  lineHandle = MEDIACT_LINE_HANDLE,
  phoneNumber = MEDIACT_SUPPORT_PHONE,
  className
}) {
  return /* @__PURE__ */ jsx27(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs21(
    DialogContent,
    {
      onOpenAutoFocus: (event) => event.preventDefault(),
      className: cn("max-w-[640px] rounded-2xl p-8", className),
      children: [
        /* @__PURE__ */ jsxs21("div", { className: "mb-6 flex flex-col items-center gap-3", children: [
          logo,
          /* @__PURE__ */ jsx27(DialogTitle, { className: "text-title-sm font-bold", children: labels.title }),
          /* @__PURE__ */ jsx27(DialogDescription, { className: "sr-only", children: labels.title })
        ] }),
        /* @__PURE__ */ jsxs21("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsx27(
            SupportCard,
            {
              icon: /* @__PURE__ */ jsx27(MessageCircle, { className: "size-7" }),
              title: labels.lineTitle,
              description: labels.lineDescription,
              action: (
                /* 🔴 `#06C755` เป็นสีแบรนด์ของ LINE ไม่ใช่สีของระบบเรา — เป็น hex ตรง ๆ
                 * โดยตั้งใจ token แทนไม่ได้ และห้ามเพี้ยนตามธีมของแอป */
                /* @__PURE__ */ jsxs21(
                  "a",
                  {
                    href: lineUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    style: {
                      "--line-brand": LINE_BRAND_GREEN,
                      "--line-brand-hover": LINE_BRAND_GREEN_HOVER
                    },
                    className: "inline-flex items-center gap-2 rounded-lg bg-[var(--line-brand)] px-4 py-2 text-body-sm font-medium text-text-inverse transition-colors hover:bg-[var(--line-brand-hover)]",
                    children: [
                      /* @__PURE__ */ jsx27(LineIcon, {}),
                      lineHandle
                    ]
                  }
                )
              )
            }
          ),
          /* @__PURE__ */ jsx27(
            SupportCard,
            {
              icon: /* @__PURE__ */ jsx27(Phone, { className: "size-7" }),
              title: labels.phoneTitle,
              description: labels.phoneDescription,
              action: (
                /* 🔴 เขียวน้ำทะเลของ **โลโก้ MediAct** ไม่ใช่สีแบรนด์ของแอป — ทั้งกล่องนี้
                 * พูดในนามบริษัท ถ้าให้ตามธีม เบอร์จะเป็นครามใน MediHR แต่เขียวมิ้นต์ใน
                 * Mediwork ทั้งที่เป็นเบอร์เดียวกัน */
                /* @__PURE__ */ jsx27(
                  "a",
                  {
                    href: `tel:${phoneNumber.replace(/\s/g, "")}`,
                    style: {
                      "--logo-teal": MEDIACT_LOGO_TEAL,
                      "--logo-teal-hover": MEDIACT_LOGO_TEAL_HOVER
                    },
                    className: "text-body-lg font-semibold text-[var(--logo-teal)] transition-colors hover:text-[var(--logo-teal-hover)]",
                    children: phoneNumber
                  }
                )
              )
            }
          )
        ] })
      ]
    }
  ) });
}

// src/overlay/AppShowcaseDialog.tsx
import { jsx as jsx28, jsxs as jsxs22 } from "react/jsx-runtime";
var CLOSE_LABEL = {
  th: "\u0E1B\u0E34\u0E14",
  en: "Close"
};
var SHOWCASE_COPY = {
  medihr: {
    th: {
      name: "Medi HR",
      headline: '\u0E1A\u0E23\u0E34\u0E2B\u0E32\u0E23\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23\u0E07\u0E48\u0E32\u0E22\u0E02\u0E36\u0E49\u0E19\u0E14\u0E49\u0E27\u0E22\n"\u0E1F\u0E35\u0E40\u0E08\u0E2D\u0E23\u0E4C\u0E23\u0E30\u0E1A\u0E1A\u0E1A\u0E23\u0E34\u0E2B\u0E32\u0E23\u0E07\u0E32\u0E19\u0E1A\u0E38\u0E04\u0E04\u0E25"',
      description: "\u0E1A\u0E23\u0E34\u0E2B\u0E32\u0E23\u0E41\u0E25\u0E30\u0E27\u0E34\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1A\u0E38\u0E04\u0E25\u0E32\u0E01\u0E23\u0E44\u0E14\u0E49\u0E08\u0E1A\u0E43\u0E19\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E14\u0E35\u0E22\u0E27\n\u0E2A\u0E19\u0E43\u0E08\u0E15\u0E34\u0E14\u0E15\u0E31\u0E49\u0E07\u0E23\u0E30\u0E1A\u0E1A\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D\u0E40\u0E23\u0E32\u0E44\u0E14\u0E49\u0E17\u0E31\u0E19\u0E17\u0E35"
    },
    en: {
      name: "Medi HR",
      headline: "Run people operations more easily with the HR management feature",
      description: "Manage and analyse your personnel data on a single screen. Contact us to get it set up."
    }
  },
  medioncloud: {
    th: {
      name: "Medi On cloud",
      headline: '\u0E1B\u0E23\u0E36\u0E01\u0E29\u0E32\u0E40\u0E04\u0E2A\u0E1C\u0E39\u0E49\u0E1B\u0E48\u0E27\u0E22\u0E17\u0E32\u0E07\u0E44\u0E01\u0E25\u0E14\u0E49\u0E27\u0E22\n"\u0E1F\u0E35\u0E40\u0E08\u0E2D\u0E23\u0E4C\u0E23\u0E31\u0E1A\u0E1B\u0E23\u0E36\u0E01\u0E29\u0E32\u0E41\u0E1E\u0E17\u0E22\u0E4C"',
      description: "\u0E43\u0E2B\u0E49\u0E41\u0E1E\u0E17\u0E22\u0E4C\u0E23\u0E31\u0E1A\u0E41\u0E25\u0E30\u0E43\u0E2B\u0E49\u0E04\u0E33\u0E1B\u0E23\u0E36\u0E01\u0E29\u0E32\u0E40\u0E04\u0E2A\u0E1C\u0E39\u0E49\u0E1B\u0E48\u0E27\u0E22\u0E17\u0E32\u0E07\u0E44\u0E01\u0E25\u0E1C\u0E48\u0E32\u0E19\n\u0E27\u0E34\u0E14\u0E35\u0E42\u0E2D\u0E04\u0E2D\u0E25 \u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E40\u0E04\u0E2A\u0E41\u0E25\u0E30\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E1C\u0E39\u0E49\u0E1B\u0E48\u0E27\u0E22\n\u0E2A\u0E19\u0E43\u0E08\u0E15\u0E34\u0E14\u0E15\u0E31\u0E49\u0E07\u0E23\u0E30\u0E1A\u0E1A \u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D\u0E40\u0E23\u0E32\u0E44\u0E14\u0E49\u0E17\u0E31\u0E19\u0E17\u0E35"
    },
    en: {
      name: "Medi On cloud",
      headline: "Consult on patient cases remotely with the doctor-consult feature",
      description: "Let doctors accept and advise on patient cases remotely over video call, with the case data and patient history at hand. Contact us to get it set up."
    }
  },
  medirefer: {
    th: {
      name: "Medi Refer",
      headline: '\u0E1A\u0E23\u0E34\u0E2B\u0E32\u0E23\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23\u0E07\u0E48\u0E32\u0E22\u0E02\u0E36\u0E49\u0E19\u0E14\u0E49\u0E27\u0E22\n"\u0E1F\u0E35\u0E40\u0E08\u0E2D\u0E23\u0E4C\u0E41\u0E14\u0E0A\u0E1A\u0E2D\u0E23\u0E4C\u0E14\u0E23\u0E31\u0E1A\u0E15\u0E31\u0E27\u0E1C\u0E39\u0E49\u0E1B\u0E48\u0E27\u0E22"',
      description: "\u0E27\u0E34\u0E40\u0E04\u0E23\u0E32\u0E30\u0E2B\u0E4C\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E01\u0E32\u0E23\u0E23\u0E31\u0E1A\u0E15\u0E31\u0E27\u0E1C\u0E39\u0E49\u0E1B\u0E48\u0E27\u0E22\u0E44\u0E14\u0E49\u0E08\u0E1A\u0E43\u0E19\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E14\u0E35\u0E22\u0E27\n\u0E2A\u0E19\u0E43\u0E08\u0E15\u0E34\u0E14\u0E15\u0E31\u0E49\u0E07\u0E23\u0E30\u0E1A\u0E1A\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D\u0E40\u0E23\u0E32\u0E44\u0E14\u0E49\u0E17\u0E31\u0E19\u0E17\u0E35"
    },
    en: {
      name: "Medi Refer",
      headline: "Run referrals more easily with the patient-intake dashboard",
      description: "Analyse your patient-intake data on a single screen. Contact us to get it set up."
    }
  },
  medipay: {
    th: {
      name: "Medi Pay",
      headline: '\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E2A\u0E27\u0E31\u0E2A\u0E14\u0E34\u0E01\u0E32\u0E23\u0E43\u0E2B\u0E49\u0E1E\u0E19\u0E31\u0E01\u0E07\u0E32\u0E19\u0E14\u0E49\u0E27\u0E22\n"\u0E1F\u0E35\u0E40\u0E08\u0E2D\u0E23\u0E4C\u0E40\u0E1A\u0E34\u0E01\u0E40\u0E07\u0E34\u0E19\u0E40\u0E14\u0E37\u0E2D\u0E19\u0E25\u0E48\u0E27\u0E07\u0E2B\u0E19\u0E49\u0E32"',
      description: "\u0E43\u0E2B\u0E49\u0E1E\u0E19\u0E31\u0E01\u0E07\u0E32\u0E19\u0E40\u0E1A\u0E34\u0E01\u0E04\u0E48\u0E32\u0E08\u0E49\u0E32\u0E07\u0E17\u0E35\u0E48\u0E17\u0E33\u0E07\u0E32\u0E19\u0E44\u0E1B\u0E41\u0E25\u0E49\u0E27\u0E25\u0E48\u0E27\u0E07\u0E2B\u0E19\u0E49\u0E32\u0E44\u0E14\u0E49\u0E40\u0E2D\u0E07\n\u0E14\u0E39\u0E41\u0E25\u0E30\u0E2D\u0E19\u0E38\u0E21\u0E31\u0E15\u0E34\u0E04\u0E33\u0E02\u0E2D\u0E44\u0E14\u0E49\u0E08\u0E1A\u0E43\u0E19\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E14\u0E35\u0E22\u0E27 \u0E2A\u0E19\u0E43\u0E08\u0E15\u0E34\u0E14\u0E15\u0E31\u0E49\u0E07\u0E23\u0E30\u0E1A\u0E1A\n\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D\u0E40\u0E23\u0E32\u0E44\u0E14\u0E49\u0E17\u0E31\u0E19\u0E17\u0E35"
    },
    en: {
      name: "Medi Pay",
      headline: "Add an earned-wage access benefit for your staff",
      description: "Let staff draw the wages they have already worked for, and review and approve every request on one screen. Contact us to get it set up."
    }
  }
};
var SHOWCASE_LAYOUT = {
  medihr: {
    logoHeight: 45,
    columnX: 610.436,
    columnWidth: 284,
    preview: {
      width: 578.436,
      height: 400.855,
      wide: { x: 197, y: 0, width: 381.436, height: 280.779 },
      card: { x: 0, y: 120.076, width: 381.436, height: 280.779 }
    }
  },
  medioncloud: {
    logoHeight: 49,
    columnX: 571,
    /* คอลัมน์ขวากว้าง 293 (ไม่ใช่ 284 เหมือนอีก 3 แบบ) */
    columnWidth: 293,
    preview: {
      width: 523.034,
      height: 393,
      wide: { x: 70.631, y: 0, width: 452.403, height: 356.055 },
      card: { x: 0, y: 84.757, width: 141.263, height: 308.243 }
    }
  },
  /* Figma node 2967:35789 — ⚠️ ภาพของแบบนี้ **ไม่ได้ขนาดเดียวกับ HR** ทั้งภาพหลังและภาพซ้อน
   * (รอบแรกยกค่าของ HR มาใช้แล้วเปลี่ยนแค่ `x` ⇒ ภาพผิดขนาดทั้งสองใบ) */
  medirefer: {
    logoHeight: 46,
    columnX: 594,
    columnWidth: 284,
    preview: {
      width: 562,
      height: 414.474,
      wide: { x: 91, y: 0, width: 471, height: 325 },
      card: { x: 0, y: 154.83, width: 253.048, height: 259.644 }
    }
  },
  /* Figma node 3012:45681 — แบบอ้างอิงที่ใช้วัดทรงกลางของหน้าต่างทั้งหมด */
  medipay: {
    logoHeight: 45.75,
    columnX: 577.668,
    columnWidth: 284,
    preview: {
      width: 545.665,
      height: 358.997,
      wide: { x: 86.96, y: 0, width: 458.705, height: 311.856 },
      card: { x: 0, y: 115.64, width: 232.549, height: 243.357 }
    }
  }
};
var CONTENT_WIDTH = 864;
var CONTENT_HEIGHT = 393;
var LINE_BUTTON_GREEN = "#02B902";
var PHONE_BUTTON_BLUE = "#06B5ED";
var HEADLINE_INK = "#191c1e";
var DESCRIPTION_INK = "#434654";
var BUTTON_INK = "#ffffff";
var PHONE_BUTTON_LABEL = `@${MEDIACT_SUPPORT_PHONE}`;
var PHONE_HREF = `tel:${MEDIACT_SUPPORT_PHONE.replace(/\s/g, "")}`;
var defaultAssets = (key, baseUrl) => ({
  logo: `${baseUrl}/${key}-logo.png`,
  wide: `${baseUrl}/${key}-preview-wide.webp`,
  card: `${baseUrl}/${key}-preview-card.webp`
});
var PreviewImage = ({
  box,
  src,
  alt
}) => (
  /* ไม่มีมุมโค้ง/เงา — ที่เห็นในแบบเป็นของในภาพหน้าจอเอง ไม่ใช่สไตล์ที่ Figma ใส่ให้กรอบ */
  /* @__PURE__ */ jsx28(
    "img",
    {
      src,
      alt,
      "aria-hidden": "true",
      className: "absolute max-w-none object-cover",
      style: { left: box.x, top: box.y, width: box.width, height: box.height }
    }
  )
);
function AppShowcaseDialog({
  app,
  onClose,
  locale = "th",
  assetBaseUrl = "/images/app-showcase",
  assets,
  className
}) {
  React23.useEffect(() => {
    if (!app) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [app, onClose]);
  if (!app) return null;
  if (typeof document === "undefined") return null;
  const copy = SHOWCASE_COPY[app][locale];
  const layout = SHOWCASE_LAYOUT[app];
  const asset = assets?.[app] ?? defaultAssets(app, assetBaseUrl);
  return createPortal(
    /* 🔴 z ต้องเหนือ **1310** ซึ่งเป็นค่าของปุ่มผู้ช่วย AI บน Portal (วัดจากจอจริง)
     * ไม่งั้นปุ่มนั้นลอยอยู่เหนือหน้าต่างและไม่โดนเบลอ */
    /* @__PURE__ */ jsx28(
      "div",
      {
        className: "fixed inset-0 z-[1400] flex items-center justify-center overflow-auto bg-white/20 p-4 backdrop-blur-[5px]",
        onClick: onClose,
        role: "presentation",
        children: /* @__PURE__ */ jsxs22(
          "div",
          {
            className: cn(
              "relative h-[467px] w-[944px] shrink-0 rounded-[20px] bg-white drop-shadow-[0px_0px_5px_rgba(0,0,0,0.25)]",
              className
            ),
            role: "dialog",
            "aria-modal": "true",
            "aria-label": copy.name,
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsx28(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  "aria-label": CLOSE_LABEL[locale],
                  className: "absolute right-[21px] top-[17px] flex size-6 cursor-pointer items-center justify-center rounded-sm text-text-tertiary transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30",
                  children: /* @__PURE__ */ jsx28("svg", { viewBox: "0 0 24 24", fill: "none", className: "size-6", "aria-hidden": "true", children: /* @__PURE__ */ jsx28(
                    "path",
                    {
                      d: "M6 6l12 12M18 6L6 18",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      strokeLinecap: "round"
                    }
                  ) })
                }
              ),
              /* @__PURE__ */ jsxs22(
                "div",
                {
                  className: "absolute left-10 top-10",
                  style: { width: CONTENT_WIDTH, height: CONTENT_HEIGHT },
                  children: [
                    /* @__PURE__ */ jsxs22(
                      "div",
                      {
                        className: "absolute left-0 top-1/2 -translate-y-1/2",
                        style: { width: layout.preview.width, height: layout.preview.height },
                        children: [
                          /* @__PURE__ */ jsx28(PreviewImage, { box: layout.preview.wide, src: asset.wide, alt: copy.name }),
                          /* @__PURE__ */ jsx28(PreviewImage, { box: layout.preview.card, src: asset.card, alt: copy.name })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxs22(
                      "div",
                      {
                        className: "absolute top-1/2 -translate-y-1/2",
                        style: { left: layout.columnX, width: layout.columnWidth },
                        children: [
                          /* @__PURE__ */ jsx28(
                            "img",
                            {
                              src: asset.logo,
                              alt: copy.name,
                              className: "w-auto max-w-none object-contain",
                              style: { height: layout.logoHeight }
                            }
                          ),
                          /* @__PURE__ */ jsx28(
                            "h2",
                            {
                              className: "mt-2 whitespace-pre-line text-[20px] font-semibold leading-[1.4]",
                              style: { color: HEADLINE_INK },
                              children: copy.headline
                            }
                          ),
                          /* @__PURE__ */ jsx28(
                            "p",
                            {
                              className: "mt-6 w-[327.58px] max-w-none whitespace-pre-line pl-[4.58px] text-[14px] leading-[1.25]",
                              style: { color: DESCRIPTION_INK },
                              children: copy.description
                            }
                          ),
                          /* @__PURE__ */ jsxs22("div", { className: "mt-4 flex flex-col gap-2", children: [
                            /* @__PURE__ */ jsxs22(
                              "a",
                              {
                                href: MEDIACT_LINE_URL,
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className: "flex h-[47px] w-[173px] items-center gap-2 rounded-[8px] bg-[var(--ds-showcase-line)] p-4 text-[12px] font-medium leading-[20px] tracking-[0.7px] text-[var(--ds-showcase-ink)] transition-opacity hover:opacity-90",
                                style: {
                                  "--ds-showcase-line": LINE_BUTTON_GREEN,
                                  "--ds-showcase-ink": BUTTON_INK
                                },
                                children: [
                                  /* @__PURE__ */ jsx28(LineBadgeIcon, {}),
                                  MEDIACT_LINE_HANDLE
                                ]
                              }
                            ),
                            /* @__PURE__ */ jsxs22(
                              "a",
                              {
                                href: PHONE_HREF,
                                className: "flex h-[47px] w-[173px] items-center gap-2 rounded-[8px] bg-[var(--ds-showcase-phone)] p-4 text-[12px] font-medium leading-[20px] text-[var(--ds-showcase-ink)] transition-opacity hover:opacity-90",
                                style: {
                                  "--ds-showcase-phone": PHONE_BUTTON_BLUE,
                                  "--ds-showcase-ink": BUTTON_INK
                                },
                                children: [
                                  /* @__PURE__ */ jsx28(PhoneBadgeIcon, {}),
                                  PHONE_BUTTON_LABEL
                                ]
                              }
                            )
                          ] })
                        ]
                      }
                    )
                  ]
                }
              )
            ]
          }
        )
      }
    ),
    document.body
  );
}
var LineBadgeIcon = () => /* @__PURE__ */ jsxs22(
  "svg",
  {
    viewBox: "0 0 32 32",
    fill: "none",
    className: "size-8 shrink-0",
    "aria-hidden": "true",
    style: {
      "--ds-showcase-line-mark": LINE_BUTTON_GREEN,
      "--ds-showcase-line-bubble": BUTTON_INK
    },
    children: [
      /* @__PURE__ */ jsx28(
        "path",
        {
          d: "M30 14.4979C30 8.15792 23.7199 3 15.9999 3C8.28094 3 2 8.15792 2 14.4979C2 20.1817 6.98063 24.9417 13.7084 25.8418C14.1644 25.9412 14.7849 26.146 14.9419 26.5404C15.0831 26.8986 15.0342 27.4598 14.987 27.8216C14.987 27.8216 14.8227 28.8214 14.7873 29.0343C14.7264 29.3926 14.5061 30.4353 15.9999 29.7981C17.4942 29.1609 24.0626 24.9935 26.9998 21.572C29.0287 19.3204 30 17.0353 30 14.4979Z",
          fill: "var(--ds-showcase-line-bubble)"
        }
      ),
      /* @__PURE__ */ jsx28(
        "path",
        {
          d: "M13.1553 11.4244H12.1733C12.0228 11.4244 11.9004 11.5478 11.9004 11.6995V17.866C11.9004 18.0179 12.0228 18.1411 12.1733 18.1411H13.1553C13.3059 18.1411 13.428 18.0179 13.428 17.866V11.6995C13.428 11.5478 13.3059 11.4244 13.1553 11.4244Z",
          fill: "var(--ds-showcase-line-mark)"
        }
      ),
      /* @__PURE__ */ jsx28(
        "path",
        {
          d: "M19.9147 11.4244H18.9327C18.7821 11.4244 18.66 11.5478 18.66 11.6995V15.3631L15.8645 11.5467C15.8128 11.4683 15.729 11.4295 15.6375 11.4244H14.6558C14.5052 11.4244 14.3828 11.5478 14.3828 11.6995V17.866C14.3828 18.0179 14.5052 18.1411 14.6558 18.1411H15.6375C15.7883 18.1411 15.9104 18.0179 15.9104 17.866V14.2035L18.7094 18.0247C18.7597 18.0967 18.845 18.1411 18.9327 18.1411H19.9147C20.0655 18.1411 20.1874 18.0179 20.1874 17.866V11.6995C20.1874 11.5478 20.0655 11.4244 19.9147 11.4244Z",
          fill: "var(--ds-showcase-line-mark)"
        }
      ),
      /* @__PURE__ */ jsx28(
        "path",
        {
          d: "M10.7884 16.597H8.12013V11.6999C8.12013 11.5477 7.99802 11.4242 7.84773 11.4242H6.86545C6.71489 11.4242 6.59277 11.5477 6.59277 11.6999V17.8653C6.59277 18.015 6.71435 18.1412 6.86518 18.1412H10.7884C10.9389 18.1412 11.0605 18.0175 11.0605 17.8653V16.8727C11.0605 16.7205 10.9389 16.597 10.7884 16.597Z",
          fill: "var(--ds-showcase-line-mark)"
        }
      ),
      /* @__PURE__ */ jsx28(
        "path",
        {
          d: "M25.3377 12.9684C25.4883 12.9684 25.6098 12.8453 25.6098 12.6928V11.7001C25.6098 11.5479 25.4883 11.4242 25.3377 11.4242H21.4148C21.2641 11.4242 21.1421 11.5502 21.1421 11.6999V17.8656C21.1421 18.0148 21.2638 18.1412 21.4142 18.1412H25.3377C25.4883 18.1412 25.6098 18.0175 25.6098 17.8656V16.8727C25.6098 16.7207 25.4883 16.597 25.3377 16.597H22.6697V15.5547H25.3377C25.4883 15.5547 25.6098 15.4313 25.6098 15.2791V14.2864C25.6098 14.1342 25.4883 14.0105 25.3377 14.0105H22.6697V12.9684H25.3377Z",
          fill: "var(--ds-showcase-line-mark)"
        }
      )
    ]
  }
);
var PhoneBadgeIcon = () => /* @__PURE__ */ jsx28("svg", { viewBox: "0 0 24 24", fill: "none", className: "size-6 shrink-0", "aria-hidden": "true", children: /* @__PURE__ */ jsx28(
  "path",
  {
    d: "M6.62 10.79C8.06 13.62 10.38 15.93 13.21 17.38L15.41 15.18C15.68 14.91 16.08 14.82 16.43 14.94C17.55 15.31 18.76 15.51 20 15.51C20.55 15.51 21 15.96 21 16.51V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z",
    fill: "currentColor"
  }
) });

// src/navigation/TopNav.tsx
import { Fragment as Fragment6, jsx as jsx29, jsxs as jsxs23 } from "react/jsx-runtime";
var TopNav = React24.forwardRef(function TopNav2({ className, floating, children, ...props }, ref) {
  return /* @__PURE__ */ jsx29(
    "header",
    {
      ref,
      className: cn(
        /* 📐 วัดจาก Portal: สูง **72** (`h-18`) · pad-x **20** · มุม 15
         * · เส้นคั่น **ด้านล่างอย่างเดียว** `gray-100` ไม่ใช่กรอบรอบด้าน · เงา `md`
         * ของเดิมเป็น 64 / pad 16 / กรอบรอบด้าน / เงา `sm` — ไม่ตรงสักข้อ */
        "flex h-18 w-full items-center gap-2 rounded-[15px] border-b border-gray-100 bg-white px-5 shadow-md",
        floating && "sticky top-0 z-30",
        className
      ),
      ...props,
      children
    }
  );
});
var TopNavToggle = React24.forwardRef(
  function TopNavToggle2({
    className,
    collapsed = false,
    onToggle,
    labels = { expand: "Expand menu", collapse: "Collapse menu" },
    ...props
  }, ref) {
    const name = collapsed ? labels.expand : labels.collapse;
    return /* @__PURE__ */ jsx29(
      "button",
      {
        ref,
        type: "button",
        onClick: () => onToggle?.(!collapsed),
        title: name,
        "aria-label": name,
        "aria-expanded": !collapsed,
        className: cn(
          /* สีเดียวกับปุ่มไอคอนอีกสามตัวในแถบ (`iconButtonClass`) — ของเดิม `text-gray-700`
           * ให้ `#6b747e` (theme.css ประกาศไว้จริง วัดยืนยันแล้ว) ซึ่งต่างจากปุ่มข้าง ๆ
           * โดยไม่มีเหตุผล · `text-text-body` เป็น token ตรง ๆ ไม่ต้องพึ่งชื่อที่ชนกับ Tailwind */
          "inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-text-body transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
          className
        ),
        ...props,
        children: /* @__PURE__ */ jsx29(
          "img",
          {
            src: collapsed ? sidebarShowDataUrl : sidebarHideDataUrl,
            alt: "",
            "aria-hidden": true,
            className: "size-5"
          }
        )
      }
    );
  }
);
var TopNavBrand = React24.forwardRef(
  function TopNavBrand2({ className, logo, children, ...props }, ref) {
    return /* @__PURE__ */ jsxs23(
      "div",
      {
        ref,
        className: cn("flex items-center gap-3 truncate", className),
        ...props,
        children: [
          logo && /* @__PURE__ */ jsx29("span", { className: "shrink-0", children: logo }),
          /* @__PURE__ */ jsx29("span", { className: "truncate text-[18px] font-bold text-text-heading", children })
        ]
      }
    );
  }
);
var TopNavSpacer = ({ className }) => /* @__PURE__ */ jsx29("div", { className: cn("flex-1", className), "aria-hidden": "true" });
var iconButtonClass = "inline-flex size-11 shrink-0 items-center justify-center rounded-full text-text-body transition-colors hover:bg-gray-50 hover:text-text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 [&_svg]:size-7";
var DEFAULT_APP_DEFS = {
  mediwork: { label: "Medi Work", src: medi_workDataUrl },
  medimatch: { label: "Medi Match", src: medi_matchDataUrl },
  medihr: { label: "Medi HR", src: medi_hrDataUrl },
  medioncloud: {
    label: "Medi On cloud",
    src: medi_oncloudDataUrl,
    inkScale: 0.625
  },
  medirefer: { label: "Medi Refer", src: medi_referDataUrl, inkScale: 0.667 },
  medipay: { label: "Medi Pay", src: medi_payDataUrl, inkScale: 0.625 }
};
var DEFAULT_APP_ORDER = [
  "mediwork",
  "medimatch",
  "medihr",
  "medioncloud",
  "medirefer",
  "medipay"
];
var SHOWCASE_KEYS = /* @__PURE__ */ new Set([
  "medihr",
  "medioncloud",
  "medirefer",
  "medipay"
]);
var isShowcaseKey = (key) => SHOWCASE_KEYS.has(key);
var settingsActionClass = "mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-info-blue-50 py-3 text-[15px] font-medium text-info-blue-800 transition-colors hover:bg-info-blue-100 [&_svg]:size-5";
var NineDotIcon = (props) => /* @__PURE__ */ jsx29(
  "svg",
  {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": "true",
    ...props,
    children: [5, 12, 19].flatMap(
      (cy) => [5, 12, 19].map((cx) => /* @__PURE__ */ jsx29("circle", { cx, cy, r: "2.4" }, `${cx}-${cy}`))
    )
  }
);
function AppLauncher({
  apps,
  order = DEFAULT_APP_ORDER,
  onAppClick,
  label = "Apps",
  comingSoonText = "Coming Soon",
  showcaseLocale = "th",
  showcaseAssetBaseUrl,
  showcaseAssets,
  settingsAction,
  className
}) {
  const visible = order.filter((key) => apps[key] != null);
  const [showcase, setShowcase] = React24.useState(null);
  return /* @__PURE__ */ jsxs23(Popover, { children: [
    /* @__PURE__ */ jsx29(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsx29(
      "button",
      {
        type: "button",
        "aria-label": label,
        className: cn(iconButtonClass, className),
        children: /* @__PURE__ */ jsx29(NineDotIcon, {})
      }
    ) }),
    /* @__PURE__ */ jsxs23(
      PopoverContent,
      {
        align: "end",
        sideOffset: 16,
        className: "w-[340px] rounded-3xl border border-gray-50 p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)]",
        children: [
          /* @__PURE__ */ jsx29("div", { className: "mb-6 flex items-center justify-center border-b border-gray-200 pb-4", children: /* @__PURE__ */ jsx29(
            "img",
            {
              src: mediactLogoDataUrl,
              alt: "MediAct",
              className: "h-6 w-[100px] object-contain"
            }
          ) }),
          /* @__PURE__ */ jsx29("div", { className: "grid grid-cols-3 gap-x-2 gap-y-6", children: visible.map((key) => {
            const config = apps[key];
            const def = DEFAULT_APP_DEFS[key];
            return /* @__PURE__ */ jsx29(
              AppLauncherTile,
              {
                appKey: key,
                config,
                label: config.label ?? def.label,
                icon: config.icon ?? /* @__PURE__ */ jsx29(
                  "img",
                  {
                    src: def.src,
                    alt: def.label,
                    className: "size-full min-h-0 object-contain",
                    style: def.inkScale ? {
                      width: `${def.inkScale * 100}%`,
                      height: `${def.inkScale * 100}%`
                    } : void 0
                  }
                ),
                comingSoonText,
                onClick: onAppClick,
                onShowcase: config.showcase && isShowcaseKey(key) ? () => setShowcase(key) : void 0
              },
              key
            );
          }) }),
          settingsAction && /* ทรง/สีอยู่ที่ `settingsActionClass` — เหตุผลของสีฟ้าคงที่เขียนไว้ที่นั่น */
          /* @__PURE__ */ jsx29(PopoverClose, { asChild: true, children: settingsAction.href ? /* @__PURE__ */ jsxs23(
            "a",
            {
              href: settingsAction.href,
              onClick: settingsAction.onClick,
              className: settingsActionClass,
              children: [
                /* @__PURE__ */ jsx29(Settings, { "aria-hidden": true }),
                settingsAction.label
              ]
            }
          ) : /* @__PURE__ */ jsxs23(
            "button",
            {
              type: "button",
              onClick: settingsAction.onClick,
              className: settingsActionClass,
              children: [
                /* @__PURE__ */ jsx29(Settings, { "aria-hidden": true }),
                settingsAction.label
              ]
            }
          ) })
        ]
      }
    ),
    /* @__PURE__ */ jsx29(
      AppShowcaseDialog,
      {
        app: showcase,
        onClose: () => setShowcase(null),
        locale: showcaseLocale,
        assetBaseUrl: showcaseAssetBaseUrl,
        assets: showcaseAssets
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
  onClick,
  onShowcase
}) {
  const isComingSoon = !!config.comingSoon;
  const disabled = config.disabled || isComingSoon || !config.baseUrl && !onClick && !onShowcase;
  const tileClass = cn(
    "group flex flex-col items-center justify-start text-center",
    !disabled && "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 rounded-md",
    disabled && "cursor-not-allowed"
  );
  const iconBox = /* @__PURE__ */ jsx29(
    "span",
    {
      className: cn(
        "mb-2 flex size-12 items-center justify-center rounded-xl border border-gray-100 bg-white transition-transform",
        !disabled && "group-hover:scale-105",
        config.active && !disabled && "ring-2 ring-brand/40",
        config.disabled && "opacity-50 grayscale"
      ),
      children: /* @__PURE__ */ jsx29("span", { className: "flex size-8 items-center justify-center [&_img]:size-full [&_img]:object-contain", children: icon })
    }
  );
  const labelEl = /* @__PURE__ */ jsxs23(Fragment6, { children: [
    /* @__PURE__ */ jsx29("span", { className: "text-[13px] font-medium text-text-body", children: label }),
    isComingSoon && /* @__PURE__ */ jsx29("span", { className: "mt-0.5 text-[10px] text-gray-400", children: comingSoonText })
  ] });
  if (disabled) {
    return /* @__PURE__ */ jsxs23("div", { className: tileClass, "aria-disabled": "true", children: [
      iconBox,
      labelEl
    ] });
  }
  if (onShowcase) {
    return /* @__PURE__ */ jsx29(PopoverClose, { asChild: true, children: /* @__PURE__ */ jsxs23(
      "button",
      {
        type: "button",
        onClick: () => {
          onClick?.(appKey, config);
          onShowcase();
        },
        className: tileClass,
        children: [
          iconBox,
          labelEl
        ]
      }
    ) });
  }
  if (onClick) {
    return /* @__PURE__ */ jsx29(PopoverClose, { asChild: true, children: /* @__PURE__ */ jsxs23(
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
    ) });
  }
  return /* @__PURE__ */ jsx29(PopoverClose, { asChild: true, children: /* @__PURE__ */ jsxs23("a", { href: config.baseUrl, className: tileClass, children: [
    iconBox,
    labelEl
  ] }) });
}
var NotificationBell = React24.forwardRef(function NotificationBell2({ hasUnread, unreadCount, label = "Notifications", className, ...props }, ref) {
  const showCount = unreadCount != null && unreadCount > 0;
  const showDot = !showCount && hasUnread;
  return /* @__PURE__ */ jsxs23(
    "button",
    {
      ref,
      type: "button",
      "aria-label": label,
      className: cn(iconButtonClass, "relative", className),
      ...props,
      children: [
        /* @__PURE__ */ jsx29(Bell, {}),
        showDot && /* @__PURE__ */ jsx29(
          "span",
          {
            "aria-hidden": "true",
            className: "absolute right-2.5 top-2.5 size-2 rounded-full bg-cherry-red-600 ring-2 ring-white"
          }
        ),
        showCount && /* @__PURE__ */ jsx29(
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
  return /* @__PURE__ */ jsxs23(Popover, { children: [
    /* @__PURE__ */ jsx29(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs23(
      "button",
      {
        type: "button",
        "aria-label": label,
        className: cn(
          "group inline-flex items-center gap-2 rounded-full p-0.5 pr-1 text-body-sm font-medium text-text-body transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
          className
        ),
        children: [
          /* @__PURE__ */ jsx29(
            Avatar,
            {
              size: "md",
              src: user.src,
              name: user.name,
              fallback: user.fallback,
              className: "border-2 border-gray-100"
            }
          ),
          /* @__PURE__ */ jsx29(ChevronDown2, { className: "size-4 text-gray-400 transition-transform group-data-[state=open]:rotate-180 group-hover:text-gray-600" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs23(
      PopoverContent,
      {
        align: "end",
        sideOffset: 16,
        className: "w-[310px] rounded-3xl border border-gray-50 px-6 py-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)]",
        children: [
          /* @__PURE__ */ jsxs23("div", { className: "mb-5 flex flex-col items-center", children: [
            /* @__PURE__ */ jsx29(
              Avatar,
              {
                src: user.src,
                name: user.name,
                fallback: user.fallback,
                className: "mb-3 size-[60px] border-2 border-gray-100"
              }
            ),
            user.name && /* @__PURE__ */ jsx29("h3", { className: "text-body-lg font-semibold text-text-heading", children: user.name }),
            user.role && /* @__PURE__ */ jsx29("p", { className: "mt-0.5 text-[15px] font-medium text-text-tertiary", children: user.role })
          ] }),
          /* @__PURE__ */ jsx29("hr", { className: "mb-2 border-gray-100" }),
          items?.map((item, idx) => /* @__PURE__ */ jsx29(UserMenuItemButton, { item }, idx)),
          (bottomLeft || onLogout !== null) && /* @__PURE__ */ jsxs23(Fragment6, { children: [
            /* @__PURE__ */ jsx29("hr", { className: "mb-5 mt-2 border-gray-100" }),
            /* @__PURE__ */ jsxs23("div", { className: "flex items-center justify-between gap-3", children: [
              bottomLeft ?? /* @__PURE__ */ jsx29("span", {}),
              onLogout !== null && /* @__PURE__ */ jsx29(PopoverClose, { asChild: true, children: /* @__PURE__ */ jsxs23(
                "button",
                {
                  type: "button",
                  onClick: onLogout,
                  className: "flex cursor-pointer items-center gap-2 text-[16px] font-medium text-cherry-red-600 transition-colors hover:text-cherry-red-800",
                  children: [
                    /* @__PURE__ */ jsx29(LogOut, { className: "size-5" }),
                    logoutLabel
                  ]
                }
              ) })
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
    return /* @__PURE__ */ jsx29(PopoverClose, { asChild: true, children: /* @__PURE__ */ jsx29("a", { href: item.href, className, children: item.label }) });
  }
  return /* @__PURE__ */ jsx29(PopoverClose, { asChild: true, children: /* @__PURE__ */ jsx29("button", { type: "button", onClick: item.onClick, className, children: item.label }) });
}
TopNav.displayName = "TopNav";
TopNavBrand.displayName = "TopNavBrand";
NotificationBell.displayName = "NotificationBell";

// src/navigation/LanguageSwitcher.tsx
import { Globe } from "lucide-react";

// src/overlay/DropdownMenu.tsx
import * as React25 from "react";
import * as RadixMenu from "@radix-ui/react-dropdown-menu";
import { Check as Check4, ChevronRight, Circle } from "lucide-react";
import { jsx as jsx30, jsxs as jsxs24 } from "react/jsx-runtime";
var DropdownMenu = RadixMenu.Root;
var DropdownMenuTrigger = RadixMenu.Trigger;
var DropdownMenuGroup = RadixMenu.Group;
var DropdownMenuRadioGroup = RadixMenu.RadioGroup;
var DropdownMenuPortal = RadixMenu.Portal;
var DropdownMenuSub = RadixMenu.Sub;
var DropdownMenuContent = React25.forwardRef(function DropdownMenuContent2({ className, sideOffset = 4, ...props }, ref) {
  return /* @__PURE__ */ jsx30(RadixMenu.Portal, { children: /* @__PURE__ */ jsx30(
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
var DropdownMenuItem = React25.forwardRef(
  function DropdownMenuItem2({ className, destructive, inset, ...props }, ref) {
    return /* @__PURE__ */ jsx30(
      RadixMenu.Item,
      {
        ref,
        className: cn(
          "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-body-sm outline-none transition-colors",
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
var DropdownMenuCheckboxItem = React25.forwardRef(function DropdownMenuCheckboxItem2({ className, children, ...props }, ref) {
  return /* @__PURE__ */ jsxs24(
    RadixMenu.CheckboxItem,
    {
      ref,
      className: cn(
        "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-body-sm outline-none",
        "focus:bg-brand-subtle data-[highlighted]:bg-brand-subtle",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx30("span", { className: "absolute left-2 flex size-4 items-center justify-center", children: /* @__PURE__ */ jsx30(RadixMenu.ItemIndicator, { children: /* @__PURE__ */ jsx30(Check4, { className: "size-4" }) }) }),
        children
      ]
    }
  );
});
var DropdownMenuRadioItem = React25.forwardRef(function DropdownMenuRadioItem2({ className, children, ...props }, ref) {
  return /* @__PURE__ */ jsxs24(
    RadixMenu.RadioItem,
    {
      ref,
      className: cn(
        "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-body-sm outline-none",
        "focus:bg-brand-subtle data-[highlighted]:bg-brand-subtle",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx30("span", { className: "absolute left-2 flex size-4 items-center justify-center", children: /* @__PURE__ */ jsx30(RadixMenu.ItemIndicator, { children: /* @__PURE__ */ jsx30(Circle, { className: "size-2 fill-current" }) }) }),
        children
      ]
    }
  );
});
var DropdownMenuLabel = React25.forwardRef(function DropdownMenuLabel2({ className, inset, ...props }, ref) {
  return /* @__PURE__ */ jsx30(
    RadixMenu.Label,
    {
      ref,
      className: cn(
        "px-2 py-1.5 text-caption font-semibold uppercase tracking-wide text-text-tertiary",
        inset && "pl-8",
        className
      ),
      ...props
    }
  );
});
var DropdownMenuSeparator = React25.forwardRef(function DropdownMenuSeparator2({ className, ...props }, ref) {
  return /* @__PURE__ */ jsx30(
    RadixMenu.Separator,
    {
      ref,
      className: cn("-mx-1 my-1 h-px bg-border-subtle", className),
      ...props
    }
  );
});
var DropdownMenuSubTrigger = React25.forwardRef(function DropdownMenuSubTrigger2({ className, children, ...props }, ref) {
  return /* @__PURE__ */ jsxs24(
    RadixMenu.SubTrigger,
    {
      ref,
      className: cn(
        "flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-body-sm outline-none",
        "focus:bg-brand-subtle data-[state=open]:bg-brand-subtle",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx30(ChevronRight, { className: "ml-auto size-4" })
      ]
    }
  );
});
var DropdownMenuSubContent = React25.forwardRef(function DropdownMenuSubContent2({ className, ...props }, ref) {
  return /* @__PURE__ */ jsx30(
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

// src/navigation/LanguageSwitcher.tsx
import { jsx as jsx31, jsxs as jsxs25 } from "react/jsx-runtime";
var triggerClass = "inline-flex h-9 w-30 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-border-strong bg-bg-default px-3 text-body-sm font-medium text-text-body transition-colors hover:bg-bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40";
function LanguageSwitcher({
  languages,
  value,
  onChange,
  label = "Language",
  align = "end",
  className
}) {
  const selected = languages.find((lang) => lang.value === value);
  return (
    /* 🔴 `modal={false}` — ค่าเริ่มต้นของ Radix ตั้ง `pointer-events: none` ให้ `<body>`
     * ตลอดเวลาที่เมนูเปิด ⇒ ทุกอย่างนอกเมนูกดครั้งแรกไม่ติด ต้องกดปิดก่อนแล้วกดใหม่
     * · หน้าเว็บก็เลื่อนไม่ได้ระหว่างเมนูเปิด (ยืนยันสดในเบราว์เซอร์: คลิกถูก
     * `<html> intercepts pointer events` กิน) · สำคัญเป็นพิเศษเมื่อปุ่มนี้ไปนั่งอยู่ใน
     * ป๊อปอัปของตัวอื่น เพราะปุ่มที่เหลือในป๊อปอัปนั้นจะกดไม่ได้ไปด้วย
     * เมนูนี้ไม่ได้กันคนไปทำอย่างอื่น จึงไม่ควรเป็น modal */
    /* @__PURE__ */ jsxs25(DropdownMenu, { modal: false, children: [
      /* @__PURE__ */ jsx31(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs25("button", { type: "button", "aria-label": label, className: cn(triggerClass, className), children: [
        /* @__PURE__ */ jsx31(Globe, { className: "size-5 shrink-0", "aria-hidden": true }),
        /* @__PURE__ */ jsx31("span", { className: "truncate", children: selected?.label })
      ] }) }),
      /* @__PURE__ */ jsx31(DropdownMenuContent, { align, sideOffset: 8, className: "min-w-30 rounded-xl p-1.5", children: /* @__PURE__ */ jsx31(
        DropdownMenuRadioGroup,
        {
          value,
          onValueChange: (next) => {
            if (next !== value) onChange?.(next);
          },
          children: languages.map((lang) => /* @__PURE__ */ jsx31(
            DropdownMenuRadioItem,
            {
              value: lang.value,
              className: "rounded-lg py-2",
              children: lang.label
            },
            lang.value
          ))
        }
      ) })
    ] })
  );
}
LanguageSwitcher.displayName = "LanguageSwitcher";

// src/navigation/Sidebar.tsx
import * as React26 from "react";
import { ChevronDown as ChevronDown3, Headphones } from "lucide-react";
import { Fragment as Fragment7, jsx as jsx32, jsxs as jsxs26 } from "react/jsx-runtime";
var SidebarContext = React26.createContext(
  void 0
);
function useSidebar() {
  const ctx = React26.useContext(SidebarContext);
  if (!ctx) throw new Error("Sidebar.* must be used inside <Sidebar>");
  return ctx;
}
function useSidebarState() {
  return { isCollapsed: useSidebar().isCollapsed };
}
var DepthContext = React26.createContext(0);
var Sidebar = React26.forwardRef(function Sidebar2({
  className,
  header,
  brand,
  footer,
  activeItemId,
  onItemClick,
  collapsed = false,
  expandedWidth = 260,
  collapsedWidth = 72,
  linkComponent = "a",
  mobileOpen,
  onMobileOpenChange,
  expandOnHover = true,
  supportAction,
  children,
  style,
  ...props
}, ref) {
  const [hovered, setHovered] = React26.useState(false);
  const showExpanded = !collapsed || expandOnHover && hovered;
  const ctx = React26.useMemo(
    () => ({
      isCollapsed: !showExpanded,
      activeItemId,
      onItemClick,
      linkComponent
    }),
    [showExpanded, activeItemId, onItemClick, linkComponent]
  );
  const width = showExpanded ? expandedWidth : collapsedWidth;
  const isMobileMode = mobileOpen !== void 0;
  React26.useEffect(() => {
    if (!isMobileMode || !mobileOpen || !onMobileOpenChange) return;
    const handleKeyDown = (e) => {
      if (e.key !== "Escape") return;
      if (window.matchMedia("(min-width: 1024px)").matches) return;
      onMobileOpenChange(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMode, mobileOpen, onMobileOpenChange]);
  return /* @__PURE__ */ jsxs26(SidebarContext.Provider, { value: ctx, children: [
    isMobileMode && mobileOpen && /* @__PURE__ */ jsx32(
      "div",
      {
        "aria-hidden": "true",
        onClick: () => onMobileOpenChange?.(false),
        className: "fixed inset-0 z-40 bg-black/50 lg:hidden"
      }
    ),
    /* @__PURE__ */ jsxs26(
      "aside",
      {
        ref,
        onMouseEnter: expandOnHover ? () => setHovered(true) : void 0,
        onMouseLeave: expandOnHover ? () => setHovered(false) : void 0,
        style: {
          width: typeof width === "number" ? `${width}px` : width,
          ...style
        },
        className: cn(
          /* 📐 วัดจาก Portal: พื้น `rgb(67,89,110)` · **มุม 16px** · ไม่มีเส้นขอบขวา
           * (โค้ดของ Portal เขียน `border-r` แล้วทับด้วย `border-0`)
           * มุมโค้งเฉพาะ `lg` ขึ้นไป เพราะต่ำกว่านั้นมันเป็นลิ้นชักเต็มจอ
           *
           * 🔴 พื้นเป็น token `bg-nav-rail` ไม่ใช่ `bg-state-700` ตายตัว — ค่าเริ่มต้น
           * เท่ากันเป๊ะ (Portal ไม่ขยับ) แต่แอปที่รางเป็นสีแบรนด์จริง ๆ (MediHR = คราม)
           * ทับได้ที่ไฟล์ธีมของตัวเอง แทนที่จะต้อง `className` ทับทุกจุดที่เรียก
           * เกณฑ์ว่าธีมไหนทับได้อยู่ในคอมเมนต์ของ token ใน `semantic.css` */
          "flex h-full shrink-0 flex-col bg-bg-nav-rail text-white transition-[width] duration-300 ease-in-out lg:rounded-2xl",
          isMobileMode && [
            "fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out",
            "lg:static lg:z-auto lg:translate-x-0 lg:transition-[width]",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          ],
          className
        ),
        ...props,
        children: [
          (header || brand) && /* วัดจาก Portal: สูง 88 · pad 24 · เว้นบนอีก 16 · กางแล้วชิดซ้าย ยุบแล้วกึ่งกลาง */
          /* @__PURE__ */ jsx32(
            "div",
            {
              className: cn(
                "mt-4 flex items-center transition-all duration-300 ease-in-out",
                showExpanded ? "min-h-[88px] justify-between p-6" : "justify-center p-4"
              ),
              children: header ?? /* @__PURE__ */ jsxs26(Fragment7, { children: [
                /* @__PURE__ */ jsxs26("span", { className: "flex min-w-0 flex-1 items-center justify-center gap-3", children: [
                  /* @__PURE__ */ jsx32("span", { className: "flex shrink-0 items-center", children: brand.symbol }),
                  showExpanded && brand.name && /* @__PURE__ */ jsx32("span", { className: "truncate text-title-md font-bold tracking-wide", children: brand.name })
                ] }),
                showExpanded && brand.action
              ] })
            }
          ),
          /* @__PURE__ */ jsx32("nav", { className: "flex-1 space-y-1 overflow-y-auto px-4", children }),
          /* @__PURE__ */ jsxs26("div", { className: "px-4 pb-4", children: [
            supportAction && /* ปุ่มติดต่อฝ่ายสนับสนุน — วัดจาก Portal: 36 สูง · มุม 8 · pad 8/12
             * · 14px · `white/60` · ไอคอน 16 · gap 8 · เต็มความกว้าง จัดกึ่งกลาง */
            /* @__PURE__ */ jsxs26(
              "button",
              {
                type: "button",
                onClick: supportAction.onClick,
                title: !showExpanded && typeof supportAction.label === "string" ? supportAction.label : void 0,
                "aria-label": !showExpanded && typeof supportAction.label === "string" ? supportAction.label : void 0,
                className: cn(
                  "flex w-full cursor-pointer items-center gap-2 rounded-lg py-2 text-body-sm text-white/60 transition-colors hover:bg-white/10 hover:text-white",
                  showExpanded ? "justify-center px-3" : "justify-center px-0"
                ),
                children: [
                  /* @__PURE__ */ jsx32("span", { "aria-hidden": true, className: "flex shrink-0 [&_svg]:size-4", children: supportAction.icon ?? /* @__PURE__ */ jsx32(Headphones, { className: "size-4" }) }),
                  showExpanded && supportAction.label
                ]
              }
            ),
            footer && showExpanded && /* วัดจาก Portal: 12px · `white/40` · กึ่งกลาง · เว้นบนล่าง 8 */
            /* @__PURE__ */ jsx32("div", { className: "py-2 text-center text-caption text-white/40", children: footer })
          ] })
        ]
      }
    )
  ] });
});
function collapsedName(label, isCollapsed) {
  if (!isCollapsed || typeof label !== "string") return void 0;
  return label;
}
function SidebarItem({
  id,
  label,
  icon: Icon,
  href,
  onClick,
  badge,
  className
}) {
  const { isCollapsed, activeItemId, onItemClick, linkComponent: LinkComponent } = useSidebar();
  const depth = React26.useContext(DepthContext);
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
  const content = /* @__PURE__ */ jsxs26(Fragment7, { children: [
    (!isNested || isCollapsed) && /* @__PURE__ */ jsx32("span", { className: "flex shrink-0 items-center justify-center", children: Icon ? /* @__PURE__ */ jsx32(Icon, { className: "size-6" }) : isCollapsed ? /* @__PURE__ */ jsx32("span", { className: "size-1.5 rounded-full bg-white" }) : null }),
    !isCollapsed && /* @__PURE__ */ jsxs26("span", { className: "flex min-w-0 flex-1 flex-col items-start text-left", children: [
      /* @__PURE__ */ jsx32(
        "span",
        {
          className: cn(
            "w-full wrap-break-word",
            isNested && "text-body-sm font-semibold leading-[1.35]"
          ),
          children: label
        }
      ),
      badge && /* @__PURE__ */ jsx32(
        "span",
        {
          className: cn(
            "text-[10px] font-medium",
            isActive ? "text-text-black/70" : "text-white/60"
          ),
          children: badge
        }
      )
    ] })
  ] });
  const baseClass = cn(
    "flex w-full cursor-pointer items-center gap-3 rounded-[10px] transition-colors",
    isCollapsed ? "justify-center py-3" : isNested ? "px-3 py-[9px]" : "px-3 py-[11px] text-[16px] font-semibold",
    isActive ? isNested ? "bg-white text-text-black" : "bg-white/20 text-white" : "text-white/80 hover:bg-white/10 hover:text-white",
    className
  );
  const srName = collapsedName(label, isCollapsed);
  if (href && !onClick && !onItemClick) {
    return /* @__PURE__ */ jsx32(
      LinkComponent,
      {
        href,
        className: baseClass,
        title: srName,
        "aria-label": srName,
        children: content
      }
    );
  }
  return /* @__PURE__ */ jsx32(
    "button",
    {
      type: "button",
      onClick: handleClick,
      className: baseClass,
      title: srName,
      "aria-label": srName,
      children: content
    }
  );
}
function SidebarGroup({
  id,
  label,
  icon: Icon,
  defaultExpanded = true,
  expanded,
  onExpandedChange,
  isChildActive: hasActiveChild,
  children,
  className
}) {
  const { isCollapsed } = useSidebar();
  const depth = React26.useContext(DepthContext);
  const isControlled = expanded !== void 0;
  const [internal, setInternal] = React26.useState(defaultExpanded);
  const isExpanded = isControlled ? expanded : internal;
  const isNested = depth > 0;
  const toggle = () => {
    if (!isControlled) setInternal((s) => !s);
    onExpandedChange?.(!isExpanded);
  };
  const headerClass = cn(
    "flex w-full cursor-pointer items-center gap-3 rounded-[10px] font-semibold transition-colors",
    isCollapsed ? "justify-center py-3" : isNested ? "px-3 py-[9px] text-body-sm" : "px-3 py-[11px] text-[16px]",
    isCollapsed && hasActiveChild ? "bg-white/20 text-white" : "text-white/90 hover:bg-white/10 hover:text-white",
    className
  );
  return /* @__PURE__ */ jsxs26("div", { className: "space-y-1", children: [
    /* @__PURE__ */ jsxs26(
      "button",
      {
        type: "button",
        onClick: toggle,
        "aria-expanded": isExpanded,
        "aria-controls": `${id}-content`,
        title: collapsedName(label, isCollapsed),
        "aria-label": collapsedName(label, isCollapsed),
        className: headerClass,
        children: [
          /* @__PURE__ */ jsx32("span", { className: "flex shrink-0 items-center justify-center", children: Icon ? /* @__PURE__ */ jsx32(Icon, { className: "size-6" }) : isNested && !isCollapsed ? /* @__PURE__ */ jsx32("span", { className: "size-1.5 rounded-full bg-white" }) : null }),
          !isCollapsed && /* @__PURE__ */ jsxs26(Fragment7, { children: [
            /* @__PURE__ */ jsx32("span", { className: "flex-1 truncate text-left", children: label }),
            /* @__PURE__ */ jsx32(
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
    isExpanded && !isCollapsed && /* @__PURE__ */ jsx32(
      "div",
      {
        id: `${id}-content`,
        className: "mt-0.5 ml-[22px] space-y-0.5 border-l border-white/12 pl-3",
        children: /* @__PURE__ */ jsx32(DepthContext.Provider, { value: depth + 1, children })
      }
    )
  ] });
}
Sidebar.displayName = "Sidebar";

// src/form/DatePicker.tsx
import * as React28 from "react";
import { format, isValid } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

// src/ui/Calendar.tsx
import * as React27 from "react";
import { ChevronLeft, ChevronRight as ChevronRight2 } from "lucide-react";
import { jsx as jsx33, jsxs as jsxs27 } from "react/jsx-runtime";
var dayKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
  d.getDate()
).padStart(2, "0")}`;
var startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
var addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
var addMonths = (d, n) => new Date(d.getFullYear(), d.getMonth() + n, 1);
var startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
var startOfWeek = (d, weekStartsOn) => addDays(d, -((d.getDay() - weekStartsOn + 7) % 7));
var isSameDay = (a, b) => !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
var buildGrid = (month, weekStartsOn) => {
  const first = startOfWeek(startOfMonth(month), weekStartsOn);
  return Array.from({ length: 42 }, (_, i) => addDays(first, i));
};
var DEFAULT_LABELS = {
  prevMonth: "Previous month",
  nextMonth: "Next month",
  prevYear: "Previous year",
  nextYear: "Next year",
  chooseMonth: "Choose month",
  chooseYear: "Choose year",
  prevYears: "Previous years",
  nextYears: "Next years"
};
var YEARS_PER_PAGE = 12;
var GRID_CELL_BASE = "h-11 cursor-pointer rounded-[10px] text-body-sm transition-colors";
var GRID_CELL_SELECTED = "bg-brand font-bold text-brand-foreground";
var GRID_CELL_IDLE = "bg-overlay-hover text-text-black hover:bg-overlay-press";
var Calendar = React27.forwardRef(
  function Calendar2({
    month,
    onMonthChange,
    selected = null,
    rangeEnd = null,
    hoverEnd = null,
    minDate = null,
    maxDate = null,
    disabledDate,
    onSelect,
    onDayHover,
    defaultView = "day",
    selectMonth,
    today,
    locale = "th-TH",
    weekStartsOn = 0,
    labels,
    className
  }, ref) {
    const L = { ...DEFAULT_LABELS, ...labels };
    const [view, setView] = React27.useState(defaultView);
    const [todayValue] = React27.useState(
      () => today === void 0 ? /* @__PURE__ */ new Date() : today
    );
    const todayDate = today === void 0 ? todayValue : today;
    const fmt = React27.useMemo(
      () => ({
        month: new Intl.DateTimeFormat(locale, {
          month: "short",
          year: "numeric"
        }),
        monthCell: new Intl.DateTimeFormat(locale, { month: "short" }),
        year: new Intl.DateTimeFormat(locale, { year: "numeric" }),
        weekday: new Intl.DateTimeFormat(locale, { weekday: "narrow" }),
        full: new Intl.DateTimeFormat(locale, { dateStyle: "full" })
      }),
      [locale]
    );
    const outOfBounds = (d) => !!minDate && startOfDay(d) < startOfDay(minDate) || !!maxDate && startOfDay(d) > startOfDay(maxDate) || !!disabledDate?.(d);
    const end = rangeEnd ?? (selected && hoverEnd ? hoverEnd : null);
    const isSpan = !!(selected && end && !isSameDay(selected, end));
    const grid = React27.useMemo(
      () => buildGrid(month, weekStartsOn),
      [month, weekStartsOn]
    );
    const [focusDay, setFocusDay] = React27.useState(
      () => selected ?? startOfMonth(month)
    );
    const focusRef = React27.useRef(null);
    const shouldFocus = React27.useRef(false);
    React27.useEffect(() => {
      if (shouldFocus.current) {
        focusRef.current?.focus();
        shouldFocus.current = false;
      }
    });
    const moveFocus = (next) => {
      shouldFocus.current = true;
      setFocusDay(next);
      if (next.getMonth() !== month.getMonth() || next.getFullYear() !== month.getFullYear()) {
        onMonthChange(startOfMonth(next));
      }
    };
    const onGridKeyDown = (e) => {
      const map = {
        ArrowLeft: -1,
        ArrowRight: 1,
        ArrowUp: -7,
        ArrowDown: 7
      };
      if (e.key in map) {
        e.preventDefault();
        moveFocus(addDays(focusDay, map[e.key]));
        return;
      }
      if (e.key === "Home" || e.key === "End") {
        e.preventDefault();
        const from = startOfWeek(focusDay, weekStartsOn);
        moveFocus(e.key === "Home" ? from : addDays(from, 6));
        return;
      }
      if (e.key === "PageUp" || e.key === "PageDown") {
        e.preventDefault();
        const delta = e.key === "PageUp" ? -1 : 1;
        const target = new Date(
          focusDay.getFullYear(),
          focusDay.getMonth() + delta,
          focusDay.getDate()
        );
        moveFocus(target);
      }
    };
    const stepMonth = (dir) => onMonthChange(
      addMonths(
        month,
        view === "day" ? dir : view === "month" ? dir * 12 : dir * 12 * YEARS_PER_PAGE
      )
    );
    const yearPageStart = Math.floor(month.getFullYear() / YEARS_PER_PAGE) * YEARS_PER_PAGE;
    const yearCellLabel = (d) => fmt.year.formatToParts(d).find((p) => p.type === "year")?.value ?? String(d.getFullYear());
    const yearRangeLabel = () => {
      const first = new Date(yearPageStart, 0, 1);
      const last = new Date(yearPageStart + YEARS_PER_PAGE - 1, 0, 1);
      try {
        return fmt.year.formatRange(first, last);
      } catch {
        return `${fmt.year.format(first)} \u2013 ${fmt.year.format(last)}`;
      }
    };
    const headerLabel = view === "day" ? fmt.month.format(month) : view === "month" ? fmt.year.format(month) : yearRangeLabel();
    const nextView = {
      day: "month",
      month: "year",
      year: "month"
    };
    const navClass = "flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-overlay-hover text-text-body transition-colors hover:bg-overlay-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 [&_svg]:size-[18px]";
    return /* @__PURE__ */ jsxs27("div", { ref, className: cn("w-[340px] p-4 pb-0", className), children: [
      /* @__PURE__ */ jsxs27("div", { className: "mb-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx33(
          "button",
          {
            type: "button",
            "aria-label": view === "day" ? L.prevMonth : view === "month" ? L.prevYear : L.prevYears,
            onClick: () => stepMonth(-1),
            className: navClass,
            children: /* @__PURE__ */ jsx33(ChevronLeft, {})
          }
        ),
        /* @__PURE__ */ jsx33(
          "button",
          {
            type: "button",
            "aria-label": view === "month" ? L.chooseYear : L.chooseMonth,
            "aria-expanded": view !== "day",
            onClick: () => setView(nextView[view]),
            className: "cursor-pointer rounded-lg px-2 py-1 text-[15px] font-bold text-text-black transition-colors hover:bg-overlay-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
            children: headerLabel
          }
        ),
        /* @__PURE__ */ jsx33(
          "button",
          {
            type: "button",
            "aria-label": view === "day" ? L.nextMonth : view === "month" ? L.nextYear : L.nextYears,
            onClick: () => stepMonth(1),
            className: navClass,
            children: /* @__PURE__ */ jsx33(ChevronRight2, {})
          }
        )
      ] }),
      view === "year" ? (
        /* ตารางปี — ทรงเดียวกับตารางเดือนเป๊ะ (3 คอลัมน์ × 4 แถว) ⇒ สลับมุมมอง
         * แล้วกล่องไม่กระโดด · เลือกปีแล้วลงไปมุมมองเดือนต่อ ไม่ใช่จบเลย เพราะ
         * หน่วยที่ผู้ใช้กำลังหาคือ "วัน" ปีเป็นแค่ทางผ่าน */
        /* @__PURE__ */ jsx33("div", { className: "grid grid-cols-3 gap-2 pb-2", children: Array.from({ length: YEARS_PER_PAGE }, (_, i) => {
          const year = yearPageStart + i;
          const cell = new Date(year, month.getMonth(), 1);
          const isCurrent = month.getFullYear() === year;
          return /* @__PURE__ */ jsx33(
            "button",
            {
              type: "button",
              "aria-pressed": isCurrent,
              onClick: () => {
                onMonthChange(cell);
                setView("month");
              },
              className: cn(
                GRID_CELL_BASE,
                isCurrent ? GRID_CELL_SELECTED : GRID_CELL_IDLE
              ),
              children: yearCellLabel(cell)
            },
            year
          );
        }) })
      ) : view === "month" ? /* @__PURE__ */ jsx33("div", { className: "grid grid-cols-3 gap-2 pb-2", children: Array.from({ length: 12 }, (_, i) => {
        const cell = new Date(month.getFullYear(), i, 1);
        const isCurrent = month.getMonth() === i;
        return /* @__PURE__ */ jsx33(
          "button",
          {
            type: "button",
            "aria-pressed": isCurrent,
            onClick: () => {
              onMonthChange(cell);
              if (selectMonth) onSelect?.(cell);
              else setView("day");
            },
            className: cn(
              GRID_CELL_BASE,
              isCurrent ? GRID_CELL_SELECTED : GRID_CELL_IDLE
            ),
            children: fmt.monthCell.format(cell)
          },
          i
        );
      }) }) : (
        /* 🔴 ระยะระหว่างแถว 4 มาจาก `rowGap` ของตารางจริง — `border-collapse`
         * ทำแบบนั้นไม่ได้ ต้อง `border-separate` + `border-spacing`
         * ถ้าไม่มี ระยะห่างแถวหายไป 4 ทุกแถว = ปฏิทินเตี้ยลง 24 และแถบช่วงวัน
         * กลายเป็นก้อนทึบแทนที่จะเป็นแถบต่อแถว */
        /* @__PURE__ */ jsxs27(
          "table",
          {
            role: "grid",
            className: "-mt-1 w-full border-separate border-spacing-x-0 border-spacing-y-1",
            onKeyDown: onGridKeyDown,
            children: [
              /* @__PURE__ */ jsx33("thead", { children: /* @__PURE__ */ jsx33("tr", { children: grid.slice(0, 7).map((d) => /* @__PURE__ */ jsx33(
                "th",
                {
                  scope: "col",
                  abbr: fmt.full.format(d),
                  className: "py-1 text-center text-caption font-normal text-text-tertiary",
                  children: fmt.weekday.format(d)
                },
                d.getDay()
              )) }) }),
              /* @__PURE__ */ jsx33("tbody", { children: Array.from({ length: 6 }, (_, row) => /* @__PURE__ */ jsx33("tr", { children: grid.slice(row * 7, row * 7 + 7).map((day) => {
                const outside = day.getMonth() !== month.getMonth();
                const disabled = outside || outOfBounds(day);
                const isStart = isSameDay(day, selected);
                const isEnd = isSameDay(day, end);
                const edge = isStart || isEnd;
                const between = !!selected && !!end && startOfDay(day) > startOfDay(selected) && startOfDay(day) < startOfDay(end);
                const isFocus = isSameDay(day, focusDay);
                const isToday = !outside && isSameDay(day, todayDate);
                return /* @__PURE__ */ jsx33(
                  "td",
                  {
                    role: "gridcell",
                    "data-day": dayKey(day),
                    "aria-selected": edge || void 0,
                    className: cn(
                      "h-10 p-0 text-center align-middle",
                      (between || edge && isSpan) && "bg-brand-subtle",
                      isStart && isSpan && "rounded-l-full",
                      isEnd && isSpan && "rounded-r-full"
                    ),
                    children: /* @__PURE__ */ jsx33(
                      "button",
                      {
                        type: "button",
                        ref: isFocus ? focusRef : void 0,
                        tabIndex: isFocus ? 0 : -1,
                        disabled,
                        "aria-current": isToday ? "date" : void 0,
                        "aria-label": fmt.full.format(day),
                        onClick: () => {
                          setFocusDay(day);
                          onSelect?.(day);
                        },
                        onMouseEnter: () => !disabled && onDayHover?.(day),
                        onMouseLeave: () => onDayHover?.(null),
                        className: cn(
                          "size-[34px] rounded-full text-body-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
                          edge ? "bg-brand font-bold text-brand-foreground" : disabled ? "cursor-default text-text-disabled" : "cursor-pointer text-text-black hover:bg-overlay-hover",
                          /* วันนี้ = วงแหวน · ที่เลือก = ทึบ · ถ้าเป็นวันเดียวกัน
                           * ทึบชนะ (ไม่ซ้อนสองสถานะบนช่องเดียวจนอ่านไม่ออกว่าอันไหนคืออะไร)
                           * `ring-inset` เพื่อไม่ให้วงแหวนล้นออกไปทับช่องข้าง ๆ ในแถบช่วงวัน */
                          isToday && !edge && "ring-1 ring-inset ring-brand font-bold"
                        ),
                        children: day.getDate()
                      }
                    )
                  },
                  dayKey(day)
                );
              }) }, row)) })
            ]
          }
        )
      )
    ] });
  }
);
Calendar.displayName = "Calendar";

// src/form/field-icon-slot.tsx
import { X as X5 } from "lucide-react";
import { jsx as jsx34, jsxs as jsxs28 } from "react/jsx-runtime";
function FieldIconSlot({
  icon,
  showClear,
  clearLabel,
  onClear
}) {
  return (
    /* 🔴 `pointer-events-none` — ตัวห่อนี้ทับปุ่ม trigger ที่อยู่ข้างล่าง ถ้าไม่ปล่อย
     * ให้คลิกทะลุ **กดตรงไอคอนแล้วจะไม่เปิดอะไรเลย** (เคยเป็นแบบนั้นจริงทั้ง
     * `DatePicker` และตัวนี้ · `FloatingFieldShell` ก็แก้ที่ตัวห่อของมันแล้วเช่นกัน) */
    /* @__PURE__ */ jsxs28("span", { className: "pointer-events-none relative inline-flex size-4 items-center justify-center", children: [
      /* @__PURE__ */ jsx34(
        "span",
        {
          className: cn(
            "absolute inset-0 inline-flex items-center justify-center transition-opacity",
            "[&_svg]:size-4",
            showClear && "group-hover:opacity-0 group-focus-within:opacity-0"
          ),
          children: icon
        }
      ),
      showClear && /* @__PURE__ */ jsx34(
        "button",
        {
          type: "button",
          "aria-label": clearLabel,
          onClick: (event) => {
            event.stopPropagation();
            onClear();
          },
          className: cn(
            "absolute inset-0 inline-flex cursor-pointer items-center justify-center rounded-sm",
            /* 🔴 `pointer-events-none` จนกว่าจะถูกเผย — บนทัชไม่มี hover ถ้าเปิดค้างไว้
             * ปุ่มใสที่มองไม่เห็นจะดักการแตะตรงไอคอน แล้ว **ล้างค่าทิ้งทั้งที่ผู้ใช้ตั้งใจ
             * เปิดปฏิทิน** · ไม่กระทบการ tab ⇒ คีย์บอร์ดยังเข้าถึงได้ตามปกติ */
            "pointer-events-none opacity-0 transition-opacity",
            "group-hover:pointer-events-auto group-hover:opacity-100",
            "group-focus-within:pointer-events-auto group-focus-within:opacity-100",
            "[&_svg]:size-4"
          ),
          children: /* @__PURE__ */ jsx34(X5, {})
        }
      )
    ] })
  );
}

// src/form/DatePicker.tsx
import { jsx as jsx35, jsxs as jsxs29 } from "react/jsx-runtime";
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
  showClearInField = false,
  clearLabel = "Clear",
  reserveMessageSpace,
  disabled,
  size = "md",
  calendarLocale = "th-TH",
  weekStartsOn,
  calendarLabels,
  className,
  containerClassName
}) {
  const reactId = React28.useId();
  const triggerId = id ?? reactId;
  const [open, setOpen] = React28.useState(false);
  const [internal, setInternal] = React28.useState(defaultValue);
  const isControlled = value !== void 0;
  const selected = isControlled ? value ?? void 0 : internal;
  const hasError = Boolean(error);
  const hasValue = selected != null;
  const floating = Boolean(alwaysFloatLabel) || open || hasValue || Boolean(placeholder);
  const handleSelect = (date) => {
    if (disabledDate?.(date)) return;
    if (!isControlled) setInternal(date);
    onChange?.(date);
    setOpen(false);
  };
  const handleClear = () => {
    if (!isControlled) setInternal(void 0);
    onChange?.(void 0);
  };
  const display = selected && isValid(selected) ? format(selected, displayFormat) : "";
  const [month, setMonth] = React28.useState(
    () => startOfMonth(selected ?? /* @__PURE__ */ new Date())
  );
  const handleOpenChange = (next) => {
    if (next) setMonth(startOfMonth(selected ?? /* @__PURE__ */ new Date()));
    setOpen(next);
  };
  return /* @__PURE__ */ jsx35(
    FloatingFieldShell,
    {
      label,
      hint,
      error,
      required,
      hideLabel,
      reserveMessageSpace,
      htmlFor: triggerId,
      size,
      floating,
      focused: open,
      hasError,
      containerClassName: cn("group", containerClassName),
      rightAdornment: /* @__PURE__ */ jsx35(
        FieldIconSlot,
        {
          icon: /* @__PURE__ */ jsx35(CalendarIcon, {}),
          showClear: showClearInField && hasValue && !disabled,
          clearLabel,
          onClear: handleClear
        }
      ),
      children: /* @__PURE__ */ jsxs29(Popover, { open, onOpenChange: handleOpenChange, children: [
        /* @__PURE__ */ jsx35(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsx35(
          "button",
          {
            id: triggerId,
            type: "button",
            disabled,
            "aria-invalid": hasError || void 0,
            className: cn(
              fieldShapeClasses({ hasError, size }),
              /* `cursor-pointer` — ตัวเปิดเป็นปุ่มที่กดแล้วปฏิทินโผล่ ไม่ใช่ช่องพิมพ์
               * เคอร์เซอร์ลูกศรทำให้อ่านว่าเป็นข้อความอ่านอย่างเดียว (คู่เดียวกับ `Select`) */
              "flex cursor-pointer items-center text-left pr-9",
              !display && "text-text-tertiary",
              className
            ),
            children: /* @__PURE__ */ jsx35("span", { className: "truncate", children: display || (floating ? placeholder ?? "" : "") })
          }
        ) }),
        /* @__PURE__ */ jsx35(
          PopoverContent,
          {
            align: "start",
            sideOffset: 8,
            className: "w-auto rounded-2xl p-0 pb-4",
            children: /* @__PURE__ */ jsx35(
              Calendar,
              {
                month,
                onMonthChange: setMonth,
                selected: selected ?? null,
                minDate: minDate ?? null,
                maxDate: maxDate ?? null,
                disabledDate,
                onSelect: handleSelect,
                locale: calendarLocale,
                weekStartsOn,
                labels: calendarLabels
              }
            )
          }
        )
      ] })
    }
  );
}

// src/form/DateRangePicker.tsx
import * as React29 from "react";
import { format as format2, isBefore, isValid as isValid2, startOfDay as startOfDay2 } from "date-fns";
import { Calendar as CalendarIcon2 } from "lucide-react";
import { jsx as jsx36, jsxs as jsxs30 } from "react/jsx-runtime";
var EMPTY_RANGE = { from: null, to: null };
var DEFAULT_LABELS2 = {
  confirm: "OK",
  clear: "Clear"
};
function DateRangePicker({
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
  displayFormat,
  disabledDate,
  minDate,
  maxDate,
  showClearInField = false,
  reserveMessageSpace,
  disabled,
  size = "md",
  calendarLocale = "th-TH",
  weekStartsOn,
  calendarLabels,
  labels,
  className,
  containerClassName
}) {
  const L = { ...DEFAULT_LABELS2, ...labels };
  const reactId = React29.useId();
  const triggerId = id ?? reactId;
  const isControlled = value !== void 0;
  const [internal, setInternal] = React29.useState(
    defaultValue ?? EMPTY_RANGE
  );
  const committed = isControlled ? value ?? EMPTY_RANGE : internal;
  const [open, setOpen] = React29.useState(false);
  const [draft, setDraft] = React29.useState(committed);
  const [hoverDay, setHoverDay] = React29.useState(null);
  const [month, setMonth] = React29.useState(
    () => startOfMonth(committed.from ?? /* @__PURE__ */ new Date())
  );
  const hasError = Boolean(error);
  const hasValue = Boolean(committed.from || committed.to);
  const showClear = showClearInField && hasValue && !disabled;
  const floating = Boolean(alwaysFloatLabel) || open || hasValue || Boolean(placeholder);
  const handleOpenChange = (next) => {
    if (next) {
      setDraft(committed);
      setHoverDay(null);
      setMonth(startOfMonth(committed.from ?? /* @__PURE__ */ new Date()));
    }
    setOpen(next);
  };
  const handleDayClick = (day) => {
    if (disabledDate?.(day)) return;
    if (!draft.from || draft.to || isBefore(startOfDay2(day), startOfDay2(draft.from))) {
      setDraft({ from: day, to: null });
      return;
    }
    setDraft({ from: draft.from, to: day });
  };
  const commit = (next) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };
  const confirm = () => {
    commit(draft.from ? { from: draft.from, to: draft.to ?? draft.from } : EMPTY_RANGE);
    setOpen(false);
  };
  const clear = () => {
    setDraft(EMPTY_RANGE);
    commit(EMPTY_RANGE);
    setOpen(false);
  };
  const intlFmt = React29.useMemo(
    () => new Intl.DateTimeFormat(calendarLocale, {
      day: "numeric",
      month: "short",
      year: "numeric"
    }),
    [calendarLocale]
  );
  const fmt = (d) => d && isValid2(d) ? displayFormat ? format2(d, displayFormat) : intlFmt.format(d) : null;
  const display = committed.from ? `${fmt(committed.from)} \u2013 ${fmt(committed.to ?? committed.from)}` : "";
  const placeholderText = placeholder ? `${placeholder} \u2013 ${placeholder}` : "";
  return /* @__PURE__ */ jsx36(
    FloatingFieldShell,
    {
      label,
      hint,
      error,
      required,
      hideLabel,
      reserveMessageSpace,
      htmlFor: triggerId,
      size,
      floating,
      focused: open,
      hasError,
      containerClassName: cn("group", containerClassName),
      rightAdornment: /* @__PURE__ */ jsx36(
        FieldIconSlot,
        {
          icon: /* @__PURE__ */ jsx36(CalendarIcon2, {}),
          showClear,
          clearLabel: L.clear,
          onClear: clear
        }
      ),
      children: /* @__PURE__ */ jsxs30(Popover, { open, onOpenChange: handleOpenChange, children: [
        /* @__PURE__ */ jsx36(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsx36(
          "button",
          {
            id: triggerId,
            type: "button",
            disabled,
            "aria-invalid": hasError || void 0,
            className: cn(
              fieldShapeClasses({ hasError, size }),
              "flex cursor-pointer items-center text-left",
              /* 🔴 ต้องเว้นขวาให้พ้นไอคอน — shell วาง `rightAdornment` เป็น `absolute right-3`
               * ⇒ ตัวอักษรลอดไปอยู่ใต้ไอคอนได้โดยไม่มีอะไรฟ้อง (กับดักเดียวกับที่ `TimePicker`
               * เจอในโมดัล "เพิ่มเวลาทำงาน")
               *
               * **คงที่ 36 ทุกสถานะ** เพราะ X ซ้อนอยู่ที่เดียวกับปฏิทิน ไม่ได้ต่อแถวออกมา
               * (เคยเป็น `pr-14`/`pr-9` สลับกันตอนที่โชว์ทั้งสองตัว — พอสลับเป็นซ้อนกัน
               * ตามแบบ antd ความกว้างก็ไม่ขึ้นกับสถานะอีกต่อไป) */
              "pr-9",
              !display && "text-text-tertiary",
              className
            ),
            children: /* @__PURE__ */ jsx36("span", { className: "truncate", children: display || (floating ? placeholderText : "") })
          }
        ) }),
        /* @__PURE__ */ jsxs30(PopoverContent, { align: "start", sideOffset: 8, className: "w-auto rounded-2xl p-0", children: [
          /* @__PURE__ */ jsx36(
            Calendar,
            {
              month,
              onMonthChange: setMonth,
              selected: draft.from,
              rangeEnd: draft.to,
              hoverEnd: hoverDay,
              minDate: minDate ?? null,
              maxDate: maxDate ?? null,
              disabledDate,
              onSelect: handleDayClick,
              onDayHover: setHoverDay,
              locale: calendarLocale,
              weekStartsOn,
              labels: calendarLabels
            }
          ),
          /* @__PURE__ */ jsxs30("div", { className: "flex items-center justify-end gap-2 border-t border-border-default px-4 py-3", children: [
            /* @__PURE__ */ jsx36(Button, { type: "button", variant: "secondary", size: "sm", onClick: clear, children: L.clear }),
            /* @__PURE__ */ jsx36(Button, { type: "button", variant: "primary", size: "sm", onClick: confirm, children: L.confirm })
          ] })
        ] })
      ] })
    }
  );
}

// src/form/TimePicker.tsx
import * as React30 from "react";
import { Clock } from "lucide-react";
import { jsx as jsx37, jsxs as jsxs31 } from "react/jsx-runtime";
var heights = {
  sm: "h-9 text-body-sm",
  md: "h-11 text-body-sm",
  lg: "h-12 text-body-md"
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
function to12Hour(h) {
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return { h12, period };
}
function from12Hour(h12, period) {
  const base = h12 % 12;
  return period === "PM" ? base + 12 : base;
}
function timeToMinutes(v) {
  const { h, m } = parseTime(v);
  if (h == null || m == null) return null;
  return h * 60 + m;
}
function clampMinutesToRange(total, min, max) {
  let v = total;
  if (min != null && v < min) v = min;
  if (max != null && v > max) v = max;
  return v;
}
function TimePicker({
  id,
  label,
  hint,
  error,
  required,
  hideLabel,
  reserveMessageSpace,
  alwaysFloatLabel = true,
  value,
  defaultValue,
  onChange,
  minuteStep,
  step,
  minTime,
  maxTime,
  ampm = false,
  disabled,
  size = "md",
  className,
  containerClassName
}) {
  const reactId = React30.useId();
  const inputId = id ?? reactId;
  const isControlled = value !== void 0;
  const [internal, setInternal] = React30.useState(defaultValue ?? "");
  const [focused, setFocused] = React30.useState(false);
  const [open, setOpen] = React30.useState(false);
  const current = isControlled ? value ?? "" : internal;
  const { h, m } = parseTime(current);
  const hasError = Boolean(error);
  const hasValue = current !== "";
  const floating = Boolean(alwaysFloatLabel) || focused || hasValue;
  const stepEffective = minuteStep ?? step ?? 1;
  const minMinutes = React30.useMemo(() => timeToMinutes(minTime), [minTime]);
  const maxMinutes = React30.useMemo(() => timeToMinutes(maxTime), [maxTime]);
  const [manualPeriod, setManualPeriod] = React30.useState(
    () => h != null ? to12Hour(h).period : "AM"
  );
  const period = h != null ? to12Hour(h).period : manualPeriod;
  const [hStr, setHStr] = React30.useState(() => {
    const displayH = ampm ? h != null ? to12Hour(h).h12 : null : h;
    return displayH != null ? pad2(displayH) : "";
  });
  const [mStr, setMStr] = React30.useState(() => m != null ? pad2(m) : "");
  React30.useEffect(() => {
    const displayH = ampm ? h != null ? to12Hour(h).h12 : null : h;
    const localH = hStr === "" ? null : parseInt(hStr, 10);
    if (localH !== displayH) {
      setHStr(displayH != null ? pad2(displayH) : "");
    }
    const localM = mStr === "" ? null : parseInt(mStr, 10);
    if (localM !== m) {
      setMStr(m != null ? pad2(m) : "");
    }
  }, [h, m, ampm]);
  const applyValue = (safeH, safeM) => {
    const next = format24(safeH, safeM);
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };
  const commit = (nextH, nextM) => {
    const safeH = nextH === "" ? null : clamp(parseInt(nextH, 10) || 0, 0, 23);
    const safeM = nextM === "" ? null : clamp(parseInt(nextM, 10) || 0, 0, 59);
    applyValue(safeH, safeM);
  };
  const commitAmPm = (nextH12, nextM, periodArg) => {
    const safeH12 = nextH12 === "" ? null : clamp(parseInt(nextH12, 10) || 0, 1, 12);
    const safeM = nextM === "" ? null : clamp(parseInt(nextM, 10) || 0, 0, 59);
    const safeH = safeH12 == null ? null : from12Hour(safeH12, periodArg);
    applyValue(safeH, safeM);
  };
  const handleHourChange = (raw) => {
    const cleaned = raw.replace(/\D/g, "").slice(0, 2);
    setHStr(cleaned);
    if (ampm) commitAmPm(cleaned, mStr, period);
    else commit(cleaned, mStr);
  };
  const handleMinuteChange = (raw) => {
    const cleaned = raw.replace(/\D/g, "").slice(0, 2);
    setMStr(cleaned);
    if (ampm) commitAmPm(hStr, cleaned, period);
    else commit(hStr, cleaned);
  };
  const handleHourBlur = () => {
    if (hStr !== "" && hStr.length === 1) setHStr(pad2(parseInt(hStr, 10)));
  };
  const handleMinuteBlur = () => {
    if (mStr !== "" && mStr.length === 1) setMStr(pad2(parseInt(mStr, 10)));
  };
  const handlePeriodChange = (next) => {
    setManualPeriod(next);
    if (h != null) {
      const { h12 } = to12Hour(h);
      applyValue(from12Hour(h12, next), m);
    }
  };
  const isHourBlockDisabled = (h24) => {
    if (minMinutes == null && maxMinutes == null) return false;
    const start = h24 * 60;
    const end = start + 59;
    if (maxMinutes != null && start > maxMinutes) return true;
    if (minMinutes != null && end < minMinutes) return true;
    return false;
  };
  const isMinuteDisabled = (mm) => {
    if (h == null || minMinutes == null && maxMinutes == null) return false;
    const total = h * 60 + mm;
    if (minMinutes != null && total < minMinutes) return true;
    if (maxMinutes != null && total > maxMinutes) return true;
    return false;
  };
  const isPeriodBlockDisabled = (p) => {
    if (minMinutes == null && maxMinutes == null) return false;
    const start = (p === "AM" ? 0 : 12) * 60;
    const end = start + 12 * 60 - 1;
    if (maxMinutes != null && start > maxMinutes) return true;
    if (minMinutes != null && end < minMinutes) return true;
    return false;
  };
  const enforceBoundsOnBlur = () => {
    if (minMinutes == null && maxMinutes == null || h == null || m == null) {
      return;
    }
    const total = h * 60 + m;
    const clampedTotal = clampMinutesToRange(total, minMinutes, maxMinutes);
    if (clampedTotal !== total) {
      applyValue(Math.floor(clampedTotal / 60), clampedTotal % 60);
    }
  };
  const hourItems = React30.useMemo(
    () => ampm ? Array.from({ length: 12 }, (_, i) => i + 1) : Array.from({ length: 24 }, (_, i) => i),
    [ampm]
  );
  const minuteItems = React30.useMemo(() => {
    const out = [];
    for (let i = 0; i < 60; i += stepEffective) out.push(i);
    return out;
  }, [stepEffective]);
  return /* @__PURE__ */ jsx37(
    FloatingFieldShell,
    {
      label,
      hint,
      error,
      required,
      hideLabel,
      reserveMessageSpace,
      htmlFor: inputId,
      size,
      floating,
      focused,
      hasError,
      containerClassName,
      rightAdornment: /* @__PURE__ */ jsxs31(Popover, { open, onOpenChange: setOpen, children: [
        /* @__PURE__ */ jsx37(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsx37(
          "button",
          {
            type: "button",
            "aria-label": "Open time picker",
            disabled,
            className: "pointer-events-auto inline-flex size-6 items-center justify-center rounded-sm hover:bg-black/5 disabled:cursor-not-allowed [&_svg]:size-4",
            children: /* @__PURE__ */ jsx37(Clock, {})
          }
        ) }),
        /* @__PURE__ */ jsx37(PopoverContent, { align: "end", sideOffset: 6, className: "p-0", children: /* @__PURE__ */ jsxs31(
          "div",
          {
            className: cn(
              "flex h-56 divide-x divide-border-default text-body-sm",
              ampm ? "w-56" : "w-40"
            ),
            role: "dialog",
            "aria-label": "Pick time",
            children: [
              /* @__PURE__ */ jsx37(
                TimeColumn,
                {
                  ariaLabel: "Hours",
                  items: hourItems,
                  selected: ampm ? h != null ? to12Hour(h).h12 : null : h,
                  isDisabled: (item) => isHourBlockDisabled(ampm ? from12Hour(item, period) : item),
                  onPick: (next) => applyValue(ampm ? from12Hour(next, period) : next, m)
                }
              ),
              /* @__PURE__ */ jsx37(
                TimeColumn,
                {
                  ariaLabel: "Minutes",
                  items: minuteItems,
                  selected: m,
                  isDisabled: isMinuteDisabled,
                  onPick: (next) => applyValue(h, next)
                }
              ),
              ampm && /* @__PURE__ */ jsx37(
                TimeColumn,
                {
                  ariaLabel: "Period",
                  items: ["AM", "PM"],
                  selected: h != null ? period : null,
                  isDisabled: isPeriodBlockDisabled,
                  onPick: handlePeriodChange,
                  formatLabel: (item) => item
                }
              )
            ]
          }
        ) })
      ] }),
      children: /* @__PURE__ */ jsxs31(
        "div",
        {
          className: cn(
            /* 🔴 `pr-9` ไม่ใช่ `pr-3` — ปุ่มนาฬิกาถูกวางเป็น `absolute right-3` โดย shell
             * (ไอคอน 16px กินช่วง 12–28px จากขอบขวา) ถ้าเว้นขวาแค่ 12 **ตัวเลขนาทีจะอยู่
             * ใต้ปุ่มพอดี** อ่านไม่ออก และไม่มีอะไรฟ้อง — ไม่มี type error ไม่มี warning
             * (เจอของจริงในโมดัล "เพิ่มเวลาทำงาน" ตอนช่องกว้าง ~106px)
             * แก้ที่ระยะเว้น ไม่ใช่ตั้ง `min-width` เพราะ min-width แค่ทำให้ช่องกว้างพอ
             * "โดยบังเอิญ" แล้วพังอีกทันทีที่ใครใส่ไอคอนที่ใหญ่กว่าเดิม */
            "flex w-full items-center gap-1 rounded-sm border bg-white pl-3 pr-9 transition-colors",
            "focus-within:outline-none focus-within:ring-1",
            /* พื้นตอนปิดใช้งาน — ค่าเดียวกับ `fieldShapeClasses` (ของเดิม `gray-50` เป็นสีดิบ
             * และจางกว่าช่องอื่นในฟอร์มเดียวกัน) */
            disabled && "cursor-not-allowed bg-bg-surface",
            heights[size],
            hasError ? "border-cherry-red-600 focus-within:border-cherry-red-600 focus-within:ring-cherry-red-600/40" : "border-border-strong focus-within:border-brand focus-within:ring-brand/30",
            className
          ),
          onFocus: () => setFocused(true),
          onBlur: (e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setFocused(false);
              enforceBoundsOnBlur();
            }
          },
          children: [
            /* @__PURE__ */ jsx37(
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
            /* @__PURE__ */ jsx37("span", { className: "select-none text-text-tertiary", children: ":" }),
            /* @__PURE__ */ jsx37(
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
            ampm && /* @__PURE__ */ jsx37(
              "button",
              {
                type: "button",
                disabled,
                onClick: () => handlePeriodChange(period === "AM" ? "PM" : "AM"),
                "aria-label": "Toggle AM/PM",
                className: "shrink-0 rounded-sm px-1 text-caption font-medium text-text-tertiary hover:bg-black/5 disabled:cursor-not-allowed",
                children: period
              }
            ),
            /* @__PURE__ */ jsx37("span", { className: "ml-auto", "aria-hidden": "true" })
          ]
        }
      )
    }
  );
}
function TimeColumn({
  ariaLabel,
  items,
  selected,
  isDisabled,
  onPick,
  formatLabel
}) {
  const containerRef = React30.useRef(null);
  React30.useEffect(() => {
    if (selected == null || !containerRef.current) return;
    const el = containerRef.current.querySelector(
      `[data-value="${selected}"]`
    );
    el?.scrollIntoView({ block: "center" });
  }, [selected]);
  return /* @__PURE__ */ jsx37(
    "div",
    {
      ref: containerRef,
      role: "listbox",
      "aria-label": ariaLabel,
      className: "flex flex-1 flex-col overflow-y-auto py-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300",
      children: items.map((item) => {
        const isSelected = item === selected;
        const disabled = isDisabled?.(item) ?? false;
        return /* @__PURE__ */ jsx37(
          "button",
          {
            type: "button",
            "data-value": item,
            role: "option",
            "aria-selected": isSelected || void 0,
            "aria-disabled": disabled || void 0,
            disabled,
            onClick: () => onPick(item),
            className: cn(
              "mx-2 my-0.5 flex h-8 shrink-0 items-center justify-center rounded-md text-center font-medium tabular-nums transition-colors",
              disabled ? "cursor-not-allowed text-text-tertiary/40" : isSelected ? "bg-brand-active text-white" : "text-text-body hover:bg-brand-subtle"
            ),
            children: formatLabel ? formatLabel(item) : typeof item === "number" ? pad2(item) : String(item)
          },
          item
        );
      })
    }
  );
}

// src/form/NumberStepper.tsx
import * as React31 from "react";
import { cva as cva10 } from "class-variance-authority";
import { jsx as jsx38, jsxs as jsxs32 } from "react/jsx-runtime";
var numberStepperVariants = cva10(
  "flex items-center rounded-sm border transition-colors",
  {
    variants: {
      invalid: {
        true: "border-danger-default",
        false: "border-border-input"
      },
      fullWidth: {
        /* min-w-0 ต้องมีทุกชั้นของ flex ที่ซ้อนกัน ไม่ใช่แค่ชั้นในสุด — `min-width:auto`
           ทำให้กล่องนี้ยึดความกว้างในตัวของ `<input>` เป็นพื้น ⇒ พอคอลัมน์แคบลง
           (เช่นกางรางเมนู) ปุ่ม −/+ จะทะลุขอบการ์ดแทนที่จะหดตาม */
        true: "min-w-0 flex-1",
        false: ""
      },
      disabled: {
        true: "opacity-60",
        false: ""
      }
    },
    defaultVariants: { invalid: false, fullWidth: false, disabled: false }
  }
);
var stepButtonClass = "cursor-pointer px-2 py-1.5 text-text-body transition-colors hover:text-text-secondary disabled:cursor-not-allowed disabled:text-text-muted";
var NumberStepper = React31.forwardRef(
  function NumberStepper2({
    value,
    onChange,
    step = 1,
    min,
    max,
    precision = 0,
    invalid = false,
    fullWidth = false,
    disabled,
    labels = { decrease: "Decrease", increase: "Increase" },
    className,
    inputClassName,
    ...props
  }, ref) {
    const applyStep = (direction) => {
      const current = Number(value);
      const base = Number.isFinite(current) ? current : min;
      const next = Math.min(max, Math.max(min, base + direction * step));
      onChange(next.toFixed(precision).replace(/\.0+$/, ""));
    };
    return /* @__PURE__ */ jsxs32(
      "div",
      {
        className: cn(
          numberStepperVariants({ invalid, fullWidth, disabled: !!disabled }),
          className
        ),
        children: [
          /* @__PURE__ */ jsx38(
            "button",
            {
              type: "button",
              "aria-label": labels.decrease,
              className: stepButtonClass,
              onClick: () => applyStep(-1),
              disabled,
              children: "\u2212"
            }
          ),
          /* @__PURE__ */ jsx38(
            "input",
            {
              ref,
              type: "text",
              inputMode: "decimal",
              size: 1,
              className: cn(
                "border-border-default text-text-secondary border-x py-1.5 text-center text-sm outline-none",
                "disabled:bg-bg-surface disabled:cursor-not-allowed",
                /* w-10 ในโหมดพอดีเนื้อหา: ค่าที่ใส่ยาวสุดคือ 2 หลักหรือ "4.5" ถ้ากว้างกว่านี้
                   พอมี 5 ช่องเรียงกันที่ 1024px ตัวควบคุมจะล้นการ์ด */
                fullWidth ? "min-w-0 flex-1" : "w-10",
                inputClassName
              ),
              value,
              onChange: (event) => onChange(event.target.value),
              disabled,
              ...props
            }
          ),
          /* @__PURE__ */ jsx38(
            "button",
            {
              type: "button",
              "aria-label": labels.increase,
              className: stepButtonClass,
              onClick: () => applyStep(1),
              disabled,
              children: "+"
            }
          )
        ]
      }
    );
  }
);

// src/form/ComboBox.tsx
import * as React32 from "react";
import { Command as CmdkRoot } from "cmdk";
import { Check as Check5, ChevronDown as ChevronDown4, ChevronsUpDown, Lock, X as X6 } from "lucide-react";

// src/form/group-options.ts
function groupItems(items, groupBy, groupOrder) {
  const ungrouped = [];
  const buckets = /* @__PURE__ */ new Map();
  for (const item of items) {
    const key = groupBy(item);
    if (key == null || key === "") {
      ungrouped.push(item);
      continue;
    }
    const bucket = buckets.get(key);
    if (bucket) bucket.push(item);
    else buckets.set(key, [item]);
  }
  let headings = [...buckets.keys()];
  if (groupOrder?.length) {
    const rank = new Map(groupOrder.map((h, i) => [h, i]));
    headings = headings.sort(
      (a, b) => (rank.get(a) ?? Number.MAX_SAFE_INTEGER) - (rank.get(b) ?? Number.MAX_SAFE_INTEGER)
    );
  }
  const out = [];
  if (ungrouped.length) out.push({ heading: null, items: ungrouped });
  for (const heading of headings) {
    out.push({ heading, items: buckets.get(heading) });
  }
  return out;
}
var GROUP_HEADING_CLASS = "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-caption [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-text-tertiary";

// src/form/ComboBox.tsx
import { Fragment as Fragment9, jsx as jsx39, jsxs as jsxs33 } from "react/jsx-runtime";
var minHeights2 = {
  sm: "min-h-9",
  md: "min-h-11",
  lg: "min-h-12"
};
function ComboBox(props) {
  const {
    id,
    label,
    hint,
    error,
    required,
    hideLabel,
    alwaysFloatLabel,
    placeholder,
    reserveMessageSpace,
    searchPlaceholder = "Search...",
    emptyText = "No results found.",
    options = [],
    groups,
    groupBy,
    groupOrder,
    onSearch,
    optionsLoading,
    isLoading,
    loadingText = "Loading...",
    renderOption,
    disabled,
    typeahead,
    size = "md",
    className,
    containerClassName,
    multiple,
    value,
    defaultValue,
    onChange
  } = props;
  const isMultiple = multiple === true;
  const { renderChip, maxVisibleChips = 3, maxItems } = isMultiple ? props : {};
  const reactId = React32.useId();
  const triggerId = id ?? reactId;
  const [open, setOpen] = React32.useState(false);
  const [query, setQuery] = React32.useState("");
  const typeaheadInputRef = React32.useRef(null);
  const [internal, setInternal] = React32.useState(() => {
    if (isMultiple) return defaultValue ?? [];
    return defaultValue !== void 0 ? [defaultValue] : [];
  });
  const isControlled = value !== void 0;
  const controlled = React32.useMemo(() => {
    if (!isControlled) return void 0;
    if (isMultiple) return value ?? [];
    return value != null ? [value] : [];
  }, [isControlled, isMultiple, value]);
  const selected = controlled ?? internal;
  const setSelected = (next) => {
    if (!isControlled) setInternal(next);
    if (isMultiple) {
      onChange?.(next);
    } else {
      onChange?.(next[0] ?? null);
    }
  };
  const flatOptions = React32.useMemo(
    () => groups ? groups.flatMap((g) => g.options) : options,
    [groups, options]
  );
  const optionByValue = React32.useCallback(
    (v) => flatOptions.find((o) => o.value === v),
    [flatOptions]
  );
  const isLocked = React32.useCallback(
    (opt) => Boolean(isMultiple && opt?.locked),
    [isMultiple]
  );
  const renderGroups = React32.useMemo(() => {
    if (groups) return groups.map((g) => ({ heading: g.heading, items: g.options }));
    if (groupBy) return groupItems(options, groupBy, groupOrder);
    return [{ heading: null, items: options }];
  }, [groups, groupBy, groupOrder, options]);
  const pick = (v) => {
    const opt = optionByValue(v);
    if (!isMultiple) {
      setSelected(selected[0] === v ? [] : [v]);
      setOpen(false);
      return;
    }
    if (selected.includes(v)) {
      if (isLocked(opt)) return;
      setSelected(selected.filter((x) => x !== v));
    } else {
      if (maxItems != null && selected.length >= maxItems) return;
      setSelected([...selected, v]);
    }
  };
  const remove = (v) => {
    if (isLocked(optionByValue(v))) return;
    setSelected(selected.filter((x) => x !== v));
  };
  const clearAll = () => setSelected(selected.filter((v) => isLocked(optionByValue(v))));
  const hasError = Boolean(error);
  const hasValue = selected.length > 0;
  const floating = Boolean(alwaysFloatLabel) || open || hasValue || Boolean(placeholder);
  const visible = selected.slice(0, maxVisibleChips);
  const overflow = selected.length - visible.length;
  if (isLoading) {
    return /* @__PURE__ */ jsx39(
      FieldSkeleton,
      {
        label,
        hint,
        required,
        hideLabel,
        size,
        reserveMessageSpace,
        containerClassName
      }
    );
  }
  const selectedLabel = optionByValue(selected[0])?.label;
  const optionList = /* @__PURE__ */ jsx39(CmdkRoot.List, { className: "max-h-64 overflow-auto p-1", children: optionsLoading ? /* @__PURE__ */ jsxs33(CmdkRoot.Loading, { className: "flex items-center justify-center gap-2 px-3 py-6 text-body-sm text-text-tertiary", children: [
    /* @__PURE__ */ jsx39(Spinner2, { size: "sm" }),
    loadingText
  ] }) : /* @__PURE__ */ jsxs33(Fragment9, { children: [
    /* @__PURE__ */ jsx39(CmdkRoot.Empty, { className: "px-3 py-6 text-center text-body-sm text-text-tertiary", children: emptyText }),
    renderGroups.map((g) => {
      const rows = g.items.map((opt) => /* @__PURE__ */ jsx39(
        ComboBoxItem,
        {
          opt,
          selected,
          locked: isLocked(opt),
          maxItems: isMultiple ? maxItems : void 0,
          renderOption,
          onPick: pick
        },
        opt.value
      ));
      return g.heading == null ? /* @__PURE__ */ jsx39(React32.Fragment, { children: rows }, "__ungrouped") : /* @__PURE__ */ jsx39(
        CmdkRoot.Group,
        {
          heading: g.heading,
          className: GROUP_HEADING_CLASS,
          children: rows
        },
        g.heading
      );
    })
  ] }) });
  const multiFooter = isMultiple && selected.length > 0 && /* @__PURE__ */ jsxs33("div", { className: "flex items-center justify-between border-t border-border-default px-2 py-1.5 text-caption", children: [
    /* @__PURE__ */ jsxs33("span", { className: "text-text-tertiary", children: [
      selected.length,
      " selected",
      maxItems != null && ` / ${maxItems}`
    ] }),
    /* @__PURE__ */ jsxs33(
      "button",
      {
        type: "button",
        onClick: clearAll,
        className: "flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-cherry-red-600 hover:bg-cherry-red-50",
        children: [
          /* @__PURE__ */ jsx39(X6, { className: "size-3" }),
          "Clear"
        ]
      }
    )
  ] });
  if (typeahead && !isMultiple) {
    return (
      /* 🔴 `contents` ไม่ใช่ `w-full` — `Command` ของ cmdk เรนเดอร์เป็น `<div>` จริง
       * ถ้าปล่อยให้มันมีกล่องของตัวเอง จะกลายเป็น **ชั้นบล็อกที่แทรกระหว่างผู้เรียกกับตัวช่อง**
       * ⇒ `containerClassName` ที่ผู้เรียกส่งมา (ความกว้าง/flex) ไปลงที่ชั้นในแทน
       * และตัวที่เป็น flex item จริงกลายเป็น div กว้าง 100% ⇒ ทุกช่องกินเต็มแถวแล้วตกบรรทัด
       * (วัดจากจอจริง 2026-08-14: สามช่องอยู่ `left` เดียวกันหมด `top` ห่างกัน 49px)
       *
       * `display: contents` ทำให้ element นี้ไม่สร้างกล่อง ลูกของมันขึ้นไปเป็น flex item
       * ของผู้เรียกตรง ๆ ⇒ โครงเลย์เอาต์เหมือนโหมดปกติทุกประการ · event กับ context
       * ของ cmdk ยังทำงานครบเพราะ element ยังอยู่ใน DOM */
      /* @__PURE__ */ jsx39(CmdkRoot, { shouldFilter: !onSearch, className: "contents", children: /* @__PURE__ */ jsxs33(
        Popover,
        {
          open,
          onOpenChange: (next) => {
            if (disabled) return;
            setOpen(next);
            if (!next) setQuery("");
          },
          children: [
            /* @__PURE__ */ jsx39(
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
                reserveMessageSpace,
                containerClassName,
                rightAdornment: /* @__PURE__ */ jsx39(
                  ChevronDown4,
                  {
                    className: cn("transition-transform", open && "rotate-180")
                  }
                ),
                children: /* @__PURE__ */ jsx39(PopoverAnchor, { asChild: true, children: /* @__PURE__ */ jsx39(
                  CmdkRoot.Input,
                  {
                    ref: typeaheadInputRef,
                    id: triggerId,
                    disabled,
                    placeholder: floating ? placeholder : void 0,
                    "aria-invalid": hasError || void 0,
                    value: open ? query : selectedLabel ?? "",
                    onValueChange: (v) => {
                      setQuery(v);
                      onSearch?.(v);
                      if (!open) setOpen(true);
                    },
                    onFocus: () => !disabled && setOpen(true),
                    onMouseDown: () => !disabled && setOpen(true),
                    className: cn(
                      fieldShapeClasses({ hasError, size }),
                      "pr-9",
                      className
                    )
                  }
                ) })
              }
            ),
            /* @__PURE__ */ jsx39(
              PopoverContent,
              {
                className: "w-[var(--radix-popover-trigger-width)] p-0",
                align: "start",
                onOpenAutoFocus: (e) => e.preventDefault(),
                onPointerDownOutside: (e) => {
                  if (typeaheadInputRef.current?.contains(e.target)) {
                    e.preventDefault();
                  }
                },
                onFocusOutside: (e) => {
                  if (typeaheadInputRef.current?.contains(e.target)) {
                    e.preventDefault();
                  }
                },
                children: optionList
              }
            )
          ]
        }
      ) })
    );
  }
  return /* @__PURE__ */ jsx39(
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
      reserveMessageSpace,
      containerClassName,
      rightAdornment: /* @__PURE__ */ jsx39(ChevronsUpDown, {}),
      children: /* @__PURE__ */ jsxs33(
        Popover,
        {
          open,
          onOpenChange: (next) => {
            if (disabled) return;
            setOpen(next);
          },
          children: [
            /* @__PURE__ */ jsx39(PopoverTrigger, { asChild: true, children: isMultiple ? (
              /* หลายอัน — กล่อง chip ที่สูงตามจำนวนแถวของ chip */
              /* @__PURE__ */ jsx39(
                "div",
                {
                  id: triggerId,
                  role: "combobox",
                  "aria-labelledby": label ? fieldLabelId(triggerId) : void 0,
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
                    "flex w-full cursor-pointer items-center gap-1.5 rounded-sm border bg-bg-default px-3 py-1.5 pr-9 font-medium transition-colors",
                    "focus:outline-none focus:ring-1",
                    /* พื้นตอนปิดใช้งาน — ค่าเดียวกับ `fieldShapeClasses` (เหตุผลอยู่ที่นั่น) */
                    "aria-disabled:cursor-not-allowed aria-disabled:bg-bg-surface",
                    minHeights2[size],
                    hasError ? "border-cherry-red-600 focus:border-cherry-red-600 focus:ring-cherry-red-600/40" : "border-border-strong focus:border-brand focus:ring-brand/30",
                    className
                  ),
                  children: /* @__PURE__ */ jsx39("span", { className: "flex flex-1 flex-wrap items-center gap-1", children: selected.length === 0 ? /* @__PURE__ */ jsx39("span", { className: "text-body-sm text-text-tertiary", children: floating ? placeholder ?? "" : "" }) : /* @__PURE__ */ jsxs33(Fragment9, { children: [
                    visible.map((v) => {
                      const opt = optionByValue(v) ?? {
                        value: v,
                        label: String(v)
                      };
                      const locked = isLocked(opt);
                      if (renderChip) {
                        return /* @__PURE__ */ jsx39(React32.Fragment, { children: renderChip(opt, { locked }) }, v);
                      }
                      return /* @__PURE__ */ jsx39(
                        Chip,
                        {
                          size: "sm",
                          variant: locked ? "neutral" : "primary",
                          removable: !locked,
                          onRemove: (e) => {
                            e.stopPropagation();
                            remove(v);
                          },
                          children: /* @__PURE__ */ jsxs33("span", { className: "inline-flex items-center gap-1", children: [
                            locked && /* @__PURE__ */ jsx39(Lock, { className: "size-3 shrink-0", "aria-hidden": true }),
                            opt.label
                          ] })
                        },
                        v
                      );
                    }),
                    overflow > 0 && /* @__PURE__ */ jsxs33(Chip, { size: "sm", variant: "neutral", children: [
                      "+",
                      overflow
                    ] })
                  ] }) })
                }
              )
            ) : (
              /* อันเดียว — ปุ่มที่โชว์ป้ายของตัวที่เลือก ตัดท้ายถ้ายาวเกิน */
              /* @__PURE__ */ jsx39(
                "button",
                {
                  id: triggerId,
                  type: "button",
                  disabled,
                  "aria-invalid": hasError || void 0,
                  "aria-expanded": open,
                  className: cn(
                    fieldShapeClasses({ hasError, size }),
                    "flex items-center pr-9 text-left",
                    !selectedLabel && "text-text-tertiary",
                    className
                  ),
                  children: /* @__PURE__ */ jsx39("span", { className: "truncate", children: selectedLabel ?? (floating ? placeholder ?? "" : "") })
                }
              )
            ) }),
            /* @__PURE__ */ jsx39(
              PopoverContent,
              {
                className: "w-[var(--radix-popover-trigger-width)] p-0",
                align: "start",
                children: /* @__PURE__ */ jsxs33(CmdkRoot, { shouldFilter: !onSearch, className: "flex w-full flex-col", children: [
                  /* @__PURE__ */ jsx39(
                    CmdkRoot.Input,
                    {
                      value: query,
                      onValueChange: (v) => {
                        setQuery(v);
                        onSearch?.(v);
                      },
                      placeholder: searchPlaceholder,
                      className: "border-b border-border-default px-3 py-2 text-body-sm outline-none placeholder:text-text-tertiary"
                    }
                  ),
                  optionList,
                  multiFooter
                ] })
              }
            )
          ]
        }
      )
    }
  );
}
function ComboBoxItem({
  opt,
  selected,
  locked,
  maxItems,
  renderOption,
  onPick
}) {
  const checked = selected.includes(opt.value);
  const capped = !checked && maxItems != null && selected.length >= maxItems;
  return /* @__PURE__ */ jsx39(
    CmdkRoot.Item,
    {
      value: opt.label,
      disabled: opt.disabled || capped,
      "aria-disabled": locked || void 0,
      onSelect: () => onPick(opt.value),
      className: cn(
        "flex items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-body-sm",
        locked ? "cursor-default" : "cursor-pointer",
        "data-[selected=true]:bg-brand-subtle",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
      ),
      children: renderOption ? renderOption(opt, {
        selected: checked,
        locked,
        disabled: Boolean(opt.disabled) || capped
      }) : /* @__PURE__ */ jsxs33(Fragment9, { children: [
        /* @__PURE__ */ jsxs33("span", { className: "flex flex-col", children: [
          /* @__PURE__ */ jsx39("span", { children: opt.label }),
          opt.description && /* @__PURE__ */ jsx39("span", { className: "text-caption text-text-tertiary", children: opt.description })
        ] }),
        locked ? /* @__PURE__ */ jsx39(Lock, { className: "size-3.5 shrink-0 text-text-tertiary", "aria-hidden": true }) : checked && /* @__PURE__ */ jsx39(Check5, { className: "size-4 text-text-primary" })
      ] })
    }
  );
}

// src/form/EntityAutocomplete.tsx
import * as React33 from "react";
import { Command as CmdkRoot2 } from "cmdk";
import { Check as Check6, ChevronsUpDown as ChevronsUpDown2, Lock as Lock2, TriangleAlert } from "lucide-react";
import { Fragment as Fragment11, jsx as jsx40, jsxs as jsxs34 } from "react/jsx-runtime";
var minHeights3 = {
  sm: "min-h-9",
  md: "min-h-11",
  lg: "min-h-12"
};
function EntityAutocomplete(props) {
  const {
    id,
    label,
    hint,
    error,
    required,
    hideLabel,
    reserveMessageSpace,
    alwaysFloatLabel,
    placeholder,
    searchPlaceholder = "Search...",
    emptyText = "No results found.",
    searchError,
    disabled,
    size = "md",
    className,
    containerClassName,
    options,
    onSearch,
    debounceMs = 300,
    optionsLoading,
    isLoading,
    loadingText = "Loading...",
    getOptionValue,
    getOptionLabel,
    getOptionDescription,
    renderOption,
    renderChip,
    isOptionLocked,
    groupBy,
    groupOrder,
    maxVisibleChips = 3,
    maxItems,
    multiple,
    value,
    defaultValue,
    onChange
  } = props;
  const isMultiple = multiple === true;
  const reactId = React33.useId();
  const triggerId = id ?? reactId;
  const [open, setOpen] = React33.useState(false);
  const [query, setQuery] = React33.useState("");
  const keyOf = React33.useCallback(
    (item) => String(getOptionValue(item)),
    [getOptionValue]
  );
  const [internalItems, setInternalItems] = React33.useState(() => {
    if (isMultiple) return defaultValue ?? [];
    return defaultValue !== void 0 ? [defaultValue] : [];
  });
  const isControlled = value !== void 0;
  const controlledItems = React33.useMemo(() => {
    if (!isControlled) return void 0;
    if (isMultiple) return value ?? [];
    return value != null ? [value] : [];
  }, [isControlled, isMultiple, value]);
  const selectedItems = controlledItems ?? internalItems;
  const setSelectedItems = (next) => {
    if (!isControlled) setInternalItems(next);
    if (isMultiple) {
      onChange?.(next);
    } else {
      onChange?.(next[0] ?? null);
    }
  };
  const lockedOf = React33.useCallback(
    (item) => isMultiple && isOptionLocked ? isOptionLocked(item) : false,
    [isMultiple, isOptionLocked]
  );
  const selectItem = (item) => {
    const k = keyOf(item);
    if (isMultiple) {
      if (lockedOf(item)) return;
      const exists = selectedItems.some((i) => keyOf(i) === k);
      if (exists) {
        setSelectedItems(selectedItems.filter((i) => keyOf(i) !== k));
      } else {
        if (maxItems != null && selectedItems.length >= maxItems) return;
        setSelectedItems([...selectedItems, item]);
      }
    } else {
      const isSame = selectedItems[0] != null && keyOf(selectedItems[0]) === k;
      setSelectedItems(isSame ? [] : [item]);
      setOpen(false);
    }
  };
  const removeItem = (item) => {
    if (lockedOf(item)) return;
    const k = keyOf(item);
    setSelectedItems(selectedItems.filter((i) => keyOf(i) !== k));
  };
  const clearAll = () => setSelectedItems(selectedItems.filter(lockedOf));
  const hasError = Boolean(error);
  const hasValue = selectedItems.length > 0;
  const floating = Boolean(alwaysFloatLabel) || open || hasValue || Boolean(placeholder);
  const onSearchRef = React33.useRef(onSearch);
  React33.useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);
  React33.useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => onSearchRef.current(query), debounceMs);
    return () => clearTimeout(timer);
  }, [query, open, debounceMs]);
  const visible = selectedItems.slice(0, maxVisibleChips);
  const overflow = selectedItems.length - visible.length;
  const renderGroups = React33.useMemo(
    () => groupBy ? groupItems(options, groupBy, groupOrder) : [{ heading: null, items: options }],
    [options, groupBy, groupOrder]
  );
  const renderRow = (item) => {
    const k = keyOf(item);
    const checked = selectedItems.some((i) => keyOf(i) === k);
    const capped = isMultiple && !checked && maxItems != null && selectedItems.length >= maxItems;
    const locked = lockedOf(item);
    return /* @__PURE__ */ jsx40(
      CmdkRoot2.Item,
      {
        value: k,
        disabled: capped,
        "aria-disabled": locked || void 0,
        onSelect: () => selectItem(item),
        className: cn(
          "flex items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-body-sm",
          locked ? "cursor-default" : "cursor-pointer",
          "data-[selected=true]:bg-brand-subtle",
          "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
        ),
        children: renderOption ? renderOption(item, {
          selected: checked,
          locked,
          disabled: capped
        }) : /* @__PURE__ */ jsxs34(Fragment11, { children: [
          /* @__PURE__ */ jsxs34("span", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx40("span", { children: getOptionLabel(item) }),
            getOptionDescription && /* @__PURE__ */ jsx40("span", { className: "text-caption text-text-tertiary", children: getOptionDescription(item) })
          ] }),
          locked ? /* @__PURE__ */ jsx40(Lock2, { className: "size-3.5 shrink-0 text-text-tertiary", "aria-hidden": true }) : checked && /* @__PURE__ */ jsx40(Check6, { className: "size-4 text-text-primary" })
        ] })
      },
      k
    );
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx40(
      FieldSkeleton,
      {
        label,
        hint,
        required,
        hideLabel,
        size,
        containerClassName
      }
    );
  }
  return /* @__PURE__ */ jsx40(
    FloatingFieldShell,
    {
      label,
      hint,
      error,
      required,
      hideLabel,
      reserveMessageSpace,
      htmlFor: triggerId,
      size,
      floating,
      focused: open,
      hasError,
      containerClassName,
      rightAdornment: /* @__PURE__ */ jsx40(ChevronsUpDown2, {}),
      children: /* @__PURE__ */ jsxs34(
        Popover,
        {
          open,
          onOpenChange: (next) => {
            if (disabled) return;
            setOpen(next);
          },
          children: [
            /* @__PURE__ */ jsx40(PopoverTrigger, { asChild: true, children: isMultiple ? /* @__PURE__ */ jsx40(
              "div",
              {
                id: triggerId,
                role: "combobox",
                "aria-labelledby": label ? fieldLabelId(triggerId) : void 0,
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
                  "flex w-full items-center gap-1.5 rounded-sm border bg-bg-default px-3 py-1.5 pr-9 font-medium transition-colors cursor-pointer",
                  "focus:outline-none focus:ring-1",
                  /* พื้นตอนปิดใช้งาน — ค่าเดียวกับ `fieldShapeClasses` (เหตุผลอยู่ที่นั่น) */
                  "aria-disabled:cursor-not-allowed aria-disabled:bg-bg-surface",
                  minHeights3[size],
                  hasError ? "border-cherry-red-600 focus:border-cherry-red-600 focus:ring-cherry-red-600/40" : "border-border-strong focus:border-brand focus:ring-brand/30",
                  className
                ),
                children: /* @__PURE__ */ jsx40("span", { className: "flex flex-1 flex-wrap items-center gap-1", children: selectedItems.length === 0 ? /* @__PURE__ */ jsx40("span", { className: "text-body-sm text-text-tertiary", children: floating ? placeholder ?? "" : "" }) : /* @__PURE__ */ jsxs34(Fragment11, { children: [
                  visible.map((item) => {
                    const k = keyOf(item);
                    const locked = lockedOf(item);
                    if (renderChip) {
                      return /* @__PURE__ */ jsx40(React33.Fragment, { children: renderChip(item, { locked }) }, k);
                    }
                    return /* @__PURE__ */ jsx40(
                      Chip,
                      {
                        size: "sm",
                        variant: locked ? "neutral" : "primary",
                        removable: !locked,
                        onRemove: (e) => {
                          e.stopPropagation();
                          removeItem(item);
                        },
                        children: /* @__PURE__ */ jsxs34("span", { className: "inline-flex items-center gap-1", children: [
                          locked && /* @__PURE__ */ jsx40(Lock2, { className: "size-3 shrink-0", "aria-hidden": true }),
                          getOptionLabel(item)
                        ] })
                      },
                      k
                    );
                  }),
                  overflow > 0 && /* @__PURE__ */ jsxs34(Chip, { size: "sm", variant: "neutral", children: [
                    "+",
                    overflow
                  ] })
                ] }) })
              }
            ) : /* @__PURE__ */ jsx40(
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
                  !selectedItems[0] && "text-text-tertiary",
                  className
                ),
                children: /* @__PURE__ */ jsx40("span", { className: "truncate", children: selectedItems[0] ? getOptionLabel(selectedItems[0]) : floating ? placeholder ?? "" : "" })
              }
            ) }),
            /* @__PURE__ */ jsx40(
              PopoverContent,
              {
                className: "w-[var(--radix-popover-trigger-width)] p-0",
                align: "start",
                children: /* @__PURE__ */ jsxs34(CmdkRoot2, { shouldFilter: false, className: "flex w-full flex-col", children: [
                  /* @__PURE__ */ jsx40(
                    CmdkRoot2.Input,
                    {
                      value: query,
                      onValueChange: setQuery,
                      placeholder: searchPlaceholder,
                      className: "border-b border-border-default px-3 py-2 text-body-sm outline-none placeholder:text-text-tertiary"
                    }
                  ),
                  /* @__PURE__ */ jsx40(CmdkRoot2.List, { className: "max-h-64 overflow-auto p-1", children: optionsLoading ? /* @__PURE__ */ jsxs34(CmdkRoot2.Loading, { className: "flex items-center justify-center gap-2 px-3 py-6 text-body-sm text-text-tertiary", children: [
                    /* @__PURE__ */ jsx40(Spinner2, { size: "sm" }),
                    loadingText
                  ] }) : searchError ? /* @__PURE__ */ jsxs34("div", { className: "flex items-center justify-center gap-2 px-3 py-6 text-center text-body-sm text-cherry-red-600", children: [
                    /* @__PURE__ */ jsx40(TriangleAlert, { className: "size-4 shrink-0" }),
                    searchError
                  ] }) : /* @__PURE__ */ jsxs34(Fragment11, { children: [
                    /* @__PURE__ */ jsx40(CmdkRoot2.Empty, { className: "px-3 py-6 text-center text-body-sm text-text-tertiary", children: emptyText }),
                    renderGroups.map((g) => {
                      const rows = g.items.map(renderRow);
                      return g.heading == null ? /* @__PURE__ */ jsx40(React33.Fragment, { children: rows }, "__ungrouped") : /* @__PURE__ */ jsx40(
                        CmdkRoot2.Group,
                        {
                          heading: g.heading,
                          className: GROUP_HEADING_CLASS,
                          children: rows
                        },
                        g.heading
                      );
                    })
                  ] }) }),
                  isMultiple && selectedItems.length > 0 && /* @__PURE__ */ jsxs34("div", { className: "flex items-center justify-between border-t border-border-default px-2 py-1.5 text-caption", children: [
                    /* @__PURE__ */ jsxs34("span", { className: "text-text-tertiary", children: [
                      selectedItems.length,
                      " selected",
                      maxItems != null && ` / ${maxItems}`
                    ] }),
                    /* @__PURE__ */ jsx40(
                      "button",
                      {
                        type: "button",
                        onClick: clearAll,
                        className: "flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-cherry-red-600 hover:bg-cherry-red-50",
                        children: "Clear"
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
import * as React34 from "react";
import { jsx as jsx41 } from "react/jsx-runtime";
var Table = React34.forwardRef(function Table2({ className, ...props }, ref) {
  return /* @__PURE__ */ jsx41("div", { className: "relative w-full overflow-auto", children: /* @__PURE__ */ jsx41(
    "table",
    {
      ref,
      className: cn("w-full caption-bottom text-body-sm", className),
      ...props
    }
  ) });
});
var TableHeader = React34.forwardRef(function TableHeader2({ className, ...props }, ref) {
  return /* @__PURE__ */ jsx41(
    "thead",
    {
      ref,
      className: cn("bg-bg-table-header", className),
      ...props
    }
  );
});
var TableBody = React34.forwardRef(function TableBody2({ className, ...props }, ref) {
  return /* @__PURE__ */ jsx41(
    "tbody",
    {
      ref,
      className: cn("[&_tr:last-child]:border-b-0", className),
      ...props
    }
  );
});
var TableFooter = React34.forwardRef(function TableFooter2({ className, ...props }, ref) {
  return /* @__PURE__ */ jsx41(
    "tfoot",
    {
      ref,
      className: cn(
        "border-t border-border-default bg-bg-subtle font-medium",
        className
      ),
      ...props
    }
  );
});
var TableRow = React34.forwardRef(function TableRow2({ className, ...props }, ref) {
  return /* @__PURE__ */ jsx41(
    "tr",
    {
      ref,
      className: cn(
        /* เส้นคั่นแถวใช้ `divider-gray` (#919eab33) — ตรงกับที่วัดจาก Portal เป๊ะ
         * ต่างจาก `border-default` (#0000001f) ที่เข้มกว่าและอมเทาน้อยกว่า */
        "border-b border-divider-gray transition-colors hover:bg-bg-subtle data-[state=selected]:bg-brand-subtle",
        className
      ),
      ...props
    }
  );
});
var TableHead = React34.forwardRef(function TableHead2({ className, ...props }, ref) {
  return /* @__PURE__ */ jsx41(
    "th",
    {
      ref,
      className: cn(
        /* หัวคอลัมน์ = type style **`Body/Small Medium`** ของไฟล์ดีไซน์ (14px · 500 · #535a61)
         * ⚠️ ของเดิมเป็น 12px/600 ตัวพิมพ์ใหญ่ สีจาง (#9b9b9b) — ไม่มีแอปไหนทำแบบนั้น
         * สีมาจาก `text-text-body` ไม่ใช่ `text-text-black` — เหตุผลอยู่ที่ `TableCell` */
        "h-12 px-4 py-3 text-left align-middle text-body-sm font-medium whitespace-nowrap text-text-body",
        /* 🔴 ช่องที่มีแต่ checkbox ต้องเว้นซ้าย-ขวาเท่ากัน ไม่งั้น checkbox ไม่อยู่กึ่งกลาง
         *
         * ของเดิมเป็น `pr-0` (สืบมาจากตาราง shadcn) ⇒ ซ้าย 16 ขวา 0 ⇒ **เนื้อหาเยื้องขวา
         * ครึ่งหนึ่งของ padding ที่หายไป** วัดได้จริงทั้งสองที่: ในแอปคอลัมน์กว้าง 36
         * เยื้อง +8px · ใน Storybook ของ DS เองคอลัมน์กว้าง 100 เยื้อง −24px
         * (ทิศต่างกันเพราะความกว้างคอลัมน์ต่างกัน แต่ต้นเหตุเดียวกันคือ padding ไม่สมมาตร)
         *
         * `px-3` ให้ทั้งสองข้างเท่ากันและแคบกว่า `px-4` เดิมเล็กน้อย — คอลัมน์เลือกไม่ควร
         * กินที่เท่าคอลัมน์เนื้อหา แต่ต้องสมมาตรเพื่อให้กึ่งกลางเป็นกึ่งกลางจริง */
        "[&:has([role=checkbox])]:px-3",
        className
      ),
      ...props
    }
  );
});
var TableCell = React34.forwardRef(function TableCell2({ className, ...props }, ref) {
  return /* @__PURE__ */ jsx41(
    "td",
    {
      ref,
      className: cn(
        /* เซลล์ข้อมูล = type style **`Body/Small Regular`** ของไฟล์ดีไซน์ (14px · 400 · #535a61)
         *
         * 🔴 **400 ไม่ใช่ 600** — ค่าเดิมคือ 600/#191919 ซึ่ง**ย้อนรอยมาจากตารางของ Portal**
         * ไม่ใช่สเปกของ DS · ผลคือทุกแอปที่อยากได้เนื้อความปกติต้องห่อทุกเซลล์ด้วย `<Text>`
         * เพื่อ**ล้มค่าตั้งต้นของตัวเอง** (MediHR ทำอยู่ 3 จอ) และเซลล์ที่ลืมห่อจะหนากว่า
         * ชื่อคนซึ่งเป็นของหลักในแถว — กลับหัวลำดับความสำคัญ
         * หลักฐาน: Figma ประกาศ style ในตารางไว้แค่ 2 ตัว — หัวคอลัมน์ `Body/Small Medium`
         * (500) · เซลล์ `Body/Small Regular` (400) · ตรงกันทั้งจอวันหยุด (544:15745)
         * และจอบุคลากร (544:22556) · ที่โผล่เป็น Montserrat Medium ในบางคอลัมน์คือ text
         * ที่ยังไม่ได้ผูก style ไม่ใช่เจตนา
         *
         * 🔴 สีต้อง **ไม่ผูกกับแบรนด์** — เดิมเคยใช้ `text-text-primary` ซึ่งใน `theme.css`
         * ถูก alias ไปที่ `--color-brand` ⇒ ตัวเลขในตารางเปลี่ยนสีตามแอป (วัดแล้ว:
         * Mediwork `rgb(38,209,179)` เขียวมิ้นต์สด · MediHR `rgb(6,17,172)` · Medimatch
         * `rgb(4,129,168)`) · `text-text-body` (#535a61) ประกาศครั้งเดียวที่ `:root`
         * ไม่มีธีมไหน override ⇒ คงที่ทุกแอปเหมือนที่ `text-text-black` เคยให้ และตรงกับ
         * ตัวแปรที่ดีไซน์อ้างถึงตรง ๆ (`--color/text/body`) · ต้องเป็นสีเดียวกับหัวตารางเสมอ */
        "h-16 px-4 py-3 align-middle text-body-sm font-normal text-text-body",
        /* 🔴 ช่องที่มีแต่ checkbox ต้องเว้นซ้าย-ขวาเท่ากัน ไม่งั้น checkbox ไม่อยู่กึ่งกลาง
         *
         * ของเดิมเป็น `pr-0` (สืบมาจากตาราง shadcn) ⇒ ซ้าย 16 ขวา 0 ⇒ **เนื้อหาเยื้องขวา
         * ครึ่งหนึ่งของ padding ที่หายไป** วัดได้จริงทั้งสองที่: ในแอปคอลัมน์กว้าง 36
         * เยื้อง +8px · ใน Storybook ของ DS เองคอลัมน์กว้าง 100 เยื้อง −24px
         * (ทิศต่างกันเพราะความกว้างคอลัมน์ต่างกัน แต่ต้นเหตุเดียวกันคือ padding ไม่สมมาตร)
         *
         * `px-3` ให้ทั้งสองข้างเท่ากันและแคบกว่า `px-4` เดิมเล็กน้อย — คอลัมน์เลือกไม่ควร
         * กินที่เท่าคอลัมน์เนื้อหา แต่ต้องสมมาตรเพื่อให้กึ่งกลางเป็นกึ่งกลางจริง */
        "[&:has([role=checkbox])]:px-3",
        className
      ),
      ...props
    }
  );
});
var TableCaption = React34.forwardRef(function TableCaption2({ className, ...props }, ref) {
  return /* @__PURE__ */ jsx41(
    "caption",
    {
      ref,
      className: cn("mt-4 text-body-sm text-text-tertiary", className),
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
import * as React36 from "react";
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
  ChevronRight as ChevronRight3,
  ChevronsUpDown as ChevronsUpDown3,
  Inbox
} from "lucide-react";

// src/feedback/EmptyState.tsx
import { AlertTriangle } from "lucide-react";
import { jsx as jsx42, jsxs as jsxs35 } from "react/jsx-runtime";
var toneBg = {
  /* ตัวเดียวที่เปลี่ยนตามแอป — อีก 5 ตัวเป็นสีความหมาย (สำเร็จ/เตือน/ผิดพลาด)
   * ซึ่งต้องเหมือนกันทุกแอปโดยตั้งใจ */
  brand: "bg-brand-subtle",
  info: "bg-info-blue-50",
  success: "bg-success-green-50",
  warning: "bg-warning-yellow-50",
  danger: "bg-cherry-red-50",
  /* `bg-subtle` (#fbfbfd) จางเกินจนป้ายหายไปบนการ์ดขาว — ใช้หมึกโปร่ง 10%
   * ซึ่งเห็นได้บนพื้นทุกสี ไม่ใช่แค่พื้นขาว */
  neutral: "bg-overlay-press",
  none: ""
};
var sizeMap = {
  sm: { badge: "size-14", glyph: "[&_svg]:size-6", title: "text-body-lg", gap: "mb-4" },
  md: { badge: "size-18", glyph: "[&_svg]:size-8", title: "text-title-sm sm:text-title-md", gap: "mb-6" }
};
function StateBlock({
  icon,
  image,
  title,
  description,
  action,
  tone = "brand",
  mediaShape,
  size = "md",
  mediaClassName,
  minHeight,
  className,
  style,
  ...props
}) {
  const sz = sizeMap[size];
  const media = image ?? icon;
  const shape = mediaShape ?? (image ? "none" : "circle");
  const showBadge = shape !== "none" && tone !== "none";
  return /* @__PURE__ */ jsx42(
    "div",
    {
      className: cn("flex w-full justify-center p-3", className),
      style: { ...minHeight != null ? { minHeight } : null, ...style },
      ...props,
      children: /* @__PURE__ */ jsxs35("div", { className: "w-full max-w-[600px] rounded-xl bg-bg-default p-8 text-center", children: [
        media && /* @__PURE__ */ jsx42("div", { className: cn("flex justify-center", sz.gap), children: showBadge ? /* @__PURE__ */ jsx42(
          "div",
          {
            className: cn(
              "inline-flex shrink-0 items-center justify-center",
              "rounded-full",
              sz.badge,
              /* บังคับขนาดไอคอนที่ป้าย ไม่ใช่ที่ตัวไอคอน — `.parent > svg` ชนะ
               * class ของลูกด้วย specificity จึงกันการรับดีไซน์ครึ่งเดียวได้จริง */
              image ? "" : sz.glyph,
              toneBg[tone],
              mediaClassName
            ),
            children: media
          }
        ) : /* @__PURE__ */ jsx42("div", { className: cn(image ? "[&_img]:max-h-40 [&_img]:w-auto" : sz.glyph, mediaClassName), children: media }) }),
        title && /* @__PURE__ */ jsx42(
          "h2",
          {
            className: cn(
              "mb-4 font-semibold leading-tight text-text-secondary",
              sz.title
            ),
            children: title
          }
        ),
        description && /* @__PURE__ */ jsx42("p", { className: "text-body-md leading-[1.7] text-text-tertiary", children: description }),
        action && /* @__PURE__ */ jsx42("div", { className: "mt-8 flex justify-center", children: action })
      ] })
    }
  );
}
function EmptyState({ iconTone, tone, ...props }) {
  return /* @__PURE__ */ jsx42(StateBlock, { tone: tone ?? iconTone ?? "brand", ...props });
}
function ErrorState({
  icon,
  image,
  tone = "danger",
  onRetry,
  retryLabel,
  action,
  error: _error,
  ...props
}) {
  return /* @__PURE__ */ jsx42(
    StateBlock,
    {
      tone,
      icon: image ? void 0 : icon ?? /* @__PURE__ */ jsx42(AlertTriangle, {}),
      image,
      action: action ?? (onRetry ? /* @__PURE__ */ jsx42(RetryButton, { onClick: onRetry, children: retryLabel ?? "Retry" }) : void 0),
      ...props
    }
  );
}
function RetryButton({
  children,
  onClick
}) {
  return /* @__PURE__ */ jsx42(
    "button",
    {
      type: "button",
      onClick,
      className: "inline-flex h-9 items-center rounded-md border border-border-strong bg-bg-default px-4 text-body-sm font-medium text-text-secondary transition-colors hover:bg-bg-subtle focus:outline-none focus-visible:ring-1 focus-visible:ring-brand",
      children
    }
  );
}

// src/data/table-groups.tsx
import { ChevronDown as ChevronDown5 } from "lucide-react";
import { jsx as jsx43, jsxs as jsxs36 } from "react/jsx-runtime";
function resolveGroups(rows, groupBy, groupOrder, collapsedKeys) {
  const collapsed = new Set(collapsedKeys);
  return groupItems(rows, (row) => groupBy(row.original), groupOrder).map(
    (g) => ({
      key: g.heading,
      rows: g.items,
      collapsed: g.heading != null && collapsed.has(g.heading)
    })
  );
}
function DataTableGroupRow({
  colSpan,
  label,
  collapsible,
  collapsed,
  onToggle,
  toggleAriaLabel
}) {
  return /* @__PURE__ */ jsx43(TableRow, { className: "border-t border-divider-gray hover:bg-transparent", children: /* @__PURE__ */ jsx43(
    TableHead,
    {
      scope: "colgroup",
      colSpan,
      className: cn(
        /* `TableHead` ตั้งต้นสูง 48 + `whitespace-nowrap` — แถบกลุ่มต้องเตี้ยกว่าหัวจริง
         * และต้องตัดบรรทัดได้ เพราะป้ายกลุ่มเป็นข้อความยาว (ชื่อวันที่เต็ม) ไม่ใช่ชื่อคอลัมน์ */
        "h-auto whitespace-normal bg-bg-table-header py-2.5 font-semibold"
      ),
      children: collapsible ? /* @__PURE__ */ jsxs36(
        "button",
        {
          type: "button",
          onClick: onToggle,
          "aria-expanded": !collapsed,
          "aria-label": toggleAriaLabel,
          className: "-mx-1 flex items-center gap-1.5 rounded-sm px-1 py-0.5 hover:bg-overlay-hover focus:outline-none focus-visible:ring-1 focus-visible:ring-brand",
          children: [
            /* @__PURE__ */ jsx43(
              ChevronDown5,
              {
                "aria-hidden": true,
                className: cn(
                  "size-4 shrink-0 text-text-tertiary transition-transform",
                  collapsed && "-rotate-90"
                )
              }
            ),
            label
          ]
        }
      ) : label
    }
  ) });
}
function defaultGroupLabel({
  key,
  count
}) {
  return `${key} (${count})`;
}

// src/data/use-frozen-columns.ts
import * as React35 from "react";
function pickFrozenIds(renderedIds, freeze, hasSelectionColumn) {
  const left = /* @__PURE__ */ new Set();
  const right = /* @__PURE__ */ new Set();
  if (!freeze) return { left, right };
  const leftCount = freeze.left ? freeze.left + (hasSelectionColumn ? 1 : 0) : 0;
  const rightCount = freeze.right ?? 0;
  const capLeft = Math.min(leftCount, renderedIds.length);
  const capRight = Math.min(rightCount, Math.max(0, renderedIds.length - capLeft));
  renderedIds.slice(0, capLeft).forEach((id) => left.add(id));
  if (capRight > 0) renderedIds.slice(-capRight).forEach((id) => right.add(id));
  return { left, right };
}
function useFrozenOffsets(tableRef, leftIds, rightIds) {
  const [offsets, setOffsets] = React35.useState({});
  const key = `${[...leftIds].join()}|${[...rightIds].join()}`;
  React35.useLayoutEffect(() => {
    const table = tableRef.current;
    if (!table || leftIds.size === 0 && rightIds.size === 0) {
      setOffsets((prev) => Object.keys(prev).length ? {} : prev);
      return;
    }
    const measure = () => {
      const cells = Array.from(
        table.querySelectorAll("thead th[data-col-id]")
      );
      const widths = cells.map((c) => c.getBoundingClientRect().width);
      const next = {};
      const leftSeen = [];
      const rightSeen = [];
      cells.forEach((cell, i) => {
        const id = cell.dataset.colId;
        if (!id) return;
        if (leftIds.has(id)) {
          const offset = widths.slice(0, i).reduce((a, w) => a + w, 0);
          next[id] = { side: "left", offset, edge: false };
          leftSeen.push(id);
        } else if (rightIds.has(id)) {
          const offset = widths.slice(i + 1).reduce((a, w) => a + w, 0);
          next[id] = { side: "right", offset, edge: false };
          rightSeen.push(id);
        }
      });
      const lastLeft = leftSeen[leftSeen.length - 1];
      const firstRight = rightSeen[0];
      if (lastLeft && next[lastLeft]) next[lastLeft].edge = true;
      if (firstRight && next[firstRight]) next[firstRight].edge = true;
      setOffsets((prev) => sameOffsets(prev, next) ? prev : next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(table);
    return () => ro.disconnect();
  }, [tableRef, key]);
  return offsets;
}
function sameOffsets(a, b) {
  const ak = Object.keys(a);
  const bk = Object.keys(b);
  if (ak.length !== bk.length) return false;
  return ak.every(
    (k) => b[k] && b[k].side === a[k].side && b[k].offset === a[k].offset && b[k].edge === a[k].edge
  );
}
function frozenCellProps(frozen, kind) {
  if (!frozen) return {};
  const shadow = frozen.side === "left" ? "shadow-[inset_-1px_0_0_0_var(--color-divider-gray)]" : "shadow-[inset_1px_0_0_0_var(--color-divider-gray)]";
  return {
    className: [
      "sticky z-20",
      kind === "head" ? "bg-bg-table-header" : "bg-bg-default group-hover/row:bg-bg-subtle group-data-[state=selected]/row:bg-brand-subtle",
      frozen.edge ? shadow : void 0
    ].filter(Boolean).join(" "),
    style: frozen.side === "left" ? { left: frozen.offset } : { right: frozen.offset }
  };
}

// src/data/DataTable.tsx
import { Fragment as Fragment13, jsx as jsx44, jsxs as jsxs37 } from "react/jsx-runtime";
function DataTable({
  columns,
  data,
  isLoading,
  pagination,
  sorting: sortingProp,
  onSortingChange,
  manualSorting,
  enableSelection,
  isRowSelectable,
  minTableWidth,
  freezeColumns,
  rowSelection: rowSelectionProp,
  onRowSelectionChange,
  getRowId,
  onRowClick,
  stickyHeader,
  skeletonRowCount,
  containerClassName,
  cardClassName,
  empty,
  emptyIcon,
  errorIcon,
  renderEmpty,
  isFiltered,
  renderError,
  className,
  error,
  errorSlot,
  onRetry,
  labels,
  groupBy,
  groupOrder,
  groupLabel,
  collapsibleGroups,
  defaultCollapsedGroups,
  collapsedGroups,
  onCollapsedGroupsChange
}) {
  const explicitWidths = React36.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    columns.forEach((c, i) => {
      if (c.size == null) return;
      const key = c.id ?? c.accessorKey ?? String(i);
      m.set(String(key), c.size);
    });
    return m;
  }, [columns]);
  const resolve = (updater, prev) => typeof updater === "function" ? updater(prev) : updater;
  const [internalSorting, setInternalSorting] = React36.useState([]);
  const sorting = sortingProp ?? internalSorting;
  const handleSortingChange = (updater) => {
    const next = resolve(updater, sorting);
    if (onSortingChange) onSortingChange(next);
    else setInternalSorting(next);
  };
  const [internalSelection, setInternalSelection] = React36.useState({});
  const rowSelection = rowSelectionProp ?? internalSelection;
  const handleSelectionChange = (updater) => {
    const next = resolve(updater, rowSelection);
    if (onRowSelectionChange) onRowSelectionChange(next);
    else setInternalSelection(next);
  };
  const [internalCollapsed, setInternalCollapsed] = React36.useState(
    () => [...defaultCollapsedGroups ?? []]
  );
  const collapsedKeys = collapsedGroups ?? internalCollapsed;
  const toggleGroup = (key) => {
    const next = collapsedKeys.includes(key) ? collapsedKeys.filter((k) => k !== key) : [...collapsedKeys, key];
    if (onCollapsedGroupsChange) onCollapsedGroupsChange(next);
    else setInternalCollapsed(next);
  };
  const finalColumns = React36.useMemo(() => {
    if (!enableSelection) return columns;
    const selectColumn = {
      id: "__select",
      size: 40,
      /* 🔴 `size` เป็น**ค่าต่ำสุด** ไม่ใช่ความกว้างตายตัว — ถ้าตารางมีที่เหลือ คอลัมน์นี้จะยืด
       * ตามไปด้วย (วัดใน Storybook ได้ 121px สำหรับ checkbox กว้าง 20) แล้ว checkbox
       * จะลอยชิดซ้ายในช่องกว้าง ๆ · `meta.width` เป็นเพดานจริง จึงต้องใส่คู่กัน
       *
       * ⚠️ ล็อกความกว้างอย่างเดียวไม่พอ ต้องจัดกึ่งกลางด้วย ไม่งั้นพอคอลัมน์ยังกว้างกว่า
       * เนื้อหา (เช่นตารางที่ตั้ง `minTableWidth` ไว้กว้าง) ก็จะเยื้องซ้ายอยู่ดี
       *
       * 🔴 จัดกึ่งกลางด้วย **flex ไม่ใช่ `text-center`** — `Checkbox` เป็น `display:flex`
       * จึงเป็นกล่องระดับบล็อก ซึ่ง `text-align` ไม่มีผลกับมัน (ลองแล้วเหลือเยื้อง 2px) */
      meta: { width: 48 },
      header: ({ table: table2 }) => {
        const rows = table2.getRowModel().rows;
        const selectable = rows.filter((r) => r.getCanSelect());
        const picked = selectable.filter((r) => r.getIsSelected()).length;
        return /* @__PURE__ */ jsx44("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx44(
          Checkbox,
          {
            checked: selectable.length > 0 && picked === selectable.length ? true : picked > 0 ? "indeterminate" : false,
            disabled: selectable.length === 0,
            onCheckedChange: (v) => table2.setRowSelection((prev) => {
              const next = { ...prev };
              selectable.forEach((r) => {
                if (v === true) next[r.id] = true;
                else delete next[r.id];
              });
              return next;
            }),
            "aria-label": labels?.selectAllAriaLabel ?? "Select all"
          }
        ) });
      },
      cell: ({ row }) => /* @__PURE__ */ jsx44("div", { className: "flex justify-center", onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsx44(
        Checkbox,
        {
          checked: row.getIsSelected(),
          disabled: !row.getCanSelect(),
          onCheckedChange: (v) => row.toggleSelected(v === true),
          "aria-label": labels?.selectRowAriaLabel ?? "Select row"
        }
      ) }),
      enableSorting: false
    };
    return [selectColumn, ...columns];
  }, [columns, enableSelection, labels?.selectAllAriaLabel, labels?.selectRowAriaLabel]);
  const table = useReactTable({
    data,
    columns: finalColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: manualSorting ? void 0 : getSortedRowModel(),
    state: { sorting, rowSelection },
    onSortingChange: handleSortingChange,
    onRowSelectionChange: handleSelectionChange,
    /* ส่งเป็นฟังก์ชันเมื่อมีเงื่อนไข ⇒ `row.getCanSelect()` ตอบตามจริง
     * ทั้งช่องติ๊กรายแถวและ select-all อ่านค่าเดียวกันนี้ ไม่แยกกันคิด */
    enableRowSelection: enableSelection ? isRowSelectable ? (row) => isRowSelectable(row.original) : true : false,
    manualSorting,
    manualPagination: !!pagination,
    rowCount: pagination?.rowCount,
    getRowId
  });
  const totalPages = pagination ? Math.max(
    1,
    pagination.pageCount ?? Math.ceil(pagination.rowCount / pagination.pageSize)
  ) : 1;
  const currentPage = pagination ? pagination.pageIndex + 1 : 1;
  const tableRef = React36.useRef(null);
  const renderedIds = table.getVisibleLeafColumns().map((c) => c.id);
  const { left: frozenLeft, right: frozenRight } = pickFrozenIds(
    renderedIds,
    freezeColumns,
    Boolean(enableSelection)
  );
  const frozen = useFrozenOffsets(tableRef, frozenLeft, frozenRight);
  const hasFrozen = frozenLeft.size > 0 || frozenRight.size > 0;
  const showFiller = hasFrozen && !isLoading && !error && table.getRowModel().rows.length > 0;
  return (
    /* 🔴 แถบแบ่งหน้าอยู่ **นอก**การ์ดที่มีขอบ — โครงตาม `ActionTabel` ของ Portal:
     * กล่องนอกไม่มีขอบ · การ์ดตารางอยู่ข้างใน · แถบแบ่งหน้าเป็นพี่น้องของการ์ด
     * ไม่ใช่ลูก ⇒ ไม่มีเส้นคั่นบนแถบ
     * ของเดิมที่นี่เอาแถบไปไว้ในการ์ดแล้วขีดเส้น `border-t` คั่น ซึ่งไม่ตรงกับที่ไหน
     *
     * ⚠️ ระยะห่างเป็น `gap-1` (4) **ไม่ใช่ `gap-4` (16) ของ Portal** — ตั้งใจต่างเอง
     * เพราะแถบมี `py-4` ของตัวเองอยู่แล้ว ⇒ ของ Portal วัดจากขอบการ์ดถึงตัวหนังสือ
     * ได้ 38 ซึ่งดูหลุดจากตาราง · ลดเหลือ 4 แล้วได้ 26 แถบยังไม่ติดขอบการ์ด
     * เพราะ padding ของตัวมันเองกันไว้ */
    /* @__PURE__ */ jsxs37("div", { className: cn("flex min-h-0 flex-col gap-1", className), children: [
      /* @__PURE__ */ jsx44(
        "div",
        {
          className: cn(
            /* วัดจาก Portal จริง: radius 12 · เส้นขอบ #919eab33 · เงาบาง 2 ชั้น
             * (ของเดิม radius 6 · ไม่มีเงา ⇒ ตารางกลืนไปกับพื้นหน้า)
             *
             * `flex-auto` ไม่ใช่ `flex-1` — `flex-1` ตั้ง basis เป็น 0 พอคู่กับ
             * `min-h-0` การ์ดจะยุบเหลือ 0 ในกล่องที่สูงตามเนื้อหา · `flex-auto`
             * (basis auto) สูงตามเนื้อหาเป็นปกติ แต่ยังยืด/หดได้เมื่อพ่อจำกัดความสูง
             * ซึ่งเป็นเคสที่ผู้เรียกส่ง `className="min-h-0 flex-1"` มาเพื่อให้ตาราง
             * เลื่อนในตัวเอง (hr-web EmployeeTable ทำแบบนั้น) */
            "flex min-h-0 flex-auto flex-col overflow-hidden rounded-xl border border-divider-gray bg-bg-default shadow-sm",
            /* ผู้เรียกทับได้ — จอที่วางตารางไว้ในการ์ดใบใหญ่ต้องลบกรอบชั้นนี้ทิ้ง
               ไม่งั้นได้กรอบซ้อนกันสองชั้น (ดู `cardClassName` ใน props) */
            cardClassName
          ),
          children: /* @__PURE__ */ jsx44(
            "div",
            {
              className: cn(
                stickyHeader && [
                  "max-h-[600px] overflow-auto",
                  /* 🔴 ปลด `overflow-auto` ของกล่องที่ `Table` ห่อตัวเองไว้ ตอนที่หัวตารางต้องค้าง
                   *
                   * `position: sticky` ยึดกับ **กล่องที่เลื่อนได้ที่ใกล้ที่สุด** ซึ่งคือกล่องชั้นในนั้น
                   * — แต่กล่องชั้นในไม่เคยเลื่อนแนวตั้ง (ไม่มีเพดานความสูง มันจึงสูงเท่าเนื้อหา)
                   * ⇒ หัวตาราง "ค้าง" กับกล่องที่ตัวมันเองเลื่อนหายไปพร้อมกัน = ไม่ค้างเลย
                   * (วัดสด 2026-08-10: เลื่อนลง 250 แล้ว `thead` ขยับตาม 250 เต็ม ๆ ทั้งที่มี
                   *  `sticky top-0` ครบ — ปัญหาอยู่ที่ว่ายึดผิดกล่อง ไม่ใช่ที่คลาส)
                   *
                   * พอปลดออก กล่องนี้กลายเป็นกล่องเลื่อน**กล่องเดียว**ของทั้งสองแกน
                   * หัวตารางจึงค้างแนวตั้ง และคอลัมน์ที่แช่ไว้ยังค้างแนวนอนเหมือนเดิม */
                  "[&>div]:overflow-visible"
                ],
                /* 🔴 กล่องชั้นในที่ `Table` ห่อตัวเองไว้ต้องสูงเต็มด้วย ไม่งั้น `h-full` ของ `<table>`
                 * ไป resolve กับกล่องที่สูงตามเนื้อหา ⇒ ได้ auto = ไม่ยืด แล้วแถวเติมช่องว่าง
                 * (`FrozenFillerRow`) ก็ไม่มีที่ให้ยืดตาม เส้นแบ่งเลยยังลากไม่ถึงก้นเหมือนเดิม
                 * (วัดสด: ก้นตาราง 586 · ก้นกล่อง 692 — ห่าง 106px ที่ไม่มีเส้น) */
                hasFrozen && "[&>div]:h-full",
                containerClassName
              ),
              children: /* @__PURE__ */ jsxs37(
                Table,
                {
                  ref: tableRef,
                  className: hasFrozen ? "h-full" : void 0,
                  style: minTableWidth != null ? { minWidth: minTableWidth } : void 0,
                  children: [
                    /* @__PURE__ */ jsx44(
                      TableHeader,
                      {
                        className: cn(
                          /* 🔴 ห้ามใส่สีพื้นตรงนี้ — `TableHeader` มี `bg-bg-table-header` อยู่ที่ base
                           * แล้ว และ class ที่ส่งเข้ามาทาง `className` ชนะเสมอผ่าน tailwind-merge
                           * ⇒ เคยเขียน `bg-bg-default` ไว้ หัวที่ค้างจึงกลายเป็น**สีขาว** ตอนเลื่อน
                           * ทั้งที่ตอนไม่เลื่อนเป็น #ededf5 · สีพื้นของ base ทึบอยู่แล้วจึงยังบังแถว
                           * ที่เลื่อนผ่านได้ตามหน้าที่ของ sticky */
                          /* 🔴 `z-30` ไม่ใช่ `z-10` — เซลล์ของคอลัมน์ที่แช่ไว้ (`freezeColumns`) เป็น
                           * `sticky z-20` ทั้งหัวและตัว ⇒ ถ้าหัวตารางอยู่ที่ 10 **เซลล์ข้อมูลที่แช่ไว้
                           * จะลอยทับหัวตาราง** ตอนเลื่อนลง (เห็นชื่อคนนั่งอยู่ในแถวหัวคอลัมน์ —
                           * วัดสด 2026-08-10 หลังแก้ให้ sticky ทำงานจริง อาการนี้ถึงโผล่)
                           * ต้องสูงกว่า 20 เสมอ: หัวตารางบังทุกอย่างที่เลื่อนผ่านใต้มัน */
                          stickyHeader && "sticky top-0 z-30 shadow-[0_1px_0_0_#0000001f]"
                        ),
                        children: table.getHeaderGroups().map((hg) => /* @__PURE__ */ jsx44(TableRow, { className: "hover:bg-transparent", children: hg.headers.map((header) => {
                          const sortable = header.column.getCanSort();
                          const sortDir = header.column.getIsSorted();
                          const pin = frozenCellProps(frozen[header.column.id], "head");
                          return /* @__PURE__ */ jsx44(
                            TableHead,
                            {
                              "data-col-id": header.column.id,
                              className: cn(
                                pin.className,
                                header.column.columnDef.meta?.headerClassName
                              ),
                              style: {
                                ...explicitWidths.has(header.column.id) ? { minWidth: explicitWidths.get(header.column.id) } : null,
                                /* `meta.width` = กว้างเป๊ะ ⇒ ตั้งทั้ง width และ maxWidth
                                 * ไม่งั้น `table-auto` จะยืดคอลัมน์ตามเนื้อหาอยู่ดี */
                                ...header.column.columnDef.meta?.width != null ? {
                                  width: header.column.columnDef.meta.width,
                                  maxWidth: header.column.columnDef.meta.width
                                } : null,
                                ...pin.style
                              },
                              children: header.isPlaceholder ? null : sortable ? /* @__PURE__ */ jsxs37(
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
                                    sortDir === "asc" ? /* @__PURE__ */ jsx44(ArrowUp, { className: "size-3" }) : sortDir === "desc" ? /* @__PURE__ */ jsx44(ArrowDown, { className: "size-3" }) : /* @__PURE__ */ jsx44(ChevronsUpDown3, { className: "size-3 opacity-60" })
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
                    /* @__PURE__ */ jsxs37(
                      TableBody,
                      {
                        className: showFiller ? "[&_tr:nth-last-child(2)]:border-b-0" : void 0,
                        children: [
                          isLoading ? /* @__PURE__ */ jsx44(
                            SkeletonRows,
                            {
                              columnCount: finalColumns.length,
                              rowCount: skeletonRowCount ?? Math.min(pagination?.pageSize ?? 5, 10)
                            }
                          ) : error ? /* @__PURE__ */ jsx44(TableRow, { className: "hover:bg-transparent", children: /* @__PURE__ */ jsx44(TableCell, { colSpan: finalColumns.length, className: "p-0", children: renderError ? renderError({ error, retry: onRetry }) : errorSlot ?? /* ใช้ `ErrorState` ตัวเดียวกับที่แอปใช้ ไม่ประกอบเองในตาราง —
                           * ไม่งั้นสถานะผิดพลาดในตารางจะหน้าตาต่างจากที่อื่นในจอเดียวกัน */
                          /* @__PURE__ */ jsx44(
                            ErrorState,
                            {
                              error,
                              icon: errorIcon,
                              title: labels?.error?.title ?? "Something went wrong",
                              description: labels?.error?.description ?? "We couldn't load this data.",
                              onRetry,
                              retryLabel: labels?.retry ?? "Retry"
                            }
                          ) }) }) : table.getRowModel().rows.length === 0 ? /* @__PURE__ */ jsx44(TableRow, { className: "hover:bg-transparent", children: /* @__PURE__ */ jsx44(
                            TableCell,
                            {
                              colSpan: finalColumns.length,
                              className: "p-0",
                              children: renderEmpty ? renderEmpty({ isFiltered: Boolean(isFiltered) }) : empty ?? /* 🔴 ต้องมีไอคอนด้วย ไม่ใช่ข้อความเปล่า — ตารางเคยส่งแค่
                               * `title`/`description` ⇒ `EmptyState` ไม่ render ป้ายเลย
                               * แล้วสถานะว่างในตารางหน้าตาไม่เหมือน `EmptyState` ที่อื่นในจอเดียวกัน
                               * ทั้งที่เรียก component ตัวเดียวกันอยู่ · ผู้เรียกเปลี่ยนไอคอน
                               * ให้ตรงกับสิ่งที่ตารางนี้แสดงได้ผ่าน `emptyIcon` */
                              /* @__PURE__ */ jsx44(
                                EmptyState,
                                {
                                  icon: emptyIcon ?? /* @__PURE__ */ jsx44(Inbox, {}),
                                  title: labels?.empty?.title ?? "No data",
                                  description: labels?.empty?.description ?? "There's nothing to show here yet."
                                }
                              )
                            }
                          ) }) : groupBy ? /* @__PURE__ */ jsx44(
                            GroupedRows,
                            {
                              table,
                              groupBy,
                              groupOrder,
                              groupLabel,
                              collapsibleGroups,
                              collapsedKeys,
                              onToggleGroup: toggleGroup,
                              toggleGroupLabel: labels?.toggleGroup ?? "Toggle group",
                              onRowClick,
                              frozen
                            }
                          ) : table.getRowModel().rows.map((row, idx) => /* @__PURE__ */ jsx44(
                            DataRow,
                            {
                              row,
                              frozen,
                              onClick: onRowClick ? () => onRowClick(row.original, idx) : void 0
                            },
                            row.id
                          )),
                          showFiller && /* @__PURE__ */ jsx44(FrozenFillerRow, { columns: finalColumns, frozen })
                        ]
                      }
                    )
                  ]
                }
              )
            }
          )
        }
      ),
      pagination ? /* @__PURE__ */ jsx44(
        PaginationFooter,
        {
          pagination,
          currentPage,
          totalPages,
          table,
          labels
        }
      ) : (
        /* 🔴 ตัวนับ "เลือกแล้ว N" เคยอยู่ในแถบแบ่งหน้าเท่านั้น ⇒ ตารางที่เลือกแถวได้
         * แต่ไม่มีแบ่งหน้าจะ **ติ๊กแล้วไม่มีอะไรบอกเลย** (ของจริง: เลือกได้ 11 ตาราง
         * แต่มีแบ่งหน้าแค่ 6) — การเลือกที่ไม่มีผลตอบกลับคือการเลือกที่ผู้ใช้ไม่มั่นใจ */
        /* @__PURE__ */ jsx44(SelectedCountBar, { table, labels })
      )
    ] })
  );
}
function FrozenFillerRow({
  columns,
  frozen
}) {
  return /* @__PURE__ */ jsx44(TableRow, { "aria-hidden": true, className: "h-full border-b-0 hover:bg-transparent", children: columns.map((column, index) => {
    const id = column.id ?? column.accessorKey ?? String(index);
    const pin = frozenCellProps(frozen[id], "cell");
    return /* @__PURE__ */ jsx44(
      TableCell,
      {
        "data-col-id": id,
        "aria-hidden": true,
        className: cn("h-auto p-0", pin.className),
        style: pin.style
      },
      id
    );
  }) });
}
function DataRow({
  row,
  onClick,
  frozen
}) {
  return /* @__PURE__ */ jsx44(
    TableRow,
    {
      "data-state": row.getIsSelected() ? "selected" : void 0,
      onClick,
      className: cn("group/row", onClick && "cursor-pointer"),
      children: row.getVisibleCells().map((cell) => {
        const pin = frozenCellProps(frozen[cell.column.id], "cell");
        return /* @__PURE__ */ jsx44(
          TableCell,
          {
            "data-col-id": cell.column.id,
            className: cn(pin.className, cell.column.columnDef.meta?.cellClassName),
            style: {
              ...cell.column.columnDef.meta?.width != null ? {
                width: cell.column.columnDef.meta.width,
                maxWidth: cell.column.columnDef.meta.width
              } : null,
              ...pin.style
            },
            children: flexRender(cell.column.columnDef.cell, cell.getContext())
          },
          cell.id
        );
      })
    }
  );
}
function GroupedRows({
  table,
  groupBy,
  groupOrder,
  groupLabel,
  collapsibleGroups,
  collapsedKeys,
  onToggleGroup,
  toggleGroupLabel,
  onRowClick,
  frozen
}) {
  const colSpan = table.getVisibleLeafColumns().length;
  const groups = resolveGroups(
    table.getRowModel().rows,
    groupBy,
    groupOrder,
    collapsedKeys
  );
  let renderIndex = 0;
  return /* @__PURE__ */ jsx44(Fragment13, { children: groups.map((group, groupIndex) => /* @__PURE__ */ jsxs37(React36.Fragment, { children: [
    group.key != null && /* @__PURE__ */ jsx44(
      DataTableGroupRow,
      {
        colSpan,
        collapsible: collapsibleGroups,
        collapsed: group.collapsed,
        onToggle: () => onToggleGroup(group.key),
        toggleAriaLabel: toggleGroupLabel,
        label: (groupLabel ?? defaultGroupLabel)({
          key: group.key,
          rows: group.rows.map((r) => r.original),
          count: group.rows.length,
          index: groupIndex
        })
      }
    ),
    !group.collapsed && group.rows.map((row) => {
      const idx = renderIndex++;
      return /* @__PURE__ */ jsx44(
        DataRow,
        {
          row,
          frozen,
          onClick: onRowClick ? () => onRowClick(row.original, idx) : void 0
        },
        row.id
      );
    })
  ] }, group.key ?? "__ungrouped")) });
}
function SkeletonRows({
  columnCount,
  rowCount
}) {
  return /* @__PURE__ */ jsx44(Fragment13, { children: Array.from({ length: rowCount }).map((_, r) => /* @__PURE__ */ jsx44(TableRow, { className: "hover:bg-transparent", children: Array.from({ length: columnCount }).map((__, c) => /* @__PURE__ */ jsx44(TableCell, { children: /* @__PURE__ */ jsx44(Skeleton, { shape: "text", className: "w-full" }) }, c)) }, r)) });
}
function defaultOfLabel(start, end, total) {
  return total > 0 ? `${start}\u2013${end} of ${total}` : "0 of 0";
}
function SelectedCountBar({
  table,
  labels
}) {
  const count = table.getSelectedRowModel().rows.length;
  if (count === 0) return null;
  return (
    /* ไม่มีเส้นคั่นแล้ว — แถบนี้อยู่นอกการ์ด ระยะห่างมาจาก `gap-4` ของกล่องนอก
     * pad เท่ากับแถบแบ่งหน้า เพราะสองอันนี้สลับที่กัน ต้องไม่ขยับตำแหน่ง */
    /* @__PURE__ */ jsx44(
      "div",
      {
        "data-slot": "selected-count",
        className: "px-2 pt-4 text-body-sm font-medium text-text-black",
        children: labels?.selected ? labels.selected(count) : `${count} selected`
      }
    )
  );
}
function PaginationFooter({
  pagination,
  currentPage,
  totalPages,
  table,
  labels
}) {
  const sizeOptions = pagination.pageSizeOptions ?? [10, 20, 50, 100];
  const start = pagination.rowCount === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1;
  const end = Math.min(
    pagination.rowCount,
    (pagination.pageIndex + 1) * pagination.pageSize
  );
  const selectedCount = table.getSelectedRowModel().rows.length;
  const atFirst = pagination.pageIndex === 0;
  const atLast = pagination.pageIndex >= totalPages - 1;
  const pagerButton = "rounded-md p-1 text-text-body transition-colors hover:bg-overlay-hover disabled:pointer-events-none disabled:opacity-30";
  return (
    /* 📐 วัดจาก `ActionTabel` ของ Portal: 14px/500 · ไม่มีเส้นคั่น ไม่มีพื้นหลัง
     * pad **8 ข้าง · 16 บน · ล่าง 0** — ไม่มี pad ล่างเพราะแถบเป็นของสุดท้ายในกล่อง
     * ระยะก้นจึงเป็นของหน้าที่เอาไปวาง ไม่ใช่ของ component */
    /* `data-slot` เป็นที่เกาะที่มั่นคงกว่าการไล่ `closest("div")` — เทสรอบแรก
     * ไล่ขึ้นไปเจอ div ชั้นในแล้วยืนยันว่า "ไม่มี border-t" ซึ่งจริงเสมอ
     * โดยไม่ได้พิสูจน์อะไรเลย · ผู้เรียกก็เกาะ selector นี้จัดสไตล์เพิ่มได้ */
    /* @__PURE__ */ jsxs37(
      "div",
      {
        "data-slot": "pagination",
        className: "flex flex-wrap items-center gap-x-8 gap-y-3 px-2 pt-4 text-body-sm font-medium",
        children: [
          pagination.onPageSizeChange && /* @__PURE__ */ jsxs37("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx44("span", { className: "whitespace-nowrap text-text-tertiary", children: labels?.rowsPerPage ?? "Rows per page" }),
            /* @__PURE__ */ jsx44(
              Select,
              {
                size: "sm",
                value: String(pagination.pageSize),
                onChange: (v) => pagination.onPageSizeChange?.(Number(v)),
                options: sizeOptions.map((n) => ({
                  value: String(n),
                  label: String(n)
                })),
                reserveMessageSpace: false,
                containerClassName: "w-auto",
                className: "h-8 w-auto min-w-14 border-transparent bg-transparent px-2 hover:bg-overlay-hover"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs37("div", { className: "flex items-center gap-4 text-text-body", children: [
            /* @__PURE__ */ jsx44("span", { className: "whitespace-nowrap", children: labels?.of ? labels.of(start, end, pagination.rowCount) : defaultOfLabel(start, end, pagination.rowCount) }),
            /* @__PURE__ */ jsxs37("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx44(
                "button",
                {
                  type: "button",
                  "aria-label": labels?.prev ?? "Previous page",
                  className: pagerButton,
                  disabled: atFirst,
                  onClick: () => pagination.onPageChange(Math.max(0, pagination.pageIndex - 1)),
                  children: /* @__PURE__ */ jsx44(ChevronLeft2, { className: "size-5" })
                }
              ),
              /* @__PURE__ */ jsx44(
                "button",
                {
                  type: "button",
                  "aria-label": labels?.next ?? "Next page",
                  className: pagerButton,
                  disabled: atLast,
                  onClick: () => pagination.onPageChange(
                    Math.min(totalPages - 1, pagination.pageIndex + 1)
                  ),
                  children: /* @__PURE__ */ jsx44(ChevronRight3, { className: "size-5" })
                }
              )
            ] })
          ] }),
          selectedCount > 0 && /* @__PURE__ */ jsx44("span", { className: "ml-auto whitespace-nowrap text-text-black", children: labels?.selected ? labels.selected(selectedCount) : `${selectedCount} selected` })
        ]
      }
    )
  );
}

// src/layout/Card.tsx
import * as React37 from "react";
import { cva as cva11 } from "class-variance-authority";
import { jsx as jsx45 } from "react/jsx-runtime";
var cardVariants = cva11("flex flex-col bg-white", {
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
var Card = React37.forwardRef(function Card2({ className, variant, padding, ...props }, ref) {
  return /* @__PURE__ */ jsx45(
    "div",
    {
      ref,
      className: cn(cardVariants({ variant, padding }), className),
      ...props
    }
  );
});
var CardHeader = ({ className, ...props }) => /* @__PURE__ */ jsx45(
  "div",
  {
    className: cn("flex flex-col gap-1 pb-3", className),
    ...props
  }
);
var CardTitle = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx45(
  "h3",
  {
    className: cn("text-body-md font-semibold text-text-heading", className),
    ...props
  }
);
var CardDescription = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx45("p", { className: cn("text-body-sm text-text-body", className), ...props });
var CardContent = ({ className, ...props }) => /* @__PURE__ */ jsx45("div", { className: cn("flex-1", className), ...props });
var CardFooter = ({ className, ...props }) => /* @__PURE__ */ jsx45(
  "div",
  {
    className: cn("flex items-center gap-2 pt-3", className),
    ...props
  }
);
Card.displayName = "Card";

// src/layout/Tabs.tsx
import * as React38 from "react";
import * as RadixTabs from "@radix-ui/react-tabs";
import { cva as cva12 } from "class-variance-authority";
import { jsx as jsx46 } from "react/jsx-runtime";
var Tabs = RadixTabs.Root;
var tabsListVariants = cva12("inline-flex items-center", {
  variants: {
    variant: {
      underline: "w-full justify-start gap-1 border-b border-border-default",
      pill: "gap-1 rounded-md bg-gray-100 p-1"
    }
  },
  defaultVariants: { variant: "underline" }
});
var tabsTriggerVariants = cva12(
  /* `cursor-pointer` — `<button>` ของเบราว์เซอร์เป็น `cursor: default` และ preflight ของ
   * Tailwind v4 **ไม่ได้ตั้ง pointer ให้ปุ่มอีกแล้ว** (ต่างจาก v3) ⇒ ต้องระบุเอง
   * พี่น้องใน DS ระบุกันหมดแล้ว (`Button` · `IconButton` · วันในปฏิทิน · หัวตารางที่เรียงได้ ·
   * ปุ่มติดต่อฝ่ายสนับสนุนของ `Sidebar`) มีแต่แท็บที่ตกหล่น — วัดใน Storybook เองก็เป็น
   * `default` จึงไม่ใช่ปัญหาของแอปปลายทาง */
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap text-body-sm font-medium transition-all outline-none disabled:pointer-events-none disabled:cursor-default disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-brand/40",
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
var TabsList = React38.forwardRef(
  function TabsList2({ className, variant, ...props }, ref) {
    return /* @__PURE__ */ jsx46(
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
var TabsTrigger = React38.forwardRef(
  function TabsTrigger2({ className, variant, ...props }, ref) {
    return /* @__PURE__ */ jsx46(
      RadixTabs.Trigger,
      {
        ref,
        className: cn(tabsTriggerVariants({ variant }), className),
        ...props
      }
    );
  }
);
var TabsContent = React38.forwardRef(function TabsContent2({ className, ...props }, ref) {
  return /* @__PURE__ */ jsx46(
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
import * as React39 from "react";
import { MoreHorizontal } from "lucide-react";
import { Slot as Slot6 } from "@radix-ui/react-slot";
import { jsx as jsx47, jsxs as jsxs38 } from "react/jsx-runtime";
function Breadcrumb({
  items,
  separator,
  maxItems = 0,
  linkComponent: LinkComponent = "a",
  className,
  ...props
}) {
  const sep = separator ?? /* @__PURE__ */ jsx47("span", { className: "select-none text-text-tertiary", "aria-hidden": "true", children: "/" });
  let visible = items;
  if (maxItems > 0 && items.length > maxItems) {
    visible = [items[0], "ellipsis", ...items.slice(-(maxItems - 1))];
  }
  return /* @__PURE__ */ jsx47(
    "nav",
    {
      "aria-label": "Breadcrumb",
      className: cn("flex items-center text-body-sm", className),
      ...props,
      children: /* @__PURE__ */ jsx47("ol", { className: "flex flex-wrap items-center gap-3", children: visible.map((item, i) => {
        const isLast = i === visible.length - 1;
        if (item === "ellipsis") {
          return /* @__PURE__ */ jsxs38("li", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx47(MoreHorizontal, { className: "size-4 text-text-tertiary" }),
            !isLast && sep
          ] }, `ellipsis-${i}`);
        }
        const itemBaseClass = "inline-flex items-center gap-2 leading-none [&_svg]:size-5";
        const currentClass = "font-semibold text-text-body";
        const linkClass = "text-text-tertiary transition-colors hover:text-text-black";
        return /* @__PURE__ */ jsxs38("li", { className: "flex items-center gap-3 leading-none", children: [
          isLast ? /* @__PURE__ */ jsxs38(
            "span",
            {
              className: cn(itemBaseClass, currentClass),
              "aria-current": "page",
              children: [
                item.icon,
                item.label
              ]
            }
          ) : item.href ? /* @__PURE__ */ jsxs38(
            LinkComponent,
            {
              href: item.href,
              className: cn(itemBaseClass, linkClass),
              children: [
                item.icon,
                item.label
              ]
            }
          ) : item.onClick ? /* @__PURE__ */ jsxs38(
            "button",
            {
              type: "button",
              onClick: item.onClick,
              className: cn(itemBaseClass, linkClass),
              children: [
                item.icon,
                item.label
              ]
            }
          ) : /* @__PURE__ */ jsxs38("span", { className: cn(itemBaseClass, "text-text-tertiary"), children: [
            item.icon,
            item.label
          ] }),
          !isLast && sep
        ] }, i);
      }) })
    }
  );
}
var BreadcrumbRoot = ({ className, ...props }) => /* @__PURE__ */ jsx47(
  "nav",
  {
    "aria-label": "Breadcrumb",
    className: cn("flex items-center text-body-sm", className),
    ...props
  }
);
var BreadcrumbLink = React39.forwardRef(function BreadcrumbLink2({ className, asChild, ...props }, ref) {
  const Comp = asChild ? Slot6 : "a";
  return /* @__PURE__ */ jsx47(
    Comp,
    {
      ref,
      className: cn(
        "text-text-tertiary transition-colors hover:text-text-black",
        className
      ),
      ...props
    }
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";

// src/layout/Stepper.tsx
import { Check as Check7 } from "lucide-react";
import { jsx as jsx48, jsxs as jsxs39 } from "react/jsx-runtime";
function Stepper({
  steps,
  current,
  orientation = "horizontal",
  connector = "fill",
  className,
  onStepClick
}) {
  const isVertical = orientation === "vertical";
  const isFixed = !isVertical && connector === "fixed";
  return /* @__PURE__ */ jsx48(
    "ol",
    {
      className: cn(
        "flex",
        isVertical ? "flex-col gap-4" : isFixed ? "items-center justify-center gap-6 py-1.5" : "items-center gap-3",
        className
      ),
      children: steps.map((step, i) => {
        const status = i < current ? "done" : i === current ? "active" : "todo";
        const isLast = i === steps.length - 1;
        const clickable = Boolean(onStepClick) && status === "done";
        const showCheck = status === "done";
        const circle = /* @__PURE__ */ jsx48(
          "div",
          {
            className: cn(
              /* size-6 = 24px · วัดจาก MediHR ที่รันจริง (ก่อนหน้านี้ 28px ไม่ตรงดีไซน์ไหนเลย) */
              "flex size-6 shrink-0 items-center justify-center rounded-full text-caption font-bold transition-colors",
              status === "todo" ? "bg-gray-200 text-text-tertiary" : "bg-brand-active text-white"
            ),
            children: showCheck ? /* @__PURE__ */ jsx48(Check7, { className: "size-3.5", strokeWidth: 3 }) : i + 1
          }
        );
        return /* @__PURE__ */ jsxs39(
          "li",
          {
            className: cn(
              "flex",
              isVertical ? "items-start gap-3" : "items-center gap-2",
              !isVertical && !isFixed && !isLast && "flex-1"
            ),
            children: [
              /* @__PURE__ */ jsxs39(
                "div",
                {
                  className: cn(
                    "flex",
                    isVertical ? "flex-col items-center" : "items-center gap-2"
                  ),
                  children: [
                    clickable ? /* @__PURE__ */ jsx48(
                      "button",
                      {
                        type: "button",
                        onClick: () => onStepClick?.(i),
                        className: "cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-brand-active/40",
                        children: circle
                      }
                    ) : circle,
                    isVertical && !isLast && /* @__PURE__ */ jsx48(
                      "div",
                      {
                        className: cn(
                          "mt-1 w-px flex-1 min-h-6",
                          status === "done" ? "bg-brand-active" : "bg-border-default"
                        )
                      }
                    ),
                    !isVertical && /* @__PURE__ */ jsxs39(
                      "div",
                      {
                        className: cn(
                          "text-body-sm",
                          status === "todo" ? "text-text-tertiary font-normal" : "text-text-body font-semibold"
                        ),
                        children: [
                          step.label,
                          step.description && /* @__PURE__ */ jsx48("div", { className: "text-caption font-normal text-text-tertiary", children: step.description })
                        ]
                      }
                    )
                  ]
                }
              ),
              isVertical && /* @__PURE__ */ jsxs39("div", { className: "min-w-0 pb-4", children: [
                /* @__PURE__ */ jsx48(
                  "div",
                  {
                    className: cn(
                      "text-body-sm",
                      status === "todo" ? "text-text-tertiary font-normal" : "text-text-body font-semibold"
                    ),
                    children: step.label
                  }
                ),
                step.description && /* @__PURE__ */ jsx48("div", { className: "text-caption text-text-tertiary", children: step.description })
              ] }),
              !isVertical && !isLast && /* @__PURE__ */ jsx48(
                "div",
                {
                  className: cn(
                    "h-px bg-border-default",
                    /* `fixed` = เส้น 22×2 ตามที่วัดจาก MediHR — ความยาวคงที่ ไม่ยืดตามพื้นที่ */
                    isFixed ? "h-0.5 w-5.5 shrink-0" : "flex-1"
                  )
                }
              )
            ]
          },
          i
        );
      })
    }
  );
}

// src/feedback/Toast.tsx
import { Toaster as SonnerToaster } from "sonner";
import { CheckCircle2, AlertTriangle as AlertTriangle3, Info, XCircle } from "lucide-react";
import { toast } from "sonner";
import { jsx as jsx49 } from "react/jsx-runtime";
var baseToast = "flex items-center gap-3 rounded-sm border px-5 py-3 shadow-sm font-semibold text-body-md [&_svg]:size-6 [&_svg]:shrink-0";
var tones = {
  success: "bg-success-green-50! border-success-green-200! text-success-green-800! [&_svg]:text-success-green-primary!",
  error: "bg-cherry-red-50! border-cherry-red-200! text-cherry-red-800! [&_svg]:text-cherry-red-600!",
  warning: "bg-warning-yellow-50! border-warning-yellow-200! text-warning-yellow-800! [&_svg]:text-warning-yellow-600!",
  info: "bg-info-blue-50! border-info-blue-200! text-info-blue-800! [&_svg]:text-info-blue-primary!",
  default: "bg-white border-border-default text-brand [&_svg]:text-brand"
};
function Toaster(props) {
  return /* @__PURE__ */ jsx49(
    SonnerToaster,
    {
      position: "top-right",
      duration: 4e3,
      icons: {
        success: /* @__PURE__ */ jsx49(CheckCircle2, { strokeWidth: 2.25 }),
        error: /* @__PURE__ */ jsx49(XCircle, { strokeWidth: 2.25 }),
        warning: /* @__PURE__ */ jsx49(AlertTriangle3, { strokeWidth: 2.25 }),
        info: /* @__PURE__ */ jsx49(Info, { strokeWidth: 2.25 })
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
          description: "text-body-sm font-medium opacity-90"
        }
      },
      ...props
    }
  );
}

// src/overlay/ConfirmDialog.tsx
import * as React40 from "react";
import { AlertTriangle as AlertTriangle4, Info as Info2, CheckCircle2 as CheckCircle22 } from "lucide-react";
import { jsx as jsx50, jsxs as jsxs40 } from "react/jsx-runtime";
var toneDivider = {
  /* `info-blue-primary` ไม่ใช่ `brand-active` — โทน "ข้อมูล" ต้องเป็นสีข้อมูล ไม่ใช่
   * สถานะกดของแบรนด์ · บนแอปที่ไม่ override ทั้งสองตัวชี้ค่าเดียวกันอยู่แล้ว
   * แต่บนแอปที่ตั้ง `--color-info-blue-primary` เองจะได้สีที่ตั้งใจ ไม่ใช่สีแบรนด์ */
  info: "bg-info-blue-primary",
  warning: "bg-warning-yellow-600",
  danger: "bg-cherry-red-600",
  success: "bg-success-green-primary"
};
var toneIcon = {
  info: /* @__PURE__ */ jsx50(Info2, { className: "size-10 text-info-blue-primary" }),
  warning: /* @__PURE__ */ jsx50(AlertTriangle4, { className: "size-10 text-warning-yellow-600" }),
  danger: /* @__PURE__ */ jsx50(AlertTriangle4, { className: "size-10 text-cherry-red-600" }),
  success: /* @__PURE__ */ jsx50(CheckCircle22, { className: "size-10 text-success-green-primary" })
};
var toneConfirmVariant = {
  info: "primary",
  warning: "warning",
  danger: "destructive",
  success: "success"
};
var CONFIRM_DIALOG_WIDTH = "sm:max-w-[33.125rem]";
var CANCEL_BUTTON_CLASS = cn(
  "flex-1 rounded-lg text-body-md font-medium",
  "border-text-nuetral-dark-600 text-text-black",
  "hover:border-border-input hover:bg-gray-50"
);
var CONFIRM_BUTTON_CLASS = "flex-1 rounded-lg text-body-md font-medium";
var confirmDialogContentClass = cn(
  "rounded-[20px] p-6 text-center sm:p-8",
  CONFIRM_DIALOG_WIDTH
);
function ConfirmDialogHeading({
  icon,
  title,
  description,
  tone,
  divider,
  align = "center"
}) {
  const centered = align === "center";
  const showDivider = divider ?? false;
  const descriptionClass = cn(
    "whitespace-pre-line text-body-md leading-relaxed text-text-black",
    /* มีเส้นคั่น ⇒ เว้น 16 ตามที่วัดจาก Portal · ไม่มี ⇒ เว้น 8 จากหัวข้อ */
    showDivider ? "mt-4" : "mt-2"
  );
  return (
    // `gap-0` จำเป็น — `DialogHeader` ตั้ง `gap-1.5` ไว้เป็นค่าเริ่มต้น
    // ถ้าไม่ล้าง ระยะจริงจะเป็น 6px + `mt-*` ของทุกชิ้นด้านล่าง
    /* @__PURE__ */ jsxs40(
      DialogHeader,
      {
        className: cn(
          "gap-0 pb-0 pr-0",
          centered ? "items-center text-center" : "items-start text-left"
        ),
        children: [
          icon && /* @__PURE__ */ jsx50("div", { className: cn("mb-3 mt-2 flex", centered ? "justify-center" : "justify-start"), children: icon }),
          /* @__PURE__ */ jsx50(DialogTitle, { className: "text-title-md font-semibold text-text-black", children: title }),
          showDivider && /* 📐 48×4 · ห่างจากหัวข้อ 8 · ห่างจากคำอธิบาย 16
           * วัดจาก 4 จอของ Portal ที่วาดเส้นเอง (`mx-auto mb-4 h-1 w-12`)
           * ของเดิมที่นี่เป็น 40×4 ห่าง 10/8 ซึ่งไม่ตรงกับที่ไหน */
          /* @__PURE__ */ jsx50(
            "span",
            {
              "aria-hidden": true,
              className: cn("mt-2 h-1 w-12 rounded-full", toneDivider[tone])
            }
          ),
          description ? (
            /* วัดจาก Portal: 16px / **line-height 26** (`leading-relaxed`) · เกือบดำ
             * เท่าหัวข้อ · ห่างจากหัวข้อ 8px และห่างจากปุ่ม 20px
             *
             * ⚠️ สีเข้มเท่าหัวข้อโดยตั้งใจ — ใน confirm dialog บรรทัดนี้คือ "ผลที่จะเกิด"
             * (เช่น "ลบแล้วกู้คืนไม่ได้") ไม่ใช่คำอธิบายประกอบ Portal จึงไม่ทำให้จาง */
            /* 🔴 `DialogDescription` ของ Radix render เป็น `<p>` ⇒ ถ้าผู้เรียกส่ง JSX ที่มี
             * block element (เส้นคั่นที่วาดเอง · `<p>` ซ้อน · รายการ) เข้ามา จะได้ HTML ที่
             * ผิดสเปกและเบราว์เซอร์จะแยกแท็กให้เองแบบเงียบ ๆ จนระยะเพี้ยน
             * ⇒ ข้อความล้วนใช้ `<p>` ตามเดิม · อย่างอื่นสวมเป็น `<div>` ผ่าน `asChild` */
            typeof description === "string" ? /* @__PURE__ */ jsx50(DialogDescription, { className: descriptionClass, children: description }) : /* @__PURE__ */ jsx50(DialogDescription, { asChild: true, children: /* @__PURE__ */ jsx50("div", { className: descriptionClass, children: description }) })
          ) : null
        ]
      }
    )
  );
}
function ConfirmDialogError({
  children
}) {
  return /* @__PURE__ */ jsx50(
    "p",
    {
      role: "alert",
      className: "mt-4 rounded-sm border border-cherry-red-200 bg-cherry-red-50 px-3 py-2 text-body-sm font-medium text-cherry-red-800",
      children
    }
  );
}
function ConfirmDialogActions({
  tone,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  loading,
  showCancel,
  confirmDisabled
}) {
  return /* @__PURE__ */ jsxs40(DialogFooter, { className: "mt-5 flex-row gap-4 border-none p-0 pt-0 sm:justify-center", children: [
    showCancel && /* @__PURE__ */ jsx50(
      Button,
      {
        variant: "secondary",
        size: "lg",
        className: CANCEL_BUTTON_CLASS,
        onClick: onCancel,
        disabled: loading,
        children: cancelLabel
      }
    ),
    /* @__PURE__ */ jsx50(
      Button,
      {
        variant: toneConfirmVariant[tone],
        size: "lg",
        className: CONFIRM_BUTTON_CLASS,
        onClick: onConfirm,
        loading,
        disabled: confirmDisabled,
        children: confirmLabel
      }
    )
  ] });
}
function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  tone = "info",
  icon,
  divider,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  size = "lg",
  isLoading,
  loading: loadingProp,
  dismissible = true,
  align = "center",
  errorMessage,
  showCancel = true,
  confirmDisabled,
  children
}) {
  const [internalLoading, setInternalLoading] = React40.useState(false);
  const controlled = loadingProp ?? isLoading;
  const isLoadingControlled = controlled !== void 0;
  const loading = isLoadingControlled ? controlled : internalLoading;
  const handleConfirm = async () => {
    if (!onConfirm) {
      onOpenChange(false);
      return;
    }
    if (isLoadingControlled) {
      onConfirm();
      return;
    }
    try {
      setInternalLoading(true);
      await onConfirm();
      onOpenChange(false);
    } catch {
    } finally {
      setInternalLoading(false);
    }
  };
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };
  return /* @__PURE__ */ jsx50(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs40(
    DialogContent,
    {
      size,
      showClose: false,
      className: confirmDialogContentClass,
      onEscapeKeyDown: (e) => {
        if (loading || !dismissible) e.preventDefault();
      },
      onInteractOutside: (e) => {
        if (loading || !dismissible) e.preventDefault();
      },
      children: [
        /* @__PURE__ */ jsx50(
          ConfirmDialogHeading,
          {
            align,
            icon,
            title,
            description,
            tone,
            divider
          }
        ),
        children != null && /* @__PURE__ */ jsx50("div", { className: "mt-5", children }),
        errorMessage && /* @__PURE__ */ jsx50(ConfirmDialogError, { children: errorMessage }),
        /* @__PURE__ */ jsx50(
          ConfirmDialogActions,
          {
            tone,
            confirmLabel,
            cancelLabel,
            onConfirm: handleConfirm,
            onCancel: handleCancel,
            loading,
            showCancel,
            confirmDisabled
          }
        )
      ]
    }
  ) });
}

// src/overlay/Filter.tsx
import { ListFilter } from "lucide-react";
import { jsx as jsx51, jsxs as jsxs41 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsxs41(Popover, { open, defaultOpen, onOpenChange, children: [
    /* @__PURE__ */ jsx51(PopoverTrigger, { asChild: true, children: trigger ?? /* @__PURE__ */ jsx51(
      Button,
      {
        variant: "secondary",
        leftIcon: /* @__PURE__ */ jsx51(ListFilter, {}),
        ...triggerProps,
        children: triggerLabel
      }
    ) }),
    /* @__PURE__ */ jsx51(
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
import * as React41 from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { jsx as jsx52, jsxs as jsxs42 } from "react/jsx-runtime";
var TooltipProvider = RadixTooltip.Provider;
var TooltipRoot = RadixTooltip.Root;
var TooltipTrigger = RadixTooltip.Trigger;
var TooltipPortal = RadixTooltip.Portal;
var TooltipContent = React41.forwardRef(
  function TooltipContent2({ className, sideOffset = 8, arrow = true, children, ...props }, ref) {
    return /* @__PURE__ */ jsx52(TooltipPortal, { children: /* @__PURE__ */ jsxs42(
      RadixTooltip.Content,
      {
        ref,
        sideOffset,
        className: cn(
          // Neutral black surface, not the brand colour: a tooltip is a passive hint attached to
          // whatever it points at, so it must read the same over brand-coloured and neutral UI
          // alike. `bg-black` resolves to the --color-black token (#191919), not pure black.
          //
          // ⚠️ ยังเป็น `text-sm` ของ Tailwind ไม่ใช่ `text-body-sm` ของ type scale ทั้งที่ค่าเท่ากัน
          // (14px) — เพราะ **3 ใน 4 แอปยังไม่ import token ของ DS** (portal · medimatch · hr-web
          // ประกาศ token เองในไฟล์ตัวเอง และไม่มี `--text-*` เลยสักตัว) Tailwind v4 จะไม่ generate
          // `.text-body-sm` ถ้าไม่มีตัวแปรรองรับ ⇒ ตัวหนังสือจะไหลไปตามขนาดของ parent เงียบ ๆ
          // ปลดล็อกเมื่อแอปเหล่านั้น import `@mediact/react/tokens.css` แล้ว
          "z-50 max-w-xs rounded-md bg-black px-4 py-2.5 text-sm font-medium text-white shadow-lg",
          "data-[state=delayed-open]:animate-in data-[state=closed]:animate-out",
          className
        ),
        ...props,
        children: [
          children,
          arrow && /* @__PURE__ */ jsx52(
            RadixTooltip.Arrow,
            {
              width: 14,
              height: 7,
              className: "fill-black"
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
  arrow = true,
  contentClassName
}) {
  return /* @__PURE__ */ jsx52(TooltipProvider, { delayDuration, children: /* @__PURE__ */ jsxs42(
    TooltipRoot,
    {
      open,
      defaultOpen,
      onOpenChange,
      children: [
        /* @__PURE__ */ jsx52(TooltipTrigger, { asChild, children }),
        /* @__PURE__ */ jsx52(
          TooltipContent,
          {
            side,
            align,
            arrow,
            className: contentClassName,
            children: content
          }
        )
      ]
    }
  ) });
}
TooltipContent.displayName = "TooltipContent";

// src/ui/StatusBadge.tsx
import * as React42 from "react";
import { cva as cva13 } from "class-variance-authority";
import { jsx as jsx53, jsxs as jsxs43 } from "react/jsx-runtime";
var statusBadgeVariants = cva13(
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
        sm: "h-6 px-2.5 text-caption",
        md: "h-7 px-3 text-body-sm"
      }
    },
    defaultVariants: { tone: "neutral", size: "sm" }
  }
);
var StatusBadge = React42.forwardRef(
  function StatusBadge2({ className, tone, size, hideDot, children, ...props }, ref) {
    return /* @__PURE__ */ jsxs43(
      "span",
      {
        ref,
        className: cn(statusBadgeVariants({ tone, size }), className),
        ...props,
        children: [
          !hideDot && /* @__PURE__ */ jsx53(
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

// src/ui/DateNavigator.tsx
import * as React43 from "react";
import { ChevronLeft as ChevronLeft3, ChevronRight as ChevronRight4 } from "lucide-react";
import { cva as cva14 } from "class-variance-authority";
import { jsx as jsx54, jsxs as jsxs44 } from "react/jsx-runtime";
var dateNavigatorVariants = cva14(
  "inline-flex items-stretch overflow-hidden rounded-lg border border-border-default bg-bg-default",
  {
    variants: {
      size: { sm: "h-9", md: "h-10" },
      fullWidth: { true: "w-full" }
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
var DateNavigator = React43.forwardRef(
  function DateNavigator2({
    className,
    size,
    fullWidth,
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
    calendar,
    calendarTitle,
    children,
    confirmLabel,
    onConfirm,
    calendarOpen,
    onCalendarOpenChange,
    calendarProps,
    ...props
  }, ref) {
    const formatter = React43.useMemo(
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
    const [internalOpen, setInternalOpen] = React43.useState(false);
    const open = calendarOpen ?? internalOpen;
    const setOpen = (next) => {
      if (calendarOpen === void 0) setInternalOpen(next);
      onCalendarOpenChange?.(next);
    };
    const isDraft = confirmLabel != null;
    const [draft, setDraft] = React43.useState(current);
    const [month, setMonth] = React43.useState(
      () => startOfMonth(current ?? /* @__PURE__ */ new Date())
    );
    const openCalendar = () => {
      setDraft(current);
      setMonth(startOfMonth(current ?? /* @__PURE__ */ new Date()));
      setOpen(true);
    };
    const pick = (day) => {
      if (isDraft) {
        setDraft(day);
        return;
      }
      onChange?.(unit === "month" ? startOfMonth(day) : day);
      setOpen(false);
    };
    const confirm = () => {
      const picked = draft ?? current;
      if (picked) (onConfirm ?? onChange)?.(picked);
      setOpen(false);
    };
    const arrowClass = "flex w-6 shrink-0 cursor-pointer items-center justify-center text-text-body transition-colors hover:bg-overlay-hover disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand/40 [&_svg]:size-5";
    const ruleClass = "w-px shrink-0 self-stretch bg-border-default";
    const centreClass = "flex min-w-0 flex-1 items-center justify-center px-3 text-center text-body-sm font-semibold text-text-black";
    const centre = calendar ? /* @__PURE__ */ jsx54(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsx54(
      "button",
      {
        type: "button",
        onClick: openCalendar,
        "aria-haspopup": "dialog",
        "aria-expanded": open,
        className: cn(
          centreClass,
          "min-w-28 cursor-pointer transition-colors hover:bg-overlay-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand/40"
        ),
        children: /* @__PURE__ */ jsx54("span", { className: "truncate", children: displayLabel })
      }
    ) }) : /* @__PURE__ */ jsx54("span", { className: cn(centreClass, "min-w-28"), children: displayLabel });
    const shell = /* @__PURE__ */ jsxs44(
      "div",
      {
        ref,
        className: cn(
          dateNavigatorVariants({ size, fullWidth }),
          className
        ),
        ...props,
        children: [
          /* @__PURE__ */ jsx54(
            "button",
            {
              type: "button",
              "aria-label": prevLabel,
              disabled: isPrevDisabled,
              onClick: () => step(-1),
              className: arrowClass,
              children: /* @__PURE__ */ jsx54(ChevronLeft3, {})
            }
          ),
          /* @__PURE__ */ jsx54("span", { "aria-hidden": true, className: ruleClass }),
          centre,
          /* @__PURE__ */ jsx54("span", { "aria-hidden": true, className: ruleClass }),
          /* @__PURE__ */ jsx54(
            "button",
            {
              type: "button",
              "aria-label": nextLabel,
              disabled: isNextDisabled,
              onClick: () => step(1),
              className: arrowClass,
              children: /* @__PURE__ */ jsx54(ChevronRight4, {})
            }
          )
        ]
      }
    );
    if (!calendar) return shell;
    return /* @__PURE__ */ jsxs44(Popover, { open, onOpenChange: setOpen, children: [
      shell,
      /* @__PURE__ */ jsxs44(
        PopoverContent,
        {
          align: "center",
          sideOffset: 8,
          className: "w-auto rounded-2xl p-0",
          children: [
            calendarTitle != null && /* @__PURE__ */ jsx54("p", { className: "px-4 pt-4 text-body-sm font-semibold text-text-black", children: calendarTitle }),
            /* @__PURE__ */ jsx54(
              Calendar,
              {
                ...calendarProps,
                month,
                onMonthChange: setMonth,
                selected: isDraft ? draft : current,
                minDate,
                maxDate,
                onSelect: pick,
                locale: calendarProps?.locale ?? locale,
                defaultView: calendarProps?.defaultView ?? (unit === "month" ? "month" : "day"),
                selectMonth: calendarProps?.selectMonth ?? unit === "month"
              }
            ),
            (children != null || isDraft) && /* กว้างเท่าปฏิทินเป๊ะ — ปล่อยให้ hug จะโดนแถวปุ่มที่ผู้เรียกวางมา
             * ดันจนลิ้นชักกว้างกว่าปฏิทิน แล้วปฏิทินจะลอยไม่เต็มกล่อง */
            /* @__PURE__ */ jsxs44("div", { className: "w-[340px] px-4 pb-4 pt-3", children: [
              children,
              isDraft && /* @__PURE__ */ jsx54(
                Button,
                {
                  variant: "primary",
                  size: "lg",
                  fullWidth: true,
                  onClick: confirm,
                  className: "mt-4 text-[15px] font-semibold",
                  children: confirmLabel
                }
              )
            ] })
          ]
        }
      )
    ] });
  }
);
DateNavigator.displayName = "DateNavigator";
export {
  AddButton,
  AppLauncher,
  AppShowcaseDialog,
  Avatar,
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbRoot,
  Button,
  ButtonGroup,
  Calendar,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  CheckboxGroup,
  CheckboxGroupItem,
  Chip,
  ComboBox,
  ConfirmCancelActions,
  ConfirmDialog,
  ContactSupportDialog,
  DataTable,
  DataTableGroupRow,
  DateNavigator,
  DatePicker,
  DateRangePicker,
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
  EntityAutocomplete,
  ErrorState,
  FORMAT_PRESETS,
  FieldIconSlot,
  FieldSkeleton,
  Filter,
  FloatingFieldShell,
  FormField,
  FormatInput,
  Heading,
  IconButton,
  Input,
  LanguageSwitcher,
  LoadingScreen,
  MEDIACT_LINE_HANDLE,
  MEDIACT_LINE_URL,
  MEDIACT_SUPPORT_PHONE,
  NotificationBell,
  NumberStepper,
  OutlineButton,
  PillSwitch,
  Popover,
  PopoverAnchor,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
  RadioGroup,
  RadioGroupItem,
  SHOWCASE_COPY,
  SHOWCASE_LAYOUT,
  Select,
  SelectItem,
  Sidebar,
  SidebarGroup,
  SidebarItem,
  Skeleton,
  SkeletonBox,
  SolidButton,
  Spinner2 as Spinner,
  StatusBadge,
  Stepper,
  Switch,
  TYPE_SCALE,
  TYPE_SCALE_DEFAULT_WEIGHT,
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
  Text,
  Textarea,
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
  TopNavToggle,
  UserMenu,
  avatarVariants,
  buttonGroupVariants,
  buttonVariants,
  checkboxShapeClasses,
  chipVariants,
  cn,
  dayKey,
  fieldLabelId,
  fieldShapeClasses,
  headingVariants,
  iconButtonVariants,
  numberStepperVariants,
  outlineButtonVariants,
  radioShapeClasses,
  resolveGroups,
  solidButtonVariants,
  statusBadgeVariants,
  switchToneClasses,
  textVariants,
  toast,
  toneIcon,
  useSidebarState
};
//# sourceMappingURL=index.js.map