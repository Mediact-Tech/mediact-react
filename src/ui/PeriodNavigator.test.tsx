/**
 * ยามของตัวเลื่อนงวด
 *
 * ⚠️ ปฏิทินอยู่ใน popover ซึ่ง render ผ่าน portal ไปที่ `document.body`
 * ⇒ ค้นจาก `container` จะไม่เจออะไรเลย และเทสจะผ่านแบบว่างเปล่า
 *
 * สิ่งที่ล็อกไว้ตรงนี้คือเรื่องที่**พังเงียบ**: งวดที่แปลว่าเดือนอะไร · ลูกศรที่ต้องข้าม
 * ช่องว่าง · เดือนที่ไม่มีงวดต้องกดไม่ได้ · และป้ายกลางที่บอกช่วงวันไม่ใช่ชื่อเดือน
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PeriodNavigator, type PeriodNavigatorItem } from "./PeriodNavigator";

/* งวดตัดวันที่ 25 — เดือนของงวดจึงเป็นเดือนของ `endDate` ไม่ใช่ของ `startDate` */
const periods: PeriodNavigatorItem[] = [
  { id: 3, startDate: "2026-08-26", endDate: "2026-09-25", label: "งวดกันยายน" },
  { id: 2, startDate: "2026-07-26", endDate: "2026-08-25", label: "งวดสิงหาคม" },
  { id: 1, startDate: "2026-06-26", endDate: "2026-07-25", label: "งวดกรกฎาคม" },
];

const setup = (
  props: Partial<React.ComponentProps<typeof PeriodNavigator>> = {},
) =>
  render(
    <PeriodNavigator
      periods={props.periods ?? periods}
      value={props.value !== undefined ? props.value : 2}
      onChange={props.onChange ?? (() => {})}
      {...props}
    />,
  );

const openCalendar = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole("button", { expanded: false }));
  return screen.findByRole("button", { name: "ส.ค." });
};

describe("ป้ายกลาง", () => {
  /* 🔴 ป้ายคือ **ช่วงวัน** ไม่ใช่ชื่อเดือน — คนที่เปิดจอกำลังตอบว่า "ข้อมูลที่เห็น
   * ครอบวันไหนบ้าง" ซึ่งชื่อเดือนตอบไม่ได้เลยเมื่อวันตัดงวดไม่ใช่สิ้นเดือน */
  it("บอกช่วงวันของงวด และตัดปีฝั่งซ้ายเมื่ออยู่ปีเดียวกัน", () => {
    setup();
    expect(screen.getByText(/26 ก\.ค\..*25 ส\.ค\. 2569/)).toBeInTheDocument();
  });

  it("งวดคร่อมปีโชว์ปีทั้งสองฝั่ง — ไม่งั้นอ่านผิดปีทันที", () => {
    setup({
      periods: [{ id: 9, startDate: "2026-12-26", endDate: "2027-01-25" }],
      value: 9,
    });
    expect(screen.getByText(/2569.*2570/)).toBeInTheDocument();
  });

  it("ต่อท้ายด้วย suffix ที่ผู้เรียกส่งมา (เช่นงวดที่ปิดแล้ว)", () => {
    setup({
      periods: [
        { id: 5, startDate: "2026-07-26", endDate: "2026-08-25", suffix: "(ปิดแล้ว)" },
      ],
      value: 5,
    });
    expect(screen.getByText(/\(ปิดแล้ว\)$/)).toBeInTheDocument();
  });

  it("ยังไม่มีงวด = บอกว่ายังไม่มี และกดอะไรไม่ได้ทั้งอัน", () => {
    setup({ periods: [], value: null, labels: { empty: "ยังไม่มีงวด" } });
    expect(screen.getByText("ยังไม่มีงวด")).toBeInTheDocument();
    /* ปฏิทินถูกปิดทิ้ง ⇒ ตรงกลางไม่ใช่ปุ่ม เหลือแค่ ‹ › ซึ่งกดไม่ได้ทั้งคู่ */
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
    buttons.forEach((b) => expect(b).toBeDisabled());
  });

  it("ปี ค.ศ. เมื่อเปลี่ยน locale", () => {
    setup({ locale: "en-US" });
    expect(screen.getByText(/2026/)).toBeInTheDocument();
  });
});

