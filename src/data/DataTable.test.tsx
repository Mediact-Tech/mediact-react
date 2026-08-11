import { describe, it, expect, vi } from "vitest";
import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type {
  ColumnDef,
  SortingState,
  RowSelectionState,
} from "@tanstack/react-table";
import { DataTable } from "./DataTable";

type Req = { id: string; name: string; status: "PENDING" | "APPROVED" };

const rows: Req[] = [
  { id: "1", name: "ศุกร์", status: "PENDING" },
  { id: "2", name: "เอมมี่", status: "APPROVED" },
  { id: "3", name: "บีบี้", status: "PENDING" },
];

const columns: ColumnDef<Req, any>[] = [
  { accessorKey: "name", header: "ชื่อ" },
  { accessorKey: "status", header: "สถานะ" },
];

const getRowId = (r: Req) => r.id;

/** ช่องติ๊กทั้งหมดในตาราง — ตัวแรกคือ select-all บนหัวตาราง */
const boxes = () => screen.getAllByRole("checkbox");

describe("DataTable", () => {
  describe("พื้นฐาน", () => {
    it("render หัวตารางและแถวครบ", () => {
      render(<DataTable columns={columns} data={rows} getRowId={getRowId} />);
      expect(screen.getByText("ชื่อ")).toBeInTheDocument();
      expect(screen.getAllByRole("row")).toHaveLength(rows.length + 1);
    });

    it("ไม่มีข้อมูล = โชว์สถานะว่าง ไม่ใช่ตารางเปล่า", () => {
      render(<DataTable columns={columns} data={[]} getRowId={getRowId} />);
      expect(screen.getByText(/no data|ไม่พบ/i)).toBeInTheDocument();
    });

    it("error ชนะสถานะว่าง และมีปุ่มลองใหม่", async () => {
      const user = userEvent.setup();
      const onRetry = vi.fn();
      render(
        <DataTable
          columns={columns}
          data={[]}
          error
          onRetry={onRetry}
          getRowId={getRowId}
        />,
      );
      await user.click(screen.getByRole("button", { name: /retry/i }));
      expect(onRetry).toHaveBeenCalled();
    });

    /* ⚠️ isLoading ต้องชนะ error — refetch เบื้องหลังไม่ควรวาบ error เก่าให้เห็น */
    it("isLoading ชนะ error", () => {
      render(
        <DataTable columns={columns} data={[]} error isLoading getRowId={getRowId} />,
      );
      expect(screen.queryByRole("button", { name: /retry/i })).toBeNull();
    });
  });

  describe("วาดสถานะว่าง/ผิดพลาดเอง", () => {
    it("renderEmpty ชนะ empty และรู้ว่ากำลังกรองอยู่", () => {
      render(
        <DataTable
          columns={columns}
          data={[]}
          getRowId={getRowId}
          isFiltered
          empty={<div>ของเดิม</div>}
          renderEmpty={({ isFiltered }) => (
            <div>{isFiltered ? "ไม่พบผลลัพธ์" : "ยังไม่มีรายการ"}</div>
          )}
        />,
      );
      expect(screen.getByText("ไม่พบผลลัพธ์")).toBeInTheDocument();
      expect(screen.queryByText("ของเดิม")).toBeNull();
    });

    /* ⚠️ ไม่บอกว่ากำลังกรอง = ต้องได้ข้อความ "ยังไม่มีรายการ" ไม่ใช่ "ไม่พบผลลัพธ์"
     * บอกให้ผู้ใช้ไปสร้างใหม่ทั้งที่เขาแค่กรองผิด = ทางที่ทำให้เขาสร้างข้อมูลซ้ำ */
    it("ไม่ส่ง isFiltered = ถือว่ายังไม่มีข้อมูลเลย", () => {
      render(
        <DataTable
          columns={columns}
          data={[]}
          getRowId={getRowId}
          renderEmpty={({ isFiltered }) => (
            <div>{isFiltered ? "ไม่พบผลลัพธ์" : "ยังไม่มีรายการ"}</div>
          )}
        />,
      );
      expect(screen.getByText("ยังไม่มีรายการ")).toBeInTheDocument();
    });

    it("renderError ได้ตัว error กับปุ่มลองใหม่ส่งมาให้", async () => {
      const user = userEvent.setup();
      const onRetry = vi.fn();
      const err = new Error("พัง");
      render(
        <DataTable
          columns={columns}
          data={[]}
          getRowId={getRowId}
          error={err}
          onRetry={onRetry}
          errorSlot={<div>ของเดิม</div>}
          renderError={({ error, retry }) => (
            <button type="button" onClick={retry}>
              {(error as Error).message}
            </button>
          )}
        />,
      );
      expect(screen.queryByText("ของเดิม")).toBeNull();
      await user.click(screen.getByRole("button", { name: "พัง" }));
      expect(onRetry).toHaveBeenCalled();
    });

    it("ไม่ส่ง render prop = ใช้ของเดิมตามเดิม", () => {
      render(
        <DataTable
          columns={columns}
          data={[]}
          getRowId={getRowId}
          empty={<div>ของเดิม</div>}
        />,
      );
      expect(screen.getByText("ของเดิม")).toBeInTheDocument();
    });
  });

  /* 🔴 ของจริงบน Mediwork ติ๊กได้เฉพาะใบที่ยัง "รออนุมัติ" — 6 ฟีเจอร์ทำเรื่องนี้เอง */
  describe("ติ๊กได้เฉพาะบางแถว", () => {
    const selectable = {
      columns,
      data: rows,
      getRowId,
      enableSelection: true,
      isRowSelectable: (r: Req) => r.status === "PENDING",
    };

    it("แถวที่ติ๊กไม่ได้ถูกปิดช่องติ๊ก", () => {
      render(<DataTable {...selectable} />);
      const [, first, second, third] = boxes();
      expect(first).toBeEnabled();
      expect(second).toBeDisabled(); // APPROVED
      expect(third).toBeEnabled();
    });

    it("select-all ติ๊กเฉพาะแถวที่ติ๊กได้", async () => {
      const user = userEvent.setup();
      render(<DataTable {...selectable} />);
      await user.click(boxes()[0]!);
      expect(screen.getByText(/2 selected/)).toBeInTheDocument();
    });

    /* ถ้า select-all นับจากแถวทั้งหมด หน้าที่มีแถวติ๊กไม่ได้ปนอยู่จะค้างเป็น
     * ขีดกลางตลอดไป ไม่มีทางขึ้นเป็น "เลือกครบ" เลย */
    it("ติ๊กครบทุกตัวที่ติ๊กได้แล้ว หัวตารางขึ้นเป็นเลือกครบ ไม่ใช่ขีดกลาง", async () => {
      const user = userEvent.setup();
      render(<DataTable {...selectable} />);
      await user.click(boxes()[1]!);
      await user.click(boxes()[3]!);
      expect(boxes()[0]).toHaveAttribute("data-state", "checked");
    });

    it("ติ๊กบางส่วน = ขีดกลาง", async () => {
      const user = userEvent.setup();
      render(<DataTable {...selectable} />);
      await user.click(boxes()[1]!);
      expect(boxes()[0]).toHaveAttribute("data-state", "indeterminate");
    });

    it("ไม่มีแถวไหนติ๊กได้เลย = ปิด select-all", () => {
      render(
        <DataTable
          {...selectable}
          data={[{ id: "9", name: "x", status: "APPROVED" }]}
        />,
      );
      expect(boxes()[0]).toBeDisabled();
    });

    it("ไม่ส่ง isRowSelectable = ติ๊กได้ทุกแถว", async () => {
      const user = userEvent.setup();
      render(
        <DataTable columns={columns} data={rows} getRowId={getRowId} enableSelection />,
      );
      await user.click(boxes()[0]!);
      expect(screen.getByText(/3 selected/)).toBeInTheDocument();
    });
  });

  /* 🔴 ความสามารถที่ของจริงใช้มากสุด 22/41 ไฟล์ — และต้องเป็น "ขั้นต่ำ" ไม่ใช่ "เป๊ะ"
   * เพราะของจริงเขียน minWidth ทุกที่ ⇒ คอลัมน์ต้องขยายได้เมื่อตารางกว้างขึ้น */
  describe("ความกว้างคอลัมน์", () => {
    it("size ตีเป็น min-width ไม่ใช่ width", () => {
      render(
        <DataTable
          columns={[{ accessorKey: "name", header: "ชื่อ", size: 200 }]}
          data={rows}
          getRowId={getRowId}
        />,
      );
      const th = screen.getByText("ชื่อ").closest("th")!;
      expect(th.style.minWidth).toBe("200px");
      expect(th.style.width).toBe("");
    });

    it("ไม่ส่ง size = ไม่ตั้งความกว้างอะไรเลย", () => {
      render(<DataTable columns={columns} data={rows} getRowId={getRowId} />);
      const th = screen.getByText("ชื่อ").closest("th")!;
      expect(th.style.minWidth).toBe("");
    });
  });

  describe("ความกว้างขั้นต่ำของตาราง", () => {
    it("minTableWidth ตั้งที่ตารางและเปิดการเลื่อนแนวนอน", () => {
      const { container } = render(
        <DataTable
          columns={columns}
          data={rows}
          getRowId={getRowId}
          minTableWidth={900}
        />,
      );
      const table = container.querySelector("table")!;
      expect(table.style.minWidth).toBe("900px");
      expect(table.parentElement?.className).toContain("overflow-auto");
    });

    it("ไม่ส่ง = ไม่เปิดการเลื่อน", () => {
      const { container } = render(
        <DataTable columns={columns} data={rows} getRowId={getRowId} />,
      );
      expect(container.querySelector("table")?.style.minWidth).toBe("");
    });
  });

  describe("เรียงคอลัมน์", () => {
    it("กดหัวตารางแล้วเรียงข้อมูล", async () => {
      const user = userEvent.setup();
      render(<DataTable columns={columns} data={rows} getRowId={getRowId} />);
      await user.click(screen.getByRole("button", { name: /ชื่อ/ }));
      const cells = screen.getAllByRole("row").slice(1);
      expect(within(cells[0]!).getByText("บีบี้")).toBeInTheDocument();
    });

    it("manualSorting = ไม่เรียงเอง ปล่อยให้หลังบ้านเรียง", async () => {
      const user = userEvent.setup();
      const onSortingChange = vi.fn();
      render(
        <DataTable
          columns={columns}
          data={rows}
          getRowId={getRowId}
          manualSorting
          sorting={[]}
          onSortingChange={onSortingChange}
        />,
      );
      await user.click(screen.getByRole("button", { name: /ชื่อ/ }));
      expect(onSortingChange).toHaveBeenCalled();
      const cells = screen.getAllByRole("row").slice(1);
      expect(within(cells[0]!).getByText("ศุกร์")).toBeInTheDocument();
    });

    /**
     * 🔴 **`onSortingChange` ต้องส่ง `SortingState` ไม่ใช่ฟังก์ชัน**
     *
     * TanStack เรียก callback ด้วย updater `(old) => next` เสมอ — ซึ่งพอเอาไปต่อกับ
     * `queryKey` ของ react-query หรือ URL state จะได้**ฟังก์ชันไปใส่แทนค่า**
     * แล้วพังแบบเงียบ (key ไม่เปลี่ยน จึงไม่ refetch · ไม่มี error ให้เห็น)
     *
     * เทสนี้จับ "ชนิดของสิ่งที่ส่งออกไป" ไม่ใช่แค่ "ถูกเรียกไหม" — ของเดิมเช็คแค่
     * `toHaveBeenCalled()` ซึ่งผ่านทั้งที่ผู้เรียกใช้ค่านั้นต่อไม่ได้
     */
    it("onSortingChange ส่งค่า ไม่ใช่ฟังก์ชัน — เอาไปเป็น queryKey ได้ทันที", async () => {
      const user = userEvent.setup();
      const seen: unknown[] = [];
      function Harness() {
        const [sorting, setSorting] = React.useState<SortingState>([]);
        return (
          <DataTable
            columns={columns}
            data={rows}
            getRowId={getRowId}
            manualSorting
            sorting={sorting}
            onSortingChange={(s) => {
              seen.push(s);
              setSorting(s);
            }}
          />
        );
      }
      render(<Harness />);
      const btn = screen.getByRole("button", { name: /ชื่อ/ });
      await user.click(btn);
      await user.click(btn);
      await user.click(btn);
      expect(seen.every((s) => typeof s !== "function")).toBe(true);
      /* วนครบ 3 จังหวะ: น้อย→มาก · มาก→น้อย · เลิกเรียง */
      expect(seen).toEqual([
        [{ id: "name", desc: false }],
        [{ id: "name", desc: true }],
        [],
      ]);
    });

    it("onRowSelectionChange ส่งค่า ไม่ใช่ฟังก์ชัน", async () => {
      const user = userEvent.setup();
      const seen: unknown[] = [];
      function Harness() {
        const [sel, setSel] = React.useState<RowSelectionState>({});
        return (
          <DataTable
            columns={columns}
            data={rows}
            getRowId={getRowId}
            enableSelection
            rowSelection={sel}
            onRowSelectionChange={(s) => {
              seen.push(s);
              setSel(s);
            }}
          />
        );
      }
      render(<Harness />);
      await user.click(screen.getAllByRole("checkbox")[1]!);
      expect(seen).toEqual([{ "1": true }]);
    });

    /* ไม่ส่ง callback = ตารางเก็บสถานะเอง — การคลี่ updater ต้องไม่ทำให้ขาดนี้พัง */
    it("ไม่ส่ง callback ตารางยังเรียงเองได้ครบ 3 จังหวะ", async () => {
      const user = userEvent.setup();
      render(<DataTable columns={columns} data={rows} getRowId={getRowId} />);
      const btn = screen.getByRole("button", { name: /ชื่อ/ });
      const firstName = () =>
        screen.getAllByRole("row")[1]!.textContent;
      await user.click(btn);
      expect(firstName()).toContain("บีบี้");
      await user.click(btn);
      expect(firstName()).toContain("เอมมี่");
      await user.click(btn);
      expect(firstName()).toContain("ศุกร์");
    });
  });

  describe("แบ่งหน้า", () => {
    const pagination = {
      pageIndex: 0,
      pageSize: 10,
      rowCount: 53,
      onPageChange: vi.fn(),
    };

    it("แสดงช่วงแถวและจำนวนทั้งหมด", () => {
      render(
        <DataTable
          columns={columns}
          data={rows}
          getRowId={getRowId}
          pagination={pagination}
        />,
      );
      expect(screen.getByText(/53/)).toBeInTheDocument();
    });

    /* 🔴 แถบแบ่งหน้าต้องอยู่ **นอก**การ์ดที่มีขอบ — ทรงเดียวกับ `ActionTabel`
     * ของ Portal (กล่องนอก `flex flex-col gap-4` · การ์ดกับแถบเป็นพี่น้องกัน)
     * ของเดิมเอาไปไว้ในการ์ดแล้วขีด `border-t` คั่น ซึ่งไม่ตรงกับที่ไหน
     *
     * happy-dom ไม่คำนวณเลย์เอาต์ ⇒ ที่ล็อกได้คือ **ความเป็นพ่อลูกใน DOM**
     * ซึ่งพอดีเป็นสิ่งที่ถ้าใครย้ายกลับเข้าไปจะพังตรงนี้ทันที */
    const borderedCard = (container: HTMLElement) =>
      container.querySelector('[class*="border-divider-gray"]')!;

    /* ⚠️ อย่าไล่หาแถบด้วย `closest("div")` — รอบแรกเขียนแบบนั้นแล้วไปโดน div
     * ชั้นในที่ไม่มีวันมี `border-t` อยู่แล้ว ⇒ ยืนยันผ่านโดยไม่ได้พิสูจน์อะไร
     * (ลองใส่ `border-t` กลับเข้าไปแล้วเทสยังเขียว) · เกาะ `data-slot` แทน */
    const slot = (container: HTMLElement, name: string) =>
      container.querySelector<HTMLElement>(`[data-slot="${name}"]`)!;

    it("แถบแบ่งหน้าอยู่นอกการ์ดที่มีขอบ", () => {
      const { container } = render(
        <DataTable
          columns={columns}
          data={rows}
          getRowId={getRowId}
          pagination={pagination}
        />,
      );
      const bar = slot(container, "pagination");
      const card = borderedCard(container);
      expect(bar).toBeInTheDocument();
      expect(card).toBeInTheDocument();
      expect(card.contains(bar)).toBe(false);
      /* และต้องไม่มีเส้นคั่นของตัวเอง — ระยะห่างมาจาก `gap` ของกล่องนอก */
      expect(bar.className).not.toContain("border-t");
    });

    it("ตัวนับที่เลือก (ตอนไม่มีแบ่งหน้า) อยู่นอกการ์ดเหมือนกัน", () => {
      /* สองอันนี้สลับที่กัน — ถ้าอยู่คนละที่ ตารางจะขยับตอนเปลี่ยนโหมด */
      const { container } = render(
        <DataTable
          columns={columns}
          data={rows}
          getRowId={getRowId}
          enableSelection
          rowSelection={{ "1": true }}
          onRowSelectionChange={vi.fn()}
        />,
      );
      const bar = slot(container, "selected-count");
      expect(bar).toBeInTheDocument();
      expect(bar).toHaveTextContent(/1 selected/);
      expect(borderedCard(container).contains(bar)).toBe(false);
      expect(bar.className).not.toContain("border-t");
    });

    it("ปุ่มย้อนกลับถูกปิดที่หน้าแรก", () => {
      render(
        <DataTable
          columns={columns}
          data={rows}
          getRowId={getRowId}
          pagination={pagination}
        />,
      );
      expect(screen.getByRole("button", { name: /prev/i })).toBeDisabled();
    });

    /* 🔴 แถบแบ่งหน้าเคยสูง 73px เพราะ `Select` จองบรรทัดข้อความไว้ใต้ช่อง
     * ซึ่งในแถบเครื่องมือไม่มี error มาแสดงอยู่แล้ว — ของจริงบน Portal ใช้ 32px */
    it("ตัวเลือกจำนวนแถวไม่จองบรรทัดข้อความ", () => {
      const { container } = render(
        <DataTable
          columns={columns}
          data={rows}
          getRowId={getRowId}
          pagination={{ ...pagination, onPageSizeChange: vi.fn() }}
        />,
      );
      const footer = container.firstElementChild!.lastElementChild!;
      // ไม่มี <p class="text-caption"> ที่เป็นที่ว่างของ error
      expect(footer.querySelector("p.text-caption")).toBeNull();
    });

    it("แถบตัดบรรทัดได้ กันล้นตอนจอแคบ", () => {
      const { container } = render(
        <DataTable
          columns={columns}
          data={rows}
          getRowId={getRowId}
          pagination={{ ...pagination, onPageSizeChange: vi.fn() }}
        />,
      );
      const footer = container.firstElementChild!.lastElementChild!;
      expect(footer.className).toContain("flex-wrap");
    });

    /**
     * ปุ่มเปลี่ยนหน้าเป็น**ไอคอนล้วน** ตามของจริงบน Portal
     *
     * 🔴 ไอคอนล้วนแปลว่าไม่มีข้อความให้โปรแกรมอ่านหน้าจออ่าน — ถ้าไม่มี `aria-label`
     * มันจะประกาศว่า "ปุ่ม" เฉย ๆ ทั้งสองปุ่ม แล้วผู้ใช้แยกไม่ออกว่าอันไหนไปหน้าไหน
     */
    it("ปุ่มเปลี่ยนหน้าไม่มีข้อความ แต่ต้องมีชื่อให้โปรแกรมอ่านหน้าจอ", () => {
      render(
        <DataTable
          columns={columns}
          data={rows}
          getRowId={getRowId}
          pagination={pagination}
        />,
      );
      const prev = screen.getByRole("button", { name: /previous page/i });
      const next = screen.getByRole("button", { name: /next page/i });
      expect(prev.textContent).toBe("");
      expect(next.textContent).toBe("");
    });

    it("labels.prev/next ที่เป็นข้อความถูกใช้เป็นชื่อของปุ่มไอคอน", () => {
      render(
        <DataTable
          columns={columns}
          data={rows}
          getRowId={getRowId}
          pagination={pagination}
          labels={{ prev: "ก่อนหน้า", next: "ถัดไป" }}
        />,
      );
      expect(screen.getByRole("button", { name: "ก่อนหน้า" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "ถัดไป" })).toBeInTheDocument();
    });

    it("กดหน้าถัดไปแล้วเรียก onPageChange ด้วยเลขหน้าถัดไป", async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(
        <DataTable
          columns={columns}
          data={rows}
          getRowId={getRowId}
          pagination={{ ...pagination, onPageChange }}
        />,
      );
      await user.click(screen.getByRole("button", { name: /next/i }));
      expect(onPageChange).toHaveBeenCalledWith(1);
    });
  });

  describe("กดทั้งแถว", () => {
    it("เรียก onRowClick พร้อมข้อมูลแถว", async () => {
      const user = userEvent.setup();
      const onRowClick = vi.fn();
      render(
        <DataTable
          columns={columns}
          data={rows}
          getRowId={getRowId}
          onRowClick={onRowClick}
        />,
      );
      await user.click(screen.getByText("เอมมี่"));
      expect(onRowClick).toHaveBeenCalledWith(rows[1], 1);
    });

    /* ติ๊ก checkbox ต้องไม่ทำให้แถวถูกกดไปด้วย */
    it("ติ๊กช่องเลือกไม่ทำให้แถวถูกกด", async () => {
      const user = userEvent.setup();
      const onRowClick = vi.fn();
      render(
        <DataTable
          columns={columns}
          data={rows}
          getRowId={getRowId}
          enableSelection
          onRowClick={onRowClick}
        />,
      );
      await user.click(boxes()[1]!);
      expect(onRowClick).not.toHaveBeenCalled();
    });
  });
});

