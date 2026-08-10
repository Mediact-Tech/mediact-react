import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "./Select";

const options = [
  { value: "th", label: "Thailand" },
  { value: "sg", label: "Singapore" },
  { value: "my", label: "Malaysia" },
  { value: "id", label: "Indonesia", disabled: true },
];

describe("Select", () => {
  it("renders trigger with placeholder", () => {
    render(
      <Select label="Country" placeholder="Pick one" options={options} />,
    );
    expect(screen.getByText("Pick one")).toBeInTheDocument();
  });

  /* ค่าที่เลือกมาจากข้อมูลจริงจึงยาวเกินช่องได้เสมอ · `<button>` ไม่ตัดเนื้อหาให้เอง
   * ถ้าคลาสนี้หลุด ข้อความจะล้นทะลุกรอบไปทับหัวลูกศร โดยไม่มีเทสไหนพังให้เห็น
   * (happy-dom ไม่คำนวณเลย์เอาต์ ⇒ ล็อกที่คลาส · ความจริงเชิงพิกเซลวัดในเบราว์เซอร์แล้ว) */
  it("ตัดค่าที่ยาวเกินช่องด้วย … ไม่ปล่อยให้ล้นกรอบ", () => {
    render(
      <Select
        label="Country"
        options={[{ value: "x", label: "ก".repeat(120) }]}
        value="x"
      />,
    );
    /* Radix ห่อข้อความไว้ในสแปนชั้นในอีกที — คลาสที่ตัดข้อความอยู่ที่**กล่องนอก**
       ซึ่งเป็นตัวที่ต้องมี overflow (สแปนชั้นในเป็น inline จึงถูกตัดตามไปเอง) */
    const valueEl = screen.getByText("ก".repeat(120)).closest("[class]")!;
    expect(valueEl.className).toContain("truncate");
    /* `min-w-0` สำคัญพอ ๆ กับ `truncate` — ขาดไปแล้ว flex item จะไม่ยอมหด */
    expect(valueEl.className).toContain("min-w-0");
  });

  it("opens listbox on trigger click and lists options", async () => {
    const user = userEvent.setup();
    render(<Select label="Country" options={options} />);
    await user.click(screen.getByLabelText("Country"));
    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });
    expect(screen.getByRole("option", { name: "Thailand" })).toBeInTheDocument();
  });

  it("selects an option and fires onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Select label="Country" options={options} onChange={onChange} />,
    );
    await user.click(screen.getByLabelText("Country"));
    await user.click(await screen.findByRole("option", { name: "Singapore" }));
    expect(onChange).toHaveBeenCalledWith("sg");
  });

  it("respects defaultValue", () => {
    render(
      <Select label="Country" options={options} defaultValue="my" />,
    );
    expect(screen.getByLabelText("Country")).toHaveTextContent("Malaysia");
  });

  it("does not select a disabled option", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Select label="Country" options={options} onChange={onChange} />,
    );
    await user.click(screen.getByLabelText("Country"));
    const opt = await screen.findByRole("option", { name: "Indonesia" });
    await user.click(opt);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("renders error + role=alert + aria-invalid", () => {
    render(<Select label="Country" options={options} error="required" />);
    expect(screen.getByRole("alert")).toHaveTextContent("required");
    expect(screen.getByLabelText("Country")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("does not open when disabled", async () => {
    const user = userEvent.setup();
    render(<Select label="Country" options={options} disabled />);
    await user.click(screen.getByLabelText("Country"));
    expect(screen.queryByRole("listbox")).toBeNull();
  });
});
