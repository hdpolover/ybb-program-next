export type HomeRegistrationCopy = {
  eyebrow: string;
  title: string;
  introText: string;
  instagramFallback: string;
  instagramCtaLabel: string;
  guidebookFallbackPrimaryLabel: string;
  guidebookFallbackSecondaryLabel: string;
  guidebookFallbackPrimaryHref: string;
  guidebookFallbackSecondaryHref: string;
};

export const HOME_REGISTRATION_COPY: HomeRegistrationCopy = {
  eyebrow: 'Registration Types',
  title: 'Choose how you want to join',
  introText:
    'Explore the available registration options and read the guidebook before you apply.',
  instagramFallback: 'Instagram feed will appear here once available.',
  instagramCtaLabel: 'View post on Instagram',
  guidebookFallbackPrimaryLabel: 'Download Guidebook (EN)',
  guidebookFallbackSecondaryLabel: 'Download Guidebook (ID)',
  guidebookFallbackPrimaryHref: '#guidebook-en',
  guidebookFallbackSecondaryHref: '#guidebook-id',
};
