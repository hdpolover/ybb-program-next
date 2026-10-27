// app/checkout/page.tsx
//
// Inline-signup checkout: create the account and pay in one step. The BFF sets
// the session cookies, so the browser comes back from Xendit already logged in.
'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { Alert } from '@/components/ui';
import EnglishTextInput from '@/components/ui/EnglishTextInput';
import { PasswordRequirements } from '@/components/auth/PasswordRequirements';
import { EmailTypoHint } from '@/components/auth/EmailTypoHint';
import TurnstileWidget from '@/components/checkout/TurnstileWidget';
import { useEmailTypoHint } from '@/hooks/useEmailTypoHint';
import { PASSWORD_RULES_MESSAGE, isPasswordValid } from '@/lib/auth/passwordRules';
import CheckoutPicker from '@/components/checkout/CheckoutPicker';
import { useCheckoutSelection } from '@/hooks/useCheckoutSelection';
import { clearCart, type CartLine } from '@/lib/checkout/cart';
import { formatAmount } from '@/lib/checkout/checkoutConfig';
import { clearPayIntent } from '@/lib/checkout/payIntent';
import { getErrorMessage, getEnvelopeData, isRecord } from '@/lib/api/response';
import { normalizeEmailInput } from '@/lib/utils';

const INPUT_CLASS =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20';
const LABEL_CLASS = 'mb-1 block text-sm font-medium text-slate-700';
const ACCOUNT_EXISTS = 'ACCOUNT_EXISTS';

function buildLoginHref(line: CartLine): string {
  // Login mode (no mode=signup): the page stores the pay intent and, once signed in, opens /dashboard/pay.
  const params = new URLSearchParams({ intent: 'pay', tier: line.tierId, programSlug: line.programSlug });
  return `/login?${params.toString()}`;
}

export default function CheckoutPage() {
  const { state, chooseEdition, chooseCategory } = useCheckoutSelection();
  const [resetKey, setResetKey] = useState(0);
  const [form, setForm] = useState({ email: '', fullName: '', password: '', confirmPassword: '' });
  const [consent, setConsent] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [accountExists, setAccountExists] = useState(false);

  const acceptEmail = useCallback((email: string) => setForm((prev) => ({ ...prev, email })), []);
  const emailHint = useEmailTypoHint(form.email, acceptEmail, { warnNonGmail: true });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'email' ? normalizeEmailInput(value) : value }));
  };

  if (state.phase === 'loading') {
    return <main className="px-4 py-12 text-center text-sm text-slate-600">Loading checkout...</main>;
  }
  if (state.phase !== 'ready') {
    return (
      <main className="mx-auto max-w-md px-4 py-12 text-center">
        <p className="text-sm text-slate-600">
          {state.phase === 'empty'
            ? 'Your cart is empty.'
            : 'Checkout is not available right now. You can still register and pay from your dashboard.'}
        </p>
        <Link
          href={state.phase === 'empty' ? '/apply' : '/login?mode=signup'}
          className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
        >
          {state.phase === 'empty' ? 'Browse registration fees' : 'Register'}
        </Link>
      </main>
    );
  }

  const { config, selection } = state;
  const line = selection.line;
  const quote = selection.option;
  const needsTurnstile = Boolean(config.turnstileSiteKey);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setAccountExists(false);
    if (!isPasswordValid(form.password)) return setError(PASSWORD_RULES_MESSAGE);
    if (form.password !== form.confirmPassword) return setError('Password and confirm password do not match');
    if (!consent) return setError('You must agree to the Terms of Service, Privacy Policy and Refund Policy to continue');
    if (needsTurnstile && !turnstileToken) return setError('Please complete the verification check');

    setSubmitting(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...line,
          email: form.email,
          fullName: form.fullName.trim(),
          password: form.password,
          consent: true,
          turnstileToken: turnstileToken ?? '',
        }),
      });
      const json: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        if (res.status === 409 && isRecord(json) && json.code === ACCOUNT_EXISTS) {
          setAccountExists(true);
          return;
        }
        throw new Error(getErrorMessage(json, 'Checkout failed. Please try again.'));
      }
      const data = getEnvelopeData(json);
      const redirectUrl = isRecord(data) && typeof data.redirectUrl === 'string' ? data.redirectUrl : '';
      if (!redirectUrl) throw new Error('Checkout failed. Please try again.');
      clearCart();
      // A leftover pay intent would divert onboarding to /dashboard/pay instead of the dashboard.
      clearPayIntent();
      window.location.assign(redirectUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed. Please try again.');
      // A Turnstile token is single-use: force a fresh challenge on retry.
      setTurnstileToken(null);
      setResetKey((k) => k + 1);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-[60vh] bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-lg space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <CheckoutPicker
            config={config}
            selection={selection}
            notice={state.notice}
            onEdition={chooseEdition}
            onCategory={chooseCategory}
          />
          <div className="flex items-center justify-between border-t border-slate-200 pt-4">
            <span className="text-sm font-semibold text-slate-700">
              {selection.edition.programName}: {quote.tierName}
            </span>
            <span className="text-lg font-bold text-primary">{formatAmount(quote)}</span>
          </div>
        </div>

        {accountExists ? (
          <Alert variant="warning">
            You already have an account.{' '}
            <Link href={buildLoginHref(line)} className="font-semibold underline">
              Log in to pay
            </Link>
          </Alert>
        ) : null}

        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <label htmlFor="co-name" className={LABEL_CLASS}>Full name</label>
            <EnglishTextInput
              id="co-name"
              name="fullName"
              restrictMode="name"
              value={form.fullName}
              onChange={onChange}
              required
              autoComplete="name"
              className={INPUT_CLASS}
              placeholder="As on your passport"
            />
          </div>
          <div>
            <label htmlFor="co-email" className={LABEL_CLASS}>Email</label>
            <input
              id="co-email"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              onBlur={emailHint.onBlur}
              required
              autoComplete="email"
              className={INPUT_CLASS}
              placeholder="you@example.com"
            />
            <EmailTypoHint hint={emailHint} />
          </div>
          <div>
            <label htmlFor="co-password" className={LABEL_CLASS}>Password</label>
            <input
              id="co-password"
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              onFocus={() => setPasswordTouched(true)}
              required
              autoComplete="new-password"
              className={INPUT_CLASS}
            />
            {passwordTouched ? <PasswordRequirements password={form.password} /> : null}
          </div>
          <div>
            <label htmlFor="co-confirm" className={LABEL_CLASS}>Confirm password</label>
            <input
              id="co-confirm"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={onChange}
              required
              autoComplete="new-password"
              className={INPUT_CLASS}
            />
            {form.confirmPassword && form.confirmPassword !== form.password ? (
              <p className="mt-1 text-xs text-destructive">Passwords do not match.</p>
            ) : null}
          </div>

          <label className="flex items-start gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/40"
            />
            <span>
              I agree to the{' '}
              <Link href="/terms" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline">
                Terms of Service
              </Link>
              ,{' '}
              <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline">
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link href="/refund-policy" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline">
                Refund Policy
              </Link>
              .
            </span>
          </label>

          {config.turnstileSiteKey ? (
            <TurnstileWidget key={resetKey} siteKey={config.turnstileSiteKey} onToken={setTurnstileToken} />
          ) : null}

          {error ? <Alert variant="error">{error}</Alert> : null}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
          >
            {submitting ? 'Creating your account...' : `Create account & pay ${formatAmount(quote)}`}
          </button>
          <p className="text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link href={buildLoginHref(line)} className="font-semibold text-primary hover:underline">
              Log in to pay
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
