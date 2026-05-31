# English-Only Input Restriction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Block characters that cannot render in the exported Letter of Acceptance from participant website text inputs, as the user types/pastes, with visual feedback.

**Architecture:** A pure sanitize utility (`lib/text/restricted-input.ts`) drives two drop-in wrapper components (`<EnglishTextInput>`, `<EnglishTextArea>`) that intercept `onChange`, strip disallowed characters before they reach form state, and render `aria-live` feedback. Two rule tiers: `name` (letters + space + `- ' .`) and `general` (printable ASCII + whitespace). Existing call sites swap their native `<input>`/`<textarea>` for the wrappers and pass `restrictMode`.

**Tech Stack:** Next.js 16, React, TypeScript, Tailwind. Adds `vitest` + `jsdom` + `@testing-library/react` for unit tests (none currently exist).

**Spec:** `docs/superpowers/specs/2026-05-30-english-only-input-design.md`

---

### Task 1: Set up vitest unit-test harness

**Files:**
- Modify: `package.json` (scripts + devDependencies)
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `lib/text/__tests__/smoke.test.ts`

- [ ] **Step 1: Install dev dependencies**

Run:
```bash
npm install -D vitest@^2 jsdom@^25 @testing-library/react@^16 @testing-library/jest-dom@^6 @testing-library/user-event@^14
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./', import.meta.url)) },
  },
});
```

If `@vitejs/plugin-react` is missing, also install it: `npm install -D @vitejs/plugin-react@^4`.

- [ ] **Step 3: Create `vitest.setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 4: Add scripts to `package.json`**

Add to the `"scripts"` block:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Create smoke test `lib/text/__tests__/smoke.test.ts`**

```ts
import { describe, it, expect } from 'vitest';

