import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Copy, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/Button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "./DropdownMenu";

const meta = {
  title: "Overlay/DropdownMenu",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" leftIcon={<MoreHorizontal />}>
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Manage</DropdownMenuLabel>
        <DropdownMenuItem>
          <Edit className="size-4" /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Copy className="size-4" /> Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive>
          <Trash2 className="size-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithCheckboxes: Story = {
  render: () => {
    const [bold, setBold] = useState(true);
    const [italic, setItalic] = useState(false);
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">Format</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked={bold} onCheckedChange={setBold}>
            Bold
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={italic} onCheckedChange={setItalic}>
            Italic
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

export const WithRadio: Story = {
  render: () => {
    const [v, setV] = useState("md");
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">Density: {v}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Density</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={v} onValueChange={setV}>
            <DropdownMenuRadioItem value="sm">Compact</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="md">Comfortable</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="lg">Spacious</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};
