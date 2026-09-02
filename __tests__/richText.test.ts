import { describe, it, expect } from 'vitest';
import { sanitizeRichTextHtml, toRichTextHtml } from '@/lib/content/richText';

describe('sanitizeRichTextHtml', () => {
  it('strips script tags entirely, including their content', () => {
    const out = sanitizeRichTextHtml('<p>hi</p><script>alert(1)</script>');
    expect(out).not.toContain('<script');
    expect(out).not.toContain('alert(1)');
  });

  it('strips on* event handler attributes, quoted or not', () => {
    const out = sanitizeRichTextHtml('<img src="https://x.test/a.png" onerror=alert(1)>');
    expect(out).not.toMatch(/onerror/i);
  });

  it('strips javascript: hrefs', () => {
    const out = sanitizeRichTextHtml('<a href="javascript:alert(1)">click</a>');
    expect(out).not.toMatch(/javascript:/i);
  });

  it('strips javascript: hrefs disguised with whitespace/case', () => {
    const out = sanitizeRichTextHtml('<a href="  JaVaScRiPt&#58;alert(1)">click</a>');
    expect(out).not.toMatch(/javascript:/i);
  });

  it('drops iframes and forms', () => {
    const out = sanitizeRichTextHtml('<iframe src="https://evil.test"></iframe><form action="x"></form>');
    expect(out).not.toContain('<iframe');
    expect(out).not.toContain('<form');
  });

  it('drops style attributes', () => {
    const out = sanitizeRichTextHtml('<p style="background:url(javascript:alert(1))">hi</p>');
    expect(out).not.toContain('style=');
  });

  it('keeps basic formatting and forces safe rel on links', () => {
    const out = sanitizeRichTextHtml(
      '<p>Hello <strong>world</strong></p><a href="https://example.com" target="_blank">link</a>',
    );
    expect(out).toContain('<strong>world</strong>');
    expect(out).toContain('href="https://example.com"');
    expect(out).toContain('rel="noopener noreferrer"');
    expect(out).toContain('target="_blank"');
  });

  it('allows http(s) images but drops non-http(s) image schemes', () => {
    const safe = sanitizeRichTextHtml('<img src="https://example.com/a.png" alt="x">');
    expect(safe).toContain('<img');
    expect(safe).toContain('https://example.com/a.png');

    const unsafe = sanitizeRichTextHtml('<img src="javascript:alert(1)" alt="x">');
    expect(unsafe).not.toMatch(/javascript:/i);
  });

  it('returns empty string for empty/whitespace input', () => {
    expect(sanitizeRichTextHtml('')).toBe('');
    expect(sanitizeRichTextHtml('   ')).toBe('');
    expect(sanitizeRichTextHtml(null)).toBe('');
  });
});

describe('toRichTextHtml', () => {
  it('converts plain text markdown-ish input to formatted, sanitized HTML', () => {
    const out = toRichTextHtml('**bold** and a [link](https://example.com)');
    expect(out).toContain('<strong>bold</strong>');
    expect(out).toContain('href="https://example.com"');
  });

  it('sanitizes input that is already HTML, including script injection attempts', () => {
    const out = toRichTextHtml('<p>hi</p><script>alert(document.cookie)</script>');
    expect(out).not.toContain('<script');
    expect(out).toContain('<p>hi</p>');
  });
});
