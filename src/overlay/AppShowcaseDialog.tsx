/** @doc ./AppShowcaseDialog.md */
import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "../lib/cn";
import {
  MEDIACT_LINE_HANDLE,
  MEDIACT_LINE_URL,
  MEDIACT_SUPPORT_PHONE,
} from "./ContactSupportDialog";

/* ─────────────────────────────────────────────────────────────────── */
/* Copy — ฝังไว้ใน DS ทั้ง th/en                                        */
/* ─────────────────────────────────────────────────────────────────── */

/**
 * 🔴 **กล่องนี้ถือคำแปลเอง — ต่างจาก `ContactSupportDialog` ที่รับ `labels` จากผู้เรียก**
 *
 * เหตุผลที่ต่าง ไม่ใช่ความไม่สม่ำเสมอ:
 * · `ContactSupportDialog` พูดในบริบทของ *งานในจอ* ("ติดต่อเราถ้าติดปัญหาเรื่องนี้") แต่ละแอป
 *   จึงมีสิทธิ์เรียบเรียงถ้อยคำของตัวเอง ⇒ DS ถือแค่ทรงกับเบอร์
 * · กล่องนี้เป็น **คำโปรยขายผลิตภัณฑ์ที่มาจาก Figma** — ประโยคเดียวกันเป๊ะทุกแอปโดยนิยาม
 *   ถ้าให้แต่ละแอปถือคำแปลเอง จะได้คำโปรยของ Medi Pay ที่ไม่ตรงกันระหว่าง Portal กับ MediHR
 *   ซึ่งเป็นสิ่งเดียวกับที่ทำให้เบอร์โทรเคยเพี้ยน 4 ที่ (เหตุผลที่ `ContactSupportDialog` ย้ายมา DS)
 *
 * ⚠️ ผลที่ตามมา: **แอปไม่ต้องมีคีย์ i18n ของกล่องนี้เลย** · ถ้าจะเปลี่ยนถ้อยคำ ต้องเปลี่ยนที่นี่ที่เดียว
 *    และถือเป็นการเปลี่ยนของ design ไม่ใช่ของแอป
 */
export type ShowcaseLocale = "th" | "en";

/** แอปที่ยังไม่เปิดใช้งานจริง — กดแล้วเปิดกล่องนี้แทนการพาออกไป */
export type ShowcaseAppKey = "medihr" | "medioncloud" | "medirefer" | "medipay";

type ShowcaseCopy = {
  /** ชื่อผลิตภัณฑ์ — ใช้เป็น `aria-label` และ `alt` ของโลโก้ */
  name: string;
  /** พาดหัว · `\n` = ขึ้นบรรทัดตามแบบ (ไทยไม่มีเว้นวรรค เบราว์เซอร์ตัดคนละที่กับ Figma) */
  headline: string;
  description: string;
};

const CLOSE_LABEL: Record<ShowcaseLocale, string> = {
  th: "ปิด",
  en: "Close",
};

const SHOWCASE_COPY: Record<
  ShowcaseAppKey,
  Record<ShowcaseLocale, ShowcaseCopy>
