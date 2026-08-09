import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { CheckboxGroup } from "./CheckboxGroup";

const options = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
  { value: "c", label: "Option C", disabled: true },
];

describe("CheckboxGroup", () => {
  it("renders all options", () => {
    render(<CheckboxGroup label="Pick" options={options} />);
    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
    expect(screen.getByText("Option C")).toBeInTheDocument();
  });

  it("toggles an option on click and fires onValueChange with the next array", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CheckboxGroup
        label="Pick"
        options={options}
        defaultValue={["a"]}
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByLabelText("Option B"));
    expect(onValueChange).toHaveBeenCalledWith(["a", "b"]);
  });

  it("unchecking removes the value from the array", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CheckboxGroup
        label="Pick"
        options={options}
        defaultValue={["a", "b"]}
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByLabelText("Option A"));
    expect(onValueChange).toHaveBeenCalledWith(["b"]);
  });

  it("respects defaultValue (uncontrolled)", () => {
    render(
      <CheckboxGroup label="Pick" options={options} defaultValue={["a"]} />,
    );
    expect(screen.getByLabelText("Option A")).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByLabelText("Option B")).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("supports controlled value — parent owns state", async () => {
    const user = userEvent.setup();
    function Wrap() {
      const [value, setValue] = React.useState<string[]>([]);
      return (
        <CheckboxGroup
          label="Pick"
          options={options}
          value={value}
          onValueChange={setValue}
        />
      );
    }
    render(<Wrap />);
    const a = screen.getByLabelText("Option A");
    expect(a).toHaveAttribute("aria-checked", "false");
    await user.click(a);
    expect(a).toHaveAttribute("aria-checked", "true");
  });

  it("does not toggle disabled option on click", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CheckboxGroup
        label="Pick"
        options={options}
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByLabelText("Option C"));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("renders error + sets aria-invalid on group", () => {
    render(<CheckboxGroup label="Pick" options={options} error="Pick one" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Pick one");
    expect(screen.getByRole("group")).toHaveAttribute("aria-invalid", "true");
  });
});
