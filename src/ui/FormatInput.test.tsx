import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormatInput, type FormatInputProps } from "./FormatInput";

/** ช่องที่ควบคุมค่าเอง — สะท้อนวิธีใช้จริง (ผู้เรียกเก็บ state เป็นค่าดิบ) */
function Controlled(props: Omit<FormatInputProps, "value" | "onValueChange">) {
  const [raw, setRaw] = useState("");
  return (
    <>
      <FormatInput {...props} value={raw} onValueChange={setRaw} />
      <output data-testid="raw">{raw}</output>
    </>
  );
}

const shown = () => (screen.getByLabelText("ช่อง") as HTMLInputElement).value;
const raw = () => screen.getByTestId("raw").textContent;

describe("FormatInput", () => {
  describe("รูปแบบสำเร็จรูป", () => {
    it("thaiId ใส่ขีดให้ระหว่างพิมพ์", async () => {
      const user = userEvent.setup();
      render(<Controlled label="ช่อง" format="thaiId" />);
      await user.type(screen.getByLabelText("ช่อง"), "1234567890123");
      expect(shown()).toBe("1-2345-67890-12-3");
    });

    it("phone 10 หลัก", async () => {
      const user = userEvent.setup();
      render(<Controlled label="ช่อง" format="phone" />);
      await user.type(screen.getByLabelText("ช่อง"), "0812345678");
      expect(shown()).toBe("081-234-5678");
    });

    it("bankAccount 10 หลัก", async () => {
      const user = userEvent.setup();
      render(<Controlled label="ช่อง" format="bankAccount" />);
      await user.type(screen.getByLabelText("ช่อง"), "1234567890");
      expect(shown()).toBe("123-4-56789-0");
    });

    it("currency ใส่ตัวคั่นหลักพันและตัดทศนิยมที่ 2", async () => {
      const user = userEvent.setup();
      render(<Controlled label="ช่อง" format="currency" />);
      await user.type(screen.getByLabelText("ช่อง"), "1234567.891");
      expect(shown()).toBe("1,234,567.89");
    });
  });

  /* 🔴 กติกาสำคัญที่สุดของ component นี้ — สิ่งที่ส่งขึ้นหลังบ้านต้องเป็นค่าดิบ
   * ไม่ใช่สิ่งที่ตาเห็น มีสองทางออกเมื่อไหร่จะมีคนส่งผิด */
  describe("onValueChange คืนค่าดิบเสมอ", () => {
    it("thaiId — ไม่มีขีดในค่าที่คืน", async () => {
      const user = userEvent.setup();
      render(<Controlled label="ช่อง" format="thaiId" />);
      await user.type(screen.getByLabelText("ช่อง"), "1234567890123");
      expect(raw()).toBe("1234567890123");
    });

    it("currency — ไม่มีตัวคั่นหลักพันในค่าที่คืน", async () => {
      const user = userEvent.setup();
      render(<Controlled label="ช่อง" format="currency" />);
      await user.type(screen.getByLabelText("ช่อง"), "1234567");
      expect(raw()).toBe("1234567");
    });
  });

  describe("ขอบเขตของรูปแบบ", () => {
    it("ตัวเลขเกินความยาวของ mask ถูกตัดทิ้ง", async () => {
      const user = userEvent.setup();
      render(<Controlled label="ช่อง" format="thaiId" />);
      await user.type(screen.getByLabelText("ช่อง"), "12345678901234567");
      expect(raw()).toBe("1234567890123");
    });

    it("currency ไม่รับค่าติดลบโดยปริยาย", async () => {
      const user = userEvent.setup();
      render(<Controlled label="ช่อง" format="currency" />);
      await user.type(screen.getByLabelText("ช่อง"), "-500");
      expect(raw()).toBe("500");
    });
  });

  describe("รูปแบบที่ส่งเข้ามาเอง", () => {
    it("รับ mask เป็นสตริงได้โดยไม่ต้องเพิ่ม preset", async () => {
      const user = userEvent.setup();
      render(<Controlled label="ช่อง" format="##-###-######" />);
      await user.type(screen.getByLabelText("ช่อง"), "12345678901");
      expect(shown()).toBe("12-345-678901");
    });

    it("รับฟังก์ชันที่มีทั้งขาจัดและขาถอด", async () => {
      const user = userEvent.setup();
      render(
        <Controlled
          label="ช่อง"
          format={{
            format: (v) => (v.length > 2 ? `${v.slice(0, 2)} ${v.slice(2)}` : v),
            removeFormatting: (v) => v.replace(/\s/g, ""),
          }}
        />,
      );
      await user.type(screen.getByLabelText("ช่อง"), "123456");
      expect(shown()).toBe("12 3456");
      expect(raw()).toBe("123456");
    });
  });

  describe("สืบทอดจาก Input", () => {
    it("แสดง error พร้อม role=alert", () => {
      render(
        <FormatInput label="ช่อง" format="thaiId" error="เลขบัตรไม่ถูกต้อง" />,
      );
      expect(screen.getByRole("alert")).toHaveTextContent("เลขบัตรไม่ถูกต้อง");
    });

    it("isLoading แทนช่องด้วยโครงร่าง", () => {
      render(<FormatInput label="ช่อง" format="thaiId" isLoading />);
      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.queryByLabelText("ช่อง")).toBeNull();
    });

    it("disabled ส่งถึง input จริง", () => {
      render(<FormatInput label="ช่อง" format="phone" disabled />);
      expect(screen.getByLabelText("ช่อง")).toBeDisabled();
    });

    it("รับ prefixIcon ได้", () => {
      render(
        <FormatInput
          label="ช่อง"
          format="currency"
          prefixIcon={<span data-testid="baht">฿</span>}
        />,
      );
      expect(screen.getByTestId("baht")).toBeInTheDocument();
    });
  });

  it("ไม่เรียก onValueChange เมื่อไม่มีการพิมพ์", () => {
    const onValueChange = vi.fn();
    render(
      <FormatInput label="ช่อง" format="thaiId" onValueChange={onValueChange} />,
    );
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
