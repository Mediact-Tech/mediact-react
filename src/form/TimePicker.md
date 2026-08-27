# TimePicker

ช่องกรอกเวลา `HH:mm` (+`period` เมื่อเปิดโหมด 12 ชม.) พร้อมแผงเลือกแบบ 2 คอลัมน์ที่เปิดผ่าน
`Popover` · ผู้ใช้จริงวันนี้: `mediact-web-backoffice` (โมดัล *แก้ไขข้อมูลรายวัน* ของ `time-attendance`)

> ⚠️ **เอกสารนี้ยังไม่ครบ** — ครอบเฉพาะสิ่งที่ **วัดจริง** ในรอบ 2026-08-26 · ยังไม่เคย ground
> กับ Figma และยังไม่มีตาราง Figma↔code · ส่วนที่เป็นช่องว่างคือ backlog ที่มองเห็นได้ ตามกฎ §6

---

## แผงเลือกเวลาเมื่ออยู่ใน `Dialog` — 3 บั๊กที่แก้พร้อมกัน 2026-08-26

ทั้งสามเจอจากของจริงบน Mediwork และ **ทั้งสามพังเงียบ** (ไม่มี error ไม่มี warning
แผงเปิดออกมาครบทุกอย่าง)

| # | อาการที่ผู้ใช้เห็น | ราก | แก้ที่ |
|---|---|---|---|
| ① | หมุนล้อไม่ได้ ต้องลากแถบเลื่อนเอง | `react-remove-scroll` ของ `Dialog` ผูก `wheel` ที่ **`document`** แล้ว `preventDefault()` ทุก event ที่เกิดนอกกล่องที่ล็อกไว้ · `PopoverContent` portal ไปอยู่ใต้ `<body>` **นอก** `DialogContent` | `overlay/Popover.tsx` — `stopPropagation()` ที่ตัวแผง |
| ② | "เลือกเวลาไม่ลื่น" | `scrollIntoView()` เลื่อน **ทุก ancestor ที่เลื่อนได้** ⇒ ลากโมดัล+หน้าเบื้องหลังไปด้วยทุกครั้ง · แถมอยู่ใน `useEffect` (หลัง paint) ⇒ เห็นเฟรมที่ยังไม่เลื่อนก่อน 1 เฟรม | `TimePicker.tsx` — ตั้ง `scrollTop` เอง ใน `useLayoutEffect` |
| ③ | แถบเลื่อนโชว์ตลอดเวลา | ตัวลากเป็น `bg-gray-300` ถาวร | `TimePicker.tsx` — ตัวลากโปร่งใสจนกว่าจะ hover |

### หลักฐานของ ① (วัดในเบราว์เซอร์จริง · story `Form/TimePicker in Dialog`)

```
reachedDocument: false      ← event ไม่เคยไปถึง document ⇒ RRS ไม่มีโอกาส preventDefault
defaultPrevented: false
```

⚠️ **RRS ผูกแบบ bubble จึงหยุดทัน** (`SideEffect.js:139-140` · `{passive:false}` · ไม่ใช่ capture)
— วันไหนมันเปลี่ยนไปใช้ capture ทางนี้จะใช้ไม่ได้ ต้องไปทางส่ง popover เป็น *shard* ของ RRS แทน
⛔ **ห้ามแก้ด้วยการปลด `modal` ของ `Dialog`** — เสีย focus trap ไปด้วย

### ② ลอกวิธีมาจาก MUI ตัวที่ผู้ใช้เคยใช้

`@mui/x-date-pickers` `MultiSectionDigitalClockSection.js:129-157` ทำ 3 อย่าง เราทำเหมือนกันทั้งสาม:

1. **`container.scrollTop = …` ตรง ๆ** ⇒ ไม่แตะ ancestor เลย
2. **`useLayoutEffect`** ⇒ เลื่อนเสร็จก่อน paint
3. **จำตัวที่เลือกก่อนหน้า** ⇒ เลื่อนเฉพาะตอนเปลี่ยนจริง ไม่ใช่ทุก render

สูตร: `centered = offsetTop − clientHeight/2 + itemHeight/2` แล้ว clamp ด้วย
`min(centered, scrollHeight − clientHeight)` และ `max(0, …)` — ตัวที่สองกันไม่ให้เหลือที่ว่าง
ท้ายคอลัมน์เมื่อเลือกตัวท้าย ๆ

🔴 **คอลัมน์ต้องเป็น `relative`** — `offsetTop` วัดจาก `offsetParent` ถ้าไม่ตั้ง มันจะไปวัดจาก popper
ที่อยู่นอกคอลัมน์ แล้ว**เพี้ยนทั้งก้อนแบบเงียบ ๆ** · วัดยืนยันแล้ว `offsetParent === คอลัมน์`

⚠️ **จงใจไม่ใส่ `behavior: "smooth"`** — MUI ก็ปักเป็น `auto` · ผู้ใช้เลือกเวลารัว ๆ
การอนิเมชันทุกครั้งจะรู้สึก *ช้าลง* ไม่ใช่ลื่นขึ้น · และตั้ง `[scroll-behavior:auto]` ไว้กันแอปที่
ประกาศ `scroll-behavior: smooth` ที่ `html`

