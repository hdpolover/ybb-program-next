// lib/onboarding/draft.ts
import type { OnboardingForm, StepKey } from '@/app/onboarding/types';

export const EMPTY_FORM: OnboardingForm = {
  fullName: '',
  country: '',
  state: '',
  city: '',
  birthDate: '',
  programSource: '',
  gender: '',
  referralCode: '',
};

const KEY = 'ybb.onboarding.draft.v1';

type Draft = { form?: Partial<OnboardingForm>; step?: StepKey };

/**
 * Keep a half-finished onboarding across a reload.
 *
 * SESSION storage, not LOCAL storage, and that is the whole design decision.
 *
 * This form holds a person's real name and where they live, and a meaningful
 * share of this audience fills it in on a shared machine — a school lab, a
 * university terminal, an internet cafe. `localStorage` survives the browser
 * closing, so the next person to open the signup page would be looking at the
 * previous person's name and city already typed in. `sessionStorage` is scoped
 * to the tab and dies with it, which covers the actual complaint (an
 * accidental reload or a back-navigation should not wipe your progress)
 * without leaving personal data sitting on a machine someone else will use.
 *
 * It is also why there is no expiry logic here: the tab lifetime IS the expiry.
 *
 * Every access is wrapped, because storage is not guaranteed. Safari's private
 * mode and browsers configured to block site data throw on the accessor
 * itself, not just on read — an unguarded call takes the whole page down. A
 * missing draft is a normal outcome, never an error.
 */
export function readOnboardingDraft(): Draft {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return {};

    const { form, step } = parsed as Draft;

    // Only accept known keys with string values. A draft is attacker-writable
    // in the sense that anything running in this origin can put junk there,
    // and it is restored straight into form state, so shape it on the way in
    // rather than trusting what comes back.
    const clean: Partial<OnboardingForm> = {};
    if (form && typeof form === 'object') {
      for (const key of Object.keys(EMPTY_FORM) as Array<keyof OnboardingForm>) {
        const value = (form as Record<string, unknown>)[key];
        if (typeof value === 'string') clean[key] = value;
      }
    }

    return { form: clean, step: typeof step === 'string' ? (step as StepKey) : undefined };
  } catch {
    return {};
  }
}

export function writeOnboardingDraft(draft: Draft): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(draft));
  } catch {
    // Quota, private mode, or site data blocked. Losing the draft is a
    // downgrade to the old behaviour, never a reason to break the form.
  }
}

/** Called once onboarding has actually been accepted by the server. */
export function clearOnboardingDraft(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // See writeOnboardingDraft.
  }
}
