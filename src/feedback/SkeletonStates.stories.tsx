import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../ui/Button";
import { IconButton } from "../ui/IconButton";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import { ComboBox } from "../form/ComboBox";
import { Search } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { Chip } from "../ui/Chip";
import { Text } from "../ui/Text";
import { Heading } from "../ui/Heading";

/**
 * `isLoading` — สถานะโหลดของทั้งระบบเป็นโครงร่างเสมอ
 *
 * ทุก component ที่รับ `isLoading` จะแทนตัวเองด้วยโครงร่างที่ **สวมรูปทรงของ
 * ตัวเอง** (ความสูง มุมโค้ง padding เท่าของจริง) ⇒ พอข้อมูลมาถึง เลย์เอาต์ไม่กระโดด
 *
 * กลไกอยู่ที่ `SkeletonBox` ตัวเดียว — component ส่ง class รูปทรงของตัวเองเข้าไป
 * แล้วมันลบสีพื้น/เส้นขอบ/เงา/สีตัวอักษรออกให้ เหลือแต่กรอบ
 */
const meta = {
  title: "Feedback/Skeleton states",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const Row = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="grid grid-cols-[7rem_1fr] items-center gap-4 border-b border-border-default py-3 last:border-b-0">
    <span className="text-caption text-text-tertiary">{label}</span>
    <div className="flex items-center gap-3">{children}</div>
  </div>
);

/** สลับดูได้ว่าโครงร่างกินที่เท่าของจริงไหม — ถ้าเลย์เอาต์ขยับแปลว่ายังไม่ตรง */
export const Toggle: Story = {
  render: () => {
    const [loading, setLoading] = useState(true);
    return (
      <div className="w-[36rem]">
        <div className="mb-4 flex items-center gap-3">
          <Button size="sm" variant="secondary" onClick={() => setLoading((v) => !v)}>
            {loading ? "โหลดเสร็จแล้ว" : "กลับไปสถานะโหลด"}
          </Button>
          <Text variant="caption" tone="muted">
            กดสลับแล้วดูว่าอะไรขยับบ้าง
          </Text>
        </div>

        <Row label="Heading">
          <Heading level={2} size="title-sm" isLoading={loading}>
            รายชื่อพนักงาน
          </Heading>
        </Row>
        <Row label="Text">
          <Text isLoading={loading} skeletonWidth="18rem">
            ข้อมูลพนักงานทั้งหมดในหน่วยงานนี้
          </Text>
        </Row>
        <Row label="Avatar">
          <Avatar size="sm" name="ศุกร์ ทดสอบ" isLoading={loading} />
          <Avatar name="เอมมี่ พยาบาล" isLoading={loading} />
          <Avatar size="lg" name="บีบี้ อาร์เอ็น" isLoading={loading} />
        </Row>
        <Row label="Chip">
          <Chip isLoading={loading}>ประจำ</Chip>
          <Chip variant="success" isLoading={loading}>
            ทำงานอยู่
          </Chip>
        </Row>
        <Row label="Button">
          <Button isLoading={loading}>บันทึก</Button>
          <Button variant="secondary" size="sm" isLoading={loading}>
            ยกเลิก
          </Button>
        </Row>
        <Row label="IconButton">
          <IconButton aria-label="แก้ไข" isLoading={loading} />
          <IconButton aria-label="ลบ" size="sm" isLoading={loading} />
        </Row>
        <div className="pt-4">
          <Input label="ชื่อ-นามสกุล" isLoading={loading} />
        </div>
      </div>
    );
  },
};

/** `loading` กับ `isLoading` คนละเรื่อง — ตั้งใจให้แยกกัน
 *
 * `loading` = ผู้ใช้กดไปแล้วและกำลังทำงาน ต้องเห็นปุ่มกับป้ายเดิมอยู่
 * `isLoading` = ยังไม่รู้ว่าปุ่มนี้ควรเขียนว่าอะไร หรือควรมีอยู่ไหม
 */
