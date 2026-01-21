export type ContactSectionContent = {
  title: string;
  subtitle: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
};

export const contactSectionContent: ContactSectionContent = {
  title: 'Contact',
  subtitle: 'Get in touch with our team!',
  description:
    'Have questions about the program, registration, or partnership opportunities? Our team is ready to help you.',
  primaryCtaLabel: 'Contact Us',
  primaryCtaHref: 'mailto:info@youthbreaktheboundaries.com',
  secondaryCtaLabel: 'WhatsApp Admin',
  secondaryCtaHref: 'https://wa.me/6280000000000',
};
