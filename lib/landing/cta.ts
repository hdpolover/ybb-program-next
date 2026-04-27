const SIGNUP_PATH = '/login?mode=signup';

function normalizeRegistrationPath(pathname: string, search: string, hash: string): string | null {
  const cleanedPath = pathname.replace(/\/+$/, '') || '/';
  const lowerPath = cleanedPath.toLowerCase();
  const lowerHash = hash.toLowerCase();

  if (lowerPath === '/apply') {
    if (lowerHash === '#self-funded') return '/apply/self-funded';
    if (lowerHash === '#fully-funded') return '/apply/fully-funded';
    return `${cleanedPath}${search}${hash}`;
  }

  if (lowerPath === '/apply/self-funded' || lowerPath === '/apply/fully-funded') {
    return `${cleanedPath}${search}${hash}`;
  }

  if (lowerPath === '/register' || lowerPath === '/registration') {
    return SIGNUP_PATH;
  }

  return null;
}

export function getSignupHref(): string {
  return SIGNUP_PATH;
}

export function normalizeLandingCtaHref(href?: string | null): string {
  const raw = href?.trim();

  if (!raw) {
    return '/apply';
  }

  if (/^https?:\/\//i.test(raw)) {
    try {
      const parsed = new URL(raw);
      return normalizeRegistrationPath(parsed.pathname, parsed.search, parsed.hash) ?? raw;
    } catch {
      return raw;
    }
  }

  try {
    const parsed = new URL(raw, 'https://ybb.local');
    return normalizeRegistrationPath(parsed.pathname, parsed.search, parsed.hash) ?? raw;
  } catch {
    return raw;
  }
}
