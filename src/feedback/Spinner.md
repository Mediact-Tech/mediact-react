# Spinner

ตัวหมุนบอกว่า "กำลังทำงาน" — ใช้ทั้งเดี่ยว ๆ (`Spinner`), เป็นบล็อกเต็มพื้นที่พร้อมข้อความ
(`LoadingScreen`) และฝังอยู่ในปุ่มที่กำลังทำงาน (`Button loading` · `IconButton loading`)

| ส่วน | ไฟล์ |
|---|---|
| ทรง (SVG ล้วน ไม่มี role) | [`spinner-parts.tsx`](./spinner-parts.tsx) |
| ตัวที่ประกาศสถานะ + คุมขนาด | [`Spinner.tsx`](./Spinner.tsx) |
| เทสสัญญา | [`spinner-parts.test.tsx`](./spinner-parts.test.tsx) |

## API

| prop | ค่า | ความหมาย |
|---|---|---|
| `size` | `xs` 12 · `sm` 16 · `md` 20 · `lg` 24 · `xl` 32 (px) | ค่าตั้งต้น `md` |
| `label` | `string` | ชื่อที่ screen reader อ่าน · ค่าตั้งต้น `"Loading"` |

`Spinner` ห่อ SVG ด้วย `<span role="status" aria-label>` · `SpinnerGlyph` ไม่มี `role`
เพราะตัวที่ประกาศคือตัวห่อ — ในปุ่มจึงใช้ `SpinnerGlyph` ตรง ๆ ไม่ให้ `role=status`
ซ้อนกับ `aria-busy` ของปุ่ม (screen reader จะอ่านสองรอบ)

## บันทึกการตัดสินใจ

### 2026-08-27 — ทรงเดียวทั้งไลบรารี เป็น arc ของ lucide

**ปัญหาที่พบ:** DS วาดตัวหมุนไว้ **5 ที่ เป็น 2 ทรง**

| ที่ | ทรงเดิม |
|---|---|
| `feedback/Spinner` · `ui/Button` · `ui/IconButton` | วาดเอง: วงกลมจาง 25% + ลิ่มทึบ — **SVG เหมือนกันทุกตัวอักษรทั้ง 3 ชุด** |
| `ai-chat/ConversationPicker` · `ai-chat/ToolTrail` | `Loader2` ของ lucide (arc ปลายมน) |

⇒ ไลบรารีเดียวมีตัวหมุนสองแบบพร้อมกัน และมีสำเนาที่รอ drift อยู่ 3 ชุด · เป็นความ
ผิดพลาดแบบเดียวกับที่เคยทำให้ checkbox 20px ยืนข้าง radio 16px (ดู `ui/toggle-parts.tsx`)

**ตัดสิน:** ใช้ **`loader-circle` ของ lucide** เป็นทรงเดียวของทั้ง DS
— ฝัง path ตรง ๆ ใน `spinner-parts.tsx` แล้วให้ทั้งสามที่ชี้มาที่นี่

| ทำไม | |
|---|---|
| ทรงนี้คือสิ่งที่แอปจริงใช้อยู่ | medimatch วาด loading ของตารางด้วย `Loader2` ตัวนี้ |
| ไม่ใช่การวาดใหม่ | `lucide-react` เป็น dependency อยู่แล้ว และ `ai-chat` ก็ใช้ไอคอนตัวนี้อยู่แล้ว (§5.1 ห้ามวาดไอคอนใหม่ ไม่ได้ห้ามใช้ path ของไลบรารี) |
| ฝัง path แทน import component | ตัวหมุนอยู่ข้างใน `Button` `Switch` `ComboBox` ซึ่งเป็นของพื้นฐานที่สุด ไม่ควรลาก component ของไลบรารีอื่นเข้าไปเพิ่ม |

**ราคาที่ยอมจ่าย:** ทุกแอปที่ bump tag จะเห็นตัวหมุนเปลี่ยนทรง — วงจาง+ลิ่ม เป็น
arc เส้นปลายมน · เป็นการเปลี่ยนที่เห็นได้ ไม่ใช่ refactor เงียบ ๆ

🔴 **ทำไมแยก "ทรง" ไม่ใช่ใช้ `<Spinner>` ทั้งก้อน** — `IconButton` คุมขนาดไอคอนด้วย
`[&_svg:not([class*='size-'])]:size-4` คือ **จัดขนาดให้เฉพาะ svg ที่ยังไม่มีคลาส `size-`**
ถ้ายัด `<Spinner>` ซึ่งติด `size-5` มาด้วย selector จะไม่ match แล้วตัวหมุนกลายเป็น 20px
ในปุ่ม 32px **แบบเงียบ ๆ ไม่มี error** · `spinner-parts.test.tsx` ล็อกข้อนี้ไว้แล้ว และ
พิสูจน์ด้วยการแก้โค้ดให้พังจริงแล้วดูเทสแดง

**วัดใน Storybook หลังแก้:** 5 ขนาด 12/16/20/24/32 · `fill:none` · `stroke-width:2px` ·
`stroke-linecap:round` · ไม่เหลือ `<circle>` · `Button loading` svg 16×16 ในปุ่ม 100×36
พร้อม `aria-busy` · `IconButton loading` svg **16×16** ในปุ่ม 36×36 (selector ยัง match)

⚠️ **ยังไม่ได้ตรวจด้วยตา** — แพเนลเบราว์เซอร์ในเครื่องที่ทำงานนี้ไม่ compositing จึงถ่ายภาพ
ไม่ได้ มีแต่ตัวเลข · `CLAUDE.md` เตือนไว้เองว่าภาพกับตัวเลขพังคนละแบบ

### ยังไม่ทำ

- `ai-chat/ConversationPicker` · `ai-chat/ToolTrail` ยังเรียก `Loader2` ตรง ๆ อยู่ —
  **ทรงตรงกันแล้วโดยปริยาย** เพราะเป็น path เดียวกัน แต่ไม่ได้ `role="status"` ไปด้วย
- `LoadingScreen` ยังไม่ได้เทียบกับบล็อก loading ของแอปจริง — วัดแล้วต่างกัน 3 จุด:
  ตัวหมุน 32 (แอปใช้ 40) · ข้อความ 14px/400 (แอปใช้ 16px/500) · สีข้อความ
  `text-text-tertiary` (แอปใช้ `#6b747e`) · ระยะห่าง 12px ตรงกันแล้ว
- ยังไม่มี component ใน Figma
