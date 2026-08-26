import * as React from "react";
import { Bell, ChevronDown, LogOut, Settings } from "lucide-react";
import { cn } from "../lib/cn";
import { Avatar } from "../ui/Avatar";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "../overlay/Popover";
import {
  sidebarHideDataUrl,
  sidebarShowDataUrl,
  mediactLogoDataUrl,
} from "./_app-icons/data";
import { AppMark } from "../brand/AppMark";
import {
  appMarkLabels,
  type MediactAppKey,
} from "../brand/app-marks";
import {
  AppShowcaseDialog,
  type ShowcaseAppKey,
  type ShowcaseAssets,
  type ShowcaseLocale,
} from "../overlay/AppShowcaseDialog";

/* ─────────────────────────────────────────────────────────────────── */
/* Root                                                                 */
/* ─────────────────────────────────────────────────────────────────── */

export type TopNavProps = React.ComponentProps<"header"> & {
  /** Render as fixed/sticky bar that floats with rounded corners. Default `false` (inline). */
  floating?: boolean;
};

const TopNav = React.forwardRef<HTMLElement, TopNavProps>(function TopNav(
  { className, floating, children, ...props },
  ref,
) {
  return (
    <header
      ref={ref}
      className={cn(
        /* 📐 วัดจาก Portal: สูง **72** (`h-18`) · pad-x **20** · มุม 15
         * · เส้นคั่น **ด้านล่างอย่างเดียว** `gray-100` ไม่ใช่กรอบรอบด้าน · เงา `md`
         * ของเดิมเป็น 64 / pad 16 / กรอบรอบด้าน / เงา `sm` — ไม่ตรงสักข้อ */
        "flex h-18 w-full items-center gap-2 rounded-[15px] border-b border-gray-100 bg-white px-5 shadow-md",
        floating && "sticky top-0 z-30",
        className,
      )}
      {...props}
    >
      {children}
    </header>
  );
});

/* ─────────────────────────────────────────────────────────────────── */
/* Toggle — พับ/กางแถบเมนูซ้าย                                          */
/* ─────────────────────────────────────────────────────────────────── */

export type TopNavToggleProps = Omit<
  React.ComponentProps<"button">,
  "children" | "onToggle"
> & {
  /** แถบเมนูซ้ายยุบอยู่หรือไม่ — คุมว่าจะโชว์ไอคอน "กาง" หรือ "พับ" */
  collapsed?: boolean;
  onToggle?: (next: boolean) => void;
  /**
   * ข้อความสำหรับ `title`/`aria-label` — แอปส่งคำแปลมาเอง (DS ไม่มี i18n)
   *
   * ⚠️ ปุ่มนี้มีแต่ไอคอน ถ้าไม่ส่งมา โปรแกรมอ่านหน้าจอจะเจอปุ่มไม่มีชื่อ
   * (บทเรียนเดียวกับปุ่มเมนูตอน `Sidebar` ยุบ) จึงมีค่าตั้งต้นภาษาอังกฤษให้
   */
  labels?: { expand: string; collapse: string };
};

/**
 * ปุ่มพับ/กางแถบเมนูซ้าย — ไอคอนเป็นไฟล์เดียวกับที่ Portal ใช้จริง
 *
 * 📐 วัดจาก Portal: **32×32** · มุม 8 · ไอคอน **20×20** · hover พื้นเทาอ่อน
 */
