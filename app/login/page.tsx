'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { componentsTheme } from '@/lib/theme/components';
import { useSettings } from '@/components/providers/SettingsProvider';
// import { useSettings } from '@/components/providers/SettingsProvider';
// import { getSettings } from '@/lib/api/settings';
import { signInWithPopup, signInWithRedirect, getRedirectResult, type User as FirebaseUser } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { normalizeEmailInput } from '@/lib/utils';
import { Alert } from '@/components/ui';
import { friendlyAuthError } from '@/lib/auth/friendlyAuthError';
import { trackLead } from '@/lib/analytics/metaPixel';

// Fallback images if API fails
const FALLBACK_IMAGES = [
  '/img/galeri2.png',
  '/img/programhighlight1.jpg',
  '/img/programoverview.png',
  '/img/galeri1.png',
  '/img/galeri3.png',
];

const DUPLICATE_EMAIL_MESSAGE = 'This email is already registered. Please sign in instead.';
const PASSWORD_MISMATCH_MESSAGE = 'Password and confirm password do not match';
const AGREE_REQUIRED_MESSAGE = 'You must agree to the Terms of Service and Privacy Policy';
// Client-thrown validation messages that are already participant-friendly and
// should be shown as-is, bypassing friendlyAuthError's generic fallback copy.
const KNOWN_FRIENDLY_REGISTER_MESSAGES = new Set([
  DUPLICATE_EMAIL_MESSAGE,
  PASSWORD_MISMATCH_MESSAGE,
  AGREE_REQUIRED_MESSAGE,
]);

type LegalDocumentType = 'terms' | 'privacy';

type LegalDocumentPayload = {
  title: string;
  slug: string;
  content: string;
  version?: string;
  publishedAt?: string | null;
};

