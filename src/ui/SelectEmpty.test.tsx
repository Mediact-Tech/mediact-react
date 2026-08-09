import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "./Select";

const options = [
  { value: "a", label: "หน่วยงาน A" },
  { value: "b", label: "หน่วยงาน B" },
];

const open = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole("combobox"));
};

describe("Select — สถานะไม่มีตัวเลือก", () => {
  /* 🔴 เดิม options=[] ได้กล่องเปล่า ผู้ใช้แยกไม่ออกว่าโหลดไม่มา ระบบพัง
   * หรือไม่มีข้อมูลจริง ๆ */
  it("options ว่าง = มีข้อความบอก ไม่ใช่กล่องเปล่า", async () => {
    const user = userEvent.setup();
    render(<Select label="หน่วยงาน" options={[]} emptyText="ยังไม่มีหน่วยงาน" />);
    await open(user);
    expect(screen.getByText("ยังไม่มีหน่วยงาน")).toBeInTheDocument();
  });

  it("ไม่ส่ง emptyText = มีข้อความอังกฤษตั้งต้น ไม่ใช่ว่างเปล่า", async () => {
    const user = userEvent.setup();
    render(<Select label="หน่วยงาน" options={[]} />);
    await open(user);
    expect(screen.getByText("No options")).toBeInTheDocument();
  });

  it("มีตัวเลือก = ไม่แสดงสถานะว่าง", async () => {
    const user = userEvent.setup();
    render(<Select label="หน่วยงาน" options={options} emptyText="ยังไม่มีหน่วยงาน" />);
    await open(user);
    expect(screen.queryByText("ยังไม่มีหน่วยงาน")).toBeNull();
    expect(screen.getAllByRole("option")).toHaveLength(2);
  });

  describe("ปุ่มทางออก", () => {
    /* 🔴 dropdown ว่างที่ไม่มีทางออกคือทางตัน — เจอจริงตอน dev MediHR F3 */
    it("กดแล้วเรียก onClick", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Select
          label="หน่วยงาน"
          options={[]}
          emptyText="ยังไม่มีหน่วยงาน"
          emptyAction={{ label: "เพิ่มหน่วยงาน", onClick }}
        />,
      );
      await open(user);
      await user.click(screen.getByRole("button", { name: /เพิ่มหน่วยงาน/ }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    /**
     * 🔴 ปุ่มนี้มักพาไปหน้าอื่นหรือเปิด modal — ถ้า dropdown ไม่ปิด
     * ลิสต์จะค้างทับสิ่งที่เพิ่งเปิดขึ้นมา
     *
     * เคยพลาดมาแล้ว: คอมเมนต์เขียนว่าปิด แต่ `setOpen` คุมแค่ป้ายลอย
     * ไม่ได้คุม Radix ⇒ ต้องส่ง `open` เข้า `Root` ด้วย
     */
    it("กดแล้ว dropdown ปิด", async () => {
      const user = userEvent.setup();
      render(
        <Select
          label="หน่วยงาน"
          options={[]}
          emptyText="ยังไม่มีหน่วยงาน"
          emptyAction={{ label: "เพิ่มหน่วยงาน", onClick: vi.fn() }}
        />,
      );
      await open(user);
      expect(screen.getByRole("listbox")).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: /เพิ่มหน่วยงาน/ }));
      expect(screen.queryByRole("listbox")).toBeNull();
    });

    /* คนที่ใช้คีย์บอร์ดล้วนคือกลุ่มเดียวกับที่ทางตันนี้ทำร้ายอยู่แล้ว
     * — Radix ดัก key ในลิสต์ ปุ่มจึงต้องรับ Enter/Space เอง */
    it.each(["{Enter}", " "])("กดด้วยคีย์บอร์ด (%s) ได้", async (key) => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Select
          label="หน่วยงาน"
          options={[]}
          emptyAction={{ label: "เพิ่มหน่วยงาน", onClick }}
        />,
      );
      await open(user);
      screen.getByRole("button", { name: /เพิ่มหน่วยงาน/ }).focus();
      await user.keyboard(key);
      expect(onClick).toHaveBeenCalled();
    });

    it("ไม่ส่ง emptyAction = มีแต่ข้อความ ไม่มีปุ่ม", async () => {
      const user = userEvent.setup();
      render(<Select label="หน่วยงาน" options={[]} emptyText="ไม่มีสิทธิ์สร้างเอง" />);
      await open(user);
      expect(screen.queryByRole("button", { name: /เพิ่ม/ })).toBeNull();
    });

    it("ไอคอนเปลี่ยนได้", async () => {
      const user = userEvent.setup();
      render(
        <Select
          label="หน่วยงาน"
          options={[]}
          emptyAction={{
            label: "ไปตั้งค่า",
            onClick: vi.fn(),
            icon: <span data-testid="custom-icon">→</span>,
          }}
        />,
      );
      await open(user);
      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });
  });

  it("renderEmpty ชนะ emptyText/emptyAction", async () => {
    const user = userEvent.setup();
    render(
      <Select
        label="หน่วยงาน"
        options={[]}
        emptyText="ของเดิม"
        emptyAction={{ label: "ของเดิม", onClick: vi.fn() }}
        renderEmpty={() => <div>วาดเอง</div>}
      />,
    );
    await open(user);
    expect(screen.getByText("วาดเอง")).toBeInTheDocument();
    expect(screen.queryByText("ของเดิม")).toBeNull();
  });

  /* เพิ่มของแล้วต้องกลับมาเป็นลิสต์ปกติเอง ไม่ต้องรีเฟรช */
  it("เพิ่มตัวเลือกแล้วสถานะว่างหายไป", async () => {
    const user = userEvent.setup();
    function Harness() {
      const [items, setItems] = useState<{ value: string; label: string }[]>([]);
      return (
        <Select
          label="หน่วยงาน"
          options={items}
          emptyText="ยังไม่มีหน่วยงาน"
          emptyAction={{
            label: "เพิ่มหน่วยงาน",
            onClick: () => setItems([{ value: "a", label: "หน่วยงาน A" }]),
          }}
        />
      );
    }
    render(<Harness />);
    await open(user);
    await user.click(screen.getByRole("button", { name: /เพิ่มหน่วยงาน/ }));
    await open(user);
    expect(screen.queryByText("ยังไม่มีหน่วยงาน")).toBeNull();
    expect(screen.getAllByRole("option")).toHaveLength(1);
  });
});
