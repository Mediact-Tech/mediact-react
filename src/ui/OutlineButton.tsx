import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

// Default color is the brand-active blue; callers can retint via className,
// e.g. className="border-red-500 text-red-500 hover:bg-red-500/10".
// Icons passed as children must set their own size (e.g. className="size-4") —
// the size variant's [&_svg:not([class*='size-'])] fallback wins otherwise.
// disabled keeps cursor-not-allowed without hover-bg (see SolidButton for why
// pointer-events stays on); resting bg of an outline button is always white,
// so a single disabled:hover:bg-white covers every color override.
const outlineButtonVariants = cva(
  "cursor-pointer inline-flex shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-md border border-brand-active bg-white px-3 py-2 text-sm font-medium leading-6 tracking-normal text-brand-active shadow-xs transition-all outline-none hover:bg-brand-active/10 focus-visible:ring-2 focus-visible:ring-offset-1 disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      size: {
        sm: "h-8 [&_svg:not([class*='size-'])]:size-4",
        md: "h-9 [&_svg:not([class*='size-'])]:size-4",
        lg: "h-11 [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
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
  ({ className, size, asChild = false, label, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(outlineButtonVariants({ size, className }))}
        {...props}
      >
        {children ?? label}
      </Comp>
    );
  },
);
OutlineButton.displayName = "OutlineButton";

export { OutlineButton, outlineButtonVariants, type OutlineButtonProps };
