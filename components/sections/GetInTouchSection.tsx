'use client';

import Image from 'next/image';
import { PhoneCall, Mail, Instagram, MapPin } from 'lucide-react';

import { componentsTheme } from '@/lib/theme/components';
import { useSettings } from '@/components/providers/SettingsProvider';

export type ContactItem = {
  id: 'chat' | 'email' | 'instagram' | 'address';
  title: string;
  subtitle: string;
  href?: string;
  icon: React.ReactNode;
};

export type GetInTouchProps = {
  title?: string;
  eyebrow?: string;
  items?: ContactItem[];
};

export default function GetInTouchSection({
  title = 'Get in touch with our team!',
  eyebrow = 'Contact',
  items,
}: GetInTouchProps) {
  const { settings } = useSettings();
  const brand = settings?.brand ?? null;

  const resolvedItems: ContactItem[] = items ?? buildContactItems(brand);

  return (
    <section className={componentsTheme.getInTouch.sectionWrapper}>
      <div className="mx-auto max-w-2xl px-6 text-center sm:px-10">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-wider text-white/80">{eyebrow}</p>
        ) : null}
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          {title}
        </h2>
        <div className="mt-8 space-y-3">
          {resolvedItems.map(item => {
            const Wrapper: React.ElementType = item.href ? 'a' : 'div';
            return (
              <Wrapper
                key={item.id}
                href={item.href}
                className={componentsTheme.getInTouch.item}
                target={item.href?.startsWith('http') ? '_blank' : undefined}
                rel={item.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                <div className={componentsTheme.getInTouch.itemIconCircle}>{item.icon}</div>
                <div className="min-w-0 text-left">
                  <p className={componentsTheme.getInTouch.itemTitle}>{item.title}</p>
                  <p className={componentsTheme.getInTouch.itemSubtitle}>{item.subtitle}</p>
                </div>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function buildContactItems(brand: NonNullable<ReturnType<typeof useSettings>>['settings'] extends infer S ? S extends { brand: infer B } ? B : null : null): ContactItem[] {
  const items: ContactItem[] = [];

  // WhatsApp / Phone
  const phone = brand?.contact_whatsapp || brand?.contact_phone;
  if (phone) {
    const href = brand?.contact_whatsapp
      ? `https://wa.me/${brand.contact_whatsapp.replace(/\D/g, '')}`
      : `tel:${phone}`;
    items.push({ id: 'chat', title: 'Chat to Customer Support', subtitle: phone, href, icon: <PhoneCall className="h-4 w-4" /> });
  }

  // Email
  const email = brand?.support_email;
  if (email) {
    items.push({ id: 'email', title: 'Email to Customer Support', subtitle: email, href: `mailto:${email}`, icon: <Mail className="h-4 w-4" /> });
  }

  // Instagram
  const igUrl = brand?.social_media?.instagram;
  if (igUrl) {
    const handle = igUrl.replace(/^https?:\/\/(www\.)?instagram\.com\/?/, '').replace(/^@/, '').replace(/\/$/, '');
    items.push({ id: 'instagram', title: 'Visit Us', subtitle: `@${handle}`, href: igUrl, icon: <Instagram className="h-4 w-4" /> });
  }

  // Address
  const address = brand?.address;
  if (address) {
    items.push({ id: 'address', title: 'Address', subtitle: address, icon: <MapPin className="h-4 w-4" /> });
  }

  return items;
}
