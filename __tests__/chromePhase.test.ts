// __tests__/chromePhase.test.ts
//
// Guards the one expression that made koreayouthsummit.com advertise
// "REGISTER NOW" for a programme with allowRegistration: false. It used to read
// `winner?.phase ?? 'open'`, so a killed programme produced no winning window,
// fell through the ??, and every KYS programme sat at zero applications while
// the navbar invited people in.
import { describe, it, expect } from 'vitest';
import { getRegistrationPhase, resolveChromePhase } from '@/lib/registration/status';

const KYS_4TH = {
  isPublished: true,
  isActive: true,
  allowRegistration: false, // the kill switch, as configured in prod
  registrationOpenDate: '2026-09-03T16:59:00.000Z',
  registrationCloseDate: '2027-03-05T16:59:00.000Z',
};

describe('resolveChromePhase', () => {
  it('reports closed for a killed programme even though its dates are open', () => {
    const now = new Date('2026-09-04T12:00:00.000Z'); // inside the window
    const programPhase = getRegistrationPhase(KYS_4TH, now);

    expect(programPhase).toBe('closed');
    // no window wins, because a killed programme has none
    expect(resolveChromePhase(undefined, programPhase)).toBe('closed');
  });

  it('still reports open when a window genuinely won', () => {
    expect(resolveChromePhase('open', 'closed')).toBe('open');
  });

  it('passes upcoming through from the programme when no window won', () => {
    expect(resolveChromePhase(undefined, 'upcoming')).toBe('upcoming');
  });

  it('defaults to open only when the programme could not be loaded at all', () => {
    // A transient fetch failure must not blank the CTA — that is the one case
    // the default exists for.
    expect(resolveChromePhase(undefined, null)).toBe('open');
    expect(resolveChromePhase(undefined, undefined)).toBe('open');
  });
});
