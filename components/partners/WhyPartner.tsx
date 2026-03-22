import { Globe2, Sparkles, Megaphone, HeartHandshake } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';

type WhyPartnerIconKey = 'global_reach' | 'innovation_focus' | 'brand_visibility' | 'social_impact';

type WhyPartnerItem = {
  id: string;
  icon: WhyPartnerIconKey;
  title: string;
  description: string;
};

type WhyPartnerProps = {
  eyebrow?: string;
  title?: string;
  items?: WhyPartnerItem[];
  ctaLabel?: string;
};

const iconMap: Record<WhyPartnerIconKey, React.ComponentType<{ className?: string }>> = {
  global_reach: Globe2,
  innovation_focus: Sparkles,
  brand_visibility: Megaphone,
  social_impact: HeartHandshake,
};

const DEFAULT_ITEMS: WhyPartnerItem[] = [
  {
    id: 'global-reach',
    icon: 'global_reach',
    title: 'Global Reach',
    description: 'Connect with 4,000+ young leaders from 120+ countries',
  },
  {
    id: 'innovation-focus',
    icon: 'innovation_focus',
    title: 'Innovation Focus',
    description: 'Support cutting-edge projects and social impact initiatives',
  },
  {
    id: 'brand-visibility',
    icon: 'brand_visibility',
    title: 'Brand Visibility',
    description: 'Enhance your brand presence among future leaders',
  },
  {
    id: 'social-impact',
    icon: 'social_impact',
    title: 'Social Impact',
    description: 'Make a lasting difference in youth development worldwide',
  },
];

// Section: Why Partner With Us? — dipisah biar rapi & reusable
export default function WhyPartnerSection({
  eyebrow = 'Why Partner With Us?',
  title = 'Grow impact together with us',
  items = DEFAULT_ITEMS,
  ctaLabel = 'Join Our Network',
}: WhyPartnerProps) {
  if (!items || items.length === 0) return null;
  return (
    <section className={componentsTheme.partnersWhy.sectionWrapper}>
      <div className={componentsTheme.partnersWhy.container}>
        <SectionHeader eyebrow={eyebrow} title={title} />

        {/* Fitur utama: satu baris grid, berbasis JSON data */}
        <div className={componentsTheme.partnersWhy.grid}>
          {items.map(item => {
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
            {ctaLabel}
          </button>
        </div>
      </div>
    </section>
  );
}
