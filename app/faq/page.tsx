import HeroSection from '@/components/ui/HeroSection';
import MainFAQSection from '@/components/faq/MainFAQSection';

export default function FaqPage() {
  return (
    <main className="relative">
      <HeroSection
        title="Frequently Asked Questions"
        subtitle="Find quick answers about the Japan Youth Summit program, registration, and payments."
        bgImage="/img/faqhero.png"
        breadcrumb={[
          { href: '/', label: 'Home' },
          { href: '/faq', label: 'FAQ' },
        ]}
        heightClass="min-h-[260px] md:min-h-[300px]"
        decorVariant="compact"
      />

      <MainFAQSection />
    </main>
  );
}
