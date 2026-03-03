import React from 'react';

// Komponen Hero reusable biar semua halaman konsisten gaya-nya
// Pakai ini di tiap page: title, subtitle, dan background bisa diatur
export default function HeroSection({
  title,
  subtitle,
  bgImage = '/img/bgprogramoverview.png',
  breadcrumb,
  heightClass,
  decorVariant = 'default',
  align = 'center',
  ctaLabel,
  ctaHref,
  textSize = 'default',
}: {
  title: string;
  subtitle?: string;
  bgImage?: string;
  breadcrumb?: Array<{ href?: string; label: string }>;
  heightClass?: string; // custom tinggi hero biar fleksibel
  decorVariant?: 'default' | 'compact'; // ukuran dekor bulat
  align?: 'left' | 'center';
  ctaLabel?: string;
  ctaHref?: string;
  textSize?: 'default' | 'sm';
}) {
  const containerHeight = heightClass ?? 'min-h-[360px] md:min-h-[420px]';
  const decorTopRight = decorVariant === 'compact' ? 'h-[24rem] w-[24rem]' : 'h-[28rem] w-[28rem]';
  const decorMidRight = decorVariant === 'compact' ? 'h-[16rem] w-[16rem]' : 'h-[18rem] w-[18rem]';
  const alignGroup =
    align === 'left' ? 'items-center text-left md:items-start' : 'items-center text-center';
  const contentWidth = align === 'left' ? 'max-w-xl' : 'max-w-3xl';
  const titleSizeCls =
    textSize === 'sm'
      ? 'text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl'
      : 'text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl';
  const subtitleSizeCls =
    textSize === 'sm'
      ? 'text-sm text-white/90 sm:text-base md:text-lg'
      : 'text-base text-white/90 sm:text-lg md:text-xl';
  return (
    <section
      className="relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url('${bgImage}')` }}
    >
      <div
        className={`mx-auto flex ${containerHeight} max-w-7xl flex-col justify-center px-6 py-24 text-white sm:py-28 md:py-32 lg:px-8 ${alignGroup}`}
      >
        <div className={contentWidth}>
          <h1 className={titleSizeCls}>{title}</h1>
          {subtitle ? <p className={`mt-4 ${subtitleSizeCls}`}>{subtitle}</p> : null}
          {ctaLabel && ctaHref ? (
            <div className="mt-6">
              <a
                href={ctaHref}
                className="inline-flex items-center justify-center rounded-full bg-pink-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-pink-600/40"
              >
                {ctaLabel}
              </a>
            </div>
          ) : null}
        </div>
      </div>

      {breadcrumb && breadcrumb.length > 0 ? (
        <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 -translate-x-1/2 sm:bottom-4 md:bottom-5">
          <div className="pointer-events-auto inline-flex items-stretch overflow-hidden rounded-md border border-white/30 bg-white/15 shadow-sm shadow-black/10">
            {breadcrumb.map((b, i) => (
              <React.Fragment key={i}>
                <a
                  href={b.href ?? '#'}
                  className="px-5 py-2 text-xs font-semibold text-white hover:bg-white/10"
                >
                  {b.label}
                </a>
                {i < breadcrumb.length - 1 ? (
                  <span aria-hidden className="w-px bg-white/30" />
                ) : null}
              </React.Fragment>
            ))}
          </div>
        </div>
      ) : null}

      <div
        className={`pointer-events-none absolute -right-24 -top-24 ${decorTopRight} rounded-full bg-white/10 blur-3xl`}
      />
      <div
        className={`pointer-events-none absolute -right-40 top-24 ${decorMidRight} rounded-full bg-white/5 blur-2xl`}
      />
    </section>
  );
}
