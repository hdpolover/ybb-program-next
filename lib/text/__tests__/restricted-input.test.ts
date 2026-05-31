import { describe, it, expect } from 'vitest';
import { sanitize, hasDisallowed } from '@/lib/text/restricted-input';

describe('sanitize name mode', () => {
  it('keeps English letters, space, hyphen, apostrophe, period', () => {
    expect(sanitize("Anne-Marie O'Brien Jr.", 'name').value).toBe("Anne-Marie O'Brien Jr.");
  });
  it('strips Vietnamese diacritics', () => {
    expect(sanitize('Nguyễn', 'name').value).toBe('Nguyn');
  });
  it('strips Turkish letters', () => {
    expect(sanitize('Çağİ ı', 'name').value).toBe('a ');
  });
  it('strips digits and other punctuation in name mode', () => {
    expect(sanitize('John99,', 'name').value).toBe('John');
  });
  it('strips Cyrillic, CJK, and emoji', () => {
    expect(sanitize('Иван 山田 😀', 'name').value).toBe('  ');
  });
  it('reports unique removed characters', () => {
    expect(sanitize('Nguyễn', 'name').removed).toEqual(['ễ']);
  });
});

describe('sanitize general mode', () => {
  it('keeps digits and ASCII punctuation', () => {
    expect(sanitize('12 Main St., Apt #3 (rear)!', 'general').value).toBe('12 Main St., Apt #3 (rear)!');
  });
  it('keeps tabs and newlines', () => {
    expect(sanitize('line1\nline2\tend', 'general').value).toBe('line1\nline2\tend');
  });
  it('strips diacritics and non-Latin', () => {
    expect(sanitize('café Иван 😀', 'general').value).toBe('caf  ');
  });
});

describe('hasDisallowed', () => {
  it('true when disallowed present', () => {
    expect(hasDisallowed('Nguyễn', 'name')).toBe(true);
  });
  it('false when clean', () => {
    expect(hasDisallowed("O'Brien", 'name')).toBe(false);
    expect(hasDisallowed('Apt #3', 'general')).toBe(false);
  });
});
