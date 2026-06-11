import * as React from "react";
import { Clock, DoorOpen, FileText, Pencil, UserPlus } from "lucide-react";
import { cn } from "../lib/cn";
import { ScheduleAvatar } from "./ScheduleAvatar";
import {
  computeEventLayouts,
  computeFreeGaps,
  parseTimeToMinutes,
} from "./time-grid-utils";
import type { TimeGridEventData, TimeGridRoom } from "./types";

export type TimeGridProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Room/resource columns. */
  rooms: TimeGridRoom[];
  /** Events for the displayed day (all rooms, flat). */
  events: TimeGridEventData[];
  /** Window start, 24h "HH:mm", e.g. "08:00". */
  windowStart: string;
  /** Window end, 24h "HH:mm", e.g. "12:00". */
  windowEnd: string;
  /** Time-axis tick interval in minutes. @default 30 */
  tickMinutes?: number;
  /** Vertical scale. @default 2 (30 min = 60px) */
  pixelsPerMinute?: number;
  /** Click on an event card. */
  onEventClick?: (event: TimeGridEventData) => void;
  /** Click on a room header's edit (pencil) button. */
  onEditRoom?: (roomId: string) => void;
  /**
   * Click on an empty-gap placeholder. When provided, dashed add
   * placeholders render in event-free intervals of each room column.
   */
  onAddEvent?: (roomId: string, startMinutes: number) => void;
  /** Label for add placeholders, e.g. "เพิ่มแพทย์เวร". */
  addLabel?: string;
  /** Keep the room header visible while scrolling vertically. */
  stickyHeader?: boolean;
  /** Max height (enables vertical scroll), e.g. "70vh" or 640. */
  maxHeight?: React.CSSProperties["maxHeight"];
};

