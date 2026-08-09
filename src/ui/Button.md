# Button

ปุ่มกดหลักของระบบ — ใช้กับทุกการกระทำที่ผู้ใช้เป็นคนเริ่ม

| | |
|---|---|
| โค้ด | `packages/react/src/ui/Button.tsx` |
| Storybook | `UI/Button` |
| Figma | ไฟล์ **Mediact Design System** → หน้า `Button` → component set `Button` (`34:2`) |
| สถานะ sync | ✅ ตรงกันทั้ง 2 ฝั่ง (2026-08-08) |

---

## API

```tsx
<Button variant="primary" size="md" leftIcon={<Plus />}>เพิ่มเวลาทำงาน</Button>
```

| prop | ค่า | ค่าเริ่มต้น |
|---|---|---|
| `variant` | `primary` · `secondary` · `ghost` · `info` · `destructive` · `success` · `warning` | `primary` |
| `size` | `xs` · `sm` · `md` · `lg` · `xl` | `md` |
| `leftIcon` / `rightIcon` | `ReactNode` — ใส่พร้อมกันได้ทั้งสองข้าง | — |
| `loading` | แทน `leftIcon` ด้วยสปินเนอร์ + `aria-busy` + กดไม่ได้ | `false` |
| `fullWidth` | `w-full` | `false` |
| `asChild` | render เป็น element ลูกแทน (Radix `Slot`) | `false` |

**จงใจไม่มี** — `rounded` prop (มุมโค้งเท่ากันทุกปุ่มในระบบ) · `color` prop (ใช้ `variant` แทน เพื่อไม่ให้เกิดคู่สีที่ไม่มีใครตรวจ)

---

## รูปทรง — ที่มาของทุกค่า

**ไม่ได้เลือกเอง** — ยึดจาก 2 แหล่งที่ให้ค่าตรงกันเองโดยไม่ได้นัดกัน:

1. **Figma** — `shadcn/ui Button` ใน `MEDIACT — HR · Time Attendance · Lo-fi Wireframes` node `544:15849` (ปุ่ม "เพิ่มเวลาทำงาน")
2. **แอปจริง** — ปุ่ม "Add Department" บน MediHR วัด computed style ด้วย Playwright

| | ค่า |
|---|---|
| มุมโค้ง | **6px** (`rounded-md`) |
| ตัวอักษร | **14px น้ำหนัก 500** (`text-sm font-medium`) |
| ระยะไอคอน→ข้อความ | **4px** (`gap-1`) |
| padding | **px-3 py-2** — เท่ากันทุกขนาด |
| ความสูง | xs 28 · sm 32 · md 36 · **lg 44** · xl 48 |
| ไอคอน | 16px (xs–md) · 20px (lg) · 24px (xl) |

📌 `text-sm` `font-medium` `gap-1` อยู่ที่ **base ไม่ผูกกับ size** — `size` คุมแค่ความสูงกับขนาดไอคอน โครงเดียวกับ `AddButton` ของ DS และ `Button` ของ hr-web

ปุ่มจริงบน MediHR คือขนาด **`lg`** (44px)

---

## ไอคอน

ใส่ได้ทั้งสองข้างพร้อมกัน — ระยะห่างมาจาก `gap-1` ที่ base ตัวเดียว **สองข้างจึงเท่ากันเสมอ** ไม่มีใครต้องตั้งค่าแยก

| กรณี | ผล |
|---|---|
| `leftIcon` | ไอคอน → ข้อความ |
| `rightIcon` | ข้อความ → ไอคอน |
| ทั้งคู่ | ไอคอน → ข้อความ → ไอคอน |
| `loading` | สปินเนอร์แทนไอคอนซ้าย · **ไอคอนขวาถูกซ่อน** — ไม่ให้มี 2 สัญลักษณ์แข่งกันบอกสถานะ |

ไอคอนถูกครอบด้วย `<span aria-hidden="true" data-slot="button-icon-left|right" class="inline-flex shrink-0 items-center">` เสมอ

- **`aria-hidden`** — โปรแกรมอ่านหน้าจออ่านแค่ข้อความ ไม่อ่านไอคอนซ้ำ
- **`shrink-0` ที่ span ไม่ใช่แค่ `svg`** — ไม่ใช่ทุกไอคอนที่เป็น `<svg>` (บางที่ส่ง `<img>` หรือ component ที่ห่อ span มาแล้ว) selector `[&_svg]:shrink-0` ที่ base ครอบไม่ถึง
- **`data-slot`** — ให้เทสกับ Figma ยึดชื่อเดียวกันได้

## Figma ↔ โค้ด

| Figma | โค้ด |
|---|---|
| property `Variant` (7 ค่า) | `variant` |
| property `Size` (3 ค่า: sm/md/lg) | `size` — **โค้ดมี `xs` กับ `xl` เพิ่ม ยังไม่ได้ทำใน Figma** |
| property `Label` (TEXT) | `children` |
| property `Icon left` (BOOLEAN) | `leftIcon` |
| property `Icon right` (BOOLEAN) | `rightIcon` |
| property `Loading` (BOOLEAN) | **`isLoading`** — โครงร่างตอนโหลด |
| — | `loading` (สปินเนอร์) · `fullWidth` · `asChild` **ไม่มีใน Figma** |

## สถานะโหลด

