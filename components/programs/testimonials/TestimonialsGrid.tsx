'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import EmptyState from '@/components/ui/EmptyState';
import Image from 'next/image';
import { componentsTheme } from '@/lib/theme/components';

// Grid testimonial lengkap dengan data dan kartu — data ditarik dari API (landing/home
// alumni_stories + delegate_testimonials sections), bukan lagi hardcoded.

export type TestimonialCategory = 'delegate' | 'alumni' | 'speaker';

export type Testimonial = {
  id: string;
  category: TestimonialCategory;
  name: string;
  role: string;
  quote: string;
  avatar: string | null;
  country: string | null;
  year: number | null;
};

const CATEGORY_LABELS: Record<TestimonialCategory, string> = {
  delegate: 'Delegates',
  alumni: 'Alumni',
  speaker: 'Speakers',
};

const CATEGORY_BADGE: Record<TestimonialCategory, string> = {
  delegate: 'Delegate',
  alumni: 'Alumni',
  speaker: 'Speaker',
};

type TabId = 'all' | TestimonialCategory;

function truncateWords(text: string, maxWords: number) {
  const normalized = (text || '').replace(/\s+/g, ' ').trim();
  if (!normalized) return '';
  const words = normalized.split(' ');
  if (words.length <= maxWords) return normalized;
  return `${words.slice(0, maxWords).join(' ')}...`;
}

function getAvatarSrc(avatar: string | null, name: string) {
  if (avatar) return avatar;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=96&background=f1f5f9&color=0f172a`;
}

function TestimonialCard({ t }: { t: Testimonial }) {
  const [open, setOpen] = React.useState(false);
  const avatarSrc = getAvatarSrc(t.avatar, t.name);

  return (
    <div className={componentsTheme.programsTestimonialsGrid.card}>
      <div className={componentsTheme.programsTestimonialsGrid.cardInnerRow}>
        <div className="relative h-12 w-12 flex-shrink-0">
          <Image
            src={avatarSrc}
            alt={t.name}
            fill
            sizes="48px"
            className={componentsTheme.programsTestimonialsGrid.avatarImg}
            unoptimized={!t.avatar?.startsWith('/')}
          />
        </div>
        <div className={componentsTheme.programsTestimonialsGrid.contentCol}>
          <div className={componentsTheme.programsTestimonialsGrid.headerRow}>
            <h3 className={componentsTheme.programsTestimonialsGrid.name}>{t.name}</h3>
            <span className={componentsTheme.programsTestimonialsGrid.countryChip}>
              {t.country || CATEGORY_BADGE[t.category]}
            </span>
            {t.year !== null && (
              <span className={componentsTheme.programsTestimonialsGrid.yearPill}>{t.year}</span>
            )}
          </div>
          <p className={componentsTheme.programsTestimonialsGrid.quote}>
            {open ? t.quote : truncateWords(t.quote, 28)}
          </p>
          {t.quote.trim().split(/\s+/).length > 28 && (
            <button
              type="button"
              onClick={() => setOpen(v => !v)}
              className={componentsTheme.programsTestimonialsGrid.readMoreButton}
            >
              {open ? 'Show Less' : 'Read Full Testimonial'}{' '}
              <ChevronDown
                className={`${componentsTheme.programsTestimonialsGrid.readMoreIcon} ${
                  open ? 'rotate-180' : ''
                }`}
              />
            </button>
          )}
          <div className={componentsTheme.programsTestimonialsGrid.divider} />
          <div className={componentsTheme.programsTestimonialsGrid.metaRow}>
            <span className={componentsTheme.programsTestimonialsGrid.roleText}>{t.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

type TestimonialsGridProps = {
  testimonials: Testimonial[];
};

export default function TestimonialsGrid({ testimonials }: TestimonialsGridProps) {
  const [tab, setTab] = React.useState<TabId>('all');

  const countsByCategory = React.useMemo(() => {
    return testimonials.reduce<Record<TestimonialCategory, number>>(
      (acc, t) => {
        acc[t.category] += 1;
        return acc;
      },
      { delegate: 0, alumni: 0, speaker: 0 },
    );
  }, [testimonials]);

  const availableCategories = (Object.keys(countsByCategory) as TestimonialCategory[]).filter(
    category => countsByCategory[category] > 0,
  );

  // Only offer tabs (and the "All" tab) when more than one category has data —
  // a brand with a single category keeps a simple, tab-free grid.
  const tabs: TabId[] = availableCategories.length > 1 ? ['all', ...availableCategories] : [];
  const activeTab: TabId = tabs.length === 0 ? (availableCategories[0] ?? 'all') : tab;

  const visibleTestimonials =
    activeTab === 'all' ? testimonials : testimonials.filter(t => t.category === activeTab);

  return (
    <section className={componentsTheme.programsTestimonialsGrid.sectionWrapper}>
      <div className={componentsTheme.programsTestimonialsGrid.container}>
        <SectionHeader eyebrow="Participant Voices" title="What they say" />

        {tabs.length > 0 && (
          <div
            className="mb-8 flex flex-wrap items-center justify-center gap-2"
            role="tablist"
            aria-label="Testimonial category"
          >
            {tabs.map(id => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={activeTab === id}
                onClick={() => setTab(id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeTab === id
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {id === 'all' ? 'All' : CATEGORY_LABELS[id]}
              </button>
            ))}
          </div>
        )}

        {visibleTestimonials.length === 0 ? (
          <EmptyState
            title="No testimonials yet"
            description="Stories from participants, alumni, and speakers will appear here once they're added."
          />
        ) : (
          <div className={componentsTheme.programsTestimonialsGrid.grid}>
            {visibleTestimonials.map(t => (
              <TestimonialCard key={t.id} t={t} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
