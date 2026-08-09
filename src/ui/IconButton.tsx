import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";
import { SkeletonBox } from "../feedback/Skeleton";

// Square hit targets, same px scale as Solid/OutlineButton's size tokens
// (sm=h-8/32px, md=h-9/36px, lg=h-11/44px) so an IconButton dropped next to
// a labeled Button at the same `size` lines up. Default "md" = 36×36px,
// comfortably above WCAG 2.2 SC 2.5.8 (AA) minimum of 24×24px; "lg" = 44px
// matches Apple HIG / Material touch-target guidance for mobile/touch
// contexts. Exact default is a placeholder for UX sign-off (see audit
// "ต้องให้คนตัดสิน" #3) — swap here if the team calls a different scale.
const iconButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-full transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/50 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        ghost: "bg-transparent text-slate-600 hover:bg-gray-100 hover:text-slate-900",
        solid: "bg-brand text-brand-foreground shadow-xs hover:bg-brand-hover",
        outline:
          "border border-border-default bg-white text-slate-700 hover:bg-gray-50",
        "ghost-destructive":
          "bg-transparent text-red-600 hover:bg-red-50 hover:text-red-800",
      },
      size: {
        sm: "size-8 [&_svg:not([class*='size-'])]:size-4",
        md: "size-9 [&_svg:not([class*='size-'])]:size-4",
        lg: "size-11 [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "md",
    },
  },
);

const Spinner = () => (
  <svg className="animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="3"
      opacity="0.25"
    />
    <path fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
  </svg>
);

type IconButtonProps = Omit<React.ComponentProps<"button">, "aria-label"> &
  VariantProps<typeof iconButtonVariants> & {
    /**
     * Required — icon-only buttons have no visible text for assistive tech
     * to fall back on. Describe the action, e.g. "Edit", "Delete row".
     */
    "aria-label": string;
    /** Icon to render. Ignored when `asChild` — pass your own child element instead. */
    icon?: React.ReactNode;
    asChild?: boolean;
    /** ผู้ใช้กดแล้วกำลังทำงาน — แสดงสปินเนอร์ ปุ่มยังอยู่ที่เดิม */
    loading?: boolean;
    /** ข้อมูลยังมาไม่ถึง — แทนทั้งปุ่มด้วยวงกลมเทา (คนละเรื่องกับ `loading`) */
    isLoading?: boolean;
  };

/**
 * Icon-only action button — table-row actions, toolbars. Always pass
 * `aria-label`; use `asChild` to wrap a router `<Link>` while keeping real
 * button semantics (fixes the div+Link pattern found in the audit, which
 * wasn't keyboard-focusable at all).
 */
const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      isLoading = false,
      disabled,
      icon,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;

    if (isLoading) {
      return (
        <SkeletonBox
          shape={cn(iconButtonVariants({ variant, size }))}
          className="rounded-full"
        />
      );
    }

    return (
      <Comp
        ref={ref}
        data-slot="icon-button"
        data-loading={loading || undefined}
        className={cn(iconButtonVariants({ variant, size, className }))}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        {...props}
      >
        {asChild ? children : loading ? <Spinner /> : icon}
      </Comp>
    );
  },
);
IconButton.displayName = "IconButton";

export { IconButton, iconButtonVariants, type IconButtonProps };
