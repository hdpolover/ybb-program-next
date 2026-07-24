// lib/dashboard/shouldRedirectToOnboarding.ts

/**
 * Decides whether a signed-in user should be bounced from the dashboard to
 * /onboarding because their participant record doesn't exist yet.
 *
 * Only a clean backend 404 from GET /api/participants/me is a definitive
 * "no participant record" signal. Any other outcome — a 2xx response with an
 * unexpectedly empty payload, a 5xx, a network failure, an unparseable body —
 * is transient and must NOT redirect, otherwise an existing participant gets
 * wrongly kicked back into onboarding during a backend blip.
 */
export function shouldRedirectToOnboarding(
  profileStatus: number,
  activeRole: string | undefined,
): boolean {
  // Ambassador-only accounts legitimately have no participant record —
  // never bounce them to onboarding.
  return profileStatus === 404 && activeRole !== 'ambassador';
}
