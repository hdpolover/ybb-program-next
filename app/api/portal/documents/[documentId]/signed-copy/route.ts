import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getServerApiBaseUrl } from '@/lib/server/apiBaseUrl';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';
import { isRecord, getEnvelopeData } from '@/lib/api/response';

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
    const brandDomain = resolveBrandDomainFromRequest(request);

    const formData = await request.formData();

    const apiUrl = new URL(
      `/v1/portal/documents/${documentId}/signed-copy`,
      getServerApiBaseUrl(),
    );

    const res = await fetch(apiUrl.toString(), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'x-brand-domain': brandDomain,
      },
      body: formData,
    });

    const json: unknown = await res.json().catch(() => ({}));
    if (!res.ok) {
      const j = isRecord(json) ? json : {};
      return NextResponse.json(
        {
          statusCode: typeof j.statusCode === 'number' ? j.statusCode : res.status,
          message: typeof j.message === 'string' ? j.message : 'Upload failed',
          data: 'data' in j ? (j.data ?? null) : null,
        },
        { status: res.status },
      );
    }

    return NextResponse.json({
      statusCode: 200,
      message: 'Success',
      data: getEnvelopeData(json) ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { statusCode: 500, message, data: null },
      { status: 500 },
    );
  }
}
