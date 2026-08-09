import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { PillSwitch } from "./PillSwitch";

const meta = {
  title: "UI/PillSwitch",
  component: PillSwitch,
  tags: ["autodocs"],
} satisfies Meta<typeof PillSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

const visibilityOptions = [
  { value: "live", label: "Live" },
  { value: "hidden", label: "Hidden" },
] as const;

export const Default: Story = {
  args: {
    label: "Visibility",
    options: visibilityOptions,
    defaultValue: "live",
  },
};

export const WithHint: Story = {
  args: {
    label: "Billing cycle",
    hint: "You can switch anytime before renewal.",
    options: [
      { value: "monthly", label: "Monthly" },
      { value: "yearly", label: "Yearly" },
    ] as const,
    defaultValue: "monthly",
  },
};

export const Disabled: Story = {
  args: {
    label: "Visibility",
    options: visibilityOptions,
    defaultValue: "hidden",
    disabled: true,
  },
};

export const OneOptionDisabled: Story = {
  args: {
    label: "Plan",
    options: [
      { value: "free", label: "Free" },
      { value: "pro", label: "Pro", disabled: true },
    ] as const,
    defaultValue: "free",
  },
};

export const Controlled: Story = {
  args: { options: visibilityOptions },
  render: () => {
    const [value, setValue] = useState<"live" | "hidden">("live");
    return (
      <PillSwitch
        label="Visibility"
        hint={`Currently: ${value}`}
        options={visibilityOptions}
        value={value}
        onValueChange={setValue}
      />
    );
  },
};
