import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusBadge } from "./StatusBadge";

const meta = {
  title: "UI/StatusBadge",
  component: StatusBadge,
  tags: ["autodocs"],
  args: {
    children: "Published",
    tone: "success",
  },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <StatusBadge tone="success">Published</StatusBadge>
      <StatusBadge tone="danger">Draft</StatusBadge>
      <StatusBadge tone="warning">มีการแก้ไขที่ยังไม่บันทึก</StatusBadge>
      <StatusBadge tone="info">Pattern A</StatusBadge>
      <StatusBadge tone="neutral">ปิดใช้งาน</StatusBadge>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <StatusBadge tone="success" size="sm">
        Published
      </StatusBadge>
      <StatusBadge tone="success" size="md">
        Published
      </StatusBadge>
    </div>
  ),
};

export const WithoutDot: Story = {
  args: { hideDot: true, tone: "info", children: "Pattern B" },
};
