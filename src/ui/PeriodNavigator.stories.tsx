import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { PeriodNavigator, type PeriodNavigatorItem } from "./PeriodNavigator";

const meta = {
  title: "UI/PeriodNavigator",
  component: PeriodNavigator,
  tags: ["autodocs"],
  args: { periods: [], value: null, onChange: () => {} },
  parameters: {
    docs: {
      description: {
        component: `
ตัวเลื่อน **งวด** — \`‹ 26 ก.ค. – 25 ส.ค. 2569 ›\` กดตรงกลางแล้วเปิดตาราง 12 เดือน

🔴 **งวดคือแถวในฐานข้อมูล ไม่ใช่เดือนปฏิทิน** — เดือนที่เลือกได้คือเดือนที่มีแถวงวดจริง
เท่านั้น (เดือนอื่นจางและกดไม่ได้) และ **เดือนของงวดอ่านจาก \`endDate\`** เพราะงวด
\`26 ก.ค. – 25 ส.ค.\` คืองวดของเดือน ส.ค.

🔑 **ลูกศรเดินทีละงวด ⛔ ไม่ใช่ทีละเดือน** — เดือนที่ไม่มีงวดคั่นกลางมีจริง ถ้าเดินทีละเดือน
ปุ่มจะกลายเป็น "กดแล้วอยู่ที่เดิม"

\`\`\`tsx
const [id, setId] = React.useState<number | null>(2);
<PeriodNavigator periods={periods} value={id} onChange={(next) => setId(Number(next))} />
\`\`\`

ทุกข้อความรวมทั้ง \`aria-label\` ฉีดผ่าน \`labels\` — \`footer\` รับ \`{month}\` และ \`{range}\`
        `,
      },
    },
  },
} satisfies Meta<typeof PeriodNavigator>;

export default meta;
type Story = StoryObj<typeof meta>;

/** งวดตัดวันที่ 25 ของทุกเดือน — ทรงเดียวกับที่ `payroll_periods` ส่งมาจริง */
const monthlyPeriods: PeriodNavigatorItem[] = [
  { id: 1, startDate: "2026-04-26", endDate: "2026-05-25", label: "งวดพฤษภาคม 2569" },
  { id: 2, startDate: "2026-05-26", endDate: "2026-06-25", label: "งวดมิถุนายน 2569" },
  { id: 3, startDate: "2026-06-26", endDate: "2026-07-25", label: "งวดกรกฎาคม 2569" },
  { id: 4, startDate: "2026-07-26", endDate: "2026-08-25", label: "งวดสิงหาคม 2569" },
  { id: 5, startDate: "2026-08-26", endDate: "2026-09-25", label: "งวดกันยายน 2569" },
];

const thaiLabels = {
  prev: "งวดก่อนหน้า",
  next: "งวดถัดไป",
  empty: "ยังไม่มีงวด",
  monthGrid: "เลือกงวดตามเดือน",
  footer: "งวดเดือน {month} · {range}",
  prevYear: "ปีก่อนหน้า",
  nextYear: "ปีถัดไป",
  chooseYear: "เลือกปี",
  prevYears: "ช่วงปีก่อนหน้า",
  nextYears: "ช่วงปีถัดไป",
};

export const Default: Story = {
  name: "ค่าเริ่มต้น (ไทย · พ.ศ.)",
  parameters: {
    docs: {
      description: {
        story:
          "กดตรงกลางเพื่อเปิดตาราง 12 เดือน — เดือนที่ไม่มีงวด (ต.ค. เป็นต้นไป และก่อน พ.ค.) จางและกดไม่ได้",
      },
    },
  },
  render: () => {
    const [id, setId] = React.useState<string | number | null>(4);
    return (
      <PeriodNavigator
        periods={monthlyPeriods}
        value={id}
        onChange={setId}
        labels={thaiLabels}
      />
    );
  },
};

export const WithGap: Story = {
  name: "ชุดงวดขาดช่วง — ลูกศรต้องข้ามให้",
  parameters: {
    docs: {
      description: {
        story:
          "ก.พ. กับ ก.ค. มีงวด ส่วนเดือนระหว่างกลางไม่มี · กด › จากงวด ก.พ. แล้วต้องไปถึง ก.ค. เลย ⛔ ไม่ใช่ค้างอยู่ที่เดิม",
      },
    },
  },
  render: () => {
    const [id, setId] = React.useState<string | number | null>(10);
    return (
      <PeriodNavigator
        periods={[
          { id: 10, startDate: "2026-01-26", endDate: "2026-02-25" },
          { id: 20, startDate: "2026-06-26", endDate: "2026-07-25" },
        ]}
        value={id}
        onChange={setId}
        labels={thaiLabels}
      />
    );
  },
};

export const ClosedPeriod: Story = {
  name: "งวดที่ปิดแล้ว — ต่อท้ายด้วย suffix",
  render: () => {
    const [id, setId] = React.useState<string | number | null>(3);
    return (
      <PeriodNavigator
        periods={monthlyPeriods.map((period) =>
          period.id === 3 ? { ...period, suffix: "(ปิดแล้ว)" } : period,
        )}
        value={id}
        onChange={setId}
        labels={thaiLabels}
      />
    );
  },
};

export const Empty: Story = {
  name: "ยังไม่มีงวด — ปิดทั้งอัน",
  parameters: {
    docs: {
      description: {
        story:
          "ไม่มีงวดสักแถว ⇒ ลูกศรกดไม่ได้และปฏิทินไม่เปิด — ปุ่มที่กดแล้วไม่ไปไหนแย่กว่าปุ่มที่บอกว่ากดไม่ได้",
      },
    },
  },
  render: () => (
    <PeriodNavigator
      periods={[]}
      value={null}
      onChange={() => {}}
      labels={thaiLabels}
    />
  ),
};

export const English: Story = {
  name: "อังกฤษ · ค.ศ.",
  render: () => {
    const [id, setId] = React.useState<string | number | null>(4);
    return (
      <PeriodNavigator
        periods={monthlyPeriods}
        value={id}
        onChange={setId}
        locale="en-US"
      />
    );
  },
};

export const InFilterBar: Story = {
  name: "ในแถบตัวกรอง — สูงเท่าช่องอื่น",
  parameters: {
    docs: {
      description: {
        story:
          "Mediwork วางตัวเลื่อนนี้เป็นช่องที่สามของแถบขอบเขต ซึ่งสูง 37px (วัดจากจอตารางเวรจริง) — ทับด้วย `className` ได้เพราะค่าไปลงที่เปลือกโดยตรง",
      },
    },
  },
  render: () => {
    const [id, setId] = React.useState<string | number | null>(4);
    return (
      <div className="flex items-start gap-3 rounded-2xl bg-bg-default p-4 shadow-sm">
        <div className="h-[37px] w-[200px] rounded-lg border border-border-default px-3 text-body-sm leading-[35px] text-text-muted">
          แผนก
        </div>
        <PeriodNavigator
          periods={monthlyPeriods}
          value={id}
          onChange={setId}
          labels={thaiLabels}
          className="h-[37px] w-[250px]"
        />
      </div>
    );
  },
};
