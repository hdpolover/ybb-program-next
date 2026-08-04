// __tests__/useAutoSave.test.ts

import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAutoSave, loadFromLocalStorage, clearLocalStorage } from '@/hooks/useAutoSave';

// Node 22+'s built-in global `localStorage` shadows jsdom's window.localStorage
// in this vitest/Node combo, and is non-functional without a
// --localstorage-file flag (`.clear` etc come back undefined). Swap in a
// minimal in-memory Storage polyfill for this test file only, since the code
// under test reads the bare `localStorage` global at call time.
class MemoryStorage implements Storage {
  private store = new Map<string, string>();
  get length() {
    return this.store.size;
  }
  clear(): void {
    this.store.clear();
  }
  getItem(key: string): string | null {
    return this.store.has(key) ? (this.store.get(key) as string) : null;
  }
  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

beforeAll(() => {
  Object.defineProperty(globalThis, 'localStorage', {
    value: new MemoryStorage(),
    configurable: true,
    writable: true,
  });
});

describe('loadFromLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns the default value when nothing is stored', () => {
    expect(loadFromLocalStorage('missing-key', { foo: 'bar' })).toEqual({ foo: 'bar' });
  });

  it('returns the parsed value when something is stored', () => {
    localStorage.setItem('some-key', JSON.stringify({ foo: 'baz' }));
    expect(loadFromLocalStorage('some-key', { foo: 'bar' })).toEqual({ foo: 'baz' });
  });

  it('falls back to the default value on corrupt JSON instead of throwing', () => {
    localStorage.setItem('corrupt-key', '{not valid json');
    expect(loadFromLocalStorage('corrupt-key', { foo: 'bar' })).toEqual({ foo: 'bar' });
  });
});

describe('clearLocalStorage', () => {
  it('removes the key', () => {
    localStorage.setItem('to-clear', 'value');
    clearLocalStorage('to-clear');
    expect(localStorage.getItem('to-clear')).toBeNull();
  });
});

describe('useAutoSave localStorage mirror', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('wraps persisted data in a { data, savedAt } envelope', () => {
    renderHook(() => useAutoSave('draft-key', { foo: 'bar' }));

    const raw = localStorage.getItem('draft-key');
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw as string);
    expect(parsed.data).toEqual({ foo: 'bar' });
    expect(typeof parsed.savedAt).toBe('number');
  });

  it('does not write to localStorage when isEmpty(data) is true', () => {
    renderHook(() => useAutoSave('empty-key', { foo: '' }, undefined, 3000, d => d.foo === ''));

    expect(localStorage.getItem('empty-key')).toBeNull();
  });

  // Regression test: previously, clearLocalStorage() cleared the key but the
  // mirror effect (driven by a fresh object literal every render) immediately
  // rewrote it on the very next render, since the caller's in-memory state
  // hadn't actually changed. This proves the fix: once the draft data itself
  // becomes "empty" (dirty tracking reset alongside the explicit clear), the
  // hook removes the key instead of resurrecting it.
  it('a clear followed by a re-render with now-empty data stays cleared, not rewritten', () => {
    const isEmpty = (d: { foo: string }) => d.foo === '';

    const { rerender } = renderHook(({ data }: { data: { foo: string } }) => useAutoSave('sticky-key', data, undefined, 3000, isEmpty), {
      initialProps: { data: { foo: 'unsaved edit' } },
    });

    expect(localStorage.getItem('sticky-key')).not.toBeNull();

    // Simulate: save succeeded, clearLocalStorage() ran, and the caller reset
    // its dirty-tracked draft data to empty in the same update.
    clearLocalStorage('sticky-key');
    rerender({ data: { foo: '' } });

    expect(localStorage.getItem('sticky-key')).toBeNull();
  });

  it('debounced onSave still fires once data actually changes after mount', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const { rerender } = renderHook(
      ({ data }: { data: { foo: string } }) => useAutoSave('debounce-key', data, onSave, 3000),
      { initialProps: { data: { foo: 'initial' } } },
    );

    expect(onSave).not.toHaveBeenCalled();

    rerender({ data: { foo: 'bar' } });
    await vi.advanceTimersByTimeAsync(3000);

    expect(onSave).toHaveBeenCalledWith({ foo: 'bar' });
  });
});
