import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";
import { SkeletonBox } from "../feedback/Skeleton";

/** ขนาดตัวอักษรสำหรับเนื้อความ — ระดับ `title-*` อยู่ที่ `Heading` แทน
 *
 * แยกเป็นคนละ component เพราะข้อมูลจริงแยกตัวเองที่ 18/20px: ทุกอย่างต่ำกว่านั้น
 * ใช้ weight 400 เป็นค่าปกติ ส่วน `title-*` พบเฉพาะ 600/700 ในทั้ง 3 แอป
 * ถ้ารวมเป็น component เดียวจะต้องแบก union ของทุก prop โดยไม่มีอะไรกันการผสมมั่ว
 */
const textVariants = cva("", {
  variants: {
    variant: {
      caption: "text-caption",
      "body-sm": "text-body-sm",
      "body-md": "text-body-md",
      "body-lg": "text-body-lg",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
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
      inherit: "",
    },
    truncate: {
      true: "truncate",
      false: "",
    },
    /** ตัวเลขเรียงเป็นคอลัมน์ (ตาราง, สรุปยอด) ให้ความกว้างตัวเลขเท่ากันทุกตัว */
    numeric: {
      true: "tabular-nums",
      false: "",
    },
  },
  defaultVariants: {
    variant: "body-md",
    weight: "normal",
    tone: "default",
    truncate: false,
    numeric: false,
  },
});

export type TextProps = Omit<React.ComponentProps<"p">, "color"> &
  VariantProps<typeof textVariants> & {
    /** element ที่จะ render — default `p` · ใช้ `span` เมื่ออยู่ในบรรทัดเดียวกับข้อความอื่น */
    as?: React.ElementType;
    /** ข้อมูลยังมาไม่ถึง — แทนด้วยแถบสูงเท่าบรรทัดจริงของระดับตัวอักษรนั้น */
    isLoading?: boolean;
    /** ความกว้างของแถบตอนโหลด · ค่าเริ่มต้น `100%` — ใส่เป็น `8rem` หรือ `60%` ก็ได้ */
    skeletonWidth?: string;
  };

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(function Text(
  {
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
  },
  ref,
) {
  const Comp = as ?? "p";

  /* `h-[1lh]` = สูงเท่า line-height ของระดับตัวอักษรนั้นพอดี ⇒ บรรทัดไม่ขยับ
   * ตอนข้อความจริงมาแทน · `align-middle` กันแถบตกจากเส้นฐานเมื่ออยู่ inline */
  if (isLoading) {
    return (
      <SkeletonBox
        style={{ width: skeletonWidth }}
        className={cn(
          textVariants({ variant, weight, tone }),
          "inline-block h-[1lh] max-w-full rounded-sm align-middle",
          className,
        )}
      />
    );
  }

  return (
    <Comp
      ref={ref}
      className={cn(
        textVariants({ variant, weight, tone, truncate, numeric }),
        className,
      )}
      {...props}
    />
  );
});

Text.displayName = "Text";

export { Text, textVariants };
