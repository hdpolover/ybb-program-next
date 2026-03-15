import type { SettingsData } from '@/types/settings';
import { apiGetWithEnvelope } from '@/lib/api/httpClient';

function normalizeBrandUrl(input: string): string {
  const trimmed = (input || '').trim().replace(/\/+$/, '');
  if (!trimmed) return '';
  const withoutProtocol = trimmed.replace(/^https?:\/\//, '');
  // Strip port if present (e.g. localhost:3000)
  return withoutProtocol.split(':')[0];
}

const DEFAULT_BRAND_URL =
  normalizeBrandUrl(process.env.NEXT_PUBLIC_BRAND_DOMAIN || '') || 'japanyouthsummit.com';

export async function getSettingsForBrandDomain(brandDomain: string): Promise<SettingsData> {
  const normalizedHost = normalizeBrandUrl(brandDomain);
  const normalized =
    !normalizedHost || normalizedHost === 'localhost' || normalizedHost === '127.0.0.1'
      ? DEFAULT_BRAND_URL
      : normalizedHost;
  return apiGetWithEnvelope<SettingsData>('/v1/landing/settings', {
    headers: {
      'x-brand-domain': normalized,
    },
    next: { revalidate: 0 },
  });
}

export async function getSettings(): Promise<SettingsData> {
  if (typeof window !== 'undefined') {
    const res = await fetch('/api/settings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      throw new Error(`API request failed: ${res.status} ${res.statusText}`);
    }

    const json = (await res.json()) as { statusCode: number; message: string; data: SettingsData };
    if (json.statusCode !== 200 || !json.data) {
      throw new Error(json.message || 'Unexpected API response');
    }

    return json.data;
  }

  return apiGetWithEnvelope<SettingsData>('/v1/landing/settings', {
    headers: {
      'x-brand-domain': DEFAULT_BRAND_URL,
    },
    next: { revalidate: 0 },
  });
}
