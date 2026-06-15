import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateNavigator } from "./DateNavigator";

const meta = {
  title: "Schedule/DateNavigator",
  component: DateNavigator,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
\`DateNavigator\` คือ \`‹ label ›\` stepper สำหรับเลื่อนเดือน/วัน รองรับ 2 โหมด:

**Controlled (แนะนำ)** — ส่ง \`value\` + \`onChange\` แล้ว component จะ format label ไทย/พ.ศ. ให้อัตโนมัติผ่าน \`Intl.DateTimeFormat\` และ step ตาม \`unit\`

**Manual** — ส่ง \`label\` + \`onPrev\`/\`onNext\` เมื่อต้องการ format ที่กำหนดเอง เช่น "สัปดาห์ที่ 24 / 2569"

### ตัวอย่าง Controlled (เดือน)
\`\`\`tsx
const [month, setMonth] = React.useState(new Date());
<DateNavigator value={month} onChange={setMonth} unit="month" />
\`\`\`

### ตัวอย่าง Controlled (วัน)
\`\`\`tsx
const [day, setDay] = React.useState(new Date());
<DateNavigator value={day} onChange={setDay} unit="day" size="sm" />
\`\`\`
        `,
      },
    },
  },
} satisfies Meta<typeof DateNavigator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ControlledMonth: Story = {
  name: "Controlled — เดือน (แนะนำ)",
  parameters: {
    docs: { description: { story: "format ไทย/พ.ศ. อัตโนมัติ เช่น \"มิถุนายน 2569\" — ส่ง `value` + `onChange` แล้วปล่อยให้ component จัดการ" } },
  },
  render: () => {
    const [month, setMonth] = React.useState(() => new Date(2026, 5, 1));
    return <DateNavigator value={month} onChange={setMonth} unit="month" />;
  },
};

export const ControlledDay: Story = {
  name: "Controlled — วัน (size sm)",
  parameters: {
    docs: { description: { story: "ระดับวัน — แสดง \"วันอังคารที่ 2 มิถุนายน\" — ใช้ `size=\"sm\"` สำหรับ header ที่กะทัดรัด" } },
  },
  render: () => {
    const [day, setDay] = React.useState(() => new Date(2026, 5, 2));
    return <DateNavigator value={day} onChange={setDay} unit="day" size="sm" />;
  },
};

export const WithMinMax: Story = {
  name: "จำกัดช่วง (minDate / maxDate)",
  parameters: {
    docs: { description: { story: "ปุ่ม ‹ › disable อัตโนมัติเมื่อ step ถัดไปอยู่นอก range — ไม่ต้อง handle เอง" } },
  },
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

export const EnglishLocale: Story = {
  name: "Locale อื่น (en-US)",
  parameters: {
    docs: { description: { story: "เปลี่ยน `locale` เพื่อ format ภาษา/ปีแบบอื่น — ค่า default คือ `\"th-TH\"` (พ.ศ.)" } },
  },
  render: () => {
    const [month, setMonth] = React.useState(() => new Date(2026, 5, 1));
    return (
      <DateNavigator value={month} onChange={setMonth} locale="en-US" />
    );
  },
};

export const ManualLabel: Story = {
  name: "Manual — custom label",
  parameters: {
    docs: { description: { story: "ส่ง `label` + `onPrev`/`onNext` ตรงๆ เมื่อต้องการ format ที่ component ไม่รองรับ เช่น \"สัปดาห์ที่ 24 / 2569\"" } },
  },
  args: {
    label: "สัปดาห์ที่ 24 / 2569",
    onPrev: () => console.log("prev week"),
    onNext: () => console.log("next week"),
  },
};
