import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Inbox } from "lucide-react";
import { EmptyState, ErrorState } from "./EmptyState";

/** ป้ายรูป = กล่องที่ถือไอคอน/รูป — จับจาก class ทรงซึ่งมีที่เดียว */
const badge = () =>
  document.querySelector('[class*="rounded-full"], [class*="rounded-lg"]');

describe("EmptyState", () => {
  describe("ช่องรูป — รับได้ทั้งไอคอนและรูป", () => {
    it("ส่ง icon = มีป้ายวงกลม", () => {
      render(<EmptyState icon={<Inbox />} title="ว่าง" />);
      const b = badge()!;
      expect(b.className).toContain("rounded-full");
      expect(b.querySelector("svg")).not.toBeNull();
    });

    /* ภาพประกอบมักมีพื้นในตัวอยู่แล้ว — ครอบป้ายอีกชั้นจะได้กรอบซ้อนกรอบ */
    it("ส่ง image = ไม่มีป้ายให้โดยปริยาย", () => {
      render(<EmptyState image={<img src="/a.svg" alt="ว่าง" />} title="ว่าง" />);
      expect(screen.getByRole("img", { name: "ว่าง" })).toBeInTheDocument();
      expect(badge()).toBeNull();
    });

    it("image ชนะ icon เมื่อส่งมาทั้งคู่", () => {
      render(
        <EmptyState
          icon={<Inbox data-testid="ic" />}
          image={<img src="/a.svg" alt="ภาพ" />}
        />,
      );
      expect(screen.getByRole("img", { name: "ภาพ" })).toBeInTheDocument();
      expect(screen.queryByTestId("ic")).toBeNull();
    });

    it("สั่ง mediaShape ให้รูปมีพื้นได้", () => {
      render(
        <EmptyState
          image={<img src="/a.svg" alt="ภาพ" />}
          mediaShape="circle"
          tone="info"
        />,
      );
      expect(badge()!.className).toContain("rounded-full");
    });

    /* ผู้ใช้เคาะให้เหลือทรงเดียว — สองทรงในระบบเดียวไม่ได้สื่ออะไรต่างกัน
     * มีแต่ทำให้แต่ละจอเลือกไม่เหมือนกัน */
    it("ป้ายเป็นวงกลมเสมอ ไม่มีทรงเหลี่ยม", () => {
      render(<EmptyState icon={<Inbox />} />);
      expect(badge()!.className).toContain("rounded-full");
      expect(badge()!.className).not.toContain("rounded-lg");
    });

    it("ไม่ส่งทั้งไอคอนและรูป = ไม่ render ช่องรูปเลย", () => {
      render(<EmptyState title="ว่าง" />);
      expect(badge()).toBeNull();
    });
  });

  describe("สีพื้นตามแอป", () => {
    /* 🔴 หัวใจของรอบนี้ — ค่าตั้งต้นต้องเป็น token ของแบรนด์ ไม่ใช่สีตายตัว
     * ของจริง 4 แอปใช้ 4 สีที่ไม่ตรงกับแบรนด์ตัวเองสักแอป */
    it("ค่าตั้งต้นผูกกับ brand-subtle = เปลี่ยนตามธีมของแอป", () => {
      render(<EmptyState icon={<Inbox />} />);
      expect(badge()!.className).toContain("bg-brand-subtle");
    });

    it.each([
      ["info", "bg-info-blue-50"],
      ["success", "bg-success-green-50"],
      ["warning", "bg-warning-yellow-50"],
      ["danger", "bg-cherry-red-50"],
    ] as const)("tone=%s ใช้ token %s", (tone, cls) => {
      render(<EmptyState icon={<Inbox />} tone={tone} />);
      expect(badge()!.className).toContain(cls);
    });

    /* สีความหมาย (สำเร็จ/เตือน/ผิดพลาด) ต้องเหมือนกันทุกแอป — ห้ามผูกกับแบรนด์ */
    it("โทนที่เป็นความหมายไม่ใช้ token ของแบรนด์", () => {
      render(<EmptyState icon={<Inbox />} tone="danger" />);
      expect(badge()!.className).not.toContain("brand");
    });

    it("tone=none = ไม่มีพื้น แต่ยังแสดงไอคอน", () => {
      render(<EmptyState icon={<Inbox data-testid="ic" />} tone="none" />);
      expect(screen.getByTestId("ic")).toBeInTheDocument();
      expect(badge()).toBeNull();
    });

    it("iconTone ชื่อเดิมยังใช้ได้ แต่ tone ชนะ", () => {
      const { rerender } = render(<EmptyState icon={<Inbox />} iconTone="warning" />);
      expect(badge()!.className).toContain("bg-warning-yellow-50");
      rerender(<EmptyState icon={<Inbox />} iconTone="warning" tone="danger" />);
      expect(badge()!.className).toContain("bg-cherry-red-50");
    });
  });

  /* ของจริงเคยมีจอที่พกไอคอนเทา 44px ของตัวเองมาแล้วรับดีไซน์ครึ่งเดียว */
  it("ขนาดไอคอนถูกบังคับที่ป้าย ไม่ใช่ที่ตัวไอคอน", () => {
    render(<EmptyState icon={<Inbox />} size="sm" />);
    expect(badge()!.className).toContain("[&_svg]:size-6");
    expect(badge()!.className).toContain("size-14");
  });

  it("render ครบทั้งหัวเรื่อง คำอธิบาย และปุ่ม", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <EmptyState
        icon={<Inbox />}
        title="ยังไม่มีรายการ"
        description="กดปุ่มเพิ่มเพื่อเริ่มต้น"
        action={<button onClick={onClick}>เพิ่ม</button>}
      />,
    );
    expect(screen.getByRole("heading", { name: "ยังไม่มีรายการ" })).toBeInTheDocument();
    expect(screen.getByText("กดปุ่มเพิ่มเพื่อเริ่มต้น")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "เพิ่ม" }));
    expect(onClick).toHaveBeenCalled();
  });

  it("minHeight กันหน้ากระโดดตอนไม่มีข้อมูล", () => {
    const { container } = render(<EmptyState title="ว่าง" minHeight={400} />);
    expect((container.firstElementChild as HTMLElement).style.minHeight).toBe("400px");
  });
});

