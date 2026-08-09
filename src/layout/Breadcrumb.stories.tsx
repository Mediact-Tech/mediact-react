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

/** Injecting a router-aware link component (e.g. next/link's `Link`) instead of
 * the default plain `<a>` — avoids a full-page reload in Next.js apps. Here a
 * tiny stand-in logs navigation instead of importing next/link (DS stays
 * framework-agnostic; the consuming app supplies its own router's Link). */
function FakeRouterLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        // eslint-disable-next-line no-console
        console.log("client-side navigate:", href);
      }}
    >
      {children}
    </a>
  );
}

export const WithLinkComponent: Story = {
  args: {
    linkComponent: FakeRouterLink,
    items: [
      { label: "Home", icon: <Home />, href: "/" },
      { label: "User management", href: "/users" },
      { label: "User lists" },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Pass `linkComponent` to route `items[].href` links through the app's router (e.g. `<Breadcrumb linkComponent={Link} .../>` with next/link) instead of a plain `<a>`.",
      },
    },
  },
};
