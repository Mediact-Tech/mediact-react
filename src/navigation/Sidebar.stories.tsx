import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Cog, Home } from "lucide-react";
import { Sidebar, SidebarGroup, SidebarItem } from "./Sidebar";

const meta = {
  title: "Navigation/Sidebar",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Collapsible left navigation. Composable: `Sidebar` (root) + `SidebarItem` (leaf) + `SidebarGroup` (collapsible parent). Nesting depth is auto-detected via context — top-level items show their icon, nested items show a bullet/dash prefix. Mirrors `mediact-portal-web/src/components/shared/Navbar/*` but framework-agnostic (no router / i18n bound in).",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tiny stylized "MEDI ACT" wordmark — matches portal-web's white sidebar logo. */
function MediActLogo() {
  return (
    <div className="flex items-center gap-3 text-white">
      <svg viewBox="0 0 24 24" className="size-8" fill="currentColor">
        <rect x="2" y="2" width="9" height="9" rx="2" />
        <rect x="13" y="2" width="9" height="9" rx="2" />
        <rect x="2" y="13" width="9" height="9" rx="2" />
        <rect x="13" y="13" width="9" height="9" rx="2" />
      </svg>
      <span className="text-xl font-bold tracking-wide">MEDI ACT</span>
    </div>
  );
}

export const Default: Story = {
  render: () => {
    const [activeId, setActiveId] = useState("home");
    return (
      <div className="h-[640px] flex">
        <Sidebar
          header={<MediActLogo />}
          footer={<>Version:1.0.0</>}
          activeItemId={activeId}
          onItemClick={(id) => setActiveId(id)}
        >
          <SidebarItem id="home" label="Home" icon={Home} />
          <SidebarGroup id="settings" label="Settings" icon={Cog}>
            <SidebarGroup id="organization" label="Organization">
              <SidebarItem id="org-profile" label="Organization Profile" />
              <SidebarItem id="department" label="Department" />
              <SidebarItem id="staff" label="Staff" />
              <SidebarItem id="holidays" label="Holidays" />
            </SidebarGroup>
          </SidebarGroup>
        </Sidebar>
      </div>
    );
  },
};

export const Collapsed: Story = {
  render: () => (
    <div className="h-[640px] flex">
      <Sidebar
        header={<MediActLogo />}
        footer={<>v1.0</>}
        activeItemId="home"
        collapsed
      >
        <SidebarItem id="home" label="Home" icon={Home} />
        <SidebarGroup id="settings" label="Settings" icon={Cog}>
          <SidebarItem id="org-profile" label="Organization Profile" />
          <SidebarItem id="department" label="Department" />
        </SidebarGroup>
      </Sidebar>
    </div>
  ),
};

export const FlatItems: Story = {
  parameters: {
    docs: {
      description: {
        story: "Sidebar with no nested groups — just top-level items.",
      },
    },
  },
  render: () => {
    const [activeId, setActiveId] = useState("home");
    return (
      <div className="h-[640px] flex">
        <Sidebar
          header={<MediActLogo />}
          footer={<>Version:1.0.0</>}
          activeItemId={activeId}
          onItemClick={setActiveId}
        >
          <SidebarItem id="home" label="Home" icon={Home} />
          <SidebarItem id="settings" label="Settings" icon={Cog} />
        </Sidebar>
      </div>
    );
  },
};

export const WithBadge: Story = {
  render: () => {
    const [activeId, setActiveId] = useState("messages");
    return (
      <div className="h-[640px] flex">
        <Sidebar
          header={<MediActLogo />}
          footer={<>Version:1.0.0</>}
          activeItemId={activeId}
          onItemClick={setActiveId}
        >
          <SidebarItem id="home" label="Home" icon={Home} />
          <SidebarGroup id="settings" label="Settings" icon={Cog}>
            <SidebarItem id="messages" label="Messages" badge="3 unread" />
            <SidebarItem id="staff" label="Staff" />
          </SidebarGroup>
        </Sidebar>
      </div>
    );
  },
};
