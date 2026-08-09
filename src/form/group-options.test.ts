import { describe, it, expect } from "vitest";
import { groupItems } from "./group-options";

type Row = { id: string; dept: string | null };

const rows: Row[] = [
  { id: "a", dept: "Cardiology" },
  { id: "b", dept: "Radiology" },
  { id: "c", dept: "Cardiology" },
  { id: "d", dept: "Pediatrics" },
];

const byDept = (r: Row) => r.dept;
const shape = (gs: ReturnType<typeof groupItems<Row>>) =>
  gs.map((g) => [g.heading, g.items.map((i) => i.id)]);

describe("groupItems", () => {
  describe("ลำดับกลุ่ม", () => {
    it("เรียงตามลำดับที่เจอครั้งแรก ไม่ใช่ตามตัวอักษร", () => {
      // ตามตัวอักษรจะเป็น Cardiology · Pediatrics · Radiology
      expect(groupItems(rows, byDept).map((g) => g.heading)).toEqual([
        "Cardiology",
        "Radiology",
        "Pediatrics",
      ]);
    });

    it("จัดตาม groupOrder เมื่อส่งมา", () => {
      const out = groupItems(rows, byDept, ["Pediatrics", "Radiology"]);
      expect(out.map((g) => g.heading)).toEqual([
        "Pediatrics",
        "Radiology",
        "Cardiology",
      ]);
    });

    /* 🔴 ข้อนี้สำคัญที่สุดในไฟล์ — กลุ่มที่หายไปเงียบ ๆ คือความผิดพลาดที่หาไม่เจอ */
    it("กลุ่มที่ไม่อยู่ใน groupOrder ต่อท้าย ไม่ถูกทิ้ง", () => {
      const out = groupItems(rows, byDept, ["Pediatrics"]);
      expect(out.map((g) => g.heading)).toEqual([
        "Pediatrics",
        "Cardiology",
        "Radiology",
      ]);
      expect(out.flatMap((g) => g.items)).toHaveLength(rows.length);
    });

    it("groupOrder ที่มีชื่อกลุ่มซึ่งไม่มีอยู่จริง ไม่สร้างกลุ่มว่าง", () => {
      const out = groupItems(rows, byDept, ["ไม่มีแผนกนี้", "Radiology"]);
      expect(out.map((g) => g.heading)).toEqual([
        "Radiology",
        "Cardiology",
        "Pediatrics",
      ]);
    });
  });

  describe("รายการที่ไม่เข้ากลุ่มไหน", () => {
    it("null ไปอยู่ก้อนแรกที่ไม่มีหัวข้อ", () => {
      const out = groupItems(
        [{ id: "x", dept: null }, ...rows],
        byDept,
      );
      expect(out[0]!.heading).toBeNull();
      expect(out[0]!.items.map((i) => i.id)).toEqual(["x"]);
    });

    it("undefined กับสตริงว่างนับเป็นไม่เข้ากลุ่มเหมือนกัน", () => {
      const out = groupItems(
        [{ id: "u" }, { id: "e", dept: "" }, { id: "a", dept: "ICU" }] as Row[],
        (r) => r.dept,
      );
      expect(out[0]!.heading).toBeNull();
      expect(out[0]!.items.map((i) => i.id)).toEqual(["u", "e"]);
    });

    it("อยู่บนสุดเสมอ แม้ groupOrder จะจัดลำดับกลุ่มอื่นไว้", () => {
      const out = groupItems(
        [...rows, { id: "z", dept: null }],
        byDept,
        ["Pediatrics"],
      );
      expect(out[0]!.heading).toBeNull();
    });

    it("ไม่สร้างก้อนไม่มีหัวข้อถ้าทุกตัวเข้ากลุ่มหมด", () => {
      expect(groupItems(rows, byDept).some((g) => g.heading === null)).toBe(
        false,
      );
    });
  });

  describe("ความครบถ้วน", () => {
    it("ไม่มีรายการไหนหาย และไม่มีรายการไหนซ้ำ", () => {
      const out = groupItems([...rows, { id: "z", dept: null }], byDept);
      expect(out.flatMap((g) => g.items.map((i) => i.id)).sort()).toEqual([
        "a",
        "b",
        "c",
        "d",
        "z",
      ]);
    });

    it("รักษาลำดับเดิมของรายการภายในกลุ่ม", () => {
      expect(shape(groupItems(rows, byDept))[0]!).toEqual([
        "Cardiology",
        ["a", "c"],
      ]);
    });

    it("รายการว่างคืนอาร์เรย์ว่าง", () => {
      expect(groupItems([], byDept)).toEqual([]);
    });

    it("groupOrder ว่างมีผลเท่ากับไม่ส่ง", () => {
      expect(shape(groupItems(rows, byDept, []))).toEqual(
        shape(groupItems(rows, byDept)),
      );
    });
  });
});
