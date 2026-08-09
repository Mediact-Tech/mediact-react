export { T as TYPE_SCALE, a as TYPE_SCALE_DEFAULT_WEIGHT, b as TypeScaleEntry, c as TypeScaleToken } from '../type-scale-Cv-4FG73.js';

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
/** รูปของ variant หนึ่งตัวใน `theme.typography` — subset ที่เราตั้งค่าจริง */
type MuiTypographyVariant = {
    fontSize: string;
    lineHeight: number;
    fontWeight: number;
};
type CreateMuiTypographyOptions = {
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
declare function createMuiTypography(options?: CreateMuiTypographyOptions): {
    htmlFontSize: number;
    /** ค่าฐานของ MUI — ระบุไว้เท่ากับ `body-md` เพื่อไม่ให้ variant ไหนต้องพึ่งการคูณ
     *  (นี่คือช่องที่ `12.3` เคยอยู่ และเป็นเหตุที่ทุกอย่างเลื่อนพร้อมกัน) */
    fontSize: number;
    h4: MuiTypographyVariant;
    h5: MuiTypographyVariant;
    h6: MuiTypographyVariant;
    subtitle1: MuiTypographyVariant;
    subtitle2: MuiTypographyVariant;
    body1: MuiTypographyVariant;
    body2: MuiTypographyVariant;
    button: {
        textTransform: "none";
        fontSize: string;
        lineHeight: number;
        fontWeight: number;
    };
    caption: MuiTypographyVariant;
    overline: {
        letterSpacing: string;
        textTransform: "uppercase";
        fontSize: string;
        lineHeight: number;
        fontWeight: number;
    };
    fontFamily?: string | undefined;
};

export { type CreateMuiTypographyOptions, type MuiTypographyVariant, createMuiTypography };
