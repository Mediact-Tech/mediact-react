import * as React from "react";
import { Pencil } from "lucide-react";
import { isToday as dateFnsIsToday, parseISO } from "date-fns";
import { cn } from "../lib/cn";
import { AssignmentChip } from "./AssignmentChip";
import { AddSlotButton } from "./AddSlotButton";
import type {
  AssignmentSlot,
  ShiftTableColumn,
  ShiftTableDay,
} from "./types";

export type ShiftTableProps = Omit<
  React.ComponentProps<"div">,
  "children"
> & {
  /** Shift-period columns, e.g. เช้า / บ่าย / ดึก. */
  columns: ShiftTableColumn[];
  /** Day rows (typically one month). */
  days: ShiftTableDay[];
  /** Click on a filled slot chip. */
  onSlotClick?: (dayId: string, columnId: string, slot: AssignmentSlot) => void;
  /** Click on an empty add-slot placeholder. `order` is 1-based. */
  onAddSlot?: (dayId: string, columnId: string, order: number) => void;
  /** Click on a column header's edit (pencil) button. */
  onEditColumn?: (columnId: string) => void;
  /** Label for empty slots, e.g. "เพิ่มหมอ". */
  addLabel?: string;
  /** Header label for the day column. */
  dayColumnLabel?: string;
  /** Keep the header visible while scrolling vertically. */
  stickyHeader?: boolean;
  /** Max body height (enables vertical scroll), e.g. "70vh" or 640. */
  maxHeight?: React.CSSProperties["maxHeight"];
  /**
   * Min width (px) ของแต่ละคอลัมน์กะ — ลดเมื่อพื้นที่แคบเพื่อเลี่ยง
   * horizontal scroll
   * @default 220
   */
  minColumnWidth?: number;
};

/**
 * Pattern A — monthly shift table (ตารางกะ).
 * Rows = days, columns = shift periods, cells = ordered assignment slots.
 * Purely presentational: all data via props, interactions via callbacks.
 */
const ShiftTable = React.forwardRef<HTMLDivElement, ShiftTableProps>(
  function ShiftTable(
    {
      className,
      columns,
      days,
      onSlotClick,
      onAddSlot,
      onEditColumn,
      addLabel = "เพิ่ม",
      dayColumnLabel = "วันที่",
      stickyHeader = true,
      maxHeight,
      minColumnWidth = 220,
      ...props
    },
    ref,
  ) {
    const gridTemplateColumns = `88px repeat(${Math.max(columns.length, 1)}, minmax(${minColumnWidth}px, 1fr))`;

    // แยก H-scroll (outer) กับ V-scroll (inner) เพื่อหลีกเลี่ยง Chrome 2D-overflow
    // compositing bug ที่ทำให้ sticky header border ถูก scrolled-content layer ทับ
    const innerContent = (
      <>
        {/* Header */}
        <div
          role="row"
          className={cn(
            "grid bg-gray-50 border-b border-border-default",
            stickyHeader && "sticky top-0 z-10",
          )}
          style={{ gridTemplateColumns }}
        >
          <div
            role="columnheader"
            className="flex items-center justify-center px-2 py-3 text-sm font-semibold text-text-secondary"
          >
            {dayColumnLabel}
          </div>
          {columns.map((column) => (
            <div
              key={column.id}
              role="columnheader"
              className="border-l border-border-default px-3 py-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-text-primary">
                    {column.name}
                  </div>
                  <div className="text-xs text-text-tertiary">
                    {column.timeRange} · {column.slotCount} ลำดับ
                  </div>
                </div>
                {onEditColumn && (
                  <button
                    type="button"
                    aria-label={`แก้ไข ${column.name}`}
                    onClick={() => onEditColumn(column.id)}
                    className="shrink-0 cursor-pointer rounded-md p-1 text-text-tertiary transition-colors hover:bg-success-green-600/20 hover:text-success-green-600 [&_svg]:size-3.5"
                  >
                    <Pencil />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Body */}
        {days.map((day) => {
          const today = day.isToday ?? dateFnsIsToday(parseISO(day.id));
          return (
          <div
            key={day.id}
            role="row"
            data-today={today || undefined}
            data-weekend={day.isWeekend || undefined}
            className="relative z-0 grid border-b border-border-default last:border-b-0 data-[weekend=true]:bg-gray-50"
            style={{ gridTemplateColumns }}
          >
            <div
              role="rowheader"
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-2 py-3",
                today && "bg-success-green-600/10",
              )}
            >
              <span
                className={cn(
                  "text-lg font-bold",
                  today ? "text-success-green-main" : "text-text-primary",
                )}
              >
                {day.dayNumber}
              </span>
              <span className={cn("text-xs text-text-tertiary", today && "text-success-green-600")}>
                {day.weekdayLabel}
              </span>
            </div>
            {columns.map((column) => {
              const filled = day.slots[column.id] ?? [];
              const emptyCount = Math.max(column.slotCount - filled.length, 0);
              return (
                <div
                  key={column.id}
                  role="gridcell"
                  className={cn(
                    "flex flex-col gap-1.5 border-l border-border-default p-2",
                  )}
                >
                  {filled.map((slot) => (
                    <AssignmentChip
                      key={slot.id}
                      slot={slot}
                      onClick={
                        onSlotClick
                          ? (clicked) => onSlotClick(day.id, column.id, clicked)
                          : undefined
                      }
                    />
                  ))}
                  {onAddSlot &&
                    Array.from({ length: emptyCount }, (_, index) => {
                      const order = filled.length + index + 1;
                      return (
                        <AddSlotButton
                          key={`add-slot-${order}`}
                          label={addLabel}
                          onClick={() => onAddSlot(day.id, column.id, order)}
                        />
                      );
                    })}
                </div>
              );
            })}
          </div>
          );
        })}
      </>
    );

    return (
      <div
        ref={ref}
        role="grid"
        aria-label={props["aria-label"] ?? "ตารางกะ"}
        className={cn(
          // overflow-x-auto + overflow-y-hidden: CSS spec ไม่ promote hidden → auto
          // ทำให้ outer เป็น H-scroll only — V-scroll อยู่ใน inner div แยกต่างหาก
          "overflow-x-auto overflow-y-hidden rounded-xl border border-border-default bg-white",
          className,
        )}
        {...props}
      >
        {maxHeight ? (
          // Inner: กว้างเท่า content (w-max min-w-full) → ไม่มี H-overflow ใน inner
          // จึงเป็น V-scroll only → ไม่เกิด 2D-overflow compositing bug
          <div className="w-max min-w-full overflow-y-auto" style={{ maxHeight }}>
            {innerContent}
          </div>
        ) : (
          innerContent
        )}
      </div>
    );
  },
);

ShiftTable.displayName = "ShiftTable";

export { ShiftTable };
