import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateNavigator } from "./DateNavigator";

const meta = {
  title: "UI/DateNavigator",
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

export const WithCalendar: Story = {
  name: "กดตรงกลางเปิดปฏิทิน",
  parameters: {
    docs: {
      description: {
        story:
          "ส่ง `calendar` แล้วป้ายตรงกลางกลายเป็นปุ่มที่เปิดปฏิทิน · หนึ่งคลิกคือทั้งการตัดสินใจ จึง commit แล้วปิดทันที ไม่มีปุ่ม OK (แบบเดียวกับ `DateField` ของ Mediwork)",
      },
    },
  },
  render: () => {
    const [day, setDay] = React.useState(() => new Date(2026, 4, 18));
    return (
      <DateNavigator
        value={day}
        onChange={setDay}
        unit="day"
        calendar
        maxDate={new Date(2026, 4, 31)}
      />
    );
  },
};

export const MonthCalendar: Story = {
  name: "หน่วยเดือน — เปิดมาที่ตาราง 12 เดือน",
  parameters: {
    docs: {
      description: {
        story:
          "`unit=\"month\"` เปิดปฏิทินมาที่มุมมองเดือนและเลือกจบที่เดือนเลย — หน่วยของตัวเลื่อนคือเดือน การให้กดเดือนแล้วต้องกดวันอีกทีคือขั้นตอนที่ไม่มีความหมาย",
      },
    },
  },
  render: () => {
    const [month, setMonth] = React.useState(() => new Date(2026, 5, 1));
    return (
      <DateNavigator value={month} onChange={setMonth} unit="month" calendar />
    );
  },
};

/** ปุ่มเลือกขอบเขต — ของจริงในหน้า productivity เป็นแถวปุ่ม "ทั้งวัน + เวรของหน่วยงาน" */
function ScopeButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={
        "min-w-22 flex-1 cursor-pointer rounded-lg border py-2 text-body-sm transition-colors " +
        (selected
          ? "border-brand bg-brand-subtle font-semibold text-brand"
          : "border-border-default text-text-body hover:border-brand")
      }
    >
      {label}
    </button>
  );
}

export const DayAndShift: Story = {
  name: "วัน + เวร (โหมดร่าง)",
  parameters: {
    docs: {
      description: {
        story: [
          "ทรงจริงของหน้า **productivity** — ลิ้นชักถือทั้งวันและเวร",
          "",
          "ส่ง `confirmLabel` = **โหมดร่าง**: กดวันแล้วยังไม่ commit จนกดปุ่มยืนยัน",
          "เพราะถ้า commit ทันทีที่กดวัน หน้าจอข้างหลังจะโหลดใหม่ทั้งที่ผู้ใช้ยังเลือกไม่ครบคู่",
          "",
          "`children` เป็นสล็อตเปล่า — DS ไม่รู้จักเวร/แผนก state ทั้งหมดเป็นของผู้เรียก",
        ].join("\n"),
      },
    },
  },
  render: () => {
    const SHIFTS = ["ทั้งวัน", "เวรเช้า", "เวรบ่าย", "เวรดึก"];
    const [day, setDay] = React.useState(() => new Date(2026, 4, 18));
    const [shift, setShift] = React.useState("เวรบ่าย");
    const [draftShift, setDraftShift] = React.useState(shift);
    const [open, setOpen] = React.useState(false);
    const fmt = new Intl.DateTimeFormat("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    return (
      <DateNavigator
        unit="day"
        value={day}
        calendar
        calendarOpen={open}
        onCalendarOpenChange={(next) => {
          if (next) setDraftShift(shift);
          setOpen(next);
        }}
        calendarTitle="เลือกวันและเวร"
        confirmLabel="เสร็จสิ้น"
        onConfirm={(picked) => {
          setDay(picked);
          setShift(draftShift);
        }}
        maxDate={new Date(2026, 4, 31)}
        label={
          <span className="inline-flex items-center gap-1.5">
            <span className="font-medium text-text-body">{fmt.format(day)}</span>
            <span className="text-text-tertiary">·</span>
            <span className="font-semibold text-brand">{shift}</span>
          </span>
        }
      >
        <p className="mb-2 text-body-sm font-semibold text-text-black">
          ประเภทเวร
        </p>
        <div className="flex flex-wrap gap-2">
          {SHIFTS.map((s) => (
            <ScopeButton
              key={s}
              label={s}
              selected={draftShift === s}
              onClick={() => setDraftShift(s)}
            />
          ))}
        </div>
      </DateNavigator>
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
