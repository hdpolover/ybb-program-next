export type GlobalImpactStat = {
  id: string;
  label: string;
  value: string;
  icon: 'participants' | 'countries' | 'alumni';
};

export type ParticipantLegendCopy = {
  high: string;
  medium: string;
  low: string;
  none: string;
};

export type ParticipantHeaderCopy = {
  eyebrow: string;
  title: string;
};

export type CountryLevel = 'high' | 'medium' | 'low' | 'none';

export type CountryLevels = Record<string, CountryLevel>;

export type CountryParticipants = Record<string, number>;

export type ImpactDistributionCopy = {
  globalImpactEyebrow: string;
  globalImpactTitle: string;
  stats: GlobalImpactStat[];
  participantHeader: ParticipantHeaderCopy;
  legend: ParticipantLegendCopy;
  countryLevels: CountryLevels;
  countryParticipants: CountryParticipants;
};

export const IMPACT_DISTRIBUTION_COPY: ImpactDistributionCopy = {
  globalImpactEyebrow: 'Global Reach',
  globalImpactTitle: 'Global Program Impact',
  stats: [
    {
      id: 'participants',
      label: 'Total Participants',
      value: '10,019',
      icon: 'participants',
    },
    {
      id: 'countries',
      label: 'Total Countries',
      value: '115',
      icon: 'countries',
    },
    {
      id: 'alumni',
      label: 'Alumni',
      value: '9,281',
      icon: 'alumni',
    },
  ],
  participantHeader: {
    eyebrow: 'Participant Geography',
    title: 'Participant Distribution by Country',
  },
  legend: {
    high: 'High participation',
    medium: 'Medium participation',
    low: 'Low participation',
    none: 'No participants',
  },
  countryLevels: {
    Indonesia: 'high',
    Japan: 'high',
    Pakistan: 'high',
    India: 'medium',
    Malaysia: 'medium',
    Singapore: 'medium',
    'United States of America': 'low',
    Canada: 'low',
    Australia: 'low',
    Brazil: 'low',
    Germany: 'low',
    France: 'low',
    Kazakhstan: 'none',
  },
  countryParticipants: {
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
  },
};