describe("ErrorState", () => {
  it("ตั้งต้นเป็นโทนผิดพลาดและมีไอคอนเตือนให้เอง", () => {
    render(<ErrorState title="พัง" />);
    expect(badge()!.className).toContain("bg-cherry-red-50");
    expect(badge()!.querySelector("svg")).not.toBeNull();
  });

  it("มี onRetry = มีปุ่มลองใหม่ที่กดได้", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorState title="พัง" onRetry={onRetry} />);
    await user.click(screen.getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalled();
  });

  it("ไม่มี onRetry = ไม่มีปุ่ม", () => {
    render(<ErrorState title="พัง" />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  /* DS ไม่มี i18n — ทุกคำต้องมาจากแอป */
  it("retryLabel แทนที่คำอังกฤษได้", () => {
    render(<ErrorState title="พัง" onRetry={() => {}} retryLabel="ลองใหม่" />);
    expect(screen.getByRole("button", { name: "ลองใหม่" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Retry" })).toBeNull();
  });

  it("รับรูปแทนไอคอนได้ และไม่ใส่ไอคอนเตือนซ้อน", () => {
    render(<ErrorState image={<img src="/e.svg" alt="ผิดพลาด" />} />);
    expect(screen.getByRole("img", { name: "ผิดพลาด" })).toBeInTheDocument();
    expect(document.querySelectorAll("svg")).toHaveLength(0);
  });

  it("action ที่ส่งมาเองชนะปุ่มลองใหม่", () => {
    render(
      <ErrorState title="พัง" onRetry={() => {}} action={<button>กลับหน้าแรก</button>} />,
    );
    expect(screen.getByRole("button", { name: "กลับหน้าแรก" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Retry" })).toBeNull();
  });

  /* สองสถานะนี้ยืนที่เดียวกันบนจอ — โครงต่างกันเมื่อไหร่ จอกระโดดตอนสลับ */
  it("ใช้โครงเดียวกับ EmptyState", () => {
    const { container: a } = render(<EmptyState icon={<Inbox />} title="ว่าง" />);
    const { container: b } = render(<ErrorState title="พัง" />);
    const shell = (c: HTMLElement) =>
      (c.firstElementChild!.firstElementChild as HTMLElement).className;
    expect(shell(a)).toBe(shell(b));
  });
});
