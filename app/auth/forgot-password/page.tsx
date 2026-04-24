'use client';

import Image from 'next/image';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail } from 'lucide-react';
import { componentsTheme } from '@/lib/theme/components';
import { useEffect } from 'react';
import { useSettings } from '@/components/providers/SettingsProvider';

type RequestState = 'idle' | 'success' | 'error';

const FALLBACK_IMAGES = [
  '/img/galeri2.png',
  '/img/programhighlight1.jpg',
  '/img/programoverview.png',
  '/img/galeri1.png',
  '/img/galeri3.png',
];

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { settings } = useSettings();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<RequestState>('idle');
  const [message, setMessage] = useState('');
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

    setLoading(true);
    setState('idle');
    setMessage('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const json = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) {
        throw new Error(json?.message || 'Failed to request password reset');
      }

      setState('success');
      setMessage(json?.message || 'A reset link has been sent to your email.');
    } catch (error) {
      setState('error');
      setMessage(error instanceof Error ? error.message : 'Failed to request password reset');
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
              <h1 className={componentsTheme.login.formHeading}>Forgot Password</h1>
            </div>
            <p className={componentsTheme.login.formSubheading}>
              Enter your email and we will send you a reset link.
            </p>

            <div className={componentsTheme.login.card}>
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className={componentsTheme.login.fieldLabel}>Email</label>
                  <div className={componentsTheme.login.inputWrapper}>
                    <Mail className={componentsTheme.login.inputIcon} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className={componentsTheme.login.input}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {state === 'success' ? (
                  <p className="text-xs font-medium text-primary">{message}</p>
                ) : null}
                {state === 'error' ? (
                  <p className="text-xs font-medium text-primary">{message}</p>
                ) : null}

                <div className="pt-2">
                  <button type="submit" className={componentsTheme.login.primaryButton} disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>

              <p className={componentsTheme.login.helperText}>
                Remember your password?{' '}
                <button
                  type="button"
                  className={componentsTheme.login.switchModeLink}
                  onClick={() => router.push('/login')}
                >
                  Back to login
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
