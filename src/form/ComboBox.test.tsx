import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComboBox } from "./ComboBox";

const countries = [
  { value: "th", label: "Thailand" },
  { value: "sg", label: "Singapore" },
  { value: "my", label: "Malaysia" },
  { value: "id", label: "Indonesia", disabled: true },
];

describe("ComboBox", () => {
  it("renders trigger with placeholder when empty", () => {
    render(
      <ComboBox label="Country" options={countries} placeholder="Pick" />,
    );
    expect(screen.getByText("Pick")).toBeInTheDocument();
  });

  it("opens popover with search input + options on click", async () => {
    const user = userEvent.setup();
    render(<ComboBox label="Country" options={countries} />);
    await user.click(screen.getByLabelText("Country"));
    expect(
      await screen.findByPlaceholderText("Search..."),
    ).toBeInTheDocument();
    expect(screen.getByText("Thailand")).toBeInTheDocument();
    expect(screen.getByText("Singapore")).toBeInTheDocument();
  });

  it("filters options as user types in search", async () => {
    const user = userEvent.setup();
    render(<ComboBox label="Country" options={countries} />);
    await user.click(screen.getByLabelText("Country"));
    const search = await screen.findByPlaceholderText("Search...");
    await user.type(search, "sing");
    expect(screen.getByText("Singapore")).toBeInTheDocument();
    expect(screen.queryByText("Thailand")).toBeNull();
  });

  it("selects an option and closes popover, fires onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ComboBox
        label="Country"
        options={countries}
        onChange={onChange}
      />,
    );
    await user.click(screen.getByLabelText("Country"));
    await user.click(await screen.findByText("Malaysia"));
    expect(onChange).toHaveBeenCalledWith("my");
    expect(screen.queryByPlaceholderText("Search...")).toBeNull();
  });

  it("respects defaultValue", () => {
    render(
      <ComboBox label="Country" options={countries} defaultValue="th" />,
    );
    expect(screen.getByLabelText("Country")).toHaveTextContent("Thailand");
  });

  it("toggles selection off when picking the same value again", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ComboBox
        label="Country"
        options={countries}
        defaultValue="th"
        onChange={onChange}
      />,
    );
    await user.click(screen.getByLabelText("Country"));
    // popover items have role=option (cmdk); pick Thailand inside the listbox
    const items = await screen.findAllByRole("option");
    const thailandOption = items.find((el) =>
      el.textContent?.includes("Thailand"),
    );
    await user.click(thailandOption!);
    /* ⚠️ `null` ไม่ใช่ `undefined` — จงใจเปลี่ยนตอนรวบ MultiAutocomplete เข้ามา
     * (2026-08-08) ให้ตรงกับ `EntityAutocomplete` ที่คืน `null` มาตั้งแต่แรก
     * เดิมสอง component พี่น้องคืนคนละชนิด ⇒ สลับตัวเมื่อไหร่ `v === null` พังเงียบ */
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it("shows empty text when no options match query", async () => {
    const user = userEvent.setup();
    render(<ComboBox label="Country" options={countries} emptyText="None" />);
    await user.click(screen.getByLabelText("Country"));
    const search = await screen.findByPlaceholderText("Search...");
    await user.type(search, "xyz");
    expect(screen.getByText("None")).toBeInTheDocument();
  });

  it("calls onSearch instead of filtering when provided (async mode)", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(
      <ComboBox
        label="Country"
        options={countries}
        onSearch={onSearch}
      />,
    );
    await user.click(screen.getByLabelText("Country"));
    const search = await screen.findByPlaceholderText("Search...");
    await user.type(search, "th");
    expect(onSearch).toHaveBeenCalled();
    // even with query "th", all options remain (caller controls filtering)
    expect(screen.getByText("Thailand")).toBeInTheDocument();
    expect(screen.getByText("Singapore")).toBeInTheDocument();
  });

  it("renders error and aria-invalid", () => {
    render(
      <ComboBox label="Country" options={countries} error="required" />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("required");
    expect(screen.getByLabelText("Country")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("does not open when disabled", async () => {
    const user = userEvent.setup();
    render(<ComboBox label="Country" options={countries} disabled />);
    await user.click(screen.getByLabelText("Country"));
    expect(screen.queryByPlaceholderText("Search...")).toBeNull();
  });

});

/**
 * โหมด `typeahead` — พิมพ์ค้นในตัวช่องเอง
 *
 * เพิ่ม 2026-08-14 เพราะจอตั้งขอบเขตของ Mediwork ทั้ง 3 จอทำแบบนี้มาตลอด (MUI
 * `Autocomplete`) ขณะที่ **ไม่มี field ตัวไหนใน DS ทำได้เลย** — ทั้ง `ComboBox` และ
 * `EntityAutocomplete` วางช่องค้นหาไว้ในแผงที่เปิดออกมา
 *
 * ข้อที่สำคัญที่สุดคือข้อสุดท้าย: **ผู้เรียกที่ไม่ส่ง prop นี้ต้องไม่เปลี่ยนอะไรเลย**
 */
describe("ComboBox typeahead", () => {
  it("trigger เป็น input จริง ไม่ใช่ปุ่ม", () => {
    render(<ComboBox label="Country" options={countries} typeahead placeholder="Pick" />);

    expect(screen.getByRole("combobox").tagName).toBe("INPUT");
  });

  it("พิมพ์ในช่องแล้วกรองรายการ", async () => {
    const user = userEvent.setup();
    render(<ComboBox label="Country" options={countries} typeahead />);

    await user.click(screen.getByRole("combobox"));
    await user.keyboard("Thai");

    expect(screen.getByText("Thailand")).toBeInTheDocument();
    expect(screen.queryByText("Singapore")).toBeNull();
  });

  it("ปิดแล้วช่องกลับไปโชว์ป้ายของตัวที่เลือก ไม่ค้างคำที่พิมพ์", async () => {
    const user = userEvent.setup();
    render(<ComboBox label="Country" options={countries} typeahead />);

    await user.click(screen.getByRole("combobox"));
    await user.keyboard("Sing");
    await user.click(screen.getByText("Singapore"));

    expect((screen.getByRole("combobox") as HTMLInputElement).value).toBe("Singapore");
  });

  /* 🔴 ด่านสำคัญที่สุดของงานนี้ — เพิ่มโหมดใหม่ต้องไม่แตะพฤติกรรมเดิม
   * ผู้เรียกจริงทั้ง 4 แอปมี 2 จุด และไม่มีจุดไหนส่ง `typeahead` มา */
  it("ไม่ส่ง prop = ยังเป็นปุ่มเหมือนเดิม", () => {
    render(<ComboBox label="Country" options={countries} placeholder="Pick" />);

    expect(screen.getByRole("button").tagName).toBe("BUTTON");
    expect(screen.queryByRole("combobox")).toBeNull();
  });
});
