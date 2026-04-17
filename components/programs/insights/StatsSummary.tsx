import SectionHeader from '@/components/ui/SectionHeader';
import { Users, Clock, Award } from 'lucide-react';
import { componentsTheme } from '@/lib/theme/components';

export default function StatsSummarySection() {
  return (
    <section className="px-6 py-10 sm:py-12 md:py-14 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Program Stats" title="Participation at a glance" />
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-1 ring-slate-200">
            <div className="flex items-start gap-3">
              <span className={componentsTheme.insightsStats.iconCircle}>
                <Users className="h-5 w-5" />
              </span>
              <div>
                <p className={componentsTheme.insightsStats.label}>Total Participants</p>
                <p className={componentsTheme.insightsStats.value}>1,250+</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-1 ring-slate-200">
            <div className="flex items-start gap-3">
              <span className={componentsTheme.insightsStats.iconCircle}>
                <Award className="h-5 w-5" />
              </span>
              <div>
                <p className={componentsTheme.insightsStats.label}>Program Status</p>
                <p className={componentsTheme.insightsStats.value}>Active</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-1 ring-slate-200">
            <div className="flex items-start gap-3">
              <span className={componentsTheme.insightsStats.iconCircle}>
                <Clock className="h-5 w-5" />
              </span>
              <div>
                <p className={componentsTheme.insightsStats.label}>Program Duration</p>
                <p className={componentsTheme.insightsStats.value}>4 Days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
