import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Checkbox } from "./Checkbox";
import { CheckboxGroup } from "./CheckboxGroup";

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "ช่องติ๊ก — เลือกได้หลายอัน หรือเปิด/ปิดค่าเดียว",
          "",
          "### สำรวจของจริงก่อน — สามแอปเขียนไฟล์เดียวกันคนละแบบ",
          "",
          "| แอป | กล่อง | มุม | ขอบ | สีตอนติ๊ก |",
          "|---|---|---|---|---|",
          "| Portal | 16px | 2px | 1px | `#05A5D8` ฝังตาย |",
          "| MediHR | **ไฟล์เดียวกับ Portal ทุกไบต์** | 2px | 1px | `#05A5D8` |",
          "| Medimatch | 16px | 2px | **2px** | `#0b77c6` |",
          "| Mediwork | MUI 20/24 | — | — | `theme.primary` |",
          "",
          "🔴 **วงแหวนโฟกัสของทั้งสามแอปเป็นสีแดง** (`ring-cherry-red-600/50` = `#e02c2c`)",
          "— สีเดียวกับข้อความผิดพลาด กด Tab มาถึงช่องติ๊กธรรมดาแล้วขึ้นวงแดง",
          "ที่นี่ใช้ `ring-brand/40`",
          "",
          "🔴 **สีตอนติ๊กของทุกแอปฝังตายและไม่ตรงกับแบรนด์ตัวเองสักแอป**",
          "⇒ ที่นี่ใช้ `bg-brand` ตัวเดียว สลับธีมที่แถบบนแล้วดูได้",
          "",
          "🔴 **`indeterminate` ต้องส่งผ่าน `checked=\"indeterminate\"`**",
          "ไม่ใช่ prop แยก — ดูสตอรี่ *เลือกบางส่วน* ว่าทำไม",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "ยอมรับเงื่อนไขการใช้งาน" },
};

export const WithDescription: Story = {
  args: {
    label: "รับข่าวสารทางอีเมล",
    description: "ส่งเดือนละสองครั้ง ยกเลิกได้ทุกเมื่อ",
  },
};

/** สองขนาด — `md` 20px คือค่าเริ่มต้น · `sm` 16px สำหรับแถวตารางที่แน่น
 *
 * 📐 `md` = 20px เพราะ radio ของทั้งสามแอปเป็น 20px ตรงกันหมด ส่วน checkbox
 * เป็น 16px ⇒ ในฟอร์มเดียวกันสองตัวนี้ขนาดไม่เท่ากันมาตลอดโดยไม่มีเหตุผล
 * ที่นี่บังคับให้เท่ากัน แล้วเปิด `sm` ไว้ให้จอที่เคยเป็น 16px
 *
 * ⚠️ ความสูงบรรทัดแรกของป้ายกำกับคือ 20px พอดี ⇒ `md` ไม่ต้องเลื่อน
 * ส่วน `sm` ถูกดันลง 2px ให้อยู่กลางบรรทัด
 */
export const Sizes: Story = {
  args: { label: "—" },
  render: () => (
    <div className="flex flex-col gap-4">
      {(["md", "sm"] as const).map((size) => (
        <Checkbox
          key={size}
          size={size}
          defaultChecked
          label={`size = ${size}`}
          description="ขอบบนของกล่องต้องตรงกับขอบบนของบรรทัดแรก"
        />
      ))}
    </div>
  ),
};

/** **เลือกบางส่วน** — ต้องส่ง `checked="indeterminate"` เท่านั้น
 *
 * 🔴 ของจริงทั้งสามแอปทำเป็น prop แยก (`indeterminate={...}`) โดยที่ `checked`
 * ยังเป็น `false` — พิสูจน์แล้วว่า Radix จะได้ `data-state="unchecked"` ·
 * `aria-checked="false"` และ **ไม่ render indicator เลย**
 * ⇒ หัวตาราง "เลือกทั้งหน้า" ตอนเลือกบางแถวจึงว่างเปล่า และโปรแกรมอ่านหน้าจอ
 * บอกว่า "ยังไม่ได้เลือก" ทั้งที่เลือกไปแล้วครึ่งหน้า
 */
export const Indeterminate: Story = {
  args: { label: "—" },
  render: function Render() {
    const items: string[] = ["พยาบาลเวรเช้า", "พยาบาลเวรบ่าย", "พยาบาลเวรดึก"];
    const [picked, setPicked] = useState<string[]>(["พยาบาลเวรเช้า"]);
    const all = picked.length === items.length;
    const some = picked.length > 0 && !all;
    return (
      <div className="flex flex-col gap-3">
        <Checkbox
          label="เลือกทั้งหมด"
          checked={all ? true : some ? "indeterminate" : false}
          onCheckedChange={(v) => setPicked(v === true ? items : [])}
        />
        <div className="ml-6 flex flex-col gap-2">
          {items.map((it) => (
            <Checkbox
              key={it}
              label={it}
              checked={picked.includes(it)}
              onCheckedChange={(v) =>
                setPicked((prev) =>
                  v === true ? [...prev, it] : prev.filter((x) => x !== it),
                )
              }
            />
          ))}
        </div>
      </div>
    );
  },
};

export const WithError: Story = {
  args: {
    label: "ข้าพเจ้ายอมรับเงื่อนไข",
    error: "ต้องยอมรับเงื่อนไขก่อนดำเนินการต่อ",
  },
};

export const Disabled: Story = {
  args: { label: "ตั้งซ้ำทุกปี", disabled: true, defaultChecked: true },
};

/** โครงร่างตอนยังไม่มีข้อมูล — ครอบทั้งแถว ไม่ใช่แค่กล่อง
 *
 * เนื้อหาจริงยังอยู่ใน DOM แบบ `invisible` ⇒ โครงร่างกว้างเท่าป้ายกำกับจริงเป๊ะ
 * ไม่ต้องเดา `w-*` และพอข้อมูลมาถึงเลย์เอาต์ไม่กระโดด
 */
export const Loading: Story = {
  args: { label: "—" },
  render: () => (
    <div className="flex flex-col gap-4">
      <Checkbox isLoading label="รับข่าวสารทางอีเมล" description="เดือนละสองครั้ง" />
      <Checkbox isLoading />
    </div>
  ),
};

/** กลุ่มช่องติ๊ก — คุมค่าเป็น array เดียว */
export const Group: Story = {
  args: { label: "—" },
  render: function Render() {
    const [value, setValue] = useState<string[]>(["email"]);
    return (
      <CheckboxGroup
        label="ช่องทางแจ้งเตือน"
        required
        hint="เลือกได้มากกว่าหนึ่งช่องทาง"
        value={value}
        onValueChange={setValue}
        options={[
          { value: "email", label: "อีเมล" },
          { value: "sms", label: "SMS", description: "มีค่าบริการตามผู้ให้บริการ" },
          { value: "push", label: "แจ้งเตือนในแอป" },
          { value: "line", label: "LINE", disabled: true },
        ]}
      />
    );
  },
};
