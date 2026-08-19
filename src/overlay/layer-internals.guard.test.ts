import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * 🔴🔴 **overlay ทุกตัวต้องใช้ `react-focus-scope` และ `react-dismissable-layer` ก๊อป *เดียวกัน***
 *
 * ทั้งสองแพ็กเกจ **เก็บ state ไว้ระดับ module** (stack ของ focus scope · stack ของ layer +
 * ค่า `pointer-events` เดิมของ `<body>`) ⇒ ถ้า `Dialog` กับ `Popover` ได้คนละก๊อป **แต่ละก๊อปมี stack
 * ของตัวเอง มองไม่เห็นกัน** ⇒ `Dialog` ไม่รู้ว่า popover push scope เข้ามา จึงดึงโฟกัสกลับ
 *
 * อาการจริงที่เคยเกิด (Mediwork จอ "เพิ่มบุคลากร" 2026-08-19): **ช่องค้นหาของ
 * `EntityAutocomplete` ในโมดัลพิมพ์ไม่ติดเลย** — แผงเปิดสวย ตัวเลือกคลิกได้ ไม่มี error ไม่มี warning
 * · ต้นเหตุคือ popover ถูก pin เป็น `1.1.15` (focus-scope 1.1.7) ขณะที่ dialog อยู่ 1.1.17
 * (focus-scope 1.1.10) · ⚠️ **jsdom จับไม่ได้** — เทสที่ render `EntityAutocomplete` ใน `Dialog`
 * แล้วพิมพ์ **ผ่านทั้งตอนพังและตอนหายดี** ⇒ เทสนี้จึงไม่ตรวจพฤติกรรม แต่ตรวจ *เงื่อนไขที่ทำให้พัง*
 * ซึ่งเป็นสิ่งที่วัดได้จริงจาก node_modules
 *
 * ⛔ **ห้าม pin `@radix-ui/react-*` แบบ exact** — Radix pin deps ของตัวเองแบบ exact อยู่แล้ว
 * ⇒ การ pin ซ้อนอีกชั้นบังคับให้ npm/bun แตกสำเนา แล้วเงื่อนไขข้างบนก็ผิดทันที
 */
const OVERLAY_PACKAGES = [
  "@radix-ui/react-dialog",
  "@radix-ui/react-popover",
  "@radix-ui/react-select",
] as const;

const SHARED_INTERNALS = [
  "@radix-ui/react-focus-scope",
  "@radix-ui/react-dismissable-layer",
] as const;

/**
 * ⛔ **อ่านไฟล์จากดิสก์ ไม่ใช่ `require("<pkg>/package.json")`** — Radix ไม่ได้ประกาศ `./package.json`
 * ใน `exports` ⇒ resolve ไม่ผ่าน (`ERR_PACKAGE_PATH_NOT_EXPORTED`) และเทสจะแดงด้วยเหตุที่ไม่เกี่ยวกับ
 * สิ่งที่มันตรวจ — ซึ่งอันตรายกว่าไม่มีเทส เพราะคนจะถอดมันทิ้งแทนที่จะอ่าน
 */
const depVersion = (pkg: string, dep: string): string | undefined => {
  const manifest = JSON.parse(
    readFileSync(join(process.cwd(), "node_modules", pkg, "package.json"), "utf8"),
  ) as { dependencies?: Record<string, string> };
  return manifest.dependencies?.[dep];
};

describe("overlay layer internals", () => {
  it.each(SHARED_INTERNALS)("ทุก overlay ขอ %s เวอร์ชันเดียวกัน", (internal) => {
    const asked = OVERLAY_PACKAGES.map((pkg) => ({
      pkg,
      version: depVersion(pkg, internal),
    })).filter((row) => row.version !== undefined);

    /* ต้องมีของให้เทียบจริง ไม่ใช่ผ่านเพราะไม่เจออะไรเลย */
    expect(asked.length).toBeGreaterThanOrEqual(2);
    expect(new Set(asked.map((row) => row.version)).size).toBe(1);
  });
});
