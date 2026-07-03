import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pencil } from "lucide-react";
import { OutlineButton } from "./OutlineButton";

const meta = {
  title: "UI/OutlineButton",
  component: OutlineButton,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["brand", "neutral"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    disabled: { control: "boolean" },
  },
  args: {
    children: "ยกเลิก",
  },
} satisfies Meta<typeof OutlineButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Neutral: Story = {
  args: { variant: "neutral" },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Pencil className="size-4" aria-hidden="true" />
        แก้ไขข้อมูล
      </>
    ),
  },
};

export const CustomColor: Story = {
  args: {
    className: "border-red-500 text-red-500 hover:bg-red-500/10",
    children: "ลบรายการ",
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const AsLink: Story = {
  args: {
    asChild: true,
    children: <a href="#edit">แก้ไขโปรไฟล์</a>,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <OutlineButton size="sm">SM</OutlineButton>
      <OutlineButton size="md">MD</OutlineButton>
      <OutlineButton size="lg">LG</OutlineButton>
    </div>
  ),
};
