'use client';
import { useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import Image from 'next/image';
import { jysSectionTheme } from '@/lib/theme/jys-components';

type Testimonial = {
  name: string;
  role: string;
  quote: string;
  flag: string;
  country: string;
  year: number;
  photo?: string;
};

export default function Testimonials() {
  const [active, setActive] = useState<Testimonial | null>(null);
  const rows: Array<{
    direction: 'left' | 'right';
    items: Array<Testimonial>;
  }> = [
    {
      direction: 'left',
      items: [
        {
          name: 'Aiko Tanaka',
          role: 'Delegate 2024',
          quote: 'JYS transformed how I collaborate and lead. The network I built is priceless.',
          flag: '🇯🇵',
          country: 'Japan',
          year: 2024,
          photo: '/img/jys.png',
        },
        {
          name: 'Rafi Pratama',
          role: 'Finalist 2023',
          quote: 'Hands-on mentorship and global exposure boosted my confidence tremendously.',
          flag: '🇮🇩',
          country: 'Indonesia',
          year: 2023,
          photo: '/img/jys.png',
        },
        {
          name: 'Mina Park',
          role: 'Participant 2022',
          quote:
            'I learned to turn ideas into action while meeting inspiring people from many fields.',
          flag: '🇰🇷',
          country: 'South Korea',
          year: 2022,
          photo: '/img/jys.png',
        },
        {
          name: 'Samuel Lee',
          role: 'Delegate 2025',
          quote: 'An empowering space to innovate for sustainability and culture.',
          flag: '🇺🇸',
          country: 'United States',
          year: 2025,
          photo: '/img/jys.png',
        },
        {
          name: 'Nadia Putri',
          role: 'Alumni',
          quote: 'Opportunities and friendships that last beyond the program.',
          flag: '🇮🇩',
          country: 'Indonesia',
          year: 2021,
          photo: '/img/jys.png',
        },
      ],
    },
    {
      direction: 'right',
      items: [
        {
          name: 'Akira Watanabe',
          role: 'Volunteer',
          quote: 'Incredible energy and impact. Every session felt meaningful.',
          flag: '🇯🇵',
          country: 'Japan',
          year: 2024,
          photo: '/img/jys.png',
        },
        {
          name: 'Dewi Lestari',
          role: 'Speaker',
          quote: 'Young leaders here are bold and thoughtful—great conversations throughout.',
          flag: '🇮🇩',
          country: 'Indonesia',
          year: 2024,
          photo: '/img/jys.png',
        },
        {
          name: 'Carlos Diaz',
          role: 'Mentor',
          quote: 'Loved the problem-solving spirit. Outcomes were practical and inspiring.',
          flag: '🇪🇸',
          country: 'Spain',
          year: 2023,
          photo: '/img/jys.png',
        },
        {
          name: 'Hana Kim',
          role: 'Delegate',
          quote: 'I gained clarity about my goals and a plan to achieve them.',
          flag: '🇰🇷',
          country: 'South Korea',
          year: 2023,
          photo: '/img/jys.png',
        },
        {
          name: 'Arif Rahman',
          role: 'Alumni',
          quote: 'A catalyst for growth. Highly recommend to any youth leader.',
          flag: '🇮🇩',
          country: 'Indonesia',
          year: 2020,
          photo: '/img/jys.png',
        },
      ],
    },
    {
      direction: 'left',
      items: [
        {
          name: 'Sakura Ito',
          role: 'Participant',
          quote: 'Workshops were top-notch and the culture exchange was unforgettable.',
          flag: '🇯🇵',
          country: 'Japan',
          year: 2022,
          photo: '/img/jys.png',
        },
        {
          name: 'Nurul Azizah',
          role: 'Delegate',
          quote: 'The best platform to build confidence and take initiative.',
          flag: '🇮🇩',
          country: 'Indonesia',
          year: 2025,
          photo: '/img/jys.png',
        },
        {
          name: 'Kenji Sato',
          role: 'Volunteer',
          quote: 'A great community with genuine support and collaboration.',
          flag: '🇯🇵',
          country: 'Japan',
          year: 2024,
          photo: '/img/jys.png',
        },
        {
          name: 'Siti Aisyah',
          role: 'Finalist',
          quote: 'From idea to impact—JYS enabled that journey for me.',
          flag: '🇮🇩',
          country: 'Indonesia',
          year: 2023,
          photo: '/img/jys.png',
        },
        {
          name: 'William Chen',
          role: 'Alumni',
          quote: 'I still collaborate with friends I met here. Powerful network.',
          flag: '🇸🇬',
          country: 'Singapore',
          year: 2021,
          photo: '/img/jys.png',
        },
      ],
    },
  ];

  return (
    <section className={jysSectionTheme.testimonialsHome.sectionWrapper}>
      <div className={jysSectionTheme.testimonialsHome.container}>
        <SectionHeader title="Voices of Success: Our Community Speaks" />
        <p className={jysSectionTheme.testimonialsHome.subtitle}>
          Real stories from participants who've experienced transformational results with our
          program
        </p>

        {/* Full card dari ujung kanan ke kiri ( animasi geser ) */}
      </div>
      <div className={jysSectionTheme.testimonialsHome.rowsWrapper}>
        {rows.map((row, i) => (
          <div key={i} className={jysSectionTheme.testimonialsHome.rowOuter}>
            {/* fade mask kiri/kanan biar ga keliatan 'mentok' */}
            <div className={jysSectionTheme.testimonialsHome.fadeLeft} />
            <div className={jysSectionTheme.testimonialsHome.fadeRight} />
            <div
              className={`${jysSectionTheme.testimonialsHome.marqueeRowBase} ${
                row.direction === 'left' ? 'animate-marquee' : 'animate-marquee-reverse'
              }`}
              style={{ ['--duration' as any]: '55s' }}
            >
              {[...row.items, ...row.items].map((t, idx) => (
                <div
                  key={idx}
                  className={jysSectionTheme.testimonialsHome.card}
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
                  <p className={jysSectionTheme.testimonialsHome.quote}>“{t.quote}”</p>
                  <div className={jysSectionTheme.testimonialsHome.metaRow}>
                    <div>
                      <p className={jysSectionTheme.testimonialsHome.nameRow}>
                        <span className={jysSectionTheme.testimonialsHome.nameFlag}>{t.flag}</span>
                        <span>{t.name}</span>
                      </p>
                      <p className={jysSectionTheme.testimonialsHome.roleText}>{t.role}</p>
                    </div>
                    <span className={jysSectionTheme.testimonialsHome.badge}>JYS</span>
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
          className={jysSectionTheme.testimonialsHome.modalOverlay}
          role="dialog"
          aria-modal="true"
          onClick={() => setActive(null)}
        >
          <div
            className={jysSectionTheme.testimonialsHome.modalCard}
            onClick={e => e.stopPropagation()}
          >
            <div className={jysSectionTheme.testimonialsHome.modalHeader}>
              <h3 className={jysSectionTheme.testimonialsHome.modalTitle}>Testimonial Detail</h3>
              <button
                onClick={() => setActive(null)}
                className={jysSectionTheme.testimonialsHome.modalCloseButton}
                aria-label="Close"
              >
                Close
              </button>
            </div>
            <div className={jysSectionTheme.testimonialsHome.modalBodyGrid}>
              <div className={jysSectionTheme.testimonialsHome.modalAvatarWrapper}>
                <div className={jysSectionTheme.testimonialsHome.modalAvatarInner}>
                  <Image
                    src={active.photo || '/img/jys.png'}
                    alt={active.name}
                    fill
                    sizes="96px"
                    className={jysSectionTheme.testimonialsHome.modalAvatarImg}
                  />
                </div>
              </div>
              <div>
                <p className={jysSectionTheme.testimonialsHome.modalMetaNameRow}>
                  <span className="text-base">{active.flag}</span>
                  <span>{active.name}</span>
                </p>
                <p className={jysSectionTheme.testimonialsHome.modalMetaSub}>
                  {active.country} • {active.role} • {active.year}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className={jysSectionTheme.testimonialsHome.modalQuote}>“{active.quote}”</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animasi sekarang pakai util tailwind animate-marquee biar stabil */}
    </section>
  );
}
