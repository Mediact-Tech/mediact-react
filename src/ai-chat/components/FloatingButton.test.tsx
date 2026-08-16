import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { fireEvent, render, screen } from "@testing-library/react";
import { FloatingButton } from "./FloatingButton";
import { defaultLabels } from "../labels";

/**
 * The launcher is the SECOND dismiss control on screen while the drawer is open, so it has to teach the
 * same thing the drawer's own header button does. It used to show an ✕ — two corners of the screen both
 * telling the user that leaving the panel throws the conversation away.
 */
const html = (over: Partial<Parameters<typeof FloatingButton>[0]> = {}) =>
  renderToStaticMarkup(
    <FloatingButton open onClick={vi.fn()} label={defaultLabels.minimize} position="bottom-right" {...over} />,
  );

describe("FloatingButton", () => {
  it("collapses with a chevron while the drawer is open, never an ✕", () => {
    expect(html()).toContain("lucide-chevrons-right");
    expect(html()).not.toContain("lucide-x");
  });

  it("mirrors the chevron with the drawer's side", () => {
    expect(html({ position: "bottom-left" })).toContain("lucide-chevrons-left");
  });

  /* 🔴 กลับคำจากแคปซูลมีคำ → วงกลมไอคอนล้วน (2026-08-16) เพราะแคปซูลบังจอ
     ราคาที่จ่าย: ชื่อของปุ่มต้องไปอยู่ที่ `aria-label`/`title` ให้ครบ ไม่งั้นปุ่มนี้
     จะกลายเป็นวงกลมที่ไม่มีอะไรบอกเลยว่าคืออะไร */
  it("ปิดอยู่ = ไอคอนอย่างเดียว ไม่มีคำบนตัวปุ่ม", () => {
    const closed = renderToStaticMarkup(
      <FloatingButton open={false} onClick={vi.fn()} label={defaultLabels.launcher} />,
    );
    expect(closed).toContain("lucide-sparkles");
    // ชื่อยังไปถึงผู้ใช้ได้ทั้งสองทาง
    expect(closed).toContain(`aria-label="${defaultLabels.launcher}"`);
    expect(closed).toContain(`title="${defaultLabels.launcher}"`);
    // …แต่ไม่มี element ข้อความอยู่ในปุ่ม
    expect(closed).not.toContain("<span");
  });
});

/**
 * `setPointerCapture` ไม่มีใน happy-dom — ใส่ให้เป็น no-op ที่ *จำสถานะ* เพราะตัว component
 * ใช้ `hasPointerCapture` เป็นด่านของทุก handler
 */
const stubPointerCapture = (el: HTMLElement) => {
  let captured = false;
  Object.assign(el, {
    setPointerCapture: () => {
      captured = true;
    },
    releasePointerCapture: () => {
      captured = false;
    },
    hasPointerCapture: () => captured,
  });
};

/* rect ของปุ่มตอนยังไม่ถูกลาก — ห่างขอบขวาของจอ 1024 อยู่ 24px ตรงกับค่าตั้งต้นของ
   `--mediact-ai-chat-launcher-offset` ⇒ จุดจอดที่ component ต้องคำนวณได้คือ 1024 − 56 − 24 */
const rectAt = (top: number) =>
  ({ top, left: 944, right: 1000, bottom: top + 56, width: 56, height: 56, x: 944, y: top }) as DOMRect;

/** กว้าง/สูงของจอในเทส — ตรึงไว้เพราะจุดจอดตอนเด้งกลับคำนวณจาก `innerWidth` */
const VIEWPORT = { width: 1024, height: 768 };

