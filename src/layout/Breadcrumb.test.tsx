/**
 * ยามของแถบนำทาง — ล็อกว่าสีตัวหนังสือ **ไม่ตามสีแบรนด์**
 *
 * 🔴 ของเดิมใช้ `text-brand` ทั้งที่หน้าปัจจุบันและที่ hover ของลิงก์ ⇒ แถบนำทาง
 * เปลี่ยนสีตามแอป · เช็คของจริงแล้วไม่มีแอปไหนทำแบบนั้น และบน Mediwork จะได้
 * มิ้นต์บนขาว 1.93:1 อ่านไม่ออก (กับดักเดียวกับเมนูย่อยของ `Sidebar` และ `DataTable`)
 *
 * ⚠️ happy-dom ไม่คำนวณเลย์เอาต์และไม่ resolve ตัวแปร CSS ⇒ พิสูจน์สีจริงไม่ได้ที่นี่
 * ล็อกได้แค่ว่า **ชื่อคลาสที่ผูกกับแบรนด์ไม่โผล่ในแถบนี้** ซึ่งเป็นสิ่งที่ regression จริง
 * จะไปแตะ · สีที่ render จริงวัดในเบราว์เซอร์แล้ว (บันทึกใน `Breadcrumb.md`)
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Breadcrumb, BreadcrumbLink } from "./Breadcrumb";

const items = [
  { label: "หน้าแรก", href: "/" },
  { label: "ตั้งค่า", onClick: () => {} },
  { label: "ตั้งค่าตำแหน่ง" },
];

describe("สีไม่ตามแบรนด์", () => {
  it("ไม่มี utility ที่ผูกกับแบรนด์อยู่ในแถบเลยสักตัว", () => {
    const { container } = render(<Breadcrumb items={items} />);
    const classes = [...container.querySelectorAll("*")]
      .map((el) => el.getAttribute("class") ?? "")
      .join(" ");
    // จับทั้ง `text-brand` และ `hover:text-brand` · `(?<![\w-])` เพราะ `\b` จะไป
    // match กลางชื่อ token อื่น (บทเรียนจาก tokens.guard)
    expect(classes).not.toMatch(/(?<![\w-])(hover:)?text-brand(?![\w-])/);
    /* `text-text-primary` alias ไป `--color-brand` ใน theme.css ⇒ ห้ามเช่นกัน
     * ถึงชื่อจะอ่านเหมือน "สีตัวอักษรหลัก" */
    expect(classes).not.toMatch(/(?<![\w-])(hover:)?text-text-primary(?![\w-])/);
  });

  it("หน้าปัจจุบันเป็น text-heading คงที่ + หนา", () => {
    render(<Breadcrumb items={items} />);
    const current = screen.getByText("ตั้งค่าตำแหน่ง");
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current.className).toContain("text-text-heading");
    expect(current.className).toContain("font-semibold");
  });

  it("ลิงก์กับปุ่ม hover แล้วเข้มขึ้น ไม่ใช่เปลี่ยนเป็นสีแบรนด์", () => {
    render(<Breadcrumb items={items} />);
    for (const name of ["หน้าแรก", "ตั้งค่า"]) {
      expect(screen.getByText(name).className).toContain(
        "hover:text-text-black",
      );
    }
  });

  /* ทางออกระดับล่างต้องตรงกับตัวเต็ม ไม่งั้นสองอันบนจอเดียวกันจะสีไม่ตรงกัน */
  it("`BreadcrumbLink` ใช้สีชุดเดียวกับลิงก์ในตัวเต็ม", () => {
    render(<BreadcrumbLink href="/">ย้อนกลับ</BreadcrumbLink>);
    const link = screen.getByText("ย้อนกลับ");
    expect(link.className).toContain("text-text-tertiary");
    expect(link.className).toContain("hover:text-text-black");
  });
});
