import type { Meta, StoryObj } from "@storybook/react-vite";
import { StrictMode, useState } from "react";

import { Dialog, DialogContent } from "../overlay/Dialog";
import { EntityAutocomplete } from "./EntityAutocomplete";

/**
 * ⚠️ **story ชั่วคราวเพื่อวัดของจริง** — ตอบคำถามเดียว: ช่องค้นหาที่อยู่ **ในโมดัล** พิมพ์ได้ไหม
 * (jsdom ตอบไม่ได้ · §1 ของ repo นี้บังคับให้วัดในเบราว์เซอร์)
 */
type Person = { id: string; name: string };
const directory: Person[] = [
  { id: "1", name: "Alicia Torres" },
  { id: "2", name: "Ben Whitfield" },
];

const meta = {
  title: "Form/EntityAutocomplete in Dialog",
  component: EntityAutocomplete,
  args: {
    label: "ทีม",
    options: [],
    onSearch: () => {},
    getOptionValue: () => "",
    getOptionLabel: () => "",
  },
} satisfies Meta<typeof EntityAutocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InDialog: Story = {
  render: () => {
    const Harness = () => {
      const [term, setTerm] = useState("");
      return (
        <Dialog open>
          <DialogContent>
            <EntityAutocomplete<Person>
              label="ค้นหาผู้ใช้ในระบบ"
              searchPlaceholder="พิมพ์ชื่อหรืออีเมล..."
              options={directory.filter((p) =>
                p.name.toLowerCase().includes(term.toLowerCase()),
              )}
              onSearch={setTerm}
              onChange={() => {}}
              getOptionValue={(p) => p.id}
              getOptionLabel={(p) => p.name}
            />
            <p data-testid="term">term: {term}</p>
          </DialogContent>
        </Dialog>
      );
    };
    return (
      <StrictMode>
        <Harness />
      </StrictMode>
    );
  },
};

/**
 * ⚠️ **repro ของ `Maximum update depth exceeded`** — ทรงที่ผู้ใช้เจอ: **ปิดโมดัลขณะที่แผงยังเปิดอยู่**
 * ⇒ subtree ทั้งก้อนถูกลบพร้อมกัน (stack จริงเป็น `recursivelyTraverseDeletionEffects` หลายชั้น)
 * ⇒ cleanup ของ `PopperContent.useLayoutEffect` ใน popper **1.3.x** เรียก `setPlacementState(void 0)`
 * ระหว่างที่ fiber กำลังถูกลบ ⇒ วนจน React ตัด
 */
export const CloseDialogWhilePanelOpen: Story = {
  render: () => {
    const Harness = () => {
      const [open, setOpen] = useState(true);
      return (
        /* 🔴 **StrictMode สำคัญ** — Next dev เปิดไว้เป็นค่าเริ่มต้น ⇒ effect ถูกเรียกสองรอบ
           (mount → unmount → mount) ซึ่งเป็นตัวขยายบั๊กชนิด `setState` ใน cleanup ให้กลายเป็นวงวน
           ⇒ Storybook ที่ไม่มี StrictMode จำลองอาการที่ผู้ใช้เจอไม่ได้ */
        <div className="p-6">
          <button type="button" data-testid="reopen" onClick={() => setOpen(true)}>
            เปิดโมดัลใหม่
          </button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <EntityAutocomplete<Person>
                label="ค้นหาผู้ใช้ในระบบ"
                searchPlaceholder="พิมพ์ชื่อหรืออีเมล..."
                options={directory}
                onSearch={() => {}}
                onChange={() => {}}
                getOptionValue={(p) => p.id}
                getOptionLabel={(p) => p.name}
              />
              <button type="button" data-testid="close-dialog" onClick={() => setOpen(false)}>
                ปิดโมดัล
              </button>
            </DialogContent>
          </Dialog>
        </div>
      );
    };
    return (
      <StrictMode>
        <Harness />
      </StrictMode>
    );
  },
};
