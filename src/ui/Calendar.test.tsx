/**
 * ยามของปฏิทินฐาน
 *
 * ⚠️ happy-dom ไม่คำนวณเลย์เอาต์ ⇒ ขนาด/ระยะพิสูจน์ได้แค่ใน Storybook
 * ที่นี่ล็อก **โครงตาราง · ขอบเขตวันที่ · การนับปี · คีย์บอร์ด** ซึ่งพังเงียบได้หมด
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Calendar, dayKey } from "./Calendar";

const may2026 = new Date(2026, 4, 1);
const cellFor = (key: string) =>
  screen
    .getAllByRole("gridcell")
    .find((c) => c.getAttribute("data-day") === key)!;
const buttonIn = (key: string) => cellFor(key).querySelector("button")!;

const setup = (props: Partial<React.ComponentProps<typeof Calendar>> = {}) =>
  render(
    <Calendar
      month={props.month ?? may2026}
      onMonthChange={props.onMonthChange ?? (() => {})}
      {...props}
    />,
  );

describe("คีย์วันที่", () => {
  /* 🔴 `toISOString()` แปลงเป็น UTC ก่อน ⇒ โซนไทย (UTC+7) ได้วันย้อนไป 1 วัน
   * ทุกครั้งที่เวลาต่ำกว่า 07:00 — บั๊กที่ไม่มีใครเห็นจนกว่าจะทดสอบตอนเช้า */
  it("อ่านตามเวลาท้องถิ่น ไม่ใช่ UTC", () => {
    expect(dayKey(new Date(2026, 4, 9, 1, 30))).toBe("2026-05-09");
    expect(dayKey(new Date(2026, 0, 1, 0, 0))).toBe("2026-01-01");
  });
});

describe("โครงตาราง", () => {
  it("42 ช่องเสมอ — 6 แถวคงที่ ไม่ว่าเดือนจะยาวแค่ไหน", () => {
    const { unmount } = setup({ month: new Date(2026, 1, 1) }); // ก.พ. 28 วัน
    expect(screen.getAllByRole("gridcell")).toHaveLength(42);
    unmount();
    setup({ month: new Date(2026, 7, 1) }); // ส.ค. 31 วัน เริ่มวันเสาร์
    expect(screen.getAllByRole("gridcell")).toHaveLength(42);
  });

  it("วันของเดือนข้างเคียงถูกวาด แต่กดไม่ได้", () => {
    setup();
    /* 1 พ.ค. 2026 = วันศุกร์ ⇒ ช่องแรกของตารางคือ 26 เม.ย. */
    expect(cellFor("2026-04-26")).toBeInTheDocument();
    expect(buttonIn("2026-04-26")).toBeDisabled();
    expect(buttonIn("2026-05-01")).toBeEnabled();
  });

  it("หัวคอลัมน์ 7 วัน เริ่มอาทิตย์ตามค่าเริ่มต้น", () => {
    const { container } = setup();
    const ths = container.querySelectorAll("thead th");
    expect(ths).toHaveLength(7);
    expect(ths[0]!.getAttribute("abbr")).toMatch(/อาทิตย์/);
  });

  it("เริ่มจันทร์ได้ด้วย weekStartsOn", () => {
    const { container } = setup({ weekStartsOn: 1 });
    expect(container.querySelector("thead th")!.getAttribute("abbr")).toMatch(
      /จันทร์/,
    );
  });
});

/* 🔴 ก่อนมีมุมมองปี การย้อนกลับไป 10 ปีคือกดลูกศร 10 ครั้ง — เหตุผลเดียวกับที่
 * มุมมอง 12 เดือนมีอยู่ (ไม่งั้นย้อน 1 ปี = กด 12 ครั้ง) แค่ขยับขึ้นอีกชั้น */
