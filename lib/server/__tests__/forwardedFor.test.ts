import { describe, it, expect } from 'vitest';
import { forwardedForHeader } from '../forwardedFor';

const req = (headers: Record<string, string>) => new Request('https://x.test', { headers });

describe('forwardedForHeader', () => {
  it('passes the chain through untouched, so the trusted entry stays last', () => {
    expect(forwardedForHeader(req({ 'x-forwarded-for': '1.2.3.4, 203.0.113.9' }))).toEqual({
      'x-forwarded-for': '1.2.3.4, 203.0.113.9',
    });
  });

  it('forwards cf-connecting-ip too, or the API cannot see past the Cloudflare edge', () => {
    // The last forwarded hop behind the CDN is a CF edge, and CF rotates
    // edges. Without this header the API keyed one client across several
    // rotating buckets — the exact bug its Cloudflare handling exists to fix.
    expect(
      forwardedForHeader(
        req({ 'x-forwarded-for': '198.51.100.7, 172.68.1.1', 'cf-connecting-ip': '198.51.100.7' }),
      ),
    ).toEqual({
      'x-forwarded-for': '198.51.100.7, 172.68.1.1',
      'cf-connecting-ip': '198.51.100.7',
    });
  });

  it('omits each header independently when it is absent or blank', () => {
    expect(forwardedForHeader(req({}))).toEqual({});
    expect(forwardedForHeader(req({ 'x-forwarded-for': '   ' }))).toEqual({});
    expect(forwardedForHeader(req({ 'cf-connecting-ip': '198.51.100.7' }))).toEqual({
      'cf-connecting-ip': '198.51.100.7',
    });
  });
});
