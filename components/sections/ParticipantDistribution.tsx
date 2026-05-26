'use client';

import { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import countries110m from 'world-atlas/countries-110m.json';
import SectionHeader from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/button/button';
import { componentsTheme } from '@/lib/theme/components';
import {
  getParticipantDistributionSummary,
  PARTICIPANT_DISTRIBUTION_DETAILS_HREF,
} from '@/lib/participant-distribution';

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

  const { topEntries, totalParticipants, representedCountries } =
    getParticipantDistributionSummary(participants);

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
                  <Geographies geography={GEO_DATA} key="world-map">
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
                {topEntries.length > 0 ? (
                  <Button
                    href={PARTICIPANT_DISTRIBUTION_DETAILS_HREF}
                    variant="outline"
                    className="mt-4 w-full"
                  >
                    View full distribution
                  </Button>
                ) : null}
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
      </div>
    </section>
  );
}
