import * as React from "react";
import { AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { cn } from "../lib/cn";
import { Button } from "../ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./Dialog";

/** โทนของ dialog — คุมสีเส้นคั่นและสีปุ่มยืนยัน */
export type ConfirmTone = "info" | "warning" | "danger" | "success";

/* ────────────────────────────────────────────────────────────────────────────
 * ทรงนี้ยึดตาม **Portal ตัวเดียว** ไม่ใช่ค่าเฉลี่ยของหลายแอป
 *
 *   portal-web    `components/shared/ConfirmModal.tsx`                 (14 จุด) ← ต้นแบบ
 *   mediwork-bo   `components-v2/shared/ConfirmModal.tsx`              (20 จุด)
 *   medimatch-bo  `components/shared/ActionDialog.tsx`
 *   mediwork-bo   `doctor-schedule-management/DangerConfirmDialog.tsx` (ทำตาม Figma)
 *
 * เดิมที่นี่เฉลี่ยจากทั้งสามแอปแล้วได้ของที่ **ไม่เหมือนแอปไหนเลย** — ที่เห็นชัดที่สุด
 * คือโชว์เส้นคั่นเป็นค่าเริ่มต้น ทั้งที่ 10 ใน 14 จอของ Portal ไม่มี
 * จึง re-ground ใหม่กับ Portal อย่างเดียว แล้ววัดเทียบได้ตรง 12/12
 *
 * ⚠️ **Mediwork ต่างจาก Portal เกือบทุกมิติ** — ตัวเลขทั้งหมด resolve จาก MUI 6.5.0
 * ในเครื่อง (theme ของ Mediwork override แค่ `fontFamily` นอกนั้นเป็นค่า default)
 *
 * | | Portal (วัดจากเบราว์เซอร์) | Mediwork (MUI resolve) |
 * |---|---|---|
 * | กว้าง | 530 | **444** (`maxWidth="xs"`) |
 * | มุมกล่อง | 20 | **12** |
 * | หัวข้อ | 24 / **600** / `#283541` | 24 / **700** / `#374151` |
 * | เส้นคั่น | ไม่มีใน component · 4 จอวาดเอง สีตามโทน | **มี** ยกเว้นโหมดเตือน · ฟ้าคงที่ |
 * | ไอคอน | ส่งเองเมื่อไหร่ก็ได้ | เฉพาะ warning/error · 50px |
 * | คำอธิบาย | lh **26** · เข้มเท่าหัวข้อ | lh **22.4** · เทา `#6B7280` |
 * | ปุ่ม | สูง **44** · 16/**500** · มุม **8** | สูง **48** · 16/**600** · มุม **4** |
 * | ปุ่มยกเลิก | ขอบเทา `#8995a1` ตัวอักษรเกือบดำ | ขอบ+ตัวอักษร **เป็นสีโทน** |
 * | ยืนยัน error | `#F52D0A` | `#F52D0A` ← ตรงกันเป๊ะ |
 * | ยืนยัน primary | `#1976D2` | `#0B77C6` |
 * | ยืนยัน success | `#0BB767` | `#1EA78F` |
 *
 * 🔴 สองแอปตรงกันเป๊ะแค่ **สีแดงของโหมดลบ `#F52D0A`** ซึ่ง DS ยังใช้ `#e02c2c`
 * (มาจาก variant `destructive` ของ `Button`) — บันทึกไว้ที่ `CONFIRM_BUTTON_CLASS`
 * ──────────────────────────────────────────────────────────────────────────── */

/** สีเส้นคั่นสั้น ๆ ใต้หัวข้อ — ใช้ก็ต่อเมื่อสั่ง `divider` เอง
 *
 * **สีตามโทนถอดมาจากของจริง** — 4 จอของ Portal ที่วาดเส้นเองใช้
 * `bg-info-blue-primary` (2 จอ) และ `bg-error-red-icon` (2 จอ)
 * `info` ที่นี่ตรงเป๊ะ เพราะ `--color-info-blue-primary` alias ไป `--color-brand-active`
 *
 * ⚠️ `danger` ใช้ `cherry-red-600` (`#e02c2c`) ไม่ใช่ `error-red-icon` (`#f52d0a`)
 * ที่ Portal ใช้ — จงใจ เพื่อให้เส้นคั่นกับปุ่มยืนยันในกล่องเดียวกันเป็นแดงเดียวกัน
 * ถ้าจะย้ายไป `#f52d0a` ต้องย้าย variant `destructive` ของ `Button` ไปพร้อมกัน
 *
 * ⚠️ Mediwork ใช้ฟ้าคงที่ทุกโทน ไม่ใช่สีตามโทน — ยังไม่ตรงกับ Mediwork */
const toneDivider: Record<ConfirmTone, string> = {
  info: "bg-brand-active",
  warning: "bg-warning-yellow-600",
  danger: "bg-cherry-red-600",
  success: "bg-success-green-primary",
};

/** ไอคอนสำเร็จรูปตามโทน — ส่งเข้า `icon` เองเมื่ออยากได้ไอคอนด้านบน
 *
 * ไม่ถูกใส่ให้อัตโนมัติ เพราะ **ของจริงส่วนใหญ่ไม่มีทั้งไอคอนและเส้นคั่น**
 * (10 ใน 14 จอของ Portal เป็นหัวข้อ + คำอธิบาย + ปุ่ม เท่านั้น)
 * (`<ConfirmDialog icon={toneIcon.danger} … />`)
 */
export const toneIcon = {
  info: <Info className="size-10 text-brand-active" />,
  warning: <AlertTriangle className="size-10 text-warning-yellow-600" />,
  danger: <AlertTriangle className="size-10 text-cherry-red-600" />,
  success: <CheckCircle2 className="size-10 text-success-green-primary" />,
} as const;

/** โทน → variant ของปุ่มยืนยัน */
export const toneConfirmVariant = {
  info: "primary",
  warning: "warning",
  danger: "destructive",
  success: "success",
} as const;

/** กว้าง 530px เท่ากันทั้งสามแอป
 *  (portal `maxWidth: 530px` · medimatch `max-w-132.5` · mediwork `maxWidth: 530`) */
const CONFIRM_DIALOG_WIDTH = "sm:max-w-[33.125rem]";

/** ปุ่มยกเลิก — วัดจาก Portal ของจริง
 *
 * | | Portal (วัดแล้ว) |
 * |---|---|
 * | สูง | 44 (`h-11`) |
 * | ตัวอักษร | **16px / 500** |
 * | มุม | 8px |
 * | ขอบ | 1px `rgb(137,149,161)` = `#8995a1` |
 * | สีตัวอักษร | `slate-900` ≈ `#0f172a` (เกือบดำ) |
 *
 * 🔴 ตัวอักษร**ไม่ใช่สีแบรนด์** — ก่อนหน้านี้เป็นสีแบรนด์ถึงสองชั้น:
 * `Button variant="secondary"` ให้ `text-brand` มาอยู่แล้ว แล้วยังทับด้วย
 * `text-text-primary` ซึ่ง alias ไป `--color-brand` อีกที (Mediwork ออกมาเขียวมิ้นต์)
 *
 * ⚠️ ชื่อ token `text-nuetral-dark-600` อ่านแล้วเหมือนสีตัวอักษร แต่ค่าของมัน
 * `#8995a1` **ตรงกับขอบของ Portal เป๊ะ** — ชื่อที่สื่อผิดเป็นปัญหาของชั้น token เดิม
 * ที่การย้าย token ต้องแก้ ไม่ใช่เหตุผลให้เลือกค่าที่ไม่ตรง */
const CANCEL_BUTTON_CLASS = cn(
  "flex-1 rounded-lg text-body-md font-medium",
  "border-text-nuetral-dark-600 text-text-black",
  "hover:border-border-input hover:bg-gray-50",
);

/** ปุ่มยืนยัน — 16px เท่าปุ่มยกเลิก · มุม 8px (ของ `Button` เองคือ `rounded-md`)
 *
 * ⚠️ **สีไม่ตรงกับ Portal ทุกโทน** และจงใจไม่แก้ที่นี่ — สีมาจาก variant ของ
 * `Button` ซึ่งถูก ground แยกไว้แล้ว ถ้ามาใส่สีเฉพาะกิจตรงนี้ ปุ่มใน dialog
 * จะเป็นคนละแดง/คนละน้ำเงินกับปุ่มที่เหลือทั้งระบบ
 * (Portal: error `#F52D0A` · primary `#1976D2` · success `#0BB767`
 *  DS: destructive `#e02c2c` · primary = สีแบรนด์ · success `#0bb767` ✅ ตรง) */
const CONFIRM_BUTTON_CLASS = "flex-1 rounded-lg text-body-md font-medium";

/** ระยะและมุมโค้งยึดตาม portal ซึ่งเป็นตัวที่กระชับที่สุดในสามแอป
 *  (`rounded-[20px]` · `p-6 sm:p-8` — อีกสองแอปใช้ 24px/32px ซึ่งดูใหญ่เกินจำเป็น) */
export const confirmDialogContentClass = cn(
  "rounded-[20px] p-6 text-center sm:p-8",
  CONFIRM_DIALOG_WIDTH,
);

/** ส่วนหัวของกล่องยืนยัน — ไอคอน · หัวข้อ · เส้นคั่น · คำอธิบาย */
export function ConfirmDialogHeading({
  icon,
  title,
  description,
  tone,
  divider,
}: {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  tone: ConfirmTone;
  divider?: boolean;
}) {
  /* ค่าเริ่มต้นคือ **ไม่มีเส้นคั่น** — `ConfirmModal` ของ Portal ไม่มีช่องให้ใส่
   *
   * ⚠️ แต่ **4 จอของ Portal วาดเส้นเองใน `subtitle`** และเป็น**สีตามโทน**จริง:
   *   `MoveSubUnitDialog` · `SubUnitInUseModal`   → `bg-info-blue-primary`
   *   `HolidayDeleteDialog` · `DeleteSubUnitDialog` → `bg-error-red-icon`
   * ทั้งสี่ใช้ `mx-auto mb-4 h-1 w-12 rounded-full` เหมือนกันทุกตัว
   * ⇒ 4 ใน 14 จอมีเส้น จึงยัง **ไม่ควรเป็นค่าเริ่มต้น** แต่ก็ไม่ใช่ของที่ไม่มีใครใช้
   * และชุดสีตามโทนก็ไม่ได้เป็นของที่ DS คิดขึ้นเอง */
  const showDivider = divider ?? false;
  return (
    // `gap-0` จำเป็น — `DialogHeader` ตั้ง `gap-1.5` ไว้เป็นค่าเริ่มต้น
    // ถ้าไม่ล้าง ระยะจริงจะเป็น 6px + `mt-*` ของทุกชิ้นด้านล่าง
    <DialogHeader className="items-center gap-0 pb-0 pr-0 text-center">
      {/* `mt-2 mb-3` — วัดจาก Portal (margin `8px 0 12px`) */}
      {icon && <div className="mb-3 mt-2 flex justify-center">{icon}</div>}
      {/* 🔴 สีดำคงที่ **ห้ามเปลี่ยนตามแอป** — ของจริงทั้งสามแอปฝังสีเข้มไว้ตายตัว
        * portal `#283541` · medimatch `#283541` · mediwork `#374151`
        * ไม่มีแอปไหนให้หัวข้อ dialog ตามสีแบรนด์เลย
        * เดิมใช้ `text-text-primary` ซึ่ง alias ไป `--color-brand` */}
      <DialogTitle className="text-title-md font-semibold text-text-black">
        {title}
      </DialogTitle>
      {showDivider && (
        /* 📐 48×4 · ห่างจากหัวข้อ 8 · ห่างจากคำอธิบาย 16
         * วัดจาก 4 จอของ Portal ที่วาดเส้นเอง (`mx-auto mb-4 h-1 w-12`)
         * ของเดิมที่นี่เป็น 40×4 ห่าง 10/8 ซึ่งไม่ตรงกับที่ไหน */
        <span
          aria-hidden
          className={cn("mt-2 h-1 w-12 rounded-full", toneDivider[tone])}
        />
      )}
      {description && (
        /* วัดจาก Portal: 16px / **line-height 26** (`leading-relaxed`) · เกือบดำ
         * เท่าหัวข้อ · ห่างจากหัวข้อ 8px และห่างจากปุ่ม 20px
         *
         * ⚠️ สีเข้มเท่าหัวข้อโดยตั้งใจ — ใน confirm dialog บรรทัดนี้คือ "ผลที่จะเกิด"
         * (เช่น "ลบแล้วกู้คืนไม่ได้") ไม่ใช่คำอธิบายประกอบ Portal จึงไม่ทำให้จาง */
        <DialogDescription
          className={cn(
            "whitespace-pre-line text-body-md leading-relaxed text-text-black",
            /* มีเส้นคั่น ⇒ เว้น 16 ตามที่วัดจาก Portal · ไม่มี ⇒ เว้น 8 จากหัวข้อ */
            showDivider ? "mt-4" : "mt-2",
          )}
        >
          {description}
        </DialogDescription>
      )}
    </DialogHeader>
  );
}

/** ข้อความผิดพลาดที่โชว์คาไว้ในกล่อง โดยไม่ปิด dialog */
export function ConfirmDialogError({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p
      role="alert"
      className="mt-4 rounded-sm border border-cherry-red-200 bg-cherry-red-50 px-3 py-2 text-body-sm font-medium text-cherry-red-800"
    >
      {children}
    </p>
  );
}

/** ปุ่มคู่ล่าง — กว้างเท่ากัน สูง 48px
 *
 * ไม่ได้ reuse `ConfirmCancelActions` เพราะตัวนั้นบังคับ label เป็น `string`
 * ส่วน dialog ตระกูลนี้รับ `ReactNode` (ของจริงมีเคสที่ใส่ไอคอนไว้ในปุ่มยืนยัน)
 */
export function ConfirmDialogActions({
  tone,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  loading,
  showCancel,
  confirmDisabled,
}: {
  tone: ConfirmTone;
  confirmLabel: React.ReactNode;
  cancelLabel: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
  showCancel: boolean;
  confirmDisabled?: boolean;
}) {
  return (
    <DialogFooter className="mt-5 flex-row gap-4 border-none p-0 pt-0 sm:justify-center">
      {showCancel && (
        <Button
          variant="secondary"
          size="lg"
          className={CANCEL_BUTTON_CLASS}
          onClick={onCancel}
          disabled={loading}
        >
          {cancelLabel}
        </Button>
      )}
      <Button
        variant={toneConfirmVariant[tone]}
        size="lg"
        className={CONFIRM_BUTTON_CLASS}
        onClick={onConfirm}
        loading={loading}
        disabled={confirmDisabled}
      >
        {confirmLabel}
      </Button>
    </DialogFooter>
  );
}

export type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** โทน — คุมสีเส้นคั่นและสีปุ่มยืนยัน */
  tone?: ConfirmTone;
  /**
   * ไอคอนด้านบนกึ่งกลาง (ไม่บังคับ)
   *
   * ส่งมาแล้วเส้นคั่นใต้หัวข้อจะหายไปเอง — กติกาเดียวกับทั้งสามแอป
   * ใช้ไอคอนสำเร็จรูปได้จาก `toneIcon`
   */
  icon?: React.ReactNode;
  /** สั่งเปิด/ปิดเส้นคั่นเอง แทนกติกาอัตโนมัติ (ค่าปกติ = แสดงเมื่อไม่มี `icon`) */
  divider?: boolean;
  confirmLabel?: React.ReactNode;
  cancelLabel?: React.ReactNode;
  /** เรียกเมื่อกดยืนยัน — คืน Promise เพื่อให้ dialog ค้างพร้อมสถานะโหลดจนกว่าจะเสร็จ */
  onConfirm?: () => void | Promise<void>;
  /** เรียกเมื่อกดยกเลิก (ค่าปกติคือปิด dialog) */
  onCancel?: () => void;
  size?: React.ComponentProps<typeof DialogContent>["size"];
  /**
   * สั่งสถานะโหลดจากภายนอก — ชนะสถานะที่ dialog จัดการเองจาก Promise
   *
   * ใช้เมื่อ mutation อยู่นอก dialog (เช่น `mutation.isPending` ของ react-query)
   * ในโหมดนี้ dialog จะไม่รอ `onConfirm` และไม่ปิดตัวเอง — ผู้เรียกเป็นคนปิด
   * (ปกติทำใน `onSuccess`) · ไม่ส่งมา = ใช้พฤติกรรมเดิมที่ dialog จัดการเอง
   */
  isLoading?: boolean;
  /** โชว์ข้อความผิดพลาดคาไว้ในกล่อง โดยไม่ปิด dialog */
  errorMessage?: React.ReactNode;
  /** `false` = โหมดแจ้งเตือนปุ่มเดียว ไม่มีปุ่มยกเลิก · ค่าปกติ `true` */
  showCancel?: boolean;
  /**
   * เนื้อหาเพิ่มเติม **ใต้คำอธิบาย เหนือปุ่ม** — ใส่อะไรก็ได้
   *
   * ใช้ตอนที่ข้อความอย่างเดียวไม่พอ เช่น รายการที่จะถูกลบ · ตารางสรุป · ช่องกรอก
   *
   * ⚠️ **ไม่บังคับการจัดวาง** — สืบทอด `text-center` ของกล่องมา ซึ่งตรงกับของจริง
   * ทุกเคสใน Portal ที่ส่ง JSX เข้ามา (ล้วนเป็นข้อความจัดกึ่งกลาง)
   * ถ้าเป็น **ฟอร์ม ต้องสั่ง `text-left` เอง** — label/ตัวนับ/ข้อความ error ที่ลอย
   * กลางอ่านยากและผิดหลักฟอร์ม
   */
  children?: React.ReactNode;
};

