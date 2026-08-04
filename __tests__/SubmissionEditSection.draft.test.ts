// __tests__/SubmissionEditSection.draft.test.ts
//
// Unit coverage for the local-draft persistence logic in
// SubmissionEditSection.tsx (server-as-source-of-truth fix). These are pure
// functions extracted specifically so this reconciliation logic can be tested
// without mounting the full page component and its providers.

import { describe, it, expect } from 'vitest';
import type { DraftEnvelope } from '@/hooks/useAutoSave';
import {
  DRAFT_MAX_AGE_MS,
  isSubmissionDraftEmpty,
  projectDirtyDraft,
  mergeServerWithFreshDraft,
  clearDirtyAfterSectionSave,
  type SubmissionDraftPayload,
} from '@/components/dashboard/sections/SubmissionEditSection';

describe('isSubmissionDraftEmpty', () => {
  it('is true for a draft with no section or essay fields', () => {
    expect(isSubmissionDraftEmpty({ sectionValues: {}, essayValues: {} })).toBe(true);
  });

  it('is true when a section is present but has no fields tracked', () => {
    expect(isSubmissionDraftEmpty({ sectionValues: { personal: {} }, essayValues: {} })).toBe(true);
  });

  it('is false when any section field is present', () => {
    expect(
      isSubmissionDraftEmpty({ sectionValues: { personal: { fullName: 'A' } }, essayValues: {} }),
    ).toBe(false);
  });

  it('is false when any essay value is present', () => {
    expect(isSubmissionDraftEmpty({ sectionValues: {}, essayValues: { essay1: 'text' } })).toBe(false);
  });
});

describe('projectDirtyDraft', () => {
  it('only includes fields that were actually marked dirty', () => {
    const sectionValues = {
      personal: { fullName: 'Alice', nickName: 'Al', gender: 'female' },
    };
    const essayValues = { essay1: 'my essay' };
    const dirtySectionFields = { personal: new Set(['fullName']) };
    const dirtyEssayIds = new Set<string>();

    const draft = projectDirtyDraft(sectionValues, essayValues, dirtySectionFields, dirtyEssayIds);

    // fullName was edited -> included
    expect(draft.sectionValues.personal).toEqual({ fullName: 'Alice' });
    // nickName/gender were never touched -> must not leak into the draft
    expect(draft.sectionValues.personal.nickName).toBeUndefined();
    expect(draft.sectionValues.personal.gender).toBeUndefined();
    // essay1 was never touched -> must not leak into the draft
    expect(draft.essayValues).toEqual({});
  });

  it('produces an empty draft when nothing is dirty', () => {
    const draft = projectDirtyDraft(
      { personal: { fullName: 'Alice' } },
      { essay1: 'text' },
      {},
      new Set(),
    );
    expect(isSubmissionDraftEmpty(draft)).toBe(true);
  });

  it('includes dirty essay ids with their current value', () => {
    const draft = projectDirtyDraft({}, { essay1: 'draft text' }, {}, new Set(['essay1']));
    expect(draft.essayValues).toEqual({ essay1: 'draft text' });
  });
});

