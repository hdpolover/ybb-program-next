import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { getHomeCacheTag, HOME_CACHE_TAG } from '@/lib/constants/cache';
import { isRevalidateAuthorized } from '@/lib/server/revalidateAuth';

export async function POST(request: Request) {
  const secret = process.env.HOME_REVALIDATE_SECRET;
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction && !secret) {
    return NextResponse.json({ error: 'Revalidation is not configured' }, { status: 500 });
  }

  if (secret && !isRevalidateAuthorized(request, secret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const requestedBrandDomain = url.searchParams.get('brandDomain')?.trim() || '';
  const targetTag = requestedBrandDomain
    ? getHomeCacheTag(requestedBrandDomain)
    : HOME_CACHE_TAG;

  revalidateTag(targetTag, 'max');

  return NextResponse.json({
    revalidated: true,
    tag: targetTag,
    scope: requestedBrandDomain ? 'brand' : 'global',
  });
}
