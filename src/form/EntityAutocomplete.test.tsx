import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EntityAutocomplete } from "./EntityAutocomplete";

type Person = { id: string; name: string; dept: string };

const alicia: Person = { id: "1", name: "Alicia", dept: "Cardiology" };
const ben: Person = { id: "2", name: "Ben", dept: "Radiology" };
const carmen: Person = { id: "3", name: "Carmen", dept: "Cardiology" };
const directory: Person[] = [alicia, ben, carmen];

const base = {
  label: "ทีม",
  options: directory,
  onSearch: () => {},
  getOptionValue: (p: Person) => p.id,
  getOptionLabel: (p: Person) => p.name,
} as const;

const open = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByLabelText("ทีม"));
  await waitFor(() => expect(screen.getByRole("listbox")).toBeInTheDocument());
};

describe("EntityAutocomplete", () => {
  describe("โหมดเลือกอันเดียว", () => {
    it("เลือกแล้วคืนตัว item ทั้งก้อน ไม่ใช่แค่ค่า", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<EntityAutocomplete<Person> {...base} onChange={onChange} />);
      await open(user);
      await user.click(screen.getByRole("option", { name: "Ben" }));
      expect(onChange).toHaveBeenCalledWith(ben);
    });

    /* ไม่มีค่า = `null` — ต้องตรงกับ `ComboBox` ที่ยกมาให้ตรงกันแล้ว */
    it("เลือกทับตัวเดิม = ล้างค่า และคืน null", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <EntityAutocomplete<Person>
          {...base}
          defaultValue={alicia}
          onChange={onChange}
        />,
      );
      await open(user);
      await user.click(screen.getByRole("option", { name: "Alicia" }));
      expect(onChange).toHaveBeenCalledWith(null);
    });

    it("ไม่มี chip ในโหมดนี้ — แสดงเป็นข้อความ", () => {
      render(<EntityAutocomplete<Person> {...base} defaultValue={alicia} />);
      expect(screen.getByLabelText("ทีม")).toHaveTextContent("Alicia");
    });
  });

  describe("โหมดเลือกหลายอัน", () => {
    it("เลือกสะสมได้และคืนเป็นอาร์เรย์", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <EntityAutocomplete<Person> {...base} multiple onChange={onChange} />,
      );
      await open(user);
      await user.click(screen.getByRole("option", { name: "Alicia" }));
      expect(onChange).toHaveBeenLastCalledWith([alicia]);
    });

    it("maxItems กันไม่ให้เลือกเกิน", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <EntityAutocomplete<Person>
          {...base}
          multiple
          maxItems={1}
          defaultValue={[alicia]}
          onChange={onChange}
        />,
      );
      await open(user);
      await user.click(screen.getByRole("option", { name: "Ben" }));
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  /* ล็อกต้องปิดทางถอดออกครบ 3 ทาง — ปิดไม่ครบเท่ากับไม่ได้ปิด */
  describe("ค่าที่ล็อกไว้", () => {
    const locked = {
      ...base,
      multiple: true as const,
      defaultValue: [alicia, ben],
      isOptionLocked: (p: Person) => p.id === "1",
    };

    it("ทาง 1 — chip ที่ล็อกไม่มีปุ่มลบ ส่วนตัวปกติมี", () => {
      render(<EntityAutocomplete<Person> {...locked} />);
      const trigger = screen.getByLabelText("ทีม");
      const lockedChip = within(trigger).getByText("Alicia").closest("span")!;
      const freeChip = within(trigger).getByText("Ben").closest("span")!;
      expect(lockedChip.parentElement?.querySelector("button")).toBeNull();
      expect(freeChip.parentElement?.querySelector("button")).not.toBeNull();
    });

    it("ทาง 2 — กดแถวที่ล็อกในลิสต์แล้วค่าไม่เปลี่ยน", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<EntityAutocomplete<Person> {...locked} onChange={onChange} />);
      await open(user);
      await user.click(screen.getByRole("option", { name: /Alicia/ }));
      expect(onChange).not.toHaveBeenCalled();
    });

    it("ทาง 3 — ปุ่มล้างทั้งหมดเก็บตัวที่ล็อกไว้", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<EntityAutocomplete<Person> {...locked} onChange={onChange} />);
      await open(user);
      await user.click(screen.getByRole("button", { name: /clear/i }));
      expect(onChange).toHaveBeenCalledWith([alicia]);
    });

    it("ไม่มีผลในโหมดเลือกอันเดียว — ไม่งั้นช่องจะแก้ไม่ได้เลย", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <EntityAutocomplete<Person>
          {...base}
          defaultValue={alicia}
          isOptionLocked={() => true}
          onChange={onChange}
        />,
      );
      await open(user);
      await user.click(screen.getByRole("option", { name: "Ben" }));
      expect(onChange).toHaveBeenCalledWith(ben);
    });
  });

  describe("จัดกลุ่ม", () => {
    it("groupBy สร้างหัวข้อตามลำดับที่เจอ", async () => {
      const user = userEvent.setup();
      render(<EntityAutocomplete<Person> {...base} groupBy={(p) => p.dept} />);
      await open(user);
      const headings = screen
        .getAllByRole("presentation", { hidden: true })
        .map((n) => n.textContent);
      expect(headings.join("|")).toContain("Cardiology");
      expect(headings.join("|")).toContain("Radiology");
    });

    it("ไม่ส่ง groupBy = ไม่มีหัวข้อเลย", async () => {
      const user = userEvent.setup();
      const { container } = render(<EntityAutocomplete<Person> {...base} />);
      await open(user);
      expect(container.ownerDocument.querySelectorAll("[cmdk-group-heading]"))
        .toHaveLength(0);
    });
  });

  describe("สถานะของลิสต์", () => {
    it("optionsLoading โชว์แถวกำลังโหลด ช่องยังอยู่", async () => {
      const user = userEvent.setup();
      render(
        <EntityAutocomplete<Person> {...base} options={[]} optionsLoading />,
      );
      await user.click(screen.getByLabelText("ทีม"));
      expect(await screen.findByText("Loading...")).toBeInTheDocument();
      expect(screen.getByLabelText("ทีม")).toBeInTheDocument();
    });

    it("searchError โชว์ข้อความแทนลิสต์", async () => {
      const user = userEvent.setup();
      render(
        <EntityAutocomplete<Person>
          {...base}
          options={[]}
          searchError="ค้นหาไม่สำเร็จ"
        />,
      );
      await user.click(screen.getByLabelText("ทีม"));
      expect(await screen.findByText("ค้นหาไม่สำเร็จ")).toBeInTheDocument();
    });

    /* ⚠️ ต่างจาก optionsLoading — ตัวนี้แทน **ทั้งช่อง** ด้วยโครงร่าง */
    it("isLoading แทนทั้งช่องด้วยโครงร่าง", () => {
      render(<EntityAutocomplete<Person> {...base} isLoading />);
      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.queryByLabelText("ทีม")).toBeNull();
    });
  });

  describe("วาดแถวเอง", () => {
    it("renderOption ได้สถานะ selected/locked/disabled ครบ", async () => {
      const user = userEvent.setup();
      const seen: Array<Record<string, boolean>> = [];
      render(
        <EntityAutocomplete<Person>
          {...base}
          multiple
          defaultValue={[alicia]}
          isOptionLocked={(p) => p.id === "1"}
          renderOption={(item, state) => {
            seen.push({ ...state });
            return <span>{item.name}</span>;
          }}
        />,
      );
      await open(user);
      expect(seen[0]!).toEqual({
        selected: true,
        locked: true,
        disabled: false,
      });
      expect(seen[1]!).toEqual({
        selected: false,
        locked: false,
        disabled: false,
      });
    });
  });
});

