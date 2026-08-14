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
        /* หัวคอลัมน์ = type style **`Body/Small Medium`** ของไฟล์ดีไซน์ (14px · 500 · #535a61)
         * ⚠️ ของเดิมเป็น 12px/600 ตัวพิมพ์ใหญ่ สีจาง (#9b9b9b) — ไม่มีแอปไหนทำแบบนั้น
         * สีมาจาก `text-text-body` ไม่ใช่ `text-text-black` — เหตุผลอยู่ที่ `TableCell` */
        "h-12 px-4 py-3 text-left align-middle text-body-sm font-medium whitespace-nowrap text-text-body",
        /* 🔴 ช่องที่มีแต่ checkbox ต้องเว้นซ้าย-ขวาเท่ากัน ไม่งั้น checkbox ไม่อยู่กึ่งกลาง
         *
         * ของเดิมเป็น `pr-0` (สืบมาจากตาราง shadcn) ⇒ ซ้าย 16 ขวา 0 ⇒ **เนื้อหาเยื้องขวา
         * ครึ่งหนึ่งของ padding ที่หายไป** วัดได้จริงทั้งสองที่: ในแอปคอลัมน์กว้าง 36
         * เยื้อง +8px · ใน Storybook ของ DS เองคอลัมน์กว้าง 100 เยื้อง −24px
         * (ทิศต่างกันเพราะความกว้างคอลัมน์ต่างกัน แต่ต้นเหตุเดียวกันคือ padding ไม่สมมาตร)
         *
         * `px-3` ให้ทั้งสองข้างเท่ากันและแคบกว่า `px-4` เดิมเล็กน้อย — คอลัมน์เลือกไม่ควร
         * กินที่เท่าคอลัมน์เนื้อหา แต่ต้องสมมาตรเพื่อให้กึ่งกลางเป็นกึ่งกลางจริง */
        "[&:has([role=checkbox])]:px-3",
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
        /* เซลล์ข้อมูล = type style **`Body/Small Regular`** ของไฟล์ดีไซน์ (14px · 400 · #535a61)
         *
         * 🔴 **400 ไม่ใช่ 600** — ค่าเดิมคือ 600/#191919 ซึ่ง**ย้อนรอยมาจากตารางของ Portal**
         * ไม่ใช่สเปกของ DS · ผลคือทุกแอปที่อยากได้เนื้อความปกติต้องห่อทุกเซลล์ด้วย `<Text>`
         * เพื่อ**ล้มค่าตั้งต้นของตัวเอง** (MediHR ทำอยู่ 3 จอ) และเซลล์ที่ลืมห่อจะหนากว่า
         * ชื่อคนซึ่งเป็นของหลักในแถว — กลับหัวลำดับความสำคัญ
         * หลักฐาน: Figma ประกาศ style ในตารางไว้แค่ 2 ตัว — หัวคอลัมน์ `Body/Small Medium`
         * (500) · เซลล์ `Body/Small Regular` (400) · ตรงกันทั้งจอวันหยุด (544:15745)
         * และจอบุคลากร (544:22556) · ที่โผล่เป็น Montserrat Medium ในบางคอลัมน์คือ text
         * ที่ยังไม่ได้ผูก style ไม่ใช่เจตนา
         *
         * 🔴 สีต้อง **ไม่ผูกกับแบรนด์** — เดิมเคยใช้ `text-text-primary` ซึ่งใน `theme.css`
         * ถูก alias ไปที่ `--color-brand` ⇒ ตัวเลขในตารางเปลี่ยนสีตามแอป (วัดแล้ว:
         * Mediwork `rgb(38,209,179)` เขียวมิ้นต์สด · MediHR `rgb(6,17,172)` · Medimatch
         * `rgb(4,129,168)`) · `text-text-body` (#535a61) ประกาศครั้งเดียวที่ `:root`
         * ไม่มีธีมไหน override ⇒ คงที่ทุกแอปเหมือนที่ `text-text-black` เคยให้ และตรงกับ
         * ตัวแปรที่ดีไซน์อ้างถึงตรง ๆ (`--color/text/body`) · ต้องเป็นสีเดียวกับหัวตารางเสมอ */
        "h-16 px-4 py-3 align-middle text-body-sm font-normal text-text-body",
        /* 🔴 ช่องที่มีแต่ checkbox ต้องเว้นซ้าย-ขวาเท่ากัน ไม่งั้น checkbox ไม่อยู่กึ่งกลาง
         *
         * ของเดิมเป็น `pr-0` (สืบมาจากตาราง shadcn) ⇒ ซ้าย 16 ขวา 0 ⇒ **เนื้อหาเยื้องขวา
         * ครึ่งหนึ่งของ padding ที่หายไป** วัดได้จริงทั้งสองที่: ในแอปคอลัมน์กว้าง 36
         * เยื้อง +8px · ใน Storybook ของ DS เองคอลัมน์กว้าง 100 เยื้อง −24px
         * (ทิศต่างกันเพราะความกว้างคอลัมน์ต่างกัน แต่ต้นเหตุเดียวกันคือ padding ไม่สมมาตร)
         *
         * `px-3` ให้ทั้งสองข้างเท่ากันและแคบกว่า `px-4` เดิมเล็กน้อย — คอลัมน์เลือกไม่ควร
         * กินที่เท่าคอลัมน์เนื้อหา แต่ต้องสมมาตรเพื่อให้กึ่งกลางเป็นกึ่งกลางจริง */
        "[&:has([role=checkbox])]:px-3",
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
