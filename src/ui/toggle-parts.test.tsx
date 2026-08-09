/**
 * เทสของ "ครอบครัวปุ่มติ๊ก" — Checkbox · CheckboxGroup · RadioGroup
 *
 * ⚠️ happy-dom ไม่คำนวณเลย์เอาต์และไม่ resolve สี ⇒ **พิสูจน์พิกเซลที่นี่ไม่ได้**
 * (ตัวเลขจริงวัดใน Storybook แล้ว บันทึกไว้ใน `toggle.md`)
 * สิ่งที่เทสชุดนี้ล็อกคือ **สัญญา** ที่พังเงียบได้: ขนาดต้องเท่ากันข้าม component,
 * สีที่ห้ามใช้, และสถานะที่ Radix จะไม่ render ให้ถ้าส่งผิดทาง
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { Checkbox } from "./Checkbox";
import { CheckboxGroup } from "./CheckboxGroup";
import { RadioGroup } from "./RadioGroup";
import { Switch } from "./Switch";

const boxOf = (el: HTMLElement) => el.className.split(/\s+/);

describe("ขนาดต้องไม่เพี้ยนกันข้าม component", () => {
  /* นี่คือเหตุผลทั้งหมดที่ `toggle-parts.tsx` มีอยู่ — ก่อนหน้านี้ DS มี
   * checkbox 20px แต่ radio 16px ทั้งที่ยืนอยู่ในฟอร์มเดียวกัน */
  it.each(["sm", "md"] as const)(
    "checkbox กับ radio ใช้คลาสขนาดเดียวกันเมื่อ size=%s",
    (size) => {
      const { unmount } = render(<Checkbox size={size} aria-label="cb" />);
      const cb = boxOf(screen.getByRole("checkbox"));
      unmount();

      render(
        <RadioGroup
          size={size}
          aria-label="rg"
          options={[{ value: "a", label: "A" }]}
        />,
      );
      const rd = boxOf(screen.getByRole("radio"));

      const sizeClass = (cls: string[]) => cls.find((c) => /^size-\d/.test(c));
      expect(sizeClass(cb)).toBe(sizeClass(rd));
      expect(sizeClass(cb)).toBe(size === "sm" ? "size-4" : "size-5");
    },
  );

  it("ค่าเริ่มต้นคือ md (20px)", () => {
    render(<Checkbox aria-label="cb" />);
    expect(boxOf(screen.getByRole("checkbox"))).toContain("size-5");
  });

  it("CheckboxGroup ส่งขนาดลงไปถึงตัวเลือกทุกตัว", () => {
    render(
      <CheckboxGroup
        size="sm"
        label="กลุ่ม"
        options={[
          { value: "a", label: "A" },
          { value: "b", label: "B" },
        ]}
      />,
    );
    for (const el of screen.getAllByRole("checkbox")) {
      expect(boxOf(el)).toContain("size-4");
    }
  });
});

describe("สีที่ห้ามหลุดกลับเข้ามา", () => {
  /* ทั้งสามแอปใช้ `ring-cherry-red-600/50` เป็นวงแหวนโฟกัสของช่องติ๊กธรรมดา
   * ซึ่งเป็นสีเดียวกับข้อความผิดพลาด — ถ้ามีใครลอกกลับมาต้องแตกที่นี่ */
  it.each([
    ["checkbox", <Checkbox key="c" aria-label="cb" />],
    [
      "radio",
      <RadioGroup key="r" aria-label="rg" options={[{ value: "a", label: "A" }]} />,
    ],
  ])("วงแหวนโฟกัสของ %s ไม่ใช่สีแดง", (_name, node) => {
    render(node as React.ReactElement);
    const el = screen.getByRole(_name === "checkbox" ? "checkbox" : "radio");
    expect(el.className).toContain("focus-visible:ring-brand/40");
    expect(el.className).not.toMatch(/ring-cherry-red/);
  });

  /* `--color-text-primary` ถูก alias ไปที่ `--color-brand` ใน `theme.css`
   * ⇒ ป้ายกำกับที่ใช้ token นั้นจะเปลี่ยนสีตามแบรนด์ของแต่ละแอป */
  it("ป้ายกำกับใช้ text-text-body ไม่ใช่ text-text-primary", () => {
    const { container } = render(<Checkbox label="ยอมรับเงื่อนไข" />);
    const label = container.querySelector("label")!;
    expect(label.className).toContain("text-text-body");
    expect(label.className).not.toContain("text-text-primary");
  });
});

