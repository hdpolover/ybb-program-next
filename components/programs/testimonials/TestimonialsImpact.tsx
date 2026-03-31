import { Users, Globe2, Smile, Award } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';

// Section angka-angka impact di halaman Testimonials
export default function TestimonialsImpact() {
  return (
    <section className={componentsTheme.programsTestimonialsImpact.sectionWrapper}>
      <div className={componentsTheme.programsTestimonialsImpact.container}>
        <SectionHeader eyebrow="Our Impact" title="Join Our Growing Community" />
        <div className={componentsTheme.programsTestimonialsImpact.grid}>
          <div className={componentsTheme.programsTestimonialsImpact.card}>
            <div className={componentsTheme.programsTestimonialsImpact.iconCircle}>
              <Users className={componentsTheme.programsTestimonialsImpact.icon} />
            </div>
            <p className={componentsTheme.programsTestimonialsImpact.value}>4,000+</p>
            <p className={componentsTheme.programsTestimonialsImpact.label}>Alumni Worldwide</p>
          </div>
          <div className={componentsTheme.programsTestimonialsImpact.card}>
            <div className={componentsTheme.programsTestimonialsImpact.iconCircle}>
              <Globe2 className={componentsTheme.programsTestimonialsImpact.icon} />
            </div>
            <p className={componentsTheme.programsTestimonialsImpact.value}>120+</p>
            <p className={componentsTheme.programsTestimonialsImpact.label}>
              Countries Represented
            </p>
          </div>
          <div className={componentsTheme.programsTestimonialsImpact.card}>
            <div className={componentsTheme.programsTestimonialsImpact.iconCircle}>
              <Smile className={componentsTheme.programsTestimonialsImpact.icon} />
            </div>
            <p className={componentsTheme.programsTestimonialsImpact.value}>95%</p>
            <p className={componentsTheme.programsTestimonialsImpact.label}>Satisfaction Rate</p>
          </div>
          <div className={componentsTheme.programsTestimonialsImpact.card}>
            <div className={componentsTheme.programsTestimonialsImpact.iconCircle}>
              <Award className={componentsTheme.programsTestimonialsImpact.icon} />
            </div>
            <p className={componentsTheme.programsTestimonialsImpact.value}>500+</p>
            <p className={componentsTheme.programsTestimonialsImpact.label}>Social Projects</p>
          </div>
        </div>
      </div>
    </section>
  );
}
