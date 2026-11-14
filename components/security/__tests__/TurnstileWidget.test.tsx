// components/security/__tests__/TurnstileWidget.test.tsx
import { createRef } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor, act } from '@testing-library/react';
import TurnstileWidget, { type TurnstileHandle } from '../TurnstileWidget';

type RenderOpts = { sitekey: string; appearance?: string; callback: (t: string) => void };

describe('TurnstileWidget', () => {
  const api = { render: vi.fn(), remove: vi.fn(), reset: vi.fn() };
  let opts: RenderOpts;

  beforeEach(() => {
    api.render.mockImplementation((_el: HTMLElement, o: RenderOpts) => {
      opts = o;
      return 'w1';
    });
    window.turnstile = api;
  });
  afterEach(() => {
    vi.clearAllMocks();
    delete window.turnstile;
  });

  it('renders with the requested appearance and reports tokens', async () => {
    const onToken = vi.fn();
    render(<TurnstileWidget siteKey="k" appearance="interaction-only" onToken={onToken} />);
    await waitFor(() => expect(api.render).toHaveBeenCalled());
    expect(opts.sitekey).toBe('k');
    expect(opts.appearance).toBe('interaction-only');
    act(() => opts.callback('tok'));
    expect(onToken).toHaveBeenLastCalledWith('tok');
  });

  it('reset() clears the token and resets the Cloudflare widget by id', async () => {
    const onToken = vi.fn();
    const ref = createRef<TurnstileHandle>();
    render(<TurnstileWidget ref={ref} siteKey="k" onToken={onToken} />);
    await waitFor(() => expect(api.render).toHaveBeenCalled());
    act(() => ref.current?.reset());
    expect(onToken).toHaveBeenLastCalledWith(null);
    expect(api.reset).toHaveBeenCalledWith('w1');
  });

  it('clears the token and removes the widget on unmount', async () => {
    const onToken = vi.fn();
    const { unmount } = render(<TurnstileWidget siteKey="k" onToken={onToken} />);
    await waitFor(() => expect(api.render).toHaveBeenCalled());
    unmount();
    expect(api.remove).toHaveBeenCalledWith('w1');
    expect(onToken).toHaveBeenLastCalledWith(null);
  });
});
