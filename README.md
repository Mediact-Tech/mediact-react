# @mediact/react

React component library สำหรับ Mediact ecosystem — Tailwind v4 + Radix UI

## ติดตั้ง

```bash
bun add "https://github.com/Mediact-Tech/mediact-react.git#v1.0.2"
# หรือ npm / yarn
npm install "https://github.com/Mediact-Tech/mediact-react.git#v1.0.2"
```

> เปลี่ยน tag เป็น version ล่าสุดได้จาก [Releases](https://github.com/Mediact-Tech/mediact-react/releases)

---

## Setup — Next.js Pages Router + Tailwind v4

### 1. `next.config.ts`

เพิ่ม `transpilePackages` เพื่อแก้ Turbopack CSS extension error จาก transitive deps:

```ts
const nextConfig: NextConfig = {
  transpilePackages: ["@mediact/react"],
};
```

### 2. `globals.css` (หรือ `app.css`)

ต้องมี **3 ส่วน** ครบ ไม่เช่นนั้น DS components จะ render ผิด:

```css
@import "tailwindcss";

/* ── ส่วนที่ 1: ให้ Tailwind scan class names จาก DS dist ──────────────
   ถ้าขาดส่วนนี้: Popover / Dropdown จะกว้างเต็มหน้าจอ (width ไม่ถูก generate) */
@source "../../node_modules/@mediact/react/dist";

/* ── ส่วนที่ 2: Design tokens ใน @theme{} ─────────────────────────────
   ใส่เฉพาะ hex สี solid — Tailwind v4 จะ drop ค่า alpha silently */
@theme {
  --color-brand:           #283541;
  --color-brand-hover:     #036a8a;
  --color-brand-active:    #0b77c6;
  --color-brand-foreground: #ffffff;
  --color-brand-subtle:    #f0f9ff;
}

/* ── ส่วนที่ 3: Border tokens — ต้องอยู่ใน :root{} ────────────────────
   Tailwind v4 ไม่ยอมรับ alpha values (rgba / 8-digit hex) ใน @theme{}
   จึงต้องประกาศใน :root{} และสร้าง utility class เองผ่าน @layer utilities */
:root {
  --color-border-subtle:  rgba(0, 0, 0, 0.06);
  --color-border-default: rgba(0, 0, 0, 0.12);
  --color-border-strong:  rgba(0, 0, 0, 0.23);
  --color-border-input:   rgba(0, 0, 0, 0.36);
}

@layer utilities {
  .border-border-subtle  { border-color: var(--color-border-subtle); }
  .border-border-default { border-color: var(--color-border-default); }
  .border-border-strong  { border-color: var(--color-border-strong); }
  .border-border-input   { border-color: var(--color-border-input); }
  .bg-border-default     { background-color: var(--color-border-default); }
  .bg-border-subtle      { background-color: var(--color-border-subtle); }
  .divide-border-default > :not(:last-child) { border-color: var(--color-border-default); }
}
```

> **`@source` path** คิดจาก CSS file ไม่ใช่ project root
> ถ้า CSS อยู่ที่ `src/styles/globals.css` → path คือ `../../node_modules/@mediact/react/dist`
> ถ้าอยู่ที่ `src/app/globals.css` → path คือ `../../../node_modules/@mediact/react/dist`

---

## Setup — Vite

```ts
// vite.config.ts
import tailwindcss from "@tailwindcss/vite";
export default {
  plugins: [tailwindcss()],
};
```

`globals.css` ใช้โครงสร้างเดียวกัน แต่ปรับ `@source` path ให้ตรงกับ project structure

---

## ใช้งาน

```tsx
import {
  Button,
  Input,
  TopNav,
  TopNavBrand,
  TopNavSpacer,
  AppLauncher,
  UserMenu,
} from "@mediact/react";
```

### TopNav + AppLauncher + UserMenu

```tsx
<TopNav>
  <TopNavBrand>{facilityName}</TopNavBrand>
  <TopNavSpacer />
  <AppLauncher
    apps={{
      mediwork: { baseUrl: "https://mediwork.example.com" },
      medimatch: { baseUrl: "https://medimatch.example.com" },
      medipay:   { comingSoon: true },
    }}
  />
  <UserMenu
    user={{ name: "สมชาย ใจดี", role: "Admin", src: profileImageUrl }}
    items={[{ label: "My Profile", onClick: () => router.push("/profile") }]}
    onLogout={logout}
    logoutLabel="Log Out"
    bottomLeft={<LanguageSwitcher />}
  />
</TopNav>
```

---

## Theming

Override brand palette หลัง `@import "tailwindcss"` ใน globals.css:

```css
@theme {
  --color-brand:            #0B77C6;  /* primary buttons, checked states, active tabs */
  --color-brand-hover:      #085a99;  /* hover */
  --color-brand-active:     #054f87;  /* active/pressed, info icon tones */
  --color-brand-foreground: #ffffff;  /* text on brand background */
  --color-brand-subtle:     #eff6ff;  /* tint bg — selected rows, dropdown highlights */
}
```

### Semantic tokens

| Token | Default | ใช้ที่ |
|-------|---------|--------|
| `--color-brand` | `#283541` | Button primary, Checkbox/Switch checked, Tabs active, Tooltip bg |
| `--color-brand-hover` | `#036a8a` | Button primary hover |
| `--color-brand-active` | `#0b77c6` | Stepper active dot, TimePicker selected cell |
| `--color-brand-foreground` | `#ffffff` | Text บน brand background |
| `--color-brand-subtle` | `#f0f9ff` | Button secondary hover, ComboBox selected row, Chip bg |

### Border tokens (ไม่ควร override)

| Token | ค่า | ใช้ที่ |
|-------|-----|--------|
| `--color-border-subtle` | `rgba(0,0,0,0.06)` | TopNav border, Card elevated, DropdownMenu separator |
| `--color-border-default` | `rgba(0,0,0,0.12)` | Dialog, Popover, Table rows, DataTable border |
| `--color-border-strong` | `rgba(0,0,0,0.23)` | Input / Textarea rest-state |
| `--color-border-input` | `rgba(0,0,0,0.36)` | Checkbox / RadioGroup unchecked |

---

## Gotchas

### Tailwind v4 drop alpha colors จาก `@theme {}`

```css
/* ❌ ไม่ทำงาน — Tailwind v4 drop ค่า alpha silently */
@theme {
  --color-border-subtle: rgba(0, 0, 0, 0.06);
}

/* ✅ ถูกต้อง — ใส่ใน :root{} + เพิ่ม utility class เอง */
:root {
  --color-border-subtle: rgba(0, 0, 0, 0.06);
}
@layer utilities {
  .border-border-subtle { border-color: var(--color-border-subtle); }
}
```

### `@source` ต้อง point ไป directory ไม่ใช่ file เดี่ยว

```css
/* ❌ */
@source "../../node_modules/@mediact/react/dist/index.js";

/* ✅ */
@source "../../node_modules/@mediact/react/dist";
```

### Next.js ต้องมี `transpilePackages`

ถ้าขาด Next.js Turbopack จะ error: `ERR_UNKNOWN_FILE_EXTENSION` จาก `react-day-picker` transitive import

```ts
// next.config.ts
transpilePackages: ["@mediact/react"]
```
