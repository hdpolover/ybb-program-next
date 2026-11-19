// lib/awards/awardVisual.test.ts
import { describe, expect, it } from 'vitest';
import { awardAccentColor, awardIconUrl, prefersLightText } from './awardVisual';

describe('awardAccentColor', () => {
  it('accepts a #rrggbb hex', () => {
    expect(awardAccentColor('#1c57B3')).toBe('#1c57B3');
  });

  it('rejects anything else so no arbitrary string reaches a style attribute', () => {
    for (const bad of [null, undefined, '', '1c57b3', '#fff', '#1c57b3ff', 'red', '#1c57b3;background:url(x)']) {
      expect(awardAccentColor(bad)).toBeNull();
    }
  });
});

describe('prefersLightText', () => {
  it('picks white on dark colors and dark on light ones', () => {
    expect(prefersLightText('#1c57b3')).toBe(true);
    expect(prefersLightText('#000000')).toBe(true);
    expect(prefersLightText('#f59e0b')).toBe(false);
    expect(prefersLightText('#ffffff')).toBe(false);
  });
});

describe('awardIconUrl', () => {
  it('accepts absolute http(s) URLs', () => {
    expect(awardIconUrl('https://s3.ybbhub.com/a/icon.png')).toBe('https://s3.ybbhub.com/a/icon.png');
    expect(awardIconUrl('http://example.com/i.svg')).toBe('http://example.com/i.svg');
  });

  it('rejects other schemes, relative paths and junk', () => {
    for (const bad of [null, undefined, '', '   ', 'javascript:alert(1)', 'data:image/png;base64,AA', '/icon.png', 'not a url']) {
      expect(awardIconUrl(bad)).toBeNull();
    }
  });
});
