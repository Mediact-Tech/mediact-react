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
        className={cn("w-full caption-bottom text-body-sm", className)}
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
      /* พื้นหัวตารางมีสี และ **ไม่มีเส้นคั่นใต้หัว** — วัดจาก Portal จริง
       * (borderBottomWidth = 0) พื้นสีทำหน้าที่แยกหัวออกจากเนื้ออยู่แล้ว
       * เส้นซ้ำอีกเส้นทำให้ดูหนักโดยไม่ได้ข้อมูลเพิ่ม */
      className={cn("bg-bg-table-header", className)}
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
      /* 🔴 `border-b-0` ไม่ใช่ `border-0` — เจตนาคือ "แถวสุดท้ายไม่มีเส้นใต้"
       * `border-0` ลบ**ทุกด้าน** ⇒ แถวหัวกลุ่มที่บังเอิญเป็นแถวสุดท้าย (กลุ่มท้ายที่ถูกพับอยู่)
       * จะเสียเส้นบนไปด้วย แล้วกลืนกับแถวข้างบนสนิท — วัดเจอตอนทำ `groupBy`
       * (borderTop 0px · แถวเตี้ยลง 0.5px เทียบกับหัวกลุ่มตัวอื่น) */
      className={cn("[&_tr:last-child]:border-b-0", className)}
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
        "border-t border-border-default bg-bg-subtle font-medium",
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
        /* เส้นคั่นแถวใช้ `divider-gray` (#919eab33) — ตรงกับที่วัดจาก Portal เป๊ะ
         * ต่างจาก `border-default` (#0000001f) ที่เข้มกว่าและอมเทาน้อยกว่า */
        "border-b border-divider-gray transition-colors hover:bg-bg-subtle data-[state=selected]:bg-brand-subtle",
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
        /* วัดจาก Portal: สูง 48 · pad 12/16 · 14px/500 · #191919 · ไม่ตัดบรรทัด
         * ⚠️ ของเดิมเป็น 12px/600 ตัวพิมพ์ใหญ่ สีจาง (#9b9b9b) — ไม่มีแอปไหนทำแบบนั้น */
        "h-12 px-4 py-3 text-left align-middle text-body-sm font-medium whitespace-nowrap text-text-black",
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
        /* วัดจาก Portal: สูง 64.5 · pad 12/16 · 14px/**600**
         * น้ำหนัก 600 ในเซลล์ข้อมูลเป็นของจริง ไม่ใช่ความผิดพลาด — ตารางของ Portal
         * ใช้ตัวหนาทั้งตารางเพื่อให้อ่านข้ามคอลัมน์ได้เร็ว
         *
         * 🔴 สีต้องเป็นดำคงที่ **ห้ามเปลี่ยนตามแอป** — เดิมใช้ `text-text-primary`
         * ซึ่งใน `theme.css` ถูก alias ไปที่ `--color-brand` ⇒ ตัวเลขในตารางเปลี่ยนสี
         * ตามแบรนด์ทุกแอป (วัดแล้ว: Mediwork `rgb(38,209,179)` เขียวมิ้นต์สด ·
         * MediHR `rgb(6,17,172)` น้ำเงินเข้ม · Medimatch `rgb(4,129,168)`)
         * — ข้อมูลในตารางคือ "ข้อมูล" ไม่ใช่องค์ประกอบของแบรนด์ ต้องอ่านง่ายเท่ากันทุกแอป
         * และต้องเป็นสีเดียวกับหัวตารางซึ่งใช้ `text-text-black` อยู่แล้ว */
        "h-16 px-4 py-3 align-middle text-body-sm font-semibold text-text-black",
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
      className={cn("mt-4 text-body-sm text-text-tertiary", className)}
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
