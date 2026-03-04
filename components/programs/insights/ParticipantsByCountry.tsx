import SectionHeader from '@/components/ui/SectionHeader';
import { Flag } from 'lucide-react';
import { componentsTheme } from '@/lib/theme/components';
import {
  PARTICIPANTS_BY_COUNTRY_COPY,
  PARTICIPANTS_BY_COUNTRY_DATA,
} from '@/data/programs/sections/participants-by-country/programsParticipantsByCountry';

export default function ParticipantsByCountrySection() {
  const data = [...PARTICIPANTS_BY_COUNTRY_DATA].sort((a, b) => b.count - a.count);
  const max = data[0]?.count || 1;
  const mid = Math.ceil(data.length / 2);
  const left = data.slice(0, mid);
  const right = data.slice(mid);

  const List = ({ items, startRank }: { items: typeof data; startRank: number }) => (
    <ul className="space-y-2">
      {items.map((d, i) => {
        const rank = startRank + i;
        const pct = Math.round((d.count / max) * 100);
        return (
          <li key={d.country} className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={componentsTheme.insightsParticipants.rankCircle}>{rank}</span>
                <span className={componentsTheme.insightsParticipants.flagCircle}>
                  <Flag className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold text-blue-900">{d.country}</span>
              </div>
              <span className="text-sm font-bold text-blue-900">{d.count}</span>
            </div>
            <div className={componentsTheme.insightsParticipants.barTrack}>
              <div
                className={componentsTheme.insightsParticipants.barFill}
                style={{ width: `${pct}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );

  return (
    <section className="px-6 py-12 sm:py-14 md:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow={PARTICIPANTS_BY_COUNTRY_COPY.eyebrow}
          title={PARTICIPANTS_BY_COUNTRY_COPY.title}
        />
        <p className="mx-auto -mt-6 mb-8 max-w-2xl text-center text-sm text-slate-600 sm:mb-10">
          {PARTICIPANTS_BY_COUNTRY_COPY.descriptionTop}
        </p>
        <div className="grid gap-6 lg:grid-cols-2">
          <List items={left} startRank={1} />
          <List items={right} startRank={left.length + 1} />
        </div>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-slate-600">
          {PARTICIPANTS_BY_COUNTRY_COPY.footerText}
        </p>
      </div>
    </section>
  );
}
