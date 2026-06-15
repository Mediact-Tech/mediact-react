// Primitives
export {
  ScheduleAvatar,
  type ScheduleAvatarProps,
} from "./ScheduleAvatar";
export {
  StatusBadge,
  statusBadgeVariants,
  type StatusBadgeProps,
} from "./StatusBadge";
export {
  DateNavigator,
  type DateNavigatorProps,
  type DateNavigatorUnit,
} from "./DateNavigator";
export { AssignmentChip, type AssignmentChipProps } from "./AssignmentChip";
export { AddSlotButton, type AddSlotButtonProps } from "./AddSlotButton";

// Pattern A — monthly shift table (ตารางกะ)
export { ShiftTable, type ShiftTableProps } from "./ShiftTable";

// Pattern B — daily resource time grid (ตารางห้องตรวจ)
export { TimeGrid, type TimeGridProps } from "./TimeGrid";

// Shared types + color palette
export {
  ASSIGNMENT_COLOR_CLASSES,
  type AssignmentColor,
  type AssignmentSlot,
  type ShiftTableColumn,
  type ShiftTableDay,
  type TimeGridRoom,
  type TimeGridEventData,
} from "./types";

// Layout math (exported for callers needing time arithmetic)
export {
  parseTimeToMinutes,
  computeEventLayouts,
  computeFreeGaps,
  type EventLayoutInput,
  type EventLayout,
  type FreeGap,
} from "./time-grid-utils";
