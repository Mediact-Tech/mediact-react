import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Dialog, DialogContent } from "../overlay/Dialog";
import { SearchSelect } from "./SearchSelect";

type Person = { id: string; name: string; email: string };

const alicia: Person = { id: "1", name: "Alicia", email: "alicia@hospital.th" };
const ben: Person = { id: "2", name: "Ben", email: "ben@hospital.th" };

/* ⛔ ไม่ใส่ `as const` — มันทำให้ `options` เป็น `readonly` ซึ่งไม่เข้ากับ prop ที่รับ `T[]`
   (typecheck จับได้ 7 จุด ตอนสเปรด `{...base}`) */
const base = {
  label: "ทีม",
  options: [alicia, ben] as Person[],
  onSearch: () => {},
  getOptionValue: (p: Person) => p.id,
  getOptionLabel: (p: Person) => p.name,
};

describe("SearchSelect", () => {
  it("เลือกแล้วคืนตัว item ทั้งก้อน ไม่ใช่แค่ค่า", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchSelect<Person> {...base} value={null} onChange={onChange} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: /Ben/ }));

    expect(onChange).toHaveBeenCalledWith(ben);
  });

  it("พิมพ์แล้วแจ้ง onSearch ทุกครั้ง รวมตอนล้างเป็นค่าว่าง", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchSelect<Person> {...base} value={null} onChange={() => {}} onSearch={onSearch} />);

    const field = screen.getByRole("combobox");
    await user.type(field, "ali");
    expect(onSearch).toHaveBeenLastCalledWith("ali");

    await user.clear(field);
    /* 🔑 ล้างช่องต้องบอกผู้เรียกด้วย — ไม่งั้นผลค้นหาเก่าค้างอยู่ในแผงหลังผู้ใช้ลบคำทิ้งแล้ว */
    expect(onSearch).toHaveBeenLastCalledWith("");
  });

  /**
   * 🔴🔴 **เหตุผลที่คอมโพเนนต์นี้เกิด** — `EntityAutocomplete` วางช่องค้นหาไว้ในแผงที่ถูก `Portal`
   * ออกไปนอก `DialogContent` ⇒ `FocusScope` ของ `Dialog` ดึงโฟกัสกลับ ⇒ **พิมพ์ไม่ติดเลย**
   * ตัวนี้แผงอยู่ในต้นไม้เดิม และช่องพิมพ์อยู่นอกแผง ⇒ ไม่มีอะไรให้แย่งโฟกัสตั้งแต่ต้น
   *
   * ⚠️ jsdom จำลอง focus scope ของ Radix ได้ไม่ครบ (เทสของ `EntityAutocomplete` เขียวทั้งตอนพัง
   * และตอนดี) ⇒ เทสนี้ล็อกได้แค่ว่า **ค่าที่พิมพ์เข้าไปอยู่ในช่องจริงเมื่ออยู่ในโมดัล**
   * ⛔ อย่าอ่านว่าเป็นการพิสูจน์เรื่องโฟกัส — ข้อนั้นวัดในเบราว์เซอร์เท่านั้น
   */
  it("อยู่ในโมดัลก็พิมพ์ได้ (เหตุผลที่คอมโพเนนต์นี้ถูกสร้าง)", async () => {
    const user = userEvent.setup();
    const Harness = () => {
      const [value, setValue] = useState<Person | null>(null);
      const [term, setTerm] = useState("");
      return (
        <Dialog open>
          <DialogContent>
            <SearchSelect<Person>
              {...base}
              options={base.options.filter((p) => p.name.toLowerCase().includes(term.toLowerCase()))}
              value={value}
              onChange={setValue}
              onSearch={setTerm}
            />
            <span data-testid="term">{term}</span>
          </DialogContent>
        </Dialog>
      );
    };
    render(<Harness />);

    const field = screen.getByRole("combobox");
    await user.type(field, "ali");

    expect((field as HTMLInputElement).value).toBe("ali");
    await waitFor(() => expect(screen.getByTestId("term").textContent).toBe("ali"));
    expect(screen.getByRole("option", { name: /Alicia/ })).toBeInTheDocument();
  });

  it("Esc ครั้งแรกปิดแผค ⛔ ไม่ทะลุไปปิดโมดัล", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Dialog open onOpenChange={onOpenChange}>
        <DialogContent>
          <SearchSelect<Person> {...base} value={null} onChange={() => {}} />
        </DialogContent>
      </Dialog>,
    );

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("listbox")).toBeNull();
    /* 🔑 โมดัลต้องยังเปิดอยู่ — Esc ครั้งแรกเป็นของแผง ครั้งที่สองเป็นของโมดัล */
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("คลิกข้างนอกปิดแผง", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <SearchSelect<Person> {...base} value={null} onChange={() => {}} />
        <button type="button">ที่อื่น</button>
      </div>,
    );

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "ที่อื่น" }));
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
  });

  it("ลูกศรขึ้น/ลง + Enter เลือกได้ด้วยคีย์บอร์ด", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchSelect<Person> {...base} value={null} onChange={onChange} />);

    await user.click(screen.getByRole("combobox"));
    await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");

    expect(onChange).toHaveBeenCalledWith(ben);
  });

  it("ยังไม่ถึงเกณฑ์ตัวอักษร ⇒ โชว์ข้อความชวนพิมพ์ ไม่ใช่ 'ไม่พบข้อมูล'", async () => {
    const user = userEvent.setup();
    render(
      <SearchSelect<Person>
        {...base}
        minChars={2}
        hintText="พิมพ์อย่างน้อย 2 ตัวอักษร"
        emptyText="ไม่พบข้อมูล"
        value={null}
        onChange={() => {}}
      />,
    );

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByText("พิมพ์อย่างน้อย 2 ตัวอักษร")).toBeInTheDocument();

    await user.type(screen.getByRole("combobox"), "al");
    /* ⛔ ผลที่ส่งเข้ามาต้องโผล่ทันทีที่ถึงเกณฑ์ — ไม่ต้องรออะไรอีก */
    expect(screen.getByRole("option", { name: /Alicia/ })).toBeInTheDocument();
  });

  it("บรรทัดที่สองของตัวเลือกแสดงคำอธิบายที่ผู้เรียกกำหนด", async () => {
    const user = userEvent.setup();
    render(
      <SearchSelect<Person>
        {...base}
        getOptionDescription={(p) => p.email}
        value={null}
        onChange={() => {}}
      />,
    );

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByText("alicia@hospital.th")).toBeInTheDocument();
  });
  /**
   * 🔴 สองข้อนี้มาจากจอจริง (2026-08-20) — เทสชุดแรกไม่ได้ครอบ
   *   ① `clearable` ที่ส่งไปแล้วแต่ **ไม่มีปุ่มโผล่** เพราะ dist ที่แอปติดตั้งยังไม่มี prop นี้
   *      ⇒ เทสนี้กันการถอด prop ทิ้งโดยไม่ตั้งใจ (ไม่ได้กันเรื่อง build/ติดตั้ง ซึ่งเป็นเรื่องคนละชั้น)
   *   ② เปิดแผงแล้วช่องกลายเป็นว่าง ⇒ อ่านว่า "ยังไม่ได้เลือก" ทั้งที่เลือกไว้แล้ว
   */
  describe("จากจอจริง", () => {
    it("clearable + มีค่า ⇒ มีปุ่มล้าง และกดแล้วคืน null", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <SearchSelect<Person>
          {...base}
          clearable
          clearLabel="ล้างค่า"
          value={alicia}
          onChange={onChange}
        />,
      );

      const clear = screen.getByRole("button", { name: "ล้างค่า" });
      await user.click(clear);

      expect(onChange).toHaveBeenCalledWith(null);
    });

    it("ปุ่มล้างต้องมี cursor-pointer (Tailwind v4 preflight ไม่ตั้งให้ button แล้ว)", () => {
      render(
        <SearchSelect<Person> {...base} clearable clearLabel="ล้างค่า" value={alicia} onChange={() => {}} />,
      );
      expect(screen.getByRole("button", { name: "ล้างค่า" }).className).toContain("cursor-pointer");
    });

    it("ไม่ส่ง clearable ⇒ ไม่มีปุ่มล้าง (ค่าเริ่มต้นต้องไม่โผล่เอง)", () => {
      render(<SearchSelect<Person> {...base} value={alicia} onChange={() => {}} />);
      expect(screen.queryByRole("button")).toBeNull();
    });

    it("เปิดแผงแล้วยังเห็นค่าที่เลือก จนกว่าจะเริ่มพิมพ์", async () => {
      const user = userEvent.setup();
      render(<SearchSelect<Person> {...base} value={alicia} onChange={() => {}} />);

      const field = screen.getByRole("combobox") as HTMLInputElement;
      await user.click(field);
      /* ⛔ ห้ามว่าง — ว่างแล้ว placeholder โผล่ ผู้ใช้อ่านว่ายังไม่ได้เลือก */
      expect(field.value).toBe("Alicia");

      await user.type(field, "b");
      expect(field.value).toBe("b");
    });
  });
});
