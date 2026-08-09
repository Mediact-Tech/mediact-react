import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "./Text";

const meta = {
  title: "UI/Text",
  component: Text,
  tags: ["autodocs"],
  args: {
    children: "พยาบาลวิชาชีพ ประจำหอผู้ป่วยใน",
  },
  parameters: {
    docs: {
      description: {
        component: [
          "ข้อความเนื้อหา — ผูกกับระดับตัวอักษรของ DS ไม่ใช่ class ดิบ",
          "",
          "`as` เปลี่ยน element ได้ (`p` โดยปริยาย · ใช้ `span` เมื่ออยู่บรรทัดเดียวกับอย่างอื่น)",
          "",
          "⚠️ โครงร่างตอนโหลดสูงเท่า **บรรทัดจริง** ของระดับนั้น (`h-[1lh]`) ไม่ใช่ตัวเลขที่เดา",
          "⇒ วันที่ type scale เปลี่ยน โครงร่างตามเอง ไม่ต้องไล่แก้",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Scale: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Text variant="body-lg">body-lg · 18px — เนื้อความเน้น</Text>
      <Text variant="body-md">body-md · 16px — เนื้อความหลัก</Text>
      <Text variant="body-sm">body-sm · 14px — เนื้อความรอง</Text>
      <Text variant="caption" tone="muted">
        caption · 12px — ข้อความกำกับ
      </Text>
    </div>
  ),
};

export const Weights: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Text weight="normal">น้ำหนักปกติ · 400</Text>
      <Text weight="medium">น้ำหนักกลาง · 500</Text>
      <Text weight="semibold">น้ำหนักกึ่งหนา · 600</Text>
      <Text weight="bold">น้ำหนักหนา · 700</Text>
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Text tone="default">default — ข้อความหลัก</Text>
      <Text tone="body">body — เนื้อความยาว</Text>
      <Text tone="muted">muted — ข้อมูลประกอบ</Text>
      <Text tone="disabled">disabled — ปิดใช้งาน</Text>
      <Text tone="brand">brand</Text>
      <Text tone="link">link — ลิงก์</Text>
      <Text tone="success">success — บันทึกสำเร็จ</Text>
      <Text tone="warning">warning — ใกล้ถึงเกณฑ์</Text>
      <Text tone="danger">danger — เกินเกณฑ์ที่กำหนด</Text>
    </div>
  ),
};

/** ตัวเลขที่เรียงเป็นคอลัมน์ต้องกว้างเท่ากันทุกหลัก ไม่งั้นหลักจะเต้นตามตัวเลข */
export const Numeric: Story = {
  render: () => (
    <div className="flex gap-10">
      <div className="flex flex-col gap-1">
        <Text variant="caption" tone="muted">
          numeric (ถูก)
        </Text>
        <Text numeric>1,448</Text>
        <Text numeric>183</Text>
        <Text numeric>94</Text>
      </div>
      <div className="flex flex-col gap-1">
        <Text variant="caption" tone="muted">
          ไม่ใส่ numeric
        </Text>
        <Text>1,448</Text>
        <Text>183</Text>
        <Text>94</Text>
      </div>
    </div>
  ),
};

export const Truncate: Story = {
  render: () => (
    <div className="w-64 border border-border-default p-3">
      <Text truncate>
        ข้อความยาวมากที่ต้องตัดท้ายเมื่อพื้นที่ไม่พอ เช่นชื่อหน่วยงานเต็มของโรงพยาบาล
      </Text>
    </div>
  ),
};

export const AsSpan: Story = {
  args: {
    as: "span",
    variant: "body-sm",
    tone: "muted",
    children: "render เป็น span เมื่ออยู่ในบรรทัดเดียวกับข้อความอื่น",
  },
};
