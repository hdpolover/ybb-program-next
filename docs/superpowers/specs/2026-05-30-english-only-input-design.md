# English-Only Input Restriction — Design

**Date:** 2026-05-30
**Repo:** `ybb-program-next` (participant website)
**Status:** Approved (design), pending implementation plan

## Problem

Participants from countries such as Vietnam and Turkey enter their names using
their native alphabets (diacritics and extended Latin / non-Latin characters,
e.g. `Nguyễn`, `Çağ`, `İ`, `đ`, `ı`). When the platform later exports a Letter
of Acceptance (LoA), those characters render as boxes or question marks because
the export system/font cannot encode them. The result is a broken official
document.

## Goal

On the participant website, prevent entry of characters that cannot render in
the LoA. Block the disallowed characters **as the user types or pastes**, and
show **visual feedback** explaining why, so the data captured is always
LoA-safe.

## Requirements (confirmed)

- **Behavior:** Block disallowed characters immediately (as typed/pasted) AND
  show inline visual feedback explaining the reason.
- **Two tiers of the same rule:**
  - **Name fields (strict):** allow only `A–Z`, `a–z`, space, hyphen `-`,
    apostrophe `'`, and period `.`. (Covers names like `O'Brien`,
    `Anne-Marie`, `Jr.`.) No digits, no other punctuation, no diacritics.
  - **All other free-text (general):** allow printable ASCII (English letters,
    digits, and standard ASCII punctuation) plus tab/newline; block all
    non-Latin / diacritic / emoji characters. This keeps addresses, essays,
    etc. usable while still guaranteeing LoA-safe encoding.
- **Scope:** Participant data-entry text inputs and textareas across
  onboarding, apply (including dynamically-rendered program form fields), and
  the dashboard submission/profile edit forms.
- **Excluded fields:** password, email, OTP, search, numeric, and select
  inputs.

## Out of scope (flagged, not implemented here)

- **Backend / API validation.** The LoA is generated server-side from stored
  data; frontend-only blocking does not catch pre-existing records with
  diacritics or data entered through other channels. A backend guard is
  recommended as a follow-up.
- **Admin dashboard** (`ybb-platform` admin). Staff editing names there could
  reintroduce disallowed characters. Recommended follow-up.

## Approach

Pure utility + two drop-in wrapper components (chosen over a hook-only or
form-state-only approach because it centralizes the logic and supports
per-keystroke blocking with consistent per-field feedback at ~80 input sites).

### 1. Core utility — `lib/text/restricted-input.ts`

```ts
export type RestrictMode = 'name' | 'general';

// name: letters, space, hyphen, apostrophe, period
const NAME_DISALLOWED = /[^A-Za-z .'-]/g;
// general: printable ASCII (0x20–0x7E) plus tab/newline/carriage-return
const GENERAL_DISALLOWED = /[^\x20-\x7E\n\r\t]/g;

export function sanitize(
  value: string,
  mode: RestrictMode,
): { value: string; removed: string[] };

export function hasDisallowed(value: string, mode: RestrictMode): boolean;
```

`sanitize` strips disallowed characters and reports which unique characters
were removed (for feedback). Pure and unit-testable.

### 2. Components — `<EnglishTextInput>` / `<EnglishTextArea>`

- Controlled wrappers over the native `input` / `textarea`; forward all native
  props and `ref`.
- New prop: `restrictMode?: RestrictMode` (default `'general'`).
- On change/paste, run `sanitize`, then call the consumer's `onChange` with the
  cleaned value — so form state never receives a disallowed character and the
  character never appears in the field.
- When `removed.length > 0`, surface feedback:
  - A transient inline message via `aria-live="polite"`.
    - name mode: "Please use the English alphabet only — your name appears on
      your Letter of Acceptance."
    - general mode: "Only standard English characters are allowed."
  - A persistent, subtle helper hint on the field.
- `aria-describedby` wires the field to its feedback/hint for screen readers.

### 3. Field classification

- `restrictMode="name"`: full name, nickname, passport/legal name,
  guardian/parent name, emergency-contact name, and similar identity fields.
- `restrictMode="general"` (default): everything else in scope, including
  dynamically-rendered program text fields.

## Data flow

`user input → EnglishText* onChange → sanitize(mode) → cleaned value →
consumer onChange → form state`. Form state and submitted payloads are always
LoA-safe. Feedback is derived from `removed` on each change and does not affect
stored state.

## Error handling / edge cases

- **Paste** is covered because React fires `onChange` after paste; the same
  sanitize path applies.
- **IME composition** (e.g. CJK): composed non-ASCII output is stripped by the
  general/name rule. Acceptable per requirements.
- **Pre-existing stored values** with diacritics are not modified by input
  validation (out-of-scope backend concern; flagged).
- **Empty/whitespace** handling and existing required-field validation are left
  unchanged.

## Testing

- No unit-test harness currently exists (`ybb-program-next` has Playwright e2e
  only).
- Add a standalone runtime verification for `sanitize` / `hasDisallowed`
  covering: Vietnamese (`Nguyễn` → `Nguyn`, the diacritic `ễ` removed), Turkish
  (`Çağ` → `a`-stripped result, `İ`/`ı` removed), Cyrillic, CJK, emoji — all
  fully stripped; valid names (`O'Brien`, `Anne-Marie`) pass unchanged; and
  general-mode fields retain digits and ASCII punctuation.
- Playwright check: typing/pasting a Vietnamese or Turkish name into a name
  field is blocked and shows feedback; an address field keeps digits/commas.
- Recommend adding `vitest` so the pure util gets real unit tests.

> Note on transliteration: the chosen behavior is **block**, not transliterate.
> A diacritic like `ễ` is removed, not converted to `e`. This is intentional per
> the confirmed requirement; transliteration was considered and rejected for
> this iteration.
