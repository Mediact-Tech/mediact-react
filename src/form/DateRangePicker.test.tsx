import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DateRangePicker } from "./DateRangePicker";

/* The picker opens on the real current month when no value is set, so tests
 * cannot hardcode a "2026-05-10"-style key — the enabled (non-adjacent-month)
 * cells are chronological in DOM order regardless of which month is showing,
 * so picking by index is the month-agnostic way to grab "an earlier day" and
 * "a later day" in the same open month. */
const pickEnabledDay = async (
  user: ReturnType<typeof userEvent.setup>,
  index: number,
) => {
  const grid = await screen.findByRole("grid");
  const enabled = within(grid)
    .getAllByRole("gridcell")
    .filter((c) => !c.querySelector("button")!.hasAttribute("disabled"));
  const cell = enabled[index]!;
  const key = cell.getAttribute("data-day")!;
  await user.click(cell.querySelector("button")!);
  return key;
};

const dateOf = (key: string) => Number(key.slice(-2));

describe("DateRangePicker", () => {
  it("renders trigger with placeholder on both sides of the dash when empty", () => {
    render(<DateRangePicker label="Range" placeholder="Pick a date" />);
    expect(screen.getByText("Pick a date – Pick a date")).toBeInTheDocument();
  });

  it("formats a committed defaultValue using displayFormat", () => {
    render(
      <DateRangePicker
        label="Range"
        defaultValue={{ from: new Date(2026, 4, 9), to: new Date(2026, 4, 20) }}
        displayFormat="yyyy-MM-dd"
      />,
    );
    expect(screen.getByLabelText("Range")).toHaveTextContent(
      "2026-05-09 – 2026-05-20",
    );
  });

  /* 🔴 ยามของบั๊ก "ปฏิทินสองแบบนับปีคนละอย่าง"
   * ไม่ส่ง `displayFormat` ⇒ ช่องต้องเดินผ่าน `Intl` ด้วย locale เดียวกับปฏิทิน
   * ไม่ใช่ date-fns (ซึ่งไม่มี พ.ศ. ⇒ ช่องขึ้น 2026 ปฏิทินขึ้น 2569) */
  it("field text follows calendarLocale — Buddhist era by default, not date-fns", () => {
    render(
      <DateRangePicker
        label="Range"
        defaultValue={{ from: new Date(2026, 4, 9), to: new Date(2026, 4, 20) }}
      />,
    );
    // th-TH is the default locale → 2569, never 2026
    expect(screen.getByLabelText("Range")).toHaveTextContent("2569");
    expect(screen.getByLabelText("Range")).not.toHaveTextContent("2026");
  });

  it("calendarLocale also drives the field, so both name the same year", () => {
    render(
      <DateRangePicker
        label="Range"
        calendarLocale="en-GB"
        defaultValue={{ from: new Date(2026, 4, 9), to: new Date(2026, 4, 20) }}
      />,
    );
    expect(screen.getByLabelText("Range")).toHaveTextContent("2026");
  });

  it("opens the calendar popover on trigger click", async () => {
    const user = userEvent.setup();
    render(<DateRangePicker label="Range" />);
    await user.click(screen.getByLabelText("Range"));
    expect(await screen.findByRole("grid")).toBeInTheDocument();
  });

  it("does not commit onChange while a range is only half-picked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DateRangePicker label="Range" onChange={onChange} />);
    await user.click(screen.getByLabelText("Range"));
    await pickEnabledDay(user, 10);
    expect(onChange).not.toHaveBeenCalled();
    // still open — the field shows nothing committed yet
    expect(screen.getByLabelText("Range")).toHaveTextContent("");
  });

  it("picks a range across two clicks and commits only on confirm", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DateRangePicker label="Range" onChange={onChange} />);
    await user.click(screen.getByLabelText("Range"));
    const startKey = await pickEnabledDay(user, 5);
    const endKey = await pickEnabledDay(user, 15);
    expect(onChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "OK" }));
    expect(onChange).toHaveBeenCalledTimes(1);
    const arg = onChange.mock.calls[0]?.[0] as { from: Date; to: Date };
    expect(arg.from.getDate()).toBe(dateOf(startKey));
    expect(arg.to.getDate()).toBe(dateOf(endKey));
    expect(screen.queryByRole("grid")).toBeNull();
  });

  it("clicking a day before the start begins a new range instead of swapping", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DateRangePicker label="Range" onChange={onChange} />);
    await user.click(screen.getByLabelText("Range"));
    await pickEnabledDay(user, 15);
    const secondKey = await pickEnabledDay(user, 5);
    await user.click(screen.getByRole("button", { name: "OK" }));
    const arg = onChange.mock.calls[0]?.[0] as { from: Date; to: Date };
    // the second click (the earlier day) restarted the range as a single
    // day, not a swapped pair
    expect(arg.from.getDate()).toBe(dateOf(secondKey));
    expect(arg.to.getDate()).toBe(dateOf(secondKey));
  });

  it("confirming a single picked day commits a one-day range", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DateRangePicker label="Range" onChange={onChange} />);
    await user.click(screen.getByLabelText("Range"));
    const key = await pickEnabledDay(user, 12);
    await user.click(screen.getByRole("button", { name: "OK" }));
    const arg = onChange.mock.calls[0]?.[0] as { from: Date; to: Date };
    expect(arg.from.getDate()).toBe(dateOf(key));
    expect(arg.to.getDate()).toBe(dateOf(key));
  });

  it("clear button inside the popover resets to null and closes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DateRangePicker
        label="Range"
        defaultValue={{ from: new Date(2026, 4, 9), to: new Date(2026, 4, 20) }}
        onChange={onChange}
      />,
    );
    await user.click(screen.getByLabelText("Range"));
    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(onChange).toHaveBeenCalledWith({ from: null, to: null });
    expect(screen.queryByRole("grid")).toBeNull();
  });

  /* ค่าเริ่มต้นต้องไม่มีปุ่มล้างในช่อง — ไอคอนขวาของทุก field ใน DS มีตัวเดียวตายตัว
   * (`ComboBox` · `EntityAutocomplete` · `DatePicker` · `TimePicker`) */
  it("no clear icon in the field by default, even with a value", () => {
    render(
      <DateRangePicker
        label="Range"
        defaultValue={{ from: new Date(2026, 4, 9), to: new Date(2026, 4, 20) }}
      />,
    );
    expect(screen.queryByRole("button", { name: "Clear" })).toBeNull();
  });

  it("showClearInField clears without opening the popover", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <DateRangePicker
        label="Range"
        showClearInField
        defaultValue={{ from: new Date(2026, 4, 9), to: new Date(2026, 4, 20) }}
        onChange={onChange}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(onChange).toHaveBeenCalledWith({ from: null, to: null });
    expect(screen.queryByRole("grid")).toBeNull();
  });

  /* X ซ้อนที่เดียวกับไอคอนปฏิทิน (ตามแบบ antd) ⇒ ความกว้างไม่ขึ้นกับสถานะ
   * ถ้าวันไหนมีคนเปลี่ยนไปวางไอคอนต่อแถวกัน เทสนี้จะจับได้ว่าระยะเริ่มไม่พอ */
  it("right padding stays constant — the clear icon shares the calendar's slot", () => {
    const value = { from: new Date(2026, 4, 9), to: new Date(2026, 4, 20) };
    const { rerender } = render(<DateRangePicker label="Range" defaultValue={value} />);
    expect(screen.getByLabelText("Range").className).toContain("pr-9");
    rerender(<DateRangePicker label="Range" defaultValue={value} showClearInField />);
    expect(screen.getByLabelText("Range").className).toContain("pr-9");
    expect(screen.getByLabelText("Range").className).not.toContain("pr-14");
  });

  /* 🔴 บนทัชไม่มี hover ⇒ ปุ่มใสต้องกดไม่ได้จนกว่าจะถูกเผย ไม่งั้นแตะตรงไอคอนปฏิทิน
   * แล้วโดนล้างค่าทิ้งแทนที่จะเปิดปฏิทิน · happy-dom ไม่ทำ hover ⇒ ล็อกที่สัญญาของ class */
  it("the in-field clear icon is inert until hover or focus reveals it", () => {
    render(
      <DateRangePicker
        label="Range"
        showClearInField
        defaultValue={{ from: new Date(2026, 4, 9), to: new Date(2026, 4, 20) }}
      />,
    );
    const clear = screen.getByRole("button", { name: "Clear" });
    expect(clear.className).toContain("pointer-events-none");
    expect(clear.className).toContain("opacity-0");
    expect(clear.className).toContain("group-hover:pointer-events-auto");
    expect(clear.className).toContain("group-focus-within:opacity-100");
    // it is a control, so it must read as one under the pointer
    expect(clear.className).toContain("cursor-pointer");
  });

  /* 🔴 shell วาง adornment ทับปุ่ม trigger ⇒ ถ้าไม่ปล่อยคลิกทะลุ กดตรงไอคอนปฏิทิน
   * จะไม่เปิดปฏิทิน และไม่มีอะไรฟ้องเลย · happy-dom ไม่ทำ hit-test ⇒ ล็อกที่ class
   * (ยืนยันของจริงด้วย `elementFromPoint` ในเบราว์เซอร์แล้ว) */
  it("the icon slot lets clicks through to the trigger", () => {
    render(<DateRangePicker label="Range" showClearInField defaultValue={{ from: new Date(2026, 4, 9), to: null }} />);
    const trigger = screen.getByLabelText("Range");
    const shellAdornment = trigger.parentElement!.querySelector("span.absolute.right-3")!;
    expect(shellAdornment.className).toContain("pointer-events-none");
    expect(shellAdornment.firstElementChild!.className).toContain("pointer-events-none");
  });

  it("abandons the draft when the popover is dismissed without confirming", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DateRangePicker label="Range" onChange={onChange} />);
    await user.click(screen.getByLabelText("Range"));
    const key = await pickEnabledDay(user, 10);
    await user.keyboard("{Escape}");
    expect(onChange).not.toHaveBeenCalled();
    // reopening starts from the still-empty committed value, not the abandoned draft
    await user.click(screen.getByLabelText("Range"));
    const grid = await screen.findByRole("grid");
    const cell = within(grid)
      .getAllByRole("gridcell")
      .find((c) => c.getAttribute("data-day") === key);
    expect(cell).not.toHaveAttribute("aria-selected");
  });

  it("renders error and aria-invalid", () => {
    render(<DateRangePicker label="Range" error="required" />);
    expect(screen.getByRole("alert")).toHaveTextContent("required");
    expect(screen.getByLabelText("Range")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("does not open when disabled", async () => {
    const user = userEvent.setup();
    render(<DateRangePicker label="Range" disabled />);
    await user.click(screen.getByLabelText("Range"));
    expect(screen.queryByRole("grid")).toBeNull();
  });

  it("hides the in-field clear icon when disabled even with a value", () => {
    render(
      <DateRangePicker
        label="Range"
        disabled
        showClearInField
        defaultValue={{ from: new Date(2026, 4, 9), to: new Date(2026, 4, 20) }}
      />,
    );
    expect(screen.queryByRole("button", { name: "Clear" })).toBeNull();
  });

  it("supports controlled value updates", () => {
    const { rerender } = render(
      <DateRangePicker
        label="Range"
        value={{ from: new Date(2026, 4, 9), to: new Date(2026, 4, 9) }}
        onChange={() => {}}
        displayFormat="yyyy-MM-dd"
      />,
    );
    expect(screen.getByLabelText("Range")).toHaveTextContent(
      "2026-05-09 – 2026-05-09",
    );
    rerender(
      <DateRangePicker
        label="Range"
        value={{ from: new Date(2026, 4, 9), to: new Date(2026, 4, 20) }}
        onChange={() => {}}
        displayFormat="yyyy-MM-dd"
      />,
    );
    expect(screen.getByLabelText("Range")).toHaveTextContent(
      "2026-05-09 – 2026-05-20",
    );
  });

  it("accepts custom labels for the footer buttons and clear icon", async () => {
    const user = userEvent.setup();
    render(
      <DateRangePicker
        label="Range"
        showClearInField
        labels={{ confirm: "ยืนยัน", clear: "ล้าง" }}
        defaultValue={{ from: new Date(2026, 4, 9), to: new Date(2026, 4, 20) }}
      />,
    );
    // the in-field icon takes its aria-label from the same key as the footer button
    expect(screen.getByRole("button", { name: "ล้าง" })).toBeInTheDocument();
    await user.click(screen.getByLabelText("Range"));
    expect(screen.getByRole("button", { name: "ยืนยัน" })).toBeInTheDocument();
  });
});
