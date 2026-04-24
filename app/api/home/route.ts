import { getHomePageData } from '@/lib/api/home';
import { NextResponse } from 'next/server';
import { resolveBrandDomain } from '@/lib/server/envContext';

export async function GET() {
  const host = await resolveBrandDomain();

  try {
    const data = await getHomePageData(host);
    return NextResponse.json({
      statusCode: 200,
      message: 'Success',
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        statusCode: 500,
        message: error instanceof Error ? error.message : 'Failed to fetch home page data',
        data: null,
      },
      { status: 500 }
    );
  }
}
