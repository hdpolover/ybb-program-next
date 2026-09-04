// app/auth/account-deletion-scheduled/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { componentsTheme } from '@/lib/theme/components';
import { useSettings } from '@/components/providers/SettingsProvider';
import { formatDeadlineLocal } from '@/lib/format/deadline';

const FALLBACK_IMAGES = [
  '/img/galeri2.png',
  '/img/programhighlight1.jpg',
  '/img/programoverview.png',
  '/img/galeri1.png',
  '/img/galeri3.png',
];

/**
 * Landed on right after DeleteAccountSection signs the user out — the
 * session that created the deletion request is already dead by the time this
 * renders, so everything here comes from the query string, not an
 * authenticated call. See DeleteAccountSection.tsx for what it passes.
 */
export default function AccountDeletionScheduledPage() {
  const router = useRouter();
  const { settings } = useSettings();
  const searchParams = useSearchParams();

  const scheduledDeletionDate = searchParams?.get('scheduledDeletionDate') ?? '';
  const paidInvoiceCount = Number(searchParams?.get('paidInvoiceCount') ?? '0') || 0;
  const nonDraftApplicationCount = Number(searchParams?.get('nonDraftApplicationCount') ?? '0') || 0;
  const hasRecordsNote = paidInvoiceCount > 0 || nonDraftApplicationCount > 0;

  const [imageIndex, setImageIndex] = useState(0);
  const [loginImages, setLoginImages] = useState<string[]>(FALLBACK_IMAGES);

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
  const scheduledDateLabel = scheduledDeletionDate
    ? formatDeadlineLocal(scheduledDeletionDate, { withTime: false })
    : null;

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
              <h1 className={componentsTheme.login.formHeading}>Account Deletion Scheduled</h1>
            </div>

            <p className={componentsTheme.login.formSubheading}>
              We&apos;re sorry to see you go. Here&apos;s what happens next.
            </p>

            <div className={componentsTheme.login.card}>
              <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <div className="space-y-1 text-sm text-slate-600">
                  <p>Your account has been deactivated and signed out.</p>
                  <p>
                    It will be permanently deleted{scheduledDateLabel ? ` on ${scheduledDateLabel}` : ' in 30 days'}
                    , unless you cancel before then.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-xs text-slate-700">
                Check your email for a cancellation link — clicking it any time before that date restores your
                account exactly as it was.
              </div>

              {hasRecordsNote ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
                  For your records: this account has {paidInvoiceCount} paid invoice{paidInvoiceCount === 1 ? '' : 's'} and{' '}
                  {nonDraftApplicationCount} submitted application{nonDraftApplicationCount === 1 ? '' : 's'} on file. These are
                  retained regardless of this deletion.
                </div>
              ) : null}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className={componentsTheme.login.primaryButton}
                >
                  Back to Login
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
      </div>
    </section>
  );
}
