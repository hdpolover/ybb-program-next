'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { componentsTheme } from '@/lib/theme/components';
import { useSettings } from '@/components/providers/SettingsProvider';
// import { useSettings } from '@/components/providers/SettingsProvider';
// import { getSettings } from '@/lib/api/settings';
import type { SettingsData, SettingsFooterNavSection } from '@/types/settings';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

// Fallback images if API fails
const FALLBACK_IMAGES = [
  '/img/galeri2.png',
  '/img/programhighlight1.jpg',
  '/img/programoverview.png',
  '/img/jysprogram1.jpg',
  '/img/galeri3.png',
];

export default function LoginPage() {
  const router = useRouter();
  const { settings } = useSettings();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [agree, setAgree] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [loginImages, setLoginImages] = useState<string[]>(FALLBACK_IMAGES);
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
    if (loginImages.length <= 1) return;
    const id = setInterval(() => {
      setImageIndex(prev => (prev + 1) % loginImages.length);
    }, 7000);
    return () => clearInterval(id);
  }, [loginImages]);

  const loginImageSrc = loginImages[imageIndex] ?? loginImages[0];

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
    <section className={`min-h-screen w-full ${componentsTheme.login.pageBackground}`}>
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[40%_60%]">
        {/* Panel Gambar (selalu di kiri, dalam card dengan background full) */}
        <div
          className="relative hidden lg:flex items-center justify-center bg-slate-50 p-10"
        >
          <div className="relative h-[calc(100vh-5rem)] w-full overflow-hidden rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
            <Image
              src={loginImageSrc}
              alt="Japan Youth Summit Highlight"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 45vw, 0px"
            />
            <div className={componentsTheme.login.heroOverlay} />

            <div className={componentsTheme.login.heroTextContainer}>
              <div className={componentsTheme.login.heroLogoWrapper}>
                <a href="/" className="inline-block">
                  <Image
                    src={settings?.brand?.logo_url?.trim() || "/img/jysfooters.png"}
                    alt={settings?.brand?.name?.trim() || "Japan Youth Summit"}
                    width={120}
                    height={40}
                    className={componentsTheme.login.heroLogo}
                    priority
                    unoptimized
                  />
                </a>
                <div className="space-y-2 mt-4">
                  <h2 className={componentsTheme.login.heroTitle}>
                    Raise Your Hand,
                    <br />
                    Be the Future Leaders
                  </h2>
                </div>
              </div>
            </div>

            {/* Slide indicator (non-interactive) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
              <div className={componentsTheme.login.slideIndicatorWrapper}>
                {loginImages.map((_, i) => (
                  <span
                    key={i}
                    aria-hidden="true"
                    className={
                      i === imageIndex
                        ? componentsTheme.login.slideDotActive
                        : componentsTheme.login.slideDotInactive
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Panel Form (selalu di kanan) */}
        <div className={componentsTheme.login.formPanelOuter}>
          <div className={componentsTheme.login.formPanelInner}>
            <div>
              <h1 className={componentsTheme.login.formHeading}>
                {mode === 'login' ? 'Welcome back!' : 'Create your account'}
              </h1>
            </div>
            <p className={componentsTheme.login.formSubheading}>
              {mode === 'login'
                ? 'Sign in to continue.'
                : 'Fill in your details below to start your journey.'}
            </p>

            <form onSubmit={onSubmit} className="space-y-4">
              {mode === 'login' ? (
                <>
                  <div className={componentsTheme.login.card}>
                    <div>
                      <label className={componentsTheme.login.fieldLabel}>
                        Email
                      </label>
                      <div className={componentsTheme.login.inputWrapper}>
                        <Mail className={componentsTheme.login.inputIcon} />
                        <input
                          name="email"
                          value={loginForm.email}
                          onChange={onChangeLogin}
                          type="email"
                          required
                          className={componentsTheme.login.input}
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className={componentsTheme.login.fieldLabel}>
                        Password
                      </label>
                      <div className={componentsTheme.login.inputWrapper}>
                        <Lock className={componentsTheme.login.inputIcon} />
                        <input
                          name="password"
                          value={loginForm.password}
                          onChange={onChangeLogin}
                          type={showPassword ? "text" : "password"}
                          required
                          className={`${componentsTheme.login.input} ${componentsTheme.login.inputPassword}`}
                          placeholder="••••••••"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)} 
                          className={componentsTheme.login.inputEyeBtn}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    <div className={componentsTheme.login.checkboxRow}>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          className={componentsTheme.login.checkbox}
                          checked={keepSignedIn}
                          onChange={e => setKeepSignedIn(e.target.checked)}
                        />
                        Keep me signed in
                      </label>
                      <a href="#" className={componentsTheme.login.forgotPasswordLink}>
                        Forgot Password?
                      </a>
                    </div>
                    {localError ? (
                      <p className="mt-3 text-xs font-medium text-primary">{localError}</p>
                    ) : null}
                    <div className="pt-2">
                      <button
                        type="submit"
                        className={componentsTheme.login.primaryButton}
                        disabled={localLoading}
                      >
                        {localLoading ? 'Signing in...' : 'Login'}
                      </button>
                    </div>

                    <div className={componentsTheme.login.dividerRow}>
                      <span className={componentsTheme.login.dividerLine} aria-hidden="true" />
                      <span>OR</span>
                      <span className={componentsTheme.login.dividerLine} aria-hidden="true" />
                    </div>

                    <button
                      type="button"
                      className={componentsTheme.login.googleButton}
                      onClick={() => onOAuthLogin('google')}
                      disabled={oauthLoading.length > 0}
                    >
                      <Image
                        src="/img/signwithgoogle.png"
                        alt="Sign in with Google"
                        width={20}
                        height={20}
                        className={componentsTheme.login.googleButtonIcon}
                      />
                      {oauthLoading === 'google' ? 'Signing in...' : 'Continue with Google'}
                    </button>

                    {oauthError ? (
                      <p className="mt-3 text-xs font-medium text-primary">{oauthError}</p>
                    ) : null}
                  </div>

                  <p className={componentsTheme.login.helperText}>
                    New here?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      className={componentsTheme.login.switchModeLink}
                    >
                      Create new account
                    </button>
                  </p>

                  <p className={componentsTheme.login.helperText}>
                    Part of our program ambassadors?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className={componentsTheme.login.switchModeLink}
                    >
                      Sign in here
                    </button>
                  </p>
                </>
              ) : (
                <>
                  <div className={componentsTheme.login.card}>
                    <div>
                      <label className={componentsTheme.login.fieldLabel}>
                        Email
                      </label>
                      <div className={componentsTheme.login.inputWrapper}>
                        <Mail className={componentsTheme.login.inputIcon} />
                        <input
                          name="email"
                          value={signupForm.email}
                          onChange={onChangeSignup}
                          type="email"
                          required
                          className={componentsTheme.login.input}
                          placeholder="hilmi123@example.com"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className={componentsTheme.login.fieldLabel}>
                          Password
                        </label>
                        <div className={componentsTheme.login.inputWrapper}>
                          <Lock className={componentsTheme.login.inputIcon} />
                          <input
                            name="password"
                            value={signupForm.password}
                            onChange={onChangeSignup}
                            type={showSignupPassword ? "text" : "password"}
                            required
                            className={`${componentsTheme.login.input} ${componentsTheme.login.inputPassword}`}
                            placeholder="••••••••"
                            minLength={6}
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowSignupPassword(!showSignupPassword)} 
                            className={componentsTheme.login.inputEyeBtn}
                          >
                            {showSignupPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className={componentsTheme.login.fieldLabel}>
                          Confirm Password
                        </label>
                        <div className={componentsTheme.login.inputWrapper}>
                          <Lock className={componentsTheme.login.inputIcon} />
                          <input
                            name="confirmPassword"
                            value={signupForm.confirmPassword}
                            onChange={onChangeSignup}
                            type={showSignupConfirm ? "text" : "password"}
                            required
                            className={`${componentsTheme.login.input} ${componentsTheme.login.inputPassword}`}
                            placeholder="••••••••"
                            minLength={6}
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowSignupConfirm(!showSignupConfirm)} 
                            className={componentsTheme.login.inputEyeBtn}
                          >
                            {showSignupConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <label className={componentsTheme.login.termsLabel}>
                      <input
                        type="checkbox"
                        className={componentsTheme.login.checkbox}
                        checked={agree}
                        onChange={e => setAgree(e.target.checked)}
                        required
                      />
                      I agree to the{' '}
                      <a href={termsHref} className={componentsTheme.login.termsLink}>
                        Terms of Service
                      </a>
                      and{' '}
                      <a href={privacyHref} className={componentsTheme.login.termsLink}>
                        Privacy Policy
                      </a>
                    </label>
                    {registerError ? (
                      <p className="text-sm text-red-200">{registerError}</p>
                    ) : null}
                    <div className="pt-2">
                      <button type="submit" className={componentsTheme.login.primaryButton} disabled={registerLoading}>
                        {registerLoading ? 'Creating account...' : 'Create Account'}
                      </button>
                    </div>

                    <div className={componentsTheme.login.dividerRow}>
                      <span className={componentsTheme.login.dividerLine} aria-hidden="true" />
                      <span>OR</span>
                      <span className={componentsTheme.login.dividerLine} aria-hidden="true" />
                    </div>

                    <button
                      type="button"
                      className={componentsTheme.login.googleButton}
                      onClick={() => onOAuthLogin('google')}
                      disabled={oauthLoading.length > 0}
                    >
                      <Image
                        src="/img/signwithgoogle.png"
                        alt="Sign in with Google"
                        width={20}
                        height={20}
                        className={componentsTheme.login.googleButtonIcon}
                      />
                      {oauthLoading === 'google' ? 'Signing in...' : 'Continue with Google'}
                    </button>
                  </div>

                  <p className={componentsTheme.login.helperText}>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className={componentsTheme.login.switchModeLink}
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

