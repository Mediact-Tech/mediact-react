import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Avatar, avatarToneIndex } from "./Avatar";

/* วงกลมย่อชื่อ — สิ่งที่ต้องล็อกไว้คือ "คนเดิมได้สีเดิม" กับ "สีไม่กินขนาดตัวอักษร" */

const root = (name: string) => screen.getByText(name).parentElement!;

describe("Avatar — โทนสีตาม colorKey", () => {
  it("คีย์เดิมได้โทนเดิมเสมอ", () => {
    // ไม่ผูกกับเลข index ตรง ๆ — สิ่งที่สัญญาไว้คือ "คงที่" ไม่ใช่ "เป็นเลขนี้"
    const first = avatarToneIndex(157);
    expect(avatarToneIndex(157)).toBe(first);
    expect(avatarToneIndex("EMP-0042")).toBe(avatarToneIndex("EMP-0042"));
  });

  it("วนครบทั้ง 6 โทนเมื่อคีย์ไล่ต่อกัน", () => {
    const tones = new Set(
      Array.from({ length: 6 }, (_, i) => avatarToneIndex(i)),
    );
    expect(tones.size).toBe(6);
  });

  it("สตริงที่สลับตัวอักษรต้องไม่ได้โทนเดียวกัน", () => {
    // ผลรวม charCode ให้ค่าเท่ากันทุก anagram — djb2 ไม่ใช่
    expect(avatarToneIndex("AB")).not.toBe(avatarToneIndex("BA"));
  });

  it("เลขที่ไม่ใช่จำนวนจำกัดตกลงโทนแรก ไม่ใช่ index หลุด", () => {
    expect(avatarToneIndex(Number.NaN)).toBe(0);
    expect(avatarToneIndex(Number.POSITIVE_INFINITY)).toBe(0);
    expect(avatarToneIndex(-7)).toBe(avatarToneIndex(7));
  });

  it("ไม่ส่ง colorKey = เทาเหมือนเดิม (จอที่มีอยู่ต้องไม่ขยับ)", () => {
    render(<Avatar name="Jane Cooper" fallback="JC" />);
    expect(root("JC").className).toContain("bg-gray-100");
    expect(root("JC").className).not.toMatch(/bg-avatar-\d-bg/);
  });

  it("ส่ง colorKey แล้วสีตั้งต้นต้องถูกทับ ไม่ใช่ซ้อนกันสองสี", () => {
    render(<Avatar name="Jane Cooper" fallback="JC" colorKey={1} />);
    const cls = root("JC").className;
    expect(cls).toMatch(/bg-avatar-\d-bg/);
    expect(cls).not.toContain("bg-gray-100");
    expect(cls).not.toContain("text-text-tertiary");
  });

  it("className ของผู้เรียกยังชนะโทนอยู่", () => {
    render(
      <Avatar
        name="Jane Cooper"
        fallback="JC"
        colorKey={1}
        className="bg-brand"
      />,
    );
    expect(root("JC").className).toContain("bg-brand");
    expect(root("JC").className).not.toMatch(/bg-avatar-\d-bg/);
  });

  /**
   * 🔴 กับดักจริง: `text-avatar-1-fg` กับ `text-caption` ขึ้นต้นเหมือนกัน
   * ถ้า tailwind-merge จัดตัวแรกเป็น font-size ขนาดตัวอักษรของทุกไซซ์จะหายเงียบ ๆ
   */
  it("โทนสีต้องไม่กินขนาดตัวอักษรของ size", () => {
    render(<Avatar size="sm" name="Jane Cooper" fallback="JC" colorKey={2} />);
    expect(root("JC").className).toContain("text-caption");
  });
});

describe("Avatar — อักษรย่อจาก name เมื่อไม่ส่ง fallback", () => {
  /* 🔴 ชื่อ/นามสกุลที่ขึ้นต้นด้วยสระนำ (เ แ โ ใ ไ) — ตัวอักษรแรกดิบ ๆ เป็นสระลอย
     ไม่มีพยัญชนะให้เกาะ เรนเดอร์เป็นเครื่องหมายที่อ่านไม่ออก ต้องข้ามไปหาพยัญชนะตัวแรก */
  it("นามสกุลขึ้นต้นด้วยสระนำ ⇒ ข้ามสระไปเอาพยัญชนะตัวแรก", () => {
    render(<Avatar name="ธนชาญ โอค้ากอง" />);
    expect(screen.getByText("ธอ")).toBeInTheDocument();
  });

  it("ทั้งชื่อและนามสกุลขึ้นต้นด้วยสระนำ", () => {
    render(<Avatar name="ใจดี ไอศวรรย์" />);
    expect(screen.getByText("จอ")).toBeInTheDocument();
  });

  it("ชื่อเดียวไม่มีนามสกุล ⇒ ยังตัด 2 ตัวอักษรแรกตามเดิม (สระ+พยัญชนะอ่านเป็นคำเดียวกันได้)", () => {
    render(<Avatar name="โชคดี" />);
    expect(screen.getByText("โช")).toBeInTheDocument();
  });

  it("ตัดคำนำหน้าแล้วนามสกุลยังขึ้นต้นด้วยสระนำ", () => {
    render(<Avatar name="ดร. สมชาย ใจดี" />);
    expect(screen.getByText("สจ")).toBeInTheDocument();
  });

  it("ชื่ออังกฤษไม่มีพยัญชนะไทยให้หา ⇒ ตกกลับไปใช้ตัวอักษรแรกดิบตามเดิม", () => {
    render(<Avatar name="John Smith" />);
    expect(screen.getByText("JS")).toBeInTheDocument();
  });

  it("ส่ง fallback มาเอง ⇒ ไม่คำนวณจาก name เลย", () => {
    render(<Avatar name="โอค้ากอง สมชาย" fallback="OS" />);
    expect(screen.getByText("OS")).toBeInTheDocument();
  });
});

