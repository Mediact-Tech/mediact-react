import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

/**
 * `PopoverContent` — สองครึ่งของบั๊กเดียวกัน: **popover ที่เปิดอยู่ในโมดัล**
 *
 * `PopoverContent` portal ออกไปอยู่ใต้ `<body>` **นอก** `DialogContent` เสมอ ⇒ มันตกอยู่ใต้กติกา
 * ของ `Dialog` โหมด modal ซึ่งล็อกทั้ง *การกด* และ *การเลื่อน* ไว้เฉพาะในกล่องของตัวเอง
 *
 * | ครึ่ง | อาการ | ทางแก้ |
 * |---|---|---|
 * | กดไม่ได้ | `pointer-events: none` สืบทอดจาก `<body>` | `pointer-events-auto` (แก้ไปแล้ว) |
 * | **เลื่อนไม่ได้** | `react-remove-scroll` ผูก `wheel` ที่ `document` แล้ว `preventDefault()` | **หยุด propagation ที่ตัวแผง** |
 *
 * 🔴🔴 **ทั้งคู่พังเงียบสนิท** — ไม่มี error ไม่มี warning · แผงเปิดออกมาสวยครบทุกอย่าง
 *      ⇒ ไฟล์นี้เป็นด่านเดียวที่กันไม่ให้ทั้งสองครึ่งหลุดกลับไป
 */
describe("PopoverContent", () => {
  const openPopover = async (content: React.ReactNode) => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger>open</PopoverTrigger>
        <PopoverContent>{content}</PopoverContent>
      </Popover>,
    );
    await user.click(screen.getByText("open"));
    return screen.findByText("inside");
  };

  describe("การเลื่อนในโมดัล", () => {
    it("🔴 หยุด wheel ไม่ให้ถึง document — ไม่งั้น react-remove-scroll จะ preventDefault ทิ้ง", async () => {
      /* GIVEN — ดักที่ `document` ตรงตำแหน่งเดียวกับที่ `react-remove-scroll` ผูกไว้จริง
         (`SideEffect.js:139` · `wheel` · `{ passive: false }` · **bubble ไม่ใช่ capture**) */
      const atDocument = vi.fn();
      document.addEventListener("wheel", atDocument);
      const node = await openPopover(<div>inside</div>);

      // WHEN — หมุนล้อเหนือแผง
      node.dispatchEvent(new WheelEvent("wheel", { bubbles: true, cancelable: true }));

      /* THEN — event ต้องไม่เคยไปถึง `document` ⇒ ตัวล็อกไม่มีโอกาสสั่ง `preventDefault()`
         ⛔ ถอดออกเมื่อไหร่ ตัวเลือกที่อยู่นอกกรอบจะเข้าไม่ถึงเลยเมื่อแผงอยู่ในโมดัล */
      expect(atDocument).not.toHaveBeenCalled();
      document.removeEventListener("wheel", atDocument);
    });

    it("🔴 หยุด touchmove ด้วย — จอสัมผัสเจอปัญหาเดียวกัน", async () => {
      const atDocument = vi.fn();
      document.addEventListener("touchmove", atDocument);
      const node = await openPopover(<div>inside</div>);

      node.dispatchEvent(new Event("touchmove", { bubbles: true, cancelable: true }));

      expect(atDocument).not.toHaveBeenCalled();
      document.removeEventListener("touchmove", atDocument);
    });

    it("ยังเรียก onWheel ของผู้เรียกต่อ — การหยุด propagation ต้องไม่กลืน handler", async () => {
      const onWheel = vi.fn();
      const user = userEvent.setup();
      render(
        <Popover>
          <PopoverTrigger>open</PopoverTrigger>
          <PopoverContent onWheel={onWheel}>
            <div>inside</div>
          </PopoverContent>
        </Popover>,
      );
      await user.click(screen.getByText("open"));
      const node = await screen.findByText("inside");

      node.dispatchEvent(new WheelEvent("wheel", { bubbles: true, cancelable: true }));

      expect(onWheel).toHaveBeenCalledTimes(1);
    });
  });

  describe("การกดในโมดัล", () => {
    it("🔴 มี pointer-events-auto — ไม่งั้นทั้งแผงกดไม่ได้เมื่ออยู่ในโมดัล", async () => {
      /* `Dialog` โหมด modal ตั้ง `pointer-events: none` ที่ `<body>` แล้วเปิดคืนเฉพาะ
         `DialogContent` · แผงที่ portal ออกไปจึงสืบทอด `none` มาเต็ม ๆ */
      const node = await openPopover(<div>inside</div>);
      const content = node.closest('[data-slot="popover-content"]');

      expect(content).toHaveClass("pointer-events-auto");
    });
  });
});
