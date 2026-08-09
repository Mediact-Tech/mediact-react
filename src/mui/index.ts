/** MUI bridge — ให้แอปที่เป็น MUI ใช้ type scale ชุดเดียวกับฝั่ง Tailwind
 *
 * ทำไมต้องมี: `mediact-web-backoffice` เป็น MUI ทั้งแอป (249/333 ไฟล์) จึงรับ
 * `--text-*` ที่เป็น Tailwind utility ไม่ได้โดยตรง ไฟล์นี้แปลง `TYPE_SCALE`
 * ตัวเดียวกันให้เป็น `theme.typography` object ที่ MUI กินได้
 *
 * ⚠️ **DS ไม่ import MUI** — MUI ไม่ใช่ dependency ของ package นี้และจะไม่เป็น
 * ฟังก์ชันนี้จึงคืน plain object ที่มีรูปตรงกับ `TypographyOptions` ของ MUI
 * ฝั่ง consumer ส่งเข้า `createTheme({ typography: createMuiTypography(...) })` ได้เลย
 * โดย TS ยอมรับเพราะรูปตรงกัน (structural typing) ไม่ต้อง cast
 */

import { TYPE_SCALE, TYPE_SCALE_DEFAULT_WEIGHT } from "../lib/type-scale";

/** รูปของ variant หนึ่งตัวใน `theme.typography` — subset ที่เราตั้งค่าจริง */
export type MuiTypographyVariant = {
  fontSize: string;
  lineHeight: number;
  fontWeight: number;
};

export type CreateMuiTypographyOptions = {
  /** ฟอนต์ของแอป — ปกติส่ง `notoSansThai.style.fontFamily` จาก `next/font` */
  fontFamily?: string;
  /** ค่า `htmlFontSize` ของ MUI (default 16 ตามค่าปกติของเบราว์เซอร์) */
  htmlFontSize?: number;
  /**
   * ค้างขนาดปัจจุบันของ mediwork ไว้ แทนที่จะใช้ค่าจริงจาก `TYPE_SCALE`
   *
   * `mediact-web-backoffice` ตั้ง `typography.fontSize: 12.3` ไว้ (ค่าปกติของ MUI คือ 14)
   * ผลคือ **ทุก variant เล็กลง 12.14% พร้อมกัน** ผ่านสัมประสิทธิ์ตัวเดียว ซึ่งเป็นกลไก
   * ที่ทำให้ขนาดตัวอักษรทั้งแอปเพี้ยนโดยไม่มีใครตั้งใจ
   *
   * ตั้ง `true` เพื่อ **ถอดกลไกนั้นออกโดยหน้าตาไม่เปลี่ยนเลยสักพิกเซล** — ทุก variant
   * จะถูกระบุค่าตรง ๆ เท่ากับที่เห็นอยู่วันนี้ แทนที่จะเกิดจากการคูณ
   * แล้วค่อยเปลี่ยนเป็น `false` ใน PR แยกที่ QA เฉพาะ (ตัวอักษรจะโตขึ้น 13.8% ทุกจุด
   * และ `fontSize:` ที่ hardcode ไว้ 894 จุดจะไม่ขยับตาม ต้องไล่เก็บต่างหาก)
   *
   * @default false
   */
  preserveLegacyScale?: boolean;
};

/** ตัวคูณที่ mediwork ใช้อยู่จริงวันนี้: 12.3 / 14 */
const LEGACY_COEFFICIENT = 12.3 / 14;

const round = (n: number) => Math.round(n * 1000) / 1000;

function variant(
  fontSize: number,
  lineHeight: number,
  fontWeight: number,
  legacy: boolean,
): MuiTypographyVariant {
  const size = legacy ? round(fontSize * LEGACY_COEFFICIENT) : fontSize;
  return {
    fontSize: `${round(size / 16)}rem`,
    // คง line-height เป็นอัตราส่วน ไม่ใช่ px — จะได้สเกลตามขนาดตัวอักษรเสมอ
    lineHeight: round(lineHeight / fontSize),
    fontWeight,
  };
}

/** สร้าง `theme.typography` จาก type scale กลางของ design system
 *
 * @example
 * ```ts
 * import { createTheme } from "@mui/material/styles";
 * import { createMuiTypography } from "@mediact/react/mui";
 *
 * const theme = createTheme({
 *   typography: createMuiTypography({
 *     fontFamily: notoSansThai.style.fontFamily,
 *     preserveLegacyScale: true, // ขั้นที่ 1: ถอดกลไกออกโดยหน้าตาไม่เปลี่ยน
 *   }),
 * });
 * ```
 */
export function createMuiTypography(options: CreateMuiTypographyOptions = {}) {
  const {
    fontFamily,
    htmlFontSize = 16,
    preserveLegacyScale = false,
  } = options;
  const legacy = preserveLegacyScale;
  const s = TYPE_SCALE;
  const w = TYPE_SCALE_DEFAULT_WEIGHT;

  return {
    ...(fontFamily ? { fontFamily } : {}),
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
      textTransform: "none" as const,
    },
    caption: variant(s.caption.fontSize, s.caption.lineHeight, w.caption, legacy),
    overline: {
      ...variant(s.caption.fontSize, s.caption.lineHeight, 500, legacy),
      letterSpacing: "0.08em",
      textTransform: "uppercase" as const,
    },
  };
}

export { TYPE_SCALE, TYPE_SCALE_DEFAULT_WEIGHT } from "../lib/type-scale";
export type { TypeScaleToken, TypeScaleEntry } from "../lib/type-scale";
