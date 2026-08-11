import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";
import { pickFrozenIds } from "./use-frozen-columns";

type R = { id: string; name: string; ward: string; note: string };
const rows: R[] = [
  { id: "1", name: "ศุกร์", ward: "ICU", note: "—" },
  { id: "2", name: "ดารา", ward: "ER", note: "—" },
];
const columns: ColumnDef<R, any>[] = [
  { accessorKey: "name", header: "ชื่อ" },
  { accessorKey: "ward", header: "หน่วยงาน" },
  { accessorKey: "note", header: "หมายเหตุ" },
];

const cellsOf = (colId: string) =>
  Array.from(document.querySelectorAll(`[data-col-id="${colId}"]`));

describe("DataTable — แช่คอลัมน์", () => {
  /* ── ตรรกะการเลือกคอลัมน์ แยกทดสอบได้โดยไม่ต้องมี layout ── */
  describe("pickFrozenIds", () => {
    const ids = ["__select", "a", "b", "c"];

    it("ไม่ส่ง freezeColumns = ไม่แช่อะไรเลย", () => {
      const r = pickFrozenIds(ids, undefined, true);
      expect(r.left.size + r.right.size).toBe(0);
    });

    /* ปล่อยช่องติ๊กเลื่อนหายไปขณะที่ชื่อยังอยู่ = ติ๊กแถวที่มองไม่เห็นว่าแถวไหน */
    it("left:1 พาช่องติ๊กมาด้วยเอง", () => {
      const r = pickFrozenIds(ids, { left: 1 }, true);
      expect([...r.left]).toEqual(["__select", "a"]);
    });

    it("ไม่มีช่องติ๊ก left:1 ก็แช่คอลัมน์เดียว", () => {
      const r = pickFrozenIds(["a", "b", "c"], { left: 1 }, false);
      expect([...r.left]).toEqual(["a"]);
    });

    it("right นับจากท้าย", () => {
      const r = pickFrozenIds(ids, { right: 1 }, true);
      expect([...r.right]).toEqual(["c"]);
    });

    /* 🔴 สั่งแช่รวมกันเกินจำนวนคอลัมน์ ⇒ คอลัมน์เดียวถูกแช่สองฝั่ง แล้วระยะขวาชนะ
     * = คอลัมน์กระโดดไปติดขวาโดยไม่มีใครสั่ง · ให้ซ้ายชนะและตัดขวาทิ้ง */
    it("แช่ซ้าย+ขวาเกินจำนวนคอลัมน์ = ไม่มีคอลัมน์ไหนถูกแช่สองฝั่ง", () => {
      const r = pickFrozenIds(["a", "b"], { left: 2, right: 2 }, false);
      expect([...r.left]).toEqual(["a", "b"]);
      expect([...r.right]).toEqual([]);
      const overlap = [...r.left].filter((id) => r.right.has(id));
      expect(overlap).toEqual([]);
    });
  });

  describe("การ render", () => {
    /* ตัววัดจับคู่หัวคอลัมน์กับระยะแช่ด้วย data-col-id — หายเมื่อไหร่ระบบเงียบทันที */
    it("ทุกเซลล์มี data-col-id ให้ตัววัดจับคู่", () => {
      render(<DataTable columns={columns} data={rows} getRowId={(r) => r.id} />);
      /* หัว 1 + แถว 2 */
      expect(cellsOf("name")).toHaveLength(3);
    });

    it("ไม่ส่ง freezeColumns = ไม่มีเซลล์ไหน sticky", () => {
      render(<DataTable columns={columns} data={rows} getRowId={(r) => r.id} />);
      expect(
        document.querySelectorAll('[data-col-id][class*="sticky"]'),
      ).toHaveLength(0);
    });

    /**
     * ⚠️ happy-dom ไม่คำนวณ layout ⇒ `offsetLeft` = 0 ทุกตัว
     * เทสนี้จึงพิสูจน์ได้แค่ว่า **ถูกทำเครื่องหมายว่าแช่** ไม่ใช่ว่าตำแหน่งถูก
     * ระยะจริงพิสูจน์ในเบราว์เซอร์เท่านั้น (ดู DataTable.md)
     */
    it("left:1 ทำให้คอลัมน์แรกทั้งหัวและเนื้อเป็น sticky", () => {
      render(
        <DataTable
          columns={columns}
          data={rows}
          getRowId={(r) => r.id}
          minTableWidth={1200}
          freezeColumns={{ left: 1 }}
        />,
      );
      cellsOf("name").forEach((el) =>
        expect(el.className).toContain("sticky"),
      );
      cellsOf("ward").forEach((el) =>
        expect(el.className).not.toContain("sticky"),
      );
    });

    it("right:1 แช่คอลัมน์สุดท้าย", () => {
      render(
        <DataTable
          columns={columns}
          data={rows}
          getRowId={(r) => r.id}
          minTableWidth={1200}
          freezeColumns={{ right: 1 }}
        />,
      );
      cellsOf("note").forEach((el) => expect(el.className).toContain("sticky"));
      cellsOf("name").forEach((el) =>
        expect(el.className).not.toContain("sticky"),
      );
    });

    /* พื้นต้องทึบ ไม่งั้นเนื้อที่เลื่อนอยู่ข้างหลังทะลุขึ้นมา */
    it("เซลล์ที่แช่มีพื้นหลังทึบของตัวเอง และตามสถานะแถวได้", () => {
      render(
        <DataTable
          columns={columns}
          data={rows}
          getRowId={(r) => r.id}
          freezeColumns={{ left: 1 }}
        />,
      );
      const bodyCell = cellsOf("name")[1]!;
      expect(bodyCell.className).toContain("bg-bg-default");
      expect(bodyCell.className).toContain("group-hover/row:bg-bg-subtle");
      expect(bodyCell.className).toContain(
        "group-data-[state=selected]/row:bg-brand-subtle",
      );
      expect(bodyCell.closest("tr")!.className).toContain("group/row");
    });

    /**
     * 🔴 เส้นคั่นเป็น `box-shadow` ไม่ใช่ `border` — ตารางถูกตั้ง
     * `border-collapse: collapse` และเส้นขอบของเซลล์ sticky ไม่ถูกวาดในโหมดนั้น
     * (เส้นเป็นของตาราง ไม่ใช่ของเซลล์) · และมีเงาเฉพาะตัวในสุดของแต่ละฝั่ง
     */
    it("มีเงาเฉพาะคอลัมน์ที่ติดกับเนื้อที่เลื่อน ไม่ใช่ทุกตัวที่แช่", () => {
      render(
        <DataTable
          columns={columns}
          data={rows}
          getRowId={(r) => r.id}
          enableSelection
          minTableWidth={1200}
          freezeColumns={{ left: 1 }}
        />,
      );
      const shadowed = (id: string) =>
        cellsOf(id).every((el) => el.className.includes("shadow-["));
      expect(shadowed("name")).toBe(true);
      expect(shadowed("__select")).toBe(false);
    });

    it("แช่ซ้ายพาช่องติ๊กมาด้วยตอน render จริง", () => {
      render(
        <DataTable
          columns={columns}
          data={rows}
          getRowId={(r) => r.id}
          enableSelection
          minTableWidth={1200}
          freezeColumns={{ left: 1 }}
        />,
      );
      cellsOf("__select").forEach((el) =>
        expect(el.className).toContain("sticky"),
      );
    });

    it("อยู่ร่วมกับการจัดกลุ่มได้ — แถวหัวกลุ่มไม่ถูกแช่", () => {
      render(
        <DataTable
          columns={columns}
          data={rows}
          getRowId={(r) => r.id}
          minTableWidth={1200}
          freezeColumns={{ left: 1 }}
          groupBy={(r) => r.ward}
        />,
      );
      const groupHeads = document.querySelectorAll('th[scope="colgroup"]');
      expect(groupHeads).toHaveLength(2);
      groupHeads.forEach((el) =>
        expect(el.className).not.toContain("sticky"),
      );
      cellsOf("name").forEach((el) =>
        expect(el.className).toContain("sticky"),
      );
    });
  });
});

