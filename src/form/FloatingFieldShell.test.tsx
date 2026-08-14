import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FloatingFieldShell, FieldSkeleton, fieldShapeClasses } from "./FloatingFieldShell";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";

/* ⚠️ happy-dom ไม่คำนวณเลย์เอาต์ — `getBoundingClientRect()` คืน 0 ทุกตัว
 * ⇒ วัดความสูงเป็นพิกเซลที่นี่ไม่ได้ ต้องวัดในเบราว์เซอร์จริง
 *   (story `Feedback/Skeleton states` → `Fields`)
 *
 * ที่ล็อกได้ตรงนี้คือ **โครงสร้าง** ซึ่งเป็นรากของบั๊กจริงที่เคยเกิด:
 * โครงร่างรุ่นก่อนประกอบ DOM ขึ้นใหม่เอง (แถบป้าย + ช่อง) แทนที่จะใช้ shell
 * ⇒ ไม่มีบรรทัดข้อความข้างล่าง ทำให้เตี้ยกว่าของจริง 20px ตอนไม่มีป้าย
 * ถ้าใครประกอบเองอีก เทสในไฟล์นี้จะพังทันทีเพราะบรรทัดนั้นหายไป
 */

const messageSlot = (c: HTMLElement) =>
  c.querySelector("p.text-caption") as HTMLElement | null;

describe("FloatingFieldShell", () => {
  describe("ป้ายว่าง", () => {
    it("ไม่ render <label> เมื่อป้ายเป็นสตริงว่าง", () => {
      const { container } = render(
        <FloatingFieldShell floating={false} label="   ">
          <input aria-label="x" />
        </FloatingFieldShell>,
      );
      expect(container.querySelector("label")).toBeNull();
    });

    it("ไม่ render <label> เมื่อไม่ส่งป้ายมาเลย", () => {
      const { container } = render(
        <FloatingFieldShell floating={false}>
          <input aria-label="x" />
        </FloatingFieldShell>,
      );
      expect(container.querySelector("label")).toBeNull();
    });

    it("render <label> เมื่อป้ายมีเนื้อหาจริง", () => {
      render(
        <FloatingFieldShell floating={false} label="ชื่อ" htmlFor="f">
          <input id="f" />
        </FloatingFieldShell>,
      );
      expect(screen.getByLabelText("ชื่อ")).toBeInTheDocument();
    });
  });

  describe("ที่ว่างของข้อความข้างล่าง", () => {
    it("จองไว้เสมอแม้ไม่มี hint/error (กันเลย์เอาต์กระโดด)", () => {
      const { container } = render(
        <FloatingFieldShell floating={false} label="ชื่อ">
          <input aria-label="x" />
        </FloatingFieldShell>,
      );
      expect(messageSlot(container)).not.toBeNull();
    });

    it("ปิดได้ด้วย reserveMessageSpace={false}", () => {
      const { container } = render(
        <FloatingFieldShell floating={false} label="ชื่อ" reserveMessageSpace={false}>
          <input aria-label="x" />
        </FloatingFieldShell>,
      );
      expect(messageSlot(container)).toBeNull();
    });
  });
});

describe("FieldSkeleton", () => {
  it("render โครงร่างที่โปรแกรมอ่านหน้าจอรู้ว่ากำลังโหลด", () => {
    render(<FieldSkeleton label="ชื่อ" />);
    const box = screen.getByRole("status");
    expect(box).toHaveAttribute("aria-busy", "true");
    expect(box).toHaveTextContent("กำลังโหลด");
  });

  /* 🔴 รากของบั๊ก 20px — โครงร่างต้องมีบรรทัดข้อความเหมือนของจริง */
  it("มีบรรทัดข้อความข้างล่างเหมือนของจริง", () => {
    const { container } = render(<FieldSkeleton label="ชื่อ" />);
    expect(messageSlot(container)).not.toBeNull();
  });

  it("มีบรรทัดนั้นแม้ไม่มีป้าย — เคสที่รุ่นก่อนพัง", () => {
    const { container } = render(<FieldSkeleton />);
    expect(messageSlot(container)).not.toBeNull();
  });
});

