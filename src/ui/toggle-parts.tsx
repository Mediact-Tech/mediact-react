/** @doc ./toggle.md */
import * as React from "react";
import { cn } from "../lib/cn";

/* ────────────────────────────────────────────────────────────────────────────
 * ชิ้นส่วนที่ Checkbox · CheckboxGroup · RadioGroup ใช้ร่วมกัน
 *
 * ทำไมต้องแยกออกมา: ก่อนหน้านี้ "กล่องติ๊ก" ถูกเขียนซ้ำ 3 ที่ (`Checkbox.tsx`
 * `CheckboxGroup.tsx` `RadioGroup.tsx`) และ **มันเพี้ยนกันไปแล้วจริง ๆ** —
 * Checkbox เป็น `size-5` แต่ RadioGroupItem เป็น `size-4` ทั้งที่สองอันนี้
 * ยืนอยู่ในฟอร์มเดียวกัน นี่คือรูปแบบความผิดพลาดเดียวกับที่ทำให้เกิด 453 สี
 * ในโปรเจกต์นี้ — เขียนซ้ำแล้วแก้ไม่ครบ
 * ──────────────────────────────────────────────────────────────────────────── */

export type ToggleSize = "sm" | "md";

/**
 * ขนาดของตัวควบคุม
 *
 * `md` 20px คือค่าเริ่มต้น · `sm` 16px สำหรับแถวตารางที่แน่น
 *
 * 📐 ที่มาของตัวเลข (วัดจากของจริง 2026-08-09):
 * - radio ของทั้ง Portal · MediHR · Medimatch = **20px** ตรงกันหมด
 * - checkbox ของสามแอปเดียวกัน = **16px**
 * ⇒ ในฟอร์มเดียวกัน สองตัวนี้ขนาดไม่เท่ากันอยู่แล้วโดยไม่มีเหตุผล
 *   ที่นี่จึงบังคับให้ทั้งคู่เท่ากัน แล้วเปิด `sm` ไว้ให้แถวตารางที่เคยเป็น 16px
 */
const SIZES = {
  sm: {
    box: "size-4",
    /* เครื่องหมายถูก 12px ในกล่อง 16px = 75% — ของจริงใช้ `size-[70%]` */
    glyph: "size-3",
    /* จุดกลางของ radio 8px ในกล่อง 16px */
    dot: "after:size-2",
    /* กล่อง 16px เทียบกับบรรทัดข้อความ 20px ⇒ ต้องดัน 2px ให้อยู่กลางบรรทัด */
    align: "mt-0.5",
  },
  md: {
    box: "size-5",
    glyph: "size-3.5",
    dot: "after:size-2.5",
    /* กล่อง 20px = ความสูงบรรทัดข้อความพอดี ⇒ ไม่ต้องเลื่อน */
    align: "mt-0",
  },
} as const satisfies Record<ToggleSize, Record<string, string>>;

export const toggleGlyphClass = (size: ToggleSize) => SIZES[size].glyph;

/**
 * ความหนาเส้นของเครื่องหมายถูก/ขีดกลาง
 *
 * ค่าเริ่มต้นของ lucide คือ 2 ซึ่งบางเกินไปเมื่อย่อเหลือ 12–14px —
 * ทั้งสามแอปเลือก `strokeWidth={3}` เหมือนกันโดยไม่ได้นัดกัน
 */
export const TOGGLE_GLYPH_STROKE = 3;

/** คลาสที่ตัวควบคุมทุกตัวใช้เหมือนกัน — โฟกัส · ปิดใช้งาน · พื้น */
const controlBase = [
  "peer relative flex shrink-0 items-center justify-center border bg-bg-default transition-colors",
  "cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
  /* 🔴 วงแหวนโฟกัสต้องเป็นสีของแบรนด์ **ไม่ใช่สีแดง**
   * ของจริงทั้ง Portal · MediHR · Medimatch ใช้ `ring-cherry-red-600/50`
   * (วัดแล้ว: `#e02c2c` ที่ 50%) ซึ่งเป็นสีเดียวกับข้อความผิดพลาด —
   * กด Tab มาถึงช่องติ๊กธรรมดาแล้วขึ้นวงแดง คนอ่านว่า "กรอกผิด"
   * เกือบแน่นอนว่าลอกมาจากสไตล์ error แล้วไม่มีใครกด Tab ดู */
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2",
].join(" ");

/**
 * รูปทรงกล่องติ๊ก
 *
 * 📐 มุมโค้ง 2px (`rounded-xs`) — วัดจาก Portal ได้ `border-radius: 2px` เป๊ะ
 * ของเดิมใน DS เป็น `rounded-sm` ซึ่งใน Tailwind v4 = 4px คนละค่า
 */
export function checkboxShapeClasses(size: ToggleSize = "md") {
  return cn(
    controlBase,
    SIZES[size].box,
    "rounded-xs border-border-input",
    "data-[state=checked]:border-brand data-[state=checked]:bg-brand",
    "data-[state=indeterminate]:border-brand data-[state=indeterminate]:bg-brand",
  );
}

