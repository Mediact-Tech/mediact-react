import * as React from "react";
import { ChevronDown, Globe } from "lucide-react";
import { cn } from "../lib/cn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../overlay/DropdownMenu";
import { builtInFlag, shortCode } from "./_language-flags";

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
  /** ป้ายสั้นบนปุ่มแบบ `compact` — ไม่ส่งได้ส่วนหน้าของ `value` ตัวพิมพ์ใหญ่ (`th-TH` → `TH`) */
  code?: string;
  /**
   * ธงวงกลมของแบบ `compact` — ไม่ส่งได้ธงในตัวของ DS ตามรหัสภาษา (`th` · `en`)
   * · ภาษาที่ DS ไม่รู้จักและไม่ส่งมา = ลูกโลก
   */
  flag?: React.ReactNode;
};

export type LanguageSwitcherProps = {
  languages: LanguageOption[];
  /** รหัสภาษาที่ใช้อยู่ — ต้องตรงกับ `value` สักตัวในรายการ */
  value?: string;
  onChange?: (value: string) => void;
  /** `aria-label` ของปุ่ม — DS ไม่มี i18n แอปส่งคำแปลมาเอง */
  label?: string;
  align?: "start" | "center" | "end";
  /**
   * - `default` — ลูกโลก + ชื่อภาษาเต็ม กว้างคงที่ 120 (หน้าเข้าสู่ระบบ · 403/404 · ในเมนูโปรไฟล์แบบเดิม)
   * - `compact` — ธงวงกลม + รหัสสั้น (`TH`) + ลูกศร · กว้างตามเนื้อ · สำหรับ**บนแถบ** `TopNav`
   *   ข้าง `AppLauncher` (ดีไซน์ topbar 2026-11)
   */
  variant?: "default" | "compact";
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
const compactTriggerClass =
  "inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-border-strong bg-bg-default pl-2 pr-2.5 text-body-sm font-semibold text-text-body transition-colors hover:bg-bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40";

/* วงกลมของธง — `overflow-hidden` + SVG แบบ `slice` ตัดธงสี่เหลี่ยมให้เต็มวง · ขอบบาง ๆ
 * กันธงที่ขอบเป็นสีขาว (ไทยไม่มี แต่ภาษาอื่นอาจมี) ไม่ให้กลืนกับพื้นปุ่ม */
const flagCircleClass =
  "inline-flex size-5 shrink-0 overflow-hidden rounded-full ring-1 ring-border-default [&_svg]:size-full";

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
  variant = "default",
  className,
}: LanguageSwitcherProps) {
  const selected = languages.find((lang) => lang.value === value);
  const compact = variant === "compact";
  const flagOf = (lang: LanguageOption) => lang.flag ?? builtInFlag(lang.value);
  const selectedFlag = selected ? flagOf(selected) : null;

  return (
    /* 🔴 `modal={false}` — ค่าเริ่มต้นของ Radix ตั้ง `pointer-events: none` ให้ `<body>`
     * ตลอดเวลาที่เมนูเปิด ⇒ ทุกอย่างนอกเมนูกดครั้งแรกไม่ติด ต้องกดปิดก่อนแล้วกดใหม่
     * · หน้าเว็บก็เลื่อนไม่ได้ระหว่างเมนูเปิด (ยืนยันสดในเบราว์เซอร์: คลิกถูก
     * `<html> intercepts pointer events` กิน) · สำคัญเป็นพิเศษเมื่อปุ่มนี้ไปนั่งอยู่ใน
     * ป๊อปอัปของตัวอื่น เพราะปุ่มที่เหลือในป๊อปอัปนั้นจะกดไม่ได้ไปด้วย
     * เมนูนี้ไม่ได้กันคนไปทำอย่างอื่น จึงไม่ควรเป็น modal */
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        {compact ? (
          <button type="button" aria-label={label} className={cn(compactTriggerClass, className)}>
            {selectedFlag ? (
              <span aria-hidden className={flagCircleClass}>{selectedFlag}</span>
            ) : (
              <Globe className="size-5 shrink-0" aria-hidden />
            )}
            {selected && <span>{selected.code ?? shortCode(selected.value)}</span>}
            <ChevronDown className="size-4 shrink-0 text-text-muted" aria-hidden />
          </button>
        ) : (
          <button type="button" aria-label={label} className={cn(triggerClass, className)}>
            <Globe className="size-5 shrink-0" aria-hidden />
            <span className="truncate">{selected?.label}</span>
          </button>
        )}
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
              /* compact: ไม่มีจุดหน้าบรรทัด — บรรทัดที่เลือกอยู่ = **พื้นสีอ่อนของแบรนด์ + ตัวหนาสีเข้ม**
               * · สีแบรนด์ลงที่พื้น ไม่ใช่ตัวหนังสือ — ตัวหนังสือสีแบรนด์บนขาวตกเกณฑ์ 2 ใน 4 แอป
               *   (Mediwork 1.93 · Medimatch 3.34) ส่วนพื้น `brand-subtle` ได้สีของแต่ละแอปเองอัตโนมัติ
               * · hover เปลี่ยนเป็นเทาอ่อน — ค่าเดิมของ `DropdownMenuRadioItem` คือ `brand-subtle` ตัวเดียวกับ
               *   บรรทัดที่เลือก ⇒ ชี้อีกบรรทัดแล้วจะดูเหมือนถูกเลือกพร้อมกันสองบรรทัด
               * · ชี้บรรทัดที่เลือกอยู่เองต้องยังเป็นสีแบรนด์ (ไม่ถูก hover เทาทับ) */
              indicator={!compact}
              className={cn(
                "rounded-lg py-2",
                compact && [
                  "text-text-body focus:bg-overlay-hover data-[highlighted]:bg-overlay-hover",
                  "data-[state=checked]:bg-brand-subtle data-[state=checked]:font-semibold data-[state=checked]:text-text-heading",
                  "data-[state=checked]:data-[highlighted]:bg-brand-subtle data-[state=checked]:focus:bg-brand-subtle",
                  /* แถบสีแบรนด์ทึบ 3px ชิดซ้าย — พื้น `brand-subtle` วัดได้แค่ 1.07–1.16 เท่าของขาว
                   * จางกว่า hover เทา (~1.12) ใน Portal/Mediwork ⇒ ไม่มีแถบนี้ บรรทัดที่ชี้จะเด่นกว่าบรรทัดที่เลือก */
                  "data-[state=checked]:before:absolute data-[state=checked]:before:inset-y-1.5 data-[state=checked]:before:left-0 data-[state=checked]:before:w-[3px] data-[state=checked]:before:rounded-full data-[state=checked]:before:bg-brand data-[state=checked]:before:content-['']",
                ],
              )}
            >
              {compact && flagOf(lang) && (
                <span aria-hidden className={cn(flagCircleClass, "mr-2")}>{flagOf(lang)}</span>
              )}
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
