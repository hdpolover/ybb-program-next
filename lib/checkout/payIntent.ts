// lib/checkout/payIntent.ts
//
// "Pick a fee and go straight to payment" intent. The /apply pricing card links
// to /login?mode=signup&intent=pay&tier=<id>&programSlug=<slug>; the intent has
// to survive signup -> email verification -> onboarding, so it is parked in
// localStorage (the verification link can open in another tab, which would
// lose sessionStorage) with a short TTL so a forgotten intent cannot hijack a
// later login.

export const PAY_INTENT_STORAGE_KEY = 'ybb_pay_intent';
export const PAY_INTENT_TTL_MS = 24 * 60 * 60 * 1000;
export const PAY_INTENT_LANDING_PATH = '/dashboard/pay';

export type PayIntent = {
  tierId: string;
  programSlug: string | null;
};

type StoredPayIntent = PayIntent & { savedAt: number };

// Ids are opaque (UUIDs today); the shape check only keeps junk out of storage
// and out of the URL we later build from it. The API still authorises the tier.
const TIER_ID_PATTERN = /^[A-Za-z0-9_-]{8,64}$/;
const PROGRAM_SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{0,99}$/i;

type ParamReader = { get(name: string): string | null };

/** Returns the intent a URL carries, or null for anything absent or malformed. */
export function parsePayIntent(params: ParamReader): PayIntent | null {
  if (params.get('intent') !== 'pay') return null;

  const tierId = params.get('tier')?.trim() ?? '';
  if (!TIER_ID_PATTERN.test(tierId)) return null;

  const slug = params.get('programSlug')?.trim() ?? '';
  return { tierId, programSlug: PROGRAM_SLUG_PATTERN.test(slug) ? slug : null };
}

/** The /apply card CTA target. */
export function buildPayIntentSignupHref(input: {
  tierId: string;
  programSlug?: string | null;
  applicationCategory?: 'self_funded' | 'fully_funded';
}): string {
  const params = new URLSearchParams({ mode: 'signup' });
  if (input.programSlug) params.set('programSlug', input.programSlug);
  if (input.applicationCategory) params.set('applicationCategory', input.applicationCategory);
  params.set('intent', 'pay');
  params.set('tier', input.tierId);
  return `/login?${params.toString()}`;
}

export function savePayIntent(intent: PayIntent, now: number = Date.now()): void {
  if (typeof window === 'undefined') return;
  try {
    const stored: StoredPayIntent = { ...intent, savedAt: now };
    window.localStorage.setItem(PAY_INTENT_STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Storage blocked: the visitor just lands on the default dashboard.
  }
}

/** Re-validates on read: storage is user-editable, never trust it. */
export function readPayIntent(now: number = Date.now()): PayIntent | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(PAY_INTENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredPayIntent> | null;
    if (!parsed || typeof parsed.savedAt !== 'number') return null;
    if (now - parsed.savedAt > PAY_INTENT_TTL_MS || parsed.savedAt > now) return null;

    const params = new URLSearchParams({ intent: 'pay', tier: String(parsed.tierId ?? '') });
    if (parsed.programSlug) params.set('programSlug', String(parsed.programSlug));
    return parsePayIntent(params);
  } catch {
    return null;
  }
}

export function clearPayIntent(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(PAY_INTENT_STORAGE_KEY);
  } catch {
    // Nothing stored that we could clear.
  }
}

type RegisteredProgramRef = { programId: string; programSlug: string };
type JoinableProgramRef = { id: string; name: string; slug?: string } | null | undefined;

export type PayTarget =
  | { kind: 'pay'; programId: string }
  // Returning participant of the brand, not yet on this edition: keep the intent
  // and let the dashboard's "Apply for <program>" join CTA run; the effect
  // re-evaluates once registeredPrograms includes the new application.
  | { kind: 'join'; programName: string }
  // No application and nothing to join: the intent cannot be honoured.
  | { kind: 'abort'; slug: string }
  // Intent named no edition; the caller may use its own active-program resolver.
  | { kind: 'resolver' };

/**
 * Which program an intent may be paid on. A named edition is never substituted:
 * minting an invoice on a different edition than the one the visitor picked is
 * wrong, so an unregistered slug joins or aborts, it does not fall back.
 */
export function decidePayTarget(
  intent: PayIntent,
  registeredPrograms: readonly RegisteredProgramRef[],
  joinableProgram: JoinableProgramRef,
): PayTarget {
  if (!intent.programSlug) return { kind: 'resolver' };

  const registered = registeredPrograms.find((p) => p.programSlug === intent.programSlug);
  if (registered) return { kind: 'pay', programId: registered.programId };

  if (joinableProgram && joinableProgram.slug === intent.programSlug) {
    return { kind: 'join', programName: joinableProgram.name };
  }
  return { kind: 'abort', slug: intent.programSlug };
}
