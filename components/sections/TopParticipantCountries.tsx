'use client';

import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';
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
    <section className={jysSectionTheme.participantDistribution.sectionWrapper}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          eyebrow="Top Countries"
          title="Top 10 Participant Countries"
          align="center"
        />

        <div className={jysSectionTheme.topParticipantCountries.card}>
          <table className={jysSectionTheme.topParticipantCountries.table}>
            <thead className={jysSectionTheme.topParticipantCountries.headRow}>
              <tr>
                <th className={jysSectionTheme.topParticipantCountries.headCell}>
                  #
                </th>
                <th className={jysSectionTheme.topParticipantCountries.headCell}>
                  Country
                </th>
                <th className={jysSectionTheme.topParticipantCountries.headCellRight}>
                  Participants
                </th>
                <th className={jysSectionTheme.topParticipantCountries.headCell}>
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody className={jysSectionTheme.topParticipantCountries.bodyRow}>
              {entries.map((row, idx) => (
                <tr key={row.name}>
                  <td className={jysSectionTheme.topParticipantCountries.indexCell}>{idx + 1}</td>
                  <td className={jysSectionTheme.topParticipantCountries.countryCell}>{row.name}</td>
                  <td className={jysSectionTheme.topParticipantCountries.countCell}>
                    {row.count.toLocaleString()}
                  </td>
                  <td className={jysSectionTheme.topParticipantCountries.percentageCell}>
                    <div className="flex items-center gap-3">
                      <div className={jysSectionTheme.topParticipantCountries.progressTrack}>
                        <div
                          className={jysSectionTheme.topParticipantCountries.progressBar}
                          style={{ width: `${row.percentage.toFixed(1)}%` }}
                        />
                      </div>
                      <span className={jysSectionTheme.topParticipantCountries.percentageMeta}>
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
