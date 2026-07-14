import { NextResponse } from 'next/server';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';
import { getServerApiBaseUrl } from '@/lib/server/apiBaseUrl';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code')?.trim().toUpperCase();

  if (!code || code.length < 2) {
    return NextResponse.json({ valid: false });
  }

  const brandDomain = resolveBrandDomainFromRequest(request);
  const apiBaseUrl = getServerApiBaseUrl();

  const path = `/v1/participants/ambassador/referral-codes/${encodeURIComponent(code)}`;

  try {
    const url = new URL(path, apiBaseUrl);
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'x-brand-domain': brandDomain,
      },
      signal: AbortSignal.timeout(5000),
      cache: 'no-store',
    });

    if (res.status === 200) return NextResponse.json({ valid: true });
    if (res.status === 404 || res.status === 400) return NextResponse.json({ valid: false });
  } catch {
    // timeout or network error → fall through to indeterminate
  }

  // Could not determine — show no indicator rather than a false result
  return NextResponse.json({ valid: null });
}
