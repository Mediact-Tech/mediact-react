import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComboBox } from "./ComboBox";

const skills = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
];

describe("ComboBox — โหมดเลือกหลายอัน", () => {
  it("renders trigger as combobox with placeholder", () => {
    render(
      <ComboBox
        multiple
        label="Skills"
        options={skills}
        placeholder="Pick"
      />,
    );
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("Pick")).toBeInTheDocument();
  });

  it("opens popover and selects/deselects items (multi)", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ComboBox
        multiple
        label="Skills"
        options={skills}
        onChange={onChange}
      />,
    );
    await user.click(screen.getByRole("combobox"));
    const items = await screen.findAllByRole("option");
    await user.click(items.find((el) => el.textContent === "React")!);
    expect(onChange).toHaveBeenLastCalledWith(["react"]);
    await user.click(items.find((el) => el.textContent === "Vue")!);
    expect(onChange).toHaveBeenLastCalledWith(["react", "vue"]);
    // toggle off React
    await user.click(items.find((el) => el.textContent === "React")!);
    expect(onChange).toHaveBeenLastCalledWith(["vue"]);
  });

  it("renders selected chips on the trigger", () => {
    render(
      <ComboBox
        multiple
        label="Skills"
        options={skills}
        defaultValue={["react", "vue"]}
      />,
    );
    const trigger = screen.getByRole("combobox");
    expect(within(trigger).getByText("React")).toBeInTheDocument();
    expect(within(trigger).getByText("Vue")).toBeInTheDocument();
  });

  it("collapses extra chips into +N when over maxVisibleChips", () => {
    render(
      <ComboBox
        multiple
        label="Skills"
        options={skills}
        defaultValue={["react", "vue", "angular", "svelte"]}
        maxVisibleChips={2}
      />,
    );
    const trigger = screen.getByRole("combobox");
    expect(within(trigger).getByText("React")).toBeInTheDocument();
    expect(within(trigger).getByText("Vue")).toBeInTheDocument();
    expect(within(trigger).getByText("+2")).toBeInTheDocument();
  });

  it("removes a chip via its × button", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ComboBox
        multiple
        label="Skills"
        options={skills}
        defaultValue={["react", "vue"]}
        onChange={onChange}
      />,
    );
    const removeButtons = screen.getAllByRole("button", { name: "Remove" });
    await user.click(removeButtons[0]!);
    expect(onChange).toHaveBeenLastCalledWith(["vue"]);
  });

  it("respects maxItems cap (cannot select beyond cap)", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ComboBox
        multiple
        label="Skills"
        options={skills}
        maxItems={2}
        onChange={onChange}
      />,
    );
    await user.click(screen.getByRole("combobox"));
    const items = await screen.findAllByRole("option");
    await user.click(items.find((el) => el.textContent === "React")!);
    await user.click(items.find((el) => el.textContent === "Vue")!);
    // 3rd should be disabled and not toggle
    onChange.mockClear();
    const angular = (
      await screen.findAllByRole("option")
    ).find((el) => el.textContent === "Angular")!;
    expect(angular).toHaveAttribute("aria-disabled", "true");
    await user.click(angular);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("Clear button empties selection", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ComboBox
        multiple
        label="Skills"
        options={skills}
        defaultValue={["react", "vue"]}
        onChange={onChange}
      />,
    );
    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByRole("button", { name: /clear/i }));
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it("renders error and aria-invalid", () => {
    render(
      <ComboBox
        multiple
        label="Skills"
        options={skills}
        error="required"
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("required");
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("does not open when disabled (aria-disabled)", async () => {
    const user = userEvent.setup();
    render(
      <ComboBox multiple label="Skills" options={skills} disabled />,
    );
    await user.click(screen.getByRole("combobox"));
    expect(screen.queryByRole("option")).toBeNull();
  });
});
