/**
 * ยามของแถบขั้นตอน — ล็อกตำแหน่งป้าย (ค่าตั้งต้น = ใต้ตัวเลข · เคาะ 2026-11-03) และเลนกดย้อน
 *
 * ⚠️ happy-dom ไม่คำนวณเลย์เอาต์ ⇒ พิสูจน์ได้แค่โครงสร้าง/คลาส · ระยะจริงวัดใน Storybook
 */
import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Stepper } from "./Stepper";

const steps = [{ label: "ข้อมูลเวร" }, { label: "เตียงและผู้ป่วย" }, { label: "สรุปยอดเวร" }];

const stepBlock = (label: string) => screen.getByText(label).parentElement as HTMLElement;

describe("ตำแหน่งป้าย", () => {
  it("ค่าตั้งต้น: ตัวเลขอยู่บน ป้ายอยู่ใต้ จัดกลาง", () => {
    render(<Stepper steps={steps} current={1} />);
    const block = stepBlock("เตียงและผู้ป่วย");
    expect(block.className).toMatch(/(?<![\w-])flex-col(?![\w-])/);
    expect(block.className).toMatch(/(?<![\w-])items-center(?![\w-])/);
    // วงกลมมาก่อนป้ายใน DOM ⇒ ตัวเลขอยู่บน
    expect(block.firstElementChild).toHaveTextContent("2");
  });

  it("labelPlacement=end: ป้ายอยู่ข้างวงกลม (รูปแบบเดิม)", () => {
    render(<Stepper steps={steps} current={1} labelPlacement="end" />);
    expect(stepBlock("เตียงและผู้ป่วย").className).not.toMatch(/(?<![\w-])flex-col(?![\w-])/);
  });

  /* เส้นเชื่อมต้องอยู่ระดับวงกลม ไม่ใช่กลางก้อน "วงกลม + ป้าย" ⇒ ห่อด้วยกล่องสูงเท่าวงกลม */
  it("เส้นเชื่อมอยู่ในกล่องสูงเท่าวงกลม (h-6) ทุกแบบ", () => {
    const { container } = render(<Stepper steps={steps} current={0} connector="fixed" />);
    const connectors = container.querySelectorAll("li > [aria-hidden]");
    expect(connectors).toHaveLength(2);
    connectors.forEach((c) => expect(c.className).toMatch(/(?<![\w-])h-6(?![\w-])/));
  });
});

describe("สถานะ", () => {
  it("ขั้นที่ทำอยู่ติด aria-current=step · ขั้นอื่นไม่ติด", () => {
    const { container } = render(<Stepper steps={steps} current={1} />);
    const items = container.querySelectorAll("li");
    expect(items[1]).toHaveAttribute("aria-current", "step");
    expect(items[0]).not.toHaveAttribute("aria-current");
    expect(items[2]).not.toHaveAttribute("aria-current");
  });
});

describe("กดย้อน", () => {
  it("กดได้เฉพาะขั้นที่ผ่านแล้ว · ทั้งก้อน (วงกลม + ป้าย) เป็นปุ่มเดียว ชื่อปุ่ม = ป้าย", () => {
    const onStepClick = vi.fn();
    render(<Stepper steps={steps} current={2} onStepClick={onStepClick} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
    expect(screen.getByRole("button", { name: /ข้อมูลเวร/ })).toBeInTheDocument();
    fireEvent.click(screen.getByText("เตียงและผู้ป่วย"));
    expect(onStepClick).toHaveBeenCalledWith(1);
  });

  it("ไม่ส่ง onStepClick ⇒ ไม่มีปุ่มเลย", () => {
    render(<Stepper steps={steps} current={2} />);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("แนวตั้ง: ปุ่มเป็นวงกลม ยืมป้ายข้อความมาเป็นชื่อ", () => {
    const onStepClick = vi.fn();
    render(<Stepper steps={steps} current={1} orientation="vertical" onStepClick={onStepClick} />);
    fireEvent.click(screen.getByRole("button", { name: "ข้อมูลเวร" }));
    expect(onStepClick).toHaveBeenCalledWith(0);
  });
});

describe("สีป้าย", () => {
  it("ผ่านแล้ว/ทำอยู่ = brand-active (สีเดียวกับวงกลม) · ทำอยู่หนากว่า · ยังไม่ถึง = เทา", () => {
    render(<Stepper steps={steps} current={1} />);
    expect(screen.getByText("ข้อมูลเวร").className).toMatch(/(?<![\w-])text-brand-active(?![\w-])/);
    expect(screen.getByText("ข้อมูลเวร").className).toMatch(/(?<![\w-])font-normal(?![\w-])/);
    expect(screen.getByText("เตียงและผู้ป่วย").className).toMatch(/(?<![\w-])text-brand-active(?![\w-])/);
    expect(screen.getByText("เตียงและผู้ป่วย").className).toMatch(/(?<![\w-])font-semibold(?![\w-])/);
    expect(screen.getByText("สรุปยอดเวร").className).toMatch(/(?<![\w-])text-text-tertiary(?![\w-])/);
  });

  /* `text-brand` / `text-text-primary` = มิ้นต์ของ Mediwork บนขาว 1.93:1 */
  it("ป้ายไม่ใช้ text-brand / text-text-primary (alias ไป --color-brand)", () => {
    const { container } = render(<Stepper steps={steps} current={1} />);
    const classes = [...container.querySelectorAll("*")]
      .map((el) => el.getAttribute("class") ?? "")
      .join(" ");
    expect(classes).not.toMatch(/(?<![\w-])text-text-primary(?![\w-])/);
    expect(classes).not.toMatch(/(?<![\w-])text-brand(?![\w-])/);
  });
});
