import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";
import { ConfirmDialog, toneIcon, type ConfirmTone } from "./ConfirmDialog";

const meta = {
  title: "Overlay/ConfirmDialog",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Danger: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Delete account
        </Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          tone="danger"
          title="Delete account?"
          description="This action cannot be undone. All your data will be permanently removed."
          confirmLabel="Delete"
          onConfirm={async () => {
            await new Promise((r) => setTimeout(r, 800));
          }}
        />
      </>
    );
  },
};

export const Warning: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="warning" onClick={() => setOpen(true)}>
          Discard changes
        </Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          tone="warning"
          title="Discard unsaved changes?"
          description="Your edits will be lost."
          confirmLabel="Discard"
        />
      </>
    );
  },
};

export const Info: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Publish</Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          tone="info"
          title="Publish article?"
          description="Once published, the article will be visible to all readers."
          confirmLabel="Publish"
        />
      </>
    );
  },
};

/** `isLoading` — โหมดที่ call-site จริงทุกที่ในระบบใช้อยู่
 *
 * สถานะ loading มาจาก mutation ที่อยู่ **นอก** dialog (react-query `isPending`)
 * และคนปิด dialog คือ parent ตอน `onSuccess` ไม่ใช่ตัว dialog เอง
 * ต่างจากโหมดปกติที่ dialog รอ `onConfirm` ของตัวเองแล้วปิดให้
 */
export const ExternalLoading: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [isPending, setPending] = useState(false);

    // แทน mutation ที่อยู่ข้างนอก — parent เป็นคนสั่งปิดเมื่อสำเร็จ
    const submit = () => {
      setPending(true);
      setTimeout(() => {
        setPending(false);
        setOpen(false);
      }, 1500);
    };

    return (
      <>
        <Button onClick={() => setOpen(true)}>อนุมัติคำขอลา</Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          tone="info"
          title="อนุมัติคำขอลาของ ศุกร์ ทดสอบ?"
          description="ระบบจะแจ้งเตือนผู้ขอทันที และจะหาคนขึ้นเวรแทนในวันที่ลา"
          confirmLabel="อนุมัติ"
          cancelLabel="ยกเลิก"
          isLoading={isPending}
          onConfirm={submit}
        />
      </>
    );
  },
};

/** `errorMessage` — คำขอล้มเหลวแต่ dialog ต้องไม่ปิด ผู้ใช้จะได้กดใหม่ได้ */
export const WithErrorMessage: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPending, setPending] = useState(false);

    const submit = () => {
      setError(null);
      setPending(true);
      setTimeout(() => {
        setPending(false);
        setError("บันทึกไม่สำเร็จ — มีผู้แก้ไขตารางเวรนี้ไปแล้วเมื่อสักครู่ กรุณาโหลดใหม่แล้วลองอีกครั้ง");
      }, 1200);
    };

    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          ลบเวรที่เลือก
        </Button>
        <ConfirmDialog
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            if (!next) setError(null);
          }}
          tone="danger"
          title="ลบเวรที่เลือก 4 ช่อง?"
          description="เวรที่ถูกลบจะกลับมาเป็นช่องว่าง และต้องจัดใหม่เอง"
          confirmLabel="ลบ"
          cancelLabel="ยกเลิก"
          isLoading={isPending}
          errorMessage={error}
          onConfirm={submit}
        />
      </>
    );
  },
};

/** `showCancel={false}` — โหมดแจ้งเตือนปุ่มเดียว ใช้แทน `ErrorModal` ที่ mediwork มีแยกอยู่ */
export const AlertMode: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          แสดงข้อความแจ้งเตือน
        </Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          tone="danger"
          title="ไม่สามารถประกาศตารางเวรได้"
          description="ยังมี 3 ช่องที่ไม่มีผู้ขึ้นเวรในวันที่ 12, 18 และ 25 กรุณาจัดให้ครบก่อนประกาศ"
          confirmLabel="รับทราบ"
          showCancel={false}
        />
      </>
    );
  },
};

/** ไอคอนกับเส้นคั่นเป็นทางเลือกที่ไม่อยู่ด้วยกัน
 *
 * ส่ง `icon` เข้ามาแล้วเส้นคั่นจะหายไปเอง — เป็นกติกาที่ portal / medimatch /
 * mediwork ทำตรงกันโดยไม่ได้นัดกัน ใช้ไอคอนสำเร็จรูปได้จาก `toneIcon`
 */
export const WithIcon: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          ลบตารางเวรทั้งเดือน
        </Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          tone="danger"
          icon={toneIcon.danger}
          title="ลบตารางเวรเดือนธันวาคม?"
          description={"เวรทั้งหมด 184 ช่องจะถูกลบถาวร\nและไม่สามารถกู้คืนได้"}
          confirmLabel="ลบถาวร"
          cancelLabel="ยกเลิก"
        />
      </>
    );
  },
};

