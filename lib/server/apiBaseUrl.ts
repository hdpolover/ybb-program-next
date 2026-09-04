/**
 * The server-side base URL for calls into the API.
 *
 * THIS MUST STAY A CONTAINER-TO-CONTAINER URL. Production sets
 * `http://<api-container>:4000/v1`, which reaches the API directly on the
 * Docker network and never traverses Traefik.
 *
 * That is not an optimisation, it is load-bearing for rate limiting. These
 * server-side calls forward the end user's `x-forwarded-for` verbatim, and the
 * API trusts the RIGHTMOST entry — the one its own edge appended. On the
 * direct hop that rightmost entry is still the Cloudflare edge, so the API
 * recovers the real participant address.
 *
 * Point this at a public HTTPS endpoint instead and Traefik appends the Next
 * container's own address to the chain. The rightmost entry becomes that one
 * container, the Cloudflare check fails, and EVERY PARTICIPANT ON THE PLATFORM
 * collapses into a single per-IP throttle bucket — the whole site rate-limited
 * as though it were one visitor. It fails as a site-wide outage under load,
 * not as an error anyone would trace back to this variable.
 *
 * The example file's placeholder is an `https://` URL, which reads like an
 * invitation to do exactly that. It is annotated there too.
 */
function requireServerApiBaseUrl(): string {
  const configuredBaseUrl = process.env.API_INTERNAL_URL?.trim();

  if (!configuredBaseUrl) {
    throw new Error('API_INTERNAL_URL must be configured.');
  }

  return configuredBaseUrl;
}

export function getServerApiBaseUrl(): string {
  return requireServerApiBaseUrl().replace(/\/v1\/?$/, '');
}

export function getServerApiV1BaseUrl(): string {
  return `${getServerApiBaseUrl()}/v1`;
}