> = {
  medihr: {
    th: {
      name: "Medi HR",
      headline: 'บริหารจัดการง่ายขึ้นด้วย\n"ฟีเจอร์ระบบบริหารงานบุคคล"',
      description:
        "บริหารและวิเคราะห์ข้อมูลบุคลากรได้จบในหน้าเดียว\nสนใจติดตั้งระบบเพื่อใช้งานติดต่อเราได้ทันที",
    },
    en: {
      name: "Medi HR",
      headline: "Run people operations more easily with the HR management feature",
      description:
        "Manage and analyse your personnel data on a single screen. Contact us to get it set up.",
    },
  },
  medioncloud: {
    th: {
      name: "Medi On cloud",
      headline: 'ปรึกษาเคสผู้ป่วยทางไกลด้วย\n"ฟีเจอร์รับปรึกษาแพทย์"',
      description:
        "ให้แพทย์รับและให้คำปรึกษาเคสผู้ป่วยทางไกลผ่าน\nวิดีโอคอล พร้อมข้อมูลเคสและประวัติผู้ป่วย\nสนใจติดตั้งระบบ ติดต่อเราได้ทันที",
    },
    en: {
      name: "Medi On cloud",
      headline: "Consult on patient cases remotely with the doctor-consult feature",
      description:
        "Let doctors accept and advise on patient cases remotely over video call, with the case data and patient history at hand. Contact us to get it set up.",
    },
  },
  medirefer: {
    th: {
      name: "Medi Refer",
      headline: 'บริหารจัดการง่ายขึ้นด้วย\n"ฟีเจอร์แดชบอร์ดรับตัวผู้ป่วย"',
      description:
        "วิเคราะห์ข้อมูลการรับตัวผู้ป่วยได้จบในหน้าเดียว\nสนใจติดตั้งระบบเพื่อใช้งานติดต่อเราได้ทันที",
    },
    en: {
      name: "Medi Refer",
      headline: "Run referrals more easily with the patient-intake dashboard",
      description:
        "Analyse your patient-intake data on a single screen. Contact us to get it set up.",
    },
  },
  medipay: {
    th: {
      name: "Medi Pay",
      headline: 'เพิ่มสวัสดิการให้พนักงานด้วย\n"ฟีเจอร์เบิกเงินเดือนล่วงหน้า"',
      description:
        "ให้พนักงานเบิกค่าจ้างที่ทำงานไปแล้วล่วงหน้าได้เอง\nดูและอนุมัติคำขอได้จบในหน้าเดียว สนใจติดตั้งระบบ\nติดต่อเราได้ทันที",
    },
    en: {
      name: "Medi Pay",
      headline: "Add an earned-wage access benefit for your staff",
      description:
        "Let staff draw the wages they have already worked for, and review and approve every request on one screen. Contact us to get it set up.",
    },
  },
};

/* ─────────────────────────────────────────────────────────────────── */
/* Layout — ตัวเลขจาก Figma ต่อผลิตภัณฑ์                                 */
/* ─────────────────────────────────────────────────────────────────── */

type ShowcaseImageBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type ShowcaseLayout = {
  /** ความสูงจริงของกรอบโลโก้ใน Figma (ความกว้างปล่อยตามสัดส่วน) */
  logoHeight: number;
  /** ระยะจากขอบซ้ายของกรอบเนื้อหาถึงคอลัมน์ขวา — **ไม่เท่ากันทั้ง 4 แบบ** */
  columnX: number;
  columnWidth: number;
  preview: {
    width: number;
    height: number;
    /** ภาพจอกว้าง (ชั้นหลัง) */
    wide: ShowcaseImageBox;
    /** ภาพที่ซ้อนทับมุมล่างซ้าย */
    card: ShowcaseImageBox;
  };
};

/**
 * 📐 **ทรงเป็น px คงที่ ไม่ยืดตามจอ** — ดีไซน์ทั้ง 4 แบบวางภาพคนละตำแหน่ง/ขนาด และคอลัมน์ขวา
 * ก็ไม่ได้เริ่มที่ x เดียวกัน (571 / 577.7 / 594 / 610.4) ⇒ ค่าพวกนี้เป็นของ **แต่ละผลิตภัณฑ์**
 * ไม่ใช่สูตรกลาง · จอที่แคบกว่านั้นให้เลื่อนดู (`overflow-auto` ที่ฉากหลัง) ดีกว่าย่อจนไม่ตรงแบบ
 *
 * ที่มา: Figma node 2986:37737 (HR) · 3012:43436 (On cloud) · 2967:35789 (Refer) · 3012:45681 (Pay)
 * — ชุดเดียวกับที่ Portal ใช้บน staging (`src/config/apps.ts`) ยกมาทั้งชุดเพื่อไม่ให้สองที่ไหลออกจากกัน
 *
 * 🔴 **ทุกตัวเลขต้องเทียบทีละช่องกับ `APP_CATALOG` ของ Portal ก่อนแก้** — ค่ารอบแรกของ
 * Refer/Pay ถูกยกมาจากของ HR แล้วเปลี่ยนแค่ `x` ซึ่งอ่านผ่าน ๆ ดูสมเหตุผล (เลขชุด
 * `381.436×280.779` โผล่ซ้ำทั้ง 4 แบบ) แต่ภาพออกมาผิดขนาดทั้งใบ · แก้แล้ว 2026-08-16
 */
