import type { Meta, StoryObj } from "@storybook/react-vite";
import { Check } from "lucide-react";
import { Chip } from "./Chip";

const meta = {
  title: "UI/Chip",
  component: Chip,
  tags: ["autodocs"],
  args: {
    children: "Tag",
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip variant="neutral">Neutral</Chip>
      <Chip variant="primary">Primary</Chip>
      <Chip variant="success">Success</Chip>
      <Chip variant="warning">Warning</Chip>
      <Chip variant="danger">Danger</Chip>
      <Chip variant="info">Info</Chip>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Chip size="sm">Small</Chip>
      <Chip size="md">Medium</Chip>
      <Chip size="lg">Large</Chip>
    </div>
  ),
};

export const WithIcon: Story = {
  args: {
    leftIcon: <Check />,
    variant: "success",
    children: "Approved",
  },
};

export const Removable: Story = {
  args: {
    removable: true,
    children: "Removable",
    onRemove: () => console.log("removed"),
  },
};

export const Interactive: Story = {
  args: {
    children: "Click me",
    onClick: () => console.log("clicked"),
  },
};