function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  tone = "info",
  icon,
  divider,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  size = "lg",
  isLoading,
  errorMessage,
  showCancel = true,
  children,
}: ConfirmDialogProps) {
  const [internalLoading, setInternalLoading] = React.useState(false);
  const isLoadingControlled = isLoading !== undefined;
  const loading = isLoadingControlled ? isLoading : internalLoading;

  const handleConfirm = async () => {
    if (!onConfirm) {
      onOpenChange(false);
      return;
    }
    if (isLoadingControlled) {
      // ผู้เรียกถือทั้งสถานะโหลดและการปิด — ยิงแล้วปล่อยให้เขาปิดเอง
      onConfirm();
      return;
    }
    try {
      setInternalLoading(true);
      await onConfirm();
      onOpenChange(false);
    } catch {
      // กลืนไว้ — ผู้เรียกแสดงความล้มเหลวผ่าน `errorMessage`
    } finally {
      setInternalLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size={size}
        showClose={false}
        className={confirmDialogContentClass}
      >
        <ConfirmDialogHeading
          icon={icon}
          title={title}
          description={description}
          tone={tone}
          divider={divider}
        />

        {/* ช่องเนื้อหาเพิ่มเติม — ระยะ 20px เท่ากับที่คำอธิบายห่างจากปุ่ม
         * ⇒ ใส่หรือไม่ใส่ ระยะก่อนถึงปุ่มก็เท่าเดิม เลย์เอาต์ไม่กระโดด */}
        {children != null && <div className="mt-5">{children}</div>}

        {errorMessage && <ConfirmDialogError>{errorMessage}</ConfirmDialogError>}

        <ConfirmDialogActions
          tone={tone}
          confirmLabel={confirmLabel}
          cancelLabel={cancelLabel}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          loading={loading}
          showCancel={showCancel}
        />
      </DialogContent>
    </Dialog>
  );
}

export { ConfirmDialog };
