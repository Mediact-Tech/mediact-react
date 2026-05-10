import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./Avatar";

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  tags: ["autodocs"],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Image: Story = {
  args: {
    src: "https://i.pravatar.cc/80?img=5",
    name: "Jane Cooper",
  },
};

export const Initials: Story = {
  args: { name: "Jane Cooper" },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => (
        <Avatar key={s} size={s} name="Jane Cooper" />
      ))}
    </div>
  ),
};
