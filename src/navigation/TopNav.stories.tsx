import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  AppLauncher,
  NotificationBell,
  TopNav,
  TopNavToggle,
  TopNavBrand,
  TopNavSpacer,
  UserMenu,
  UserMenuProfileIcon,
} from "./TopNav";
import { LanguageSwitcher } from "./LanguageSwitcher";

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
  src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'><rect width='80' height='80' fill='%230395d8'/><circle cx='40' cy='31' r='14' fill='%23fff'/><path d='M11 80a29 29 0 0 1 58 0Z' fill='%23fff'/></svg>",
  role: "Super Admin",
};

/** ปุ่มเปลี่ยนภาษาบนแถบ — แบบ `compact` (ธง + รหัสสั้น) ข้าง `AppLauncher` · story ถือ state เอง */
function LanguageSwitcherDemo() {
  const [lang, setLang] = useState("th");
  return (
    <LanguageSwitcher
      variant="compact"
      languages={[
        { value: "en", label: "English" },
        { value: "th", label: "ไทย" },
      ]}
      value={lang}
      onChange={setLang}
      label="เปลี่ยนภาษา"
    />
  );
}

const userMenuProps = {
  user,
  items: [{ label: "My Profile", icon: <UserMenuProfileIcon />, onClick: () => {} }],
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
        <LanguageSwitcherDemo />
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
        <LanguageSwitcherDemo />
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
        <LanguageSwitcherDemo />
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
        <LanguageSwitcherDemo />
        <UserMenu
          user={{ name: "admin1 admin1", role: "Super Admin" }}
          items={[{ label: "My Profile", icon: <UserMenuProfileIcon />, onClick: () => {} }]}
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
        <LanguageSwitcherDemo />
        <UserMenu {...userMenuProps} />
      </TopNav>
    </div>
  ),
};
