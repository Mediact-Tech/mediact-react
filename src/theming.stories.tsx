import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Button } from "./ui/Button";
import { Checkbox } from "./ui/Checkbox";
import { Switch } from "./ui/Switch";
import { Chip } from "./ui/Chip";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./layout/Tabs";
import { Tooltip } from "./overlay/Tooltip";

/* ─────────────────────────────────────────────────────────────────────────── */
/* ThemingPlayground                                                            */
/* ─────────────────────────────────────────────────────────────────────────── */

type PlaygroundArgs = {
  brand: string;
  brandHover: string;
  brandActive: string;
  brandSubtle: string;
};

function ThemingPlayground({
  brand,
  brandHover,
  brandActive,
  brandSubtle,
}: PlaygroundArgs) {
  const style = {
    "--color-brand": brand,
    "--color-brand-hover": brandHover,
    "--color-brand-active": brandActive,
    "--color-brand-subtle": brandSubtle,
  } as React.CSSProperties;

  return (
    <div style={style} className="space-y-8 rounded-xl border border-border-subtle bg-white p-8">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
          Active tokens
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            ["brand", brand],
            ["brand-hover", brandHover],
            ["brand-active", brandActive],
            ["brand-subtle", brandSubtle],
          ].map(([name, value]) => (
            <div key={name} className="flex items-center gap-2 rounded-md border border-border-default px-3 py-1.5 text-sm">
              <span
                className="size-4 rounded-sm border border-border-default"
                style={{ background: value }}
              />
              <code className="text-text-body">--color-{name}</code>
              <span className="text-text-tertiary">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
          Buttons
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
          Controls
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <Checkbox defaultChecked label="Checked" />
          <Checkbox checked="indeterminate" label="Indeterminate" />
          <Switch defaultChecked label="On" />
          <Chip variant="primary">Primary chip</Chip>
          <Chip variant="neutral">Neutral chip</Chip>
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
          Tabs
        </p>
        <Tabs defaultValue="a">
          <TabsList>
            <TabsTrigger value="a">Tab A</TabsTrigger>
            <TabsTrigger value="b">Tab B</TabsTrigger>
            <TabsTrigger value="c">Tab C</TabsTrigger>
          </TabsList>
          <TabsContent value="a">Content A</TabsContent>
          <TabsContent value="b">Content B</TabsContent>
          <TabsContent value="c">Content C</TabsContent>
        </Tabs>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
          Tooltip
        </p>
        <Tooltip content="Tooltip text">
          <Button variant="secondary" size="sm">Hover me</Button>
        </Tooltip>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Storybook meta                                                               */
/* ─────────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Theming/Playground",
  component: ThemingPlayground,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Override the four `--color-brand-*` tokens via the controls below to preview how the entire design system reacts to a brand color change. Copy the resulting CSS snippet into your app's `globals.css`.",
      },
    },
  },
  argTypes: {
    brand: { control: "color", description: "--color-brand (primary background)" },
    brandHover: { control: "color", description: "--color-brand-hover (hover state)" },
    brandActive: { control: "color", description: "--color-brand-active (active / info icon)" },
    brandSubtle: { control: "color", description: "--color-brand-subtle (light tint background)" },
  },
} satisfies Meta<typeof ThemingPlayground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Default (Mediact Navy)",
  args: {
    brand: "#283541",
    brandHover: "#036a8a",
    brandActive: "#0b77c6",
    brandSubtle: "#f0f9ff",
  },
};

export const Ocean: Story = {
  name: "Ocean Blue",
  args: {
    brand: "#0b77c6",
    brandHover: "#085a99",
    brandActive: "#054f87",
    brandSubtle: "#eff6ff",
  },
};

export const Forest: Story = {
  name: "Forest Green",
  args: {
    brand: "#0bb767",
    brandHover: "#099952",
    brandActive: "#077a42",
    brandSubtle: "#f0fdf4",
  },
};

export const Slate: Story = {
  name: "Slate Gray",
  args: {
    brand: "#475569",
    brandHover: "#334155",
    brandActive: "#1e293b",
    brandSubtle: "#f8fafc",
  },
};
