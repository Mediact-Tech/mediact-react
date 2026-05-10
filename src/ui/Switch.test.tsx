import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Switch } from "./Switch";
import * as React from "react";

describe("Switch", () => {
  it("renders label and toggles on click", async () => {
    const user = userEvent.setup();
    function Wrap() {
      const [c, setC] = React.useState(false);
      return (
        <Switch
          label="Notifications"
          checked={c}
          onCheckedChange={setC}
        />
      );
    }
    render(<Wrap />);
    const sw = screen.getByRole("switch", { name: "Notifications" });
    expect(sw).toHaveAttribute("aria-checked", "false");
    await user.click(sw);
    expect(sw).toHaveAttribute("aria-checked", "true");
  });

  it("shows description text", () => {
    render(<Switch label="Auto-save" description="Every 30 seconds." />);
    expect(screen.getByText("Every 30 seconds.")).toBeInTheDocument();
  });

  it("renders error and aria-invalid", () => {
    render(<Switch label="On" error="must be on" />);
    expect(screen.getByRole("alert")).toHaveTextContent("must be on");
    expect(screen.getByRole("switch", { name: "On" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Switch label="Off" disabled onCheckedChange={onCheckedChange} />,
    );
    await user.click(screen.getByRole("switch", { name: "Off" }));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
