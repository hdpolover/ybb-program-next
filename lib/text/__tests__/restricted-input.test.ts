import { describe, it, expect } from 'vitest';
import { sanitize, hasDisallowed, asciiFold, toSubmittableAscii } from '@/lib/text/restricted-input';

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

describe('asciiFold', () => {
  it('folds letters NFD cannot decompose', () => {
    expect(asciiFold('Ad\u0131yaman')).toBe('Adiyaman');
    expect(asciiFold('\u0130stanbul')).toBe('Istanbul');
    expect(asciiFold('\u0141\u00f3d\u017a')).toBe('Lodz');
  });
  it('folds combining diacritics', () => {
    expect(asciiFold('Bogot\u00e1')).toBe('Bogota');
    expect(asciiFold('Malm\u00f6')).toBe('Malmo');
    expect(asciiFold('\u015eanl\u0131urfa')).toBe('Sanliurfa');
  });
  it('leaves ASCII untouched', () => {
    expect(asciiFold("O'Brien-Smith Jr.")).toBe("O'Brien-Smith Jr.");
  });
  it('passes non-Latin scripts through', () => {
    expect(asciiFold('\u041c\u043e\u0441\u043a\u0432\u0430')).toBe('\u041c\u043e\u0441\u043a\u0432\u0430');
  });
});

describe('toSubmittableAscii', () => {
  it('produces a value the API ASCII validator accepts', () => {
    expect(hasDisallowed(toSubmittableAscii('Ad\u0131yaman'), 'general')).toBe(false);
    expect(toSubmittableAscii('Bogot\u00e1')).toBe('Bogota');
  });
  it('collapses whitespace left behind by stripping', () => {
    expect(toSubmittableAscii('Ho Chi \u4e2d Minh')).toBe('Ho Chi Minh');
  });
  it('falls back to the original rather than emptying the field', () => {
    expect(toSubmittableAscii('\u041c\u043e\u0441\u043a\u0432\u0430')).toBe('\u041c\u043e\u0441\u043a\u0432\u0430');
  });
});
