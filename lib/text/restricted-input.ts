export type RestrictMode = 'name' | 'general';

// name: letters, space, hyphen, apostrophe, period (hyphen last = literal)
const NAME_DISALLOWED = /[^A-Za-z .'-]/;
// general: printable ASCII (0x20–0x7E) plus tab, newline, carriage return
const GENERAL_DISALLOWED = /[^\x20-\x7E\n\r\t]/;

function patternFor(mode: RestrictMode): RegExp {
  // Return a fresh RegExp each call to avoid shared lastIndex state.
  return mode === 'name'
    ? new RegExp(NAME_DISALLOWED.source, 'g')
    : new RegExp(GENERAL_DISALLOWED.source, 'g');
}

export function sanitize(
  value: string,
  mode: RestrictMode,
): { value: string; removed: string[] } {
  const pattern = patternFor(mode);
  const removed = new Set<string>();
  const clean = value.replace(pattern, (match) => {
    removed.add(match);
    return '';
  });
  return { value: clean, removed: [...removed] };
}

export function hasDisallowed(value: string, mode: RestrictMode): boolean {
  return patternFor(mode).test(value);
}

// Latin characters NFD does not decompose into "base letter + combining mark",
// so stripping combining marks alone would leave them (or drop them entirely
// and mangle the word: "Adıyaman" -> "Adyaman").
//
// Kept in sync with LATIN_SPECIALS in the API's
// prisma/migration-scripts/report-non-english-names.ts, so a name folded here
// matches what that script would have written.
const ASCII_FOLD_MAP: Record<string, string> = {
  ı: 'i', İ: 'I',
  ł: 'l', Ł: 'L',
  ø: 'o', Ø: 'O',
  đ: 'd', Đ: 'D',
  ð: 'd', Ð: 'D',
  þ: 'th', Þ: 'Th',
  ß: 'ss',
  æ: 'ae', Æ: 'Ae',
  œ: 'oe', Œ: 'Oe',
  ŋ: 'ng', Ŋ: 'Ng',
  ħ: 'h', Ħ: 'H',
  ʻ: "'", ʼ: "'", '‘': "'", '’': "'",
  '–': '-', '—': '-',
};

/**
 * Transliterates Latin text to its closest ASCII form: "Adıyaman" -> "Adiyaman",
 * "Bogotá" -> "Bogota". Non-Latin scripts pass through untouched.
 */
export function asciiFold(value: string): string {
  return value
    .replace(/[^\x00-\x7F]/g, (ch) => ASCII_FOLD_MAP[ch] ?? ch)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Coerces a value that the participant cannot edit — a dropdown option or a
 * server-supplied prefill — into something the API's ASCII-only validators
 * accept. Folds accents first so the word survives, then drops anything still
 * outside printable ASCII.
 *
 * Falls back to the original when folding would leave nothing (a fully
 * non-Latin name): an empty field is a worse failure than a rejected one.
 */
export function toSubmittableAscii(value: string): string {
  const { value: clean } = sanitize(asciiFold(value), 'general');
  const collapsed = clean.replace(/\s+/g, ' ').trim();
  return collapsed.length > 0 ? collapsed : value;
}
