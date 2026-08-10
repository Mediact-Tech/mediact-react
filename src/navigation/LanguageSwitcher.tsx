import * as React from "react";
import { Globe } from "lucide-react";
import { cn } from "../lib/cn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../overlay/DropdownMenu";

export type LanguageOption = {
  /** ค่าที่คืนกลับตอนเลือก — โดยมากคือรหัสภาษาของ i18n (`th-TH` · `en-EN`) */
  value: string;
  /**
   * ชื่อภาษา **ในภาษานั้นเอง** — "ไทย" ไม่ใช่ "Thai"
   *
   * คนที่ต้องใช้เมนูนี้คือคนที่อ่านภาษาปัจจุบันไม่ออก การแปลชื่อภาษาตามภาษาที่
   * เปิดอยู่จึงทำให้เขาหาบรรทัดของตัวเองไม่เจอ
   */
  label: string;
};

export type LanguageSwitcherProps = {
  languages: LanguageOption[];
  /** รหัสภาษาที่ใช้อยู่ — ต้องตรงกับ `value` สักตัวในรายการ */
  value?: string;
  onChange?: (value: string) => void;
  /** `aria-label` ของปุ่ม — DS ไม่มี i18n แอปส่งคำแปลมาเอง */
  label?: string;
  align?: "start" | "center" | "end";
  className?: string;
};

/** 📐 วัดจากของจริง (hr-web + Portal ใช้ตัวเดียวกันเป๊ะ · วัดในเบราว์เซอร์ 2026-08-10):
 * **120×36** · มุมกลมเต็ม · 14px/500 · ไอคอน 20 · เว้นใน 12 · ระยะระหว่างชิ้น 8
 *
 * 🔴 กว้าง **คงที่** (`w-30`) ไม่ใช่ `min-w` — ป้าย "English" กับ "ไทย" กว้างไม่เท่ากัน
 * ถ้าปล่อยให้พองยุบตามป้าย ปุ่มจะขยับหนีนิ้วทุกครั้งที่เปลี่ยนภาษา
 *
 * `border-border-strong` = ขอบเดียวกับช่องกรอกของ DS · ของเดิมในแอปเขียนสี palette ดิบ
 * (`gray-blue-300` #ABB6C1) ซึ่ง DS ไม่มีและด่านกันสีดิบไม่ให้เพิ่ม — ต่างกันจริง
 * ราว 4% ความสว่าง มองด้วยตาไม่ออก
 */
const triggerClass =
  "inline-flex h-9 w-30 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-border-strong bg-bg-default px-3 text-body-sm font-medium text-text-body transition-colors hover:bg-bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40";

/**
 * ปุ่มเปลี่ยนภาษา — เมนูหล่นลงที่เลือกได้ในคลิกเดียว
 *
 * ใช้ `DropdownMenu` แบบ **radio** ไม่ใช่ `Select` โดยตั้งใจ: นี่ไม่ใช่ช่องกรอกในฟอร์ม
 * (ไม่มีป้ายกำกับ ไม่ถูกส่งไปกับฟอร์ม ไม่มีสถานะผิด) แต่เป็นคำสั่งที่มีผลทันทีที่กด
 * · `role="menuitemradio"` + `aria-checked` บอกโปรแกรมอ่านหน้าจอว่าตอนนี้อยู่ภาษาไหน
 *
 * 🔴 ถ้า `value` ไม่ตรงกับตัวไหนในรายการ ปุ่มจะโชว์แต่ลูกโลกเปล่า ๆ — **ตั้งใจ**
 * เดาเป็นตัวแรกในรายการคือการบอกผู้ใช้ว่ากำลังอยู่ภาษาที่ไม่ได้อยู่จริง
 * (แอปที่ i18n มี fallback ของตัวเองอยู่แล้ว ให้ normalize ก่อนส่งมา)
 */
function LanguageSwitcher({
  languages,
  value,
  onChange,
  label = "Language",
  align = "end",
  className,
}: LanguageSwitcherProps) {
  const selected = languages.find((lang) => lang.value === value);

  return (
    /* 🔴 `modal={false}` — ค่าเริ่มต้นของ Radix ตั้ง `pointer-events: none` ให้ `<body>`
     * ตลอดเวลาที่เมนูเปิด ⇒ ทุกอย่างนอกเมนูกดครั้งแรกไม่ติด ต้องกดปิดก่อนแล้วกดใหม่
     * · หน้าเว็บก็เลื่อนไม่ได้ระหว่างเมนูเปิด (ยืนยันสดในเบราว์เซอร์: คลิกถูก
     * `<html> intercepts pointer events` กิน) · สำคัญเป็นพิเศษเมื่อปุ่มนี้ไปนั่งอยู่ใน
     * ป๊อปอัปของตัวอื่น เพราะปุ่มที่เหลือในป๊อปอัปนั้นจะกดไม่ได้ไปด้วย
     * เมนูนี้ไม่ได้กันคนไปทำอย่างอื่น จึงไม่ควรเป็น modal */
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button type="button" aria-label={label} className={cn(triggerClass, className)}>
          <Globe className="size-5 shrink-0" aria-hidden />
          <span className="truncate">{selected?.label}</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align} sideOffset={8} className="min-w-30 rounded-xl p-1.5">
        {/* 🔴 กรองการเลือกซ้ำทิ้งที่นี่ — Radix ยิง `onValueChange` ทุกครั้งที่กด
          * แม้กดบรรทัดที่ติ๊กอยู่แล้ว (ยืนยันด้วยเทส) ⇒ ถ้าปล่อยผ่าน แอปจะเรียก
          * `i18n.changeLanguage` ด้วยภาษาเดิม ซึ่งโหลดคำแปลใหม่และวาดจอทั้งใบซ้ำ
          * โดยไม่มีอะไรเปลี่ยน */}
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(next) => {
            if (next !== value) onChange?.(next);
          }}
        >
          {languages.map((lang) => (
            <DropdownMenuRadioItem
              key={lang.value}
              value={lang.value}
              className="rounded-lg py-2"
            >
              {lang.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

LanguageSwitcher.displayName = "LanguageSwitcher";

export { LanguageSwitcher };
