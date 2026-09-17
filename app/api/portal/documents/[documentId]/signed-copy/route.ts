import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getServerApiBaseUrl } from '@/lib/server/apiBaseUrl';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';
import { isRecord, getEnvelopeData } from '@/lib/api/response';
import {
  SIGNED_COPY_INCOMPLETE_MESSAGE,
  SIGNED_COPY_MAX_BODY_BYTES,
  SIGNED_COPY_MAX_FILE_BYTES,
  SIGNED_COPY_TOO_LARGE_MESSAGE,
} from '@/lib/dashboard/signedCopyUpload';

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

function errorResponse(status: number, message: string) {
  return NextResponse.json({ statusCode: status, message, data: null }, { status });
}

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

    // Refuse an oversized upload from its header, before reading a byte of it.
    // Past the 10 MB limit the old path read the body anyway and the
    // participant got a bare 500 from the parse below; the API would have said
    // 413, but only after the whole file had crossed two hops to get there.
    const contentLength = Number(request.headers.get('content-length'));
    if (Number.isFinite(contentLength) && contentLength > SIGNED_COPY_MAX_BODY_BYTES) {
      return errorResponse(413, SIGNED_COPY_TOO_LARGE_MESSAGE);
    }

    // formData() throws on a body that is not complete multipart: a connection
    // dropped mid-upload (common on mobile data), or a body cut short upstream
    // of this route. Next's middleware clones request bodies up to
    // experimental.proxyClientMaxBodySize and truncates past it, which is how
    // near-limit files used to fail here. That is a retryable transport
    // failure, not a server fault, and it has to say the file was not saved.
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return errorResponse(400, SIGNED_COPY_INCOMPLETE_MESSAGE);
    }

    const file = formData.get('file');
    if (!file || typeof file === 'string') {
      return errorResponse(400, 'No file was received. Please choose the signed letter and try again.');
    }
    // Content-Length is optional (chunked bodies), so check the parsed file too.
    if (file.size > SIGNED_COPY_MAX_FILE_BYTES) {
      return errorResponse(413, SIGNED_COPY_TOO_LARGE_MESSAGE);
    }

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
      // The API's own 413 is multer's terse "File too large"; say what the
      // limit is and what to do instead. Every other upstream reason (a
      // file-service type rejection, a missing application) is forwarded as is.
      const upstreamMessage =
        res.status === 413
          ? SIGNED_COPY_TOO_LARGE_MESSAGE
          : typeof j.message === 'string'
            ? j.message
            : 'Upload failed and your file was not saved. Please try again.';
      return NextResponse.json(
        {
          statusCode: typeof j.statusCode === 'number' ? j.statusCode : res.status,
          message: upstreamMessage,
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
