import { NextResponse } from 'next/server';
import { apiGet } from '@/lib/api/httpClient';
import type { CityMetadata } from '@/types/metadata';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ countryCode: string }> },
) {
  try {
    const { countryCode } = await params;
    const { searchParams } = new URL(request.url);
    const stateCode = searchParams.get('stateCode');

    const url = stateCode
      ? `/v1/metadata/cities/${encodeURIComponent(countryCode)}?stateCode=${encodeURIComponent(stateCode)}`
      : `/v1/metadata/cities/${encodeURIComponent(countryCode)}`;

    const json = await apiGet<{ statusCode: number; message: string; data: CityMetadata[] }>(url);

    return NextResponse.json(json);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        statusCode: 500,
        message,
        data: [],
      },
      { status: 500 },
    );
  }
}
