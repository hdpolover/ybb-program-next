import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';
import { getServerApiBaseUrl } from '@/lib/server/apiBaseUrl';
import { isRecord } from '@/lib/api/response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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

    const { id } = await params;
    const brandDomain = resolveBrandDomainFromRequest(request);
    const apiBase = getServerApiBaseUrl();

    const apiUrl = new URL(`/v1/portal/payments/${id}/invoice`, apiBase);
    const res = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/pdf',
        Authorization: `Bearer ${accessToken}`,
        'x-brand-domain': brandDomain,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const json: unknown = await res.json().catch(() => null);
      const j = isRecord(json) ? json : {};
      return NextResponse.json(
        {
          statusCode: typeof j.statusCode === 'number' ? j.statusCode : res.status,
          message: typeof j.message === 'string' ? j.message : 'Failed to download invoice',
          data: 'data' in j ? (j.data ?? null) : null,
        },
        { status: res.status },
      );
    }

    const file = await res.arrayBuffer();
    const contentType = res.headers.get('content-type') ?? 'application/pdf';
    const contentDisposition =
      res.headers.get('content-disposition') ?? `attachment; filename="invoice-${id}.pdf"`;

    return new NextResponse(file, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': contentDisposition,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { statusCode: 500, message, data: null },
      { status: 500 },
    );
  }
}