describe("มุมมองปี", () => {
  const header = () => screen.getByRole("button", { expanded: false });

  it("กดหัวปฏิทินขึ้นทีละชั้น แล้วถอยกลับทีละชั้น (ไม่วนรวดไปมุมมองวัน)", async () => {
    const user = userEvent.setup();
    setup();
    expect(screen.getByRole("grid")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Choose month" }));
    expect(screen.queryByRole("grid")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Choose year" }));
    // ปี: 12 ช่อง เท่าตารางเดือน (ความสูงกล่องจะได้ไม่กระโดด) — 1 ช่องคือปีปัจจุบัน
    expect(screen.getAllByRole("button", { pressed: false })).toHaveLength(11);
    expect(screen.getAllByRole("button", { pressed: true })).toHaveLength(1);
    /* 🔴 ถอยจากปีต้องไปที่ "เดือน" ไม่ใช่ "วัน" — ไม่งั้นป้าย a11y ของปุ่มหัวโกหก
     * (มันเขียนว่า Choose month แต่พาไปตารางวัน) */
    await user.click(screen.getByRole("button", { name: "Choose month" }));
    expect(screen.queryByRole("grid")).toBeNull();
    expect(screen.getByRole("button", { name: "Choose year" })).toBeInTheDocument();
  });

  it("ช่องปีแสดงปีตาม locale ไม่ใช่ ค.ศ. เสมอ", async () => {
    const user = userEvent.setup();
    setup(); // th-TH ตามค่าเริ่มต้น
    await user.click(screen.getByRole("button", { name: "Choose month" }));
    await user.click(screen.getByRole("button", { name: "Choose year" }));
    // พ.ค. 2026 → พ.ศ. 2569 · บล็อกปีคือ 2016–2027 ⇒ พ.ศ. 2559–2570
    expect(screen.getByText("2569")).toBeInTheDocument();
    expect(screen.queryByText("2026")).toBeNull();
  });

  it("เลือกปีแล้วลงไปมุมมองเดือน ไม่ใช่จบเลย", async () => {
    const user = userEvent.setup();
    const onMonthChange = vi.fn();
    setup({ onMonthChange });
    await user.click(screen.getByRole("button", { name: "Choose month" }));
    await user.click(screen.getByRole("button", { name: "Choose year" }));
    await user.click(screen.getByText("2569"));
    expect(onMonthChange).toHaveBeenCalled();
    // ลงมาที่มุมมองเดือน ⇒ ยังไม่ใช่ตารางวัน (ปียังไม่ใช่คำตอบสุดท้าย)
    expect(screen.queryByRole("grid")).toBeNull();
    expect(screen.getByRole("button", { name: "Choose year" })).toBeInTheDocument();
  });

  it("ลูกศรในมุมมองปีเลื่อนทีละ 12 ปี ไม่ใช่ทีละปี", async () => {
    const user = userEvent.setup();
    const onMonthChange = vi.fn();
    setup({ onMonthChange });
    await user.click(screen.getByRole("button", { name: "Choose month" }));
    await user.click(screen.getByRole("button", { name: "Choose year" }));
    await user.click(screen.getByRole("button", { name: "Next years" }));
    const next = onMonthChange.mock.calls[0]![0] as Date;
    expect(next.getFullYear()).toBe(may2026.getFullYear() + 12);
  });
});

/* 🔴 "วันนี้" เป็น *ป้ายบอกตำแหน่ง* ไม่ใช่ค่าที่ถูกเลือก — ปฏิทินต้องไม่กรอกค่าที่
 * ผู้ใช้ไม่ได้เลือกให้เอง (ดูเหตุผลเต็มใน `Calendar.md`) */
describe("ป้ายวันนี้", () => {
  const may15 = new Date(2026, 4, 15);

  it("ติดวงแหวน + aria-current ให้วันนี้ แต่ไม่เลือกให้", () => {
    setup({ today: may15 });
    const btn = buttonIn("2026-05-15");
    expect(btn).toHaveAttribute("aria-current", "date");
    /* ⚠️ ต้องยึด `ring-inset` ไม่ใช่ `ring-brand` — ปุ่มมี `focus-visible:ring-brand/40`
     * ติดมาด้วยเสมอ การเช็คสตริง `ring-brand` จึงผ่านตลอดไม่ว่าโค้ดจะถูกหรือผิด
     * (assertion รุ่นแรกเขียนแบบนั้นแล้วเทสตกตอนเคสถัดไป ซึ่งเป็นเรื่องดี) */
    expect(btn.className).toContain("ring-inset");
    // ไม่ใช่การเลือก ⇒ ช่องต้องไม่ถูกทำเครื่องหมายว่าเลือกอยู่
    expect(cellFor("2026-05-15")).not.toHaveAttribute("aria-selected");
    expect(btn.className).not.toContain("bg-brand");
  });

  it("วันที่ถูกเลือกจริงชนะป้ายวันนี้ ไม่ซ้อนสองสถานะ", () => {
    setup({ today: may15, selected: may15 });
    const btn = buttonIn("2026-05-15");
    expect(btn.className).toContain("bg-brand");
    expect(btn.className).not.toContain("ring-inset");
  });

  it("ปิดได้ด้วย today={null} — จำเป็นกับภาพเทียบที่ต้องนิ่ง", () => {
    setup({ today: null });
    expect(
      screen.getAllByRole("gridcell").filter((c) => c.querySelector("[aria-current]")),
    ).toHaveLength(0);
  });

  it("ไม่ติดป้ายให้วันของเดือนข้างเคียง", () => {
    // 1 พ.ค. 2026 = ศุกร์ ⇒ ช่องแรกคือ 26 เม.ย. ซึ่งกดไม่ได้
    setup({ today: new Date(2026, 3, 26) });
    expect(buttonIn("2026-04-26")).not.toHaveAttribute("aria-current");
  });
});

describe("ขอบเขตวันที่", () => {
  it("minDate / maxDate ปิดวันนอกช่วง", () => {
    setup({ minDate: new Date(2026, 4, 10), maxDate: new Date(2026, 4, 20) });
    expect(buttonIn("2026-05-09")).toBeDisabled();
    expect(buttonIn("2026-05-10")).toBeEnabled();
    expect(buttonIn("2026-05-20")).toBeEnabled();
    expect(buttonIn("2026-05-21")).toBeDisabled();
  });

  it("disabledDate ปิดวันเป็นราย ๆ ได้ (เช่นวันหยุด)", () => {
    setup({ disabledDate: (d) => d.getDate() === 15 });
    expect(buttonIn("2026-05-15")).toBeDisabled();
    expect(buttonIn("2026-05-16")).toBeEnabled();
  });
});

describe("เลือกวัน", () => {
  it("ส่ง Date ของวันที่กด", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    setup({ onSelect });
    await user.click(buttonIn("2026-05-15"));
    const arg = onSelect.mock.calls[0]?.[0] as Date;
    expect(arg.getFullYear()).toBe(2026);
    expect(arg.getMonth()).toBe(4);
    expect(arg.getDate()).toBe(15);
  });

  it("วันที่เลือกอยู่ประกาศ aria-selected", () => {
    setup({ selected: new Date(2026, 4, 15) });
    expect(cellFor("2026-05-15")).toHaveAttribute("aria-selected", "true");
    expect(cellFor("2026-05-16")).not.toHaveAttribute("aria-selected");
  });

  it("ช่วงวัน — ปลายทั้งสองข้างและวันระหว่างกลางได้แถบ", () => {
    const { container } = setup({
      selected: new Date(2026, 4, 10),
      rangeEnd: new Date(2026, 4, 13),
    });
    const band = (key: string) =>
      container.querySelector(`[data-day="${key}"]`)!.className;
    expect(band("2026-05-10")).toContain("bg-brand-subtle");
    expect(band("2026-05-11")).toContain("bg-brand-subtle");
    expect(band("2026-05-13")).toContain("bg-brand-subtle");
    expect(band("2026-05-14")).not.toContain("bg-brand-subtle");
    /* ปลายซ้าย/ขวาโค้งข้างเดียว เพื่อให้ทั้งช่วงอ่านเป็นแถบเดียว */
    expect(band("2026-05-10")).toContain("rounded-l-full");
    expect(band("2026-05-13")).toContain("rounded-r-full");
  });

  it("วันเดียวไม่วาดแถบ — ไม่งั้นวันเดี่ยวดูเหมือนช่วงยาว 1 วัน", () => {
    const { container } = setup({ selected: new Date(2026, 4, 10) });
    expect(
      container.querySelector('[data-day="2026-05-10"]')!.className,
    ).not.toContain("bg-brand-subtle");
  });
});

describe("มุมมองเดือน", () => {
  it("กดชื่อเดือนแล้วสลับเป็นตาราง 12 เดือน", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole("button", { name: "Choose month" }));
    expect(screen.queryByRole("grid")).toBeNull();
    expect(screen.getAllByRole("button", { pressed: false }).length).toBe(11);
  });

  it("ในมุมมองเดือน ลูกศรเลื่อนทีละปี ไม่ใช่ทีละเดือน", async () => {
    const user = userEvent.setup();
    const onMonthChange = vi.fn();
    setup({ onMonthChange, defaultView: "month" });
    await user.click(screen.getByRole("button", { name: "Next year" }));
    expect((onMonthChange.mock.calls[0]?.[0] as Date).getFullYear()).toBe(2027);
  });

  it("selectMonth = เลือกเดือนแล้วจบ ไม่ต้องลงไปเลือกวัน", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    setup({ defaultView: "month", selectMonth: true, onSelect });
    await user.click(screen.getAllByRole("button", { pressed: false })[0]!);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("ไม่ใส่ selectMonth = กดเดือนแล้วลงไปมุมมองวัน", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    setup({ defaultView: "month", onSelect });
    await user.click(screen.getAllByRole("button", { pressed: false })[0]!);
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });
});