const TopNavToggle = React.forwardRef<HTMLButtonElement, TopNavToggleProps>(
  function TopNavToggle(
    {
      className,
      collapsed = false,
      onToggle,
      labels = { expand: "Expand menu", collapse: "Collapse menu" },
      ...props
    },
    ref,
  ) {
    const name = collapsed ? labels.expand : labels.collapse;
    return (
      <button
        ref={ref}
        type="button"
        onClick={() => onToggle?.(!collapsed)}
        title={name}
        aria-label={name}
        aria-expanded={!collapsed}
        className={cn(
          /* สีเดียวกับปุ่มไอคอนอีกสามตัวในแถบ (`iconButtonClass`) — ของเดิม `text-gray-700`
           * ให้ `#6b747e` (theme.css ประกาศไว้จริง วัดยืนยันแล้ว) ซึ่งต่างจากปุ่มข้าง ๆ
           * โดยไม่มีเหตุผล · `text-text-body` เป็น token ตรง ๆ ไม่ต้องพึ่งชื่อที่ชนกับ Tailwind */
          "inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-text-body transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
          className,
        )}
        {...props}
      >
        <img
          src={collapsed ? sidebarShowDataUrl : sidebarHideDataUrl}
          alt=""
          aria-hidden
          className="size-5"
        />
      </button>
    );
  },
);

/* ─────────────────────────────────────────────────────────────────── */
/* Brand                                                                */
/* ─────────────────────────────────────────────────────────────────── */

export type TopNavBrandProps = React.ComponentProps<"div"> & {
  logo?: React.ReactNode;
};

const TopNavBrand = React.forwardRef<HTMLDivElement, TopNavBrandProps>(
  function TopNavBrand({ className, logo, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-3 truncate", className)}
        {...props}
      >
        {logo && <span className="shrink-0">{logo}</span>}
        {/* วัดจาก Portal: **18px/700** สี `#2D3748`
          * 🔴 `text-text-primary` alias ไปสีแบรนด์ ⇒ ชื่อโรงพยาบาลเปลี่ยนสีตามแอป
          * ใช้ `text-text-heading` (`#3f454a`) ซึ่งเป็นค่าที่ใกล้ที่สุดในชั้น semantic
          * (`#2d3748` มีอยู่แค่ใน primitive `--mx-slate-700` ซึ่งไม่ generate utility) */}
        <span className="truncate text-[18px] font-bold text-text-heading">
          {children}
        </span>
      </div>
    );
  },
);

/* ─────────────────────────────────────────────────────────────────── */
/* Spacer                                                               */
/* ─────────────────────────────────────────────────────────────────── */

const TopNavSpacer = ({ className }: { className?: string }) => (
  <div className={cn("flex-1", className)} aria-hidden="true" />
);

/* ─────────────────────────────────────────────────────────────────── */
/* Icon button                                                          */
/* ─────────────────────────────────────────────────────────────────── */

/** ปุ่มไอคอนฝั่งขวา — วัดจาก Portal: ไอคอน **28** · pad 8 · วงกลม
 *
 * ⚠️ สีที่วัดได้คือ `rgb(107,116,126)` ซึ่ง `--color-gray-700` ของ DS ตั้งไว้ตรงเป๊ะ
 * **แต่ใช้ `text-gray-700` ไม่ได้** — วัดในเบราว์เซอร์แล้วออกมาเป็น
 * `oklch(0.446 0.03 256.802)` คือค่า `gray-700` ของ Tailwind เอง ไม่ใช่ของ DS
 * (กับดักชื่อชนที่ §3 เตือนไว้ — `bg-gray-50` บังเอิญได้ค่าถูก แต่ตัวนี้ไม่)
 * จึงใช้ `text-text-body` (`#535a61`) ซึ่งเข้มกว่าเล็กน้อยแต่เป็น token จริง */
/* `cursor-pointer` — preflight v4 ปล่อย `<button>` ไว้ที่ลูกศรปกติ (ดู `Tabs.tsx` ที่บันทึกเหตุไว้) */
const iconButtonClass =
  "inline-flex size-11 cursor-pointer shrink-0 items-center justify-center rounded-full text-text-body transition-colors hover:bg-gray-50 hover:text-text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 [&_svg]:size-7";

/* ─────────────────────────────────────────────────────────────────── */
/* AppLauncher — Mediact ecosystem app catalog                          */
/* ─────────────────────────────────────────────────────────────────── */

