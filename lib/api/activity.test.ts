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

  it('returns the items when the pool is enabled', async () => {
    const items = [
      { type: 'accepted', name: 'Yuki T.', country: 'Japan', countryCode: 'JP', programName: 'AYIMUN' },
    ];
    apiGetWithEnvelope.mockResolvedValue({ enabled: true, items });

    await expect(getActivityData('brand.com')).resolves.toEqual(items);
  });

  it('returns an empty array when the pool is disabled', async () => {
    apiGetWithEnvelope.mockResolvedValue({
      enabled: false,
      items: [{ type: 'accepted', name: 'Yuki T.', country: 'Japan', countryCode: 'JP', programName: 'AYIMUN' }],
    });

    await expect(getActivityData('brand.com')).resolves.toEqual([]);
  });

  it('returns an empty array when the request fails', async () => {
    apiGetWithEnvelope.mockRejectedValue(new Error('boom'));

    await expect(getActivityData('brand.com')).resolves.toEqual([]);
  });

  it('returns an empty array when the payload is malformed', async () => {
    apiGetWithEnvelope.mockResolvedValue({ enabled: true, items: null });

    await expect(getActivityData('brand.com')).resolves.toEqual([]);
  });
});
