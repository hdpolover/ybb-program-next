'use client';

import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import { IMPACT_DISTRIBUTION_COPY } from '@/data/home/sections/impact/impactDistribution';

export default function TopParticipantCountries() {
  const all = Object.entries(IMPACT_DISTRIBUTION_COPY.countryParticipants).map(([name, count]) => ({
    name,
    count: Number(count),
  }));

  const total = all.reduce((sum, item) => sum + item.count, 0) || 1;

  const entries = all
    .map(item => ({
      ...item,
      percentage: (item.count / total) * 100,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return (
    <section className={componentsTheme.participantDistribution.sectionWrapper}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          eyebrow="Top Countries"
          title="Top 10 Participant Countries"
          align="center"
        />

        <div className={componentsTheme.topParticipantCountries.card}>
          <table className={componentsTheme.topParticipantCountries.table}>
            <thead className={componentsTheme.topParticipantCountries.headRow}>
              <tr>
                <th className={componentsTheme.topParticipantCountries.headCell}>
                  #
                </th>
                <th className={componentsTheme.topParticipantCountries.headCell}>
                  Country
                </th>
                <th className={componentsTheme.topParticipantCountries.headCellRight}>
                  Participants
                </th>
                <th className={componentsTheme.topParticipantCountries.headCell}>
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody className={componentsTheme.topParticipantCountries.bodyRow}>
              {entries.map((row, idx) => (
                <tr key={row.name}>
                  <td className={componentsTheme.topParticipantCountries.indexCell}>{idx + 1}</td>
                  <td className={componentsTheme.topParticipantCountries.countryCell}>{row.name}</td>
                  <td className={componentsTheme.topParticipantCountries.countCell}>
                    {row.count.toLocaleString()}
                  </td>
                  <td className={componentsTheme.topParticipantCountries.percentageCell}>
                    <div className="flex items-center gap-3">
                      <div className={componentsTheme.topParticipantCountries.progressTrack}>
                        <div
                          className={componentsTheme.topParticipantCountries.progressBar}
                          style={{ width: `${row.percentage.toFixed(1)}%` }}
                        />
                      </div>
                      <span className={componentsTheme.topParticipantCountries.percentageMeta}>
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
