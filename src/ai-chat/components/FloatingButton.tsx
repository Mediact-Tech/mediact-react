import * as React from "react";
import { ChevronsLeft, ChevronsRight, Sparkles } from "lucide-react";
import { cn } from "../lib/cn";

export interface FloatingButtonProps {
  open: boolean;
  onClick: () => void;
  /** ชื่อของปุ่ม — ไปอยู่ที่ `aria-label` และ `title` เพราะปุ่มไม่มีคำบนตัวมันเอง */
  label: string;
  /** ฝั่งที่ปุ่ม **เด้งกลับไปเกาะ** ทุกครั้งที่ปล่อย */
  position?: "bottom-right" | "bottom-left";
  /**
   * ลากไปไหนก็ได้ · ปล่อยแล้วเด้งกลับไปชิดฝั่ง · ค่าเริ่มต้น `true`
   *
   * ปิดเมื่อโฮสต์มีเหตุผลให้ปุ่มอยู่กับที่ (เช่นจอที่สอนผู้ใช้ว่าปุ่มอยู่ตรงไหน)
   */
  draggable?: boolean;
  className?: string;
}

/** ระยะขอบขั้นต่ำจากขอบจอ — ปุ่มลากไปติดขอบจนกดยากไม่ได้ */
const EDGE_MARGIN = 8;
/** ขนาดปุ่ม (`size-14`) — ใช้คำนวณขอบเขตการลาก */
const BUTTON_SIZE = 56;
/** ระยะที่ต้องขยับก่อนจะนับว่า "ลาก" ไม่ใช่ "กด" */
const DRAG_THRESHOLD = 4;
/** ระยะห่างจากขอบตอนเด้งกลับ ถ้าวัดของจริงไม่ได้ (= `1.5rem` ของตัวแปร CSS) */
const FALLBACK_EDGE_GAP = 24;
const STORAGE_KEY = "mediact-ai-chat-launcher-y";

type Point = { x: number; y: number };

const clamp = (value: number, viewport: number) =>
  Math.min(Math.max(value, EDGE_MARGIN), Math.max(viewport - BUTTON_SIZE - EDGE_MARGIN, EDGE_MARGIN));

const readStoredY = (): number | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;
    const y = Number(raw);
    return Number.isFinite(y) ? clamp(y, window.innerHeight) : null;
  } catch {
    /* localStorage ถูกปิด (โหมดส่วนตัวบางเบราว์เซอร์) หรือค่าที่เก็บไว้เสีย
       — ตกกลับไปตำแหน่งตั้งต้น ไม่ใช่เรื่องที่ควรทำให้ปุ่มหายไปทั้งปุ่ม */
    return null;
  }
};

