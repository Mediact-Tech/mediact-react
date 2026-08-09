import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

// "disabled:pointer-events-none" would block :hover while disabled, but it also eats the cursor
// (events pass through to whatever's behind), so a "not-allowed" cursor can't render that way.
// Keeping pointer-events on lets the cursor show — native `disabled` already blocks clicks
// regardless of CSS — but that also lets :hover match again, so each variant's hover-bg is
// explicitly cancelled back to its own resting color inside the variant string.
const solidButtonVariants = cva(
  "cursor-pointer inline-flex shrink-0 items-center justify-center gap-1 whitespace-nowrap px-3 py-2 text-body-sm font-medium leading-6 tracking-normal text-slate-50 transition-all outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/50 focus-visible:ring-offset-1 disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-30 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      // rounded-md on every variant. `success` and `primary` used to be rounded-sm, so a screen that
      // mixed variants — or mixed SolidButton with AddButton/OutlineButton — showed two different
      // corner radii on buttons of the same kind.
      variant: {
        info: "rounded-md bg-brand-active shadow-sm hover:bg-brand-active-hover disabled:hover:bg-brand-active",
        warning:
          "rounded-md bg-warning-normal shadow-md hover:bg-warning-hover disabled:hover:bg-warning-normal",
        success:
          "rounded-md bg-success-green-primary shadow-sm hover:bg-success-green-primary-hover disabled:hover:bg-success-green-primary",
        primary:
          "rounded-md bg-brand shadow-xs hover:bg-brand-hover disabled:hover:bg-brand",
      },
      size: {
        sm: "h-8 [&_svg:not([class*='size-'])]:size-4",
        md: "h-9 [&_svg:not([class*='size-'])]:size-4",
        lg: "h-11 [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "info",
      size: "lg",
    },
  },
);

type SolidButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof solidButtonVariants> & {
    asChild?: boolean;
    /** Localized button text — ignored when `children` is provided. */
    label?: React.ReactNode;
  };

/** Filled action button — for actions like Save, Upload, Confirm. */
const SolidButton = React.forwardRef<HTMLButtonElement, SolidButtonProps>(
  (
    { className, variant, size, asChild = false, label, children, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(solidButtonVariants({ variant, size, className }))}
        {...props}
      >
        {children ?? label}
      </Comp>
    );
  },
);
SolidButton.displayName = "SolidButton";

export { SolidButton, solidButtonVariants, type SolidButtonProps };
