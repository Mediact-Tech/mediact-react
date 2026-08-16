import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

/* ────────────────────────────────────────────────────────────────────────────
 * ด่านกันสีดิบหลุดเข้ามาใน component
 *
 * 🔴 ทำไมต้องมี — DS ประกาศ token ทับชื่อ palette ของ Tailwind (`--color-black`
 * `--color-gray-50` `--color-gray-400` …) ⇒ class อย่าง `bg-gray-50` หรือ
 * `bg-black/5` **ไม่ได้ให้สีของ Tailwind แต่ให้ค่าของ DS โดยบังเอิญ**
 *
 *     bg-gray-50    → #fbfbfd   (ไม่ใช่ #f9fafb ของ Tailwind)
 *     text-gray-400 → #9597bd   (ม่วงอมเทา ไม่ใช่ #9ca3af)
 *
 * ⚠️ **มันไม่ได้พัง** — วัดแล้ว `hover:bg-black/5` ให้ alpha 0.05 ถูกต้อง
 * ปัญหาคือมันถูกโดยบังเอิญผ่านกลไกที่ §3 ของ CLAUDE.md บอกเองว่าเป็นบั๊ก
 * วันที่ใครลบ token ที่ชนชื่อออก สีพวกนี้จะเด้งกลับไปเป็นของ Tailwind เงียบ ๆ
 *
 * เทสนี้ตรึงจำนวนไม่ให้เพิ่ม ทางแก้ที่ถูกคือ `bg-bg-default` `bg-bg-subtle`
 * `bg-overlay-hover` `bg-overlay-press`
 * ──────────────────────────────────────────────────────────────────────────── */

const SRC = join(import.meta.dirname, ".");

function walk(dir: string, out: string[] = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(name) && !/\.(test|stories)\.tsx?$/.test(name))
      out.push(p);
  }
  return out;
}

const files = walk(SRC);
const read = (f: string) => ({ f: f.slice(SRC.length + 1), src: readFileSync(f, "utf8") });
const sources = files.map(read);

/** ตัวคูณ alpha บนสีที่ DS **ทับชื่อไว้จริง** — ได้ค่าถูก แต่ฐานสีไม่ใช่ดำจริง
 *
 * ⚠️ เดิมกฎนี้จับ `black|white` รวมกันแล้วตรึงที่ 14 ซึ่งรวมสองเรื่องเข้าด้วยกัน
 * ตรวจแล้ว: `--color-black: #191919` ถูกประกาศทับจริง (เป็นหนี้)
 * แต่ **`--color-white` ไม่ถูกประกาศที่ไหนเลย** ⇒ `white/N` ให้ `#fff` ที่ N% ตรง ๆ
 * ไม่ใช่ข้อบกพร่อง · แถบเมนูซ้ายเป็นพื้นเข้ม จึงต้องใช้ขาวหลายระดับโดยธรรมชาติ
 * ⇒ แยกกฎ แล้ว**ตรึงเลขของ `black` ให้แน่นกว่าเดิม** (8 แทนที่จะปนอยู่ใน 14) */
const ALPHA_ON_OVERRIDDEN = /(?<![\w-])(?:bg|text|border|ring)-black\/\d+/g;

/** สีดิบที่ยังเหลืออยู่ — ตรึงไม่ให้เพิ่ม */
/* `(?<![\w-])` สำคัญ — ไม่งั้นจะจับ `text-text-black` (ซึ่งเป็น token จริง)
 * ว่าเป็น `text-black` และ `bg-bg-default` ว่าเป็น `bg-default` */
const RAW_COLOR =
  /(?<![\w-])(?:bg|text|border|ring|from|to|via)-(?:gray|slate|zinc|neutral|stone|red|blue|green|yellow|amber|white|black)(?:-\d+)?(?:\/\d+)?\b/g;

