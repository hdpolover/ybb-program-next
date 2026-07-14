import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getServerApiBaseUrl } from '@/lib/server/apiBaseUrl';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { statusCode: 401, message: 'Unauthorized', data: null },
        { status: 401 },
      );
    }

    const brandDomain = resolveBrandDomainFromRequest(request);

    // Path is fixed — no user-controlled input injected into the URL path.
    const apiUrl = new URL('/v1/portal/loa/download', getServerApiBaseUrl());

    const upstream = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'x-brand-domain': brandDomain,
      },
      cache: 'no-store',
    });

    if (!upstream.ok) {
      // Forward the upstream status; surface the upstream error body as JSON
      // (NestJS returns JSON even for 403/404/429). Fall back to a generic envelope
      // so we never leak internal hostnames or raw stack traces.
      const json = await upstream.json().catch(() => ({}));
      return NextResponse.json(
        {
          statusCode: (json as { statusCode?: number })?.statusCode ?? upstream.status,
          message: (json as { message?: string })?.message ?? 'Invitation Letter download failed',
          data: (json as { data?: unknown })?.data ?? null,
        },
        { status: upstream.status },
      );
    }

    // BINARY path: pipe the upstream body straight through to the client.
    // We must NOT call upstream.json() — that would decode the PDF bytes as text.
    // NextResponse accepts a ReadableStream directly; this avoids buffering the
    // entire PDF in memory on the BFF server.
    const contentType =
      upstream.headers.get('Content-Type') ?? 'application/pdf';
    const contentDisposition =
      upstream.headers.get('Content-Disposition') ?? 'attachment; filename="Invitation Letter.pdf"';

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': contentDisposition,
      },
    });
  } catch (error) {
    console.error('[portal/loa/download] proxy error', error);
    return NextResponse.json(
      { statusCode: 500, message: 'Service unavailable', data: null },
      { status: 500 },
    );
  }
}
