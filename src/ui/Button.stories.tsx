import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "ghost",
        "info",
        "destructive",
        "success",
        "warning",
      ],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    fullWidth: { control: "boolean" },
  },
  args: {
    children: "Button",
  },
  parameters: {
    docs: {
      description: {
        component: [
          "ปุ่ม — รูปทรงวัดจากของจริงทั้ง 4 แอป",
          "",
          "### 🔴 `loading` กับ `isLoading` คนละเรื่อง ตั้งใจให้แยกกัน",
          "",
          "| prop | แปลว่า | ผู้ใช้เห็น |",
          "|---|---|---|",
          "| `loading` | กดไปแล้วและกำลังทำงาน | **ป้ายเดิมยังอยู่** + สปินเนอร์ · กดซ้ำไม่ได้ |",
          "| `isLoading` | ยังไม่รู้ว่าปุ่มนี้ควรเขียนว่าอะไร | โครงร่างเทา ไม่มีปุ่ม |",
          "",
          "ปุ่มที่ผู้ใช้เพิ่งกด **ต้องเก็บป้ายไว้** — ใช้ `isLoading` ตอนกดบันทึก ปุ่มจะกลายเป็น",
          "แถบเทาทันที แล้วผู้ใช้ไม่รู้ว่าเพิ่งกดอะไรไป",
          "",
          "⚠️ `size` คุมความสูงกับขนาดไอคอนเท่านั้น — ขนาดตัวอักษรอยู่บน base เหมือนกันทุกขนาด",
          "",
          "⚠️ `md` ของปุ่ม = 36px แต่ `md` ของช่องกรอก = 44px (ยังไม่ยุบ — ดู `Input.md`)",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: "primary" },
};

export const Secondary: Story = {
  args: { variant: "secondary" },
};

export const Destructive: Story = {
  args: { variant: "destructive", children: "Delete" },
};

export const Loading: Story = {
  args: { loading: true, children: "Saving..." },
};

export const Disabled: Story = {
  args: { disabled: true },
};

const Plus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5v14" strokeLinecap="round" />
  </svg>
);
const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const WithLeftIcon: Story = {
  args: { leftIcon: <Plus />, children: "Add item" },
};

export const WithRightIcon: Story = {
  args: { rightIcon: <ChevronRight />, children: "ถัดไป" },
};

/** ใส่พร้อมกันทั้งสองข้างได้ — ระยะห่างมาจาก `gap-1` ที่ base ตัวเดียว
 * ทั้งสองข้างจึงเท่ากันเสมอ ไม่ต้องตั้งค่าแยก */
export const WithBothIcons: Story = {
  args: {
    leftIcon: <Plus />,
    rightIcon: <ChevronRight />,
    children: "เพิ่มแล้วไปต่อ",
  },
};

/** ไอคอนถูกครอบด้วย `<span aria-hidden>` เสมอ — โปรแกรมอ่านหน้าจอจะอ่านแค่ข้อความ
 * และไอคอนไม่ถูกบีบเมื่อข้อความยาวจนล้น */
export const IconsWithLongLabel: Story = {
  render: () => (
    <div className="w-64">
      <Button fullWidth leftIcon={<Plus />} rightIcon={<ChevronRight />}>
        ข้อความยาวมากจนปุ่มเริ่มไม่พอ
      </Button>
    </div>
  ),
};

/** `asChild` + ไอคอน — เคยพังมาก่อน
 *
 * `Slot` ของ Radix เรียก `React.Children.only()` ข้างใน การส่งไอคอนซ้าย +
 * ข้อความ + ไอคอนขวา เป็น 3 ก้อนพี่น้องจึง throw ทันที ตอนนี้ Button ยัดเนื้อหา
 * เข้าไปในลูกตัวเดียวให้แทน — `asChild` ใช้คู่กับไอคอนได้แล้ว
 */
export const AsChildWithIcons: Story = {
  render: () => (
    <Button asChild leftIcon={<Plus />} rightIcon={<ChevronRight />}>
      <a href="#top">ลิงก์ที่หน้าตาเป็นปุ่ม</a>
    </Button>
  ),
};

/** ตอน loading ไอคอนซ้ายถูกแทนด้วยสปินเนอร์ และไอคอนขวาถูกซ่อน
 * เพื่อไม่ให้ปุ่มมี 2 สัญลักษณ์แข่งกันบอกสถานะ */
export const LoadingWithIcons: Story = {
  args: {
    loading: true,
    leftIcon: <Plus />,
    rightIcon: <ChevronRight />,
    children: "กำลังบันทึก",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="info">Info</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="success">Success</Button>
      <Button variant="warning">Warning</Button>
    </div>
  ),
};

/** ตรงกับ Figma และปุ่มที่ render จริงบน MediHR วันนี้
 *
 * ปุ่ม "เพิ่มเวลาทำงาน" ใน `MEDIACT — HR · Lo-fi Wireframes` (node 544:15849)
 * และปุ่ม "Add Department" ที่วัดจาก MediHR ด้วย Playwright ให้ค่าเดียวกันเป๊ะ:
 * พื้นแบรนด์ · radius 6px · ตัวอักษร 14px น้ำหนัก 500 · ไอคอน 16px · gap 4px · px-3 py-2
 *
 * ก่อนแก้ ปุ่มตัวนี้เป็น radius 4px / น้ำหนัก 600 / gap 8px — ไม่ตรงทั้งสองแหล่ง
 */
export const MatchesFigma: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      <Button
        leftIcon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5v14" strokeLinecap="round" />
          </svg>
        }
      >
        เพิ่มเวลาทำงาน
      </Button>
      <p className="text-caption text-text-tertiary">
        radius 6px · 14px/500 · gap 4px · px-3 py-2
      </p>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="xs">XS</Button>
      <Button size="sm">SM</Button>
      <Button size="md">MD</Button>
      <Button size="lg">LG</Button>
      <Button size="xl">XL</Button>
    </div>
  ),
};
