import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { useState } from "react";
import { ComboBox } from "./ComboBox";

const meta = {
  title: "Form/ComboBox",
  component: ComboBox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Floating-label searchable single-select. Same label behavior as Input/Select — sit-in until value or popover open.",
      },
    },
  },
} satisfies Meta<typeof ComboBox>;

export default meta;
type Story = StoryObj<typeof meta>;

const countries = [
  { value: "th", label: "Thailand", description: "Bangkok" },
  { value: "sg", label: "Singapore", description: "Singapore" },
  { value: "my", label: "Malaysia", description: "Kuala Lumpur" },
  { value: "id", label: "Indonesia", description: "Jakarta" },
  { value: "vn", label: "Vietnam", description: "Hanoi" },
  { value: "ph", label: "Philippines", description: "Manila" },
];

export const Default: Story = {
  args: { label: "Country", options: countries },
};

export const WithPlaceholder: Story = {
  args: {
    label: "Country",
    options: countries,
    placeholder: "Type to search...",
  },
};

/** ควบคุมค่าเอง — โหมดเลือกอันเดียวคืน `null` ตอนไม่มีค่า (ตรงกับ `EntityAutocomplete`) */
export const Controlled: Story = {
  render: () => {
    const [v, setV] = useState<string | null>("th");
    return (
      <div className="flex w-80 flex-col gap-1">
        <ComboBox label="Country" options={countries} value={v} onChange={setV} />
        <p className="text-caption text-text-tertiary">
          ค่าปัจจุบัน: <code>{v === null ? "null" : v}</code>
        </p>
      </div>
    );
  },
};

export const WithError: Story = {
  args: {
    label: "Country",
    options: countries,
    required: true,
    error: "Country is required",
  },
};

export const States: Story = {
  args: { options: countries },
  render: () => (
    <div className="flex flex-col gap-4 w-72">
      <ComboBox label="Empty (rest)" options={countries} />
      <ComboBox label="With value" options={countries} defaultValue="sg" />
      <ComboBox label="Disabled" options={countries} disabled defaultValue="th" />
      <ComboBox label="Required" options={countries} required />
      <ComboBox label="With error" options={countries} error="Required" />
    </div>
  ),
};

export const Loading: Story = {
  args: {
    label: "Country",
    options: countries,
    onSearch: () => {},
    optionsLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Open the field to see the loading row — pair with `onSearch` while an async fetch is in flight.",
      },
    },
  },
};

/* ── โหมดเลือกหลายอัน (เดิมคือ component แยกชื่อ MultiAutocomplete) ── */


const skills = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "SolidJS" },
  { value: "next", label: "Next.js" },
  { value: "nuxt", label: "Nuxt" },
  { value: "remix", label: "Remix" },
];

export const MultiDefault: Story = {
  args: { multiple: true, label: "Skills", options: skills },
};

export const MultiWithPlaceholder: Story = {
  args: { label: "Skills", options: skills, placeholder: "Pick a few..." },
};

export const MultiControlled: Story = {
  render: () => {
    const [v, setV] = useState<string[]>(["react", "next"]);
    return <ComboBox multiple label="Skills" options={skills} value={v} onChange={setV} />;
  },
};

export const MultiMaxItems: Story = {
  args: {
    multiple: true,
    label: "Top 3 skills",
    options: skills,
    maxItems: 3,
    hint: "Select up to 3",
  },
};

export const MultiWithError: Story = {
  args: {
    multiple: true,
    label: "Skills",
    options: skills,
    required: true,
    error: "At least one skill is required",
  },
};

export const MultiStates: Story = {
  args: { options: skills },
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <ComboBox multiple label="Empty (rest)" options={skills} />
      <ComboBox
        multiple
        label="With value"
        options={skills}
        defaultValue={["react", "next"]}
      />
      <ComboBox
        multiple
        label="Disabled"
        options={skills}
        disabled
        defaultValue={["vue"]}
      />
      <ComboBox multiple label="Required" options={skills} required />
      <ComboBox multiple label="With error" options={skills} error="Required" />
    </div>
  ),
};

const groupedFrameworks = [
  {
    heading: "Frontend",
    options: [
      { value: "react", label: "React" },
      { value: "vue", label: "Vue" },
      { value: "svelte", label: "Svelte" },
    ],
  },
  {
    heading: "Meta-frameworks",
    options: [
      { value: "next", label: "Next.js" },
      { value: "nuxt", label: "Nuxt" },
      { value: "remix", label: "Remix" },
    ],
  },
];

export const MultiGrouped: Story = {
  args: {
    multiple: true,
    label: "Stack",
    options: [],
    groups: groupedFrameworks,
    hint: "Options grouped under a heading via `groups` — overrides `options`",
  },
};

export const MultiLoading: Story = {
  args: {
    multiple: true,
    label: "Skills",
    options: skills,
    onSearch: () => {},
    optionsLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Open the field to see the loading row — pair with `onSearch` while an async fetch is in flight.",
      },
    },
  },
};

const skillsWithLocked = skills.map((s) =>
  s.value === "react" ? { ...s, locked: true } : s,
);

export const MultiLockedSelection: Story = {
  args: {
    multiple: true,
    label: "Skills",
    options: skillsWithLocked,
    defaultValue: ["react", "vue"],
    hint: "React is `locked: true` — its chip has no × and can't be removed",
  },
};

