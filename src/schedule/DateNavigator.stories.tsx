import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateNavigator } from "./DateNavigator";

const meta = {
  title: "Schedule/DateNavigator",
  component: DateNavigator,
} satisfies Meta<typeof DateNavigator>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Controlled mode (แนะนำ) — format ไทย + พ.ศ. อัตโนมัติ */
export const ControlledMonth: Story = {
  render: () => {
    const [month, setMonth] = React.useState(() => new Date(2026, 5, 1));
    return <DateNavigator value={month} onChange={setMonth} unit="month" />;
  },
};

/** ระดับวัน — "วันอังคารที่ 2 มิถุนายน" */
export const ControlledDay: Story = {
  render: () => {
    const [day, setDay] = React.useState(() => new Date(2026, 5, 2));
    return <DateNavigator value={day} onChange={setDay} unit="day" size="sm" />;
  },
};

/** จำกัดช่วง — ปุ่ม disable อัตโนมัติเมื่อชนขอบ */
export const WithMinMax: Story = {
  render: () => {
    const [month, setMonth] = React.useState(() => new Date(2026, 5, 1));
    return (
      <DateNavigator
        value={month}
        onChange={setMonth}
        unit="month"
        minDate={new Date(2026, 3, 1)}
        maxDate={new Date(2026, 7, 1)}
      />
    );
  },
};

/** Locale อื่น */
export const EnglishLocale: Story = {
  render: () => {
    const [month, setMonth] = React.useState(() => new Date(2026, 5, 1));
    return (
      <DateNavigator value={month} onChange={setMonth} locale="en-US" />
    );
  },
};

/** Manual mode — custom label ที่ format มาตรฐานไม่ครอบ */
export const ManualLabel: Story = {
  args: {
    label: "สัปดาห์ที่ 24 / 2569",
    onPrev: () => console.log("prev week"),
    onNext: () => console.log("next week"),
  },
};
