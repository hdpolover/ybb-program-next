'use client';

import Image from 'next/image';
import { PhoneCall, Mail, Instagram, MapPin } from 'lucide-react';

import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import { contactItems, contactSectionContent } from '@/data/contact';

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

const resolveDefaultItems = (): ContactItem[] =>
  contactItems.map(item => {
    const base = {
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
      href: item.href,
    } as const;

    if (item.id === 'chat') {
      return { ...base, icon: <PhoneCall className="h-4 w-4" /> };
    }
    if (item.id === 'email') {
      return { ...base, icon: <Mail className="h-4 w-4" /> };
    }
    if (item.id === 'instagram') {
      return { ...base, icon: <Instagram className="h-4 w-4" /> };
    }
    return { ...base, icon: <MapPin className="h-4 w-4" /> };
  });

export default function GetInTouchSection({
  title = contactSectionContent.subtitle,
  eyebrow = contactSectionContent.title,
  items,
}: GetInTouchProps) {
  const resolvedItems = items ?? resolveDefaultItems();
  return (
    <section className={componentsTheme.getInTouch.sectionWrapper}>
      <div
        className={`${componentsTheme.getInTouch.card} relative`}
      >
        <div className="absolute inset-0 sm:hidden">
          <Image
            src="/img/touchwithusmobile.png"
            alt=""
            fill
            priority
            className="object-cover object-left"
          />
        </div>
        <div className="absolute inset-0 hidden sm:block">
          <Image
            src={componentsTheme.getInTouch.cardBackground}
            alt=""
            fill
            priority
            className="object-cover object-center"
          />
        </div>

        <div className="relative z-10">
        <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)] items-center gap-8">
          {/* Kiri: gambar ilustrasi */}
          <div className={componentsTheme.getInTouch.imageWrapper}></div>

          {/* Kanan: judul, deskripsi, dan daftar contact items */}
          <div>
            <SectionHeader eyebrow={eyebrow} title={title} align="left" />
            <div className={componentsTheme.getInTouch.list}>
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
                    <div className="min-w-0">
                      <p className={componentsTheme.getInTouch.itemTitle}>{item.title}</p>
                      <p className={componentsTheme.getInTouch.itemSubtitle}>{item.subtitle}</p>
                    </div>
                  </Wrapper>
                );
              })}
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
