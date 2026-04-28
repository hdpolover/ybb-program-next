import { ImageResponse } from 'next/og';
import { getSettingsForBrandDomain } from '@/lib/api/settings';
import { resolveBrandDomain } from '@/lib/server/envContext';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const size = {
  width: 64,
  height: 64,
};
export const contentType = 'image/png';

function normalizeHex(input: string | null | undefined): string {
  const raw = (input || '').trim();
  if (!raw) return '#1c57b3';
  const withHash = raw.startsWith('#') ? raw : `#${raw}`;
  return /^#[0-9a-fA-F]{6}$/.test(withHash) ? withHash : '#1c57b3';
}

function initialLetters(value: string | null | undefined): string {
  const text = (value || '').trim();
  if (!text) return 'YB';
  const parts = text.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
  }
  return text.slice(0, 2).toUpperCase();
}

export default async function Icon() {
  let initials = 'YB';
  let accent = '#1c57b3';

  try {
    const host = await resolveBrandDomain();
    const settings = await getSettingsForBrandDomain(host);
    initials = initialLetters(settings.active_program?.name || settings.brand?.name);
    accent = normalizeHex(settings.brand?.primary_color);
  } catch {
    // Keep safe defaults if settings lookup fails.
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 14,
          background: accent,
          color: '#ffffff',
          fontWeight: 800,
          fontSize: 28,
          letterSpacing: -1,
        }}
      >
        {initials}
      </div>
    ),
    {
      ...size,
    },
  );
}
