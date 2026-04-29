'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { componentsTheme } from '@/lib/theme/components';
import { useSettings } from '@/components/providers/SettingsProvider';

type VerifyStatus = 'idle' | 'loading' | 'success' | 'error';

const FALLBACK_IMAGES = [
  '/img/galeri2.png',
  '/img/programhighlight1.jpg',
  '/img/programoverview.png',
  '/img/galeri1.png',
  '/img/galeri3.png',
];

export default function VerifyEmailPage() {
  const router = useRouter();
  const { settings } = useSettings();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') ?? '';
  const hasToken = Boolean(token);

  const [status, setStatus] = useState<VerifyStatus>('idle');
  const [message, setMessage] = useState('');
  const [imageIndex, setImageIndex] = useState(0);
  const [loginImages, setLoginImages] = useState<string[]>(FALLBACK_IMAGES);

  const buttonLabel = useMemo(() => {
    if (status === 'loading') return 'Verifying...';
    if (status === 'success') return 'Go to Login';
    if (status === 'error') return 'Back to Login';
    return 'Go to Login';
  }, [status]);

  const statusDescription = useMemo(() => {
    if (status === 'loading') return 'Please wait while we verify your email address.';
    if (status === 'success') return 'Your email has been verified successfully.';
    if (status === 'error') return message || 'This verification link is invalid or has expired.';
    return 'We have sent a verification email to your inbox.';
  }, [message, status]);

  const statusHint = useMemo(() => {
    if (status === 'loading') return 'This usually takes only a few seconds.';
    if (status === 'success') return 'You will be redirected to login shortly.';
    if (status === 'error') return 'Please request a new verification email and try again.';
    return 'Open the email and click the verification link to activate your account.';
  }, [status]);

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

        const gallerySection = json?.data?.sections?.find(section => section.type === 'program_gallery');
        const images = (gallerySection?.content?.gallery ?? gallerySection?.content?.images)?.map(img => img.url).filter(Boolean);

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

  useEffect(() => {
    if (!token) {
      setStatus('idle');
      setMessage('');
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
                    src={settings?.brand?.logo_url?.trim() || settings?.active_program?.logo_url?.trim() || '/img/ybb-logo.png'}
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
              <h1 className={componentsTheme.login.formHeading}>Verify Your Email</h1>
            </div>

            <p className={componentsTheme.login.formSubheading}>{statusDescription}</p>

            <div className={componentsTheme.login.card}>
              <p className="text-sm text-slate-600">{statusHint}</p>

              {!hasToken ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
                  <p>Check your inbox and spam folder for the verification message.</p>
                </div>
              ) : null}

              {status === 'error' ? (
                <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-xs text-primary">
                  If the link is expired, request a new verification email from the login page.
                </div>
              ) : null}

              {status === 'success' ? (
                <p className="mt-2 text-center text-xs font-semibold text-slate-500">
                  Redirecting to login...
                </p>
              ) : null}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className={componentsTheme.login.primaryButton}
                  disabled={status === 'loading'}
                >
                  {buttonLabel}
                </button>
              </div>

              <p className={componentsTheme.login.helperText}>
                Need help?{' '}
                {settings?.brand?.support_email ? (
                  <a href={`mailto:${settings.brand.support_email}`} className={componentsTheme.login.switchModeLink}>
                    Contact Support
                  </a>
                ) : (
                  <button
                    type="button"
                    className={componentsTheme.login.switchModeLink}
                    onClick={() => router.push('/login')}
                  >
                    Back to Login
                  </button>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
