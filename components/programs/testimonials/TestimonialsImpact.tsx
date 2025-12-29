import { Users, Globe2, Smile, Award } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

// Section angka-angka impact di halaman Testimonials
export default function TestimonialsImpact() {
  return (
    <section className={jysSectionTheme.programsTestimonialsImpact.sectionWrapper}>
      <div className={jysSectionTheme.programsTestimonialsImpact.container}>
        <SectionHeader eyebrow="Our Impact" title="Join Our Growing Community" />
        <div className={jysSectionTheme.programsTestimonialsImpact.grid}>
          <div className={jysSectionTheme.programsTestimonialsImpact.card}>
            <div className={jysSectionTheme.programsTestimonialsImpact.iconCircle}>
              <Users className={jysSectionTheme.programsTestimonialsImpact.icon} />
            </div>
            <p className={jysSectionTheme.programsTestimonialsImpact.value}>4,000+</p>
            <p className={jysSectionTheme.programsTestimonialsImpact.label}>Alumni Worldwide</p>
          </div>
          <div className={jysSectionTheme.programsTestimonialsImpact.card}>
            <div className={jysSectionTheme.programsTestimonialsImpact.iconCircle}>
              <Globe2 className={jysSectionTheme.programsTestimonialsImpact.icon} />
            </div>
            <p className={jysSectionTheme.programsTestimonialsImpact.value}>120+</p>
            <p className={jysSectionTheme.programsTestimonialsImpact.label}>
              Countries Represented
            </p>
          </div>
          <div className={jysSectionTheme.programsTestimonialsImpact.card}>
            <div className={jysSectionTheme.programsTestimonialsImpact.iconCircle}>
              <Smile className={jysSectionTheme.programsTestimonialsImpact.icon} />
            </div>
            <p className={jysSectionTheme.programsTestimonialsImpact.value}>95%</p>
            <p className={jysSectionTheme.programsTestimonialsImpact.label}>Satisfaction Rate</p>
          </div>
          <div className={jysSectionTheme.programsTestimonialsImpact.card}>
            <div className={jysSectionTheme.programsTestimonialsImpact.iconCircle}>
              <Award className={jysSectionTheme.programsTestimonialsImpact.icon} />
            </div>
            <p className={jysSectionTheme.programsTestimonialsImpact.value}>500+</p>
            <p className={jysSectionTheme.programsTestimonialsImpact.label}>Social Projects</p>
          </div>
        </div>
      </div>
    </section>
  );
}
