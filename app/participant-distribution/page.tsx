import { headers } from 'next/headers';
import HeroSection from '@/components/ui/HeroSection';
import { getHomePageData } from '@/lib/api/home';
import { getLandingHeroMedia } from '@/lib/landing/hero';
import type { ParticipantDemographicsSection } from '@/types/home';
import { getParticipantDistributionSummary } from '@/lib/participant-distribution';

function extractParticipantDemographics(
  homeData: Awaited<ReturnType<typeof getHomePageData>>,
): ParticipantDemographicsSection | null {
  return (
    homeData.sections.find(
      (section): section is ParticipantDemographicsSection => section.type === 'participant_demographics',
    ) || null
  );
}

export default async function ParticipantDistributionPage() {
  const host = (await headers()).get('host') || '';
  const [heroMedia, homeData] = await Promise.all([
    getLandingHeroMedia(host, 'participant-distribution', {
      fallbackImage: '/img/bgprogramoverview.png',
    }),
    getHomePageData(host),
  ]);

  const section = extractParticipantDemographics(homeData);
  const { entries, totalParticipants, representedCountries } = getParticipantDistributionSummary(
    section?.content.country_participants,
  );
  const topCountry = entries[0]?.name ?? 'No data yet';

  return (
    <main className="relative">
      <HeroSection
        title={section?.content.title || 'Participant Distribution by Country'}
        subtitle="A detailed view of submitted applications across represented countries."
        bgImage={heroMedia.bgImage ?? '/img/bgprogramoverview.png'}
        galleryImages={heroMedia.galleryImages}
        breadcrumb={[
          { href: '/', label: 'Home' },
          { href: '/participant-distribution', label: 'Participant Distribution' },
        ]}
      />

      <section className="relative w-full bg-[#ffffff72] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Total applications</p>
              <p className="mt-1 text-2xl font-extrabold text-slate-900">{totalParticipants.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Countries represented</p>
              <p className="mt-1 text-2xl font-extrabold text-slate-900">{representedCountries.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Top country</p>
              <p className="mt-1 text-lg font-bold text-slate-900">{topCountry}</p>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_14px_45px_rgba(15,23,42,0.12)]">
            {entries.length > 0 ? (
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">#</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Country</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Applications</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Percentage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {entries.map((row, index) => (
                    <tr key={row.name}>
                      <td className="px-4 py-3 text-xs font-semibold text-slate-500">{index + 1}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900">{row.name}</td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-slate-900">
                        {row.count.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-[var(--brand-accent)]"
                              style={{ width: `${row.percentage.toFixed(1)}%` }}
                            />
                          </div>
                          <span className="w-14 text-right text-xs font-medium text-slate-700">
                            {row.percentage.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="px-6 py-16 text-center">
                <p className="text-lg font-semibold text-slate-900">No participant distribution data yet.</p>
                <p className="mt-2 text-sm text-slate-600">
                  This page will populate automatically once submitted applications include country data.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
