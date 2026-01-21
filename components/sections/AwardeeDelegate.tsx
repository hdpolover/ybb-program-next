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
  id?: string;
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

const dedupeApiItems = (items: ApiAwardItem[] | undefined): ApiAwardItem[] => {
	if (!items || items.length === 0) return [];
	const seen = new Set<string>();
	const result: ApiAwardItem[] = [];
	for (const item of items) {
		const key = [
			item.name,
			item.description,
			String(item.winner_count),
			item.tags.join(','),
		].join('|');
		if (seen.has(key)) continue;
		seen.add(key);
		result.push(item);
	}
	return result;
};

const buildHighlights = (name: string, winnerCount: number): string[] => {
	if (!winnerCount || winnerCount <= 0) return ['Winner'];
	if (winnerCount === 1) return ['1 Winner'];
	return [`${winnerCount} Winners`];
};

const mapApiToAwardItem = (api: ApiAwardItem): AwardItem => {
  const base: Pick<AwardItem, 'id' | 'title' | 'desc' | 'highlights' | 'chips'> = {
    id: api.id,
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
  const normalizedApiItems = dedupeApiItems(apiItems);
  const items: AwardItem[] = normalizedApiItems.length > 0
    ? normalizedApiItems.map(mapApiToAwardItem)
    : [];
  return (
    <section className={jysSectionTheme.awards.sectionWrapper}>
      <div className={jysSectionTheme.awards.container}>
        <SectionHeader title={title} />
        <p className={jysSectionTheme.awards.subtitle}>{subtitle}</p>

        {items.length > 0 ? (
          <div className={jysSectionTheme.awards.grid}>
            {items.map(it => (
              <div
                key={it.id ?? it.title}
                className={`${jysSectionTheme.awards.card} ${it.ring}`}
              >
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
        ) : (
          <div className="mt-6 flex items-center justify-center text-sm text-slate-500">
            Awards akan segera diumumkan.
          </div>
        )}
      </div>
    </section>
  );
}
