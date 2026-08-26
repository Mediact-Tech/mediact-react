import type { ChatScope } from "../api/types";

/**
 * FE directives the agent appends to a reply (`agent-tool.domain.ts` → `appendSentinels`).
 * They are instructions to the client, never text for the user — parse, act, and strip.
 *
 * Live today: `[[ENTER_MODE:…]]` from the `start_scheduling` tool.
 * `[[REDIRECT:…]]` / `[[EXIT_MODE]]` come from the retired harness path — still stripped so an
 * old or re-enabled producer can never leak a raw marker into a bubble.
 */

const ENTER_MODE = /\[\[ENTER_MODE:([^\]]+)\]\]/;
const REDIRECT = /\[\[REDIRECT:([^\]]+)\]\]/;
const EXIT_MODE = /\[\[EXIT_MODE\]\]/;
const ANY_SENTINEL = /\[\[(?:ENTER_MODE:[^\]]+|REDIRECT:[^\]]+|EXIT_MODE)\]\]/g;

/**
 * Scope resolved at hand-off, so scheduling mode doesn't have to re-ask which department/month.
 *
 * `subUnitName` is the one field here the service does NOT accept back — it exists so the greeting can
 * name the ward. Send with `seedScope()`, never the seed itself.
 */
export type ScheduleSeed = Pick<
  ChatScope,
  "departmentId" | "subUnitId" | "departmentName" | "month" | "year"
> & { subUnitName?: string };

/** The half of a seed the service takes. Drops the display-only name. */
export function seedScope(seed: ScheduleSeed): ChatScope {
  const { subUnitName: _subUnitName, ...scope } = seed;
  return scope;
}

/** `[[ENTER_MODE:schedule|dept=7|deptName=ICU|subUnit=12|subUnitName=Ward%203|month=8|year=2026]]` → seed. */
export function extractEnterMode(text: string): ScheduleSeed | null {
  const match = ENTER_MODE.exec(text);
  if (!match?.[1]) return null;

  const seed: ScheduleSeed = {};
  for (const part of match[1].split("|")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    const key = part.slice(0, eq);
    const value = part.slice(eq + 1);
    if (key === "dept") seed.departmentId = Number(value);
    else if (key === "deptName") seed.departmentName = safeDecode(value);
    else if (key === "subUnit") seed.subUnitId = Number(value);
    else if (key === "subUnitName") seed.subUnitName = safeDecode(value);
    else if (key === "month") seed.month = Number(value);
    else if (key === "year") seed.year = Number(value);
  }
  return seed;
}

export function hasExitMode(text: string): boolean {
  return EXIT_MODE.test(text);
}

export function extractRedirect(text: string): string | null {
  return REDIRECT.exec(text)?.[1] ?? null;
}

export function stripSentinels(text: string): string {
  return text.replace(ANY_SENTINEL, "").trim();
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
