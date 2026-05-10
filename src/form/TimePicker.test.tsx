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
});
