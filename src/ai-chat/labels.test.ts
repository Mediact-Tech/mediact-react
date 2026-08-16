import { describe, expect, it } from "vitest";
import {
  buildScheduleGreeting,
  defaultLabels,
  enLabels,
  labelsByLocale,
  resolveLabels,
  thLabels,
} from "./labels";
import type { AiChatLabels } from "./types";

/** อักษรไทยตัวใดก็ได้ — ใช้จับคำที่ลืมแปลในชุดอังกฤษ */
const THAI = /[฀-๿]/;

/** `{name}` ทุกตัวในสตริง เรียงแล้ว — ชุดแปลที่ทำตัวแทนหาย = ค่าที่ควรโผล่บนจอหายเงียบ */
const placeholders = (value: string): string[] =>
  [...value.matchAll(/\{(\w+)\}/g)].map((m) => m[1] ?? "").sort();

const keys = Object.keys(thLabels) as (keyof AiChatLabels)[];

describe("ai-chat labels — สองภาษาต้องเดินคู่กัน", () => {
  it("ชุดอังกฤษมีคีย์ครบเท่าชุดไทย ไม่ขาดไม่เกิน", () => {
    expect(Object.keys(enLabels).sort()).toEqual(Object.keys(thLabels).sort());
  });

  it("ไม่มีคีย์ไหนว่างในทั้งสองชุด", () => {
    for (const key of keys) {
      expect(thLabels[key], `th.${key}`).toBeTruthy();
      expect(enLabels[key], `en.${key}`).toBeTruthy();
    }
  });

  /* 🔴 ด่านที่สำคัญที่สุด — เติมคีย์ที่ไทยแล้วก๊อปค่าไทยไปวางในชุดอังกฤษเป็นสิ่งที่เกิดง่ายที่สุด
     และมองไม่เห็นเลยจนกว่าจะมีคนสลับภาษาแล้วเจอคำไทยกลางประโยคอังกฤษ */
  it("ชุดอังกฤษไม่มีอักษรไทยหลงเหลือ", () => {
    for (const key of keys) {
      expect(THAI.test(enLabels[key]), `en.${key} ยังเป็นภาษาไทย: ${enLabels[key]}`).toBe(false);
    }
  });

  it("ตัวแทนค่า `{...}` ตรงกันทุกคีย์", () => {
    for (const key of keys) {
      expect(placeholders(enLabels[key]), `en.${key}`).toEqual(placeholders(thLabels[key]));
    }
  });

  /* ปีที่แสดงต่างกันจริง: `th-TH` = พ.ศ. · `en-GB` = ค.ศ. ⇒ ถ้าใครเผลอตั้งเท่ากัน
     รายการประวัติของจออังกฤษจะขึ้นปี 2569 ซึ่งเป็นอาการที่ไม่มีใครโยงกลับมาที่ไฟล์นี้ */
  it("`dateLocale` ของสองชุดไม่ใช่ค่าเดียวกัน", () => {
    expect(enLabels.dateLocale).not.toBe(thLabels.dateLocale);
    const sample = new Date("2026-08-16T03:00:00.000Z");
    const th = sample.toLocaleDateString(thLabels.dateLocale, { year: "numeric" });
    const en = sample.toLocaleDateString(enLabels.dateLocale, { year: "numeric" });
    expect(th).not.toBe(en);
  });
});

describe("resolveLabels", () => {
  it("ไม่ส่ง locale = ได้ไทย (พฤติกรรมเดิมของผู้เรียกที่มีอยู่)", () => {
    expect(resolveLabels()).toBe(thLabels);
    expect(defaultLabels).toBe(thLabels);
  });

  it("locale `en` ได้ชุดอังกฤษ", () => {
    expect(resolveLabels(undefined, "en")).toBe(enLabels);
  });

  /* 🔴 override ต้องทับ **ชุดของ locale นั้น** ไม่ใช่ทับชุดไทยเสมอ — ถ้าฐานเป็นไทยตลอด
     แอปที่แก้คำเดียวจะได้จออังกฤษที่มีคำไทยเหลืออีก 40 คำ */
  it("override ทับบนชุดของ locale นั้น คีย์ที่ไม่ได้ส่งยังเป็นภาษานั้น", () => {
    const merged = resolveLabels({ launcher: "Helper" }, "en");
    expect(merged.launcher).toBe("Helper");
    expect(merged.send).toBe(enLabels.send);
    expect(THAI.test(merged.subtitle)).toBe(false);
  });

  it("locale ที่ไม่รู้จักตกกลับเป็นไทย ไม่ใช่ undefined", () => {
    expect(resolveLabels(undefined, "de" as never)).toBe(thLabels);
  });

  it("labelsByLocale ครบทั้งสองภาษา", () => {
    expect(labelsByLocale.th).toBe(thLabels);
    expect(labelsByLocale.en).toBe(enLabels);
  });
});

describe("buildScheduleGreeting", () => {
  it("ประกอบเดือน/ปีจากชุดอังกฤษโดยไม่มีคำไทยปน", () => {
    const greeting = buildScheduleGreeting(enLabels, {
      departmentName: "ICU",
      month: 9,
      year: 2026,
    });
    expect(greeting).toContain("ICU");
    expect(greeting).toContain("9/2026");
    expect(THAI.test(greeting)).toBe(false);
  });

  it("ชุดไทยยังได้คำว่าเดือนเหมือนเดิม", () => {
    const greeting = buildScheduleGreeting(thLabels, {
      departmentName: "ICU",
      month: 9,
      year: 2026,
    });
    expect(greeting).toContain("เดือน 9/2026");
  });

  it("ไม่มีเดือนมาด้วย = ไม่มีเศษ `{period}` ค้างในข้อความ", () => {
    for (const labels of [thLabels, enLabels]) {
      const greeting = buildScheduleGreeting(labels, { departmentName: "ICU" });
      expect(greeting).not.toContain("{period}");
      expect(greeting).not.toContain("{month}");
    }
  });

  it("ไม่มีขอบเขตเลย = ใช้ประโยคชวนให้ระบุ", () => {
    const greeting = buildScheduleGreeting(enLabels, null);
    expect(greeting).toContain(enLabels.scheduleGreetingUnscoped);
    expect(greeting).not.toContain("{context}");
  });
});
