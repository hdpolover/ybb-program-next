import HeroSection from '@/components/ui/HeroSection';
import PartnershipDetailSection from '@/components/partners/PartnershipDetail';
import RequireNowSection from '@/components/partners/RequireNow';

export default async function PartnerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="relative">
      <HeroSection
        title="Partnerships Enquiry Form"
        subtitle="Review your selected partnership package and submit your enquiry to our team."
        bgImage="/img/sponsorpartnershipbg.png"
        breadcrumb={[
          { href: '/', label: 'Home' },
          { href: '/partners', label: 'Partners & Sponsors' },
          { label: 'Partnerships Enquiry Form' },
        ]}
        heightClass="min-h-[260px] md:min-h-[300px]"
        decorVariant="compact"
      />
      <PartnershipDetailSection slug={slug} />
      <RequireNowSection slug={slug} />
    </main>
  );
}
