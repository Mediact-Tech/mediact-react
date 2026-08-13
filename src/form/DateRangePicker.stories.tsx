import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { useState } from "react";
import { DateRangePicker, type DateRangeValue } from "./DateRangePicker";

const meta = {
  title: "Form/DateRangePicker",
  component: DateRangePicker,
  tags: ["autodocs"],
  args: { label: "Date range" },
  parameters: {
    docs: {
      description: {
        component:
          "One calendar, two ends. The selection is a draft until \"OK\" — clicking a day never fires `onChange` by itself.",
      },
    },
  },
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 🔴 story ที่ผูกกับ `new Date()` จะเปลี่ยนภาพทุกเดือน — ตรึงวันไว้ให้ภาพนิ่ง
 * (เหตุผลเดียวกับ `DatePicker.stories.tsx`) */
const FIXED_FROM = new Date(2026, 4, 10);
const FIXED_TO = new Date(2026, 4, 18);

export const Default: Story = {};

export const WithPlaceholder: Story = {
  args: { placeholder: "Pick a date" },
};

export const Controlled: Story = {
  render: (args: React.ComponentProps<typeof DateRangePicker>) => {
    const [range, setRange] = useState<DateRangeValue>({
      from: FIXED_FROM,
      to: FIXED_TO,
    });
    return <DateRangePicker {...args} value={range} onChange={setRange} />;
  },
  args: { label: "Shift census period" },
};

export const WithError: Story = {
  args: {
    error: "Date range is required",
    required: true,
  },
};

export const English: Story = {
  args: { label: "Date range", calendarLocale: "en-GB" },
  parameters: {
    docs: {
      description: {
        story:
          "ค่าเริ่มต้นของปฏิทินคือ `th-TH` ซึ่งให้ปี **พ.ศ.** อัตโนมัติ · ส่ง `calendarLocale` เพื่อเปลี่ยนภาษา/ปฏิทิน",
      },
    },
  },
};

export const WithBounds: Story = {
  args: {
    label: "Within the next 30 days",
    minDate: FIXED_FROM,
    maxDate: new Date(2026, 5, 9),
  },
};

export const ClearInField: Story = {
  args: {
    label: "Date range",
    showClearInField: true,
    defaultValue: { from: FIXED_FROM, to: FIXED_TO },
  },
  parameters: {
    docs: {
      description: {
        story:
          "**เอาเมาส์วางบนช่อง** แล้วไอคอนปฏิทินจะกลายเป็น X — ซ้อนช่องเดียวกัน เห็นทีละตัว ไม่มีวันโผล่พร้อมกัน (ทรงเดียวกับ antd ที่ `mediact-web-admin` ใช้อยู่) · แท็บเข้ามาก็เห็นเช่นกัน ซึ่ง antd ไม่ทำ · ค่าเริ่มต้นของ prop นี้คือ **ปิด** เพราะไม่มี field ตัวไหนใน DS ให้ล้างจากในช่อง — ล้างอยู่ในฟุตเตอร์ของ popover เสมอ",
      },
    },
  },
};

export const CustomLabels: Story = {
  args: {
    label: "ช่วงวันที่",
    labels: { confirm: "ยืนยัน", clear: "ล้าง" },
    defaultValue: { from: FIXED_FROM, to: FIXED_TO },
  },
  parameters: {
    docs: {
      description: {
        story:
          "ทุกข้อความที่ component เป็นเจ้าของ (ปุ่มยืนยัน/ล้าง + aria-label ของไอคอนล้าง) มาจาก `labels` — แอปส่งคำแปลของตัวเองมาเสมอ",
      },
    },
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <DateRangePicker label="Empty (rest)" />
      <DateRangePicker
        label="With value"
        defaultValue={{ from: FIXED_FROM, to: FIXED_TO }}
      />
      <DateRangePicker
        label="With value + clear in field"
        showClearInField
        defaultValue={{ from: FIXED_FROM, to: FIXED_TO }}
      />
      <DateRangePicker
        label="Disabled"
        disabled
        defaultValue={{ from: FIXED_FROM, to: FIXED_TO }}
      />
      <DateRangePicker label="Required" required />
      <DateRangePicker label="With error" error="Required" />
    </div>
  ),
};
