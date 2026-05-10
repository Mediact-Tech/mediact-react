import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Checkbox } from "./Checkbox";

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Accept terms" },
};

export const WithDescription: Story = {
  args: {
    label: "Subscribe to newsletter",
    description: "We send updates twice a month, no spam.",
  },
};

export const Indeterminate: Story = {
  render: () => <Checkbox label="Select all" checked="indeterminate" />,
};

export const WithError: Story = {
  args: {
    label: "I agree to the terms",
    error: "You must agree before continuing",
  },
};

export const Group: Story = {
  render: () => {
    const [a, setA] = useState(true);
    const [b, setB] = useState(false);
    const [c, setC] = useState(false);
    return (
      <div className="flex flex-col gap-2">
        <Checkbox label="Email" checked={a} onCheckedChange={(v) => setA(!!v)} />
        <Checkbox label="SMS" checked={b} onCheckedChange={(v) => setB(!!v)} />
        <Checkbox label="Push" checked={c} onCheckedChange={(v) => setC(!!v)} />
      </div>
    );
  },
};
