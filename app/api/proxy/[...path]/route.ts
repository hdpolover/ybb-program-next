import { NextRequest, NextResponse } from 'next/server';
import { getServerApiBaseUrl } from '@/lib/server/apiBaseUrl';

const FORWARDED_REQUEST_HEADERS = [
  'accept',
  'accept-language',
  'authorization',
  'cookie',
  'content-type',
  'x-brand-domain',
] as const;

const RESPONSE_HEADERS = ['content-type', 'content-disposition', 'cache-control'] as const;

function buildUpstreamUrl(path: string[], request: NextRequest): URL {
  const upstreamPath = path.join('/');
  const apiUrl = new URL(`/v1/${upstreamPath}`, getServerApiBaseUrl());

  request.nextUrl.searchParams.forEach((value, key) => {
    apiUrl.searchParams.append(key, value);
  });

  return apiUrl;
}

async function resolveProxyPath(paramsPromise: Promise<unknown>): Promise<string[]> {
  const params = (await paramsPromise) as { path?: string[] | string };
  const path = params.path;

  if (Array.isArray(path)) {
    return path;
  }

  return typeof path === 'string' ? [path] : [];
}

async function forward(
  request: NextRequest,
  { params }: { params: Promise<unknown> },
): Promise<NextResponse> {
  const apiUrl = buildUpstreamUrl(await resolveProxyPath(params), request);

  const headers = new Headers();
  for (const headerName of FORWARDED_REQUEST_HEADERS) {
    const headerValue = request.headers.get(headerName);
    if (headerValue) {
      headers.set(headerName, headerValue);
    }
  }

  const upstreamResponse = await fetch(apiUrl.toString(), {
    method: request.method,
    headers,
    body: request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.text(),
    cache: 'no-store',
  });

  const responseHeaders = new Headers();
  for (const headerName of RESPONSE_HEADERS) {
    const headerValue = upstreamResponse.headers.get(headerName);
    if (headerValue) {
      responseHeaders.set(headerName, headerValue);
    }
  }

  return new NextResponse(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<unknown> },
): Promise<NextResponse> {
  return forward(request, context);
}

export async function HEAD(
  request: NextRequest,
  context: { params: Promise<unknown> },
): Promise<NextResponse> {
  return forward(request, context);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<unknown> },
): Promise<NextResponse> {
  return forward(request, context);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<unknown> },
): Promise<NextResponse> {
  return forward(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<unknown> },
): Promise<NextResponse> {
  return forward(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<unknown> },
): Promise<NextResponse> {
  return forward(request, context);
}
