/**
 * Shared types for schedule components (ShiftTable / TimeGrid).
 * All display strings (dates, Buddhist years, weekday labels, time ranges)
 * are pre-formatted by the caller — these components never do date math.
 */

/** Constrained avatar color palette — maps to design tokens, never hex. */
export type AssignmentColor =
  | "blue"
  | "green"
  | "orange"
  | "yellow"
  | "red"
  | "teal"
  | "gray";

/** Token class lookup for {@link AssignmentColor}. */
export const ASSIGNMENT_COLOR_CLASSES: Record<AssignmentColor, string> = {
  blue: "bg-info-blue-100 text-info-blue-800",
  green: "bg-success-green-200 text-text-dark-green",
  orange: "bg-active-yellow-100 text-text-brown",
  yellow: "bg-warning-yellow-100 text-warning-yellow-800",
  red: "bg-cherry-red-200 text-cherry-red-800",
  teal: "bg-surface text-teal-500",
  gray: "bg-gray-200 text-gray-700",
};

/** One person assigned to a slot (doctor/nurse). */
export type AssignmentSlot = {
  id: string;
  /** 1-based order number shown in the badge. */
  order: number;
  /** Display name, e.g. "นพ. วรวิทย์ ตันสกุล". */
  name: string;
  color: AssignmentColor;
  /**
   * Explicit avatar initials (e.g. "วก"). Falls back to auto-initials
   * derived from `name` when omitted.
   */
  avatarLabel?: string;
  /** Avatar image URL. */
  src?: string;
};

/** A shift-period column in {@link ShiftTable} (Pattern A). */
export type ShiftTableColumn = {
  id: string;
  /** Shift name, e.g. "เช้า". */
  name: string;
  /** Pre-formatted time range, e.g. "08:00 – 16:00". */
  timeRange: string;
  /** Number of ordered slots per cell. */
  slotCount: number;
};

/** A day row in {@link ShiftTable} (Pattern A). */
export type ShiftTableDay = {
  /** Stable identifier, e.g. ISO date "2026-06-02". */
  id: string;
  /** Day-of-month label, e.g. 2. */
  dayNumber: number;
  /** Pre-formatted weekday label, e.g. "อังคาร". */
  weekdayLabel: string;
  isToday?: boolean;
  isWeekend?: boolean;
  /** Filled slots per column id. Missing keys = empty cell. */
  slots: Record<string, AssignmentSlot[]>;
};

/** A room/resource column in {@link TimeGrid} (Pattern B). */
export type TimeGridRoom = {
  id: string;
  /** Room name, e.g. "ห้องตรวจ 1". */
  name: string;
  icon?: React.ReactNode;
};

/** An event block in {@link TimeGrid} (Pattern B). */
export type TimeGridEventData = {
  id: string;
  roomId: string;
  /** Display name, e.g. "นพ. วรวิทย์ ตันสกุล". */
  name: string;
  color: AssignmentColor;
  avatarLabel?: string;
  src?: string;
  /** 24h "HH:mm", e.g. "08:00". */
  start: string;
  /** 24h "HH:mm", e.g. "12:00". */
  end: string;
  /** Pre-formatted time label. Defaults to `${start} – ${end}`. */
  timeLabel?: string;
  /** Optional note line, e.g. "เฉพาะผู้ป่วยนัด". */
  note?: string;
};