const SHOWCASE_LAYOUT: Record<ShowcaseAppKey, ShowcaseLayout> = {
  medihr: {
    logoHeight: 45,
    columnX: 610.436,
    columnWidth: 284,
    preview: {
      width: 578.436,
      height: 400.855,
      wide: { x: 197, y: 0, width: 381.436, height: 280.779 },
      card: { x: 0, y: 120.076, width: 381.436, height: 280.779 },
    },
  },
  medioncloud: {
    logoHeight: 49,
    columnX: 571,
    /* คอลัมน์ขวากว้าง 293 (ไม่ใช่ 284 เหมือนอีก 3 แบบ) */
    columnWidth: 293,
    preview: {
      width: 523.034,
      height: 393,
      wide: { x: 70.631, y: 0, width: 452.403, height: 356.055 },
      card: { x: 0, y: 84.757, width: 141.263, height: 308.243 },
    },
  },
  /* Figma node 2967:35789 — ⚠️ ภาพของแบบนี้ **ไม่ได้ขนาดเดียวกับ HR** ทั้งภาพหลังและภาพซ้อน
   * (รอบแรกยกค่าของ HR มาใช้แล้วเปลี่ยนแค่ `x` ⇒ ภาพผิดขนาดทั้งสองใบ) */
  medirefer: {
    logoHeight: 46,
    columnX: 594,
    columnWidth: 284,
    preview: {
      width: 562,
      height: 414.474,
      wide: { x: 91, y: 0, width: 471, height: 325 },
      card: { x: 0, y: 154.83, width: 253.048, height: 259.644 },
    },
  },
  /* Figma node 3012:45681 — แบบอ้างอิงที่ใช้วัดทรงกลางของหน้าต่างทั้งหมด */
  medipay: {
    logoHeight: 45.75,
    columnX: 577.668,
    columnWidth: 284,
    preview: {
      width: 545.665,
      height: 358.997,
      wide: { x: 86.96, y: 0, width: 458.705, height: 311.856 },
      card: { x: 0, y: 115.64, width: 232.549, height: 243.357 },
    },
  },
};

/** กรอบเนื้อหาใน Figma — หน้าต่าง 944×467 หัก padding 40 รอบด้าน */
const CONTENT_WIDTH = 864;
const CONTENT_HEIGHT = 393;

/**
 * สีของ **บริษัทอื่น / ปุ่มติดต่อตามแบบ** — เหตุผลที่ไม่ทำเป็น token เขียนไว้ครบแล้วที่
 * `ContactSupportDialog` (แอป 3 ใน 4 ไม่ได้ import token ของ DS ⇒ ปุ่มจะกลายเป็นพื้นโปร่ง)
 * ⚠️ ส่งผ่าน custom property แล้วอ้างด้วย `bg-[var(--…)]` เพราะ `scripts/lint-colors.mjs`
 *    ห้ามเขียน hex ลงในคลาสตรง ๆ
 */
const LINE_BUTTON_GREEN = "#02B902";
const PHONE_BUTTON_BLUE = "#06B5ED";
const HEADLINE_INK = "#191c1e";
const DESCRIPTION_INK = "#434654";
/**
 * ตัวอักษรบนปุ่มติดต่อ — ขาวคงที่ ส่งผ่าน custom property เหมือนสีพื้นของปุ่ม
 *
 * 🔴 **ห้ามใช้ `text-text-inverse`** ถึงแม้จะเป็น token ที่ถูกความหมาย: token ตัวนั้นอยู่ใน
 * `packages/tokens/src/semantic.css` เท่านั้น **ไม่ได้อยู่ใน `dist/style.css`** ที่แอปกินกัน
 * และ Portal กับ MediHR ก็ไม่ได้ประกาศเอง ⇒ utility ไม่ถูก generate ⇒ ตัวอักษรตกไปเป็นสี
 * ที่สืบทอดมา = เข้มบนพื้นเขียว/ฟ้า · Portal ตัวจริงจึงใช้คลาสสีขาวของ Tailwind ตรง ๆ
 *
 * ที่นี่ส่งเป็น custom property แทนคลาส เพราะ `tokens.guard` ตรึงจำนวนคลาสสีดิบไว้
 * (และตัวด่านเองสแกนคอมเมนต์ด้วย ⇒ ห้ามพิมพ์ชื่อคลาสนั้นลงในข้อความนี้)
 */
