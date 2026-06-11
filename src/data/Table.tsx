import * as React from "react";
import { cn } from "../lib/cn";

const Table = React.forwardRef<
  HTMLTableElement,
  React.ComponentProps<"table">
>(function Table({ className, ...props }, ref) {
  return (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
});

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.ComponentProps<"thead">
>(function TableHeader({ className, ...props }, ref) {
  return (
    <thead
      ref={ref}
      className={cn("[&_tr]:border-b border-border-default", className)}
      {...props}
    />
  );
});

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.ComponentProps<"tbody">
>(function TableBody({ className, ...props }, ref) {
  return (
    <tbody
      ref={ref}
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
});

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.ComponentProps<"tfoot">
>(function TableFooter({ className, ...props }, ref) {
  return (
    <tfoot
      ref={ref}
      className={cn(
        "border-t border-border-default bg-gray-50 font-medium",
        className,
      )}
      {...props}
    />
  );
});

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.ComponentProps<"tr">
>(function TableRow({ className, ...props }, ref) {
  return (
    <tr
      ref={ref}
      className={cn(
        "border-b border-border-default transition-colors hover:bg-brand-subtle/50 data-[state=selected]:bg-brand-subtle",
        className,
      )}
      {...props}
    />
  );
});

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ComponentProps<"th">
>(function TableHead({ className, ...props }, ref) {
  return (
    <th
      ref={ref}
      className={cn(
        "h-10 px-3 text-left align-middle text-xs font-semibold uppercase tracking-wide text-text-tertiary",
        "[&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  );
});

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.ComponentProps<"td">
>(function TableCell({ className, ...props }, ref) {
  return (
    <td
      ref={ref}
      className={cn(
        "px-3 py-2.5 align-middle text-sm text-text-primary",
        "[&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  );
});

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.ComponentProps<"caption">
>(function TableCaption({ className, ...props }, ref) {
  return (
    <caption
      ref={ref}
      className={cn("mt-4 text-sm text-text-tertiary", className)}
      {...props}
    />
  );
});

Table.displayName = "Table";
TableHeader.displayName = "TableHeader";
TableBody.displayName = "TableBody";
TableFooter.displayName = "TableFooter";
TableRow.displayName = "TableRow";
TableHead.displayName = "TableHead";
TableCell.displayName = "TableCell";
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
