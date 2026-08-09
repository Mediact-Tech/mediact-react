import { describe, it, expect } from "vitest";
import { createMuiTypography } from "./index";
import { TYPE_SCALE } from "../lib/type-scale";

/** px ที่ variant หนึ่งจะ render จริงเมื่อ root = 16px */
const px = (v: { fontSize: string }) => parseFloat(v.fontSize) * 16;

describe("createMuiTypography", () => {
  describe("preserveLegacyScale: true — ขั้นที่ 1 ของ rollout", () => {
    const t = createMuiTypography({ preserveLegacyScale: true });

    /** เกณฑ์ตัดสินของขั้นนี้: ถอด `fontSize: 12.3` ออกได้โดยผู้ใช้ต้องมองไม่เห็นความต่าง
     *  ค่าที่คาดมาจากการคูณจริงของ MUI วันนี้ (variant default × 12.3/14) */
    it("คืนขนาดเท่ากับที่ mediwork แสดงอยู่วันนี้", () => {
      expect(px(t.body2)).toBeCloseTo(12.3, 1); // 14 × 0.8786
      expect(px(t.button)).toBeCloseTo(12.3, 1);
      expect(px(t.body1)).toBeCloseTo(14.1, 1); // 16 × 0.8786
      expect(px(t.subtitle1)).toBeCloseTo(14.1, 1);
      expect(px(t.caption)).toBeCloseTo(10.5, 1); // 12 × 0.8786
      expect(px(t.h6)).toBeCloseTo(17.6, 1); // 20 × 0.8786
      expect(px(t.h5)).toBeCloseTo(21.1, 1); // 24 × 0.8786
    });

    it("fontSize ฐานก็ถูกค้างไว้ ไม่ใช่แค่ variant", () => {
      expect(t.fontSize).toBeCloseTo(14.06, 1);
    });
  });

  describe("default — ขั้นที่ 2 ของ rollout", () => {
    const t = createMuiTypography();

    it("คืนค่าจริงจาก TYPE_SCALE", () => {
      expect(px(t.body2)).toBe(TYPE_SCALE["body-sm"].fontSize); // 14
      expect(px(t.body1)).toBe(TYPE_SCALE["body-md"].fontSize); // 16
      expect(px(t.caption)).toBe(TYPE_SCALE.caption.fontSize); // 12
      expect(px(t.h6)).toBe(TYPE_SCALE["title-sm"].fontSize); // 20
      expect(px(t.h5)).toBe(TYPE_SCALE["title-md"].fontSize); // 24
      expect(px(t.h4)).toBe(TYPE_SCALE["title-lg"].fontSize); // 30
    });

    /** ตัวเลขที่ audit ใช้สื่อสารกับทีม — ถ้าเปลี่ยน ต้องเปลี่ยนเอกสารด้วย */
    it("ตัวอักษรโตขึ้น 13.8% เทียบกับ legacy", () => {
      const legacy = createMuiTypography({ preserveLegacyScale: true });
      expect(px(t.body2) / px(legacy.body2)).toBeCloseTo(1.138, 2);
    });

    /** caption ที่ 10.5px ต่ำกว่าเกณฑ์อ่านง่ายทั่วไป — ข้อนี้คือ accessibility ไม่ใช่ความสวย */
    it("caption กลับขึ้นมาที่ 12px", () => {
      expect(px(t.caption)).toBe(12);
    });
  });

  describe("รูปของ object", () => {
    const t = createMuiTypography({ fontFamily: "Noto Sans Thai" });

    it("line-height เป็นอัตราส่วน ไม่ใช่ px — จะได้สเกลตามขนาดตัวอักษร", () => {
      expect(t.body1.lineHeight).toBeCloseTo(1.5, 2); // 24/16
      expect(t.body2.lineHeight).toBeCloseTo(1.429, 2); // 20/14
      expect(typeof t.body1.lineHeight).toBe("number");
    });

    it("ส่ง fontFamily ต่อเมื่อได้รับมา", () => {
      expect(t.fontFamily).toBe("Noto Sans Thai");
      expect(createMuiTypography()).not.toHaveProperty("fontFamily");
    });

    /** ระบบเป็นภาษาไทย — uppercase ทำอะไรกับข้อความไทยไม่ได้ แต่จะทำให้ปุ่มภาษาอังกฤษ
     *  กลายเป็นตัวใหญ่ทั้งหมดโดยไม่มีใครสั่ง */
    it("ปุ่มไม่ถูกบังคับเป็นตัวพิมพ์ใหญ่", () => {
      expect(t.button.textTransform).toBe("none");
    });

    it("h1-h3 ไม่ถูกแมป — ปล่อยเป็นค่าเดิมของ MUI", () => {
      expect(t).not.toHaveProperty("h1");
      expect(t).not.toHaveProperty("h2");
      expect(t).not.toHaveProperty("h3");
    });
  });
});
