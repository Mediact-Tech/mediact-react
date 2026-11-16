/**
 * ยามของเมนูโปรไฟล์ (`UserMenu`) — ทรง topbar 2026-11
 *
 * ⚠️ happy-dom ไม่คำนวณเลย์เอาต์ ⇒ ที่นี่ล็อกโครงและพฤติกรรม · หน้าตาจริงวัดใน Storybook
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserMenu, UserMenuProfileIcon } from "./TopNav";

const setup = (props: Partial<React.ComponentProps<typeof UserMenu>> = {}) => {
  const onLogout = vi.fn();
  const onProfile = vi.fn();
  render(
    <UserMenu
      label="บัญชี"
      user={{ name: "Kanit Janeen", role: "Super Admin" }}
      items={[{ label: "My Profile", icon: <UserMenuProfileIcon />, onClick: onProfile }]}
      onLogout={onLogout}
      logoutLabel="Log Out"
      {...props}
    />,
  );
  return { onLogout, onProfile, trigger: screen.getByRole("button", { name: "บัญชี" }) };
};

describe("ปุ่มบนแถบ", () => {
  it("เป็นรูปอย่างเดียว ไม่มีลูกศร", () => {
    const { trigger } = setup();
    expect(trigger.querySelector(".lucide-chevron-down")).toBeNull();
  });
});

describe("เมนูที่เปิดแล้ว", () => {
  it("หัวมีชื่อกับบทบาท · รายการมีไอคอน · ออกจากระบบอยู่แถวสุดท้าย", async () => {
    const { trigger } = setup();
    await userEvent.click(trigger);

    expect(await screen.findByText("Kanit Janeen")).toBeInTheDocument();
    expect(screen.getByText("Super Admin")).toBeInTheDocument();

    const profile = screen.getByRole("button", { name: "My Profile" });
    expect(profile.querySelector(".lucide-circle-user-round")).not.toBeNull();

    const rows = screen.getAllByRole("button").filter((b) => b !== trigger);
    expect(rows.map((b) => b.textContent)).toEqual(["My Profile", "Log Out"]);
  });

  it("กดรายการแล้วเรียก handler และเมนูปิด", async () => {
    const { trigger, onProfile, onLogout } = setup();
    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole("button", { name: "My Profile" }));
    expect(onProfile).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Kanit Janeen")).not.toBeInTheDocument();

    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole("button", { name: "Log Out" }));
    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it("`onLogout={null}` ซ่อนปุ่มออกจากระบบ", async () => {
    const { trigger } = setup({ onLogout: null });
    await userEvent.click(trigger);
    await screen.findByText("Kanit Janeen");
    expect(screen.queryByRole("button", { name: "Log Out" })).toBeNull();
  });

  /* แอปที่ยังไม่ย้ายปุ่มภาษาขึ้นแถบ — อัปเดต DS แล้วปุ่มต้องไม่หายเงียบ */
  it("`bottomLeft` (deprecated) ยังวาดสล็อตข้างปุ่มออกจากระบบ", async () => {
    const { trigger } = setup({ bottomLeft: <span>slot-ภาษา</span> });
    await userEvent.click(trigger);
    expect(await screen.findByText("slot-ภาษา")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log Out" })).toBeInTheDocument();
  });
});
