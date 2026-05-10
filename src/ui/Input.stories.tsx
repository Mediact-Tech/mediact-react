import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { useState } from "react";
import { Mail, Search, Lock } from "lucide-react";
import { Input } from "./Input";

const meta = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    type: {
      control: "select",
      options: ["text", "email", "password", "number"],
    },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    alwaysFloatLabel: { control: "boolean" },
  },
  args: {
    label: "Email",
  },
  parameters: {
    docs: {
      description: {
        component:
          'Input with floating label — label sits inside the field as a placeholder and floats to the top border on focus or when filled. Pass `placeholder` separately to show a hint while focused. Use `alwaysFloatLabel` for fields with fixed prefixes (e.g. date masks).',
      },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithPlaceholderHint: Story = {
  args: {
    label: "Email",
    placeholder: "you@example.com",
  },
};

export const PrefilledFloats: Story = {
  args: {
    label: "Email",
    defaultValue: "alice@mediact.example",
  },
};

export const WithHint: Story = {
  args: {
    label: "Email",
    hint: "We'll never share your email.",
  },
};

export const WithError: Story = {
  args: {
    label: "Email",
    defaultValue: "not-an-email",
    error: "Invalid email address",
  },
};

export const Required: Story = {
  args: { required: true },
};

export const WithLeftAdornment: Story = {
  args: { label: "Email", leftAdornment: <Mail /> },
};

export const Password: Story = {
  args: { label: "Password", type: "password", leftAdornment: <Lock /> },
};

export const Clearable: Story = {
  render: (args: React.ComponentProps<typeof Input>) => {
    const [v, setV] = useState("hello");
    return <Input {...args} value={v} onChange={(e) => setV(e.target.value)} />;
  },
  args: { clearable: true, label: "Search", leftAdornment: <Search /> },
};

export const AlwaysFloatLabel: Story = {
  args: {
    label: "Date of birth",
    alwaysFloatLabel: true,
    placeholder: "DD / MM / YYYY",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use `alwaysFloatLabel` when the input has a fixed prefix or mask that should always be visible.",
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-72">
      <Input label="Small" size="sm" />
      <Input label="Medium" size="md" />
      <Input label="Large" size="lg" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-72">
      <Input label="Empty (rest)" />
      <Input label="With value" defaultValue="filled" />
      <Input label="Disabled" disabled defaultValue="cannot edit" />
      <Input label="Required" required />
      <Input label="With error" defaultValue="bad" error="Required field" />
    </div>
  ),
};
