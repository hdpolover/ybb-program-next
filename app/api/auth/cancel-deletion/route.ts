// app/api/auth/cancel-deletion/route.ts

import { NextResponse } from 'next/server';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';
import { getServerApiBaseUrl } from '@/lib/server/apiBaseUrl';
import { getCsrfGuardRejection } from '@/lib/server/bffSecurity';
import { forwardedForHeader } from '@/lib/server/forwardedFor';
import { isRecord } from '@/lib/api/response';

type CancelDeletionBody = {
  requestId?: string;
  token?: string;
};

// Public — mirrors POST /v1/users/deletion-request/cancel on the API (see
// CancelDeletionRequestHandler in ybb-platform). No auth: the account this acts
// on is deactivated, so the user cannot be logged in. Called from
// app/auth/cancel-deletion/page.tsx, which reads requestId/token off the
// emailed link's query string.
export async function POST(request: Request) {
  try {
    const csrfRejection = getCsrfGuardRejection(request);
    if (csrfRejection) return csrfRejection;

    const body = (await request.json().catch(() => ({}))) as CancelDeletionBody;
    if (!body?.requestId || !body?.token) {
      return NextResponse.json(
        { statusCode: 400, message: 'requestId and token are required', data: null },
        { status: 400 },
      );
    }

    const brandDomain = resolveBrandDomainFromRequest(request);
    const apiUrl = new URL('/v1/users/deletion-request/cancel', getServerApiBaseUrl());

    const res = await fetch(apiUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-brand-domain': brandDomain,
        ...forwardedForHeader(request),
      },
      body: JSON.stringify({ requestId: body.requestId, token: body.token }),
      cache: 'no-store',
    });

    const json = await res.json().catch(() => ({}));
    const jsonRecord = isRecord(json) ? json : {};

    if (!res.ok) {
      return NextResponse.json(
        {
          statusCode: typeof jsonRecord.statusCode === 'number' ? jsonRecord.statusCode : res.status,
          message:
            typeof jsonRecord.message === 'string'
              ? jsonRecord.message
              : 'This cancellation link is invalid or has expired.',
          data: null,
        },
        { status: res.status },
      );
    }

    // TransformInterceptor wraps the handler's { message } return value as
    // data.message on success (the handler itself has no statusCode/items/data
    // array field for it to key off of) — see http-exception.filter.ts /
    // transform.interceptor.ts on the API. Surface it at the top level too so
    // callers don't need to know that.
    const nestedMessage = isRecord(jsonRecord.data) && typeof jsonRecord.data.message === 'string'
      ? jsonRecord.data.message
      : null;

    return NextResponse.json({
      statusCode: 200,
      message: nestedMessage ?? 'Success',
      data: jsonRecord.data ?? json,
    });
  } catch {
    return NextResponse.json({ statusCode: 500, message: 'Internal Server Error', data: null }, { status: 500 });
  }
}