export const MultiCustomRender: Story = {
  args: {
    multiple: true,
    label: "Skills",
    options: skills,
    defaultValue: ["react"],
    renderOption: (opt, { selected }) => (
      <span className="flex w-full items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="flex size-5 items-center justify-center rounded-full bg-brand-subtle text-[10px] font-semibold text-brand">
            {opt.label.slice(0, 1)}
          </span>
          {opt.label}
        </span>
        {selected && <span className="text-caption text-brand">Selected</span>}
      </span>
    ),
    renderChip: (opt) => (
      <span className="inline-flex items-center gap-1 rounded-full bg-brand px-2.5 py-1 text-caption font-medium text-brand-foreground">
        {opt.label}
      </span>
    ),
  },
};

/** `groupBy` — จัดกลุ่มจากรายการ**แบน**
 *
 * ต่างจาก `groups` ตรงที่มาของข้อมูล ไม่ใช่หน้าตาผลลัพธ์:
 *
 * | | ใช้เมื่อ |
 * |---|---|
 * | `groups` | หลังบ้านคืนข้อมูลเป็นกลุ่มมาให้แล้ว |
 * | `groupBy` | ได้รายการแบนมา แล้วอยากแบ่งตามฟิลด์บางตัวเอง |
 *
 * ส่งมาทั้งคู่ `groups` ชนะ — ของที่ระบุมาตรง ๆ ชนะของที่คำนวณเอาเสมอ
 */
const frameworksFlat = [
  { value: "react", label: "React", kind: "Library" },
  { value: "vue", label: "Vue", kind: "Framework" },
  { value: "svelte", label: "Svelte", kind: "Compiler" },
  { value: "next", label: "Next.js", kind: "Framework" },
  { value: "solid", label: "SolidJS", kind: "Library" },
  { value: "remix", label: "Remix", kind: "Framework" },
];

const kindOf = (v: string) =>
  frameworksFlat.find((f) => f.value === v)?.kind ?? null;

export const MultiGroupedByFunction: Story = {
  args: {
    multiple: true,
    label: "Stack",
    options: frameworksFlat.map(({ value, label }) => ({ value, label })),
    groupBy: (opt) => kindOf(opt.value),
  },
};

/** รายการที่ `groupBy` คืน `null` จะอยู่**ก้อนแรกและไม่มีหัวข้อ**
 *
 * ตั้งใจให้อยู่บนสุด เพราะปกติคือรายการที่ตรงที่สุดหรือเพิ่งใช้ล่าสุด
 */
export const MultiGroupedWithUngrouped: Story = {
  args: {
    multiple: true,
    label: "Stack",
    options: [
      { value: "recent", label: "React (ใช้ล่าสุด)" },
      ...frameworksFlat.map(({ value, label }) => ({ value, label })),
    ],
    groupBy: (opt) => kindOf(opt.value),
  },
};

/** `locked` — ค่าตั้งต้นที่ถอดออกไม่ได้
 *
 * ปิดทางถอดออกครบ **3 ทาง**: กดที่ chip · กดซ้ำในลิสต์ · ปุ่มล้างทั้งหมด
 *
 * 🔴 และ**บอกให้เห็นว่าทำไม** — chip เปลี่ยนสี + มีไอคอนกุญแจ
 * ซ่อนแค่ปุ่ม × เฉย ๆ = ผู้ใช้เห็น chip ที่กดลบไม่ได้แล้วนึกว่าจอเสีย
 *
 * ⚠️ `locked` **ไม่ได้ทำให้ถูกเลือกให้เอง** — ต้องใส่ใน `defaultValue` ด้วย
 * (มันตอบว่า "ถอดออกได้ไหม" ไม่ใช่ "ต้องมีไหม")
 */
export const MultiLockedDefaults: Story = {
  args: {
    multiple: true,
    label: "หน่วยงานที่ดูแล",
    hint: "หน่วยงานประจำถูกล็อกไว้ ถอดออกไม่ได้",
    options: [
      { value: "icu", label: "หอผู้ป่วยหนัก (ประจำ)", locked: true },
      { value: "er", label: "ห้องฉุกเฉิน" },
      { value: "ward", label: "หอผู้ป่วยใน" },
      { value: "or", label: "ห้องผ่าตัด" },
    ],
    defaultValue: ["icu", "er"],
  },
};

/** วาดแถวเองแล้วยังรู้สถานะครบ
 *
 * `renderOption` ได้ `{ selected, locked, disabled }` — เดิมได้แค่ `selected`
 * ซึ่งพอมี `locked` แล้วแถวที่วาดเองจะแสดงไม่ได้เลยว่าตัวไหนล็อก
 */
export const MultiCustomRowWithState: Story = {
  args: {
    multiple: true,
    label: "หน่วยงานที่ดูแล",
    options: [
      { value: "icu", label: "หอผู้ป่วยหนัก", locked: true },
      { value: "er", label: "ห้องฉุกเฉิน" },
      { value: "or", label: "ห้องผ่าตัด", disabled: true },
    ],
    defaultValue: ["icu"],
    renderOption: (opt, { selected, locked, disabled }) => (
      <span className="flex w-full items-center justify-between gap-2">
        <span>{opt.label}</span>
        <span className="text-caption text-text-tertiary">
          {locked ? "🔒 ล็อกไว้" : disabled ? "เลือกไม่ได้" : selected ? "เลือกแล้ว" : ""}
        </span>
      </span>
    ),
    renderChip: (opt, { locked }) => (
      <span
        className={
          locked
            ? "inline-flex items-center gap-1 rounded-full bg-bg-skeleton px-2.5 py-1 text-caption text-text-body"
            : "inline-flex items-center gap-1 rounded-full bg-brand px-2.5 py-1 text-caption font-medium text-brand-foreground"
        }
      >
        {locked && "🔒"}
        {opt.label}
      </span>
    ),
  },
};
