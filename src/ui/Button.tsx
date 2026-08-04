import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const buttonVariants = cva(
  // rounded-md to match SolidButton / OutlineButton / AddButton — every button in the DS now shares
  // one corner radius.
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all rounded-md cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-40 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-brand text-brand-foreground shadow-xs hover:bg-brand-hover",
        secondary:
          "border border-brand text-brand bg-white shadow-xs hover:bg-brand-subtle",
        ghost: "bg-transparent hover:bg-gray-50",
        destructive: "bg-red-600 text-white shadow-xs hover:bg-red-800",
        success:
          "bg-success-green-primary text-white shadow-sm hover:bg-success-green-primary-hover",
        warning: "bg-warning-normal text-white shadow-md hover:bg-warning-hover",
      },
      size: {
        xs: "h-7 px-2 text-sm [&_svg:not([class*='size-'])]:size-4",
        sm: "h-8 px-3 text-sm [&_svg:not([class*='size-'])]:size-4",
        md: "h-9 px-3 text-sm [&_svg:not([class*='size-'])]:size-4",
        lg: "h-11 px-4 text-base [&_svg:not([class*='size-'])]:size-5",
        xl: "h-12 px-5 text-base [&_svg:not([class*='size-'])]:size-6",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
  };

const Spinner = () => (
  <svg
    className="size-4 animate-spin"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="3"
      opacity="0.25"
    />
    <path
      fill="currentColor"
      d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
    />
  </svg>
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;

    return (
      <Comp
        ref={ref}
        data-slot="button"
        data-loading={loading || undefined}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? <Spinner /> : leftIcon}
        {children}
        {!loading && rightIcon}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants, type ButtonProps };
