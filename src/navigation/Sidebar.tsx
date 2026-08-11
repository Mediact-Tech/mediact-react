import * as React from "react";
import { ChevronDown, Headphones } from "lucide-react";
import { cn } from "../lib/cn";

/* ─────────────────────────────────────────────────────────────────── */
/* Context                                                              */
/* ─────────────────────────────────────────────────────────────────── */

type SidebarContextType = {
  isCollapsed: boolean;
  activeItemId?: string;
  onItemClick?: (id: string, href?: string) => void;
  linkComponent: React.ElementType;
};

const SidebarContext = React.createContext<SidebarContextType | undefined>(
  undefined,
);
function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error("Sidebar.* must be used inside <Sidebar>");
  return ctx;
}

/**
 * อ่านสถานะราง **จากข้างใน** `<Sidebar>` — สำหรับ `header`/`footer` ที่ต้องเปลี่ยนตอนยุบ
 * (เช่น สลับโลโก้เต็มเป็นตัวมาร์ค)
 *
 * 🔴 ผู้เรียกคำนวณเองไม่ได้ เพราะ `expandOnHover` ทำให้ "กางอยู่หรือไม่" ไม่เท่ากับ
 * `collapsed` ที่ส่งเข้ามา — DS ถือ state ตัวนั้นไว้เอง
 *
 * ⚠️ `header` เป็น prop ก็จริง แต่ถูก **render อยู่ข้างใน** provider — context จึงถึง
 * (React ผูก context ตามตำแหน่งที่ render ไม่ใช่ตำแหน่งที่สร้าง element)
 */
export function useSidebarState(): { isCollapsed: boolean } {
  return { isCollapsed: useSidebar().isCollapsed };
}

/** Depth level — used by `SidebarItem` / `SidebarGroup` to render bullet prefixes
 * for nested items. Top-level items render icon + label, deeper levels render
 * bullet/dash prefixes. */
const DepthContext = React.createContext(0);

/* ─────────────────────────────────────────────────────────────────── */
/* Sidebar (root)                                                       */
/* ─────────────────────────────────────────────────────────────────── */