/* ────────────────────────────────────────────────────────────────────────────
 * ข้อความทุกตัวต้องแทนที่ได้จากฝั่งแอป
 *
 * 🔴 DS ไม่มี i18n อยู่ในตัว และไม่ควรมี — คำแปลเป็นของแอป
 * เทสชุดนี้จับ "คำอังกฤษของ DS ที่หลุดขึ้นจอทั้งที่แอปส่งคำแปลมาครบแล้ว"
 * ซึ่งเป็นความผิดพลาดที่มองด้วยตาไม่เห็น เพราะจอส่วนใหญ่เป็นภาษาไทยอยู่แล้ว
 * แล้วมีคำอังกฤษโผล่เฉพาะสถานะที่ไม่ค่อยเกิด (ว่าง · ผิดพลาด · aria-label)
 * ──────────────────────────────────────────────────────────────────────────── */

/** ทุกคำที่ DS เป็นเจ้าของ — เพิ่มคำใหม่ในโค้ดแล้วต้องเพิ่มที่นี่ด้วย */
const DS_DEFAULT_COPY = [
  "Select all",
  "Select row",
  "Something went wrong",
  "We couldn't load this data.",
  "Retry",
  "Previous page",
  "Next page",
  "Rows per page",
  "Toggle group",
  "No data",
  "There's nothing to show here yet.",
  "selected",
  " of ",
];

