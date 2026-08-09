import * as React from "react";
import { ChevronDown } from "lucide-react";
import type { Row } from "@tanstack/react-table";
import { cn } from "../lib/cn";
import { TableHead, TableRow } from "./Table";
import { groupItems, type GroupBy } from "../form/group-options";

/* ────────────────────────────────────────────────────────────────────────────
 * แบ่งแถวเป็นกลุ่มใต้หัวตารางชุดเดียว
 *
 * สำรวจของจริง 2026-08-09 — **มี 8 ที่ที่จัดกลุ่มอยู่แล้ว ทำกันคนละแบบทั้ง 8**
 *
 *   ① คำขอ 5 หน้า (ลา · ทำงาน · หยุด · แลกเวร · โอนเวร) — จัดกลุ่มตามวันที่
 *      หัวตารางชุดเดียว + แถวหัวกลุ่มใน `<tbody>`  ← ทรงที่ถูก
 *   ② roster ฝั่ง Mediwork — ประจำ/พาร์ตไทม์ = **2 ตาราง หัวซ้ำ 2 ชุด**
 *   ③ roster ฝั่ง MediHR — 2 section แยกกัน หัวซ้ำเหมือนกัน
 *   ④ ตารางเวร — 2 ชั้น (วิชาชีพ → ประเภทการจ้าง) พับได้ · ไม่ใช่ `<table>`
 *
 * 🔴 **สิ่งที่พังเหมือนกันทั้ง 5 หน้าคำขอ: `colSpan` เขียนเลขตายตัว**
 * (`colSpan={6}` · `{5}` · `{7}` …) ⇒ วันที่ใครเพิ่มคอลัมน์ แถบหัวกลุ่มจะสั้นกว่า
 * ตารางแล้วมีช่องโหว่ท้ายแถว **โดยไม่มีอะไรฟ้อง** — ตัวนี้นับจากตารางเองเสมอ
 *
 * 🔴 **สีแถบหัวกลุ่มไม่ตรงกันอยู่แล้ววันนี้**: `#F1FFFD` (ลา · แลกเวร · โอนเวร)
 * กับ `#F5F6F7` (ทำงาน · หยุด) — สองสีนี้อยู่ในผลิตภัณฑ์เดียวกันคนละหน้า
 * ที่นี่ใช้ `bg-table-header` ตัวเดียว เพราะหัวกลุ่ม **ก็คือหัว** ไม่ใช่ข้อมูล
 * (⚠️ ห้ามใช้ `bg-subtle` — นั่นคือสี hover ของแถว หัวกลุ่มจะดูเหมือนแถวที่ถูกชี้อยู่
 *  และห้ามใช้ `brand-subtle` — บน Medimatch มันเท่ากับสีพื้นการ์ดพอดี แถบจะหายไปเลย)
 * ──────────────────────────────────────────────────────────────────────────── */

export type { GroupBy };

/** สิ่งที่ผู้เรียกได้รับตอนวาดป้ายกลุ่มเอง */
export type DataTableGroupLabelContext<TData> = {
  /** ค่าที่ `groupBy` คืนมา — คีย์คงที่ ไม่ใช่ข้อความบนจอ */
  key: string;
  /** แถวในกลุ่มนี้ (เรียงแล้ว ตามที่ตารางเรียง) */
  rows: TData[];
  /** = `rows.length` — ส่งมาให้เพราะ **8 ใน 8 ที่ของจริงแสดงจำนวนในป้าย** */
  count: number;
  /** ลำดับกลุ่ม เริ่มที่ 0 */
  index: number;
};

export type DataTableGroupingProps<TData> = {
  /**
   * แบ่งแถวเป็นกลุ่ม — คืนคีย์กลุ่มของแถวนั้น · คืน `null` = ไม่เข้ากลุ่มไหน
   *
   * ใช้ตัวเดียวกับที่ `ComboBox`/`EntityAutocomplete` ใช้จัดกลุ่มตัวเลือก
   * (`form/group-options.ts`) ⇒ "จัดกลุ่ม" แปลว่าเรื่องเดียวกันทั้งระบบ
   *
   * ```tsx
   * groupBy={(p) => (p.isPartTime ? "partTime" : "fullTime")}
   * groupOrder={["fullTime", "partTime"]}
   * ```
   *
   * 🔴 **คืนคีย์ ไม่ใช่ข้อความที่จะแสดง** — ข้อความมาจาก `groupLabel` เพราะต้องแปลภาษา
   * ถ้า `groupBy` คืนคำแปลตรง ๆ กลุ่มจะแตกเป็นคนละกลุ่มทันทีที่สลับภาษา
   */
  groupBy?: GroupBy<TData>;
  /**
   * ลำดับกลุ่มตายตัว — ไม่ส่ง = เรียงตามลำดับที่เจอครั้งแรกในข้อมูล
   *
   * กลุ่มที่ไม่อยู่ในลิสต์**ไม่ถูกทิ้ง** แต่ต่อท้ายให้ (ทิ้ง = แถวหายจากจอเงียบ ๆ)
   */
  groupOrder?: readonly string[];
  /**
   * ป้ายหัวกลุ่ม — ไม่ส่ง = ใช้ `คีย์ (จำนวน)`
   *
   * รับ `count` มาให้เลยเพราะของจริงทุกที่แสดงจำนวน แต่**รูปแบบไม่ตรงกัน**
   * ("9 ส.ค. (3 คำขอ)" · "พนักงานประจำ (5)") ⇒ ปล่อยให้ผู้เรียกประกอบเอง
   * ดีกว่าเติม `(n)` ให้อัตโนมัติแล้วชนกับ `t(key, {count})` ที่นับซ้ำ
   *
   * คืน element ได้ ⇒ จุดสี/ไอคอนหน้าป้ายเป็นของผู้เรียก — DS ไม่รับสีดิบเข้ามา
   */
  groupLabel?: (ctx: DataTableGroupLabelContext<TData>) => React.ReactNode;
  /** พับ/กางกลุ่มได้ — มีที่มาจากตารางเวรซึ่งทำเองอยู่แล้ว */
  collapsibleGroups?: boolean;
  /** กลุ่มที่พับไว้ตั้งแต่แรก (uncontrolled) */
  defaultCollapsedGroups?: readonly string[];
  /** กลุ่มที่พับอยู่ (controlled) — ส่งมาแล้วต้องส่ง `onCollapsedGroupsChange` ด้วย */
  collapsedGroups?: readonly string[];
  onCollapsedGroupsChange?: (keys: string[]) => void;
};

