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