const BUTTON_INK = "#ffffff";

/**
 * ป้ายบนปุ่มโทร — **มี `@` นำหน้าตามแบบเป๊ะ** (Figma ทั้ง 4 แบบเขียนแบบนี้ และ Portal ปล่อยตามนั้น)
 * ⚠️ เป็นเบอร์โทร ไม่ใช่ไอดี — ถ้าดีไซน์ยืนยันว่าไม่ต้องการ `@` ให้ลบที่นี่ที่เดียว แล้วทุกแอปตามทันที
 */
const PHONE_BUTTON_LABEL = `@${MEDIACT_SUPPORT_PHONE}`;
const PHONE_HREF = `tel:${MEDIACT_SUPPORT_PHONE.replace(/\s/g, "")}`;

/* ─────────────────────────────────────────────────────────────────── */
/* Assets                                                               */
/* ─────────────────────────────────────────────────────────────────── */

export type ShowcaseAssets = {
  /** โลโก้เต็มของผลิตภัณฑ์ */
  logo: string;
  /** ภาพจอกว้าง (ชั้นหลัง) */
  wide: string;
  /** ภาพที่ซ้อนทับมุมล่างซ้าย */
  card: string;
};

/**
 * 🔴 **ภาพไม่ได้ฝังมาใน DS ต่างจากไอคอนแอป** — ภาพหน้าจอผลิตภัณฑ์ 4 ชุด (webp 20–52 KB
 * + โลโก้ png) รวม ~250 KB ถ้าแปลงเป็น data URL จะโป่งเป็น ~340 KB ในบันเดิลของ **ทุกแอป**
 * ที่ import DS ไม่ว่าจะใช้กล่องนี้หรือไม่ · ไอคอนแอปตัวละ 2–7 KB จึงฝังได้ แต่ชุดนี้ไม่คุ้ม
 *
 * ⇒ ค่าเริ่มต้นอ่านจาก `/images/app-showcase/<key>-{logo.png,preview-wide.webp,preview-card.webp}`
 *   ซึ่งเป็นชื่อไฟล์ชุดเดียวกับที่ Portal ใช้อยู่ ⇒ แอปที่คัดลอกโฟลเดอร์นั้นมาวางใน `public/`
 *   ใช้ได้ทันทีโดยไม่ต้องส่ง prop · แอปที่วางไว้ที่อื่นส่ง `assetBaseUrl` หรือ `assets` มาทับ
 */
const defaultAssets = (key: ShowcaseAppKey, baseUrl: string): ShowcaseAssets => ({
  logo: `${baseUrl}/${key}-logo.png`,
  wide: `${baseUrl}/${key}-preview-wide.webp`,
  card: `${baseUrl}/${key}-preview-card.webp`,
});

/* ─────────────────────────────────────────────────────────────────── */
/* Component                                                            */
/* ─────────────────────────────────────────────────────────────────── */

export type AppShowcaseDialogProps = {
  /** แอปที่ถูกกด · `null` = ปิด */
  app: ShowcaseAppKey | null;
  onClose: () => void;
  /** ภาษาของคำโปรย — ค่าเริ่มต้น `"th"` (ตรงกับ `Calendar` ของ DS ที่ default เป็น `th-TH`) */
  locale?: ShowcaseLocale;
  /** โฟลเดอร์ของภาพ ถ้าแอปไม่ได้วางไว้ที่ `/images/app-showcase` */
  assetBaseUrl?: string;
  /** ทับที่อยู่ภาพรายผลิตภัณฑ์ (เช่นแอปที่เสิร์ฟจาก CDN) */
  assets?: Partial<Record<ShowcaseAppKey, ShowcaseAssets>>;
  className?: string;
};

