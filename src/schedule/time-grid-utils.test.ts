import { describe, it, expect } from "vitest";
import {
  parseTimeToMinutes,
  computeEventLayouts,
  computeFreeGaps,
} from "./time-grid-utils";

describe("parseTimeToMinutes", () => {
  it("parses valid times", () => {
    expect(parseTimeToMinutes("00:00")).toBe(0);
    expect(parseTimeToMinutes("08:30")).toBe(510);
    expect(parseTimeToMinutes("23:59")).toBe(1439);
    expect(parseTimeToMinutes("9:05")).toBe(545);
  });

  it("returns NaN for malformed input", () => {
    expect(parseTimeToMinutes("25:00")).toBeNaN();
    expect(parseTimeToMinutes("08:60")).toBeNaN();
    expect(parseTimeToMinutes("8.30")).toBeNaN();
    expect(parseTimeToMinutes("")).toBeNaN();
  });
});

describe("computeEventLayouts", () => {
  const ppm = 2; // 30 min = 60px

  it("positions a single event", () => {
    const layouts = computeEventLayouts(
      [{ id: "a", start: "09:00", end: "10:00" }],
      "08:00",
      "12:00",
      ppm,
    );
    expect(layouts).toHaveLength(1);
    expect(layouts[0]).toMatchObject({
      id: "a",
      top: 120,
      height: 120,
      left: "0%",
      width: "100%",
      totalColumns: 1,
    });
  });

  it("keeps non-overlapping events full width", () => {
    const layouts = computeEventLayouts(
      [
        { id: "a", start: "08:00", end: "10:00" },
        { id: "b", start: "10:00", end: "12:00" }, // back-to-back, no overlap
      ],
      "08:00",
      "12:00",
      ppm,
    );
    expect(layouts.every((l) => l.width === "100%")).toBe(true);
  });

  it("splits overlapping events side-by-side", () => {
    const layouts = computeEventLayouts(
      [
        { id: "a", start: "08:00", end: "10:00" },
        { id: "b", start: "09:00", end: "11:00" },
      ],
      "08:00",
      "12:00",
      ppm,
    );
    const a = layouts.find((l) => l.id === "a")!;
    const b = layouts.find((l) => l.id === "b")!;
    expect(a.width).toBe("50%");
    expect(b.width).toBe("50%");
    expect(a.left).not.toBe(b.left);
  });

  it("handles three-way overlap", () => {
    const layouts = computeEventLayouts(
      [
        { id: "a", start: "08:00", end: "12:00" },
        { id: "b", start: "08:30", end: "11:00" },
        { id: "c", start: "09:00", end: "10:00" },
      ],
      "08:00",
      "12:00",
      ppm,
    );
    expect(layouts.every((l) => l.totalColumns === 3)).toBe(true);
    expect(new Set(layouts.map((l) => l.column)).size).toBe(3);
  });

  it("reuses freed columns after an event ends", () => {
    const layouts = computeEventLayouts(
      [
        { id: "a", start: "08:00", end: "12:00" },
        { id: "b", start: "08:00", end: "09:00" },
        { id: "c", start: "09:30", end: "10:30" }, // b's column is free again
      ],
      "08:00",
      "12:00",
      ppm,
    );
    const b = layouts.find((l) => l.id === "b")!;
    const c = layouts.find((l) => l.id === "c")!;
    expect(c.column).toBe(b.column);
  });

  it("clamps events that extend past the window and drops outside ones", () => {
    const layouts = computeEventLayouts(
      [
        { id: "a", start: "07:00", end: "09:00" }, // clipped to 08:00
        { id: "b", start: "13:00", end: "14:00" }, // outside, dropped
      ],
      "08:00",
      "12:00",
      ppm,
    );
    expect(layouts).toHaveLength(1);
    expect(layouts[0]!.top).toBe(0);
    expect(layouts[0]!.height).toBe(120);
  });

  it("gives zero-duration events a minimum visible height", () => {
    const layouts = computeEventLayouts(
      [{ id: "a", start: "09:00", end: "09:00" }],
      "08:00",
      "12:00",
      ppm,
    );
    expect(layouts[0]!.height).toBeGreaterThan(0);
  });

  it("returns [] for an invalid window", () => {
    expect(
      computeEventLayouts(
        [{ id: "a", start: "09:00", end: "10:00" }],
        "12:00",
        "08:00",
        ppm,
      ),
    ).toEqual([]);
  });
});

describe("computeFreeGaps", () => {
  const ppm = 2;

  it("returns the whole window when there are no events", () => {
    const gaps = computeFreeGaps([], "08:00", "12:00", ppm);
    expect(gaps).toEqual([{ top: 0, height: 480, startMinutes: 480 }]);
  });

  it("finds gaps before, between, and after events", () => {
    const gaps = computeFreeGaps(
      [
        { id: "a", start: "09:00", end: "10:00" },
        { id: "b", start: "11:00", end: "12:00" },
      ],
      "08:00",
      "12:00",
      ppm,
    );
    expect(gaps).toHaveLength(2);
    expect(gaps[0]).toMatchObject({ top: 0, height: 120 }); // 08:00–09:00
    expect(gaps[1]).toMatchObject({ top: 240, height: 120 }); // 10:00–11:00
  });

  it("skips gaps shorter than minMinutes", () => {
    const gaps = computeFreeGaps(
      [{ id: "a", start: "08:15", end: "12:00" }],
      "08:00",
      "12:00",
      ppm,
      30,
    );
    expect(gaps).toHaveLength(0);
  });
});