describe("ปี พ.ศ.", () => {
  it("ค่าเริ่มต้น th-TH ให้ปีพุทธ", () => {
    setup();
    expect(
      screen.getByRole("button", { name: "Choose month" }).textContent,
    ).toContain("2569");
  });

  it("เปลี่ยน locale แล้วได้ปีคริสต์", () => {
    setup({ locale: "en-GB" });
    expect(
      screen.getByRole("button", { name: "Choose month" }).textContent,
    ).toContain("2026");
  });
});

describe("คีย์บอร์ด", () => {
  /* ปฏิทินทั้งเดือนต้องมีจุด tab เดียว ไม่ใช่ 42 จุด — ไม่งั้นกด Tab ผ่าน
   * ปฏิทินหนึ่งอันต้องกด 42 ครั้ง */
  it("มีวันที่ tab เข้าถึงได้แค่วันเดียว", () => {
    setup({ selected: new Date(2026, 4, 15) });
    const tabbable = screen
      .getAllByRole("gridcell")
      .map((c) => c.querySelector("button")!)
      .filter((b) => b.getAttribute("tabindex") === "0");
    expect(tabbable).toHaveLength(1);
    expect(tabbable[0]).toHaveTextContent("15");
  });

  it("ลูกศรขวาเลื่อนโฟกัสไปหนึ่งวัน", async () => {
    const user = userEvent.setup();
    setup({ selected: new Date(2026, 4, 15) });
    buttonIn("2026-05-15").focus();
    await user.keyboard("{ArrowRight}");
    expect(buttonIn("2026-05-16")).toHaveFocus();
  });

  it("ลูกศรลงเลื่อนหนึ่งสัปดาห์", async () => {
    const user = userEvent.setup();
    setup({ selected: new Date(2026, 4, 15) });
    buttonIn("2026-05-15").focus();
    await user.keyboard("{ArrowDown}");
    expect(buttonIn("2026-05-22")).toHaveFocus();
  });

  it("เดินข้ามขอบเดือนแล้วเปลี่ยนเดือนให้", async () => {
    const user = userEvent.setup();
    const onMonthChange = vi.fn();
    setup({ selected: new Date(2026, 4, 31), onMonthChange });
    buttonIn("2026-05-31").focus();
    await user.keyboard("{ArrowRight}");
    expect((onMonthChange.mock.calls[0]?.[0] as Date).getMonth()).toBe(5);
  });
});

