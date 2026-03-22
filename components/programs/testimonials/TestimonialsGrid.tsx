'use client';

import React from 'react';
import { Star, ChevronDown } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import Image from 'next/image';
import { componentsTheme } from '@/lib/theme/components';

// Grid testimonial lengkap dengan data dan kartu — dipisah biar rapi

export type Testimonial = {
  name: string;
  country: string;
  year: string;
  avatar: string;
  quote: string;
  full: string;
  role: string;
  rating: number;
};

function flagEmojiFromCode(code: string) {
  if (!code || code.length !== 2) return '🏳️';
  const base = 127397;
  const cc = code.toUpperCase();
  return (
    String.fromCodePoint(cc.charCodeAt(0) + base) + String.fromCodePoint(cc.charCodeAt(1) + base)
  );
}

const countryCodeMap: Record<string, string> = {
  Indonesia: 'ID',
  Pakistan: 'PK',
  Egypt: 'EG',
  Turkey: 'TR',
  Malaysia: 'MY',
  Japan: 'JP',
  Nigeria: 'NG',
  Morocco: 'MA',
  Bangladesh: 'BD',
  'Saudi Arabia': 'SA',
  India: 'IN',
};

const defaultData: Testimonial[] = [
  {
    name: 'Mayana',
    country: 'Indonesia',
    year: '2025',
    avatar: '/img/galeri7.png',
    quote:
      'I hope that through Istanbul Youth Summit, everyone will create many new memories, make great friends, and gain unforgettable experiences just like I…',
    full: 'I hope that through Istanbul Youth Summit, everyone will create many new memories, make great friends, and gain unforgettable experiences just like I did. The sessions were insightful, the mentors were inspiring, and the community was incredibly supportive.',
    role: 'Participant of Japan Youth Summit 2025',
    rating: 5,
  },
  {
    name: 'Ahmad',
    country: 'Pakistan',
    year: '2024',
    avatar: '/img/galeri5.png',
    quote:
      'Being part of the summit expanded my network globally and helped me sharpen my leadership skills…',
    full: 'Being part of the summit expanded my network globally and helped me sharpen my leadership skills. I collaborated with incredible peers to craft ideas that can create real impact back home.',
    role: 'Participant of Japan Youth Summit 2024',
    rating: 5,
  },
  {
    name: 'Amina',
    country: 'Egypt',
    year: '2025',
    avatar: '/img/galeri2.png',
    quote:
      'An empowering experience that boosted my confidence to lead projects around education equity…',
    full: 'An empowering experience that boosted my confidence to lead projects around education equity. The cultural exchange and mentorship made it truly special.',
    role: 'Participant of Japan Youth Summit 2025',
    rating: 4,
  },
  {
    name: 'Siti',
    country: 'Malaysia',
    year: '2024',
    avatar: '/img/galeri1.png',
    quote: 'Great platform to exchange ideas and collaborate with peers from many countries…',
    full: 'Great platform to exchange ideas and collaborate with peers from many countries. I gained practical skills and long-lasting friendships through projects and workshops.',
    role: 'Participant of Japan Youth Summit 2024',
    rating: 5,
  },
  {
    name: 'Yuki',
    country: 'Japan',
    year: '2025',
    avatar: '/img/galeri3.png',
    quote:
      'Inspiring speakers and strong community support motivated me to lead local initiatives…',
    full: 'Inspiring speakers and strong community support motivated me to lead local initiatives focusing on sustainability and youth empowerment.',
    role: 'Participant of Japan Youth Summit 2025',
    rating: 4,
  },
  {
    name: 'Aisha',
    country: 'Nigeria',
    year: '2023',
    avatar: '/img/galeri4.png',
    quote: 'IYS broadened my perspective and connected me with mentors who truly care…',
    full: 'IYS broadened my perspective and connected me with mentors who truly care about youth leadership. I returned home with actionable plans and a wider network.',
    role: 'Participant of Japan Youth Summit 2023',
    rating: 5,
  },
  {
    name: 'Fatima',
    country: 'Saudi Arabia',
    year: '2024',
    avatar: '/img/galeri8.png',
    quote: 'The international exposure and teamwork experience were invaluable for my growth…',
    full: 'The international exposure and teamwork experience were invaluable for my growth. I learned to communicate across cultures and drive projects with confidence.',
    role: 'Participant of Japan Youth Summit 2024',
    rating: 5,
  },
  {
    name: 'Arjun',
    country: 'India',
    year: '2023',
    avatar: '/img/galeri6.png',
    quote: 'Workshops helped me translate ideas into concrete proposals we can implement…',
    full: 'Workshops helped me translate ideas into concrete proposals we can implement with partners back home. The peer feedback was incredibly helpful.',
    role: 'Participant of Japan Youth Summit 2023',
    rating: 4,
  },
  {
    name: 'Hilmi',
    country: 'Indonesia',
    year: '2025',
    avatar: '/img/galeri7.png',
    quote: 'Workshops helped me translate ideas into concrete proposals we can implement…',
    full: 'Workshops helped me translate ideas into concrete proposals we can implement with partners back home. The peer feedback was incredibly helpful.',
    role: 'Participant of Japan Youth Summit 2025',
    rating: 4,
  },
];

