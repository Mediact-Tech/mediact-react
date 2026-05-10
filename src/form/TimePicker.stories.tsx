import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { useState } from "react";
import { TimePicker } from "./TimePicker";

const meta = {
  title: "Form/TimePicker",
  component: TimePicker,
  tags: ["autodocs"],
  args: { label: "Time" },
  parameters: {
    docs: {
      description: {
        component:
          "Floating-label time picker (HH:mm). Label floats by default — set `alwaysFloatLabel={false}` for sit-in placeholder behavior.",
      },
    },
  },
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Controlled: Story = {
  render: (args: React.ComponentProps<typeof TimePicker>) => {
    const [v, setV] = useState("09:30");
    return <TimePicker {...args} value={v} onChange={setV} />;
  },
};

export const Step15: Story = {
  args: { step: 15, hint: "Steps of 15 minutes" },
};

export const WithError: Story = {
  args: { error: "Time is required", required: true },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-72">
      <TimePicker label="Empty" />
      <TimePicker label="With value" defaultValue="14:30" />
      <TimePicker label="Disabled" disabled defaultValue="08:00" />
      <TimePicker label="Required" required />
      <TimePicker label="With error" error="Required" />
    </div>
  ),
};
