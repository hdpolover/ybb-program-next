// Brand-neutral fallback hero shown only when the brand's program_gallery has no
// images (see app/onboarding/page.tsx). Points at an asset that exists in public/img;
// the previous '/img/onboarding.png' was missing and 404'd on every gallery-less brand.
export const LOGIN_IMAGES = ['/img/bgloginsigin.png'];

export const steps = ['Basic Info', 'Location', 'Age', 'Program Info'] as const;

export type StepKey = (typeof steps)[number];

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
