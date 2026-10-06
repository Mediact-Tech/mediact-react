/** @doc ./option-list.md */
import * as React from "react";
import { Checkbox } from "../ui/Checkbox";
import { toggleLabelClasses } from "../ui/toggle-parts";

/* ────────────────────────────────────────────────────────────────────────────
 * "เลือกทั้งหมด" ของลิสต์เลือกหลายอัน — ใช้ร่วมกันทั้ง `ComboBox` และ `EntityAutocomplete`
 *
 * แยกออกมาตั้งแต่ตัวแรก ไม่ใช่รอให้ตัวที่สองลอก — สองตัวนี้ลอก footer กันมาแล้ว
 * และเพี้ยนออกจากกันแล้ว (ปุ่ม Clear ของตัวหนึ่งมีไอคอน X อีกตัวไม่มี)
 *
 * แต่ละ component ตอบแค่คำถามเดียว: **"ตอนนี้ตัวไหนมองเห็นและเลือกได้"** (`targets`)
 * ที่เหลือ — prop · ป้าย · สถานะ ✓/−/ว่าง · ค่าหลังกด · เพดาน `maxItems` — อยู่ที่นี่ที่เดียว
 * ──────────────────────────────────────────────────────────────────────────── */

/** prop ชุดเดียวที่ทั้ง `ComboBox` และ `EntityAutocomplete` รับ (มีผลเฉพาะ `multiple`) */
export type SelectAllProps = {
  /**
   * แถว "เลือกทั้งหมด" ใต้ช่องค้นหา — ติดอยู่กับที่ ไม่เลื่อนตามลิสต์
   *
   * - เลือกเฉพาะตัวที่ **มองเห็นตามคำค้นตอนนี้** — ค้น "ward A" แล้วกด ได้แค่ ward A
   * - ข้ามตัวที่ `disabled` · ไม่แตะตัวที่ล็อก
   * - กดตอนครบแล้ว = ถอดเฉพาะตัวที่มองเห็น ตัวที่เลือกไว้นอกคำค้นยังอยู่
   * - เลือกต่อแล้วเกิน `maxItems` = กดไม่ได้ พร้อมบอกเพดาน (ไม่เลือกให้ครึ่ง ๆ)
   *
   * ⚠️ `EntityAutocomplete`: "ทั้งหมด" = ทั้งหมดที่หลังบ้านคืนมาหน้านี้ ไม่ใช่ทั้งฐานข้อมูล
   *
   * ปิดเป็นค่าเริ่มต้น — บางลิสต์การเลือกทั้งหมดไม่มีความหมาย
   */
  selectAll?: boolean;
  /** ป้ายของแถว · ค่าเริ่มต้น `"Select all"` */
  selectAllLabel?: string;
  /** ป้ายตอนกำลังค้นหา — ได้จำนวนที่เลือกได้ในผลค้น · ค่าเริ่มต้น `Select all N results` */
  selectAllMatchesLabel?: (count: number) => string;
  /** บอกเพดานตอนแถวกดไม่ได้เพราะ `maxItems` · ค่าเริ่มต้น `Max N` */
  selectAllMaxLabel?: (max: number) => string;
};

/* ข้อความตั้งต้นภาษาอังกฤษ ตามข้อความตั้งต้นอื่นของ field (`"No results found."`) */
export const defaultSelectAllLabel = "Select all";
export const defaultSelectAllMatchesLabel = (count: number) =>
  `Select all ${count} results`;
export const defaultSelectAllMaxLabel = (max: number) => `Max ${max}`;

export type SelectAllState = boolean | "indeterminate";

export type SelectAllModel<T> = {
  /** ✓ = เป้าหมายถูกเลือกครบ · − = บางส่วน · ว่าง = ยังไม่มีสักตัว */
  state: SelectAllState;
  /**
   * กดไม่ได้ — เลือกต่อแล้วจะเกิน `maxItems`
   *
   * ⛔ ไม่เลือก "เท่าที่ใส่ได้" — ผู้ใช้กด "ทั้งหมด" แล้วได้บางส่วนโดยไม่รู้ว่าตัวไหนตกหล่น
   * ⚠️ ตอนเลือกครบแล้ว (`state === true`) ยังกดถอดได้เสมอ — ถอดไม่มีวันเกินเพดาน
   */
  disabled: boolean;
  /** ค่าที่เลือกทั้งหมดหลังกด — ส่งให้ `setSelected` **ครั้งเดียว** */
  toggle: () => T[];
};

/**
 * @param targets ตัวที่มองเห็นในลิสต์ตอนนี้ (ตามคำค้น) **ที่เลือกได้** — ผู้เรียกต้องตัด
 *   `disabled` และตัวที่ล็อกออกเอง · ตัวที่ล็อกถูกเลือกอยู่แล้วโดยนิยามและถอดไม่ได้
 *   ⇒ ไม่ตัดออกเมื่อไหร่ "ถอดทั้งหมด" จะกลายเป็นทางที่สี่ที่ทะลุล็อกได้
 * @param selected ค่าที่เลือกอยู่ทั้งหมด — รวมตัวที่อยู่นอกคำค้นด้วย
 */
