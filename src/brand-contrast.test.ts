import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/* ────────────────────────────────────────────────────────────────────────────
 * ตัวอักษรบนพื้นแบรนด์ต้องอ่านออกในทุกแอป
 *
 * 🔴 `--color-brand-foreground` ถูกใช้ **13 จุด** (ปุ่ม primary · ปุ่มไอคอนแบบทึบ ·
 * Chip · Checkbox · ปฏิทิน · ฟองแชทฝั่งผู้ใช้ · ปุ่มลอยผู้ช่วย AI) และพื้นของทุกจุดคือ
 * `--color-brand` ซึ่ง **ต่างกันทั้ง 4 แอป** ⇒ ตั้งผิดที่เดียว ผิดทั้ง 13 จุดของแอปนั้น
 *
 * ก่อนมีเทสนี้ ค่าเริ่มต้นเป็นขาวตายตัว ⇒ Mediwork ได้ 1.93:1 และ Medimatch ได้ 3.34:1
 * ซึ่งตกเกณฑ์ทั้งคู่ · แล้วตอนแก้ก็เคยฮาร์ดโค้ดเป็นดำที่ฟองแชท ⇒ MediHR ตกเหลือ 1.41:1
 * — **สลับกันผิดไปมาสองรอบเพราะไม่มีอะไรวัดให้**
 *
 * เทสนี้อ่านจากไฟล์ธีมจริง ไม่ใช่ค่าที่พิมพ์ซ้ำไว้ในเทส ⇒ แก้ธีมแล้วเทสตามทันที
 * ──────────────────────────────────────────────────────────────────────────── */

const ROOT = join(import.meta.dirname, "..", "..", "..");
const APPS = ["portal", "mediwork", "medimatch", "medihr"] as const;

/** เกณฑ์ WCAG 2.1 SC 1.4.3 สำหรับข้อความขนาดปกติ */
const MIN_RATIO = 4.5;

const read = (rel: string) => readFileSync(join(ROOT, rel), "utf8");

/** คู่ `--ชื่อ: ค่า;` ทั้งหมดในไฟล์ — ใช้ทั้งกับ primitives และไฟล์ธีม */
function declMap(css: string): Map<string, string> {
  return new Map(
    [...css.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((m) => [m[1]!, m[2]!.trim()]),
  );
}

const primitives = declMap(read("packages/tokens/src/primitives.css"));
const semantic = declMap(read("packages/tokens/src/semantic.css"));

/** ไล่ `var(--x)` จนได้ hex จริง — ธีมอ้าง primitive เสมอ ไม่เขียน hex ตรง ๆ (กฎของ repo) */
function resolve(value: string, extra: Map<string, string>): string {
  let current = value;
  for (let depth = 0; depth < 5; depth++) {
    const m = current.match(/^var\((--[\w-]+)\)$/);
    if (!m) return current;
    const next = extra.get(m[1]!) ?? primitives.get(m[1]!) ?? semantic.get(m[1]!);
    if (!next) throw new Error(`ไม่พบ ${m[1]}`);
    current = next;
  }
  throw new Error(`var() ซ้อนลึกผิดปกติ: ${value}`);
}

/** ค่าความสว่างสัมพัทธ์ตามสูตรของ WCAG */
function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [
    number,
    number,
    number,
  ];
  const f = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrast(a: string, b: string): number {
  const [la, lb] = [luminance(a), luminance(b)];
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

describe("ตัวอักษรบนพื้นแบรนด์", () => {
  it.each(APPS)("%s ผ่านเกณฑ์ contrast", (app) => {
    const theme = declMap(read(`packages/tokens/src/themes/${app}.css`));
    const bg = resolve(theme.get("--color-brand")!, theme);
    /* ทุกธีม **ต้องประกาศเอง** ไม่ปล่อยให้ตกไปใช้ค่าเริ่มต้น — ค่าเริ่มต้นถูกสำหรับ
       แบรนด์เข้มและผิดสำหรับแบรนด์สว่าง ⇒ การ "ไม่ประกาศ" คือการเสี่ยงแบบเงียบ */
    const fgRaw = theme.get("--color-brand-foreground");
    expect(fgRaw, `${app}.css ไม่ได้ประกาศ --color-brand-foreground`).toBeDefined();
    const fg = resolve(fgRaw!, theme);

    const ratio = contrast(fg, bg);
    expect(
      ratio,
      `${app}: ตัวอักษร ${fg} บนพื้น ${bg} ได้ ${ratio.toFixed(2)}:1 (ต้องการ ≥ ${MIN_RATIO})`,
    ).toBeGreaterThanOrEqual(MIN_RATIO);
  });

  /* 🔴 ด่านที่จับ "แก้ทีละแอปจนสลับกันผิด" — ค่าเริ่มต้นเป็นขาว ซึ่งถ้าปล่อยให้แอปที่
     แบรนด์สว่างตกไปใช้ จะตกเกณฑ์ทันทีโดยไม่มีใครรู้ */
  it("ค่าเริ่มต้นของ semantic เป็นขาว — แอปที่แบรนด์สว่างจึงต้องทับเอง", () => {
    expect(resolve(semantic.get("--color-brand-foreground")!, new Map())).toBe("#ffffff");

    const lightBrandApps = APPS.filter((app) => {
      const theme = declMap(read(`packages/tokens/src/themes/${app}.css`));
      return contrast("#ffffff", resolve(theme.get("--color-brand")!, theme)) < MIN_RATIO;
    });
    // ณ วันที่เขียน: mediwork (มิ้นต์) กับ medimatch (ฟ้า)
    expect(lightBrandApps.length).toBeGreaterThan(0);
    for (const app of lightBrandApps) {
      const theme = declMap(read(`packages/tokens/src/themes/${app}.css`));
      expect(
        resolve(theme.get("--color-brand-foreground")!, theme),
        `${app} แบรนด์สว่างแต่ยังใช้ตัวอักษรสีขาว`,
      ).not.toBe("#ffffff");
    }
  });
});