/* 🔴 คำนำหน้าติดกับชื่อคือ **รูปแบบหลักของข้อมูลจริง** ไม่ใช่เคสขอบ — วัดจาก production
   ของ MediAct (`users`, 14,446 แถว, 2026-09-11): ติดกันมีจุด 32 · "นางสาว" ติดกัน 11 ·
   เป็นคำแยก 4 ⇒ ทางที่โค้ดเดิมรองรับครอบได้แค่ 4 จาก 47 แถว */
describe("Avatar — คำนำหน้าที่ติดกับชื่อ (ไม่มีเว้นวรรค)", () => {
  it("คำนำหน้ามีจุดติดกับชื่อ ⇒ ตัดทิ้ง แล้วย่อจากชื่อจริง", () => {
    render(<Avatar name="นพ.วรวิทย์ ตันสกุล" />);
    expect(screen.getByText("วต")).toBeInTheDocument();
  });

  it("คำนำหน้าแบบเดียวกันที่เป็นคำแยก ⇒ ได้ผลเท่ากัน", () => {
    render(<Avatar name="นพ. วรวิทย์ ตันสกุล" />);
    expect(screen.getByText("วต")).toBeInTheDocument();
  });

  it("เลือกคำนำหน้าตัวที่ยาวกว่าก่อน ⇒ 'ทพญ' ไม่ถูก 'ทพ' ชนตัดจนเหลือเศษ", () => {
    render(<Avatar name="ทพญ.กมลชนก ศรีวิไล" />);
    expect(screen.getByText("กศ")).toBeInTheDocument();
  });

  it("'นางสาว' ติดกันโดยไม่มีจุด ⇒ ตัดได้ (ยาวพอจนไม่ชนชื่อจริง)", () => {
    render(<Avatar name="นางสาวมาลี ใจงาม" />);
    expect(screen.getByText("มจ")).toBeInTheDocument();
  });

  /* ⛔ เส้นแบ่งที่จงใจไม่ข้าม — ตัดพลาดทำให้ตัวย่อ *ผิดคน* ซึ่งแย่กว่าตัวย่อไม่สวย
   *
   * 🔴 ชื่อในเทสนี้ต้องเลือกให้ "ตัด" กับ "ไม่ตัด" ได้ผลต่างกันจริง — "นางนวล" ใช้ไม่ได้
   * เพราะตัด "นาง" แล้วเหลือ "นวล" ซึ่งพยัญชนะตัวแรกยังเป็น "น" เหมือนเดิม ⇒ เทสผ่าน
   * ทั้งสองทางและพิสูจน์อะไรไม่ได้ · "นางาม" ตัดแล้วเหลือ "าม" ⇒ ได้ "ม" ซึ่งต่างชัด
   * (ตรวจด้วยการแก้โค้ดให้ตัด "นาง" จริง แล้วดูว่าเทสนี้แดง) */
  it("'นาง' ติดกันโดยไม่มีจุด ⇒ **ไม่ตัด** เพราะแยกจากชื่อจริงอย่าง 'นางาม' ไม่ได้", () => {
    render(<Avatar name="นางาม ใจดี" />);
    expect(screen.getByText("นจ")).toBeInTheDocument();
  });

  it("คำนำหน้าอังกฤษติดกันด้วยจุด", () => {
    render(<Avatar name="Dr.John Smith" />);
    expect(screen.getByText("JS")).toBeInTheDocument();
  });

  it("คำนำหน้าซ้อนกันสองชั้น", () => {
    render(<Avatar name="ผศ. นพ.สมชาย ใจดี" />);
    expect(screen.getByText("สจ")).toBeInTheDocument();
  });

  it("มีแต่คำนำหน้าไม่มีชื่อ ⇒ ไม่ตัดจนว่าง", () => {
    render(<Avatar name="นพ." />);
    expect(screen.getByText("นพ")).toBeInTheDocument();
  });

  it("คำนำหน้าติดกัน แล้วชื่อขึ้นต้นด้วยสระนำ ⇒ ตัดคำนำหน้าแล้วยังข้ามสระ", () => {
    render(<Avatar name="พญ.โอภาส แสงทอง" />);
    expect(screen.getByText("อส")).toBeInTheDocument();
  });
});
