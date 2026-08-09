import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";
import { Button, type ButtonProps } from "./Button";

// Layout primitive only — replaces the hand-built flex divs every call site
// currently writes for a button row (audit found the same "pair" laid out
// 3 different ways: flex-1 equal-width, natural-width right-aligned,
// space-between). Default "end" matches the highest-volume real convention
// (portal/medimatch modal footers, ~45 call sites) — placeholder pending
// UX sign-off (see audit "ต้องให้คนตัดสิน" #4), swap here if the team
// standardizes on something else.
const buttonGroupVariants = cva("flex items-center", {
  variants: {
    align: {
      start: "justify-start",
      end: "justify-end",
      between: "justify-between",
      // mirrors ConfirmModal's `flex-1`-on-both-buttons pattern: equal-width,
      // grows to fill the container instead of sitting at natural width.
      fill: "justify-between [&>*]:flex-1",
    },
    gap: {
      sm: "gap-2",
      md: "gap-3",
    },
  },
  defaultVariants: {
    align: "end",
    gap: "md",
  },
});

type ButtonGroupProps = React.ComponentProps<"div"> &
  VariantProps<typeof buttonGroupVariants>;

/** Alignment/spacing wrapper for a row of 1-3 buttons (dialog/drawer footers, toolbars). */
const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, align, gap, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="button-group"
      className={cn(buttonGroupVariants({ align, gap, className }))}
      {...props}
    />
  ),
);
ButtonGroup.displayName = "ButtonGroup";

type ConfirmCancelActionsProps = {
  onConfirm: () => void;
  onCancel: () => void;
  /** Localized confirm-button text — required, no hardcoded English default. */
  confirmLabel: string;
  /** Localized cancel-button text — required, no hardcoded English default. */
  cancelLabel: string;
  confirmVariant?: ButtonProps["variant"];
  cancelVariant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  /** Independent from `isLoading` — lets confirm be disabled by form validity while nothing is submitting. */
  isConfirmDisabled?: boolean;
  isCancelDisabled?: boolean;
  /** Disables both buttons and shows a spinner on confirm. */
  isLoading?: boolean;
  align?: Extract<
    VariantProps<typeof buttonGroupVariants>["align"],
    "end" | "between" | "fill"
  >;
  gap?: VariantProps<typeof buttonGroupVariants>["gap"];
  className?: string;
};

/**
 * Convenience Confirm+Cancel action row on top of `ButtonGroup` — the ~90%
 * common case (mirrors mediwork's `PlacementDrawerFooter`, the only place
 * this was already done properly). For anything else, compose `Button`
 * inside `ButtonGroup` directly.
 */
const ConfirmCancelActions = React.forwardRef<
  HTMLDivElement,
  ConfirmCancelActionsProps
>(
  (
    {
      onConfirm,
      onCancel,
      confirmLabel,
      cancelLabel,
      confirmVariant = "primary",
      cancelVariant = "secondary",
      size = "md",
      isConfirmDisabled = false,
      isCancelDisabled = false,
      isLoading = false,
      align = "end",
      gap,
      className,
    },
    ref,
  ) => (
    <ButtonGroup ref={ref} align={align} gap={gap} className={className}>
      <Button
        type="button"
        variant={cancelVariant}
        size={size}
        onClick={onCancel}
        disabled={isCancelDisabled || isLoading}
      >
        {cancelLabel}
      </Button>
      <Button
        type="button"
        variant={confirmVariant}
        size={size}
        onClick={onConfirm}
        disabled={isConfirmDisabled}
        loading={isLoading}
      >
        {confirmLabel}
      </Button>
    </ButtonGroup>
  ),
);
ConfirmCancelActions.displayName = "ConfirmCancelActions";

export {
  ButtonGroup,
  buttonGroupVariants,
  type ButtonGroupProps,
  ConfirmCancelActions,
  type ConfirmCancelActionsProps,
};