const thaiLabels = {
  selectAllAriaLabel: "เลือกทุกแถว",
  selectRowAriaLabel: "เลือกแถวนี้",
  empty: { title: "ยังไม่มีรายการ", description: "กดปุ่มเพิ่มเพื่อเริ่มต้น" },
  error: { title: "เกิดข้อผิดพลาด", description: "โหลดข้อมูลไม่สำเร็จ" },
  retry: "ลองใหม่",
  prev: "หน้าก่อนหน้า",
  next: "หน้าถัดไป",
  rowsPerPage: "จำนวนแถวต่อหน้า:",
  toggleGroup: "พับ/กางกลุ่ม",
  selected: (n: number) => `เลือกแล้ว ${n} รายการ`,
  of: (s: number, e: number, t: number) => `${s}-${e} จาก ${t}`,
};

/** ข้อความบนจอ + ทุก aria-label (คำที่ตาไม่เห็นแต่โปรแกรมอ่านหน้าจออ่าน) */
function visibleAndAssistiveText(root: HTMLElement) {
  const aria = Array.from(root.querySelectorAll("[aria-label]"))
    .map((el) => el.getAttribute("aria-label"))
    .join(" | ");
  return `${root.textContent ?? ""} | ${aria}`;
}

describe("ข้อความทั้งหมดแทนที่ได้จากแอป", () => {
  const pager = {
    pageIndex: 0,
    pageSize: 10,
    rowCount: 53,
    onPageChange: vi.fn(),
    onPageSizeChange: vi.fn(),
  };

  const cases: Array<[string, Record<string, unknown>]> = [
    ["ปกติ + แบ่งหน้า + ติ๊กเลือก", { pagination: pager, enableSelection: true }],
    ["สถานะว่าง", { data: [] }],
    ["สถานะผิดพลาด", { data: [], error: true, onRetry: () => {} }],
    [
      "จัดกลุ่ม + พับได้",
      {
        groupBy: (r: Req) => r.status,
        collapsibleGroups: true,
        groupLabel: ({ key, count }: { key: string; count: number }) =>
          `กลุ่ม ${key} (${count})`,
      },
    ],
  ];

  it.each(cases)("ไม่มีคำอังกฤษของ DS หลุดขึ้นจอ — %s", (_name, extra) => {
    const { container } = render(
      <DataTable
        columns={columns}
        data={rows}
        getRowId={getRowId}
        labels={thaiLabels}
        {...(extra as object)}
      />,
    );
    const text = visibleAndAssistiveText(container);
    const leaked = DS_DEFAULT_COPY.filter((w) => text.includes(w));
    expect(leaked).toEqual([]);
  });

  /* ตาข่ายกลับด้าน: ไม่ส่ง labels ต้องได้อังกฤษจริง ๆ ไม่ใช่ช่องว่าง
   * (เทสข้างบนจะผ่านฟรีถ้าวันหนึ่งข้อความหายไปทั้งหมด) */
  it("ไม่ส่ง labels = ได้ค่าอังกฤษเริ่มต้น ไม่ใช่ว่างเปล่า", () => {
    const { container } = render(
      <DataTable
        columns={columns}
        data={[]}
        getRowId={getRowId}
        pagination={pager}
        enableSelection
      />,
    );
    const text = visibleAndAssistiveText(container);
    ["No data", "Rows per page", "Previous page", "Next page"].forEach((w) =>
      expect(text).toContain(w),
    );
  });
});