describe("ด่านกันสีดิบ", () => {
  /**
   * ตัวคูณ alpha บน `black`/`white` — ตรึงไม่ให้เพิ่ม
   *
   * ⚠️ ที่เหลืออยู่ **ไม่ได้พัง** (วัดแล้วให้ alpha ถูกต้อง) แต่ฐานสีมาจาก
   * `--color-black: #191919` ที่ DS ทับไว้ ไม่ใช่ดำจริง — เป็นหนี้ที่รับรู้แล้ว
   *
   * `white/N` ไม่อยู่ในกฎนี้ — ตรวจแล้วว่า `--color-white` ไม่ถูกประกาศทับ
   */
  it("ตัวคูณ alpha บน black ต้องไม่เพิ่ม", () => {
    const hits = sources.flatMap(({ f, src }) =>
      (src.match(ALPHA_ON_OVERRIDDEN) ?? []).map((m) => `${f}: ${m}`),
    );
    expect(hits.length).toBeLessThanOrEqual(8);
  });

  /**
   * ตรึงจำนวนสีดิบที่เหลือ — **ห้ามเพิ่ม ลดได้**
   *
   * ตัวเลขนี้คือหนี้ที่รับรู้แล้ว ไม่ใช่เป้าหมาย ถ้าเทสตกเพราะเลขลดลง
   * ให้ลดตัวเลขในนี้ตาม (ดีแล้ว) · ถ้าตกเพราะเพิ่มขึ้น แปลว่ามีสีดิบใหม่หลุดเข้ามา
   */
  /**
   * `text-text-primary` = **สีแบรนด์** ไม่ใช่ "สีตัวอักษรหลัก" อย่างที่ชื่อสื่อ
   *
   * 🔴 ใน `theme.css` (ชั้นที่ DS ยังกินอยู่) token นี้ alias ไป `--color-brand`
   * ⇒ ทุก component ที่ใช้มันจะเปลี่ยนสีตามแอป และบน Mediwork ได้มิ้นต์บนขาว
   * **1.93:1 อ่านไม่ออก** · เจอมาแล้ว 10 ที่ กว่าจะรู้ก็ต่อเมื่อสลับธีมแล้ววัด
   * (หัวเรื่อง error · เซลล์ตาราง · ป้าย toggle · `FormField` · หัวและปุ่มยกเลิก
   *  ของ dialog · เมนูย่อย sidebar · ชื่อโรงพยาบาล · breadcrumb · `Text`/`Heading`
   *  · หัวการ์ด · ป้าย stepper · รายการเวลา)
   *
   * ตัดคอมเมนต์ออกก่อนนับ — ทั้งไฟล์นี้และไฟล์อื่นพูดถึงชื่อ token นี้ในคำเตือนเยอะ
   * (ตัดแบบหยาบด้วย regex พอ เพราะไม่มีสตริงไหนในโฟลเดอร์นี้มี `//` อยู่ข้างใน)
   *
   * ⚠️ 4 ที่ที่เหลือ **ตั้งใจปล่อยไว้** เพราะไม่ใช่ข้อความ:
   *   `Select` · `ComboBox` · `EntityAutocomplete` — เครื่องหมายถูกของตัวเลือกที่เลือกอยู่
   *   `TopNav` — `hover:` ของรายการในเมนูโปรไฟล์
   * ทั้งสี่เป็น affordance ที่ใช้สีแบรนด์แล้วสมเหตุสมผล · **ห้ามเพิ่ม ลดได้**
   */
  it("`text-text-primary` ไม่ถูกใช้เป็นสีข้อความอีกแล้ว", () => {
    const strip = (src: string) =>
      src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
    const hits = sources.flatMap(({ f, src }) =>
      (strip(src).match(/(?<![\w-])(?:hover:)?text-text-primary(?![\w-])/g) ?? []).map(
        (m) => `${f}: ${m}`,
      ),
    );
    expect(hits.length).toBeLessThanOrEqual(4);
  });

  it("จำนวนสีดิบที่เหลือต้องไม่เพิ่ม", () => {
    const total = sources.reduce(
      (n, { src }) => n + (src.match(RAW_COLOR) ?? []).length,
      0,
    );
    /* 161 = จำนวน ณ 2026-08-10 หลังตระกูลปฏิทิน (`Calendar` · `DateNavigator` ·
     * `DatePicker`) ขึ้นโดย **ไม่มีสีดิบเลยสักตัว** — ใช้ `bg-overlay-hover` /
     * `bg-overlay-press` / `border-border-default` / `bg-bg-default` แทนทั้งหมด
     * ที่เหลือกระจุกอยู่ที่ navigation (44) · ai-chat (45) · ปุ่มกับ chip (27)
     *
     * +3 = `bg-black` · `text-white` ใน `overlay/Tooltip.tsx` ที่ merge เข้ามาจาก main
     * (`fix(ui): a tooltip reads as a neutral hint, not a brand surface`) — **ไม่ใช่หนี้
     * ที่เพิ่งก่อในสาขานี้ แต่เป็นของที่ไหลเข้ามาพร้อม merge**
     *
     * ทำไมไม่แก้ให้จบตรงนี้: ทางแก้ที่ถูกคือเพิ่ม `--color-bg-inverse` เข้า semantic layer
     * แล้วใช้ `bg-bg-inverse text-text-inverse` — แต่ **3 ใน 4 แอปยังไม่ import token ของ DS**
     * ⇒ tooltip จะกลายเป็นพื้นโปร่งทันทีในวันที่เปลี่ยน · ทำได้เมื่อแอปย้ายมากิน
     * `@mediact/react/tokens.css` แล้ว และตอนนั้นให้ลดเลขนี้กลับเป็น 161
     *
     * +2 = `bg-white/20` (ฉากหลัง) กับ `bg-white` (พื้นหน้าต่าง) ใน `overlay/AppShowcaseDialog.tsx`
     * · **ตัวอักษรบนปุ่มแบรนด์ใช้ `text-text-inverse` แล้ว** ตามแบบแผนของ `ContactSupportDialog`
     *   จึงไม่ได้เพิ่มอีก 2 ตัวอย่างที่เขียนครั้งแรก
     * · สองตัวที่เหลือติดกับดักเดียวกับ tooltip เป๊ะ — ฉากหลังของแบบนี้เป็น **ขาว 20% + เบลอ**
     *   (Figma `Rectangle 23`) ไม่ใช่ฉากมืด และ `Dialog.tsx` เองก็ใช้ `bg-white` อยู่แล้ว
     *   ⇒ เปลี่ยนเป็น token วันนี้ = หน้าต่างพื้นโปร่งใน 3 แอปที่ยังไม่กิน token
     *   ลดกลับพร้อมกับ tooltip ในวันที่ทุกแอปย้ายมากิน `@mediact/react/tokens.css`
     *
     * **−35 = 131 (2026-08-16)** — รอบปรับหน้าตาแชท: ไฟล์ที่แตะทั้ง 5 ตัวของ `ai-chat/components`
     * (`MessageBubble` · `MessageList` · `Composer` · `ConversationPicker` · `ChatDrawer`)
     * เหลือสีดิบ **0** แล้ว · ทั้งหมดเป็นการแทนด้วย token ที่ค่าเท่ากันหรือถูกความหมายกว่า ไม่ใช่การเปลี่ยนดีไซน์:
     *   `bg-white` → `bg-bg-default` (#ffffff เท่ากัน) · `bg-gray-50` → `bg-bg-subtle` (#fbfbfd เท่ากัน)
     *   `text-black` → `text-text-black` (#191919 เท่ากัน) · `bg-gray-100/200` → `bg-overlay-hover/press`
     *   `text-gray-400` → `text-text-tertiary` (#9597bd → #9b9b9b — DS ทับ `gray-400` เป็นม่วงอมเทาไว้
     *      ซึ่งเป็นสีที่ "ถูกโดยบังเอิญ" ตามที่หัวไฟล์นี้อธิบาย · tertiary คือสีที่ตั้งใจ)
     *   `text-gray-500/600/700` → `text-text-body` (#535a61)
     * ⇒ ตอนนี้ `ai-chat/components` เป็นโฟลเดอร์ที่สองต่อจากตระกูลปฏิทินที่สะอาดทั้งโฟลเดอร์ */
    expect(total).toBeLessThanOrEqual(131);
  });

  /* ไฟล์ที่ทำความสะอาดแล้ว ห้ามถอยกลับ */
  it("ไฟล์ตระกูลฟอร์มกับตารางต้องไม่มีสีดิบเลย", () => {
    const clean = [
      "ui/Select.tsx",
      "ui/Input.tsx",
      "ui/Textarea.tsx",
      "form/ComboBox.tsx",
      "form/EntityAutocomplete.tsx",
      "form/FloatingFieldShell.tsx",
      "data/DataTable.tsx",
      "data/Table.tsx",
      "feedback/EmptyState.tsx",
    ];
    const dirty = sources
      .filter(({ f }) => clean.includes(f))
      .flatMap(({ f, src }) =>
        (src.match(RAW_COLOR) ?? []).map((m) => `${f}: ${m}`),
      );
    expect(dirty).toEqual([]);
  });
});
