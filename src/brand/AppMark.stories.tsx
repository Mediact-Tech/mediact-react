import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppMark } from "./AppMark";
import { appMarkLabels, appMarks, type MediactAppKey } from "./app-marks";

const KEYS = Object.keys(appMarks) as MediactAppKey[];

const meta = {
  title: "Brand/App mark",
  component: AppMark,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "เครื่องหมายประจำผลิตภัณฑ์ทั้ง 6 ตัว — ชุดเดียวที่ทุกแอปในตระกูลใช้ร่วมกัน " +
          "แทนที่จะคัดลอกไฟล์ไปไว้ใน `public/` ของตัวเอง · โทนเลือกตาม**พื้นหลังที่วางทับ** " +
          "ไม่ใช่ตามธีมของแอปที่รันอยู่",
      },
    },
  },
  args: { app: "medihr" },
} satisfies Meta<typeof AppMark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { className: "size-12" },
};

/**
 * ทั้งชุดในกล่องขนาดเดียวกัน — **นี่คือจอที่ใช้ตรวจว่าหมึกเท่ากันจริงไหม**
 *
 * ความสูงของหมึกต้องดูเท่ากันทุกใบ ส่วนความกว้างต่างกันได้ตามทรงของโลโก้เอง
 * (Mediwork/Medimatch เป็นทรงนอน · MediOnCloud เป็นทรงตั้ง) — ถ้าใบไหนดูโตกว่าเพื่อน
 * แปลว่า `viewBox` ของไฟล์นั้นยังไม่ได้เติมขอบ ดูวิธีวัดที่หัวไฟล์ `app-marks.ts`
 */
export const AllApps: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      {KEYS.map((key) => (
        <div key={key} className="flex w-24 flex-col items-center gap-2">
          <span className="flex size-12 items-center justify-center rounded-xl border border-gray-100 bg-white">
            <AppMark app={key} className="size-8" />
          </span>
          <span className="text-caption text-text-body">{appMarkLabels[key]}</span>
        </div>
      ))}
    </div>
  ),
};

/** โทนขาวบนพื้นสีแบรนด์ — ทรงเดียวกับ `primary` เป๊ะ ต่างแค่สี */
export const WhiteOnBrand: Story = {
  render: () => (
    <div className="bg-brand flex flex-wrap gap-6 rounded-xl p-6">
      {KEYS.map((key) => (
        <div key={key} className="flex w-24 flex-col items-center gap-2">
          <AppMark app={key} tone="white" className="size-10" />
          <span className="text-caption text-white">{appMarkLabels[key]}</span>
        </div>
      ))}
    </div>
  ),
};
