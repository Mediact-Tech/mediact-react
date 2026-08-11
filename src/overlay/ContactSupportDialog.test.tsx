/**
 * เหตุผลที่กล่องนี้ย้ายมาอยู่ DS คือ **ช่องทางติดต่อต้องมีที่เดียว**
 * เทสจึงล็อกสิ่งที่พังแล้วเงียบที่สุด: ลิงก์กับเบอร์ที่ผู้ใช้จะกดจริง
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  ContactSupportDialog,
  MEDIACT_LINE_URL,
  MEDIACT_SUPPORT_PHONE,
} from "./ContactSupportDialog";

const labels = {
  title: "ติดต่อฝ่ายสนับสนุน",
  lineTitle: "สนับสนุนผ่าน LINE",
  lineDescription: "คุยกับทีมช่วยเหลือผ่าน LINE",
  phoneTitle: "สนับสนุนทางโทรศัพท์",
  phoneDescription: "โทรหาเจ้าหน้าที่",
};

describe("ContactSupportDialog", () => {
  it("ใช้ช่องทางติดต่อกลางของ MediAct โดยไม่ต้องส่งอะไรมา", () => {
    render(
      <ContactSupportDialog open onOpenChange={() => {}} labels={labels} />,
    );

    expect(screen.getByRole("link", { name: /@mediact/ })).toHaveAttribute(
      "href",
      MEDIACT_LINE_URL,
    );
    /* `tel:` ต้องไม่มีช่องว่าง ไม่งั้นโทรศัพท์บางเครื่องกดไม่ติด */
    expect(
      screen.getByRole("link", { name: MEDIACT_SUPPORT_PHONE }),
    ).toHaveAttribute("href", "tel:+66941249291");
  });

  it("ทับช่องทางติดต่อได้ เผื่อสภาพแวดล้อมทดสอบ", () => {
    render(
      <ContactSupportDialog
        open
        onOpenChange={() => {}}
        labels={labels}
        phoneNumber="+66 2 000 0000"
      />,
    );
    expect(
      screen.getByRole("link", { name: "+66 2 000 0000" }),
    ).toHaveAttribute("href", "tel:+6620000000");
  });

  it("โลโก้เป็นของผู้เรียก — ไม่ส่งมาก็ยังเปิดได้", () => {
    const { rerender } = render(
      <ContactSupportDialog open onOpenChange={() => {}} labels={labels} />,
    );
    expect(screen.queryByAltText("MediAct")).toBeNull();

    rerender(
      <ContactSupportDialog
        open
        onOpenChange={() => {}}
        labels={labels}
        logo={<img src="/logo.svg" alt="MediAct" />}
      />,
    );
    expect(screen.getByAltText("MediAct")).toBeInTheDocument();
  });
});