/**
 * แอปในระบบนิเวศ Mediact — **นิยามย้ายไปอยู่กับตัวเครื่องหมายแล้ว** ที่
 * [`brand/app-marks.ts`](../brand/app-marks.ts) · re-export ไว้ที่นี่เพราะเป็นชื่อที่แอปต่าง ๆ
 * import จาก `TopNav` มาตั้งแต่ต้น การย้ายเงียบ ๆ จะทำให้ของที่ใช้อยู่พัง
 *
 * เหตุผลที่ย้าย: ชุดคีย์กับชุดเครื่องหมายต้องเพิ่ม/ลดพร้อมกันเสมอ ⇒ อยู่คนละไฟล์เมื่อไหร่
 * ก็มีโอกาสที่ `Record<MediactAppKey, …>` ฝั่งหนึ่งครบแต่อีกฝั่งไม่ครบ
 *
 * 🔄 **กลับมาครบ 6 ตัว 2026-08-16** — รอบก่อนตัด `medipay`/`medirefer` ฯลฯ ออก (2026-08-09)
 * เพราะช่องที่เขียนว่า "เร็ว ๆ นี้" เป็นสัญญาที่ไม่มีใครถือ · ตอนนี้กลับมาได้เพราะ **ไม่ใช่ป้ายตาย
 * อีกแล้ว** — Portal ทำหน้าต่างตัวอย่างผลิตภัณฑ์ + ช่องทางติดต่อไว้บน staging แล้ว
 * (`feat/app-launcher-coming-soon`) ⇒ กดแล้วผู้ใช้ได้เห็นว่าแอปทำอะไรและติดต่อใครต่อได้ทันที
 *
 * ⚠️ `medistock`/`medicare` **ยังไม่กลับมา** — ยังไม่มีทั้งแบบและคำโปรยจาก Figma
 * ⇒ ถ้าเติมโดยไม่มีเนื้อหา จะกลายเป็นป้ายตายแบบเดิมอีกรอบ
 */
export type { MediactAppKey };

export type MediactAppConfig = {
  /** Where this app lives. Falsy → tile is rendered as not-clickable. */
  baseUrl?: string;
  /** Show "Coming Soon" subtitle and disable the tile. */
  comingSoon?: boolean;
  /**
   * แอปนี้ยังไม่เปิดใช้งานบนโรงพยาบาลนี้ ⇒ **กดได้** แต่เปิดหน้าต่างตัวอย่างผลิตภัณฑ์
   * (`AppShowcaseDialog`) แทนการพาออกไป — ต่างจาก `comingSoon` ที่เป็นป้ายตายกดไม่ได้
   *
   * ⚠️ มีเนื้อหาเฉพาะ 4 ตัวที่ Figma ทำแบบไว้ (`ShowcaseAppKey`) ⇒ ตั้งกับ `mediwork`/`medimatch`
   *    จะไม่มีผล เพราะไม่มีคำโปรย/ภาพให้แสดง
   */
  showcase?: boolean;
  /** Disable the tile (greyed out, not clickable) — e.g. tenant has no purchase. */
  disabled?: boolean;
  /** Highlight current app. */
  active?: boolean;
  /** Override label. */
  label?: string;
  /** Override icon. */
  icon?: React.ReactNode;
};

export type AppLauncherProps = {
  apps: Partial<Record<MediactAppKey, MediactAppConfig>>;
  /** ลำดับการแสดง ค่าเริ่มต้น: mediwork → medimatch → medihr */
  order?: MediactAppKey[];
  /** Override default `<a href>` navigation (e.g. for SPA routing). */
  onAppClick?: (key: MediactAppKey, app: MediactAppConfig) => void;
  /** Tooltip / aria-label for the trigger. Default "Apps". */
  label?: string;
  /** Subtitle shown beneath disabled / coming-soon tiles. */
  comingSoonText?: string;
  /**
   * ภาษาของ **หน้าต่างตัวอย่างผลิตภัณฑ์** — คำโปรยอยู่ใน DS ทั้ง th/en (ดู `AppShowcaseDialog`)
   * ⇒ แอปไม่ต้องมีคีย์ i18n ของกล่องนี้ ส่งแค่ภาษาที่ผู้ใช้เลือกอยู่
   */
  showcaseLocale?: ShowcaseLocale;
  /** โฟลเดอร์ภาพของหน้าต่างตัวอย่าง ถ้าไม่ได้วางที่ `/images/app-showcase` */
  showcaseAssetBaseUrl?: string;
  /** ทับที่อยู่ภาพรายผลิตภัณฑ์ */
  showcaseAssets?: Partial<Record<ShowcaseAppKey, ShowcaseAssets>>;
  /**
   * ปุ่มก้นลิ้นชักที่พาไปหน้าตั้งค่าของ Portal — ของจริงมีทุกแอป
   *
   * ข้อความส่งมาจากแอปเสมอ (DS ไม่มี i18n)
   */
  settingsAction?: {
    label: React.ReactNode;
    href?: string;
    onClick?: (e: React.MouseEvent) => void;
  };
  className?: string;
};

