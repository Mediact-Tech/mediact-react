import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { useState } from "react";
import { DatePicker } from "./DatePicker";

const meta = {
  title: "Form/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  args: { label: "Date" },
  parameters: {
    docs: {
      description: {
        component:
          "Floating-label date picker. Label sits inside until a date is picked / popover opens, then floats to the top border.",
      },
    },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 🔴 story ที่ผูกกับ `new Date()` จะเปลี่ยนภาพทุกเดือน (ปฏิทินเปิดคนละเดือน
 * และวันที่ถูกเลือกคนละวัน) ⇒ Chromatic จะรายงาน visual diff ทุกต้นเดือน
 * โดยที่ไม่มีใครแก้อะไร · ตรึงวันไว้ให้ภาพนิ่ง */
const FIXED = new Date(2026, 4, 18);

export const Default: Story = {};

export const WithPlaceholder: Story = {
  args: { placeholder: "Pick a date" },
};

export const Controlled: Story = {
  render: (args: React.ComponentProps<typeof DatePicker>) => {
    const [d, setD] = useState<Date | undefined>(FIXED);
    return <DatePicker {...args} value={d ?? null} onChange={setD} />;
  },
  args: { label: "Birthday" },
};

export const WithError: Story = {
  args: {
    error: "Date is required",
    required: true,
  },
};

export const English: Story = {
  args: { label: "Birthday", calendarLocale: "en-GB" },
  parameters: {
    docs: {
      description: {
        story:
          "ค่าเริ่มต้นของปฏิทินคือ `th-TH` ซึ่งให้ปี **พ.ศ.** อัตโนมัติ · ส่ง `calendarLocale` เพื่อเปลี่ยนภาษา/ปฏิทิน",
      },
    },
  },
};

export const WeekStartsMonday: Story = {
  args: { label: "Date", weekStartsOn: 1 },
  parameters: {
    docs: {
      description: {
        story:
          "ของจริงในแอปเริ่มสัปดาห์ที่ **อาทิตย์** (ค่าเริ่มต้น) — ส่ง `weekStartsOn={1}` ถ้าจอไหนต้องเริ่มจันทร์",
      },
    },
  },
};

export const WithBounds: Story = {
  args: {
    label: "Within next 30 days",
    minDate: FIXED,
    maxDate: new Date(2026, 5, 17),
  },
};

export const ClearInField: Story = {
  args: { label: "Date", showClearInField: true, defaultValue: FIXED },
  parameters: {
    docs: {
      description: {
        story:
          "**เอาเมาส์วางบนช่อง** แล้วไอคอนปฏิทินจะกลายเป็น X — ซ้อนช่องเดียวกัน เห็นทีละตัว (ทรงร่วมกับ `DateRangePicker` ที่ `form/field-icon-slot.tsx`) · 🔴 ตัวนี้ไม่มีฟุตเตอร์ให้วางปุ่มล้าง ⇒ **X คือทางเดียวที่จะกลับไปเป็น \"ยังไม่ระบุวัน\"** · บนทัชไม่มี hover จอที่ต้องล้างได้บนมือถือต้องมีทางอื่นให้ผู้ใช้",
      },
    },
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-72">
      <DatePicker label="Empty (rest)" />
      <DatePicker label="With value" defaultValue={FIXED} />
      <DatePicker label="With value + clear in field" showClearInField defaultValue={FIXED} />
      <DatePicker label="Disabled" disabled defaultValue={FIXED} />
      <DatePicker label="Required" required />
      <DatePicker label="With error" error="Required" />
    </div>
  ),
};
