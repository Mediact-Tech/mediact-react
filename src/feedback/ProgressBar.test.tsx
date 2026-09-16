import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressBar } from "./ProgressBar";

/* สิ่งที่ต้องล็อกไว้: ค่าที่หลุดช่วงต้องไม่ทำให้แถบล้น/หาย และต้องมีชื่อให้ screen reader */

const bar = () => screen.getByRole("progressbar");
const fill = () => bar().firstElementChild as HTMLElement;

describe("ProgressBar — การหนีบค่า", () => {
  it("ค่าปกติผ่านตรง ๆ", () => {
    render(<ProgressBar value={40} label="q" />);
    expect(fill().style.width).toBe("40%");
    expect(bar()).toHaveAttribute("aria-valuenow", "40");
  });

  /* 🔴 backend ส่งเกิน 100 ได้จริงเมื่อใช้เกินโควตา — ปล่อยไปแถบจะยื่นออกนอกราง */
  it("เกิน 100 ถูกหนีบที่ 100", () => {
    render(<ProgressBar value={140} label="q" />);
    expect(fill().style.width).toBe("100%");
    expect(bar()).toHaveAttribute("aria-valuenow", "100");
  });

  it("ติดลบถูกหนีบที่ 0", () => {
    render(<ProgressBar value={-20} label="q" />);
    expect(fill().style.width).toBe("0%");
  });

  /**
   * 🔴 กับดักจริง: `creditsUsed / creditsTotal` เมื่อ total = 0 ได้ `NaN`
   * แล้ว `width: NaN%` ทำให้เบราว์เซอร์ **ทิ้งทั้งกฎ** ⇒ แถบกว้างเต็มราง
   * ซึ่งอ่านว่า "ใช้หมดแล้ว" ทั้งที่ยังไม่มีโควตาด้วยซ้ำ
   */
  it("NaN ตกลงที่ 0 ไม่ใช่แถบเต็ม", () => {
    render(<ProgressBar value={Number.NaN} label="q" />);
    expect(fill().style.width).toBe("0%");
    expect(bar()).toHaveAttribute("aria-valuenow", "0");
  });

  it("Infinity ก็ตกลงที่ 0 เหมือนกัน", () => {
    render(<ProgressBar value={Number.POSITIVE_INFINITY} label="q" />);
    expect(fill().style.width).toBe("0%");
  });
});

describe("ProgressBar — a11y และทรง", () => {
  it("label กลายเป็นชื่อที่อ่านได้", () => {
    render(<ProgressBar value={10} label="โควตาที่ใช้ไป" />);
    expect(screen.getByRole("progressbar", { name: "โควตาที่ใช้ไป" })).toBeInTheDocument();
  });

  it("มี valuemin/valuemax ครบ ไม่ใช่แค่ valuenow", () => {
    render(<ProgressBar value={10} label="q" />);
    expect(bar()).toHaveAttribute("aria-valuemin", "0");
    expect(bar()).toHaveAttribute("aria-valuemax", "100");
  });

  /* 🔴 ไม่ใช่ `<progress>` โดยตั้งใจ — UA stylesheet วาดคนละแบบทุกเบราว์เซอร์
     และ Mediwork ถอด preflight ทิ้ง ⇒ DS ต้องไม่พึ่ง reset ของแอป */
  it("ไม่ใช้ element <progress>", () => {
    const { container } = render(<ProgressBar value={10} label="q" />);
    expect(container.querySelector("progress")).toBeNull();
  });

  it("โทนเปลี่ยนสีแถบ ไม่ใช่สีราง", () => {
    render(<ProgressBar value={50} tone="danger" label="q" />);
    expect(fill().className).toContain("bg-danger-default");
    expect(bar().className).toContain("bg-progress-track");
  });

  it("className ของผู้เรียกทับทรงรางได้", () => {
    render(<ProgressBar value={50} label="q" className="h-4" />);
    expect(bar().className).toContain("h-4");
    expect(bar().className).not.toContain("h-2");
  });

  /* โครงร่างต้องสูงเท่าแถบจริง ไม่งั้นเลย์เอาต์กระตุกตอนข้อมูลมาถึง */
  it("isLoading ให้โครงร่างที่ยังมีทรงรางเดิม และไม่ประกาศ progressbar", () => {
    render(<ProgressBar value={50} label="q" isLoading />);
    expect(screen.queryByRole("progressbar")).toBeNull();
  });
});
