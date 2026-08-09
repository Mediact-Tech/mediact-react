import type { Meta, StoryObj } from "@storybook/react-vite";
import { Calendar, FolderOpen, Inbox, Info, Search, WifiOff } from "lucide-react";
import { Button } from "../ui/Button";
import { EmptyState, ErrorState } from "./EmptyState";

const meta = {
  title: "Feedback/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "สถานะ **ไม่มีข้อมูล** และ **โหลดไม่สำเร็จ** — โครงเดียวกัน ต่างกันแค่ค่าตั้งต้น",
          "",
          "### สำรวจของจริงก่อน — 53 ไฟล์ที่พูดเรื่องนี้ หน้าตาไม่ตรงกันสักกลุ่ม",
          "",
          "| แอป | ทรง | สีพื้นป้าย |",
          "|---|---|---|",
          "| Portal | วงกลม ไอคอน 60px | `#e3f2fd` |",
          "| MediHR (ตัวกลาง) | **คัดลอกจาก Portal ทั้งไฟล์** | `#e3f2fd` |",
          "| MediHR (หน้ารายละเอียด) | สี่เหลี่ยมมน 64 | `teal-50` |",
          "| Mediwork | วงกลม 72 · ไอคอน**สีขาว** | `#D4F1EF` |",
          "| Medimatch | ไม่มีป้าย · ไอคอนเทา 20% | — |",
          "",
          "🔴 **ทั้ง 4 แอปใช้สีที่ไม่ตรงกับแบรนด์ตัวเองสักแอป** ⇒ ที่นี่ผูกกับ `brand/subtle`",
          "ตัวเดียว แล้วให้ธีมของแอปกำหนดค่า — เขียนที่เดียว ได้ 4 สีอัตโนมัติ",
          "",
          "🔴 **ไม่มีแอปไหนใช้ *รูป* เลยสักที่ — เป็นไอคอนล้วนทั้ง 53 ไฟล์**",
          "ช่อง `image` จึงเป็นของใหม่ ไม่ได้ยกมาจากของเดิม",
          "",
          "⚠️ บน **Medimatch** `brand/subtle` เท่ากับ `bg/surface` พอดี (`#e6f2f6`)",
          "— component วาดการ์ด `bg/default` ของตัวเองจึงปลอดภัย แต่ถ้าส่ง `className`",
          "ไปทับพื้นการ์ด ป้ายจะกลืนหายไป",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

/** ค่าตั้งต้น — ป้ายวงกลมสีตามธีมของแอป */
export const Default: Story = {
  args: {
    icon: <Inbox />,
    title: "ยังไม่มีรายการ",
    description: "กดปุ่มเพิ่มเพื่อสร้างรายการแรก",
  },
};

export const WithAction: Story = {
  args: {
    icon: <FolderOpen />,
    title: "ยังไม่มีหน่วยงาน",
    description: "สร้างหน่วยงานแรกเพื่อเริ่มจัดเวร",
    action: <Button>เพิ่มหน่วยงาน</Button>,
  },
};

/** **ช่องรูปรับได้ทั้งไอคอนและรูป**
 *
 * `icon` → วางในป้ายสีพื้น · `image` → แสดงตรง ๆ ไม่มีป้าย (ภาพประกอบมักมีพื้นในตัวแล้ว)
 *
 * รับเป็น element ไม่ใช่ `src` เพราะแต่ละแอปโหลดรูปคนละทาง —
 * `next/image` ต้อง import จากฝั่งแอป DS ดึงเข้ามาไม่ได้
 */
export const IconVsImage: Story = {
  args: { title: "—" },
  render: () => (
    <div className="grid gap-4 md:grid-cols-3">
      <EmptyState
        icon={<Inbox />}
        title="icon"
        description="ป้ายวงกลม สีตามธีมแอป"
      />
      <EmptyState
        image={
          <img
            src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' rx='16' fill='%23e6eefc'/><circle cx='60' cy='48' r='20' fill='%23a8c0ea'/><rect x='28' y='78' width='64' height='10' rx='5' fill='%23a8c0ea'/></svg>"
            alt="ภาพประกอบ"
          />
        }
        title="image"
        description="ไม่มีป้ายให้โดยปริยาย"
      />
      <EmptyState
        image={
          <img
            src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='72' height='72'><circle cx='36' cy='36' r='24' fill='%23ffffff'/><path d='M24 36h24M36 24v24' stroke='%23a8c0ea' stroke-width='4'/></svg>"
            alt="ภาพประกอบมีพื้น"
          />
        }
        mediaShape="circle"
        tone="info"
        title="image + mediaShape"
        description="สั่งให้มีพื้นวงกลมได้"
      />
    </div>
  ),
};

/** **สีพื้นเปลี่ยนตามแอป — สลับธีมที่แถบบนของ Storybook แล้วดูป้ายซ้ายสุด**
 *
 * `brand` ตัวเดียวที่ขยับตามธีม · อีก 5 ตัวเป็นสี**ความหมาย** ซึ่งต้องเหมือนกันทุกแอป
 * โดยตั้งใจ — "ผิดพลาด" ต้องแดงเท่ากันทุกที่ ไม่ใช่แดงบ้างครามบ้างตามแบรนด์
 */
export const Tones: Story = {
  args: { title: "—" },
  render: () => (
    <div className="grid gap-4 md:grid-cols-3">
      {(["brand", "info", "success", "warning", "danger", "neutral"] as const).map(
        (tone) => (
          <EmptyState
            key={tone}
            tone={tone}
            icon={<Inbox />}
            title={tone === "brand" ? "brand ← ตามธีมแอป" : tone}
            description="ตัวอย่างคำอธิบาย"
          />
        ),
      )}
    </div>
  ),
};

/** ทรงป้าย — **กลมอย่างเดียว** · `none` = ไม่มีป้าย
 *
 * MediHR มีสี่เหลี่ยมมนอยู่ที่หน้ารายละเอียด แต่ผู้ใช้เคาะให้เหลือทรงเดียว —
 * สองทรงในระบบเดียวไม่ได้สื่ออะไรต่างกัน มีแต่ทำให้แต่ละจอเลือกไม่เหมือนกัน
 */
export const MediaShapes: Story = {
  args: { title: "—" },
  render: () => (
    <div className="grid gap-4 md:grid-cols-2">
      {(["circle", "none"] as const).map((shape) => (
        <EmptyState
          key={shape}
          mediaShape={shape}
          icon={<Inbox />}
          title={shape}
          description="ตัวอย่างคำอธิบาย"
        />
      ))}
    </div>
  ),
};

/** สองขนาด — `sm` สำหรับในการ์ด/ส่วนย่อย · `md` สำหรับทั้งหน้า
 *
 * ⚠️ **ขนาดไอคอนถูกบังคับที่ป้าย ไม่ใช่ที่ตัวไอคอน** (`sm` 24 · `md` 32)
 * ของจริงเคยมีจอที่พกไอคอนเทา 44px ของตัวเองมาแล้วรับดีไซน์ครึ่งเดียว
 */
export const Sizes: Story = {
  args: { title: "—" },
  render: () => (
    <div className="grid gap-4 md:grid-cols-2">
      {(["sm", "md"] as const).map((size) => (
        <EmptyState
          key={size}
          size={size}
          icon={<Calendar />}
          title={`size = ${size}`}
          description="ยังไม่ได้เลือกเดือนที่ต้องการดู"
        />
      ))}
    </div>
  ),
};

/** ว่างเพราะกรองไม่เจอ — คนละเรื่องกับ "ยังไม่มีข้อมูลเลย"
 *
 * 🔴 บอกให้ผู้ใช้ไปสร้างใหม่ทั้งที่เขาแค่กรองผิด คือทางที่ทำให้เขาสร้างข้อมูลซ้ำ
 */
export const NoSearchResult: Story = {
  args: {
    icon: <Search />,
    tone: "neutral",
    title: "ไม่พบผลลัพธ์",
    description: "ลองแก้คำค้นหรือล้างตัวกรอง",
    action: <Button variant="secondary">ล้างตัวกรอง</Button>,
  },
};

/** เงียบ ๆ ในบรรทัดเดียว — ไม่มีป้าย ไม่มีหัวเรื่อง */
export const Quiet: Story = {
  args: {
    tone: "none",
    icon: <Info className="text-text-tertiary" strokeWidth={1.5} />,
    description: "ยังไม่มีประกาศงานในระบบ",
  },
};

/* ────────────────────────────────────────────────────────────────────────────
 * ErrorState
 * ──────────────────────────────────────────────────────────────────────────── */

/** **โหลดไม่สำเร็จ** — โครงเดียวกับ `EmptyState` ต่างที่ค่าตั้งต้น
 *
 * ใช้โครงเดียวกันโดยตั้งใจ เพราะสองสถานะนี้ยืนอยู่ที่เดียวกันบนจอ —
 * ถ้าโครงต่างกัน จอจะกระโดดตอนสลับจาก "กำลังโหลด" ไป "ผิดพลาด"
 *
 * ⚠️ `retryLabel` ตั้งต้นเป็น `"Retry"` ภาษาอังกฤษ — DS ไม่มี i18n **และไม่ควรมี**
 * แอปส่งคำแปลมาเอง
 */
export const Error_Default: Story = {
  name: "ErrorState — ค่าตั้งต้น",
  args: { title: "—" },
  render: () => (
    <ErrorState
      title="โหลดข้อมูลไม่สำเร็จ"
      description="ระบบเชื่อมต่อไม่ได้ชั่วคราว ลองใหม่อีกครั้ง"
      onRetry={() => {}}
      retryLabel="ลองใหม่"
    />
  ),
};

/** เปลี่ยนไอคอนตามสาเหตุจริง — "เน็ตหลุด" กับ "เซิร์ฟเวอร์พัง" คนละเรื่องกัน */
export const Error_CustomIcon: Story = {
  name: "ErrorState — ไอคอนตามสาเหตุ",
  args: { title: "—" },
  render: () => (
    <ErrorState
      icon={<WifiOff />}
      tone="warning"
      title="ไม่มีการเชื่อมต่อ"
      description="ตรวจสอบอินเทอร์เน็ตแล้วลองใหม่"
      onRetry={() => {}}
      retryLabel="ลองใหม่"
    />
  ),
};

/** ผิดพลาดแบบใช้ภาพประกอบ — ส่ง `image` แล้วไอคอนเตือนตั้งต้นจะไม่ถูกใส่ซ้อน */
export const Error_WithImage: Story = {
  name: "ErrorState — ใช้รูป",
  args: { title: "—" },
  render: () => (
    <ErrorState
      image={
        <img
          src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='120'><rect width='140' height='120' rx='16' fill='%23fdecec'/><path d='M70 34l30 52H40z' fill='none' stroke='%23e05252' stroke-width='6' stroke-linejoin='round'/><path d='M70 54v16M70 76v2' stroke='%23e05252' stroke-width='6' stroke-linecap='round'/></svg>"
          alt="เกิดข้อผิดพลาด"
        />
      }
      title="เกิดข้อผิดพลาด"
      description="เราบันทึกปัญหานี้ไว้แล้ว ทีมงานกำลังตรวจสอบ"
      onRetry={() => {}}
      retryLabel="ลองใหม่"
    />
  ),
};
