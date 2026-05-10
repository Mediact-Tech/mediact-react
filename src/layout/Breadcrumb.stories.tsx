import type { Meta, StoryObj } from "@storybook/react-vite";
import { Home } from "lucide-react";
import { Breadcrumb } from "./Breadcrumb";

const meta = {
  title: "Layout/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Breadcrumb trail with `/` separator. Last item is bold + dark to mark the current page; intermediate items are gray and clickable. Pass `icon` on the first item for the typical `🏠 Home / ... / Current` pattern.",
      },
    },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: "Home", icon: <Home />, href: "/" },
      { label: "User management", href: "/users" },
      { label: "User lists" },
    ],
  },
};

export const WithoutIcon: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Projects", href: "/projects" },
      { label: "Mediact" },
    ],
  },
};

export const Collapsed: Story = {
  args: {
    maxItems: 3,
    items: [
      { label: "Home", icon: <Home />, href: "/" },
      { label: "Workspace", href: "/ws" },
      { label: "Section", href: "/ws/section" },
      { label: "Subsection", href: "/ws/section/sub" },
      { label: "Current page" },
    ],
  },
};
