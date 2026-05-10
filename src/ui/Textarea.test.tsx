import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("renders label and associates it", () => {
    render(<Textarea label="Notes" />);
    expect(screen.getByLabelText("Notes")).toBeInstanceOf(
      HTMLTextAreaElement,
    );
  });

  it("shows hint when provided, no error", () => {
    render(<Textarea label="Notes" hint="up to 500 chars" />);
    expect(screen.getByText("up to 500 chars")).toBeInTheDocument();
  });

  it("shows error message + role=alert + aria-invalid", () => {
    render(<Textarea label="Notes" error="required" />);
    expect(screen.getByRole("alert")).toHaveTextContent("required");
    expect(screen.getByLabelText("Notes")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("respects defaultValue", () => {
    render(<Textarea label="Notes" defaultValue="hello" />);
    expect((screen.getByLabelText("Notes") as HTMLTextAreaElement).value).toBe(
      "hello",
    );
  });

  it("calls onChange when typing", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea label="Notes" onChange={onChange} />);
    await user.type(screen.getByLabelText("Notes"), "x");
    expect(onChange).toHaveBeenCalled();
  });

  describe("character count", () => {
    it("shows count / maxLength when showCount is set", () => {
      render(
        <Textarea
          label="Notes"
          defaultValue="abc"
          showCount
          maxLength={10}
        />,
      );
      expect(screen.getByText("3 / 10")).toBeInTheDocument();
    });

    it("does not show counter without showCount", () => {
      render(<Textarea label="Notes" defaultValue="abc" maxLength={10} />);
      expect(screen.queryByText(/\/\s*10/)).toBeNull();
    });

    it("updates count as user types (controlled)", async () => {
      const user = userEvent.setup();
      function Wrap() {
        const [v, setV] = useStateLocal("");
        return (
          <Textarea
            label="Notes"
            value={v}
            onChange={(e) => setV(e.target.value)}
            showCount
            maxLength={10}
          />
        );
      }
      render(<Wrap />);
      await user.type(screen.getByLabelText("Notes"), "hi");
      expect(screen.getByText("2 / 10")).toBeInTheDocument();
    });
  });

  describe("floating label (multiline placement)", () => {
    it("rest label sits near top (top-3) when empty", () => {
      render(<Textarea label="Notes" />);
      const labelEl = screen.getByText("Notes");
      expect(labelEl.className).toMatch(/top-3/);
    });

    it("floats when value present", () => {
      render(<Textarea label="Notes" defaultValue="x" />);
      const labelEl = screen.getByText("Notes");
      expect(labelEl.className).toMatch(/-top-1\.5/);
    });
  });

  it("propagates disabled", () => {
    render(<Textarea label="Notes" disabled />);
    expect(screen.getByLabelText("Notes")).toBeDisabled();
  });
});

import * as React from "react";
function useStateLocal<T>(initial: T) {
  return React.useState(initial);
}
