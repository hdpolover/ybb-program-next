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

  // registeredPrograms carries no registration-window signal, so the
  // fallback is deliberately array order rather than a guess. Pinned here
  // so a future heuristic has to be a conscious change.
  it('falls back to array order when status and year are both absent', () => {
    const programs = [{ programId: 'p-1' }, { programId: 'p-2' }];
    expect(resolveActiveProgramId(programs, null)).toBe('p-1');
  });
  it('ignores entries without a resolvable id', () => {
    const programs = [{ id: null, programId: null }, { programId: 'p-2' }];
    expect(resolveActiveProgramId(programs, null)).toBe('p-2');
  });
});
