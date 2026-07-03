import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";
import { Plus } from "lucide-react";
import { cn } from "../lib/cn";
import { solidButtonVariants } from "./SolidButton";

type AddButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof solidButtonVariants> & {
    asChild?: boolean;
    /** Localized button text — ignored when `children` is provided. */
    label?: React.ReactNode;
  };

/**
 * "Add" button — same "[+ icon] [add_text]" pattern everywhere in the system.
 * With `asChild`, children render as-is (no Plus injected) so the caller's
 * single element (e.g. a router Link) can carry its own icon + text.
 */
const AddButton = React.forwardRef<HTMLButtonElement, AddButtonProps>(
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
        {asChild ? (
          children
        ) : (
          <>
            <Plus className="size-4" aria-hidden="true" />
            {children ?? label}
          </>
        )}
      </Comp>
    );
  },
);
AddButton.displayName = "AddButton";

export { AddButton, type AddButtonProps };
