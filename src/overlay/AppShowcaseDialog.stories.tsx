import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { AppShowcaseDialog, type ShowcaseAppKey } from "./AppShowcaseDialog";
import { Button } from "../ui/Button";

/**
 * ⚠️ ภาพตัวอย่างมาจาก `/images/app-showcase/` ของแอปที่ใช้งานจริง — Storybook ไม่มีไฟล์ชุดนั้น
 * ⇒ ช่องภาพจะว่าง **โดยตั้งใจ** · สิ่งที่ story นี้มีไว้ให้วัดคือ ทรงหน้าต่าง · ตำแหน่งคอลัมน์ขวา ·
 *   ขนาด/ระยะของตัวอักษรและปุ่ม (CLAUDE.md §4.3 — วัด อย่าดูด้วยตา)
 */
const meta = {
  title: "Overlay/AppShowcaseDialog",
  component: AppShowcaseDialog,
  parameters: { layout: "fullscreen" },
  args: { app: "medihr", onClose: () => {} },
} satisfies Meta<typeof AppShowcaseDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

const APPS: ShowcaseAppKey[] = ["medihr", "medioncloud", "medirefer", "medipay"];

/** เปิด/ปิดจริงจาก state — อย่าขับสถานะผ่าน `&args=` ใน URL (CLAUDE.md §9) */
export const Playground: Story = {
  render: function Render() {
    const [app, setApp] = React.useState<ShowcaseAppKey | null>(null);
    const [locale, setLocale] = React.useState<"th" | "en">("th");
    return (
      <div className="flex min-h-svh flex-col gap-4 p-8">
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => setLocale((l) => (l === "th" ? "en" : "th"))}
          >
            ภาษา: {locale}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {APPS.map((key) => (
            <Button key={key} onClick={() => setApp(key)}>
              {key}
            </Button>
          ))}
        </div>
        <AppShowcaseDialog app={app} onClose={() => setApp(null)} locale={locale} />
      </div>
    );
  },
};

/** ทั้ง 4 แบบเรียงกัน — ใช้ตรวจว่าคอลัมน์ขวาของแต่ละแบบเริ่มคนละ x จริงตามที่เอกสารบอก */
export const AllProducts: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-8">
      {APPS.map((key) => (
        <div key={key} className="relative h-[467px] w-[944px]">
          <AppShowcaseDialog app={key} onClose={() => {}} />
        </div>
      ))}
    </div>
  ),
};

export const English: Story = {
  render: () => <AppShowcaseDialog app="medipay" onClose={() => {}} locale="en" />,
};
