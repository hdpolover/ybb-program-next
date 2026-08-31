// lib/registration/edition.ts
//
// Plain module, deliberately NOT 'use client': app/page.tsx is a server
// component and HomeRegistrationStrip is a client component, and both need
// this rule. Exporting it from the client component threw at runtime
// ("Attempted to call pickDefaultEditionIndex() from the server").

/**
 * The edition a visitor should land on: the running one with the closest
 * deadline, else the newest. Editions arrive ordered soonest close first
 * (see home.strategy.ts), so the running one is the first 'open' entry.
 */
export function pickDefaultEditionIndex(
  editions: { status?: string; year?: number }[],
): number {
  const openIndex = editions.findIndex((edition) => edition.status === 'open');
  if (openIndex >= 0) return openIndex;
  if (editions.length === 0) return 0;
  let newest = 0;
  editions.forEach((edition, index) => {
    if ((edition.year ?? 0) > (editions[newest].year ?? 0)) newest = index;
  });
  return newest;
}

/**
 * The edition slug a signup should register into: the one the visitor arrived
 * with (an edition-specific CTA carries ?programSlug=), else the default
 * edition above. Returns '' when there are no editions, which leaves the
 * server to pick exactly as it did before.
 *
 * MEYS 6th/7th incident: for one afternoon signup silently assigned everyone
 * to whichever edition happened to be newest and open. The slug this returns
 * is what the signup form submits, so the assignment matches what the person
 * was shown.
 */
export function resolveSignupEditionSlug(
  editions: { program_slug?: string; status?: string; year?: number }[],
  requestedSlug: string,
): string {
  if (editions.length === 0) return '';
  if (requestedSlug && editions.some((edition) => edition.program_slug === requestedSlug)) {
    return requestedSlug;
  }
  return editions[pickDefaultEditionIndex(editions)]?.program_slug ?? '';
}
