// lib/dashboard/mailNotice.ts
//
// One sentence, in the places where a participant is waiting on an email that
// we actually send.
//
// This is not hypothetical: loa.batch.released fans out to
// emailService.sendLoaReadyEmail per recipient, and loa_batch_recipient_sends
// holds 970 real sends. Payments send too (sendPaymentSuccessEmail,
// sendReceiptEmail). When one of those lands in spam the participant has no way
// to tell the difference between "filtered" and "never sent", so they wait, and
// then they open a ticket.
//
// Shown to EVERYONE, deliberately, not just non-Gmail. Gmail filters this mail
// too, the advice costs a line, and a domain check here would add a branch to
// save one sentence. That differs from the signup-time notice, which is
// specifically about provider deliverability and so is Gmail-gated.
//
// Naming the address does a second job: it catches "I registered with the wrong
// email", which is its own recurring support thread.

export type MailNoticeKind =
  /** The Invitation Letter exists but its batch has not been released yet. */
  | 'invitation-letter'
  /** A payment is submitted or processing and awaiting confirmation. */
  | 'payment-pending'
  /** A payment succeeded and the receipt has been emailed. */
  | 'payment-receipt';

/**
 * Falls back to a description rather than an empty gap when the profile has not
 * loaded yet. The sentence still has to read correctly with no address, because
 * this renders inside content that is not itself gated on the profile request.
 */
const FALLBACK_ADDRESS = 'your registered email address';

export function mailNotice(kind: MailNoticeKind, email?: string | null): string {
  const address = (email ?? '').trim() || FALLBACK_ADDRESS;

  switch (kind) {
    case 'invitation-letter':
      return `We'll email ${address} when it's ready. Check your spam folder if it doesn't arrive.`;
    case 'payment-pending':
      return `We'll email ${address} once this payment is confirmed. Check your spam folder if it doesn't arrive.`;
    case 'payment-receipt':
      return `We emailed your receipt to ${address}. Check your spam folder if you can't find it.`;
  }
}
