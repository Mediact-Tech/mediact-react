import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { ComboBox } from "./ComboBox";

/**
 * ⚠️ **story สำหรับวัดบั๊ก `Maximum update depth exceeded`** — เหตุการณ์ที่กระตุ้นคือ
 * **เปิดแผงของช่องหนึ่งไว้ แล้วคลิกช่องที่สอง**: แผงแรก unmount และแผงที่สอง mount ในคอมมิตเดียวกัน
 * ⇒ `PopperContent.useLayoutEffect` cleanup ของ `@radix-ui/react-popper` เรียก
 * `setPlacementState(void 0)` ระหว่างที่ fiber กำลังถูกลบ ⇒ วนจน React ตัด
 *
 * 📊 effect นี้ **ไม่มีใน popper 1.2.8** และ **มีตั้งแต่ 1.3.0 ถึง 1.3.7**
 */
const options = [
  { value: "1", label: "แผนกศัลยกรรม" },
  { value: "2", label: "แผนกอายุรกรรม" },
];

const meta = {
  title: "Form/ComboBox loop repro",
  component: ComboBox,
  args: { label: "แผนก", options },
} satisfies Meta<typeof ComboBox>;

export default meta;
type Story = StoryObj<typeof meta>;

/** สองช่อง typeahead ข้างกัน — ทรงเดียวกับแถบตัวกรองของ Mediwork ที่ผู้ใช้เจอบั๊ก */
export const TwoTypeaheadFields: Story = {
  render: () => {
    const Harness = () => {
      const [a, setA] = useState<string | null>(null);
      const [b, setB] = useState<string | null>(null);
      return (
        <div className="flex gap-4 p-6">
          <ComboBox typeahead label="แผนก" options={options} value={a} onChange={setA} />
          <ComboBox typeahead label="หน่วยงาน" options={options} value={b} onChange={setB} />
        </div>
      );
    };
    return <Harness />;
  },
};
