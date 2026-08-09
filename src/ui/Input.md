# Input

ช่องกรอกข้อความบรรทัดเดียว — ป้ายลอยขึ้นเมื่อมีค่าหรือตอน focus

| | |
|---|---|
| โค้ด | `packages/react/src/ui/Input.tsx` |
| Storybook | `UI/Input` |
| Figma | ไฟล์ **Mediact Design System** → หน้า `Input` → component set `Input` (`44:185`) |
| สถานะ sync | ✅ ตรงกัน (2026-08-08) |

---

## API

```tsx
<Input label="อีเมล" prefixIcon={<Mail />} suffixIcon={<Search />} />
```

| prop | ค่า | ค่าเริ่มต้น |
|---|---|---|
| `label` | ป้ายลอย | — |
| `prefixIcon` / `suffixIcon` | `ReactNode` — ใส่พร้อมกันได้ | — |
| `size` | `sm` · `md` · `lg` | `md` |
| `hint` / `error` | ข้อความใต้ช่อง · `error` ชนะ `hint` | — |
| `required` | ดอกจันแดงท้ายป้าย | `false` |
| `clearable` | ปุ่ม × เมื่อมีค่า | `false` |
| `type="password"` | ปุ่มดู/ซ่อนรหัสผ่านอัตโนมัติ | — |
| `alwaysFloatLabel` | บังคับป้ายลอยตลอด (ช่องที่มี prefix คงที่) | `false` |
| `isLoading` | แทนป้าย + ช่องด้วยโครงร่าง | `false` |
| ~~`leftAdornment`~~ / ~~`rightAdornment`~~ | **เลิกใช้** — ยังทำงาน แต่ให้ใช้ `prefixIcon`/`suffixIcon` | — |

**จงใจไม่มี** — โหมด label อยู่บนช่อง (ทั้ง DS และ hr-web ใช้ป้ายลอยเหมือนกัน · การมีสองแบบแปลว่าทุกฟอร์มต้องเลือก แล้วจะเลือกไม่ตรงกัน)

---

## ไม่มีป้าย → ใช้ placeholder

ป้ายว่างต้อง **ไม่ render อะไรเลย** แล้วปล่อยให้ `placeholder` ทำหน้าที่แทน

🐛 ก่อนหน้านี้ shell เช็คแค่ `label != null` ⇒ **`label=""` สร้าง `<label>` เปล่ากว้าง 12px พื้นขาว วางที่ `top:-6px`** = เจาะรูขาวบนเส้นขอบโดยไม่มีตัวอักษรอะไรอยู่ในนั้น

เกิดง่ายกว่าที่คิด — `label={t("field.name")}` ที่ยังไม่มีคำแปลจะได้ `""` ทันที

แก้ที่ `FloatingFieldShell` จึงครอบ **field ทุกตัว** (Input · Textarea · Select · DatePicker · TimePicker · ComboBox …) ไม่ใช่แค่ Input

```ts
const labelIsEmpty =
  label == null || (typeof label === "string" && label.trim() === "");
```

เช็คเฉพาะ `string` — ป้ายที่เป็น element ถือว่ามีเนื้อหาเสมอ

| กรณี | ผล |
|---|---|
| `label="ชื่อ"` | ป้ายลอย · เส้นขอบมีช่องว่างตรงป้าย |
| ไม่ส่ง `label` | ไม่มี `<label>` · **เส้นขอบต่อเนื่อง** |
| `label=""` | เหมือนกัน — ไม่มี `<label>` |

---

## ไอคอน

ใส่ได้ทั้งสองข้างพร้อมกัน · ช่องกรอกเว้นที่ให้เอง `pl-9` / `pr-9`

**ป้ายที่ยังไม่ลอยเลื่อนตามไอคอนให้เอง** — `left-3` → `left-9` ไม่งั้นป้ายจะทับไอคอน (hr-web ทำเรื่องเดียวกันด้วย `left-10`)

**ปุ่มในตัวมาก่อน `suffixIcon` เสมอ** — ปุ่มล้างค่า (`clearable`) และปุ่มดูรหัสผ่าน (`type="password"`) ชนะ ไม่งั้นจะมีสองอย่างซ้อนกันที่มุมขวา

### 🔴 ชื่อ prop เดิมไม่มีใครใช้

| ชื่อ | ใช้จริงในแอป |
|---|---|
| `prefixIcon` | **27 จุด** (Portal 19 · MediHR 6 · อื่น ๆ) |
| `suffixIcon` | **29 จุด** (Medimatch 14 · MediHR 7 · Portal 8) |
| `leftAdornment` / `rightAdornment` (ชื่อเดิมของ DS) | **0 จุด** |
| `startAdornment` (MUI) | 3 จุด — Mediwork เท่านั้น |

จึงเปลี่ยนชื่อหลักเป็น `prefixIcon`/`suffixIcon` และเก็บชื่อเดิมไว้เป็น alias

---

## รูปทรง — ที่มาของทุกค่า

**ไม่ต้องแก้อะไรเลย — ของเดิมตรงอยู่แล้ว** ยืนยันด้วยการวัด computed style ทั้งสองฝั่ง

