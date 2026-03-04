'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { jysSectionTheme } from '@/lib/theme/jys-components';
import { getSettings } from '@/lib/api/settings';
import type { SettingsData, SettingsFooterNavSection } from '@/types/settings';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

const LOGIN_IMAGES = [
  '/img/galeri2.png',
  '/img/programhighlight1.jpg',
  '/img/programoverview.png',
  '/img/jysprogram1.jpg',
  '/img/galeri3.png',
  '/img/benefits.png',
];

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [agree, setAgree] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [oauthLoading, setOauthLoading] = useState<string>('');
  const [oauthError, setOauthError] = useState<string>('');
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string>('');
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string>('');
  const [oauthProviderIds, setOauthProviderIds] = useState<Record<string, string>>({});
  const [authProviders, setAuthProviders] = useState<
    Array<{ id: string; name: string; displayName: string; isOAuth: boolean; buttonColor?: string }>
  >([]);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const onChangeLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };
  const onChangeSignup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupForm(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'login') {
      setLocalLoading(true);
      setLocalError('');
      try {
        const res = await fetch('/api/auth/local-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: loginForm.email,
            password: loginForm.password,
          }),
        });

        const json = (await res.json()) as {
          statusCode?: number;
          message?: string;
          data?: { redirectTo?: string } | null;
        };

        if (!res.ok) {
          throw new Error(json?.message || `Login failed: ${res.status} ${res.statusText}`);
        }

        router.push(json?.data?.redirectTo || '/onboarding');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Login failed';
        setLocalError(message);
      } finally {
        setLocalLoading(false);
      }

      return;
    }

    // signup
    setRegisterLoading(true);
    setRegisterError('');
    try {
      if (signupForm.password !== signupForm.confirmPassword) {
        throw new Error('Password and confirm password do not match');
      }
      if (!agree) {
        throw new Error('You must agree to the Terms of Service and Privacy Policy');
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signupForm.email,
          password: signupForm.password,
        }),
      });

      const json = (await res.json()) as {
        statusCode?: number;
        message?: string;
        data?: { needsEmailVerification?: boolean } | null;
      };

      if (!res.ok) {
        throw new Error(json?.message || `Register failed: ${res.status} ${res.statusText}`);
      }

      router.push('/verify-email');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Register failed';
      setRegisterError(message);
    } finally {
      setRegisterLoading(false);
    }
  };

  const onOAuthLogin = async (providerName: string) => {
    if (oauthLoading) return;
    setOauthLoading(providerName);
    setOauthError('');

    try {
      if (providerName !== 'google') {
        throw new Error('Only Google login is available right now.');
      }

      let providerId = oauthProviderIds[providerName] || '';
      if (!providerId) {
        try {
          const ctxRes = await fetch('/api/auth/context', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const ctxJson = (await ctxRes.json().catch(() => ({}))) as any;
          const providers = ctxJson?.data?.providers;
          if (Array.isArray(providers)) {
            const google = providers.find((p: any) => p?.isOAuth && p?.name === 'google');
            if (google?.id) providerId = String(google.id);
          }
        } catch {
          // ignore
        }
      }

      const firebaseProvider = googleProvider;

      const referralCode = searchParams?.get('referralCode') ?? undefined;
      const result = await signInWithPopup(auth, firebaseProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const res = await fetch('/api/auth/firebase-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken,
          ...(providerId ? { providerId } : {}),
          ...(referralCode ? { referralCode } : {}),
        }),
      });

      const json = (await res.json()) as {
        statusCode?: number;
        message?: string;
        data?: { isNewUser?: boolean; isOnboardingCompleted?: boolean } | null;
      };
      if (!res.ok) {
        throw new Error(json?.message || `Login failed: ${res.status} ${res.statusText}`);
      }

      if (typeof json?.data?.isOnboardingCompleted === 'boolean') {
        router.push(json.data.isOnboardingCompleted ? '/dashboard' : '/onboarding');
        return;
      }

      if (json?.data?.isNewUser) {
        router.push('/onboarding');
        return;
      }

      try {
        const profileRes = await fetch('/api/participants/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });

        if (profileRes.ok) {
          const profileJson = (await profileRes.json().catch(() => ({}))) as {
            statusCode?: number;
            message?: string;
            data?: { id?: string } | null;
          };
          router.push(profileJson?.data?.id ? '/dashboard' : '/onboarding');
        } else {
          // Avoid looping users back to onboarding if profile endpoint is temporarily failing.
          router.push('/dashboard');
        }
      } catch {
        router.push('/dashboard');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      setOauthError(message);
    } finally {
      setOauthLoading('');
    }
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await getSettings();
        if (!cancelled) {
          setSettings(data);
        }
      } catch {
        // kalau API-nya error, link legal bakal fallback ke '#'
      }
    })();

    (async () => {
      try {
        const res = await fetch('/api/auth/providers', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const json = (await res.json()) as {
          statusCode: number;
          message: string;
          data: Array<{ id: string; name: string; displayName: string; isOAuth: boolean; buttonColor?: string }>;
        };

        if (!cancelled && res.ok && json.statusCode === 200 && Array.isArray(json.data)) {
          setAuthProviders(json.data);
          const ids: Record<string, string> = {};
          json.data.forEach(p => {
            if (p.isOAuth && p.id && p.name) ids[p.name] = p.id;
          });
          setOauthProviderIds(ids);
        }
      } catch {
        // ignore, will show error on click
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (LOGIN_IMAGES.length <= 1) return;
    const id = setInterval(() => {
      setImageIndex(prev => (prev + 1) % LOGIN_IMAGES.length);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  const loginImageSrc = LOGIN_IMAGES[imageIndex] ?? LOGIN_IMAGES[0];

  const footerNav: SettingsFooterNavSection[] | null = settings?.footer_navigation ?? null;
  const legalSection = (footerNav ?? []).find(section => section.title.toLowerCase() === 'legal');
  const legalLinks: { label: string; href: string }[] = (legalSection?.links ?? []).map(link => ({
    label: link.label,
    href: link.url,
  }));

  const findLegalHref = (kind: 'terms' | 'privacy'): string => {
    const needle = kind === 'terms' ? 'terms' : 'privacy';
    const found = legalLinks.find(l => l.label.toLowerCase().includes(needle));
    return found?.href || '#';
  };

  const termsHref = findLegalHref('terms');
  const privacyHref = findLegalHref('privacy');

  return (
    <section className={`min-h-screen w-full ${jysSectionTheme.login.pageBackground}`}>
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Panel Gambar (selalu di kiri, dalam card dengan background full) */}
        <div
          className={`relative hidden items-center justify-center ${jysSectionTheme.login.imagePanelBackground} lg:flex`}
        >
          <div className="relative h-[680px] w-full max-w-xl overflow-hidden rounded-3xl shadow-[0_18px_45px_rgba(15,23,42,0.35)] ring-1 ring-primary/40/80">
            <Image
              src={loginImageSrc}
              alt="Japan Youth Summit Highlight"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 32rem, 0px"
            />
            <div className={jysSectionTheme.login.heroOverlay} />

            <div className={jysSectionTheme.login.heroTextContainer}>
              <div className={jysSectionTheme.login.heroLogoWrapper}>
                <Image
                  src="/img/jysfooters.png"
                  alt="Japan Youth Summit"
                  width={120}
                  height={40}
                  className={jysSectionTheme.login.heroLogo}
                />
                <div className="space-y-3">
                  <p className={jysSectionTheme.login.heroEyebrow}>
                    Japan Youth Summit 2026
                  </p>
                  <h2 className={jysSectionTheme.login.heroTitle}>
                    Raise your hand,
                    <br />
                    Be the future leaders.
                  </h2>
                  <p className={jysSectionTheme.login.heroDescription}>
                    Join our global youth community and access your dashboard to manage your
                    application and participation.
                  </p>
                </div>
              </div>
            </div>

            {/* Slide indicator (non-interactive) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <div className={jysSectionTheme.login.slideIndicatorWrapper}>
                {LOGIN_IMAGES.map((_, i) => (
                  <span
                    key={i}
                    aria-hidden="true"
                    className={
                      i === imageIndex
                        ? jysSectionTheme.login.slideDotActive
                        : jysSectionTheme.login.slideDotInactive
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Panel Form (selalu di kanan) */}
        <div className={jysSectionTheme.login.formPanelOuter}>
          <div className={jysSectionTheme.login.formPanelInner}>
            <div>
              <h1 className={jysSectionTheme.login.formHeading}>
                {mode === 'login' ? 'Welcome back!' : 'Create your account'}
              </h1>
            </div>
            <p className={jysSectionTheme.login.formSubheading}>
              {mode === 'login'
                ? 'Sign in to continue and manage your application.'
                : 'Fill in your details below to start your journey.'}
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              {mode === 'login' ? (
                <>
                  <div className={jysSectionTheme.login.card}>
                    <div>
                      <label className={jysSectionTheme.login.fieldLabel}>
                        Email
                      </label>
                      <input
                        name="email"
                        value={loginForm.email}
                        onChange={onChangeLogin}
                        type="email"
                        required
                        className={jysSectionTheme.login.input}
                        placeholder="you@example.com"
                      />
                    </div>
                    <div>
                      <label className={jysSectionTheme.login.fieldLabel}>
                        Password
                      </label>
                      <input
                        name="password"
                        value={loginForm.password}
                        onChange={onChangeLogin}
                        type="password"
                        required
                        className={jysSectionTheme.login.input}
                        placeholder="••••••••"
                      />
                    </div>
                    <div className={jysSectionTheme.login.checkboxRow}>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          className={jysSectionTheme.login.checkbox}
                          checked={keepSignedIn}
                          onChange={e => setKeepSignedIn(e.target.checked)}
                        />
                        Keep me signed in
                      </label>
                      <a href="#" className={jysSectionTheme.login.forgotPasswordLink}>
                        Forgot Password?
                      </a>
                    </div>
                    {localError ? (
                      <p className="mt-3 text-xs font-medium text-primary">{localError}</p>
                    ) : null}
                    <div className="pt-2 space-y-3">
                      <button
                        type="submit"
                        className={jysSectionTheme.login.primaryButton}
                        disabled={localLoading}
                      >
                        {localLoading ? 'Signing in...' : 'Login'}
                      </button>

                      <div className={jysSectionTheme.login.dividerRow}>
                        <span className={jysSectionTheme.login.dividerLine} aria-hidden="true" />
                        <span>OR</span>
                        <span className={jysSectionTheme.login.dividerLine} aria-hidden="true" />
                      </div>

                      <button
                        type="button"
                        onClick={() => setMode('signup')}
                        className={jysSectionTheme.login.secondaryButton}
                      >
                        Sign up for free
                      </button>
                    </div>
                    {oauthError ? (
                      <p className="mt-3 text-xs font-medium text-primary">{oauthError}</p>
                    ) : null}
                  </div>

                  <div className={jysSectionTheme.login.socialSection}>
                    <div className={jysSectionTheme.login.socialGrid}>
                      <button
                        type="button"
                        className={`${jysSectionTheme.login.googleButton} sm:col-span-2`}
                        onClick={() => onOAuthLogin('google')}
                        disabled={oauthLoading.length > 0}
                      >
                        <Image
                          src="/img/signwithgoogle.png"
                          alt="Sign in with Google"
                          width={20}
                          height={20}
                          className={jysSectionTheme.login.googleButtonIcon}
                        />
                        {oauthLoading === 'google' ? 'Signing in...' : 'Login with Google'}
                      </button>
                    </div>
                  </div>

                  <p className={jysSectionTheme.login.helperText}>
                    Part of our program ambassadors?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className={jysSectionTheme.login.switchModeLink}
                    >
                      Sign in here
                    </button>
                  </p>
                </>
              ) : (
                <>
                  <div className={jysSectionTheme.login.card}>
                    <div>
                      <label className={jysSectionTheme.login.fieldLabel}>
                        Email
                      </label>
                      <input
                        name="email"
                        value={signupForm.email}
                        onChange={onChangeSignup}
                        type="email"
                        required
                        className={jysSectionTheme.login.input}
                        placeholder="hilmi123@example.com"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className={jysSectionTheme.login.fieldLabel}>
                          Password
                        </label>
                        <input
                          name="password"
                          value={signupForm.password}
                          onChange={onChangeSignup}
                          type="password"
                          required
                          className={jysSectionTheme.login.input}
                          placeholder="••••••••"
                        />
                      </div>
                      <div>
                        <label className={jysSectionTheme.login.fieldLabel}>
                          Confirm Password
                        </label>
                        <input
                          name="confirmPassword"
                          value={signupForm.confirmPassword}
                          onChange={onChangeSignup}
                          type="password"
                          required
                          className={jysSectionTheme.login.input}
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                    <label className={jysSectionTheme.login.termsLabel}>
                      <input
                        type="checkbox"
                        className={jysSectionTheme.login.checkbox}
                        checked={agree}
                        onChange={e => setAgree(e.target.checked)}
                        required
                      />
                      I agree to the{' '}
                      <a href={termsHref} className={jysSectionTheme.login.termsLink}>
                        Terms of Service
                      </a>
                      and{' '}
                      <a href={privacyHref} className={jysSectionTheme.login.termsLink}>
                        Privacy Policy
                      </a>
                    </label>
                    {registerError ? (
                      <p className="text-sm text-red-200">{registerError}</p>
                    ) : null}
                    <div className="pt-2 space-y-3">
                      <button type="submit" className={jysSectionTheme.login.primaryButton} disabled={registerLoading}>
                        {registerLoading ? 'Creating account...' : 'Create Account'}
                      </button>

                      <div className={jysSectionTheme.login.dividerRow}>
                        <span className={jysSectionTheme.login.dividerLine} aria-hidden="true" />
                        <span>OR</span>
                        <span className={jysSectionTheme.login.dividerLine} aria-hidden="true" />
                      </div>

                      <button
                        type="button"
                        onClick={() => setMode('login')}
                        className={jysSectionTheme.login.secondaryButton}
                      >
                        Back to Login
                      </button>
                    </div>
                  </div>

                  <div className={jysSectionTheme.login.socialSection}>
                    <div className={jysSectionTheme.login.socialGrid}>
                      <button
                        type="button"
                        className={`${jysSectionTheme.login.googleButton} sm:col-span-2`}
                        onClick={() => onOAuthLogin('google')}
                        disabled={oauthLoading.length > 0}
                      >
                        <Image
                          src="/img/signwithgoogle.png"
                          alt="Sign in with Google"
                          width={20}
                          height={20}
                          className={jysSectionTheme.login.googleButtonIcon}
                        />
                        {oauthLoading === 'google' ? 'Signing in...' : 'Sign up with Google'}
                      </button>
                    </div>
                  </div>

                  <p className={jysSectionTheme.login.helperText}>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className={jysSectionTheme.login.switchModeLink}
                    >
                      Sign in here
                    </button>
                  </p>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

