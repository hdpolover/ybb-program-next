// hooks/useTurnstile.tsx
'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import TurnstileWidget, { type TurnstileHandle } from '@/components/security/TurnstileWidget';
import { fetchTurnstileSiteKey, TURNSTILE_HEADER } from '@/lib/auth/turnstileSiteKey';

export const TURNSTILE_VERIFYING_MESSAGE =
  'Verifying you are human... please try again in a moment.';

export type TurnstileState = {
  /** A site key is configured, so submits must carry a token. */
  enabled: boolean;
  token: string | null;
  /** Spread into the request headers; empty when there is no token. */
  headers: Record<string, string>;
  /** Render once inside the form; null when the feature is off. */
  widget: ReactNode;
  /** Tokens are single-use: call after every submit, success or failure. */
  reset: () => void;
};

/** Cloudflare Turnstile for the participant auth forms (invisible unless challenged). */
export function useTurnstile(): TurnstileState {
  const [siteKey, setSiteKey] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const widgetRef = useRef<TurnstileHandle>(null);

  useEffect(() => {
    let active = true;
    void fetchTurnstileSiteKey().then((key) => {
      if (active) setSiteKey(key);
    });
    return () => {
      active = false;
    };
  }, []);

  const reset = useCallback(() => widgetRef.current?.reset(), []);

  return {
    enabled: Boolean(siteKey),
    token,
    headers: token ? { [TURNSTILE_HEADER]: token } : {},
    widget: siteKey ? (
      <TurnstileWidget ref={widgetRef} siteKey={siteKey} appearance="interaction-only" onToken={setToken} />
    ) : null,
    reset,
  };
}
