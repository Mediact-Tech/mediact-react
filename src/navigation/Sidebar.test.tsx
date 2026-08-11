/**
 * ยามของแถบเมนูซ้าย — ล็อกสิ่งที่วัดจาก Portal แล้วพังเงียบได้
 *
 * ⚠️ happy-dom ไม่คำนวณเลย์เอาต์ ⇒ ตัวเลขระยะ/ความสูงพิสูจน์ได้แค่ใน Storybook
 * (วัดแล้ว ตรง 19/19 บันทึกไว้ใน CLAUDE.md) ที่นี่ล็อก **โครงสร้างกับพฤติกรรม**
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Cog, Home } from "lucide-react";
import {
  Sidebar,
  SidebarGroup,
  SidebarItem,
  useSidebarState,
} from "./Sidebar";

const tree = (props: Partial<React.ComponentProps<typeof Sidebar>> = {}) => (
  <Sidebar activeItemId="access" {...props}>
    <SidebarItem id="home" label="หน้าแรก" icon={Home} />
    <SidebarGroup id="settings" label="ตั้งค่า" icon={Cog}>
      <SidebarItem id="access" label="สิทธิ์การเข้าถึง" />
    </SidebarGroup>
  </Sidebar>
);

const btn = (name: string) => screen.getByRole("button", { name });

describe("ไอคอนตามระดับ", () => {
  /* ภาพจับได้ว่าเคยซ่อนไอคอนทุกระดับ ทั้งที่ตัวเลขระยะตรงครบ —
   * ของจริงซ่อนเฉพาะเมนูย่อย ส่วนเมนูระดับบนมีไอคอนเสมอ */
  it("เมนูระดับบนมีไอคอน · เมนูย่อยไม่มี (ตอนกาง)", () => {
    const { container } = render(tree());
    expect(btn("หน้าแรก").querySelector("svg")).not.toBeNull();
    const sub = container.querySelector('[class*="border-l"] button')!;
    expect(sub.querySelector("svg")).toBeNull();
  });

  it("ตอนยุบ เมนูย่อยไม่ถูก render เลย — รางเส้นก็ไม่มี", () => {
    const { container } = render(tree({ collapsed: true, expandOnHover: false }));
    expect(container.querySelector('[class*="border-l"]')).toBeNull();
    expect(screen.queryByText("สิทธิ์การเข้าถึง")).toBeNull();
  });
});

describe("สถานะกำลังเปิดอยู่ — สองระดับคนละแบบ", () => {
  it("เมนูย่อยที่เปิดอยู่ = แถบขาวทึบ ตัวหนังสือดำคงที่", () => {
    render(tree());
    const sub = btn("สิทธิ์การเข้าถึง");
    expect(sub.className).toContain("bg-white");
    /* ของจริงใช้ `text-text-primary` ซึ่ง alias ไปสีแบรนด์
     * ⇒ บน Mediwork เป็นเขียวมิ้นต์บนขาว วัดได้ 1.93:1 */
    expect(sub.className).toContain("text-text-black");
    expect(sub.className).not.toContain("text-brand");
  });

  it("เมนูระดับบนที่เปิดอยู่ = พื้นโปร่ง ไม่ใช่แถบขาวทึบ", () => {
    render(
      <Sidebar activeItemId="home">
        <SidebarItem id="home" label="หน้าแรก" icon={Home} />
      </Sidebar>,
    );
    expect(btn("หน้าแรก").className).toContain("bg-white/20");
  });

  it("ยุบอยู่ + มีเมนูลูกที่เปิดอยู่ ⇒ ไฮไลต์หัวกลุ่มแทน", () => {
    /* ไม่ทำแบบนี้จะไม่มีอะไรบนจอบอกว่าผู้ใช้อยู่หน้าไหน เพราะเมนูลูกถูกซ่อน */
    render(
      <Sidebar activeItemId="access" collapsed expandOnHover={false}>
        <SidebarGroup id="settings" label="ตั้งค่า" icon={Cog} isChildActive>
          <SidebarItem id="access" label="สิทธิ์การเข้าถึง" />
        </SidebarGroup>
      </Sidebar>,
    );
    expect(btn("ตั้งค่า").className).toContain("bg-white/20");
  });
});

