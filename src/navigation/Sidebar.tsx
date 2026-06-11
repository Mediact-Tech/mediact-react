import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";

/* ─────────────────────────────────────────────────────────────────── */
/* Context                                                              */
/* ─────────────────────────────────────────────────────────────────── */

type SidebarContextType = {
  isCollapsed: boolean;
  activeItemId?: string;
  onItemClick?: (id: string, href?: string) => void;
};

const SidebarContext = React.createContext<SidebarContextType | undefined>(
  undefined,
);
function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error("Sidebar.* must be used inside <Sidebar>");
  return ctx;
}

/** Depth level — used by `SidebarItem` / `SidebarGroup` to render bullet prefixes
 * for nested items. Top-level items render icon + label, deeper levels render
 * bullet/dash prefixes. */
const DepthContext = React.createContext(0);

/* ─────────────────────────────────────────────────────────────────── */
/* Sidebar (root)                                                       */
/* ─────────────────────────────────────────────────────────────────── */

export type SidebarProps = React.ComponentProps<"aside"> & {
  /** Logo / brand block rendered at the top. */
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
};

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  {
    className,
    header,
    footer,
    activeItemId,
    onItemClick,
    collapsed = false,
    expandedWidth = 260,
    collapsedWidth = 72,
    children,
    style,
    ...props
  },
  ref,
) {
  const ctx = React.useMemo<SidebarContextType>(
    () => ({ isCollapsed: collapsed, activeItemId, onItemClick }),
    [collapsed, activeItemId, onItemClick],
  );

  const width = collapsed ? collapsedWidth : expandedWidth;

  return (
    <SidebarContext.Provider value={ctx}>
      <aside
        ref={ref}
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          ...style,
        }}
        className={cn(
          "flex h-full shrink-0 flex-col bg-state-700 text-white transition-[width] duration-300 ease-in-out",
          className,
        )}
        {...props}
      >
        {header && (
          <div
            aria-hidden={collapsed || undefined}
            className="flex min-h-20 items-center justify-center px-6 py-6"
          >
            {!collapsed && header}
          </div>
        )}

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {children}
        </nav>

        {footer && (
          <div className="px-4 py-4 text-center text-xs text-white/40">
            {footer}
          </div>
        )}
      </aside>
    </SidebarContext.Provider>
  );
});

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
  const { isCollapsed, activeItemId, onItemClick } = useSidebar();
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
      {/* Icon / bullet prefix */}
      <span className="flex shrink-0 items-center justify-center">
        {isCollapsed ? (
          Icon ? (
            <Icon className="size-6" />
          ) : (
            <span className="size-1.5 rounded-full bg-white" />
          )
        ) : isNested ? (
          // Nested items: bullet on level 1, dash on deeper levels
          depth === 1 ? (
            <span
              className={cn(
                "size-1.5 rounded-full",
                isActive ? "bg-brand" : "bg-white",
              )}
            />
          ) : (
            <span
              className={cn(
                "h-px w-2",
                isActive ? "bg-brand" : "bg-white/80",
              )}
            />
          )
        ) : Icon ? (
          <Icon className="size-6" />
        ) : null}
      </span>

      {!isCollapsed && (
        <span className="flex flex-col items-start overflow-hidden text-left">
          <span className="truncate text-[15px] font-semibold leading-tight">
            {label}
          </span>
          {badge && (
            <span
              className={cn(
                "mt-0.5 text-[10px] font-medium",
                isActive ? "text-brand/70" : "text-white/60",
              )}
            >
              {badge}
            </span>
          )}
        </span>
      )}
    </>
  );

  const baseClass = cn(
    "flex w-full items-center gap-3 transition-colors",
    isCollapsed
      ? "justify-center rounded-md py-3"
      : isNested
        ? "rounded-full px-4 py-2 pl-8"
        : "rounded-lg px-3 py-3",
    isActive
      ? "bg-white text-brand"
      : "text-white/80 hover:bg-white/10 hover:text-white",
    className,
  );

  if (href && !onClick && !onItemClick) {
    return (
      <a href={href} className={baseClass}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" onClick={handleClick} className={baseClass}>
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

  const headerClass = cn(
    "flex w-full items-center gap-3 font-semibold transition-colors text-white/90 hover:bg-white/10",
    isCollapsed
      ? "justify-center rounded-md py-3"
      : isNested
        ? "rounded-md px-3 py-2 pl-4 text-[14px]"
        : "rounded-lg px-3 py-3 text-[15px]",
    className,
  );

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isExpanded}
        aria-controls={`${id}-content`}
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

      {isExpanded && (
        <div
          id={`${id}-content`}
          className={cn(!isCollapsed && "space-y-1 pl-2")}
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
