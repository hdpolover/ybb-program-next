import HeroSection from '@/components/ui/HeroSection';
import Image from 'next/image';
import FeaturedSpeakers from '@/components/programs/FeaturedSpeakers';
import { getProgramSpeakers, type ProgramSpeaker } from '@/lib/api/programs';
import { headers } from 'next/headers';
import { getSettings } from '@/lib/api/settings';

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default async function SpeakerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: raw } = await params;
  const slug = decodeURIComponent(raw || '').toLowerCase();
  const host = (await headers()).get('host') || '';

  // Fetch speakers from the active program via API
  let speakers: ProgramSpeaker[] = [];
  try {
    const settings = await getSettings();
    const programSlug = settings.active_program?.slug;
    if (programSlug) {
      speakers = await getProgramSpeakers(programSlug, host);
    }
  } catch (e) {
    console.error('Failed to fetch speakers', e);
  }

  // Match the requested speaker by slug derived from name
  const speaker = speakers.find(s => toSlug(s.name) === slug);

  const fallbackName = slug
    ? slug.split('-').map(s => s ? s[0].toUpperCase() + s.slice(1) : s).join(' ')
    : 'Speaker';

  const name = speaker?.name ?? fallbackName;
  const role = speaker?.title ?? 'Speaker';
  const org = speaker?.organization ?? '';
  const bio = speaker?.bio ?? null;
  const photoUrl = speaker?.photoUrl ?? '/img/bannerpeople.png';
  const email = speaker?.email ?? null;
  const linkedinUrl = speaker?.linkedinUrl ?? null;
  const twitterUrl = speaker?.twitterUrl ?? null;

  const otherSpeakers = speakers
    .filter(s => toSlug(s.name) !== slug)
    .map(s => ({
      name: s.name,
      title: s.title ?? '',
      org: s.organization ?? '',
      photo: s.photoUrl ?? '/img/bannerpeople.png',
      href: `/speakers/${toSlug(s.name)}`,
    }));

  return (
    <main className="relative">
      <HeroSection
        title={name}
        subtitle={org ? `${role} • ${org}` : role}
        breadcrumb={[
          { href: '/', label: 'Home' },
          { href: '/programs', label: 'Programs' },
          { label: name },
        ]}
        decorVariant="compact"
        heightClass="min-h-[300px] md:min-h-[360px]"
      />

      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left: bio + expertise + connect */}
            <div className="order-2 space-y-6 lg:order-1">
              {/* bio */}
              <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200">
                <div className="border-b border-gray-200 p-5">
                  <h2 className="text-xl font-extrabold text-blue-950">Biography</h2>
                </div>
                <div className="p-5">
                  <p className="leading-7 text-slate-700 whitespace-pre-line">{bio ?? 'No biography available.'}</p>
                </div>
              </div>

              {/* connect */}
              <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200">
                <div className="border-b border-gray-200 p-5">
                  <h3 className="text-lg font-extrabold text-blue-950">Connect with Speaker</h3>
                </div>
                <div className="p-5">
                  {email || linkedinUrl || twitterUrl ? (
                    <ul className="space-y-2 text-sm text-slate-700">
                      {email ? (
                        <li>
                          Email: <a className="text-primary hover:underline" href={`mailto:${email}`}>{email}</a>
                        </li>
                      ) : null}
                      {linkedinUrl ? (
                        <li>
                          <a className="text-primary hover:underline" href={linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn Profile</a>
                        </li>
                      ) : null}
                      {twitterUrl ? (
                        <li>
                          <a className="text-primary hover:underline" href={twitterUrl} target="_blank" rel="noopener noreferrer">Twitter / X Profile</a>
                        </li>
                      ) : null}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-600">No contact information available</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right: photo */}
            <div className="order-1 lg:order-2 lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200">
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src={photoUrl}
                    alt={name}
                    fill
                    sizes="(min-width:1024px) 520px, 90vw"
                    className="object-cover"
                  />
                  <span className="absolute left-3 top-3 inline-flex items-center rounded-full border border-primary/30 bg-primary/95 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow">
                    Featured
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {otherSpeakers.length ? (
        <FeaturedSpeakers
          speakers={otherSpeakers}
          title="Other Speakers"
          subtitle="Do you want to see more from other speakers?"
        />
      ) : null}
    </main>
  );
}
