import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "./Switch";

const meta = {
  title: "UI/Switch",
  component: Switch,
  tags: ["autodocs"],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Enable notifications" },
};

export const WithDescription: Story = {
  args: {
    label: "Auto-save",
    description: "Saves your work every 30 seconds.",
  },
};

export const LabelLeft: Story = {
  args: { label: "Dark mode", labelPosition: "left" },
};

export const Disabled: Story = {
  args: { label: "Disabled toggle", disabled: true },
};