export default function LoginPage() {
  const router = useRouter();
  const { settings } = useSettings();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<'login' | 'signup'>(() => {
    const requestedMode = searchParams.get('mode');
    return requestedMode === 'signup' ? 'signup' : 'login';
  });
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
  const [localErrorAction, setLocalErrorAction] = useState<'use-google' | undefined>(undefined);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [ambassadorMode, setAmbassadorMode] = useState(() => {
    return searchParams.get('role') === 'ambassador';
  });
  const [applicationCategory, setApplicationCategory] = useState(() => {
    return searchParams.get('applicationCategory') || '';
  });
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string>('');
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<LegalDocumentType | null>(null);
  const [legalLoading, setLegalLoading] = useState(false);
  const [legalError, setLegalError] = useState<string>('');
  const [legalDocs, setLegalDocs] = useState<Partial<Record<LegalDocumentType, LegalDocumentPayload>>>({});
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    referralCode: '',
  });
  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const onChangeLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const value = name === 'email' ? normalizeEmailInput(e.target.value) : e.target.value;
    setLoginForm(prev => ({ ...prev, [name]: value }));
    if (name === 'email') {
      setShowResendVerification(false);
      setResendMessage('');
    }
  };
  const onChangeSignup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const value = name === 'email' ? normalizeEmailInput(e.target.value) : e.target.value;
    setSignupForm(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const requestedMode = searchParams.get('mode');
    const requestedRole = searchParams.get('role');

    // Defer state updates to avoid synchronous setState in effect body
    const timer = setTimeout(() => {
      if (requestedRole === 'ambassador') {
        setAmbassadorMode(true);
        setMode('login');
        return;
      }

      if (requestedMode === 'signup') {
        setMode('signup');
        setAmbassadorMode(false);
        return;
      }

      if (requestedMode === 'login') {
        setMode('login');
        setAmbassadorMode(false);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [searchParams]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'login') {
      setLocalLoading(true);
      setLocalError('');
      setLocalErrorAction(undefined);
      setShowResendVerification(false);
      setResendMessage('');
      try {
        if (ambassadorMode) {
          const res = await fetch('/api/auth/ambassador-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: loginForm.email,
              referralCode: loginForm.referralCode,
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
          router.push(json?.data?.redirectTo || '/dashboard/ambassador');
          return;
        }

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
        const rawMessage = error instanceof Error ? error.message : 'Login failed';
        const friendly = friendlyAuthError(rawMessage);
        setLocalError(friendly.message);
        setLocalErrorAction(friendly.action);
        if (/email\s+not\s+verified/i.test(rawMessage)) {
          setShowResendVerification(true);
        }
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
        throw new Error(PASSWORD_MISMATCH_MESSAGE);
      }
      if (!agree) {
        throw new Error(AGREE_REQUIRED_MESSAGE);
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signupForm.email,
          password: signupForm.password,
          ...(applicationCategory ? { applicationCategory } : {}),
        }),
      });

      const json = (await res.json()) as {
        statusCode?: number;
        message?: string;
        data?: { needsEmailVerification?: boolean } | null;
      };

      if (!res.ok) {
        const backendMessage = json?.message || '';
        const isDuplicateEmail =
          res.status === 409 ||
          /already\s+(has|registered|exists)|authentication\s+configured|email\s+already/i.test(
            backendMessage,
          );

        if (isDuplicateEmail) {
          throw new Error(DUPLICATE_EMAIL_MESSAGE);
        }

        throw new Error(json?.message || `Register failed: ${res.status} ${res.statusText}`);
      }

      const needsEmailVerification = json?.data?.needsEmailVerification ?? true;
      trackLead({ content_name: 'account_signup' }, { email: signupForm.email });
      router.push(needsEmailVerification ? '/verify-email' : '/onboarding');
    } catch (error) {
      const rawMessage = error instanceof Error ? error.message : 'Register failed';
      setRegisterError(
        KNOWN_FRIENDLY_REGISTER_MESSAGES.has(rawMessage)
          ? rawMessage
          : friendlyAuthError(rawMessage).message,
      );
    } finally {
      setRegisterLoading(false);
    }
  };

  const onResendVerification = async () => {
    if (!loginForm.email.trim() || resendLoading) return;

    setResendLoading(true);
    setResendMessage('');
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: loginForm.email.trim() }),
      });

      const json = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) {
        throw new Error(json?.message || 'Failed to resend verification email');
      }

      setResendMessage('Verification email sent. Please check your inbox and spam folder.');
    } catch (error) {
      setResendMessage(error instanceof Error ? error.message : 'Failed to resend verification email');
    } finally {
      setResendLoading(false);
    }
  };

  const openLegalModal = async (type: LegalDocumentType) => {
    setLegalModalType(type);
    setLegalModalOpen(true);
    setLegalError('');

    if (legalDocs[type]) return;

    setLegalLoading(true);
    try {
      const res = await fetch(`/api/legal-documents?type=${encodeURIComponent(type)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const json = (await res.json().catch(() => ({}))) as {
        message?: string;
        data?: LegalDocumentPayload | null;
      };

      if (!res.ok || !json?.data) {
        throw new Error(
          json?.message || 'Unable to load legal document right now. Please try again shortly.',
        );
      }

      setLegalDocs(prev => ({
        ...prev,
        [type]: json.data as LegalDocumentPayload,
      }));
    } catch (error) {
      setLegalError(
        error instanceof Error
          ? error.message
          : 'Unable to load legal document right now. Please try again shortly.',
      );
    } finally {
      setLegalLoading(false);
    }
  };

  const closeLegalModal = () => {
    setLegalModalOpen(false);
  };

  // Everything that must run AFTER Firebase authentication succeeds. Shared by
  // both the popup flow (onOAuthLogin) and the redirect-fallback flow
  // (getRedirectResult on mount). Note: providerId is intentionally omitted —
  // the backend /v1/auth/firebase-login resolves the provider from the token.
  const handleFirebaseUser = async (fbUser: FirebaseUser) => {
    try {
      const idToken = await fbUser.getIdToken();
      const referralCode =
        searchParams?.get('referralCode') ?? searchParams?.get('t') ?? undefined;

      const res = await fetch('/api/auth/firebase-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken,
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
        trackLead(
          { content_name: 'account_signup_google' },
          fbUser.email ? { email: fbUser.email } : undefined,
        );
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
      const rawMessage = error instanceof Error ? error.message : 'Login failed';
      setOauthError(friendlyAuthError(rawMessage).message);
      setOauthLoading('');
    }
  };

  const onOAuthLogin = async (providerName: string) => {
    if (oauthLoading) return;

    if (providerName !== 'google') {
      setOauthError('Only Google login is available right now.');
      return;
    }

    setOauthLoading(providerName);
    setOauthError('');

    // CRITICAL: signInWithPopup must be the FIRST awaited call in this click
    // handler. Any network/await before it breaks the browser's user-activation
    // window, and on mobile Chrome the popup is then blocked and the user is
    // stranded on a blank firebaseapp.com auth page. Do not add awaits above it.
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handleFirebaseUser(result.user);
    } catch (error) {
      const code = error && typeof error === 'object' && 'code' in error ? String((error as { code: unknown }).code) : '';

      // User dismissed the popup — not an error, just reset loading state.
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        setOauthLoading('');
        return;
      }

      // Popup blocked (common on mobile) — fall back to full-page redirect.
      // Completion is handled by the getRedirectResult effect on next load.
      if (code === 'auth/popup-blocked') {
        try {
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (redirectError) {
          const rawMessage = redirectError instanceof Error ? redirectError.message : 'Login failed';
          setOauthError(friendlyAuthError(rawMessage).message);
          setOauthLoading('');
          return;
        }
      }

      const rawMessage = error instanceof Error ? error.message : 'Login failed';
      setOauthError(friendlyAuthError(rawMessage).message);
      setOauthLoading('');
    }
  };

  // Completes the signInWithRedirect fallback: when the browser returns from the
  // Firebase auth handler, this picks up the authenticated user and runs the
  // shared post-auth flow. No-op for the normal popup path (result is null).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await getRedirectResult(auth);
        if (!cancelled && result?.user) {
          setOauthLoading('google');
          await handleFirebaseUser(result.user);
        }
      } catch (error) {
        if (cancelled) return;
        const rawMessage = error instanceof Error ? error.message : 'Login failed';
        setOauthError(friendlyAuthError(rawMessage).message);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  useEffect(() => {
    async function fetchGalleryImages() {
      try {
        const res = await fetch('/api/home');
        if (!res.ok) return;
        const json = (await res.json()) as {
          data?: {
            sections?: Array<{
              type: string;
              content?: { gallery?: Array<{ url: string }>; images?: Array<{ url: string }> };
            }>;
          };
        };
        const gallerySection = json?.data?.sections?.find(s => s.type === 'program_gallery');
        const images = (gallerySection?.content?.gallery ?? gallerySection?.content?.images)
          ?.map(img => img.url)
          .filter(Boolean);
        if (images && images.length > 0) {
          setLoginImages(images);
          setImageIndex(0);
        }
      } catch {
        // keep fallback images
      }
    }
    fetchGalleryImages();
  }, []);

  useEffect(() => {
    if (loginImages.length <= 1) return;
    const id = setInterval(() => {
      setImageIndex(prev => (prev + 1) % loginImages.length);
    }, 7000);
    return () => clearInterval(id);
  }, [loginImages]);

  const loginImageSrc = loginImages[imageIndex] ?? loginImages[0];
  const activeLegalDoc = legalModalType ? legalDocs[legalModalType] : null;
  const legalModalTitle =
    activeLegalDoc?.title || (legalModalType === 'terms' ? 'Terms of Service' : 'Privacy Policy');
  const legalDocLooksLikeHtml =
    !!activeLegalDoc?.content && /<\/?[a-z][\s\S]*>/i.test(activeLegalDoc.content);

  return (
    <section className={`fixed inset-0 overflow-hidden ${componentsTheme.login.pageBackground}`}>
      <div className="grid h-full grid-cols-1 overflow-hidden md:grid-cols-[40%_60%]">
        {/* Panel Gambar (selalu di kiri, dalam card dengan background full) */}
        <div
          className="relative hidden md:flex items-center justify-center bg-slate-50 p-6 lg:p-10"
        >
          <div className="relative h-[calc(100vh-5rem)] w-full overflow-hidden rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
            {/* Mobile logo - visible only on small screens */}
            <div className="absolute left-6 top-6 z-10 md:hidden">
              <Link href="/" className="inline-block">
                <Image
                  src={settings?.brand?.logo_url?.trim() || settings?.active_program?.logo_url?.trim() || "/img/ybb-logo.png"}
                  alt={settings?.brand?.name?.trim() || "Youth Break the Boundaries"}
                  width={100}
                  height={34}
                  className="h-8 w-auto"
                  priority
                  unoptimized
                />
              </Link>
            </div>
            <Image
              src={loginImageSrc}
              alt="Japan Youth Summit Highlight"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 768px) 40vw, 0px"
            />
            <div className={componentsTheme.login.heroOverlay} />

            <div className={componentsTheme.login.heroTextContainer}>
              <div className={componentsTheme.login.heroLogoWrapper}>
                <Link href="/" className="inline-block">
                  <Image
                    src={settings?.brand?.logo_url?.trim() || settings?.active_program?.logo_url?.trim() || "/img/ybb-logo.png"}
                    alt={settings?.brand?.name?.trim() || "Youth Break the Boundaries"}
                    width={120}
                    height={40}
                    className={componentsTheme.login.heroLogo}
                    priority
                    unoptimized
                  />
                </Link>
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
              {settings?.active_program?.name && (
                <p className={componentsTheme.login.formProgramName}>
                  {settings.active_program.name}
                </p>
              )}
              <h1 className={componentsTheme.login.formHeading}>
                {ambassadorMode ? 'Ambassador Sign In' : mode === 'login' ? 'Welcome back!' : 'Create your account'}
              </h1>
            </div>
            <p className={componentsTheme.login.formSubheading}>
              {ambassadorMode
                ? 'Sign in with your ambassador credentials.'
                : mode === 'login'
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
                        {ambassadorMode ? 'Referral Code' : 'Password'}
                      </label>
                      <div className={componentsTheme.login.inputWrapper}>
                        <Lock className={componentsTheme.login.inputIcon} />
                        {ambassadorMode ? (
                          <input
                            name="referralCode"
                            value={loginForm.referralCode}
                            onChange={onChangeLogin}
                            type="text"
                            required
                            className={componentsTheme.login.input}
                            placeholder="Enter your referral code"
                            autoComplete="off"
                          />
                        ) : (
                          <>
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
                          </>
                        )}
                      </div>
                    </div>
                    {!ambassadorMode && (
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
                        <a href="/auth/forgot-password" className={componentsTheme.login.forgotPasswordLink}>
                          Forgot Password?
                        </a>
                      </div>
                    )}
                    {localError ? (
                      <div className="mt-3">
                        <Alert variant="error">{localError}</Alert>
                      </div>
                    ) : null}
                    {showResendVerification && loginForm.email.trim() ? (
                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={onResendVerification}
                          className="text-xs font-semibold text-primary underline underline-offset-2 disabled:opacity-60"
                          disabled={resendLoading}
                        >
                          {resendLoading ? 'Sending verification email...' : 'Resend verification email'}
                        </button>
                        {resendMessage ? (
                          <div className="mt-2">
                            <Alert variant={/sent/i.test(resendMessage) ? 'success' : 'error'}>
                              {resendMessage}
                            </Alert>
                          </div>
                        ) : null}
                      </div>
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

                    {!ambassadorMode && (
                      <>
                        <div className={componentsTheme.login.dividerRow}>
                          <span className={componentsTheme.login.dividerLine} aria-hidden="true" />
                          <span>OR</span>
                          <span className={componentsTheme.login.dividerLine} aria-hidden="true" />
                        </div>

                        <button
                          type="button"
                          className={`${componentsTheme.login.googleButton} ${
                            localErrorAction === 'use-google' ? 'ring-2 ring-primary ring-offset-2' : ''
                          }`}
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
                          <div className="mt-3">
                            <Alert variant="error">{oauthError}</Alert>
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>

                  <p className={componentsTheme.login.helperText}>
                    {!ambassadorMode && (
                      <>
                        New here?{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setMode('signup');
                            setAmbassadorMode(false);
                            const params = new URLSearchParams(searchParams.toString());
                            params.set('mode', 'signup');
                            router.push(`/login?${params.toString()}`, { scroll: false });
                          }}
                          className={componentsTheme.login.switchModeLink}
                        >
                          Create new account
                        </button>
                      </>
                    )}
                  </p>

                  <p className={componentsTheme.login.helperText}>
                    {ambassadorMode ? (
                      <>
                        Not an ambassador?{' '}
                        <button
                          type="button"
                          onClick={() => setAmbassadorMode(false)}
                          className={componentsTheme.login.switchModeLink}
                        >
                          Back to regular sign in
                        </button>
                      </>
                    ) : (
                      <>
                        Part of our program ambassadors?{' '}
                        <button
                          type="button"
                          onClick={() => setAmbassadorMode(true)}
                          className={componentsTheme.login.switchModeLink}
                        >
                          Sign in here
                        </button>
                      </>
                    )}
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
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                    <div className={componentsTheme.login.termsLabel}>
                      <input
                        type="checkbox"
                        className={componentsTheme.login.checkbox}
                        checked={agree}
                        onChange={e => setAgree(e.target.checked)}
                        required
                      />
                      <span>
                        I agree to the{' '}
                        <button
                          type="button"
                          onClick={() => openLegalModal('terms')}
                          className={componentsTheme.login.termsLink}
                        >
                          Terms of Service
                        </button>
                        {' '}and{' '}
                        <button
                          type="button"
                          onClick={() => openLegalModal('privacy')}
                          className={componentsTheme.login.termsLink}
                        >
                          Privacy Policy
                        </button>
                      </span>
                    </div>
                    {registerError ? <Alert variant="error">{registerError}</Alert> : null}
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
                      onClick={() => {
                        setMode('login');
                        const params = new URLSearchParams(searchParams.toString());
                        params.set('mode', 'login');
                        router.push(`/login?${params.toString()}`, { scroll: false });
                      }}
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

      {legalModalOpen && (
        <div
          className="fixed inset-0 z-[140] flex items-center justify-center bg-slate-950/60 p-4"
          onClick={closeLegalModal}
        >
          <div
            className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{legalModalTitle}</h2>
              </div>
              <button
                type="button"
                onClick={closeLegalModal}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-5 py-4">
              {legalLoading && !activeLegalDoc ? (
                <p className="text-sm text-slate-600">Loading document...</p>
              ) : null}

              {!legalLoading && legalError ? <Alert variant="error">{legalError}</Alert> : null}

              {!legalLoading && !legalError && activeLegalDoc?.content ? (
                legalDocLooksLikeHtml ? (
                  <div
                    className="prose prose-slate max-w-none text-sm"
                    dangerouslySetInnerHTML={{ __html: activeLegalDoc.content }}
                  />
                ) : (
                  <div className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {activeLegalDoc.content}
                  </div>
                )
              ) : null}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
