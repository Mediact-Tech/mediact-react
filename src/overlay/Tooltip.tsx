import * as React from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { cn } from "../lib/cn";

const TooltipProvider = RadixTooltip.Provider;
const TooltipRoot = RadixTooltip.Root;
const TooltipTrigger = RadixTooltip.Trigger;
const TooltipPortal = RadixTooltip.Portal;

type TooltipContentProps = React.ComponentProps<typeof RadixTooltip.Content> & {
  /** Show a pointing arrow toward the trigger. Default `true`. */
  arrow?: boolean;
};

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  function TooltipContent(
    { className, sideOffset = 8, arrow = true, children, ...props },
    ref,
  ) {
    return (
      <TooltipPortal>
        <RadixTooltip.Content
          ref={ref}
          sideOffset={sideOffset}
          className={cn(
            // Neutral black surface, not the brand colour: a tooltip is a passive hint attached to
            // whatever it points at, so it must read the same over brand-coloured and neutral UI
            // alike. `bg-black` resolves to the --color-black token (#191919), not pure black.
            //
            // ⚠️ ยังเป็น `text-sm` ของ Tailwind ไม่ใช่ `text-body-sm` ของ type scale ทั้งที่ค่าเท่ากัน
            // (14px) — เพราะ **3 ใน 4 แอปยังไม่ import token ของ DS** (portal · medimatch · hr-web
            // ประกาศ token เองในไฟล์ตัวเอง และไม่มี `--text-*` เลยสักตัว) Tailwind v4 จะไม่ generate
            // `.text-body-sm` ถ้าไม่มีตัวแปรรองรับ ⇒ ตัวหนังสือจะไหลไปตามขนาดของ parent เงียบ ๆ
            // ปลดล็อกเมื่อแอปเหล่านั้น import `@mediact/react/tokens.css` แล้ว
            "z-50 max-w-xs rounded-md bg-black px-4 py-2.5 text-sm font-medium text-white shadow-lg",
            "data-[state=delayed-open]:animate-in data-[state=closed]:animate-out",
            className,
          )}
          {...props}
        >
          {children}
          {arrow && (
            <RadixTooltip.Arrow
              width={14}
              height={7}
              className="fill-black"
            />
          )}
        </RadixTooltip.Content>
      </TooltipPortal>
    );
  },
);

export type TooltipProps = {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: RadixTooltip.TooltipContentProps["side"];
  align?: RadixTooltip.TooltipContentProps["align"];
  delayDuration?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  asChild?: boolean;
  /** Show a pointing arrow toward the trigger. Default `true`. */
  arrow?: boolean;
  /** Override the content panel's classes — e.g. a non-brand tone (dark/light). */
  contentClassName?: string;
};

/**
 * Convenience wrapper. For grouped tooltips wrap your tree in <TooltipProvider>.
 * This component creates its own provider if none is in scope (safe to nest).
 */
function Tooltip({
  content,
  children,
  side = "top",
  align = "center",
  delayDuration = 200,
  open,
  defaultOpen,
  onOpenChange,
  asChild = true,
  arrow = true,
  contentClassName,
}: TooltipProps) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <TooltipRoot
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
      >
        <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          arrow={arrow}
          className={contentClassName}
        >
          {content}
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
}

TooltipContent.displayName = "TooltipContent";

export {
  Tooltip,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  TooltipPortal,
};
