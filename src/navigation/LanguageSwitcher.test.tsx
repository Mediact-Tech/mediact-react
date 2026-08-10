/**
 * ยามของปุ่มเปลี่ยนภาษา
 *
 * ⚠️ happy-dom ไม่คำนวณเลย์เอาต์ ⇒ ระยะ/ความสูงพิสูจน์ได้แค่ในเบราว์เซอร์
 * ที่นี่ล็อก **ความหมายกับพฤติกรรม** — สิ่งที่พังเงียบแล้วไม่มีใครเห็น
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LanguageSwitcher } from "./LanguageSwitcher";

const LANGUAGES = [
  { value: "en-EN", label: "English" },
  { value: "th-TH", label: "ไทย" },
];

const setup = (props: Partial<React.ComponentProps<typeof LanguageSwitcher>> = {}) => {
  const onChange = vi.fn();
  render(
    <LanguageSwitcher
      languages={LANGUAGES}
      value="th-TH"
      onChange={onChange}
      label="เปลี่ยนภาษา"
      {...props}
    />,
  );
  /* ถามด้วย role เปล่า ๆ — มีปุ่มเดียวในจอ และบางเทสเปลี่ยนชื่อปุ่มเอง */
  return { onChange, trigger: screen.getByRole("button") };
};

describe("ปุ่มที่เห็นก่อนกด", () => {
  it("โชว์ชื่อภาษาที่ใช้อยู่ ไม่ใช่รหัสภาษา", () => {
    const { trigger } = setup();
    expect(trigger).toHaveTextContent("ไทย");
    expect(trigger).not.toHaveTextContent("th-TH");
  });

  /* ปุ่มกว้างคงที่ 120 — ถ้าหลุดเป็น `min-w` ปุ่มจะพองยุบตอนสลับภาษาแล้วขยับหนีนิ้ว
   * (happy-dom ไม่คำนวณเลย์เอาต์ วัดพิกเซลจริงไม่ได้ จึงล็อกที่คลาส) */
  it("กว้างคงที่ ไม่ยืดตามความยาวชื่อภาษา", () => {
    const { trigger } = setup();
    expect(trigger.className).toContain("w-30");
    expect(trigger.className).not.toContain("min-w-30");
  });

  /* ปุ่มนี้มีแต่ไอคอนกับชื่อภาษา ถ้าไม่มี aria-label โปรแกรมอ่านหน้าจอจะได้ยินแค่
   * "ไทย" ซึ่งไม่บอกว่ากดแล้วเกิดอะไร */
  it("มีชื่อสำหรับโปรแกรมอ่านหน้าจอที่แอปส่งมา", () => {
    setup({ label: "Change language" });
    expect(screen.getByRole("button", { name: "Change language" })).toBeInTheDocument();
  });

  /* 🔴 เดาเป็นตัวแรกในรายการ = บอกผู้ใช้ว่าอยู่ภาษาที่ไม่ได้อยู่จริง */
  it("ภาษาที่ไม่มีในรายการ — ไม่เดาเป็นตัวแรก", () => {
    const { trigger } = setup({ value: "ja-JP" });
    expect(trigger).not.toHaveTextContent("English");
    expect(trigger).not.toHaveTextContent("ไทย");
  });
});

describe("เมนูที่หล่นลงมา", () => {
  it("เลือกภาษาแล้วส่งรหัสภาษากลับ", async () => {
    const user = userEvent.setup();
    const { onChange, trigger } = setup();

    await user.click(trigger);
    await user.click(await screen.findByRole("menuitemradio", { name: "English" }));

    expect(onChange).toHaveBeenCalledWith("en-EN");
  });

  /* radio ไม่ใช่ปุ่มธรรมดา — `aria-checked` คือสิ่งเดียวที่บอกคนใช้โปรแกรมอ่านหน้าจอ
   * ว่าตอนนี้อยู่ภาษาไหน (ปุ่มด้านนอกบอกไม่ได้เพราะเมนูเปิดทับอยู่) */
  it("ติ๊กภาษาที่ใช้อยู่ไว้ในเมนู", async () => {
    const user = userEvent.setup();
    const { trigger } = setup();

    await user.click(trigger);

    expect(await screen.findByRole("menuitemradio", { name: "ไทย" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("menuitemradio", { name: "English" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  /* กดภาษาเดิมซ้ำ Radix ไม่ยิง onValueChange ให้ — ล็อกไว้ว่าไม่มีการเปลี่ยนภาษา
   * ที่ไม่ได้เปลี่ยนอะไร (แอปเรียก `i18n.changeLanguage` ซึ่งโหลด bundle ใหม่) */
  it("กดภาษาเดิมซ้ำ ไม่เรียก onChange", async () => {
    const user = userEvent.setup();
    const { onChange, trigger } = setup();

    await user.click(trigger);
    await user.click(await screen.findByRole("menuitemradio", { name: "ไทย" }));

    expect(onChange).not.toHaveBeenCalled();
  });
});
