/**
 * ยามของเครื่องหมายประจำผลิตภัณฑ์ — ล็อกสิ่งที่พังเงียบ ไม่ใช่ทุกอย่างที่ render ออกมา
 *
 * ⚠️ happy-dom ไม่โหลดรูปและไม่คำนวณเลย์เอาต์ ⇒ "โลโก้ดูใหญ่เท่ากันไหม" พิสูจน์ที่นี่ไม่ได้
 * สิ่งที่พิสูจน์ได้คือ **ค่าที่ตัดสินความใหญ่นั้นถูกฝังมาถูกต้องหรือยัง** (viewBox ที่ pad แล้ว)
 * ส่วนการวัดหมึกจริงทำด้วยการ rasterise ตอนสร้างไฟล์ — ตัวเลขอยู่ใน `app-marks.ts`
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppMark, GRID_INK_HEIGHT } from "./AppMark";
import {
  appBrandInk,
  appMarkLabels,
  appMarks,
  appWordmarks,
  type MediactAppKey,
} from "./app-marks";

const KEYS = Object.keys(appMarks) as MediactAppKey[];

/** ดึง `viewBox` ออกจาก data URL — ค่าที่กำหนดว่าหมึกจะใหญ่เท่าไรในกล่องเดียวกัน */
const viewBoxOf = (dataUrl: string) => {
  const svg = decodeURIComponent(dataUrl.replace("data:image/svg+xml;utf8,", ""));
  const raw = svg.match(/viewBox='([^']*)'/)?.[1];
  if (!raw) throw new Error("ไม่มี viewBox");
  const nums = raw.split(/\s+/).map(Number);
  if (nums.length !== 4 || nums.some(Number.isNaN))
    throw new Error(`viewBox อ่านไม่ออก: ${raw}`);
  return nums as [number, number, number, number];
};

