import type { Meta, StoryObj } from "@storybook/react-vite";
import { Info } from "lucide-react";
import { Button } from "../ui/Button";
import { Tooltip } from "./Tooltip";

const meta = {
  title: "Overlay/Tooltip",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip content="More info about this action">
      <Button variant="ghost" leftIcon={<Info />}>
        Hover me
      </Button>
    </Tooltip>
  ),
};

export const Sides: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      {(["top", "right", "bottom", "left"] as const).map((s) => (
        <Tooltip key={s} content={`On ${s}`} side={s}>
          <Button variant="secondary">{s}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};

/** `contentClassName` — เปลี่ยนโทนของกล่องเอง
 *
 * ตัว `Tooltip` แบบสะดวกล็อกโทนไว้โทนเดียว แต่ของจริงในแอปมี 2 ใน 3 ที่ที่ต้องการอีกโทน
 * (`ReadOnlyFieldWrapper` ของ portal และ `InfoTooltip` ของ mediwork)
 *
 * ⚠️ ลูกศรยังเป็นสีเดิม (`fill-brand`) — ถ้าต้องการให้เข้าชุดกันทั้งกล่องต้องปิดลูกศร
 * ด้วย `arrow={false}` ซึ่งเป็นวิธีที่ของเดิมใน portal ใช้อยู่แล้ววันนี้
 */
export const CustomTone: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Tooltip content="โทนปกติของ design system">
        <Button variant="secondary">โทนปกติ</Button>
      </Tooltip>

      <Tooltip
        content="พื้นขาว ขอบบาง — สำหรับข้อความอธิบายที่ยาวกว่าปกติ"
        arrow={false}
        contentClassName="max-w-64 border border-border-default bg-white text-text-body shadow-md"
      >
        <Button variant="secondary">โทนสว่าง</Button>
      </Tooltip>
    </div>
  ),
};
