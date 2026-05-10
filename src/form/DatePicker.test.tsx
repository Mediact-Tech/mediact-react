import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DatePicker } from "./DatePicker";

describe("DatePicker", () => {
  it("renders trigger with placeholder when empty", () => {
    render(<DatePicker label="Date" placeholder="Pick a date" />);
    expect(screen.getByText("Pick a date")).toBeInTheDocument();
  });

  it("formats defaultValue using displayFormat", () => {
    const may9 = new Date(2026, 4, 9);
    render(
      <DatePicker
        label="Date"
        defaultValue={may9}
        displayFormat="yyyy-MM-dd"
      />,
    );
    expect(screen.getByLabelText("Date")).toHaveTextContent("2026-05-09");
  });

  it("opens calendar popover on trigger click", async () => {
    const user = userEvent.setup();
    render(<DatePicker label="Date" />);
    await user.click(screen.getByLabelText("Date"));
    expect(await screen.findByRole("grid")).toBeInTheDocument();
  });

  it("selects a date and fires onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const may9 = new Date(2026, 4, 9);
    render(
      <DatePicker
        label="Date"
        defaultValue={may9}
        onChange={onChange}
      />,
    );
    await user.click(screen.getByLabelText("Date"));
    // pick day 15 of the open month
    const grid = await screen.findByRole("grid");
    const cell = within(grid)
      .getAllByRole("gridcell")
      .find((c) => c.getAttribute("data-day") === "2026-05-15");
    await user.click(cell!.querySelector("button")!);
    expect(onChange).toHaveBeenCalledTimes(1);
    const arg = onChange.mock.calls[0]?.[0];
    expect(arg).toBeInstanceOf(Date);
    expect((arg as Date).getDate()).toBe(15);
  });

  it("closes the popover after selecting a date", async () => {
    const user = userEvent.setup();
    const may9 = new Date(2026, 4, 9);
    render(<DatePicker label="Date" defaultValue={may9} />);
    await user.click(screen.getByLabelText("Date"));
    const grid = await screen.findByRole("grid");
    const cell = within(grid)
      .getAllByRole("gridcell")
      .find((c) => c.getAttribute("data-day") === "2026-05-20");
    await user.click(cell!.querySelector("button")!);
    // grid should be removed
    expect(screen.queryByRole("grid")).toBeNull();
  });

  it("renders error and aria-invalid", () => {
    render(<DatePicker label="Date" error="required" />);
    expect(screen.getByRole("alert")).toHaveTextContent("required");
    expect(screen.getByLabelText("Date")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("does not open when disabled", async () => {
    const user = userEvent.setup();
    render(<DatePicker label="Date" disabled />);
    await user.click(screen.getByLabelText("Date"));
    expect(screen.queryByRole("grid")).toBeNull();
  });

  it("supports controlled value updates", async () => {
    const may9 = new Date(2026, 4, 9);
    const may20 = new Date(2026, 4, 20);
    const { rerender } = render(
      <DatePicker label="Date" value={may9} onChange={() => {}} />,
    );
    expect(screen.getByLabelText("Date")).toHaveTextContent("May 9th");
    rerender(<DatePicker label="Date" value={may20} onChange={() => {}} />);
    expect(screen.getByLabelText("Date")).toHaveTextContent("May 20th");
  });
});
