import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getServerApiBaseUrl } from '@/lib/server/apiBaseUrl';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';
import { isRecord, getEnvelopeData } from '@/lib/api/response';

/**
 * Without a deadline this proxy inherits fetch's default of waiting forever.
 * The participant-facing symptom is the one thing an upload button must never
 * do: spin indefinitely with no error and no way to tell whether the file
 * landed. A stalled API upstream produced exactly that.
 *
 * Generous on purpose. Signed copies are scans and phone photos on hotel or
 * campus wifi, and the API's own storage timeout is 300s, so this only has to
 * be shorter than "forever", not tight. The file is fully buffered here before
 * the upstream call, so this bounds the API hop only, not the participant's
 * own upload to us.
 */
const UPLOAD_TIMEOUT_MS = 120_000;

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
      signal: AbortSignal.timeout(UPLOAD_TIMEOUT_MS),
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
    // AbortSignal.timeout rejects with a TimeoutError; an upstream socket that
    // dies mid-transfer surfaces as a generic fetch failure. Both mean the same
    // thing to the participant, and both used to reach them as a bare 500 with
    // whatever internal text the error carried.
    if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
      return NextResponse.json(
        {
          statusCode: 504,
          message:
            'Upload timed out before it finished. Your file was not saved. Please check your connection and try again.',
          data: null,
        },
        { status: 504 },
      );
    }

    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { statusCode: 500, message, data: null },
      { status: 500 },
    );
  }
}
