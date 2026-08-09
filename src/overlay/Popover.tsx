import * as React from "react";
import * as RadixPopover from "@radix-ui/react-popover";
import { cn } from "../lib/cn";

const Popover = RadixPopover.Root;
const PopoverTrigger = RadixPopover.Trigger;
const PopoverAnchor = RadixPopover.Anchor;
const PopoverClose = RadixPopover.Close;

type PopoverContentProps = React.ComponentProps<typeof RadixPopover.Content>;

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  function PopoverContent(
    { className, align = "start", sideOffset = 4, ...props },
    ref,
  ) {
    return (
      <RadixPopover.Portal>
        <RadixPopover.Content
          ref={ref}
          /* จุดเกาะที่เสถียรสำหรับผู้เรียก — เนื้อหาถูก portal ออกไปนอกต้นไม้ DOM เดิม
           * แต่ event ของ React ยังลอยขึ้นตามต้นไม้ React ⇒ การ์ดที่คลิกได้ซึ่งมีเมนูอยู่ข้างใน
           * ต้องมีทางแยกแยะว่า "คลิกนี้เกิดในเมนู ไม่ใช่บนการ์ด" · จับเฉพาะ `button` ไม่พอ
           * เพราะช่องว่าง/padding ของเมนูก็ต้องนับด้วย (ของจริงเคยพลาดคลิกออกไปนอกปุ่มไม่กี่พิกเซล
           * แล้วเด้งไปหน้าอื่น) · ชื่อ attribute ตามแบบ shadcn ที่ทั้ง 4 แอปคุ้นอยู่แล้ว */
          data-slot="popover-content"
          align={align}
          sideOffset={sideOffset}
          className={cn(
            "z-50 rounded-sm border border-border-default bg-white p-3 shadow-lg outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            className,
          )}
          {...props}
        />
      </RadixPopover.Portal>
    );
  },
);

PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor, PopoverClose };
