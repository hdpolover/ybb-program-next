// __tests__/useDashboardSummaryRefetch.test.tsx
import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDashboardSummaryRefetch } from '@/hooks/useDashboardSummaryRefetch';
import {
  ACTIVE_PROGRAM_CHANGED_EVENT,
  DASHBOARD_SUMMARY_STALE_EVENT,
} from '@/lib/dashboard/activeProgram';

const PROGRAMS = [{ programId: 'p1', programName: 'P', programSlug: 'p' }];

function Harness({ pathname, onSummary }: { pathname: string; onSummary: (p: unknown) => void }) {
  useDashboardSummaryRefetch({ registeredPrograms: PROGRAMS, pathname, onSummary });
  return null;
}

const flush = () => act(async () => { await Promise.resolve(); await Promise.resolve(); });

describe('useDashboardSummaryRefetch', () => {
  const fetchMock = vi.fn();
  const onSummary = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { totalRequired: 0 } }),
    });
    onSummary.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });
  afterEach(() => vi.unstubAllGlobals());

  it('does not fetch on initial mount (the layout mount fetch covers it)', async () => {
    render(<Harness pathname="/dashboard" onSummary={onSummary} />);
    await flush();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('refetches and updates in place on the stale event', async () => {
    render(<Harness pathname="/dashboard" onSummary={onSummary} />);
    act(() => { window.dispatchEvent(new Event(DASHBOARD_SUMMARY_STALE_EVENT)); });
    await flush();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain('/api/portal/dashboard');
    expect(onSummary).toHaveBeenCalledWith({ totalRequired: 0 });
  });

  it('refetches on active program change', async () => {
    render(<Harness pathname="/dashboard" onSummary={onSummary} />);
    act(() => { window.dispatchEvent(new Event(ACTIVE_PROGRAM_CHANGED_EVENT)); });
    await flush();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('refetches when the pathname changes, not on rerender with the same path', async () => {
    const { rerender } = render(<Harness pathname="/dashboard/payments/1" onSummary={onSummary} />);
    rerender(<Harness pathname="/dashboard/payments/1" onSummary={onSummary} />);
    await flush();
    expect(fetchMock).not.toHaveBeenCalled();

    rerender(<Harness pathname="/dashboard" onSummary={onSummary} />);
    await flush();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(onSummary).toHaveBeenCalledTimes(1);
  });

  it('refetches when the tab becomes visible, but not while hidden', async () => {
    render(<Harness pathname="/dashboard" onSummary={onSummary} />);
    const setVisibility = (state: 'visible' | 'hidden') =>
      Object.defineProperty(document, 'visibilityState', { value: state, configurable: true });

    setVisibility('hidden');
    act(() => { document.dispatchEvent(new Event('visibilitychange')); });
    await flush();
    expect(fetchMock).not.toHaveBeenCalled();

    setVisibility('visible');
    act(() => { document.dispatchEvent(new Event('visibilitychange')); });
    await flush();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('keeps the existing summary when the request fails', async () => {
    fetchMock.mockRejectedValue(new Error('network'));
    render(<Harness pathname="/dashboard" onSummary={onSummary} />);
    act(() => { window.dispatchEvent(new Event(DASHBOARD_SUMMARY_STALE_EVENT)); });
    await flush();
    expect(onSummary).not.toHaveBeenCalled();
  });

  it('lets only the latest request write', async () => {
    let resolveFirst: (v: unknown) => void = () => {};
    fetchMock
      .mockReturnValueOnce(new Promise(r => { resolveFirst = r; }))
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: { n: 2 } }) });
    render(<Harness pathname="/dashboard" onSummary={onSummary} />);
    act(() => { window.dispatchEvent(new Event(DASHBOARD_SUMMARY_STALE_EVENT)); });
    act(() => { window.dispatchEvent(new Event(DASHBOARD_SUMMARY_STALE_EVENT)); });
    await flush();
    resolveFirst({ ok: true, json: async () => ({ data: { n: 1 } }) });
    await flush();
    expect(onSummary).toHaveBeenCalledTimes(1);
    expect(onSummary).toHaveBeenCalledWith({ n: 2 });
  });

  it('removes listeners on unmount', async () => {
    const { unmount } = render(<Harness pathname="/dashboard" onSummary={onSummary} />);
    unmount();
    window.dispatchEvent(new Event(DASHBOARD_SUMMARY_STALE_EVENT));
    await flush();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
