// lib/dashboard/__tests__/activeProgram.test.ts

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  ACTIVE_PROGRAM_CHANGED_EVENT,
  ACTIVE_PROGRAM_STORAGE_KEY,
  EXPLICIT_PROGRAM_CHOICE_STORAGE_KEY,
  chooseActiveProgramId,
  clearExplicitProgramChoice,
  readActiveProgramId,
  resolveActiveProgramId,
  syncActiveProgramId,
} from '@/lib/dashboard/activeProgram';

beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
});

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

  it('respects an explicit choice even when it ranks lower', () => {
    // Switching to the new edition on purpose must stick.
    const programs = [
      { programId: 'meys-2027', applicationStatus: 'draft' },
      { programId: 'meys-2026', applicationStatus: 'submitted' },
    ];
    expect(resolveActiveProgramId(programs, 'meys-2027', 'meys-2027')).toBe('meys-2027');
  });

  // The value the pre-fix login wrote: every login pinned the phantom 2027
  // draft into localStorage, and localStorage outlives the fix. Nothing marks it
  // as chosen, so the submitted application has to win.
  it('drops a stored lower-ranked id that was never explicitly chosen', () => {
    const programs = [
      { programId: 'meys-2027', applicationStatus: 'draft' },
      { programId: 'meys-2026', applicationStatus: 'submitted' },
    ];
    expect(resolveActiveProgramId(programs, 'meys-2027', null)).toBe('meys-2026');
  });

  it('reads the explicit choice from this tab session by default', () => {
    const programs = [
      { programId: 'meys-2027', applicationStatus: 'draft' },
      { programId: 'meys-2026', applicationStatus: 'submitted' },
    ];
    expect(resolveActiveProgramId(programs, 'meys-2027')).toBe('meys-2026');
    window.sessionStorage.setItem(EXPLICIT_PROGRAM_CHOICE_STORAGE_KEY, 'meys-2027');
    expect(resolveActiveProgramId(programs, 'meys-2027')).toBe('meys-2027');
  });

  it('keeps a stored id that ranks equal to the best', () => {
    const programs = [
      { programId: 'p-accepted', applicationStatus: 'accepted' },
      { programId: 'p-submitted', applicationStatus: 'submitted' },
    ];
    expect(resolveActiveProgramId(programs, 'p-submitted', null)).toBe('p-submitted');
  });

  it('keeps a stored draft when every application is a draft', () => {
    const programs = [
      { programId: 'p-1', applicationStatus: 'draft' },
      { programId: 'p-2', applicationStatus: 'draft' },
    ];
    expect(resolveActiveProgramId(programs, 'p-2', null)).toBe('p-2');
  });

  it('ignores an explicit choice that is no longer among the programs', () => {
    const programs = [
      { programId: 'meys-2027', applicationStatus: 'draft' },
      { programId: 'meys-2026', applicationStatus: 'submitted' },
    ];
    expect(resolveActiveProgramId(programs, 'gone', 'gone')).toBe('meys-2026');
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

describe('active program persistence', () => {
  const events: string[] = [];
  const listener = (event: Event) => {
    events.push((event as CustomEvent<{ programId: string }>).detail.programId);
  };

  beforeEach(() => {
    events.length = 0;
    window.addEventListener(ACTIVE_PROGRAM_CHANGED_EVENT, listener);
  });
  afterEach(() => {
    window.removeEventListener(ACTIVE_PROGRAM_CHANGED_EVENT, listener);
    vi.restoreAllMocks();
  });

  it('syncActiveProgramId persists and announces only a real change', () => {
    syncActiveProgramId('p-1');
    syncActiveProgramId('p-1');
    expect(window.localStorage.getItem(ACTIVE_PROGRAM_STORAGE_KEY)).toBe('p-1');
    expect(events).toEqual(['p-1']);
  });

  it('chooseActiveProgramId marks the choice explicit and announces once', () => {
    syncActiveProgramId('meys-2026');
    events.length = 0;

    chooseActiveProgramId('meys-2027');

    expect(window.sessionStorage.getItem(EXPLICIT_PROGRAM_CHOICE_STORAGE_KEY)).toBe('meys-2027');
    expect(window.localStorage.getItem(ACTIVE_PROGRAM_STORAGE_KEY)).toBe('meys-2027');
    expect(readActiveProgramId()).toBe('meys-2027');
    expect(events).toEqual(['meys-2027']);
  });

  it('does not announce when choosing the program already shown', () => {
    syncActiveProgramId('meys-2026');
    events.length = 0;

    chooseActiveProgramId('meys-2026');

    expect(events).toEqual([]);
  });

  // Another tab may re-resolve the shared localStorage value; the program this
  // tab's participant picked has to keep driving this tab's fetches.
  it('serves this tab its explicit choice over the shared stored value', () => {
    chooseActiveProgramId('meys-2027');
    window.localStorage.setItem(ACTIVE_PROGRAM_STORAGE_KEY, 'meys-2026');
    expect(readActiveProgramId()).toBe('meys-2027');
  });

  it('an automatic sync to a different program retires the stale explicit choice', () => {
    chooseActiveProgramId('meys-2027');
    events.length = 0;

    syncActiveProgramId('meys-2026');

    expect(window.sessionStorage.getItem(EXPLICIT_PROGRAM_CHOICE_STORAGE_KEY)).toBeNull();
    expect(readActiveProgramId()).toBe('meys-2026');
    expect(events).toEqual(['meys-2026']);
  });

  it('clearExplicitProgramChoice falls back to the stored value', () => {
    chooseActiveProgramId('meys-2027');
    window.localStorage.setItem(ACTIVE_PROGRAM_STORAGE_KEY, 'meys-2026');
    clearExplicitProgramChoice();
    expect(readActiveProgramId()).toBe('meys-2026');
  });
});
