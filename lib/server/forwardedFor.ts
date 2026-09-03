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
 * Two headers, because the API needs both to identify the caller behind
 * Cloudflare. `x-forwarded-for` is forwarded verbatim, never rebuilt: our edge
 * appends the address it actually observed, so the rightmost entry is the
 * trustworthy one and the API reads that end. Appending anything here — or
 * reordering — would put an untrusted value last and hand callers the ability
 * to choose their own throttle bucket.
 *
 * `cf-connecting-ip` carries the real client, but on its own it is no more
 * trustworthy than any other header (the origin is reachable directly). The
 * API only believes it when the last forwarded hop is inside a published
 * Cloudflare range — which it cannot check if we never send the header. Behind
 * the CDN the last hop is a Cloudflare EDGE address, and Cloudflare rotates
 * edges between connections, so without this the API was keying one client
 * across several rotating buckets and lumping strangers into the same one.
 *
 * Returns nothing for a header that is absent (a local request with no proxy
 * in front), so the API falls back to the peer address rather than being
 * handed an empty header to parse.
 */
export function forwardedForHeader(request: Request): Record<string, string> {
  const headers: Record<string, string> = {};

  const forwarded = request.headers.get('x-forwarded-for')?.trim();
  if (forwarded) headers['x-forwarded-for'] = forwarded;

  const cfConnectingIp = request.headers.get('cf-connecting-ip')?.trim();
  if (cfConnectingIp) headers['cf-connecting-ip'] = cfConnectingIp;

  return headers;
}
