import HeroSection from '@/components/ui/HeroSection';
import TestimonialsGrid, { type Testimonial } from '@/components/programs/testimonials/TestimonialsGrid';
import TestimonialsImpact from '@/components/programs/testimonials/TestimonialsImpact';
import { getLandingHeroMedia } from '@/lib/landing/hero';
import { getHomePageData } from '@/lib/api/home';
import { headers } from 'next/headers';
import type { AlumniStoriesSection, DelegateTestimonialsSection, HomePageData, ProgramImpactSection } from '@/types/home';

function findSection<T extends HomePageData['sections'][number]>(
  homeData: HomePageData,
  type: T['type'],
): T | undefined {
  return homeData.sections.find((section): section is T => section.type === type);
}

// Same alumni/delegate/speaker sections the home page already fetches (see
// HomeStrategy.getData) — reused here exactly like /programs/gallery reuses
// `program_gallery`, rather than standing up a second, brand-scoped endpoint.
function buildTestimonials(homeData: HomePageData): Testimonial[] {
  const alumniSection = findSection<AlumniStoriesSection>(homeData, 'alumni_stories');
  const delegateSection = findSection<DelegateTestimonialsSection>(homeData, 'delegate_testimonials');

  const alumni: Testimonial[] = (alumniSection?.content.items ?? []).map(t => ({
    id: t.id,
    category: 'alumni',
    name: t.name,
    role: t.role,
    quote: t.testimonial,
    avatar: t.avatar_url,
    country: null,
    year: t.alumni_year,
  }));

  const delegates: Testimonial[] = (delegateSection?.content.items ?? []).map(t => ({
    id: t.id,
    category: 'delegate',
    name: t.name,
    role: t.role,
    quote: t.quote,
    avatar: t.photo || null,
    country: t.country || null,
    year: t.year,
  }));

  const speakers: Testimonial[] = (delegateSection?.content.speakers ?? []).map(t => ({
    id: t.id,
    category: 'speaker',
    name: t.name,
    role: t.role,
    quote: t.quote,
    avatar: t.photo || null,
    country: t.country || null,
    year: t.year,
  }));

  return [...delegates, ...alumni, ...speakers];
}

export default async function ProgramsTestimonialsPage() {
  const host = (await headers()).get('host') || '';
  const [heroMedia, homeData] = await Promise.all([
    getLandingHeroMedia(host, 'programs-testimonials', {
      fallbackImage: '/img/bgprogramoverview.png',
    }),
    getHomePageData(host),
  ]);

  const testimonials = buildTestimonials(homeData);

  return (
    <main className="relative">
      <HeroSection
        title="Testimonials"
        subtitle="Stories and feedback from participants across cohorts."
        bgImage={heroMedia.bgImage ?? '/img/bgprogramoverview.png'}
        galleryImages={heroMedia.galleryImages}
        breadcrumb={[
          { href: '/', label: 'Home' },
          { href: '/programs', label: 'Programs' },
          { href: '/programs/testimonials', label: 'Testimonials' },
        ]}
      />

      {/* grid testimoni utama */}
      <TestimonialsGrid testimonials={testimonials} />

      {/* Curated platform impact figures, already carried by the home payload
          this page fetches — suppressed entirely when impact_stats is unset. */}
      <TestimonialsImpact stats={findSection<ProgramImpactSection>(homeData, 'program_impact')?.content.stats} />
    </main>
  );
}
