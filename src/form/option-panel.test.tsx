import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComboBox } from "./ComboBox";
import { EntityAutocomplete } from "./EntityAutocomplete";

/* แผงต้องไม่สูงเกินพื้นที่ที่เหลือบนจอ — ดูเหตุผลเต็มที่ `option-panel.ts`
 * happy-dom ไม่ทำ layout ⇒ ล็อกได้แค่ว่าทั้งสามทางใช้คลาสชุดเดียวกัน · ค่าจริงวัดในเบราว์เซอร์ */
const options = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
];

const panelOf = () => {
  const list = screen.getByRole("listbox");
  return { list, panel: list.closest("[data-state]") as HTMLElement };
};

describe("แผงตัวเลือกจำกัดความสูงตามพื้นที่ที่เหลือ", () => {
  it("ComboBox multiple", async () => {
    const user = userEvent.setup();
    render(<ComboBox multiple label="X" options={options} />);
    await user.click(screen.getByLabelText("X"));
    await waitFor(() => expect(screen.getByRole("listbox")).toBeInTheDocument());
    const { list, panel } = panelOf();
    expect(panel.className).toContain("max-h-[var(--radix-popover-content-available-height)]");
    expect(list.className).toContain("min-h-0");
  });

  it("ComboBox typeahead — ลิสต์อยู่ในแผงตรง ๆ ไม่มี Command คั่น", async () => {
    const user = userEvent.setup();
    render(<ComboBox typeahead label="X" options={options} />);
    await user.click(screen.getByRole("combobox"));
    await waitFor(() => expect(screen.getByRole("listbox")).toBeInTheDocument());
    const { list, panel } = panelOf();
    expect(panel.className).toContain("max-h-[var(--radix-popover-content-available-height)]");
    expect(list.className).toContain("min-h-0");
  });

  it("EntityAutocomplete", async () => {
    const user = userEvent.setup();
    render(
      <EntityAutocomplete<{ id: string; name: string }>
        multiple
        label="X"
        options={[{ id: "1", name: "Alpha" }]}
        onSearch={() => {}}
        getOptionValue={(o) => o.id}
        getOptionLabel={(o) => o.name}
      />,
    );
    await user.click(screen.getByLabelText("X"));
    await waitFor(() => expect(screen.getByRole("listbox")).toBeInTheDocument());
    const { list, panel } = panelOf();
    /* เทียบกับค่าตายตัว ⛔ ไม่ใช่กับ `OPTION_PANEL_CLASS` — เทียบกับค่าคงที่ตัวเดียวกับที่ถูกแก้
     * = ลบคลาสออกจากค่าคงที่แล้วเทสต์ยังผ่าน (พิสูจน์แล้วด้วย mutation) */
    expect(panel.className).toContain("max-h-[var(--radix-popover-content-available-height)]");
    expect(list.className).toContain("min-h-0");
  });
});
