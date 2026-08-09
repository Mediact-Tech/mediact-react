import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { useState } from "react";
import { Select } from "./Select";

const meta = {
  title: "UI/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Floating-label single-select. Label sits inside until a value is picked / dropdown is opened, then floats to the top border.",
      },
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  { value: "th", label: "Thailand" },
  { value: "sg", label: "Singapore" },
  { value: "my", label: "Malaysia" },
  { value: "id", label: "Indonesia", disabled: true },
];

export const Default: Story = {
  args: { label: "Country", options },
};

export const WithDefaultValue: Story = {
  args: { label: "Country", options, defaultValue: "th" },
};

export const WithPlaceholder: Story = {
  args: {
    label: "Country",
    options,
    placeholder: "Pick one...",
  },
};

export const WithHint: Story = {
  args: {
    label: "Country",
    options,
    hint: "Used for tax calculation",
  },
};

export const WithError: Story = {
  args: {
    label: "Country",
    options,
    required: true,
    error: "Country is required",
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-72">
      <Select label="Empty (rest)" options={options} />
      <Select label="With value" options={options} defaultValue="sg" />
      <Select label="Disabled" options={options} disabled defaultValue="my" />
      <Select label="Required" options={options} required />
      <Select label="With error" options={options} error="Required" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-72">
      <Select label="Small" size="sm" options={options} />
      <Select label="Medium" size="md" options={options} />
      <Select label="Large" size="lg" options={options} />
    </div>
  ),
};

export const Clearable: Story = {
  args: {
    label: "Country",
    options,
    clearable: true,
    defaultValue: "th",
    hint: "Pick a value, then use the × to reset it",
  },
};

export const ClearableControlled: Story = {
  render: (args: React.ComponentProps<typeof Select>) => {
    const [v, setV] = useState("sg");
    return <Select {...args} value={v} onChange={setV} />;
  },
  args: { label: "Country", options, clearable: true },
};

/** `isLoading` — ตัวเลือกยังมาไม่ถึง
 *
 * ⚠️ ต่างจาก `disabled` — `disabled` แปลว่า "เลือกไม่ได้" ซึ่งผู้ใช้ต้องเข้าใจว่าทำไม
 * ส่วน `isLoading` แปลว่า "ยังไม่รู้ว่ามีอะไรให้เลือกบ้าง"
 * dropdown ที่รอ API อยู่ต้องใช้ตัวนี้
 *
 * ไม่มีลูกศรตอนโหลดโดยตั้งใจ — ลูกศรบอกว่ากดแล้วจะมีอะไรให้เลือก ซึ่งตอนนั้นยังไม่จริง
 */
export const Loading: Story = {
  args: { label: "Country", options, isLoading: true },
};

/* การพิสูจน์ว่าโครงร่างสูงเท่าของจริงอยู่ที่ `Feedback/Skeleton states` → `Fields`
 * (ที่เดียวครอบทั้ง Input / Select / Textarea — ไม่ซ้ำ 3 story) */

/** **ไม่มีตัวเลือกให้เลือก — พร้อมทางออก**
 *
 * 🔴 เดิม `options={[]}` ได้ **กล่องเปล่าไม่มีอะไรเลย** ผู้ใช้กดแล้วไม่รู้ว่า
 * โหลดไม่มา ระบบพัง หรือไม่มีข้อมูลจริง ๆ
 *
 * 🔴 **dropdown ว่างที่ไม่มีทางออกคือทางตัน** — เจอจริงตอน dev MediHR F3:
 * โรงพยาบาลที่ยังไม่เคยตั้งนโยบายเวลาทำงานเปิด dropdown แล้วเจอช่องว่าง
 * แล้วไปต่อไม่ได้ ทั้งที่ทางแก้คือไปสร้างที่หน้าตั้งค่า
 *
 * ```tsx
 * <Select
 *   options={[]}
 *   emptyText="ยังไม่มีนโยบายเวลาทำงาน"
 *   emptyAction={{ label: "ไปตั้งค่า", onClick: () => router.push("/work-time") }}
 * />
 * ```
 */
export const EmptyWithAction: Story = {
  render: () => {
    const [log, setLog] = useState<string[]>([]);
    const [items, setItems] = useState<{ value: string; label: string }[]>([]);
    return (
      <div className="flex w-80 flex-col gap-4">
        <Select
          label="หน่วยงาน"
          options={items}
          emptyText="ยังไม่มีหน่วยงานในโรงพยาบาลนี้"
          emptyAction={{
            label: "เพิ่มหน่วยงาน",
            onClick: () => {
              setLog((l) => [`กดเพิ่มหน่วยงาน (${l.length + 1})`, ...l]);
              setItems((x) => [
                ...x,
                { value: `u${x.length + 1}`, label: `หน่วยงานที่ ${x.length + 1}` },
              ]);
            },
          }}
        />
        <div
          data-testid="empty-action-log"
          className="rounded-md border border-divider-gray bg-bg-subtle p-3 text-caption text-text-tertiary"
        >
          <p className="mb-1 font-medium text-text-secondary">
            กดไปแล้ว {log.length} ครั้ง · ตัวเลือกตอนนี้ {items.length}
          </p>
          {log.slice(0, 3).map((l, i) => (
            <p key={i}>{l}</p>
          ))}
        </div>
      </div>
    );
  },
};

/** ไม่มีทางออกให้ — มีแต่ข้อความ (ใช้เมื่อผู้ใช้คนนี้ไม่มีสิทธิ์สร้างเอง) */
export const EmptyTextOnly: Story = {
  render: () => (
    <div className="w-80">
      <Select
        label="หน่วยงาน"
        options={[]}
        emptyText="ไม่มีหน่วยงานที่คุณดูแลอยู่"
      />
    </div>
  ),
};