describe("isLoading ของช่องกรอกทุกชนิด", () => {
  const cases = [
    ["Input", (p: Record<string, unknown>) => <Input {...p} />],
    ["Select", (p: Record<string, unknown>) => <Select {...p} />],
    ["Textarea", (p: Record<string, unknown>) => <Textarea {...p} />],
  ] as const;

  for (const [name, Comp] of cases) {
    describe(name, () => {
      it("แทนช่องจริงด้วยโครงร่าง", () => {
        const { container } = render(Comp({ label: "ชื่อ", isLoading: true }));
        expect(screen.getByRole("status")).toBeInTheDocument();
        expect(container.querySelector("input, textarea, button")).toBeNull();
      });

      /* โครงสร้างเดียวกับของจริง = ความสูงเท่ากันโดยโครงสร้าง ไม่ใช่โดยบังเอิญ */
      it("โครงร่างมีบรรทัดข้อความเท่าของจริง ทั้งมีป้ายและไม่มีป้าย", () => {
        for (const props of [{ label: "ชื่อ" }, {}]) {
          const real = render(Comp(props));
          const skel = render(Comp({ ...props, isLoading: true }));
          expect(messageSlot(real.container)).not.toBeNull();
          expect(messageSlot(skel.container)).not.toBeNull();
          real.unmount();
          skel.unmount();
        }
      });

      it("กลับมาเป็นช่องจริงเมื่อโหลดเสร็จ", () => {
        const { container, rerender } = render(
          Comp({ label: "ชื่อ", isLoading: true }),
        );
        rerender(Comp({ label: "ชื่อ", isLoading: false }));
        expect(screen.queryByRole("status")).toBeNull();
        expect(container.querySelector("input, textarea, button")).not.toBeNull();
      });
    });
  }
});

/**
 * รูปทรงของช่อง — สองอย่างที่เพิ่มเข้ามา 2026-08-14 หลังเอา DS ไปวางข้างจอเดิมของ Mediwork
 *
 * ทั้งคู่พิสูจน์ด้วยการทำให้พังจริงก่อนแล้ว (ถอด `enabled:hover:border-brand` ออก และ
 * เปลี่ยนมุมโค้งกลับเป็น `rounded-sm` แล้วเทสตกทั้งสองข้อ) ไม่ได้ยืนยันด้วยการอ่านโค้ด
 */
describe("fieldShapeClasses", () => {
  it("มี hover เส้นขอบเป็นสีแบรนด์ และไม่ทำงานตอนช่องถูกปิด", () => {
    const shape = fieldShapeClasses({ hasError: false, size: "md" });

    /* `enabled:` เป็นส่วนสำคัญของสัญญา ไม่ใช่รายละเอียด — ช่องที่ปิดอยู่ต้องไม่ตอบสนอง
     * การ hover ไม่งั้นมันสัญญาสิ่งที่ทำไม่ได้ (ช่อง "หน่วยงาน" ที่ปิดไว้จนกว่าจะเลือกแผนก) */
    expect(shape).toContain("enabled:hover:border-brand");
  });

  it("สถานะผิดพลาดไม่มี hover — เส้นแดงคือข้อความ ไม่ใช่ของตกแต่ง", () => {
    expect(fieldShapeClasses({ hasError: true, size: "md" })).not.toContain(
      "hover:border-brand",
    );
  });

  it("มุมโค้งอ่านจาก `--radius-field` โดยค่าสำรองเท่าของเดิม 4px", () => {
    /* ค่าสำรองคือสิ่งที่กันไม่ให้แอปที่ไม่ได้ตั้งอะไรเปลี่ยนหน้าตา — ถ้าหลุดไป
     * ทั้ง 4 แอปจะได้มุมโค้ง 0 พร้อมกันโดยไม่มีใครสั่ง */
    expect(fieldShapeClasses({ hasError: false, size: "md" })).toContain(
      "rounded-[var(--radius-field,0.25rem)]",
    );
  });
});
