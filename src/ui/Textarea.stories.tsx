import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { useState } from "react";
import { Textarea } from "./Textarea";

const meta = {
  title: "UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  args: { label: "Description" },
  parameters: {
    docs: {
      description: {
        component:
          "Floating-label multi-line input. Label sits inside (top-left) until focused or filled, then floats to the top border.",
      },
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithPlaceholderHint: Story = {
  args: { placeholder: "Type something..." },
};

export const Prefilled: Story = {
  args: { defaultValue: "Lorem ipsum dolor sit amet." },
};

export const WithHint: Story = {
  args: { hint: "Up to 500 characters." },
};

export const WithError: Story = {
  args: { error: "Description is required" },
};

export const WithCount: Story = {
  render: (args: React.ComponentProps<typeof Textarea>) => {
    const [v, setV] = useState("");
    return (
      <Textarea {...args} value={v} onChange={(e) => setV(e.target.value)} />
    );
  },
  args: { showCount: true, maxLength: 200, label: "Notes" },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Textarea label="Empty (rest)" />
      <Textarea label="With value" defaultValue="filled" />
      <Textarea label="Disabled" disabled defaultValue="cannot edit" />
      <Textarea label="Required" required />
      <Textarea label="With error" defaultValue="bad" error="Required field" />
    </div>
  ),
};
