'use client';
import { useState, useEffect, type CSSProperties } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import Image from 'next/image';
import { componentsTheme } from '@/lib/theme/components';
import type { DelegateTestimonialsSection } from '@/types/home';

type Testimonial = {
  name: string;
  role: string;
  quote: string;
  flag: string;
  country: string;
  year: number;
  photo?: string;
};

interface Props {
  section?: DelegateTestimonialsSection;
}

type MarqueeStyle = CSSProperties & {
  '--duration': string;
};

const MARQUEE_STYLE: MarqueeStyle = {
  '--duration': '60s',
};

function getAvatarSrc(photo: string | undefined, name: string) {
  if (photo) return photo;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=96&background=f1f5f9&color=0f172a`;
}

function truncateWords(text: string, maxWords: number) {
  const normalized = (text || '').replace(/\s+/g, ' ').trim();
  if (!normalized) return '';
  const words = normalized.split(' ');
  if (words.length <= maxWords) return normalized;
  return `${words.slice(0, maxWords).join(' ')}...`;
}

export default function Testimonials({ section }: Props) {
  const [active, setActive] = useState<Testimonial | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!section || !section.content.items || section.content.items.length === 0) return null;

  const allItems: Testimonial[] = section.content.items.map(t => ({
    name: t.name,
    role: t.role,
    quote: t.quote,
    flag: '',
    country: t.country,
    year: t.year,
    photo: t.photo || undefined,
  }));

  return (
    <section className={componentsTheme.testimonialsHome.sectionWrapper}>
      <div className={componentsTheme.testimonialsHome.container}>
        <SectionHeader title="Voices of Success: Our Community Speaks" />
        <p className={componentsTheme.testimonialsHome.subtitle}>
          Real stories from participants who've experienced transformational results with our
          program
        </p>
      </div>
      <div className={componentsTheme.testimonialsHome.rowsWrapper}>
        <div className={componentsTheme.testimonialsHome.rowOuter}>
          <div className={componentsTheme.testimonialsHome.fadeLeft} />
          <div className={componentsTheme.testimonialsHome.fadeRight} />
          <div
            className={`${componentsTheme.testimonialsHome.marqueeRowBase} animate-marquee`}
            style={MARQUEE_STYLE}
          >
            {[...allItems, ...allItems].map((t, idx) => (
              <button
                key={idx}
                type="button"
                className={componentsTheme.testimonialsHome.card}
                onClick={() => setActive(t)}
              >
                <p className={componentsTheme.testimonialsHome.quote}>
                  "{truncateWords(t.quote, isMobile ? 35 : 50)}"
                </p>
                <div className={componentsTheme.testimonialsHome.metaRow}>
                  <div className={componentsTheme.testimonialsHome.profileRow}>
                    <div className={componentsTheme.testimonialsHome.avatarWrapper}>
                      <Image
                        src={getAvatarSrc(t.photo, t.name)}
                        alt={t.name}
                        fill
                        sizes="40px"
                        className={componentsTheme.testimonialsHome.avatarImg}
                        unoptimized={!t.photo?.startsWith('/')}
                      />
                    </div>
                    <div className={componentsTheme.testimonialsHome.profileMetaCol}>
                      <p className={componentsTheme.testimonialsHome.nameRow}>
                        <span>{t.name}</span>
                      </p>
                      <p className={componentsTheme.testimonialsHome.roleText}>{t.role}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={componentsTheme.testimonialsHome.badge}>
                      {t.country || 'Alumni'}
                    </span>
                    <span className={componentsTheme.testimonialsHome.yearPill}>
                      Batch {t.year || '-'}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Pop Up detail testimoninya */}
      {active && (
        <div
          className={componentsTheme.testimonialsHome.modalOverlay}
          role="dialog"
          aria-modal="true"
          onClick={() => setActive(null)}
        >
          <div
            className={componentsTheme.testimonialsHome.modalCard}
            onClick={e => e.stopPropagation()}
          >
            <div className={componentsTheme.testimonialsHome.modalHeader}>
              <h3 className={componentsTheme.testimonialsHome.modalTitle}>Testimonial Detail</h3>
              <button
                onClick={() => setActive(null)}
                className={componentsTheme.testimonialsHome.modalCloseButton}
                aria-label="Close"
              >
                Close
              </button>
            </div>
            <div className={componentsTheme.testimonialsHome.modalBodyGrid}>
              <div className={componentsTheme.testimonialsHome.modalAvatarWrapper}>
                <div className={componentsTheme.testimonialsHome.modalAvatarInner}>
                  <Image
                    src={active.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(active.name)}&size=96`}
                    alt={active.name}
                    fill
                    sizes="96px"
                    className={componentsTheme.testimonialsHome.modalAvatarImg}
                    unoptimized={!active.photo?.startsWith('/')}
                  />
                </div>
              </div>
              <div>
                <p className={componentsTheme.testimonialsHome.modalMetaNameRow}>
                  <span className="text-base">{active.flag}</span>
                  <span>{active.name}</span>
                </p>
                <p className={componentsTheme.testimonialsHome.modalMetaSub}>
                  {active.country} • {active.role} • {active.year}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className={componentsTheme.testimonialsHome.modalQuote}>“{active.quote}”</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