/* ────────────────────────────────────────────────────────────────────────────
 * สีตัวอักษรในตารางต้องคงที่ ไม่เปลี่ยนตามแอป
 *
 * 🔴 เดิมเซลล์ข้อมูลใช้ `text-text-primary` ซึ่งใน `theme.css` ถูก alias ไปที่
 * `--color-brand` ⇒ ตัวเลขในตารางเปลี่ยนสีตามแบรนด์ทุกแอป · วัดในเบราว์เซอร์ได้
 *
 *   Portal     rgb(67, 89, 110)    สเลต
 *   Mediwork   rgb(38, 209, 179)   เขียวมิ้นต์สด  ← อ่านยากบนพื้นขาว
 *   Medimatch  rgb(4, 129, 168)    ฟ้า
 *   MediHR     rgb(6, 17, 172)     น้ำเงินเข้ม
 *
 * ข้อมูลในตารางคือ "ข้อมูล" ไม่ใช่องค์ประกอบของแบรนด์ — ต้องอ่านง่ายเท่ากันทุกแอป
 *
 * ⚠️ happy-dom ไม่คำนวณสี ⇒ เทสนี้ล็อกได้แค่ชื่อ token ที่เขียนไว้
 * ค่าจริงพิสูจน์ใน Storybook (ทั้ง 4 ธีมต้องได้ค่าเดียวกัน)
 *
 * 🔄 token เปลี่ยนจาก `text-text-black` (#191919) เป็น `text-text-body` (#535a61)
 * ตามตัวแปรที่ไฟล์ดีไซน์อ้างถึงตรง ๆ (`--color/text/body`) — เงื่อนไขที่เทสนี้คุ้มครอง
 * ไม่เปลี่ยน เพราะ `--color-text-body` ประกาศครั้งเดียวที่ `:root` ไม่มีธีมไหน override
 * ──────────────────────────────────────────────────────────────────────────── */
