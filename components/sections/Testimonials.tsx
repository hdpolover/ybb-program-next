'use client';
import { useState, type CSSProperties } from 'react';
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
  '--duration': '55s',
};

export default function Testimonials({ section }: Props) {
  if (!section || !section.content.items || section.content.items.length === 0) return null;

  const [active, setActive] = useState<Testimonial | null>(null);

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

        {/* Full card dari ujung kanan ke kiri ( animasi geser ) */}
      </div>
      <div className={componentsTheme.testimonialsHome.rowsWrapper}>
        <div className={componentsTheme.testimonialsHome.rowOuter}>
          {/* fade mask kiri/kanan biar ga keliatan 'mentok' */}
          <div className={componentsTheme.testimonialsHome.fadeLeft} />
          <div className={componentsTheme.testimonialsHome.fadeRight} />
          <div
            className={`${componentsTheme.testimonialsHome.marqueeRowBase} animate-marquee`}
            style={MARQUEE_STYLE}
          >
            {[...allItems, ...allItems].map((t, idx) => (
              <div
                key={idx}
                className={componentsTheme.testimonialsHome.card}
                onClick={() => setActive(t)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActive(t);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <p className={componentsTheme.testimonialsHome.quote}>“{t.quote}”</p>
                <div className={componentsTheme.testimonialsHome.metaRow}>
                  <div>
                    <p className={componentsTheme.testimonialsHome.nameRow}>
                      <span className={componentsTheme.testimonialsHome.nameFlag}>{t.flag}</span>
                      <span>{t.name}</span>
                    </p>
                    <p className={componentsTheme.testimonialsHome.roleText}>{t.role}</p>
                  </div>
                  <span className={componentsTheme.testimonialsHome.badge}>{t.country || 'Alumni'}</span>
                </div>
              </div>
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

      {/* Animasi sekarang pakai util tailwind animate-marquee biar stabil */}
    </section>
  );
}