/**
 * The always-mounted entry point. Sits in a viewport corner on top of the host app, so it
 * carries the widget's z-index var — a host that needs it lower overrides
 * `--mediact-ai-chat-z` rather than patching the component.
 *
 * ── 🔄 วงกลมไอคอนล้วน + ลากได้อิสระ แล้วเด้งกลับไปชิดฝั่ง 2026-08-16 ────────────
 *
 * เดิมสถานะปิดเป็น **แคปซูลที่มีคำว่า "ผู้ช่วย AI"** โดยตั้งใจ — เหตุผลเดิมคือฟองแชทเปล่า ๆ
 * มุมจอในระบบโรงพยาบาลอ่านว่า "แชทฝ่ายสนับสนุน" ซึ่งไม่มีใครกดเพื่อถามว่าคืนนี้ใครขึ้นเวร
 *
 * 🔑 **กลับคำเพราะเหตุผลที่หนักกว่า: แคปซูลบังจอ** — มันกว้างพอจะทับปุ่ม/ตารางที่มุมล่างของ
 * จอที่ผู้ใช้กำลังทำงานอยู่ · สิ่งที่แลกมาคือ "ปุ่มนี้คืออะไร" ต้องมาจากทางอื่นแทน:
 * - `aria-label` + `title` ยังเป็นคำเต็ม ⇒ hover ก็เห็น · โปรแกรมอ่านหน้าจอก็ได้ยิน
 * - `Sparkles` ยังอยู่ ⇒ คนที่รู้ convention ของ AI อ่านออกทันที
 * ⚠️ **คนที่ไม่รู้ทั้งสองทางจะไม่รู้ว่าปุ่มนี้ทำอะไรจนกว่าจะกด** — เป็นราคาที่รับไว้
 *
 * 🔴 **ลากได้ทุกทิศ แต่ปล่อยแล้วเด้งกลับไปชิดฝั่งเสมอ · จำไว้แค่ความสูง**
 * ระหว่างลากปุ่มตามนิ้วอิสระเพราะนั่นคือสิ่งที่มือคาดหวัง — แต่จุดจอดต้องอยู่ที่ขอบ:
 * 1. `ChatDrawer` กางออกจาก**ฝั่งเดียวกับปุ่ม** ⇒ ปุ่มที่จอดกลางจอไม่มีความสัมพันธ์กับแผงที่มันเปิด
 *    และตอนเปิดอยู่มันคือปุ่ม "พับ" ซึ่งชี้ไปทางขอบ
 * 2. ปุ่มที่จอดกลางเนื้อหาบังหนักกว่าเดิม — ตรงข้ามกับเหตุผลที่ย่อมันลงเป็นวงกลม
 * 3. จุดจอดที่เดาได้ = ผู้ใช้หาปุ่มเจอทุกครั้งโดยไม่ต้องกวาดสายตาทั้งจอ
 *
 * 🔴 **ลากแล้วต้องไม่นับเป็นการกด** — `click` ยิงหลัง `pointerup` เสมอ ⇒ ถ้าไม่กันไว้
 * ผู้ใช้จะย้ายปุ่มทีไรแชทเด้งเปิดทุกที · กันด้วยระยะขั้นต่ำ 4px ไม่ใช่ "ขยับหรือยัง"
 * เพราะนิ้ว/เมาส์สั่น 1–2px ระหว่างกดปกติเป็นเรื่องธรรมดา
 */
