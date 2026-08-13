import * as React from "react";
import { X } from "lucide-react";
import { cn } from "../lib/cn";

/* ────────────────────────────────────────────────────────────────────────────
 * ช่องไอคอนขวาของช่องกรอกที่ "กดแล้วเปิดอะไรสักอย่าง" — ไอคอนประจำช่อง + ปุ่มล้าง
 *
 * 🔴 **แยกทรงออกมา ไม่ปล่อยให้แต่ละ component ถือเอง** — `DatePicker` กับ
 * `DateRangePicker` ใช้ทรงนี้เหมือนกันเป๊ะ และบทเรียนที่แพงที่สุดของ repo นี้คือ
 * "สองตัวที่ใช้ทรงเดียวกัน *จะ* เพี้ยนออกจากกัน" (DS เคยส่ง checkbox 20px คู่กับ
 * radio 16px ซึ่งกลับด้านกับของจริงพอดี และไม่มีใครเห็นเพราะแต่ละไฟล์อ่านแล้วดูถูก
 * ทั้งคู่ — ที่มาของ `ui/toggle-parts.tsx`)
 *
 * 📐 ทรงยึดตาม **antd** ซึ่ง `mediact-web-admin` ใช้อยู่จริง
 * (`antd/lib/date-picker/style/index.js:190-217` — `-clear` เป็น `absolute`
 * `insetInlineEnd:0` `opacity:0` แล้วตอน `:hover` สลับ `-clear→1` พร้อม `-suffix→0`)
 *
 * ⇒ **ไอคอนสองตัวซ้อนช่องเดียวกัน เห็นทีละตัว ไม่มีวันโผล่พร้อมกัน**
 *   · ไม่มี layout shift · ระยะเว้นขวาของช่องคงที่ ไม่ต้องสลับตามสถานะ
 *
 * 🔴 **เพิ่ม `focus-within` ทับของ antd** — antd ใช้ `:hover` อย่างเดียว
 * คนใช้คีย์บอร์ดจึงไม่มีวันเห็นปุ่มล้างเลย · ที่นี่แท็บเข้ามาก็เห็น
 *
 * ⚠️ ผู้เรียกต้องใส่ `group` ไว้ที่ `containerClassName` ของ `FloatingFieldShell`
 * ไม่งั้น `group-hover`/`group-focus-within` ไม่มีอะไรให้เกาะ (ต้องเป็น *ทั้งช่อง*
 * ไม่ใช่เฉพาะบนไอคอน — ของ antd ก็ผูกกับ `:hover` ของทั้ง picker เหมือนกัน)
 * ──────────────────────────────────────────────────────────────────────────── */

export type FieldIconSlotProps = {
  /** ไอคอนประจำช่อง (ปฏิทิน · นาฬิกา · ฯลฯ) — โชว์เป็นค่าปกติ */
  icon: React.ReactNode;
  /**
   * โชว์ปุ่มล้างซ้อนทับไอคอน — ผู้เรียกคำนวณมาแล้วว่า "เปิดใช้ ∧ มีค่า ∧ ไม่ถูกปิด"
   * ส่ง `false` แล้วช่องนี้เหลือไอคอนตัวเดียว ไม่มี DOM ของปุ่มเลย
   */
  showClear?: boolean;
  /** ข้อความ a11y ของปุ่มล้าง — แอปส่งคำแปลมาเอง (กฎ copy injection ของ DS) */
  clearLabel: string;
  onClear: () => void;
};

export function FieldIconSlot({
  icon,
  showClear,
  clearLabel,
  onClear,
}: FieldIconSlotProps) {
  return (
    /* 🔴 `pointer-events-none` — ตัวห่อนี้ทับปุ่ม trigger ที่อยู่ข้างล่าง ถ้าไม่ปล่อย
     * ให้คลิกทะลุ **กดตรงไอคอนแล้วจะไม่เปิดอะไรเลย** (เคยเป็นแบบนั้นจริงทั้ง
     * `DatePicker` และตัวนี้ · `FloatingFieldShell` ก็แก้ที่ตัวห่อของมันแล้วเช่นกัน) */
    <span className="pointer-events-none relative inline-flex size-4 items-center justify-center">
      <span
        className={cn(
          "absolute inset-0 inline-flex items-center justify-center transition-opacity",
          "[&_svg]:size-4",
          showClear && "group-hover:opacity-0 group-focus-within:opacity-0",
        )}
      >
        {icon}
      </span>

      {showClear && (
        <button
          type="button"
          aria-label={clearLabel}
          onClick={(event) => {
            // ปุ่มนี้ซ้อนอยู่บน trigger ที่เปิด popover — ปล่อยให้ลอยขึ้นไปคือ
            // "ล้างค่าแล้วเปิดปฏิทินขึ้นมาทันที" ซึ่งไม่มีใครสั่ง
            event.stopPropagation();
            onClear();
          }}
          className={cn(
            "absolute inset-0 inline-flex cursor-pointer items-center justify-center rounded-sm",
            /* 🔴 `pointer-events-none` จนกว่าจะถูกเผย — บนทัชไม่มี hover ถ้าเปิดค้างไว้
             * ปุ่มใสที่มองไม่เห็นจะดักการแตะตรงไอคอน แล้ว **ล้างค่าทิ้งทั้งที่ผู้ใช้ตั้งใจ
             * เปิดปฏิทิน** · ไม่กระทบการ tab ⇒ คีย์บอร์ดยังเข้าถึงได้ตามปกติ */
            "pointer-events-none opacity-0 transition-opacity",
            "group-hover:pointer-events-auto group-hover:opacity-100",
            "group-focus-within:pointer-events-auto group-focus-within:opacity-100",
            "[&_svg]:size-4",
          )}
        >
          <X />
        </button>
      )}
    </span>
  );
}
