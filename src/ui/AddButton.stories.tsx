import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus } from "lucide-react";
import { AddButton } from "./AddButton";

const meta = {
  title: "UI/AddButton",
  component: AddButton,
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
    label: "เพิ่มข้อมูล",
  },
} satisfies Meta<typeof AddButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: { variant: "info" },
};

export const Success: Story = {
  args: { variant: "success", label: "เพิ่มสมาชิก" },
};

export const Warning: Story = {
  args: { variant: "warning", label: "เพิ่มประเภทเวร" },
};

export const Primary: Story = {
  args: { variant: "primary" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const AsLink: Story = {
  args: {
    asChild: true,
    children: (
      <a href="#create">
        <Plus className="size-4" aria-hidden="true" />
        เพิ่มแผนก
      </a>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <AddButton variant="info" label="Info" />
      <AddButton variant="warning" label="Warning" />
      <AddButton variant="success" label="Success" />
      <AddButton variant="primary" label="Primary" />
    </div>
  ),
};
