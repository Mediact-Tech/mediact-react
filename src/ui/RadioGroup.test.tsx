import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RadioGroup } from "./RadioGroup";

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
