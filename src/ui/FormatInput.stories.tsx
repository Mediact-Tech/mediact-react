import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { FormatInput } from "./FormatInput";

const meta = {
  title: "UI/FormatInput",
  component: FormatInput,
  tags: ["autodocs"],
  // `format` เป็น prop บังคับ — meta ต้องมีค่าเริ่มต้น ไม่งั้นทุก story ต้องส่ง args เอง
  args: { format: "thaiId" },
  parameters: {
    docs: {
      description: {
        component: [
          "ช่องกรอกที่จัดรูปแบบระหว่างพิมพ์ — เลขบัตรประชาชน เบอร์โทร จำนวนเงิน",
          "",
          "🔴 **`onValueChange` คืนค่าดิบเสมอ** ไม่ใช่สิ่งที่ตาเห็น — สิ่งที่ส่งขึ้นหลังบ้าน",
          "ต้องเป็น `1234567890123` ไม่ใช่ `1-2345-67890-12-3` · มีสองทางออกเมื่อไหร่จะมีคนส่งผิด",
          "",
          "ใช้ `react-number-format` ที่อยู่ในสแตกอยู่แล้ว (Medimatch + Mediwork ใช้กับช่องค่าจ้าง)",
          "เหตุที่ไม่เขียนเอง: **การคืนตำแหน่งเคอร์เซอร์หลังแทรกอักขระคั่นกลางสตริง**",
          "เป็นจุดที่ input แบบ mask พังบ่อยที่สุด และ lib นี้แก้ไว้แล้ว",
          "",
          "ฐานเป็น `Input` ตัวเดียวกัน ⇒ ป้ายลอย ไอคอน error ขนาด โครงร่างตอนโหลด เหมือนกันเป๊ะ",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof FormatInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/** แสดงค่าดิบข้าง ๆ ตลอด — สิ่งที่ส่งขึ้นหลังบ้านต้องเป็นค่าดิบ ไม่ใช่สิ่งที่ตาเห็น */
const Demo = ({
  label,
  format,
  hint,
  ...rest
}: React.ComponentProps<typeof FormatInput>) => {
  const [raw, setRaw] = useState("");
  return (
    <div className="flex w-80 flex-col gap-1">
      <FormatInput
        label={label}
        format={format}
        value={raw}
        onValueChange={setRaw}
        hint={hint}
        {...rest}
      />
      <p className="text-caption text-text-tertiary" data-testid="raw">
        ค่าดิบที่จะส่งขึ้นหลังบ้าน: <code>{raw || "(ว่าง)"}</code>
      </p>
    </div>
  );
};

/** เลขบัตรประชาชนไทย 13 หลัก — `1-2345-67890-12-3` */
export const ThaiId: Story = {
  render: () => <Demo label="เลขบัตรประชาชน" format="thaiId" />,
};

/** เบอร์มือถือ 10 หลัก — `081-234-5678` */
export const Phone: Story = {
  render: () => <Demo label="เบอร์โทรศัพท์" format="phone" />,
};

/** เลขบัญชีธนาคาร 10 หลัก — `123-4-56789-0` */
export const BankAccount: Story = {
  render: () => <Demo label="เลขที่บัญชี" format="bankAccount" />,
};

/** จำนวนเงิน — ตัวคั่นหลักพัน ทศนิยม 2 ตำแหน่ง ไม่รับค่าติดลบ
 *
 * ค่าเดียวกับที่ Medimatch ใช้อยู่กับช่องค่าจ้างวันนี้
 */
export const Currency: Story = {
  render: () => (
    <Demo label="เงินเดือน" format="currency" prefixIcon={<span>฿</span>} />
  ),
};

/** ส่ง mask เป็นสตริงเองได้ ไม่ต้องเพิ่ม preset — `#` คือช่องตัวเลข 1 หลัก */
export const CustomPattern: Story = {
  render: () => (
    <Demo
      label="เลขที่ใบอนุญาต"
      format="##-###-######"
      hint="รูปแบบที่ส่งเข้ามาเอง ไม่ใช่ preset"
    />
  ),
};

/** โชว์ช่องที่ยังไม่ได้กรอกเป็น `_` */
export const WithMaskPlaceholder: Story = {
  render: () => (
    <Demo label="เลขบัตรประชาชน" format="thaiId" showMask />
  ),
};

/** เขียนฟังก์ชันเอง — ต้องให้ทั้งขาจัดและขาถอด
 *
 * ตัวอย่าง: ทะเบียนรถ 2 ตัวอักษร + 4 ตัวเลข เป็นตัวพิมพ์ใหญ่เสมอ
 * กรณีแบบนี้ mask ตำแหน่งคงที่ทำไม่ได้ เพราะมีทั้งตัวอักษรและตัวเลขปนกัน
 */
export const CustomFunction: Story = {
  render: () => (
    <Demo
      label="ทะเบียนรถ"
      hint="ฟังก์ชันเอง — ตัวอักษร 2 ตัว + ตัวเลข 4 ตัว"
      format={{
        format: (raw) => {
          const v = raw.toUpperCase().replace(/[^ก-ฮA-Z0-9]/g, "");
          const letters = v.replace(/[0-9]/g, "").slice(0, 2);
          const digits = v.replace(/[^0-9]/g, "").slice(0, 4);
          return digits ? `${letters} ${digits}` : letters;
        },
        removeFormatting: (v) => v.replace(/\s/g, ""),
      }}
    />
  ),
};

/** ใช้ prop ของ Input ได้ทุกตัว เพราะฐานเป็น Input ตัวเดียวกัน */
export const InheritsInputFeatures: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Demo label="ผิดพลาด" format="thaiId" error="เลขบัตรไม่ถูกต้อง" />
      <Demo label="ปิดใช้งาน" format="phone" disabled />
      <Demo label="กำลังโหลด" format="thaiId" isLoading />
      <Demo label="ขนาดใหญ่" format="currency" size="lg" />
    </div>
  ),
};
