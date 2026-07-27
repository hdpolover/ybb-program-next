import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';

const toastCustom = vi.fn(() => 1);
const toastDismiss = vi.fn();
vi.mock('sonner', () => ({
  toast: { custom: (...args: unknown[]) => toastCustom(...args), dismiss: (...args: unknown[]) => toastDismiss(...args) },
}));

import { ActivityToast } from './ActivityToast';
import {
  FIRST_DELAY_MAX_MS,
  GAP_MAX_MS,
  SESSION_DISMISS_KEY,
} from './activityToastUtils';
import type { ActivityItem } from '@/lib/api/activity';

function buildItems(count: number): ActivityItem[] {
  return Array.from({ length: count }, (_, index) => ({
    type: 'accepted' as const,
    name: `Person${index} S.`,
    country: 'Japan',
    countryCode: 'JP',
    programName: 'AYIMUN',
  }));
}

beforeEach(() => {
  vi.useFakeTimers();
  toastCustom.mockClear();
  toastDismiss.mockClear();
  window.sessionStorage.clear();
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }) as unknown as typeof window.matchMedia;
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('ActivityToast', () => {
  it('shows nothing before the first delay elapses', () => {
    render(<ActivityToast items={buildItems(10)} />);
    vi.advanceTimersByTime(1_000);
    expect(toastCustom).not.toHaveBeenCalled();
  });

  it('shows the first toast once the maximum first delay has passed', () => {
    render(<ActivityToast items={buildItems(10)} />);
    vi.advanceTimersByTime(FIRST_DELAY_MAX_MS);
    expect(toastCustom).toHaveBeenCalledTimes(1);
  });

  it('keeps scheduling further toasts', () => {
    render(<ActivityToast items={buildItems(10)} />);
    vi.advanceTimersByTime(FIRST_DELAY_MAX_MS);
    vi.advanceTimersByTime(GAP_MAX_MS);
    expect(toastCustom).toHaveBeenCalledTimes(2);
  });

  it('does nothing when the pool is empty', () => {
    render(<ActivityToast items={[]} />);
    vi.advanceTimersByTime(FIRST_DELAY_MAX_MS + GAP_MAX_MS * 5);
    expect(toastCustom).not.toHaveBeenCalled();
  });

  it('does nothing when the session was already dismissed', () => {
    window.sessionStorage.setItem(SESSION_DISMISS_KEY, '1');
    render(<ActivityToast items={buildItems(10)} />);
    vi.advanceTimersByTime(FIRST_DELAY_MAX_MS + GAP_MAX_MS);
    expect(toastCustom).not.toHaveBeenCalled();
  });

  it('stops scheduling after unmount', () => {
    const { unmount } = render(<ActivityToast items={buildItems(10)} />);
    vi.advanceTimersByTime(FIRST_DELAY_MAX_MS);
    expect(toastCustom).toHaveBeenCalledTimes(1);
    unmount();
    vi.advanceTimersByTime(GAP_MAX_MS * 3);
    expect(toastCustom).toHaveBeenCalledTimes(1);
  });

  it('uses bottom-left on desktop widths', () => {
    render(<ActivityToast items={buildItems(10)} />);
    vi.advanceTimersByTime(FIRST_DELAY_MAX_MS);
    expect(toastCustom.mock.calls[0][1]).toMatchObject({ position: 'bottom-left' });
  });

  it('dismisses only the toast it created, by id, not every toast on screen', () => {
    toastCustom.mockReturnValueOnce('toast-id-42');
    render(<ActivityToast items={buildItems(10)} />);
    vi.advanceTimersByTime(FIRST_DELAY_MAX_MS);

    const renderCard = toastCustom.mock.calls[0][0] as () => JSX.Element;
    const card = renderCard();
    card.props.onDismiss();

    expect(toastDismiss).toHaveBeenCalledTimes(1);
    expect(toastDismiss).toHaveBeenCalledWith('toast-id-42');
  });
});
