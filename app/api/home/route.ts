import { getHomePageData } from '@/lib/api/home';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET() {
  const headersList = await headers();
  const host = headersList.get('host') || 'youthacademicforum.com';

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
