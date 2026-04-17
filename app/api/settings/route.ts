import { NextResponse } from 'next/server';
import type { SettingsData } from '@/types/settings';
import { getSettingsForBrandDomain } from '@/lib/api/settings';
import { resolveBrandDomain } from '@/lib/server/envContext';

export async function GET() {
  try {
    const brandDomain = await resolveBrandDomain();
    // Uses the same unstable_cache-backed fetch as the SSR layout —
    // so repeated calls within the 1-hour window hit Next.js Data Cache, not the backend.
    const data = await getSettingsForBrandDomain(brandDomain);
    return NextResponse.json({ statusCode: 200, message: 'Success', data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    const fallback: SettingsData = {
      maintenance: {
        is_maintenance_mode: false,
      },
      brand: {
        name: 'Youth Summit',
        logo_url: null,
        logo_white_url: null,
        logo_color_url: null,
        logo_icon_url: null,
        primary_color: null,
        support_email: null,
        contact_phone: null,
        contact_whatsapp: null,
        address: null,
        social_media: {},
      },
      footer_navigation: [],
      currency: {
        code: 'IDR',
        rate_to_idr: 1,
      },
    };

    return NextResponse.json(
      { statusCode: 200, message, data: fallback },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    );
  }
}
