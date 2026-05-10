import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "./Skeleton";

const meta = {
  title: "Feedback/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Card: Story = {
  render: () => (
    <div className="flex w-80 gap-3">
      <Skeleton shape="circle" className="size-12" />
      <div className="flex flex-1 flex-col gap-2 pt-1">
        <Skeleton shape="text" className="w-3/4" />
        <Skeleton shape="text" className="w-1/2" />
      </div>
    </div>
  ),
};

export const List: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-80">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} shape="text" className="h-6" />
      ))}
    </div>
  ),
};
