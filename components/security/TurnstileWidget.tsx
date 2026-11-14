// components/security/TurnstileWidget.tsx
'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
// A script that never arrives (blocked or very slow network) must not hold forms hostage.
const SCRIPT_TIMEOUT_MS = 8000;

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  remove: (id: string) => void;
  reset: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = TURNSTILE_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error('turnstile script failed to load'));
    };
    document.head.appendChild(script);
  });
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('turnstile script timed out')), SCRIPT_TIMEOUT_MS),
  );
  return Promise.race([scriptPromise, timeout]);
}

export type TurnstileHandle = {
  /** Tokens are single-use: call after every submit, success or failure. */
  reset: () => void;
};

type Props = {
  siteKey: string;
  /** Called with the token, or null when it expires / errors / is reset. */
  onToken: (token: string | null) => void;
  /** The challenge could not run (script blocked/timed out, widget error). */
  onFailed?: () => void;
  /** 'interaction-only' stays invisible unless Cloudflare decides to challenge. */
  appearance?: 'always' | 'execute' | 'interaction-only';
};

const TurnstileWidget = forwardRef<TurnstileHandle, Props>(function TurnstileWidget(
  { siteKey, onToken, onFailed, appearance },
  ref,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  const onFailedRef = useRef(onFailed);
  useEffect(() => {
    onTokenRef.current = onToken;
    onFailedRef.current = onFailed;
  });

  useImperativeHandle(ref, () => ({
    reset: () => {
      onTokenRef.current(null);
      if (widgetIdRef.current && window.turnstile) window.turnstile.reset(widgetIdRef.current);
    },
  }));

  useEffect(() => {
    let cancelled = false;
    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          ...(appearance ? { appearance } : {}),
          callback: (token: string) => onTokenRef.current(token),
          'expired-callback': () => onTokenRef.current(null),
          'error-callback': () => {
            onTokenRef.current(null);
            onFailedRef.current?.();
          },
        });
      })
      .catch(() => {
        onTokenRef.current(null);
        onFailedRef.current?.();
      });
    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = null;
      onTokenRef.current(null); // a remounted widget must not inherit a stale token
    };
  }, [siteKey, appearance]);

  return <div ref={containerRef} />;
});

export default TurnstileWidget;