describe("สถานะเลือกบางส่วน", () => {
  /* พิสูจน์แล้วว่า `checked={false}` + prop `indeterminate` แยก จะได้
   * `data-state="unchecked"` และ Radix จะไม่ render indicator เลย */
  it("ส่งผ่าน checked='indeterminate' แล้วได้ทั้ง state และ aria", () => {
    const { container } = render(
      <Checkbox label="เลือกทั้งหมด" checked="indeterminate" />,
    );
    const cb = screen.getByRole("checkbox", { name: "เลือกทั้งหมด" });
    expect(cb).toHaveAttribute("data-state", "indeterminate");
    expect(cb).toHaveAttribute("aria-checked", "mixed");
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("ติ๊กครบ กับ ติ๊กบางส่วน วาดสัญลักษณ์คนละตัว", () => {
    const { container: all } = render(<Checkbox checked aria-label="all" />);
    const { container: some } = render(
      <Checkbox checked="indeterminate" aria-label="some" />,
    );
    expect(all.querySelector("svg")?.innerHTML).not.toBe(
      some.querySelector("svg")?.innerHTML,
    );
  });
});

describe("โครงร่างตอนโหลด", () => {
  it("Checkbox: ไม่มีตัวควบคุมให้กดระหว่างโหลด", () => {
    render(<Checkbox isLoading label="รับข่าวสาร" />);
    expect(screen.queryByRole("checkbox")).toBeNull();
    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
  });

  it("Checkbox: เนื้อหาจริงยังอยู่ใน DOM เพื่อให้โครงร่างกว้างเท่าของจริง", () => {
    render(<Checkbox isLoading label="รับข่าวสาร" description="เดือนละสองครั้ง" />);
    expect(screen.getByText("รับข่าวสาร")).toBeInTheDocument();
    expect(screen.getByText("เดือนละสองครั้ง")).toBeInTheDocument();
  });

  it("RadioGroup: จำนวนโครงร่างเท่าจำนวนตัวเลือกที่รู้อยู่แล้ว", () => {
    render(
      <RadioGroup
        isLoading
        label="ประเภท"
        options={[
          { value: "a", label: "A" },
          { value: "b", label: "B" },
          { value: "c", label: "C" },
          { value: "d", label: "D" },
        ]}
      />,
    );
    expect(screen.getAllByRole("status")).toHaveLength(4);
    expect(screen.queryByRole("radio")).toBeNull();
  });

  it("RadioGroup: ไม่รู้ตัวเลือกล่วงหน้าใช้ 3 แถว", () => {
    render(<RadioGroup isLoading label="ประเภท" />);
    expect(screen.getAllByRole("status")).toHaveLength(3);
  });

  it("CheckboxGroup: โหลดอยู่ก็ยังเห็นป้ายกำกับของกลุ่ม", () => {
    render(
      <CheckboxGroup
        isLoading
        label="ช่องทางแจ้งเตือน"
        options={[{ value: "a", label: "A" }]}
      />,
    );
    expect(screen.getByText("ช่องทางแจ้งเตือน")).toBeInTheDocument();
    expect(screen.getAllByRole("status")).toHaveLength(1);
  });
});

describe("ปุ่มตัวเลือกเดียว — รูปทรง", () => {
  it("ไม่ใช้ขอบหนาแทนจุดกลาง", () => {
    /* Portal/MediHR ใช้ `data-[state=checked]:border-[6px]` แล้ววาดรูขาวตรงกลาง
     * ซึ่งกลับ figure/ground และพังเมื่อเปลี่ยนขนาด */
    render(<RadioGroup aria-label="rg" options={[{ value: "a", label: "A" }]} />);
    const el = screen.getByRole("radio");
    expect(el.className).not.toMatch(/border-\[\d+px\]/);
    expect(el.className).toContain("data-[state=checked]:border-brand");
  });

  it("จุดกลางเป็นสีแบรนด์ ไม่ใช่สีขาว", () => {
    const { container } = render(
      <RadioGroup
        aria-label="rg"
        defaultValue="a"
        options={[{ value: "a", label: "A" }]}
      />,
    );
    const indicator = container.querySelector('[data-state="checked"] span');
    expect(indicator?.className).toContain("after:bg-brand");
    expect(indicator?.className).not.toMatch(/after:bg-white/);
  });
});

describe("Switch", () => {
  /* 5 ใน 6 แบบของจริงใช้เขียว มีแต่ Mediwork MUI ที่ใช้ primary
   * เปิด/ปิดคือสถานะ ไม่ใช่แบรนด์ — เหตุผลเดียวกับสีตัวเลขในตาราง */
  it("เปิดแล้วเป็นเขียว ไม่ใช่สีแบรนด์", () => {
    render(<Switch aria-label="sw" />);
    const track = screen.getByRole("switch");
    expect(track.className).toContain(
      "data-[state=checked]:bg-success-green-primary",
    );
    expect(track.className).not.toMatch(/data-\[state=checked\]:bg-brand\b/);
  });

  it("ปุ่มเลื่อนขาวเสมอ ไม่เปลี่ยนสีตามสถานะ", () => {
    const { container } = render(<Switch aria-label="sw" defaultChecked />);
    const thumb = container.querySelector('[data-state="checked"] > span');
    expect(thumb?.className).toContain("bg-bg-default");
    expect(thumb?.className).not.toMatch(/data-\[state=checked\]:bg-/);
  });

  describe("loading ≠ disabled ≠ isLoading", () => {
    it("loading: กดไม่ได้ · ประกาศ aria-busy · ยังคงสถานะเดิม", async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();
      render(
        <Switch
          label="เปิดใช้งาน"
          checked
          loading
          loadingLabel="กำลังบันทึก"
          onCheckedChange={onCheckedChange}
        />,
      );
      const sw = screen.getByRole("switch", { name: "เปิดใช้งาน" });
      expect(sw).toHaveAttribute("aria-busy", "true");
      expect(sw).toHaveAttribute("aria-checked", "true");
      await user.click(sw);
      expect(onCheckedChange).not.toHaveBeenCalled();
    });

    it("loading: มีตัวหมุนพร้อมข้อความที่แอปส่งมา", () => {
      render(<Switch aria-label="sw" loading loadingLabel="กำลังบันทึก" />);
      expect(screen.getByLabelText("กำลังบันทึก")).toBeInTheDocument();
    });

    it("disabled: ไม่ประกาศ aria-busy — คนละความหมาย", () => {
      render(<Switch label="ปิดใช้งาน" disabled />);
      const sw = screen.getByRole("switch", { name: "ปิดใช้งาน" });
      expect(sw).not.toHaveAttribute("aria-busy");
    });

    it("isLoading: ไม่มีสวิตช์ให้กดเลย เหลือแต่โครงร่าง", () => {
      render(<Switch isLoading label="แจ้งเตือน" />);
      expect(screen.queryByRole("switch")).toBeNull();
      expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
      expect(screen.getByText("แจ้งเตือน")).toBeInTheDocument();
    });
  });

  describe("ข้อความในราง", () => {
    const labels = { on: "เปิดใช้งาน", off: "ปิดใช้งาน" };

    it("มีทั้งสองคำอยู่ใน DOM เสมอ — คำที่ยาวกว่าเป็นตัวกำหนดความกว้าง", () => {
      /* ของจริง MediHR render ทีละคำ ⇒ วัดได้ Active 57.94 → Inactive 65.38
       * คือรางกระตุก 7.4px ทุกครั้งที่กด และการ์ดทั้งแถวเลื่อนตาม */
      render(<Switch aria-label="sw" trackLabels={labels} />);
      expect(screen.getByText("เปิดใช้งาน")).toBeInTheDocument();
      expect(screen.getByText("ปิดใช้งาน")).toBeInTheDocument();
    });

    it("ซ่อนคำที่ไม่ใช้ด้วย invisible ไม่ใช่ถอดออกจาก DOM", () => {
      const { container } = render(
        <Switch aria-label="sw" defaultChecked trackLabels={labels} />,
      );
      const off = screen.getByText("ปิดใช้งาน");
      expect(off.className).toContain(
        "group-data-[state=checked]/switch:invisible",
      );
      /* ทั้งคู่อยู่ช่อง grid เดียวกัน ⇒ ความกว้าง = คำที่ยาวกว่า */
      expect(off.className).toContain("col-start-1");
      expect(screen.getByText("เปิดใช้งาน").className).toContain("row-start-1");
      expect(container.querySelector(".grid")).not.toBeNull();
    });

    it("คำในรางเป็น aria-hidden — สถานะอ่านจาก role/aria-checked", () => {
      render(
        <Switch aria-label="สถานะหน่วยงาน" defaultChecked trackLabels={labels} />,
      );
      const sw = screen.getByRole("switch", { name: "สถานะหน่วยงาน" });
      expect(sw).toHaveAttribute("aria-checked", "true");
      expect(screen.getByText("เปิดใช้งาน").closest("[aria-hidden]")).not.toBeNull();
    });

    it("ปุ่มเลื่อนสลับข้างด้วย order ไม่ใช่ translate", () => {
      const { container } = render(
        <Switch aria-label="sw" trackLabels={labels} />,
      );
      const thumb = container.querySelector('[data-state] > span:last-child')!;
      expect(thumb.className).toContain(
        "group-data-[state=checked]/switch:order-2",
      );
      expect(thumb.className).not.toMatch(/translate-x/);
    });

    it("ไม่ส่ง trackLabels = รางกว้างคงที่แบบเดิม", () => {
      render(<Switch aria-label="sw" />);
      expect(screen.getByRole("switch").className).toContain("w-11");
    });

    it("โครงร่างยังกินที่เท่ารางจริง — เนื้อหาอยู่ครบใน DOM", () => {
      render(<Switch isLoading aria-label="sw" trackLabels={labels} />);
      expect(screen.queryByRole("switch")).toBeNull();
      expect(screen.getByText("เปิดใช้งาน")).toBeInTheDocument();
      expect(screen.getByText("ปิดใช้งาน")).toBeInTheDocument();
    });
  });

  it("ใช้ป้ายกำกับร่วมกับตัวอื่นในตระกูล — สีเดียวกัน จัดกลางแถว", () => {
    const { container } = render(<Switch label="เปิดใช้งาน" />);
    const label = container.querySelector("label")!;
    expect(label.className).toContain("text-text-body");
    expect(label.className).toContain("items-center");
    expect(label.className).not.toContain("text-text-primary");
  });
});
