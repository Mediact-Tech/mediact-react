import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Switch } from "./Switch";

const meta = {
  title: "UI/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "สวิตช์เปิด/ปิด — มีผลทันที ไม่ต้องกดบันทึก",
          "",
          "### สำรวจของจริงก่อน — **6 แบบที่ต่างกัน** ใน 4 แอป",
          "",
          "| # | ที่อยู่ | หน้าตา |",
          "|---|---|---|",
          "| 1 | Portal · MediHR `ui/Switch` | ราง 44×24 เขียวอ่อน `#85E0BA` · **ปุ่มเปลี่ยนเป็นเขียวเข้ม** `#0CB679` |",
          "| 2 | Portal `ProductAccessToggle` | ตัวเดิม แต่ทับสีรายผลิตภัณฑ์ (เขียว/น้ำเงิน) |",
          "| 3 | Medimatch `ui/Switch` | **ไม่ใช่สวิตช์** — เป็น segmented pill สองป้าย (= `PillSwitch` ของ DS) |",
          "| 4 | Medimatch `VisibilityToggle` | 62×22 · ราง `#B3E9D0` · ปุ่ม `#0BB767` |",
          "| 5 | MediHR `SubUnitActiveToggle` | 24px มีคำว่า ON/OFF **ขนาด 8px** อยู่ในราง · โทเคน `--color-switch-on: #10b981` |",
          "| 6 | Mediwork MUI `<Switch>` | `color=\"primary\"` 13 จอ · อีก 1 จอ hardcode `#1565C0` |",
          "",
          "🔴 **5 ใน 6 แบบใช้สีเขียว ไม่ใช่สีแบรนด์** — MediHR ถึงขั้นตั้งโทเคนชื่อ",
          "`--color-switch-on` ⇒ ที่นี่ใช้ `success-green-primary` ไม่ใช่ `brand`",
          "เพราะเปิด/ปิดคือ **สถานะ** ไม่ใช่แบรนด์",
          "",
          "🔴 **`Switch` ของ Medimatch กับของ Portal เป็นคนละ component ที่ชื่อชนกัน**",
          "ใครย้ายมาใช้ DS ต้องดูก่อนว่าจอนั้นใช้ตัวไหนอยู่ — ของ Medimatch ต้องไป `PillSwitch`",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "เปิดใช้งานหน่วยงาน", defaultChecked: true },
};

export const WithDescription: Story = {
  args: {
    label: "แจ้งเตือนเมื่อมีคำขอใหม่",
    description: "ส่งไปที่อีเมลที่ลงทะเบียนไว้",
    defaultChecked: true,
  },
};

/** ป้ายกำกับฝั่งซ้าย — ใช้ในแถวตั้งค่าที่สวิตช์ชิดขวา */
export const LabelLeft: Story = {
  args: {
    label: "เปิดใช้งาน",
    labelPosition: "left",
    defaultChecked: true,
    containerClassName: "w-80",
  },
  render: (args) => (
    <div className="w-80 rounded-lg border border-border-default p-4">
      <label className="flex items-center justify-between">
        <Switch {...args} />
      </label>
    </div>
  ),
};

/** **กำลังบันทึก** — คนละเรื่องกับโครงร่าง
 *
 * ของจริง Mediwork 13 จอในหน้าตั้งค่ากฎ กับ MediHR อีก 1 จอ ใช้ `disabled`
 * ทำหน้าที่นี้ ⇒ สวิตช์จางลงเฉย ๆ แยกไม่ออกว่า "ห้ามแตะ" หรือ "กำลังรอ"
 *
 * ที่นี่ `loading` หมุนอยู่ในปุ่มเลื่อน **คงสถานะเดิมไว้** จนกว่าเซิร์ฟเวอร์จะตอบ —
 * ถ้าพลิกสถานะทันทีแล้ว API พัง ผู้ใช้จะเห็นสวิตช์เด้งกลับเอง
 */
export const Loading: Story = {
  args: { label: "—" },
  render: function Render() {
    const [on, setOn] = useState(false);
    const [busy, setBusy] = useState(false);
    return (
      <div className="flex flex-col gap-4">
        <Switch
          label="กดแล้วรอ 1.2 วินาที"
          description="สถานะจะเปลี่ยนก็ต่อเมื่อ 'เซิร์ฟเวอร์' ตอบแล้ว"
          checked={on}
          loading={busy}
          loadingLabel="กำลังบันทึก"
          onCheckedChange={(v) => {
            setBusy(true);
            setTimeout(() => {
              setOn(v);
              setBusy(false);
            }, 1200);
          }}
        />
        <Switch label="loading + เปิดอยู่" checked loading loadingLabel="กำลังบันทึก" />
        <Switch label="disabled — ห้ามแตะ ไม่ใช่กำลังรอ" checked disabled />
      </div>
    );
  },
};

/** โครงร่างตอนยังไม่มีข้อมูล — ครอบทั้งแถวเหมือน `Checkbox` และ `RadioGroup` */
export const SkeletonState: Story = {
  name: "isLoading (โครงร่าง)",
  args: { label: "—" },
  render: () => (
    <div className="flex flex-col gap-4">
      <Switch isLoading label="แจ้งเตือนเมื่อมีคำขอใหม่" description="ส่งไปที่อีเมล" />
      <Switch isLoading />
    </div>
  ),
};