export const LoadingVsIsLoading: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="w-40 text-caption text-text-tertiary">
          loading — กำลังบันทึก
        </span>
        <Button loading>บันทึก</Button>
      </div>
      <div className="flex items-center gap-4">
        <span className="w-40 text-caption text-text-tertiary">
          isLoading — ยังไม่รู้ว่าปุ่มนี้คืออะไร
        </span>
        <Button isLoading>บันทึก</Button>
      </div>
    </div>
  ),
};

/** ช่องกรอกทุกชนิด — โครงร่างต้องสูงเท่าของจริง **ทุกเคส**
 *
 * กดสลับแล้วจับตาว่าอะไรขยับ คำตอบที่ถูกคือ *ไม่มีอะไรขยับเลย*
 *
 * 🔴 เคสที่เคยพังคือ **ไม่มีป้าย** — ในของจริงป้ายเป็น `position:absolute`
 * จึงไม่กินความสูงเลย ความสูงจริง = ช่อง + gap + บรรทัดข้อความข้างล่าง
 * แต่โครงร่างรุ่นก่อนประกอบขึ้นใหม่เป็น flow (แถบป้าย + ช่อง) ซึ่ง
 * **บังเอิญ**เท่ากันเฉพาะตอนมีป้าย พอไม่มีป้ายจะเหลือแค่ความสูงช่อง
 *
 * ตอนนี้โครงร่างใช้ `FloatingFieldShell` ตัวเดียวกับของจริง (`FieldSkeleton`)
 * ⇒ เท่ากันโดย**โครงสร้าง** ไม่ใช่โดยบังเอิญ
 */
export const Fields: Story = {
  render: () => {
    const [loading, setLoading] = useState(true);
    const opts = [
      { value: "a", label: "หอผู้ป่วยใน" },
      { value: "b", label: "ห้องฉุกเฉิน" },
    ];
    const rows: Array<[string, React.ReactNode]> = [
      ["Input มีป้าย", <Input label="ชื่อ-นามสกุล" isLoading={loading} />],
      ["Input ไม่มีป้าย", <Input placeholder="ค้นหา" isLoading={loading} />],
      [
        "Input มีไอคอน",
        <Input label="ค้นหา" prefixIcon={<Search />} isLoading={loading} />,
      ],
      ["Input sm", <Input label="ชื่อ" size="sm" isLoading={loading} />],
      ["Input lg", <Input label="ชื่อ" size="lg" isLoading={loading} />],
      [
        "Select มีป้าย",
        <Select label="หน่วยงาน" options={opts} isLoading={loading} />,
      ],
      [
        "Select ไม่มีป้าย",
        <Select placeholder="เลือก" options={opts} isLoading={loading} />,
      ],
      [
        "Select บังคับกรอก",
        <Select label="หน่วยงาน" required options={opts} isLoading={loading} />,
      ],
      ["Textarea มีป้าย", <Textarea label="หมายเหตุ" isLoading={loading} />],
      ["Textarea ไม่มีป้าย", <Textarea placeholder="พิมพ์" isLoading={loading} />],
      ["Textarea lg", <Textarea label="หมายเหตุ" size="lg" isLoading={loading} />],
      [
        "ComboBox",
        <ComboBox label="หน่วยงาน" options={opts} isLoading={loading} />,
      ],
      [
        "ComboBox multiple",
        <ComboBox multiple label="หน่วยงาน" options={opts} isLoading={loading} />,
      ],
    ];
    return (
      <div className="w-[34rem]">
        <Button
          size="sm"
          variant="secondary"
          className="mb-4"
          onClick={() => setLoading((v) => !v)}
        >
          {loading ? "โหลดเสร็จแล้ว" : "กลับไปสถานะโหลด"}
        </Button>
        <div className="flex flex-col gap-3">
          {rows.map(([name, node]) => (
            <div
              key={name}
              className="grid grid-cols-[9rem_1fr] items-start gap-4"
              data-row={name}
            >
              <span className="pt-3 text-caption text-text-tertiary">{name}</span>
              <div data-probe>{node}</div>
            </div>
          ))}
        </div>
      </div>
    );
  },
};
