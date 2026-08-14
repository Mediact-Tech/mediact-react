import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Text } from "./ui/Text";
import { Heading } from "./ui/Heading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./overlay/Dialog";

/**
 * ด่านกัน "component พึ่ง preflight ของผู้ใช้"
 *
 * 🔴 ที่มา: Mediwork **ตัด preflight ของ Tailwind ออกทั้งก้อน** เพื่อไม่ให้ชนกับ MUI
 * แล้วกู้คืนมาเฉพาะบางส่วน ⇒ ทุก tag ที่ UA stylesheet ให้ margin มาฟรี
 * (`p` = `1em 0` · `h2` = `0.83em 0`) จะได้ระยะที่ไม่มีใครสั่ง
 *
 * วัดจากจอจริง: หัวข้อ dialog ได้ `margin-bottom: 16.6px` (= `0.83em × 20px`) และ
 * กล่องรายละเอียดที่มี `<p>` 8 ตัวบวมจนสูงเต็มจอ ทั้งที่ DS ไม่มีกฎความสูงสักบรรทัด
 *
 * ที่แอปกู้เองไม่พอ เพราะ `Dialog`/`Popover` เรนเดอร์ผ่าน Radix Portal ซึ่งย้าย DOM
 * ไปแขวนที่ `document.body` ⇒ **หลุดออกนอก subtree ที่แอปเขียนกฎคุมไว้**
 *
 * ⚠️ happy-dom ไม่จัด layout และไม่ได้ใส่ UA stylesheet ให้ครบ ⇒ วัด
 * `getComputedStyle().marginBottom` ที่นี่พิสูจน์อะไรไม่ได้ · ที่ล็อกได้จริงคือ
 * **โครงสร้าง** คือคลาสต้องมี `m-0` ติดออกไปด้วยเสมอ (ตรงกับที่ CLAUDE.md §9 บอกว่า
 * pixel parity พิสูจน์ได้ที่ Storybook เท่านั้น)
 *
 * ✅ ยืนยันด่านด้วยการทำให้พังจริง ไม่ใช่ด้วยการอ่าน — ถอด `m-0` ออกจาก base ของ
 * แต่ละตัวแล้วเทสตกทั้ง 4 ข้อ ก่อนใส่กลับ
 */
describe("UA margin — DS ต้องล้างเอง ไม่ฝากไว้กับ preflight ของผู้ใช้", () => {
  it("`Text` (เรนเดอร์ `<p>`) ล้าง margin ของเบราว์เซอร์", () => {
    render(<Text>เนื้อความ</Text>);

    expect(screen.getByText("เนื้อความ").className).toContain("m-0");
  });

  it("`Heading` (เรนเดอร์ `<h1>`–`<h6>`) ล้าง margin ของเบราว์เซอร์", () => {
    render(<Heading level={2}>หัวข้อ</Heading>);

    const heading = screen.getByRole("heading", { name: "หัวข้อ" });
    expect(heading.tagName).toBe("H2");
    expect(heading.className).toContain("m-0");
  });

  /* 🔴 ต้องหาใน `document.body` ไม่ใช่ `container` — dialog ถูก Portal ออกไป
   * (กับดักเดียวกับที่ `CLAUDE.md` §9 บันทึกไว้: เทสที่ query `container`
   * จะได้ `null` เสมอไม่ว่า component จะทำอะไร ⇒ ผ่านทั้งที่ยังไม่มีฟีเจอร์) */
  it("`DialogTitle` / `DialogDescription` ล้าง margin ทั้งคู่ แม้ถูก Portal ออกไป", () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>หัวข้อกล่อง</DialogTitle>
          <DialogDescription>คำอธิบาย</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    const title = screen.getByRole("heading", { name: "หัวข้อกล่อง" });
    expect(title.tagName).toBe("H2");
    expect(title.className).toContain("m-0");
    expect(screen.getByText("คำอธิบาย").className).toContain("m-0");
  });

  /* ผู้เรียกต้องทับได้ตามปกติ — `m-0` อยู่ที่ base ไม่ใช่ที่ท้ายสุด
   *
   * ⚠️ tailwind-merge **ไม่ลบ `m-0` ทิ้ง** เมื่อเจอ `mb-2` (คนละกลุ่มย่อย) ทั้งคู่จึง
   * ติดไปด้วยกัน · ที่ใช้ได้จริงเพราะ **Tailwind เรียง `mb-*` ไว้หลัง `m-*` ในไฟล์ CSS
   * ที่ generate ออกมา** ⇒ `mb-2` ชนะด้วยลำดับ ไม่ใช่ด้วยลำดับคลาสใน `className` */
  it("ผู้เรียกยังทับระยะเองได้", () => {
    render(<Text className="mb-2">มีระยะล่าง</Text>);

    expect(screen.getByText("มีระยะล่าง").className).toContain("mb-2");
  });
});