function Stars({ n }: { n: number }) {
  return (
    <div className={componentsTheme.programsTestimonialsGrid.starsWrapper}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={
            i < n
              ? componentsTheme.programsTestimonialsGrid.starFilled
              : componentsTheme.programsTestimonialsGrid.starEmpty
          }
        />
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className={componentsTheme.programsTestimonialsGrid.card}>
      <div className={componentsTheme.programsTestimonialsGrid.cardInnerRow}>
        <Image
          src={t.avatar}
          alt={t.name}
          width={48}
          height={48}
          sizes="48px"
          className={componentsTheme.programsTestimonialsGrid.avatarImg}
        />
        <div className={componentsTheme.programsTestimonialsGrid.contentCol}>
          <div className={componentsTheme.programsTestimonialsGrid.headerRow}>
            <h3 className={componentsTheme.programsTestimonialsGrid.name}>{t.name}</h3>
            <span className={componentsTheme.programsTestimonialsGrid.countryChip}>
              <span className={componentsTheme.programsTestimonialsGrid.flagEmoji}>
                {flagEmojiFromCode(countryCodeMap[t.country] || '')}
              </span>{' '}
              {t.country}
            </span>
            <span className={componentsTheme.programsTestimonialsGrid.yearPill}>{t.year}</span>
          </div>
          <p className={componentsTheme.programsTestimonialsGrid.quote}>
            {open ? t.full : t.quote}
          </p>
          <button
            type="button"
            onClick={() => setOpen(v => !v)}
            className={componentsTheme.programsTestimonialsGrid.readMoreButton}
          >
            Read Full Testimonial{' '}
            <ChevronDown
              className={`${componentsTheme.programsTestimonialsGrid.readMoreIcon} ${
                open ? 'rotate-180' : ''
              }`}
            />
          </button>
          <div className={componentsTheme.programsTestimonialsGrid.divider} />
          <div className={componentsTheme.programsTestimonialsGrid.metaRow}>
            <span className={componentsTheme.programsTestimonialsGrid.roleText}>{t.role}</span>
            <Stars n={t.rating} />
          </div>
        </div>
      </div>
    </div>
  );
}

type TestimonialsGridProps = {
  testimonials?: Testimonial[];
};

export default function TestimonialsGrid({ testimonials }: TestimonialsGridProps) {
  const data = testimonials && testimonials.length > 0 ? testimonials : defaultData;
  return (
    <section className={componentsTheme.programsTestimonialsGrid.sectionWrapper}>
      <div className={componentsTheme.programsTestimonialsGrid.container}>
        <SectionHeader eyebrow="Participant Voices" title="What they say" />
        <div className={componentsTheme.programsTestimonialsGrid.grid}>
          {data.map(t => (
            <TestimonialCard key={`${t.name}-${t.year}`} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