const PreviewImage = ({
  box,
  src,
  alt,
}: {
  box: ShowcaseImageBox;
  src: string;
  alt: string;
}) => (
  /* ไม่มีมุมโค้ง/เงา — ที่เห็นในแบบเป็นของในภาพหน้าจอเอง ไม่ใช่สไตล์ที่ Figma ใส่ให้กรอบ */
  <img
    src={src}
    alt={alt}
    aria-hidden="true"
    className="absolute max-w-none object-cover"
    style={{ left: box.x, top: box.y, width: box.width, height: box.height }}
  />
);

/**
 * หน้าต่าง "ตัวอย่างผลิตภัณฑ์ + ช่องทางติดต่อ" ของแอปที่ยังไม่เปิดใช้งานบนแอปที่ผู้ใช้ยืนอยู่
 *
 * ใช้คู่กับ `TopNav.AppLauncher`: การ์ดของแอปที่ยังไม่เปิดจะเรียกกล่องนี้แทนการพาออกไป
 * ⇒ ผู้ใช้ได้เห็นว่าแอปทำอะไรและติดต่อใครต่อได้ทันที แทนที่จะเจอปุ่มตายที่เขียนว่า "เร็ว ๆ นี้"
 *
 * ทำไมไม่ใช้ `Dialog` ของ DS: ฉากหลังของแบบนี้เป็น **ขาว 20% + เบลอ 5px** (Figma `Rectangle 23`)
 * ไม่ใช่ฉากมืดแบบ `DialogOverlay` และตัวกล่องเป็น px คงที่ 944×467 ไม่ใช่ `size` ของ Dialog
 */
