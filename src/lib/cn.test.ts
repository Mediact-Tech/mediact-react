import { describe, it, expect } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("filters falsy values", () => {
    expect(cn("a", false, null, undefined, "", "b")).toBe("a b");
  });

  it("dedupes conflicting tailwind utilities (last wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  /** font-size ของ design system เป็น token ที่เราเพิ่มเองใน `@theme`
   *  ถ้า tailwind-merge ไม่รู้จัก จะคืนมาทั้งสองคลาสแล้วผลลัพธ์ขึ้นกับลำดับใน CSS
   *  — component ที่ตั้งขนาดไว้เป็นค่าเริ่มต้นจะถูก override ไม่ได้ */
  it("แทนที่ font-size ของ Tailwind ด้วย token ของ design system", () => {
    expect(cn("text-lg", "text-title-md")).toBe("text-title-md");
    expect(cn("text-sm", "text-caption")).toBe("text-caption");
  });

  it("แทนที่ token ของ design system ด้วยกันเอง", () => {
    expect(cn("text-body-sm", "text-body-lg")).toBe("text-body-lg");
  });

  it("แทนที่ token ของ design system ด้วย font-size ของ Tailwind ได้", () => {
    expect(cn("text-title-lg", "text-base")).toBe("text-base");
  });

  /** สีตัวอักษรใช้ prefix `text-` เหมือนกัน — ต้องไม่ถูกลบทิ้งเพราะเข้าใจผิดว่าเป็นขนาด */
  it("ไม่ปนกับสีตัวอักษรที่ขึ้นต้นด้วย text- เหมือนกัน", () => {
    expect(cn("text-body-md", "text-text-primary")).toBe(
      "text-body-md text-text-primary",
    );
  });
});