/**
 * ชื่อที่แสดงบนการ์ด — **ตัวเครื่องหมายไม่ได้อยู่ที่นี่แล้ว**
 *
 * ย้ายไป [`brand/app-marks.ts`](../brand/app-marks.ts) ทั้งชุด (2026-08-25) เพราะแอปอื่นต้องใช้
 * เครื่องหมายเดียวกันนี้นอกลิ้นชักด้วย — หัวรางของ hr-web เคยชี้ไปที่ไฟล์ใน `public/` ของตัวเอง
 * ⇒ โลโก้ชุดเดียวกันมีสองสำเนาที่เปลี่ยนคนละเวลา
 *
 * ✅ **`inkScale` หายไปทั้งหมด** — เดิมมีตัวคูณย่อกล่องรายแอป (`medioncloud` 0.625 · `medirefer`
 * 0.667 · `medipay` 0.625) เพราะไฟล์ชุดเก่ามีหมึกชนขอบบ้างไม่ชนบ้าง และ `medipay` เป็น PNG
 * ที่เติมขอบใน viewBox ไม่ได้ · ชุดใหม่เป็น SVG ทั้ง 12 ไฟล์ ⇒ เติมขอบที่ `viewBox` ได้ทุกตัว
 * ตามที่ `CLAUDE.md` §8 บอกให้ทำ ("pad the viewBox until the ink heights agree") ⇒ ทุกใบมาถึงที่นี่
 * ด้วยสัดส่วนหมึกเท่ากันแล้ว ไม่ต้องมีตัวเลขชดเชยที่ฝั่ง component อีก
 */
const DEFAULT_APP_LABELS = appMarkLabels;

/** ลำดับตาม Figma: Work · Match · HR / On cloud · Refer · Pay (กริด 3 คอลัมน์ = 2 แถวพอดี) */
const DEFAULT_APP_ORDER: MediactAppKey[] = [
  "mediwork",
  "medimatch",
  "medihr",
  "medioncloud",
  "medirefer",
  "medipay",
];

/** แอปที่มีแบบหน้าต่างตัวอย่างจาก Figma — ตัวอื่นตั้ง `showcase` ไปก็ไม่มีอะไรให้แสดง */
const SHOWCASE_KEYS = new Set<string>([
  "medihr",
  "medioncloud",
  "medirefer",
  "medipay",
]);

const isShowcaseKey = (key: MediactAppKey): key is ShowcaseAppKey =>
  SHOWCASE_KEYS.has(key);

/** ปุ่มไปหน้าตั้งค่า (Portal) — วัดจากของจริง: เว้นบน 24 · เต็มความกว้าง · py 12
 * · มุม 16 · พื้น `#EAF4FF` ตัวอักษร `#1E78F2` · 15px/500
 * ⚠️ ต้องเป็นฟ้า **คงที่** — ปุ่มนี้พาไป Portal เสมอไม่ว่าเปิดจากแอปไหน
 * `text-info-blue-primary` ใช้ไม่ได้เพราะ alias ไป `--color-brand-active`
 * ⇒ จะเปลี่ยนสีตามแอปที่ยืนอยู่
 *
 * 🔴 ใช้ `info-blue-800` (`#1e48cc`) ไม่ใช่ `#1E78F2` ของ Portal — ของ Portal บนพื้น
 * `#EAF4FF` วัดได้ **3.80:1** ตกเกณฑ์ข้อความ 4.5:1 (`info-blue-600` ก็ตก 3.42:1)
 * ตัวที่เลือกได้ **6.85:1** */
