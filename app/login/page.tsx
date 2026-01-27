'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { jysSectionTheme } from '@/lib/theme/jys-components';
import { getSettings } from '@/lib/api/settings';
import type { SettingsData, SettingsFooterNavSection } from '@/types/settings';

const LOGIN_IMAGES = [
  '/img/galeri2.png',
  '/img/programhighlight1.jpg',
  '/img/programoverview.png',
  '/img/jysprogram1.jpg',
  '/img/galeri3.png',
  '/img/benefits.png',
];

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [agree, setAgree] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  const [signupForm, setSignupForm] = useState({
    fullname: '',
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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      console.log('Login submit:', { ...loginForm, keepSignedIn });
    } else {
      console.log('Signup submit:', { ...signupForm, agree });
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
          <div className="relative h-[680px] w-full max-w-xl overflow-hidden rounded-3xl shadow-[0_18px_45px_rgba(15,23,42,0.35)] ring-1 ring-pink-300/80">
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
                    <div className="pt-2 space-y-3">
                      <button type="submit" className={jysSectionTheme.login.primaryButton}>
                        Login
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
                  </div>

                  <div className={jysSectionTheme.login.socialSection}>
                    <div className={jysSectionTheme.login.socialGrid}>
                      <button
                        type="button"
                        className={jysSectionTheme.login.googleButton}
                        onClick={() => {
                          console.log('Google login');
                        }}
                      >
                        <Image
                          src="/img/signwithgoogle.png"
                          alt="Sign in with Google"
                          width={20}
                          height={20}
                          className={jysSectionTheme.login.googleButtonIcon}
                        />
                        Login with Google
                      </button>

                      <button
                        type="button"
                        className={jysSectionTheme.login.facebookButton}
                        onClick={() => {
                          console.log('Facebook login');
                        }}
                      >
                        <Image
                          src="/img/signwithfacebook.png"
                          alt="Continue with Facebook"
                          width={20}
                          height={20}
                          className={jysSectionTheme.login.facebookButtonIcon}
                        />
                        Login with Facebook
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
                        Fullname
                      </label>
                      <input
                        name="fullname"
                        value={signupForm.fullname}
                        onChange={onChangeSignup}
                        type="text"
                        required
                        className={jysSectionTheme.login.input}
                        placeholder="Hilmi Farrel Firjatullah"
                      />
                    </div>
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
                    <div className="pt-2 space-y-3">
                      <button type="submit" className={jysSectionTheme.login.primaryButton}>
                        Create Account
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
                        className={jysSectionTheme.login.googleButton}
                        onClick={() => {
                          console.log('Google signup');
                        }}
                      >
                        <Image
                          src="/img/signwithgoogle.png"
                          alt="Sign in with Google"
                          width={20}
                          height={20}
                          className={jysSectionTheme.login.googleButtonIcon}
                        />
                        Sign up with Google
                      </button>

                      <button
                        type="button"
                        className={jysSectionTheme.login.facebookButton}
                        onClick={() => {
                          console.log('Facebook signup');
                        }}
                      >
                        <Image
                          src="/img/signwithfacebook.png"
                          alt="Continue with Facebook"
                          width={20}
                          height={20}
                          className={jysSectionTheme.login.facebookButtonIcon}
                        />
                        Sign up with Facebook
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

