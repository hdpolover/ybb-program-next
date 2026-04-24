'use client';

import Image from 'next/image';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { componentsTheme } from '@/lib/theme/components';
import { useSettings } from '@/components/providers/SettingsProvider';

type ResetState = 'idle' | 'success' | 'error';

const PASSWORD_REQUIREMENTS = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).{8,}$/;

const FALLBACK_IMAGES = [
  '/img/galeri2.png',
  '/img/programhighlight1.jpg',
  '/img/programoverview.png',
  '/img/galeri1.png',
  '/img/galeri3.png',
];

export default function ResetPasswordPage() {
  const router = useRouter();
  const { settings } = useSettings();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<ResetState>('idle');
  const [message, setMessage] = useState('');
  const [imageIndex, setImageIndex] = useState(0);
  const [loginImages, setLoginImages] = useState<string[]>(FALLBACK_IMAGES);

  const isPasswordValid = useMemo(() => PASSWORD_REQUIREMENTS.test(password), [password]);
  const isConfirmValid = useMemo(
    () => confirmPassword.length > 0 && password === confirmPassword,
    [confirmPassword, password],
  );

  useEffect(() => {
    async function fetchGalleryImages() {
      try {
        const res = await fetch('/api/home');
        if (!res.ok) return;

        const json = (await res.json()) as {
          data?: {
            sections?: Array<{
              type: string;
              content?: { images?: Array<{ url: string }> };
            }>;
          };
        };

        const gallerySection = json?.data?.sections?.find(section => section.type === 'program_gallery');
        const images = gallerySection?.content?.images?.map(img => img.url).filter(Boolean);

        if (images && images.length > 0) {
          setLoginImages(images);
          setImageIndex(0);
        }
      } catch {
        // Keep fallback images when home API is unavailable.
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

  const heroImageSrc = loginImages[imageIndex] ?? loginImages[0];

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      setState('error');
      setMessage('Invalid reset link. Please request a new password reset email.');
      return;
    }

    if (!isPasswordValid) {
      setState('error');
      setMessage('Password must be at least 8 characters and contain uppercase, lowercase, and number/special character.');
      return;
    }

    if (!isConfirmValid) {
      setState('error');
      setMessage('Password confirmation does not match.');
      return;
    }

    setLoading(true);
    setState('idle');
    setMessage('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const json = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) {
        throw new Error(json?.message || 'Failed to reset password');
      }

      setState('success');
      setMessage('Password reset successful. Redirecting to login...');

      window.setTimeout(() => {
        router.push('/login');
      }, 2500);
    } catch (error) {
      setState('error');
      setMessage(error instanceof Error ? error.message : 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`fixed inset-0 overflow-hidden ${componentsTheme.login.pageBackground}`}>
      <div className="grid h-full grid-cols-1 overflow-hidden lg:grid-cols-[40%_60%]">
        <div className="relative hidden items-center justify-center bg-slate-50 p-10 lg:flex">
          <div className="relative h-[calc(100vh-5rem)] w-full overflow-hidden rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
            <Image
              src={heroImageSrc}
              alt="Program Highlights"
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
                    src={
                      settings?.brand?.logo_url?.trim() ||
                      settings?.active_program?.logo_url?.trim() ||
                      '/img/ybb-logo.png'
                    }
                    alt={settings?.brand?.name?.trim() || 'Youth Break the Boundaries'}
                    width={120}
                    height={40}
                    className={componentsTheme.login.heroLogo}
                    priority
                    unoptimized
                  />
                </a>
                <div className="mt-4 space-y-2">
                  <h2 className={componentsTheme.login.heroTitle}>
                    Raise Your Hand,
                    <br />
                    Be the Future Leaders
                  </h2>
                </div>
              </div>
            </div>

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

        <div className={componentsTheme.login.formPanelOuter}>
          <div className={componentsTheme.login.formPanelInner}>
            <div>
              {settings?.active_program?.name && (
                <p className={componentsTheme.login.formProgramName}>{settings.active_program.name}</p>
              )}
              <h1 className={componentsTheme.login.formHeading}>Set New Password</h1>
            </div>
            <p className={componentsTheme.login.formSubheading}>
              Create a new password for your account.
            </p>

            <div className={componentsTheme.login.card}>
              {!token ? (
                <>
                  <p className="text-xs font-medium text-primary">
                    Invalid reset link. Please request a new password reset email.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      className={componentsTheme.login.primaryButton}
                      onClick={() => router.push('/auth/forgot-password')}
                    >
                      Request New Link
                    </button>
                  </div>
                </>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4">
                  <div>
                    <label className={componentsTheme.login.fieldLabel}>New Password</label>
                    <div className={componentsTheme.login.inputWrapper}>
                      <Lock className={componentsTheme.login.inputIcon} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className={`${componentsTheme.login.input} ${componentsTheme.login.inputPassword}`}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(prev => !prev)}
                        className={componentsTheme.login.inputEyeBtn}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Use at least 8 characters with uppercase, lowercase, and number or special character.
                    </p>
                  </div>

                  <div>
                    <label className={componentsTheme.login.fieldLabel}>Confirm Password</label>
                    <div className={componentsTheme.login.inputWrapper}>
                      <Lock className={componentsTheme.login.inputIcon} />
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className={`${componentsTheme.login.input} ${componentsTheme.login.inputPassword}`}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(prev => !prev)}
                        className={componentsTheme.login.inputEyeBtn}
                        aria-label={
                          showConfirm ? 'Hide password confirmation' : 'Show password confirmation'
                        }
                      >
                        {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {state === 'error' ? (
                    <p className="text-xs font-medium text-primary">{message}</p>
                  ) : null}
                  {state === 'success' ? (
                    <p className="text-xs font-medium text-primary">{message}</p>
                  ) : null}

                  <div className="pt-2">
                    <button
                      type="submit"
                      className={componentsTheme.login.primaryButton}
                      disabled={loading || !isPasswordValid || !isConfirmValid}
                    >
                      {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                  </div>
                </form>
              )}

              <p className={componentsTheme.login.helperText}>
                Back to{' '}
                <button
                  type="button"
                  className={componentsTheme.login.switchModeLink}
                  onClick={() => router.push('/login')}
                >
                  Login
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
