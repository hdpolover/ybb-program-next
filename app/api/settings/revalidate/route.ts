import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { getSettingsCacheTag, SETTINGS_CACHE_TAG } from '@/lib/constants/cache';
import { isRevalidateAuthorized } from '@/lib/server/revalidateAuth';

/**
 * POST /api/settings/revalidate
 *
 * Clears the server-side Next.js Data Cache for settings.
 * The next SSR request will fetch fresh settings from the backend API,
 * and SettingsProvider will automatically sync the updated data to localStorage.
 *
 * Protect with SETTINGS_REVALIDATE_SECRET env var in production.
 * Call with: Authorization: Bearer <secret>
 */
export async function POST(request: Request) {
  const secret = process.env.SETTINGS_REVALIDATE_SECRET;
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
    ? getSettingsCacheTag(requestedBrandDomain)
    : SETTINGS_CACHE_TAG;

  revalidateTag(targetTag, 'max');

  return NextResponse.json({
    revalidated: true,
    tag: targetTag,
    scope: requestedBrandDomain ? 'brand' : 'global',
  });
}
