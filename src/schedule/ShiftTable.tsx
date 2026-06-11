import * as React from "react";
import { Pencil } from "lucide-react";
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
      ...props
    },
    ref,
  ) {
    const gridTemplateColumns = `88px repeat(${Math.max(columns.length, 1)}, minmax(220px, 1fr))`;

    return (
      <div
        ref={ref}
        role="grid"
        aria-label={props["aria-label"] ?? "ตารางกะ"}
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
                    className="shrink-0 cursor-pointer rounded-md p-1 text-text-tertiary transition-colors hover:bg-brand-subtle hover:text-brand [&_svg]:size-3.5"
                  >
                    <Pencil />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Body */}
        {days.map((day) => (
          <div
            key={day.id}
            role="row"
            data-today={day.isToday || undefined}
            data-weekend={day.isWeekend || undefined}
            className="grid border-b border-border-default last:border-b-0 data-[weekend=true]:bg-gray-50"
            style={{ gridTemplateColumns }}
          >
            <div
              role="rowheader"
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-2 py-3",
                day.isToday && "bg-brand-subtle",
              )}
            >
              <span
                className={cn(
                  "text-lg font-bold",
                  day.isToday ? "text-brand" : "text-text-primary",
                )}
              >
                {day.dayNumber}
              </span>
              <span className="text-xs text-text-tertiary">
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
                    day.isToday && "bg-brand-subtle/40",
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
        ))}
      </div>
    );
  },
);

ShiftTable.displayName = "ShiftTable";

export { ShiftTable };
