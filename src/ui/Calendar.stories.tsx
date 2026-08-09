import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Calendar, startOfMonth } from "./Calendar";

const meta = {
  title: "UI/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "ตารางเดือน — **ฐานเดียว**ของ `DatePicker` และ `DateNavigator`",
          "",
          "ทรงยึดตาม `PickerCalendar` ของ Mediwork (จอ productivity / บันทึกยอดเวร):",
          "กว้าง 340 · ช่องวัน 40 · วงกลมวัน 34 · ตาราง 12 เดือนช่องละ 44 มุม 10",
          "",
          "เขียนเองไม่ได้ใช้ `react-day-picker` — เหตุผลเดียวกับที่แอปเขียนเอง:",
          "ทั้งสองตัวไม่มีตัวแปลง **พ.ศ.** และไม่มีแถบเชื่อมช่วงวัน · พอเขียนเพื่อช่วงแล้ว",
          "วันเดี่ยวก็ใช้ตัวเดียวกัน ไม่งั้นแอปจะมีปฏิทินสองแบบที่นับปีคนละอย่าง",
          "",
          "เดือนที่แสดงเป็น state ของผู้เรียก (`month` + `onMonthChange`) เพราะมันต้องอยู่รอด",
          "ตอน popover re-render",
        ].join("\n"),
      },
    },
  },
  /* `month`/`onMonthChange` เป็น required — ทุก story ใช้ `render` ของตัวเอง
   * ค่าตรงนี้มีไว้ให้ตาราง props ของ autodocs มีอะไรอ้างอิงเท่านั้น */
  args: { month: new Date(2026, 4, 1), onMonthChange: () => {} },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

const useCalendar = (initial: Date) => {
  const [selected, setSelected] = React.useState<Date | null>(initial);
  const [month, setMonth] = React.useState(() => startOfMonth(initial));
  return { selected, setSelected, month, setMonth };
};

export const SingleDay: Story = {
  name: "วันเดียว",
  render: () => {
    const c = useCalendar(new Date(2026, 4, 18));
    return (
      <Calendar
        month={c.month}
        onMonthChange={c.setMonth}
        selected={c.selected}
        onSelect={c.setSelected}
      />
    );
  },
};

export const WithBounds: Story = {
  name: "จำกัดช่วง + ปิดวันเป็นราย ๆ",
  parameters: {
    docs: {
      description: {
        story:
          "`minDate`/`maxDate` ปิดทั้งช่วง · `disabledDate` ปิดทีละวัน (เช่นวันหยุด) · วันของเดือนข้างเคียงถูกวาดไว้ให้ตารางไม่กระโดดระหว่าง 5/6 แถว แต่กดไม่ได้",
      },
    },
  },
  render: () => {
    const c = useCalendar(new Date(2026, 4, 18));
    return (
      <Calendar
        month={c.month}
        onMonthChange={c.setMonth}
        selected={c.selected}
        onSelect={c.setSelected}
        minDate={new Date(2026, 4, 5)}
        maxDate={new Date(2026, 4, 28)}
        disabledDate={(d) => d.getDay() === 0}
      />
    );
  },
};

export const Range: Story = {
  name: "ช่วงวัน",
  parameters: {
    docs: {
      description: {
        story:
          "แถบทาบทั้งช่องและวงกลมข้างใน เพื่อให้ช่วงหลายวันอ่านเป็นแถบเดียวต่อเนื่อง ไม่ใช่วงกลมเรียงกัน · `hoverEnd` พรีวิวปลายท้ายระหว่างเลือก",
      },
    },
  },
  render: () => {
    const [from, setFrom] = React.useState<Date | null>(new Date(2026, 4, 11));
    const [to, setTo] = React.useState<Date | null>(new Date(2026, 4, 17));
    const [hover, setHover] = React.useState<Date | null>(null);
    const [month, setMonth] = React.useState(() => new Date(2026, 4, 1));
    return (
      <Calendar
        month={month}
        onMonthChange={setMonth}
        selected={from}
        rangeEnd={to}
        hoverEnd={hover}
        onDayHover={to ? undefined : setHover}
        onSelect={(day) => {
          if (!from || to) {
            setFrom(day);
            setTo(null);
          } else if (day < from) {
            setFrom(day);
          } else {
            setTo(day);
          }
        }}
      />
    );
  },
};

export const MonthView: Story = {
  name: "มุมมอง 12 เดือน",
  parameters: {
    docs: {
      description: {
        story:
          "ชื่อเดือนคือทางเข้า — ที่เดียวกับที่ปฏิทินทุกตัวใส่ไว้ · ในมุมมองนี้ลูกศรเลื่อน **ทีละปี** ซึ่งเป็นหน่วยที่ผู้ใช้กำลังมองอยู่ · ถ้าไม่มีมุมมองนี้ การย้อนกลับไปหนึ่งปีคือกดลูกศร 12 ครั้ง",
      },
    },
  },
  render: () => {
    const c = useCalendar(new Date(2026, 4, 18));
    return (
      <Calendar
        month={c.month}
        onMonthChange={c.setMonth}
        selected={c.selected}
        onSelect={c.setSelected}
        defaultView="month"
      />
    );
  },
};

export const Locales: Story = {
  name: "พ.ศ. เทียบ ค.ศ.",
  parameters: {
    docs: {
      description: {
        story:
          "ค่าเริ่มต้น `th-TH` ให้ปี **พ.ศ.** อัตโนมัติผ่าน `Intl` — ไม่ต้องมี adapter แยกเหมือน MUI",
      },
    },
  },
  render: () => {
    const th = useCalendar(new Date(2026, 4, 18));
    const en = useCalendar(new Date(2026, 4, 18));
    return (
      <div className="flex flex-wrap gap-6">
        <Calendar
          month={th.month}
          onMonthChange={th.setMonth}
          selected={th.selected}
          onSelect={th.setSelected}
        />
        <Calendar
          month={en.month}
          onMonthChange={en.setMonth}
          selected={en.selected}
          onSelect={en.setSelected}
          locale="en-GB"
          weekStartsOn={1}
          labels={{
            prevMonth: "Previous month",
            nextMonth: "Next month",
            chooseMonth: "Choose month",
          }}
        />
      </div>
    );
  },
};
