import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import type { SettingsData } from '@/types/settings';
import { apiGet } from '@/lib/api/httpClient';

function normalizeBrandUrl(input: string): string {
  const trimmed = (input || '').trim().replace(/\/+$/, '');
  if (!trimmed) return '';
  return trimmed.replace(/^https?:\/\//, '');
}

const DEFAULT_BRAND_URL =
  normalizeBrandUrl(process.env.NEXT_PUBLIC_BRAND_DOMAIN || '') || 'istanbulyouthsummit.com';

async function resolveBrandDomain(): Promise<string> {
  const h = await headers();
  const hostnameRaw = h.get('x-hostname') || h.get('host') || '';
  const hostname = hostnameRaw.split(':')[0];

  if (!hostname) return DEFAULT_BRAND_URL;

  if (hostname.startsWith('localhost') || hostname.startsWith('127.0.0.1')) {
    return DEFAULT_BRAND_URL;
  }

  return normalizeBrandUrl(hostname);
}

export async function GET() {
  try {
    const brandDomain = await resolveBrandDomain();
    const json = await apiGet<{ statusCode: number; message: string; data: SettingsData }>(
      '/v1/landing/settings',
      {
        headers: {
          'x-brand-domain': brandDomain,
        },
      },
    );

    return NextResponse.json(json);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    const fallback: SettingsData = {
      maintenance: {
        is_maintenance_mode: false,
      },
      brand: {
        name: 'Youth Summit',
        logo_url: null,
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

    return NextResponse.json({ statusCode: 200, message, data: fallback });
  }
}
