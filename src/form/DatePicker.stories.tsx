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

export const Default: Story = {};

export const WithPlaceholder: Story = {
  args: { placeholder: "Pick a date" },
};

export const Controlled: Story = {
  render: (args: React.ComponentProps<typeof DatePicker>) => {
    const [d, setD] = useState<Date | undefined>(new Date());
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
    minDate: new Date(),
    maxDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-72">
      <DatePicker label="Empty (rest)" />
      <DatePicker label="With value" defaultValue={new Date()} />
      <DatePicker label="Disabled" disabled defaultValue={new Date()} />
      <DatePicker label="Required" required />
      <DatePicker label="With error" error="Required" />
    </div>
  ),
};
