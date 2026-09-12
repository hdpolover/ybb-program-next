// lib/dashboard/__tests__/activeProgram.test.ts

import { describe, it, expect } from 'vitest';
import { resolveActiveProgramId } from '@/lib/dashboard/activeProgram';

describe('resolveActiveProgramId', () => {
  it('returns null when there are no programs and no candidate', () => {
    expect(resolveActiveProgramId([], null)).toBeNull();
  });
  it('returns the trimmed candidate when there are no programs to validate against', () => {
    expect(resolveActiveProgramId([], '  p-1  ')).toBe('p-1');
  });
  it('returns the candidate as-is when it matches an available program', () => {
    const programs = [{ programId: 'p-1' }, { programId: 'p-2' }];
    expect(resolveActiveProgramId(programs, 'p-2')).toBe('p-2');
  });
  it('falls back to the only available program when the candidate is missing', () => {
    const programs = [{ programId: 'p-1' }];
    expect(resolveActiveProgramId(programs, null)).toBe('p-1');
  });

  // Still array order when there is nothing to rank on. The heuristic below is
  // the conscious change the previous version of this test asked for.
  it('falls back to array order when status is absent everywhere', () => {
    const programs = [{ programId: 'p-1' }, { programId: 'p-2' }];
    expect(resolveActiveProgramId(programs, null)).toBe('p-1');
  });

  // The MEYS 6th/7th incident: every source orders registeredPrograms by
  // createdAt DESC, so the newest application came first and a participant who
  // had submitted and paid for the 2026 edition was landed on an untouched
  // 2027 draft with no documents on it.
  it('prefers a submitted application over a newer untouched draft', () => {
    const programs = [
      { programId: 'meys-2027', applicationStatus: 'draft' },
      { programId: 'meys-2026', applicationStatus: 'submitted' },
    ];
    expect(resolveActiveProgramId(programs, null)).toBe('meys-2026');
  });

  it('respects an explicit stored choice even when it ranks lower', () => {
    // Switching to the new edition on purpose must stick.
    const programs = [
      { programId: 'meys-2027', applicationStatus: 'draft' },
      { programId: 'meys-2026', applicationStatus: 'submitted' },
    ];
    expect(resolveActiveProgramId(programs, 'meys-2027')).toBe('meys-2027');
  });

  it('ranks a withdrawn application below a live draft', () => {
    const programs = [
      { programId: 'p-withdrawn', applicationStatus: 'withdrawn' },
      { programId: 'p-draft', applicationStatus: 'draft' },
    ];
    expect(resolveActiveProgramId(programs, null)).toBe('p-draft');
  });

  it('treats accepted and submitted as equally engaged, keeping array order', () => {
    const programs = [
      { programId: 'p-accepted', applicationStatus: 'accepted' },
      { programId: 'p-submitted', applicationStatus: 'submitted' },
    ];
    expect(resolveActiveProgramId(programs, null)).toBe('p-accepted');
  });

  it('does not choke on an unrecognised status', () => {
    const programs = [
      { programId: 'p-1', applicationStatus: 'some_new_status' },
      { programId: 'p-2', applicationStatus: 'submitted' },
    ];
    expect(resolveActiveProgramId(programs, null)).toBe('p-2');
  });
  it('ignores entries without a resolvable id', () => {
    const programs = [{ id: null, programId: null }, { programId: 'p-2' }];
    expect(resolveActiveProgramId(programs, null)).toBe('p-2');
  });
});
