# @mediact/react/ai-chat

Shared AI assistant UI สำหรับทุกแอปใน Mediact ecosystem — ปุ่มลอย (floating button) + drawer แชท
ที่ต่อกับ `mediact-ai-service` โดยตรง

ใส่ได้ทั้ง **Portal** · **Mediwork (web-backoffice)** · **Medimatch (backoffice)** ด้วยโค้ดชุดเดียวกัน

---

## ทำไมเป็น library ไม่ใช่แอป

widget นี้ **ไม่รู้จัก** Keycloak, ky, router หรือ state ของแอปไหนเลย — แอปเจ้าบ้านส่ง 2 อย่างเข้ามา
(`baseUrl` + `getToken`) ที่เหลือ widget จัดการเอง (REST + WebSocket + streaming + widget rendering)
ทำให้ 3 แอปที่ stack ต่างกัน (Pages Router / App Router / MUI) ใช้ตัวเดียวกันได้โดยไม่ต้อง fork

---

## ติดตั้ง

```bash
bun add "https://github.com/Mediact-Tech/mediact-react.git#v1.1.7"
```

> เปลี่ยน tag เป็นเวอร์ชันล่าสุดได้จาก [Releases](https://github.com/Mediact-Tech/mediact-ai-chat/releases)
> — tag ของ widget ใช้ prefix `ai-chat-v*` แยกจาก `v*` ของ `@mediact/react`

---

## Setup (Next.js + Tailwind v4)

### 1. `next.config.ts`

```ts
const nextConfig: NextConfig = {
  transpilePackages: ["@mediact/react"],
};
```

### 2. `globals.css`

```css
@import "tailwindcss";

/* ให้ Tailwind scan class จาก bundle ของ widget — ถ้าขาด drawer จะ render ไม่มีสไตล์ */
@source "../../node_modules/@mediact/react/dist";

/* tokens (ข้ามได้ถ้าแอปมี @mediact/react/style.css อยู่แล้ว — ใช้ token ชุดเดียวกัน) */
@import "@mediact/react/ai-chat.css";
```

> path ของ `@source` คิดจากตำแหน่งไฟล์ CSS ไม่ใช่ project root
> `src/styles/globals.css` → `../../node_modules/…` · `src/app/globals.css` → `../../../node_modules/…`

**animation (ไม่บังคับ):** drawer ใช้ utility ของ `tw-animate-css` (`slide-in-from-right`)
ถ้าแอปไม่ได้ import ไว้ drawer ยังทำงานปกติ แค่ไม่มี transition — เพิ่ม `@import "tw-animate-css";` ถ้าอยากได้

### 3. mount ครั้งเดียวที่ root

Portal (Pages Router) — `src/pages/_app.tsx`:

```tsx
import { AiChatWidget } from "@mediact/react/ai-chat";
import keycloak from "@/libs/keycloak";

<AiChatWidget
  baseUrl={process.env.NEXT_PUBLIC_AI_SERVICE_URL!}
  auth={{ url: env.keycloakUrl, realm: env.keycloakRealm }}   // widget ล็อกอินเป็นตัวเอง — ดูหัวข้อถัดไป
  getToken={async () => {                                      // fallback เมื่อ silent check ไม่ผ่าน
    await keycloak.updateToken(30).catch(() => false);
    return keycloak.token ?? "";
  }}
/>
```

Mediwork / Medimatch (App Router) — วางใน client component ของ layout:

```tsx
"use client";
import { AiChatWidget } from "@mediact/react/ai-chat";
import keycloak from "@/libs/keycloak";   // ทั้ง 3 แอป export default เหมือนกัน

<AiChatWidget
  baseUrl={process.env.NEXT_PUBLIC_AI_SERVICE_URL!}
  getToken={() => keycloak.token ?? ""}
  scope={{ departmentId, subUnitId }}     // หน้าไหนอยู่แผนก/หน่วยงานอะไร ส่งเข้ามา
/>
```

### `auth` — ทำไม widget ต้องมี Keycloak client ของตัวเอง

revise-api ตรวจสิทธิ์ **ราย KC client** (`azp`) ไม่ใช่แค่รายผู้ใช้ · route จัดเวรรับเฉพาะ `mediwork` กับ
`mediact-ai-assistant` ⇒ widget ตัวเดียวกันที่ทำงานได้ใน Mediwork จะโดน **403** ใน Portal/Medimatch
เพราะบังเอิญยืม token ของแอปนั้นมา:

```
[Tool:get_department_rules]  403 Client 'portal' is not authorized. Allowed clients: mediwork, mediact-ai-assistant
[Tool:get_schedule_grid]     403 (เดียวกัน)
preview_auto_schedule        403 (เดียวกัน)
```

ทางแก้ที่ **ไม่** ต้องเปิด route จัดเวรให้ FE ของ Portal/Medimatch ไปด้วย คือให้ widget ถือ session ของ
client `mediact-ai-assistant` เอง ผู้ใช้ไม่ต้องล็อกอินซ้ำ — เบราว์เซอร์มี SSO session ของ realm อยู่แล้ว
`check-sso` แค่ adopt มาแบบเงียบผ่าน iframe

**ข้อกำหนดฝั่ง Keycloak (DevOps)** — ถ้ายังไม่ครบ widget จะ fallback ไปใช้ token ของ host เหมือนเดิม:

| # | ต้องมี | ทำไม |
|---|--------|------|
| 1 | client `mediact-ai-assistant` (public + PKCE) **ทุก realm** ที่ใช้งาน | ตอนนี้มีแค่ `mediact_qa` · realm `mediact` ตอบ "Client not found" |
| 2 | redirect URI + web origins ของทั้ง 3 โดเมน (+ `http://localhost:*` สำหรับ dev) | silent check redirect กลับมาที่ `/silent-check-sso.html` ของแอป |
| 3 | 🔴 protocol mapper ชุดเดียวกับ client แอป: `preferred_id` · `role` · `authorize_facility` · **`authorize_sub_unit`** | ai-service อ่าน 3 ตัวแรกเป็น identity ส่วนตัวสุดท้ายคือ guard สิทธิ์ระดับหน่วยงาน (C1) — ขาดแล้ว 403 แทบทุก route |

**ฝั่งแอป** ต้อง serve ไฟล์ `public/silent-check-sso.html` (portal-web มีอยู่แล้ว):

```html
<html><body><script>parent.postMessage(location.href, location.origin);</script></body></html>
```

**พฤติกรรมเวลาใช้จริง** — self-auth เป็น *ส่วนเสริม* ไม่ใช่ประตูที่ต้องผ่าน:

1. ลอง silent check-sso ด้วย client ของ widget เอง
2. ไม่ผ่านภายใน `initTimeoutMs` (ค่าเริ่มต้น **3 วินาที**) → ใช้ `getToken()` ของ host
3. จำผลไว้ ไม่ลองใหม่ทุกครั้งที่ส่ง

ข้อ 2 ไม่ใช่ความหรูหรา: การถูกบล็อก (CSP `frame-ancestors`, cookie นโยบาย, client ไม่มีใน realm) **ไม่ error
ทันที แต่ค้าง** — วัดบน localhost ที่ realm ยังไม่มี client แล้ว drawer ค้างที่ "กำลังเชื่อมต่อ…" เกิน 30 วินาที

> ⚠️ บน localhost iframe ไป `sso.*.mediact.biz` เป็น **cross-site** (คนละ eTLD+1) → cookie ถูกบล็อก
> silent check จึงไม่ผ่านเป็นปกติ แล้วตกไปใช้ token ของ host · ส่วนบนโดเมนจริง `*.mediact.biz`
> เป็น **same-site** จึงผ่าน

### Token refresh — สิ่งที่ host ต้องรู้

widget ไม่ refresh token เอง (ไม่ควรมี KC อยู่ใน library) แต่จัดการ "ใช้ token สด" ให้ครบ 3 ชั้น:

| ชั้น | ทำอะไร |
|---|---|
| REST | เรียก `getToken()` ใหม่**ทุก request** |
| WS reconnect | ส่ง token สดผ่าน `getData` ทุกครั้งที่ centrifuge ต่อใหม่ |
| ก่อนส่งทุกเทิร์น | เทียบ token ปัจจุบันกับตัวที่ connection pin ไว้ — **ถ้าเปลี่ยน จะ reconnect เพื่อ re-pin ก่อน** แล้วค่อยยิง `chat.send` |

ชั้นที่ 3 จำเป็นเพราะ Centrifugo pin JWT ไว้ใน connection meta ตอน connect
(`centrifugo-proxy.grpc.controller.ts` → `coreJwt`) และ **ทุกเทิร์นถูกประมวลผลด้วย token นั้น** —
ai-service ส่งต่อเป็น `Bearer` ไป revise-api โดยไม่ verify ซ้ำ ฝั่ง Centrifugo ก็ไม่มี refresh proxy
และ connect reply ไม่มี `expire_at` จึงไม่มีอะไร re-pin ให้เอง ⇒ ถ้าเปิด drawer ค้างไว้เกินอายุ token
เทิร์นจะยังส่งได้แต่ tool ที่วิ่งไป revise-api จะล้มแบบเงียบ การ reconnect คือวิธีเดียวที่ติดตั้ง token ใหม่ได้

**ดังนั้น `getToken` ควรคืน token ที่ refresh แล้วจริง ไม่ใช่ค่าที่ค้างอยู่:**

```tsx
getToken={async () => {
  await keycloak.updateToken(30);   // refresh ถ้าเหลืออายุ < 30 วิ
  return keycloak.token ?? "";
}}
```

(portal-web มี auto-refresh ใน `KeycloakProvider` อยู่แล้ว — `() => keycloak.token ?? ""` ก็พอ
แต่เขียนแบบข้างบนปลอดภัยกว่าและใช้ได้เหมือนกันทุกแอป)

---

## Props

| prop | ชนิด | ค่าเริ่มต้น | ความหมาย |
|------|------|-----------|----------|
| `baseUrl` | `string` | — | URL ของ ai-service เช่น `http://localhost:8086` |
| `getToken` | `() => string \| Promise<string>` | — | Keycloak access token ของ host — จำเป็นเมื่อไม่ได้ตั้ง `auth`, ถ้าตั้งแล้วกลายเป็น fallback |
| `auth` | `{ url, realm, clientId?, silentCheckSsoRedirectUri?, initTimeoutMs? }` | — | ให้ widget ถือ session Keycloak ของตัวเอง (`mediact-ai-assistant`) — [ทำไม](#auth--ทำไม-widget-ต้องมี-keycloak-client-ของตัวเอง) |
| `scope` | `{ departmentId?, subUnitId?, departmentName?, month?, year? }` | — | บริบทที่ turn จะทำงานด้วย (อ่านใหม่ทุกครั้งที่ส่ง) |
| `mode` | `"assistant" \| "schedule"` | `"assistant"` | โหมดของ turn (DEC-AI-06) |
| `showModeToggle` | `boolean` | `false` | โชว์ปุ่มสลับโหมดในหัว drawer (ถ้า agent สลับเองผ่าน `[[ENTER_MODE]]` แถบจะโผล่อัตโนมัติแม้ตั้ง `false`) |
| `suggestions` | `string[]` | คำถามตัวอย่างเรื่องเวร | ปุ่มคำถามตัวอย่างในหน้าว่าง กดแล้วส่งเลย |
| `position` | `"bottom-right" \| "bottom-left"` | `"bottom-right"` | มุมที่ปุ่มลอยอยู่ |
| `labels` | `Partial<AiChatLabels>` | ไทย | ทับข้อความทีละคำได้ (`launcher` = ข้อความบนปุ่มลอย) |
| `open` / `defaultOpen` / `onOpenChange` | | | คุมสถานะเปิด/ปิดเองได้ (controlled) |
| `hideLauncher` | `boolean` | `false` | ซ่อนปุ่มลอย เมื่ออยากเปิด drawer จากปุ่มของแอปเอง |
| `onError` | `(error: Error) => void` | — | ส่ง error ออกไป log ฝั่งแอป (widget แสดง error state ของตัวเองอยู่แล้ว) |
| `debug` | `boolean` | `false` | เปิด log ของ centrifuge |

---

## ตัววัดบริบท (context meter)

หัว drawer มีแถบเล็กๆ บอกว่าแชทนี้ใช้ความจำไปเท่าไหร่แล้ว — **ไม่ต้องตั้งค่าอะไร** โผล่เองเมื่อ ai-service
ส่งตัวเลขมากับ event `done`

สิ่งที่วัด **ไม่ใช่** context window ของโมเดล แต่เป็นเพดานที่ ai-service เริ่ม **ตัดข้อความเก่าสุดทิ้ง**
(`AI_QA_HISTORY_TOKEN_BUDGET` ค่าเริ่มต้น 8,000) — เส้นนี้คือสิ่งที่ผู้ใช้รู้สึกได้จริง ("ทำไมมันลืมแผนกที่บอกไปตอนแรก")
จึงควรเห็นก่อนจะข้าม

| สถานะ | เงื่อนไข | สี |
|---|---|---|
| ปกติ | < 80% | น้ำเงิน |
| ใกล้เต็ม | ≥ 80% | เหลือง |
| ตัดแล้ว | `trimmed` หรือ ≥ 100% | แดง + tooltip บอกว่าตัดไปแล้ว |

เกิน 100% แถบตันที่ 100 แต่ตัวเลขบอกค่าจริง (เช่น `202%`) — ส่วนเกินนั่นแหละคือสิ่งที่จะถูกตัดในเทิร์นถัดไป

หมายเหตุ 2 ข้อ:
- ตัวเลขเป็น **ค่าประมาณ (chars/4)** ตัวเดียวกับที่ ai-service ใช้ตัดสินใจตัดจริง — ถ้าใช้ tokenizer จริงมาแสดง
  มาตรวัดจะไม่ตรงกับกฎที่มันอธิบาย (เช่น ขึ้น 80% ทั้งที่ระบบตัดไปแล้ว)
- ถ้า `AI_QA_HISTORY_ENABLED=false` ทุกเทิร์นเริ่มจากศูนย์ ไม่มีอะไรสะสม → service ไม่ส่งตัวเลขมา และแถบจะไม่ขึ้นเลย

---

## z-index (สำคัญกับแอปที่ใช้ MUI)

widget portal ไปที่ `<body>` และตั้ง z-index ผ่าน CSS variable — ค่าเริ่มต้น `1310` (เหนือ MUI Modal 1300)

```css
:root {
  --mediact-ai-chat-z: 900;                    /* ให้ dialog ของแอปทับ widget ได้ */
  --mediact-ai-chat-drawer-width: 30rem;       /* ความกว้าง drawer (≥sm) */
  --mediact-ai-chat-launcher-offset: 1rem;     /* ระยะห่างปุ่มจากขอบจอ */
}
```

drawer เป็นแบบ **non-modal** โดยตั้งใจ — คลิก/เลื่อนหน้าเว็บด้านหลังได้ระหว่างเปิดแชท และคลิกนอก drawer
ไม่ทำให้ปิด (กด Esc หรือปุ่ม × เท่านั้น) เพราะผู้ใช้ต้องดูตารางเวรไปถามไป

---

## ต่อกับ ai-service ยังไง

| ทาง | endpoint | ใช้ทำอะไร |
|-----|----------|-----------|
| REST | `POST /v2/ai/conversations` | เปิดห้องใหม่ |
| REST | `GET /v2/ai/conversations` | ประวัติแชท (resume picker) |
| REST | `GET /v2/ai/conversations/:id/messages` | โหลด transcript ตอน resume |
| REST | `POST /v2/ai/transport/subscribe` | ขอ `wsUrl` + ชื่อ channel |
| REST | `POST /v2/ai/chat/runs/:runId/cancel` | ยกเลิก run ที่กำลังทำงาน |
| WS | `chat.send` (Centrifugo RPC) | **ส่ง turn — ทางเดียวเท่านั้น ไม่มี HTTP fallback** |
| WS | `chat:{id}` / `task:{id}` | รับ event กลับ |

**auth ของ WebSocket:** ไม่มีการ mint token ของ Centrifugo — client ส่ง Keycloak token เป็น connect `data`
แล้ว connect proxy ของ ai-service เป็นคนตรวจ (`getData` ทำให้ token สดถูกส่งใหม่ทุก reconnect)

**event ที่ render:** `token` (streaming) · `tool_call` (แถบความโปร่งใส RR-A.6 + ตัวนับวินาทีสำหรับ tool ที่นาน เช่น solver ~90 วิ)
· `widget` (7 ชนิดตาม contract §3) · `proposal` · `done` (แบดจ์ "บันทึกแล้ว" อ่านจาก `done.committed` ซึ่งเป็น**ข้อมูล**
ไม่ใช่การตีความข้อความตอบ)

**รายละเอียดโปรโตคอลที่พลาดง่าย** (ทั้งหมดจัดการให้แล้ว):

| เรื่อง | ความจริง | ทำไมสำคัญ |
|---|---|---|
| envelope | ทุก REST response ถูกห่อเป็น `{ status, message, data }` (`CustomResponseInterceptor`) | อ่าน body ตรงๆ = ได้ `undefined` ทุก field |
| `token` | **ต่อกัน (append)** — `agent-loop` stream ทีละ chunk แล้วส่งเฉพาะส่วนที่เหลือตอนจบ | ถ้าเขียนแบบ replace จะเห็นแค่ chunk สุดท้ายเมื่อคำตอบ stream จริง |
| `[[ENTER_MODE:…]]` | sentinel จาก tool `start_scheduling` — พา conversation เข้าโหมดจัดเวรพร้อม seed แผนก/เดือน | ถ้าไม่ parse: marker ดิบโผล่ในแชท + turn ถัดไปส่งโหมดผิด อะเจนต์ถามแผนกซ้ำ |
| resume | ต้อง re-derive โหมดจาก transcript (ENTER ล่าสุดที่ยังไม่ถูก EXIT ยกเลิก) | reload กลางโหมดจัดเวรแล้วหลุดกลับโหมดผู้ช่วยเงียบๆ |
| token บน WS | JWT ถูก **pin ที่ connection** ไม่ใช่ต่อ request | refresh token แล้วไม่ reconnect = เทิร์นถัดไปยิง revise-api ด้วย token หมดอายุ (ดู [Token refresh](#token-refresh--สิ่งที่-host-ต้องรู้)) |
| คำตอบเป็น markdown | ตาราง/บุลเล็ต/ตัวหนา | ถ้า render เป็น plain text ตารางเวรจะกลายเป็นกำแพง `|` |

---

## ใช้ชิ้นส่วนแยก

ถ้าอยากฝังแชทในหน้าเว็บแทนที่จะเป็น drawer:

```tsx
import { useAiChatSession, MessageList, Composer } from "@mediact/react/ai-chat";

const session = useAiChatSession({ baseUrl, getToken });
// session.start() / session.send() / session.cancel() / session.state
```

---

## พัฒนา local

```bash
# 1. ai-service + centrifugo
cd mediact-ai-service && docker compose up -d && bun run start:dev     # :8086 / :8801

# 2. widget watch mode
cd mediact-design-system && bun run ai-chat:watch

# 3. playground (แอปจำลองเจ้าบ้าน)
bun run playground                                                     # :4300
```

เปิด `http://localhost:4300` วาง Keycloak access token (ก๊อปจากแอปที่ล็อกอินอยู่) แล้วกดปุ่มลอยมุมขวาล่าง
— เส้นทางทั้งหมดเป็นของจริง ไม่ใช่ mock

## ปล่อยเวอร์ชัน

```bash
bun run release:ai-chat          # auto-bump patch
bun run release:ai-chat 0.2.0    # ระบุเวอร์ชัน
```

build → bump → tag `ai-chat-vX.Y.Z` → push monorepo → subtree sync ไป `Mediact-Tech/mediact-ai-chat`
(ครั้งแรกต้องสร้าง repo เปล่าไว้บน GitHub ก่อน)
