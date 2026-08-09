import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { CheckboxGroup } from "./CheckboxGroup";

const meta = {
  title: "UI/CheckboxGroup",
  component: CheckboxGroup,
  tags: ["autodocs"],
} satisfies Meta<typeof CheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  { value: "email", label: "Email", description: "Order + shipping updates" },
  { value: "sms", label: "SMS", description: "Delivery day only" },
  { value: "push", label: "Push", description: "Coming soon", disabled: true },
];

export const Default: Story = {
  args: {
    label: "Notify me by",
    options,
    defaultValue: ["email"],
  },
};

export const Horizontal: Story = {
  args: {
    label: "Days available",
    orientation: "horizontal",
    options: [
      { value: "mon", label: "Mon" },
      { value: "tue", label: "Tue" },
      { value: "wed", label: "Wed" },
    ],
    defaultValue: ["mon", "wed"],
  },
};

export const WithError: Story = {
  args: {
    label: "Notify me by",
    required: true,
    options,
    error: "Pick at least one channel",
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(["sms"]);
    return (
      <CheckboxGroup
        label="Notify me by"
        hint={`Selected: ${value.join(", ") || "none"}`}
        options={options}
        value={value}
        onValueChange={setValue}
      />
    );
  },
};
