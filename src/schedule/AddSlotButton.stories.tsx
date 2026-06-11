import type { Meta, StoryObj } from "@storybook/react-vite";
import { UserPlus } from "lucide-react";
import { AddSlotButton } from "./AddSlotButton";

// explicit annotation (not `satisfies`) — inferred decorator type references
// storybook internals (PartialStoryFn) which breaks declaration emit (TS2883)
const meta: Meta<typeof AddSlotButton> = {
  title: "Schedule/AddSlotButton",
  component: AddSlotButton,
  tags: ["autodocs"],
  args: {
    label: "เพิ่มหมอ",
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomIcon: Story = {
  args: { label: "เพิ่มแพทย์เวร", icon: <UserPlus /> },
};

export const Disabled: Story = {
  args: { disabled: true },
};
