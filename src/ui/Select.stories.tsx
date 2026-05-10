import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "./Select";

const meta = {
  title: "UI/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Floating-label single-select. Label sits inside until a value is picked / dropdown is opened, then floats to the top border.",
      },
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  { value: "th", label: "Thailand" },
  { value: "sg", label: "Singapore" },
  { value: "my", label: "Malaysia" },
  { value: "id", label: "Indonesia", disabled: true },
];

export const Default: Story = {
  args: { label: "Country", options },
};

export const WithDefaultValue: Story = {
  args: { label: "Country", options, defaultValue: "th" },
};

export const WithPlaceholder: Story = {
  args: {
    label: "Country",
    options,
    placeholder: "Pick one...",
  },
};

export const WithHint: Story = {
  args: {
    label: "Country",
    options,
    hint: "Used for tax calculation",
  },
};

export const WithError: Story = {
  args: {
    label: "Country",
    options,
    required: true,
    error: "Country is required",
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-72">
      <Select label="Empty (rest)" options={options} />
      <Select label="With value" options={options} defaultValue="sg" />
      <Select label="Disabled" options={options} disabled defaultValue="my" />
      <Select label="Required" options={options} required />
      <Select label="With error" options={options} error="Required" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-72">
      <Select label="Small" size="sm" options={options} />
      <Select label="Medium" size="md" options={options} />
      <Select label="Large" size="lg" options={options} />
    </div>
  ),
};
