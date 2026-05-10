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
  type Row,
  type Table as TanstackTable,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
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
import { EmptyState } from "../feedback/EmptyState";

export type DataTablePagination = {
  /** 0-based page index. */
  pageIndex: number;
  /** Rows per page. */
  pageSize: number;
  /** Total rows across all pages (server-side). */
  rowCount: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
};

export type DataTableProps<TData> = {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  isLoading?: boolean;
  /** Server-side pagination. Omit to render all rows in one view. */
  pagination?: DataTablePagination;
  /** Controlled sorting state. When omitted, table is uncontrolled. */
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  /** Manual sorting (server-side). When `true`, the table will not sort rows itself. */
  manualSorting?: boolean;
  /** Enable a checkbox selection column. */
  enableSelection?: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  /** Stable id for selection — required when data resets. Default uses array index. */
  getRowId?: (row: TData, index: number) => string;
  /** Click handler for a row. Selection checkbox stops propagation. */
  onRowClick?: (row: TData, index: number) => void;
  /** Sticky header inside scrolling container. */
  stickyHeader?: boolean;
  /** Custom empty state. */
  empty?: React.ReactNode;
  className?: string;
};

function DataTable<TData>({
  columns,
  data,
  isLoading,
  pagination,
  sorting: sortingProp,
  onSortingChange,
  manualSorting,
  enableSelection,
  rowSelection: rowSelectionProp,
  onRowSelectionChange,
  getRowId,
  onRowClick,
  stickyHeader,
  empty,
  className,
}: DataTableProps<TData>) {
  const [internalSorting, setInternalSorting] = React.useState<SortingState>([]);
  const sorting = sortingProp ?? internalSorting;
  const handleSortingChange = onSortingChange ?? setInternalSorting;

  const [internalSelection, setInternalSelection] = React.useState<RowSelectionState>({});
  const rowSelection = rowSelectionProp ?? internalSelection;
  const handleSelectionChange = onRowSelectionChange ?? setInternalSelection;

  const finalColumns = React.useMemo<ColumnDef<TData, any>[]>(() => {
    if (!enableSelection) return columns;
    const selectColumn: ColumnDef<TData, any> = {
      id: "__select",
      size: 40,
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllRowsSelected()
              ? true
              : table.getIsSomeRowsSelected()
                ? "indeterminate"
                : false
          }
          onCheckedChange={(v) =>
            table.toggleAllRowsSelected(v === true)
          }
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(v) => row.toggleSelected(v === true)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
    };
    return [selectColumn, ...columns];
  }, [columns, enableSelection]);

  const table = useReactTable({
    data,
    columns: finalColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: manualSorting ? undefined : getSortedRowModel(),
    state: { sorting, rowSelection },
    onSortingChange: handleSortingChange,
    onRowSelectionChange: handleSelectionChange,
    enableRowSelection: enableSelection,
    manualSorting,
    manualPagination: !!pagination,
    rowCount: pagination?.rowCount,
    getRowId,
  });

  const totalPages = pagination
    ? Math.max(1, Math.ceil(pagination.rowCount / pagination.pageSize))
    : 1;
  const currentPage = pagination ? pagination.pageIndex + 1 : 1;

  return (
    <div
      className={cn(
        "flex flex-col rounded-md border border-border-default bg-white",
        className,
      )}
    >
      <div className={cn(stickyHeader && "max-h-[600px] overflow-auto")}>
        <Table>
          <TableHeader
            className={cn(
              stickyHeader && "sticky top-0 z-10 bg-white shadow-[0_1px_0_0_#0000001f]",
            )}
          >
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="hover:bg-transparent">
                {hg.headers.map((header) => {
                  const sortable = header.column.getCanSort();
                  const sortDir = header.column.getIsSorted();
                  return (
                    <TableHead
                      key={header.id}
                      style={
                        header.column.columnDef.size
                          ? { width: header.column.columnDef.size }
                          : undefined
                      }
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
                rowCount={pagination?.pageSize ?? 5}
              />
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={finalColumns.length}
                  className="p-0"
                >
                  {empty ?? (
                    <EmptyState
                      title="No data"
                      description="There's nothing to show here yet."
                    />
                  )}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row, idx) => (
                <DataRow
                  key={row.id}
                  row={row}
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

      {pagination && (
        <PaginationFooter
          pagination={pagination}
          currentPage={currentPage}
          totalPages={totalPages}
          table={table}
        />
      )}
    </div>
  );
}

function DataRow<TData>({
  row,
  onClick,
}: {
  row: Row<TData>;
  onClick?: () => void;
}) {
  return (
    <TableRow
      data-state={row.getIsSelected() ? "selected" : undefined}
      onClick={onClick}
      className={onClick ? "cursor-pointer" : undefined}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
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

function PaginationFooter<TData>({
  pagination,
  currentPage,
  totalPages,
  table,
}: {
  pagination: DataTablePagination;
  currentPage: number;
  totalPages: number;
  table: TanstackTable<TData>;
}) {
  const sizeOptions = pagination.pageSizeOptions ?? [10, 20, 50, 100];
  const start = pagination.pageIndex * pagination.pageSize + 1;
  const end = Math.min(
    pagination.rowCount,
    (pagination.pageIndex + 1) * pagination.pageSize,
  );
  const selectedCount = table.getSelectedRowModel().rows.length;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-default px-3 py-2 text-sm">
      <div className="flex items-center gap-3 text-text-tertiary">
        {selectedCount > 0 && (
          <span className="font-medium text-text-primary">
            {selectedCount} selected
          </span>
        )}
        {pagination.rowCount > 0 ? (
          <span>
            {start}–{end} of {pagination.rowCount}
          </span>
        ) : (
          <span>0 of 0</span>
        )}
      </div>
      <div className="flex items-center gap-3">
        {pagination.onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-text-tertiary">Rows per page</span>
            <Select
              size="sm"
              value={String(pagination.pageSize)}
              onChange={(v) => pagination.onPageSizeChange?.(Number(v))}
              options={sizeOptions.map((n) => ({
                value: String(n),
                label: String(n),
              }))}
              className="w-20"
            />
          </div>
        )}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            disabled={pagination.pageIndex === 0}
            onClick={() =>
              pagination.onPageChange(Math.max(0, pagination.pageIndex - 1))
            }
            leftIcon={<ChevronLeft />}
          >
            Prev
          </Button>
          <span className="px-2 text-text-tertiary">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={pagination.pageIndex >= totalPages - 1}
            onClick={() =>
              pagination.onPageChange(
                Math.min(totalPages - 1, pagination.pageIndex + 1),
              )
            }
            rightIcon={<ChevronRight />}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export { DataTable };