`isLoading` แทนทั้งปุ่มด้วยโครงร่าง โดย **ขนาดไม่ขยับสักพิกเซล** — เนื้อหาเดิมยังอยู่ข้างในแต่ซ่อนด้วย `visibility:hidden` กล่องจึงกว้างเท่าปุ่มจริงเสมอ

วัดแล้วทั้งสองฝั่ง:

| | ปกติ | ตอนโหลด |
|---|---|---|
| `บันทึก` (primary) | 58×36 | 58×36 ✅ |
| `ยกเลิก` (secondary) | 64×32 | 64×32 ✅ |
| Figma `เพิ่มเวลาทำงาน` | 129×36 | 129×36 ✅ |

ฝั่ง Figma ทำด้วยแผ่นสี่เหลี่ยมชื่อ `skeleton` วางแบบ absolute ทับทั้งปุ่ม (constraint stretch ทั้งสองแกน) ผูก `visible` เข้ากับ property `Loading` — **ไม่ได้ทำเป็น variant เพิ่ม** เพราะ 7×3×2 = 42 ช่อง เกินเพดานที่ playbook แนะนำ

สีมาจาก token `bg/skeleton` → `neutral/100` (เดิม hardcode `bg-gray-200/80` ในโค้ด ผูกกับ Figma ไม่ได้)

ในหน้า `Button` ของ Figma มีแถบ **"ไอคอนใส่ได้ทั้งสองข้าง"** แสดงครบ 4 กรณีเป็น instance จริง

สีทุกตัวใน Figma ผูกกับ collection `Color` ไม่มี hex ดิบ ⇒ สลับ mode (Portal / Mediwork / Medimatch / MediHR) แล้วปุ่มเปลี่ยนสีตามแอป

⚠️ **ไม่มี Code Connect** (ต้อง Figma Organization plan — เราอยู่ Professional) การ sync จึงเป็นงานที่คนต้องกด ไม่ใช่อัตโนมัติ · ตัวยึดคือ `codeSyntax` บน variable ที่ Dev Mode อ่านได้

---

---


## Decision log

| วันที่ | ตัดสิน | เหตุผล | ราคาที่รับ |
|---|---|---|---|
| 2026-08-08 | มุมโค้ง `rounded-sm` (4px) → **`rounded-md` (6px)** | Figma กับแอปจริงตรงกันที่ 6px | — ไม่มีใครใช้ DS Button อยู่ (import 0/4 แอป) |
| 2026-08-08 | น้ำหนัก **600 → 500** | เหตุผลเดียวกัน | — |
| 2026-08-08 | gap **8px → 4px** | เหตุผลเดียวกัน · และต้องเท่ากับ `AddButton` เพราะใช้คู่กัน | — |
| 2026-08-08 | padding เลิกผูกกับ `size` → **`px-3 py-2` ทุกขนาด** | ของจริงทำแบบนี้ · ที่ผูกกับ size ทำให้จุดเรียกต้อง override เอง แล้วกลับไปไม่เท่ากัน | ปุ่ม `xs` กว้างขึ้นเล็กน้อย |
| 2026-08-08 | เพิ่ม variant **`info`** | มี 20 จุดในแอปจริงเรียก `variant="info"` แต่ DS ไม่มีให้ | — |
| 2026-08-08 | Figma ทำแค่ 3 ขนาด (sm/md/lg) | playbook ของ Figma แนะนำไม่เกิน 30 ช่อง — 7×5 = 35 เกิน | `xs`/`xl` ต้องดูจากโค้ด |
| 2026-08-08 | 🐛 **แก้บั๊ก `asChild` + ไอคอน** | `Slot` ของ Radix เรียก `React.Children.only()` — การส่งไอคอนซ้าย + ข้อความ + ไอคอนขวาเป็น 3 ก้อนพี่น้อง **throw ทันที** ⇒ `asChild` ใช้คู่กับไอคอนไม่ได้เลย ทั้งที่ prop มีอยู่ทั้งคู่ · ตอนนี้ยัดเนื้อหาเข้าไปในลูกตัวเดียวให้แทน | เมื่อ `asChild` และ children ไม่ใช่ element เดี่ยว จะถูกห่อด้วย `<span>` เพิ่ม 1 ชั้น |
| 2026-08-08 | ครอบไอคอนด้วย `<span aria-hidden>` | `[&_svg]:shrink-0` ครอบเฉพาะ `<svg>` — ไอคอนที่เป็น `<img>` หรือ component ที่ห่อ span มาแล้วจะถูกบีบเมื่อข้อความยาว | DOM ลึกขึ้น 1 ชั้นต่อไอคอน |

---

## ค้าง

- [ ] `warning` ใช้ตัวอักษรขาวบนพื้น `#f8a75b` — **contrast ไม่ผ่าน AA** ต้องเคาะว่าเปลี่ยนเป็นตัวอักษรเข้ม หรือเปลี่ยนพื้นให้เข้มขึ้น
- [ ] DS ยังมี `SolidButton` · `OutlineButton` · `AddButton` แยกอยู่อีก 3 ตัว — ต้องยุบเข้า `Button` (งานตาม `CONSOLIDATION-ROADMAP.md`)
- [ ] ยังไม่มีสถานะ `hover` / `focus` / `disabled` ใน Figma (มีแต่ในโค้ด)
- [ ] `xs` / `xl` ยังไม่มีใน Figma
