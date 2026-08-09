import * as React from "react";

/* ────────────────────────────────────────────────────────────────────────────
 * แช่คอลัมน์ไว้กับที่เวลาเลื่อนแนวนอน
 *
 * 🔴 **ระยะ `left`/`right` วัดจาก DOM ไม่ได้คำนวณจาก `columnDef.size`**
 *
 * เพราะ DS ตีความ `size` เป็นความกว้าง**ขั้นต่ำ** (ตามที่ของจริง 22/41 ไฟล์ทำ) —
 * คอลัมน์ที่ตั้ง `size: 200` วัดจริงได้ 211.2 และตัวที่ตั้ง 160 ได้ 168.9
 * ⇒ `column.getStart('left')` ของ TanStack ซึ่งบวก `size` ต่อกัน **ให้ค่าผิด**
 * คอลัมน์ที่สองจะแช่ทับคอลัมน์แรกโดยที่ไม่มีอะไรฟ้อง
 *
 * 🔴🔴 **บวกจาก "ความกว้าง" เท่านั้น ห้ามอ่าน `offsetLeft`**
 *
 * เจอตอนวัดจริง: พอใส่ `position: sticky` ให้เซลล์แล้ว **`offsetLeft` ของเซลล์นั้น
 * เปลี่ยนไปตามการตรึง** — คอลัมน์สุดท้ายที่อยู่ตำแหน่ง 1263 อ่านออกมาได้ `0`
 * ⇒ การวัดกินผลลัพธ์ของตัวเองเป็นอินพุต แล้ว**ลู่เข้าค่าที่ผิด**
 * (`right` ได้ 634 = 1400−766 คือความกว้างตารางลบความกว้างช่องมอง — เลขที่ดู
 *  "มีเหตุผล" พอที่จะไม่มีใครสงสัย แต่ดันคอลัมน์หลุดออกนอกจอทางซ้าย)
 *
 * `offsetWidth`/`rect.width` **ไม่ถูกกระทบ** เพราะ sticky ย้ายตำแหน่ง ไม่ได้เปลี่ยนขนาด
 * จึงบวกความกว้างสะสมเอาเอง — ไม่ขึ้นกับสถานะที่เราเพิ่งเขียนลงไป
 * ──────────────────────────────────────────────────────────────────────────── */

export type FreezeColumns = {
  /**
   * จำนวนคอลัมน์**ข้อมูล**ที่แช่ไว้ทางซ้าย (นับจาก `columns` ที่ส่งเข้ามา)
   *
   * ⚠️ ช่องติ๊กเลือกแช่ตามให้อัตโนมัติเมื่อ `left ≥ 1` — ไม่ต้องนับรวมเอง
   * (ปล่อยให้ช่องติ๊กเลื่อนหายไปขณะที่ชื่อยังอยู่ = ติ๊กแถวที่มองไม่เห็นว่าแถวไหน)
   */
  left?: number;
  /** จำนวนคอลัมน์ที่แช่ไว้ทางขวา — ปกติคือคอลัมน์ปฏิบัติการ */
  right?: number;
};

export type FrozenOffset = { side: "left" | "right"; offset: number; edge: boolean };

/** ระยะที่วัดได้ต่อคอลัมน์ · `edge` = ตัวที่ติดเนื้อตารางที่เลื่อน (ตัวที่ต้องมีเงา) */
export type FrozenOffsets = Record<string, FrozenOffset>;

/**
 * เลือกว่าคอลัมน์ไหนถูกแช่ — คืนเป็น `Set` ของ column id ต่อฝั่ง
 *
 * รับ **id ตามลำดับที่ render จริง** เพื่อไม่ต้องเดาว่าช่องติ๊กอยู่ตรงไหน
 */
export function pickFrozenIds(
  renderedIds: string[],
  freeze: FreezeColumns | undefined,
  hasSelectionColumn: boolean,
) {
  const left = new Set<string>();
  const right = new Set<string>();
  if (!freeze) return { left, right };

  /* ช่องติ๊กไม่ใช่คอลัมน์ข้อมูล — บวกเพิ่มให้เองเมื่อมีการแช่ซ้าย */
  const leftCount = freeze.left ? freeze.left + (hasSelectionColumn ? 1 : 0) : 0;
  const rightCount = freeze.right ?? 0;

  /* กันซ้อน: ตารางแคบ ๆ ที่สั่งแช่ทั้งซ้ายและขวารวมกันเกินจำนวนคอลัมน์
   * ⇒ ถ้าปล่อยไว้ คอลัมน์เดียวจะถูกแช่ทั้งสองฝั่งแล้วระยะขวาชนะ = เพี้ยนเงียบ ๆ
   * ให้ซ้ายชนะ (คอลัมน์ระบุตัวตนสำคัญกว่าคอลัมน์ปฏิบัติการ) */
  const capLeft = Math.min(leftCount, renderedIds.length);
  const capRight = Math.min(rightCount, Math.max(0, renderedIds.length - capLeft));

  renderedIds.slice(0, capLeft).forEach((id) => left.add(id));
  if (capRight > 0) renderedIds.slice(-capRight).forEach((id) => right.add(id));
  return { left, right };
}

/**
 * วัดระยะแช่จาก DOM จริง
 *
 * ต้องมี `data-col-id` บนหัวคอลัมน์ทุกอัน — ตัววัดจับคู่ด้วยค่านั้น
 */