describe("ปุ่มติดต่อฝ่ายสนับสนุน", () => {
  it("ไม่ส่ง supportAction = ไม่มีปุ่ม", () => {
    render(tree());
    expect(screen.queryByRole("button", { name: /ติดต่อ/ })).toBeNull();
  });

  it("กดแล้วเรียก onClick · ข้อความมาจากแอป", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(tree({ supportAction: { label: "ติดต่อฝ่ายสนับสนุน", onClick } }));
    await user.click(btn("ติดต่อฝ่ายสนับสนุน"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("ตอนยุบเหลือแต่ไอคอน แต่ยังมีชื่อให้โปรแกรมอ่านหน้าจอ", () => {
    render(
      tree({
        collapsed: true,
        expandOnHover: false,
        supportAction: { label: "ติดต่อฝ่ายสนับสนุน", onClick: () => {} },
      }),
    );
    const support = btn("ติดต่อฝ่ายสนับสนุน");
    expect(support.textContent).toBe("");
    expect(support).toHaveAttribute("aria-label", "ติดต่อฝ่ายสนับสนุน");
  });
});

describe("ยุบแล้ว hover เพื่อกาง", () => {
  it("ค่าเริ่มต้นเปิดไว้ — hover แล้วเนื้อหาข้างในกลับมาเป็นแบบกาง", async () => {
    const user = userEvent.setup();
    const { container } = render(tree({ collapsed: true }));
    expect(screen.queryByText("สิทธิ์การเข้าถึง")).toBeNull();
    await user.hover(container.querySelector("aside")!);
    expect(screen.getByText("สิทธิ์การเข้าถึง")).toBeInTheDocument();
  });

  it("ปิดได้ด้วย expandOnHover={false} — hover แล้วยังยุบอยู่", async () => {
    const user = userEvent.setup();
    const { container } = render(
      tree({ collapsed: true, expandOnHover: false }),
    );
    await user.hover(container.querySelector("aside")!);
    expect(screen.queryByText("สิทธิ์การเข้าถึง")).toBeNull();
  });
});

describe("useSidebarState — หัวรางอ่านสถานะจากข้างใน", () => {
  const HeaderProbe = () => (
    <span>{useSidebarState().isCollapsed ? "มาร์ค" : "โลโก้เต็ม"}</span>
  );

  it("hover กางราง แล้วหัวรางเปลี่ยนตาม (คำนวณจากข้างนอกไม่ได้)", async () => {
    const user = userEvent.setup();
    const { container } = render(
      tree({ collapsed: true, header: <HeaderProbe /> }),
    );
    // `collapsed` ที่ส่งเข้ามายัง true อยู่ — แต่ราง**กาง**เพราะ hover
    expect(screen.getByText("มาร์ค")).toBeInTheDocument();
    await user.hover(container.querySelector("aside")!);
    expect(screen.getByText("โลโก้เต็ม")).toBeInTheDocument();
  });
});

describe("Escape ปิดลิ้นชัก", () => {
  const setViewport = (width: number) => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: width >= 1024,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
  };

  it("ต่ำกว่า lg — Escape ปิดลิ้นชัก", async () => {
    setViewport(390);
    const onMobileOpenChange = vi.fn();
    const user = userEvent.setup();
    render(tree({ mobileOpen: true, onMobileOpenChange }));
    await user.keyboard("{Escape}");
    expect(onMobileOpenChange).toHaveBeenCalledWith(false);
  });

  /* 🔴 บนเดสก์ท็อปรางกางค้างอยู่ ไม่ใช่ลิ้นชัก — Escape ที่กดปิด dialog ไม่ควรพับราง
   * แอปที่ผูก `mobileOpen` กับสวิตช์ยุบตัวเดียวกันจะโดนเต็ม ๆ */
  it("lg ขึ้นไป — Escape ไม่แตะราง", async () => {
    setViewport(1440);
    const onMobileOpenChange = vi.fn();
    const user = userEvent.setup();
    render(tree({ mobileOpen: true, onMobileOpenChange }));
    await user.keyboard("{Escape}");
    expect(onMobileOpenChange).not.toHaveBeenCalled();
  });

describe("brand — โลโก้แบบแยกชิ้น", () => {
  const brandTree = (collapsed: boolean) =>
    render(
      <Sidebar
        collapsed={collapsed}
        expandOnHover={false}
        brand={{
          symbol: <img src="/mark.svg" alt="" data-testid="symbol" />,
          name: "MEDI ACT",
          action: <button data-testid="close">x</button>,
        }}
      >
        <SidebarItem id="a" label="A" />
      </Sidebar>,
    );

  it("กางอยู่ — เห็นทั้งเครื่องหมายและชื่อ", () => {
    brandTree(false);
    expect(screen.getByTestId("symbol")).toBeInTheDocument();
    expect(screen.getByText("MEDI ACT")).toBeInTheDocument();
  });

  /* 🔴 หัวใจของ prop นี้ — แอปไม่ต้องรู้ว่าตอนยุบต้องสลับไปไฟล์โลโก้ตัวไหน
   * เดิมทุกแอปเขียน `isCollapsed ? mark : full` เองซ้ำกัน และต้องมีโลโก้ 2 ไฟล์ */
  it("ยุบอยู่ — เหลือเครื่องหมาย ชื่อกับปุ่มหาย", () => {
    brandTree(true);
    expect(screen.getByTestId("symbol")).toBeInTheDocument();
    expect(screen.queryByText("MEDI ACT")).not.toBeInTheDocument();
    expect(screen.queryByTestId("close")).not.toBeInTheDocument();
  });

  /* ผู้เรียกเดิม 2 แอปยังส่ง `header` อยู่ — ห้ามพังและต้องชนะเมื่อส่งมาทั้งคู่ */
  it("ส่ง header มาด้วย — header ชนะ", () => {
    render(
      <Sidebar
        collapsed={false}
        expandOnHover={false}
        header={<span data-testid="legacy">legacy</span>}
        brand={{ symbol: <img src="/mark.svg" alt="" data-testid="symbol" />, name: "MEDI ACT" }}
      >
        <SidebarItem id="a" label="A" />
      </Sidebar>,
    );
    expect(screen.getByTestId("legacy")).toBeInTheDocument();
    expect(screen.queryByTestId("symbol")).not.toBeInTheDocument();
  });
});
});
