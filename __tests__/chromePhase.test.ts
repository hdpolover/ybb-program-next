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

  it('still reports open when a window won and the programme itself is open', () => {
    expect(resolveChromePhase('open', 'open')).toBe('open');
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

  // The case the first version of this helper missed entirely, and the reason
  // koreayouthsummit.com still served REGISTER NOW after that fix deployed.
  // KYS 4th has allowRegistration:false AND pricing-tier windows that are open
  // today ($15 self funded to 5 Mar 2027, $10 fully funded to 20 Nov 2026), so
  // a window DOES win and reports 'open'. Treating the programme gate as a
  // fallback meant the kill switch was never reached.
  it('lets the kill switch beat an open tier window, not the other way round', () => {
    expect(resolveChromePhase('open', 'closed')).toBe('closed');
  });

  it('keeps a closed programme closed even when a window says upcoming', () => {
    expect(resolveChromePhase('upcoming', 'closed')).toBe('closed');
  });
});
