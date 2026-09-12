// lib/email/__tests__/suggestDomainTypo.test.ts
//
// The false-positive cases matter more than the true positives here. The ticket
// that started this work claimed non-Gmail domains could not register; the
// production send log disproved it. If this matcher nags a real university or
// company domain, it manufactures exactly that belief.

import { describe, it, expect } from 'vitest';
import { suggestDomainTypo, editDistance, nonGmailDomain } from '../suggestDomainTypo';

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

// Separate concern from the matcher above: these are correctly spelled, working
// addresses. The note built on this is about where our verification mail gets
// filtered, not about the address being wrong, so the caller must keep it
// advisory. Measured verification rates back that up (outlook 85%, hotmail 89%,
// yahoo 86%, against gmail's own 91%).
describe('nonGmailDomain', () => {
  it.each([
    ['aldi@outlook.com', 'outlook.com'],
    ['ada@icloud.com', 'icloud.com'],
    ['ada@zoho.com', 'zoho.com'],
    ['ada@mail.ru', 'mail.ru'],
    ['ada@yandex.com', 'yandex.com'],
    ['ada@naver.com', 'naver.com'],
    ['ada@qq.com', 'qq.com'],
    ['ada@hotmail.co.uk', 'hotmail.co.uk'],
    ['student@iiu.edu.pk', 'iiu.edu.pk'],
    ['staff@ybbfoundation.com', 'ybbfoundation.com'],
  ])('%s is flagged as %s', (input, expected) => {
    expect(nonGmailDomain(input)).toBe(expected);
  });

  it('says nothing about Gmail, including its googlemail alias', () => {
    expect(nonGmailDomain('ada@gmail.com')).toBeNull();
    expect(nonGmailDomain('ada@googlemail.com')).toBeNull();
  });

  it('is case- and whitespace-insensitive, like the matcher', () => {
    expect(nonGmailDomain('  Aldi@OUTLOOK.com ')).toBe('outlook.com');
    expect(nonGmailDomain('  Ada@GMAIL.com ')).toBeNull();
  });

  // A half-typed address must stay silent, or the note fires mid-entry on
  // something that is not yet a domain.
  it.each([
    '',
    '   ',
    'ada',
    'ada@',
    '@outlook.com',
    'ada@@outlook.com',
    'ada@localhost',
    'ada@.com',
    'ada@outlook.com.',
    'ada@ outlook.com',
  ])('returns null for %j', input => {
    expect(() => nonGmailDomain(input)).not.toThrow();
    expect(nonGmailDomain(input)).toBeNull();
  });

  it('tolerates null and undefined without throwing', () => {
    expect(nonGmailDomain(undefined as unknown as string)).toBeNull();
    expect(nonGmailDomain(null as unknown as string)).toBeNull();
  });
});
