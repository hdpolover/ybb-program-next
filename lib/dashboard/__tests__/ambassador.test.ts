// lib/dashboard/__tests__/ambassador.test.ts
//
// Referrals now carry a per-row programId/programName (an ambassador's code
// can bring participants into several programmes of the same brand), but
// older rows were recorded before that field existed. Parsing must degrade
// gracefully on a missing/invalid programme field rather than dropping the
// whole row.

import { describe, it, expect } from 'vitest';
import { toAmbassadorData } from '@/lib/dashboard/ambassador';

function basePayload(referralOverrides: Record<string, unknown> = {}) {
  return {
    id: 'amb-1',
    fullName: 'Jane Doe',
    referralCode: 'JANE10',
    shareLink: 'https://ybb.id/r/JANE10',
    totalReferrals: 1,
    successfulReferrals: 0,
    isActive: true,
    programName: 'Indonesia Youth Summit',
    referrals: [
      {
        id: 'ref-1',
        participantId: 'p-1',
        participantName: 'John Smith',
        status: 'referred',
        referredAt: '2026-01-01T00:00:00.000Z',
        ...referralOverrides,
      },
    ],
  };
}

describe('toAmbassadorData referral programme fields', () => {
  it('parses programId/programName when present', () => {
    const result = toAmbassadorData(
      basePayload({ programId: 'prog-2', programName: 'China Leaders Camp' }),
    );

    expect(result?.referrals).toHaveLength(1);
    expect(result?.referrals[0].programId).toBe('prog-2');
    expect(result?.referrals[0].programName).toBe('China Leaders Camp');
  });

  it('keeps the row when programId/programName are missing (older referral rows)', () => {
    const result = toAmbassadorData(basePayload());

    expect(result?.referrals).toHaveLength(1);
    expect(result?.referrals[0].programId).toBeUndefined();
    expect(result?.referrals[0].programName).toBeUndefined();
  });

  it('keeps the row when programId/programName are the wrong type', () => {
    const result = toAmbassadorData(basePayload({ programId: 42, programName: null }));

    expect(result?.referrals).toHaveLength(1);
    expect(result?.referrals[0].programId).toBeUndefined();
    expect(result?.referrals[0].programName).toBeUndefined();
  });

  it('keeps the row when programId/programName are blank strings', () => {
    const result = toAmbassadorData(basePayload({ programId: '', programName: '   ' }));

    expect(result?.referrals).toHaveLength(1);
    expect(result?.referrals[0].programId).toBeUndefined();
    expect(result?.referrals[0].programName).toBeUndefined();
  });

  it('still drops a row missing a required field (e.g. status) regardless of programme fields', () => {
    const result = toAmbassadorData(
      basePayload({ status: undefined, programId: 'prog-2', programName: 'China Leaders Camp' }),
    );

    expect(result?.referrals).toHaveLength(0);
  });
});
