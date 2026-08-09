import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComboBox, type ComboBoxOption } from "./ComboBox";

/* เทสของสิ่งที่ได้มาตอนรวบ `MultiAutocomplete` เข้า `ComboBox` (2026-08-08)
 * พฤติกรรมพื้นฐานของโหมดเลือกอันเดียวอยู่ใน `ComboBox.test.tsx`
 * ส่วนโหมดหลายอันเดิมอยู่ใน `ComboBoxMulti.test.tsx` */

const stack = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
];

const kind: Record<string, string> = {
  react: "Library",
  vue: "Framework",
  svelte: "Compiler",
};

const openList = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByLabelText("Stack"));
  await waitFor(() => expect(screen.getByRole("listbox")).toBeInTheDocument());
};

describe("ComboBox — สิ่งที่ได้จากการรวบ", () => {
  describe("โหมดสองแบบใน component เดียว", () => {
    it("ไม่ใส่ multiple = ปุ่มที่โชว์ป้ายของตัวที่เลือก", () => {
      render(<ComboBox label="Stack" options={stack} defaultValue="vue" />);
      expect(screen.getByLabelText("Stack").tagName).toBe("BUTTON");
      expect(screen.getByLabelText("Stack")).toHaveTextContent("Vue");
    });

    it("ใส่ multiple = กล่อง chip", () => {
      render(
        <ComboBox multiple label="Stack" options={stack} defaultValue={["vue"]} />,
      );
      const trigger = screen.getByLabelText("Stack");
      expect(trigger.tagName).toBe("DIV");
      expect(within(trigger).getByText("Vue")).toBeInTheDocument();
    });

    /* 🔴 `<div role=combobox>` ผูกกับ `<label htmlFor>` ไม่ได้ตามสเปก HTML
     * ⇒ ต้อง aria-labelledby ไม่งั้นโปรแกรมอ่านหน้าจอไม่รู้ว่าช่องนี้คืออะไร
     * (เจอตอนเขียนเทสของ EntityAutocomplete) */
    it("trigger แบบ div ยังถูก label ถึงด้วย aria-labelledby", () => {
      render(<ComboBox multiple label="Stack" options={stack} />);
      expect(screen.getByLabelText("Stack")).toHaveAttribute(
        "aria-labelledby",
      );
    });

    it("โหมดอันเดียวคืน null ตอนล้างค่า ไม่ใช่ undefined", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <ComboBox
          label="Stack"
          options={stack}
          defaultValue="vue"
          onChange={onChange}
        />,
      );
      await openList(user);
      await user.click(screen.getByRole("option", { name: "Vue" }));
      expect(onChange).toHaveBeenCalledWith(null);
    });

    it("โหมดหลายอันคืนอาร์เรย์", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <ComboBox multiple label="Stack" options={stack} onChange={onChange} />,
      );
      await openList(user);
      await user.click(screen.getByRole("option", { name: "React" }));
      expect(onChange).toHaveBeenLastCalledWith(["react"]);
    });
  });

  describe("จัดกลุ่ม", () => {
    const headings = () =>
      Array.from(document.querySelectorAll("[cmdk-group-heading]")).map(
        (n) => n.textContent,
      );

    it("groupBy เรียงหัวข้อตามลำดับที่เจอ ไม่ใช่ตามตัวอักษร", async () => {
      const user = userEvent.setup();
      render(
        <ComboBox
          multiple
          label="Stack"
          options={stack}
          groupBy={(o) => kind[o.value]}
        />,
      );
      await openList(user);
      expect(headings()).toEqual(["Library", "Framework", "Compiler"]);
    });

    it("groupOrder จัดลำดับได้ และกลุ่มนอกลิสต์ต่อท้าย ไม่หาย", async () => {
      const user = userEvent.setup();
      render(
        <ComboBox
          multiple
          label="Stack"
          options={stack}
          groupBy={(o) => kind[o.value]}
          groupOrder={["Compiler"]}
        />,
      );
      await openList(user);
      expect(headings()).toEqual(["Compiler", "Library", "Framework"]);
      expect(screen.getAllByRole("option")).toHaveLength(3);
    });

    it("groups ที่ส่งมาตรง ๆ ชนะ groupBy", async () => {
      const user = userEvent.setup();
      render(
        <ComboBox
          multiple
          label="Stack"
          groups={[{ heading: "ทั้งหมด", options: stack }]}
          groupBy={(o) => kind[o.value]}
        />,
      );
      await openList(user);
      expect(headings()).toEqual(["ทั้งหมด"]);
    });

    it("ตัวที่ groupBy คืน null ไม่มีหัวข้อและอยู่บนสุด", async () => {
      const user = userEvent.setup();
      render(
        <ComboBox
          multiple
          label="Stack"
          options={stack}
          groupBy={(o) => (o.value === "react" ? null : kind[o.value])}
        />,
      );
      await openList(user);
      expect(headings()).toEqual(["Framework", "Compiler"]);
      expect(screen.getAllByRole("option")[0]!).toHaveTextContent("React");
    });
  });

  /* ล็อกต้องปิดทางถอดออกครบ 3 ทาง — ปิดไม่ครบเท่ากับไม่ได้ปิด */
  describe("ค่าที่ล็อกไว้", () => {
    const locked: ComboBoxOption[] = [
      { value: "react", label: "React", locked: true },
      { value: "vue", label: "Vue" },
    ];
    const props = {
      multiple: true as const,
      label: "Stack",
      options: locked,
      defaultValue: ["react", "vue"],
    };

    it("ทาง 1 — chip ที่ล็อกไม่มีปุ่มลบ ส่วนตัวปกติมี", () => {
      render(<ComboBox {...props} />);
      const trigger = screen.getByLabelText("Stack");
      const lockedChip = within(trigger).getByText("React").closest("span")!;
      const freeChip = within(trigger).getByText("Vue").closest("span")!;
      expect(lockedChip.parentElement?.querySelector("button")).toBeNull();
      expect(freeChip.parentElement?.querySelector("button")).not.toBeNull();
    });

    it("ทาง 2 — กดแถวที่ล็อกในลิสต์แล้วค่าไม่เปลี่ยน", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<ComboBox {...props} onChange={onChange} />);
      await openList(user);
      await user.click(screen.getByRole("option", { name: /React/ }));
      expect(onChange).not.toHaveBeenCalled();
    });

    it("ทาง 3 — ปุ่มล้างทั้งหมดเก็บตัวที่ล็อกไว้", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<ComboBox {...props} onChange={onChange} />);
      await openList(user);
      await user.click(screen.getByRole("button", { name: /clear/i }));
      expect(onChange).toHaveBeenCalledWith(["react"]);
    });

    it("ไม่มีผลในโหมดเลือกอันเดียว — ไม่งั้นช่องจะแก้ไม่ได้เลย", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <ComboBox
          label="Stack"
          options={locked}
          defaultValue="react"
          onChange={onChange}
        />,
      );
      await openList(user);
      await user.click(screen.getByRole("option", { name: "Vue" }));
      expect(onChange).toHaveBeenCalledWith("vue");
    });
  });

  describe("วาดแถวเอง", () => {
    it("renderOption ได้สถานะ selected/locked/disabled ครบ", async () => {
      const user = userEvent.setup();
      const seen: Array<Record<string, boolean>> = [];
      render(
        <ComboBox
          multiple
          label="Stack"
          defaultValue={["react"]}
          options={
            [
              { value: "react", label: "React", locked: true },
              { value: "vue", label: "Vue" },
              { value: "svelte", label: "Svelte", disabled: true },
            ] as ComboBoxOption[]
          }
          renderOption={(opt, state) => {
            seen.push({ ...state });
            return <span>{opt.label}</span>;
          }}
        />,
      );
      await openList(user);
      expect(seen[0]!).toEqual({ selected: true, locked: true, disabled: false });
      expect(seen[1]!).toEqual({
        selected: false,
        locked: false,
        disabled: false,
      });
      expect(seen[2]!).toEqual({ selected: false, locked: false, disabled: true });
    });

    it("renderChip ได้รู้ว่าตัวไหนล็อก", () => {
      const seen: boolean[] = [];
      render(
        <ComboBox
          multiple
          label="Stack"
          defaultValue={["react", "vue"]}
          options={
            [
              { value: "react", label: "React", locked: true },
              { value: "vue", label: "Vue" },
            ] as ComboBoxOption[]
          }
          renderChip={(opt, state) => {
            seen.push(state.locked);
            return <span>{opt.label}</span>;
          }}
        />,
      );
      expect(seen).toEqual([true, false]);
    });
  });

  describe("โครงร่างตอนโหลด", () => {
    it("isLoading แทนทั้งช่อง ทั้งสองโหมด", () => {
      const single = render(
        <ComboBox label="Stack" options={stack} isLoading />,
      );
      expect(screen.getByRole("status")).toBeInTheDocument();
      single.unmount();

      render(<ComboBox multiple label="Stack" options={stack} isLoading />);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    /* ⚠️ คนละเรื่องกับ isLoading — ตัวนี้ช่องยังอยู่ */
    it("optionsLoading โชว์แถวกำลังโหลดในลิสต์ ช่องยังอยู่", async () => {
      const user = userEvent.setup();
      render(<ComboBox label="Stack" options={[]} optionsLoading />);
      await user.click(screen.getByLabelText("Stack"));
      expect(await screen.findByText("Loading...")).toBeInTheDocument();
      expect(screen.getByLabelText("Stack")).toBeInTheDocument();
    });
  });
});
