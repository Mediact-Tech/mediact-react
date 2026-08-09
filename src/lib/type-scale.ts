/** Type scale — แหล่งเดียวที่นิยามขนาดตัวอักษรของ design system
 *
 * ค่าในไฟล์นี้ต้องตรงกับ `--text-*` ใน `@mediact/tokens` (`packages/tokens/src/theme.css`)
 * เสมอ — CSS token เสิร์ฟฝั่ง Tailwind (`text-body-md`) ส่วนไฟล์นี้เสิร์ฟฝั่งที่อ่านค่า
 * เป็นตัวเลขไม่ได้ผ่าน utility class: `createMuiTypography()` สำหรับ MUI theme
 * และ story/test ที่ต้อง assert ขนาดจริง
 *
 * ที่มาของ 7 ระดับ: จุดตัดระหว่าง Tailwind v4 stock scale (portal-web /
 * medimatch-bo ใช้อยู่แล้ว) กับ MUI variant defaults (mediwork-bo จะได้เมื่อถอด
 * `typography.fontSize: 12.3` ออก) — ทั้งสองฝั่งบรรจบกันที่ค่าชุดนี้อยู่แล้ว
 */

export type TypeScaleToken =
  | "caption"
  | "body-sm"
  | "body-md"
  | "body-lg"
  | "title-sm"
  | "title-md"
  | "title-lg";

export type TypeScaleEntry = {
  /** px — ค่าที่ render จริงเมื่อ root font-size = 16px */
  fontSize: number;
  /** px */
  lineHeight: number;
  /** unitless ratio — รูปที่ MUI และ CSS `line-height` รับตรง ๆ */
  lineHeightRatio: number;
  /** rem string — ตรงกับค่าใน CSS token */
  rem: string;
};

export const TYPE_SCALE: Record<TypeScaleToken, TypeScaleEntry> = {
  caption: { fontSize: 12, lineHeight: 16, lineHeightRatio: 16 / 12, rem: "0.75rem" },
  "body-sm": { fontSize: 14, lineHeight: 20, lineHeightRatio: 20 / 14, rem: "0.875rem" },
  "body-md": { fontSize: 16, lineHeight: 24, lineHeightRatio: 24 / 16, rem: "1rem" },
  "body-lg": { fontSize: 18, lineHeight: 28, lineHeightRatio: 28 / 18, rem: "1.125rem" },
  "title-sm": { fontSize: 20, lineHeight: 28, lineHeightRatio: 28 / 20, rem: "1.25rem" },
  "title-md": { fontSize: 24, lineHeight: 32, lineHeightRatio: 32 / 24, rem: "1.5rem" },
  "title-lg": { fontSize: 30, lineHeight: 36, lineHeightRatio: 36 / 30, rem: "1.875rem" },
};

/** น้ำหนักที่ระดับหนึ่ง ๆ ใช้จริงในโค้ดของทั้ง 3 แอป
 *
 * ข้อมูลจาก audit แยกตัวเองที่ 18/20px: ต่ำกว่านั้นเป็น weight 400 โดยปริยาย
 * ตั้งแต่ `title-sm` ขึ้นไปพบเฉพาะ 600/700 — เป็นเหตุผลที่ `Text` กับ `Heading`
 * แยกเป็นคนละ component แทนที่จะเป็นตัวเดียวที่รับ union ของทุก prop
 */
export const TYPE_SCALE_DEFAULT_WEIGHT: Record<TypeScaleToken, 400 | 600> = {
  caption: 400,
  "body-sm": 400,
  "body-md": 400,
  "body-lg": 400,
  "title-sm": 600,
  "title-md": 600,
  "title-lg": 600,
};
