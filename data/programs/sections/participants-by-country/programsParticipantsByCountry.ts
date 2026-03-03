export type ParticipantsByCountryItem = {
  country: string;
  count: number;
};

export const PARTICIPANTS_BY_COUNTRY_COPY = {
  eyebrow: 'Participants by Country',
  title: 'Where our participants come from',
  descriptionTop: 'Top 12 countries with highest participation',
  footerText: '124 countries represented across all programs',
};

export const PARTICIPANTS_BY_COUNTRY_DATA: ParticipantsByCountryItem[] = [
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
];