/** เทียบสี่โทน — ค่าเริ่มต้น **ไม่มีเส้นคั่น** (ตาม Portal) โทนจึงเห็นผลที่สีปุ่มยืนยัน */
export const Tones: Story = {
  render: () => {
    const [tone, setTone] = useState<ConfirmTone | null>(null);
    const labels: Record<ConfirmTone, string> = {
      info: "ข้อมูล",
      success: "สำเร็จ",
      warning: "เตือน",
      danger: "อันตราย",
    };
    return (
      <div className="flex flex-wrap gap-3">
        {(["info", "success", "warning", "danger"] as const).map((t) => (
          <Button key={t} variant="secondary" onClick={() => setTone(t)}>
            {labels[t]}
          </Button>
        ))}
        <ConfirmDialog
          open={tone !== null}
          onOpenChange={(next) => !next && setTone(null)}
          tone={tone ?? "info"}
          title={`ยืนยันการทำรายการ (${tone ? labels[tone] : ""})`}
          description="ข้อความอธิบายว่าจะเกิดอะไรขึ้นหลังจากกดยืนยัน"
          confirmLabel="ยืนยัน"
          cancelLabel="ยกเลิก"
        />
      </div>
    );
  },
};

/** **เส้นคั่นใต้หัวข้อ** — ต้องสั่ง `divider` เอง
 *
 * ของจริงใน Portal ไม่มีเส้นเลยสักจอ จึงเป็นค่าเริ่มต้นที่ปิดไว้
 * ทรงนี้มาจาก medimatch / mediwork / `DangerConfirmDialog` ที่ทำตาม Figma
 */
export const WithDivider: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          เปิดแบบมีเส้นคั่น
        </Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          divider
          tone="danger"
          title="ยืนยันการลบ"
          description="ลบแล้วกู้คืนไม่ได้"
          confirmLabel="ลบ"
          cancelLabel="ยกเลิก"
        />
      </>
    );
  },
};

/** **เนื้อหาเพิ่มเติมใต้คำอธิบาย** — ส่งเป็น `children`
 *
 * อยู่ใต้คำอธิบาย เหนือปุ่ม ระยะ 20px เท่ากับที่คำอธิบายห่างจากปุ่มอยู่แล้ว
 * ⇒ ใส่หรือไม่ใส่ ระยะก่อนถึงปุ่มก็เท่าเดิม
 *
 * ⚠️ **ไม่บังคับการจัดวาง** — สืบทอด `text-center` ของกล่องมา ซึ่งตรงกับของจริง:
 * ทุกเคสใน Portal ที่ส่ง JSX เข้ามาเป็นข้อความจัดกึ่งกลางทั้งหมด
 * ถ้าเป็นฟอร์ม **ต้องสั่ง `text-left` เอง**
 */
export const WithCustomContent: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const units = ["หอผู้ป่วยใน 1", "หอผู้ป่วยนอก", "ห้องผ่าตัด"];
    return (
      <>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          ลบหลายหน่วยงาน
        </Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          tone="danger"
          title="ลบหน่วยงาน 3 รายการ"
          description="ลบแล้วกู้คืนไม่ได้ เวรที่ยังไม่เกิดขึ้นจะถูกลบไปด้วย"
          confirmLabel="ลบทั้งหมด"
          cancelLabel="ยกเลิก"
        >
          <ul className="rounded-lg bg-bg-subtle px-4 py-3 text-body-sm text-text-body">
            {units.map((u) => (
              <li key={u} className="py-0.5">
                {u}
              </li>
            ))}
          </ul>
        </ConfirmDialog>
      </>
    );
  },
};

/** ฟอร์มในช่องเนื้อหา — ต้องสั่งชิดซ้ายเอง
 *
 * 🔴 label / ตัวนับ / ข้อความ error ที่ลอยกลางอ่านยากและผิดหลักฟอร์ม
 */
export const WithFormContent: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          ฟอร์มในกล่องยืนยัน
        </Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="ยืนยันการโอนย้าย"
          description="เลือกหน่วยงานปลายทางก่อนดำเนินการต่อ"
          confirmLabel="โอนย้าย"
          cancelLabel="ยกเลิก"
        >
          <div className="text-left">
            <Select
              label="หน่วยงานปลายทาง"
              placeholder="เลือกหน่วยงาน"
              options={[
                { value: "a", label: "หอผู้ป่วยใน 1" },
                { value: "b", label: "หอผู้ป่วยนอก" },
              ]}
            />
          </div>
        </ConfirmDialog>
      </>
    );
  },
};