const settingsActionClass =
  "mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-info-blue-50 py-3 text-[15px] font-medium text-info-blue-800 transition-colors hover:bg-info-blue-100 [&_svg]:size-5";

/** 9-dot grid icon used by the AppLauncher trigger. */
const NineDotIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    {[5, 12, 19].flatMap((cy) =>
      [5, 12, 19].map((cx) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.4" />
      )),
    )}
  </svg>
);

function AppLauncher({
  apps,
  order = DEFAULT_APP_ORDER,
  onAppClick,
  label = "Apps",
  comingSoonText = "Coming Soon",
  showcaseLocale = "th",
  showcaseAssetBaseUrl,
  showcaseAssets,
  settingsAction,
  className,
}: AppLauncherProps) {
  const visible = order.filter((key) => apps[key] != null);

  /**
   * 🔴 **ลิ้นชักถือหน้าต่างตัวอย่างไว้เอง ไม่ยกให้ผู้เรียก** — ถ้าให้แต่ละแอปต่อเอง จะได้
   * "กดการ์ดแล้วไม่เกิดอะไร" ในแอปที่ลืมต่อ ซึ่งเป็นอาการเดียวกับป้าย "เร็ว ๆ นี้" ที่เพิ่งเลิกไป
   * · ผู้เรียกที่อยากคุมเองยังทำได้ผ่าน `onAppClick` (ยิงก่อนเสมอ)
   */
  const [showcase, setShowcase] = React.useState<ShowcaseAppKey | null>(null);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={label}
          className={cn(iconButtonClass, className)}
        >
          <NineDotIcon />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={16}
        className="w-[340px] rounded-3xl border border-gray-50 p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)]"
      >
        {/* 📐 ของจริงใน Portal ใช้ **โลโก้เต็ม** `mediact-logo.svg` ที่ 100×24
          * ไม่ได้เอาเครื่องหมายมาวางคู่กับคำว่า "MediAct" แบบที่นี่เคยทำ
          * ซึ่งเท่ากับเขียนชื่อแบรนด์ซ้ำสองครั้งข้างกัน */}
        <div className="mb-6 flex items-center justify-center border-b border-gray-200 pb-4">
          <img
            src={mediactLogoDataUrl}
            alt="MediAct"
            className="h-6 w-[100px] object-contain"
          />
        </div>
        <div className="grid grid-cols-3 gap-x-2 gap-y-6">
          {visible.map((key) => {
            const config = apps[key]!;
            const label = config.label ?? DEFAULT_APP_LABELS[key];
            return (
              <AppLauncherTile
                key={key}
                appKey={key}
                config={config}
                label={label}
                icon={
                  config.icon ?? (
                    /* การ์ดในลิ้นชักเป็นพื้นขาว ⇒ โทน `primary` เสมอ
                     *
                     * `fit="grid"` คือหัวใจของแถวนี้ — ไฟล์เครื่องหมายชิดหมึกทุกใบ ⇒ ถ้าปล่อย
                     * ให้เต็มกล่อง ใบที่ทรงต่างกันจะดูใหญ่ไม่เท่ากัน · โหมดนี้ย่อความสูงหมึก
                     * ให้เท่ากันทุกใบ (62.5% — ตัวเลขและที่มาอยู่ใน `AppMark`)
                     * · `min-h-0`/`object-contain` มาจาก `AppMark` เองแล้ว */
                    <AppMark
                      app={key}
                      fit="grid"
                      alt={label}
                      className="size-full"
                    />
                  )
                }
                comingSoonText={comingSoonText}
                onClick={onAppClick}
                onShowcase={
                  config.showcase && isShowcaseKey(key)
                    ? () => setShowcase(key)
                    : undefined
                }
              />
            );
          })}
        </div>

        {settingsAction && (
          /* ทรง/สีอยู่ที่ `settingsActionClass` — เหตุผลของสีฟ้าคงที่เขียนไว้ที่นั่น */
          <PopoverClose asChild>
            {/* 🔴 ไม่มี `href` ต้องเป็น `<button>` ไม่ใช่ `<a>` เปล่า ๆ — anchor ที่ไม่มี href
              * ไม่อยู่ในลำดับ tab และ Enter ไม่ทำงาน ⇒ ปุ่มที่กดได้เฉพาะด้วยเมาส์
              * (แอปที่พาไปหน้าในตัวเองด้วย router จะส่งแต่ `onClick` เสมอ) */}
            {settingsAction.href ? (
              <a
                href={settingsAction.href}
                onClick={settingsAction.onClick}
                className={settingsActionClass}
              >
                <Settings aria-hidden />
                {settingsAction.label}
              </a>
            ) : (
              <button
                type="button"
                onClick={settingsAction.onClick}
                className={settingsActionClass}
              >
                <Settings aria-hidden />
                {settingsAction.label}
              </button>
            )}
          </PopoverClose>
        )}
      </PopoverContent>

      {/* หน้าต่างตัวอย่างผลิตภัณฑ์ — คำโปรย th/en อยู่ใน DS แอปไม่ต้องส่งข้อความมา */}
      <AppShowcaseDialog
        app={showcase}
        onClose={() => setShowcase(null)}
        locale={showcaseLocale}
        assetBaseUrl={showcaseAssetBaseUrl}
        assets={showcaseAssets}
      />
    </Popover>
  );
}

