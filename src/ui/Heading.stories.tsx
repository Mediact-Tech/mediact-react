import type { Meta, StoryObj } from "@storybook/react-vite";
import { Heading } from "./Heading";
import { Text } from "./Text";

const meta = {
  title: "UI/Heading",
  component: Heading,
  tags: ["autodocs"],
  args: {
    children: "ตารางเวรเดือนสิงหาคม",
  },
  parameters: {
    docs: {
      description: {
        component: [
          "หัวข้อ — **ระดับทางความหมายแยกจากขนาดที่ตาเห็น**",
          "",
          "🔴 `level` (h1–h6) เป็นเรื่องของโปรแกรมอ่านหน้าจอ · `size` เป็นเรื่องของสายตา",
          "ผูกสองอย่างเข้าด้วยกันจะเลือกได้แค่อย่างเดียว — เช่นหัวข้อ `h2` ที่ต้องดูเล็กกว่า `h3`",
          "ข้าง ๆ ในการ์ด ซึ่งเกิดขึ้นตลอดในหน้าจริง",
          "",
          "**ห้ามเลือก `level` จากขนาดที่อยากได้**",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Heading size="title-lg">title-lg · 30px</Heading>
      <Heading size="title-md">title-md · 24px</Heading>
      <Heading size="title-sm">title-sm · 20px</Heading>
      <Heading size="body-lg">body-lg · 18px — หัวข้อย่อยในการ์ด</Heading>
    </div>
  ),
};

/** `level` (ความหมาย) แยกจาก `size` (สายตา) โดยตั้งใจ
 *
 * การ์ดใบนี้เป็น h3 ตามลำดับหัวข้อของหน้า แต่ต้องดูเล็กกว่าหัวข้อ section
 * ถ้าผูกขนาดไว้กับ level จะต้องเลือกอย่างใดอย่างหนึ่ง — เสีย a11y หรือเสียดีไซน์
 */
export const LevelVsSize: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Heading level={2} size="title-md">
        หน่วยงานผู้ป่วยใน (h2)
      </Heading>
      <div className="border border-border-default p-4">
        <Heading level={3} size="body-lg">
          อัตรากำลังวันนี้ (h3 · เล็กกว่าโดยตั้งใจ)
        </Heading>
        <Text variant="body-sm" tone="muted" className="mt-1">
          ต้องการ 12 คน · ขึ้นเวรจริง 10 คน
        </Text>
      </div>
    </div>
  ),
};

export const Weights: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Heading weight="medium">น้ำหนักกลาง · 500</Heading>
      <Heading weight="semibold">น้ำหนักกึ่งหนา · 600</Heading>
      <Heading weight="bold">น้ำหนักหนา · 700</Heading>
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Heading tone="default">default</Heading>
      <Heading tone="heading">heading</Heading>
      <Heading tone="brand">brand</Heading>
    </div>
  ),
};
