import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { HOME_CACHE_TAG } from '@/lib/constants/cache';
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

  revalidateTag(HOME_CACHE_TAG, 'max');

  return NextResponse.json({ revalidated: true, tag: HOME_CACHE_TAG });
}
