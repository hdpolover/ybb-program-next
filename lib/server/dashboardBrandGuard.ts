// lib/server/dashboardBrandGuard.ts

import { cookies } from 'next/headers';
import { resolveBrandDomain } from '@/lib/server/envContext';
import { apiGetWithEnvelope } from '@/lib/api/httpClient';
import { fetchAuthContext } from '@/lib/api/authContext';
import { getSettingsForBrandDomain } from '@/lib/api/settings';
import { resolveBrandMismatch } from '@/lib/dashboard/brandMismatch';

export type DashboardBrandGuardResult =
  | { type: 'ok' }
  | {
      type: 'mismatch';
      hostBrandName: string;
      sessionBrand: { name: string; url: string } | null;
      registerUrl: string | null;
    };

const OK: DashboardBrandGuardResult = { type: 'ok' };

/**
 * Detects, server-side and once per dashboard render, whether the signed-in
 * participant's own account brand differs from the brand this host domain
 * resolves to (see lib/dashboard/brandMismatch.ts for why that can happen).
 *
 * Both ids come from established, already-in-use resolution paths — this
 * deliberately does NOT add a second way to turn a host into a brand id:
 *  - hostBrandId: fetchAuthContext(host), the same brand-from-domain lookup
 *    the login/register routes already use (GET /v1/auth/context).
 *  - sessionBrandId: GET /v1/auth/me, scoped by the JWT alone (brand-domain
 *    header is not enforced there — see jwt.strategy.ts / auth.controller.ts)
 *    — the same field app/api/auth/me/route.ts already surfaces as
 *    `data.brandId`.
 *
 * Fails OPEN on every axis: no session cookie, a failed/erroring lookup, or
 * an unresolved host brand all resolve to `{ type: 'ok' }` (render the
 * dashboard as normal). This check exists to explain a dead end, not to
 * gate access — a false positive would lock a real participant out of their
 * own dashboard, which is strictly worse than the dead end it replaces.
 */
export async function getDashboardBrandGuard(): Promise<DashboardBrandGuardResult> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    if (!accessToken) return OK;

    const host = await resolveBrandDomain();

    const [meResult, ctxResult, settingsResult] = await Promise.allSettled([
      apiGetWithEnvelope<{ brandId?: string }>('/v1/auth/me', {
        headers: { Authorization: `Bearer ${accessToken}`, 'x-brand-domain': host },
      }),
      fetchAuthContext(host),
      getSettingsForBrandDomain(host),
    ]);

    const sessionBrandId = meResult.status === 'fulfilled' ? meResult.value.brandId ?? null : null;
    const ctx = ctxResult.status === 'fulfilled' ? ctxResult.value : null;
    const hostBrandId = ctx?.brandId ?? null;

    if (!resolveBrandMismatch({ sessionBrandId, hostBrandId })) return OK;

    const settings = settingsResult.status === 'fulfilled' ? settingsResult.value : null;
    const hostBrandName = settings?.brand?.name?.trim() || 'this programme';

    const sessionBrandEntry = settings?.available_brands?.find((b) => b.id === sessionBrandId) ?? null;
    const sessionBrandUrl = sessionBrandEntry?.website_url || sessionBrandEntry?.landing_url || '';
    const sessionBrand =
      sessionBrandEntry && sessionBrandUrl
        ? { name: sessionBrandEntry.name, url: sessionBrandUrl }
        : null;

    // Only offer registration when this host actually has a program to
    // register into right now — a brand domain with no active program has
    // nothing for the signup flow to create an account against.
    const registerUrl = ctx?.programId
      ? `/login?mode=signup&programSlug=${encodeURIComponent(ctx.programSlug ?? '')}`
      : null;

    return { type: 'mismatch', hostBrandName, sessionBrand, registerUrl };
  } catch {
    // Any unexpected failure (network, parsing, etc.) must not block a real
    // participant from their dashboard — fail open.
    return OK;
  }
}
