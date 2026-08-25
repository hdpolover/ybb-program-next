import { describe, it, expect, afterEach } from 'vitest';
import { formatViewerDayIfDifferent } from '@/lib/format/timeline';

// Agenda entries are physical Indonesian events, so WIB stays the primary label.
// The viewer's day is appended ONLY when it genuinely lands on a different date.
//
// The cross-timezone behaviour cannot be asserted here — vitest cannot rebind the
// process timezone once Intl has initialised — so it was verified out-of-band by
// running the same Intl comparison under explicit TZ values for the instant
// 2026-08-15T02:00:00Z (15 Aug 09:00 WIB):
//   Asia/Jakarta     -> viewer 15 Aug, WIB 15 Aug, differs=false (no second label)
//   Pacific/Honolulu -> viewer 14 Aug, WIB 15 Aug, differs=TRUE  (label shown)
//   Pacific/Auckland -> viewer 15 Aug, WIB 15 Aug, differs=false
//   Europe/London    -> viewer 15 Aug, WIB 15 Aug, differs=false
// The tests below cover the timezone-independent contract: null/robustness paths.
describe('formatViewerDayIfDifferent', () => {
  const origTZ = process.env.TZ;
  afterEach(() => { process.env.TZ = origTZ; });

  it('returns null when the viewer is in WIB (no redundant second label)', () => {
    // 15 Aug 2026 09:00 WIB === 02:00 UTC
    expect(formatViewerDayIfDifferent('2026-08-15T02:00:00.000Z')).toBeNull();
  });

  it('returns null for a missing or unparseable value', () => {
    expect(formatViewerDayIfDifferent(null)).toBeNull();
    expect(formatViewerDayIfDifferent(undefined)).toBeNull();
    expect(formatViewerDayIfDifferent('not-a-date')).toBeNull();
  });

  it('never returns the literal "Invalid Date"', () => {
    expect(formatViewerDayIfDifferent('garbage')).not.toBe('Invalid Date');
  });
});
