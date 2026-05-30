export type RestrictMode = 'name' | 'general';

// name: letters, space, hyphen, apostrophe, period (hyphen escaped)
const NAME_DISALLOWED = /[^A-Za-z .'\-]/g;
// general: printable ASCII (0x20–0x7E) plus tab, newline, carriage return
const GENERAL_DISALLOWED = /[^\x20-\x7E\n\r\t]/g;

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
