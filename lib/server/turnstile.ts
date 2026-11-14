// lib/server/turnstile.ts

import { TURNSTILE_HEADER } from '@/lib/auth/turnstileSiteKey';

// Cloudflare documents a 2048 char ceiling on tokens; anything longer is junk.
const MAX_TOKEN_LENGTH = 2048;

/**
 * Carry the browser's Turnstile token through to the API. The token is opaque
 * here: the API verifies it with Cloudflare (and decides whether it is
 * required), so a missing token is forwarded as "no header", never invented.
 */
export function turnstileTokenHeader(request: Request): Record<string, string> {
  const token = request.headers.get(TURNSTILE_HEADER)?.trim();
  if (!token || token.length > MAX_TOKEN_LENGTH) return {};
  return { [TURNSTILE_HEADER]: token };
}
