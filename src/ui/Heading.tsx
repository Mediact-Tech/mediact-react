import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";
import { SkeletonBox } from "../feedback/Skeleton";

const headingVariants = cva("text-balance", {
  variants: {
    size: {
      "title-sm": "text-title-sm",
      "title-md": "text-title-md",
      "title-lg": "text-title-lg",
      /** สำหรับหัวข้อย่อยที่เล็กกว่า title-sm — ยังเป็นหัวข้อทางความหมาย */
      "body-lg": "text-body-lg",
    },
    weight: {
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    tone: {
      /* 🔴 `default` = **สีหัวข้อปกติ** ไม่ใช่ `text-text-primary` ซึ่ง `theme.css`
       * alias ไป `--color-brand` ⇒ หัวข้อทุกอันที่ไม่ได้ส่ง tone จะเปลี่ยนสีตามแอป
       * ชี้ค่าเดียวกับ `heading` โดยตั้งใจ · อยากได้สีแบรนด์ใช้ `tone="brand"` */
      default: "text-text-heading",
      heading: "text-text-heading",
      brand: "text-brand",
      inherit: "",
    },
  },
  defaultVariants: {
    size: "title-md",
    weight: "semibold",
    tone: "default",
  },
});

export type HeadingProps = Omit<React.ComponentProps<"h2">, "color"> &
  VariantProps<typeof headingVariants> & {
    /** ระดับหัวข้อทางความหมาย (h1-h6) — **แยกจาก `size` โดยตั้งใจ**
     *
     * ลำดับหัวข้อในหน้าเป็นเรื่องของ screen reader ส่วนขนาดเป็นเรื่องของสายตา
     * การผูกสองอย่างเข้าด้วยกันบังคับให้ต้องเลือกอย่างใดอย่างหนึ่ง —
     * เช่นหัวข้อ h2 ที่ต้องดูเล็กกว่า h3 ข้าง ๆ ในการ์ด
     */
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    /** ข้อมูลยังมาไม่ถึง — แทนด้วยแถบสูงเท่าบรรทัดจริงของขนาดหัวข้อนั้น */
    isLoading?: boolean;
    /** ความกว้างของแถบตอนโหลด · หัวข้อมักไม่เต็มบรรทัด ค่าเริ่มต้นจึงเป็น `16rem` */
    skeletonWidth?: string;
  };

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  function Heading(
    {
      level = 2,
      className,
      size,
      weight,
      tone,
      isLoading,
      skeletonWidth = "16rem",
      ...props
    },
    ref,
  ) {
    if (isLoading) {
      return (
        <SkeletonBox
          style={{ width: skeletonWidth }}
          className={cn(
            headingVariants({ size, weight, tone }),
            "block h-[1lh] max-w-full rounded-sm",
            className,
          )}
        />
      );
    }

    const Comp = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    return (
      <Comp
        ref={ref}
        className={cn(headingVariants({ size, weight, tone }), className)}
        {...props}
      />
    );
  },
);

Heading.displayName = "Heading";

export { Heading, headingVariants };
