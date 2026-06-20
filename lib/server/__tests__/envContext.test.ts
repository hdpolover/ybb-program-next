import { describe, it, expect, vi } from 'vitest';

// envContext imports `next/headers` at module scope; mock it so the pure
// `normalizeBrandUrl` helper can be unit-tested outside a request context.
vi.mock('next/headers', () => ({ headers: vi.fn() }));

import { normalizeBrandUrl } from '@/lib/server/envContext';

describe('normalizeBrandUrl', () => {
  it('strips a trailing slash', () => {
    expect(normalizeBrandUrl('istanbulyouthsummit.com/')).toBe('istanbulyouthsummit.com');
  });

  it('strips the protocol', () => {
    expect(normalizeBrandUrl('https://istanbulyouthsummit.com')).toBe('istanbulyouthsummit.com');
  });

  it('strips the port', () => {
    expect(normalizeBrandUrl('localhost:3000')).toBe('localhost');
  });

  it('strips a trailing dot from a fully-qualified host (RFC 2181 FQDN)', () => {
    expect(normalizeBrandUrl('istanbulyouthsummit.com.')).toBe('istanbulyouthsummit.com');
  });

  it('strips a trailing dot + slash combination', () => {
    expect(normalizeBrandUrl('istanbulyouthsummit.com./')).toBe('istanbulyouthsummit.com');
  });

  it('leaves a clean domain unchanged', () => {
    expect(normalizeBrandUrl('istanbulyouthsummit.com')).toBe('istanbulyouthsummit.com');
  });
});
