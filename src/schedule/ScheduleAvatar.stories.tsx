import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScheduleAvatar } from "./ScheduleAvatar";
import type { AssignmentColor } from "./types";

const meta = {
  title: "Schedule/ScheduleAvatar",
  component: ScheduleAvatar,
  tags: ["autodocs"],
  args: {
    name: "นพ. วรวิทย์ ตันสกุล",
    label: "วก",
    color: "green",
    size: "sm",
  },
} satisfies Meta<typeof ScheduleAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const COLORS: AssignmentColor[] = [
  "blue",
  "green",
  "orange",
  "yellow",
  "red",
  "teal",
  "gray",
];

export const Palette: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      {COLORS.map((color) => (
        <ScheduleAvatar key={color} color={color} label="วก" size="sm" />
      ))}
    </div>
  ),
};
