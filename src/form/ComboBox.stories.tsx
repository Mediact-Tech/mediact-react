import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { useState } from "react";
import { ComboBox } from "./ComboBox";

const meta = {
  title: "Form/ComboBox",
  component: ComboBox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Floating-label searchable single-select. Same label behavior as Input/Select — sit-in until value or popover open.",
      },
    },
  },
} satisfies Meta<typeof ComboBox>;

export default meta;
type Story = StoryObj<typeof meta>;

const countries = [
  { value: "th", label: "Thailand", description: "Bangkok" },
  { value: "sg", label: "Singapore", description: "Singapore" },
  { value: "my", label: "Malaysia", description: "Kuala Lumpur" },
  { value: "id", label: "Indonesia", description: "Jakarta" },
  { value: "vn", label: "Vietnam", description: "Hanoi" },
  { value: "ph", label: "Philippines", description: "Manila" },
];

export const Default: Story = {
  args: { label: "Country", options: countries },
};

export const WithPlaceholder: Story = {
  args: {
    label: "Country",
    options: countries,
    placeholder: "Type to search...",
  },
};

export const Controlled: Story = {
  render: (args: React.ComponentProps<typeof ComboBox>) => {
    const [v, setV] = useState<string | undefined>("th");
    return <ComboBox {...args} value={v ?? null} onChange={setV} />;
  },
  args: { label: "Country", options: countries },
};

export const WithError: Story = {
  args: {
    label: "Country",
    options: countries,
    required: true,
    error: "Country is required",
  },
};

export const States: Story = {
  args: { options: countries },
  render: () => (
    <div className="flex flex-col gap-4 w-72">
      <ComboBox label="Empty (rest)" options={countries} />
      <ComboBox label="With value" options={countries} defaultValue="sg" />
      <ComboBox label="Disabled" options={countries} disabled defaultValue="th" />
      <ComboBox label="Required" options={countries} required />
      <ComboBox label="With error" options={countries} error="Required" />
    </div>
  ),
};
