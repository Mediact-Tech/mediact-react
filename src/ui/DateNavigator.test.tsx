/**
 * ยามของตัวเลื่อนวัน/เดือน — เน้นส่วนที่เพิ่มมาจากของจริงในหน้า productivity
 *
 * ⚠️ ปฏิทินอยู่ใน popover ซึ่ง render ผ่าน portal ไปที่ `document.body`
 * ⇒ ค้นจาก `container` จะไม่เจออะไรเลย และเทสจะผ่านแบบว่างเปล่า (บทเรียนจาก dialog)
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DateNavigator } from "./DateNavigator";

const may15 = new Date(2026, 4, 15);
const dayButton = (key: string) =>
  screen
    .getAllByRole("gridcell")
    .find((c) => c.getAttribute("data-day") === key)!
    .querySelector("button")!;

describe("ทรงของราง", () => {
  it("มีเส้นคั่นตั้งขนาบตรงกลางสองเส้น — จุดที่ทำให้ไม่ใช่แค่ลูกศรสองข้าง", () => {
    const { container } = render(<DateNavigator value={may15} />);
    expect(container.querySelectorAll(".w-px")).toHaveLength(2);
  });

  it("ไม่ส่ง calendar = ตรงกลางไม่ใช่ปุ่ม", () => {
    render(<DateNavigator value={may15} unit="day" />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2); // เหลือแค่ ‹ ›
  });
});

describe("เปิดปฏิทิน", () => {
  it("กดตรงกลางแล้วปฏิทินเปิด", async () => {
    const user = userEvent.setup();
    render(<DateNavigator value={may15} unit="day" calendar />);
    expect(screen.queryByRole("grid")).toBeNull();
    await user.click(screen.getByRole("button", { expanded: false }));
    expect(await screen.findByRole("grid")).toBeInTheDocument();
  });

  it("เลือกวันแล้ว commit และปิดทันที (ไม่มีปุ่มยืนยัน)", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DateNavigator value={may15} unit="day" calendar onChange={onChange} />,
    );
    await user.click(screen.getByRole("button", { expanded: false }));
    await user.click(dayButton("2026-05-20"));
    expect((onChange.mock.calls[0]?.[0] as Date).getDate()).toBe(20);
    expect(screen.queryByRole("grid")).toBeNull();
  });
});

describe("โหมดร่าง — มีปุ่มยืนยัน", () => {
  /* ของจริงในหน้า productivity: popover ถือทั้งวันและเวร ถ้า commit ทันทีที่กดวัน
   * หน้าจอข้างหลังจะโหลดใหม่ทั้งที่ผู้ใช้ยังเลือกไม่ครบคู่ */
  const renderDraft = (onConfirm = vi.fn(), onChange = vi.fn()) => {
    render(
      <DateNavigator
        value={may15}
        unit="day"
        calendar
        calendarTitle="เลือกวันและเวร"
        confirmLabel="เสร็จสิ้น"
        onConfirm={onConfirm}
        onChange={onChange}
      >
        <button type="button">เวรบ่าย</button>
      </DateNavigator>,
    );
    return { onConfirm, onChange };
  };

  it("กดวันแล้วยังไม่ commit — ต้องกดยืนยันก่อน", async () => {
    const user = userEvent.setup();
    const { onConfirm, onChange } = renderDraft();
    await user.click(screen.getByRole("button", { expanded: false }));
    await user.click(dayButton("2026-05-20"));
    expect(onConfirm).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole("grid")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "เสร็จสิ้น" }));
    expect((onConfirm.mock.calls[0]?.[0] as Date).getDate()).toBe(20);
    expect(screen.queryByRole("grid")).toBeNull();
  });

  it("ปิดแล้วเปิดใหม่ ร่างเริ่มจากค่าปัจจุบัน ไม่ใช่ค่าที่ค้างไว้", async () => {
    const user = userEvent.setup();
    renderDraft();
    const trigger = screen.getByRole("button", { expanded: false });
    await user.click(trigger);
    await user.click(dayButton("2026-05-20"));
    await user.keyboard("{Escape}");
    await user.click(screen.getByRole("button", { expanded: false }));
    /* 15 คือค่าจริงที่ยังไม่ถูกแทน — 20 เป็นแค่ร่างที่ถูกทิ้งไป */
    expect(
      screen
        .getAllByRole("gridcell")
        .find((c) => c.getAttribute("aria-selected") === "true")
        ?.getAttribute("data-day"),
    ).toBe("2026-05-15");
  });

  it("เนื้อหาที่แอปส่งมาถูก render ในลิ้นชักด้วย", async () => {
    const user = userEvent.setup();
    renderDraft();
    await user.click(screen.getByRole("button", { expanded: false }));
    expect(screen.getByRole("button", { name: "เวรบ่าย" })).toBeInTheDocument();
    expect(screen.getByText("เลือกวันและเวร")).toBeInTheDocument();
  });
});

describe("หน่วยเดือน", () => {
  it("เปิดมาที่ตาราง 12 เดือน และเลือกจบที่เดือนเลย", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DateNavigator
        value={may15}
        unit="month"
        calendar
        onChange={onChange}
      />,
    );
    await user.click(screen.getByRole("button", { expanded: false }));
    /* ไม่ใช่ตารางวัน — หน่วยของตัวเลื่อนนี้คือเดือน */
    expect(screen.queryByRole("grid")).toBeNull();
    await user.click(screen.getByRole("button", { name: "ม.ค." }));
    const arg = onChange.mock.calls[0]?.[0] as Date;
    expect(arg.getMonth()).toBe(0);
    expect(arg.getDate()).toBe(1);
  });
});

describe("ลูกศรยังทำงานเหมือนเดิม", () => {
  it("‹ › ก้าวทีละหน่วยและเคารพ min/max", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DateNavigator
        value={may15}
        unit="day"
        onChange={onChange}
        maxDate={may15}
      />,
    );
    expect(screen.getByRole("button", { name: "ถัดไป" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "ก่อนหน้า" }));
    expect((onChange.mock.calls[0]?.[0] as Date).getDate()).toBe(14);
  });
});
