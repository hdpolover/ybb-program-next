import HeroSection from '@/components/ui/HeroSection';
import { Network } from 'lucide-react';
import { jysSectionTheme } from '@/lib/theme/jys-components';

function toTitle(slug?: string) {
  if (!slug) return 'Partner'; // jaga-jaga kalo slug nya ga kebawa
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function PartnerDetailPage({ params }: { params: { slug: string } }) {
  const title = toTitle(params?.slug);

  return (
    <main className="relative">
      <HeroSection
        title={title}
        subtitle="Partner detail page. Learn more about contributions, initiatives, and impact."
        bgImage="/img/bgprogramoverview.png"
        breadcrumb={[
          { href: '/', label: 'Home' },
          { href: '/partners', label: 'Partners & Sponsors' },
          { label: title },
        ]}
        heightClass="min-h-[260px] md:min-h-[300px]"
        decorVariant="compact"
      />

      {/* Content */}
      <section className="px-6 py-12 sm:py-14 md:py-16 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl bg-white p-6 shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-1 ring-slate-200">
            <div className="mb-4 flex items-center gap-3">
              <span className={jysSectionTheme.partnersDetail.iconCircle}>
                <Network className="h-5 w-5" />
              </span>
              <h2 className="text-xl font-extrabold text-blue-900">About {title}</h2>
            </div>
            <p className="text-sm leading-7 text-slate-700">
              This is a placeholder detail page. Provide official description, partnership scope,
              key initiatives, and impact metrics here. You can also include logo, website link,
              contact, and media assets.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
