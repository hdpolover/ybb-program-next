import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { HOME_CACHE_TAG } from '@/lib/constants/cache';

export async function POST(request: Request) {
  const secret = process.env.HOME_REVALIDATE_SECRET;

  if (secret) {
    const authHeader = request.headers.get('authorization') ?? '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (token !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  revalidateTag(HOME_CACHE_TAG, 'max');

  return NextResponse.json({ revalidated: true, tag: HOME_CACHE_TAG });
}
