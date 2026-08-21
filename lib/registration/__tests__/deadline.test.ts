// lib/registration/__tests__/deadline.test.ts
/**
 * Tests for lib/registration/deadline.ts.
 *
 * resolveRegistrationCountdownDeadline covers a real production incident
 * (2026-08-21): the homepage countdown/gates were fed `tierDeadline` first and
 * `program.registrationCloseDate` only as a fallback. That meant a pricing
 * tier's registration-fee validity window (which can close months before the
 * program's real registration deadline) silently overrode the program's
 * actual close date. middleeastyouthsummit.com advertised "Registration
 * closes in: 2026-08-31" while the program's real registrationCloseDate was
 * 2026-12-05 - a fully-funded tier window just happened to end first.
 *
 * The fix flips the precedence: the program's registrationCloseDate must win
 * whenever it is set. The tier deadline stays as a fallback for brands whose
 * program has no registrationCloseDate at all (e.g. Istanbul Youth Summit,
 * Youth Academic Forum), so those countdowns keep working.
 */
import { describe, it, expect } from 'vitest';
import { resolveRegistrationCountdownDeadline } from '../deadline';

describe('resolveRegistrationCountdownDeadline', () => {
  it('prefers the program registrationCloseDate when both are set', () => {
    // This is the exact incident shape: tier deadline is earlier than the
    // program's real close date and must NOT win.
    const result = resolveRegistrationCountdownDeadline(
      '2026-12-05T16:59:00.000Z',
      '2026-08-31T16:59:00.000Z',
    );
    expect(result).toBe('2026-12-05T16:59:00.000Z');
  });

  it('falls back to the tier deadline when the program has no registrationCloseDate', () => {
    const result = resolveRegistrationCountdownDeadline(
      null,
      '2026-08-31T16:59:00.000Z',
    );
    expect(result).toBe('2026-08-31T16:59:00.000Z');
  });

  it('falls back to the tier deadline when registrationCloseDate is undefined', () => {
    const result = resolveRegistrationCountdownDeadline(
      undefined,
      '2026-08-31T16:59:00.000Z',
    );
    expect(result).toBe('2026-08-31T16:59:00.000Z');
  });

  it('returns null when neither source has a date', () => {
    expect(resolveRegistrationCountdownDeadline(null, null)).toBeNull();
  });

  it('returns the program date even when there is no tier deadline at all', () => {
    const result = resolveRegistrationCountdownDeadline(
      '2026-12-05T16:59:00.000Z',
      null,
    );
    expect(result).toBe('2026-12-05T16:59:00.000Z');
  });
});