describe('vitest harness', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 6: Run and verify it passes**

Run: `npm test`
Expected: PASS (1 test).

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.ts vitest.setup.ts lib/text/__tests__/smoke.test.ts
git commit -m "test: add vitest harness for unit tests"
```

---

### Task 2: Core sanitize utility (TDD)

**Files:**
- Create: `lib/text/restricted-input.ts`
- Test: `lib/text/__tests__/restricted-input.test.ts`

- [ ] **Step 1: Write the failing test**

`lib/text/__tests__/restricted-input.test.ts`:
```ts
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
    expect(sanitize('Иван 山田 😀', 'name').value).toBe(' ');
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/text/__tests__/restricted-input.test.ts`
Expected: FAIL — "Failed to resolve import '@/lib/text/restricted-input'".

- [ ] **Step 3: Write the implementation**

`lib/text/restricted-input.ts`:
```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/text/__tests__/restricted-input.test.ts`
Expected: PASS (all cases).

- [ ] **Step 5: Commit**

```bash
git add lib/text/restricted-input.ts lib/text/__tests__/restricted-input.test.ts
git commit -m "feat: add english-only text sanitize utility"
```

---

### Task 3: `<EnglishTextInput>` component (TDD)

**Files:**
- Create: `components/ui/EnglishTextInput.tsx`
- Test: `components/ui/__tests__/EnglishTextInput.test.tsx`

**Interface:** Forwards all native `<input>` props and `ref`. Adds `restrictMode?: RestrictMode` (default `'general'`) and `feedbackClassName?: string`. On change/paste it sanitizes `event.target.value`, mutates the event's target value to the cleaned string, then calls the consumer `onChange` — so existing `e.target.value` handlers receive clean text and the disallowed character never persists. When characters are removed it renders an `aria-live="polite"` message.

- [ ] **Step 1: Write the failing test**

`components/ui/__tests__/EnglishTextInput.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import EnglishTextInput from '@/components/ui/EnglishTextInput';

function Harness({ mode }: { mode?: 'name' | 'general' }) {
  const [v, setV] = useState('');
  return (
    <EnglishTextInput
      restrictMode={mode}
      value={v}
      onChange={(e) => setV(e.target.value)}
      aria-label="field"
    />
  );
}

describe('EnglishTextInput', () => {
  it('blocks disallowed characters from appearing (name mode)', async () => {
    render(<Harness mode="name" />);
    const input = screen.getByLabelText('field') as HTMLInputElement;
    await userEvent.type(input, 'Nguyễn');
    expect(input.value).toBe('Nguyn');
  });

  it('shows feedback when a character is blocked', async () => {
    render(<Harness mode="name" />);
    await userEvent.type(screen.getByLabelText('field'), 'Ça');
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('keeps digits in general mode', async () => {
    render(<Harness mode="general" />);
    const input = screen.getByLabelText('field') as HTMLInputElement;
    await userEvent.type(input, 'Apt 3');
    expect(input.value).toBe('Apt 3');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/ui/__tests__/EnglishTextInput.test.tsx`
Expected: FAIL — cannot resolve `@/components/ui/EnglishTextInput`.

- [ ] **Step 3: Write the implementation**

`components/ui/EnglishTextInput.tsx`:
```tsx
'use client';

import { forwardRef, useState, type ChangeEvent, type InputHTMLAttributes } from 'react';
import { sanitize, type RestrictMode } from '@/lib/text/restricted-input';

const FEEDBACK: Record<RestrictMode, string> = {
  name: 'Please use the English alphabet only — your name appears on your Letter of Acceptance.',
  general: 'Only standard English characters are allowed.',
};

export interface EnglishTextInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  restrictMode?: RestrictMode;
  feedbackClassName?: string;
}

const EnglishTextInput = forwardRef<HTMLInputElement, EnglishTextInputProps>(
  function EnglishTextInput(
    { restrictMode = 'general', feedbackClassName, onChange, ...rest },
    ref,
  ) {
    const [blocked, setBlocked] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { value: clean, removed } = sanitize(e.target.value, restrictMode);
      setBlocked(removed.length > 0);
      if (clean !== e.target.value) {
        e.target.value = clean;
      }
      onChange?.(e);
    };

    return (
      <>
        <input ref={ref} onChange={handleChange} {...rest} />
        {blocked && (
          <p
            role="status"
            aria-live="polite"
            className={feedbackClassName ?? 'mt-1 text-xs text-red-600'}
          >
            {FEEDBACK[restrictMode]}
          </p>
        )}
      </>
    );
  },
);

export default EnglishTextInput;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/ui/__tests__/EnglishTextInput.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add components/ui/EnglishTextInput.tsx components/ui/__tests__/EnglishTextInput.test.tsx
git commit -m "feat: add EnglishTextInput wrapper component"
```

---

### Task 4: `<EnglishTextArea>` component (TDD)

**Files:**
- Create: `components/ui/EnglishTextArea.tsx`
- Test: `components/ui/__tests__/EnglishTextArea.test.tsx`

- [ ] **Step 1: Write the failing test**

`components/ui/__tests__/EnglishTextArea.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import EnglishTextArea from '@/components/ui/EnglishTextArea';

function Harness() {
  const [v, setV] = useState('');
  return (
    <EnglishTextArea value={v} onChange={(e) => setV(e.target.value)} aria-label="ta" />
  );
}

describe('EnglishTextArea', () => {
  it('keeps newlines and ASCII punctuation, strips diacritics', async () => {
    render(<Harness />);
    const ta = screen.getByLabelText('ta') as HTMLTextAreaElement;
    await userEvent.type(ta, 'Hello, café!');
    expect(ta.value).toBe('Hello, caf!');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/ui/__tests__/EnglishTextArea.test.tsx`
Expected: FAIL — cannot resolve module.

- [ ] **Step 3: Write the implementation**

`components/ui/EnglishTextArea.tsx`:
```tsx
'use client';

import { forwardRef, useState, type ChangeEvent, type TextareaHTMLAttributes } from 'react';
import { sanitize, type RestrictMode } from '@/lib/text/restricted-input';

const FEEDBACK: Record<RestrictMode, string> = {
  name: 'Please use the English alphabet only — your name appears on your Letter of Acceptance.',
  general: 'Only standard English characters are allowed.',
};

export interface EnglishTextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  restrictMode?: RestrictMode;
  feedbackClassName?: string;
}

const EnglishTextArea = forwardRef<HTMLTextAreaElement, EnglishTextAreaProps>(
  function EnglishTextArea(
    { restrictMode = 'general', feedbackClassName, onChange, ...rest },
    ref,
  ) {
    const [blocked, setBlocked] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      const { value: clean, removed } = sanitize(e.target.value, restrictMode);
      setBlocked(removed.length > 0);
      if (clean !== e.target.value) {
        e.target.value = clean;
      }
      onChange?.(e);
    };

    return (
      <>
        <textarea ref={ref} onChange={handleChange} {...rest} />
        {blocked && (
          <p
            role="status"
            aria-live="polite"
            className={feedbackClassName ?? 'mt-1 text-xs text-red-600'}
          >
            {FEEDBACK[restrictMode]}
          </p>
        )}
      </>
    );
  },
);

export default EnglishTextArea;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/ui/__tests__/EnglishTextArea.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/ui/EnglishTextArea.tsx components/ui/__tests__/EnglishTextArea.test.tsx
git commit -m "feat: add EnglishTextArea wrapper component"
```

---

### Conversion pattern (used by Tasks 5–8)

For each in-scope `<input type="text">` (or no `type`) and `<textarea>`:

1. Add import at top of the file:
   `import EnglishTextInput from '@/components/ui/EnglishTextInput';`
   and/or `import EnglishTextArea from '@/components/ui/EnglishTextArea';`
2. Replace the tag: `<input ... />` → `<EnglishTextInput ... />`, `<textarea ... />` → `<EnglishTextArea ... />`. Keep ALL existing props (`className`, `value`, `onChange`, `placeholder`, etc.) unchanged.
3. Add `restrictMode="name"` for identity name fields (listed per task). Omit `restrictMode` for everything else (defaults to `general`).

**Do NOT convert** (leave as native): `type="password"`, `type="email"`, `type="number"`, `type="tel"`, `type="search"`, OTP/verification-code inputs, `type="date"`, `type="file"`, checkboxes/radios, and `<select>`.

Because the wrappers render a sibling `<p>` on block, after converting a file confirm the field sits in a column/stacked container (e.g. inside `Field`). If a converted input lives in a strict horizontal flex row where the extra `<p>` would break layout, pass `feedbackClassName="sr-only"` to keep feedback accessible without visual shift, and note it.

---

### Task 5: Convert onboarding form

**Files:**
- Modify: `app/onboarding/page.tsx`

Name field (set `restrictMode="name"`): the "Full name" field (around line 591).
All other text inputs/textareas in this file: default (`general`). Skip excluded types per the conversion pattern.

- [ ] **Step 1:** Apply the conversion pattern to `app/onboarding/page.tsx`. Add `restrictMode="name"` only to the Full name input.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0 (no errors referencing `app/onboarding/page.tsx`).

- [ ] **Step 3: Lint**

Run: `npx eslint app/onboarding/page.tsx`
Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add app/onboarding/page.tsx
git commit -m "feat: restrict onboarding name/text inputs to english alphabet"
```

---

### Task 6: Convert apply forms (including dynamic program fields)

**Files:**
- Modify: `app/apply/ambassador/page.tsx`
- Modify: `components/dashboard/sections/SubmissionEditSection.tsx` (dynamic field renderer for apply/submission)

Identity name fields → `restrictMode="name"` (any field labeled name/full name/passport name). Dynamically-rendered program text fields and all other text inputs → default (`general`).

- [ ] **Step 1:** Convert `app/apply/ambassador/page.tsx` per the conversion pattern. Mark any name field as `restrictMode="name"`.

- [ ] **Step 2:** In `components/dashboard/sections/SubmissionEditSection.tsx`, find where dynamic fields render a text `<input>`/`<textarea>` (the `text`/`textarea` field-type branch). Convert those to `EnglishTextInput`/`EnglishTextArea` with default `general` mode. If a dynamic field's `name`/`label` matches `/name/i`, pass `restrictMode="name"`.

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 4: Lint**

Run: `npx eslint app/apply/ambassador/page.tsx components/dashboard/sections/SubmissionEditSection.tsx`
Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add app/apply/ambassador/page.tsx components/dashboard/sections/SubmissionEditSection.tsx
git commit -m "feat: restrict apply + dynamic program text fields to english alphabet"
```

---

### Task 7: Convert dashboard submission/profile edit sections

**Files (convert text inputs/textareas in each):**
- Modify: `components/dashboard/sections/submission/SubmissionEditPersonalDetailsSection.tsx`
- Modify: `components/dashboard/sections/submission/SubmissionEditEntryInformationSection.tsx`
- Modify: `components/dashboard/sections/submission/SubmissionEditProfessionalProfileSection.tsx`
- Modify: `components/dashboard/sections/submission/SubmissionEditMiscSection.tsx`
- Modify: `components/dashboard/sections/SettingsSection.tsx`

**`restrictMode="name"` fields (identity names):**
- `SubmissionEditPersonalDetailsSection.tsx`: "Full Name" (line ~290), "Nick Name" (line ~311), and any passport/legal-name or parent/guardian/emergency-contact name field present in the file.
- `SubmissionEditMiscSection.tsx`: "Source Account Name" (line ~131).
- `SettingsSection.tsx`: account display-name field, if present.

All other in-scope text inputs/textareas in these files → default (`general`). Apply exclusions from the conversion pattern (notably: do not convert email/password in `SettingsSection.tsx`).

- [ ] **Step 1:** Convert `SubmissionEditPersonalDetailsSection.tsx`. Add `restrictMode="name"` to the name fields listed above.

- [ ] **Step 2:** Convert `SubmissionEditEntryInformationSection.tsx` (all `general` unless a field is a name).

- [ ] **Step 3:** Convert `SubmissionEditProfessionalProfileSection.tsx` (essays/bio/org → `general`).

- [ ] **Step 4:** Convert `SubmissionEditMiscSection.tsx`. "Source Account Name" → `restrictMode="name"`.

- [ ] **Step 5:** Convert `SettingsSection.tsx` non-excluded text fields; name → `restrictMode="name"`; leave email/password native.

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 7: Lint**

Run: `npx eslint components/dashboard/sections/submission components/dashboard/sections/SettingsSection.tsx`
Expected: exit 0.

- [ ] **Step 8: Commit**

```bash
git add components/dashboard/sections/submission components/dashboard/sections/SettingsSection.tsx
git commit -m "feat: restrict dashboard submission/profile text inputs to english alphabet"
```

---

### Task 8: End-to-end verification

**Files:**
- (No new files required; optional Playwright spec under `tests/` if the project's Playwright config has a place for it.)

- [ ] **Step 1: Run the full unit suite**

Run: `npm test`
Expected: PASS — util + both component test files green.

- [ ] **Step 2: Full typecheck + lint**

Run: `npx tsc --noEmit && npx eslint .`
Expected: exit 0.

- [ ] **Step 3: Manual/Playwright smoke (dashboard submission edit)**

Start the app pointed at a working API/brand (see `docs/` or use the local dev pattern), open the submission edit form, and verify:
- Typing `Nguyễn` into Full Name yields `Nguyn` and shows the feedback message.
- Pasting `Çağİ` into Full Name yields `a` (Turkish letters stripped) with feedback.
- An address/essay field accepts `12 Main St., Apt #3` unchanged.
- A name field still accepts `Anne-Marie O'Brien`.

- [ ] **Step 4: Commit any test artifacts**

```bash
git add -A
git commit -m "test: verify english-only input restriction end-to-end"
```

---

## Notes / Follow-ups (not in this plan)

- **Backend validation** of the same rules (LoA is generated server-side; frontend-only blocking won't catch pre-existing records or non-website data). Recommended next.
- **Admin dashboard** (`ybb-platform`) name editing should get the same guard.
- Consider a one-time data audit/cleanup of existing names containing non-ASCII characters.
