import * as React from "react";
import { Bell, ChevronDown, LogOut } from "lucide-react";
import { cn } from "../lib/cn";
import { Avatar } from "../ui/Avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../overlay/Popover";
import {
  medi_careDataUrl,
  medi_matchDataUrl,
  medi_payDataUrl,
  medi_referDataUrl,
  medi_stockDataUrl,
  medi_workDataUrl,
  mediactDataUrl,
} from "./_app-icons/data";

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
        "flex h-16 w-full items-center gap-2 rounded-[15px] border border-border-subtle bg-white px-4 shadow-sm",
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
        <span className="truncate text-xl font-semibold text-text-primary">
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

const iconButtonClass =
  "inline-flex size-10 shrink-0 items-center justify-center rounded-full text-text-body transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 [&_svg]:size-6";

/* ─────────────────────────────────────────────────────────────────── */
/* AppLauncher — Mediact ecosystem app catalog                          */
/* ─────────────────────────────────────────────────────────────────── */

/** Canonical app keys across the Mediact ecosystem. */
export type MediactAppKey =
  | "mediwork"
  | "medimatch"
  | "medipay"
  | "medistock"
  | "medicare"
  | "medirefer";

export type MediactAppConfig = {
  /** Where this app lives. Falsy → tile is rendered as not-clickable. */
  baseUrl?: string;
  /** Show "Coming Soon" subtitle and disable the tile. */
  comingSoon?: boolean;
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
  /** Render order. Default: mediwork → medimatch → medipay → medistock → medicare → medirefer. */
  order?: MediactAppKey[];
  /** Override default `<a href>` navigation (e.g. for SPA routing). */
  onAppClick?: (key: MediactAppKey, app: MediactAppConfig) => void;
  /** Tooltip / aria-label for the trigger. Default "Apps". */
  label?: string;
  /** Subtitle shown beneath disabled / coming-soon tiles. */
  comingSoonText?: string;
  className?: string;
};

const DEFAULT_APP_DEFS: Record<
  MediactAppKey,
  { label: string; src: string }
> = {
  mediwork: { label: "Medi Work", src: medi_workDataUrl },
  medimatch: { label: "Medi Match", src: medi_matchDataUrl },
  medipay: { label: "Medi Pay", src: medi_payDataUrl },
  medistock: { label: "Medi Stock", src: medi_stockDataUrl },
  medicare: { label: "Medi Care", src: medi_careDataUrl },
  medirefer: { label: "Medi Refer", src: medi_referDataUrl },
};

const DEFAULT_APP_ORDER: MediactAppKey[] = [
  "mediwork",
  "medimatch",
  "medipay",
  "medistock",
  "medicare",
  "medirefer",
];

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
  className,
}: AppLauncherProps) {
  const visible = order.filter((key) => apps[key] != null);

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
        <div className="mb-6 flex items-center justify-center gap-1 border-b border-gray-200 pb-4">
          <img
            src={mediactDataUrl}
            alt="MediAct"
            className="h-8 w-auto"
          />
          <h2 className="text-lg font-semibold text-text-heading">MediAct</h2>
        </div>
        <div className="grid grid-cols-3 gap-x-2 gap-y-6">
          {visible.map((key) => {
            const config = apps[key]!;
            const def = DEFAULT_APP_DEFS[key];
            return (
              <AppLauncherTile
                key={key}
                appKey={key}
                config={config}
                label={config.label ?? def.label}
                icon={
                  config.icon ?? (
                    <img
                      src={def.src}
                      alt={def.label}
                      className="size-full object-contain"
                    />
                  )
                }
                comingSoonText={comingSoonText}
                onClick={onAppClick}
              />
            );
          })}
        </div>
      </PopoverContent>
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
}: {
  appKey: MediactAppKey;
  config: MediactAppConfig;
  label: string;
  icon: React.ReactNode;
  comingSoonText: string;
  onClick?: (key: MediactAppKey, app: MediactAppConfig) => void;
}) {
  const isComingSoon = !!config.comingSoon;
  const disabled =
    config.disabled || isComingSoon || (!config.baseUrl && !onClick);

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
    return (
      <div className={tileClass} aria-disabled="true">
        {iconBox}
        {labelEl}
      </div>
    );
  }
  if (onClick) {
    return (
      <button
        type="button"
        onClick={() => onClick(appKey, config)}
        className={tileClass}
      >
        {iconBox}
        {labelEl}
      </button>
    );
  }
  return (
    <a href={config.baseUrl} className={tileClass}>
      {iconBox}
      {labelEl}
    </a>
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
            "group inline-flex items-center gap-2 rounded-full p-0.5 pr-1 text-sm font-medium text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
            className,
          )}
        >
          <Avatar
            size="md"
            src={user.src}
            name={user.name}
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
            className="mb-3 size-[60px] border-2 border-gray-100"
          />
          {user.name && (
            <h3 className="text-lg font-semibold text-text-heading">
              {user.name}
            </h3>
          )}
          {user.role && (
            <p className="mt-0.5 text-[15px] font-medium text-text-tertiary">
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
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex cursor-pointer items-center gap-2 text-[16px] font-medium text-cherry-red-600 transition-colors hover:text-cherry-red-800"
                >
                  <LogOut className="size-5" />
                  {logoutLabel}
                </button>
              )}
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}

function UserMenuItemButton({ item }: { item: UserMenuItem }) {
  const className =
    "block w-full cursor-pointer text-left py-3 text-[16px] font-medium text-text-body transition-colors hover:text-text-primary";
  if (item.href) {
    return (
      <a href={item.href} className={className}>
        {item.label}
      </a>
    );
  }
  return (
    <button type="button" onClick={item.onClick} className={className}>
      {item.label}
    </button>
  );
}

TopNav.displayName = "TopNav";
TopNavBrand.displayName = "TopNavBrand";
NotificationBell.displayName = "NotificationBell";

export {
  TopNav,
  TopNavBrand,
  TopNavSpacer,
  AppLauncher,
  NotificationBell,
  UserMenu,
};
