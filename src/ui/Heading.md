# Heading

หัวข้อ — แยกจาก [`Text`](Text.md) เพราะข้อมูลจริงแยกตัวเองที่ 18/20px

| | |
|---|---|
| โค้ด | `packages/react/src/ui/Heading.tsx` |
| Storybook | `UI/Heading` |
| Figma | หน้า `Heading` → component set `Heading` (`50:80`) |
| สถานะ sync | 🟡 ตรง ยกเว้น `level` ที่ Figma แทนไม่ได้ (2026-08-08) |

---

## API

```tsx
<Heading level={2} size="title-sm">รายชื่อพนักงาน</Heading>
```

| prop | ค่า | ค่าเริ่มต้น |
|---|---|---|
| `level` | `1`–`6` — **ระดับทางความหมาย (h1–h6)** | `2` |
| `size` | `title-sm` · `title-md` · `title-lg` · `body-lg` | `title-md` |
| `tone` | `default` · `heading` · `brand` · `inherit` | `default` |
| `weight` | `medium` · `semibold` · `bold` | `semibold` |
| `isLoading` | แถบสูงเท่าบรรทัดจริง | `false` |
| `skeletonWidth` | ความกว้างแถบตอนโหลด — หัวข้อมักไม่เต็มบรรทัด | `16rem` |

---

## 🔴 `level` แยกจาก `size` โดยตั้งใจ

**ลำดับหัวข้อในหน้าเป็นเรื่องของโปรแกรมอ่านหน้าจอ · ขนาดเป็นเรื่องของสายตา**

ผูกสองอย่างเข้าด้วยกันจะบังคับให้ต้องเลือกอย่างใดอย่างหนึ่ง — เช่นหัวข้อที่ต้องเป็น `h2` ตามโครงหน้า แต่ต้องดูเล็กกว่า `h3` ที่อยู่ข้าง ๆ ในการ์ด

```tsx
<Heading level={2} size="body-lg">   {/* h2 จริง แต่ดูเล็ก */}
```

⚠️ **Figma ไม่มีตัวแทนของ `level`** — ต้องเขียนบอกใน annotation ตอนส่งงาน ไม่งั้น dev จะเดาจากขนาด ซึ่งเป็นสิ่งที่ prop นี้ตั้งใจกันไว้พอดี

---

## ขนาด — ที่มา

| ระดับ | px/lh | วัดได้จากจอจริง |
|---|---|---|
| `title-sm` | 20/28 | 56 อักษร (+21px อีก 122 ที่ยุบเข้ามา) |
| `title-md` | 24/32 | 100 |
| `title-lg` | 30/36 | ⚠️ **0 — ยังไม่มีใครใช้จริงสักจุด** |
| `body-lg` | 18/28 | 178 — หัวข้อย่อยที่เล็กกว่า `title-sm` |

`title-*` พบเฉพาะน้ำหนัก 600/700 ในทั้ง 4 แอป ค่าเริ่มต้นจึงเป็น `semibold`

---

## โทน

| โทน | token | วัดได้ |
|---|---|---|
| `default` | `text/primary` `#283541` | หัวข้อจริงคือ `#2d3748` — ΔE 3.9 ยุบได้ |
| `heading` | `text/secondary` `#3f454a` | Portal 36 อักษร |
| `brand` | `brand/default` | MediHR 28 อักษร (หัวข้อเป็นสีแบรนด์) |

---

## Figma ↔ โค้ด

| Figma | โค้ด |
|---|---|
| variant `Size` (3 ระดับ title) | `size` |
| variant `Tone` (3 โทน) | `tone` |
| text style (`Title/sm` · `Title/md` · `Title/lg`) | class `text-title-sm` / … |
| property `Content` (TEXT) | `children` |
| property `Loading` (BOOLEAN) | `isLoading` |
| **— ไม่มีตัวแทน** | **`level`** ⚠️ |
| — | `weight` · `size="body-lg"` **ไม่มีใน Figma** |

9 variant · ขนาดมาจาก text style จริง

---

## Decision log

| วันที่ | ตัดสิน | เหตุผล | ราคาที่รับ |
|---|---|---|---|
| 2026-08-08 | Figma ทำแค่ 3 ระดับ `title-*` | `body-lg` ใช้เป็นหัวข้อย่อย ซ้อนกับ `Text` ในสายตา designer | หัวข้อย่อยต้องดูจากโค้ด |
| 2026-08-08 | คง `title-lg` ไว้แม้ไม่มีใครใช้ | เผื่อหน้า landing · ทำเครื่องหมายไว้แล้วว่ายังไม่มีใครเรียก | ถือ variant ที่ไม่มีคนใช้ 3 ตัว |
| 2026-08-08 | ไม่พยายามแทน `level` ใน Figma | ทำเป็น variant จะกลายเป็น 3×3×6 = 54 ช่อง เกินเพดาน · และ `level` ไม่มีผลทางสายตาเลย | ต้องพึ่ง annotation |

---

## ค้าง

- ⚠️ **`level` ไม่มีทางสื่อผ่าน Figma** — ต้องมีกติกาว่า designer เขียนบอกตรงไหน ยังไม่ได้ตกลง
- `weight` ยังไม่มีใน Figma
- `title-lg` ยังไม่มีใครใช้จริง
- `<Heading>` **ยังไม่ถูกใช้ใน DS เองเลยสักจุด**
- ยังไม่มีแอปไหน import
