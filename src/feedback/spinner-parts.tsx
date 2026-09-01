import * as React from "react";
import { cn } from "../lib/cn";

/* ────────────────────────────────────────────────────────────────────────────
 * รูปทรงของตัวหมุน — **แยกทรงออกมา ไม่ใช่แยก component**
 *
 * ก่อนหน้านี้ DS วาดตัวหมุนไว้ 3 ที่ด้วย SVG ที่เหมือนกันทุกตัวอักษร (`feedback/Spinner`
 * `ui/Button` `ui/IconButton`) และยังมีอีก 2 ที่ใน `ai-chat` ที่ใช้ `Loader2` ของ lucide
 * ⇒ ไลบรารีเดียวมีตัวหมุน **2 ทรง** อยู่พร้อมกัน · นี่คือความผิดพลาดแบบเดียวกับที่เคยทำให้
 * checkbox 20px อยู่ข้าง radio 16px มาแล้ว (ดู `ui/toggle-parts.tsx`)
 *
 * 🔴 **ทำไมต้องเป็น "ทรง" ไม่ใช่ `<Spinner>` ทั้งก้อน** — `IconButton` คุมขนาดไอคอนด้วย
 * `[&_svg:not([class*='size-'])]:size-4` คือ **จะจัดขนาดให้เฉพาะ svg ที่ยังไม่มีคลาส
 * `size-`** · ถ้ายัด `<Spinner>` ซึ่งติด `size-5` มาด้วย selector จะไม่ match แล้วตัวหมุน
 * จะกลายเป็น 20px ในปุ่ม 32px แบบเงียบ ๆ ⇒ ต้องส่งได้ทั้งแบบมีขนาดและแบบปล่อยให้พ่อจัด
 *
 * 📌 เส้นทางมาจาก **`loader-circle` ของ lucide** (path + ค่า stroke ตั้งต้นของมัน)
 * ไม่ใช่วาดใหม่ — `lucide-react` เป็น dependency ของแพ็กเกจนี้อยู่แล้วและ `ai-chat` ก็ใช้
 * ไอคอนตัวนี้อยู่แล้ว · ฝัง path ตรง ๆ แทนการ import component เพราะตัวหมุนถูกใช้ข้างใน
 * `Button` `Switch` `ComboBox` ซึ่งเป็นของพื้นฐานที่สุด ไม่ควรลาก component ของไลบรารีอื่น
 * เข้าไปเพิ่ม (§5.1 ของ CLAUDE.md ห้าม "วาดไอคอนใหม่" ไม่ได้ห้ามใช้ path ของไลบรารี)
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * ตัวหมุนเปล่า ๆ — **ไม่มี `role`/`aria`** เพราะตัวที่ประกาศสถานะคือ `<Spinner>` ที่ห่อมัน
 *
 * ⚠️ ไม่ส่ง `className` ที่มี `size-*` = ปล่อยให้ตัวแม่จัดขนาด (ทางที่ `IconButton` ใช้)
 */
export const SpinnerGlyph = ({ className }: { className?: string }) => (
  <svg
    className={cn("animate-spin", className)}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
