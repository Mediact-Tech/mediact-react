import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Filter } from "./Filter";
import { Button } from "../ui/Button";
import { Checkbox } from "../ui/Checkbox";
import { ComboBox } from "../form/ComboBox";

const meta = {
  title: "Overlay/Filter",
  component: Filter,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Filter>;

export default meta;
type Story = StoryObj<typeof meta>;

const SPECIALTY_OPTIONS = [
  { value: "cardiology", label: "Cardiology" },
  { value: "dermatology", label: "Dermatology" },
  { value: "neurology", label: "Neurology" },
  { value: "pediatrics", label: "Pediatrics" },
];

function FilterPanel({ onApply }: { onApply: () => void }) {
  const [specialty, setSpecialty] = React.useState<string | undefined>();
  const [levels, setLevels] = React.useState<Record<string, boolean>>({});
  const [scores, setScores] = React.useState<Record<string, boolean>>({});

  const toggle =
    (setter: React.Dispatch<React.SetStateAction<Record<string, boolean>>>) =>
    (key: string) =>
    (checked: boolean) =>
      setter((prev) => ({ ...prev, [key]: checked }));

  return (
    <div className="space-y-5">
      <div className="border-b border-gray-200 pb-3">
        <h3 className="text-base font-semibold text-text-primary">Filters</h3>
      </div>

      <ComboBox
        label="Specialty"
        placeholder="Search Specialty"
        options={SPECIALTY_OPTIONS}
        value={specialty ?? null}
        onChange={(v) => setSpecialty(v)}
      />

      <div>
        <div className="mb-2 text-sm font-medium text-text-primary">
          User Level
        </div>
        <div className="flex gap-4">
          {["Level 1", "Level 2", "Level 3"].map((label) => (
            <Checkbox
              key={label}
              label={label}
              checked={!!levels[label]}
              onCheckedChange={(c) =>
                toggle(setLevels)(label)(c === true)
              }
            />
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 text-sm font-medium text-text-primary">
          Fit Score
        </div>
        <div className="flex gap-4">
          {["0-50%", "51-80%", "81-100%"].map((label) => (
            <Checkbox
              key={label}
              label={label}
              checked={!!scores[label]}
              onCheckedChange={(c) =>
                toggle(setScores)(label)(c === true)
              }
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button onClick={onApply}>Apply</Button>
      </div>
    </div>
  );
}

export const Default: Story = {
  args: {
    children: (
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-text-primary">Filters</h3>
        <p className="text-sm text-gray-600">
          Pass any content via the <code>children</code> prop.
        </p>
      </div>
    ),
  },
};

function FiltersDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <Filter open={open} onOpenChange={setOpen}>
      <FilterPanel onApply={() => setOpen(false)} />
    </Filter>
  );
}

export const Filters: Story = {
  args: { children: null },
  render: () => <FiltersDemo />,
};
