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

describe("แบบ compact (บนแถบ TopNav)", () => {
  it("ปุ่มโชว์ธง + รหัสสั้น ไม่ใช่ชื่อภาษาเต็ม", () => {
    const { trigger } = setup({ variant: "compact" });
    expect(trigger).toHaveTextContent("TH");
    expect(trigger).not.toHaveTextContent("ไทย");
    /* ธงในตัวของ DS ตามรหัส `th` — ไม่ใช่ลูกโลก */
    expect(trigger.querySelectorAll("svg")).toHaveLength(2); // ธง + ลูกศร
  });

  it("กว้างตามเนื้อ — ไม่ใช้ความกว้างคงที่ของแบบเดิม", () => {
    const { trigger } = setup({ variant: "compact" });
    expect(trigger.className).not.toContain("w-30");
  });

  it("ส่ง `code` มาเองได้ และภาษาที่ DS ไม่รู้จักกลับไปใช้ลูกโลก", () => {
    const { trigger } = setup({
      variant: "compact",
      languages: [{ value: "lo", label: "ລາວ", code: "LA" }],
      value: "lo",
    });
    expect(trigger).toHaveTextContent("LA");
    expect(trigger.querySelector(".lucide-globe")).not.toBeNull();
  });

  it("เมนูยังเลือกภาษาได้เหมือนเดิม และโชว์ชื่อเต็มในรายการ", async () => {
    const { trigger, onChange } = setup({ variant: "compact" });
    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole("menuitemradio", { name: "English" }));
    expect(onChange).toHaveBeenCalledWith("en-EN");
  });

  /* ดีไซน์ topbar: บรรทัดที่เลือก = พื้นสีอ่อนของแบรนด์ + แถบแบรนด์ซ้าย + ตัวหนา ไม่ใช่จุดหน้าบรรทัด
   * (happy-dom ไม่คำนวณสี — สีจริงวัดใน Storybook ทั้ง 4 ธีม ดู LanguageSwitcher.md) */
  it("ไม่มีจุดหน้าบรรทัด — บรรทัดที่เลือกได้พื้นแบรนด์ แถบซ้าย และตัวหนา", async () => {
    const { trigger } = setup({ variant: "compact" });
    await userEvent.click(trigger);
    const thai = await screen.findByRole("menuitemradio", { name: "ไทย" });
    const english = screen.getByRole("menuitemradio", { name: "English" });
    expect(thai).toHaveAttribute("aria-checked", "true");
    expect(thai.querySelector(".lucide-circle")).toBeNull();
    expect(thai.className).toContain("data-[state=checked]:font-semibold");
    expect(thai.className).toContain("data-[state=checked]:bg-brand-subtle");
    expect(thai.className).toContain("data-[state=checked]:before:bg-brand");
    /* hover ต้องไม่ใช้สีเดียวกับบรรทัดที่เลือก — ไม่งั้นชี้อีกบรรทัดแล้วดูเหมือนเลือกสองบรรทัด */
    expect(english.className).toContain("data-[highlighted]:bg-overlay-hover");
    expect(english.className.split(/\s+/)).not.toContain("data-[highlighted]:bg-brand-subtle");
    expect(thai).toHaveAttribute("data-state", "checked");
    expect(english).toHaveAttribute("data-state", "unchecked");
  });

  it("แบบ default ยังมีจุดหน้าบรรทัดเหมือนเดิม", async () => {
    const { trigger } = setup();
    await userEvent.click(trigger);
    const thai = await screen.findByRole("menuitemradio", { name: "ไทย" });
    expect(thai.querySelector(".lucide-circle")).not.toBeNull();
  });
});
