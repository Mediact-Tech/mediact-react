import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * 🔴🔴 **popper ที่ใช้อยู่ต้องไม่มี `setState` ใน cleanup ของ `useLayoutEffect`**
 *
 * `@radix-ui/react-popper` **1.3.x** เขียนไว้ว่า
 * ```js
 * useLayoutEffect(() => { setPlacementState(placement); return () => setPlacementState(void 0) })
 * ```
 * ⇒ เมื่อแผงหนึ่ง unmount พร้อมกับที่มีอะไร re-render ในคอมมิตเดียวกัน (สลับแผงของสองช่อง ·
 * ปิดโมดัลขณะแผงเปิด · subtree ถูกลบทั้งก้อน) cleanup ยิง `setState` ระหว่างที่ fiber กำลังถูกลบ
 * ⇒ **`Maximum update depth exceeded`** · effect นี้ **ไม่มีใน 1.2.8**
 *
 * ⚠️ **`overrides` ที่ repo นี้ประกาศไม่มีผลกับแอป** — npm เมินค่าที่มาจาก dependency
 * ⇒ ทุกแอปที่ใช้ DS ต้องประกาศ `overrides` ของตัวเอง
 * ⚠️ **bun ต้อง `bun install --force`** ถึงจะ re-link store entry — `bun install` เฉย ๆ ไม่ขยับ
 *    (เจอจริง 2026-08-19: ใส่ `overrides` แล้ว store ยังชี้ 1.3.7 ⇒ อาการไม่หาย)
 *
 * ═══ ประวัติของไฟล์นี้ อ่านก่อนแก้ ═══
 * ด่านนี้ล้ม **3 รอบเพราะสภาพแวดล้อม ไม่ใช่เพราะ popper สักรอบ**:
 *   ① ผูกกับ `process.cwd()` ⇒ รันคนละที่ = คนละผล
 *   ② เดินดู `node_modules` เอง ⇒ ผูกกับ layout ของตัวจัดแพ็กเกจ (hoist/nested/store ของ bun)
 *   ③ `createRequire` อย่างเดียว ⇒ ล้มไม่คงที่ตอนรันชุดเต็ม แล้ว `catch` กลืนเหตุจริงทิ้ง
 *      รายงานว่า *"ยังไม่ได้ติดตั้ง"* ซึ่งไม่จริง
 * 🔑 บทเรียน: **แยก "สัญญา" ออกจาก "สภาพการติดตั้ง"**
 *   ด่าน ① = สัญญา (อ่าน `package.json` · deterministic · ต้องเขียวทุกที่เสมอ)
 *   ด่าน ② = ของที่ถูกวางลงดิสก์ (อาจไม่มีให้ตรวจ ⇒ **skip ไม่ใช่ fail**)
 * ⛔ อย่าทำให้ด่าน ② fail เมื่อหาไฟล์ไม่เจอ — ที่เสียไปคือเวลาของคนอ่าน ไม่ใช่บั๊กที่ถูกจับได้
 */
const OFFENDING = /setPlacementState\(\s*(?:void 0|undefined)\s*\)/;

/** เวอร์ชันที่รู้แน่ว่าไม่มี effect ตัวปัญหา — ค่าที่ `overrides` ต้องตรึงไว้ */
const PINNED = "1.2.8";
const PKG = "@radix-ui/react-popper";

/**
 * 🔴 **ห้ามใช้ `new URL(relative, import.meta.url)` ในไฟล์เทส** — environment เป็น happy-dom
 * ซึ่งทับ `URL` ของ node ด้วย DOM URL ⇒ resolve ได้ `http://localhost:3000/@fs/…`
 * แล้ว `fileURLToPath` โยน *The URL must be of scheme file* (วัดจริง 2026-08-20)
 * ⇒ ใช้ `node:path` กับ path ล้วนเท่านั้น
 */
const selfDir = dirname(fileURLToPath(import.meta.url));

describe("react-popper cleanup", () => {
  it("root package.json ยังตรึง overrides ของ popper อยู่", () => {
    const pkg = JSON.parse(
      readFileSync(resolve(selfDir, "../../../../package.json"), "utf8"),
    ) as { overrides?: Record<string, string> };
    expect(pkg.overrides?.[PKG]).toBe(PINNED);
  });

  it("dist ที่ติดตั้งอยู่ไม่มี setState ใน cleanup (ข้ามถ้าไม่มีไฟล์ให้ตรวจ)", (ctx) => {
    /* ไต่ขึ้นจากไฟล์เทสเอง — ไม่พึ่ง cwd และไม่พึ่ง resolver (สองอย่างที่ทำให้ล้มมาแล้ว) */
    const files: string[] = [];
    for (let dir = selfDir, up = 0; up < 8; up += 1) {
      for (const name of ["index.mjs", "index.js"]) {
        const path = join(dir, "node_modules", PKG, "dist", name);
        if (existsSync(path)) files.push(path);
      }
      const parent = dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }

    if (files.length === 0) {
      /* ⛔ ไม่ fail — ยังไม่ได้ติดตั้ง/install ค้าง ไม่ใช่บั๊กของโค้ด · ด่าน ① ถือสัญญาไว้แล้ว */
      ctx.skip();
      return;
    }

    expect(files.filter((path) => OFFENDING.test(readFileSync(path, "utf8")))).toEqual([]);
  });
});
