import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';
import { getServerApiBaseUrl } from '@/lib/server/apiBaseUrl';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  context: { params: Promise<{ fileId: string }> },
) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json({ statusCode: 401, message: 'Unauthorized', data: null }, { status: 401 });
    }

    const { fileId } = await context.params;
    if (!fileId) {
      return NextResponse.json({ statusCode: 400, message: 'Missing file id', data: null }, { status: 400 });
    }

    const brandDomain = resolveBrandDomainFromRequest(request);
    const apiUrl = new URL(`/v1/files/${encodeURIComponent(fileId)}/download`, getServerApiBaseUrl());

    const upstream = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'x-brand-domain': brandDomain,
      },
      cache: 'no-store',
    });

    if (!upstream.ok) {
      const json = (await upstream.json().catch(() => null)) as { message?: string } | null;
      return NextResponse.json(
        { statusCode: upstream.status, message: json?.message ?? 'Failed to load attachment', data: null },
        { status: upstream.status },
      );
    }

    const headers = new Headers();
    const contentType = upstream.headers.get('content-type');
    const contentLength = upstream.headers.get('content-length');
    const contentDisposition = upstream.headers.get('content-disposition');

    if (contentType) headers.set('content-type', contentType);
    if (contentLength) headers.set('content-length', contentLength);
    if (contentDisposition) headers.set('content-disposition', contentDisposition);
    headers.set('cache-control', 'private, no-store');

    return new NextResponse(upstream.body, { status: 200, headers });
  } catch (error) {
    return NextResponse.json(
      { statusCode: 500, message: error instanceof Error ? error.message : 'Internal Server Error', data: null },
      { status: 500 },
    );
  }
}
