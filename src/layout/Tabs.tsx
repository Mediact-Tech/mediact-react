import * as React from "react";
import * as RadixTabs from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const Tabs = RadixTabs.Root;

const tabsListVariants = cva("inline-flex items-center", {
  variants: {
    variant: {
      underline:
        "w-full justify-start gap-1 border-b border-border-default",
      pill: "gap-1 rounded-md bg-gray-100 p-1",
    },
  },
  defaultVariants: { variant: "underline" },
});

const tabsTriggerVariants = cva(
  /* `cursor-pointer` — `<button>` ของเบราว์เซอร์เป็น `cursor: default` และ preflight ของ
   * Tailwind v4 **ไม่ได้ตั้ง pointer ให้ปุ่มอีกแล้ว** (ต่างจาก v3) ⇒ ต้องระบุเอง
   * พี่น้องใน DS ระบุกันหมดแล้ว (`Button` · `IconButton` · วันในปฏิทิน · หัวตารางที่เรียงได้ ·
   * ปุ่มติดต่อฝ่ายสนับสนุนของ `Sidebar`) มีแต่แท็บที่ตกหล่น — วัดใน Storybook เองก็เป็น
   * `default` จึงไม่ใช่ปัญหาของแอปปลายทาง */
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap text-body-sm font-medium transition-all outline-none disabled:pointer-events-none disabled:cursor-default disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-brand/40",
  {
    variants: {
      variant: {
        underline:
          "px-3 pb-2 pt-1 -mb-px border-b-2 border-transparent text-text-tertiary hover:text-brand data-[state=active]:border-brand data-[state=active]:text-brand",
        pill: "rounded-sm px-3 py-1.5 text-text-tertiary hover:text-brand data-[state=active]:bg-white data-[state=active]:text-brand data-[state=active]:shadow-sm",
      },
    },
    defaultVariants: { variant: "underline" },
  },
);

type TabsListProps = React.ComponentProps<typeof RadixTabs.List> &
  VariantProps<typeof tabsListVariants>;

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  function TabsList({ className, variant, ...props }, ref) {
    return (
      <RadixTabs.List
        ref={ref}
        data-tabs-variant={variant ?? "underline"}
        className={cn(tabsListVariants({ variant }), className)}
        {...props}
      />
    );
  },
);

type TabsTriggerProps = React.ComponentProps<typeof RadixTabs.Trigger> &
  VariantProps<typeof tabsTriggerVariants>;

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  function TabsTrigger({ className, variant, ...props }, ref) {
    return (
      <RadixTabs.Trigger
        ref={ref}
        className={cn(tabsTriggerVariants({ variant }), className)}
        {...props}
      />
    );
  },
);

const TabsContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RadixTabs.Content>
>(function TabsContent({ className, ...props }, ref) {
  return (
    <RadixTabs.Content
      ref={ref}
      className={cn(
        "mt-4 outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
        className,
      )}
      {...props}
    />
  );
});

TabsList.displayName = "TabsList";
TabsTrigger.displayName = "TabsTrigger";
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
