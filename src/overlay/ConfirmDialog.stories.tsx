import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../ui/Button";
import { ConfirmDialog } from "./ConfirmDialog";

const meta = {
  title: "Overlay/ConfirmDialog",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Danger: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Delete account
        </Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          tone="danger"
          title="Delete account?"
          description="This action cannot be undone. All your data will be permanently removed."
          confirmLabel="Delete"
          onConfirm={async () => {
            await new Promise((r) => setTimeout(r, 800));
          }}
        />
      </>
    );
  },
};

export const Warning: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="warning" onClick={() => setOpen(true)}>
          Discard changes
        </Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          tone="warning"
          title="Discard unsaved changes?"
          description="Your edits will be lost."
          confirmLabel="Discard"
        />
      </>
    );
  },
};

export const Info: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Publish</Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          tone="info"
          title="Publish article?"
          description="Once published, the article will be visible to all readers."
          confirmLabel="Publish"
        />
      </>
    );
  },
};
