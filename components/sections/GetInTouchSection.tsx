'use client';

import Image from 'next/image';
import { PhoneCall, Mail, Instagram, MapPin } from 'lucide-react';

import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

export type ContactItem = {
  id: string;
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

const DEFAULT_ITEMS: ContactItem[] = [
  {
    id: 'chat',
    title: 'Chat to Customer Support',
    subtitle: '+6285173386622',
    href: 'https://wa.me/6285173386622',
    icon: <PhoneCall className="h-4 w-4" />,
  },
  {
    id: 'email',
    title: 'Email to Customer Support',
    subtitle: 'japanyouthsummit@gmail.com',
    href: 'mailto:japanyouthsummit@gmail.com',
    icon: <Mail className="h-4 w-4" />,
  },
  {
    id: 'instagram',
    title: 'Visit Us',
    subtitle: 'japanyouthsummit',
    href: 'https://instagram.com/japanyouthsummit',
    icon: <Instagram className="h-4 w-4" />,
  },
  {
    id: 'address',
    title: 'Address',
    subtitle: 'Ngaglik, Sleman, Yogyakarta, Indonesia',
    icon: <MapPin className="h-4 w-4" />,
  },
];

export default function GetInTouchSection({
  title = 'Get in touch with our team!',
  eyebrow = 'Contact',
  items = DEFAULT_ITEMS,
}: GetInTouchProps) {
  return (
    <section className={jysSectionTheme.getInTouch.sectionWrapper}>
      <div
        className={jysSectionTheme.getInTouch.card}
        style={{
          backgroundImage: `url(${jysSectionTheme.getInTouch.cardBackground})`,
          backgroundSize: 'auto 103%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)] items-center gap-8">
          {/* Kiri: gambar ilustrasi */}
          <div className={jysSectionTheme.getInTouch.imageWrapper}></div>

          {/* Kanan: judul, deskripsi, dan daftar contact items */}
          <div>
            <SectionHeader eyebrow={eyebrow} title={title} align="left" />
            <div className={jysSectionTheme.getInTouch.list}>
              {items.map(item => {
                const Wrapper: React.ElementType = item.href ? 'a' : 'div';
                return (
                  <Wrapper
                    key={item.id}
                    href={item.href}
                    className={jysSectionTheme.getInTouch.item}
                    target={item.href?.startsWith('http') ? '_blank' : undefined}
                    rel={item.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    <div className={jysSectionTheme.getInTouch.itemIconCircle}>{item.icon}</div>
                    <div>
                      <p className={jysSectionTheme.getInTouch.itemTitle}>{item.title}</p>
                      <p className={jysSectionTheme.getInTouch.itemSubtitle}>{item.subtitle}</p>
                    </div>
                  </Wrapper>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