/* ────────────────────────────────────────────────────────────────────────────
 * เส้นแบ่งของคอลัมน์ที่แช่ต้องลากถึงก้นกล่อง แม้แถวจะไม่เต็ม
 *
 * 🔴 เส้นแบ่งอยู่บน **เซลล์** (box-shadow) ⇒ ยาวได้แค่เท่าที่มีเซลล์ · ตารางที่กรอง
 * แล้วเหลือ 2 แถวในกล่องสูงเต็มจอ เส้นจะหยุดกลางอากาศ อ่านเหมือนตารางถูกตัดครึ่ง
 * ทางแก้คือต่อ "แถวเติมช่องว่าง" ที่ยืดเต็มที่เหลือ แล้วให้มันวาดเส้นต่อ
 *
 * ⚠️ happy-dom ไม่คำนวณเลย์เอาต์ ⇒ พิสูจน์ความสูงจริงไม่ได้ที่นี่
 * เทสนี้ล็อก **โครงสร้าง** ที่พังแล้วเงียบ: แถวมีอยู่จริง · แช่จริง · ไม่หลุดไปหา
 * โปรแกรมอ่านหน้าจอ · และไม่โผล่ในสถานะที่ไม่ควรมี
 * ──────────────────────────────────────────────────────────────────────────── */
