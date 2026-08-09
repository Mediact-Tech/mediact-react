import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/* ────────────────────────────────────────────────────────────────────────────
 * ตัวสลับธีมของ Storybook ต้องตรงกับไฟล์ธีมจริง
 *
 * 🔴 ไฟล์ธีมจริงใช้ `@theme {}` ซึ่ง Tailwind ปล่อยลง `:root` เสมอ ⇒ scope ตาม
 * attribute ไม่ได้ ⇒ ถ้าอยากสลับธีมตอนรัน ต้อง**คัดลอก**ค่าไปไว้ใน `preview.css`
 *
 * การคัดลอกมีราคาเดียวคือมันดริฟต์ได้ และเมื่อดริฟต์ **Storybook จะโกหก** ว่า
 * แอปหน้าตาแบบหนึ่งทั้งที่ของจริงเป็นอีกแบบ — ซึ่งอันตรายกว่าไม่มีตัวสลับเลย
 * เทสนี้จึงเทียบทีละบรรทัด ให้การคัดลอกกลายเป็นข้อตกลงที่ถูกตรวจ
 * ──────────────────────────────────────────────────────────────────────────── */

const ROOT = join(import.meta.dirname, "..", "..", "..");
const APPS = ["portal", "mediwork", "medimatch", "medihr"] as const;

/** ดึงคู่ `--color-x: y;` ออกมาจาก CSS ก้อนหนึ่ง */
function decls(css: string) {
  return [...css.matchAll(/(--color-[\w-]+):\s*([^;]+);/g)].map(
    (m) => `${m[1]}: ${m[2]!.trim()}`,
  );
}

const previewCss = readFileSync(
  join(ROOT, "apps/storybook/.storybook/preview.css"),
  "utf8",
);

describe("ตัวสลับธีมของ Storybook", () => {
  it.each(APPS)("[data-app=%s] ตรงกับไฟล์ธีมจริงทุกบรรทัด", (app) => {
    const themeFile = readFileSync(
      join(ROOT, `packages/tokens/src/themes/${app}.css`),
      "utf8",
    );
    const block = previewCss.match(
      new RegExp(`\\[data-app="${app}"\\]\\s*\\{([^}]*)\\}`),
    );
    expect(block, `ไม่พบบล็อก [data-app="${app}"] ใน preview.css`).not.toBeNull();
    expect(decls(block![1]!)).toEqual(decls(themeFile));
  });

  /* ทั้ง 4 ต้องมีจริง ไม่งั้นแถบเครื่องมือจะมีตัวเลือกที่กดแล้วไม่เกิดอะไรขึ้น */
  it("มีครบทั้ง 4 แอป", () => {
    const found = [...previewCss.matchAll(/\[data-app="(\w+)"\]/g)].map((m) => m[1]);
    expect(new Set(found)).toEqual(new Set(APPS));
  });

  /* 🔴 ถ้าค่าถูกเขียนเป็น hex ตรง ๆ แทนที่จะอ้าง primitive มันจะดริฟต์เงียบ ๆ
   * ตอนใครแก้ค่าใน primitives.css */
  it("ทุกค่าอ้าง primitive ไม่ใช่ hex ดิบ", () => {
    const blocks = [...previewCss.matchAll(/\[data-app="\w+"\]\s*\{([^}]*)\}/g)];
    const raw = blocks
      .flatMap((b) => decls(b[1]!))
      .filter((d) => !d.includes("var(--mx-"));
    expect(raw).toEqual([]);
  });
});
