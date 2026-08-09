import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Heading } from "./Heading";

describe("Heading", () => {
  it("render เป็น h2 โดยปริยาย", () => {
    render(<Heading>รายชื่อ</Heading>);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "รายชื่อ",
    );
  });

  it("level เปลี่ยนระดับหัวข้อทางความหมาย", () => {
    render(<Heading level={4}>รายชื่อ</Heading>);
    expect(screen.getByRole("heading", { level: 4 })).toBeInTheDocument();
  });

  /* 🔴 แกนหลักของ component นี้ — ลำดับหัวข้อเป็นเรื่องของ screen reader
   * ส่วนขนาดเป็นเรื่องของสายตา ผูกกันแล้วจะเลือกได้แค่อย่างเดียว */
  it("level กับ size แยกกัน — h2 ที่ดูเล็กกว่า h3 ได้", () => {
    const { container: small } = render(
      <Heading level={2} size="title-sm">
        เล็ก
      </Heading>,
    );
    const { container: big } = render(
      <Heading level={3} size="title-lg">
        ใหญ่
      </Heading>,
    );
    expect(small.querySelector("h2")).toBeInTheDocument();
    expect(big.querySelector("h3")).toBeInTheDocument();
    expect(small.firstElementChild?.className).not.toBe(
      big.firstElementChild?.className,
    );
  });

  describe("isLoading", () => {
    it("แทนหัวข้อด้วยโครงร่างที่บอกว่ากำลังโหลด", () => {
      render(<Heading isLoading>รายชื่อ</Heading>);
      expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
    });

    it("ความสูงผูกกับความสูงบรรทัดจริง ไม่ใช่ตัวเลขคงที่", () => {
      const { container } = render(<Heading isLoading>x</Heading>);
      expect(container.firstElementChild?.className).toContain("h-[1lh]");
    });

    it("ตั้งความกว้างของแถบได้", () => {
      const { container } = render(
        <Heading isLoading skeletonWidth="10rem">
          x
        </Heading>,
      );
      expect((container.firstElementChild as HTMLElement).style.width).toBe(
        "10rem",
      );
    });

    it("กลับมาเป็นหัวข้อจริงเมื่อโหลดเสร็จ", () => {
      const { rerender } = render(<Heading isLoading>รายชื่อ</Heading>);
      rerender(<Heading>รายชื่อ</Heading>);
      expect(screen.queryByRole("status")).toBeNull();
      expect(screen.getByRole("heading")).toBeInTheDocument();
    });
  });
});
