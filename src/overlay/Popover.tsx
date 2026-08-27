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
    { className, align = "start", sideOffset = 4, onWheel, onTouchMove, ...props },
    ref,
  ) {
    /* 🔴🔴 **popover ที่เปิดอยู่ในโมดัลจะ *เลื่อนไม่ได้* ถ้าไม่มี 2 บรรทัดนี้ — ครึ่งที่สองของบั๊กเดียวกับ
     *      `pointer-events-auto` ข้างล่าง**
     *
     * Radix `Dialog` โหมด modal ใช้ `react-remove-scroll` ซึ่งผูก `wheel`/`touchmove` ไว้ที่
     * **`document`** (`{ passive: false }` · **bubble ไม่ใช่ capture** — ยืนยันจาก
     * `SideEffect.js:139-140`) แล้วสั่ง `preventDefault()` กับทุก event ที่เกิด *นอก* กล่องที่มัน
     * ล็อกไว้ · `PopoverContent` portal ออกไปอยู่ใต้ `<body>` **นอก** `DialogContent` ⇒ ล้อเมาส์
     * เหนือแผงถูกกลืนทั้งหมด
     *
     * ⚠️ **พังเงียบและดูเหมือนใช้ได้ครึ่งหนึ่ง** — คลิกเลือกได้ (เพราะ `pointer-events-auto` แก้ไป
     *    แล้ว) แต่หมุนล้อไม่ได้ ⇒ ตัวเลือกที่อยู่นอกกรอบเข้าไม่ถึงเลย (พบจริงบน
     *    mediact-web-backoffice 2026-08-26: `TimePicker` ในโมดัล เลือกได้แค่ชั่วโมงที่มองเห็น)
     *
     * 🔑 **หยุดที่ตัวแผง = `document` ไม่เคยได้ยิน event** ⇒ ตัวมันเองเลื่อนตามปกติ และหน้าเบื้องหลัง
     *    **ยังล็อกอยู่เหมือนเดิม** (RRS ตั้ง `overflow: hidden` ที่ `<body>` แยกต่างหาก)
     *    ⛔ ห้ามแก้ด้วยการปลด `modal` ของ `Dialog` — จะเสีย focus trap และ pointer-lock ไปด้วย
     *
     * ⚠️ **RRS ผูกแบบ bubble จึงหยุดทัน** — ถ้าวันหนึ่งมันเปลี่ยนไปใช้ capture ทางนี้จะใช้ไม่ได้
     *    และต้องไปทางอื่น (ให้ `Dialog` ส่งแผงเป็น *shard* ของ RRS) */
    const stopScrollLock = React.useCallback((event: React.SyntheticEvent) => {
      event.stopPropagation();
    }, []);

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
            /* 🔴 `pointer-events-auto` — popover ที่เปิดอยู่**ในโมดัล**จะกดไม่ได้ทั้งใบถ้าไม่มีบรรทัดนี้
             *
             * Radix `Dialog` โหมด modal ตั้ง `pointer-events: none` ที่ `<body>` แล้วเปิดคืนเฉพาะ
             * `DialogContent` · แต่ `PopoverContent` portal ออกไปอยู่ใต้ `<body>` **นอก**
             * `DialogContent` จึงสืบทอด `none` มาเต็ม ๆ ⇒ คลิกทะลุไปโดนของที่อยู่ใต้โมดัลแทน
             * (วัดสด: `elementFromPoint` ที่ตัวเลือกชั่วโมง คืนแถวตารางที่อยู่ข้างหลังโมดัล)
             *
             * ⚠️ พังเงียบสนิท — popover เปิดออกมาสวยงามครบทุกอย่าง แค่กดไม่ติด
             * ไม่มี error ไม่มี warning · เคยแก้เฉพาะจุดที่ `DatePicker` มาก่อน แล้ว `TimePicker`
             * ก็เจอเรื่องเดียวกันอีก ⇒ ย้ายมาแก้ที่ primitive ตัวนี้ให้จบทีเดียวทุกตัวที่ใช้ `Popover` */
            "pointer-events-auto z-50 rounded-sm border border-border-default bg-white p-3 shadow-lg outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            className,
          )}
          onWheel={(event) => {
            stopScrollLock(event);
            onWheel?.(event);
          }}
          onTouchMove={(event) => {
            stopScrollLock(event);
            onTouchMove?.(event);
          }}
          {...props}
        />
      </RadixPopover.Portal>
    );
  },
);

PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor, PopoverClose };
