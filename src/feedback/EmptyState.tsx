import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "../lib/cn";

/* ────────────────────────────────────────────────────────────────────────────
 * "ที่นี่ไม่มีอะไร และนี่คือเหตุผล"
 *
 * สำรวจของจริง 2026-08-09 — **53 ไฟล์ที่พูดเรื่องนี้ · หน้าตาไม่ตรงกันสักกลุ่ม**
 *
 *   Portal `EmptyState`     วงกลม `#e3f2fd` · ไอคอน 60px · ผู้เรียกกำหนดสีเอง
 *   MediHR `EmptyState`     **คัดลอกจาก Portal ทั้งไฟล์** สีเดียวกันเป๊ะ
 *   MediHR `SectionEmpty`   สี่เหลี่ยมมนขนาด 64 · `teal-50` · ไอคอน `teal-500`
 *   Mediwork `EmptyState`   วงกลม 72 · `#D4F1EF` · **ไอคอนสีขาว** บังคับ 30px
 *   Medimatch (ในตาราง)     ไม่มีป้ายเลย · ไอคอนเทาจาง opacity 20%
 *
 * 🔴 **ไม่มีแอปไหนใช้ "รูป" เลยสักที่ — เป็นไอคอนล้วนทั้ง 53 ไฟล์**
 * (ที่ค้นเจอ `<img>` 2 ไฟล์ พิสูจน์แล้วว่าเป็นรูปโปรไฟล์ในตาราง ไม่ใช่ภาพประกอบ)
 * ⇒ ช่อง `image` ที่นี่เป็น**ของใหม่** ไม่ได้ยกมาจากของเดิม
 *
 * 🔴 **สีพื้นป้ายเป็นของแต่ละแอป** — ทั้ง 4 แอปใช้คนละสี และ**ไม่มีสักตัวที่ตรงกับ
 * โทนแบรนด์ของตัวเอง** (Portal ใช้ฟ้า Material ทั้งที่แบรนด์เป็นสเลต · MediHR ใช้
 * เขียวน้ำทะเลทั้งที่แบรนด์เป็นคราม) ⇒ ที่นี่ผูกกับ `brand/subtle` ตัวเดียว
 * แล้วให้ธีมของแอปเป็นตัวกำหนดค่า — เขียนที่เดียว ได้ 4 สีอัตโนมัติ
 *
 * ⚠️ **ข้อยกเว้นที่ต้องรู้: บน Medimatch `brand/subtle` = `bg/surface` พอดี**
 * (`#e6f2f6` ทั้งคู่) ⇒ ถ้าเอา component นี้ไปวางบนพื้น `bg/surface` ตรง ๆ
 * ป้ายจะกลืนหายไป · ตัว component วาดการ์ด `bg/default` ของตัวเองอยู่แล้วจึงปลอดภัย
 * แต่ถ้าส่ง `className` ไปทับพื้นการ์ด ต้องระวังข้อนี้
 * ──────────────────────────────────────────────────────────────────────────── */

/** โทนสีพื้นของป้ายรูป · `brand` = ตามธีมของแอป */
export type StateTone =
  | "brand"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "neutral"
  | "none";

/**
 * ป้ายรูปมีทรงเดียว — **กลม**
 *
 * MediHR มีสี่เหลี่ยมมนอยู่ที่หน้ารายละเอียด แต่ผู้ใช้เคาะให้เหลือทรงเดียว (2026-08-09)
 * — สองทรงในระบบเดียวไม่ได้สื่ออะไรต่างกัน มีแต่ทำให้แต่ละจอเลือกไม่เหมือนกัน
 *
 * `none` = ไม่มีป้าย (ค่าตั้งต้นของ `image` · ภาพประกอบมักมีพื้นในตัวอยู่แล้ว)
 */
export type StateMediaShape = "circle" | "none";

export type StateSize = "sm" | "md";

const toneBg: Record<StateTone, string> = {
  /* ตัวเดียวที่เปลี่ยนตามแอป — อีก 5 ตัวเป็นสีความหมาย (สำเร็จ/เตือน/ผิดพลาด)
   * ซึ่งต้องเหมือนกันทุกแอปโดยตั้งใจ */
  brand: "bg-brand-subtle",
  info: "bg-info-blue-50",
  success: "bg-success-green-50",
  warning: "bg-warning-yellow-50",
  danger: "bg-cherry-red-50",
  /* `bg-subtle` (#fbfbfd) จางเกินจนป้ายหายไปบนการ์ดขาว — ใช้หมึกโปร่ง 10%
   * ซึ่งเห็นได้บนพื้นทุกสี ไม่ใช่แค่พื้นขาว */
  neutral: "bg-overlay-press",
  none: "",
};

