import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  describe("พื้นฐาน", () => {
    it("render ข้อความและกดได้", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<Button onClick={onClick}>บันทึก</Button>);
      await user.click(screen.getByRole("button", { name: "บันทึก" }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("ไม่กดเมื่อ disabled", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Button disabled onClick={onClick}>
          บันทึก
        </Button>,
      );
      await user.click(screen.getByRole("button"));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe("ไอคอน", () => {
    it("render ได้ทั้งซ้ายและขวาพร้อมกัน", () => {
      render(
        <Button
          leftIcon={<svg data-testid="l" />}
          rightIcon={<svg data-testid="r" />}
        >
          บันทึก
        </Button>,
      );
      expect(screen.getByTestId("l")).toBeInTheDocument();
      expect(screen.getByTestId("r")).toBeInTheDocument();
    });

    /* 🔴 `asChild` ใช้ Radix Slot ซึ่งเรียก React.Children.only() —
     * ก่อนแก้ ปุ่มส่งลูก 3 ตัว (ไอคอน+ข้อความ+ไอคอน) แล้ว throw */
    it("asChild + ไอคอนสองข้าง ไม่ throw", () => {
      expect(() =>
        render(
          <Button asChild leftIcon={<svg data-testid="l" />}>
            <a href="/x">ไปต่อ</a>
          </Button>,
        ),
      ).not.toThrow();
      expect(screen.getByRole("link", { name: /ไปต่อ/ })).toBeInTheDocument();
      expect(screen.getByTestId("l")).toBeInTheDocument();
    });
  });

  /* `loading` กับ `isLoading` คนละเรื่อง — ตั้งใจให้แยกกัน */
  describe("loading vs isLoading", () => {
    it("loading = กดไปแล้วกำลังทำงาน ⇒ ป้ายเดิมยังอยู่", () => {
      render(<Button loading>บันทึก</Button>);
      expect(screen.getByRole("button")).toHaveTextContent("บันทึก");
    });

    it("loading ทำให้กดซ้ำไม่ได้", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Button loading onClick={onClick}>
          บันทึก
        </Button>,
      );
      await user.click(screen.getByRole("button"));
      expect(onClick).not.toHaveBeenCalled();
    });

    it("isLoading = ยังไม่รู้ว่าปุ่มนี้คืออะไร ⇒ เป็นโครงร่าง ไม่ใช่ปุ่ม", () => {
      render(<Button isLoading>บันทึก</Button>);
      expect(screen.queryByRole("button")).toBeNull();
      expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
    });

    /* โครงร่างเก็บเนื้อหาไว้ใน DOM แบบ invisible ⇒ กว้างเท่าของจริงเป๊ะ
     * ไม่ต้องเดาความกว้าง (ตรงนี้คือเหตุผลที่ไม่ใช้ `hidden`) */
    it("โครงร่างยังเก็บข้อความไว้ใน DOM เพื่อให้กว้างเท่าของจริง", () => {
      const { container } = render(<Button isLoading>บันทึกข้อมูล</Button>);
      expect(container.textContent).toContain("บันทึกข้อมูล");
    });
  });

  describe("variant กับ size", () => {
    it("variant ต่างกันได้ class ต่างกัน", () => {
      const { container: a } = render(<Button variant="primary">x</Button>);
      const { container: b } = render(<Button variant="secondary">x</Button>);
      expect(a.firstElementChild?.className).not.toBe(
        b.firstElementChild?.className,
      );
    });

    it("มี variant info (เพิ่มทีหลังตามของจริง)", () => {
      expect(() => render(<Button variant="info">x</Button>)).not.toThrow();
    });

    it("size คุมความสูง ไม่คุมขนาดตัวอักษร", () => {
      const { container: sm } = render(<Button size="sm">x</Button>);
      const { container: lg } = render(<Button size="lg">x</Button>);
      const cls = (c: Element | null) => c?.className ?? "";
      // ตัวอักษรอยู่บน base เหมือนกันทั้งคู่
      expect(cls(sm.firstElementChild)).toContain("text-body-sm");
      expect(cls(lg.firstElementChild)).toContain("text-body-sm");
      expect(cls(sm.firstElementChild)).not.toBe(cls(lg.firstElementChild));
    });
  });
});
