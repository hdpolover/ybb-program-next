'use client';

import { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export type Level = 'high' | 'medium' | 'low' | 'none';

// Kategori dummy dulu; nanti tinggal diganti/extend sama data beneran.
// Key di sini harus PERSIS nama negara dari geo.properties.NAME (bukan kode ISO).
export const countryLevels: Record<string, Level> = {
  // Contoh negara dengan partisipasi tinggi
  Indonesia: 'high',
  Japan: 'high',
  Pakistan: 'high',
  // Contoh negara dengan partisipasi sedang
  India: 'medium',
  Malaysia: 'medium',
  Singapore: 'medium',
  // Contoh negara dengan partisipasi rendah
  'United States of America': 'low',
  Canada: 'low',
  Australia: 'low',
  Brazil: 'low',
  Germany: 'low',
  France: 'low',
  // Contoh eksplisit negara yang belum ada peserta
  Kazakhstan: 'none',
};

// Jumlah peserta per negara masih dummy (nanti tinggal diganti ke data asli)
export const countryParticipants: Record<string, number> = {
  Indonesia: 320,
  Japan: 260,
  Pakistan: 190,
  India: 140,
  Malaysia: 120,
  Singapore: 60,
  'United States of America': 90,
  Canada: 45,
  Australia: 70,
  Brazil: 55,
  Germany: 80,
  France: 75,
};

function getFillForCountry(nameKey: string): string {
  const level = (countryLevels[nameKey] ?? 'none') as Level;
  if (level === 'high') return '#ef4444'; // merah (high participation)
  if (level === 'medium') return '#facc15'; // kuning (medium participation)
  if (level === 'low') return '#22c55e'; // hijau (low participation)
  return '#e5e7eb'; // abu-abu kalau belum ada peserta
}

export default function ParticipantDistribution() {
  const [selectedCountry, setSelectedCountry] = useState<{
    name: string;
    level: Level;
    participants: number;
  } | null>(null);

  const selectedLabel = selectedCountry
    ? selectedCountry.name
    : 'Click on a country to see its participation level';

  const selectedSubLabel = selectedCountry
    ? `${selectedCountry.participants.toLocaleString()} participants`
    : '';

  // Ngitung Top 10 negara berdasarkan jumlah peserta (masih mock), buat ditampilin di bawah map
  const all = Object.entries(countryParticipants).map(([name, count]) => ({
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

  return (
    <section className={jysSectionTheme.participantDistribution.sectionWrapper}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          eyebrow="Participant Geography"
          title="Participant Distribution by Country"
          align="center"
        />

        <div className={jysSectionTheme.participantDistribution.mapCard}>
          <div className={jysSectionTheme.participantDistribution.mapWrapper}>
            {jysSectionTheme.participantDistribution.mapBackdrop ? (
              <div className={jysSectionTheme.participantDistribution.mapBackdrop} />
            ) : null}

            <div className={jysSectionTheme.participantDistribution.mapInner}>
              <ComposableMap
                projectionConfig={{ scale: 145 }}
                style={{ width: '100%', height: '100%' }}
              >
                <Geographies geography={GEO_URL}>
                  {({ geographies }: { geographies: any[] }) =>
                    geographies.map((geo: any) => {
                      const props = geo.properties as any;
                      const rawName = (props.NAME || props.name) as string | undefined;
                      const name = rawName && rawName !== '-99' ? rawName : 'Unknown region';
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={getFillForCountry(name)}
                          stroke="#ffffff"
                          strokeWidth={0.4}
                          onClick={() => {
                            const level = (countryLevels[name] ?? 'none') as Level;
                            const participants = countryParticipants[name] ?? 0;
                            setSelectedCountry({ name, level, participants });
                          }}
                          style={{
                            default: { outline: 'none' },
                            hover: { outline: 'none', opacity: 0.9, cursor: 'pointer' },
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

          {/* Selected country info, centered under the map */}
          <div className="mt-6 text-center">
            <p className="text-sm font-semibold text-slate-900">{selectedLabel}</p>
            {selectedSubLabel ? (
              <p className="mt-1 text-xs font-medium text-emerald-600">{selectedSubLabel}</p>
            ) : null}
          </div>

          {/* Legend row below the map, like the reference layout */}
          <div className={jysSectionTheme.participantDistribution.legendRow}>
            <div className={jysSectionTheme.participantDistribution.legendItem}>
              <span
                className={`${jysSectionTheme.participantDistribution.legendDotBase} ${jysSectionTheme.participantDistribution.legendDotHigh}`}
              />
              <span>High participation</span>
            </div>
            <div className={jysSectionTheme.participantDistribution.legendItem}>
              <span
                className={`${jysSectionTheme.participantDistribution.legendDotBase} ${jysSectionTheme.participantDistribution.legendDotMedium}`}
              />
              <span>Medium participation</span>
            </div>
            <div className={jysSectionTheme.participantDistribution.legendItem}>
              <span
                className={`${jysSectionTheme.participantDistribution.legendDotBase} ${jysSectionTheme.participantDistribution.legendDotLow}`}
              />
              <span>Low participation</span>
            </div>
            <div className={jysSectionTheme.participantDistribution.legendItem}>
              <span
                className={`${jysSectionTheme.participantDistribution.legendDotBase} ${jysSectionTheme.participantDistribution.legendDotNone}`}
              />
              <span>No participants</span>
            </div>
          </div>
        </div>

        {/* Compact Top 10 list as a separate card under the map card (same section) */}
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
                          className="h-full rounded-full bg-pink-500"
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
