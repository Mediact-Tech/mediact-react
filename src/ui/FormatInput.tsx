import * as React from "react";
import {
  NumberFormatBase,
  NumericFormat,
  PatternFormat,
} from "react-number-format";
import { Input, type InputProps } from "./Input";

/* ────────────────────────────────────────────────────────────────────────────
 * FormatInput — ช่องกรอกที่จัดรูปแบบระหว่างพิมพ์
 *
 * ใช้ `Input` ตัวเดิมเป็นฐานทั้งหมด (`customInput={Input}`) จึงได้ป้ายลอย ไอคอน
 * สถานะ error ขนาด และโครงร่างตอนโหลด เหมือนกันเป๊ะ ไม่มีอะไรต้องดูแลซ้ำ
 *
 * 📌 ไม่ได้เขียนตัวจัดรูปแบบเอง — ใช้ `react-number-format` ซึ่ง
 *    **อยู่ในสแตกอยู่แล้ว** (Medimatch + Mediwork ใช้กับช่องค่าจ้าง 3 จุด)
 *    เหตุผลที่ไม่เขียนเอง: การคืนตำแหน่งเคอร์เซอร์หลังแทรกอักขระคั่นกลางสตริง
 *    เป็นจุดที่พังง่ายที่สุดของ input แบบ mask และ lib นี้แก้ไว้แล้ว
 *
 * ⚠️ `onValueChange` คืน **ค่าดิบ** (ไม่มีตัวคั่น) เสมอ — สิ่งที่ส่งขึ้นหลังบ้าน
 *    ต้องเป็นค่าดิบ ไม่ใช่สิ่งที่ตาเห็น
 * ──────────────────────────────────────────────────────────────────────────── */

/** รูปแบบสำเร็จรูป — เพิ่มได้ แต่ต้องมีของจริงมารองรับก่อน */
export const FORMAT_PRESETS = {
  /** เลขบัตรประชาชนไทย 13 หลัก — 1-2345-67890-12-3 */
  thaiId: { kind: "pattern", pattern: "#-####-#####-##-#", digits: 13 },
  /** เบอร์มือถือไทย 10 หลัก — 081-234-5678 */
  phone: { kind: "pattern", pattern: "###-###-####", digits: 10 },
  /** เลขบัญชีธนาคารไทย 10 หลัก — 123-4-56789-0 */
  bankAccount: { kind: "pattern", pattern: "###-#-#####-#", digits: 10 },
  /** จำนวนเงิน — ค่าเดียวกับที่ Medimatch ใช้อยู่กับช่องค่าจ้าง */
  currency: { kind: "numeric" },
} as const;

export type FormatPreset = keyof typeof FORMAT_PRESETS;

/** รูปแบบที่เขียนเอง — ให้ทั้งขาจัดและขาถอด ไม่งั้นค่าที่ส่งกลับจะเป็นค่าที่จัดแล้ว */
export type CustomFormat = {
  /** ค่าดิบ → สิ่งที่แสดงบนจอ */
  format: (raw: string) => string;
  /** สิ่งที่อยู่บนจอ → ค่าดิบ · ไม่ส่ง = ตัดทุกอย่างที่ไม่ใช่ตัวเลข */
  removeFormatting?: (formatted: string) => string;
};

export type FormatInputProps = Omit<
  InputProps,
  "value" | "defaultValue" | "onChange" | "type"
> & {
  /** ชื่อรูปแบบสำเร็จรูป · สตริง mask (`"#-####-#####-##-#"`) · หรือฟังก์ชันเอง */
  format: FormatPreset | string | CustomFormat;
  value?: string;
  /** คืน **ค่าดิบ** เสมอ — ไม่มีตัวคั่น */
  onValueChange?: (raw: string) => void;
  /** แสดง `_` ในช่องที่ยังไม่ได้กรอก (เฉพาะรูปแบบที่เป็น mask) */
  showMask?: boolean;
  /** ตัวคั่นหลักพัน · เฉพาะรูปแบบตัวเลข */
  thousandSeparator?: string;
  /** จำนวนทศนิยม · เฉพาะรูปแบบตัวเลข */
  decimalScale?: number;
  allowNegative?: boolean;
};

const digitsOnly = (v: string) => v.replace(/\D/g, "");

function FormatInput({
  format,
  value,
  onValueChange,
  showMask,
  thousandSeparator = ",",
  decimalScale = 2,
  allowNegative = false,
  ...rest
}: FormatInputProps) {
  const spec =
    typeof format === "string" && format in FORMAT_PRESETS
      ? FORMAT_PRESETS[format as FormatPreset]
      : format;

  // เขียนเอง — ผ่าน NumberFormatBase ที่รับทั้งขาจัดและขาถอด
  if (typeof spec === "object" && "format" in spec) {
    return (
      <NumberFormatBase<InputProps>
        customInput={Input}
        value={value}
        format={spec.format}
        removeFormatting={spec.removeFormatting ?? digitsOnly}
        onValueChange={(v) => onValueChange?.(v.value)}
        {...rest}
      />
    );
  }

  // ตัวเลข/จำนวนเงิน
  if (typeof spec === "object" && spec.kind === "numeric") {
    return (
      <NumericFormat<InputProps>
        customInput={Input}
        value={value}
        thousandSeparator={thousandSeparator}
        decimalScale={decimalScale}
        allowNegative={allowNegative}
        onValueChange={(v) => onValueChange?.(v.value)}
        /* ล้อ Medimatch: หมุนล้อเมาส์บนช่องตัวเลขไม่ควรเปลี่ยนค่า */
        onWheel={(e) => (e.target as HTMLInputElement).blur()}
        {...rest}
      />
    );
  }

  // mask ตำแหน่งคงที่ — จาก preset หรือสตริงที่ส่งมาเอง
  const pattern = typeof spec === "string" ? spec : spec.pattern;
  return (
    <PatternFormat<InputProps>
      customInput={Input}
      value={value}
      format={pattern}
      mask={showMask ? "_" : undefined}
      onValueChange={(v) => onValueChange?.(v.value)}
      {...rest}
    />
  );
}

FormatInput.displayName = "FormatInput";

export { FormatInput };
