import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Globe } from "lucide-react";
import {
  AppLauncher,
  NotificationBell,
  TopNav,
  TopNavToggle,
  TopNavBrand,
  TopNavSpacer,
  UserMenu,
} from "./TopNav";

const meta = {
  title: "Navigation/TopNav",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Shared top-bar across portal-web and medimatch-bo. Sub-components match `mediact-portal-web/src/components/shared/Sidebar.tsx`'s app launcher and profile menu specs.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const fullCatalog = {
  mediwork: { baseUrl: "https://mediwork.mediact.example" },
  medimatch: { baseUrl: "https://medimatch.mediact.example" },
  /* MediHR เป็นระบบที่ 4 ที่ปล่อยจริงแล้ว — ไม่ใช่ Coming Soon */
  medihr: { baseUrl: "https://hr.mediact.example" },
};

/** ปุ่มพับ/กางเมนู — story ถือ state เอง เพราะของจริงเป็นของ layout ไม่ใช่ของ TopNav */
function DemoToggle() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <TopNavToggle
      collapsed={collapsed}
      onToggle={setCollapsed}
      labels={{ expand: "กางเมนู", collapse: "พับเมนู" }}
    />
  );
}

/** ปุ่มก้นลิ้นชักที่พาไปหน้าตั้งค่าของ Portal — ข้อความมาจากแอปเสมอ */
const settingsAction = {
  label: "ตั้งค่า",
  href: "https://portal.mediact.example",
};

const user = {
  name: "admin1 admin1",
  src: "https://i.pravatar.cc/80?img=5",
  role: "Super Admin",
};

/** Pill-shaped language switcher, matching portal-web's `LanguageSwitcher`. */
function LanguageSwitcherDemo() {
  return (
    <button
      type="button"
      className="flex h-9 items-center gap-2 rounded-full border border-[#0000003B] bg-white px-3 text-body-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
    >
      <Globe className="size-5 text-gray-700/70" />
      English
      <svg
        viewBox="0 0 24 24"
        className="size-4 text-gray-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

const userMenuProps = {
  user,
  items: [{ label: "My Profile", onClick: () => {} }],
  bottomLeft: <LanguageSwitcherDemo />,
  onLogout: () => {},
};

export const Default: Story = {
  render: () => (
    <div className="p-4">
      <TopNav>
        <DemoToggle />
        <TopNavBrand>ABC Hospital</TopNavBrand>
        <TopNavSpacer />
        <AppLauncher apps={fullCatalog} settingsAction={settingsAction} />
        <NotificationBell hasUnread />
        <UserMenu {...userMenuProps} />
      </TopNav>
    </div>
  ),
};

export const ActiveApp: Story = {
  render: () => (
    <div className="p-4">
      <TopNav>
        <DemoToggle />
        <TopNavBrand>ABC Hospital</TopNavBrand>
        <TopNavSpacer />
        <AppLauncher
          apps={{
            ...fullCatalog,
            medimatch: {
              baseUrl: "https://medimatch.mediact.example",
              active: true,
            },
          }}
          settingsAction={settingsAction}
        />
        <NotificationBell hasUnread />
        <UserMenu {...userMenuProps} />
      </TopNav>
    </div>
  ),
};

export const TenantWithoutMedimatch: Story = {
  render: () => (
    <div className="p-4">
      <TopNav>
        <DemoToggle />
        <TopNavBrand>ABC Hospital</TopNavBrand>
        <TopNavSpacer />
        <AppLauncher
          apps={{
            ...fullCatalog,
            mediwork: {
              baseUrl: "https://mediwork.mediact.example",
              active: true,
            },
            medimatch: {
              baseUrl: "https://medimatch.mediact.example",
              disabled: true,
            },
          }}
          settingsAction={settingsAction}
        />
        <NotificationBell hasUnread />
        <UserMenu {...userMenuProps} />
      </TopNav>
    </div>
  ),
};

export const WithUnreadCount: Story = {
  render: () => (
    <div className="p-4">
      <TopNav>
        <DemoToggle />
        <TopNavBrand>ABC Hospital</TopNavBrand>
        <TopNavSpacer />
        <AppLauncher apps={fullCatalog} settingsAction={settingsAction} />
        <NotificationBell unreadCount={5} />
        <UserMenu {...userMenuProps} />
      </TopNav>
    </div>
  ),
};

export const NoNotifications: Story = {
  render: () => (
    <div className="p-4">
      <TopNav>
        <DemoToggle />
        <TopNavBrand>ABC Hospital</TopNavBrand>
        <TopNavSpacer />
        <AppLauncher apps={fullCatalog} settingsAction={settingsAction} />
        <NotificationBell />
        <UserMenu {...userMenuProps} />
      </TopNav>
    </div>
  ),
};

export const WithoutAvatarSrc: Story = {
  parameters: {
    docs: {
      description: {
        story: "Avatar falls back to initials when `src` is missing.",
      },
    },
  },
  render: () => (
    <div className="p-4">
      <TopNav>
        <DemoToggle />
        <TopNavBrand>ABC Hospital</TopNavBrand>
        <TopNavSpacer />
        <AppLauncher apps={fullCatalog} settingsAction={settingsAction} />
        <NotificationBell hasUnread />
        <UserMenu
          user={{ name: "admin1 admin1", role: "Super Admin" }}
          items={[{ label: "My Profile", onClick: () => {} }]}
          bottomLeft={<LanguageSwitcherDemo />}
          onLogout={() => {}}
        />
      </TopNav>
    </div>
  ),
};

export const ProfileMenuOnly: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Just the profile dropdown — useful for previewing the menu in isolation.",
      },
    },
  },
  render: () => (
    <div className="flex justify-end p-4">
      <UserMenu {...userMenuProps} />
    </div>
  ),
};

export const LongTitle: Story = {
  render: () => (
    <div className="p-4">
      <TopNav>
        <TopNavBrand>
          Bangkok Mediact Memorial Hospital — Medical Center
        </TopNavBrand>
        <TopNavSpacer />
        <AppLauncher apps={fullCatalog} settingsAction={settingsAction} />
        <NotificationBell hasUnread />
        <UserMenu {...userMenuProps} />
      </TopNav>
    </div>
  ),
};
