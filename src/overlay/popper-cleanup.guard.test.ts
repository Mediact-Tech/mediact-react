import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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

describe("react-popper cleanup", () => {
  it("ไม่มี setState ใน cleanup ของ useLayoutEffect (ต้นเหตุของ Maximum update depth)", () => {
    /* 🔴 **ต้องกวาดทั้ง store ระดับ workspace ด้วย** — bun วางก๊อปจริงไว้ที่ `.bun` ของ root
       (path ที่โผล่ใน stack trace ของผู้ใช้คือก๊อปนั้น) ⇒ มองแค่ `node_modules` ของแพ็กเกจนี้
       จะพลาดตัวที่กำลังพังอยู่ · หลายราก = ครอบทั้ง bun (store) และ npm (nested/hoisted) */
    /**
     * 🔑 **ตรวจเฉพาะก๊อปที่ overlay ไปถึงได้จริงตอนรัน** ⛔ ไม่ใช่ทุก entry ใน store ของ bun
     *
     * store เก็บก๊อปที่ไม่มีใครใช้แล้วค้างไว้ด้วย (เจอจริง: `react-popper@1.3.7` ลิงก์หาตัวเองอยู่
     * โดยไม่มีแพ็กเกจไหนชี้มา) ⇒ ถ้าไล่ทั้ง store เทสจะแดงเพราะขยะ ไม่ใช่เพราะของที่รันอยู่
     * ⇒ เดินจาก overlay แต่ละตัวไปหา popper ที่ *มันเห็น* แบบเดียวกับที่ resolver ทำ
     */
    const OVERLAYS = [
      "@radix-ui/react-popover",
      "@radix-ui/react-select",
      "@radix-ui/react-tooltip",
      "@radix-ui/react-menu",
    ];

    /**
     * 🔴 **ไล่จากตำแหน่งของไฟล์เทสเอง ⛔ ไม่ใช่ `process.cwd()`**
     *
     * เดิมใช้ path แบบ relative กับ cwd ⇒ รันตรงจาก `packages/react` ผ่าน แต่พอรันผ่าน script ของ
     * workspace (cwd เป็นที่อื่น) หาไฟล์ไม่เจอเลยแล้วล้มที่ด่าน "ต้องเจอไฟล์จริง" — เทสที่ผล
     * ขึ้นกับว่าใครสั่งรันจากไหน คือเทสที่เชื่อไม่ได้
     * 🔑 ไต่ขึ้นจากไฟล์นี้ไปหาทุก `node_modules` ที่มีอยู่ตามทาง = เลียนแบบสิ่งที่ resolver ทำจริง
     * ⇒ ครอบทั้ง layout ของ npm (hoist/nested) และของ bun (symlink เข้า store)
     */
    const here = dirname(fileURLToPath(import.meta.url));
    const roots: string[] = [];
    for (let dir = here, up = 0; up < 8; up += 1) {
      const candidate = join(dir, "node_modules");
      if (existsSync(candidate)) roots.push(candidate);
      const parent = dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }

    const popperDistIn = (root: string, pkg: string): string | null => {
      const nested = join(root, pkg, "node_modules", "@radix-ui", "react-popper", "dist", "index.mjs");
      if (existsSync(nested)) return nested;
      const hoisted = join(root, "@radix-ui", "react-popper", "dist", "index.mjs");
      return existsSync(hoisted) ? hoisted : null;
    };

    const dists = [
      ...new Set(
        roots.flatMap((root) =>
          OVERLAYS.map((pkg) => popperDistIn(root, pkg)).filter((path): path is string => path !== null),
        ),
      ),
    ];

    /* ต้องเจอไฟล์จริง ไม่ใช่ผ่านเพราะไม่มีอะไรให้ตรวจ */
    expect(dists.length).toBeGreaterThan(0);

    const offenders = dists.filter((path) => OFFENDING.test(readFileSync(path, "utf8")));
    expect(offenders).toEqual([]);
  });
});
