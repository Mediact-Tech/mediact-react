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
