import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
  type OnChangeFn,
  type Updater,
  type Row,
  type Table as TanstackTable,
  type RowData,
} from "@tanstack/react-table";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Inbox,
} from "lucide-react";
import { cn } from "../lib/cn";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table";
import { Checkbox } from "../ui/Checkbox";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";
import { Skeleton } from "../feedback/Skeleton";
import { EmptyState, ErrorState } from "../feedback/EmptyState";
import {
  DataTableGroupRow,
  defaultGroupLabel,
  resolveGroups,
  type DataTableGroupingProps,
} from "./table-groups";
import {
  frozenCellProps,
  pickFrozenIds,
  useFrozenOffsets,
  type FreezeColumns,
  type FrozenOffsets,
} from "./use-frozen-columns";

/**
 * ช่องเสริมของคอลัมน์ที่ `DataTable` อ่าน
 *
 * TanStack เปิด `ColumnMeta` ไว้ให้ augment ได้ — ประกาศที่นี่ที่เดียว ผู้เรียกทุกแอป
 * จึงได้ทั้ง autocomplete และการตรวจชนิด โดยไม่ต้องประกาศซ้ำในแต่ละรีโป
 */
declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    /** class เพิ่มที่ `<th>` — เช่น `text-right` ให้หัวคอลัมน์ปฏิบัติการตรงกับปุ่มที่ชิดขวา */
    headerClassName?: string;
    /** class เพิ่มที่ `<td>` — เช่น `max-w-50 truncate` สำหรับคอลัมน์ที่ข้อความยาวได้ */
    cellClassName?: string;
    /**
     * ความกว้าง**เป๊ะ** (px) — คนละเรื่องกับ `columnDef.size` ที่ตัวนี้ตีเป็น *ขั้นต่ำ*
     *
     * คอลัมน์ปุ่มกับป้ายสถานะต้องการ "อย่าให้กว้างกว่านี้" ไม่ใช่ "อย่างน้อยเท่านี้"
     * ถ้าใช้ `size` มันจะกินพื้นที่ที่เหลือแล้วบีบคอลัมน์ข้อมูลให้แคบลง
     */
    width?: number;
  }
}

export type DataTablePagination = {
  /** 0-based page index. */
  pageIndex: number;
  /** Rows per page. */
  pageSize: number;
  /** Total rows across all pages (server-side). */
  rowCount: number;
  /**
   * จำนวนหน้าที่หลังบ้านบอกมา — ไม่ส่ง = คิดจาก `rowCount / pageSize` เหมือนเดิม
   *
   * ต้องมีเพราะ API บางเส้นนับหน้าไม่ตรงกับสูตรนั้น (เช่นตัดแถวที่ผู้ใช้ไม่มีสิทธิ์เห็น
   * ออกหลังนับ) ⇒ ปุ่ม "หน้าถัดไป" จะเปิด/ปิดผิดจากที่หลังบ้านตั้งใจ
   */
  pageCount?: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
};

/**
 * Overrides for every piece of built-in copy `DataTable` renders on its own
 * (all English by default — this package has no i18n lib bound in, so the
 * consuming app supplies translated strings here). Every field is optional;
 * omitted fields keep the English default.
 */
export type DataTableLabels = {
  /** aria-label on the header "select all rows" checkbox. Default `"Select all"`. */
  selectAllAriaLabel?: string;
  /** aria-label on each row's own checkbox. Default `"Select row"`. */
  selectRowAriaLabel?: string;
  /**
   * Default empty state (no rows, no `error`). `title` is `string` (not
   * `ReactNode`) because it flows into `EmptyState`, which — like any native
   * `<div>` — only accepts a plain string for its `title` attribute.
   */
  empty?: { title?: string; description?: React.ReactNode };
  /** Default error state, shown when `error` is set and `errorSlot` isn't. Same `title: string` constraint as `empty`. */
  error?: { title?: string; description?: React.ReactNode };
  /** Retry button label inside the default error state. Default `"Retry"`. */
  retry?: React.ReactNode;
  /**
   * ชื่อปุ่ม "หน้าก่อนหน้า" · ค่าเริ่มต้น `"Previous page"`
   *
   * 🔴 เป็น `string` ไม่ใช่ `ReactNode` เพราะปุ่มเป็น**ไอคอนล้วน** ⇒ ข้อความนี้ไป
   * เป็น `aria-label` ซึ่งรับได้เฉพาะ string · ส่ง element มาจะได้ `[object Object]`
   */
  prev?: string;
  /** ชื่อปุ่ม "หน้าถัดไป" · ค่าเริ่มต้น `"Next page"` · เป็น `string` ด้วยเหตุผลเดียวกับ `prev` */
  next?: string;
  /** Label next to the page-size select. Default `"Rows per page"`. */
  rowsPerPage?: React.ReactNode;
  /** ชื่อปุ่มพับ/กางกลุ่ม (ไอคอนล้วน) · ค่าเริ่มต้น `"Toggle group"` */
  toggleGroup?: string;
  /** Selected-row-count label. Default `` (n) => `${n} selected` ``. */
  selected?: (count: number) => React.ReactNode;
  /** Visible-range label, e.g. `"1–10 of 53"`. Default is `"0 of 0"` when `total` is 0. */
  of?: (start: number, end: number, total: number) => React.ReactNode;
};

