import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Cog, Home, Headphones } from "lucide-react";
import { Sidebar, SidebarGroup, SidebarItem } from "./Sidebar";

const meta = {
  title: "Navigation/Sidebar",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          [
            "แถบเมนูซ้าย — `Sidebar` (ราง) + `SidebarItem` (เมนู) + `SidebarGroup` (กลุ่มพับได้)",
            "",
            "### ทรงยึดตามของจริงใน Portal (วัดจากเบราว์เซอร์)",
            "",
            "🔴 ของจริงชื่อ `components/shared/Navbar/` — ส่วนไฟล์ที่ชื่อ `Sidebar.tsx`",
            "ใน Portal **เป็นแถบบน** (`<header className=\"h-18 w-full\">`) ซึ่งตรงกับ `TopNav` ของ DS",
            "ใครจะย้ายมาใช้ต้องดูให้ดีว่ากำลังแทนที่ตัวไหน",
            "",
            "| | ค่าที่วัดได้ |",
            "|---|---|",
            "| ราง | 260 · พื้น `rgb(67,89,110)` = `state-700` · **มุม 16** |",
            "| หัวราง | สูง 88 · pad 24 · เว้นบน 16 |",
            "| เมนูระดับบน | 228×46 · มุม 10 · pad 11/12 · 16px/600 · gap 12 |",
            "| เมนูย่อย | 193×37 · มุม 10 · pad 9/12 · 14px/600 · **ไม่มีไอคอน** |",
            "| รางเส้นเมนูย่อย | `1px white/12` · เยื้อง 22 · เว้นใน 12 |",
            "| ปุ่มติดต่อ | 36 สูง · มุม 8 · 14px · `white/60` · ไอคอน 16 |",
            "",
            "**สถานะกำลังเปิดอยู่มีสองแบบ** — ระดับบน `bg-white/20` ตัวขาว ·",
            "เมนูย่อย **แถบขาวทึบ ตัวหนังสือดำ** (ของจริงใช้ `text-text-primary`",
            "ซึ่ง alias ไปสีแบรนด์ ⇒ บน Mediwork จะเป็นเขียวมิ้นต์บนขาว วัดได้ 1.93:1)",
          ].join("\n"),
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
      <span className="text-title-sm font-bold tracking-wide">MEDI ACT</span>
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
          footer={<>Version: 1.0.0</>}
          supportAction={{
            label: "ติดต่อฝ่ายสนับสนุน",
            onClick: () => {},
          }}
          activeItemId={activeId}
          onItemClick={(id) => setActiveId(id)}
        >
          <SidebarItem id="home" label="Home" icon={Home} />
          <SidebarGroup
            id="settings"
            label="Settings"
            icon={Cog}
            isChildActive={["access-rights", "metrics"].includes(activeId)}
          >
            <SidebarItem id="access-rights" label="Access Rights" />
            <SidebarItem id="metrics" label="Metrics Settings" />
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

/** Router-aware link injection — same `linkComponent` shape as `Breadcrumb`.
 * Here a tiny stand-in logs navigation instead of importing next/link (DS
 * stays framework-agnostic; the consuming app supplies its own router's Link).
 * `SidebarItem`s that pass `href` (and no `onClick`/`onItemClick`) render
 * through it instead of a plain `<a>`. */
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
  parameters: {
    docs: {
      description: {
        story:
          "Pass `linkComponent` to route plain `href`-only `SidebarItem`s through the app's router (e.g. next/link's `Link`) instead of a full-page `<a>` reload.",
      },
    },
  },
  render: () => (
    <div className="h-[640px] flex">
      <Sidebar
        header={<MediActLogo />}
        footer={<>Version:1.0.0</>}
        activeItemId="home"
        linkComponent={FakeRouterLink}
      >
        <SidebarItem id="home" label="Home" icon={Home} href="/" />
        <SidebarItem id="settings" label="Settings" icon={Cog} href="/settings" />
      </Sidebar>
    </div>
  ),
};

/** Presentational-only mobile off-canvas drawer + backdrop. `mobileOpen` /
 * `onMobileOpenChange` are controlled by the app (e.g. a hamburger button in
 * its own header) — the DS never persists this state itself. Resize the
 * viewport below the `lg` breakpoint to see the drawer + backdrop; at `lg`
 * and above it renders as a normal static rail. */
export const MobileDrawer: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`mobileOpen` + `onMobileOpenChange` turn the sidebar into a fixed off-canvas drawer with a backdrop below the `lg` breakpoint. The app owns the open/close trigger (hamburger button, etc.) and any persistence — narrow the viewport to see the effect.",
      },
    },
  },
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div className="h-[640px] relative overflow-hidden border border-border-default">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="absolute right-3 top-3 z-10 rounded-md border border-border-default bg-white px-3 py-1.5 text-body-sm font-medium lg:hidden"
        >
          {open ? "Close" : "Open"} menu
        </button>
        <Sidebar
          header={<MediActLogo />}
          footer={<>Version:1.0.0</>}
          activeItemId="home"
          mobileOpen={open}
          onMobileOpenChange={setOpen}
        >
          <SidebarItem id="home" label="Home" icon={Home} />
          <SidebarGroup id="settings" label="Settings" icon={Cog}>
            <SidebarItem id="org-profile" label="Organization Profile" />
            <SidebarItem id="department" label="Department" />
          </SidebarGroup>
        </Sidebar>
      </div>
    );
  },
};