describe("EntityAutocomplete — renderOverflowChip", () => {
  it("ได้จำนวนและ item ทั้งก้อนที่ถูกยุบ", () => {
    let hiddenNames: string[] = [];
    render(
      <EntityAutocomplete<Person>
        {...base}
        multiple
        maxVisibleChips={1}
        defaultValue={[alicia, ben, carmen]}
        renderOverflowChip={(count, hidden) => {
          hiddenNames = hidden.map((p) => p.name);
          return <span>+{count} คน</span>;
        }}
      />,
    );
    expect(screen.getByText("+2 คน")).toBeInTheDocument();
    expect(hiddenNames).toEqual(["Ben", "Carmen"]);
  });
});


/* พิมพ์ค้นในช่อง (Figma D2 ของทีมผ่าตัด Mediwork): chip + ช่องพิมพ์อยู่ในกล่องเดียว แผงมีแต่รายการ */
describe("EntityAutocomplete — typeahead (multiple)", () => {
  const typeaheadBase = {
    ...base,
    multiple: true as const,
    typeahead: true,
    debounceMs: 0,
    placeholder: "ค้นหาชื่อ…",
  };
  const field = () => screen.getByRole("combobox", { name: /ทีม/ }) as HTMLInputElement;
  it("ช่องพิมพ์อยู่ในกล่องเดียวกับ chip และแผงไม่มีช่องค้นหาซ้ำ", async () => {
    const user = userEvent.setup();
    render(
      <EntityAutocomplete<Person> {...typeaheadBase} defaultValue={[alicia]} />,
    );
    const input = field();
    expect(input.tagName).toBe("INPUT");
    expect(input.parentElement).toHaveTextContent("Alicia");
    await user.click(input);
    await waitFor(() => expect(screen.getByRole("listbox")).toBeInTheDocument());
    expect(screen.getAllByRole("combobox")).toHaveLength(1);
  });

  it("พิมพ์แล้วเปิดแผงและส่งคำค้นให้ onSearch", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(
      <EntityAutocomplete<Person> {...typeaheadBase} onSearch={onSearch} />,
    );
    await user.type(field(), "be");
    await waitFor(() => expect(onSearch).toHaveBeenLastCalledWith("be"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("เลือกแล้วได้ chip เพิ่ม · ล้างคำที่พิมพ์ · แผงยังเปิดอยู่", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <EntityAutocomplete<Person> {...typeaheadBase} onChange={onChange} />,
    );
    await user.type(field(), "be");
    await user.click(await screen.findByRole("option", { name: "Ben" }));
    expect(onChange).toHaveBeenLastCalledWith([ben]);
    expect(field()).toHaveValue("");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    // คลิกแถวในแผงย้ายโฟกัสออก — ต้องกลับมาที่ช่อง ไม่งั้นพิมพ์คนต่อไปไม่ได้
    expect(field()).toHaveFocus();
  });

  it("กด Backspace ตอนช่องว่าง = ถอด chip สุดท้าย แต่ไม่ถอดตัวที่ล็อก", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <EntityAutocomplete<Person>
        {...typeaheadBase}
        defaultValue={[alicia, ben]}
        isOptionLocked={(p) => p.id === "1"}
        onChange={onChange}
      />,
    );
    await user.click(field());
    await user.keyboard("{Backspace}");
    expect(onChange).toHaveBeenLastCalledWith([alicia]);
    onChange.mockClear();
    await user.keyboard("{Backspace}");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("Esc ตอนแผงเปิดปิดแค่แผง ไม่ลอยขึ้นไปหาพ่อแม่ (dialog รอบข้างไม่ปิดตาม) · แผงปิดแล้วปล่อยผ่าน", async () => {
    const user = userEvent.setup();
    const parentKeyDown = vi.fn();
    render(
      <div onKeyDown={(e) => parentKeyDown(e.key)}>
        <EntityAutocomplete<Person> {...typeaheadBase} />
      </div>,
    );
    await user.click(field());
    await waitFor(() => expect(screen.getByRole("listbox")).toBeInTheDocument());
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
    expect(parentKeyDown).not.toHaveBeenCalledWith("Escape");

    // ปิดแล้ว Esc ต่อไปเป็นของ dialog ตามปกติ
    await user.keyboard("{Escape}");
    expect(parentKeyDown).toHaveBeenCalledWith("Escape");
  });

  it("ปิดแล้วไม่ค้างคำที่พิมพ์ไว้", async () => {
    const user = userEvent.setup();
    render(<EntityAutocomplete<Person> {...typeaheadBase} />);
    await user.type(field(), "be");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
    expect(field()).toHaveValue("");
  });

  it("โหมดปกติ (ไม่ typeahead) ยังเป็นกล่องที่กดเปิดแผง ไม่มี input ในช่อง", () => {
    render(<EntityAutocomplete<Person> {...base} multiple />);
    expect(screen.getByRole("combobox", { name: /ทีม/ }).tagName).toBe("DIV");
  });
});

describe("EntityAutocomplete — leadingIcon · listFooter · selectionFooter · panelClassName", () => {
  const multi = { ...base, multiple: true as const, defaultValue: [alicia] };

  it("selectionFooter ค่าตั้งต้นโชว์ จำนวนที่เลือก · ส่ง false แล้วไม่โชว์", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<EntityAutocomplete<Person> {...multi} />);
    await open(user);
    expect(screen.getByText(/1 selected/)).toBeInTheDocument();
    unmount();

    render(<EntityAutocomplete<Person> {...multi} selectionFooter={false} />);
    await open(user);
    expect(screen.queryByText(/selected/)).toBeNull();
  });

  it("listFooter อยู่ท้ายแผง ไม่ใช่ในลิสต์", async () => {
    const user = userEvent.setup();
    render(
      <EntityAutocomplete<Person>
        {...multi}
        selectionFooter={false}
        listFooter="แสดง 3 จาก 38 แพทย์"
      />,
    );
    await open(user);
    const footer = screen.getByText("แสดง 3 จาก 38 แพทย์");
    expect(footer).toBeInTheDocument();
    expect(screen.getByRole("listbox")).not.toContainElement(footer);
  });

  it("leadingIcon โชว์หน้าช่องทั้งสองโหมด", () => {
    const icon = <svg data-testid="lead" />;
    const { rerender } = render(
      <EntityAutocomplete<Person> {...multi} leadingIcon={icon} />,
    );
    expect(screen.getByTestId("lead")).toBeInTheDocument();
    rerender(
      <EntityAutocomplete<Person> {...multi} typeahead leadingIcon={icon} />,
    );
    expect(screen.getByTestId("lead")).toBeInTheDocument();
  });

  it("panelClassName ทับความกว้างตั้งต้นของแผง", async () => {
    const user = userEvent.setup();
    render(
      <EntityAutocomplete<Person> {...multi} panelClassName="min-w-[22rem]" />,
    );
    await open(user);
    expect(screen.getByRole("listbox").closest("[data-radix-popper-content-wrapper] > *")).toHaveClass("min-w-[22rem]");
  });
});