export type SidebarProps = React.ComponentProps<"aside"> & {
  /**
   * โลโก้แอปแบบ **แยกชิ้น** — DS ตัดสินเองว่าตอนยุบเหลืออะไร
   *
   * มีไว้แทน `header` ที่ให้แอปประกอบเอง ซึ่งบังคับให้ทุกแอปเขียน `isCollapsed ? mark : full`
   * ซ้ำกันทุกที่และต้องมี **ไฟล์โลโก้ 2 ไฟล์ต่อแอป** · ผลคือขนาดหลุดจากกันเงียบ ๆ — วัดจริง:
   * โลโก้เต็มของ MediHR สัดส่วน 3.84:1 ส่วนของ Portal 4.32:1 ⇒ ความสูงเท่ากันแต่กว้างต่างกัน 12%
   *
   * ⚠️ `name` รับได้ทั้ง **ตัวหนังสือและรูป** โดยตั้งใจ — wordmark ของทั้ง Portal และ MediHR
   * วันนี้เป็น **path ที่วาดไว้ ไม่ใช่ฟอนต์** (ไม่มี `<text>` ไม่มี `font-family` ในไฟล์เลย)
   * ⇒ ส่งเป็นสตริงจะได้ตัวอักษรของฟอนต์แอป ซึ่ง **ไม่ใช่ letterform ของแบรนด์**
   * แอปที่ยังต้องคงลายมือแบรนด์ให้ส่ง `<img>` เฉพาะส่วน wordmark เข้ามา
   */
  brand?: {
    /** เครื่องหมายของแอป — เห็นทั้งตอนกางและตอนยุบ */
    symbol: React.ReactNode;
    /** ชื่อแอป — เห็นเฉพาะตอนกาง (ตัวหนังสือ หรือ `<img>` ของ wordmark) */
    name?: React.ReactNode;
    /** ของที่ต้องอยู่ขวาสุดของหัวราง เช่นปุ่มปิดลิ้นชักบนมือถือ — เห็นเฉพาะตอนกาง */
    action?: React.ReactNode;
  };
  /**
   * Logo / brand block rendered at the top.
   *
   * @deprecated ใช้ `brand` แทน — ตัวนี้ให้แอปประกอบหัวรางเองทั้งก้อน ซึ่งเป็นที่มาของ
   * โค้ดสลับโลโก้ที่ซ้ำกันทุกแอป · ยังรองรับอยู่และ**ชนะ** `brand` เมื่อส่งมาทั้งคู่
   */
  header?: React.ReactNode;
  /** Footer block rendered at the bottom (e.g. version label). */
  footer?: React.ReactNode;
  /** Currently active item id — children compare via context. */
  activeItemId?: string;
  /** Click handler invoked by `SidebarItem`. Receives `(id, href?)`. */
  onItemClick?: (id: string, href?: string) => void;
  /** Render the sidebar in collapsed (icon-only) mode. */
  collapsed?: boolean;
  /** Width when expanded. Default `260px`. */
  expandedWidth?: number | string;
  /** Width when collapsed. Default `72px`. */
  collapsedWidth?: number | string;
  /** Component used to render `SidebarItem`'s `href` links — e.g. next/link's
   *  `Link`. Must accept `href`, `className`, and `children`. Defaults to a
   *  plain `<a>`, which keeps this package framework-agnostic. Same shape as
   *  `Breadcrumb`'s `linkComponent`. */
  linkComponent?: React.ElementType;
  /**
   * Presentational-only mobile off-canvas mode. When set (`true`/`false`,
   * not `undefined`), the sidebar becomes a fixed drawer + backdrop below the
   * `lg` breakpoint, sliding in/out based on this value, and renders as a
   * normal static rail at `lg` and above. The app owns *when* to open it
   * (e.g. a hamburger button) and any persistence — this prop is not read
   * from / written to storage by the DS.
   */
  mobileOpen?: boolean;
  /** Called when the backdrop is clicked or Escape is pressed while `mobileOpen`. */
  onMobileOpenChange?: (open: boolean) => void;
  /**
   * ยุบอยู่แล้วเอาเมาส์ไปวาง = กางออกชั่วคราว (ของจริงใน Portal ทำแบบนี้)
   *
   * ⚠️ กางแล้ว **ราง sidebar กว้างขึ้นจริง** เนื้อหาข้าง ๆ จึงขยับตาม
   * ไม่ใช่การลอยทับ — ตรงกับพฤติกรรมของ Portal ถ้าไม่ต้องการให้ขยับ ส่ง `false`
   * @default true
   */
  expandOnHover?: boolean;
  /**
   * ปุ่มติดต่อฝ่ายสนับสนุนที่ก้นราง — ของจริงมีทุกจอ
   *
   * ข้อความส่งมาจากแอปเสมอ (DS ไม่มี i18n) · ไอคอนไม่ส่งก็ได้ ค่าเริ่มต้นเป็นหูฟัง
   * ตอนยุบจะเหลือแค่ไอคอน และใช้ `label` เป็น `title`/`aria-label`
   */
  supportAction?: {
    label: React.ReactNode;
    onClick: () => void;
    icon?: React.ReactNode;
  };
};

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  {
    className,
    header,
    brand,
    footer,
    activeItemId,
    onItemClick,
    collapsed = false,
    expandedWidth = 260,
    collapsedWidth = 72,
    linkComponent = "a",
    mobileOpen,
    onMobileOpenChange,
    expandOnHover = true,
    supportAction,
    children,
    style,
    ...props
  },
  ref,
) {
  const [hovered, setHovered] = React.useState(false);

  /* ยุบอยู่ + เอาเมาส์วาง = แสดงแบบกาง (ของจริงใน Portal)
   * ทุกอย่างที่อยู่ข้างในอ่านค่านี้ ไม่ใช่ `collapsed` ตรง ๆ — ไม่งั้นรางกว้างขึ้น
   * แต่ข้างในยังเป็นไอคอนล้วน */
  const showExpanded = !collapsed || (expandOnHover && hovered);

  const ctx = React.useMemo<SidebarContextType>(
    () => ({
      isCollapsed: !showExpanded,
      activeItemId,
      onItemClick,
      linkComponent,
    }),
    [showExpanded, activeItemId, onItemClick, linkComponent],
  );

  const width = showExpanded ? expandedWidth : collapsedWidth;
  const isMobileMode = mobileOpen !== undefined;

  React.useEffect(() => {
    if (!isMobileMode || !mobileOpen || !onMobileOpenChange) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      /* 🔴 โหมดลิ้นชักมีผลต่ำกว่า `lg` เท่านั้น (พื้นหลังทึบก็ `lg:hidden`) — บนจอใหญ่
       * รางเป็นรางปกติที่กางค้างอยู่ ถ้าไม่กันไว้ Escape ที่กดเพื่อปิด dialog/dropdown
       * จะไหลมาถึงตัวนี้แล้ว "ปิดลิ้นชัก" = **พับรางบนเดสก์ท็อป** โดยผู้ใช้ไม่ได้สั่ง
       * (แอปที่ผูก `mobileOpen` กับสวิตช์ยุบตัวเดียวกันจะโดนเต็ม ๆ) */
      if (window.matchMedia("(min-width: 1024px)").matches) return;
      onMobileOpenChange(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMode, mobileOpen, onMobileOpenChange]);

  return (
    <SidebarContext.Provider value={ctx}>
      {isMobileMode && mobileOpen && (
        <div
          aria-hidden="true"
          onClick={() => onMobileOpenChange?.(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}
      <aside
        ref={ref}
        onMouseEnter={expandOnHover ? () => setHovered(true) : undefined}
        onMouseLeave={expandOnHover ? () => setHovered(false) : undefined}
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          ...style,
        }}
        className={cn(
          /* 📐 วัดจาก Portal: พื้น `rgb(67,89,110)` · **มุม 16px** · ไม่มีเส้นขอบขวา
           * (โค้ดของ Portal เขียน `border-r` แล้วทับด้วย `border-0`)
           * มุมโค้งเฉพาะ `lg` ขึ้นไป เพราะต่ำกว่านั้นมันเป็นลิ้นชักเต็มจอ
           *
           * 🔴 พื้นเป็น token `bg-nav-rail` ไม่ใช่ `bg-state-700` ตายตัว — ค่าเริ่มต้น
           * เท่ากันเป๊ะ (Portal ไม่ขยับ) แต่แอปที่รางเป็นสีแบรนด์จริง ๆ (MediHR = คราม)
           * ทับได้ที่ไฟล์ธีมของตัวเอง แทนที่จะต้อง `className` ทับทุกจุดที่เรียก
           * เกณฑ์ว่าธีมไหนทับได้อยู่ในคอมเมนต์ของ token ใน `semantic.css` */
          "flex h-full shrink-0 flex-col bg-bg-nav-rail text-white transition-[width] duration-300 ease-in-out lg:rounded-2xl",
          isMobileMode && [
            "fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out",
            "lg:static lg:z-auto lg:translate-x-0 lg:transition-[width]",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          ],
          className,
        )}
        {...props}
      >
        {(header || brand) && (
          /* วัดจาก Portal: สูง 88 · pad 24 · เว้นบนอีก 16 · กางแล้วชิดซ้าย ยุบแล้วกึ่งกลาง */
          <div
            className={cn(
              "mt-4 flex items-center transition-all duration-300 ease-in-out",
              showExpanded
                ? "min-h-[88px] justify-between p-6"
                : "justify-center p-4",
            )}
          >
            {header ?? (
              <>
                {/* เครื่องหมายอยู่ตลอด · ชื่อกับปุ่มโผล่เฉพาะตอนกาง — ตรงนี้คือเหตุผลทั้งหมด
                    ที่ prop นี้มี: แอปไม่ต้องรู้ว่าตอนยุบต้องสลับไฟล์ไหน */}
                {/* `flex-1 justify-center` — กล่องหัวรางเป็น `justify-between` เพราะต้องดันปุ่ม
                    ปิดลิ้นชักไปขวาสุด ⇒ ก้อนโลโก้ต้องยืดเองถึงจะอยู่กึ่งกลางจริง */}
                <span className="flex min-w-0 flex-1 items-center justify-center gap-3">
                  <span className="flex shrink-0 items-center">{brand!.symbol}</span>
                  {showExpanded && brand!.name && (
                    <span className="truncate text-title-md font-bold tracking-wide">
                      {brand!.name}
                    </span>
                  )}
                </span>
                {showExpanded && brand!.action}
              </>
            )}
          </div>
        )}

        {/* `px-4` ไม่ใช่ `px-3` · ระยะระหว่างเมนู 4px — วัดจาก Portal ทั้งคู่ */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4">{children}</nav>

        <div className="px-4 pb-4">
          {supportAction && (
            /* ปุ่มติดต่อฝ่ายสนับสนุน — วัดจาก Portal: 36 สูง · มุม 8 · pad 8/12
             * · 14px · `white/60` · ไอคอน 16 · gap 8 · เต็มความกว้าง จัดกึ่งกลาง */
            <button
              type="button"
              onClick={supportAction.onClick}
              title={
                !showExpanded && typeof supportAction.label === "string"
                  ? supportAction.label
                  : undefined
              }
              aria-label={
                !showExpanded && typeof supportAction.label === "string"
                  ? supportAction.label
                  : undefined
              }
              className={cn(
                "flex w-full cursor-pointer items-center gap-2 rounded-lg py-2 text-body-sm text-white/60 transition-colors hover:bg-white/10 hover:text-white",
                showExpanded ? "justify-center px-3" : "justify-center px-0",
              )}
            >
              <span aria-hidden className="flex shrink-0 [&_svg]:size-4">
                {supportAction.icon ?? <Headphones className="size-4" />}
              </span>
              {showExpanded && supportAction.label}
            </button>
          )}
          {footer && showExpanded && (
            /* วัดจาก Portal: 12px · `white/40` · กึ่งกลาง · เว้นบนล่าง 8 */
            <div className="py-2 text-center text-caption text-white/40">
              {footer}
            </div>
          )}
        </div>
      </aside>
    </SidebarContext.Provider>
  );
});

/** ชื่อที่ใช้ตอนราง**ยุบ** — ตอนนั้นปุ่มเหลือแต่ไอคอน ถ้าไม่ใส่ โปรแกรมอ่านหน้าจอ
 * จะเจอปุ่มที่ไม่มีชื่อเลย (เทสจับได้ · ของจริงใน Portal ใส่ `title` ไว้)
 * ใส่ให้เฉพาะตอน `label` เป็น string — ถ้าเป็น ReactNode ผู้เรียกต้องส่ง aria เอง */
function collapsedName(label: React.ReactNode, isCollapsed: boolean) {
  if (!isCollapsed || typeof label !== "string") return undefined;
  return label;
}

/* ─────────────────────────────────────────────────────────────────── */
/* SidebarItem (leaf)                                                   */
/* ─────────────────────────────────────────────────────────────────── */

type IconType = React.ComponentType<{ className?: string }>;

export type SidebarItemProps = {
  id: string;
  label: React.ReactNode;
  icon?: IconType;
  href?: string;
  onClick?: () => void;
  /** Optional small text below the label (badge / sub-label). */
  badge?: React.ReactNode;
  className?: string;
};

function SidebarItem({
  id,
  label,
  icon: Icon,
  href,
  onClick,
  badge,
  className,
}: SidebarItemProps) {
  const { isCollapsed, activeItemId, onItemClick, linkComponent: LinkComponent } =
    useSidebar();
  const depth = React.useContext(DepthContext);
  const isActive = activeItemId === id;
  const isNested = depth > 0;

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
      return;
    }
    if (onItemClick) {
      e.preventDefault();
      onItemClick(id, href);
    }
  };

  const content = (
    <>
      {/* 🔴 **เมนูย่อยไม่มีไอคอนตอนกาง** — วัดจาก Portal: รางเส้นซ้ายบอกลำดับชั้น
       * ให้อยู่แล้ว ไม่ต้องมีจุด/ขีดนำหน้าซ้ำ (ของเดิมที่นี่วาดจุดตามความลึก)
       * แต่ **เมนูระดับบนมีไอคอนเสมอ** — ภาพจับได้ว่าซ่อนหมดทุกระดับแล้วผิด
       * ทั้งที่ตัวเลขระยะ/สีตรงครบ 19/19 */}
      {(!isNested || isCollapsed) && (
        <span className="flex shrink-0 items-center justify-center">
          {Icon ? (
            <Icon className="size-6" />
          ) : isCollapsed ? (
            <span className="size-1.5 rounded-full bg-white" />
          ) : null}
        </span>
      )}

      {!isCollapsed && (
        <span className="flex min-w-0 flex-1 flex-col items-start text-left">
          {/* ⚠️ ข้อความ **ตัดขึ้นบรรทัดใหม่ ไม่ใช่ตัดด้วย …** — วัดจาก Portal
           * (`wrap-break-word` + ไม่มี `truncate`) เมนูภาษาไทยยาวกว่าอังกฤษเสมอ
           * ถ้าตัดท้ายทิ้ง ผู้ใช้จะอ่านไม่ออกว่าเมนูไหนเป็นเมนูไหน */}
          {/* ⚠️ บังคับ 14px **เฉพาะเมนูย่อย** — เมนูระดับบนสืบทอด 16px/lh-24 จากปุ่ม
            * วัดเจอ: ใส่ 14px ทุกระดับทำให้เมนูบนสูง 41 แทนที่จะเป็น 46 */}
          <span
            className={cn(
              "w-full wrap-break-word",
              isNested && "text-body-sm font-semibold leading-[1.35]",
            )}
          >
            {label}
          </span>
          {badge && (
            <span
              className={cn(
                "text-[10px] font-medium",
                isActive ? "text-text-black/70" : "text-white/60",
              )}
            >
              {badge}
            </span>
          )}
        </span>
      )}
    </>
  );

  /* 📐 วัดจาก Portal — สองระดับใช้สไตล์ตอน active คนละแบบ:
   *   ระดับบน  228×46 · มุม 10 · pad 11/12 · active = `bg-white/20` ตัวขาว
   *   เมนูย่อย 193×37 · มุม 10 · pad 9/12  · active = **แถบขาวทึบ** ตัวหนังสือเข้ม
   *
   * 🔴 ตัวหนังสือบนแถบขาวเป็น **ดำคงที่** ไม่ใช่ `text-brand` แบบเดิม
   * ของจริง Portal ใช้ `text-text-primary` ซึ่ง alias ไป `--color-brand`
   * ⇒ บน Mediwork จะเป็นเขียวมิ้นต์บนขาว วัดได้ 1.93:1 อ่านไม่ออก */
  const baseClass = cn(
    "flex w-full items-center gap-3 rounded-[10px] transition-colors",
    isCollapsed
      ? "justify-center py-3"
      : isNested
        ? "px-3 py-[9px]"
        : "px-3 py-[11px] text-[16px] font-semibold",
    isActive
      ? isNested
        ? "bg-white text-text-black"
        : "bg-white/20 text-white"
      : "text-white/80 hover:bg-white/10 hover:text-white",
    className,
  );

  const srName = collapsedName(label, isCollapsed);

  if (href && !onClick && !onItemClick) {
    return (
      <LinkComponent
        href={href}
        className={baseClass}
        title={srName}
        aria-label={srName}
      >
        {content}
      </LinkComponent>
    );
  }
  return (
    <button
      type="button"
      onClick={handleClick}
      className={baseClass}
      title={srName}
      aria-label={srName}
    >
      {content}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* SidebarGroup (collapsible parent)                                    */
/* ─────────────────────────────────────────────────────────────────── */

export type SidebarGroupProps = {
  /** Stable id used for the chevron-toggle aria. */
  id: string;
  label: React.ReactNode;
  icon?: IconType;
  /** Whether the group is expanded by default. */
  defaultExpanded?: boolean;
  /** Controlled expanded state. */
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /**
   * เมนูลูกตัวใดตัวหนึ่งของกลุ่มนี้คือหน้าที่เปิดอยู่
   *
   * ใช้เฉพาะตอนราง**ยุบ** — ตอนนั้นเมนูลูกถูกซ่อน ถ้าไม่บอก จะไม่มีอะไรบนจอ
   * บอกว่าผู้ใช้อยู่หน้าไหน · ผู้เรียกเป็นคนรู้รายการเมนู component เห็นแค่ children
   * ที่ render มาแล้ว จึงคำนวณเองไม่ได้
   */
  isChildActive?: boolean;
  children?: React.ReactNode;
  className?: string;
};

function SidebarGroup({
  id,
  label,
  icon: Icon,
  defaultExpanded = true,
  expanded,
  onExpandedChange,
  isChildActive: hasActiveChild,
  children,
  className,
}: SidebarGroupProps) {
  const { isCollapsed } = useSidebar();
  const depth = React.useContext(DepthContext);
  const isControlled = expanded !== undefined;
  const [internal, setInternal] = React.useState(defaultExpanded);
  const isExpanded = isControlled ? expanded : internal;
  const isNested = depth > 0;

  const toggle = () => {
    if (!isControlled) setInternal((s) => !s);
    onExpandedChange?.(!isExpanded);
  };

  /* 📐 หัวกลุ่มใช้ทรงเดียวกับเมนูระดับบน (วัดจาก Portal: มุม 10 · pad 11/12 · 16/600)
   * ⚠️ ตอนยุบ ถ้ามีเมนูลูกที่กำลังเปิดอยู่ Portal จะไฮไลต์หัวกลุ่มแทน
   * เพราะเมนูลูกถูกซ่อน — ถ้าไม่ทำ จะไม่มีอะไรบนจอบอกว่าผู้ใช้อยู่หน้าไหน */
  const headerClass = cn(
    "flex w-full items-center gap-3 rounded-[10px] font-semibold transition-colors",
    isCollapsed
      ? "justify-center py-3"
      : isNested
        ? "px-3 py-[9px] text-body-sm"
        : "px-3 py-[11px] text-[16px]",
    isCollapsed && hasActiveChild
      ? "bg-white/20 text-white"
      : "text-white/90 hover:bg-white/10 hover:text-white",
    className,
  );

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isExpanded}
        aria-controls={`${id}-content`}
        title={collapsedName(label, isCollapsed)}
        aria-label={collapsedName(label, isCollapsed)}
        className={headerClass}
      >
        <span className="flex shrink-0 items-center justify-center">
          {Icon ? (
            <Icon className="size-6" />
          ) : isNested && !isCollapsed ? (
            <span className="size-1.5 rounded-full bg-white" />
          ) : null}
        </span>
        {!isCollapsed && (
          <>
            <span className="flex-1 truncate text-left">{label}</span>
            <ChevronDown
              className={cn(
                "size-4 transition-transform duration-200",
                !isExpanded && "-rotate-90",
              )}
            />
          </>
        )}
      </button>

      {/* 🔴 รางเส้นซ้ายใต้หัวกลุ่ม — วัดจาก Portal: `1px white/12` · เยื้อง 22 · เว้นใน 12
        * เส้นนี้คือสิ่งที่บอกลำดับชั้นแทนจุด/ไอคอนนำหน้าที่ของเดิมวาดไว้
        * ตอนยุบไม่ต้องมี เพราะเมนูลูกไม่ถูก render */}
      {isExpanded && !isCollapsed && (
        <div
          id={`${id}-content`}
          className="mt-0.5 ml-[22px] space-y-0.5 border-l border-white/12 pl-3"
        >
          <DepthContext.Provider value={depth + 1}>
            {children}
          </DepthContext.Provider>
        </div>
      )}
    </div>
  );
}

Sidebar.displayName = "Sidebar";

export { Sidebar, SidebarItem, SidebarGroup };