export type DataTableProps<TData> = {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  isLoading?: boolean;
  /** Server-side pagination. Omit to render all rows in one view. */
  pagination?: DataTablePagination;
  /** Controlled sorting state. When omitted, table is uncontrolled. */
  sorting?: SortingState;
  /**
   * เรียงคอลัมน์เปลี่ยน — **ได้ `SortingState` มาตรง ๆ พร้อมใช้**
   *
   * 🔴 ไม่ใช่ `OnChangeFn` ของ TanStack ที่ส่ง **ฟังก์ชัน** `(old) => next` กลับมา
   * (พิสูจน์แล้ว: กดหัวตาราง 3 ครั้ง ได้ `typeof === "function"` ทั้ง 3 ครั้ง)
   * ⇒ ทางที่ TanStack ให้มาจะพังทันทีที่เอาไปต่อกับอะไรที่ไม่ใช่ `useState`
   * — queryKey ของ react-query · URL state (`nuqs`) · zustand — เพราะได้ฟังก์ชัน
   * ไปใส่แทนค่า แล้ว key ไม่เปลี่ยน/URL เพี้ยนโดยไม่มี error
   *
   * DS คลี่ให้แล้วที่นี่ที่เดียว ⇒ เหมือน `onPageChange` และ `onCollapsedGroupsChange`
   * ในตัวเดียวกัน · ส่ง `setSorting` ของ `useState` ตรง ๆ ก็ยังใช้ได้เหมือนเดิม
   *
   * ```tsx
   * const [sorting, setSorting] = useState<SortingState>([]);
   * const q = useQuery({ queryKey: ["staff", page, sorting], queryFn: ... });
   * <DataTable manualSorting sorting={sorting} onSortingChange={setSorting} … />
   * ```
   */
  onSortingChange?: (sorting: SortingState) => void;
  /** Manual sorting (server-side). When `true`, the table will not sort rows itself. */
  manualSorting?: boolean;
  /** Enable a checkbox selection column. */
  enableSelection?: boolean;
  /**
   * แถวไหนติ๊กได้บ้าง — ไม่ส่ง = ติ๊กได้ทุกแถว
   *
   * 🔴 **select-all จะติ๊กเฉพาะแถวที่ผ่านเงื่อนไขนี้** และตัวนับ "เลือกแล้ว N จาก M"
   * ใช้ M = จำนวนแถวที่ติ๊กได้ ไม่ใช่จำนวนแถวทั้งหมด
   *
   * ของจริงบน Mediwork ต้องการแบบนี้ทุกหน้าคำขอ — ติ๊กได้เฉพาะใบที่ยัง "รออนุมัติ"
   * ใบที่อนุมัติ/ปฏิเสธไปแล้วต้องเห็นในตารางแต่ทำอะไรไม่ได้
   * (วันนี้แต่ละฟีเจอร์ส่ง `pendingCount` เข้าไปเอง ซ้ำกัน 6 ที่)
   *
   * ```tsx
   * isRowSelectable={(r) => r.status === "PENDING"}
   * ```
   */
  isRowSelectable?: (row: TData) => boolean;
  /**
   * ความกว้างขั้นต่ำของตาราง (px) — แคบกว่านี้แล้วเลื่อนแนวนอนแทนที่จะบีบคอลัมน์
   *
   * ไม่ส่ง = ตารางกว้างเท่ากล่องที่อยู่ ไม่มีการเลื่อน
   */
  minTableWidth?: number;
  /**
   * แช่คอลัมน์ไว้กับที่เวลาเลื่อนแนวนอน — ใช้คู่กับ `minTableWidth`
   *
   * ```tsx
   * minTableWidth={1200}
   * freezeColumns={{ left: 1, right: 1 }}   // ชื่อค้างซ้าย · ปุ่มค้างขวา
   * ```
   *
   * นับเฉพาะคอลัมน์**ข้อมูล** — ช่องติ๊กเลือกแช่ตามให้เองเมื่อ `left ≥ 1`
   *
   * 🔴 **ไม่มีผลถ้าไม่มีอะไรให้เลื่อน** — ตารางที่พอดีกล่องอยู่แล้วจะดูเหมือนไม่ทำงาน
   * ต้องตั้ง `minTableWidth` หรือมีคอลัมน์กว้างพอจนล้นก่อน
   *
   * ⚠️ ของจริงวันนี้แช่ซ้ายอย่างเดียว 1 คอลัมน์ (ตารางเวร 4 ไฟล์) —
   * **ฝั่งขวายังไม่มีที่ไหนทำ** ตัวนี้จึงเป็นของใหม่ ไม่ได้ลอกของเดิมมา
   */
  freezeColumns?: FreezeColumns;
  rowSelection?: RowSelectionState;
  /** แถวที่ติ๊กเปลี่ยน — **ได้ `RowSelectionState` มาตรง ๆ** เหตุผลเดียวกับ `onSortingChange` */
  onRowSelectionChange?: (rowSelection: RowSelectionState) => void;
  /** Stable id for selection — required when data resets. Default uses array index. */
  getRowId?: (row: TData, index: number) => string;
  /** Click handler for a row. Selection checkbox stops propagation. */
  onRowClick?: (row: TData, index: number) => void;
  /** Sticky header inside scrolling container. */
  stickyHeader?: boolean;
  /**
   * จำนวนแถวโครงร่างตอน `isLoading`
   *
   * ไม่ส่ง = `min(pageSize, 10)` — ต้องมีเพดานเพราะ `pageSize` เป็น 50/100 ได้
   * แล้วจะวาดแถวปลอมเป็นร้อยแถวซึ่งไม่ได้ช่วยให้ใครอ่านอะไรออก · ตารางที่ไม่มี
   * pagination เลย (roster ที่แบ่งกลุ่มเอง) ก็ต้องสั่งเองได้เพราะค่าเริ่มต้น 5 ไม่ตรง
   */
  skeletonRowCount?: number;
  /** class ของกล่องที่เลื่อนได้ — ทางเดียวที่จะปลด `max-h` ตั้งต้นออกได้ */
  containerClassName?: string;
  /** Custom empty state. Rendered when there's no error and 0 rows. */
  empty?: React.ReactNode;
  /**
   * ไอคอนของสถานะว่าง — ไม่ส่ง = กล่องจดหมายเปล่า
   *
   * ควรส่งให้ตรงกับสิ่งที่ตารางนี้แสดง — "ยังไม่มีคำขอ" กับ "ยังไม่มีบุคลากร"
   * เป็นความว่างคนละอย่าง และรูปคือทางที่บอกได้เร็วที่สุดว่าอันไหน
   */
  emptyIcon?: React.ReactNode;
  /** ไอคอนของสถานะผิดพลาด — ไม่ส่ง = สามเหลี่ยมเตือน */
  errorIcon?: React.ReactNode;
  /**
   * วาดสถานะว่างเอง — ได้รู้ด้วยว่า **ว่างเพราะกรองแล้วไม่เจอ หรือว่างเพราะยังไม่มีข้อมูลเลย**
   *
   * 🔴 สองอย่างนี้ต้องพูดคนละแบบ: "ไม่พบผลลัพธ์ ลองแก้คำค้น" กับ "ยังไม่มีรายการ กดเพิ่ม"
   * — บอกให้ผู้ใช้ไปสร้างใหม่ทั้งที่เขาแค่กรองผิด คือทางที่ทำให้เขาสร้างข้อมูลซ้ำ
   *
   * ```tsx
   * renderEmpty={({ isFiltered }) => isFiltered ? <NoMatch/> : <FirstRun/>}
   * ```
   *
   * ชนะ `empty` เมื่อส่งมาทั้งคู่
   */
  renderEmpty?: (ctx: { isFiltered: boolean }) => React.ReactNode;
  /**
   * ตารางนี้กำลังถูกกรอง/ค้นอยู่หรือเปล่า — ตัวตารางไม่รู้เอง เพราะการกรองเกิดนอกตัวมัน
   * (ช่องค้นหาอยู่เหนือตาราง · ตัวกรองอยู่คนละที่) ⇒ ผู้เรียกต้องบอก
   */
  isFiltered?: boolean;
  className?: string;

  /**
   * Truthy → renders the error state instead of rows/empty state. Pass the
   * actual caught error (for future use / telemetry) or just `true`.
   * `isLoading` still takes priority, so a background refetch doesn't flash
   * a stale error.
   */
  error?: unknown;
  /** Override the default error block entirely. Caller closes over `error` / `onRetry` itself. */
  errorSlot?: React.ReactNode;
  /**
   * วาดสถานะผิดพลาดเอง — **ได้ตัว error กับปุ่มลองใหม่ส่งมาให้** ไม่ต้อง closure เอง
   *
   * ต่างจาก `errorSlot` ตรงที่ไม่ต้องหอบ `error`/`onRetry` ไปผูกไว้ข้างนอก
   * ⇒ แยกเป็น component ที่ใช้ซ้ำได้จริง
   *
   * ```tsx
   * renderError={({ error, retry }) => <ApiError err={error} onRetry={retry} />}
   * ```
   *
   * ชนะ `errorSlot` เมื่อส่งมาทั้งคู่
   */
  renderError?: (ctx: {
    error: unknown;
    retry: (() => void) | undefined;
  }) => React.ReactNode;
  /** Retry action wired into the default error state's button. No-op if `errorSlot` is set. */
  onRetry?: () => void;

  /** Override any built-in copy — see `DataTableLabels`. All English by default. */
  labels?: DataTableLabels;
} & DataTableGroupingProps<TData>;