describe('mergeServerWithFreshDraft', () => {
  const serverSectionValues = {
    personal: { fullName: 'Server Name', nickName: 'ServerNick', gender: 'male' },
    emergency: { contactName: 'Server Contact' },
  };
  const serverEssayValues = { essay1: 'server essay' };

  it('with no draft, merged values equal the server values exactly', () => {
    const result = mergeServerWithFreshDraft(serverSectionValues, serverEssayValues, null);

    expect(result.sectionValues).toEqual(serverSectionValues);
    expect(result.essayValues).toEqual(serverEssayValues);
    expect(result.dirtySectionFields).toEqual({});
    expect(result.dirtyEssayIds.size).toBe(0);
    expect(result.discardedStaleDraft).toBe(false);
  });

  it('a fresh draft overrides only the fields it tracked as dirty, never the rest', () => {
    const draftEnvelope: DraftEnvelope<SubmissionDraftPayload> = {
      data: {
        sectionValues: { personal: { fullName: 'Local Draft Name' } },
        essayValues: {},
      },
      savedAt: Date.now(),
    };

    const result = mergeServerWithFreshDraft(serverSectionValues, serverEssayValues, draftEnvelope);

    // Dirty field wins.
    expect(result.sectionValues.personal.fullName).toBe('Local Draft Name');
    // Regression guard for the original bug: fields the draft never touched
    // must keep the fresh SERVER value, not be silently wiped/replaced.
    expect(result.sectionValues.personal.nickName).toBe('ServerNick');
    expect(result.sectionValues.personal.gender).toBe('male');
    expect(result.sectionValues.emergency).toEqual(serverSectionValues.emergency);
    expect(result.essayValues).toEqual(serverEssayValues);

    // Dirty tracking is seeded from what was actually reapplied.
    expect(Array.from(result.dirtySectionFields.personal ?? [])).toEqual(['fullName']);
    expect(result.discardedStaleDraft).toBe(false);
  });

  it('a draft older than DRAFT_MAX_AGE_MS is discarded entirely, even if non-empty', () => {
    const draftEnvelope: DraftEnvelope<SubmissionDraftPayload> = {
      data: {
        sectionValues: { personal: { fullName: 'Stale Draft Name' } },
        essayValues: {},
      },
      savedAt: Date.now() - (DRAFT_MAX_AGE_MS + 1000),
    };

    const result = mergeServerWithFreshDraft(serverSectionValues, serverEssayValues, draftEnvelope);

    expect(result.sectionValues).toEqual(serverSectionValues);
    expect(result.dirtySectionFields).toEqual({});
    expect(result.discardedStaleDraft).toBe(true);
  });

  it('a draft exactly at the freshness boundary is still applied', () => {
    const draftEnvelope: DraftEnvelope<SubmissionDraftPayload> = {
      data: { sectionValues: { personal: { fullName: 'Boundary Name' } }, essayValues: {} },
      savedAt: Date.now() - DRAFT_MAX_AGE_MS,
    };

    const result = mergeServerWithFreshDraft(serverSectionValues, serverEssayValues, draftEnvelope);

    expect(result.sectionValues.personal.fullName).toBe('Boundary Name');
    expect(result.discardedStaleDraft).toBe(false);
  });

  it('never resurrects a draft section that no longer exists on the server', () => {
    const draftEnvelope: DraftEnvelope<SubmissionDraftPayload> = {
      data: {
        sectionValues: { removedSection: { someField: 'orphaned' } },
        essayValues: {},
      },
      savedAt: Date.now(),
    };

    const result = mergeServerWithFreshDraft(serverSectionValues, serverEssayValues, draftEnvelope);

    // Only sections the server actually returned show up in the merged result.
    expect(Object.keys(result.sectionValues).sort()).toEqual(['emergency', 'personal']);
    expect(result.sectionValues.personal).toEqual(serverSectionValues.personal);
  });

  it('a foreign/stale draft cannot override fields the user never edited (dominant bug regression)', () => {
    // Simulates a leftover draft from another session/tab that happens to have
    // stale full-form data cached (the old bug persisted the ENTIRE form).
    // Even at a fresh timestamp, only genuinely-dirty fields may win.
    const draftEnvelope: DraftEnvelope<SubmissionDraftPayload> = {
      data: {
        sectionValues: {
          // Only nickName was actually edited and tracked as dirty in this draft.
          personal: { nickName: 'Freshly Edited Nick' },
        },
        essayValues: {},
      },
      savedAt: Date.now(),
    };

    const result = mergeServerWithFreshDraft(serverSectionValues, serverEssayValues, draftEnvelope);

    expect(result.sectionValues.personal.nickName).toBe('Freshly Edited Nick');
    // fullName/gender were never in the draft's dirty projection -> server wins.
    expect(result.sectionValues.personal.fullName).toBe('Server Name');
    expect(result.sectionValues.personal.gender).toBe('male');
  });
});

describe('clearDirtyAfterSectionSave', () => {
  it('clears only the saved section, leaving other dirty sections untouched (regression guard)', () => {
    // A save of `personal` must not wipe dirty tracking for `emergency`,
    // which the user also edited but has not saved yet - otherwise the
    // crash-recovery draft silently stops protecting it.
    const dirtySectionFields = {
      personal: new Set(['fullName']),
      emergency: new Set(['contactName']),
    };
    const dirtyEssayIds = new Set<string>();

    const result = clearDirtyAfterSectionSave(dirtySectionFields, dirtyEssayIds, 'personal');

    expect(result.dirtySectionFields.personal).toBeUndefined();
    expect(Array.from(result.dirtySectionFields.emergency ?? [])).toEqual(['contactName']);
  });

  it('leaves dirtyEssayIds untouched when the saved section is not entry_information', () => {
    const dirtySectionFields = { personal: new Set(['fullName']) };
    const dirtyEssayIds = new Set(['essay1']);

    const result = clearDirtyAfterSectionSave(dirtySectionFields, dirtyEssayIds, 'personal');

    expect(result.dirtyEssayIds).toEqual(new Set(['essay1']));
  });

  it('clears only the essays that were actually saved alongside entry_information', () => {
    const dirtySectionFields = { entry_information: new Set(['full_name']) };
    // essay1/essay2 belong to this section's save; essay3 belongs to a
    // different section's essay set and must survive.
    const dirtyEssayIds = new Set(['essay1', 'essay2', 'essay3']);

    const result = clearDirtyAfterSectionSave(
      dirtySectionFields,
      dirtyEssayIds,
      'entry_information',
      ['essay1', 'essay2'],
    );

    expect(result.dirtySectionFields.entry_information).toBeUndefined();
    expect(result.dirtyEssayIds).toEqual(new Set(['essay3']));
  });

  it('is a no-op for a section that was never tracked as dirty', () => {
    const dirtySectionFields = { emergency: new Set(['contactName']) };
    const dirtyEssayIds = new Set<string>();

    const result = clearDirtyAfterSectionSave(dirtySectionFields, dirtyEssayIds, 'personal');

    expect(result.dirtySectionFields).toEqual(dirtySectionFields);
  });

  it('does not mutate the input Set/Record (immutability)', () => {
    const dirtySectionFields = { personal: new Set(['fullName']) };
    const dirtyEssayIds = new Set(['essay1']);

    clearDirtyAfterSectionSave(dirtySectionFields, dirtyEssayIds, 'personal', ['essay1']);

    expect(dirtySectionFields.personal).toEqual(new Set(['fullName']));
    expect(dirtyEssayIds).toEqual(new Set(['essay1']));
  });
});
