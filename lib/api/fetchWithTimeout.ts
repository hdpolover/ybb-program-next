// lib/api/fetchWithTimeout.ts
//
// Shared timeout primitive for fetch() call sites that need a bounded wait.
// Extracted after a stalled-backend incident review found PaymentsListSection's
// client fetch and its /api/portal/payments proxy hop had no timeout at all —
// a hung upstream left the UI on skeleton loaders indefinitely with no error
// and no retry.

/**
 * Builds an AbortSignal that fires after `timeoutMs`, optionally chained to
 * an `externalSignal` (e.g. an unmount controller) so either can cancel the
 * request. Callers MUST call `cleanup()` once the request settles to clear
 * the pending timer and detach the external listener.
 */
export function withTimeoutSignal(
  timeoutMs: number,
  externalSignal?: AbortSignal,
): { signal: AbortSignal; cleanup: () => void } {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const onExternalAbort = () => controller.abort();
  externalSignal?.addEventListener('abort', onExternalAbort);

  const cleanup = () => {
    clearTimeout(timeoutId);
    externalSignal?.removeEventListener('abort', onExternalAbort);
  };

  return { signal: controller.signal, cleanup };
}

/** Distinguishes a timeout/abort from other fetch failures (network errors, non-2xx, etc). */
export function isFetchTimeoutError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}
