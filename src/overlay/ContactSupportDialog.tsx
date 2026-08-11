/** @doc ./ContactSupportDialog.md */
import * as React from "react";
import { MessageCircle, Phone } from "lucide-react";
import { cn } from "../lib/cn";
import { Text } from "../ui/Text";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./Dialog";

/**
 * ช่องทางติดต่อของ MediAct — **ค่าเดียวกันทั้ง 4 แอป**
 *
 * 🔴 นี่คือเหตุผลหลักที่กล่องนี้ย้ายมาอยู่ใน DS: ก่อนหน้านี้ทั้ง 4 แอปคัดลอกเลข 2 ตัวนี้
 * ไว้คนละไฟล์ ⇒ วันที่เบอร์เปลี่ยน ต้องไล่แก้ 4 ที่ และถ้าลืมที่ใดที่หนึ่ง ผู้ใช้คนเดียวกัน
 * จะเห็นเบอร์ไม่ตรงกันระหว่างแอป แล้วไม่รู้ว่าอันไหนของจริง
 *
 * ผู้เรียกทับได้ผ่าน prop (เผื่อสภาพแวดล้อมทดสอบ) แต่ **ปกติไม่ต้องส่ง**
 */
export const MEDIACT_LINE_URL = "https://line.me/R/ti/p/@019bdeqs";
export const MEDIACT_LINE_HANDLE = "@mediact";
export const MEDIACT_SUPPORT_PHONE = "+66 94 124 9291";

/**
 * สีของ **บริษัทอื่น** — อยู่ตรงนี้คู่กับเบอร์/ลิงก์ เพราะมันเป็น *ข้อมูลของช่องทางติดต่อ*
 * ไม่ใช่การตัดสินใจด้านดีไซน์ของเรา
 *
 * 🔴 **จงใจไม่ทำเป็น token** — §7 ของ CLAUDE.md: 3 ใน 4 แอปไม่ได้ import token ของ DS
 * (portal/medimatch ประกาศ palette เอง · mediwork กิน `style.css` ตัวเก่า) ⇒ token ใหม่
 * จะ resolve ไม่ได้ในแอปเหล่านั้น แล้วปุ่ม LINE กลายเป็น**พื้นโปร่ง** · เป็นกับดักตัวเดียว
 * กับที่ `tokens.guard` เขียนไว้ตอนไม่ยอมเปลี่ยน `Tooltip` เป็น `bg-bg-inverse`
 *
 * 🔴 และ**ไม่ควร**ทำเป็น token ด้วยเหตุผลเชิงความหมาย — token คือของที่ธีมของแอปมีสิทธิ์
 * override · สีแบรนด์ LINE กับเขียวโลโก้ MediAct ต้องเหมือนกันทั้ง 4 แอปเสมอ ธีมไม่มีสิทธิ์
 * แตะ ถ้าอยู่ในชั้น token ก็เท่ากับเปิดช่องให้แตะได้
 *
 * ⚠️ ส่งเข้า CSS ผ่าน custom property แล้วอ้างด้วย `bg-[var(--…)]` — ไม่ใช่คลาสที่ฝัง hex ตรง ๆ
 * ซึ่ง `scripts/lint-colors.mjs` ห้าม · **ไม่ใช่การเลี่ยงกฎ**: กฎนั้นมีไว้กันสีที่*ควรเป็น token*
 * หลุดมาเป็น hex ในคลาส ส่วนสองค่านี้เป็นค่าคงที่ของบริษัทอื่นที่ไม่มีวันตามธีม
 * (ถ้าอยากให้กฎเข้มขึ้นจริง ให้จับ hex ทุกรูปแบบในไฟล์ แล้วเพิ่ม escape hatch ที่บังคับเขียนเหตุผล
 *  — เป็นการตัดสินใจของเจ้าของ guard ไม่ใช่ของ component นี้)
 */
const LINE_BRAND_GREEN = "#06C755";
const LINE_BRAND_GREEN_HOVER = "#05b34e";
/** เขียวน้ำทะเลของโลโก้ MediAct — เท่ากับ `text-teal-500` ที่อีก 3 แอปใช้อยู่ */
const MEDIACT_LOGO_TEAL = "#14b8a6";
const MEDIACT_LOGO_TEAL_HOVER = "#0d9488";

/** โลโก้ LINE — ไม่มีใน lucide และเป็นเครื่องหมายการค้า จึงฝัง path ไว้ตรง ๆ */
const LineIcon = () => (
  <svg
    className="size-4 shrink-0"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61V9.863h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.105.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
  </svg>
);

const SupportCard = ({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  action: React.ReactNode;
}) => (
  <div className="flex flex-col items-center gap-3 rounded-3xl border border-border-default p-6 text-center">
    <span className="flex size-14 items-center justify-center rounded-full bg-info-blue-50 text-info-blue-primary">
      {icon}
    </span>
    {/* หัวข้อการ์ดเป็น `Text` ไม่ใช่ `Heading` — สารบัญของกล่องนี้มีชั้นเดียวคือชื่อเรื่อง
     * สองบรรทัดนี้เป็นป้ายของตัวเลือก ไม่ใช่หัวข้อย่อยของเนื้อหา */}
    <Text variant="body-md" weight="bold" tone="body">
      {title}
    </Text>
    <Text variant="body-sm" tone="muted" className="leading-relaxed text-balance">
      {description}
    </Text>
    <div className="mt-auto pt-1">{action}</div>
  </div>
);

