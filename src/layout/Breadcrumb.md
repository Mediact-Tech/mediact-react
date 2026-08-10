# Breadcrumb

แถบนำทาง — `Breadcrumb` (ตัวเต็ม) + `BreadcrumbRoot`/`BreadcrumbLink` (ทางออกระดับล่าง)

| | |
|---|---|
| โค้ด | `packages/react/src/layout/Breadcrumb.tsx` |
| Storybook | `Layout/Breadcrumb` |
| เทส | `Breadcrumb.test.tsx` — 4 เคส (ยามเรื่องสีล้วน) |
| Figma | ยังไม่มี component |
| สถานะ sync | ⚠️ ยังไม่เคย re-ground กับแอปจริงทั้งตัว — วัดมาเฉพาะเรื่องสี |

---

## 🔴 สีตัวหนังสือไม่ตามสีแบรนด์

ของเดิมใช้ `text-brand` **สองที่**: หน้าปัจจุบัน และ hover ของลิงก์
⇒ แถบนำทางเปลี่ยนสีตามแอปที่ยืนอยู่

เช็คของจริงทั้ง 3 แอปที่มี breadcrumb แล้ว **ไม่มีแอปไหนทำแบบนั้นเลย**:

| แอป | ไฟล์ | หน้าปัจจุบัน | ลิงก์ |
|---|---|---|---|
| Portal | `components/shared/Breadcrumb.tsx` | `text-text-body` | `text-text-body` · hover `text-text-primary` |
| Medimatch | `shared/Breadcrumb/CustomBreadcrumb.tsx` | `text-text-gray-body` | `text-text-gray-body` |
| Mediwork | `components-v2/shared/Breadcrumb.tsx` | — | แตะสีแบรนด์แค่ที่**ไอคอน** (`#26d1b3` เขียนตรง ๆ) |

และถ้าปล่อยไว้ บน Mediwork จะได้มิ้นต์บนขาว **1.93:1** อ่านไม่ออก — กับดักเดียวกับที่
เมนูย่อยของ `Sidebar` และตัวหนังสือใน `DataTable` เจอมาแล้ว

ค่าที่ใช้ตอนนี้ (วัดใน hr-web จริง):

| ส่วน | คลาส | ค่า | คอนทราสต์บนขาว |
|---|---|---|---|
| หน้าปัจจุบัน | `font-semibold text-text-heading` | `#3f454a` | 9.9:1 |
| ลิงก์ / ปุ่ม | `text-text-tertiary` | `#9b9b9b` | 2.8:1 |
| ลิงก์ตอน hover | `hover:text-text-black` | `#191919` | 17.6:1 |
| ตัวคั่น `/` · `…` | `text-text-tertiary` | `#9b9b9b` | — |

`text-text-heading` คือ token ที่ DS เลือกไว้แล้วสำหรับเคสนี้เป๊ะ ๆ — ป้ายบนหัวหน้าที่
ห้ามตามสีแบรนด์ (ชื่อโรงพยาบาลใน `TopNavBrand` ใช้ตัวเดียวกัน)

⚠️ ลิงก์ที่ `2.8:1` **ตกเกณฑ์ข้อความ 4.5:1** — เป็นค่าที่มีอยู่เดิม ไม่ได้เปลี่ยนในรอบนี้
และตรงกับที่ Medimatch ใช้ · ถ้าจะแก้ควรแก้ทั้ง `--color-text-tertiary` ไม่ใช่แก้ที่นี่จุดเดียว

---

## Props ที่ควรรู้

| prop | ค่าเริ่มต้น | ทำอะไร |
|---|---|---|
| `items` | — | `{ label, icon?, href?, onClick? }[]` · ตัวสุดท้ายเป็น `<span aria-current="page">` **เสมอ** ถึงจะส่ง `href` มา |
| `separator` | `/` | ตัวคั่น |
| `maxItems` | `0` | เกินกี่ตัวถึงยุบตรงกลางเป็น `…` · `0` = ไม่ยุบ |
| `linkComponent` | `"a"` | ใส่ `next/link` ได้ (DS ไม่ import router ของเฟรมเวิร์กไหน) |

ข้อความทุกตัวมาจากแอป — DS ไม่มี i18n

---

## บันทึกการตัดสินใจ

| วันที่ | เปลี่ยนอะไร | ต้นทุนที่ยอมรับ |
|---|---|---|
| 2026-08-10 | หน้าปัจจุบัน + hover เลิกใช้ `text-brand` · เพิ่มไฟล์เทส | MediHR เคยเห็นแถบนี้เป็นครามเข้ม ตอนนี้เป็นเทาเข้ม — ตั้งใจ · แอปที่อยาก **ได้** สีแบรนด์ต้องส่ง `className` เอง |

---

## ยังไม่ได้ทำ

- ยังไม่เคยวัดทรงทั้งตัว (ระยะ · ขนาดตัวอักษร · ขนาดไอคอน) กับแอปจริง — รอบนี้แตะแค่สี
  ของจริงใช้ **12px** ทั้ง Portal และ Medimatch ส่วน DS เป็น `text-body-md` (16px)
- ไม่มี component ใน Figma
- `maxItems` ยังไม่มีแอปไหนใช้
