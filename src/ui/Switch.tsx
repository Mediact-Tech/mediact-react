/** @doc ./toggle.md */
import * as React from "react";
import * as RadixSwitch from "@radix-ui/react-switch";
import { cn } from "../lib/cn";
import { SkeletonBox } from "../feedback/Skeleton";
import { Spinner } from "../feedback/Spinner";
import {
  type SwitchTone,
  ToggleText,
  switchLabeledThumbClasses,
  switchLabeledTrackClasses,
  switchThumbClasses,
  switchToneClasses,
  switchTrackClasses,
  switchTrackLabelClasses,
  switchTrackLabelItemClasses,
  toggleLabelClasses,
} from "./toggle-parts";

/** คำที่แสดง**ในราง** — ใช้กับการ์ดหน่วยงานที่ไม่มีที่ให้เขียนป้ายข้างนอก */
export type SwitchTrackLabels = {
  on: React.ReactNode;
  off: React.ReactNode;
};

export type SwitchProps = Omit<
  React.ComponentProps<typeof RadixSwitch.Root>,
  "asChild"
> & {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  /** ป้ายกำกับอยู่ซ้ายหรือขวาของสวิตช์ ค่าเริ่มต้น `right` */
  labelPosition?: "left" | "right";
  /**
   * ผู้ใช้กดแล้ว **กำลังบันทึกอยู่** — หมุนอยู่ในปุ่มเลื่อน กดซ้ำไม่ได้
   * แต่ยังคงสถานะเดิมไว้จนกว่าเซิร์ฟเวอร์จะตอบ
   *
   * คนละเรื่องกับ `isLoading` (ยังไม่มีข้อมูล ⇒ โครงร่าง) — ดู CLAUDE.md §4.5
   */
  loading?: boolean;
  /** ยังไม่มีข้อมูล — แสดงโครงร่างแทนทั้งแถว */
  isLoading?: boolean;
  /** ข้อความให้โปรแกรมอ่านหน้าจอตอน `loading` — แอปส่งคำแปลมาเอง */
  loadingLabel?: string;
  /**
   * ใส่คำว่า "เปิด/ปิด" **ไว้ในราง** แทนป้ายกำกับข้างนอก
   *
   * ใช้ในการ์ดที่มีที่ว่างจำกัด (การ์ดหน่วยงานของ MediHR) — รางจะกว้างขึ้นตาม
   * คำที่ยาวที่สุด และปุ่มเลื่อนสลับข้างแทนการเลื่อน
   *
   * ⚠️ ยังส่ง `aria-label` มาด้วยเสมอ ถ้าไม่มี `label` ข้างนอก —
   * คำในรางเป็นแค่ภาพ ไม่ได้ผูกกับ `role="switch"` ให้โดยอัตโนมัติ
   */
  /**
   * สีของรางตอนเปิด — `success` (ค่าเริ่มต้น) สื่อ "ใช้งานอยู่" · `info`/`brand` สำหรับสวิตช์
   * ที่เป็นแค่ตัวเลือกในฟอร์ม ซึ่งไม่ควรอ่านเป็นสถานะสำเร็จ
   */
  tone?: SwitchTone;
  trackLabels?: SwitchTrackLabels;
  containerClassName?: string;
};

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    id,
    className,
    containerClassName,
    label,
    description,
    error,
    labelPosition = "right",
    loading,
    isLoading,
    loadingLabel = "Saving",
    tone = "success",
    trackLabels,
    disabled,
    ...props
  },
  ref,
) {
  const reactId = React.useId();
  const inputId = id ?? reactId;
  const hasError = Boolean(error);
  const hasText = label != null || description != null;
  const labeled = trackLabels != null;

  const trackShape = cn(
    labeled ? switchLabeledTrackClasses : switchTrackClasses,
    switchToneClasses[tone],
  );

  const sw = (
    <RadixSwitch.Root
      ref={ref}
      id={inputId}
      /* กำลังบันทึก = กดซ้ำไม่ได้ แต่ **ไม่ได้จางลงเหมือน disabled**
       * เพราะมันไม่ได้ถูกปิดใช้งาน มันกำลังทำงานอยู่ ผู้ใช้ต้องเห็นว่ามีอะไรเกิดขึ้น
       * ของจริง Mediwork 13 จอ กับ MediHR 1 จอ ใช้ `disabled` ทำหน้าที่นี้
       * ⇒ สวิตช์จางลงเฉย ๆ แยกไม่ออกว่า "ห้ามแตะ" หรือ "รออยู่" */
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-invalid={hasError || undefined}
      className={cn(
        trackShape,
        /* ⚠️ ต้องเป็น `disabled:*` ทั้งคู่ เพราะตอน loading ปุ่มถูก `disabled` จริง
         * ⇒ กฎ `disabled:cursor-not-allowed`/`disabled:opacity-50` ที่อยู่ในรูปทรงหลัก
         * จะชนะเสมอ ถ้าเขียนเป็น `cursor-progress` เปล่า ๆ (วัดเจอ: cursor ออกมาเป็น
         * not-allowed ทั้งที่กำลังบันทึกอยู่ — tailwind-merge ไม่รวม variant ต่างชั้นให้) */
        loading && "disabled:cursor-progress disabled:opacity-100",
        hasError && "ring-2 ring-cherry-red-600/40",
        className,
      )}
      {...props}
    >
      {labeled && (
        /* คำทั้งสองซ้อนกันในช่องเดียว ⇒ รางกว้างเท่าคำที่ยาวกว่าเสมอ ไม่กระตุกตอนสลับ
         * `aria-hidden` เพราะสถานะจริงประกาศผ่าน `role="switch"` + `aria-checked` อยู่แล้ว
         * ถ้าปล่อยให้อ่าน โปรแกรมอ่านหน้าจอจะพูดทั้ง "เปิดใช้งาน" และ "ปิดใช้งาน" ติดกัน */
        <span aria-hidden="true" className={switchTrackLabelClasses}>
          <span
            className={cn(
              switchTrackLabelItemClasses,
              /* 🔴 ตัวอักษร **ขาว** — คำว่า "เปิดใช้งาน" อยู่บนรางสีเขียวทึบ (#10b981)
               * ของเดิม `text-text-black` อ่านได้ยากมากบนพื้นเข้ม (ดีไซน์ 544-16678 เป็นขาว)
               * ใช้ token `text-inverse` (= #fff · วัดยืนยันในแอปแล้ว) ไม่ใช่ `text-white`
               * เพราะ `white` เป็นสีดิบที่ด่าน `tokens.guard.test.ts` ตรึงจำนวนไว้ */
              "text-text-inverse group-data-[state=unchecked]/switch:invisible",
            )}
          >
            {trackLabels.on}
          </span>
          <span
            className={cn(
              switchTrackLabelItemClasses,
              "text-text-body group-data-[state=checked]/switch:invisible",
            )}
          >
            {trackLabels.off}
          </span>
        </span>
      )}
      <RadixSwitch.Thumb
        className={labeled ? switchLabeledThumbClasses : switchThumbClasses}
      >
        {loading && (
          <Spinner
            size="xs"
            label={loadingLabel}
            className="text-success-green-primary"
          />
        )}
      </RadixSwitch.Thumb>
    </RadixSwitch.Root>
  );

  /* โครงร่างของแบบมีข้อความในราง: รางไม่มีความกว้างตายตัว ⇒ ต้องใส่เนื้อหาจริง
   * (ซึ่ง `SkeletonBox` จะซ่อนด้วย `invisible`) ไม่งั้นได้กล่องแคบผิดขนาด */
  const trackLabelGhost = labeled ? (
    <>
      <span className={switchTrackLabelClasses}>
        <span className={switchTrackLabelItemClasses}>{trackLabels.on}</span>
        <span className={switchTrackLabelItemClasses}>{trackLabels.off}</span>
      </span>
      <span className="size-5 shrink-0" />
    </>
  ) : null;

  if (isLoading) {
    return hasText ? (
      <SkeletonBox
        shape="inline-flex items-center gap-2 rounded-full text-body-sm"
        className={containerClassName}
      >
        {labelPosition === "left" && (
          <ToggleText description={description}>{label}</ToggleText>
        )}
        <span className={trackShape}>{labeled && trackLabelGhost}</span>
        {labelPosition === "right" && (
          <ToggleText description={description}>{label}</ToggleText>
        )}
      </SkeletonBox>
    ) : (
      <SkeletonBox shape={trackShape} className={containerClassName}>
        {labeled ? trackLabelGhost : null}
      </SkeletonBox>
    );
  }

  if (!hasText && error == null) return sw;

  const text = <ToggleText description={description}>{label}</ToggleText>;

  return (
    <div className={cn("flex flex-col gap-1", containerClassName)}>
      <label
        htmlFor={inputId}
        className={toggleLabelClasses(disabled, "center")}
      >
        {labelPosition === "left" && text}
        {sw}
        {labelPosition === "right" && text}
      </label>
      {hasError && (
        <p role="alert" className="text-caption font-medium text-cherry-red-600">
          {error}
        </p>
      )}
    </div>
  );
});

Switch.displayName = "Switch";

export { Switch };
