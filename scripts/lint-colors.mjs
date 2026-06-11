#!/usr/bin/env node
/**
 * lint-colors — reject hardcoded hex colors in component files.
 * Cross-platform replacement for the previous `! grep ...` one-liner,
 * which fails under bun shell on Windows (no `!` operator).
 *
 * Scans src/**\/*.tsx (excluding *.stories.tsx, *.test.tsx) for
 * Tailwind arbitrary hex values like bg-[#fff] — use design tokens instead.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../src", import.meta.url));
const PATTERN = /(bg|text|border|ring|fill|stroke|shadow)-\[#[0-9a-fA-F]/;

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

const violations = [];
for (const file of walk(ROOT)) {
  if (!file.endsWith(".tsx")) continue;
  if (file.endsWith(".stories.tsx") || file.endsWith(".test.tsx")) continue;
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (PATTERN.test(line)) {
      violations.push(`${relative(process.cwd(), file)}:${i + 1}: ${line.trim()}`);
    }
  });
}

if (violations.length > 0) {
  console.error("ERROR: hardcoded hex colors found — use design tokens instead\n");
  for (const v of violations) console.error("  " + v);
  process.exit(1);
}
console.log("lint:colors OK — no hardcoded hex colors");
