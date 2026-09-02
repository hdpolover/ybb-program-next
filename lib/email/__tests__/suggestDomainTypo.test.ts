// lib/email/__tests__/suggestDomainTypo.test.ts
//
// The false-positive cases matter more than the true positives here. The ticket
// that started this work claimed non-Gmail domains could not register; the
// production send log disproved it. If this matcher nags a real university or
// company domain, it manufactures exactly that belief.

import { describe, it, expect } from 'vitest';
import { suggestDomainTypo, editDistance } from '../suggestDomainTypo';

describe('editDistance', () => {
  it('counts an adjacent transposition as a single edit', () => {
    expect(editDistance('gamil.com', 'gmail.com')).toBe(1);
    expect(editDistance('gmial.com', 'gmail.com')).toBe(1);
    expect(editDistance('hotmial.com', 'hotmail.com')).toBe(1);
  });

  it('returns 0 for identical strings and the length for an empty one', () => {
    expect(editDistance('gmail.com', 'gmail.com')).toBe(0);
    expect(editDistance('', 'abc')).toBe(3);
    expect(editDistance('abc', '')).toBe(3);
  });

  it('stops early and reports over-limit once the limit is exceeded', () => {
    expect(editDistance('iiu.edu.pk', 'gmail.com', 2)).toBeGreaterThan(2);
  });
});

describe('suggestDomainTypo — catches the misspellings we actually saw', () => {
  // gamil.com is the real bounce pattern from the production Resend log.
  it.each([
    ['ada@gamil.com', 'gmail.com'],
    ['ada@gmial.com', 'gmail.com'],
    ['ada@gmai.com', 'gmail.com'],
    ['ada@gmail.con', 'gmail.com'],
    ['ada@hotmial.com', 'hotmail.com'],
    ['ada@yaho.com', 'yahoo.com'],
    ['ada@outlok.com', 'outlook.com'],
    ['ada@iclould.com', 'icloud.com'],
  ])('%s suggests %s', (input, expected) => {
    expect(suggestDomainTypo(input)).toEqual({
      domain: expected,
      email: `ada@${expected}`,
    });
  });

  it('preserves the local part, including dots and plus tags', () => {
    expect(suggestDomainTypo('ada.lovelace+ybb@gamil.com')?.email).toBe(
      'ada.lovelace+ybb@gmail.com',
    );
  });

  it('is case- and whitespace-insensitive', () => {
    expect(suggestDomainTypo('  Ada@GAMIL.com ')?.email).toBe('ada@gmail.com');
  });
});

describe('suggestDomainTypo — stays silent on addresses that are fine', () => {
  it('never suggests when the domain is already the provider', () => {
    for (const domain of [
      'gmail.com',
      'yahoo.com',
      'hotmail.com',
      'outlook.com',
      'icloud.com',
      'proton.me',
      'qq.com',
      'naver.com',
      'mail.ru',
    ]) {
      expect(suggestDomainTypo(`ada@${domain}`)).toBeNull();
    }
  });

  // Real domains from the production send log — all delivered fine.
  it.each([
    'student@iiu.edu.pk',
    'student@tsue.uz',
    'student@ui.ac.id',
    'staff@ybbfoundation.com',
    'ada@zoho.com',
    'ada@yandex.ru',
    'ada@163.com',
    // One edit from gmail.com, but a real mailbox in its own right.
    'ada@mail.com',
    'ada@email.com',
    'ada@ymail.com',
    'ada@me.com',
  ])('leaves %s alone', input => {
    expect(suggestDomainTypo(input)).toBeNull();
  });

  it('does not fuzz short providers into unrelated company domains', () => {
    expect(suggestDomainTypo('ada@abc.com')).toBeNull();
    expect(suggestDomainTypo('ada@aws.com')).toBeNull();
  });
});

describe('suggestDomainTypo — invalid input never crashes', () => {
  it.each([
    '',
    '   ',
    'ada',
    'ada@',
    '@gmail.com',
    'ada@@gmail.com',
    'ada@localhost',
    'ada@.com',
    'ada@gmail.com.',
    'ada@ gmail.com',
  ])('returns null for %j', input => {
    expect(() => suggestDomainTypo(input)).not.toThrow();
    expect(suggestDomainTypo(input)).toBeNull();
  });

  it('tolerates null and undefined without throwing', () => {
    expect(suggestDomainTypo(undefined as unknown as string)).toBeNull();
    expect(suggestDomainTypo(null as unknown as string)).toBeNull();
  });
});
