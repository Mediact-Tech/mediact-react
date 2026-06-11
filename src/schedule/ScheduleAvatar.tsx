import * as React from "react";
import { Avatar, type AvatarProps } from "../ui/Avatar";
import { cn } from "../lib/cn";
import {
  ASSIGNMENT_COLOR_CLASSES,
  type AssignmentColor,
} from "./types";

export type ScheduleAvatarProps = Omit<AvatarProps, "fallback"> & {
  /** Constrained palette color (token-backed, never hex). */
  color: AssignmentColor;
  /**
   * Explicit initials (e.g. "วก"). Falls back to auto-initials derived
   * from `name` when omitted.
   */
  label?: string;
};

/** Avatar with a constrained per-person color from the schedule palette. */
const ScheduleAvatar = React.forwardRef<HTMLSpanElement, ScheduleAvatarProps>(
  function ScheduleAvatar({ color, label, className, ...props }, ref) {
    return (
      <Avatar
        ref={ref}
        fallback={label}
        className={cn(ASSIGNMENT_COLOR_CLASSES[color], className)}
        {...props}
      />
    );
  },
);

ScheduleAvatar.displayName = "ScheduleAvatar";

export { ScheduleAvatar };
