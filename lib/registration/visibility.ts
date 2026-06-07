export function shouldHideRegistrationPrompts(
  pathname: string | null | undefined,
  activeProgramSlug?: string | null,
): boolean {
  if (!pathname) return false;

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/onboarding')) {
    return true;
  }

  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] !== 'programs') return false;

  if (segments[1] === 'previous') {
    return true;
  }

  const normalizedActiveSlug = activeProgramSlug?.trim();
  if (segments.length === 2 && normalizedActiveSlug && segments[1] !== normalizedActiveSlug) {
    return true;
  }

  return false;
}
