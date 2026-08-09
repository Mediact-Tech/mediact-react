/* ────────────────────────────────────────────────────────────────────────────
 * จัดกลุ่มตัวเลือกในลิสต์ค้นหา — ใช้ร่วมกันระหว่าง MultiAutocomplete และ
 * EntityAutocomplete เพื่อไม่ให้สองตัวจัดกลุ่มคนละแบบแล้วหน้าตาเพี้ยนกัน
 * ──────────────────────────────────────────────────────────────────────────── */

/** คืนชื่อกลุ่มของรายการหนึ่ง · คืน `null`/`undefined` = ไม่เข้ากลุ่มไหน */
export type GroupBy<T> = (item: T) => string | null | undefined;

export type OptionGroup<T> = {
  /** `null` = ก้อนที่ไม่มีหัวข้อ (รายการที่ `groupBy` ไม่จัดกลุ่มให้) */
  heading: string | null;
  items: T[];
};

/**
 * จัดรายการแบนเป็นกลุ่มตาม `groupBy`
 *
 * 🔴 **ลำดับกลุ่มเริ่มต้น = ลำดับที่เจอครั้งแรกในรายการ ไม่ใช่เรียงตามตัวอักษร**
 * เพราะผลค้นหาส่วนใหญ่มาจากหลังบ้านที่จัดอันดับความเกี่ยวข้องมาแล้ว —
 * เรียงตามตัวอักษรทับ = ทำลายอันดับนั้นเงียบ ๆ ใครอยากได้ลำดับตายตัวส่ง `groupOrder` มา
 *
 * รายการที่ไม่เข้ากลุ่มไหน (`groupBy` คืน `null`) จะอยู่**ก้อนแรกและไม่มีหัวข้อ** —
 * ตั้งใจให้อยู่บนสุดเพราะปกติคือรายการที่ตรงที่สุดหรือเพิ่งใช้ล่าสุด
 */
export function groupItems<T>(
  items: readonly T[],
  groupBy: GroupBy<T>,
  groupOrder?: readonly string[],
): OptionGroup<T>[] {
  const ungrouped: T[] = [];
  const buckets = new Map<string, T[]>();

  for (const item of items) {
    const key = groupBy(item);
    if (key == null || key === "") {
      ungrouped.push(item);
      continue;
    }
    const bucket = buckets.get(key);
    if (bucket) bucket.push(item);
    else buckets.set(key, [item]);
  }

  let headings = [...buckets.keys()];
  if (groupOrder?.length) {
    const rank = new Map(groupOrder.map((h, i) => [h, i]));
    /* กลุ่มที่ไม่อยู่ใน groupOrder ไม่ถูกทิ้ง — ต่อท้ายตามลำดับที่เจอ
     * (ทิ้งไป = ตัวเลือกหายจากจอโดยไม่มีใครรู้) */
    headings = headings.sort(
      (a, b) =>
        (rank.get(a) ?? Number.MAX_SAFE_INTEGER) -
        (rank.get(b) ?? Number.MAX_SAFE_INTEGER),
    );
  }

  const out: OptionGroup<T>[] = [];
  if (ungrouped.length) out.push({ heading: null, items: ungrouped });
  for (const heading of headings) {
    out.push({ heading, items: buckets.get(heading)! });
  }
  return out;
}

/** สไตล์หัวกลุ่มของ cmdk — ที่เดียว ทั้งสอง component ใช้ร่วมกัน */
export const GROUP_HEADING_CLASS =
  "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-caption [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-text-tertiary";
