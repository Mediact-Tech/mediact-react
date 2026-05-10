import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stepper } from "./Stepper";

const meta = {
  title: "Layout/Stepper",
  component: Stepper,
  tags: ["autodocs"],
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

const steps = [
  { label: "Account", description: "Create your account" },
  { label: "Profile", description: "Add your details" },
  { label: "Verify", description: "Confirm email" },
  { label: "Done" },
];

export const Horizontal: Story = {
  args: { steps, current: 1, orientation: "horizontal" },
};

export const Vertical: Story = {
  args: { steps, current: 2, orientation: "vertical" },
};

export const FirstStep: Story = {
  args: { steps, current: 0, orientation: "horizontal" },
};

export const Complete: Story = {
  args: { steps, current: 4, orientation: "horizontal" },
};
