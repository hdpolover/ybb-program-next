/**
 * Standalone test for lib/format/deadline.ts
 * Run with: TZ=Asia/Shanghai node lib/format/deadline.test.ts
 * Also passes with the default TZ (WIB cases are timezone-independent).
 */

// Set local timezone to Shanghai (UTC+8) before any imports so that
// Intl with no explicit timeZone uses it. This must happen before the module
// is loaded to take effect in Node.
process.env.TZ = "Asia/Shanghai";

import assert from "node:assert/strict";
import { formatDeadlineLocal, formatDeadlineWib } from "./deadline.ts";

let passed = 0;

function test(description: string, fn: () => void): void {
  fn();
  console.log(`  OK  ${description}`);
  passed++;
}

const UTC_INSTANT = "2026-07-15T16:59:00.000Z";
// In WIB (UTC+7): 2026-07-15 23:59
// In Shanghai (UTC+8): 2026-07-16 00:59

// WIB cases (formatDeadlineWib, timezone-independent)
test("formatDeadlineWib includes date in WIB", () => {
  const result = formatDeadlineWib(UTC_INSTANT);
  assert.ok(result.includes("15 Jul 2026"), `expected "15 Jul 2026" in "${result}"`);
  assert.ok(result.includes("23:59"), `expected "23:59" in "${result}"`);
  assert.ok(result.includes("WIB"), `expected "WIB" in "${result}"`);
});

test("formatDeadlineWib date-only omits time but includes WIB", () => {
  const result = formatDeadlineWib(UTC_INSTANT, { withTime: false });
  assert.ok(result.includes("15 Jul 2026"), `expected "15 Jul 2026" in "${result}"`);
  assert.ok(result.includes("WIB"), `expected "WIB" in "${result}"`);
  assert.ok(!result.includes("23:59"), `did not expect "23:59" in "${result}"`);
});

// null/empty/invalid cases for both functions
test("formatDeadlineWib returns — for null", () => {
  assert.equal(formatDeadlineWib(null), "—");
});

test("formatDeadlineWib returns — for empty string", () => {
  assert.equal(formatDeadlineWib(""), "—");
});

test("formatDeadlineWib returns — for invalid date string", () => {
  assert.equal(formatDeadlineWib("not-a-date"), "—");
});

test("formatDeadlineLocal returns — for null", () => {
  assert.equal(formatDeadlineLocal(null), "—");
});

test("formatDeadlineLocal returns — for empty string", () => {
  assert.equal(formatDeadlineLocal(""), "—");
});

test("formatDeadlineLocal returns — for invalid date string", () => {
  assert.equal(formatDeadlineLocal("not-a-date"), "—");
});

// Local timezone cases (Shanghai UTC+8, so 16:59Z = 00:59 next day local)
test("formatDeadlineLocal shows next-day date in Shanghai tz", () => {
  const result = formatDeadlineLocal(UTC_INSTANT);
  assert.ok(result.includes("16 Jul 2026"), `expected "16 Jul 2026" in "${result}"`);
  assert.ok(result.includes("00:59"), `expected "00:59" in "${result}"`);
});

console.log(`\n${passed} tests passed`);
