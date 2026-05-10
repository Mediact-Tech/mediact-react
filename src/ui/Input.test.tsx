import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./Input";

describe("Input", () => {
  describe("label", () => {
    it("renders label text", () => {
      render(<Input label="Email" />);
      expect(screen.getByText("Email")).toBeInTheDocument();
    });

    it("associates label with input via htmlFor/id", () => {
      render(<Input label="Email" />);
      const input = screen.getByLabelText("Email");
      expect(input).toBeInstanceOf(HTMLInputElement);
    });

    it("respects an external id", () => {
      render(<Input id="my-email" label="Email" />);
      expect(screen.getByLabelText("Email")).toHaveAttribute("id", "my-email");
    });

    it("hides the label visually when hideLabel is set, keeps it for SR", () => {
      render(<Input label="Email" hideLabel />);
      // sr-only label still in DOM
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
    });

    it("shows required asterisk when required", () => {
      render(<Input label="Email" required />);
      expect(screen.getByText("*")).toBeInTheDocument();
    });
  });

  describe("hint / error", () => {
    it("shows hint text", () => {
      render(<Input label="Email" hint="We'll never share it" />);
      expect(screen.getByText("We'll never share it")).toBeInTheDocument();
    });

    it("shows error message and hides hint when both provided", () => {
      render(<Input label="Email" hint="hint text" error="error text" />);
      expect(screen.getByText("error text")).toBeInTheDocument();
      expect(screen.queryByText("hint text")).not.toBeInTheDocument();
    });

    it("sets aria-invalid when error present", () => {
      render(<Input label="Email" error="bad" />);
      expect(screen.getByLabelText("Email")).toHaveAttribute(
        "aria-invalid",
        "true",
      );
    });

    it("error has role=alert", () => {
      render(<Input label="Email" error="bad" />);
      expect(screen.getByRole("alert")).toHaveTextContent("bad");
    });
  });

  describe("typing (uncontrolled)", () => {
    it("updates value on user input", async () => {
      const user = userEvent.setup();
      render(<Input label="Email" />);
      const input = screen.getByLabelText("Email") as HTMLInputElement;
      await user.type(input, "hello");
      expect(input.value).toBe("hello");
    });

    it("respects defaultValue", () => {
      render(<Input label="Email" defaultValue="foo" />);
      const input = screen.getByLabelText("Email") as HTMLInputElement;
      expect(input.value).toBe("foo");
    });
  });

  describe("typing (controlled)", () => {
    it("calls onChange and reflects parent-controlled value", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const { rerender } = render(
        <Input label="Email" value="" onChange={onChange} />,
      );
      const input = screen.getByLabelText("Email") as HTMLInputElement;
      await user.type(input, "a");
      expect(onChange).toHaveBeenCalled();

      // simulate parent updating value
      rerender(<Input label="Email" value="abc" onChange={onChange} />);
      expect(input.value).toBe("abc");
    });
  });

  describe("clearable", () => {
    it("clears the value when clear (×) is clicked", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      function Wrapper() {
        const [v, setV] = useStateLocal("hello");
        return (
          <Input
            label="Search"
            clearable
            value={v}
            onChange={(e) => {
              setV(e.target.value);
              onChange(e.target.value);
            }}
          />
        );
      }
      render(<Wrapper />);
      const clearBtn = screen.getByRole("button", { name: "Clear" });
      await user.click(clearBtn);
      expect(onChange).toHaveBeenLastCalledWith("");
      expect((screen.getByLabelText("Search") as HTMLInputElement).value).toBe(
        "",
      );
    });

    it("does not render × when value is empty", () => {
      render(<Input label="Search" clearable value="" onChange={() => {}} />);
      expect(screen.queryByRole("button", { name: "Clear" })).toBeNull();
    });
  });

  describe("password type", () => {
    it("renders Show/Hide toggle and toggles input type", async () => {
      const user = userEvent.setup();
      render(<Input label="Password" type="password" />);
      const input = screen.getByLabelText("Password") as HTMLInputElement;
      expect(input.type).toBe("password");
      const toggle = screen.getByRole("button", { name: /show password/i });
      await user.click(toggle);
      expect(input.type).toBe("text");
      const hide = screen.getByRole("button", { name: /hide password/i });
      await user.click(hide);
      expect(input.type).toBe("password");
    });
  });

  describe("floating label", () => {
    it("starts un-floated when empty + no placeholder + not focused", () => {
      render(<Input label="Email" />);
      const labelEl = screen.getByText("Email");
      // when not floating, label sits at vertical center with text-tertiary
      expect(labelEl.className).toMatch(/text-text-tertiary/);
    });

    it("floats when there is a value", () => {
      render(<Input label="Email" defaultValue="foo" />);
      const labelEl = screen.getByText("Email");
      expect(labelEl.className).toMatch(/-top-1\.5/);
    });

    it("floats when placeholder provided (never sits over input)", () => {
      render(<Input label="Email" placeholder="you@example.com" />);
      const labelEl = screen.getByText("Email");
      expect(labelEl.className).toMatch(/-top-1\.5/);
    });

    it("alwaysFloatLabel forces floated state", () => {
      render(<Input label="DOB" alwaysFloatLabel />);
      const labelEl = screen.getByText("DOB");
      expect(labelEl.className).toMatch(/-top-1\.5/);
    });
  });

  describe("disabled", () => {
    it("propagates disabled to native input", () => {
      render(<Input label="Email" disabled />);
      expect(screen.getByLabelText("Email")).toBeDisabled();
    });
  });
});

// Tiny local useState wrapper to avoid imports — mirrors React.useState in tests.
import * as React from "react";
function useStateLocal<T>(initial: T) {
  return React.useState(initial);
}
