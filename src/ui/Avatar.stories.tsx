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
    src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'><rect width='80' height='80' fill='%230395d8'/><circle cx='40' cy='31' r='14' fill='%23fff'/><path d='M11 80a29 29 0 0 1 58 0Z' fill='%23fff'/></svg>",
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
