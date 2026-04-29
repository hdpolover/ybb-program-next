'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { componentsTheme } from '@/lib/theme/components';
import { useSettings } from '@/components/providers/SettingsProvider';
// import { useSettings } from '@/components/providers/SettingsProvider';
// import { getSettings } from '@/lib/api/settings';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

// Fallback images if API fails
const FALLBACK_IMAGES = [
  '/img/galeri2.png',
  '/img/programhighlight1.jpg',
  '/img/programoverview.png',
  '/img/galeri1.png',
  '/img/galeri3.png',
];

const DUPLICATE_EMAIL_MESSAGE = 'This email is already registered. Please sign in instead.';

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
  const [ambassadorMode, setAmbassadorMode] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string>('');
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<LegalDocumentType | null>(null);
  const [legalLoading, setLegalLoading] = useState(false);
  const [legalError, setLegalError] = useState<string>('');
  const [legalDocs, setLegalDocs] = useState<Partial<Record<LegalDocumentType, LegalDocumentPayload>>>({});
  const [oauthProviderIds, setOauthProviderIds] = useState<Record<string, string>>({});
  const [authProviders, setAuthProviders] = useState<
    Array<{ id: string; name: string; displayName: string; isOAuth: boolean; buttonColor?: string }>
  >([]);
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
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };
  const onChangeSignup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupForm(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const requestedMode = searchParams.get('mode');
    const requestedRole = searchParams.get('role');

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
  }, [searchParams]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'login') {
      setLocalLoading(true);
      setLocalError('');
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
      router.push(needsEmailVerification ? '/verify-email' : '/onboarding');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Register failed';
      setRegisterError(message);
    } finally {
      setRegisterLoading(false);
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

      const referralCode =
        searchParams?.get('referralCode') ?? searchParams?.get('t') ?? undefined;
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
              <a href="/" className="inline-block">
                <Image
                  src={settings?.brand?.logo_url?.trim() || settings?.active_program?.logo_url?.trim() || "/img/ybb-logo.png"}
                  alt={settings?.brand?.name?.trim() || "Youth Break the Boundaries"}
                  width={100}
                  height={34}
                  className="h-8 w-auto"
                  priority
                  unoptimized
                />
              </a>
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
                <a href="/" className="inline-block">
                  <Image
                    src={settings?.brand?.logo_url?.trim() || settings?.active_program?.logo_url?.trim() || "/img/ybb-logo.png"}
                    alt={settings?.brand?.name?.trim() || "Youth Break the Boundaries"}
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

                    {!ambassadorMode && (
                      <>
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
                      </>
                    )}
                  </div>

                  <p className={componentsTheme.login.helperText}>
                    {!ambassadorMode && (
                      <>
                        New here?{' '}
                        <button
                          type="button"
                          onClick={() => { setMode('signup'); setAmbassadorMode(false); }}
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

              {!legalLoading && legalError ? (
                <p className="text-sm font-medium text-primary">{legalError}</p>
              ) : null}

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
