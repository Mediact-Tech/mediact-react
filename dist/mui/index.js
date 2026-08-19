import {
  TYPE_SCALE,
  TYPE_SCALE_DEFAULT_WEIGHT
} from "../chunk-4WZ3XEF5.js";

// src/mui/index.ts
var LEGACY_COEFFICIENT = 12.3 / 14;
var round = (n) => Math.round(n * 1e3) / 1e3;
function variant(fontSize, lineHeight, fontWeight, legacy) {
  const size = legacy ? round(fontSize * LEGACY_COEFFICIENT) : fontSize;
  return {
    fontSize: `${round(size / 16)}rem`,
    // คง line-height เป็นอัตราส่วน ไม่ใช่ px — จะได้สเกลตามขนาดตัวอักษรเสมอ
    lineHeight: round(lineHeight / fontSize),
    fontWeight
  };
}
function createMuiTypography(options = {}) {
  const {
    fontFamily,
    htmlFontSize = 16,
    preserveLegacyScale = false
  } = options;
  const legacy = preserveLegacyScale;
  const s = TYPE_SCALE;
  const w = TYPE_SCALE_DEFAULT_WEIGHT;
  return {
    ...fontFamily ? { fontFamily } : {},
    htmlFontSize,
    /** ค่าฐานของ MUI — ระบุไว้เท่ากับ `body-md` เพื่อไม่ให้ variant ไหนต้องพึ่งการคูณ
     *  (นี่คือช่องที่ `12.3` เคยอยู่ และเป็นเหตุที่ทุกอย่างเลื่อนพร้อมกัน) */
    fontSize: legacy ? round(16 * LEGACY_COEFFICIENT) : 16,
    // ── หัวข้อ ─────────────────────────────────────────────
    // h1-h3 ไม่ถูกแมป: type scale ของ DS สูงสุดที่ 30px (`title-lg`) ส่วน default
    // ของ MUI คือ 96/60/48 ซึ่งไม่มีการใช้จริงในแอป (audit พบ h1-h4 รวมกันไม่ถึง
    // 10 จุด เทียบกับ h6 ที่ 20) — การเติม tier ระดับ display เป็นข้อที่ยังไม่เคาะ
    // จึงปล่อยให้เป็นค่า MUI เดิม ดีกว่าเดาค่าที่ไม่มีใครขอ
    h4: variant(s["title-lg"].fontSize, s["title-lg"].lineHeight, 600, legacy),
    h5: variant(s["title-md"].fontSize, s["title-md"].lineHeight, 600, legacy),
    h6: variant(s["title-sm"].fontSize, s["title-sm"].lineHeight, w["title-sm"], legacy),
    // ── เนื้อความ ──────────────────────────────────────────
    subtitle1: variant(s["body-md"].fontSize, s["body-md"].lineHeight, 500, legacy),
    subtitle2: variant(s["body-sm"].fontSize, s["body-sm"].lineHeight, 500, legacy),
    body1: variant(s["body-md"].fontSize, s["body-md"].lineHeight, w["body-md"], legacy),
    body2: variant(s["body-sm"].fontSize, s["body-sm"].lineHeight, w["body-sm"], legacy),
    // ── อื่น ๆ ─────────────────────────────────────────────
    button: {
      ...variant(s["body-sm"].fontSize, s["body-sm"].lineHeight, 500, legacy),
      // ระบบนี้เป็นภาษาไทย — uppercase ทำให้ข้อความไทยไม่เปลี่ยน แต่ปุ่มภาษาอังกฤษ
      // จะกลายเป็นตัวใหญ่ทั้งหมดโดยไม่มีใครสั่ง
      textTransform: "none"
    },
    caption: variant(s.caption.fontSize, s.caption.lineHeight, w.caption, legacy),
    overline: {
      ...variant(s.caption.fontSize, s.caption.lineHeight, 500, legacy),
      letterSpacing: "0.08em",
      textTransform: "uppercase"
    }
  };
}
export {
  TYPE_SCALE,
  TYPE_SCALE_DEFAULT_WEIGHT,
  createMuiTypography
};
//# sourceMappingURL=index.js.map