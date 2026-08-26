import { describe, expect, it } from "vitest";
import { extractEnterMode, seedScope } from "./sentinels";

/**
 * The hand-off sentinel is the only channel the service has for telling the widget what the
 * scheduling mode is about. Everything asserted here is read straight off a reply string.
 */

const enter = (body: string) => `พาเข้าโหมดจัดเวรให้แล้วค่ะ [[ENTER_MODE:${body}]]`;

describe("extractEnterMode", () => {
  it("reads the ward alongside the department", () => {
    const seed = extractEnterMode(
      enter(
        `schedule|dept=7|deptName=${encodeURIComponent("อายุรกรรม")}` +
          `|subUnit=5746|subUnitName=${encodeURIComponent("หอผู้ป่วยใน 2")}|month=9|year=2026`,
      ),
    );
    expect(seed).toEqual({
      departmentId: 7,
      departmentName: "อายุรกรรม",
      subUnitId: 5746,
      subUnitName: "หอผู้ป่วยใน 2",
      month: 9,
      year: 2026,
    });
  });

  it("leaves the ward out entirely when the hand-off carried none", () => {
    const seed = extractEnterMode(enter("schedule|dept=7"));
    // absent, not undefined-valued: the seed is spread over the host's own scope on every send,
    // and an explicit `undefined` would erase a ward the host already knew about.
    expect(seed && "subUnitId" in seed).toBe(false);
    expect(seed && "subUnitName" in seed).toBe(false);
  });
});

describe("seedScope", () => {
  it("keeps the ward id and drops the ward name — the service takes one and not the other", () => {
    const scope = seedScope({ departmentId: 7, subUnitId: 5746, subUnitName: "หอผู้ป่วยใน 2" });
    expect(scope).toEqual({ departmentId: 7, subUnitId: 5746 });
  });
});
