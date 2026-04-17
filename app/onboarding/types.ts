export const LOGIN_IMAGES = ['/img/onboarding.png'];

export const steps = ['Basic Info', 'Location', 'Age', 'Program Info'] as const;

export type StepKey = (typeof steps)[number];

export const PROGRAM_SOURCES = [
  'Program Source not Added',
];

export type OnboardingForm = {
  fullName: string;
  country: string;
  state: string;
  city: string;
  birthDate: string;
  programSource: string;
  gender: string;
  referralCode: string;
};