function AppLauncherTile({
  appKey,
  config,
  label,
  icon,
  comingSoonText,
  onClick,
  onShowcase,
}: {
  appKey: MediactAppKey;
  config: MediactAppConfig;
  label: string;
  icon: React.ReactNode;
  comingSoonText: string;
  onClick?: (key: MediactAppKey, app: MediactAppConfig) => void;
  /** มีค่า = การ์ดนี้เปิดหน้าต่างตัวอย่างแทนการพาออกไป */
  onShowcase?: () => void;
}) {
  const isComingSoon = !!config.comingSoon;
  const disabled =
    config.disabled ||
    isComingSoon ||
    (!config.baseUrl && !onClick && !onShowcase);

  const tileClass = cn(
    "group flex flex-col items-center justify-start text-center",
    !disabled &&
      "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 rounded-md",
    disabled && "cursor-not-allowed",
  );

  const iconBox = (
    <span
      className={cn(
        "mb-2 flex size-12 items-center justify-center rounded-xl border border-gray-100 bg-white transition-transform",
        !disabled && "group-hover:scale-105",
        config.active && !disabled && "ring-2 ring-brand/40",
        config.disabled && "opacity-50 grayscale",
      )}
    >
      <span className="flex size-8 items-center justify-center [&_img]:size-full [&_img]:object-contain">
        {icon}
      </span>
    </span>
  );

  const labelEl = (
    <>
      <span className="text-[13px] font-medium text-text-body">{label}</span>
      {isComingSoon && (
        <span className="mt-0.5 text-[10px] text-gray-400">
          {comingSoonText}
        </span>
      )}
    </>
  );

  if (disabled) {
    /* ไม่ห่อ `PopoverClose` — การ์ดที่กดไม่ได้ต้องไม่ปิดลิ้นชักตอนโดนคลิก
     * ไม่งั้นผู้ใช้จะอ่านว่า "กดแล้วมันทำอะไรสักอย่าง" ทั้งที่ไม่ได้ทำ */
    return (
      <div className={tileClass} aria-disabled="true">
        {iconBox}
        {labelEl}
      </div>
    );
  }
  /* 🔴 เลือกแอปแล้วลิ้นชักต้องปิด — Radix Popover ปิดให้เฉพาะตอนคลิก**นอก** เนื้อหา
   * คลิกการ์ดข้างในจึงค้างเปิดอยู่ ทับหน้าที่เพิ่งเปิดไป (โดยเฉพาะเคส `onAppClick`
   * ที่เปิดแท็บใหม่ — กลับมาแท็บเดิมแล้วเจอลิ้นชักค้าง) */
  /* 🔴 การ์ดที่เปิดหน้าต่างตัวอย่าง **ต้องปิดลิ้นชักด้วย** — ไม่งั้นลิ้นชักลอยทับหน้าต่างที่เพิ่งเปิด
   * · `onAppClick` ยังถูกยิงก่อนเสมอ เผื่อแอปอยากเก็บสถิติ/คุมเอง */
  if (onShowcase) {
    return (
      <PopoverClose asChild>
        <button
          type="button"
          onClick={() => {
            onClick?.(appKey, config);
            onShowcase();
          }}
          className={tileClass}
        >
          {iconBox}
          {labelEl}
        </button>
      </PopoverClose>
    );
  }
  if (onClick) {
    return (
      <PopoverClose asChild>
        <button
          type="button"
          onClick={() => onClick(appKey, config)}
          className={tileClass}
        >
          {iconBox}
          {labelEl}
        </button>
      </PopoverClose>
    );
  }
  return (
    <PopoverClose asChild>
      <a href={config.baseUrl} className={tileClass}>
        {iconBox}
        {labelEl}
      </a>
    </PopoverClose>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* NotificationBell                                                     */
/* ─────────────────────────────────────────────────────────────────── */

export type NotificationBellProps = React.ComponentProps<"button"> & {
  hasUnread?: boolean;
  unreadCount?: number;
  label?: string;
};

const NotificationBell = React.forwardRef<
  HTMLButtonElement,
  NotificationBellProps
>(function NotificationBell(
  { hasUnread, unreadCount, label = "Notifications", className, ...props },
  ref,
) {
  const showCount = unreadCount != null && unreadCount > 0;
  const showDot = !showCount && hasUnread;
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      className={cn(iconButtonClass, "relative", className)}
      {...props}
    >
      <Bell />
      {showDot && (
        <span
          aria-hidden="true"
          className="absolute right-2.5 top-2.5 size-2 rounded-full bg-cherry-red-600 ring-2 ring-white"
        />
      )}
      {showCount && (
        <span
          aria-hidden="true"
          className="absolute right-1 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-cherry-red-600 px-1 text-[10px] font-semibold text-white ring-2 ring-white"
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
});

/* ─────────────────────────────────────────────────────────────────── */
/* UserMenu                                                             */
/* ─────────────────────────────────────────────────────────────────── */

export type UserMenuItem = {
  label: React.ReactNode;
  onClick?: () => void;
  href?: string;
};

export type UserMenuProps = {
  user: {
    name?: string;
    src?: string;
    role?: React.ReactNode;
    /**
     * สิ่งที่แสดงแทนรูปเมื่อไม่มีรูป — ไม่ส่งก็ได้อักษรย่อจากชื่อ (ค่าเริ่มต้นของ `Avatar`)
     *
     * มีไว้เพราะบางแอปใช้ **ไอคอนคน** ไม่ใช่อักษรย่อ · ถ้าไม่มีช่องนี้ การย้ายมาใช้
     * `UserMenu` จะเปลี่ยนสิ่งที่ผู้ใช้เห็นโดยไม่ได้ตั้งใจ
     */
    fallback?: React.ReactNode;
  };
  /** Body items rendered between the role and the bottom row. */
  items?: UserMenuItem[];
  /** Click handler for the Log Out button. Pass `null` to hide the button. */
  onLogout?: (() => void) | null;
  logoutLabel?: React.ReactNode;
  /** Slot rendered to the left of the Log Out button — typically a language switcher. */
  bottomLeft?: React.ReactNode;
  /** Tooltip / aria-label for the trigger. Default "Account". */
  label?: string;
  className?: string;
};

/**
 * Profile dropdown — matches `mediact-portal-web/src/components/shared/Sidebar.tsx`'s
 * profile menu: centered avatar + name + role header, full-width menu items, and
 * a bottom row that pairs an optional language switcher with a red Log Out button.
 */
function UserMenu({
  user,
  items,
  onLogout,
  logoutLabel = "Log Out",
  bottomLeft,
  label = "Account",
  className,
}: UserMenuProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={label}
          className={cn(
            "group inline-flex cursor-pointer items-center gap-2 rounded-full p-0.5 pr-1 text-body-sm font-medium text-text-body transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
            className,
          )}
        >
          <Avatar
            size="md"
            src={user.src}
            name={user.name}
            fallback={user.fallback}
            className="border-2 border-gray-100"
          />
          <ChevronDown className="size-4 text-gray-400 transition-transform group-data-[state=open]:rotate-180 group-hover:text-gray-600" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={16}
        className="w-[310px] rounded-3xl border border-gray-50 px-6 py-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)]"
      >
        <div className="mb-5 flex flex-col items-center">
          <Avatar
            src={user.src}
            name={user.name}
            fallback={user.fallback}
            className="mb-3 size-[60px] border-2 border-gray-100"
          />
          {user.name && (
            <h3 className="text-body-lg font-semibold text-text-heading">
              {user.name}
            </h3>
          )}
          {user.role && (
            /* ระยะเป็น inline — mediwork มี `p{margin-top:0}` แบบไม่มี layer ที่ชนะ `mt-*`
               ของ Tailwind (เหตุผลเต็มอยู่ที่ `AppShowcaseDialog`) · 2px จึงหายเงียบที่นั่น */
            <p
              className="text-[15px] font-medium text-text-tertiary"
              style={{ marginTop: 2 }}
            >
              {user.role}
            </p>
          )}
        </div>

        <hr className="mb-2 border-gray-100" />

        {items?.map((item, idx) => (
          <UserMenuItemButton key={idx} item={item} />
        ))}

        {(bottomLeft || onLogout !== null) && (
          <>
            <hr className="mb-5 mt-2 border-gray-100" />
            <div className="flex items-center justify-between gap-3">
              {bottomLeft ?? <span />}
              {onLogout !== null && (
                <PopoverClose asChild>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="flex cursor-pointer items-center gap-2 text-[16px] font-medium text-cherry-red-600 transition-colors hover:text-cherry-red-800"
                  >
                    <LogOut className="size-5" />
                    {logoutLabel}
                  </button>
                </PopoverClose>
              )}
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}

/* 🔴 ทุกอย่างที่กดแล้ว "ไปที่อื่น" ต้องปิดเมนูด้วย — Radix Popover ปิดให้เฉพาะตอนคลิก
 * **นอก** เนื้อหา คลิกรายการข้างในจึงค้างเปิดคาหน้าใหม่ที่เพิ่งเปิดไป
 * (ของเดิมในแอปปิดเองด้วย `setState` ตอนกด — ย้ายมาใช้ `UserMenu` แล้วต้องไม่หายไป) */
function UserMenuItemButton({ item }: { item: UserMenuItem }) {
  const className =
    "block w-full cursor-pointer text-left py-3 text-[16px] font-medium text-text-body transition-colors hover:text-text-primary";
  if (item.href) {
    return (
      <PopoverClose asChild>
        <a href={item.href} className={className}>
          {item.label}
        </a>
      </PopoverClose>
    );
  }
  return (
    <PopoverClose asChild>
      <button type="button" onClick={item.onClick} className={className}>
        {item.label}
      </button>
    </PopoverClose>
  );
}

TopNav.displayName = "TopNav";
TopNavBrand.displayName = "TopNavBrand";
NotificationBell.displayName = "NotificationBell";

export {
  TopNav,
  TopNavToggle,
  TopNavBrand,
  TopNavSpacer,
  AppLauncher,
  NotificationBell,
  UserMenu,
};
