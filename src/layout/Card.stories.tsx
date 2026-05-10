import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./Card";

const meta = {
  title: "Layout/Card",
  component: Card,
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Project Alpha</CardTitle>
        <CardDescription>Status: in progress</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-text-body">
          12 tasks remaining. Next milestone in 5 days.
        </p>
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="ghost" size="sm">
          Skip
        </Button>
        <Button size="sm">Continue</Button>
      </CardFooter>
    </Card>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex gap-3">
      <Card variant="elevated" className="w-48">
        <CardTitle>Elevated</CardTitle>
      </Card>
      <Card variant="outlined" className="w-48">
        <CardTitle>Outlined</CardTitle>
      </Card>
      <Card variant="flat" className="w-48">
        <CardTitle>Flat</CardTitle>
      </Card>
    </div>
  ),
};
