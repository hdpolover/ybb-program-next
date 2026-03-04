'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { componentsTheme } from '@/lib/theme/components';

type VerifyStatus = 'idle' | 'loading' | 'success' | 'error';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') ?? '';

  const [status, setStatus] = useState<VerifyStatus>('idle');
  const [message, setMessage] = useState('');

  const buttonLabel = useMemo(() => {
    if (status === 'loading') return 'Verifying...';
    if (status === 'success') return 'Go to Login';
    if (status === 'error') return 'Back to Login';
    return 'Back to Login';
  }, [status]);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. Missing token.');
      return;
    }

    let cancelled = false;
    setStatus('loading');
    setMessage('');

    (async () => {
      try {
        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const json = (await res.json().catch(() => ({}))) as { statusCode?: number; message?: string };
        if (!res.ok) {
          throw new Error(json?.message || 'Verify email failed');
        }

        if (!cancelled) {
          setStatus('success');
          setMessage('Your email has been verified. You can now log in.');
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Verify email failed';
        if (!cancelled) {
          setStatus('error');
          setMessage(msg);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (status !== 'success') return;

    const t = window.setTimeout(() => {
      router.push('/login');
    }, 2500);

    return () => window.clearTimeout(t);
  }, [router, status]);

  return (
    <section className={`min-h-screen w-full ${componentsTheme.login.pageBackground}`}>
      <div className={componentsTheme.login.formPanelOuter}>
        <div className={componentsTheme.login.formPanelInner}>
          <div className={componentsTheme.login.card}>
            <h1 className={componentsTheme.login.formHeading}>Verify Your Email</h1>

            {status === 'loading' ? (
              <p className={componentsTheme.login.formSubheading}>Verifying your email address...</p>
            ) : (
              <p className={componentsTheme.login.formSubheading}>{message}</p>
            )}

            {status === 'success' ? (
              <p className="mt-2 text-center text-xs font-semibold text-slate-500">
                Redirecting to login...
              </p>
            ) : null}

            <div className="pt-4">
              <button
                type="button"
                onClick={() => router.push('/login')}
                className={componentsTheme.login.primaryButton}
                disabled={status === 'loading'}
              >
                {buttonLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
