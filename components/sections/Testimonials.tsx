'use client';
import { useState, useEffect, type CSSProperties, type KeyboardEvent } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import Image from 'next/image';
import { componentsTheme } from '@/lib/theme/components';
import type { DelegateTestimonialsSection, QuoteTestimonial } from '@/types/home';

type Testimonial = {
  name: string;
  role: string;
  quote: string;
  flag: string;
  country: string;
  year: number | null;
  photo?: string;
};

interface Props {
  section?: DelegateTestimonialsSection;
}

type TabId = 'delegates' | 'speakers';

const TAB_LABELS: Record<TabId, string> = {
  delegates: 'Delegates',
  speakers: 'Speakers',
};

function toTestimonial(t: QuoteTestimonial): Testimonial {
  return {
    name: t.name,
    role: t.role,
    quote: t.quote,
    flag: '',
    country: t.country,
    year: typeof t.year === 'number' ? t.year : null,
    photo: t.photo || undefined,
  };
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
  const [tab, setTab] = useState<TabId>('delegates');

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const delegates = section?.content.items ?? [];
  const speakers = section?.content.speakers ?? [];

  if (!section || (delegates.length === 0 && speakers.length === 0)) return null;

  // Only offer the tabs when both sides have something to show; a brand with no
  // speaker testimonials keeps the original single-marquee layout.
  const tabs: TabId[] = delegates.length > 0 && speakers.length > 0 ? ['delegates', 'speakers'] : [];
  const activeTab: TabId = tabs.length === 0 ? (delegates.length > 0 ? 'delegates' : 'speakers') : tab;
  const allItems: Testimonial[] = (activeTab === 'speakers' ? speakers : delegates).map(toTestimonial);

  function onTabKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = e.key === 'ArrowRight' ? (index + 1) % tabs.length : (index - 1 + tabs.length) % tabs.length;
    setTab(tabs[next]);
    document.getElementById(`testimonials-tab-${tabs[next]}`)?.focus();
  }

  return (
    <section className={componentsTheme.testimonialsHome.sectionWrapper}>
      <div className={componentsTheme.testimonialsHome.container}>
        <SectionHeader title="Voices of Success: Our Community Speaks" />
        <p className={componentsTheme.testimonialsHome.subtitle}>
          Real stories from participants who've experienced transformational results with our
          program
        </p>
        {tabs.length > 0 && (
          <div className={componentsTheme.testimonialsHome.tabList} role="tablist" aria-label="Testimonial category">
            {tabs.map((id, index) => (
              <button
                key={id}
                id={`testimonials-tab-${id}`}
                type="button"
                role="tab"
                aria-selected={activeTab === id}
                aria-controls="testimonials-panel"
                tabIndex={activeTab === id ? 0 : -1}
                onClick={() => setTab(id)}
                onKeyDown={e => onTabKeyDown(e, index)}
                className={`${componentsTheme.testimonialsHome.tabBase} ${
                  activeTab === id
                    ? componentsTheme.testimonialsHome.tabActive
                    : componentsTheme.testimonialsHome.tabInactive
                }`}
              >
                {TAB_LABELS[id]}
              </button>
            ))}
          </div>
        )}
      </div>
      <div
        className={componentsTheme.testimonialsHome.rowsWrapper}
        id="testimonials-panel"
        role={tabs.length > 0 ? 'tabpanel' : undefined}
        aria-labelledby={tabs.length > 0 ? `testimonials-tab-${activeTab}` : undefined}
      >
        <div className={componentsTheme.testimonialsHome.rowOuter}>
          <div className={componentsTheme.testimonialsHome.fadeLeft} />
          <div className={componentsTheme.testimonialsHome.fadeRight} />
          <div
            key={activeTab}
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
                    {t.year !== null && (
                      <span className={componentsTheme.testimonialsHome.yearPill}>
                        Batch {t.year}
                      </span>
                    )}
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
                  {active.country} • {active.role}
                  {active.year !== null ? ` • ${active.year}` : ''}
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