describe("สีตัวอักษรในตารางไม่เปลี่ยนตามแอป", () => {
  const BRAND_TINTED = "text-text-primary";

  it("เซลล์ข้อมูลใช้ token ที่คงที่ ไม่ใช่ token ที่ผูกกับแบรนด์", () => {
    render(<DataTable columns={columns} data={rows} getRowId={getRowId} />);
    const cell = document.querySelector("tbody td")!;
    expect(cell.className).toContain("text-text-body");
    expect(cell.className).not.toContain(BRAND_TINTED);
  });

  it("หัวตารางกับเซลล์ข้อมูลใช้สีเดียวกัน", () => {
    render(<DataTable columns={columns} data={rows} getRowId={getRowId} />);
    const th = document.querySelector("thead th")!;
    const td = document.querySelector("tbody td")!;
    const tone = (el: Element) =>
      el.className.split(/\s+/).find((c) => c.startsWith("text-text-"));
    expect(tone(th)).toBe(tone(td));
  });

  it("ตัวนับที่เลือกในแถบล่างก็ไม่ผูกกับแบรนด์", () => {
    render(
      <DataTable
        columns={columns}
        data={rows}
        getRowId={getRowId}
        enableSelection
        rowSelection={{ "1": true }}
        onRowSelectionChange={vi.fn()}
      />,
    );
    const bar = screen.getByText(/1 selected/);
    expect(bar.className).not.toContain(BRAND_TINTED);
  });
});

