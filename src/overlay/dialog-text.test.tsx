/**
 * ยามกันสีข้อความของตระกูล dialog เลื่อนกลับไปตามแบรนด์
 *
 * `--color-text-primary` ใน `theme.css` ถูก alias ไปที่ `--color-brand`
 * ⇒ อะไรที่ใช้ token นั้นจะเปลี่ยนสีตามแอป ซึ่งสำหรับ "หัวข้อ" กับ "ปุ่มยกเลิก"
 * ไม่ถูก — ของจริงทั้งสามแอปฝังสีเข้มไว้ตายตัว (portal/medimatch `#283541` ·
 * mediwork `#374151`) ไม่มีใครให้ตามแบรนด์
 *
 * ⚠️ happy-dom ไม่ resolve สี — พิสูจน์ค่าจริงได้แค่ใน Storybook
 * ที่นี่ล็อกแค่ "ใช้ token ไหน" ซึ่งเป็นจุดที่พังเงียบ
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ConfirmDialog } from "./ConfirmDialog";
import { Dialog, DialogContent, DialogTitle } from "./Dialog";

const BRAND_ALIASED = "text-text-primary";

describe("ข้อความใน dialog ต้องไม่ตามสีแบรนด์", () => {
  it("ConfirmDialog: หัวข้อเป็นดำคงที่", () => {
    render(
      <ConfirmDialog
        open
        onOpenChange={() => {}}
        title="ยืนยันการลบ"
        description="ลบแล้วกู้คืนไม่ได้"
      />,
    );
    const title = screen.getByText("ยืนยันการลบ");
    expect(title.className).toContain("text-text-black");
    expect(title.className).not.toContain(BRAND_ALIASED);
  });

  it("ConfirmDialog: ปุ่มยกเลิกเป็นสีกลาง ไม่ใช่แบรนด์", () => {
    render(
      <ConfirmDialog
        open
        onOpenChange={() => {}}
        title="ยืนยัน"
        cancelLabel="ยกเลิก"
      />,
    );
    const cancel = screen.getByRole("button", { name: "ยกเลิก" });
    /* Portal วัดได้ `slate-900` ≈ `#0f172a` (เกือบดำ) ไม่ใช่สีเทากลาง */
    expect(cancel.className).toContain("text-text-black");
    /* `Button variant="secondary"` ให้ `text-brand` มาเอง — ต้องถูกทับ
     * ไม่งั้นเป็นสีแบรนด์ทั้งที่ override สีไปแล้ว */
    expect(cancel.className).not.toContain(BRAND_ALIASED);
  });

  it("Dialog ธรรมดา: หัวข้อดำเหมือนกัน — สองแบบอยู่จอเดียวกันได้", () => {
    render(
      <Dialog open onOpenChange={() => {}}>
        <DialogContent>
          <DialogTitle>แก้ไขข้อมูล</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    const title = screen.getByText("แก้ไขข้อมูล");
    expect(title.className).toContain("text-text-black");
    expect(title.className).not.toContain(BRAND_ALIASED);
  });

  it("คำอธิบายเข้มเท่าหัวข้อ — ใน confirm dialog บรรทัดนี้คือผลที่จะเกิด", () => {
    /* Portal ใช้สีเดียวกับหัวข้อ (`#283541`) ไม่ได้ทำให้จาง
     * ต่างจาก `DialogDescription` ทั่วไปที่เป็น `text/body` */
    render(
      <ConfirmDialog
        open
        onOpenChange={() => {}}
        title="ยืนยัน"
        description="รายละเอียดเพิ่มเติม"
      />,
    );
    const desc = screen.getByText("รายละเอียดเพิ่มเติม");
    expect(desc.className).toContain("text-text-black");
    expect(desc.className).toContain("leading-relaxed");
  });
});

/* ────────────────────────────────────────────────────────────────────────────
 * ปิดปุ่มยืนยันได้ โดยที่ปุ่มยกเลิกยังกดได้
 *
 * 🔴 `ConfirmDialogActions` รับ `confirmDisabled` มาตั้งแต่แรก แต่ `ConfirmDialog`
 * **ไม่ได้ส่งต่อให้** ⇒ กล่องที่ "ยืนยันไม่ได้จนกว่าจะรู้ผล" (เช่นจอถอดคนที่ต้องรอ
 * preview ผลกระทบ) เขียนด้วย `ConfirmDialog` ไม่ได้เลย ต้องไปประกอบเองจากชิ้นส่วน
 *
 * ต้องไม่เผลอไปปิดปุ่มยกเลิกด้วย — ผู้ใช้ที่ยืนยันไม่ได้ต้องออกจากกล่องได้เสมอ
 * ──────────────────────────────────────────────────────────────────────────── */
describe("confirmDisabled", () => {
  it("ปิดเฉพาะปุ่มยืนยัน ปุ่มยกเลิกยังกดได้", () => {
    render(
      <ConfirmDialog
        open
        onOpenChange={() => {}}
        title="ยืนยัน"
        confirmLabel="ถอดออก"
        cancelLabel="ยกเลิก"
        confirmDisabled
      />,
    );
    expect(screen.getByRole("button", { name: "ถอดออก" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "ยกเลิก" })).toBeEnabled();
  });

  it("ไม่ส่งมา = ปุ่มยืนยันกดได้", () => {
    render(
      <ConfirmDialog
        open
        onOpenChange={() => {}}
        title="ยืนยัน"
        confirmLabel="ถอดออก"
      />,
    );
    expect(screen.getByRole("button", { name: "ถอดออก" })).toBeEnabled();
  });
});