describe("ลูกศร", () => {
  it("เดินทีละงวดตามลำดับเวลา ไม่ว่าผู้เรียกจะส่งมาเรียงแบบไหน", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    setup({ onChange, labels: { prev: "งวดก่อนหน้า", next: "งวดถัดไป" } });
    await user.click(screen.getByRole("button", { name: "งวดถัดไป" }));
    expect(onChange).toHaveBeenCalledWith(3);
    await user.click(screen.getByRole("button", { name: "งวดก่อนหน้า" }));
    expect(onChange).toHaveBeenCalledWith(1);
  });

  /* 🔴 ชุดงวดไม่จำเป็นต้องต่อเนื่อง — ถ้าลูกศรก้าวทีละเดือนแล้วหางวดไม่เจอ
   * ปุ่มจะกลายเป็น "กดแล้วอยู่ที่เดิม" ซึ่งผู้ใช้อ่านว่าจอค้าง */
  it("ข้ามเดือนที่ไม่มีงวดไปหางวดถัดไปที่มีจริง", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    setup({
      periods: [
        { id: 10, startDate: "2026-01-26", endDate: "2026-02-25" },
        { id: 20, startDate: "2026-06-26", endDate: "2026-07-25" },
      ],
      value: 10,
      onChange,
    });
    await user.click(screen.getByRole("button", { name: "Next period" }));
    expect(onChange).toHaveBeenCalledWith(20);
  });

  it("อยู่ที่งวดเก่าสุด/ใหม่สุดแล้วลูกศรฝั่งนั้นกดไม่ได้", () => {
    const { unmount } = setup({ value: 1 });
    expect(screen.getByRole("button", { name: "Previous period" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next period" })).toBeEnabled();
    unmount();
    setup({ value: 3 });
    expect(screen.getByRole("button", { name: "Next period" })).toBeDisabled();
  });
});

describe("ตาราง 12 เดือน", () => {
  it("เลือกเดือนที่มีงวด → ส่ง id ของงวดนั้น แล้วปิดปฏิทิน", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    setup({ onChange });
    await openCalendar(user);
    await user.click(screen.getByRole("button", { name: "ก.ย." }));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  /* 🔴 เกณฑ์คือ "มีแถวงวดของเดือนนี้ไหม" ⛔ ไม่ใช่การเทียบวันที่เอง — งวดคือแถวใน
   * ฐานข้อมูล การคิดขอบเองจากปฏิทินคือกฎชุดที่สองที่ drift จากหลังบ้านได้ทุกเมื่อ */
  it("เดือนที่ไม่มีงวดกดไม่ได้ ⛔ ไม่ใช่กดได้แล้วเงียบ", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    /* ⚠️ ต้องเป็นเดือนที่อยู่ **ระหว่าง** งวดเก่าสุดกับใหม่สุด — เดือนนอกช่วงถูก
     * `minDate`/`maxDate` ปิดอยู่แล้ว ⇒ ทดสอบด้วยเดือนแบบนั้นจะผ่านทั้งที่ถอด
     * `disabledMonth` ออก (พิสูจน์ด้วยการกลายพันธุ์แล้วว่าเคยเป็นแบบนั้นจริง) */
    setup({
      onChange,
      periods: [
        { id: 10, startDate: "2026-01-26", endDate: "2026-02-25" },
        { id: 20, startDate: "2026-06-26", endDate: "2026-07-25" },
      ],
      value: 10,
    });
    await user.click(screen.getByRole("button", { expanded: false }));
    const april = await screen.findByRole("button", { name: "เม.ย." });
    expect(april).toBeDisabled();
    await user.click(april);
    expect(onChange).not.toHaveBeenCalled();
    /* คุมตัวแปร: เดือนที่มีงวดจริงในชุดเดียวกันยังกดได้ */
    expect(screen.getByRole("button", { name: "ก.ค." })).toBeEnabled();
  });

  it("เดือนของงวดอ่านจากวันตัดงวด ไม่ใช่วันเริ่มงวด", async () => {
    const user = userEvent.setup();
    setup({
      periods: [{ id: 7, startDate: "2026-07-26", endDate: "2026-08-25" }],
      value: 7,
    });
    await openCalendar(user);
    /* งวด 26 ก.ค. – 25 ส.ค. ⇒ ส.ค. เลือกได้ · ก.ค. ต้องปิด */
    expect(screen.getByRole("button", { name: "ส.ค." })).toBeEnabled();
    expect(screen.getByRole("button", { name: "ก.ค." })).toBeDisabled();
  });

  it("บรรทัดสรุปใต้ปฏิทินบอกทั้งเดือนและช่วงวัน", async () => {
    const user = userEvent.setup();
    setup({ labels: { footer: "งวดเดือน {month} · {range}" } });
    await openCalendar(user);
    expect(
      screen.getByText(/งวดเดือน ส\.ค\. · 26 ก\.ค\..*25 ส\.ค\. 2569/),
    ).toBeInTheDocument();
  });

  it("ปิดบรรทัดสรุปได้", async () => {
    const user = userEvent.setup();
    setup({ showFooter: false, labels: { footer: "งวดเดือน {month}" } });
    await openCalendar(user);
    expect(screen.queryByText(/งวดเดือน/)).toBeNull();
  });
});

describe("ปิดชั่วคราว", () => {
  /* 🔴 ป้ายกลางต้อง **ยังบอกงวดเดิม** ⛔ ไม่ใช่พลิกเป็น "ยังไม่มีงวด" — จอที่ปิดตัวเลื่อน
   * ระหว่าง refetch จะกะพริบทุกครั้งถ้าเลือกวิธีส่ง `periods={[]}` แทน */
  it("disabled = กดไม่ได้ทั้งอัน แต่ยังบอกงวดที่เลือกอยู่", () => {
    setup({ disabled: true });
    expect(screen.getByText(/26 ก\.ค\..*25 ส\.ค\. 2569/)).toBeInTheDocument();
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
    buttons.forEach((b) => expect(b).toBeDisabled());
  });
});
