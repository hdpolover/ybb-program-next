export type PromoCtaContent = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
};

export const promoCtaContent: PromoCtaContent = {
  eyebrow: 'Ready to Innovate?',
  title: 'Ready to Innovate? Join Us Now!',
  subtitle:
    'Be part of a global community of young leaders and innovators who are creating real impact through international programs.',
  primaryCtaLabel: 'Apply Now',
  primaryCtaHref: '/apply',
  secondaryCtaLabel: 'Download Guidebook',
  secondaryCtaHref: '#guidebook',
};
