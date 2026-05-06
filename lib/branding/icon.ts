import type { SettingsData } from '@/types/settings';

export function normalizeBrandAccent(input: string | null | undefined): string {
  const raw = (input || '').trim();
  if (!raw) return '#1c57b3';
  const withHash = raw.startsWith('#') ? raw : `#${raw}`;
  return /^#[0-9a-fA-F]{6}$/.test(withHash) ? withHash : '#1c57b3';
}

export function initialLetters(value: string | null | undefined): string {
  const text = (value || '').trim();
  if (!text) return 'YB';
  const parts = text.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
  }
  return text.slice(0, 2).toUpperCase();
}

export function pickBrandIconUrl(settings: SettingsData | null | undefined): string | null {
  const candidates = [
    settings?.brand?.favicon_url,
    settings?.brand?.apple_icon_url,
    settings?.brand?.logo_icon_url,
    settings?.active_program?.favicon_url,
    settings?.active_program?.apple_icon_url,
    settings?.active_program?.logo_icon_url,
    settings?.brand?.logo_url,
    settings?.active_program?.logo_url,
  ];

  for (const candidate of candidates) {
    const normalized = candidate?.trim();
    if (normalized) return normalized;
  }

  return null;
}

export function pickBrandFaviconUrl(settings: SettingsData | null | undefined): string | null {
  const candidates = [
    settings?.brand?.favicon_url,
    settings?.active_program?.favicon_url,
    settings?.brand?.logo_icon_url,
    settings?.active_program?.logo_icon_url,
    settings?.brand?.logo_url,
    settings?.active_program?.logo_url,
  ];

  for (const candidate of candidates) {
    const normalized = candidate?.trim();
    if (normalized) return normalized;
  }

  return null;
}

export function pickBrandAppleIconUrl(settings: SettingsData | null | undefined): string | null {
  const candidates = [
    settings?.brand?.apple_icon_url,
    settings?.active_program?.apple_icon_url,
    settings?.brand?.logo_icon_url,
    settings?.active_program?.logo_icon_url,
    settings?.brand?.logo_url,
    settings?.active_program?.logo_url,
  ];

  for (const candidate of candidates) {
    const normalized = candidate?.trim();
    if (normalized) return normalized;
  }

  return null;
}

export async function toDataUrl(src: string): Promise<string | null> {
  try {
    const response = await fetch(src, { cache: 'no-store' });
    if (!response.ok) return null;

    const contentType = response.headers.get('content-type') || 'image/png';
    const bytes = await response.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    return `data:${contentType};base64,${base64}`;
  } catch {
    return null;
  }
}
