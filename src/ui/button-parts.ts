/* ────────────────────────────────────────────────────────────────────────────
 * ชิ้นส่วนที่ปุ่มทุกตัวใน DS ใช้ร่วมกัน
 *
 * ทำไมต้องแยกออกมา: ความจางตอน `disabled` ถูกเขียนซ้ำใน 4 ไฟล์ (`Button.tsx`
 * `OutlineButton.tsx` `SolidButton.tsx` `IconButton.tsx`) และ **มันเพี้ยนกัน
 * ไปแล้วจริง ๆ** — Button/IconButton เป็น 40% ส่วน OutlineButton/SolidButton
 * เป็น 30% ทั้งที่สองฝั่งยืนอยู่ในแถวปุ่มเดียวกันได้ นี่คือรูปแบบความผิดพลาด
 * เดียวกับที่ทำให้ `toggle-parts.tsx` ต้องเกิด — เขียนซ้ำแล้วแก้ไม่ครบ
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * ความจางของปุ่มตอน `disabled` — ค่าเดียวสำหรับปุ่มทุกตัว
 *
 * **30% ไม่ใช่ 40%** เพราะกฎข้อ 1 ของ repo นี้: ของจริงบนจอชนะโค้ดใน DS
 * ปุ่มกลางที่แอปใช้จริงทั้งสองตัวเขียน `disabled:opacity-30` เหมือนกัน —
 * `portal-web/src/components/ui/Button.tsx` และ
 * `medimatch-web-backoffice/src/components/ui/Button.tsx`
 * (hr-web ไม่มีปุ่มกลาง · Mediwork เป็น MUI ไม่กินคลาสนี้)
 * ฝั่ง DS เองก็เป็น 30% อยู่แล้ว 3 ตัวจาก 5 — OutlineButton · SolidButton
 * และ AddButton ที่ยืมรูปทรงจาก SolidButton
 *
 * ⛔ อย่าย้ายค่านี้ไปฝังกลับในแต่ละไฟล์ ต่อให้ตอนนั้นค่ามันเท่ากันแล้วก็ตาม —
 * สาเหตุที่มันเพี้ยนรอบแรกคือมันถูกเขียนแยกกัน 4 ที่ ไม่ใช่เพราะใครใส่เลขผิด
 *
 * ⚠️ ตัวนี้คุมแค่ `opacity` ตัวเดียว ส่วน `pointer-events` กับ `cursor` ยัง
 * ตั้งใจให้ต่างกันอยู่ — SolidButton/OutlineButton เปิด `pointer-events` ค้างไว้
 * เพื่อให้เคอร์เซอร์ `not-allowed` ขึ้นได้ (เหตุผลเต็มอยู่หัวไฟล์ `SolidButton.tsx`)
 * ส่วน Button/IconButton ใช้ `pointer-events-none` ถ้าจะยุบให้เหมือนกันด้วย
 * ต้องไล่ใส่ `disabled:hover:*` ให้ครบทุก variant ก่อน ไม่งั้นปุ่มที่กดไม่ได้
 * จะยังเปลี่ยนสีตอนเอาเมาส์ไปชี้
 */
export const BUTTON_DISABLED_OPACITY = "disabled:opacity-30";
