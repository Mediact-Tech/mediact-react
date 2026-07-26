import type { Meta, StoryObj } from "@storybook/react-vite";
import { Upload } from "lucide-react";
import { SolidButton } from "./SolidButton";

const meta = {
  title: "UI/SolidButton",
  component: SolidButton,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "warning", "success", "primary"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    disabled: { control: "boolean" },
  },
  args: {
    children: "บันทึก",
  },
} satisfies Meta<typeof SolidButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: { variant: "info" },
};

export const Success: Story = {
  args: { variant: "success", children: "บันทึกข้อมูล" },
};

export const Warning: Story = {
  args: { variant: "warning" },
};

export const Primary: Story = {
  args: { variant: "primary" },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Upload className="size-4" aria-hidden="true" />
        อัปโหลดไฟล์
      </>
    ),
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <SolidButton variant="info">Info</SolidButton>
      <SolidButton variant="warning">Warning</SolidButton>
      <SolidButton variant="success">Success</SolidButton>
      <SolidButton variant="primary">Primary</SolidButton>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <SolidButton size="sm">SM</SolidButton>
      <SolidButton size="md">MD</SolidButton>
      <SolidButton size="lg">LG</SolidButton>
    </div>
  ),
};
