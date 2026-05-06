export const PARTICIPANT_DISTRIBUTION_DETAILS_HREF = '/participant-distribution';

export type ParticipantDistributionEntry = {
  name: string;
  count: number;
  percentage: number;
};

export function getParticipantDistributionEntries(
  countryParticipants?: Record<string, number>,
): ParticipantDistributionEntry[] {
  if (!countryParticipants || Object.keys(countryParticipants).length === 0) {
    return [];
  }

  const all = Object.entries(countryParticipants).map(([name, count]) => ({
    name,
    count: Number(count),
  }));
  const total = all.reduce((sum, item) => sum + item.count, 0) || 1;

  return all
    .map((item) => ({
      ...item,
      percentage: (item.count / total) * 100,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function getParticipantDistributionSummary(
  countryParticipants?: Record<string, number>,
): {
  entries: ParticipantDistributionEntry[];
  topEntries: ParticipantDistributionEntry[];
  totalParticipants: number;
  representedCountries: number;
} {
  const entries = getParticipantDistributionEntries(countryParticipants);

  return {
    entries,
    topEntries: entries.slice(0, 10),
    totalParticipants: entries.reduce((sum, item) => sum + item.count, 0),
    representedCountries: entries.filter((item) => item.count > 0).length,
  };
}
