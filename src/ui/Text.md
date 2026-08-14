# Text

ข้อความเนื้อหา — ทุกอย่างที่ไม่ใช่หัวข้อ

| | |
|---|---|
| โค้ด | `packages/react/src/ui/Text.tsx` |
| Storybook | `UI/Text` |
| Figma | หน้า `Text` → component set `Text` (`50:51`) |
| สถานะ sync | 🟡 ตรงเฉพาะ 4 โทนที่ใช้จริง — อีก 5 โทนมีในโค้ดแต่ยังไม่ทำใน Figma (2026-08-08) |

---

## API

```tsx
<Text variant="body-sm" tone="body">เนื้อความ</Text>
```

| prop | ค่า | ค่าเริ่มต้น |
|---|---|---|
| `variant` | `caption` · `body-sm` · `body-md` · `body-lg` | `body-md` |
| `tone` | `default` · `body` · `muted` · `disabled` · `brand` · `link` · `success` · `warning` · `danger` · `inherit` | `default` |
| `weight` | `normal` · `medium` · `semibold` · `bold` | `normal` |
| `as` | element ที่จะ render (`span` เมื่ออยู่ในบรรทัดเดียวกับข้อความอื่น) | `p` |
| `truncate` | ตัดด้วย `…` บรรทัดเดียว | `false` |
| `numeric` | `tabular-nums` — ตัวเลขกว้างเท่ากันทุกตัว ใช้กับคอลัมน์ตัวเลข | `false` |
| `isLoading` | แถบสูงเท่าบรรทัดจริง (`h-[1lh]`) | `false` |
| `skeletonWidth` | ความกว้างแถบตอนโหลด | `100%` |

> 🔴 **`tone="default"` ไม่ใช่สีแบรนด์ (แก้ 2026-08-10)** — เดิมชี้ไป `text-text-primary`
> ซึ่ง `theme.css` alias ไป `--color-brand` ⇒ ทุกที่ที่ไม่ได้ส่ง `tone` มาจะเปลี่ยนสีตามแอป
> (Mediwork ได้มิ้นต์บนขาว 1.93:1 อ่านไม่ออก) · ตอนนี้ `default` ชี้ค่าเดียวกับ `body`
> โดยตั้งใจ — อยากได้สีแบรนด์จริง ๆ ใช้ `tone="brand"` ซึ่งมีอยู่แล้ว


**จงใจไม่มี** — ระดับ `title-*` (อยู่ที่ [`Heading`](Heading.md)) · prop `color` แบบอิสระ (ใช้ `tone` เพื่อไม่ให้เกิดสีที่ไม่มีใครตรวจ)

---

## ทำไมแยกจาก Heading

ข้อมูลจริงแยกตัวเองที่ **18/20px**: ทุกอย่างต่ำกว่านั้นใช้ weight 400 เป็นค่าปกติ ส่วน `title-*` พบเฉพาะ 600/700 ในทั้ง 4 แอป

รวมเป็น component เดียวจะต้องแบก union ของทุก prop โดยไม่มีอะไรกันการผสมมั่ว (เช่น `title-lg` + `weight="normal"` ซึ่งไม่มีที่ไหนใช้)

---

## ระดับตัวอักษร — ที่มา

ทุกระดับมาจาก type scale 7 ระดับใน [`docs/foundations/tokens.md`](../../../../docs/foundations/tokens.md) ซึ่งเป็น **จุดตัดระหว่าง scale ของ Tailwind กับ default ของ MUI** — ไม่ใช่ scale ที่คิดขึ้นใหม่

ตรวจกับจอจริงแล้ว:

| ระดับ | px/lh | วัดได้ |
|---|---|---|
| `caption` | 12/16 | 561 อักษร |
| **`body-sm`** | **14/20** | **⭐ 3,777 อักษร = 69% ของทั้งระบบ** |
| `body-md` | 16/24 | 524 |
| `body-lg` | 18/28 | 178 |

โค้ดใช้ class `text-body-sm` ตรง ๆ (ไม่ใช่ `text-sm` ของ Tailwind) ⇒ ชื่อเดียวกับ text style `Body/sm` ใน Figma

---

## โทน

Figma ทำไว้ 4 โทน — เลือกจากสีตัวอักษรที่**วัดได้จริงบนจอ** ไม่ใช่จากรายการ prop

| โทน | token | วัดได้ |
|---|---|---|
| `body` | `text/body` `#535a61` | **2,133 อักษร — เยอะสุด** |
| `link` | `text/link` `#0a6cb4` | 260 (Portal) |
| `muted` | `text/muted` `#96a4b1` | 111 (MediHR) |
| `default` | `text/primary` | หัวข้อย่อยในเนื้อหา |