export const WithError: Story = {
  args: {
    label: "ยืนยันการเปิดใช้งาน",
    error: "เปิดใช้งานไม่สำเร็จ ลองใหม่อีกครั้ง",
  },
};

/** **มีข้อความในราง** — แบบที่ใช้ในการ์ดหน่วยงานของ MediHR
 *
 * ใช้เมื่อการ์ดไม่มีที่ให้เขียนป้ายกำกับข้างนอก รางกว้างตามคำ ปุ่มสลับข้างแทนการเลื่อน
 *
 * ต่างจากของจริง 2 จุด ทั้งคู่มาจากการวัด:
 *
 * | | MediHR วันนี้ | ที่นี่ |
 * |---|---|---|
 * | ตัวอักษร | **8px** | 12px (`text-caption`) |
 * | ความกว้างราง | `Active` 57.94 → `Inactive` 65.38 = **กระตุก 7.4px** | คงที่ |
 *
 * 🔴 ความกว้างคงที่ได้เพราะวางสองคำ**ซ้อนกันในช่อง grid เดียว** แล้วซ่อนอันที่ไม่ใช้
 * ⇒ รางกว้างเท่าคำที่ยาวกว่าเสมอ **โดยโครงสร้าง** ไม่ใช่การไปตั้ง `w-` ตายตัว
 *
 * ⚠️ คำในรางเป็น `aria-hidden` — สถานะจริงประกาศผ่าน `role="switch"` + `aria-checked`
 * ถ้าไม่มี `label` ข้างนอก **ต้องส่ง `aria-label` มาเสมอ**
 */
export const TrackLabels: Story = {
  args: { label: "—" },
  render: function Render() {
    const [a, setA] = useState(true);
    const [b, setB] = useState(false);
    return (
      <div className="flex w-96 flex-col gap-4">
        {[
          { title: "หอผู้ป่วยใน 1", on: a, set: setA },
          { title: "หอผู้ป่วยนอก", on: b, set: setB },
        ].map((row) => (
          <div
            key={row.title}
            className="rounded-lg border border-border-default p-3"
          >
            <p className="mb-2.5 text-body-sm font-semibold text-text-black">
              {row.title}
            </p>
            <div className="flex items-center justify-between border-t border-gray-50 pt-2.5">
              <span className="text-caption text-text-tertiary">หน่วยงานย่อย</span>
              <Switch
                aria-label={`สถานะของ ${row.title}`}
                checked={row.on}
                onCheckedChange={row.set}
                trackLabels={{ on: "เปิดใช้งาน", off: "ปิดใช้งาน" }}
              />
            </div>
          </div>
        ))}
        <div className="flex items-center gap-4">
          <Switch
            aria-label="อังกฤษ เปิด"
            defaultChecked
            trackLabels={{ on: "Active", off: "Inactive" }}
          />
          <Switch
            aria-label="อังกฤษ ปิด"
            trackLabels={{ on: "Active", off: "Inactive" }}
          />
          <Switch
            aria-label="กำลังบันทึก"
            defaultChecked
            loading
            loadingLabel="กำลังบันทึก"
            trackLabels={{ on: "เปิดใช้งาน", off: "ปิดใช้งาน" }}
          />
          <Switch
            aria-label="ปิดใช้งาน"
            disabled
            trackLabels={{ on: "เปิดใช้งาน", off: "ปิดใช้งาน" }}
          />
        </div>
        {/* วางคู่กันในแถวเดียว เพื่อให้เทียบความกว้างได้ตรง ๆ
         * ⚠️ ถ้าวางเป็นลูกของคอลัมน์ flex เฉย ๆ โครงร่างจะถูกยืดเต็มความกว้าง
         * (`align-items: stretch`) แล้วการวัดจะบอกว่า "ไม่ตรง" ทั้งที่ของจริงก็ยืดเหมือนกัน */}
        <div className="flex items-center gap-4">
          <Switch
            aria-label="ของจริง"
            trackLabels={{ on: "เปิดใช้งาน", off: "ปิดใช้งาน" }}
          />
          <Switch
            isLoading
            aria-label="โครงร่าง"
            trackLabels={{ on: "เปิดใช้งาน", off: "ปิดใช้งาน" }}
          />
        </div>
      </div>
    );
  },
};

/** สถานะทั้งหมดเรียงกัน — ใช้ตรวจด้วยการวัด ไม่ใช่ด้วยตา */
export const AllStates: Story = {
  args: { label: "—" },
  render: () => (
    <div className="flex flex-col gap-3">
      <Switch label="ปิด" />
      <Switch label="เปิด" defaultChecked />
      <Switch label="ปิด + ปิดใช้งาน" disabled />
      <Switch label="เปิด + ปิดใช้งาน" defaultChecked disabled />
      <Switch label="เปิด + กำลังบันทึก" defaultChecked loading loadingLabel="กำลังบันทึก" />
    </div>
  ),
};