export function selectAllModel<T>(
  targets: T[],
  selected: T[],
  keyOf: (item: T) => string,
  maxItems?: number,
): SelectAllModel<T> {
  /* `seen` เริ่มจากของที่เลือกอยู่ ⇒ กันทั้งซ้ำกับของเดิม และซ้ำกันเองใน `targets`
   * (หลังบ้านคืน key ซ้ำมาได้ — ไม่กันไว้ ตัวเดียวกันจะถูกเติมสองรอบ) */
  const seen = new Set(selected.map(keyOf));
  const missing = targets.filter((t) => {
    const k = keyOf(t);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  const state: SelectAllState =
    missing.length === 0
      ? true
      : missing.length < targets.length
        ? "indeterminate"
        : false;

  return {
    state,
    disabled:
      state !== true &&
      maxItems != null &&
      selected.length + missing.length > maxItems,
    toggle: () => {
      if (state === true) {
        /* ถอดเฉพาะเป้าหมาย — ตัวที่เลือกไว้แต่อยู่นอกคำค้น ผู้ใช้มองไม่เห็นตอนกด
         * ⇒ ห้ามหายไปด้วย */
        const targetKeys = new Set(targets.map(keyOf));
        return selected.filter((s) => !targetKeys.has(keyOf(s)));
      }
      /* ต่อท้ายของเดิม ไม่เรียงใหม่ — chip ที่โชว์อยู่ (`maxVisibleChips`) ต้องไม่สลับที่ */
      return [...selected, ...missing];
    },
  };
}

/**
 * แถว "เลือกทั้งหมด" — วางระหว่างช่องค้นหากับ `Command.List`
 * ไม่มีอะไรให้เลือก (`targets` ว่าง) หรือไม่ได้เปิด `selectAll` = ไม่ render อะไรเลย
 *
 * 📌 **อยู่นอก `Command.List` โดยเจตนา**
 * - List คือกล่องที่เลื่อน ⇒ แถวนี้ติดอยู่กับที่โดยโครงสร้าง ไม่ต้องพึ่ง `sticky`
 * - ถ้าเป็น `Command.Item` ใน List: ตอนค้นหา cmdk จะเรียง DOM ใหม่ตามคะแนน และแถวนี้
 *   ได้ 0 คะแนน ⇒ ถูกย้ายไปท้ายลิสต์
 * 💰 ราคาที่รับ: ลูกศรขึ้น/ลงไม่วิ่งมาที่แถวนี้ — เข้าถึงด้วย Tab จากช่องค้นหาแล้วกด Space
 *
 * ใช้ `Checkbox` ของ DS เพราะต้องมีสถานะ "บางส่วน" — แถวตัวเลือกใช้แค่ ✓ ได้เพราะไม่มีสถานะนั้น
 * กล่องอยู่**ขวา** (ไม่ใช้ `label` ของ `Checkbox` ที่วางกล่องซ้าย) ให้ตรงแนวกับ ✓ ของแถวข้างล่าง
 */
export function SelectAllRow<T>({
  selectAll,
  selectAllLabel = defaultSelectAllLabel,
  selectAllMatchesLabel = defaultSelectAllMatchesLabel,
  selectAllMaxLabel = defaultSelectAllMaxLabel,
  targets,
  selected,
  keyOf,
  maxItems,
  searching,
  onChange,
}: SelectAllProps & {
  /** ดู `selectAllModel` — ผู้เรียกส่ง `[]` เมื่อไม่ควรโชว์ (กำลังโหลด / ค้นพัง) */
  targets: T[];
  selected: T[];
  keyOf: (item: T) => string;
  maxItems?: number;
  /** มีคำค้นอยู่ ⇒ ใช้ป้ายแบบบอกจำนวน */
  searching: boolean;
  /** ค่าที่เลือกทั้งหมดหลังกด — ยิงครั้งเดียวต่อการกด */
  onChange: (next: T[]) => void;
}) {
  const id = React.useId();
  const capId = `${id}-cap`;
  if (!selectAll || targets.length === 0) return null;

  const model = selectAllModel(targets, selected, keyOf, maxItems);
  /* 🔴 กดไม่ได้ต้องบอกเหตุผล — footer `N / max` โผล่เฉพาะตอนมีค่าที่เลือกแล้ว
   * ⇒ เปิดแผงครั้งแรกกับ `maxItems` ที่ต่ำกว่าจำนวนตัวเลือก ผู้ใช้จะเห็นแค่แถวจาง ๆ
   * ไม่มีอะไรบนจอบอกว่าทำไม · ข้อความนี้ไม่จางตาม (อยู่นอก `<label>`) และใช้
   * `text-text-body` ไม่ใช่ `tertiary` ที่วัดได้ 2.78:1 ไม่ผ่าน */
  const showCap = model.disabled && maxItems != null;

  return (
    /* `px-3` = `p-1` ของ List + `px-2` ของแถว ⇒ ข้อความและกล่องติ๊กตรงแนวกับแถวข้างล่าง */
    <div className="flex items-center justify-between gap-2 border-b border-border-default px-3 py-1.5">
      <span className="flex min-w-0 items-baseline gap-2">
        <label htmlFor={id} className={toggleLabelClasses(model.disabled)}>
          {searching ? selectAllMatchesLabel(targets.length) : selectAllLabel}
        </label>
        {showCap && (
          <span id={capId} className="text-caption text-text-body">
            {selectAllMaxLabel(maxItems)}
          </span>
        )}
      </span>
      <Checkbox
        id={id}
        size="sm"
        checked={model.state}
        disabled={model.disabled}
        aria-describedby={showCap ? capId : undefined}
        /* ไม่ใช้ค่าที่ Radix ส่งมา — จาก "บางส่วน" Radix จะไป `true` แต่เราต้องคำนวณ
         * จากเป้าหมายจริงเสมอ (`toggle` ข้างบน) */
        onCheckedChange={() => onChange(model.toggle())}
      />
    </div>
  );
}
