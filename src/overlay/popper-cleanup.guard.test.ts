import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

/**
 * 🔴🔴 **popper ที่ติดตั้งอยู่ต้องไม่มี `setState` ใน cleanup ของ `useLayoutEffect`**
 *
 * `@radix-ui/react-popper` **1.3.x** เขียนไว้ว่า
 * ```js
 * useLayoutEffect(() => { setPlacementState(placement); return () => setPlacementState(void 0) })
 * ```
 * ⇒ เมื่อแผงหนึ่ง unmount พร้อมกับที่มีอะไร re-render ในคอมมิตเดียวกัน (สลับแผงของสองช่อง ·
 * ปิดโมดัลขณะแผงเปิด · subtree ถูกลบทั้งก้อน) cleanup จะยิง `setState` ระหว่างที่ fiber กำลังถูกลบ
 * ⇒ **`Maximum update depth exceeded`** · effect นี้ **ไม่มีใน 1.2.8**
 *
 * 🔑 **เทสนี้ตรวจ *เงื่อนไข* ไม่ใช่ *เลขเวอร์ชัน*** — ตั้งใจให้เป็นแบบนี้: วันที่ Radix แก้ต้นน้ำแล้ว
 * เทสจะเขียวเองกับเวอร์ชันใหม่ ⇒ เป็นสัญญาณว่า **ถอน `overrides` ได้แล้ว** ⛔ ถ้าเทียบเลขเวอร์ชัน
 * จะต้องมาแก้เทสเองทุกครั้งและไม่มีใครรู้ว่าเมื่อไหร่ปลอดภัย
 *
 * ⚠️ **`overrides` ที่ repo นี้ประกาศไม่มีผลกับแอป** — npm เมินค่าที่มาจาก dependency
 * ⇒ ทุกแอปที่ใช้ DS ต้องประกาศ `overrides` ของตัวเอง และควรมีเทสทำนองนี้ฝั่งแอปด้วย
 * ⚠️ **bun ต้อง `bun install --force`** ถึงจะ re-link store entry — `bun install` เฉย ๆ ไม่ขยับ
 *    (เจอจริง 2026-08-19: ใส่ `overrides` แล้ว store ยังชี้ 1.3.7 อยู่ ⇒ อาการไม่หาย)
 */
const OFFENDING = /setPlacementState\(\s*(?:void 0|undefined)\s*\)/;

/** เวอร์ชันที่รู้แน่ว่าไม่มี effect ตัวปัญหา — ใช้เป็นค่าที่ `overrides` ต้องตรึงไว้ */
const PINNED = "1.2.8";

describe("react-popper cleanup", () => {
  /**
   * ด่าน ① — **ไม่พึ่ง `node_modules` เลย** ⇒ รันที่ไหนก็ได้ผลเดียวกัน
   *
   * 🔴 เหตุที่ต้องมีด่านนี้: ด่าน ② อ่านของที่ *ติดตั้งอยู่* ⇒ ผลขึ้นกับสถานะ install ตอนนั้น
   * (รันคาบกับ `bun install` แล้ว symlink หายชั่วขณะ = แดงโดยที่โค้ดไม่ผิดอะไร — เกิดจริง
   * 2026-08-20) ⇒ สิ่งที่เราคุมได้จริงคือ *สิ่งที่ประกาศไว้* ไม่ใช่สิ่งที่เผอิญถูกวางลงดิสก์
   */
  it("root package.json ยังตรึง overrides ของ popper อยู่", () => {
    /**
     * 🔴 **ห้ามใช้ `new URL(relative, import.meta.url)` ในไฟล์เทส** — environment เป็น happy-dom
     * ซึ่งทับ `URL` ของ node ด้วย DOM URL ⇒ resolve ได้ `http://localhost:3000/@fs/…`
     * แล้ว `fileURLToPath` โยน *The URL must be of scheme file* (วัดจริง 2026-08-20)
     * ⇒ ใช้ `node:path` กับ path ล้วนเท่านั้น
     */
    const selfDir = dirname(fileURLToPath(import.meta.url));
    const root = resolve(selfDir, "../../../../package.json");
    const pkg = JSON.parse(readFileSync(root, "utf8")) as {
      overrides?: Record<string, string>;
    };
    expect(pkg.overrides?.["@radix-ui/react-popper"]).toBe(PINNED);
  });

  it("ไม่มี setState ใน cleanup ของ useLayoutEffect (ต้นเหตุของ Maximum update depth)", () => {
    /**
     * ด่าน ② — **ใช้ resolver ของ node ⛔ ไม่เดินดูโฟลเดอร์เอง**
     *
     * เวอร์ชันก่อนหน้าไล่ `node_modules` ขึ้นไปทีละชั้นเอง ซึ่งผิดสองรอบด้วยเหตุคนละอย่าง:
     * รอบแรกผูกกับ `process.cwd()` (รันคนละที่ = คนละผล) · รอบสองยังผูกกับ *layout* ของ
     * ตัวจัดแพ็กเกจ (hoist/nested/symlink เข้า store ของ bun)
     * 🔑 `createRequire` ถามด้วยอัลกอริทึมเดียวกับที่โค้ดจริง import ⇒ ได้ไฟล์ที่ *ถูกใช้จริง*
     *    ไม่ใช่ไฟล์ที่เผอิญมีอยู่ตามทาง
     */
    const requireFrom = createRequire(import.meta.url);

    let entry: string;
    try {
      entry = requireFrom.resolve("@radix-ui/react-popper");
    } catch {
      /* ⛔ ห้ามข้ามเงียบ — แต่ข้อความต้องบอกทางแก้ ไม่ใช่ `expected 0 to be greater than 0` */
      throw new Error(
        "resolve `@radix-ui/react-popper` ไม่ได้ — ยังไม่ได้ติดตั้ง หรือ install ค้างกลางทาง ⇒ รัน `bun install` ที่ root ก่อน",
      );
    }

    /* dist มีทั้ง cjs (`index.js`) และ esm (`index.mjs`) — resolver คืนตัวใดตัวหนึ่ง อ่านทั้งคู่ที่มี */
    const candidates = [entry, entry.replace(/\.js$/, ".mjs"), entry.replace(/\.mjs$/, ".js")];
    const files = [...new Set(candidates)].filter((path) => existsSync(path));
    expect(files.length).toBeGreaterThan(0);

    const offenders = files.filter((path) => OFFENDING.test(readFileSync(path, "utf8")));
    expect(offenders).toEqual([]);
  });
});
