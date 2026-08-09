import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioGroup } from "./RadioGroup";

const meta = {
  title: "UI/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "ปุ่มตัวเลือกเดียว — เลือกได้ทีละหนึ่ง",
          "",
          "### สำรวจของจริงก่อน — สองแอปวาด 'ถูกเลือก' คนละภาพ",
          "",
          "| แอป | กล่อง | ตอนถูกเลือก |",
          "|---|---|---|",
          "| Portal · MediHR | 20px | **ขอบหนา 6px** `#0B77C6` + จุด**ขาว** 8px ตรงกลาง |",
          "| Medimatch | 20px | ขอบ 1px + จุดทึบ 11px |",
          "| Mediwork | MUI 20/24 | จุดทึบ |",
          "",
          "🔴 **แบบของ Portal/MediHR กลับ figure/ground** — สิ่งที่ 'ถูกเลือก'",
          "กลายเป็นรูขาว ส่วนขอบกลายเป็นเนื้อ และเทคนิค `border-[6px]` พังทันที",
          "เมื่อเปลี่ยนขนาด (6px บนกล่อง 16px เหลือรูแค่ 4px)",
          "⇒ ที่นี่ใช้แบบ **ขอบบาง + จุดทึบ** ตาม Medimatch ซึ่งตรงกับที่ทุกระบบใช้กัน",
          "",
          "📐 ขนาด 20px ตรงกันทั้งสามแอปอยู่แล้ว — ไม่ได้เปลี่ยน",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  { value: "ft", label: "ประจำ", description: "ทำงานเต็มเวลา" },
  { value: "pt", label: "พาร์ทไทม์", description: "ทำงานเป็นเวร" },
  { value: "temp", label: "จ้างชั่วคราว", description: "ยังไม่เปิดใช้งาน", disabled: true },
];

export const Default: Story = {
  args: {
    label: "ประเภทการจ้าง",
    options,
    defaultValue: "ft",
  },
};

export const Horizontal: Story = {
  args: {
    label: "ขนาด",
    orientation: "horizontal",
    options: [
      { value: "s", label: "เล็ก" },
      { value: "m", label: "กลาง" },
      { value: "l", label: "ใหญ่" },
    ],
    defaultValue: "m",
  },
};

/** สองขนาด — เท่ากับ `Checkbox` ทุกประการโดยตั้งใจ
 *
 * ทั้งคู่แชร์ `toggle-parts.ts` ตัวเดียวกัน ⇒ ขนาดจะเพี้ยนกันไม่ได้อีก
 * (ก่อนหน้านี้ DS มี checkbox 20px แต่ radio 16px — **กลับกันกับของจริง**)
 */
export const Sizes: Story = {
  args: { label: "—" },
  render: () => (
    <div className="flex flex-col gap-6">
      {(["md", "sm"] as const).map((size) => (
        <RadioGroup
          key={size}
          size={size}
          label={`size = ${size}`}
          defaultValue="ft"
          orientation="horizontal"
          options={options.slice(0, 2)}
        />
      ))}
    </div>
  ),
};

export const WithError: Story = {
  args: {
    label: "ประเภทการจ้าง",
    required: true,
    options,
    error: "กรุณาเลือกประเภทการจ้าง",
  },
};

/** โครงร่างตอนยังไม่มีข้อมูล
 *
 * จำนวนแถวมาจาก `options.length` ถ้าผู้เรียกรู้ตัวเลือกล่วงหน้า ⇒ ความสูง
 * ตอนโหลดเท่ากับตอนมีข้อมูลพอดี ไม่กระโดด ถ้ายังไม่รู้จะใช้ 3 แถว
 */
export const Loading: Story = {
  args: { label: "—" },
  render: () => (
    <div className="flex flex-col gap-8">
      <RadioGroup isLoading label="รู้ตัวเลือกล่วงหน้า" options={options} />
      <RadioGroup isLoading label="ยังไม่รู้ตัวเลือก" />
    </div>
  ),
};