const sizeMap: Record<StateSize, { badge: string; glyph: string; title: string; gap: string }> = {
  sm: { badge: "size-14", glyph: "[&_svg]:size-6", title: "text-body-lg", gap: "mb-4" },
  md: { badge: "size-18", glyph: "[&_svg]:size-8", title: "text-title-sm sm:text-title-md", gap: "mb-6" },
};

type StateBlockProps = Omit<React.ComponentProps<"div">, "title"> & {
  /**
   * ไอคอน — วางในป้ายสีพื้นตามธีมแอป
   *
   * ⚠️ **ขนาดถูกบังคับโดย component** (`sm` 24 · `md` 32) ผู้เรียกกำหนดเองไม่ได้
   * เพราะของจริงเคยมีจอที่พกไอคอนเทา 44px ของตัวเองมาแล้วรับดีไซน์ครึ่งเดียว
   * — ถ้าต้องการขนาดอื่นจริง ๆ ให้ใช้ `image` แทน ซึ่งไม่ถูกบังคับ
   */
  icon?: React.ReactNode;
  /**
   * รูปหรือภาพประกอบ — **ชนะ `icon` เมื่อส่งมาทั้งคู่**
   *
   * รับเป็น element ไม่ใช่ `src` เพราะแต่ละแอปโหลดรูปคนละทาง
   * (`next/image` ของ Next ต้อง import จากฝั่งแอป · DS ดึงเข้ามาไม่ได้)
   *
   * ```tsx
   * image={<Image src={emptyBox} alt="" width={160} height={160} />}
   * ```
   *
   * ตั้งต้น**ไม่มีป้ายสีพื้น** (`mediaShape="none"`) เพราะภาพประกอบมักมีพื้นในตัวอยู่แล้ว
   * — อยากได้พื้นด้วยให้ส่ง `mediaShape` มาเอง
   */
  image?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** ปุ่ม/ลิงก์ทางออก — ปกติเป็น `<Button>` หรือคู่ปุ่ม */
  action?: React.ReactNode;
  tone?: StateTone;
  mediaShape?: StateMediaShape;
  size?: StateSize;
  /** class ของป้ายรูป — ทางออกเมื่อต้องการขนาด/สีนอกเหนือจากที่กำหนด */
  mediaClassName?: string;
  /** ความสูงขั้นต่ำ — กันหน้าที่ว่างแล้วสั้นลงจนทุกอย่างข้างล่างกระโดด */
  minHeight?: number | string;
};

function StateBlock({
  icon,
  image,
  title,
  description,
  action,
  tone = "brand",
  mediaShape,
  size = "md",
  mediaClassName,
  minHeight,
  className,
  style,
  ...props
}: StateBlockProps) {
  const sz = sizeMap[size];
  const media = image ?? icon;
  /* รูปไม่มีป้ายโดยปริยาย · ไอคอนมี — ไอคอนเดี่ยว ๆ บนพื้นขาวเล็กเกินกว่าจะเป็นจุดนำสายตา */
  const shape = mediaShape ?? (image ? "none" : "circle");
  const showBadge = shape !== "none" && tone !== "none";

  return (
    <div
      className={cn("flex w-full justify-center p-3", className)}
      style={{ ...(minHeight != null ? { minHeight } : null), ...style }}
      {...props}
    >
      <div className="w-full max-w-[600px] rounded-xl bg-bg-default p-8 text-center">
        {media && (
          <div className={cn("flex justify-center", sz.gap)}>
            {showBadge ? (
              <div
                className={cn(
                  "inline-flex shrink-0 items-center justify-center",
                  "rounded-full",
                  sz.badge,
                  /* บังคับขนาดไอคอนที่ป้าย ไม่ใช่ที่ตัวไอคอน — `.parent > svg` ชนะ
                   * class ของลูกด้วย specificity จึงกันการรับดีไซน์ครึ่งเดียวได้จริง */
                  image ? "" : sz.glyph,
                  toneBg[tone],
                  mediaClassName,
                )}
              >
                {media}
              </div>
            ) : (
              <div className={cn(image ? "[&_img]:max-h-40 [&_img]:w-auto" : sz.glyph, mediaClassName)}>
                {media}
              </div>
            )}
          </div>
        )}
        {title && (
          <h2
            /* 🔴 ใช้ `text-text-secondary` ไม่ใช่ `text-text-primary` — ใน `theme.css`
             * (ชั้นที่ DS ยังใช้อยู่) `--color-text-primary` ถูก alias ไปที่ `--color-brand`
             * ⇒ หัวเรื่องกลายเป็นสีแบรนด์ตามธีมแอป ซึ่ง**ผิดกับของจริงทั้ง 3 แอป**
             * (Portal `#374151` · Mediwork `#21272A` · MediHR `gray-900` — เทาเข้มหมด)
             * และผิดชัดที่สุดตอนเป็นข้อความผิดพลาด: พาดหัว "โหลดไม่สำเร็จ" สีเขียวมิ้นต์
             *
             * `text-secondary` = `#3f454a` ซึ่งเกือบตรงกับ Portal (`#374151`) เป๊ะ
             * และเป็นโทนเดียวกับ `Heading` variant `Tone=heading` ใน Figma
             * ⇒ สองฝั่งพูดเรื่องเดียวกัน ไม่ใช่ "ดำ" ที่บังเอิญใกล้กัน
             *
             * ⚠️ รากอยู่ที่ token ไม่ใช่ที่นี่ — `semantic.css` ชุดใหม่ตั้ง `text-primary`
             * เป็นเทาเข้มไว้ถูกแล้ว แต่ DS ยังกิน `theme.css` อยู่ (CLAUDE.md §9 ข้อ 3) */
            className={cn(
              "mb-4 font-semibold leading-tight text-text-secondary",
              sz.title,
            )}
          >
            {title}
          </h2>
        )}
        {description && (
          <p className="text-body-md leading-[1.7] text-text-tertiary">
            {description}
          </p>
        )}
        {action && <div className="mt-8 flex justify-center">{action}</div>}
      </div>
    </div>
  );
}

