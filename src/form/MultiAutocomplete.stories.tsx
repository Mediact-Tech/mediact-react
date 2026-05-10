import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { useState } from "react";
import { MultiAutocomplete } from "./MultiAutocomplete";

const meta = {
  title: "Form/MultiAutocomplete",
  component: MultiAutocomplete,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Floating-label searchable multi-select. Label floats when chips are present or popover open.",
      },
    },
  },
} satisfies Meta<typeof MultiAutocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

const skills = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "SolidJS" },
  { value: "next", label: "Next.js" },
  { value: "nuxt", label: "Nuxt" },
  { value: "remix", label: "Remix" },
];

export const Default: Story = {
  args: { label: "Skills", options: skills },
};

export const WithPlaceholder: Story = {
  args: { label: "Skills", options: skills, placeholder: "Pick a few..." },
};

export const Controlled: Story = {
  render: (args: React.ComponentProps<typeof MultiAutocomplete>) => {
    const [v, setV] = useState<string[]>(["react", "next"]);
    return <MultiAutocomplete {...args} value={v} onChange={setV} />;
  },
  args: { label: "Skills", options: skills },
};

export const MaxItems: Story = {
  args: {
    label: "Top 3 skills",
    options: skills,
    maxItems: 3,
    hint: "Select up to 3",
  },
};

export const WithError: Story = {
  args: {
    label: "Skills",
    options: skills,
    required: true,
    error: "At least one skill is required",
  },
};

export const States: Story = {
  args: { options: skills },
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <MultiAutocomplete label="Empty (rest)" options={skills} />
      <MultiAutocomplete
        label="With value"
        options={skills}
        defaultValue={["react", "next"]}
      />
      <MultiAutocomplete
        label="Disabled"
        options={skills}
        disabled
        defaultValue={["vue"]}
      />
      <MultiAutocomplete label="Required" options={skills} required />
      <MultiAutocomplete label="With error" options={skills} error="Required" />
    </div>
  ),
};
