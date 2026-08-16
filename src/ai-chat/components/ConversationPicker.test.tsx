import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ConversationPicker } from "./ConversationPicker";
import { defaultLabels } from "../labels";
import type { ConversationListItem } from "../api/types";

/**
 * จอประวัติต้องอยู่ได้ด้วยของที่ `GET /v2/ai/conversations` คืนจริงเท่านั้น —
 * `id` · `title | null` · `preview | null` · `createdAt`
 *
 * 🔴 สองข้อที่พังเงียบถ้าไม่ล็อกไว้:
 * ① การค้นหาไม่มี API รองรับ มันคือการกรองรายการที่โหลดมาแล้ว ⇒ เกินเพดานที่ service คืน (100) จะค้นไม่เจอ
 *    และถ้าไม่บอก ผู้ใช้จะอ่านว่า "ไม่มีบทสนทนานั้น" แทนที่จะเป็น "ค้นไม่ถึง"
 * ② การจัดกลุ่มใช้ `createdAt` = ตอน**เริ่ม** ไม่ใช่ตอนคุยล่าสุด ⇒ ป้ายต้องเขียนว่า "เริ่มวันนี้"
 *    ไม่ใช่ "วันนี้" ไม่งั้นบทที่กลับไปคุยต่อจะทำให้ป้ายกลายเป็นคำโกหก
 */
const at = (iso: string) => iso;
const today = new Date();
const todayIso = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 30).toISOString();

const items: ConversationListItem[] = [
  { id: "c1", title: "โอทีเกินเกณฑ์ วอร์ด 4", preview: "ใครทำโอทีเกิน 20 ชม.", createdAt: todayIso },
  { id: "c2", title: "จัดเวรกันยายน", preview: "ช่วยจัดเวรเดือนกันยายน", createdAt: at("2026-08-10T04:00:00.000Z") },
];

const renderPicker = (over: Partial<React.ComponentProps<typeof ConversationPicker>> = {}) =>
  render(
    <ConversationPicker
      load={() => Promise.resolve(items)}
      onPick={vi.fn()}
      activeId="c1"
      labels={defaultLabels}
      {...over}
    />,
  );

describe("ConversationPicker", () => {
  it("แยกกลุ่มด้วยวันที่ **เริ่ม** และป้ายพูดตรงตามนั้น", async () => {
    renderPicker();
    await waitFor(() => expect(screen.getByText(items[0]!.title!)).toBeTruthy());

    expect(screen.getByText(defaultLabels.historyToday)).toBeTruthy();
    expect(screen.getByText(defaultLabels.historyEarlier)).toBeTruthy();
    /* ป้ายต้องไม่อ้างว่าเป็นเวลาคุยล่าสุด — สัญญาไม่มีค่านั้นให้ */
    expect(defaultLabels.historyToday).toContain("เริ่ม");
  });

  it("ค้นหากรองจากชื่อ", async () => {
    renderPicker();
    await waitFor(() => expect(screen.getByText(items[0]!.title!)).toBeTruthy());

    fireEvent.change(screen.getByRole("searchbox", { name: defaultLabels.historySearch }), {
      target: { value: "กันยายน" },
    });

    expect(screen.queryByText(items[0]!.title!)).toBeNull();
    expect(screen.getByText(items[1]!.title!)).toBeTruthy();
  });

  /* คำค้นชุดนี้มีอยู่ใน `preview` **เท่านั้น** ไม่มีในชื่อสักบท — จงใจ
     รอบแรกเทสใช้คำว่า "กันยายน" ซึ่งอยู่ทั้งในชื่อและตัวอย่าง ⇒ ถอด `preview` ออกจากการค้นแล้วยังเขียว
     (พิสูจน์ด้วยการกลายพันธุ์) · `preview` = ข้อความแรกของผู้ใช้ ซึ่งมักเป็นคำที่คนจำได้จริงมากกว่าชื่อบท */
  it("ค้นหากรองจากข้อความตัวอย่างด้วย ไม่ใช่แค่ชื่อ", async () => {
    renderPicker();
    await waitFor(() => expect(screen.getByText(items[0]!.title!)).toBeTruthy());

    fireEvent.change(screen.getByRole("searchbox", { name: defaultLabels.historySearch }), {
      target: { value: "20 ชม." },
    });

    expect(screen.getByText(items[0]!.title!)).toBeTruthy();
    expect(screen.queryByText(items[1]!.title!)).toBeNull();
  });

  it("บอกว่า “ไม่พบ” ไม่ใช่ “ยังไม่มีบทสนทนา” เมื่อค้นแล้วไม่เจอ", async () => {
    renderPicker();
    await waitFor(() => expect(screen.getByText(items[0]!.title!)).toBeTruthy());

    fireEvent.change(screen.getByRole("searchbox", { name: defaultLabels.historySearch }), {
      target: { value: "ไม่มีคำนี้แน่นอน" },
    });

    expect(screen.getByText(defaultLabels.historyNoMatch)).toBeTruthy();
    expect(screen.queryByText(defaultLabels.emptyHint)).toBeNull();
  });

  it("เงียบเรื่องเพดานตราบใดที่ยังไม่ชน", async () => {
    renderPicker();
    await waitFor(() => expect(screen.getByText(items[0]!.title!)).toBeTruthy());
    expect(screen.queryByText(/ค้นไม่เจอ/)).toBeNull();
  });

  it("บอกเพดานเมื่อรายการชนที่ service คืนมา — ไม่ให้ผู้ใช้อ่านว่า “ไม่มี” ทั้งที่แปลว่า “ค้นไม่ถึง”", async () => {
    const capped = Array.from({ length: 100 }, (_, index) => ({
      id: `x${index}`,
      title: `บทสนทนา ${index}`,
      preview: null,
      createdAt: todayIso,
    }));
    renderPicker({ load: () => Promise.resolve(capped) });

    await waitFor(() => expect(screen.getByText("บทสนทนา 0")).toBeTruthy());
    expect(screen.getByText(/100/)).toBeTruthy();
  });

  it("ไม่พิมพ์ข้อความเดียวกันสองบรรทัดเมื่อ `title` ว่างและถูกแทนด้วย `preview`", async () => {
    renderPicker({
      load: () =>
        Promise.resolve([{ id: "c9", title: null, preview: "ขอดูเวรพรุ่งนี้", createdAt: todayIso }]),
    });

    await waitFor(() => expect(screen.getByText("ขอดูเวรพรุ่งนี้")).toBeTruthy());
    expect(screen.getAllByText("ขอดูเวรพรุ่งนี้")).toHaveLength(1);
  });
});
