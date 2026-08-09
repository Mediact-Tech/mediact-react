import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";

type Person = { id: string; name: string; partTime: boolean };

const people: Person[] = [
  { id: "1", name: "ศุกร์", partTime: false },
  { id: "2", name: "ดารา", partTime: true },
  { id: "3", name: "เอมมี่", partTime: false },
  { id: "4", name: "บีบี้", partTime: false },
];

const columns: ColumnDef<Person, any>[] = [
  { accessorKey: "name", header: "ชื่อ" },
  { accessorKey: "id", header: "รหัส" },
];

const getRowId = (p: Person) => p.id;
const groupBy = (p: Person) => (p.partTime ? "partTime" : "fullTime");

/** แถวหัวกลุ่ม = `<th scope="colgroup">` — เป็นตัวเดียวในตารางที่มี scope นี้ */
const groupHeadings = () =>
  Array.from(document.querySelectorAll('th[scope="colgroup"]'));

/** ปุ่มพับของกลุ่มแรก */
const toggleBtn = () =>
  screen.getAllByRole("button", { name: /toggle group/i })[0]!;

function renderGrouped(props: Record<string, unknown> = {}) {
  return render(
    <DataTable
      columns={columns}
      data={people}
      getRowId={getRowId}
      groupBy={groupBy}
      {...props}
    />,
  );
}

