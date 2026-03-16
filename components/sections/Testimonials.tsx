'use client';
import { useState } from 'react';
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

const DIRECTIONS: Array<'left' | 'right'> = ['left', 'right', 'left'];

const DEFAULT_ITEMS: Testimonial[] = [
  { name: 'Aiko Tanaka', role: 'Delegate 2024', quote: 'CYS transformed how I collaborate and lead. The network I built is priceless.', flag: '🇯🇵', country: 'Japan', year: 2024 },
  { name: 'Rafi Pratama', role: 'Finalist 2023', quote: 'Hands-on mentorship and global exposure boosted my confidence tremendously.', flag: '🇮🇩', country: 'Indonesia', year: 2023 },
  { name: 'Mina Park', role: 'Participant 2022', quote: 'I learned to turn ideas into action while meeting inspiring people from many fields.', flag: '🇰🇷', country: 'South Korea', year: 2022 },
  { name: 'Samuel Lee', role: 'Delegate 2025', quote: 'An empowering space to innovate for sustainability and culture.', flag: '🇺🇸', country: 'United States', year: 2025 },
  { name: 'Nadia Putri', role: 'Alumni', quote: 'Opportunities and friendships that last beyond the program.', flag: '🇮🇩', country: 'Indonesia', year: 2021 },
  { name: 'Akira Watanabe', role: 'Volunteer', quote: 'Incredible energy and impact. Every session felt meaningful.', flag: '🇯🇵', country: 'Japan', year: 2024 },
  { name: 'Sophie Müller', role: 'Delegate 2024', quote: 'I leave with a global mindset, a project idea, and 300 new friends.', flag: '🇩🇪', country: 'Germany', year: 2024 },
  { name: 'Chen Wei', role: 'Participant 2023', quote: 'The innovation challenge pushed me to think beyond borders.', flag: '🇨🇳', country: 'China', year: 2023 },
  { name: 'Amara Diallo', role: 'Delegate 2025', quote: 'CYS gave me the confidence to speak up and the platform to be heard.', flag: '🇸🇳', country: 'Senegal', year: 2025 },
  { name: 'Lucas Ferreira', role: 'Alumni', quote: 'A life-changing week that shaped my career path.', flag: '🇧🇷', country: 'Brazil', year: 2022 },
  { name: 'Hana Kim', role: 'Delegate', quote: 'I gained clarity about my goals and a plan to achieve them.', flag: '🇰🇷', country: 'South Korea', year: 2023 },
  { name: 'William Chen', role: 'Alumni', quote: 'I still collaborate with friends I met here. Powerful network.', flag: '🇸🇬', country: 'Singapore', year: 2021 },
  { name: 'Nurul Azizah', role: 'Delegate', quote: 'The best platform to build confidence and take initiative.', flag: '🇮🇩', country: 'Indonesia', year: 2025 },
  { name: 'Carlos Diaz', role: 'Mentor', quote: 'Loved the problem-solving spirit. Outcomes were practical and inspiring.', flag: '🇪🇸', country: 'Spain', year: 2023 },
  { name: 'Sakura Ito', role: 'Participant', quote: 'Workshops were top-notch and the culture exchange was unforgettable.', flag: '🇯🇵', country: 'Japan', year: 2022 },
];

interface Props {
  section?: DelegateTestimonialsSection;
}

export default function Testimonials({ section }: Props) {
  const [active, setActive] = useState<Testimonial | null>(null);

  const allItems: Testimonial[] = section?.content.items.length
    ? section.content.items.map(t => ({
        name: t.name,
        role: t.role,
        quote: t.quote,
        flag: '',
        country: t.country,
        year: t.year,
        photo: t.photo || undefined,
      }))
    : DEFAULT_ITEMS;

  // Split into 3 rows of roughly equal chunks
  const chunkSize = Math.ceil(allItems.length / 3);
  const rows: Array<{ direction: 'left' | 'right'; items: Testimonial[] }> = DIRECTIONS.map((dir, i) => ({
    direction: dir,
    items: allItems.slice(i * chunkSize, (i + 1) * chunkSize),
  })).filter(r => r.items.length > 0);

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
        {rows.map((row, i) => (
          <div key={i} className={componentsTheme.testimonialsHome.rowOuter}>
            {/* fade mask kiri/kanan biar ga keliatan 'mentok' */}
            <div className={componentsTheme.testimonialsHome.fadeLeft} />
            <div className={componentsTheme.testimonialsHome.fadeRight} />
            <div
              className={`${componentsTheme.testimonialsHome.marqueeRowBase} ${
                row.direction === 'left' ? 'animate-marquee' : 'animate-marquee-reverse'
              }`}
              style={{ ['--duration' as any]: '55s' }}
            >
              {[...row.items, ...row.items].map((t, idx) => (
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
        ))}
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
