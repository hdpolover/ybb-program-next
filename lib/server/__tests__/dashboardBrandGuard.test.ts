// lib/server/__tests__/dashboardBrandGuard.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';

const getCookie = vi.fn();
vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({ get: getCookie })),
}));

vi.mock('@/lib/server/envContext', () => ({
  resolveBrandDomain: vi.fn(async () => 'koreayouthsummit.com'),
}));

const apiGetWithEnvelope = vi.fn();
vi.mock('@/lib/api/httpClient', () => ({
  apiGetWithEnvelope: (...args: unknown[]) => apiGetWithEnvelope(...args),
}));

const fetchAuthContext = vi.fn();
vi.mock('@/lib/api/authContext', () => ({
  fetchAuthContext: (...args: unknown[]) => fetchAuthContext(...args),
}));

const getSettingsForBrandDomain = vi.fn();
vi.mock('@/lib/api/settings', () => ({
  getSettingsForBrandDomain: (...args: unknown[]) => getSettingsForBrandDomain(...args),
}));

import { getDashboardBrandGuard } from '@/lib/server/dashboardBrandGuard';

const SETTINGS_FIXTURE = {
  brand: { name: 'Korea Youth Summit' },
  available_brands: [
    { id: 'brand-meys', slug: 'meys', name: 'Middle East Youth Summit', website_url: 'middleeastyouthsummit.com' },
    { id: 'brand-kys', slug: 'kys', name: 'Korea Youth Summit', website_url: 'koreayouthsummit.com' },
  ],
};

describe('getDashboardBrandGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns ok without making any backend call when there is no session cookie', async () => {
    getCookie.mockReturnValue(undefined);

    const result = await getDashboardBrandGuard();

    expect(result).toEqual({ type: 'ok' });
    expect(apiGetWithEnvelope).not.toHaveBeenCalled();
    expect(fetchAuthContext).not.toHaveBeenCalled();
    expect(getSettingsForBrandDomain).not.toHaveBeenCalled();
  });

  it('returns ok when the session brand matches the host brand', async () => {
    getCookie.mockReturnValue({ value: 'token123' });
    apiGetWithEnvelope.mockResolvedValue({ brandId: 'brand-kys' });
    fetchAuthContext.mockResolvedValue({ brandId: 'brand-kys', programId: 'prog-1', programSlug: 'kys-4th' });
    getSettingsForBrandDomain.mockResolvedValue(SETTINGS_FIXTURE);

    const result = await getDashboardBrandGuard();

    expect(result).toEqual({ type: 'ok' });
  });

  it('returns ok when the host brand is unresolved (null) — never a false-positive mismatch', async () => {
    getCookie.mockReturnValue({ value: 'token123' });
    apiGetWithEnvelope.mockResolvedValue({ brandId: 'brand-meys' });
    fetchAuthContext.mockResolvedValue({ brandId: null, programId: null, programSlug: null });
    getSettingsForBrandDomain.mockResolvedValue(SETTINGS_FIXTURE);

    const result = await getDashboardBrandGuard();

    expect(result).toEqual({ type: 'ok' });
  });

  it('returns a mismatch with brand names, the other account link, and a register link when the host has an open program', async () => {
    getCookie.mockReturnValue({ value: 'token123' });
    apiGetWithEnvelope.mockResolvedValue({ brandId: 'brand-meys' });
    fetchAuthContext.mockResolvedValue({ brandId: 'brand-kys', programId: 'prog-1', programSlug: 'kys-4th' });
    getSettingsForBrandDomain.mockResolvedValue(SETTINGS_FIXTURE);

    const result = await getDashboardBrandGuard();

    expect(result).toEqual({
      type: 'mismatch',
      hostBrandName: 'Korea Youth Summit',
      sessionBrand: { name: 'Middle East Youth Summit', url: 'middleeastyouthsummit.com' },
      registerUrl: '/login?mode=signup&programSlug=kys-4th',
    });
  });

  it('omits the register link when the host brand has no program to register into', async () => {
    getCookie.mockReturnValue({ value: 'token123' });
    apiGetWithEnvelope.mockResolvedValue({ brandId: 'brand-meys' });
    fetchAuthContext.mockResolvedValue({ brandId: 'brand-kys', programId: null, programSlug: null });
    getSettingsForBrandDomain.mockResolvedValue(SETTINGS_FIXTURE);

    const result = await getDashboardBrandGuard();

    expect(result.type).toBe('mismatch');
    if (result.type === 'mismatch') {
      expect(result.registerUrl).toBeNull();
    }
  });

  it('omits the session-brand link when that brand is not in the available-brands list (e.g. deactivated)', async () => {
    getCookie.mockReturnValue({ value: 'token123' });
    apiGetWithEnvelope.mockResolvedValue({ brandId: 'brand-unknown' });
    fetchAuthContext.mockResolvedValue({ brandId: 'brand-kys', programId: 'prog-1', programSlug: 'kys-4th' });
    getSettingsForBrandDomain.mockResolvedValue(SETTINGS_FIXTURE);

    const result = await getDashboardBrandGuard();

    expect(result.type).toBe('mismatch');
    if (result.type === 'mismatch') {
      expect(result.sessionBrand).toBeNull();
    }
  });

  it('fails open (ok) when the session lookup throws', async () => {
    getCookie.mockReturnValue({ value: 'token123' });
    apiGetWithEnvelope.mockRejectedValue(new Error('backend down'));
    fetchAuthContext.mockResolvedValue({ brandId: 'brand-kys', programId: 'prog-1', programSlug: 'kys-4th' });
    getSettingsForBrandDomain.mockResolvedValue(SETTINGS_FIXTURE);

    const result = await getDashboardBrandGuard();

    expect(result).toEqual({ type: 'ok' });
  });

  it('fails open (ok) when the host context lookup throws', async () => {
    getCookie.mockReturnValue({ value: 'token123' });
    apiGetWithEnvelope.mockResolvedValue({ brandId: 'brand-meys' });
    fetchAuthContext.mockRejectedValue(new Error('backend down'));
    getSettingsForBrandDomain.mockResolvedValue(SETTINGS_FIXTURE);

    const result = await getDashboardBrandGuard();

    expect(result).toEqual({ type: 'ok' });
  });
});