describe("DataTable — จัดกลุ่ม", () => {
  describe("การแบ่งกลุ่ม", () => {
    it("แบ่งเป็นกลุ่มใต้หัวตารางชุดเดียว ไม่ใช่หัวซ้ำ 2 ชุด", () => {
      renderGrouped();
      /* หัวคอลัมน์จริงต้องมีชุดเดียว — ของจริงฝั่ง roster ทำเป็น 2 ตารางหัวซ้ำ */
      expect(screen.getAllByText("ชื่อ")).toHaveLength(1);
      expect(groupHeadings()).toHaveLength(2);
    });

    it("ป้ายเริ่มต้นเป็น `คีย์ (จำนวน)`", () => {
      renderGrouped();
      expect(screen.getByText("fullTime (3)")).toBeInTheDocument();
      expect(screen.getByText("partTime (1)")).toBeInTheDocument();
    });

    it("แถวยังอยู่ครบทุกแถวหลังแบ่งกลุ่ม", () => {
      renderGrouped();
      people.forEach((p) =>
        expect(screen.getByText(p.name)).toBeInTheDocument(),
      );
    });

    it("ลำดับกลุ่มเริ่มต้น = ลำดับที่เจอครั้งแรกในข้อมูล", () => {
      renderGrouped();
      expect(groupHeadings().map((el) => el.textContent)).toEqual([
        "fullTime (3)",
        "partTime (1)",
      ]);
    });

    it("`groupOrder` บังคับลำดับได้", () => {
      renderGrouped({ groupOrder: ["partTime", "fullTime"] });
      expect(groupHeadings().map((el) => el.textContent)).toEqual([
        "partTime (1)",
        "fullTime (3)",
      ]);
    });

    /* ทิ้งกลุ่มที่ไม่อยู่ใน groupOrder = แถวหายจากจอโดยไม่มีใครรู้ */
    it("กลุ่มที่ไม่อยู่ใน `groupOrder` ต่อท้าย ไม่ถูกทิ้ง", () => {
      renderGrouped({ groupOrder: ["partTime"] });
      expect(groupHeadings()).toHaveLength(2);
      expect(screen.getByText("fullTime (3)")).toBeInTheDocument();
    });

    it("แถวที่ `groupBy` คืน null อยู่บนสุดและไม่มีแถวหัว", () => {
      render(
        <DataTable
          columns={columns}
          data={people}
          getRowId={getRowId}
          groupBy={(p) => (p.partTime ? "partTime" : null)}
        />,
      );
      expect(groupHeadings()).toHaveLength(1);
      const rows = screen.getAllByRole("row");
      /* [หัวตาราง, ประจำ×3, หัวกลุ่ม partTime, ดารา] */
      expect(within(rows[1]!).getByText("ศุกร์")).toBeInTheDocument();
      expect(rows[4]!.querySelector('th[scope="colgroup"]')).not.toBeNull();
    });

    it("ไม่ส่ง `groupBy` = ไม่มีแถวหัวกลุ่มเลย", () => {
      render(
        <DataTable columns={columns} data={people} getRowId={getRowId} />,
      );
      expect(groupHeadings()).toHaveLength(0);
    });
  });

  describe("ป้ายกลุ่ม", () => {
    it("`groupLabel` ได้ทั้งคีย์ จำนวน ลำดับ และแถวจริง", () => {
      const seen: unknown[] = [];
      renderGrouped({
        groupLabel: (ctx: any) => {
          seen.push({
            key: ctx.key,
            count: ctx.count,
            index: ctx.index,
            names: ctx.rows.map((r: Person) => r.name),
          });
          return `กลุ่ม ${ctx.key}`;
        },
      });
      expect(seen).toEqual([
        {
          key: "fullTime",
          count: 3,
          index: 0,
          names: ["ศุกร์", "เอมมี่", "บีบี้"],
        },
        { key: "partTime", count: 1, index: 1, names: ["ดารา"] },
      ]);
      expect(screen.getByText("กลุ่ม fullTime")).toBeInTheDocument();
    });

    it("`groupLabel` คืน element ได้ (จุดสีเป็นของผู้เรียก)", () => {
      renderGrouped({
        groupLabel: ({ key }: { key: string }) => (
          <span data-testid={`dot-${key}`}>●</span>
        ),
      });
      expect(screen.getByTestId("dot-fullTime")).toBeInTheDocument();
    });
  });

  describe("colSpan", () => {
    /* 🔴 ของจริงเขียนเลขตายตัวทั้ง 5 หน้า — เพิ่มคอลัมน์แล้วแถบสั้นกว่าตารางเงียบ ๆ */
    it("กินความกว้างเท่าจำนวนคอลัมน์ที่มองเห็นจริง", () => {
      renderGrouped();
      groupHeadings().forEach((el) =>
        expect(el.getAttribute("colspan")).toBe("2"),
      );
    });

    it("เปิดช่องติ๊กเลือกแล้ว colSpan นับคอลัมน์นั้นด้วย", () => {
      renderGrouped({ enableSelection: true });
      groupHeadings().forEach((el) =>
        expect(el.getAttribute("colspan")).toBe("3"),
      );
    });

    it("เพิ่มคอลัมน์แล้ว colSpan ขยับตามเอง", () => {
      render(
        <DataTable
          columns={[...columns, { accessorKey: "partTime", header: "ประเภท" }]}
          data={people}
          getRowId={getRowId}
          groupBy={groupBy}
        />,
      );
      groupHeadings().forEach((el) =>
        expect(el.getAttribute("colspan")).toBe("3"),
      );
    });
  });

  describe("พับกลุ่ม", () => {
    it("ไม่เปิด `collapsibleGroups` = ไม่มีปุ่มพับ", () => {
      renderGrouped();
      expect(screen.queryByRole("button", { name: /toggle group/i })).toBeNull();
    });

    it("กดแล้วซ่อนแถวของกลุ่มนั้น กลุ่มอื่นไม่กระทบ", async () => {
      const user = userEvent.setup();
      renderGrouped({ collapsibleGroups: true });
      await user.click(toggleBtn());
      expect(screen.queryByText("ศุกร์")).toBeNull();
      expect(screen.getByText("ดารา")).toBeInTheDocument();
      /* หัวกลุ่มยังอยู่ ไม่งั้นกางกลับไม่ได้ */
      expect(screen.getByText("fullTime (3)")).toBeInTheDocument();
    });

    it("`defaultCollapsedGroups` พับไว้ตั้งแต่แรก", () => {
      renderGrouped({
        collapsibleGroups: true,
        defaultCollapsedGroups: ["partTime"],
      });
      expect(screen.queryByText("ดารา")).toBeNull();
      expect(screen.getByText("ศุกร์")).toBeInTheDocument();
    });

    it("aria-expanded บอกสถานะจริง", async () => {
      const user = userEvent.setup();
      renderGrouped({ collapsibleGroups: true });
      const btn = toggleBtn();
      expect(btn).toHaveAttribute("aria-expanded", "true");
      await user.click(btn);
      expect(btn).toHaveAttribute("aria-expanded", "false");
    });

    it("แบบ controlled ไม่ขยับเอง รอ callback", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderGrouped({
        collapsibleGroups: true,
        collapsedGroups: [],
        onCollapsedGroupsChange: onChange,
      });
      await user.click(toggleBtn());
      expect(onChange).toHaveBeenCalledWith(["fullTime"]);
      expect(screen.getByText("ศุกร์")).toBeInTheDocument();
    });

    /* พับ = ซ่อนชั่วคราว ไม่ใช่ถอนสิ่งที่ผู้ใช้เลือกไว้ */
    it("พับกลุ่มแล้วแถวที่เลือกไว้ยังถูกนับอยู่", async () => {
      const user = userEvent.setup();
      renderGrouped({ enableSelection: true, collapsibleGroups: true });
      const rowBoxes = screen.getAllByRole("checkbox").slice(1);
      await user.click(rowBoxes[0]!);
      expect(screen.getByText("1 selected")).toBeInTheDocument();
      await user.click(toggleBtn());
      expect(screen.getByText("1 selected")).toBeInTheDocument();
    });
  });

  describe("อยู่ร่วมกับความสามารถอื่น", () => {
    it("ว่างเปล่า = สถานะว่าง ไม่ใช่หัวกลุ่มลอย", () => {
      render(
        <DataTable
          columns={columns}
          data={[]}
          getRowId={getRowId}
          groupBy={groupBy}
        />,
      );
      expect(groupHeadings()).toHaveLength(0);
      expect(screen.getByText(/no data/i)).toBeInTheDocument();
    });

    it("error ชนะการจัดกลุ่ม", () => {
      renderGrouped({ error: true });
      expect(groupHeadings()).toHaveLength(0);
    });

    it("isLoading ชนะการจัดกลุ่ม", () => {
      renderGrouped({ isLoading: true });
      expect(groupHeadings()).toHaveLength(0);
    });

    /* จัดกลุ่มหลัง**เรียง**เสมอ ไม่งั้นกลุ่มไม่ตรงกับที่ตารางกำลังแสดง */
    it("เรียงแล้วค่อยจัดกลุ่ม — ลำดับในกลุ่มเปลี่ยนตามการเรียง", async () => {
      const user = userEvent.setup();
      renderGrouped();
      /** ชื่อของแถวถัดจากหัวกลุ่มประจำ */
      const firstOfFullTime = () =>
        screen.getByText(/^fullTime/).closest("tr")!.nextElementSibling!
          .textContent;

      expect(firstOfFullTime()).toContain("ศุกร์");
      await user.click(screen.getByRole("button", { name: /ชื่อ/ }));
      /* เรียง ก→ฮ แล้ว บีบี้ มาก่อน — ถ้าจัดกลุ่มก่อนเรียง แถวแรกจะยังเป็นศุกร์ */
      expect(firstOfFullTime()).toContain("บีบี้");
    });

    it("ติ๊กเลือกทำงานปกติเมื่อจัดกลุ่ม", async () => {
      const user = userEvent.setup();
      renderGrouped({ enableSelection: true });
      await user.click(screen.getAllByRole("checkbox")[0]!);
      expect(screen.getByText("4 selected")).toBeInTheDocument();
    });

    /**
     * 🔴 กลุ่มท้ายที่ถูกพับ = แถวหัวกลุ่มกลายเป็น `<tr>` สุดท้ายของ `<tbody>`
     *
     * เดิม `TableBody` ใช้ `[&_tr:last-child]:border-0` ซึ่งลบเส้น**ทุกด้าน**
     * ⇒ แถวนั้นเสียเส้นบนไปด้วยแล้วกลืนกับแถวข้างบนสนิท (วัดในเบราว์เซอร์ได้
     * `border-top-width: 0px` และแถวเตี้ยลง 0.5px เทียบกับหัวกลุ่มตัวอื่น)
     *
     * ⚠️ ยืนยันความสูงจริงในเทสนี้ไม่ได้ — happy-dom ไม่คำนวณ layout
     * เทสนี้ล็อกได้แค่ "เจตนาที่เขียนไว้เป็น `border-b-0`" · ของจริงพิสูจน์ใน Storybook
     */
    it("tbody ลบเฉพาะเส้นใต้ของแถวสุดท้าย ไม่ใช่ทุกด้าน", () => {
      renderGrouped({ collapsibleGroups: true, defaultCollapsedGroups: ["partTime"] });
      const tbody = document.querySelector("tbody")!;
      expect(tbody.className).toContain("[&_tr:last-child]:border-b-0");
      expect(tbody.className).not.toContain("[&_tr:last-child]:border-0");
    });

    it("`onRowClick` ได้ลำดับตามที่เห็นบนจอ", async () => {
      const user = userEvent.setup();
      const onRowClick = vi.fn();
      renderGrouped({ onRowClick, groupOrder: ["partTime", "fullTime"] });
      await user.click(screen.getByText("ศุกร์"));
      /* ดาราอยู่กลุ่มบน ⇒ ศุกร์เป็นแถวที่ 2 บนจอ (index 1) */
      expect(onRowClick).toHaveBeenCalledWith(people[0], 1);
    });
  });
});
