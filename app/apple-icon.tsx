import { readFile } from 'fs/promises';
import { join } from 'path';
import { ImageResponse } from 'next/og';
import { getSettingsForBrandDomain } from '@/lib/api/settings';
import { resolveBrandDomain } from '@/lib/server/envContext';
import { pickBrandAppleIconUrl, toDataUrl } from '@/lib/branding/icon';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

async function getFallbackLogoDataUrl(): Promise<string> {
  const file = await readFile(join(process.cwd(), 'public', 'img', 'ybb-logo.png'));
  return `data:image/png;base64,${file.toString('base64')}`;
}

export default async function AppleIcon() {
  let brandIconDataUrl: string | null = null;

  try {
    const host = await resolveBrandDomain();
    const settings = await getSettingsForBrandDomain(host);
    const brandIconUrl = pickBrandAppleIconUrl(settings);
    brandIconDataUrl = brandIconUrl ? await toDataUrl(brandIconUrl) : null;
  } catch {
    // Keep safe defaults if settings lookup fails.
  }

  const src = brandIconDataUrl ?? await getFallbackLogoDataUrl();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          overflow: 'hidden',
        }}
      >
        <img
          src={src}
          alt="Brand icon"
          width="180"
          height="180"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </div>
    ),
    {
      ...size,
    },
  );
}
