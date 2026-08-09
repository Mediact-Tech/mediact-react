import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
import { TYPE_SCALE } from "./type-scale";

/** tailwind-merge ไม่รู้จัก font-size ที่เราเพิ่มเองใน `@theme`
 *
 * ถ้าไม่บอกมัน `cn("text-lg", "text-title-md")` จะคืนมาทั้งสองคลาส แล้วผลลัพธ์
 * ขึ้นกับลำดับใน CSS ที่ compile ออกมา — ซึ่งเป็นบั๊กที่มองไม่เห็นตอนเขียนโค้ด
 * (component ที่ตั้ง `text-lg` ไว้เป็น default จะ override ไม่ได้บ้างได้บ้าง)
 *
 * ลงทะเบียนไว้ที่เดียวตรงนี้ อ่านชื่อจาก `TYPE_SCALE` โดยตรง เพิ่ม token ใหม่
 * ในอนาคตจึงไม่ต้องมาแก้ไฟล์นี้ซ้ำ
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: Object.keys(TYPE_SCALE) }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
