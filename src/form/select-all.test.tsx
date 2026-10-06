import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComboBox, type ComboBoxOption } from "./ComboBox";
import { EntityAutocomplete } from "./EntityAutocomplete";
import { selectAllModel } from "./select-all";

/* "เลือกทั้งหมด" ของ ComboBox multiple + EntityAutocomplete multiple
 * ตรรกะอยู่ที่ `select-all.tsx` ที่เดียว — เทสฝั่ง component พิสูจน์ว่าแต่ละตัว
 * ส่ง "ตัวที่มองเห็นและเลือกได้" มาถูก */

const staff: ComboBoxOption[] = [
  { value: "a1", label: "Anna Ward A" },
  { value: "a2", label: "Arthur Ward A" },
  { value: "b1", label: "Bella Ward B" },
  { value: "b2", label: "Boris Ward B", disabled: true },
  { value: "h", label: "Head Nurse", locked: true },
];

const openList = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByLabelText("พนักงาน"));
  await waitFor(() => expect(screen.getByRole("listbox")).toBeInTheDocument());
};

const selectAllBox = (name: RegExp = /select all/i) =>
  screen.getByRole("checkbox", { name });

describe("selectAllModel", () => {
  const key = (s: string) => s;

  it("ว่าง / บางส่วน / ครบ", () => {
    expect(selectAllModel(["a", "b"], [], key).state).toBe(false);
    expect(selectAllModel(["a", "b"], ["a"], key).state).toBe("indeterminate");
    expect(selectAllModel(["a", "b"], ["b", "a"], key).state).toBe(true);
  });

  it("เติมต่อท้ายของเดิม ไม่เรียงใหม่ และไม่ซ้ำ", () => {
    expect(selectAllModel(["a", "b", "c"], ["x", "b"], key).toggle()).toEqual([
      "x",
      "b",
      "a",
      "c",
    ]);
  });

  it("ครบแล้วกด = ถอดเฉพาะเป้าหมาย ตัวนอกเป้าหมายอยู่ต่อ", () => {
    expect(selectAllModel(["a", "b"], ["x", "a", "b"], key).toggle()).toEqual([
      "x",
    ]);
  });

  it("targets ซ้ำ key กันเอง = เติมครั้งเดียว", () => {
    expect(selectAllModel(["a", "a", "b"], [], key).toggle()).toEqual(["a", "b"]);
  });

  it("เกิน maxItems = กดไม่ได้ · แต่ตอนครบแล้วยังถอดได้", () => {
    expect(selectAllModel(["a", "b", "c"], ["a"], key, 2).disabled).toBe(true);
    expect(selectAllModel(["a", "b"], ["a"], key, 2).disabled).toBe(false);
    expect(selectAllModel(["a", "b"], ["a", "b", "x"], key, 2).disabled).toBe(
      false,
    );
  });
});

