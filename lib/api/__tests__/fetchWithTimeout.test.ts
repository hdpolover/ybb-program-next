// lib/api/__tests__/fetchWithTimeout.test.ts
//
// Root cause under test: PaymentsListSection's fetch and its server-side
// proxy hop had no timeout at all, so a stalled backend left the UI on
// skeleton loaders forever (see 2026-08 routing incident review). These
// helpers give both hops a bounded, abortable wait.

import { describe, it, expect, vi, afterEach } from 'vitest';
import { withTimeoutSignal, isFetchTimeoutError } from '@/lib/api/fetchWithTimeout';

describe('withTimeoutSignal', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not abort before the timeout elapses', () => {
    vi.useFakeTimers();
    const { signal, cleanup } = withTimeoutSignal(15_000);

    vi.advanceTimersByTime(14_999);
    expect(signal.aborted).toBe(false);

    cleanup();
  });

  it('aborts the signal once the timeout elapses', () => {
    vi.useFakeTimers();
    const { signal, cleanup } = withTimeoutSignal(15_000);

    vi.advanceTimersByTime(15_000);
    expect(signal.aborted).toBe(true);

    cleanup();
  });

  it('aborts a fetch that never resolves once the timeout fires', async () => {
    vi.useFakeTimers();
    // A fetch that hangs forever, exactly like a stalled backend — resolves
    // only if aborted.
    const hangingFetch = (signal: AbortSignal) =>
      new Promise<Response>((_resolve, reject) => {
        signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
      });

    const { signal, cleanup } = withTimeoutSignal(15_000);
    const pending = hangingFetch(signal);

    vi.advanceTimersByTime(15_000);
    await expect(pending).rejects.toMatchObject({ name: 'AbortError' });

    cleanup();
  });

  it('also aborts when the caller-supplied external signal aborts', () => {
    vi.useFakeTimers();
    const externalController = new AbortController();
    const { signal, cleanup } = withTimeoutSignal(15_000, externalController.signal);

    externalController.abort();
    expect(signal.aborted).toBe(true);

    cleanup();
  });

  it('cleanup clears the pending timeout so it never fires late', () => {
    vi.useFakeTimers();
    const { signal, cleanup } = withTimeoutSignal(15_000);
    cleanup();

    vi.advanceTimersByTime(20_000);
    expect(signal.aborted).toBe(false);
  });
});

describe('isFetchTimeoutError', () => {
  it('recognizes an AbortError DOMException as a timeout', () => {
    expect(isFetchTimeoutError(new DOMException('Aborted', 'AbortError'))).toBe(true);
  });

  it('does not treat a plain network error as a timeout', () => {
    expect(isFetchTimeoutError(new TypeError('Failed to fetch'))).toBe(false);
  });

  it('does not treat non-error values as a timeout', () => {
    expect(isFetchTimeoutError(null)).toBe(false);
    expect(isFetchTimeoutError('AbortError')).toBe(false);
  });
});
