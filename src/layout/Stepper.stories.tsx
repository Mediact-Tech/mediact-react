import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stepper } from "./Stepper";

const meta = {
  title: "Layout/Stepper",
  component: Stepper,
  tags: ["autodocs"],
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

const steps = [
  { label: "Account", description: "Create your account" },
  { label: "Profile", description: "Add your details" },
  { label: "Verify", description: "Confirm email" },
  { label: "Done" },
];

export const Horizontal: Story = {
  args: { steps, current: 1, orientation: "horizontal" },
};

export const Vertical: Story = {
  args: { steps, current: 2, orientation: "vertical" },
};

export const FirstStep: Story = {
  args: { steps, current: 0, orientation: "horizontal" },
};

export const Complete: Story = {
  args: { steps, current: 4, orientation: "horizontal" },
};

/**
 * เส้นเชื่อมความยาวคงที่ + จัดทั้งแถบไว้กลาง — รูปแบบที่โมดัลหลายขั้นตอนใช้
 * (MediHR "เพิ่มบุคลากร") การยืดเต็มความกว้างในกล่องแคบทำให้ป้ายลอยห่างจนอ่านเป็นกลุ่มเดียวไม่ได้
 */
export const FixedConnector: Story = {
  args: {
    steps: [{ label: "ข้อมูลส่วนตัว" }, { label: "การจ้างงาน" }, { label: "เงินเดือนและค่าล่วงเวลา" }],
    current: 1,
    orientation: "horizontal",
    connector: "fixed",
  },
};

/** ป้ายข้างวงกลม — รูปแบบเดิมก่อน 2026-11-03 · ต้องขอเองด้วย `labelPlacement="end"` */
export const LabelEnd: Story = {
  args: {
    steps: [{ label: "ข้อมูลเวร" }, { label: "เตียงและผู้ป่วย" }, { label: "สรุปยอดเวร" }],
    current: 1,
    orientation: "horizontal",
    connector: "fixed",
    labelPlacement: "end",
  },
};

/** โมดัล "เพิ่มยอดเวรใหม่" (Mediwork) — ค่าตั้งต้น ตัวเลขบน ป้ายล่าง */
export const CensusWizard: Story = {
  args: {
    steps: [{ label: "ข้อมูลเวร" }, { label: "เตียงและผู้ป่วย" }, { label: "สรุปยอดเวร" }],
    current: 1,
    orientation: "horizontal",
    connector: "fixed",
    onStepClick: (index: number) => console.log("go to step", index),
  },
};

/** กดย้อนได้เฉพาะขั้นที่ทำเสร็จแล้ว — ขั้นที่กำลังทำอยู่และขั้นข้างหน้ากดไม่ได้ */
export const Clickable: Story = {
  args: {
    steps,
    current: 2,
    orientation: "horizontal",
    connector: "fixed",
    onStepClick: (index: number) => console.log("go to step", index),
  },
};
