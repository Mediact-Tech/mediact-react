import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./Avatar";

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  tags: ["autodocs"],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Image: Story = {
  args: {
    src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'><rect width='80' height='80' fill='%230395d8'/><circle cx='40' cy='31' r='14' fill='%23fff'/><path d='M11 80a29 29 0 0 1 58 0Z' fill='%23fff'/></svg>",
    name: "Jane Cooper",
  },
};

export const Initials: Story = {
  args: { name: "Jane Cooper" },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => (
        <Avatar key={s} size={s} name="Jane Cooper" />
      ))}
    </div>
  ),
};

/** ชุด 6 โทนที่ `colorKey` วนใช้ — ไล่คีย์ 0–5 เพื่อให้เห็นครบทุกตัว */
export const Tones: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {Array.from({ length: 6 }, (_, i) => (
        <Avatar key={i} colorKey={i} fallback={`A${i + 1}`} />
      ))}
    </div>
  ),
};

/**
 * ของจริง: แถวในตาราง — คีย์คือ **id ของคน** ไม่ใช่ชื่อ
 *
 * สองแถวล่างชื่อเดียวกันแต่คนละ id ⇒ คนละสี · และแถวเดียวกันที่แก้ตัวสะกดชื่อ
 * จะยังได้สีเดิม ซึ่งเป็นเหตุผลทั้งหมดที่ prop นี้รับ id ไม่ใช่ `name`
 */
export const InAList: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {[
        { id: 157, name: "พว. สมหญิง ใจดี", no: "EMP-0157" },
        { id: 158, name: "นพ. วรวิทย์ ตันสกุล", no: "EMP-0158" },
        { id: 162, name: "สมชาย รักงาน", no: "EMP-0162" },
        { id: 401, name: "สมชาย รักงาน", no: "EMP-0401" },
      ].map((p) => (
        <div key={p.id} className="flex items-center gap-3">
          <Avatar size="sm" colorKey={p.id} name={p.name} />
          <div className="flex flex-col">
            <span className="text-body-md font-semibold">{p.name}</span>
            <span className="text-caption text-text-muted">{p.no}</span>
          </div>
        </div>
      ))}
    </div>
  ),
};
