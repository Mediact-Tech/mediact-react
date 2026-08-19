import type { Meta, StoryObj } from "@storybook/react-vite";
import { StrictMode, useState } from "react";

import { Dialog, DialogContent } from "../overlay/Dialog";
import { SearchSelect } from "./SearchSelect";

type Person = { id: string; name: string; email: string };

const directory: Person[] = [
  { id: "1", name: "Alicia Torres", email: "alicia@hospital.th" },
  { id: "2", name: "Ben Whitfield", email: "ben@hospital.th" },
  { id: "3", name: "Carmen Diaz", email: "carmen@hospital.th" },
];

const meta = {
  title: "Form/SearchSelect",
  component: SearchSelect,
  args: {
    label: "ทีม",
    options: [],
    value: null,
    onChange: () => {},
    onSearch: () => {},
    getOptionValue: () => "",
    getOptionLabel: () => "",
  },
} satisfies Meta<typeof SearchSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const Field = ({ label }: { label: string }) => {
  const [value, setValue] = useState<Person | null>(null);
  const [term, setTerm] = useState("");
  const options = term
    ? directory.filter((p) => (p.name + p.email).toLowerCase().includes(term.toLowerCase()))
    : directory;
  return (
    <SearchSelect<Person>
      label={label}
      placeholder="พิมพ์ชื่อหรืออีเมล..."
      options={options}
      value={value}
      onChange={setValue}
      onSearch={setTerm}
      getOptionValue={(p) => p.id}
      getOptionLabel={(p) => p.name}
      getOptionDescription={(p) => p.email}
      emptyText="ไม่พบข้อมูล"
      hintText="พิมพ์อย่างน้อย 2 ตัวอักษรเพื่อค้นหา"
    />
  );
};

/** ทรงพื้นฐาน — วัดว่าโฟกัสอยู่ในช่องและพิมพ์ติด */
export const Basic: Story = { render: () => <div className="w-80 p-6"><Field label="ค้นหาผู้ใช้" /></div> };

/**
 * 🔴 **เคสที่ `EntityAutocomplete` พัง** — ช่องอยู่ในโมดัล
 * ของเดิม: `Dialog` ดึงโฟกัสกลับจากแผงที่ portal ออกไป ⇒ พิมพ์ไม่ติด
 */
export const InDialog: Story = {
  render: () => (
    <StrictMode>
      <Dialog open>
        <DialogContent>
          <div className="w-full p-2">
            <Field label="ค้นหาผู้ใช้ในระบบ" />
          </div>
        </DialogContent>
      </Dialog>
    </StrictMode>
  ),
};

/**
 * 🔴 **เคสที่ทำให้ `Maximum update depth` โผล่** — สองช่องข้างกัน เปิดแผงหนึ่งแล้วคลิกอีกช่อง
 * ของเดิมวนเพราะ popper/floating-ui ยิง `setState` ตอน unmount · ตัวนี้ไม่มีสองชั้นนั้นเลย
 */
export const TwoFieldsSideBySide: Story = {
  render: () => (
    <StrictMode>
      <div className="flex gap-4 p-6">
        <div className="w-72"><Field label="แผนก" /></div>
        <div className="w-72"><Field label="หน่วยงาน" /></div>
      </div>
    </StrictMode>
  ),
};