describe("ComboBox multiple — selectAll", () => {
  it("ไม่ส่ง selectAll = ไม่มีแถว (ผู้ใช้เดิมไม่เปลี่ยน)", async () => {
    const user = userEvent.setup();
    render(<ComboBox multiple label="พนักงาน" options={staff} />);
    await openList(user);
    expect(screen.queryByRole("checkbox")).toBeNull();
  });

  it("กดครั้งเดียว = onChange ครั้งเดียว · ข้าม disabled · ตัวล็อกอยู่ต่อ", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ComboBox
        multiple
        selectAll
        label="พนักงาน"
        options={staff}
        defaultValue={["h"]}
        onChange={onChange}
      />,
    );
    await openList(user);
    await user.click(selectAllBox());
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(["h", "a1", "a2", "b1"]);
    expect(selectAllBox()).toHaveAttribute("aria-checked", "true");

    await user.click(selectAllBox());
    expect(onChange).toHaveBeenLastCalledWith(["h"]);
    expect(selectAllBox()).toHaveAttribute("aria-checked", "false");
  });

  it("เลือกบางตัว = สถานะ mixed", async () => {
    const user = userEvent.setup();
    render(
      <ComboBox
        multiple
        selectAll
        label="พนักงาน"
        options={staff}
        defaultValue={["a1"]}
      />,
    );
    await openList(user);
    expect(selectAllBox()).toHaveAttribute("aria-checked", "mixed");
  });

  it("กำลังค้นหา = เลือกเฉพาะที่ค้นเจอ · ป้ายบอกจำนวน · ถอดแล้วตัวนอกคำค้นอยู่ต่อ", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ComboBox
        multiple
        selectAll
        label="พนักงาน"
        options={staff}
        defaultValue={["b1"]}
        onChange={onChange}
      />,
    );
    await openList(user);
    await user.type(screen.getByPlaceholderText("Search..."), "Ward A");

    /* ลิสต์ที่ cmdk โชว์จริง กับเป้าหมายของแถวนี้ต้องเป็นชุดเดียวกัน */
    const shown = screen.getAllByRole("option").map((o) => o.textContent);
    expect(shown).toEqual(["Anna Ward A", "Arthur Ward A"]);
    const box = selectAllBox(/select all 2 results/i);

    await user.click(box);
    expect(onChange).toHaveBeenLastCalledWith(["b1", "a1", "a2"]);

    await user.click(selectAllBox(/select all 2 results/i));
    expect(onChange).toHaveBeenLastCalledWith(["b1"]);
  });

  it("ค้นไม่เจอ = ไม่มีแถว", async () => {
    const user = userEvent.setup();
    render(<ComboBox multiple selectAll label="พนักงาน" options={staff} />);
    await openList(user);
    await user.type(screen.getByPlaceholderText("Search..."), "zzzz");
    expect(screen.queryByRole("checkbox")).toBeNull();
  });

  it("เกิน maxItems = กดไม่ได้", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ComboBox
        multiple
        selectAll
        maxItems={2}
        label="พนักงาน"
        options={staff}
        onChange={onChange}
      />,
    );
    await openList(user);
    expect(selectAllBox()).toBeDisabled();
    await user.click(selectAllBox());
    expect(onChange).not.toHaveBeenCalled();
  });

  /* footer `N / max` โผล่เฉพาะตอนมีค่าที่เลือกแล้ว ⇒ ยังไม่เลือกอะไรเลย
   * ข้อความนี้คือสิ่งเดียวบนจอที่บอกว่าทำไมกดไม่ได้ */
  it("กดไม่ได้เพราะ maxItems = บอกเพดาน และผูกกับกล่องติ๊ก", async () => {
    const user = userEvent.setup();
    render(
      <ComboBox
        multiple
        selectAll
        maxItems={2}
        selectAllMaxLabel={(n) => `เลือกได้สูงสุด ${n}`}
        label="พนักงาน"
        options={staff}
      />,
    );
    await openList(user);
    expect(screen.queryByText(/selected/)).toBeNull();
    expect(selectAllBox()).toHaveAccessibleDescription("เลือกได้สูงสุด 2");
  });

  it("กดได้ = ไม่มีข้อความเพดาน", async () => {
    const user = userEvent.setup();
    render(
      <ComboBox
        multiple
        selectAll
        maxItems={10}
        label="พนักงาน"
        options={staff}
      />,
    );
    await openList(user);
    expect(screen.queryByText("Max 10")).toBeNull();
    expect(selectAllBox()).not.toHaveAttribute("aria-describedby");
  });

  it("คีย์บอร์ด: Tab จากช่องค้นหาถึงกล่องติ๊ก แล้ว Space เลือก", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ComboBox
        multiple
        selectAll
        label="พนักงาน"
        options={staff}
        onChange={onChange}
      />,
    );
    await openList(user);
    screen.getByPlaceholderText("Search...").focus();
    await user.tab();
    expect(selectAllBox()).toHaveFocus();
    await user.keyboard(" ");
    expect(onChange).toHaveBeenLastCalledWith(["a1", "a2", "b1"]);
  });

  it("ป้ายแปลได้", async () => {
    const user = userEvent.setup();
    render(
      <ComboBox
        multiple
        selectAll
        selectAllLabel="เลือกทั้งหมด"
        selectAllMatchesLabel={(n) => `เลือกทั้งหมดที่ค้นเจอ (${n})`}
        label="พนักงาน"
        options={staff}
      />,
    );
    await openList(user);
    expect(selectAllBox(/^เลือกทั้งหมด$/)).toBeInTheDocument();
    await user.type(screen.getByPlaceholderText("Search..."), "Bella");
    expect(selectAllBox(/เลือกทั้งหมดที่ค้นเจอ \(1\)/)).toBeInTheDocument();
  });

  it("optionsLoading = ไม่มีแถว", async () => {
    const user = userEvent.setup();
    render(
      <ComboBox
        multiple
        selectAll
        optionsLoading
        label="พนักงาน"
        options={staff}
      />,
    );
    await openList(user);
    expect(screen.queryByRole("checkbox")).toBeNull();
  });
});

describe("EntityAutocomplete multiple — selectAll", () => {
  type Person = { id: string; name: string; home?: boolean };
  const alicia: Person = { id: "1", name: "Alicia", home: true };
  const people: Person[] = [
    alicia,
    { id: "2", name: "Ben" },
    { id: "3", name: "Carmen" },
  ];

  it("เลือกทุกตัวที่หลังบ้านคืนมา คืนเป็น item ทั้งก้อน · ไม่แตะตัวที่ล็อก", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <EntityAutocomplete<Person>
        multiple
        selectAll
        label="พนักงาน"
        options={people}
        onSearch={() => {}}
        getOptionValue={(p) => p.id}
        getOptionLabel={(p) => p.name}
        isOptionLocked={(p) => Boolean(p.home)}
        defaultValue={[alicia]}
        onChange={onChange}
      />,
    );
    await openList(user);
    await user.click(selectAllBox());
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(people);

    await user.click(selectAllBox());
    expect(onChange).toHaveBeenLastCalledWith([alicia]);
  });

  it("searchError = ไม่มีแถว", async () => {
    const user = userEvent.setup();
    render(
      <EntityAutocomplete<Person>
        multiple
        selectAll
        label="พนักงาน"
        options={people}
        searchError="ค้นหาไม่สำเร็จ"
        onSearch={() => {}}
        getOptionValue={(p) => p.id}
        getOptionLabel={(p) => p.name}
      />,
    );
    await openList(user);
    expect(screen.queryByRole("checkbox")).toBeNull();
  });
});
