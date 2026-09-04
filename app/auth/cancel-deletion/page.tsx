// app/auth/cancel-deletion/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { componentsTheme } from '@/lib/theme/components';
import { useSettings } from '@/components/providers/SettingsProvider';

type CancelStatus = 'loading' | 'restored' | 'already-cancelled' | 'invalid' | 'deleted';

const MISSING_PARAMS_MESSAGE =
  'This cancellation link is missing required information. Copy the full link from your email and try again.';

const FALLBACK_IMAGES = [
  '/img/galeri2.png',
  '/img/programhighlight1.jpg',
  '/img/programoverview.png',
  '/img/galeri1.png',
  '/img/galeri3.png',
];

/**
 * The API (CancelDeletionRequestHandler) has no machine-readable code
 * distinguishing "already cancelled" from "just restored" — both are 200s
 * with different hand-written copy. Classify on that copy rather than
 * duplicating it, so this only needs updating if that wording changes.
 */
function classifySuccess(message: string): 'restored' | 'already-cancelled' {
  return /already cancelled/i.test(message) ? 'already-cancelled' : 'restored';
}

/**
 * Same story for the two 400 cases: an expired/invalid/reused token vs. the
 * purge having already run. Only the second is terminal, so it gets its own
 * plain, final copy instead of the generic "try again" framing.
 */
function classifyError(message: string): 'invalid' | 'deleted' {
  return /permanently deleted/i.test(message) ? 'deleted' : 'invalid';
}

export default function CancelDeletionPage() {
  const router = useRouter();
  const { settings } = useSettings();
  const searchParams = useSearchParams();
  const requestId = searchParams?.get('requestId') ?? '';
  const token = searchParams?.get('token') ?? '';

  const [status, setStatus] = useState<CancelStatus>('loading');
  const [message, setMessage] = useState('');
  const [imageIndex, setImageIndex] = useState(0);
  const [loginImages, setLoginImages] = useState<string[]>(FALLBACK_IMAGES);

  useEffect(() => {
    if (!requestId || !token) {
      setStatus('invalid');
      setMessage(MISSING_PARAMS_MESSAGE);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch('/api/auth/cancel-deletion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requestId, token }),
        });
        const json = (await res.json().catch(() => ({}))) as { message?: string };
        const text = json?.message ?? '';

        if (cancelled) return;

        if (res.ok) {
          setStatus(classifySuccess(text));
          setMessage(text || 'Your account has been reactivated.');
        } else {
          setStatus(classifyError(text));
          setMessage(text || 'This cancellation link is invalid or has expired.');
        }
      } catch {
        if (!cancelled) {
          setStatus('invalid');
          setMessage('Something went wrong while cancelling your account deletion. Please try again.');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [requestId, token]);

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

  const heading = useMemo(() => {
    if (status === 'loading') return 'Cancelling Account Deletion…';
    if (status === 'restored') return 'Account Restored';
    if (status === 'already-cancelled') return 'Already Cancelled';
    if (status === 'deleted') return 'Account Already Deleted';
    return 'Link Invalid or Expired';
  }, [status]);

  const description = useMemo(() => {
    if (status === 'loading') return 'Please wait while we cancel your account deletion.';
    if (status === 'restored' || status === 'already-cancelled') return message;
    return message;
  }, [message, status]);

  // The purge already ran — there is nothing left to restore, so this reads
  // as a plain, final explanation rather than a generic "something went
  // wrong" error, and offers no retry CTA.
  const isTerminal = status === 'deleted';

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
                <Link href="/" className="inline-block">
                  <Image
                    src={settings?.brand?.logo_url?.trim() || settings?.active_program?.logo_url?.trim() || '/img/ybb-logo.png'}
                    alt={settings?.brand?.name?.trim() || 'Youth Break the Boundaries'}
                    width={120}
                    height={40}
                    className={componentsTheme.login.heroLogo}
                    priority
                    unoptimized
                  />
                </Link>
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
          <div className={componentsTheme.login.formPanelCard}>
            <div>
              {settings?.active_program?.name && (
                <p className={componentsTheme.login.formProgramName}>{settings.active_program.name}</p>
              )}
              <h1 className={componentsTheme.login.formHeading}>{heading}</h1>
            </div>

            <p className={componentsTheme.login.formSubheading}>{description}</p>

            <div className={componentsTheme.login.card}>
              {status === 'loading' ? null : (
                <>
                  {!isTerminal ? (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => router.push('/login')}
                        className={componentsTheme.login.primaryButton}
                      >
                        Go to Login
                      </button>
                    </div>
                  ) : (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => router.push('/')}
                        className={componentsTheme.login.primaryButton}
                      >
                        Back to Home
                      </button>
                    </div>
                  )}

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
                </>
              )}
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
