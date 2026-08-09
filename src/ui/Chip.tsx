import * as React from "react";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";
import { SkeletonBox } from "../feedback/Skeleton";

const chipVariants = cva(
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
        success:
          "border-success-green-200 bg-success-green-50 text-success-green-800",
        warning:
          "border-warning-yellow-200 bg-warning-yellow-50 text-warning-yellow-800",
        danger: "border-cherry-red-200 bg-cherry-red-50 text-cherry-red-800",
        info: "border-info-blue-200 bg-info-blue-50 text-info-blue-800",
      },
      /** Background weight. `subtle` (default) = tinted pastel, unchanged from before this axis existed. `solid` = filled tone, contrast-checked text per tone. */
      fill: {
        subtle: "",
        solid: "",
      },
      size: {
        sm: "h-6 px-2 text-caption [&_svg]:size-3",
        md: "h-7 px-3 text-body-sm [&_svg]:size-3.5",
        lg: "h-8 px-3.5 text-body-sm [&_svg]:size-4",
      },
      interactive: {
        true: "cursor-pointer hover:opacity-80 active:scale-95",
        false: "",
      },
    },
    compoundVariants: [
      // solid fill overrides border/bg/text per tone — chosen shades pass WCAG AA
      // (>=4.5:1) contrast against their paired text color; verified by manual
      // luminance calc since token scale here isn't a uniform 50-900 ramp.
      {
        variant: "neutral",
        fill: "solid",
        class: "border-transparent bg-gray-800 text-white",
      },
      {
        variant: "primary",
        fill: "solid",
        class: "border-transparent bg-brand text-brand-foreground",
      },
      {
        variant: "success",
        fill: "solid",
        class: "border-transparent bg-success-green-800 text-white",
      },
      {
        // warning-yellow has no shade that clears 4.5:1 with white text (even -800
        // reads brown, not "warning"); dark text on -600 is the accessible solid.
        variant: "warning",
        fill: "solid",
        class: "border-transparent bg-warning-yellow-600 text-black",
      },
      {
        variant: "danger",
        fill: "solid",
        class: "border-transparent bg-cherry-red-800 text-white",
      },
      {
        variant: "info",
        fill: "solid",
        class: "border-transparent bg-info-blue-800 text-white",
      },
    ],
    defaultVariants: {
      variant: "neutral",
      fill: "subtle",
      size: "md",
      interactive: false,
    },
  },
);

export type ChipProps = React.ComponentProps<"span"> &
  VariantProps<typeof chipVariants> & {
    leftIcon?: React.ReactNode;
    /** Show an × button. Calls `onRemove` (preferred) or falls back to `onClick`. */
    removable?: boolean;
    onRemove?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    /** ข้อมูลยังมาไม่ถึง — แทนด้วยแคปซูลเทาขนาดเท่าชิปจริง */
    isLoading?: boolean;
  };

const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(function Chip(
  {
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
  },
  ref,
) {
  const isInteractive = interactive ?? Boolean(onClick);
  const isSolid = fill === "solid";
  if (isLoading) {
    return (
      <SkeletonBox shape={cn(chipVariants({ variant, fill, size, interactive }))}>
        {leftIcon}
        {children}
      </SkeletonBox>
    );
  }

  return (
    <span
      ref={ref}
      onClick={onClick}
      className={cn(
        chipVariants({ variant, fill, size, interactive: isInteractive }),
        className,
      )}
      {...props}
    >
      {leftIcon}
      {children}
      {removable && (
        <button
          type="button"
          aria-label="Remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.(e);
          }}
          className={cn(
            "-mr-1 rounded-full p-0.5",
            isSolid ? "hover:bg-white/20" : "hover:bg-black/10",
          )}
        >
          <X />
        </button>
      )}
    </span>
  );
});

Chip.displayName = "Chip";

export { Chip, chipVariants };
