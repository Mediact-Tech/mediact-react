import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Text } from "./Text";

describe("Text", () => {
  it("render เป็น <p> โดยปริยาย", () => {
    const { container } = render(<Text>สวัสดี</Text>);
    expect(container.querySelector("p")).toHaveTextContent("สวัสดี");
  });

  it("เปลี่ยน element ได้ด้วย as", () => {
    const { container } = render(<Text as="span">สวัสดี</Text>);
    expect(container.querySelector("span")).toBeInTheDocument();
    expect(container.querySelector("p")).toBeNull();
  });

  it("variant ต่างกันได้ class ต่างกัน", () => {
    const { container: a } = render(<Text variant="body-sm">x</Text>);
    const { container: b } = render(<Text variant="caption">x</Text>);
    expect(a.firstElementChild?.className).not.toBe(
      b.firstElementChild?.className,
    );
  });

  describe("isLoading", () => {
    it("แทนข้อความด้วยโครงร่างที่บอกว่ากำลังโหลด", () => {
      render(<Text isLoading>ข้อมูลพนักงาน</Text>);
      const box = screen.getByRole("status");
      expect(box).toHaveAttribute("aria-busy", "true");
    });

    /* โครงร่างสูงเท่าบรรทัดจริงด้วย `h-[1lh]` — ผูกกับ line-height ของระดับตัวอักษร
     * นั้นเอง ไม่ใช่ตัวเลขที่เดา ⇒ เปลี่ยน type scale แล้วโครงร่างตามเอง */
    it("ความสูงผูกกับความสูงบรรทัดจริง ไม่ใช่ตัวเลขคงที่", () => {
      const { container } = render(<Text isLoading>x</Text>);
      expect(container.firstElementChild?.className).toContain("h-[1lh]");
    });

    it("ตั้งความกว้างของแถบได้", () => {
      const { container } = render(
        <Text isLoading skeletonWidth="8rem">
          x
        </Text>,
      );
      expect(
        (container.firstElementChild as HTMLElement).style.width,
      ).toBe("8rem");
    });

    it("กลับมาเป็นข้อความจริงเมื่อโหลดเสร็จ", () => {
      const { rerender } = render(<Text isLoading>ข้อมูล</Text>);
      rerender(<Text>ข้อมูล</Text>);
      expect(screen.queryByRole("status")).toBeNull();
      expect(screen.getByText("ข้อมูล")).toBeInTheDocument();
    });
  });
});
