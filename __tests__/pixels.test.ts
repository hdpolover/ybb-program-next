// __tests__/pixels.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  toRegistrationCategory,
  trackCompleteRegistration,
  trackLead,
  trackProgramFeePaid,
  trackPurchase,
} from '@/lib/analytics/pixels';

type FbqCall = [string, string, Record<string, unknown> | undefined, { eventID?: string } | undefined];
type TtqCall = [string, Record<string, unknown> | undefined, { event_id?: string } | undefined];

const fbq = vi.fn();
const ttqTrack = vi.fn();

beforeEach(() => {
  fbq.mockClear();
  ttqTrack.mockClear();
  window.fbq = fbq as unknown as Window['fbq'];
  window.ttq = { track: ttqTrack };
  // The relay is fire-and-forget; stub it so tests assert on the pixels only.
  vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(new Response('{}'))));
});

describe('toRegistrationCategory', () => {
  it('passes through the canonical signup-link values', () => {
    expect(toRegistrationCategory('self_funded')).toBe('self_funded');
    expect(toRegistrationCategory('fully_funded')).toBe('fully_funded');
  });

  it('normalizes the dashboard summary display form to the same value', () => {
    // Without this the Ads Manager breakdown splits into duplicate buckets.
    expect(toRegistrationCategory('Fully Funded')).toBe('fully_funded');
    expect(toRegistrationCategory('self-funded')).toBe('self_funded');
  });

  it('rejects anything else rather than inventing a category', () => {
    expect(toRegistrationCategory('scholarship')).toBeNull();
    expect(toRegistrationCategory('')).toBeNull();
    expect(toRegistrationCategory(null)).toBeNull();
    expect(toRegistrationCategory(undefined)).toBeNull();
  });
});

describe('event dispatch', () => {
  it('sends a standard Meta event through track and its TikTok twin', () => {
    trackLead({ content_name: 'account_signup' }, { email: 'a@b.com' }, 'self_funded');

    const [command, name, params] = fbq.mock.calls[0] as FbqCall;
    expect(command).toBe('track');
    expect(name).toBe('Lead');
    expect(params).toMatchObject({ content_category: 'self_funded' });

    // Meta Lead (signup) is TikTok CompleteRegistration — deliberate crossover.
    const [tiktokName] = ttqTrack.mock.calls[0] as TtqCall;
    expect(tiktokName).toBe('CompleteRegistration');
  });

  it('sends a custom Meta event through trackCustom, not track', () => {
    // fbq('track', 'ProgramFeePaid') is silently dropped by Events Manager.
    trackProgramFeePaid({ value: 100, currency: 'USD' }, undefined, 'programfee_1');

    const [command, name] = fbq.mock.calls[0] as FbqCall;
    expect(command).toBe('trackCustom');
    expect(name).toBe('ProgramFeePaid');
  });

  it('maps application submitted to TikTok SubmitForm, not CompleteRegistration', () => {
    trackCompleteRegistration(undefined, undefined, 'fully_funded');

    const [, name] = fbq.mock.calls[0] as FbqCall;
    expect(name).toBe('CompleteRegistration');

    const [tiktokName] = ttqTrack.mock.calls[0] as TtqCall;
    expect(tiktokName).toBe('SubmitForm');
  });

  it('shares one event id across both pixels so each platform dedupes', () => {
    trackPurchase({ value: 25, currency: 'USD' }, undefined, 'purchase_inv_1', 'self_funded');

    const [, , , options] = fbq.mock.calls[0] as FbqCall;
    const [, , ttqOptions] = ttqTrack.mock.calls[0] as TtqCall;
    expect(options?.eventID).toBe('purchase_inv_1');
    expect(ttqOptions?.event_id).toBe('purchase_inv_1');
  });

  it('omits content_category rather than sending an empty one', () => {
    trackPurchase({ value: 25, currency: 'USD' });

    const [, , params] = fbq.mock.calls[0] as FbqCall;
    expect(params).not.toHaveProperty('content_category');
  });

  it('does not throw when neither pixel is installed', () => {
    window.fbq = undefined;
    window.ttq = undefined;
    expect(() => trackLead()).not.toThrow();
  });
});