describe("ป้ายชื่อ", () => {
  it("ทุกวันมีชื่อเต็มให้โปรแกรมอ่านหน้าจอ ไม่ใช่แค่เลข", () => {
    setup();
    /* Intl `dateStyle: "full"` ให้ชื่อวันมาด้วย — "วันศุกร์ที่ 15 พฤษภาคม พ.ศ. 2569" */
    expect(buttonIn("2026-05-15").getAttribute("aria-label")).toMatch(
      /วันศุกร์ที่ 15 พฤษภาคม พ\.ศ\. 2569/,
    );
  });

  it("ข้อความ a11y ของปุ่มเปลี่ยนได้จากแอป", () => {
    setup({ labels: { prevMonth: "เดือนก่อน", nextMonth: "เดือนถัดไป" } });
    expect(
      screen.getByRole("button", { name: "เดือนก่อน" }),
    ).toBeInTheDocument();
  });
});

describe("ปุ่มยังไม่ได้ตั้ง type จะ submit ฟอร์ม", () => {
  /* ปฏิทินถูกใช้ในฟอร์มเสมอ — ปุ่มที่ไม่ได้ตั้ง type="button" จะ submit ทั้งฟอร์ม
   * ตอนกดเลือกวัน ซึ่งเป็นบั๊กที่หาสาเหตุยากมาก */
  it("ทุกปุ่มในปฏิทินเป็น type=button", () => {
    const { container } = setup();
    const wrong = [...container.querySelectorAll("button")].filter(
      (b) => b.getAttribute("type") !== "button",
    );
    expect(wrong).toEqual([]);
  });
});

