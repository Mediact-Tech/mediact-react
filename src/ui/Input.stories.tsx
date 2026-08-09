import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { useState } from "react";
import { Mail, Search, Lock } from "lucide-react";
import { Input } from "./Input";

const meta = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    type: {
      control: "select",
      options: ["text", "email", "password", "number"],
    },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    alwaysFloatLabel: { control: "boolean" },
  },
  args: {
    label: "Email",
  },
  parameters: {
    docs: {
      description: {
        component:
          'Input with floating label — label sits inside the field as a placeholder and floats to the top border on focus or when filled. Pass `placeholder` separately to show a hint while focused. Use `alwaysFloatLabel` for fields with fixed prefixes (e.g. date masks).',
      },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithPlaceholderHint: Story = {
  args: {
    label: "Email",
    placeholder: "you@example.com",
  },
};

export const PrefilledFloats: Story = {
  args: {
    label: "Email",
    defaultValue: "alice@mediact.example",
  },
};

export const WithHint: Story = {
  args: {
    label: "Email",
    hint: "We'll never share your email.",
  },
};

export const WithError: Story = {
  args: {
    label: "Email",
    defaultValue: "not-an-email",
    error: "Invalid email address",
  },
};

export const Required: Story = {
  args: { required: true },
};

export const WithPrefixIcon: Story = {
  args: { label: "อีเมล", prefixIcon: <Mail /> },
};

export const WithSuffixIcon: Story = {
  args: { label: "ค้นหา", suffixIcon: <Search /> },
};

/** ใส่ได้ทั้งสองข้างพร้อมกัน — ช่องกรอกเว้นที่ให้เองทั้งซ้าย (`pl-9`) และขวา (`pr-9`) */
export const WithBothIcons: Story = {
  args: { label: "ค้นหาพนักงาน", prefixIcon: <Search />, suffixIcon: <Mail /> },
};

/** ป้ายที่ยังไม่ลอยจะเลื่อนไปทางขวาเองเมื่อมีไอคอนหน้าช่อง
 * (`left-3` → `left-9`) ไม่งั้นป้ายจะทับไอคอน */
export const IconShiftsRestingLabel: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-6">
      <Input label="ไม่มีไอคอน" />
      <Input label="มีไอคอน — ป้ายเลื่อนให้เอง" prefixIcon={<Search />} />
    </div>
  ),
};

/** ปุ่มล้างค่าและปุ่มดูรหัสผ่านมาก่อน `suffixIcon` เสมอ
 * — ไม่งั้นจะมีสองอย่างซ้อนกันที่มุมขวา */
export const SuffixIconYieldsToBuiltIns: Story = {
  render: () => {
    const [v, setV] = useState("พิมพ์แล้วดูมุมขวา");
    return (
      <div className="flex w-80 flex-col gap-6">
        <Input label="ปกติ" suffixIcon={<Mail />} />
        <Input
          label="clearable — ปุ่มล้างชนะ"
          suffixIcon={<Mail />}
          clearable
          value={v}
          onChange={(e) => setV(e.target.value)}
        />
        <Input label="password — ปุ่มตาชนะ" type="password" suffixIcon={<Mail />} />
      </div>
    );
  },
};

/** @deprecated ชื่อเดิม — ยังใช้ได้ แต่ `prefixIcon`/`suffixIcon` คือชื่อที่แอปจริงเรียก 56 จุด */
export const LegacyAdornmentNames: Story = {
  args: { label: "ชื่อเดิมยังทำงาน", leftAdornment: <Mail /> },
};

export const Password: Story = {
  args: { label: "รหัสผ่าน", type: "password", prefixIcon: <Lock /> },
};

export const Clearable: Story = {
  render: (args: React.ComponentProps<typeof Input>) => {
    const [v, setV] = useState("hello");
    return <Input {...args} value={v} onChange={(e) => setV(e.target.value)} />;
  },
  args: { clearable: true, label: "Search", leftAdornment: <Search /> },
};

export const AlwaysFloatLabel: Story = {
  args: {
    label: "Date of birth",
    alwaysFloatLabel: true,
    placeholder: "DD / MM / YYYY",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use `alwaysFloatLabel` when the input has a fixed prefix or mask that should always be visible.",
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-72">
      <Input label="Small" size="sm" />
      <Input label="Medium" size="md" />
      <Input label="Large" size="lg" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-72">
      <Input label="Empty (rest)" />
      <Input label="With value" defaultValue="filled" />
      <Input label="Disabled" disabled defaultValue="cannot edit" />
      <Input label="Required" required />
      <Input label="With error" defaultValue="bad" error="Required field" />
    </div>
  ),
};

/** ไม่มีป้าย → ใช้ placeholder แทน
 *
 * ป้ายว่าง (`label=""` หรือไม่ส่ง `label`) ต้องไม่ render อะไรเลย
 * ก่อนหน้านี้ `label=""` จะสร้าง <label> เปล่ากว้าง 12px พื้นขาววางคร่อมเส้นขอบ
 * = เจาะรูขาวบนกรอบโดยไม่มีตัวอักษร · เกิดบ่อยจาก `label={t("...")}` ที่ยังไม่มีคำแปล
 */
export const PlaceholderOnly: Story = {
  args: { label: undefined, placeholder: "ค้นหาพนักงาน" },
};

export const EmptyLabelFallsBackToPlaceholder: Story = {
  args: { label: "", placeholder: "ค้นหาพนักงาน" },
};

/** เทียบสามเคสให้เห็นพร้อมกัน — เส้นขอบด้านบนต้องต่อเนื่องทั้งสองอันล่าง */
export const LabelVsPlaceholder: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-7">
      <Input label="มีป้าย" placeholder="เช่น ศุกร์ ทดสอบ" />
      <Input placeholder="ไม่ส่ง label เลย" />
      <Input label="" placeholder={'label="" — เส้นขอบต้องไม่ขาด'} />
    </div>
  ),
};
