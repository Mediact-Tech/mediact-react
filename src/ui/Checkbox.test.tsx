import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "./Checkbox";
import * as React from "react";

describe("Checkbox", () => {
  it("renders label and toggles on click", async () => {
    const user = userEvent.setup();
    function Wrap() {
      const [c, setC] = React.useState(false);
      return (
        <Checkbox
          label="Accept terms"
          checked={c}
          onCheckedChange={(v) => setC(v === true)}
        />
      );
    }
    render(<Wrap />);
    const cb = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(cb).toHaveAttribute("aria-checked", "false");
    await user.click(cb);
    expect(cb).toHaveAttribute("aria-checked", "true");
  });

  it("shows description text", () => {
    render(
      <Checkbox label="Subscribe" description="Twice a month, no spam." />,
    );
    expect(screen.getByText("Twice a month, no spam.")).toBeInTheDocument();
  });

  it("renders error message and sets aria-invalid", () => {
    render(<Checkbox label="Agree" error="You must agree" />);
    expect(screen.getByRole("alert")).toHaveTextContent("You must agree");
    expect(
      screen.getByRole("checkbox", { name: "Agree" }),
    ).toHaveAttribute("aria-invalid", "true");
  });

  it("supports indeterminate state", () => {
    render(<Checkbox label="All" checked="indeterminate" />);
    const cb = screen.getByRole("checkbox", { name: "All" });
    expect(cb).toHaveAttribute("aria-checked", "mixed");
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox
        label="Disabled"
        disabled
        onCheckedChange={onCheckedChange}
      />,
    );
    await user.click(screen.getByRole("checkbox", { name: "Disabled" }));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
