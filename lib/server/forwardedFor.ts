// lib/server/forwardedFor.ts

/**
 * Pass the caller's address through to the API on server-side proxied calls.
 *
 * These route handlers run in the Next container, so without this the API sees
 * that container as the client for every request it proxies and rate limits
 * the whole site as one caller — registration was effectively capped at a
 * handful of signups per hour for everyone. See the API's
 * UserAwareThrottlerGuard.
 *
 * The list is forwarded verbatim, never rebuilt: our edge appends the address
 * it actually observed, so the rightmost entry is the trustworthy one and the
 * guard reads that end. Appending anything here — or reordering — would put an
 * untrusted value last and hand callers the ability to choose their own
 * throttle bucket.
 *
 * Returns nothing when the header is absent (a local request with no proxy in
 * front), so the API falls back to the peer address rather than being handed
 * an empty header to parse.
 */
export function forwardedForHeader(request: Request): Record<string, string> {
  const forwarded = request.headers.get('x-forwarded-for')?.trim();
  return forwarded ? { 'x-forwarded-for': forwarded } : {};
}
