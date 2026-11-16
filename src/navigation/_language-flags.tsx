import * as React from "react";

/*
 * ธงชาติวงกลมของปุ่มเปลี่ยนภาษาแบบ compact
 *
 * สีของธงเป็นค่าตายตัวโดยตั้งใจ — มันคือเอกลักษณ์ของประเทศ ไม่ใช่สีของแบรนด์ใด ๆ
 * จึงไม่ผ่านชั้น token (ด่าน `lint:colors` ตรวจเฉพาะคลาส Tailwind แบบ `bg-[#…]`
 * ไม่ใช่ attribute ของ SVG)
 */

function FlagTH(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 30 30" preserveAspectRatio="xMidYMid slice" aria-hidden {...props}>
      <rect width="30" height="30" fill="#A51931" />
      <rect y="5" width="30" height="20" fill="#F4F5F8" />
      <rect y="10" width="30" height="10" fill="#2D2A4A" />
    </svg>
  );
}

function FlagGB(props: React.SVGProps<SVGSVGElement>) {
  /* id ต้องไม่ซ้ำ — ปุ่มนี้อาจอยู่บนจอพร้อมกันหลายอัน (แถบ + หน้า 403) */
  const id = React.useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" aria-hidden {...props}>
      <clipPath id={`${id}-t`}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath={`url(#${id}-t)`} stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#FFFFFF" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

/** ธงตามรหัสภาษา — อ่านแค่ส่วนหน้า (`th` · `th-TH` · `en-US` ใช้ได้หมด) · ไม่รู้จัก = `null` */
export function builtInFlag(value: string): React.ReactNode {
  const prefix = value.toLowerCase().split(/[-_]/)[0] ?? "";
  if (prefix === "th") return <FlagTH />;
  if (prefix === "en") return <FlagGB />;
  return null;
}

/** รหัสสั้นบนปุ่ม — `th-TH` → `TH` */
export function shortCode(value: string): string {
  return (value.split(/[-_]/)[0] ?? value).toUpperCase();
}
