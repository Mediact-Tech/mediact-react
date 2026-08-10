import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { User } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import {
  AppLauncher,
  TopNav,
  TopNavBrand,
  TopNavSpacer,
  UserMenu,
} from "./TopNav";

const meta = {
  title: "Navigation/LanguageSwitcher",
  component: LanguageSwitcher,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "ปุ่มเปลี่ยนภาษาที่ hr-web กับ portal-web เขียนซ้ำกันไฟล์ต่อไฟล์ — ย้ายมาไว้ที่เดียว " +
          "เป็นเมนูหล่นลงแบบ radio (`role=\"menuitemradio\"`) ไม่ใช่ช่องกรอกในฟอร์ม",
      },
    },
  },
} satisfies Meta<typeof LanguageSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

const LANGUAGES = [
  { value: "en-EN", label: "English" },
  { value: "th-TH", label: "ไทย" },
];

function Demo(props: Partial<React.ComponentProps<typeof LanguageSwitcher>>) {
  const [value, setValue] = useState("th-TH");
  return (
    <LanguageSwitcher
      languages={LANGUAGES}
      value={value}
      onChange={setValue}
      label="เปลี่ยนภาษา"
      {...props}
    />
  );
}

/** ทรงเดียว — เม็ดยา 120×36 ตามที่วัดจากของจริง */
export const Default: Story = {
  args: { languages: LANGUAGES },
  render: () => <Demo />,
};

/** ที่อยู่จริงของมัน — **ช่องซ้ายล่างของเมนูโปรไฟล์** (`UserMenu` prop `bottomLeft`)
 * คู่กับปุ่มออกจากระบบ · กดปุ่มบัญชีผู้ใช้เพื่อเปิด */
export const InUserMenu: Story = {
  args: { languages: LANGUAGES },
  render: () => (
    <div className="w-[900px]">
      <TopNav>
        <TopNavBrand>โรงพยาบาลเมดิแอค</TopNavBrand>
        <TopNavSpacer />
        <AppLauncher apps={{ medihr: { active: true } }} label="แอป" />
        <UserMenu
          user={{
            name: "สมชาย ใจดี",
            role: "ผู้ดูแลระบบ",
            fallback: <User className="size-[50%]" />,
          }}
          items={[{ label: "โปรไฟล์ของฉัน" }]}
          label="บัญชีผู้ใช้"
          logoutLabel="ออกจากระบบ"
          bottomLeft={<Demo />}
        />
      </TopNav>
    </div>
  ),
};

/** 🔴 ภาษาที่ไม่มีในรายการ — โชว์แต่ลูกโลก ไม่เดาเป็นตัวแรก
 * (เดาแล้วผู้ใช้จะอ่านว่าอยู่ภาษาที่ไม่ได้อยู่จริง) */
export const UnknownValue: Story = {
  args: { languages: LANGUAGES },
  render: () => <LanguageSwitcher languages={LANGUAGES} value="ja-JP" label="เปลี่ยนภาษา" />,
};