export type EmptyStateProps = StateBlockProps & {
  /** @deprecated ใช้ `tone` — ชื่อเดิมสื่อว่าใช้ได้กับไอคอนอย่างเดียว ทั้งที่คุมพื้นของรูปด้วย */
  iconTone?: StateTone;
};

/**
 * ไม่มีข้อมูลให้แสดง
 *
 * ⚠️ **"ว่างเพราะกรองไม่เจอ" กับ "ว่างเพราะยังไม่มีข้อมูลเลย" ต้องพูดคนละแบบ** —
 * บอกให้ผู้ใช้ไปสร้างใหม่ทั้งที่เขาแค่กรองผิด คือทางที่ทำให้เขาสร้างข้อมูลซ้ำ
 * (ใน `DataTable` ใช้ `renderEmpty` ที่ได้ `isFiltered` มาแยกสองกรณีนี้)
 */
function EmptyState({ iconTone, tone, ...props }: EmptyStateProps) {
  return <StateBlock tone={tone ?? iconTone ?? "brand"} {...props} />;
}

export type ErrorStateProps = Omit<StateBlockProps, "action"> & {
  /** ปุ่มลองใหม่ — ไม่ส่ง = ไม่มีปุ่ม */
  onRetry?: () => void;
  /** ข้อความบนปุ่มลองใหม่ · ค่าเริ่มต้น `"Retry"` — แอปส่งคำแปลมาเอง */
  retryLabel?: React.ReactNode;
  /** ปุ่ม/ทางออกอื่นนอกเหนือจากลองใหม่ */
  action?: React.ReactNode;
  /** ตัว error จริง — ไม่ถูกแสดง มีไว้ให้ผู้เรียกใช้ต่อ (log/telemetry) */
  error?: unknown;
};

/**
 * โหลดไม่สำเร็จ
 *
 * ต่างจาก `EmptyState` แค่ค่าตั้งต้น (โทนแดง · ไอคอนเตือน · ปุ่มลองใหม่) —
 * ใช้โครงเดียวกันโดยตั้งใจ เพราะสองสถานะนี้ยืนอยู่ที่เดียวกันบนจอ
 * ถ้าโครงต่างกัน จอจะกระโดดตอนสลับจาก "กำลังโหลด" ไป "ผิดพลาด"
 *
 * ⚠️ **ไม่มีข้อความตั้งต้นเป็นภาษาไทย** — DS ไม่มี i18n และไม่ควรมี
 * ทุกคำมาจากแอป ที่นี่มีแต่ค่าอังกฤษไว้กันจอว่างเปล่าตอนลืมส่ง
 */
function ErrorState({
  icon,
  image,
  tone = "danger",
  onRetry,
  retryLabel,
  action,
  error: _error,
  ...props
}: ErrorStateProps) {
  return (
    <StateBlock
      tone={tone}
      icon={image ? undefined : (icon ?? <AlertTriangle />)}
      image={image}
      action={
        action ?? (onRetry ? <RetryButton onClick={onRetry}>{retryLabel ?? "Retry"}</RetryButton> : undefined)
      }
      {...props}
    />
  );
}

/* ปุ่มในตัว — ไม่ import `Button` เพื่อไม่ให้ `feedback/` ผูกกับ `ui/`
 * (`Button` เองก็เรียก `Skeleton` ใน `feedback/` อยู่แล้ว จะกลายเป็นวงกลม) */
function RetryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 items-center rounded-md border border-border-strong bg-bg-default px-4 text-body-sm font-medium text-text-secondary transition-colors hover:bg-bg-subtle focus:outline-none focus-visible:ring-1 focus-visible:ring-brand"
    >
      {children}
    </button>
  );
}

export { EmptyState, ErrorState };