/* ────────────────────────────────────────────────────────────────────────────
 * น้ำหนักตัวอักษรในตาราง — หัวคอลัมน์ 500 · เซลล์ข้อมูล 400
 *
 * 🔴 เดิมเซลล์ข้อมูลเป็น **600** ซึ่งย้อนรอยมาจากตารางของ Portal ไม่ใช่สเปกของ DS
 * ไฟล์ดีไซน์ประกาศ style ในตารางไว้แค่ 2 ตัว — `Body/Small Medium` (หัว · 500)
 * กับ `Body/Small Regular` (เซลล์ · 400) · ผลของค่าเดิมคือแอปที่อยากได้เนื้อความ
 * ปกติต้องห่อทุกเซลล์ด้วย `<Text>` เพื่อล้มค่าตั้งต้นของ DS เอง
 *
 * เทสนี้จึงล็อก "หัวหนากว่าเซลล์" ไว้ ไม่ให้ใครเผลอกลับไปเป็น 600 อีก
 * ──────────────────────────────────────────────────────────────────────────── */
describe("น้ำหนักตัวอักษรในตารางตรงกับ type style ของดีไซน์", () => {
  it("เซลล์ข้อมูลเป็น 400 ไม่ใช่ 600", () => {
    render(<DataTable columns={columns} data={rows} getRowId={getRowId} />);
    const td = document.querySelector("tbody td")!;
    expect(td.className).toContain("font-normal");
    expect(td.className).not.toContain("font-semibold");
  });

  it("หัวคอลัมน์หนากว่าเซลล์ข้อมูล", () => {
    render(<DataTable columns={columns} data={rows} getRowId={getRowId} />);
    expect(document.querySelector("thead th")!.className).toContain(
      "font-medium",
    );
  });
});
