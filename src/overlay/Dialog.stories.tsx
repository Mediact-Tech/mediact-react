import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./Dialog";

const meta = {
  title: "Overlay/Dialog",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="text-sm text-text-body">Form goes here…</div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(["sm", "md", "lg", "xl"] as const).map((s) => (
        <Dialog key={s}>
          <DialogTrigger asChild>
            <Button variant="secondary">{s.toUpperCase()}</Button>
          </DialogTrigger>
          <DialogContent size={s}>
            <DialogHeader>
              <DialogTitle>Size: {s}</DialogTitle>
              <DialogDescription>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  ),
};
