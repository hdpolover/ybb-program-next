// lib/dashboard/__tests__/mailNotice.test.ts
//
// The logic worth pinning is not the wording, it is the two things that can
// actually be wrong: which message a surface gets, and what happens when the
// profile has not loaded so there is no address to name.

import { describe, it, expect } from 'vitest';
import { mailNotice } from '../mailNotice';

describe('mailNotice', () => {
  it('names the address the mail is going to', () => {
    expect(mailNotice('invitation-letter', 'aldi@outlook.com')).toContain('aldi@outlook.com');
    expect(mailNotice('payment-pending', 'aldi@outlook.com')).toContain('aldi@outlook.com');
    expect(mailNotice('payment-receipt', 'aldi@outlook.com')).toContain('aldi@outlook.com');
  });

  // Shown to everyone on purpose. A Gmail-only carve-out here would be a branch
  // that saves one sentence, and Gmail filters this mail too.
  it('says the same thing for a gmail address', () => {
    expect(mailNotice('invitation-letter', 'ada@gmail.com')).toContain('ada@gmail.com');
  });

  it('mentions the spam folder in every variant', () => {
    for (const kind of ['invitation-letter', 'payment-pending', 'payment-receipt'] as const) {
      expect(mailNotice(kind, 'ada@gmail.com')).toMatch(/spam folder/i);
    }
  });

  // The surfaces differ in tense: two are waiting on mail, one has already sent
  // it. Getting these backwards would tell someone to go looking for an email
  // that has not been sent.
  it('uses future tense while waiting and past tense once sent', () => {
    expect(mailNotice('invitation-letter', 'a@b.com')).toMatch(/We'll email/);
    expect(mailNotice('payment-pending', 'a@b.com')).toMatch(/We'll email/);
    expect(mailNotice('payment-receipt', 'a@b.com')).toMatch(/We emailed/);
  });

  // This renders inside content that is not gated on the profile request, so a
  // missing address must still read as a sentence rather than leave a gap.
  it.each([undefined, null, '', '   '])('reads correctly with no address (%j)', value => {
    const text = mailNotice('invitation-letter', value as string | null | undefined);
    expect(text).toContain('your registered email address');
    expect(text).not.toMatch(/\s{2,}/);
  });

  it('trims a padded address rather than printing the padding', () => {
    expect(mailNotice('payment-receipt', '  ada@gmail.com  ')).toContain('to ada@gmail.com.');
  });
});
