import { Globe2, Sparkles, Megaphone, HeartHandshake } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import { PARTNERS_WHY_CONTENT, type PartnersWhyIconKey } from '@/data/partnersWhy';

const iconMap: Record<PartnersWhyIconKey, React.ComponentType<{ className?: string }>> = {
  global_reach: Globe2,
  innovation_focus: Sparkles,
  brand_visibility: Megaphone,
  social_impact: HeartHandshake,
};

// Section: Why Partner With Us? — dipisah biar rapi & reusable
export default function WhyPartnerSection() {
  return (
    <section className={componentsTheme.partnersWhy.sectionWrapper}>
      <div className={componentsTheme.partnersWhy.container}>
        <SectionHeader eyebrow={PARTNERS_WHY_CONTENT.eyebrow} title={PARTNERS_WHY_CONTENT.title} />

        {/* Fitur utama: satu baris grid, berbasis JSON data */}
        <div className={componentsTheme.partnersWhy.grid}>
          {PARTNERS_WHY_CONTENT.items.map(item => {
            const Icon = iconMap[item.icon];
            return (
              <div key={item.id} className={componentsTheme.partnersWhy.featureCard}>
                <div className={componentsTheme.partnersWhy.featureIconCircle}>
                  <Icon className={componentsTheme.partnersWhy.featureIcon} />
                </div>
                <h3 className={componentsTheme.partnersWhy.featureTitle}>{item.title}</h3>
                <p className={componentsTheme.partnersWhy.featureDescription}>{item.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA utama di bawah card */}
        <div className={componentsTheme.partnersWhy.ctaWrapper}>
          <button type="button" className={componentsTheme.partnersWhy.ctaButton}>
            {PARTNERS_WHY_CONTENT.ctaLabel}
          </button>
        </div>
      </div>
    </section>
  );
}