describe("แถวเติมช่องว่างท้ายตารางที่มีคอลัมน์แช่", () => {
  const filler = () => document.querySelector("tbody tr[aria-hidden]");

  it("มีแถวเติมช่องว่างที่แช่คอลัมน์เดียวกับแถวข้อมูล", () => {
    render(
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(r) => r.id}
        minTableWidth={1200}
        freezeColumns={{ left: 1 }}
      />,
    );
    const row = filler();
    expect(row).not.toBeNull();
    const cell = row!.querySelector('[data-col-id="name"]');
    expect(cell?.className).toContain("sticky");
  });

  it("ไม่มีเมื่อไม่ได้สั่งแช่คอลัมน์ — ตารางปกติไม่ต้องแบกแถวเปล่า", () => {
    render(<DataTable columns={columns} data={rows} getRowId={(r) => r.id} />);
    expect(filler()).toBeNull();
  });

  it("ไม่มีตอนตารางว่าง — สถานะว่างกินพื้นที่เต็มด้วยตัวเองอยู่แล้ว", () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        getRowId={(r) => r.id}
        freezeColumns={{ left: 1 }}
      />,
    );
    expect(filler()).toBeNull();
  });

  it("กล่องชั้นในถูกดันให้สูงเต็ม — ไม่งั้นแถวเติมไม่มีที่ให้ยืด", () => {
    /* 🔴 เจอตอนวัดจริง: ใส่ `h-full` ที่ `<table>` อย่างเดียวไม่พอ เพราะ `Table` ห่อตัวเอง
     * ด้วย div อีกชั้นที่สูงตามเนื้อหา ⇒ `h-full` resolve เป็น auto = ไม่ยืด
     * (ก้นตาราง 586 · ก้นกล่อง 692 — ห่าง 106px ที่ยังไม่มีเส้น) */
    render(
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(r) => r.id}
        freezeColumns={{ left: 1 }}
      />,
    );
    const wrapper = document.querySelector("table")?.parentElement;
    expect(wrapper?.parentElement?.className).toContain("[&>div]:h-full");
    expect(document.querySelector("table")?.className).toContain("h-full");
  });

  it("แถวข้อมูลตัวสุดท้ายยังไม่มีเส้นใต้ แม้จะไม่ใช่ตัวสุดท้ายในตารางแล้ว", () => {
    render(
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(r) => r.id}
        minTableWidth={1200}
        freezeColumns={{ left: 1 }}
      />,
    );
    expect(document.querySelector("tbody")?.className).toContain(
      "[&_tr:nth-last-child(2)]:border-b-0",
    );
  });
});
