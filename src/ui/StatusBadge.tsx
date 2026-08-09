import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-medium",
  {
    variants: {
      tone: {
        neutral: "bg-nuetral-light-50 text-text-secondary",
        success: "bg-success-green-50 text-success-green-800",
        warning: "bg-warning-yellow-50 text-warning-yellow-800",
        danger: "bg-cherry-red-50 text-cherry-red-800",
        info: "bg-info-blue-50 text-info-blue-800",
      },
      size: {
        sm: "h-6 px-2.5 text-caption",
        md: "h-7 px-3 text-body-sm",
      },
    },
    defaultVariants: { tone: "neutral", size: "sm" },
  },
);

export type StatusBadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof statusBadgeVariants> & {
    /** Hide the leading dot. */
    hideDot?: boolean;
  };

/**
 * Dot + label status pill, e.g. "● Published", "● Draft",
 * "● มีการแก้ไขที่ยังไม่บันทึก". Dot inherits the tone's text color.
 */
const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  function StatusBadge({ className, tone, size, hideDot, children, ...props }, ref) {
    return (
      <span
        ref={ref}
        className={cn(statusBadgeVariants({ tone, size }), className)}
        {...props}
      >
        {!hideDot && (
          <span
            aria-hidden="true"
            className="size-1.5 shrink-0 rounded-full bg-current"
          />
        )}
        {children}
      </span>
    );
  },
);

StatusBadge.displayName = "StatusBadge";

export { StatusBadge, statusBadgeVariants };
