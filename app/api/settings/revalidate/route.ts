import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { SETTINGS_CACHE_TAG } from '@/lib/constants/cache';

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

  if (secret) {
    const authHeader = request.headers.get('authorization') ?? '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (token !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  revalidateTag(SETTINGS_CACHE_TAG, 'max');

  return NextResponse.json({ revalidated: true, tag: SETTINGS_CACHE_TAG });
}
