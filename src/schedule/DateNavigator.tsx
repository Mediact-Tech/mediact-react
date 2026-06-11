import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const dateNavigatorVariants = cva(
  "inline-flex items-center justify-between rounded-lg border border-border-default bg-white",
  {
    variants: {
      size: {
        sm: "h-9 gap-1 px-1",
        md: "h-11 gap-2 px-1.5",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export type DateNavigatorProps = Omit<
  React.ComponentProps<"div">,
  "children"
> &
  VariantProps<typeof dateNavigatorVariants> & {
    /**
     * Pre-formatted display label — the caller handles all date math and
     * localization, including Buddhist years (e.g. "มิถุนายน 2569",
     * "2 มิถุนายน · วันอังคาร").
     */
    label: React.ReactNode;
    onPrev?: () => void;
    onNext?: () => void;
    prevDisabled?: boolean;
    nextDisabled?: boolean;
    /** aria-label for the previous button. */
    prevLabel?: string;
    /** aria-label for the next button. */
    nextLabel?: string;
  };

/** `‹ label ›` stepper for navigating months/days. Purely presentational. */
const DateNavigator = React.forwardRef<HTMLDivElement, DateNavigatorProps>(
  function DateNavigator(
    {
      className,
      size,
      label,
      onPrev,
      onNext,
      prevDisabled,
      nextDisabled,
      prevLabel = "ก่อนหน้า",
      nextLabel = "ถัดไป",
      ...props
    },
    ref,
  ) {
    const arrowClass =
      "flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4";
    return (
      <div
        ref={ref}
        className={cn(dateNavigatorVariants({ size }), className)}
        {...props}
      >
        <button
          type="button"
          aria-label={prevLabel}
          disabled={prevDisabled}
          onClick={onPrev}
          className={arrowClass}
        >
          <ChevronLeft />
        </button>
        <span className="min-w-28 text-center text-sm font-semibold text-text-primary">
          {label}
        </span>
        <button
          type="button"
          aria-label={nextLabel}
          disabled={nextDisabled}
          onClick={onNext}
          className={arrowClass}
        >
          <ChevronRight />
        </button>
      </div>
    );
  },
);

DateNavigator.displayName = "DateNavigator";

export { DateNavigator };
