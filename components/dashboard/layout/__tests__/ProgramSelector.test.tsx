// components/dashboard/layout/__tests__/ProgramSelector.test.tsx
//
// MEYS 6th/7th: switching programs in the top bar "errored". The selector
// rebuilt its program list every render, so its resolve effect re-ran on every
// render and fought the effect that wrote the click to storage. Each bounce
// fired the change event, every section refetched on every bounce, and the API
// rate limiter answered with 429s.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  ACTIVE_PROGRAM_CHANGED_EVENT,
  ACTIVE_PROGRAM_STORAGE_KEY,
  EXPLICIT_PROGRAM_CHOICE_STORAGE_KEY,
} from '@/lib/dashboard/activeProgram';

vi.mock('@/components/providers/SettingsProvider', () => ({
  useSettings: () => ({ settings: { brand: { name: 'MEYS', logo_url: '/logo.png' } } }),
}));

vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: (props: { src: string; alt: string }) => <img src={props.src} alt={props.alt} />,
}));

import ProgramSelector from '@/components/dashboard/layout/ProgramSelector';

// A fresh array (and fresh objects) on every call, the way the layout passes
// `me?.registeredPrograms ?? []` through re-renders.
function programs() {
  return [
    { programId: 'meys-2027', programName: 'MEYS', programSlug: 'meys-7', year: 2027, applicationStatus: 'draft' },
    { programId: 'meys-2026', programName: 'MEYS', programSlug: 'meys-6', year: 2026, applicationStatus: 'submitted' },
  ];
}

describe('ProgramSelector', () => {
  const events: string[] = [];
  const listener = (event: Event) => {
    events.push((event as CustomEvent<{ programId: string }>).detail.programId);
  };

  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    events.length = 0;
    window.addEventListener(ACTIVE_PROGRAM_CHANGED_EVENT, listener);
  });

  afterEach(() => {
    window.removeEventListener(ACTIVE_PROGRAM_CHANGED_EVENT, listener);
  });

  it('corrects a stored phantom draft to the submitted application and persists it', () => {
    // What a pre-fix login left behind.
    window.localStorage.setItem(ACTIVE_PROGRAM_STORAGE_KEY, 'meys-2027');

    render(<ProgramSelector programs={programs()} />);

    expect(screen.getByRole('button', { name: /MEYS 2026/ })).toBeInTheDocument();
    expect(window.localStorage.getItem(ACTIVE_PROGRAM_STORAGE_KEY)).toBe('meys-2026');
    expect(events).toEqual(['meys-2026']);
  });

  it('does not fire change events when the parent re-renders with a new array', () => {
    window.localStorage.setItem(ACTIVE_PROGRAM_STORAGE_KEY, 'meys-2026');

    const { rerender } = render(<ProgramSelector programs={programs()} />);
    for (let i = 0; i < 5; i += 1) {
      rerender(<ProgramSelector programs={programs()} />);
    }

    expect(events).toEqual([]);
  });

  it('switching fires the change event exactly once and the choice stays selected', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(ACTIVE_PROGRAM_STORAGE_KEY, 'meys-2026');

    const { rerender } = render(<ProgramSelector programs={programs()} />);
    expect(events).toEqual([]);

    await user.click(screen.getByRole('button', { name: /MEYS 2026/ }));
    await user.click(screen.getByRole('button', { name: 'MEYS 2027 MEYS 2027' }));

    expect(events).toEqual(['meys-2027']);
    expect(window.localStorage.getItem(ACTIVE_PROGRAM_STORAGE_KEY)).toBe('meys-2027');
    expect(window.sessionStorage.getItem(EXPLICIT_PROGRAM_CHOICE_STORAGE_KEY)).toBe('meys-2027');

    // Sections refetching re-render the layout; the lower-ranked draft the
    // participant picked on purpose must survive that, with no further events.
    await act(async () => {
      rerender(<ProgramSelector programs={programs()} />);
      rerender(<ProgramSelector programs={programs()} />);
    });

    expect(screen.getByRole('button', { name: /MEYS 2027/ })).toBeInTheDocument();
    expect(events).toEqual(['meys-2027']);
  });

  it('keeps an explicit choice across a remount in the same tab session', () => {
    window.localStorage.setItem(ACTIVE_PROGRAM_STORAGE_KEY, 'meys-2027');
    window.sessionStorage.setItem(EXPLICIT_PROGRAM_CHOICE_STORAGE_KEY, 'meys-2027');

    render(<ProgramSelector programs={programs()} />);

    expect(screen.getByRole('button', { name: /MEYS 2027/ })).toBeInTheDocument();
    expect(events).toEqual([]);
  });
});
