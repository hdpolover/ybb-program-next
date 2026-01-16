'use client';

import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';
import { Award, Trophy, Medal, Users, Crown, Camera, Star } from 'lucide-react';

type ApiAwardItem = {
  id: string;
  name: string;
  description: string;
  winner_count: number;
  tags: string[];
  color: string;
  icon_url: string | null;
};

type AwardItem = {
  title: string;
  icon: JSX.Element;
  highlights: string[];
  desc?: string;
  chips?: string[];
  accent: string;
  ring: string;
};

interface RecognitionAwardsProps {
  title?: string;
  subtitle?: string;
  apiItems?: ApiAwardItem[];
}

const DEFAULT_ITEMS: AwardItem[] = [
  {
    title: 'Best Innovation Award',
    icon: <Trophy className="h-5 w-5" />,
    highlights: ['1st Place', '2nd Place', '3rd Place'],
    desc: 'Honoring breakthrough ideas with real-world impact',
    accent: 'bg-accent text-accent-foreground',
    ring: 'ring-accent/30',
  },
  {
    title: 'Best Presenter',
    icon: <Star className="h-5 w-5" />,
    highlights: ['2 Winners'],
    desc: 'Outstanding delivery, clarity, and audience engagement',
    chips: ['Individual', 'Stage'],
    accent: 'bg-amber-500 text-white',
    ring: 'ring-amber-200',
  },
  {
    title: 'Best Participant',
    icon: <Award className="h-5 w-5" />,
    highlights: ['2 Winners'],
    desc: 'Active contributors with exemplary attitude and consistency',
    chips: ['Individual'],
    accent: 'bg-blue-600 text-white',
    ring: 'ring-blue-200',
  },
  {
    title: 'Best Group',
    icon: <Users className="h-5 w-5" />,
    highlights: ['2 Winners'],
    desc: 'Teamwork, synergy, and collaborative problem-solving',
    chips: ['Team', 'Collaboration'],
    accent: 'bg-emerald-600 text-white',
    ring: 'ring-emerald-200',
  },
  {
    title: 'Best Leader',
    icon: <Crown className="h-5 w-5" />,
    highlights: ['1 Winner'],
    desc: 'Inspiring leadership and decision-making under pressure',
    chips: ['Individual', 'Leadership'],
    accent: 'bg-violet-600 text-white',
    ring: 'ring-violet-200',
  },
  {
    title: 'Best Content Creator',
    icon: <Camera className="h-5 w-5" />,
    highlights: ['1 Winner'],
    desc: 'Creative storytelling through engaging digital content',
    chips: ['Individual', 'Digital'],
    accent: 'bg-rose-600 text-white',
    ring: 'ring-rose-200',
  },
];

const buildHighlights = (name: string, winnerCount: number): string[] => {
  if (name.toLowerCase().includes('innovation') && winnerCount === 3) {
    return ['1st Place', '2nd Place', '3rd Place'];
  }
  if (!winnerCount || winnerCount <= 0) return ['Winner'];
  if (winnerCount === 1) return ['1 Winner'];
  return [`${winnerCount} Winners`];
};

const mapApiToAwardItem = (api: ApiAwardItem): AwardItem => {
  const base: Pick<AwardItem, 'title' | 'desc' | 'highlights' | 'chips'> = {
    title: api.name,
    desc: api.description,
    highlights: buildHighlights(api.name, api.winner_count),
    chips: api.tags,
  };

  const name = api.name.toLowerCase();
  if (name.includes('innovation')) {
    return {
      ...base,
      icon: <Trophy className="h-5 w-5" />,
      accent: 'bg-accent text-accent-foreground',
      ring: 'ring-accent/30',
    };
  }
  if (name.includes('presenter')) {
    return {
      ...base,
      icon: <Star className="h-5 w-5" />,
      accent: 'bg-amber-500 text-white',
      ring: 'ring-amber-200',
    };
  }
  if (name.includes('participant')) {
    return {
      ...base,
      icon: <Award className="h-5 w-5" />,
      accent: 'bg-blue-600 text-white',
      ring: 'ring-blue-200',
    };
  }
  if (name.includes('group')) {
    return {
      ...base,
      icon: <Users className="h-5 w-5" />,
      accent: 'bg-emerald-600 text-white',
      ring: 'ring-emerald-200',
    };
  }
  if (name.includes('leader')) {
    return {
      ...base,
      icon: <Crown className="h-5 w-5" />,
      accent: 'bg-violet-600 text-white',
      ring: 'ring-violet-200',
    };
  }
  if (name.includes('content')) {
    return {
      ...base,
      icon: <Camera className="h-5 w-5" />,
      accent: 'bg-rose-600 text-white',
      ring: 'ring-rose-200',
    };
  }

  return {
    ...base,
    icon: <Medal className="h-5 w-5" />,
    accent: 'bg-slate-900 text-white',
    ring: 'ring-slate-200',
  };
};

export default function RecognitionAwards({
  title = 'Awards at Japan Youth Summit',
  subtitle =
    'At JYS, we recognize students who lead, speak up, and make an impact. Your teen could be one of them!',
  apiItems,
}: RecognitionAwardsProps) {
  const items: AwardItem[] = apiItems && apiItems.length > 0
    ? apiItems.map(mapApiToAwardItem)
    : DEFAULT_ITEMS;
  return (
    <section className={jysSectionTheme.awards.sectionWrapper}>
      <div className={jysSectionTheme.awards.container}>
        <SectionHeader title={title} />
        <p className={jysSectionTheme.awards.subtitle}>{subtitle}</p>

        <div className={jysSectionTheme.awards.grid}>
          {items.map(it => (
            <div key={it.title} className={`${jysSectionTheme.awards.card} ${it.ring}`}>
              <div className={jysSectionTheme.awards.cardInner}>
                <div className={jysSectionTheme.awards.cardHeader}>
                  <span className={`${jysSectionTheme.awards.iconCircleBase} ${it.accent}`}>
                    {it.icon}
                  </span>
                  <h3 className={jysSectionTheme.awards.title}>{it.title}</h3>
                </div>
                {it.desc ? <p className={jysSectionTheme.awards.desc}>{it.desc}</p> : null}
              </div>

              {it.highlights.length > 1 ? (
                <ul className={jysSectionTheme.awards.highlightsList}>
                  {it.highlights.map((h, idx) => (
                    <li
                      key={idx}
                      className={`${jysSectionTheme.awards.highlightItemBase} ${
                        idx !== it.highlights.length - 1
                          ? jysSectionTheme.awards.highlightDivider
                          : ''
                      }`}
                    >
                      <span className={jysSectionTheme.awards.highlightLabel}>{h}</span>
                      <span className={jysSectionTheme.awards.highlightBadge}>JYS</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={jysSectionTheme.awards.highlightsList}>
                  {(() => {
                    const raw = it.highlights[0] || '';
                    const match = raw.match(/(\d+)\s+(Winner|Winners|Place|Places)/i);
                    const count = match ? parseInt(match[1], 10) : undefined;
                    const unit = match ? match[2] : raw;
                    return (
                      <div className={jysSectionTheme.awards.singleHighlightBox}>
                        <div>
                          <div className={jysSectionTheme.awards.singleHighlightValue}>
                            {count ?? raw}
                          </div>
                          {count ? (
                            <div className={jysSectionTheme.awards.singleHighlightUnit}>{unit}</div>
                          ) : null}
                        </div>
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          {it.chips?.map(c => (
                            <span key={c} className={jysSectionTheme.awards.chip}>
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
