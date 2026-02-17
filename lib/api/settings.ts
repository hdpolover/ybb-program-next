import type { SettingsData } from '@/types/settings';
import { apiGetWithEnvelope } from '@/lib/api/httpClient';

function normalizeBrandUrl(input: string): string {
  const trimmed = (input || '').trim().replace(/\/+$/, '');
  if (!trimmed) return '';
  return trimmed.replace(/^https?:\/\//, '');
}

const DEFAULT_BRAND_URL =
  normalizeBrandUrl(process.env.NEXT_PUBLIC_BRAND_DOMAIN || '') || 'istanbulyouthsummit.com';

export async function getSettings(): Promise<SettingsData> {
  if (typeof window !== 'undefined') {
    const res = await fetch('/api/settings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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
  });
}
