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

const TONES = ["neutral", "primary", "success", "warning", "danger", "info"] as const;

export const FillMatrix: Story = {
  name: "Fill × Tone matrix",
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-2 text-caption font-medium text-text-tertiary">
          subtle (default — unchanged)
        </p>
        <div className="flex flex-wrap gap-2">
          {TONES.map((tone) => (
            <Chip key={tone} variant={tone} fill="subtle">
              {tone}
            </Chip>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-caption font-medium text-text-tertiary">solid</p>
        <div className="flex flex-wrap gap-2">
          {TONES.map((tone) => (
            <Chip key={tone} variant={tone} fill="solid">
              {tone}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const SolidRemovable: Story = {
  args: {
    variant: "danger",
    fill: "solid",
    removable: true,
    children: "Solid + removable",
    onRemove: () => console.log("removed"),
  },
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
