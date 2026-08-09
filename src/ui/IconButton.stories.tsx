import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pencil, Trash2, Plus, Download } from "lucide-react";
import { IconButton } from "./IconButton";

const meta = {
  title: "UI/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["ghost", "solid", "outline", "ghost-destructive"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    "aria-label": "แก้ไข",
    icon: <Pencil aria-hidden="true" />,
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ghost: Story = {
  args: { variant: "ghost" },
};

export const Solid: Story = {
  args: { variant: "solid" },
};

export const Outline: Story = {
  args: { variant: "outline" },
};

export const GhostDestructive: Story = {
  args: {
    variant: "ghost-destructive",
    "aria-label": "ลบ",
    icon: <Trash2 aria-hidden="true" />,
  },
};

export const Loading: Story = {
  args: { loading: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const AsLink: Story = {
  name: "asChild (wraps a Link)",
  args: {
    asChild: true,
    "aria-label": "ดาวน์โหลด",
    children: (
      <a href="#download">
        <Download aria-hidden="true" />
      </a>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <IconButton variant="ghost" aria-label="แก้ไข" icon={<Pencil aria-hidden="true" />} />
      <IconButton variant="solid" aria-label="เพิ่ม" icon={<Plus aria-hidden="true" />} />
      <IconButton variant="outline" aria-label="ดาวน์โหลด" icon={<Download aria-hidden="true" />} />
      <IconButton
        variant="ghost-destructive"
        aria-label="ลบ"
        icon={<Trash2 aria-hidden="true" />}
      />
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <IconButton size="sm" aria-label="แก้ไข (sm)" icon={<Pencil aria-hidden="true" />} />
      <IconButton size="md" aria-label="แก้ไข (md)" icon={<Pencil aria-hidden="true" />} />
      <IconButton size="lg" aria-label="แก้ไข (lg)" icon={<Pencil aria-hidden="true" />} />
    </div>
  ),
};

export const RowActions: Story = {
  name: "Table row actions (real-world composition)",
  render: () => (
    <div className="flex items-center gap-1 rounded-md border border-border-default bg-white p-2">
      <span className="mr-2 text-body-sm text-slate-700">นพ. สมชาย ใจดี</span>
      <IconButton variant="ghost" size="sm" aria-label="แก้ไข" icon={<Pencil aria-hidden="true" />} />
      <IconButton
        variant="ghost-destructive"
        size="sm"
        aria-label="ลบ"
        icon={<Trash2 aria-hidden="true" />}
      />
    </div>
  ),
};
