// lib/format/deadline.test.ts
/**
 * Tests for lib/format/deadline.ts.
 *
 * formatDeadlineWib is timezone-independent by design (it always renders via an
 * explicit `timeZone: 'Asia/Jakarta'` option), so its cases don't depend on the
 * host/runner's local timezone at all. formatDeadlineLocal, by contrast, renders
 * in whatever local timezone Intl resolves at call time - so that one case pins
 * TZ to Asia/Shanghai (UTC+8) around the call to make the assertion deterministic
 * regardless of what timezone actually runs this suite.
 */
import { describe, it, expect, vi } from "vitest";
import { formatDayMonthWib, formatDeadlineLocal, formatDeadlineWib } from "./deadline";

const UTC_INSTANT = "2026-07-15T16:59:00.000Z";
// In WIB (UTC+7): 2026-07-15 23:59
// In Shanghai (UTC+8): 2026-07-16 00:59

describe("formatDeadlineWib", () => {
  // WIB cases: timezone-independent (explicit timeZone option), no TZ stubbing needed.

  it("includes date in WIB", () => {
    const result = formatDeadlineWib(UTC_INSTANT);
    expect(result).toContain("15 Jul 2026");
    expect(result).toContain("23:59");
    expect(result).toContain("WIB");
  });

  it("date-only omits time but includes WIB", () => {
    const result = formatDeadlineWib(UTC_INSTANT, { withTime: false });
    expect(result).toContain("15 Jul 2026");
    expect(result).toContain("WIB");
    expect(result).not.toContain("23:59");
  });

  it("returns — for null", () => {
    expect(formatDeadlineWib(null)).toBe("—");
  });

  it("returns — for empty string", () => {
    expect(formatDeadlineWib("")).toBe("—");
  });

  it("returns — for invalid date string", () => {
    expect(formatDeadlineWib("not-a-date")).toBe("—");
  });
});

describe("formatDeadlineLocal", () => {
  it("returns — for null", () => {
    expect(formatDeadlineLocal(null)).toBe("—");
  });

  it("returns — for empty string", () => {
    expect(formatDeadlineLocal("")).toBe("—");
  });

  it("returns — for invalid date string", () => {
    expect(formatDeadlineLocal("not-a-date")).toBe("—");
  });

  it("shows next-day date in Shanghai tz (16:59Z = 00:59 next day local)", () => {
    vi.stubEnv("TZ", "Asia/Shanghai");
    const result = formatDeadlineLocal(UTC_INSTANT);
    vi.unstubAllEnvs();

    expect(result).toContain("16 Jul 2026");
    expect(result).toContain("00:59");
  });
});

describe("formatDayMonthWib", () => {
  // The opening date sits next to a countdown ticking to the exact instant, so
  // the DAY has to be the Jakarta day no matter where the viewer is. Rendered
  // in the viewer's zone, this instant reads "4 Sept" in UTC and "5 Sept" in
  // Jakarta: same clock, wrong date.
  const OPENS_AT = "2026-09-04T17:00:00.000Z";

  it("renders the WIB day even when the runtime timezone is not WIB", () => {
    vi.stubEnv("TZ", "UTC");
    const result = formatDayMonthWib(OPENS_AT);
    vi.unstubAllEnvs();

    expect(result).toBe("5 Sept");
  });

  it("returns null for missing or invalid values", () => {
    expect(formatDayMonthWib(null)).toBeNull();
    expect(formatDayMonthWib("")).toBeNull();
    expect(formatDayMonthWib("not-a-date")).toBeNull();
  });
});
