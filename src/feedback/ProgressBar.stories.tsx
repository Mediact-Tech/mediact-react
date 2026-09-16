import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressBar } from "./ProgressBar";

const meta = {
  title: "Feedback/ProgressBar",
  component: ProgressBar,
  args: { value: 40, label: "โควตาที่ใช้ไป" },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** ทรงที่ Medimatch ใช้จริง — โควตาเครดิตในการ์ดแพ็กเกจ */
export const InPackageCard: Story = {
  render: () => (
    <div className="w-[320px] rounded-3xl border border-border-subtle bg-white p-6 shadow-sm">
      <div className="mb-2 flex justify-between text-body-md text-text-body">
        <span>ตำแหน่งจ้างงาน</span>
        <span>4/10</span>
      </div>
      <ProgressBar value={40} label="ตำแหน่งจ้างงานที่ใช้ไป" />
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="flex w-[320px] flex-col gap-4">
      {(["info", "success", "warning", "danger"] as const).map((tone) => (
        <div key={tone}>
          <p className="mb-1 text-caption text-text-tertiary">{tone}</p>
          <ProgressBar value={60} tone={tone} label={`${tone} 60%`} />
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex w-[320px] flex-col gap-4">
      <ProgressBar value={40} size="sm" label="sm" />
      <ProgressBar value={40} size="md" label="md" />
    </div>
  ),
};

/** ค่าที่หลุดช่วงต้องถูกหนีบ ไม่ใช่ล้นกรอบหรือหายไปทั้งแถบ */
export const ClampedValues: Story = {
  render: () => (
    <div className="flex w-[320px] flex-col gap-4">
      {[-20, 0, 55, 100, 140, Number.NaN].map((v, i) => (
        <div key={i}>
          <p className="mb-1 text-caption text-text-tertiary">value = {String(v)}</p>
          <ProgressBar value={v} label={`ตัวอย่าง ${String(v)}`} />
        </div>
      ))}
    </div>
  ),
};

export const Loading: Story = {
  args: { isLoading: true },
};
