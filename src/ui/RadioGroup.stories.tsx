import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioGroup } from "./RadioGroup";

const meta = {
  title: "UI/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  { value: "free", label: "Free", description: "Up to 3 users" },
  { value: "pro", label: "Pro", description: "Unlimited users" },
  { value: "enterprise", label: "Enterprise", description: "Custom pricing", disabled: true },
];

export const Default: Story = {
  args: {
    label: "Plan",
    options,
    defaultValue: "free",
  },
};

export const Horizontal: Story = {
  args: {
    label: "Size",
    orientation: "horizontal",
    options: [
      { value: "s", label: "Small" },
      { value: "m", label: "Medium" },
      { value: "l", label: "Large" },
    ],
    defaultValue: "m",
  },
};

export const WithError: Story = {
  args: {
    label: "Plan",
    required: true,
    options,
    error: "Please select a plan",
  },
};
