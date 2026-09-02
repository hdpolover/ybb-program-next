import { describe, it, expect } from 'vitest';
import { forwardedForHeader } from '../forwardedFor';

const req = (headers: Record<string, string>) => new Request('https://x.test', { headers });

describe('forwardedForHeader', () => {
  it('passes the chain through untouched, so the trusted entry stays last', () => {
    expect(forwardedForHeader(req({ 'x-forwarded-for': '1.2.3.4, 203.0.113.9' }))).toEqual({
      'x-forwarded-for': '1.2.3.4, 203.0.113.9',
    });
  });

  it('omits the header when there is none, rather than sending an empty one', () => {
    expect(forwardedForHeader(req({}))).toEqual({});
    expect(forwardedForHeader(req({ 'x-forwarded-for': '   ' }))).toEqual({});
  });
});
