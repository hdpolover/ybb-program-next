export type ContactSectionContent = {
  title: string;
  subtitle: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
};

export type ContactItemContent = {
  id: 'chat' | 'email' | 'instagram' | 'address';
  title: string;
  subtitle: string;
  href?: string;
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

export const contactItems: ContactItemContent[] = [
  {
    id: 'chat',
    title: 'Chat to Customer Support',
    subtitle: contactSectionContent.primaryCtaLabel ?? '+6285173386622',
    href: contactSectionContent.secondaryCtaHref ?? 'https://wa.me/6285173386622',
  },
  {
    id: 'email',
    title: 'Email to Customer Support',
    subtitle: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@youthbreaktheboundaries.com',
    href: `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@youthbreaktheboundaries.com'}`,
  },
  {
    id: 'instagram',
    title: 'Visit Us',
    subtitle: process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || 'youthbreaktheboundaries',
    href: `https://instagram.com/${process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || 'youthbreaktheboundaries'}`,
  },
  {
    id: 'address',
    title: 'Address',
    subtitle: 'Ngaglik, Sleman, Yogyakarta, Indonesia',
  },
];