function formatTick(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Pattern B — daily resource time grid (ตารางห้องตรวจ).
 * Columns = rooms, vertical axis = time; events are absolutely positioned
 * by start/end time, with side-by-side layout for overlaps.
 * Purely presentational. Click-only (no drag/resize).
 *
 * Note: event cards intentionally use a uniform tint (per design) —
 * `event.color` differentiates people via the avatar only.
 */
const TimeGrid = React.forwardRef<HTMLDivElement, TimeGridProps>(
  function TimeGrid(
    {
      className,
      rooms,
      events,
      windowStart,
      windowEnd,
      tickMinutes = 30,
      pixelsPerMinute = 2,
      onEventClick,
      onEditRoom,
      onAddEvent,
      addLabel = "เพิ่มแพทย์เวร",
      stickyHeader = true,
      maxHeight,
      ...props
    },
    ref,
  ) {
    const winStart = parseTimeToMinutes(windowStart);
    const winEnd = parseTimeToMinutes(windowEnd);
    const isValidWindow =
      !Number.isNaN(winStart) && !Number.isNaN(winEnd) && winEnd > winStart;

    const ticks = React.useMemo(() => {
      if (!isValidWindow) return [];
      const result: number[] = [];
      for (let t = winStart; t <= winEnd; t += tickMinutes) result.push(t);
      return result;
    }, [isValidWindow, winStart, winEnd, tickMinutes]);

    const eventsByRoom = React.useMemo(() => {
      const map = new Map<string, TimeGridEventData[]>();
      for (const event of events) {
        const list = map.get(event.roomId);
        if (list) list.push(event);
        else map.set(event.roomId, [event]);
      }
      return map;
    }, [events]);

    if (!isValidWindow) return null;

    const bodyHeight = (winEnd - winStart) * pixelsPerMinute;
    const gridTemplateColumns = `64px repeat(${Math.max(rooms.length, 1)}, minmax(240px, 1fr))`;

    return (
      <div
        ref={ref}
        role="grid"
        aria-label={props["aria-label"] ?? "ตารางห้องตรวจ"}
        className={cn(
          "overflow-auto rounded-xl border border-border-default bg-white",
          className,
        )}
        style={{ maxHeight }}
        {...props}
      >
        {/* Header */}
        <div
          role="row"
          className={cn(
            "grid border-b border-border-default bg-gray-50",
            stickyHeader && "sticky top-0 z-20",
          )}
          style={{ gridTemplateColumns }}
        >
          <div
            role="columnheader"
            aria-label="เวลา"
            className="flex items-center justify-center py-3 text-text-tertiary [&_svg]:size-4"
          >
            <Clock />
          </div>
          {rooms.map((room) => (
            <div
              key={room.id}
              role="columnheader"
              className="flex items-center justify-between gap-2 border-l border-border-default px-3 py-3"
            >
              <div className="flex min-w-0 items-center gap-2 text-sm font-semibold text-text-primary">
                <span className="shrink-0 text-text-tertiary [&_svg]:size-4">
                  {room.icon ?? <DoorOpen />}
                </span>
                <span className="truncate">{room.name}</span>
              </div>
              {onEditRoom && (
                <button
                  type="button"
                  aria-label={`แก้ไข ${room.name}`}
                  onClick={() => onEditRoom(room.id)}
                  className="shrink-0 cursor-pointer rounded-md p-1 text-text-tertiary transition-colors hover:bg-brand-subtle hover:text-brand [&_svg]:size-3.5"
                >
                  <Pencil />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="grid" style={{ gridTemplateColumns }}>
          {/* Time axis */}
          <div className="relative" style={{ height: bodyHeight }}>
            {ticks.map((tick) => {
              const isHour = tick % 60 === 0;
              return (
                <span
                  key={tick}
                  className={cn(
                    "absolute right-2 -translate-y-1/2 text-xs",
                    isHour
                      ? "font-semibold text-text-primary"
                      : "text-text-tertiary",
                    tick === winStart && "translate-y-0",
                    tick === winEnd && "-translate-y-full",
                  )}
                  style={{ top: (tick - winStart) * pixelsPerMinute }}
                >
                  {formatTick(tick)}
                </span>
              );
            })}
          </div>

          {/* Room columns */}
          {rooms.map((room) => {
            const roomEvents = eventsByRoom.get(room.id) ?? [];
            const layouts = computeEventLayouts(
              roomEvents,
              windowStart,
              windowEnd,
              pixelsPerMinute,
            );
            const layoutById = new Map(layouts.map((l) => [l.id, l]));
            const gaps = onAddEvent
              ? computeFreeGaps(
                  roomEvents,
                  windowStart,
                  windowEnd,
                  pixelsPerMinute,
                  tickMinutes,
                )
              : [];

            return (
              <div
                key={room.id}
                role="gridcell"
                className="relative border-l border-border-default"
                style={{ height: bodyHeight }}
              >
                {/* Tick lines */}
                {ticks.slice(1, -1).map((tick) => (
                  <div
                    key={tick}
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-0 border-t",
                      tick % 60 === 0
                        ? "border-border-default"
                        : "border-border-subtle",
                    )}
                    style={{ top: (tick - winStart) * pixelsPerMinute }}
                  />
                ))}

                {/* Add placeholders in free gaps */}
                {gaps.map((gap) => (
                  <button
                    key={gap.startMinutes}
                    type="button"
                    onClick={() => onAddEvent?.(room.id, gap.startMinutes)}
                    className="absolute inset-x-1.5 flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dashed border-border-strong text-sm text-text-tertiary transition-colors hover:border-brand hover:bg-brand-subtle hover:text-brand [&_svg]:size-4"
                    style={{
                      top: gap.top + 4,
                      height: Math.min(gap.height - 8, 72),
                    }}
                  >
                    <UserPlus />
                    {addLabel}
                  </button>
                ))}

                {/* Events */}
                {roomEvents.map((event) => {
                  const layout = layoutById.get(event.id);
                  if (!layout) return null;
                  const interactive = Boolean(onEventClick);
                  return (
                    <div
                      key={event.id}
                      role={interactive ? "button" : undefined}
                      tabIndex={interactive ? 0 : undefined}
                      onClick={
                        interactive ? () => onEventClick?.(event) : undefined
                      }
                      onKeyDown={
                        interactive
                          ? (keyEvent) => {
                              if (
                                keyEvent.key === "Enter" ||
                                keyEvent.key === " "
                              ) {
                                keyEvent.preventDefault();
                                onEventClick?.(event);
                              }
                            }
                          : undefined
                      }
                      className={cn(
                        "absolute overflow-hidden rounded-lg border border-success-green-primary bg-success-green-50 p-2",
                        interactive &&
                          "cursor-pointer transition-shadow hover:shadow-card focus-visible:ring-2",
                      )}
                      style={{
                        top: layout.top + 2,
                        height: layout.height - 4,
                        left: `calc(${layout.left} + 4px)`,
                        width: `calc(${layout.width} - 8px)`,
                      }}
                    >
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-text-primary">
                        <ScheduleAvatar
                          size="xs"
                          color={event.color}
                          name={event.name}
                          label={event.avatarLabel}
                          src={event.src}
                        />
                        <span className="truncate">{event.name}</span>
                      </div>
                      {event.note && (
                        <div className="mt-1 ml-7 flex items-center gap-1 text-xs text-text-secondary [&_svg]:size-3">
                          <FileText />
                          <span className="truncate">{event.note}</span>
                        </div>
                      )}
                      <div className="mt-1 ml-7 flex items-center gap-1 text-xs text-text-secondary [&_svg]:size-3">
                        <Clock />
                        {event.timeLabel ?? `${event.start} – ${event.end}`}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);

TimeGrid.displayName = "TimeGrid";

export { TimeGrid };
