import { NextResponse } from 'next/server';
import { apiGet } from '@/lib/api/httpClient';
import type { StateMetadata } from '@/types/metadata';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ countryCode: string }> },
) {
  try {
    const { countryCode } = await params;

    const json = await apiGet<{ statusCode: number; message: string; data: StateMetadata[] }>(
      `/v1/metadata/states/${encodeURIComponent(countryCode)}`,
    );

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