export type ContactSupportLabels = {
  /** ชื่อเรื่องของกล่อง เช่น "ติดต่อฝ่ายสนับสนุน" */
  title: string;
  lineTitle: string;
  lineDescription: string;
  phoneTitle: string;
  phoneDescription: string;
};

export type ContactSupportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * ข้อความทั้งหมด — **DS ไม่ถือคำแปล** เพราะแต่ละแอปมี i18n ของตัวเองและคีย์คนละชุด
   * สิ่งที่ DS ถือคือ *ทรง* กับ *ช่องทางติดต่อ* ซึ่งเป็นส่วนที่ต้องตรงกันจริง ๆ
   */
  labels: ContactSupportLabels;
  /**
   * โลโก้บริษัทกลางหัวกล่อง (ไม่บังคับ)
   *
   * ⚠️ เป็น prop ไม่ใช่ของที่ฝังมาใน DS — DS ไม่มีสายพานสำหรับไฟล์ภาพ ผู้เรียกจึงส่ง
   * `<img src="/icons/mediact-logo.svg" alt="MediAct" className="h-10 w-auto" />` เข้ามาเอง
   */
  logo?: React.ReactNode;
  lineUrl?: string;
  lineHandle?: string;
  phoneNumber?: string;
  className?: string;
};

/**
 * กล่อง "ติดต่อฝ่ายสนับสนุน" — ใช้เหมือนกันทั้ง 4 แอป
 *
 * ⚠️ **หัวกล่องจัดกึ่งกลางและไม่มีเส้นคั่น** ต่างจากหน้าต่างฟอร์มทั่วไปที่หัวชิดซ้าย
 * มีป้ายไอคอนและเส้นคั่น — จงใจ เพราะกล่องนี้พูดในนามบริษัท ไม่ใช่ส่วนหนึ่งของงานในจอ
 * และผู้ใช้คนเดียวกันเปิดหลายแอป จึงต้องจำหน้าตา "ที่ขอความช่วยเหลือ" ได้ทันที
 */
function ContactSupportDialog({
  open,
  onOpenChange,
  labels,
  logo,
  lineUrl = MEDIACT_LINE_URL,
  lineHandle = MEDIACT_LINE_HANDLE,
  phoneNumber = MEDIACT_SUPPORT_PHONE,
  className,
}: ContactSupportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        /* ห้ามให้โฟกัสเด้งไปลงกากบาทตอนเปิด ไม่งั้นวงแหวนโฟกัสค้างรอบ × ทันทีที่เปิด
         * อ่านได้ว่า "ปุ่มปิดคือสิ่งที่ควรกด" ทั้งที่เพิ่งเปิดมาเพื่ออ่านช่องทางติดต่อ */
        onOpenAutoFocus={(event) => event.preventDefault()}
        className={cn("max-w-[640px] rounded-2xl p-8", className)}
      >
        <div className="mb-6 flex flex-col items-center gap-3">
          {logo}
          <DialogTitle className="text-title-sm font-bold">
            {labels.title}
          </DialogTitle>
          {/* กล่องนี้ไม่มีคำบรรยายใต้หัวข้อ — ใส่ไว้ให้โปรแกรมอ่านหน้าจอเท่านั้น
           * (Radix เตือนถ้า `DialogContent` ไม่มี description) */}
          <DialogDescription className="sr-only">
            {labels.title}
          </DialogDescription>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SupportCard
            icon={<MessageCircle className="size-7" />}
            title={labels.lineTitle}
            description={labels.lineDescription}
            action={
              /* 🔴 `#06C755` เป็นสีแบรนด์ของ LINE ไม่ใช่สีของระบบเรา — เป็น hex ตรง ๆ
               * โดยตั้งใจ token แทนไม่ได้ และห้ามเพี้ยนตามธีมของแอป */
              <a
                href={lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={
                  {
                    "--line-brand": LINE_BRAND_GREEN,
                    "--line-brand-hover": LINE_BRAND_GREEN_HOVER,
                  } as React.CSSProperties
                }
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--line-brand)] px-4 py-2 text-body-sm font-medium text-text-inverse transition-colors hover:bg-[var(--line-brand-hover)]"
              >
                <LineIcon />
                {lineHandle}
              </a>
            }
          />

          <SupportCard
            icon={<Phone className="size-7" />}
            title={labels.phoneTitle}
            description={labels.phoneDescription}
            action={
              /* 🔴 เขียวน้ำทะเลของ **โลโก้ MediAct** ไม่ใช่สีแบรนด์ของแอป — ทั้งกล่องนี้
               * พูดในนามบริษัท ถ้าให้ตามธีม เบอร์จะเป็นครามใน MediHR แต่เขียวมิ้นต์ใน
               * Mediwork ทั้งที่เป็นเบอร์เดียวกัน */
              <a
                href={`tel:${phoneNumber.replace(/\s/g, "")}`}
                style={
                  {
                    "--logo-teal": MEDIACT_LOGO_TEAL,
                    "--logo-teal-hover": MEDIACT_LOGO_TEAL_HOVER,
                  } as React.CSSProperties
                }
                className="text-body-lg font-semibold text-[var(--logo-teal)] transition-colors hover:text-[var(--logo-teal-hover)]"
              >
                {phoneNumber}
              </a>
            }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { ContactSupportDialog };
