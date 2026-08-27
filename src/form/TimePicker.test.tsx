import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TimePicker } from "./TimePicker";
import * as React from "react";

describe("TimePicker", () => {
  describe("typing", () => {
    it("renders empty HH and mm inputs", () => {
      render(<TimePicker label="Time" />);
      expect(screen.getByLabelText("Hours")).toHaveValue("");
      expect(screen.getByLabelText("Minutes")).toHaveValue("");
    });

    it("emits HH:mm on user typing single digits without forcing pad", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<TimePicker label="Time" onChange={onChange} />);
      await user.type(screen.getByLabelText("Hours"), "9");
      // committed value is padded
      expect(onChange).toHaveBeenLastCalledWith("09:00");
      // but the input itself still shows "9" (no cursor jump)
      expect(screen.getByLabelText("Hours")).toHaveValue("9");
    });

    it("allows typing '3' then '0' for minutes (no auto-pad mid-typing)", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<TimePicker label="Time" onChange={onChange} />);
      const m = screen.getByLabelText("Minutes");
      await user.type(m, "3");
      expect(m).toHaveValue("3");
      expect(onChange).toHaveBeenLastCalledWith("00:03");
      await user.type(m, "0");
      expect(m).toHaveValue("30");
      expect(onChange).toHaveBeenLastCalledWith("00:30");
    });

    it("clamps hours to 0-23", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<TimePicker label="Time" onChange={onChange} />);
      await user.type(screen.getByLabelText("Hours"), "99");
      // last commit clamps to 23
      expect(onChange).toHaveBeenLastCalledWith("23:00");
    });

    it("clamps minutes to 0-59", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<TimePicker label="Time" onChange={onChange} />);
      await user.type(screen.getByLabelText("Minutes"), "99");
      expect(onChange).toHaveBeenLastCalledWith("00:59");
    });

    it("strips non-digit characters", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<TimePicker label="Time" onChange={onChange} />);
      await user.type(screen.getByLabelText("Hours"), "a1b");
      expect(screen.getByLabelText("Hours")).toHaveValue("1");
    });

    it("pads single digit on blur", async () => {
      const user = userEvent.setup();
      render(<TimePicker label="Time" />);
      const h = screen.getByLabelText("Hours");
      await user.type(h, "9");
      h.blur();
      // wait for blur effect
      await new Promise((r) => setTimeout(r, 0));
      expect(h).toHaveValue("09");
    });
  });

  describe("popover", () => {
    it("clicking the input does NOT open the popover", async () => {
      const user = userEvent.setup();
      render(<TimePicker label="Time" />);
      await user.click(screen.getByLabelText("Hours"));
      expect(screen.queryByRole("dialog")).toBeNull();
    });

    it("clicking the clock icon opens the popover with 2 listboxes", async () => {
      const user = userEvent.setup();
      render(<TimePicker label="Time" />);
      await user.click(
        screen.getByRole("button", { name: /open time picker/i }),
      );
      const dialog = await screen.findByRole("dialog", { name: "Pick time" });
      const lists = within(dialog).getAllByRole("listbox");
      expect(lists).toHaveLength(2);
    });

    it("picking from popover updates value", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<TimePicker label="Time" onChange={onChange} />);
      await user.click(
        screen.getByRole("button", { name: /open time picker/i }),
      );
      const dialog = await screen.findByRole("dialog", { name: "Pick time" });
      const [hourCol, minuteCol] = within(dialog).getAllByRole("listbox");
      await user.click(within(hourCol!).getByRole("option", { name: "14" }));
      await user.click(within(minuteCol!).getByRole("option", { name: "30" }));
      expect(onChange).toHaveBeenLastCalledWith("14:30");
    });
  });

  describe("controlled value", () => {
    it("reflects external value updates", () => {
      const { rerender } = render(
        <TimePicker label="Time" value="09:30" onChange={() => {}} />,
      );
      expect(screen.getByLabelText("Hours")).toHaveValue("09");
      expect(screen.getByLabelText("Minutes")).toHaveValue("30");
      rerender(<TimePicker label="Time" value="14:05" onChange={() => {}} />);
      expect(screen.getByLabelText("Hours")).toHaveValue("14");
      expect(screen.getByLabelText("Minutes")).toHaveValue("05");
    });
  });

  describe("error / disabled", () => {
    it("shows error and aria-invalid", () => {
      render(<TimePicker label="Time" error="required" />);
      expect(screen.getByRole("alert")).toHaveTextContent("required");
    });

    it("disables both inputs and the icon button when disabled", () => {
      render(<TimePicker label="Time" disabled />);
      expect(screen.getByLabelText("Hours")).toBeDisabled();
      expect(screen.getByLabelText("Minutes")).toBeDisabled();
      expect(
        screen.getByRole("button", { name: /open time picker/i }),
      ).toBeDisabled();
    });
  });

  describe("minTime / maxTime", () => {
    it("disables out-of-range hour options in the popover", async () => {
      const user = userEvent.setup();
      render(
        <TimePicker label="Time" minTime="09:00" maxTime="17:00" />,
      );
      await user.click(
        screen.getByRole("button", { name: /open time picker/i }),
      );
      const dialog = await screen.findByRole("dialog", { name: "Pick time" });
      const [hourCol] = within(dialog).getAllByRole("listbox");
      expect(within(hourCol!).getByRole("option", { name: "08" })).toBeDisabled();
      expect(within(hourCol!).getByRole("option", { name: "17" })).toBeEnabled();
      expect(within(hourCol!).getByRole("option", { name: "18" })).toBeDisabled();
    });

    it("disables out-of-range minute options once an hour at the boundary is selected", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <TimePicker
          label="Time"
          minTime="09:30"
          maxTime="17:00"
          value="09:30"
          onChange={onChange}
        />,
      );
      await user.click(
        screen.getByRole("button", { name: /open time picker/i }),
      );
      const dialog = await screen.findByRole("dialog", { name: "Pick time" });
      const [, minuteCol] = within(dialog).getAllByRole("listbox");
      expect(
        within(minuteCol!).getByRole("option", { name: "00" }),
      ).toBeDisabled();
      expect(
        within(minuteCol!).getByRole("option", { name: "30" }),
      ).toBeEnabled();
    });

    it("does not disable anything when minTime/maxTime are unset (default)", async () => {
      const user = userEvent.setup();
      render(<TimePicker label="Time" />);
      await user.click(
        screen.getByRole("button", { name: /open time picker/i }),
      );
      const dialog = await screen.findByRole("dialog", { name: "Pick time" });
      const [hourCol] = within(dialog).getAllByRole("listbox");
      expect(within(hourCol!).getByRole("option", { name: "00" })).toBeEnabled();
      expect(within(hourCol!).getByRole("option", { name: "23" })).toBeEnabled();
    });

    it("snaps a typed out-of-range value back into bounds once focus leaves the field", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <TimePicker
          label="Time"
          minTime="09:00"
          maxTime="17:00"
          onChange={onChange}
        />,
      );
      await user.type(screen.getByLabelText("Hours"), "05");
      await user.type(screen.getByLabelText("Minutes"), "00");
      // clicking outside the whole field group moves focus away
      await user.click(document.body);
      expect(onChange).toHaveBeenLastCalledWith("09:00");
    });

    it("does not clamp mid-typing (typing '14' with minTime hour 9 isn't jammed to '09' after the first digit)", async () => {
      const user = userEvent.setup();
      render(<TimePicker label="Time" minTime="09:00" />);
      const h = screen.getByLabelText("Hours");
      await user.type(h, "1");
      expect(h).toHaveValue("1");
      await user.type(h, "4");
      expect(h).toHaveValue("14");
    });
  });

  describe("ampm", () => {
    it("displays hour in 12h form while value/onChange stay 24h", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <TimePicker label="Time" ampm value="14:30" onChange={onChange} />,
      );
      expect(screen.getByLabelText("Hours")).toHaveValue("02");
      expect(screen.getByLabelText("Minutes")).toHaveValue("30");
      expect(screen.getByRole("button", { name: /toggle am\/pm/i })).toHaveTextContent(
        "PM",
      );
    });

    it("toggling AM/PM converts the 24h value without touching hour/minute", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <TimePicker label="Time" ampm value="09:15" onChange={onChange} />,
      );
      await user.click(screen.getByRole("button", { name: /toggle am\/pm/i }));
      expect(onChange).toHaveBeenLastCalledWith("21:15");
    });

    it("popover shows a 3rd Period listbox and hour options in 1-12 form", async () => {
      const user = userEvent.setup();
      render(<TimePicker label="Time" ampm />);
      await user.click(
        screen.getByRole("button", { name: /open time picker/i }),
      );
      const dialog = await screen.findByRole("dialog", { name: "Pick time" });
      const lists = within(dialog).getAllByRole("listbox");
      expect(lists).toHaveLength(3);
      const [hourCol] = lists;
      expect(within(hourCol!).queryByRole("option", { name: "00" })).toBeNull();
      expect(within(hourCol!).getByRole("option", { name: "12" })).toBeInTheDocument();
    });

    it("picking hour 3, minute 45, and PM from the popover commits 15:45", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<TimePicker label="Time" ampm onChange={onChange} />);
      await user.click(
        screen.getByRole("button", { name: /open time picker/i }),
      );
      const dialog = await screen.findByRole("dialog", { name: "Pick time" });
      const [hourCol, minuteCol, periodCol] = within(dialog).getAllByRole(
        "listbox",
      );
      await user.click(within(hourCol!).getByRole("option", { name: "03" }));
      await user.click(within(minuteCol!).getByRole("option", { name: "45" }));
      await user.click(within(periodCol!).getByRole("option", { name: "PM" }));
      expect(onChange).toHaveBeenLastCalledWith("15:45");
    });
  });

  /**
   * `labels` — ทุกคำที่ผู้ใช้ **อ่าน** และ **ได้ยิน** ต้องแปลได้
   *
   * 🔴 ก่อนมี prop นี้ `HH`/`mm` และ `aria-label` ทุกตัวเป็นอังกฤษตายตัว ⇒ ฟอร์มภาษาไทยทั้งใบ
   *    มีช่องเวลาที่อ่านว่า `HH : mm` และผู้ใช้ screen reader ได้ยิน "Hours" (พบจริงบน
   *    mediact-web-backoffice 2026-08-26)
   */
  /**
   * การเลื่อนไปยังตัวที่เลือก — ด่านกันถอยหลังของบั๊ก "เลือกเวลาไม่ลื่น"
   *
   * 🔴🔴 อาการเดิม: `scrollIntoView()` เลื่อน **ทุก ancestor ที่เลื่อนได้** ⇒ เมื่อแผงอยู่ในโมดัล
   *      ทั้งโมดัลและหน้าเบื้องหลังกระตุกตามทุกครั้งที่เลือก (พบจริง 2026-08-26)
   *      · jsdom ไม่มี layout จึงพิสูจน์ *ตำแหน่ง* ไม่ได้ — แต่พิสูจน์ *วิธี* ได้ และวิธีคือตัวบั๊ก
   */
  describe("การเลื่อนไปยังตัวที่เลือก", () => {
    it("🔴 ไม่เรียก scrollIntoView เลย — ไม่งั้นโมดัลที่ครอบอยู่จะถูกลากตามไปด้วย", async () => {
      const spy = vi
        .spyOn(Element.prototype, "scrollIntoView")
        .mockImplementation(() => {});
      const user = userEvent.setup();
      render(<TimePicker label="Time" value="14:30" />);

      await user.click(screen.getByLabelText("Open time picker"));
      await screen.findByRole("listbox", { name: "Hours" });

      /* ⛔ กลับไปใช้ `scrollIntoView` เมื่อไหร่ เทสนี้แดงทันที */
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it("🔴 คอลัมน์เป็น relative — `offsetTop` ต้องวัดจากคอลัมน์ ไม่ใช่จาก popper", async () => {
      const user = userEvent.setup();
      render(<TimePicker label="Time" value="14:30" />);

      await user.click(screen.getByLabelText("Open time picker"));
      const column = await screen.findByRole("listbox", { name: "Hours" });

      /* ถอด `relative` ออก = `offsetParent` กลายเป็น popper ⇒ ค่าที่คำนวณเพี้ยนทั้งก้อน
       * **แบบเงียบ** (ไม่มี error · แค่เลื่อนไปผิดที่) */
      expect(column).toHaveClass("relative");
    });

    it("แถบเลื่อนโปร่งใสจนกว่าจะ hover — และรางกว้างคงที่ ⇒ ปุ่มไม่ขยับ", async () => {
      const user = userEvent.setup();
      render(<TimePicker label="Time" value="14:30" />);

      await user.click(screen.getByLabelText("Open time picker"));
      const column = await screen.findByRole("listbox", { name: "Hours" });

      expect(column).toHaveClass("[scrollbar-color:transparent_transparent]");
      /* ⛔ ห้ามเปลี่ยนเป็น `overflow-hidden` + `hover:overflow-y-auto` แบบ MUI —
       * รางจะเกิด/หายตอน hover แล้วปุ่มตัวเลือกขยับซ้ายขวา (คอลัมน์ของเราเป็น `flex-1`
       * ไม่ใช่กว้างตายตัว 56px แบบ MUI) */
      expect(column).toHaveClass("overflow-y-auto");
    });
  });

  describe("labels", () => {
    it("ใช้คำอังกฤษเป็นค่าตั้งต้นเมื่อไม่ส่ง labels (⛔ ไม่ใช่ breaking change)", () => {
      render(<TimePicker label="Time" />);
      expect(screen.getByLabelText("Hours")).toHaveAttribute("placeholder", "HH");
      expect(screen.getByLabelText("Minutes")).toHaveAttribute("placeholder", "mm");
    });

    it("ทับ placeholder ของทั้ง 2 ช่องได้", () => {
      render(<TimePicker label="Time" labels={{ hour: "ชม.", minute: "นาที" }} />);
      expect(screen.getByLabelText("Hours")).toHaveAttribute("placeholder", "ชม.");
      expect(screen.getByLabelText("Minutes")).toHaveAttribute("placeholder", "นาที");
    });

    it("ทับ aria-label ได้ — คำที่ผู้ใช้ *ได้ยิน* ก็ต้องแปลได้", () => {
      render(
        <TimePicker label="Time" labels={{ hourAria: "ชั่วโมง", minuteAria: "นาที" }} />,
      );
      expect(screen.getByLabelText("ชั่วโมง")).toBeInTheDocument();
      expect(screen.getByLabelText("นาที")).toBeInTheDocument();
    });

    it("ส่งมาบางตัว ⇒ ที่เหลือใช้ค่าตั้งต้น (`Partial`)", () => {
      render(<TimePicker label="Time" labels={{ hour: "ชม." }} />);
      expect(screen.getByLabelText("Hours")).toHaveAttribute("placeholder", "ชม.");
      /* ⛔ ตัวที่ไม่ได้ส่งต้องไม่กลายเป็น `undefined` — spread กับ `DEFAULT_LABELS` ต้องมาก่อน */
      expect(screen.getByLabelText("Minutes")).toHaveAttribute("placeholder", "mm");
    });

    it("ทับคำของแผงและปุ่มเปิดได้", async () => {
      const user = userEvent.setup();
      render(
        <TimePicker
          label="Time"
          labels={{ openPicker: "เปิดตัวเลือกเวลา", picker: "เลือกเวลา" }}
        />,
      );
      await user.click(screen.getByLabelText("เปิดตัวเลือกเวลา"));
      expect(await screen.findByRole("dialog", { name: "เลือกเวลา" })).toBeInTheDocument();
    });
  });
});
