import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { NumberStepper } from "./NumberStepper";

const meta = {
  title: "Form/NumberStepper",
  component: NumberStepper,
  tags: ["autodocs"],
  argTypes: {
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    fullWidth: { control: "boolean" },
  },
  args: {
    min: 0,
    max: 99,
    step: 1,
    precision: 0,
    labels: { decrease: "ลดค่า", increase: "เพิ่มค่า" },
    /* ค่าเริ่มต้นของ args เท่านั้น — ทุก story render ผ่าน `Controlled` ซึ่งถือ state จริง
       (`value`/`onChange` เป็น required prop จึงต้องมีที่นี่ ไม่งั้น args ของ story ไม่ผ่าน type) */
    value: "8",
    onChange: () => {},
  },
} satisfies Meta<typeof NumberStepper>;

export default meta;
type Story = StoryObj<typeof meta>;

/** state อยู่ที่ผู้เรียกเสมอ — component นี้ไม่ถือค่าเอง */
const Controlled = (args: React.ComponentProps<typeof NumberStepper>) => {
  const [value, setValue] = React.useState(args.value ?? "8");
  return <NumberStepper {...args} value={value} onChange={setValue} />;
};

export const Default: Story = {
  args: { value: "8" },
  render: (args) => <Controlled {...args} />,
};

/** ค่าทศนิยม — `precision` มีไว้กันไม่ให้ 2.4 + 0.1 กลายเป็น 2.5000000004 */
export const Decimal: Story = {
  args: { value: "2.4", step: 0.1, precision: 1, min: 0, max: 10 },
  render: (args) => <Controlled {...args} />,
};

export const Invalid: Story = {
  args: { value: "120", invalid: true },
  render: (args) => <Controlled {...args} />,
};

export const Disabled: Story = {
  args: { value: "8", disabled: true },
  render: (args) => <Controlled {...args} />,
};

/** เต็มความกว้างของกล่องที่ห่ออยู่ — ปุ่มคงขนาด ช่องตัวเลขกินที่ที่เหลือ */
export const FullWidth: Story = {
  args: { value: "8", fullWidth: true },
  render: (args) => (
    <div className="w-80 rounded-lg border border-border-default p-4">
      <Controlled {...args} />
    </div>
  ),
};

/** ห้าช่องเรียงกันในคอลัมน์แคบ — เคสที่ `w-10` ถูกเลือกมาเพื่อรองรับ */
export const InNarrowColumns: Story = {
  args: { value: "4.5" },
  render: (args) => (
    <div className="grid w-[520px] grid-cols-5 gap-3">
      {["4.5", "3", "2.5", "8", "12"].map((initial) => (
        <Controlled key={initial} {...args} value={initial} />
      ))}
    </div>
  ),
};