describe("FloatingButton — ลากแล้วเด้งกลับ", () => {
  beforeEach(() => {
    window.localStorage.clear();
    /* `Object.assign` ไม่ติดใน happy-dom — `innerWidth`/`innerHeight` เป็น getter
       ⇒ ต้อง `defineProperty` ทับ ไม่งั้นค่าเป็น 0 แล้วจุดจอดคำนวณผิดทั้งหมด */
    Object.defineProperty(window, "innerWidth", { value: VIEWPORT.width, configurable: true });
    Object.defineProperty(window, "innerHeight", { value: VIEWPORT.height, configurable: true });
  });

  /* 🔴 ต้อง stub `getBoundingClientRect` **ก่อน** `render` — component วัดระยะขอบของตัวเอง
     ใน effect ตอน mount · stub ทีหลังจะได้ rect ศูนย์ แล้วมันคิดว่าปุ่มห่างขอบ 1024px
     (เคยทำให้เทสนี้แดงด้วยเหตุผลที่ไม่เกี่ยวกับ component เลย) */
  const setup = (onClick = vi.fn()) => {
    HTMLElement.prototype.getBoundingClientRect = () => rectAt(600);
    render(<FloatingButton open={false} onClick={onClick} label={defaultLabels.launcher} />);
    const button = screen.getByRole("button");
    stubPointerCapture(button);
    return { button, onClick };
  };

  /* 🔴 ด่านที่สำคัญที่สุด — `click` ยิงหลัง `pointerup` เสมอ ⇒ ถ้าไม่กันไว้
     ผู้ใช้จะย้ายปุ่มทีไรแชทเด้งเปิดทุกที */
  it("ลากแล้วไม่นับเป็นการกด", () => {
    const { button, onClick } = setup();
    fireEvent.pointerDown(button, { pointerId: 1, button: 0, clientX: 1000, clientY: 610 });
    fireEvent.pointerMove(button, { pointerId: 1, clientX: 1000, clientY: 400 });
    fireEvent.pointerUp(button, { pointerId: 1 });
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("ขยับไม่ถึงระยะขั้นต่ำยังนับเป็นการกด — นิ้วสั่น 1-2px ระหว่างกดเป็นเรื่องปกติ", () => {
    const { button, onClick } = setup();
    fireEvent.pointerDown(button, { pointerId: 1, button: 0, clientX: 1000, clientY: 610 });
    fireEvent.pointerMove(button, { pointerId: 1, clientX: 1000, clientY: 612 });
    fireEvent.pointerUp(button, { pointerId: 1 });
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("กดเฉย ๆ ยังเปิดแชทได้", () => {
    const { button, onClick } = setup();
    fireEvent.pointerDown(button, { pointerId: 1, button: 0, clientY: 610 });
    fireEvent.pointerUp(button, { pointerId: 1 });
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  /* ⛔ ลากไปกลางจอได้ **ระหว่างจับอยู่** แต่พอปล่อยต้องเด้งกลับไปชิดขอบ
     — แผงแชทกางออกจากฝั่งเดียวกับปุ่ม ปุ่มที่จอดกลางจอจึงไม่มีที่ยืน */
  it("ระหว่างลากไปได้ทั้งสองแกน", () => {
    const { button } = setup();
    fireEvent.pointerDown(button, { pointerId: 1, button: 0, clientX: 1000, clientY: 610 });
    fireEvent.pointerMove(button, { pointerId: 1, clientX: 700, clientY: 300 });
    // จับปุ่มไว้ห่างจากขอบซ้ายของมัน 56px (1000 − 944) ⇒ ลากแล้วระยะจับต้องไม่หาย
    expect(button.style.left).toBe("644px");
    expect(button.style.top).toBe("290px");
  });

  it("ปล่อยแล้วเด้งกลับไปชิดขวา แต่ความสูงค้างไว้ตรงที่ปล่อย", () => {
    const { button } = setup();
    fireEvent.pointerDown(button, { pointerId: 1, button: 0, clientX: 1000, clientY: 610 });
    fireEvent.pointerMove(button, { pointerId: 1, clientX: 700, clientY: 300 });
    fireEvent.pointerUp(button, { pointerId: 1 });
    expect(button.style.left).toBe(`${VIEWPORT.width - 56 - 24}px`);
    expect(button.style.top).toBe("290px");
    /* 🔴 ต้องเป็น `left` ไม่ใช่ `inset-inline-end` — คนละ property ⇒ สลับกันแล้ว
       ทรานซิชันไม่ทำงาน ปุ่มจะกระโดดแทนที่จะเด้ง */
    expect(button.style.insetInlineEnd).toBe("");
    expect(button.style.insetBlockEnd).toBe("");
  });

  it("ลากเลยขอบบนแล้วยังอยู่ในจอ — ปุ่มที่หลุดออกไปกดกลับมาไม่ได้เลย", () => {
    const { button } = setup();
    fireEvent.pointerDown(button, { pointerId: 1, button: 0, clientX: 1000, clientY: 610 });
    fireEvent.pointerMove(button, { pointerId: 1, clientX: 1000, clientY: -500 });
    fireEvent.pointerUp(button, { pointerId: 1 });
    expect(button.style.top).toBe("8px");
  });

  it("จำตำแหน่งไว้หลังปล่อย", () => {
    const { button } = setup();
    fireEvent.pointerDown(button, { pointerId: 1, button: 0, clientX: 1000, clientY: 610 });
    fireEvent.pointerMove(button, { pointerId: 1, clientX: 1000, clientY: 300 });
    fireEvent.pointerUp(button, { pointerId: 1 });
    // จำแค่ความสูง — แกนนอนเด้งกลับเสมอ จำไปก็ไม่มีใครใช้
    expect(window.localStorage.getItem("mediact-ai-chat-launcher-y")).toBe("290");
  });

  it("`draggable={false}` = ลากไม่ได้เลย", () => {
    const onClick = vi.fn();
    HTMLElement.prototype.getBoundingClientRect = () => rectAt(600);
    render(<FloatingButton open={false} onClick={onClick} label={defaultLabels.launcher} draggable={false} />);
    const button = screen.getByRole("button");
    stubPointerCapture(button);
    fireEvent.pointerDown(button, { pointerId: 1, button: 0, clientX: 1000, clientY: 610 });
    fireEvent.pointerMove(button, { pointerId: 1, clientX: 700, clientY: 300 });
    fireEvent.pointerUp(button, { pointerId: 1 });
    fireEvent.click(button);
    expect(button.style.top).toBe("");
    expect(button.style.left).toBe("");
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
