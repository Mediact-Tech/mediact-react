import type { Meta, StoryObj } from "@storybook/react-vite";
import { Info } from "lucide-react";
import { Button } from "../ui/Button";
import { Tooltip } from "./Tooltip";

const meta = {
  title: "Overlay/Tooltip",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip content="More info about this action">
      <Button variant="ghost" leftIcon={<Info />}>
        Hover me
      </Button>
    </Tooltip>
  ),
};

export const Sides: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      {(["top", "right", "bottom", "left"] as const).map((s) => (
        <Tooltip key={s} content={`On ${s}`} side={s}>
          <Button variant="secondary">{s}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};
