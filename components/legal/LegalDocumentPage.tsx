// components/legal/LegalDocumentPage.tsx
import HeroSection from '@/components/ui/HeroSection';
import LegalDocumentContent from '@/components/legal/LegalDocumentContent';
import { getLandingHeroMedia } from '@/lib/landing/hero';
import { fetchLegalDocument, type LegalDocumentType } from '@/lib/legal/legalDocuments';
import { resolveBrandDomain } from '@/lib/server/envContext';

export const LEGAL_PAGE_META: Record<LegalDocumentType, { title: string; path: string; description: string }> = {
  terms: {
    title: 'Terms of Service',
    path: '/terms',
    description: 'The terms that apply when you register for and take part in our programs.',
  },
  privacy: {
    title: 'Privacy Policy',
    path: '/privacy',
    description: 'How we collect, use and protect your personal data.',
  },
};

export default async function LegalDocumentPage({ type }: { type: LegalDocumentType }) {
  const meta = LEGAL_PAGE_META[type];
  const host = await resolveBrandDomain();
  const [docResult, heroResult] = await Promise.allSettled([
    fetchLegalDocument(type, host),
    getLandingHeroMedia(host, 'programs', { preferredImages: [], fallbackImage: '/img/programsbackground.png' }),
  ]);

  if (docResult.status === 'rejected') console.error(`${type}: legal document fetch failed`, docResult.reason);
  const doc = docResult.status === 'fulfilled' ? docResult.value : null;
  const heroMedia = heroResult.status === 'fulfilled' ? heroResult.value : {};

  return (
    <main className="bg-slate-50">
      <HeroSection
        title={doc?.title || meta.title}
        bgImage={heroMedia.bgImage ?? '/img/programsbackground.png'}
        galleryImages={heroMedia.galleryImages}
        breadcrumb={[
          { href: '/', label: 'Home' },
          { href: meta.path, label: meta.title },
        ]}
        heightClass="min-h-[260px] md:min-h-[300px]"
        decorVariant="compact"
      />
      <section className="mx-auto max-w-3xl px-6 py-12 lg:px-8 lg:py-16">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {doc?.content ? (
            <LegalDocumentContent content={doc.content} />
          ) : (
            <p className="text-sm text-slate-600">This document is not available right now. Please try again shortly.</p>
          )}
        </article>
      </section>
    </main>
  );
}