function DataTable<TData>({
  columns,
  data,
  isLoading,
  pagination,
  sorting: sortingProp,
  onSortingChange,
  manualSorting,
  enableSelection,
  isRowSelectable,
  minTableWidth,
  freezeColumns,
  rowSelection: rowSelectionProp,
  onRowSelectionChange,
  getRowId,
  onRowClick,
  stickyHeader,
  skeletonRowCount,
  containerClassName,
  empty,
  emptyIcon,
  errorIcon,
  renderEmpty,
  isFiltered,
  renderError,
  className,
  error,
  errorSlot,
  onRetry,
  labels,
  groupBy,
  groupOrder,
  groupLabel,
  collapsibleGroups,
  defaultCollapsedGroups,
  collapsedGroups,
  onCollapsedGroupsChange,
}: DataTableProps<TData>) {
  /* 🔴 TanStack ตั้ง `size: 150` เป็นค่าเริ่มต้นให้ทุกคอลัมน์ ⇒ อ่านจาก
   * `columnDef.size` ตรง ๆ ไม่ได้ เพราะจะได้ 150 มาแม้ผู้เรียกไม่ได้สั่งอะไรเลย
   * แล้วทุกคอลัมน์จะถูกยัด min-width 150px โดยไม่มีใครขอ */
  const explicitWidths = React.useMemo(() => {
    const m = new Map<string, number>();
    columns.forEach((c, i) => {
      if (c.size == null) return;
      const key = c.id ?? (c as { accessorKey?: string }).accessorKey ?? String(i);
      m.set(String(key), c.size);
    });
    return m;
  }, [columns]);

  /* 🔴 TanStack เรียก `onXChange` ด้วย **ฟังก์ชัน** `(old) => next` ไม่ใช่ค่า
   * (พิสูจน์แล้ว — ทุกครั้ง ไม่ใช่บางครั้ง) · ปล่อยผ่านไปให้ผู้เรียกแปลว่าทุกที่ที่ใช้
   * ตารางนี้ต้องเขียน `typeof u === "function" ? u(prev) : u` เองซ้ำกันทุกจอ
   * และจอที่ลืม จะพังแบบ**เงียบ** (queryKey ไม่เปลี่ยน · URL ได้ค่าประหลาด)
   *
   * คลี่ที่นี่ที่เดียว ⇒ callback ทุกตัวของ component นี้ส่ง "ค่า" เหมือนกันหมด */
  const resolve = <T,>(updater: Updater<T>, prev: T): T =>
    typeof updater === "function" ? (updater as (old: T) => T)(prev) : updater;

  const [internalSorting, setInternalSorting] = React.useState<SortingState>([]);
  const sorting = sortingProp ?? internalSorting;
  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    const next = resolve(updater, sorting);
    if (onSortingChange) onSortingChange(next);
    else setInternalSorting(next);
  };

  const [internalSelection, setInternalSelection] = React.useState<RowSelectionState>({});
  const rowSelection = rowSelectionProp ?? internalSelection;
  const handleSelectionChange: OnChangeFn<RowSelectionState> = (updater) => {
    const next = resolve(updater, rowSelection);
    if (onRowSelectionChange) onRowSelectionChange(next);
    else setInternalSelection(next);
  };

  const [internalCollapsed, setInternalCollapsed] = React.useState<string[]>(
    () => [...(defaultCollapsedGroups ?? [])],
  );
  const collapsedKeys = collapsedGroups ?? internalCollapsed;
  const toggleGroup = (key: string) => {
    const next = collapsedKeys.includes(key)
      ? collapsedKeys.filter((k) => k !== key)
      : [...collapsedKeys, key];
    if (onCollapsedGroupsChange) onCollapsedGroupsChange(next);
    else setInternalCollapsed(next);
  };

  const finalColumns = React.useMemo<ColumnDef<TData, any>[]>(() => {
    if (!enableSelection) return columns;
    const selectColumn: ColumnDef<TData, any> = {
      id: "__select",
      size: 40,
      header: ({ table }) => {
        /* นับจากแถวที่ **ติ๊กได้จริง** เท่านั้น — ไม่งั้นหน้าที่มีแถวติ๊กไม่ได้ปนอยู่
         * จะไม่มีทางขึ้นเป็น "เลือกครบ" เลย ค้างเป็นขีดกลางตลอด */
        const rows = table.getRowModel().rows;
        const selectable = rows.filter((r) => r.getCanSelect());
        const picked = selectable.filter((r) => r.getIsSelected()).length;
        return (
          <Checkbox
            checked={
              selectable.length > 0 && picked === selectable.length
                ? true
                : picked > 0
                  ? "indeterminate"
                  : false
            }
            disabled={selectable.length === 0}
            /* อัปเดตครั้งเดียวทั้งก้อน — วนเรียก `toggleSelected` ทีละแถวจะคิดจาก
             * state เดิมที่ยังไม่ re-render ทุกครั้ง แล้วตัวสุดท้ายทับตัวก่อนหน้า */
            onCheckedChange={(v) =>
              table.setRowSelection((prev) => {
                const next = { ...prev };
                selectable.forEach((r) => {
                  if (v === true) next[r.id] = true;
                  else delete next[r.id];
                });
                return next;
              })
            }
            aria-label={labels?.selectAllAriaLabel ?? "Select all"}
          />
        );
      },
      cell: ({ row }) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onCheckedChange={(v) => row.toggleSelected(v === true)}
            aria-label={labels?.selectRowAriaLabel ?? "Select row"}
          />
        </div>
      ),
      enableSorting: false,
    };
    return [selectColumn, ...columns];
  }, [columns, enableSelection, labels?.selectAllAriaLabel, labels?.selectRowAriaLabel]);

  const table = useReactTable({
    data,
    columns: finalColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: manualSorting ? undefined : getSortedRowModel(),
    state: { sorting, rowSelection },
    onSortingChange: handleSortingChange,
    onRowSelectionChange: handleSelectionChange,
    /* ส่งเป็นฟังก์ชันเมื่อมีเงื่อนไข ⇒ `row.getCanSelect()` ตอบตามจริง
     * ทั้งช่องติ๊กรายแถวและ select-all อ่านค่าเดียวกันนี้ ไม่แยกกันคิด */
    enableRowSelection: enableSelection
      ? isRowSelectable
        ? (row) => isRowSelectable(row.original)
        : true
      : false,
    manualSorting,
    manualPagination: !!pagination,
    rowCount: pagination?.rowCount,
    getRowId,
  });

  const totalPages = pagination
    ? Math.max(
        1,
        pagination.pageCount ?? Math.ceil(pagination.rowCount / pagination.pageSize),
      )
    : 1;
  const currentPage = pagination ? pagination.pageIndex + 1 : 1;

  const tableRef = React.useRef<HTMLTableElement>(null);
  const renderedIds = table.getVisibleLeafColumns().map((c) => c.id);
  const { left: frozenLeft, right: frozenRight } = pickFrozenIds(
    renderedIds,
    freezeColumns,
    Boolean(enableSelection),
  );
  const frozen = useFrozenOffsets(tableRef, frozenLeft, frozenRight);

  return (
    /* 🔴 แถบแบ่งหน้าอยู่ **นอก**การ์ดที่มีขอบ — โครงตาม `ActionTabel` ของ Portal:
     * กล่องนอกไม่มีขอบ · การ์ดตารางอยู่ข้างใน · แถบแบ่งหน้าเป็นพี่น้องของการ์ด
     * ไม่ใช่ลูก ⇒ ไม่มีเส้นคั่นบนแถบ
     * ของเดิมที่นี่เอาแถบไปไว้ในการ์ดแล้วขีดเส้น `border-t` คั่น ซึ่งไม่ตรงกับที่ไหน
     *
     * ⚠️ ระยะห่างเป็น `gap-1` (4) **ไม่ใช่ `gap-4` (16) ของ Portal** — ตั้งใจต่างเอง
     * เพราะแถบมี `py-4` ของตัวเองอยู่แล้ว ⇒ ของ Portal วัดจากขอบการ์ดถึงตัวหนังสือ
     * ได้ 38 ซึ่งดูหลุดจากตาราง · ลดเหลือ 4 แล้วได้ 26 แถบยังไม่ติดขอบการ์ด
     * เพราะ padding ของตัวมันเองกันไว้ */
    <div className={cn("flex min-h-0 flex-col gap-1", className)}>
      <div
        className={cn(
          /* วัดจาก Portal จริง: radius 12 · เส้นขอบ #919eab33 · เงาบาง 2 ชั้น
           * (ของเดิม radius 6 · ไม่มีเงา ⇒ ตารางกลืนไปกับพื้นหน้า)
           *
           * `flex-auto` ไม่ใช่ `flex-1` — `flex-1` ตั้ง basis เป็น 0 พอคู่กับ
           * `min-h-0` การ์ดจะยุบเหลือ 0 ในกล่องที่สูงตามเนื้อหา · `flex-auto`
           * (basis auto) สูงตามเนื้อหาเป็นปกติ แต่ยังยืด/หดได้เมื่อพ่อจำกัดความสูง
           * ซึ่งเป็นเคสที่ผู้เรียกส่ง `className="min-h-0 flex-1"` มาเพื่อให้ตาราง
           * เลื่อนในตัวเอง (hr-web EmployeeTable ทำแบบนั้น) */
          "flex min-h-0 flex-auto flex-col overflow-hidden rounded-xl border border-divider-gray bg-bg-default shadow-sm",
        )}
      >
        {/* `Table` ห่อตัวเองด้วย `overflow-auto` อยู่แล้ว ⇒ การเลื่อนแนวนอนได้มาฟรี
            เมื่อตั้ง `minWidth` — ไม่ต้องเพิ่มกล่อง scroll ซ้อนอีกชั้น */}
        <div className={cn(stickyHeader && "max-h-[600px] overflow-auto", containerClassName)}>
        <Table
          ref={tableRef}
          style={minTableWidth != null ? { minWidth: minTableWidth } : undefined}
        >
          <TableHeader
            className={cn(
              /* 🔴 ห้ามใส่สีพื้นตรงนี้ — `TableHeader` มี `bg-bg-table-header` อยู่ที่ base
               * แล้ว และ class ที่ส่งเข้ามาทาง `className` ชนะเสมอผ่าน tailwind-merge
               * ⇒ เคยเขียน `bg-bg-default` ไว้ หัวที่ค้างจึงกลายเป็น**สีขาว** ตอนเลื่อน
               * ทั้งที่ตอนไม่เลื่อนเป็น #ededf5 · สีพื้นของ base ทึบอยู่แล้วจึงยังบังแถว
               * ที่เลื่อนผ่านได้ตามหน้าที่ของ sticky */
              stickyHeader && "sticky top-0 z-10 shadow-[0_1px_0_0_#0000001f]",
            )}
          >
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="hover:bg-transparent">
                {hg.headers.map((header) => {
                  const sortable = header.column.getCanSort();
                  const sortDir = header.column.getIsSorted();
                  const pin = frozenCellProps(frozen[header.column.id], "head");
                  return (
                    <TableHead
                      key={header.id}
                      /* ตัววัดจับคู่หัวคอลัมน์กับระยะแช่ด้วยค่านี้ — ห้ามถอดออก */
                      data-col-id={header.column.id}
                      className={cn(
                        pin.className,
                        header.column.columnDef.meta?.headerClassName,
                      )}
                      /* 🔴 `size` = ความกว้าง **ขั้นต่ำ** ไม่ใช่ความกว้างเป๊ะ
                       *
                       * ของจริงทั้ง 4 แอปเขียน `minWidth: '200px'` (อย่างน้อยเท่านี้
                       * ขยายได้ถ้ามีที่) — ใช้อยู่ 22/41 ไฟล์ มากกว่าความสามารถอื่นทุกตัว
                       * ถ้าตีเป็น `width` เป๊ะ คอลัมน์จะไม่ขยายตามตาราง เหลือช่องว่าง
                       * ด้านขวาเวลาจอกว้าง ซึ่งไม่ใช่สิ่งที่ของจริงทำ */
                      style={{
                        ...(explicitWidths.has(header.column.id)
                          ? { minWidth: explicitWidths.get(header.column.id) }
                          : null),
                        /* `meta.width` = กว้างเป๊ะ ⇒ ตั้งทั้ง width และ maxWidth
                         * ไม่งั้น `table-auto` จะยืดคอลัมน์ตามเนื้อหาอยู่ดี */
                        ...(header.column.columnDef.meta?.width != null
                          ? {
                              width: header.column.columnDef.meta.width,
                              maxWidth: header.column.columnDef.meta.width,
                            }
                          : null),
                        ...pin.style,
                      }}
                    >
                      {header.isPlaceholder ? null : sortable ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="inline-flex cursor-pointer items-center gap-1 hover:text-brand"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {sortDir === "asc" ? (
                            <ArrowUp className="size-3" />
                          ) : sortDir === "desc" ? (
                            <ArrowDown className="size-3" />
                          ) : (
                            <ChevronsUpDown className="size-3 opacity-60" />
                          )}
                        </button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <SkeletonRows
                columnCount={finalColumns.length}
                rowCount={skeletonRowCount ?? Math.min(pagination?.pageSize ?? 5, 10)}
              />
            ) : error ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={finalColumns.length} className="p-0">
                  {renderError
                    ? renderError({ error, retry: onRetry })
                    : (errorSlot ?? (
                    /* ใช้ `ErrorState` ตัวเดียวกับที่แอปใช้ ไม่ประกอบเองในตาราง —
                     * ไม่งั้นสถานะผิดพลาดในตารางจะหน้าตาต่างจากที่อื่นในจอเดียวกัน */
                    <ErrorState
                      error={error}
                      icon={errorIcon}
                      title={labels?.error?.title ?? "Something went wrong"}
                      description={
                        labels?.error?.description ??
                        "We couldn't load this data."
                      }
                      onRetry={onRetry}
                      retryLabel={labels?.retry ?? "Retry"}
                    />
                  ))}
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={finalColumns.length}
                  className="p-0"
                >
                  {renderEmpty
                    ? renderEmpty({ isFiltered: Boolean(isFiltered) })
                    : (empty ?? (
                    /* 🔴 ต้องมีไอคอนด้วย ไม่ใช่ข้อความเปล่า — ตารางเคยส่งแค่
                     * `title`/`description` ⇒ `EmptyState` ไม่ render ป้ายเลย
                     * แล้วสถานะว่างในตารางหน้าตาไม่เหมือน `EmptyState` ที่อื่นในจอเดียวกัน
                     * ทั้งที่เรียก component ตัวเดียวกันอยู่ · ผู้เรียกเปลี่ยนไอคอน
                     * ให้ตรงกับสิ่งที่ตารางนี้แสดงได้ผ่าน `emptyIcon` */
                    <EmptyState
                      icon={emptyIcon ?? <Inbox />}
                      title={labels?.empty?.title ?? "No data"}
                      description={
                        labels?.empty?.description ??
                        "There's nothing to show here yet."
                      }
                    />
                  ))}
                </TableCell>
              </TableRow>
            ) : groupBy ? (
              <GroupedRows
                table={table}
                groupBy={groupBy}
                groupOrder={groupOrder}
                groupLabel={groupLabel}
                collapsibleGroups={collapsibleGroups}
                collapsedKeys={collapsedKeys}
                onToggleGroup={toggleGroup}
                toggleGroupLabel={labels?.toggleGroup ?? "Toggle group"}
                onRowClick={onRowClick}
                frozen={frozen}
              />
            ) : (
              table.getRowModel().rows.map((row, idx) => (
                <DataRow
                  key={row.id}
                  row={row}
                  frozen={frozen}
                  onClick={
                    onRowClick
                      ? () => onRowClick(row.original, idx)
                      : undefined
                  }
                />
              ))
            )}
          </TableBody>
        </Table>
        </div>
      </div>

      {pagination ? (
        <PaginationFooter
          pagination={pagination}
          currentPage={currentPage}
          totalPages={totalPages}
          table={table}
          labels={labels}
        />
      ) : (
        /* 🔴 ตัวนับ "เลือกแล้ว N" เคยอยู่ในแถบแบ่งหน้าเท่านั้น ⇒ ตารางที่เลือกแถวได้
         * แต่ไม่มีแบ่งหน้าจะ **ติ๊กแล้วไม่มีอะไรบอกเลย** (ของจริง: เลือกได้ 11 ตาราง
         * แต่มีแบ่งหน้าแค่ 6) — การเลือกที่ไม่มีผลตอบกลับคือการเลือกที่ผู้ใช้ไม่มั่นใจ */
        <SelectedCountBar table={table} labels={labels} />
      )}
    </div>
  );
}

function DataRow<TData>({
  row,
  onClick,
  frozen,
}: {
  row: Row<TData>;
  onClick?: () => void;
  frozen: FrozenOffsets;
}) {
  return (
    <TableRow
      data-state={row.getIsSelected() ? "selected" : undefined}
      onClick={onClick}
      /* `group/row` = ช่องทางเดียวที่เซลล์ซึ่งถูกแช่จะรู้ว่าแถวกำลังถูกชี้/ถูกเลือก
       * เซลล์ที่แช่ต้องมีพื้นทึบของตัวเอง ⇒ ถ้าไม่ส่งสถานะไป มันจะเป็นสีเดิม
       * อยู่ช่องเดียวขณะที่ทั้งแถวเปลี่ยนสี */
      className={cn("group/row", onClick && "cursor-pointer")}
    >
      {row.getVisibleCells().map((cell) => {
        const pin = frozenCellProps(frozen[cell.column.id], "cell");
        return (
          <TableCell
            key={cell.id}
            data-col-id={cell.column.id}
            className={cn(pin.className, cell.column.columnDef.meta?.cellClassName)}
            style={{
              ...(cell.column.columnDef.meta?.width != null
                ? {
                    width: cell.column.columnDef.meta.width,
                    maxWidth: cell.column.columnDef.meta.width,
                  }
                : null),
              ...pin.style,
            }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        );
      })}
    </TableRow>
  );
}

/**
 * แถวที่แบ่งเป็นกลุ่มใต้หัวตารางชุดเดียว
 *
 * 🔴 `colSpan` มาจาก `getVisibleLeafColumns().length` เสมอ — ของจริง 5 หน้าเขียนเลขไว้ตายตัว
 * แล้วแถบหัวกลุ่มจะสั้นกว่าตารางทันทีที่ใครเพิ่มคอลัมน์ (คอลัมน์ติ๊กเลือกก็นับรวมที่นี่)
 *
 * ⚠️ พับกลุ่ม **ไม่ยกเลิกการติ๊กเลือก** — แถวที่ถูกเลือกไว้ยังนับอยู่ในตัวเลข "เลือกแล้ว N"
 * ทั้งที่มองไม่เห็น · ตั้งใจ เพราะพับคือการซ่อนชั่วคราว ไม่ใช่การถอนสิ่งที่ผู้ใช้เลือกไว้
 */
function GroupedRows<TData>({
  table,
  groupBy,
  groupOrder,
  groupLabel,
  collapsibleGroups,
  collapsedKeys,
  onToggleGroup,
  toggleGroupLabel,
  onRowClick,
  frozen,
}: {
  table: TanstackTable<TData>;
  collapsedKeys: readonly string[];
  onToggleGroup: (key: string) => void;
  toggleGroupLabel: string;
  onRowClick?: (row: TData, index: number) => void;
  frozen: FrozenOffsets;
} & Pick<
  DataTableGroupingProps<TData>,
  "groupOrder" | "groupLabel" | "collapsibleGroups"
> &
  Required<Pick<DataTableGroupingProps<TData>, "groupBy">>) {
  const colSpan = table.getVisibleLeafColumns().length;
  const groups = resolveGroups(
    table.getRowModel().rows,
    groupBy,
    groupOrder,
    collapsedKeys,
  );

  /* ลำดับที่ส่งเข้า `onRowClick` = ลำดับ**ที่เห็นบนจอ** ตรงกับตอนไม่จัดกลุ่ม
   * (กลุ่มที่พับอยู่ไม่นับ เพราะไม่ได้ถูกวาด) */
  let renderIndex = 0;

  return (
    <>
      {groups.map((group, groupIndex) => (
        <React.Fragment key={group.key ?? "__ungrouped"}>
          {group.key != null && (
            <DataTableGroupRow
              colSpan={colSpan}
              collapsible={collapsibleGroups}
              collapsed={group.collapsed}
              onToggle={() => onToggleGroup(group.key!)}
              toggleAriaLabel={toggleGroupLabel}
              label={(groupLabel ?? defaultGroupLabel)({
                key: group.key,
                rows: group.rows.map((r) => r.original),
                count: group.rows.length,
                index: groupIndex,
              })}
            />
          )}
          {!group.collapsed &&
            group.rows.map((row) => {
              const idx = renderIndex++;
              return (
                <DataRow
                  key={row.id}
                  row={row}
                  frozen={frozen}
                  onClick={
                    onRowClick ? () => onRowClick(row.original, idx) : undefined
                  }
                />
              );
            })}
        </React.Fragment>
      ))}
    </>
  );
}

function SkeletonRows({
  columnCount,
  rowCount,
}: {
  columnCount: number;
  rowCount: number;
}) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, r) => (
        <TableRow key={r} className="hover:bg-transparent">
          {Array.from({ length: columnCount }).map((__, c) => (
            <TableCell key={c}>
              <Skeleton shape="text" className="w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

function defaultOfLabel(start: number, end: number, total: number) {
  return total > 0 ? `${start}–${end} of ${total}` : "0 of 0";
}

/** แถบบอกจำนวนที่เลือก — ใช้ตอนไม่มีแถบแบ่งหน้า · ไม่มีอะไรเลือกก็ไม่ render */
function SelectedCountBar<TData>({
  table,
  labels,
}: {
  table: TanstackTable<TData>;
  labels?: DataTableLabels;
}) {
  const count = table.getSelectedRowModel().rows.length;
  if (count === 0) return null;
  return (
    /* ไม่มีเส้นคั่นแล้ว — แถบนี้อยู่นอกการ์ด ระยะห่างมาจาก `gap-4` ของกล่องนอก
     * pad เท่ากับแถบแบ่งหน้า เพราะสองอันนี้สลับที่กัน ต้องไม่ขยับตำแหน่ง */
    <div
      data-slot="selected-count"
      className="px-2 pt-4 text-body-sm font-medium text-text-black"
    >
      {labels?.selected ? labels.selected(count) : `${count} selected`}
    </div>
  );
}

function PaginationFooter<TData>({
  pagination,
  currentPage,
  totalPages,
  table,
  labels,
}: {
  pagination: DataTablePagination;
  currentPage: number;
  totalPages: number;
  table: TanstackTable<TData>;
  labels?: DataTableLabels;
}) {
  const sizeOptions = pagination.pageSizeOptions ?? [10, 20, 50, 100];
  const start =
    pagination.rowCount === 0
      ? 0
      : pagination.pageIndex * pagination.pageSize + 1;
  const end = Math.min(
    pagination.rowCount,
    (pagination.pageIndex + 1) * pagination.pageSize,
  );
  const selectedCount = table.getSelectedRowModel().rows.length;

  const atFirst = pagination.pageIndex === 0;
  const atLast = pagination.pageIndex >= totalPages - 1;

  /* ปุ่มหน้าเป็น**ไอคอนล้วน** ⇒ ต้องมี `aria-label` ไม่งั้นโปรแกรมอ่านหน้าจอ
   * อ่านออกมาเป็นปุ่มเปล่า · ใช้คำเดียวกับที่เคยเป็นข้อความบนปุ่ม */
  const pagerButton =
    "rounded-md p-1 text-text-body transition-colors hover:bg-overlay-hover disabled:pointer-events-none disabled:opacity-30";

  return (
    /* 📐 วัดจาก `ActionTabel` ของ Portal: 14px/500 · ไม่มีเส้นคั่น ไม่มีพื้นหลัง
     * pad **8 ข้าง · 16 บน · ล่าง 0** — ไม่มี pad ล่างเพราะแถบเป็นของสุดท้ายในกล่อง
     * ระยะก้นจึงเป็นของหน้าที่เอาไปวาง ไม่ใช่ของ component */
    /* `data-slot` เป็นที่เกาะที่มั่นคงกว่าการไล่ `closest("div")` — เทสรอบแรก
     * ไล่ขึ้นไปเจอ div ชั้นในแล้วยืนยันว่า "ไม่มี border-t" ซึ่งจริงเสมอ
     * โดยไม่ได้พิสูจน์อะไรเลย · ผู้เรียกก็เกาะ selector นี้จัดสไตล์เพิ่มได้ */
    <div
      data-slot="pagination"
      className="flex flex-wrap items-center gap-x-8 gap-y-3 px-2 pt-4 text-body-sm font-medium"
    >
      {pagination.onPageSizeChange && (
        <div className="flex items-center gap-3">
          {/* ป้ายต้องไม่ตกบรรทัด — วัดแล้วที่ 1000px "Rows per page" แตกเป็น 2 แถว
              แล้วดันแถบสูงขึ้นทั้งแถบ */}
          <span className="whitespace-nowrap text-text-tertiary">
            {labels?.rowsPerPage ?? "Rows per page"}
          </span>
          <Select
            size="sm"
            value={String(pagination.pageSize)}
            onChange={(v) => pagination.onPageSizeChange?.(Number(v))}
            options={sizeOptions.map((n) => ({
              value: String(n),
              label: String(n),
            }))}
            /* 🔴 ในแถบเครื่องมือไม่มี error มาแสดง — บรรทัดที่ shell จองไว้จึงเป็น
             * ที่ว่างเปล่าที่ดันช่องจาก 36 เป็น 56px และดันทั้งแถบเป็น 73px */
            reserveMessageSpace={false}
            containerClassName="w-auto"
            /* ไม่มีกรอบ — ในแถบนี้ช่องเลือกไม่ใช่ "ช่องกรอกในฟอร์ม" แต่เป็นตัวปรับ
             * มุมมองข้าง ๆ ข้อความ · กรอบทำให้มันดูหนักกว่าทุกอย่างรอบตัว
             * `border-transparent` ไม่ใช่ `border-0` — ลบความหนาแล้วช่องจะแคบลง 2px
             * แล้วเลขขยับตอน hover (บทเรียนเดิมจาก skeleton ของปุ่ม) */
            className="h-8 w-auto min-w-14 border-transparent bg-transparent px-2 hover:bg-overlay-hover"
          />
        </div>
      )}

      <div className="flex items-center gap-4 text-text-body">
        <span className="whitespace-nowrap">
          {labels?.of
            ? labels.of(start, end, pagination.rowCount)
            : defaultOfLabel(start, end, pagination.rowCount)}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={labels?.prev ?? "Previous page"}
            className={pagerButton}
            disabled={atFirst}
            onClick={() =>
              pagination.onPageChange(Math.max(0, pagination.pageIndex - 1))
            }
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label={labels?.next ?? "Next page"}
            className={pagerButton}
            disabled={atLast}
            onClick={() =>
              pagination.onPageChange(
                Math.min(totalPages - 1, pagination.pageIndex + 1),
              )
            }
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      {/* ตัวนับที่เลือกไปอยู่ท้ายแถบ — กลุ่มซ้ายต้องเหมือนของ Portal เป๊ะ
          และตัวนับนี้ปรากฏ ๆ หาย ๆ ตามการติ๊ก ถ้าอยู่ซ้ายจะดันทุกอย่างขยับทั้งแถบ */}
      {selectedCount > 0 && (
        <span className="ml-auto whitespace-nowrap text-text-black">
          {labels?.selected
            ? labels.selected(selectedCount)
            : `${selectedCount} selected`}
        </span>
      )}
    </div>
  );
}

export { DataTable };