/**
 * 🔴 มุมมองเดือน/ปีเคยไม่อ่าน `minDate`/`maxDate` เลย — ค่าพวกนั้นถูกใช้เฉพาะมุมมองวัน
 * ⇒ เดือนที่อยู่นอกช่วงกดได้ตามปกติ แล้วผู้เรียกที่กรองต่อก็เงียบ = ปุ่มที่กดแล้วอยู่ที่เดิม
 * ซึ่งแย่กว่าปุ่มที่บอกว่ากดไม่ได้ (`mediact-hr-web` เคยต้องวาดตาราง 12 เดือนเองทั้งชุด
 * เพราะข้อนี้ · ดูหัวไฟล์ `period-summary/components/PeriodPicker.tsx`)
 */
describe("ขอบเขตในมุมมองเดือน/ปี", () => {
  const monthCell = (name: string) => screen.getByRole("button", { name });

  it("minDate / maxDate ปิดเดือนนอกช่วง", () => {
    setup({
      defaultView: "month",
      minDate: new Date(2026, 3, 20), // 20 เม.ย. — เดือน เม.ย. ยังเปิด
      maxDate: new Date(2026, 6, 5), // 5 ก.ค. — เดือน ก.ค. ยังเปิด
    });
    expect(monthCell("มี.ค.")).toBeDisabled();
    expect(monthCell("เม.ย.")).toBeEnabled();
    expect(monthCell("ก.ค.")).toBeEnabled();
    expect(monthCell("ส.ค.")).toBeDisabled();
  });

  it("disabledMonth ปิดเดือนเป็นราย ๆ — ชุดที่เลือกได้ไม่ต้องต่อเนื่อง", () => {
    setup({
      defaultView: "month",
      disabledMonth: (m) => m.getMonth() !== 4 && m.getMonth() !== 9,
    });
    expect(monthCell("พ.ค.")).toBeEnabled();
    expect(monthCell("ต.ค.")).toBeEnabled();
    expect(monthCell("มิ.ย.")).toBeDisabled();
  });

  it("เดือนที่ปิดกดแล้วไม่เกิดอะไรขึ้น ⛔ ไม่ใช่เปลี่ยนเดือนเงียบ ๆ", async () => {
    const user = userEvent.setup();
    const onMonthChange = vi.fn();
    const onSelect = vi.fn();
    setup({
      defaultView: "month",
      selectMonth: true,
      onMonthChange,
      onSelect,
      minDate: new Date(2026, 4, 1),
    });
    await user.click(monthCell("ม.ค."));
    expect(onMonthChange).not.toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("ปีปิดเมื่อทุกเดือนในปีนั้นปิด — ⛔ ไม่พาไปเจอตารางเทาล้วน", async () => {
    const user = userEvent.setup();
    setup({ defaultView: "month", minDate: new Date(2026, 0, 1) });
    await user.click(screen.getByRole("button", { name: "Choose year" }));
    expect(screen.getByRole("button", { name: "2568" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "2569" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "2570" })).toBeEnabled();
  });

  it("ลูกศรปิดเมื่อหน้าถัดไปไม่เหลืออะไรให้เลือก (ทั้งสามมุมมอง)", async () => {
    const user = userEvent.setup();
    /* พ.ค. 2026 · ช่วงที่เลือกได้คือเดือนนี้เดือนเดียว */
    const bounds = {
      minDate: new Date(2026, 4, 1),
      maxDate: new Date(2026, 4, 31),
    };
    const { unmount } = setup(bounds);
    expect(screen.getByRole("button", { name: "Previous month" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next month" })).toBeDisabled();
    unmount();

    setup({ ...bounds, defaultView: "month" });
    expect(screen.getByRole("button", { name: "Previous year" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next year" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Choose year" }));
    expect(screen.getByRole("button", { name: "Previous years" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next years" })).toBeDisabled();
  });

  /* 🔴 ช่องว่างที่อยู่ **ตรงกลาง** ต้องเดินผ่านได้ — ไม่งั้นเดือนที่มีข้อมูลอยู่อีกฝั่ง
   * ของช่องว่างจะไปไม่ถึงเลย · ลูกศรจึงดูแค่ min/max ⛔ ไม่ดู `disabledMonth` */
  it("disabledMonth ไม่ทำให้ลูกศรปิด", () => {
    setup({
      defaultView: "month",
      disabledMonth: (m) => m.getFullYear() === 2027,
      minDate: new Date(2026, 0, 1),
      maxDate: new Date(2028, 11, 31),
    });
    expect(screen.getByRole("button", { name: "Next year" })).toBeEnabled();
  });
});
