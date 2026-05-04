'use client';

import { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import countries110m from 'world-atlas/countries-110m.json';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';

const GEO_DATA = countries110m as unknown as Record<string, unknown>;

type WorldGeo = {
  rsmKey: string;
  properties: {
    name?: string;
  };
};

export type Level = 'high' | 'medium' | 'low' | 'none';

export type ParticipantDistributionProps = {
  eyebrow?: string;
  title?: string;
  countryLevels?: Record<string, Level>;
  countryParticipants?: Record<string, number>;
  legend?: { high: string; medium: string; low: string; none: string };
};

const DEFAULT_LEGEND = {
  high: 'High participation',
  medium: 'Medium participation',
  low: 'Low participation',
  none: 'No participants',
};

export default function ParticipantDistribution({
  eyebrow = 'Participant Geography',
  title = 'Participant Distribution by Country',
  countryLevels,
  countryParticipants,
  legend,
}: ParticipantDistributionProps) {
  const [selectedCountry, setSelectedCountry] = useState<{
    name: string;
    level: Level;
    participants: number;
  } | null>(null);

  const hasLevels = countryLevels && Object.keys(countryLevels).length > 0;
  const hasParticipants = countryParticipants && Object.keys(countryParticipants).length > 0;
  if (!hasLevels && !hasParticipants) return null;

  const levels = countryLevels ?? {};
  const participants = countryParticipants ?? {};
  const legendCopy = legend ?? DEFAULT_LEGEND;
  const headerEyebrow = eyebrow;
  const headerTitle = title;

  function getFillForCountry(nameKey: string): string {
    const level = (levels[nameKey] ?? 'none') as Level;
    const colors = componentsTheme.participantDistribution.mapColors;
    if (level === 'high') return colors.high;
    if (level === 'medium') return colors.medium;
    if (level === 'low') return colors.low;
    return colors.none;
  }
  const selectedLabel = selectedCountry
    ? selectedCountry.name
    : 'Click on a country to see its participation level';

  const selectedSubLabel = selectedCountry
    ? `${selectedCountry.participants.toLocaleString()} participants`
    : '';

  // Hitung Top 10 negara berdasarkan jumlah peserta (masih mock), buat ditampilin di bawah map
  const all = Object.entries(participants).map(([name, count]) => ({
    name,
    count: Number(count),
  }));

  const total = all.reduce((sum, item) => sum + item.count, 0) || 1;

  const topEntries = all
    .map(item => ({
      ...item,
      percentage: (item.count / total) * 100,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  const totalParticipants = all.reduce((sum, item) => sum + item.count, 0);
  const representedCountries = all.filter((item) => item.count > 0).length;

  return (
    <section className={componentsTheme.participantDistribution.sectionWrapper}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          eyebrow={headerEyebrow}
          title={headerTitle}
          align="center"
        />

        <div className={componentsTheme.participantDistribution.mapCard}>
          <div className="mb-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Total participants</p>
              <p className="mt-1 text-xl font-extrabold text-slate-900">{totalParticipants.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Countries represented</p>
              <p className="mt-1 text-xl font-extrabold text-slate-900">{representedCountries.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Top country</p>
              <p className="mt-1 text-base font-bold text-slate-900">{topEntries[0]?.name ?? 'No data yet'}</p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className={componentsTheme.participantDistribution.mapWrapper}>
              {componentsTheme.participantDistribution.mapBackdrop ? (
                <div className={componentsTheme.participantDistribution.mapBackdrop} />
              ) : null}

              <div className={componentsTheme.participantDistribution.mapInner}>
                <ComposableMap
                  projectionConfig={{ scale: 145 }}
                  style={{ width: '100%', height: '100%' }}
                >
                  <Geographies geography={GEO_DATA}>
                    {({ geographies }: { geographies: WorldGeo[] }) =>
                      geographies.map((geo: WorldGeo) => {
                        const name = geo.properties.name ?? 'Unknown';
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={getFillForCountry(name)}
                            stroke={componentsTheme.participantDistribution.mapStroke}
                            strokeWidth={0.5}
                            onClick={() => {
                              const level = (levels[name] ?? 'none') as Level;
                              const count = participants[name] ?? 0;
                              setSelectedCountry({
                                name,
                                level,
                                participants: count,
                              });
                            }}
                            style={{
                              default: { outline: 'none' },
                              hover: { outline: 'none', opacity: 0.88, cursor: 'pointer' },
                              pressed: { outline: 'none' },
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>
                </ComposableMap>
              </div>
            </div>

            <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Selected country</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{selectedLabel}</p>
              {selectedSubLabel ? (
                <p className="mt-1 text-xs font-medium text-emerald-600">{selectedSubLabel}</p>
              ) : null}
              {selectedCountry ? (
                <p className="mt-1 text-xs text-slate-600">Level: {legendCopy[selectedCountry.level]}</p>
              ) : null}

              <div className="mt-4">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Top countries</p>
                <div className="space-y-2">
                  {topEntries.slice(0, 5).map((row, idx) => (
                    <div key={row.name} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="line-clamp-1 text-xs font-semibold text-slate-900">
                          {idx + 1}. {row.name}
                        </p>
                        <p className="text-[11px] font-medium text-slate-600">{row.count.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                  {topEntries.length === 0 ? (
                    <p className="text-xs text-slate-500">No country data yet.</p>
                  ) : null}
                </div>
              </div>
            </aside>
          </div>

          <div className={componentsTheme.participantDistribution.legendRow}>
            <div className={componentsTheme.participantDistribution.legendItem}>
              <span
                className={`${componentsTheme.participantDistribution.legendDotBase} ${componentsTheme.participantDistribution.legendDotHigh}`}
              />
              <span>{legendCopy.high}</span>
            </div>
            <div className={componentsTheme.participantDistribution.legendItem}>
              <span
                className={`${componentsTheme.participantDistribution.legendDotBase} ${componentsTheme.participantDistribution.legendDotMedium}`}
              />
              <span>{legendCopy.medium}</span>
            </div>
            <div className={componentsTheme.participantDistribution.legendItem}>
              <span
                className={`${componentsTheme.participantDistribution.legendDotBase} ${componentsTheme.participantDistribution.legendDotLow}`}
              />
              <span>{legendCopy.low}</span>
            </div>
            <div className={componentsTheme.participantDistribution.legendItem}>
              <span
                className={`${componentsTheme.participantDistribution.legendDotBase} ${componentsTheme.participantDistribution.legendDotNone}`}
              />
              <span>{legendCopy.none}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)] ring-1 ring-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-xs sm:text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:px-4">
                  #
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:px-4">
                  Country
                </th>
                <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:px-4">
                  Participants
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:px-4">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {topEntries.map((row, idx) => (
                <tr key={row.name}>
                  <td className="px-3 py-2 text-[11px] font-semibold text-slate-500 sm:px-4">
                    {idx + 1}
                  </td>
                  <td className="px-3 py-2 text-xs font-semibold text-slate-900 sm:px-4">
                    {row.name}
                  </td>
                  <td className="px-3 py-2 text-right text-xs font-medium text-slate-900 sm:px-4">
                    {row.count.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 sm:px-4">
                    <div className="flex items-center gap-2">
                      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-primary/100"
                          style={{ width: `${row.percentage.toFixed(1)}%` }}
                        />
                      </div>
                      <span className="w-12 text-right text-[11px] font-medium text-slate-700">
                        {row.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
