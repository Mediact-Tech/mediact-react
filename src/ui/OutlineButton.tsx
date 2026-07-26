import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

// Default color is the brand-active blue; `neutral` is the standard gray
// Cancel button. One-off tints can still go through className,
// e.g. className="border-red-500 text-red-500 hover:bg-red-500/10".
// Icons passed as children must set their own size (e.g. className="size-4") —
// the size variant's [&_svg:not([class*='size-'])] fallback wins otherwise.
// disabled keeps cursor-not-allowed without hover-bg (see SolidButton for why
// pointer-events stays on); resting bg of an outline button is always white,
// so a single disabled:hover:bg-white covers every color override.
const outlineButtonVariants = cva(
  "cursor-pointer inline-flex shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-md border bg-white px-3 py-2 text-sm font-medium leading-6 tracking-normal shadow-xs transition-all outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        brand:
          "border-brand-active text-brand-active hover:bg-brand-active/10",
        neutral: "border-slate-200 text-slate-900 hover:bg-gray-100",
      },
      size: {
        sm: "h-8 [&_svg:not([class*='size-'])]:size-4",
        md: "h-9 [&_svg:not([class*='size-'])]:size-4",
        lg: "h-11 [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "brand",
      size: "lg",
    },
  },
);

type OutlineButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof outlineButtonVariants> & {
    asChild?: boolean;
    /** Localized button text — ignored when `children` is provided. */
    label?: React.ReactNode;
  };

/** Outlined action button — for secondary actions like Cancel, Edit. */
const OutlineButton = React.forwardRef<HTMLButtonElement, OutlineButtonProps>(
  (
    { className, variant, size, asChild = false, label, children, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(outlineButtonVariants({ variant, size, className }))}
        {...props}
      >
        {children ?? label}
      </Comp>
    );
  },
);
OutlineButton.displayName = "OutlineButton";

export { OutlineButton, outlineButtonVariants, type OutlineButtonProps };