/**
 * รูปทรงปุ่มตัวเลือกเดียว
 *
 * 🔴 เลือกแล้ว = **ขอบบาง + จุดทึบตรงกลาง** ไม่ใช่ "วงแหวนหนาเจาะรูขาว"
 * ของจริง Portal/MediHR ใช้ `data-[state=checked]:border-[6px]` แล้ววาดจุด **ขาว**
 * ทับตรงกลาง ⇒ ภาพที่ได้คือวงกลมทึบที่ถูกเจาะรู ซึ่งกลับด้าน figure/ground:
 * สิ่งที่ "ถูกเลือก" กลายเป็นช่องว่าง ส่วนขอบกลายเป็นเนื้อ
 * และเทคนิคนี้พังทันทีเมื่อเปลี่ยนขนาด — 6px บนกล่อง 16px เหลือรูแค่ 4px
 * Medimatch ทำแบบขอบบาง+จุด ซึ่งตรงกับที่ทุกระบบใช้กัน จึงเอาแบบนั้น
 */
export function radioShapeClasses(size: ToggleSize = "md") {
  return cn(
    controlBase,
    SIZES[size].box,
    "rounded-full border-border-input",
    "data-[state=checked]:border-brand",
  );
}

/** คลาสของจุดกลางใน radio — ใส่บน `RadixRadio.Indicator` */
export function radioDotClasses(size: ToggleSize = "md") {
  return cn(
    "flex size-full items-center justify-center after:rounded-full after:bg-brand",
    SIZES[size].dot,
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * แถวป้ายกำกับ
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * คลาสของ `<label>` ที่ครอบกล่อง + ข้อความ
 *
 * 🔴 สีข้อความคือ `text-text-body` **ไม่ใช่ `text-text-primary`**
 * `--color-text-primary` ใน `theme.css` ถูก alias ไปที่ `--color-brand`
 * ⇒ ป้าย "ยอมรับเงื่อนไข" จะเปลี่ยนสีตามแบรนด์ของแต่ละแอป ซึ่งไม่มีเหตุผล
 * และ `--color-text-body` = `#535a61` ซึ่ง **ตรงกับที่วัดได้จาก Portal เป๊ะ**
 * (`rgb(83, 90, 97)`) — ไม่ใช่การเดา
 */
export function toggleLabelClasses(
  disabled?: boolean,
  /**
   * `start` — ตัวควบคุมตรงกับบรรทัดแรก ใช้กับ checkbox/radio ที่กล่องสูงเท่าบรรทัดพอดี
   * `center` — ตัวควบคุมอยู่กลางแถว ใช้กับ `Switch` ที่รางสูง 24px มากกว่าบรรทัด 20px
   *   (ของจริง `ActionSwitch` ของ Portal ก็ใช้ `items-center`)
   */
  align: "start" | "center" = "start",
) {
  return cn(
    "inline-flex gap-2 text-body-sm font-medium text-text-body",
    align === "center" ? "items-center" : "items-start",
    disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
  );
}

export type ToggleTextProps = {
  children?: React.ReactNode;
  description?: React.ReactNode;
};

/**
 * คอลัมน์ข้อความข้างกล่อง — ป้ายกำกับ + คำอธิบาย
 *
 * ⚠️ บรรทัดแรกใช้ `leading-5` (20px) จงใจ ไม่ใช่ `leading-tight`
 * เพราะ 20px คือความสูงของกล่องขนาด `md` พอดี ⇒ ขอบบนของกล่องกับขอบบนของ
 * บรรทัดแรกตรงกันโดยโครงสร้าง ไม่ต้องมาไล่ปรับ margin ทีหลัง
 * (`leading-tight` = 1.25 × 14px = 17.5px ซึ่งเตี้ยกว่ากล่อง 2.5px)
 */
export function ToggleText({ children, description }: ToggleTextProps) {
  if (children == null && description == null) return null;
  return (
    <span className="flex flex-col gap-0.5">
      {children != null && <span className="leading-5">{children}</span>}
      {description != null && (
        <span className="text-caption font-normal leading-4 text-text-tertiary">
          {description}
        </span>
      )}
    </span>
  );
}

/** คลาสจัดตำแหน่งกล่องให้ตรงกับบรรทัดแรกของข้อความ */
export const toggleAlignClass = (size: ToggleSize) => SIZES[size].align;

/* ────────────────────────────────────────────────────────────────────────────
 * สวิตช์
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * รูปทรงรางของสวิตช์ — 44×24 ขอบโปร่ง 2px ปุ่มเลื่อน 20px
 *
 * 📐 วัดจาก Portal (ไฟล์เดียวกับ MediHR ทุกไบต์): ราง 44×24 · `border-2` โปร่ง ·
 * ปุ่ม 20px ⇒ ระยะเลื่อน = 44 − 2×2 − 20 = 20px พอดี (`translate-x-5`)
 *
 * 🔴 **"เปิด" เป็นสีเขียว ไม่ใช่สีแบรนด์**
 * นับของจริงได้ 6 แบบใน 4 แอป และ 5 ใน 6 แบบใช้เขียว:
 * `#0CB679` (Portal/MediHR) · `#0BB767` (Medimatch VisibilityToggle) ·
 * `#10b981` (MediHR ตั้งเป็นโทเคนชื่อ `--color-switch-on` เลย) ·
 * success-green (Portal ProductAccessToggle) — มีแต่ Mediwork MUI ที่ใช้ primary
 * และไฟล์เดียวในนั้นยัง override เป็นน้ำเงิน `#1565C0`
 * เหตุผลเชิงความหมายก็ตรงกัน: เปิด/ปิดคือ **สถานะ** ไม่ใช่แบรนด์
 * — เหตุผลเดียวกับที่ตัวเลขในตารางไม่เปลี่ยนสีตามแอป
 *
 * ⚠️ รางตอนปิดใช้ `gray-200` = `#e5e7eb` ซึ่ง **ตรงกับที่วัดได้เป๊ะ**
 */
export const switchTrackClasses = cn(
  "peer relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent transition-colors",
  "cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2",
  "bg-gray-200 data-[state=checked]:bg-success-green-primary",
);

/**
 * ปุ่มเลื่อน
 *
 * ⚠️ **ขาวเสมอ** — ของจริง Portal/MediHR เปลี่ยนปุ่มเป็นเขียวเข้ม `#0CB679`
 * บนรางเขียวอ่อน `#85E0BA` ซึ่งวัดได้คอนทราสต์ปุ่มต่อราง **1.68:1**
 * คือปุ่มแทบละลายหายไปในรางตอนเปิด — ตรงข้ามกับหน้าที่ของมัน
 * ปุ่มขาวบนเขียว `#0bb767` ได้ 2.63:1 และมีเงาช่วยอีกชั้น
 */
export const switchThumbClasses = cn(
  "pointer-events-none flex size-5 items-center justify-center rounded-full bg-bg-default shadow-md ring-0 transition-transform",
  "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
);

/* ────────────────────────────────────────────────────────────────────────────
 * สวิตช์แบบมีข้อความอยู่ในราง
 *
 * ใช้ในการ์ดหน่วยงานของ MediHR (`SubUnitActiveToggle`) — รางกว้างตามข้อความ
 * ปุ่มเลื่อนสลับข้าง ไม่ได้เลื่อนด้วย transform
 *
 * 📐 วัดจาก MediHR: สูง 24 · pad 2 · gap 4 · ปุ่ม 20 · เปิด = **ปุ่มอยู่ขวา**
 * (คอมเมนต์ในไฟล์ต้นทางเขียนว่าปุ่มอยู่ซ้าย — ผิด วัดแล้วอยู่ขวา)
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * รางแบบมีข้อความ — ความกว้างไม่คงที่ ขึ้นกับข้อความที่ยาวที่สุด
 *
 * `group/switch` จำเป็น เพราะลูก ๆ ต้องอ่าน `data-state` ของราง
 * (Radix ใส่ `data-state` ไว้ที่ root เท่านั้น)
 */
export const switchLabeledTrackClasses = cn(
  "group/switch peer relative inline-flex h-6 items-center gap-1 rounded-full px-0.5 transition-colors",
  "cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2",
  "bg-gray-200 data-[state=checked]:bg-success-green-primary",
);

/** ปุ่มเลื่อนของแบบมีข้อความ — **สลับข้างด้วย `order`** ไม่ใช่ `translate` */
export const switchLabeledThumbClasses = cn(
  "pointer-events-none flex size-5 shrink-0 items-center justify-center rounded-full bg-bg-default shadow",
  "order-1 group-data-[state=checked]/switch:order-2",
);

/**
 * ช่องข้อความในราง
 *
 * ⚠️ **วางสองคำซ้อนกันใน grid cell เดียว** แล้วซ่อนอันที่ไม่ใช้ด้วย `invisible`
 * ⇒ ความกว้างราง = คำที่ยาวกว่าเสมอ **สลับแล้วรางไม่ขยับ**
 * ของจริง MediHR วัดได้ `Active` 57.94px → `Inactive` 65.38px คือกระตุก 7.4px
 * ทุกครั้งที่กด และการ์ดทั้งแถวเลื่อนตาม
 *
 * 📐 ตัวอักษร 12px (`text-caption`) ไม่ใช่ 8px ของจริง — 8px อ่านไม่ออก
 * โดยเฉพาะภาษาไทยที่มีวรรณยุกต์ ราคาที่จ่ายคือรางกว้างขึ้นราว 13px
 */
export const switchTrackLabelClasses = cn(
  "grid px-1.5 text-caption font-semibold whitespace-nowrap",
  "order-2 group-data-[state=checked]/switch:order-1",
);

/** คลาสของคำแต่ละคำ — ซ้อนช่องเดียวกันทั้งคู่ */
export const switchTrackLabelItemClasses = "col-start-1 row-start-1";