**วัดหลังแก้** — เลือก `14` จาก 24 ตัวเลือก: `scrollTop` = **414.4** เทียบค่าที่คำนวณ **414** ·
ตัวที่เลือกอยู่ในกรอบเต็มใบ · `window.scrollY` = **0 ก่อนและหลัง** (ของเดิมลากหน้าไปด้วย)

### ③ ทำไมไม่ลอก MUI ตรง ๆ

MUI ใช้ `overflow: hidden` แล้วสลับเป็น `overflowY: auto` ตอน hover
(`MultiSectionDigitalClockSection.js:42-54`) ⇒ **รางเกิด/หายตอน hover ⇒ ปุ่มตัวเลือกขยับซ้ายขวา**
· MUI ทนได้เพราะคอลัมน์มันกว้างตายตัว `56px` ส่วนของเราเป็น `flex-1`

เราจึงคง `overflow-y: auto` ไว้เสมอแล้วทำ**ตัวลากให้โปร่งใสแทน** — ตาเห็นผลเหมือนกัน
(ไม่มีแถบจนกว่าจะ hover) แต่ไม่มีการขยับ

| | ก่อน | หลัง |
|---|---|---|
| ราง | 4px (`w-1`) | **11px** — `scrollbar-width: thin` ของ Chrome ชนะ `::-webkit-scrollbar{width}` |
| ตัวลากตอนไม่ hover | `gray-300` (เห็นตลอด) | โปร่งใส |
| ตัวลากตอน hover | `gray-300` | `border-default` |
| ปุ่มขยับตอน hover | — | **ไม่ขยับ** (รางกว้างคงที่) |

Tailwind ห่อ `hover:` ด้วย `@media (hover: hover)` ให้เอง = เจตนาเดียวกับ `@media (pointer: fine)`
ของ MUI · จอสัมผัสยังเลื่อนได้ปกติเพราะ `overflow-y: auto` ไม่เคยถูกปิด (ดีกว่า MUI ตรงนี้)
· รองรับทั้ง `scrollbar-color` (Firefox/Chrome ใหม่) และ `::-webkit-scrollbar-*` (Safari เก่า)

**ราคาที่รับ:** เสียที่ราง 11px ถาวร · ตอนไม่ hover ไม่มีอะไรบอกว่าเลื่อนได้

---

## `labels` — ทุกคำที่ผู้ใช้อ่านและได้ยิน

8 คีย์ · `Partial` · ที่ไม่ส่งจะตกไปใช้ `DEFAULT_LABELS` (อังกฤษ) ⇒ **ไม่ใช่ breaking change**

| คีย์ | ค่าตั้งต้น | ที่ใช้ |
|---|---|---|
| `hour` · `minute` | `HH` · `mm` | placeholder ที่ **มองเห็น** |
| `hourAria` · `minuteAria` | `Hours` · `Minutes` | `aria-label` ของ 2 ช่อง |
| `togglePeriod` · `period` | `Toggle AM/PM` · `AM/PM` | ปุ่ม/คอลัมน์โหมด 12 ชม. |
| `openPicker` · `picker` | `Open time picker` · `Select time` | ปุ่มนาฬิกา · ชื่อแผง |

ก่อนมี prop นี้ ฟอร์มภาษาไทยทั้งใบมีช่องเวลาที่อ่านว่า `HH : mm` และผู้ใช้ screen reader
ได้ยิน *"Hours"*

**วัดแล้วว่าคำไทยไม่ล้น** (Noto Sans Thai 14px · กล่อง 32px): `ชม.` = 20.4px · `นาที` = **23.2px**
⇒ เหลือที่ 8.8px · ⛔ อย่าเพิ่มคำที่ยาวกว่า `นาที` โดยไม่วัดซ้ำ

---

## ด่านที่ต้องไม่หาย

`TimePicker.test.tsx` · `Popover.test.tsx` — ทุกใบพิสูจน์ด้วยการ **กลายพันธุ์** แล้วว่าแดงจริง

- ไม่เรียก `scrollIntoView` เลย ← ด่านของ ②
- คอลัมน์มีคลาส `relative` ← กับดัก `offsetParent`
- คอลัมน์มี `[scrollbar-color:transparent_transparent]` + `overflow-y-auto` ← ด่านของ ③
- `wheel`/`touchmove` ไม่ถึง `document` ← ด่านของ ①
- `PopoverContent` มี `pointer-events-auto` ← ครึ่งแรกของบั๊กเดียวกับ ①

⚠️ **jsdom ไม่มี layout** ⇒ พิสูจน์ *ตำแหน่ง* ไม่ได้ พิสูจน์ได้แค่ *วิธี* — แต่วิธีคือตัวบั๊ก
· ตัวเลขทั้งหมดข้างบนมาจาก story `Form/TimePicker in Dialog` ในเบราว์เซอร์จริง

## ยังไม่ได้ทำ

- ไม่มี Figma component และไม่มีตาราง Figma↔code
- ไม่เคย ground ขนาด/สี/ระยะกับแอปจริง (รอบนี้แก้เฉพาะพฤติกรรม)
- `text-text-primary` ที่ยัง alias ไป `--color-brand` — `TimePicker` เป็น 1 ใน 12 จุดที่ค้างอยู่
