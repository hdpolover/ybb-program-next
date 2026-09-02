// lib/email/suggestDomainTypo.ts
//
// Registration triage (2026-09): a ticket claimed non-Gmail domains "cannot
// register". 600 real Resend sends said otherwise — 589 delivered, and the only
// repeated bounce was `gamil.com`, a misspelling of `gmail.com`. Because login
// is hard-blocked until the address is verified, one mistyped character reads
// to the participant as "registration is broken", with no feedback anywhere.
//
// This module answers one question: does the typed domain look like a near-miss
// of a common provider? It is advisory only. Callers MUST render the result as
// a dismissible suggestion and never as a validation error — a real university
// or company domain that happens to resemble a provider must still submit.

/**
 * Providers we are willing to suggest *towards*. Ordered by how often YBB
 * participants use them, so ties resolve to the likelier intent.
 */
const SUGGESTION_TARGETS: readonly string[] = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'icloud.com',
  'proton.me',
  'live.com',
  'aol.com',
  'mail.ru',
  'yandex.com',
  'qq.com',
  'naver.com',
];

/**
 * Domains that must never be flagged, even though several sit within edit
 * distance 1-2 of a target (`mail.com`, `email.com` and `ymail.com` are all one
 * edit from `gmail.com`, and all three are real mailboxes). This list is the
 * safety valve for the false-positive direction, which is the expensive one.
 */
const KNOWN_DOMAINS: ReadonlySet<string> = new Set([
  ...SUGGESTION_TARGETS,
  'mail.com',
  'email.com',
  'ymail.com',
  'rocketmail.com',
  'googlemail.com',
  'gmx.com',
  'gmx.de',
  'gmx.net',
  'me.com',
  'mac.com',
  'msn.com',
  'live.co.uk',
  'live.com.au',
  'hotmail.co.uk',
  'hotmail.fr',
  'hotmail.it',
  'outlook.co.id',
  'outlook.co.uk',
  'outlook.fr',
  'yahoo.co.id',
  'yahoo.co.uk',
  'yahoo.co.jp',
  'yahoo.com.br',
  'protonmail.com',
  'pm.me',
  'zoho.com',
  'zohomail.com',
  'yandex.ru',
  'yandex.kz',
  'mail.ua',
  'inbox.ru',
  'list.ru',
  'bk.ru',
  '163.com',
  '126.com',
  'foxmail.com',
  'sina.com',
  'daum.net',
  'hanmail.net',
  'aim.com',
  'gmx.co.uk',
]);

/**
 * Distance 1 is enough for every misspelling we actually observed, because the
 * optimal-string-alignment metric below counts a transposition as one edit:
 * `gamil`, `gmial` and `hotmial` are all distance 1 from their target, not 2.
 * Distance 2 is allowed only for domains at least this long, which keeps short
 * targets (`qq.com`, `aol.com`, `live.com`) from swallowing unrelated 6-7
 * character company domains.
 */
const MAX_DISTANCE = 2;
const MIN_LENGTH_FOR_DISTANCE_2 = 9;

export type DomainTypoSuggestion = {
  /** The provider domain we believe was intended, e.g. `gmail.com`. */
  domain: string;
  /** The full address rewritten onto that domain, e.g. `ada@gmail.com`. */
  email: string;
};

/**
 * Damerau-Levenshtein distance, optimal-string-alignment variant: insertion,
 * deletion, substitution and adjacent transposition each cost 1. Bails out as
 * soon as the whole row exceeds `limit`, so a long institutional domain costs
 * almost nothing to reject.
 */
export function editDistance(a: string, b: string, limit = Number.POSITIVE_INFINITY): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > limit) return limit + 1;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  // Three rolling rows: two back (for transposition), one back, and current.
  let twoBack: number[] = [];
  let oneBack: number[] = Array.from({ length: b.length + 1 }, (_, j) => j);

  for (let i = 1; i <= a.length; i += 1) {
    const current: number[] = new Array<number>(b.length + 1);
    current[0] = i;
    let rowMin = current[0];

    for (let j = 1; j <= b.length; j += 1) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
      let value = Math.min(
        oneBack[j] + 1, // deletion
        current[j - 1] + 1, // insertion
        oneBack[j - 1] + substitutionCost, // substitution
      );

      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        value = Math.min(value, twoBack[j - 2] + 1); // transposition
      }

      current[j] = value;
      if (value < rowMin) rowMin = value;
    }

    if (rowMin > limit) return limit + 1;

    twoBack = oneBack;
    oneBack = current;
  }

  return oneBack[b.length];
}

function splitEmail(raw: string): { local: string; domain: string } | null {
  const value = (raw ?? '').trim().toLowerCase();
  const at = value.lastIndexOf('@');
  if (at <= 0 || at === value.length - 1) return null;

  const local = value.slice(0, at);
  const domain = value.slice(at + 1);
  // A domain without a dot, with whitespace, or with a stray `@` is not a
  // near-miss of anything — it is simply incomplete. Stay silent.
  if (!domain.includes('.') || /[\s@]/.test(domain)) return null;
  if (domain.startsWith('.') || domain.endsWith('.')) return null;

  return { local, domain };
}

/**
 * Returns a provider the typed address may have meant, or `null` when the
 * domain is already a known mailbox, is nowhere near one, or the input is not a
 * usable address. Never throws.
 */
export function suggestDomainTypo(rawEmail: string): DomainTypoSuggestion | null {
  const parts = splitEmail(rawEmail);
  if (!parts) return null;

  const { local, domain } = parts;
  if (KNOWN_DOMAINS.has(domain)) return null;

  const best = SUGGESTION_TARGETS.reduce<{ domain: string; distance: number } | null>(
    (winner, target) => {
      // Gate on the *target* length, not the typed one: a long typo must not
      // unlock a 2-edit match against a short target like `qq.com`.
      const allowed = target.length >= MIN_LENGTH_FOR_DISTANCE_2 ? MAX_DISTANCE : 1;
      const distance = editDistance(domain, target, allowed);
      if (distance > allowed || distance === 0) return winner;
      if (winner && winner.distance <= distance) return winner;
      return { domain: target, distance };
    },
    null,
  );

  if (!best) return null;

  return { domain: best.domain, email: `${local}@${best.domain}` };
}
