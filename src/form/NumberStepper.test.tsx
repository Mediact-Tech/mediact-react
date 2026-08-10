import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NumberStepper } from "./NumberStepper";
import * as React from "react";

const LABELS = { decrease: "ลดค่า", increase: "เพิ่มค่า" };

const setup = (props: Partial<React.ComponentProps<typeof NumberStepper>> = {}) => {
  const onChange = vi.fn();
  render(
    <NumberStepper
      value="5"
      onChange={onChange}
      min={0}
      max={10}
      labels={LABELS}
      aria-label="Beds"
      {...props}
    />,
  );
  return { onChange };
};

describe("NumberStepper", () => {
  describe("buttons", () => {
    it("adds and removes one step", async () => {
      const user = userEvent.setup();
      const { onChange } = setup();
      await user.click(screen.getByRole("button", { name: LABELS.increase }));
      expect(onChange).toHaveBeenLastCalledWith("6");
      await user.click(screen.getByRole("button", { name: LABELS.decrease }));
      expect(onChange).toHaveBeenLastCalledWith("4");
    });

    it("clamps at both ends instead of running past them", async () => {
      const user = userEvent.setup();
      const atMax = setup({ value: "10" });
      await user.click(screen.getByRole("button", { name: LABELS.increase }));
      expect(atMax.onChange).toHaveBeenLastCalledWith("10");
    });

    it("rounds to `precision` so a 0.1 step never leaks float digits", async () => {
      const user = userEvent.setup();
      const { onChange } = setup({ value: "2.4", step: 0.1, precision: 1, max: 10 });
      await user.click(screen.getByRole("button", { name: LABELS.increase }));
      // 2.4 + 0.1 = 2.5000000000000004 without the rounding
      expect(onChange).toHaveBeenLastCalledWith("2.5");
    });

    /* `Number("")` คือ 0 ไม่ใช่ NaN ⇒ ช่องว่างเดินจาก 0 แล้วโดน clamp ขึ้นมาที่ `min`
       ไม่ใช่ `min + step` · ผลลัพธ์ที่ได้คือ "กดเพิ่มจากช่องว่าง = ได้ค่าต่ำสุดที่กรอกได้" */
    it("lands on `min` when the field is empty", async () => {
      const user = userEvent.setup();
      const { onChange } = setup({ value: "", min: 2, max: 10 });
      await user.click(screen.getByRole("button", { name: LABELS.increase }));
      expect(onChange).toHaveBeenLastCalledWith("2");
    });

    it("falls back to `min` when the text is not a number at all", async () => {
      const user = userEvent.setup();
      const { onChange } = setup({ value: ".", min: 2, max: 10 });
      await user.click(screen.getByRole("button", { name: LABELS.increase }));
      expect(onChange).toHaveBeenLastCalledWith("3");
    });

    it("is inert while disabled", async () => {
      const user = userEvent.setup();
      const { onChange } = setup({ disabled: true });
      await user.click(screen.getByRole("button", { name: LABELS.increase }));
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("typing", () => {
    /* 🔴 เหตุผลที่ค่าเป็น string: ถ้าแปลงเป็นตัวเลขทุกครั้งที่พิมพ์ จุดทศนิยมจะหายทันทีที่กด */
    it("passes what was typed straight through, mid-edit values included", async () => {
      const user = userEvent.setup();
      const { onChange } = setup({ value: "2" });
      await user.type(screen.getByLabelText("Beds"), ".");
      expect(onChange).toHaveBeenLastCalledWith("2.");
    });

    it("does not clamp while typing — only the buttons produce numbers", async () => {
      const user = userEvent.setup();
      const { onChange } = setup({ value: "9", max: 10 });
      await user.type(screen.getByLabelText("Beds"), "9");
      expect(onChange).toHaveBeenLastCalledWith("99");
    });
  });

  describe("a11y", () => {
    it("names both buttons from `labels` so they are not unnamed icon buttons", () => {
      setup();
      expect(screen.getByRole("button", { name: LABELS.decrease })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: LABELS.increase })).toBeInTheDocument();
    });
  });
});
