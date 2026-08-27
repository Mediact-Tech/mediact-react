/**
 * เทสของ "ตัวหมุน" — `Spinner` · `Button loading` · `IconButton loading`
 *
 * ⚠️ happy-dom ไม่คำนวณเลย์เอาต์ ⇒ พิสูจน์พิกเซลที่นี่ไม่ได้ (วัดใน Storybook แล้ว)
 * สิ่งที่เทสชุดนี้ล็อกคือ **สัญญาที่พังเงียบได้**: ทั้งสามที่ต้องเป็นทรงเดียวกัน
 * และ `IconButton` ต้องไม่ติดคลาสขนาดมาเอง
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Spinner } from "./Spinner";
import { Button } from "../ui/Button";
import { IconButton } from "../ui/IconButton";

/** path ของ `loader-circle` จาก lucide — เปลี่ยนที่นี่ที่เดียวถ้าจะเปลี่ยนทรง */
const ARC = "M21 12a9 9 0 1 1-6.219-8.56";

const svgOf = (el: HTMLElement) => el.querySelector("svg") as SVGElement | null;

describe("ทั้ง DS ต้องมีตัวหมุนทรงเดียว", () => {
  /* เหตุผลทั้งหมดที่ `spinner-parts.tsx` มีอยู่ — ก่อนหน้านี้ DS วาดตัวหมุนไว้ 3 ที่
   * ด้วย SVG ที่เหมือนกันทุกตัวอักษร แล้วยังมีอีก 2 ที่ใน ai-chat ที่ใช้ทรงอื่น */
  it("Spinner · Button loading · IconButton loading ใช้ path เดียวกัน", () => {
    const { container: a } = render(<Spinner />);
    const { container: b } = render(<Button loading>บันทึก</Button>);
    const { container: c } = render(<IconButton aria-label="ลบ" loading />);

    for (const root of [a, b, c]) {
      const svg = svgOf(root as unknown as HTMLElement);
      expect(svg).not.toBeNull();
      expect(svg!.querySelector("path")?.getAttribute("d")).toBe(ARC);
    }
  });

  it("ไม่เหลือวงกลมจาง ๆ ของทรงเดิม", () => {
    const { container } = render(<Spinner />);
    expect(container.querySelectorAll("circle")).toHaveLength(0);
  });

  it("เป็นเส้น ไม่ใช่พื้นทึบ และปลายมน", () => {
    const { container } = render(<Spinner />);
    const svg = svgOf(container as unknown as HTMLElement)!;
    expect(svg.getAttribute("fill")).toBe("none");
    expect(svg.getAttribute("stroke")).toBe("currentColor");
    expect(svg.getAttribute("stroke-linecap")).toBe("round");
  });
});

describe("ขนาด", () => {
  /* 🔴 `IconButton` คุมขนาดไอคอนด้วย `[&_svg:not([class*='size-'])]:size-4`
   * ⇒ ถ้าตัวหมุนติดคลาส `size-*` มาเอง selector จะไม่ match แล้วไอคอนจะใหญ่เกินปุ่ม
   * แบบเงียบ ๆ · นี่คือเหตุผลที่แยก "ทรง" ออกมาแทนที่จะยัด `<Spinner>` ทั้งก้อนเข้าไป */
  it("IconButton ต้องไม่ติดคลาสขนาดมาเอง", () => {
    const { container } = render(<IconButton aria-label="ลบ" loading />);
    const cls = svgOf(container as unknown as HTMLElement)!.getAttribute("class") ?? "";
    expect(cls).toContain("animate-spin");
    expect(cls).not.toMatch(/(^|\s)size-/);
  });

  it("Button ตรึงตัวหมุนไว้ที่ size-4 ทุกขนาดปุ่ม", () => {
    for (const size of ["sm", "md", "lg"] as const) {
      const { container } = render(
        <Button loading size={size}>
          บันทึก
        </Button>,
      );
      expect(svgOf(container as unknown as HTMLElement)!.getAttribute("class")).toContain("size-4");
    }
  });

  it("Spinner แปลง prop size เป็นคลาสตามที่ประกาศ", () => {
    const map = { xs: "size-3", sm: "size-4", md: "size-5", lg: "size-6", xl: "size-8" } as const;
    for (const [size, cls] of Object.entries(map)) {
      const { container } = render(<Spinner size={size as keyof typeof map} />);
      expect(svgOf(container as unknown as HTMLElement)!.getAttribute("class")).toContain(cls);
    }
  });
});

describe("การเข้าถึง", () => {
  it("Spinner ประกาศสถานะ และตั้งชื่อได้", () => {
    render(<Spinner label="กำลังโหลดรายการ" />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "กำลังโหลดรายการ");
  });

  /* ตัวหมุนข้างในปุ่มต้องไม่ประกาศตัวเอง — ปุ่มมี `aria-busy` อยู่แล้ว
   * ถ้าซ้อน role=status เข้าไปอีก screen reader จะอ่านสองรอบ */
  it("ตัวหมุนในปุ่มไม่ประกาศ role ซ้ำ", () => {
    const { container } = render(<Button loading>บันทึก</Button>);
    expect(container.querySelectorAll("[role=status]")).toHaveLength(0);
    expect(container.querySelector("button")).toHaveAttribute("aria-busy", "true");
  });
});
