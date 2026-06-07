import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';
import HeroSection from '@/components/ui/HeroSection';
import SectionHeader from '@/components/ui/SectionHeader';
import { getPreviousProgramsArchive } from '@/lib/api/programs';

function getDisplayYear(startDate: string, endDate: string): string {
  const raw = startDate || endDate;
  if (!raw) return 'TBA';

  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? 'TBA' : String(date.getFullYear());
}

export default async function PreviousProgramsPage() {
  const host = (await headers()).get('host') || '';
  const programs = await getPreviousProgramsArchive(host);

  return (
    <main className="bg-white">
      <HeroSection
        title="Previous Programs"
        subtitle="Explore past editions from this brand and revisit the programs that shaped earlier cohorts."
        bgImage="/img/programsbackground.png"
        breadcrumb={[
          { href: '/programs', label: 'Programs' },
          { label: 'Previous Programs' },
        ]}
        decorVariant="compact"
        textSize="sm"
      />

      <section className="px-6 py-14 md:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Program Archive"
            title="Browse past editions"
          />
          <p className="-mt-6 mb-8 text-center text-sm text-primary sm:text-base">
            Every card below opens the archived program detail page for that edition.
          </p>

          {programs.length === 0 ? (
            <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-slate-50 px-6 py-10 text-center shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">No archived programs yet</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Previous programs will appear here once this brand has completed published editions.
              </p>
              <div className="mt-6">
                <Link
                  href="/programs"
                  className="inline-flex items-center justify-center rounded-lg border border-primary/30 bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm transition hover:bg-primary/10"
                >
                  Back to Programs
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {programs.map((program) => {
                const imageSrc =
                  program.thumbnailUrl || program.bannerUrl || '/img/programsbackground.png';
                const description =
                  program.shortDescription?.trim() ||
                  program.description?.trim() ||
                  'Details for this archived program are available on the program page.';

                return (
                  <Link
                    key={program.id}
                    href={`/programs/${program.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200 transition hover:shadow-md"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={imageSrc}
                        alt={program.name}
                        fill
                        sizes="(min-width:1280px) 33vw, (min-width:768px) 50vw, 100vw"
                        className="object-cover transition group-hover:scale-105"
                      />
                      <div className="absolute left-3 top-3 inline-flex items-center rounded-full border border-primary/30 bg-white/95 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
                        Program Archive
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-lg font-extrabold text-slate-900 group-hover:text-primary">
                            {program.name}
                          </h2>
                          <p className="mt-1 text-sm text-slate-600">
                            {getDisplayYear(program.startDate, program.endDate)} ·{' '}
                            {program.location?.trim() || 'Location to be announced'}
                          </p>
                        </div>
                      </div>

                      <p className="mt-4 line-clamp-4 text-sm leading-6 text-slate-700">
                        {description}
                      </p>

                      <div className="mt-6 inline-flex items-center text-sm font-semibold text-primary">
                        Read archived program
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
