import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('next/cache', () => ({
  unstable_cache: (fn: (...args: unknown[]) => unknown) => fn,
}));

const apiGetWithEnvelope = vi.fn();
vi.mock('./httpClient', () => ({
  apiGetWithEnvelope: (...args: unknown[]) => apiGetWithEnvelope(...args),
}));

import { getActivityData } from './activity';

describe('getActivityData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('requests the activity endpoint with the brand domain header', async () => {
    apiGetWithEnvelope.mockResolvedValue({ enabled: true, items: [] });

    await getActivityData('istanyouthsummit.com');

    expect(apiGetWithEnvelope).toHaveBeenCalledWith(
      '/v1/landing/activity',
      expect.objectContaining({
        headers: { 'x-brand-domain': 'istanyouthsummit.com' },
      }),
    );
  });

  // The shared transform interceptor flattens the API's { enabled, items } DTO:
  // items becomes the envelope's `data` and `enabled` moves to `meta`.
  // apiGetWithEnvelope returns `data`, so these mocks resolve a bare array --
  // this is the real production shape, verified against the live endpoint.
  it('returns the items the envelope carried', async () => {
    const items = [
      { type: 'registered', name: 'Aiman K.', country: 'Pakistan', countryCode: 'PK', programName: 'China Youth Summit 2026' },
    ];
    apiGetWithEnvelope.mockResolvedValue(items);

    await expect(getActivityData('brand.com')).resolves.toEqual(items);
  });

  it('returns an empty array when the pool is disabled, which arrives as an empty array', async () => {
    apiGetWithEnvelope.mockResolvedValue([]);

    await expect(getActivityData('brand.com')).resolves.toEqual([]);
  });

  it('returns an empty array when the request fails', async () => {
    apiGetWithEnvelope.mockRejectedValue(new Error('boom'));

    await expect(getActivityData('brand.com')).resolves.toEqual([]);
  });

  it('returns an empty array when the payload is not an array', async () => {
    apiGetWithEnvelope.mockResolvedValue(null);

    await expect(getActivityData('brand.com')).resolves.toEqual([]);
  });

  it('does not treat the pre-interceptor DTO shape as items', async () => {
    // Guards the exact regression this fix addresses: if a future change makes the
    // endpoint return { enabled, items } unflattened, that object is not an array
    // and must degrade to empty rather than being rendered as a toast.
    apiGetWithEnvelope.mockResolvedValue({
      enabled: true,
      items: [{ type: 'registered', name: 'Aiman K.', country: 'Pakistan', countryCode: 'PK', programName: 'CYS' }],
    });

    await expect(getActivityData('brand.com')).resolves.toEqual([]);
  });
});