| | Storybook | MediHR ของจริง |
|---|---|---|
| ความสูง (`md`) | 44px | 44px |
| มุมโค้ง | 4px | 4px |
| เส้นขอบ | 1px `rgba(0,0,0,0.23)` | 1px `rgba(0,0,0,0.23)` |
| ตัวอักษร | 14px / 500 | 14px / 500 |
| padding | 12px | 12px |

`rgba(0,0,0,0.23)` = token `border/strong` (`alpha/black-23`)

⚠️ **Portal ใช้คนละชุด** — 44px / มุมโค้ง **8px** / เส้นขอบ `#b9c2cb` / ตัวอักษร **16px** ยังไม่ได้ยุบเข้าหากัน (token `border/input` = `#b9c2cb` มีไว้รองรับชุดนั้น แต่ยังไม่มีใครเรียก)

---

## สถานะโหลด

`isLoading` แทน **ทั้งป้ายและช่อง** ด้วยโครงร่าง — ป้ายกลายเป็นแถบสั้น ช่องกลายเป็นกล่องสูงเท่าเดิม เพื่อไม่ให้ฟอร์มขยับตอนข้อมูลมาถึง

---

## Figma ↔ โค้ด

| Figma | โค้ด |
|---|---|
| variant `State` (default · focus · error · disabled) | มาจาก `:focus` / `error` / `disabled` |
| variant `Size` (sm · md · lg) | `size` |
| variant `Content` (filled · placeholder) | มี `label` หรือไม่ |
| property `Label` (TEXT) | `label` |
| property `Value` (TEXT) | `value` |
| property `Icon left` / `Icon right` (BOOLEAN) | `prefixIcon` / `suffixIcon` |
| property `Loading` (BOOLEAN) | `isLoading` |
| — | `hint` · `clearable` · `required` · `alwaysFloatLabel` **ไม่มีใน Figma** |

24 variant (4 สถานะ × 3 ขนาด × 2 เนื้อหา) — ใต้เพดาน ~30 ที่ playbook แนะนำ · ที่ว่างใต้ช่องมีอยู่ในทุก variant ตรงกับ `reserveMessageSpace` ที่ค่าเริ่มต้นเป็น `true`

---

---


## Decision log

| วันที่ | ตัดสิน | เหตุผล | ราคาที่รับ |
|---|---|---|---|
| 2026-08-08 | เปลี่ยนชื่อ prop ไอคอนเป็น `prefixIcon`/`suffixIcon` | แอปจริงเรียกชื่อนี้ 56 จุด · ชื่อเดิม 0 จุด | ต้องเก็บ alias ไว้ · DS เองยังเรียกชื่อเดิมภายใน 30 จุด |
| 2026-08-08 | **ไม่แก้รูปทรง** | วัดแล้วตรงกับ MediHR ทุกค่า | Portal ยังต่างอยู่ ยังไม่ยุบ |
| 2026-08-08 | คงป้ายลอย ไม่เพิ่มโหมด label อยู่บน | ทั้ง DS และ hr-web ใช้ป้ายลอยตรงกัน | ฟอร์มที่อยากได้ label อยู่บนต้องรอ |
| 2026-08-08 | Figma ทำ 4 สถานะ × 3 ขนาด | ใต้เพดาน 30 · สถานะเป็นสิ่งที่ designer ต้องเห็น มากกว่า toggle ไอคอน | สถานะ hover ยังไม่มี |
| 2026-08-08 | 🐛 **ป้ายว่างต้องไม่ render** | `label=""` เจาะรูขาวบนเส้นขอบ · แก้ที่ shell จึงครอบ field ทุกตัว | ป้ายที่เป็น element ยัง render แม้ข้างในว่าง — เช็ค string อย่างเดียว |
| 2026-08-08 | เพิ่มแกน `Content` ใน Figma แทน boolean | boolean ของ Figma กลับด้านไม่ได้ — ซ่อนป้าย*และ*เปลี่ยนสีข้อความพร้อมกันด้วยตัวเดียวทำไม่ได้ | 12 → 24 variant |

---

## ค้าง

- 🔴 **ชื่อ `size` ไม่ตรงกับ Button** — ความสูงชุดเดียวกันซ่อนอยู่คนละชื่อ

  | ความสูง | Button | Input |
  |---|---|---|
  | 36 | `md` | `sm` |
  | 44 | `lg` | `md` |
  | 48 | `xl` | `lg` |

  `size="md"` จึงได้ปุ่ม 36px คู่กับช่องกรอก 44px ในฟอร์มเดียวกัน
  แก้ได้ด้วยการรวม scale แต่**กระทบ 9 ไฟล์**ที่ใช้ `FieldSize` ร่วมกัน (Select · Textarea · DatePicker · TimePicker · ComboBox · EntityAutocomplete · MultiAutocomplete) — ต้องตัดสินใจก่อนทำ
- 🟡 มุมโค้ง Input 4px แต่ Button 6px — ทั้งสองค่ามาจากของจริง แต่มันนั่งข้างกันในฟอร์ม
- Portal ใช้รูปทรงคนละชุด (8px / `#b9c2cb` / 16px) ยังไม่ยุบ
- ยังไม่มีสถานะ `hover` ใน Figma
- DS Input **ไม่มีแอปไหน import เลย** (0/4) — เหมือน Button