export const FloatingButton = React.forwardRef<HTMLButtonElement, FloatingButtonProps>(
  function FloatingButton(
    { open, onClick, label, position = "bottom-right", draggable = true, className },
    ref,
  ) {
    /** ความสูงที่ผู้ใช้เลือก — ค่าเดียวที่ถูกจำข้ามการโหลดหน้า */
    const [top, setTop] = React.useState<number | null>(null);
    /** ตำแหน่งอิสระ **ระหว่างนิ้วยังจับอยู่เท่านั้น** · ปล่อยเมื่อไหร่กลับเป็น `null` แล้วเด้งชิดขอบ */
    const [dragPoint, setDragPoint] = React.useState<Point | null>(null);
    /** ต้องรู้ความกว้างจอ + ระยะขอบเป็น px เพื่อคำนวณจุดจอดตอนเด้งกลับ */
    const [viewportWidth, setViewportWidth] = React.useState<number | null>(null);
    const [edgeGap, setEdgeGap] = React.useState(FALLBACK_EDGE_GAP);

    const node = React.useRef<HTMLButtonElement | null>(null);
    /* จุดจับบนตัวปุ่ม + ธง "ลากไปแล้วจริง" — เป็น ref เพราะ `onClick` อ่านค่านี้ในเฟรมเดียวกัน
       ที่ `pointerup` เพิ่งเขียน · state จะยังเป็นค่าเก่าตอนนั้น */
    const grab = React.useRef<Point>({ x: 0, y: 0 });
    const moved = React.useRef(false);

    const attachRef = React.useCallback(
      (element: HTMLButtonElement | null) => {
        node.current = element;
        if (typeof ref === "function") ref(element);
        else if (ref) ref.current = element;
      },
      [ref],
    );

    /* วัดของจริง **หลัง mount** ไม่ใช่ตอน render — ค่าเริ่มต้นต้องเหมือนกันทั้งฝั่ง server
       และ client ไม่งั้น hydration ไม่ตรงกัน · ระยะขอบวัดจากตำแหน่งจริงของปุ่มตอนยังไม่ถูกลาก
       ⇒ โฮสต์ที่ทับ `--mediact-ai-chat-launcher-offset` หรือส่ง `className` ที่ขยับปุ่ม
       ก็ยังเด้งกลับไปที่เดิม**ของตัวเอง** ไม่ใช่ค่าคงที่ที่ DS เดาไว้ */
    React.useEffect(() => {
      if (!draggable) return;
      setViewportWidth(window.innerWidth);
      const rect = node.current?.getBoundingClientRect();
      if (rect) {
        const gap = position === "bottom-left" ? rect.left : window.innerWidth - rect.right;
        if (Number.isFinite(gap) && gap >= 0) setEdgeGap(gap);
      }
      setTop(readStoredY());
    }, [draggable, position]);

    /* ย่อหน้าต่างแล้วปุ่มต้องไม่หลุดออกนอกจอ — ไม่มีทางกดกลับมาได้เลยถ้าปล่อย */
    React.useEffect(() => {
      if (!draggable) return;
      const onResize = () => {
        setViewportWidth(window.innerWidth);
        setTop((current) => (current === null ? current : clamp(current, window.innerHeight)));
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }, [draggable]);

    const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
      // ปุ่มซ้าย/นิ้วเท่านั้น — คลิกขวาต้องยังเปิดเมนูของเบราว์เซอร์ได้ตามปกติ
      if (!draggable || event.button !== 0) return;
      const rect = event.currentTarget.getBoundingClientRect();
      grab.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      moved.current = false;
      /* จับ pointer ไว้กับปุ่ม ⇒ ลากออกนอกปุ่มแล้วยังตามอยู่ และได้ `pointerup` แน่นอน
         แม้ปล่อยนิ้วนอกจอ (ซึ่งเป็นวิธีที่ปุ่มลากแบบผูก event ไว้ที่ document มักค้าง) */
      event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!draggable || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
      const next = { x: event.clientX - grab.current.x, y: event.clientY - grab.current.y };
      if (!moved.current) {
        const rect = event.currentTarget.getBoundingClientRect();
        if (Math.abs(next.x - rect.left) < DRAG_THRESHOLD && Math.abs(next.y - rect.top) < DRAG_THRESHOLD)
          return;
        moved.current = true;
      }
      setDragPoint({ x: clamp(next.x, window.innerWidth), y: clamp(next.y, window.innerHeight) });
    };

    const handlePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
      event.currentTarget.releasePointerCapture(event.pointerId);
      const droppedY = dragPoint?.y ?? null;
      /* ทิ้งตำแหน่งอิสระ = แกนนอนเด้งกลับไปชิดฝั่งเอง (ทรานซิชันกลับมาทำงานเมื่อไม่ได้ลาก)
         ส่วนแกนตั้งค้างไว้ตรงที่ปล่อย แล้วจำไว้ */
      setDragPoint(null);
      if (!moved.current || droppedY === null) return;
      setTop(droppedY);
      try {
        window.localStorage.setItem(STORAGE_KEY, String(droppedY));
      } catch {
        /* จำไม่ได้ก็ไม่เป็นไร — ตำแหน่งยังอยู่จนกว่าจะโหลดหน้าใหม่ */
      }
    };

    /**
     * จุดจอดของแกนนอน — ชิดฝั่งที่ `position` กำหนดเสมอ
     *
     * 🔴 หลังผู้ใช้ลากแล้วต้องคุมด้วย `left` (ไม่ใช่ `insetInlineEnd` แบบตอนแรก) — สองอันนี้
     * เป็นคนละ property ⇒ สลับกันไปมาปุ่มจะ **กระโดด ไม่ใช่เด้ง** เพราะทรานซิชันจะทำงาน
     * ก็ต่อเมื่อค่าที่เปลี่ยนเป็น property เดียวกันทั้งก่อนและหลัง
     */
    /* ผ่าน `clamp` ด้วย — จอที่แคบกว่าปุ่ม+ขอบ (หรือสภาพแวดล้อมที่ `innerWidth` เป็น 0
       เช่นตอนเทส) จะได้ค่าติดลบ แล้วปุ่มลอยออกไปนอกจอโดยไม่มีทางกดกลับ */
    const restingLeft =
      viewportWidth === null
        ? null
        : clamp(position === "bottom-left" ? edgeGap : viewportWidth - BUTTON_SIZE - edgeGap, viewportWidth);

    const offset = "var(--mediact-ai-chat-launcher-offset, 1.5rem)";
    const placement: React.CSSProperties = dragPoint
      ? { left: dragPoint.x, top: dragPoint.y }
      : top !== null && restingLeft !== null
        ? { left: restingLeft, top }
        : {
            insetInlineEnd: position === "bottom-right" ? offset : undefined,
            insetInlineStart: position === "bottom-left" ? offset : undefined,
            insetBlockEnd: offset,
          };

    return (
      <button
        ref={attachRef}
        type="button"
        onClick={() => {
          // ลากมาแล้ว = ไม่ใช่การกด · รีเซ็ตไว้ให้การกดครั้งถัดไปทำงานปกติ
          if (moved.current) {
            moved.current = false;
            return;
          }
          onClick();
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        aria-label={label}
        // ปุ่มไม่มีคำบนตัวเอง ⇒ `title` คือทางเดียวที่ผู้ใช้เมาส์จะรู้ว่ามันคืออะไรก่อนกด
        title={label}
        aria-expanded={open}
        data-slot="ai-chat-launcher"
        style={{
          zIndex: "var(--mediact-ai-chat-z, 1310)",
          // กันเบราว์เซอร์แย่งไปเลื่อนหน้าจอตอนลากด้วยนิ้ว
          touchAction: draggable ? "none" : undefined,
          ...placement,
        }}
        className={cn(
          "group fixed flex size-14 items-center justify-center rounded-full",
          "bg-brand text-brand-foreground shadow-lg",
          "hover:bg-brand-hover hover:shadow-xl",
          "outline-none focus-visible:ring-2 focus-visible:ring-brand-active focus-visible:ring-offset-2",
          draggable && "touch-none select-none",
          /* ⛔ ไม่มี `transition` ตอนลาก — ปุ่มจะไล่ตามนิ้วช้ากว่าความจริงทันที
             และ `active:scale-95` ทำให้ปุ่มหดระหว่างลาก ซึ่งอ่านว่ากำลังกดอยู่
             ตอนปล่อย: เส้นโค้งแบบ back-out เลยขอบไปนิดแล้วดีดกลับ = "เด้ง" ที่ตาเห็นจริง
             ไม่ใช่แค่ไถลกลับ · 300ms — นานกว่านี้กลายเป็นการรอ */
          dragPoint
            ? "scale-105 cursor-grabbing shadow-xl"
            : "cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.34,1.4,0.64,1)] active:scale-95",
          className,
        )}
      >
        {open ? (
          // Matches the drawer's own header button: the same collapse chevron, pointing at the same edge.
          // Two different glyphs for one action taught two different meanings — and an ✕ taught the wrong one.
          position === "bottom-left" ? (
            <ChevronsLeft className="size-6" />
          ) : (
            <ChevronsRight className="size-6" />
          )
        ) : (
          <Sparkles className="size-6 shrink-0 transition-transform group-hover:scale-110" />
        )}
      </button>
    );
  },
);
