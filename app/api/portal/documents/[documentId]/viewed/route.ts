import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getServerApiBaseUrl } from '@/lib/server/apiBaseUrl';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { statusCode: 401, message: 'Unauthorized', data: null },
        { status: 401 },
      );
    }

    const { documentId } = await params;

    // Validate UUID format to prevent path-injection (e.g. "x/../../internal")
    const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!UUID_RE.test(documentId)) {
      return NextResponse.json(
        { statusCode: 400, message: 'Invalid documentId', data: null },
        { status: 400 },
      );
    }

    const brandDomain = resolveBrandDomainFromRequest(request);

    const apiUrl = new URL(
      `/v1/portal/documents/${documentId}/viewed`,
      getServerApiBaseUrl(),
    );

    const res = await fetch(apiUrl.toString(), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'x-brand-domain': brandDomain,
        'Content-Type': 'application/json',
      },
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        {
          statusCode: (json as { statusCode?: number })?.statusCode ?? res.status,
          message: (json as { message?: string })?.message ?? 'Failed to mark document as viewed',
          data: (json as { data?: unknown })?.data ?? null,
        },
        { status: res.status },
      );
    }

    return NextResponse.json({
      statusCode: 200,
      message: 'Success',
      data: (json as { data?: unknown })?.data ?? json ?? null,
    });
  } catch (error) {
    console.error('[portal/documents/viewed] proxy error', error);
    return NextResponse.json(
      { statusCode: 500, message: 'Service unavailable', data: null },
      { status: 500 },
    );
  }
}
