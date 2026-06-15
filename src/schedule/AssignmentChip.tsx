import * as React from "react";
import { cn } from "../lib/cn";
import { ScheduleAvatar } from "./ScheduleAvatar";
import type { AssignmentSlot } from "./types";

export type AssignmentChipProps = Omit<
  React.ComponentProps<"button">,
  // "slot" is the native HTML attribute — replaced by our AssignmentSlot prop
  "onClick" | "children" | "slot"
> & {
  slot: AssignmentSlot;
  /** Hide the order-number badge. */
  hideOrder?: boolean;
  /** Renders as a non-interactive `<div>` when omitted. */
  onClick?: (slot: AssignmentSlot) => void;
};

/**
 * Filled assignment slot in a schedule cell:
 * `[order badge] [colored avatar] [name]`.
 */
const AssignmentChip = React.forwardRef<HTMLElement, AssignmentChipProps>(
  function AssignmentChip(
    { slot, hideOrder, onClick, className, disabled, ...props },
    ref,
  ) {
    const interactive = Boolean(onClick) && !disabled;
    const Comp = interactive ? "button" : "div";
    return (
      <Comp
        // polymorphic: <button> when interactive, <div> otherwise
        ref={ref as React.Ref<HTMLButtonElement & HTMLDivElement>}
        {...(interactive
          ? { type: "button" as const, onClick: () => onClick?.(slot) }
          : {})}
        className={cn(
          "flex w-full items-center gap-2 rounded-lg border border-border-default bg-gray-50 px-2 py-1.5 text-left text-sm text-text-primary transition-colors",
          interactive && "cursor-pointer hover:border-success-green-600 hover:bg-success-green-600/20",
          className,
        )}
        {...(props as Record<string, unknown>)}
      >
        {!hideOrder && (
          <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-success-green-600 text-xs font-bold text-brand-foreground">
            {slot.order}
          </span>
        )}
        <ScheduleAvatar
          size="xs"
          color={slot.color}
          name={slot.name}
          label={slot.avatarLabel}
          src={slot.src}
        />
        <span className="truncate font-medium">{slot.name}</span>
      </Comp>
    );
  },
);

AssignmentChip.displayName = "AssignmentChip";

export { AssignmentChip };
