import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import type { SettingsData } from '@/types/settings';
import { apiGet } from '@/lib/api/httpClient';

const DEFAULT_BRAND_URL = process.env.NEXT_PUBLIC_BRAND_DOMAIN || 'https://istanbulyouthsummit.com';

async function resolveBrandDomain(): Promise<string> {
  const h = await headers();
  const hostname = h.get('x-hostname') || h.get('host') || '';

  if (!hostname) return DEFAULT_BRAND_URL;

  if (hostname.startsWith('localhost') || hostname.startsWith('127.0.0.1')) {
    return DEFAULT_BRAND_URL;
  }

  return `https://${hostname}`;
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
    return NextResponse.json(
      {
        statusCode: 500,
        message,
        data: null,
      },
      { status: 500 },
    );
  }
}
