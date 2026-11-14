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
  /**
   * Still waiting for a token. False once the challenge has failed to run: the form
   * then submits without one and the API's AUTH_TURNSTILE_ENFORCE flag decides, so
   * a blocked script never locks users out while enforcement is off.
   */
  pending: boolean;
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
  const [failed, setFailed] = useState(false);
  const markFailed = useCallback(() => setFailed(true), []);
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
    pending: Boolean(siteKey) && !token && !failed,
    token,
    headers: token ? { [TURNSTILE_HEADER]: token } : {},
    widget: siteKey ? (
      <TurnstileWidget ref={widgetRef} siteKey={siteKey} appearance="interaction-only" onToken={setToken} onFailed={markFailed} />
    ) : null,
    reset,
  };
}
