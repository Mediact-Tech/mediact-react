import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Dialog, DialogContent } from "../overlay/Dialog";
import { TimePicker } from "./TimePicker";

/**
 * ⚠️ **story เพื่อวัดของจริง** — ตอบคำถามเดียว: แผงเลือกเวลาที่อยู่ **ในโมดัล** *เลื่อนด้วยล้อเมาส์*
 * ได้ไหม (jsdom ตอบไม่ได้ · §1 ของ repo นี้บังคับให้วัดในเบราว์เซอร์)
 *
 * 🔴 `Dialog` โหมด modal ใช้ `react-remove-scroll` ซึ่งผูก `wheel` ที่ `document` แล้ว
 *    `preventDefault()` ทุก event ที่เกิดนอกกล่องที่มันล็อกไว้ · `PopoverContent` portal ออกไป
 *    อยู่ใต้ `<body>` **นอก** `DialogContent` ⇒ ตกอยู่ในกลุ่ม "นอกกล่อง"
 *
 * **อาการที่รายงานมาจากของจริง (mediact-web-backoffice 2026-08-26):** คลิกเลือกได้ · ลากแถบเลื่อนได้
 * · **แต่หมุนล้อไม่ได้** ⇒ ตัวเลือกที่อยู่นอกกรอบเข้าถึงยาก
 */
const meta = {
  title: "Form/TimePicker in Dialog",
  component: TimePicker,
  args: { label: "เวลา" },
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InDialog: Story = {
  render: () => {
    const Harness = () => {
      const [value, setValue] = useState("");
      return (
        <Dialog open>
          <DialogContent>
            <div className="flex flex-col gap-4 p-2">
              <TimePicker
                label="เข้างาน"
                value={value}
                onChange={setValue}
                reserveMessageSpace={false}
                containerClassName="w-40"
                /* คำไทยชุดเดียวกับที่ mediact-web-backoffice ส่ง — ใช้ตรวจว่า `นาที` ล้นกรอบไหม */
                labels={{
                  hour: "ชม.",
                  minute: "นาที",
                  hourAria: "ชั่วโมง",
                  minuteAria: "นาที",
                  openPicker: "เปิดตัวเลือกเวลา",
                  picker: "เลือกเวลา",
                }}
              />
              <p className="text-body-sm text-text-tertiary">value: {value || "—"}</p>
            </div>
          </DialogContent>
        </Dialog>
      );
    };
    return <Harness />;
  },
};

/** ตัวเทียบ — แผงเดียวกันแต่ **ไม่อยู่ในโมดัล** ⇒ ต้องเลื่อนได้เสมอ */
export const Standalone: Story = {
  render: () => {
    const Harness = () => {
      const [value, setValue] = useState("");
      return (
        <div className="p-8">
          <TimePicker label="เข้างาน" value={value} onChange={setValue} containerClassName="w-40" />
        </div>
      );
    };
    return <Harness />;
  },
};