อีก 5 โทน (`success` `warning` `danger` `brand` `disabled`) มีในโค้ดแต่ยังไม่ทำใน Figma เพราะพบน้อยมาก

---

## สถานะโหลด

`isLoading` → แถบสูง `h-[1lh]` = **สูงเท่า line-height ของระดับนั้นพอดี** บรรทัดจึงไม่ขยับตอนข้อความจริงมาแทน · `align-middle` กันแถบตกจากเส้นฐานเมื่ออยู่ inline

---

## Figma ↔ โค้ด

| Figma | โค้ด |
|---|---|
| variant `Size` (4 ระดับ) | `variant` |
| variant `Tone` (4 โทน) | `tone` |
| text style (`Caption` · `Body/sm` · …) | class `text-caption` / `text-body-sm` / … |
| property `Content` (TEXT) | `children` |
| property `Loading` (BOOLEAN) | `isLoading` |
| — | `weight` · `as` · `truncate` · `numeric` **ไม่มีใน Figma** |

16 variant · ขนาดมาจาก **text style จริง** ไม่ได้ตั้งเลขเอง ⇒ แก้ที่ variable `size/body-sm` แล้วทุก variant ตามทันที

---

---


## Decision log

| วันที่ | ตัดสิน | เหตุผล | ราคาที่รับ |
|---|---|---|---|
| 2026-08-08 | Figma ทำแค่ 4 โทน | เลือกจากสีที่วัดได้จริง ไม่ใช่จากรายการ prop | designer หยิบโทนสถานะจาก Figma ไม่ได้ ต้องดูโค้ด |
| 2026-08-08 | ใช้ text style ไม่ตั้ง fontSize เอง | เปลี่ยน scale ที่เดียวแล้วทุก variant ตาม | ต้องมี text style ครบทุกคู่ระดับ×น้ำหนักที่ใช้ |
| 2026-08-08 | โค้ดย้ายไป `text-body-sm` แทน `text-sm` | ให้โค้ดกับ Figma อ้างคำเดียวกัน · ค่าเท่ากันเป๊ะ (พิสูจน์แล้ว 3/3 story ไม่ขยับ) | ต้องแก้ 62 ไฟล์ |
| 2026-08-13 | ใส่ `m-0` ที่ base ของ `textVariants` | 🔴 `Text` เรนเดอร์ `<p>` ซึ่ง UA stylesheet ให้ `margin: 1em 0` มาฟรี · เดิม**พึ่ง preflight ของผู้ใช้ล้างให้** ซึ่งเป็นการพึ่งสิ่งที่ผู้ใช้อาจไม่มี — Mediwork ตัด preflight ทิ้งทั้งก้อนเพื่อไม่ให้ชน MUI · วัดจากจอจริง: กล่องรายละเอียดที่มี `<p>` 8 ตัวบวมจน**สูงเต็มจอ** ทั้งที่ DS ไม่มีกฎความสูงสักบรรทัด และแอปกู้เองไม่ได้เพราะ dialog ถูก Radix Portal ย้ายไปแขวนที่ `body` จน**หลุดออกนอก subtree ที่แอปเขียนกฎคุมไว้** | คลาสยาวขึ้น 1 ตัวทุก `<Text>` · ผู้เรียกยังทับได้ (`mb-2` ชนะเพราะ Tailwind เรียง `mb-*` ไว้หลัง `m-*` ในไฟล์ที่ generate — **ไม่ใช่เพราะลำดับใน `className`** และ tailwind-merge ก็ไม่ได้ลบ `m-0` ทิ้ง) |

---

## ค้าง

- 5 โทนที่ยังไม่มีใน Figma (`success` `warning` `danger` `brand` `disabled`)
- `weight` ยังไม่มีใน Figma — มี text style `Body/sm Medium`/`Semibold` แล้วแต่ยังไม่ทำเป็น variant
- `<Text>` **ยังไม่ถูกใช้ใน DS เองเลยสักจุด** — component อื่นยังเขียน `<p className="text-...">` ตรง ๆ
  · ⚠️ ทุกจุดเหล่านั้นมีปัญหา UA margin เดียวกับที่ `m-0` เพิ่งปิดให้ `Text` **แต่ยังไม่ได้ไล่แก้**
  ที่ปิดไปแล้วมีเฉพาะ `DialogTitle`/`DialogDescription` ซึ่งเป็นจุดที่วัดเจออาการจริง
- 🆕 **Mediwork import แล้ว** (จอ `attendance-approval` — 2026-08-13) เป็นแอปแรก
