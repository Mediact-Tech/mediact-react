import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RadioGroup, RadioControl, RadioGroupRoot } from "./RadioGroup";

const options = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
  { value: "c", label: "Option C", disabled: true },
];

describe("RadioGroup", () => {
  it("renders all options", () => {
    render(<RadioGroup label="Pick" options={options} />);
    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
    expect(screen.getByText("Option C")).toBeInTheDocument();
  });

  it("selects an option on click and fires onValueChange", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup
        label="Pick"
        options={options}
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByLabelText("Option B"));
    expect(onValueChange).toHaveBeenCalledWith("b");
  });

  it("respects defaultValue", () => {
    render(<RadioGroup label="Pick" options={options} defaultValue="a" />);
    expect(screen.getByLabelText("Option A")).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("does not select disabled option on click", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup
        label="Pick"
        options={options}
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByLabelText("Option C"));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("renders error + sets aria-invalid on group", () => {
    render(
      <RadioGroup label="Pick" options={options} error="Pick one" />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Pick one");
  });
});

/* `RadioControl` / `RadioGroupRoot` — ตัวควบคุมเปล่าสำหรับจอที่จัดเลย์เอาต์เอง
 *
 * 🔴 มีเพราะที่ผ่านมา DS ไม่มีให้ แอปเลย import `@radix-ui/react-radio-group` เองแล้ว
 * เขียนวงกลม/จุดกลางขึ้นใหม่ จนเพี้ยนจากของ DS (Medimatch 2026-09-11) */
describe("RadioControl — ตัวควบคุมที่ไม่มีป้ายกำกับ", () => {
  it("เป็น radio จริง ไม่ห่อ <label> มาให้", () => {
    const { container } = render(
      <RadioGroupRoot aria-label="rg">
        <RadioControl value="a" aria-label="ตัวเลือก ก" />
      </RadioGroupRoot>,
    );
    expect(screen.getByRole("radio", { name: "ตัวเลือก ก" })).toBeInTheDocument();
    /* ถ้าห่อ <label> มาให้ จอที่วางป้ายเองจะได้ label ซ้อนสองชั้น */
    expect(container.querySelector("label")).toBeNull();
  });

  /**
   * 🔴 กับดักที่ทำให้ component นี้เกิด: สองตัวที่แชร์ทรงกันจะ drift ถ้าต่างคนต่างเขียน
   * `RadioGroupItem` ต้อง **ประกอบจาก** `RadioControl` ไม่ใช่เขียนวงกลมของตัวเอง
   * ⇒ คลาสของวงกลมต้องออกมาเหมือนกันเป๊ะทั้งสองทาง
   * (ตรวจด้วยการแก้ `RadioGroupItem` ให้เขียนวงกลมเองแล้วดูว่าเทสนี้แดง)
   */
  it.each(["sm", "md"] as const)(
    "วงกลมของ RadioGroupItem กับ RadioControl เป็นคลาสชุดเดียวกัน (size=%s)",
    (size) => {
      const { unmount } = render(
        <RadioGroup aria-label="g1" size={size} options={[{ value: "a", label: "A" }]} />,
      );
      const viaItem = screen.getByRole("radio").className;
      unmount();

      render(
        <RadioGroupRoot aria-label="g2">
          <RadioControl value="a" size={size} aria-label="A" />
        </RadioGroupRoot>,
      );
      expect(screen.getByRole("radio").className).toBe(viaItem);
    },
  );

  it("รับขนาดจากกลุ่มได้โดยไม่ต้องส่งซ้ำ", () => {
    render(
      <RadioGroup aria-label="g" size="sm">
        <RadioControl value="a" aria-label="A" />
      </RadioGroup>,
    );
    const cls = screen.getByRole("radio").className;
    expect(cls).toContain("size-4");
  });

  it("เลือกได้จริงผ่านรากเปล่า", async () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroupRoot aria-label="rg" onValueChange={onValueChange}>
        <RadioControl value="a" aria-label="A" />
        <RadioControl value="b" aria-label="B" />
      </RadioGroupRoot>,
    );
    await userEvent.click(screen.getByRole("radio", { name: "B" }));
    expect(onValueChange).toHaveBeenCalledWith("b");
  });

  it("disabled แล้วกดไม่ติด", async () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroupRoot aria-label="rg" onValueChange={onValueChange}>
        <RadioControl value="a" aria-label="A" disabled />
      </RadioGroupRoot>,
    );
    await userEvent.click(screen.getByRole("radio", { name: "A" }));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
