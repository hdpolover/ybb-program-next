'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { jysSectionTheme } from '@/lib/theme/jys-components';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') ?? '';

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) return;

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

        const json = (await res.json()) as { statusCode?: number; message?: string };
        if (!res.ok) {
          throw new Error(json?.message || 'Verify email failed');
        }

        if (!cancelled) {
          setStatus('success');
          setMessage('Email verified. You can now log in.');
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

  return (
    <section className={`min-h-screen w-full ${jysSectionTheme.login.pageBackground}`}>
      <div className={jysSectionTheme.login.formPanelOuter}>
        <div className={jysSectionTheme.login.formPanelInner}>
          <div className={jysSectionTheme.login.card}>
            <h1 className={jysSectionTheme.login.formHeading}>Verify Email</h1>

            {!token ? (
              <p className={jysSectionTheme.login.formSubheading}>Missing verification token.</p>
            ) : status === 'loading' ? (
              <p className={jysSectionTheme.login.formSubheading}>Verifying...</p>
            ) : (
              <p className={jysSectionTheme.login.formSubheading}>{message}</p>
            )}

            <div className="pt-4">
              <a href="/login" className={jysSectionTheme.login.primaryButton}>
                Back to Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
