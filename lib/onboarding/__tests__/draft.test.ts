// lib/onboarding/__tests__/draft.test.ts
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  EMPTY_FORM,
  clearOnboardingDraft,
  readOnboardingDraft,
  writeOnboardingDraft,
} from '@/lib/onboarding/draft';

const KEY = 'ybb.onboarding.draft.v1';

describe('onboarding draft', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('round-trips a partially filled form and the current step', () => {
    writeOnboardingDraft({ form: { ...EMPTY_FORM, fullName: 'Ada', gender: 'female' }, step: 'Age' });

    const restored = readOnboardingDraft();

    expect(restored.form?.fullName).toBe('Ada');
    expect(restored.form?.gender).toBe('female');
    expect(restored.step).toBe('Age');
  });

  it('does not outlive the tab', () => {
    // The whole point of choosing sessionStorage over localStorage: this form
    // holds a real name and home city, and a meaningful share of this audience
    // fills it in on a shared machine. A draft that survived the browser
    // closing would greet the next person on that computer with the previous
    // one's details. Clearing sessionStorage is what ending the tab does.
    writeOnboardingDraft({ form: { ...EMPTY_FORM, fullName: 'Ada' }, step: 'Basic Info' });
    expect(sessionStorage.getItem(KEY)).toBeTruthy();

    sessionStorage.clear();

    expect(readOnboardingDraft()).toEqual({});
  });

  it('returns an empty draft when there is nothing stored', () => {
    expect(readOnboardingDraft()).toEqual({});
  });

  it('survives malformed JSON rather than throwing into render', () => {
    // readOnboardingDraft runs inside a useState initialiser, so anything it
    // throws takes the page down before first paint.
    sessionStorage.setItem(KEY, '{not json');

    expect(() => readOnboardingDraft()).not.toThrow();
    expect(readOnboardingDraft()).toEqual({});
  });

  it('survives a non-object payload', () => {
    sessionStorage.setItem(KEY, '"a string"');
    expect(readOnboardingDraft()).toEqual({});

    sessionStorage.setItem(KEY, 'null');
    expect(readOnboardingDraft()).toEqual({});
  });

  it('drops unknown keys and non-string values instead of restoring them', () => {
    // Anything running in this origin can write here, and the result is spread
    // straight into form state, so it gets shaped on the way in.
    sessionStorage.setItem(
      KEY,
      JSON.stringify({
        form: { fullName: 'Ada', evil: 'payload', gender: { nested: true }, city: 42 },
        step: 'Age',
      }),
    );

    const restored = readOnboardingDraft();

    expect(restored.form).toEqual({ fullName: 'Ada' });
    expect(restored.form).not.toHaveProperty('evil');
    expect(restored.form).not.toHaveProperty('gender');
    expect(restored.form).not.toHaveProperty('city');
  });

  it('does not throw when storage itself is unavailable', () => {
    // Safari private mode and "block site data" throw on the accessor, not
    // just on the read. An unguarded call here would break the whole form.
    const boom = () => {
      throw new Error('SecurityError');
    };
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(boom);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(boom);
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(boom);

    expect(() => readOnboardingDraft()).not.toThrow();
    expect(readOnboardingDraft()).toEqual({});
    expect(() => writeOnboardingDraft({ form: EMPTY_FORM, step: 'Age' })).not.toThrow();
    expect(() => clearOnboardingDraft()).not.toThrow();
  });

  it('clears the draft', () => {
    writeOnboardingDraft({ form: { ...EMPTY_FORM, fullName: 'Ada' }, step: 'Age' });
    expect(readOnboardingDraft().form?.fullName).toBe('Ada');

    clearOnboardingDraft();

    expect(readOnboardingDraft()).toEqual({});
  });
});
