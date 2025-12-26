import SectionHeader from '@/components/ui/SectionHeader';
import { Flag } from 'lucide-react';
import { jysSectionTheme } from '@/lib/theme/jys-components';

export default function ParticipantsByCountrySection() {
  const data: Array<{ country: string; count: number }> = [
    { country: 'Indonesia', count: 320 },
    { country: 'Turkey', count: 180 },
    { country: 'Japan', count: 150 },
    { country: 'Malaysia', count: 120 },
    { country: 'Pakistan', count: 95 },
    { country: 'Bangladesh', count: 90 },
    { country: 'Nigeria', count: 80 },
    { country: 'Egypt', count: 72 },
    { country: 'India', count: 68 },
    { country: 'Saudi Arabia', count: 60 },
    { country: 'Morocco', count: 48 },
    { country: 'United Arab Emirates', count: 42 },
  ].sort((a, b) => b.count - a.count);
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
                <span className={jysSectionTheme.insightsParticipants.rankCircle}>{rank}</span>
                <span className={jysSectionTheme.insightsParticipants.flagCircle}>
                  <Flag className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold text-blue-900">{d.country}</span>
              </div>
              <span className="text-sm font-bold text-blue-900">{d.count}</span>
            </div>
            <div className={jysSectionTheme.insightsParticipants.barTrack}>
              <div
                className={jysSectionTheme.insightsParticipants.barFill}
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
        <SectionHeader eyebrow="Participants by Country" title="Where our participants come from" />
        <p className="mx-auto -mt-6 mb-8 max-w-2xl text-center text-sm text-slate-600 sm:mb-10">
          Top 12 countries with highest participation
        </p>
        <div className="grid gap-6 lg:grid-cols-2">
          <List items={left} startRank={1} />
          <List items={right} startRank={left.length + 1} />
        </div>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-slate-600">
          124 countries represented across all programs
        </p>
      </div>
    </section>
  );
}
