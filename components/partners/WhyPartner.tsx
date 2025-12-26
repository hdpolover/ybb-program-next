import { Globe2, Sparkles, Megaphone, HeartHandshake, Network } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

// Section: Why Partner With Us? — dipisah biar rapi & reusable
export default function WhyPartnerSection() {
  return (
    <section className={jysSectionTheme.partnersWhy.sectionWrapper}>
      <div className={jysSectionTheme.partnersWhy.container}>
        <SectionHeader eyebrow="Why Partner With Us?" title="Grow impact together with us" />
        {/* Fitur utama: satu baris grid */}
        <div className={jysSectionTheme.partnersWhy.grid}>
          <div className={jysSectionTheme.partnersWhy.featureCard}>
            <div className={jysSectionTheme.partnersWhy.featureIconCircle}>
              <Globe2 className={jysSectionTheme.partnersWhy.featureIcon} />
            </div>
            <h3 className={jysSectionTheme.partnersWhy.featureTitle}>Global Reach</h3>
            <p className={jysSectionTheme.partnersWhy.featureDescription}>
              Connect with 4,000+ young leaders from 120+ countries
            </p>
          </div>
          <div className={jysSectionTheme.partnersWhy.featureCard}>
            <div className={jysSectionTheme.partnersWhy.featureIconCircle}>
              <Sparkles className={jysSectionTheme.partnersWhy.featureIcon} />
            </div>
            <h3 className={jysSectionTheme.partnersWhy.featureTitle}>Innovation Focus</h3>
            <p className={jysSectionTheme.partnersWhy.featureDescription}>
              Support cutting-edge projects and social impact initiatives
            </p>
          </div>
          <div className={jysSectionTheme.partnersWhy.featureCard}>
            <div className={jysSectionTheme.partnersWhy.featureIconCircle}>
              <Megaphone className={jysSectionTheme.partnersWhy.featureIcon} />
            </div>
            <h3 className={jysSectionTheme.partnersWhy.featureTitle}>Brand Visibility</h3>
            <p className={jysSectionTheme.partnersWhy.featureDescription}>
              Enhance your brand presence among future leaders
            </p>
          </div>
          <div className={jysSectionTheme.partnersWhy.featureCard}>
            <div className={jysSectionTheme.partnersWhy.featureIconCircle}>
              <HeartHandshake className={jysSectionTheme.partnersWhy.featureIcon} />
            </div>
            <h3 className={jysSectionTheme.partnersWhy.featureTitle}>Social Impact</h3>
            <p className={jysSectionTheme.partnersWhy.featureDescription}>
              Make a lasting difference in youth development worldwide
            </p>
          </div>
        </div>

        {/* CTA utama di bawah card */}
        <div className={jysSectionTheme.partnersWhy.ctaWrapper}>
          <button type="button" className={jysSectionTheme.partnersWhy.ctaButton}>
            Join Our Network
          </button>
        </div>
      </div>
    </section>
  );
}