describe("ทรงต้องตรงกับ ConfirmModal ของ Portal", () => {
  /* ⚠️ `DialogContent` render ผ่าน portal ไปที่ `document.body`
   * ⇒ `container` ของ RTL **ไม่มีเนื้อหา dialog อยู่เลย** ถ้าค้นจาก container
   * เทส "ไม่มีเส้นคั่น" จะผ่านทุกครั้งโดยไม่ได้พิสูจน์อะไร */
  const divider = () => document.body.querySelector('[aria-hidden][class*="h-1"]');

  it("ไม่มีเส้นคั่นใต้หัวข้อโดยปริยาย — Portal ไม่มีสักจอ", () => {
    render(
      <ConfirmDialog open onOpenChange={() => {}} title="ยืนยัน" tone="danger" />,
    );
    expect(divider()).toBeNull();
  });

  it("ยังเปิดเส้นคั่นเองได้ สำหรับทรงของ medimatch/mediwork", () => {
    render(
      <ConfirmDialog
        open
        onOpenChange={() => {}}
        title="ยืนยัน"
        tone="danger"
        divider
      />,
    );
    expect(divider()).not.toBeNull();
  });

  it("ปุ่มทั้งคู่ตัวอักษร 16px — Portal วัดได้ 16/500 ไม่ใช่ 14 ของ Button", () => {
    render(
      <ConfirmDialog
        open
        onOpenChange={() => {}}
        title="ยืนยัน"
        confirmLabel="ลบ"
        cancelLabel="ยกเลิก"
      />,
    );
    for (const name of ["ลบ", "ยกเลิก"]) {
      const btn = screen.getByRole("button", { name });
      expect(btn.className).toContain("text-body-md");
      expect(btn.className).toContain("font-medium");
    }
  });

  it("เส้นคั่น 48×4 — วัดจาก 4 จอของ Portal ที่วาดเส้นเอง ไม่ใช่ 40 ของเดิม", () => {
    render(
      <ConfirmDialog
        open
        onOpenChange={() => {}}
        title="ยืนยัน"
        tone="danger"
        divider
      />,
    );
    expect(divider()!.className).toContain("w-12");
    expect(divider()!.className).not.toContain("w-10");
  });

  it("มีเส้นคั่นแล้วคำอธิบายเว้น 16 ไม่ใช่ 8", () => {
    render(
      <ConfirmDialog
        open
        onOpenChange={() => {}}
        title="ยืนยัน"
        description="รายละเอียด"
        divider
      />,
    );
    expect(screen.getByText("รายละเอียด").className).toContain("mt-4");
  });

  it("ขอบปุ่มยกเลิกใช้ค่าที่วัดจาก Portal (#8995a1)", () => {
    render(
      <ConfirmDialog
        open
        onOpenChange={() => {}}
        title="ยืนยัน"
        cancelLabel="ยกเลิก"
      />,
    );
    expect(screen.getByRole("button", { name: "ยกเลิก" }).className).toContain(
      "border-text-nuetral-dark-600",
    );
  });
});

describe("ช่องเนื้อหาเพิ่มเติมใต้คำอธิบาย", () => {
  const renderWith = (extra?: React.ReactNode) =>
    render(
      <ConfirmDialog
        open
        onOpenChange={() => {}}
        title="ยืนยันการลบ"
        description="ลบแล้วกู้คืนไม่ได้"
        confirmLabel="ลบ"
      >
        {extra}
      </ConfirmDialog>,
    );

  it("render อยู่ใต้คำอธิบาย และเหนือปุ่ม", () => {
    renderWith(<ul data-testid="extra"><li>หอผู้ป่วยใน 1</li></ul>);
    const desc = screen.getByText("ลบแล้วกู้คืนไม่ได้");
    const extra = screen.getByTestId("extra");
    const confirm = screen.getByRole("button", { name: "ลบ" });
    /* เทียบลำดับใน DOM — happy-dom ไม่คำนวณตำแหน่ง แต่ลำดับเป็นสิ่งที่ล็อกได้ */
    expect(desc.compareDocumentPosition(extra) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(extra.compareDocumentPosition(confirm) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("ไม่ส่งอะไรมา = ไม่มีกล่องเปล่าเกินมา", () => {
    /* `children == null` ต้องไม่ render `<div className="mt-5">` ทิ้งไว้
     * ไม่งั้นระยะก่อนถึงปุ่มจะเพิ่มมา 20px โดยไม่มีอะไรอยู่ในนั้น */
    renderWith(undefined);
    expect(document.body.querySelector(".mt-5:empty")).toBeNull();
  });

  it("ไม่บังคับการจัดวาง — ของจริงใน Portal ที่ส่ง JSX มาล้วนจัดกึ่งกลาง", () => {
    renderWith(<span data-testid="extra">เนื้อหา</span>);
    const wrap = screen.getByTestId("extra").parentElement!;
    expect(wrap.className).toBe("mt-5");
  });
});
