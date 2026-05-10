import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoadingScreen, Spinner } from "./Spinner";

const meta = {
  title: "Feedback/Spinner",
  component: Spinner,
  tags: ["autodocs"],
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => (
        <Spinner key={s} size={s} />
      ))}
    </div>
  ),
};

export const Screen: Story = {
  render: () => <LoadingScreen label="Loading data..." />,
};
