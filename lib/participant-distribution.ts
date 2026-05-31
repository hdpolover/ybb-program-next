export const PARTICIPANT_DISTRIBUTION_DETAILS_HREF = '/participant-distribution';

export type ParticipantDistributionLevel = 'high' | 'medium' | 'low' | 'none';

export type ParticipantDistributionEntry = {
  name: string;
  count: number;
  percentage: number;
};

const COUNTRY_NAME_TO_ATLAS_NAME: Record<string, string> = {
  usa: 'United States of America',
  unitedstates: 'United States of America',
  unitedstatesofamerica: 'United States of America',
  uk: 'United Kingdom',
  greatbritain: 'United Kingdom',
  czechrepublic: 'Czechia',
  democraticrepublicofthecongo: 'Dem. Rep. Congo',
  drcongo: 'Dem. Rep. Congo',
  drc: 'Dem. Rep. Congo',
  republicofthecongo: 'Congo',
  palestinianterritoryoccupied: 'Palestine',
  palestinianterritories: 'Palestine',
  palestinestate: 'Palestine',
  ivorycoast: "Côte d'Ivoire",
  coteivoire: "Côte d'Ivoire",
  cotedivoire: "Côte d'Ivoire",
  russianfederation: 'Russia',
  syrianarabrepublic: 'Syria',
  iranislamicrepublicof: 'Iran',
  vietnam: 'Vietnam',
  laopeoplesdemocraticrepublic: 'Laos',
  boliviaplurinationalstateof: 'Bolivia',
  tanzaniaunitedrepublicof: 'Tanzania',
  moldovarepublicof: 'Moldova',
  timorleste: 'Timor-Leste',
  korea: 'South Korea',
  republicofkorea: 'South Korea',
  korearepublicof: 'South Korea',
  koreademocraticpeoplesrepublicof: 'North Korea',
  northmacedonia: 'Macedonia',
};

function normalizeCountryToken(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

export function toAtlasCountryName(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  const alias = COUNTRY_NAME_TO_ATLAS_NAME[normalizeCountryToken(trimmed)];
  return alias ?? trimmed;
}

export function mapCountryParticipantsToAtlas(
  countryParticipants?: Record<string, number>,
): Record<string, number> {
  if (!countryParticipants) return {};

  const mapped = new Map<string, number>();
  for (const [country, count] of Object.entries(countryParticipants)) {
    const atlasCountry = toAtlasCountryName(country);
    mapped.set(atlasCountry, (mapped.get(atlasCountry) ?? 0) + Number(count));
  }

  return Object.fromEntries(mapped.entries());
}

function getLevelRank(level: ParticipantDistributionLevel): number {
  if (level === 'high') return 3;
  if (level === 'medium') return 2;
  if (level === 'low') return 1;
  return 0;
}

export function buildParticipantDistributionLevels(
  countryParticipants: Record<string, number>,
): Record<string, ParticipantDistributionLevel> {
  const entries = Object.entries(countryParticipants).filter(([, count]) => Number(count) > 0);
  if (entries.length === 0) return {};

  const maxCount = Math.max(...entries.map(([, count]) => Number(count)));
  if (maxCount <= 0) return {};

  return Object.fromEntries(
    entries.map(([country, count]) => {
      const ratio = Number(count) / maxCount;

      if (ratio >= 0.67) return [country, 'high'];
      if (ratio >= 0.34) return [country, 'medium'];
      return [country, 'low'];
    }),
  );
}

export function mapCountryLevelsToAtlas(
  countryLevels?: Record<string, ParticipantDistributionLevel>,
): Record<string, ParticipantDistributionLevel> {
  if (!countryLevels) return {};

  const mapped = new Map<string, ParticipantDistributionLevel>();
  for (const [country, level] of Object.entries(countryLevels)) {
    const atlasCountry = toAtlasCountryName(country);
    const current = mapped.get(atlasCountry);
    if (!current || getLevelRank(level) > getLevelRank(current)) {
      mapped.set(atlasCountry, level);
    }
  }

  return Object.fromEntries(mapped.entries());
}

export function buildMapDistributionData(
  countryParticipants?: Record<string, number>,
  countryLevels?: Record<string, ParticipantDistributionLevel>,
): {
  participants: Record<string, number>;
  levels: Record<string, ParticipantDistributionLevel>;
} {
  const participants = mapCountryParticipantsToAtlas(countryParticipants);
  const providedLevels = mapCountryLevelsToAtlas(countryLevels);
  const inferredLevels = buildParticipantDistributionLevels(participants);
  const levels = { ...inferredLevels, ...providedLevels };
  return { participants, levels };
}

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
