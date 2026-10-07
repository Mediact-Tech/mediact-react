import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { OVERLAY_Z } from "./overlay-layer";

/* ชั้นของ overlay ต้องตั้งผ่าน `--mx-z-overlay` ได้ — แอป MUI (Dialog = 1300) ต้องยกขึ้นเอง
 * happy-dom ไม่คำนวณ `var()` ⇒ ล็อกได้แค่ว่าคลาสอยู่ถูกที่ · ค่าจริงวัดในเบราว์เซอร์ (ดู overlay-layer.ts) */
describe("overlay layer", () => {
  it("Popover ใช้ชั้นที่ตั้งได้ ไม่ใช่ z-50 ตายตัว", () => {
    render(
      <Popover open>
        <PopoverTrigger>เปิด</PopoverTrigger>
        <PopoverContent>เนื้อหา</PopoverContent>
      </Popover>,
    );
    const content = screen.getByText("เนื้อหา").closest("[data-state]");
    expect(content?.className).toContain(OVERLAY_Z);
    expect(content?.className).not.toMatch(/(?<![\w-])z-50(?![\w-])/);
  });

  it("ผู้เรียกยังทับชั้นเองได้ — tailwind-merge ถือว่าชนกลุ่มเดียวกัน", () => {
    render(
      <Popover open>
        <PopoverTrigger>เปิด</PopoverTrigger>
        <PopoverContent className="z-[60]">เนื้อหา</PopoverContent>
      </Popover>,
    );
    const content = screen.getByText("เนื้อหา").closest("[data-state]");
    expect(content?.className).toContain("z-[60]");
    expect(content?.className).not.toContain(OVERLAY_Z);
  });
});