export type ResolvedGroup<TData> = {
  /** `null` = ก้อนที่ `groupBy` ไม่จัดกลุ่มให้ — ไม่มีแถวหัว อยู่บนสุด */
  key: string | null;
  rows: Row<TData>[];
  collapsed: boolean;
};

/**
 * แบ่ง row model ที่**เรียงแล้ว**ออกเป็นกลุ่ม
 *
 * 🔴 รับ `Row<TData>` ไม่ใช่ข้อมูลดิบ — เพราะต้องจัดกลุ่ม**หลัง**การเรียงและการแบ่งหน้า
 * ของ TanStack ไม่งั้นกลุ่มจะไม่ตรงกับสิ่งที่ตารางกำลังแสดง และ `row.getIsSelected()`
 * กับ `row.id` ที่ทั้งการติ๊กเลือกใช้อยู่จะหลุดหายไปด้วย
 */
export function resolveGroups<TData>(
  rows: Row<TData>[],
  groupBy: GroupBy<TData>,
  groupOrder: readonly string[] | undefined,
  collapsedKeys: readonly string[],
): ResolvedGroup<TData>[] {
  const collapsed = new Set(collapsedKeys);
  return groupItems(rows, (row) => groupBy(row.original), groupOrder).map(
    (g) => ({
      key: g.heading,
      rows: g.items,
      collapsed: g.heading != null && collapsed.has(g.heading),
    }),
  );
}

/**
 * แถวหัวกลุ่ม — DS เป็นเจ้าของ `<tr>` และ `colSpan` เอง ผู้เรียกกำหนดได้แค่เนื้อป้าย
 *
 * ตั้งใจไม่เปิด render prop ที่คืน `<tr>` เอง เพราะนั่นคือคืน `colSpan` กลับไปให้
 * ผู้เรียกเขียนเลขเอง = บั๊กเดิมที่ของจริงเป็นอยู่ 5 หน้า
 */
export function DataTableGroupRow({
  colSpan,
  label,
  collapsible,
  collapsed,
  onToggle,
  toggleAriaLabel,
}: {
  colSpan: number;
  label: React.ReactNode;
  collapsible?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
  toggleAriaLabel?: string;
}) {
  /* `<th scope="colgroup">` ไม่ใช่ `<td>` — แถวนี้อธิบายกลุ่มคอลัมน์ที่ตามมา
   * โปรแกรมอ่านหน้าจอจึงประกาศมันเป็นหัว ไม่ใช่เซลล์ข้อมูลว่าง ๆ ที่ยาวผิดปกติ */
  return (
    <TableRow className="border-t border-divider-gray hover:bg-transparent">
      <TableHead
        scope="colgroup"
        colSpan={colSpan}
        className={cn(
          /* `TableHead` ตั้งต้นสูง 48 + `whitespace-nowrap` — แถบกลุ่มต้องเตี้ยกว่าหัวจริง
           * และต้องตัดบรรทัดได้ เพราะป้ายกลุ่มเป็นข้อความยาว (ชื่อวันที่เต็ม) ไม่ใช่ชื่อคอลัมน์ */
          "h-auto whitespace-normal bg-bg-table-header py-2.5 font-semibold",
        )}
      >
        {collapsible ? (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={!collapsed}
            aria-label={toggleAriaLabel}
            className="-mx-1 flex items-center gap-1.5 rounded-sm px-1 py-0.5 hover:bg-overlay-hover focus:outline-none focus-visible:ring-1 focus-visible:ring-brand"
          >
            <ChevronDown
              aria-hidden
              className={cn(
                "size-4 shrink-0 text-text-tertiary transition-transform",
                collapsed && "-rotate-90",
              )}
            />
            {label}
          </button>
        ) : (
          label
        )}
      </TableHead>
    </TableRow>
  );
}

/** ป้ายเริ่มต้น — `คีย์ (จำนวน)` ตามที่ของจริงทำกันทั้ง 8 ที่ */
export function defaultGroupLabel({
  key,
  count,
}: {
  key: string;
  count: number;
}) {
  return `${key} (${count})`;
}
