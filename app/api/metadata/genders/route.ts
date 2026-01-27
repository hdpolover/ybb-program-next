import { NextResponse } from 'next/server';
import { apiGet } from '@/lib/api/httpClient';

export async function GET() {
  try {
    const json = await apiGet<{ statusCode: number; message: string; data: string[] }>(
      '/v1/metadata/genders',
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
