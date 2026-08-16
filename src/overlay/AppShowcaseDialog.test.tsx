/**
 * เหตุผลที่กล่องนี้ย้ายมาอยู่ DS คือ **คำโปรยของผลิตภัณฑ์ต้องมีที่เดียว**
 * (ตระกูลเดียวกับ `ContactSupportDialog` ที่ย้ายมาเพราะเบอร์โทรเคยเพี้ยน 4 ที่)
 *
 * เทสจึงล็อกสิ่งที่พังแล้วเงียบที่สุด:
 * ① คำโปรยเปลี่ยนตามภาษาโดยแอปไม่ต้องส่งข้อความมาเลย
 * ② ช่องทางติดต่อเป็นชุดกลางชุดเดียวกับ `ContactSupportDialog`
 * ③ ปิดกล่องแล้วไม่มีอะไรค้างใน DOM (กล่องนี้ portal ไป `document.body`)
 *
 * ⚠️ happy-dom ไม่จัด layout ⇒ **พิสูจน์ตำแหน่ง/ขนาดที่นี่ไม่ได้** — ตัวเลข px ของ Figma
 *    ต้องวัดใน Storybook เท่านั้น (CLAUDE.md §4.3) · ที่เทสล็อกได้คือโครงกับข้อความ
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  AppShowcaseDialog,
  SHOWCASE_COPY,
  SHOWCASE_LAYOUT,
} from "./AppShowcaseDialog";
import { MEDIACT_LINE_URL, MEDIACT_SUPPORT_PHONE } from "./ContactSupportDialog";

describe("AppShowcaseDialog", () => {
  /**
   * 🔴 ตัวเลขทรงของทั้ง 4 แบบ — เขียนซ้ำที่นี่ **โดยตั้งใจ** (double entry)
   *
   * ตัวเลขชุดนี้ยกมาจาก `APP_CATALOG` ของ Portal (`src/config/apps.ts`) ซึ่งวัดกับ Figma
   * แล้ว pixel-diff มาก่อน · เทสไม่ได้พิสูจน์ว่ามัน "ตรงแบบ" (happy-dom ไม่จัด layout —
   * เรื่องนั้นต้องวัดใน Storybook) แต่พิสูจน์ว่า **ใครแก้ฝั่งเดียวแล้วสองที่ไหลออกจากกัน
   * จะเห็นทันที**
   *
   * ที่ต้องมีเทสนี้เพราะเคยพลาดมาแล้วจริง: รอบแรก Refer/Pay ถูกยกค่าของ HR มาใช้
   * แล้วเปลี่ยนแค่ `x` — อ่านผ่าน ๆ ดูสมเหตุผลเพราะเลขชุด `381.436×280.779` โผล่ซ้ำ
   * ทั้ง 4 แบบ ⇒ ภาพ 2 ผลิตภัณฑ์ออกมาผิดขนาดทั้งใบโดยไม่มีด่านไหนจับได้
   */
  it("ทรงของแต่ละผลิตภัณฑ์ตรงกับชุดที่ Portal ใช้ และไม่ใช่ค่าที่ก๊อปกันมา", () => {
    expect(SHOWCASE_LAYOUT).toEqual({
      medihr: {
        logoHeight: 45,
        columnX: 610.436,
        columnWidth: 284,
        preview: {
          width: 578.436,
          height: 400.855,
          wide: { x: 197, y: 0, width: 381.436, height: 280.779 },
          card: { x: 0, y: 120.076, width: 381.436, height: 280.779 },
        },
      },
      medioncloud: {
        logoHeight: 49,
        columnX: 571,
        columnWidth: 293,
        preview: {
          width: 523.034,
          height: 393,
          wide: { x: 70.631, y: 0, width: 452.403, height: 356.055 },
          card: { x: 0, y: 84.757, width: 141.263, height: 308.243 },
        },
      },
      medirefer: {
        logoHeight: 46,
        columnX: 594,
        columnWidth: 284,
        preview: {
          width: 562,
          height: 414.474,
          wide: { x: 91, y: 0, width: 471, height: 325 },
          card: { x: 0, y: 154.83, width: 253.048, height: 259.644 },
        },
      },
      medipay: {
        logoHeight: 45.75,
        columnX: 577.668,
        columnWidth: 284,
        preview: {
          width: 545.665,
          height: 358.997,
          wide: { x: 86.96, y: 0, width: 458.705, height: 311.856 },
          card: { x: 0, y: 115.64, width: 232.549, height: 243.357 },
        },
      },
    });

    /* กันการก๊อปข้ามผลิตภัณฑ์โดยตรง — ทั้ง 4 แบบวางภาพคนละขนาด ไม่มีคู่ไหนเหมือนกันเป๊ะ */
    const shapes = Object.values(SHOWCASE_LAYOUT).map((l) =>
      JSON.stringify(l.preview),
    );
    expect(new Set(shapes).size).toBe(shapes.length);
  });

  it("คำโปรยมาจาก DS ไม่ใช่จากผู้เรียก และเปลี่ยนตามภาษา", () => {
    /* ⚠️ `getByText` ยุบช่องว่างให้ ⇒ พาดหัวที่มี `\n` ตามแบบจะหาไม่เจอด้วยสตริงตรง ๆ
     * เทียบจาก `textContent` ของ `<h2>` แทน ซึ่งเก็บ `\n` ไว้จริง */
    const headline = () =>
      document.body.querySelector('[role="dialog"] h2')?.textContent;

    const { rerender } = render(
      <AppShowcaseDialog app="medihr" onClose={() => {}} locale="th" />,
    );
    expect(headline()).toBe(SHOWCASE_COPY.medihr.th.headline);

    rerender(<AppShowcaseDialog app="medihr" onClose={() => {}} locale="en" />);
    /* ภาษาไทยต้องหายไปจริง ไม่ใช่ค้างซ้อนกันสองภาษา */
    expect(headline()).toBe(SHOWCASE_COPY.medihr.en.headline);
  });

  it("ทั้ง 4 ผลิตภัณฑ์มีคำโปรยครบทั้ง th และ en", () => {
    /* ถ้าเพิ่มผลิตภัณฑ์แล้วลืมคำแปลข้างใดข้างหนึ่ง กล่องจะพังตอน render ไม่ใช่ตอน build */
    for (const [key, copy] of Object.entries(SHOWCASE_COPY)) {
      for (const locale of ["th", "en"] as const) {
        expect(copy[locale].name, `${key}.${locale}.name`).toBeTruthy();
        expect(copy[locale].headline, `${key}.${locale}.headline`).toBeTruthy();
        expect(
          copy[locale].description,
          `${key}.${locale}.description`,
        ).toBeTruthy();
      }
    }
  });

  it("ใช้ช่องทางติดต่อกลางชุดเดียวกับ ContactSupportDialog", () => {
    render(<AppShowcaseDialog app="medipay" onClose={() => {}} />);

    /* ⚠️ หาด้วย `href` ไม่ใช่ชื่อ — เบอร์ขึ้นต้นด้วย `+` ซึ่งเป็น quantifier ของ regex
     * `new RegExp("+66 …")` จึงไม่ใช่สิ่งที่คนเขียนคิดว่ามันเป็น */
    const links = [
      ...document.body.querySelectorAll<HTMLAnchorElement>(
        '[role="dialog"] a[href]',
      ),
    ].map((a) => a.getAttribute("href"));

    expect(links).toContain(MEDIACT_LINE_URL);
    /* `tel:` ต้องไม่มีช่องว่าง ไม่งั้นบางเบราว์เซอร์ไม่รับ */
    expect(links).toContain(`tel:${MEDIACT_SUPPORT_PHONE.replace(/\s/g, "")}`);
  });

  it("ภาพอ่านจากโฟลเดอร์กลางโดยไม่ต้องส่ง prop และทับได้เมื่อจำเป็น", () => {
    const { rerender } = render(
      <AppShowcaseDialog app="medirefer" onClose={() => {}} />,
    );
    /* ⚠️ ภาพตัวอย่างอยู่ก่อนโลโก้ใน DOM ⇒ `[0]` ไม่ใช่โลโก้ · จับโลโก้จากที่มันอยู่จริง
     * (ในคอลัมน์ขวา) ไม่ใช่จากลำดับ */
    const logo = () =>
      document.body.querySelector<HTMLImageElement>(
        '[role="dialog"] img:not([aria-hidden="true"])',
      );
    expect(logo()?.getAttribute("src")).toContain(
      "/images/app-showcase/medirefer-logo",
    );

    rerender(
      <AppShowcaseDialog
        app="medirefer"
        onClose={() => {}}
        assets={{
          medirefer: {
            logo: "https://cdn.example/logo.png",
            wide: "https://cdn.example/wide.webp",
            card: "https://cdn.example/card.webp",
          },
        }}
      />,
    );
    expect(logo()).toHaveAttribute("src", "https://cdn.example/logo.png");
  });

  it("app = null แล้วไม่เหลืออะไรใน document.body", () => {
    /* 🔴 กล่องนี้ portal ไป body ⇒ ถามจาก `container` จะได้ null เสมอไม่ว่าโค้ดจะถูกหรือผิด
     * (กับดักเดียวกับที่ `dialog-text.test.tsx` เจอ) ⇒ ต้องถามจาก body */
    render(<AppShowcaseDialog app={null} onClose={() => {}} />);
    expect(document.body.querySelector('[role="dialog"]')).toBeNull();
  });
});
