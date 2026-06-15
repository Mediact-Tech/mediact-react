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
  /**
   * Min width (px) ของแต่ละคอลัมน์ห้อง — ลดเมื่อพื้นที่แคบเพื่อเลี่ยง
   * horizontal scroll (ซึ่งพ่วง vertical scrollbar ~17px ตามมา)
   * @default 240
   */
  minColumnWidth?: number;
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
      minColumnWidth = 240,
      style,
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
    const gridTemplateColumns = `64px repeat(${Math.max(rooms.length, 1)}, minmax(${minColumnWidth}px, 1fr))`;

    const innerContent = (
      <>
        {/* Header */}
        <div
          role="row"
          className={cn(
            "grid bg-gray-50 border-b border-border-default",
            stickyHeader && "sticky top-0 z-20",
          )}
          style={{ gridTemplateColumns }}
        >
          <div
            role="columnheader"
            aria-label="เวลา"
            className="sticky left-0 z-10 flex items-center justify-center border-r border-border-default bg-gray-50 py-3 text-text-tertiary [&_svg]:size-4"
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
                  {room.icon ?? <DoorOpen className="text-success-green-600" />}
                </span>
                <span className="truncate">{room.name}</span>
              </div>
              {onEditRoom && (
                <button
                  type="button"
                  aria-label={`แก้ไข ${room.name}`}
                  onClick={() => onEditRoom(room.id)}
                  className="shrink-0 cursor-pointer rounded-md p-1 text-text-tertiary transition-colors hover:bg-success-green-600/20 hover:text-success-green-600 [&_svg]:size-3.5"
                >
                  <Pencil />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Body — padding อยู่ระดับคอลัมน์ (py-5 ข้างใน) เพื่อให้ border-l ต่อเนื่องเต็มความสูง */}
        <div className="relative z-0 grid" style={{ gridTemplateColumns }}>
          {/* Time axis — sticky left-0: ตรึงแกนเวลาขณะเลื่อนแนวนอน (frozen column) */}
          <div className="sticky left-0 z-[1] border-r border-border-default bg-white py-5">
            <div className="relative" style={{ height: bodyHeight }}>
              {ticks.map((tick) => {
              const isHour = tick % 60 === 0;
              // offset แบบคำนวณตรง (ไม่ใช้ translate utility) — กัน 2 ปัญหา:
              // (1) consumer ที่ Tailwind scan dist ไม่เจอ negative utility
              // (2) label ตัวสุดท้ายล้นกล่อง 1px จนเกิด scrollbar ปลอม
              const labelOffset =
                tick === winStart ? 0 : tick === winEnd ? 16 : 8;
              return (
                <span
                  key={tick}
                  className={cn(
                    "absolute right-2 block h-4 text-xs leading-4",
                    isHour
                      ? "font-semibold text-text-primary"
                      : "text-text-tertiary",
                  )}
                  style={{
                    top: (tick - winStart) * pixelsPerMinute - labelOffset,
                  }}
                >
                  {formatTick(tick)}
                </span>
              );
            })}
            </div>
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
                className="border-l border-border-default py-5"
              >
                <div className="relative" style={{ height: bodyHeight }}>
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
                    className="absolute inset-x-1.5 flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dashed border-border-strong text-sm text-text-tertiary transition-colors hover:border-success-green-600 hover:bg-success-green-600/20 hover:text-success-green-600 [&_svg]:size-4"
                    style={{
                      top: gap.top + 4,
                      height: Math.min(gap.height - 8, 50),
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
              </div>
            );
          })}
        </div>
      </>
    );

    return (
      // Scroll container เดียวรับทั้ง 2 แกน — sticky header (top) + sticky แกนเวลา (left)
      // ทำงานเทียบ container นี้ตัวเดียว เป็น pattern มาตรฐานของตารางตรึงหัว+คอลัมน์แรก
      <div
        ref={ref}
        role="grid"
        aria-label={props["aria-label"] ?? "ตารางห้องตรวจ"}
        className={cn(
          "overflow-auto rounded-xl border border-border-default bg-white",
          className,
        )}
        style={{ maxHeight, ...style }}
        {...props}
      >
        {/* Sizer (ไม่ scroll): w-max min-w-full → คอลัมน์กว้างเท่า content เต็มเสมอ
            พื้นหลัง/เส้นขอบไม่ถูกตัดตอนเลื่อนแนวนอน ขณะที่ sticky ยังอ้างอิง
            scroll container ภายนอกตัวเดียว */}
        <div className="w-max min-w-full">{innerContent}</div>
      </div>
    );
  },
);

TimeGrid.displayName = "TimeGrid";

export { TimeGrid };
