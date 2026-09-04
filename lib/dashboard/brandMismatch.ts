// lib/dashboard/brandMismatch.ts

/**
 * Decides whether a signed-in participant's account brand differs from the
 * brand the current host domain resolves to.
 *
 * Accounts are per brand (users.brand_id): the same email can have separate
 * accounts on different brand domains, or none at all on the one being
 * browsed. When that happens the dashboard has nothing to show for this
 * brand and used to fail deep inside a page (e.g. "No active application
 * found") instead of explaining the situation up front.
 *
 * Either id being missing is treated as "no mismatch" — NOT as a mismatch.
 * A host brand that fails to resolve (unknown domain, localhost/preview host,
 * a transient lookup failure) must never be treated as evidence of a
 * mismatch: a false positive here would block a legitimate participant from
 * their own dashboard, which is worse than the dead end this replaces.
 */
export function resolveBrandMismatch(params: {
  sessionBrandId: string | null | undefined;
  hostBrandId: string | null | undefined;
}): boolean {
  const { sessionBrandId, hostBrandId } = params;
  if (!sessionBrandId || !hostBrandId) return false;
  return sessionBrandId !== hostBrandId;
}