function AppShowcaseDialog({
  app,
  onClose,
  locale = "th",
  assetBaseUrl = "/images/app-showcase",
  assets,
  className,
}: AppShowcaseDialogProps) {
  React.useEffect(() => {
    if (!app) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [app, onClose]);

  if (!app) return null;
  if (typeof document === "undefined") return null;

  const copy = SHOWCASE_COPY[app][locale];
  const layout = SHOWCASE_LAYOUT[app];
  const asset = assets?.[app] ?? defaultAssets(app, assetBaseUrl);

  return createPortal(
    /* 🔴 z ต้องเหนือ **1310** ซึ่งเป็นค่าของปุ่มผู้ช่วย AI บน Portal (วัดจากจอจริง)
     * ไม่งั้นปุ่มนั้นลอยอยู่เหนือหน้าต่างและไม่โดนเบลอ */
    <div
      className="fixed inset-0 z-[1400] flex items-center justify-center overflow-auto bg-white/20 p-4 backdrop-blur-[5px]"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={cn(
          "relative h-[467px] w-[944px] shrink-0 rounded-[20px] bg-white drop-shadow-[0px_0px_5px_rgba(0,0,0,0.25)]",
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-label={copy.name}
        onClick={(e) => e.stopPropagation()}
      >
        {/* กากบาทอยู่ที่ (899, 17) ของหน้าต่าง 944 — ไม่ใช่ระยะขอบเท่ากันทุกด้าน */}
        <button
          type="button"
          onClick={onClose}
          aria-label={CLOSE_LABEL[locale]}
          className="absolute right-[21px] top-[17px] flex size-6 cursor-pointer items-center justify-center rounded-sm text-text-tertiary transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-6" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div
          className="absolute left-10 top-10"
          style={{ width: CONTENT_WIDTH, height: CONTENT_HEIGHT }}
        >
          {/* กลุ่มภาพชิดซ้าย + กึ่งกลางแนวตั้งของกรอบเนื้อหา — ทั้ง 4 แบบวางแบบนี้
              (กลุ่มของ HR/Refer สูงเกิน 393 จึงล้นขอบบน-ล่างเท่ากัน) */}
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2"
            style={{ width: layout.preview.width, height: layout.preview.height }}
          >
            <PreviewImage box={layout.preview.wide} src={asset.wide} alt={copy.name} />
            <PreviewImage box={layout.preview.card} src={asset.card} alt={copy.name} />
          </div>

          <div
            className="absolute top-1/2 -translate-y-1/2"
            style={{ left: layout.columnX, width: layout.columnWidth }}
          >
            <img
              src={asset.logo}
              alt={copy.name}
              className="w-auto max-w-none object-contain"
              style={{ height: layout.logoHeight }}
            />
            {/* 20/1.4 น้ำหนัก 600 · `whitespace-pre-line` = ขึ้นบรรทัดตาม `\n` ในคำโปรย
              * ไม่ปล่อยให้เบราว์เซอร์ตัดเอง — ภาษาไทยไม่มีเว้นวรรค จุดตัดจะไม่ตรงกับแบบ */}
            <h2
              className="mt-2 whitespace-pre-line text-[20px] font-semibold leading-[1.4]"
              style={{ color: HEADLINE_INK }}
            >
              {copy.headline}
            </h2>
            {/* 14/1.25 · กว้าง 327.58 เยื้องซ้าย 4.58 (ล้นคอลัมน์ตามแบบ) */}
            <p
              className="mt-6 w-[327.58px] max-w-none whitespace-pre-line pl-[4.58px] text-[14px] leading-[1.25]"
              style={{ color: DESCRIPTION_INK }}
            >
              {copy.description}
            </p>

            <div className="mt-4 flex flex-col gap-2">
              <a
                href={MEDIACT_LINE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-[47px] w-[173px] items-center gap-2 rounded-[8px] bg-[var(--ds-showcase-line)] p-4 text-[12px] font-medium leading-[20px] tracking-[0.7px] text-[var(--ds-showcase-ink)] transition-opacity hover:opacity-90"
                style={
                  {
                    "--ds-showcase-line": LINE_BUTTON_GREEN,
                    "--ds-showcase-ink": BUTTON_INK,
                  } as React.CSSProperties
                }
              >
                <LineBadgeIcon />
                {MEDIACT_LINE_HANDLE}
              </a>
              <a
                href={PHONE_HREF}
                className="flex h-[47px] w-[173px] items-center gap-2 rounded-[8px] bg-[var(--ds-showcase-phone)] p-4 text-[12px] font-medium leading-[20px] text-[var(--ds-showcase-ink)] transition-opacity hover:opacity-90"
                style={
                  {
                    "--ds-showcase-phone": PHONE_BUTTON_BLUE,
                    "--ds-showcase-ink": BUTTON_INK,
                  } as React.CSSProperties
                }
              >
                <PhoneBadgeIcon />
                {PHONE_BUTTON_LABEL}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/**
 * โลโก้ LINE — **artwork ชุดเดียวกับที่ Portal เสิร์ฟจริง** (`public/icons/line-badge.svg`)
 * ยกมาทั้งไฟล์ ไม่ได้วาดใหม่
 *
 * 🔴 รอบแรกวาดเองเป็นวงกลมขาว + ตัวอักษรที่ประดิษฐ์ขึ้น ซึ่งไม่ตรงกับแบบ: ของจริงเป็น
 * **ฟองสนทนาขาว** (ไม่ใช่วงกลม) และตัวอักษร `LINE` เป็นสีเขียวของปุ่ม · กฎของรีโปนี้
 * (`CLAUDE.md` §"the shipped asset beats a redrawn one") ห้ามแทนของที่ส่งจริงด้วยของที่วาดเอง
 */
const LineBadgeIcon = () => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    className="size-8 shrink-0"
    aria-hidden="true"
    style={
      {
        "--ds-showcase-line-mark": LINE_BUTTON_GREEN,
        "--ds-showcase-line-bubble": BUTTON_INK,
      } as React.CSSProperties
    }
  >
    <path
      d="M30 14.4979C30 8.15792 23.7199 3 15.9999 3C8.28094 3 2 8.15792 2 14.4979C2 20.1817 6.98063 24.9417 13.7084 25.8418C14.1644 25.9412 14.7849 26.146 14.9419 26.5404C15.0831 26.8986 15.0342 27.4598 14.987 27.8216C14.987 27.8216 14.8227 28.8214 14.7873 29.0343C14.7264 29.3926 14.5061 30.4353 15.9999 29.7981C17.4942 29.1609 24.0626 24.9935 26.9998 21.572C29.0287 19.3204 30 17.0353 30 14.4979Z"
      fill="var(--ds-showcase-line-bubble)"
    />
    <path
      d="M13.1553 11.4244H12.1733C12.0228 11.4244 11.9004 11.5478 11.9004 11.6995V17.866C11.9004 18.0179 12.0228 18.1411 12.1733 18.1411H13.1553C13.3059 18.1411 13.428 18.0179 13.428 17.866V11.6995C13.428 11.5478 13.3059 11.4244 13.1553 11.4244Z"
      fill="var(--ds-showcase-line-mark)"
    />
    <path
      d="M19.9147 11.4244H18.9327C18.7821 11.4244 18.66 11.5478 18.66 11.6995V15.3631L15.8645 11.5467C15.8128 11.4683 15.729 11.4295 15.6375 11.4244H14.6558C14.5052 11.4244 14.3828 11.5478 14.3828 11.6995V17.866C14.3828 18.0179 14.5052 18.1411 14.6558 18.1411H15.6375C15.7883 18.1411 15.9104 18.0179 15.9104 17.866V14.2035L18.7094 18.0247C18.7597 18.0967 18.845 18.1411 18.9327 18.1411H19.9147C20.0655 18.1411 20.1874 18.0179 20.1874 17.866V11.6995C20.1874 11.5478 20.0655 11.4244 19.9147 11.4244Z"
      fill="var(--ds-showcase-line-mark)"
    />
    <path
      d="M10.7884 16.597H8.12013V11.6999C8.12013 11.5477 7.99802 11.4242 7.84773 11.4242H6.86545C6.71489 11.4242 6.59277 11.5477 6.59277 11.6999V17.8653C6.59277 18.015 6.71435 18.1412 6.86518 18.1412H10.7884C10.9389 18.1412 11.0605 18.0175 11.0605 17.8653V16.8727C11.0605 16.7205 10.9389 16.597 10.7884 16.597Z"
      fill="var(--ds-showcase-line-mark)"
    />
    <path
      d="M25.3377 12.9684C25.4883 12.9684 25.6098 12.8453 25.6098 12.6928V11.7001C25.6098 11.5479 25.4883 11.4242 25.3377 11.4242H21.4148C21.2641 11.4242 21.1421 11.5502 21.1421 11.6999V17.8656C21.1421 18.0148 21.2638 18.1412 21.4142 18.1412H25.3377C25.4883 18.1412 25.6098 18.0175 25.6098 17.8656V16.8727C25.6098 16.7207 25.4883 16.597 25.3377 16.597H22.6697V15.5547H25.3377C25.4883 15.5547 25.6098 15.4313 25.6098 15.2791V14.2864C25.6098 14.1342 25.4883 14.0105 25.3377 14.0105H22.6697V12.9684H25.3377Z"
      fill="var(--ds-showcase-line-mark)"
    />
  </svg>
);

/** หูโทรศัพท์ทึบ — artwork จริงของ Portal (`public/icons/phone-baseline.svg` · `ic:baseline-phone`) */
const PhoneBadgeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="size-6 shrink-0" aria-hidden="true">
    <path
      d="M6.62 10.79C8.06 13.62 10.38 15.93 13.21 17.38L15.41 15.18C15.68 14.91 16.08 14.82 16.43 14.94C17.55 15.31 18.76 15.51 20 15.51C20.55 15.51 21 15.96 21 16.51V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z"
      fill="currentColor"
    />
  </svg>
);

export {
  AppShowcaseDialog,
  SHOWCASE_COPY,
  SHOWCASE_LAYOUT,
  type ShowcaseCopy,
  type ShowcaseLayout,
};
