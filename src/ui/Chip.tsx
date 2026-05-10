import * as React from "react";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const chipVariants = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border font-medium transition-colors",
  {
    variants: {
      variant: {
        neutral: "border-border-default bg-white text-text-primary",
        primary: "border-brand/20 bg-brand-subtle text-brand",
        success:
          "border-success-green-200 bg-success-green-50 text-success-green-800",
        warning:
          "border-warning-yellow-200 bg-warning-yellow-50 text-warning-yellow-800",
        danger: "border-cherry-red-200 bg-cherry-red-50 text-cherry-red-800",
        info: "border-info-blue-200 bg-info-blue-50 text-info-blue-800",
      },
      size: {
        sm: "h-6 px-2 text-xs [&_svg]:size-3",
        md: "h-7 px-3 text-sm [&_svg]:size-3.5",
        lg: "h-8 px-3.5 text-sm [&_svg]:size-4",
      },
      interactive: {
        true: "cursor-pointer hover:opacity-80 active:scale-95",
        false: "",
      },
    },
    defaultVariants: {
      variant: "neutral",
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
  };

const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(function Chip(
  {
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
  },
  ref,
) {
  const isInteractive = interactive ?? Boolean(onClick);
  return (
    <span
      ref={ref}
      onClick={onClick}
      className={cn(
        chipVariants({ variant, size, interactive: isInteractive }),
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
          className="-mr-1 rounded-full p-0.5 hover:bg-black/10"
        >
          <X />
        </button>
      )}
    </span>
  );
});

export { Chip, chipVariants };
