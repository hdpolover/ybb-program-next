import Image from 'next/image';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';

// Foto-foto program lain (biar ga lorem, pake aset yang ada di /public/img)
const items: {
  title: string;
  photos: string[]; // 4 gambar per kartu
  href?: string;
}[] = [
  {
    title: 'Middle East Youth Summit 2026',
    photos: ['/img/galeri1.png', '/img/galeri2.png', '/img/galeri3.png', '/img/galeri4.png'],
    href: '#',
  },
  {
    title: 'Youth Academic Forum 2025',
    photos: ['/img/galeri5.png', '/img/galeri6.png', '/img/galeri7.png', '/img/galeri8.png'],
    href: '#',
  },
  {
    title: 'World Youth Fest 2025',
    photos: [
      '/img/programoverview.png',
      '/img/programhighlight1.jpg',
      '/img/osaka.jpg',
      '/img/jysprogram1.jpg',
    ],
    href: '#',
  },
  {
    title: 'Istanbul Youth Summit 2026',
    photos: ['/img/galeri2.png', '/img/galeri3.png', '/img/galeri7.png', '/img/galeri8.png'],
    href: '#',
  },
];

export default function OtherProgramsGallery() {
  return (
    <section className="px-6 py-12 sm:py-14 md:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader title="Other Programs" />
        <p className={componentsTheme.galleryOtherPrograms.subtitle}>
          Discover photos from our other exciting events and initiatives
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(it => (
            <a
              key={it.title}
              href={it.href || '#'}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-[0_16px_60px_rgba(2,6,23,0.12)]"
            >
              {/* 2x2 collage */}
              <div className="grid aspect-[4/3] grid-cols-2 grid-rows-2 overflow-hidden">
                {it.photos.slice(0, 4).map((src, idx) => (
                  <div key={idx} className="relative">
                    <Image
                      src={src}
                      alt={`${it.title} photo ${idx + 1}`}
                      fill
                      sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                      className="object-cover transition group-hover:scale-[1.03]"
                    />
                  </div>
                ))}
              </div>
              {/* body */}
              <div className="p-5">
                <h4 className={componentsTheme.galleryOtherPrograms.cardTitle}>{it.title}</h4>
                <div className="mt-4">
                  <span className={componentsTheme.galleryOtherPrograms.visitChip}>
                    Visit Website
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path d="M14 3h7v7h-2V6.414l-9.293 9.293-1.414-1.414L17.586 5H14V3z" />
                      <path d="M5 5h5V3H3v7h2V5z" />
                    </svg>
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
