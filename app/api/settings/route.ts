import { NextResponse } from 'next/server';
import type { SettingsData } from '@/types/settings';
import { apiGet } from '@/lib/api/httpClient';

const BRAND_URL = 'https://istanbulyouthsummit.com';

export async function GET() {
  try {
    const json = await apiGet<{ statusCode: number; message: string; data: SettingsData }>(
      '/v1/landing/settings',
      {
        headers: {
          'x-brand-domain': BRAND_URL,
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