describe("ชุดเครื่องหมาย", () => {
  it("ทุกแอปมีครบทั้งสองโทน", () => {
    for (const key of KEYS) {
      expect(appMarks[key].primary, `${key} ขาดโทน primary`).toMatch(/^data:image\//);
      expect(appMarks[key].white, `${key} ขาดโทน white`).toMatch(/^data:image\//);
    }
  });

  /* 🔴 เคยมี PNG ปนอยู่หนึ่งตัว (`medipay` ชุดเก่า) — เป็นทั้งไฟล์ที่ใหญ่ที่สุดในชุด (9.7 KB
   * จาก 37 KB ทั้งหมด) และเป็นตัวเดียวที่ **เติมขอบใน viewBox ไม่ได้** ⇒ ต้องมีทางชดเชย
   * ที่ฝั่ง component แยกไว้ต่างหาก และเบลอเมื่อขยาย · ถ้ามี PNG กลับเข้ามาอีก ทั้งสองปัญหา
   * กลับมาพร้อมกันโดยไม่มีอะไรเตือน */
  it("เป็น SVG ทุกตัว — ไม่มี raster ปนกลับเข้ามา", () => {
    for (const key of KEYS) {
      for (const tone of ["primary", "white"] as const) {
        expect(appMarks[key][tone], `${key}/${tone} ไม่ใช่ SVG`).toMatch(
          /^data:image\/svg\+xml/,
        );
      }
    }
  });

  /* 🔴 **กรอบต้องชิดหมึก ไม่ใช่จัตุรัสที่เว้นขอบ** — ถ้ามีขอบเปล่ากลับเข้าไปในไฟล์
   * `className="h-10"` จะไม่ได้แปลว่า "หมึกสูง 40" อีก และทุกที่ที่วางมาร์กเดี่ยว ๆ
   * จะหดลงเงียบ ๆ ตามสัดส่วนขอบที่ติดมา (เคยเกิดจริง: หัวรางของ hr-web หด 37.5%)
   *
   * เช็คด้วยอัตราส่วนกรอบ = อัตราส่วนหมึกที่วัดไว้ตอนสร้างไฟล์ · ค่าพวกนี้อยู่ในตาราง
   * ที่หัว `app-marks.ts` ⇒ ถ้า generator เปลี่ยนวิธีครอบ เทสนี้จะจับได้ทันที */
  const INK_ASPECT: Record<MediactAppKey, number> = {
    mediwork: 115.106 / 89.801,
    medimatch: 125.135 / 96.744,
    medihr: 94.122 / 115.106,
    medioncloud: 89.184 / 126.832,
    medirefer: 100.756 / 92.579,
    medipay: 86.098 / 98.441,
  };

  it("กรอบชิดหมึก — สัดส่วนตรงกับที่วัดไว้", () => {
    for (const key of KEYS) {
      for (const tone of ["primary", "white"] as const) {
        const [, , w, h] = viewBoxOf(appMarks[key][tone]);
        expect(w / h, `${key}/${tone} กรอบไม่ชิดหมึก`).toBeCloseTo(
          INK_ASPECT[key],
          2,
        );
      }
    }
  });

  /* 🔴 สองโทนของแอปเดียวกันคือ **อาร์ตเวิร์กชิ้นเดียวกันคนละสี** ⇒ ต้องได้กรอบเท่ากันเป๊ะ
   * ถ้าหลุด จะเห็นเป็นโลโก้ที่ขนาดกระโดดตอนสลับพื้นหลัง ซึ่งหาสาเหตุยากมากเพราะโค้ด
   * ที่เรียกใช้ทั้งสองฝั่งเขียนเหมือนกันทุกตัวอักษร */
  it("โทน primary กับ white ของแอปเดียวกันใช้กรอบเดียวกัน", () => {
    for (const key of KEYS) {
      expect(viewBoxOf(appMarks[key].primary), `${key} กรอบสองโทนไม่ตรงกัน`).toEqual(
        viewBoxOf(appMarks[key].white),
      );
    }
  });

  it("ทุกแอปมีชื่อสำหรับแสดงผล", () => {
    for (const key of KEYS) expect(appMarkLabels[key]).toBeTruthy();
  });

  /* 🔴 wordmark **ไม่ใช่ label ที่ทำตัวใหญ่** — `medioncloud` เขียนติดกันตามโลโก้จริง
   * ถ้าเผลอ derive จาก label จะได้ "MEDI ON CLOUD" ซึ่งยาวจนตกบรรทัดในคอลัมน์แคบ
   * (เห็นบนจอจริงมาแล้ว: ชื่อตกบรรทัดแล้วดันคำโปรยลงไปทับปุ่มติดต่อ) */
  it("wordmark ของ medioncloud เขียนติดกัน ไม่ใช่ label ทำตัวใหญ่", () => {
    expect(appWordmarks.medioncloud).toBe("MEDI ONCLOUD");
    expect(appWordmarks.medioncloud).not.toBe(
      appMarkLabels.medioncloud.toUpperCase(),
    );
  });

  /* 🔴 สีชื่อต้องเป็นสีของแบรนด์นั้น **ที่อยู่ในไฟล์มาร์กจริง** ไม่ใช่ค่าที่พิมพ์แยกไว้
   * ⇒ เปลี่ยนอาร์ตเวิร์กเมื่อไหร่ เทสนี้จับได้ว่าสองที่ไหลออกจากกัน */
  it("สี wordmark ตรงกับสีที่อยู่ในไฟล์มาร์กของแอปนั้น", () => {
    for (const key of KEYS) {
      const svg = decodeURIComponent(
        appMarks[key].primary.replace("data:image/svg+xml;utf8,", ""),
      ).toLowerCase();
      expect(svg, `${key} ไม่มีสี ${appBrandInk[key]} อยู่ในมาร์ก`).toContain(
        appBrandInk[key],
      );
    }
  });
});

describe("<AppMark>", () => {
  it("ไม่ส่ง tone = ใช้ primary", () => {
    render(<AppMark app="medihr" />);
    expect(screen.getByRole("img")).toHaveAttribute("src", appMarks.medihr.primary);
  });

  it("tone=white ได้ไฟล์คนละตัวกับ primary", () => {
    render(<AppMark app="medihr" tone="white" />);
    expect(screen.getByRole("img")).toHaveAttribute("src", appMarks.medihr.white);
  });

  it("alt ปริยายเป็นชื่อผลิตภัณฑ์", () => {
    render(<AppMark app="mediwork" />);
    expect(screen.getByRole("img")).toHaveAttribute("alt", "Medi Work");
  });

  /* วัดบนจอจริงตอนยังไม่มี `min-h-0`: ไอคอนได้กล่อง 32×45.55 ในช่อง 32×32 เพราะ
   * `min-height: auto` ของ flex item · เป็นค่าเริ่มต้นที่ผู้เรียกใช้ไม่ควรต้องรู้เอง */
  it("ติด min-h-0 มาให้เสมอ แม้จะส่ง className มาทับ", () => {
    render(<AppMark app="medipay" className="size-8" />);
    const img = screen.getByRole("img");
    expect(img.className).toContain("min-h-0");
    expect(img.className).toContain("size-8");
  });

  /* 🔴 **ค่าเริ่มต้นต้องไม่ย่ออะไรเลย** — นี่คือข้อที่พังรอบแรก: มาร์กถูกย่อ 62.5%
   * ทุกที่โดยไม่มีใครสั่ง ทำให้หัวรางของ hr-web หดทันทีที่เปลี่ยนมาใช้ component นี้ */
  it("ไม่ส่ง fit = หมึกเต็มกล่อง ไม่มีการย่อ", () => {
    render(<AppMark app="medihr" className="h-10" />);
    const img = screen.getByRole("img") as HTMLImageElement;
    expect(img.style.height).toBe("");
    expect(img.className).not.toContain("m-auto");
  });

  /* วางเรียงกันเมื่อไหร่ถึงย่อ — 62.5% เท่ากันทุกใบคือสิ่งที่ทำให้ทั้งแถวดูขนาดเท่ากัน */
  it('fit="grid" ย่อความสูงเหลือ 62.5% และปล่อยความกว้างตามสัดส่วน', () => {
    render(<AppMark app="medihr" fit="grid" className="size-full" />);
    const img = screen.getByRole("img") as HTMLImageElement;
    expect(img.style.height).toBe(`${GRID_INK_HEIGHT * 100}%`);
    expect(img.style.width).toBe("auto");
  });
});
