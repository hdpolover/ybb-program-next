// lib/checkout/__tests__/payIntent.test.ts
import { beforeEach, describe, expect, it } from 'vitest';
import {
  PAY_INTENT_STORAGE_KEY,
  PAY_INTENT_TTL_MS,
  buildPayIntentSignupHref,
  clearPayIntent,
  decidePayTarget,
  parsePayIntent,
  readPayIntent,
  savePayIntent,
} from '../payIntent';

const TIER = '3f1c2b9e-7a44-4c1e-9d2a-0b6f5e8a1c77';
const q = (s: string) => new URLSearchParams(s);

describe('parsePayIntent', () => {
  it('accepts intent=pay with a well-formed tier and slug', () => {
    expect(parsePayIntent(q(`intent=pay&tier=${TIER}&programSlug=meys-7th`))).toEqual({
      tierId: TIER,
      programSlug: 'meys-7th',
    });
  });

  it('keeps the tier but drops a missing or malformed slug', () => {
    expect(parsePayIntent(q(`intent=pay&tier=${TIER}`))?.programSlug).toBeNull();
    expect(parsePayIntent(q(`intent=pay&tier=${TIER}&programSlug=../x`))?.programSlug).toBeNull();
  });

  it('ignores anything that is not intent=pay', () => {
    expect(parsePayIntent(q(`tier=${TIER}`))).toBeNull();
    expect(parsePayIntent(q(`intent=other&tier=${TIER}`))).toBeNull();
  });

  it.each(['', 'short', 'has space in it', '<script>alert(1)</script>', 'a'.repeat(65)])(
    'rejects tier %j',
    (tier) => {
      expect(parsePayIntent(q(`intent=pay&tier=${encodeURIComponent(tier)}`))).toBeNull();
    },
  );
});

describe('buildPayIntentSignupHref', () => {
  it('round-trips through parsePayIntent', () => {
    const href = buildPayIntentSignupHref({
      tierId: TIER,
      programSlug: 'meys-7th',
      applicationCategory: 'self_funded',
    });
    const url = new URL(href, 'https://x.test');
    expect(url.pathname).toBe('/login');
    expect(url.searchParams.get('mode')).toBe('signup');
    expect(url.searchParams.get('applicationCategory')).toBe('self_funded');
    expect(parsePayIntent(url.searchParams)).toEqual({ tierId: TIER, programSlug: 'meys-7th' });
  });

  it('omits the slug when the edition is unknown', () => {
    expect(buildPayIntentSignupHref({ tierId: TIER })).not.toContain('programSlug');
  });
});

describe('storage', () => {
  // Map-backed stand-in: Node 25 ships its own global localStorage that shadows jsdom's.
  beforeEach(() => {
    const data = new Map<string, string>();
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: (k: string) => data.get(k) ?? null,
        setItem: (k: string, v: string) => void data.set(k, v),
        removeItem: (k: string) => void data.delete(k),
      },
    });
  });

  it('saves, reads and clears an intent', () => {
    savePayIntent({ tierId: TIER, programSlug: 'meys-7th' });
    expect(readPayIntent()).toEqual({ tierId: TIER, programSlug: 'meys-7th' });
    clearPayIntent();
    expect(readPayIntent()).toBeNull();
  });

  it('expires after the TTL', () => {
    savePayIntent({ tierId: TIER, programSlug: null }, 1_000);
    expect(readPayIntent(1_000 + PAY_INTENT_TTL_MS)).not.toBeNull();
    expect(readPayIntent(1_000 + PAY_INTENT_TTL_MS + 1)).toBeNull();
  });

  it('rejects tampered or corrupt storage', () => {
    window.localStorage.setItem(PAY_INTENT_STORAGE_KEY, '{not json');
    expect(readPayIntent()).toBeNull();
    window.localStorage.setItem(
      PAY_INTENT_STORAGE_KEY,
      JSON.stringify({ tierId: '<b>', programSlug: null, savedAt: Date.now() }),
    );
    expect(readPayIntent()).toBeNull();
  });
});

describe('decidePayTarget', () => {
  const registered = [
    { programId: 'p-6', programSlug: 'meys-6th' },
    { programId: 'p-7', programSlug: 'meys-7th' },
  ];
  const intent = (programSlug: string | null) => ({ tierId: TIER, programSlug });

  it('pays on the named edition when the participant is registered on it', () => {
    expect(decidePayTarget(intent('meys-7th'), registered, null)).toEqual({ kind: 'pay', programId: 'p-7' });
  });

  it('joins when the slug is the joinable edition, never falling back to another', () => {
    const joinable = { id: 'p-8', name: 'MEYS 8th', slug: 'meys-8th' };
    expect(decidePayTarget(intent('meys-8th'), registered, joinable)).toEqual({
      kind: 'join',
      programName: 'MEYS 8th',
    });
  });

  it('aborts when the slug is neither registered nor joinable', () => {
    const joinable = { id: 'p-8', name: 'MEYS 8th', slug: 'meys-8th' };
    expect(decidePayTarget(intent('kys-3rd'), registered, joinable)).toEqual({ kind: 'abort', slug: 'kys-3rd' });
    expect(decidePayTarget(intent('kys-3rd'), registered, null)).toEqual({ kind: 'abort', slug: 'kys-3rd' });
    expect(decidePayTarget(intent('kys-3rd'), [], undefined)).toEqual({ kind: 'abort', slug: 'kys-3rd' });
  });

  it('defers to the resolver only when the intent names no edition', () => {
    expect(decidePayTarget(intent(null), registered, null)).toEqual({ kind: 'resolver' });
  });
});