export function useFrozenOffsets(
  tableRef: React.RefObject<HTMLTableElement | null>,
  leftIds: Set<string>,
  rightIds: Set<string>,
) {
  const [offsets, setOffsets] = React.useState<FrozenOffsets>({});
  /* key ของชุดคอลัมน์ที่แช่ — ใช้เป็น dep แทนตัว Set (Set ใหม่ทุก render) */
  const key = `${[...leftIds].join()}|${[...rightIds].join()}`;

  React.useLayoutEffect(() => {
    const table = tableRef.current;
    if (!table || (leftIds.size === 0 && rightIds.size === 0)) {
      setOffsets((prev) => (Object.keys(prev).length ? {} : prev));
      return;
    }

    const measure = () => {
      const cells = Array.from(
        table.querySelectorAll<HTMLElement>("thead th[data-col-id]"),
      );
      /* อ่าน **ความกว้าง** อย่างเดียว — ตำแหน่งของเซลล์ที่ sticky แล้วเชื่อไม่ได้
       * (`rect.width` เป็นทศนิยม ต่างจาก `offsetWidth` ที่ปัดเป็นจำนวนเต็ม —
       *  สะสมข้ามหลายคอลัมน์แล้วคลาดได้หลายพิกเซล) */
      const widths = cells.map((c) => c.getBoundingClientRect().width);
      const next: FrozenOffsets = {};
      const leftSeen: string[] = [];
      const rightSeen: string[] = [];

      cells.forEach((cell, i) => {
        const id = cell.dataset.colId;
        if (!id) return;
        if (leftIds.has(id)) {
          /* ระยะซ้าย = ความกว้างรวมของทุกคอลัมน์ก่อนหน้า */
          const offset = widths.slice(0, i).reduce((a, w) => a + w, 0);
          next[id] = { side: "left", offset, edge: false };
          leftSeen.push(id);
        } else if (rightIds.has(id)) {
          /* ระยะขวา = ความกว้างรวมของทุกคอลัมน์ที่อยู่ถัดไป */
          const offset = widths.slice(i + 1).reduce((a, w) => a + w, 0);
          next[id] = { side: "right", offset, edge: false };
          rightSeen.push(id);
        }
      });

      /* ตัวในสุดของแต่ละฝั่งคือตัวที่ติดกับเนื้อที่เลื่อน — ให้เงาเฉพาะตัวนั้น
       * (ให้ทุกตัวจะได้เงาซ้อนกันเป็นแถบเทาหนาโดยไม่ได้สื่ออะไรเพิ่ม) */
      const lastLeft = leftSeen[leftSeen.length - 1];
      const firstRight = rightSeen[0];
      if (lastLeft && next[lastLeft]) next[lastLeft].edge = true;
      if (firstRight && next[firstRight]) next[firstRight].edge = true;

      setOffsets((prev) => (sameOffsets(prev, next) ? prev : next));
    };

    measure();
    /* ตารางกว้างขึ้น/แคบลง = ระยะเปลี่ยน · เทียบก่อน setState ไม่งั้น observer วนไม่จบ */
    const ro = new ResizeObserver(measure);
    ro.observe(table);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableRef, key]);

  return offsets;
}

function sameOffsets(a: FrozenOffsets, b: FrozenOffsets) {
  const ak = Object.keys(a);
  const bk = Object.keys(b);
  if (ak.length !== bk.length) return false;
  return ak.every(
    (k) =>
      b[k] &&
      b[k]!.side === a[k]!.side &&
      b[k]!.offset === a[k]!.offset &&
      b[k]!.edge === a[k]!.edge,
  );
}

/**
 * class + style ของเซลล์ที่ถูกแช่
 *
 * 🔴 **เส้นคั่นใช้ `box-shadow` ไม่ใช่ `border`** — ตารางถูก Tailwind ตั้ง
 * `border-collapse: collapse` และเส้นขอบของเซลล์ `position: sticky` ใน
 * เบราว์เซอร์ตระกูล Chromium **ไม่ถูกวาด** ภายใต้โหมดนั้น (เส้นเป็นของตาราง ไม่ใช่ของเซลล์)
 *
 * 🔴 **พื้นหลังต้องทึบและต้องเปลี่ยนตามสถานะของแถว** — ไม่งั้นเนื้อที่เลื่อนอยู่ข้างหลัง
 * จะทะลุขึ้นมา และเวลาชี้/เลือกแถว เซลล์ที่แช่จะเป็นสีเดิมอยู่ตัวเดียวทั้งแถว
 * (ใช้ `group/row` ที่ `TableRow` เป็นตัวส่งสถานะมา)
 */
export function frozenCellProps(
  frozen: FrozenOffset | undefined,
  kind: "head" | "cell",
) {
  if (!frozen) return {};
  const shadow =
    frozen.side === "left"
      ? "shadow-[inset_-1px_0_0_0_var(--color-divider-gray)]"
      : "shadow-[inset_1px_0_0_0_var(--color-divider-gray)]";
  return {
    className: [
      "sticky z-20",
      kind === "head"
        ? "bg-bg-table-header"
        : "bg-bg-default group-hover/row:bg-bg-subtle group-data-[state=selected]/row:bg-brand-subtle",
      frozen.edge ? shadow : undefined,
    ]
      .filter(Boolean)
      .join(" "),
    style:
      frozen.side === "left"
        ? { left: frozen.offset }
        : { right: frozen.offset },
  };
}
