import HeroSection from '@/components/ui/HeroSection';
import Image from 'next/image';
import { SPEAKERS } from '@/data/speakers';
import FeaturedSpeakers from '@/components/programs/FeaturedSpeakers';

// page detail speaker - sekarang data dipatok dari map biar simpel
export default async function SpeakerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // params sekarang Promise di Next 16, jadi kita tunggu dulu ya
  const { slug: raw } = await params;
  const slug = decodeURIComponent(raw || '').toLowerCase();
  const fallbackName = slug
    ? slug.split('-').map(s => s ? s[0].toUpperCase() + s.slice(1) : s).join(' ')
    : 'Speaker';
  const data = SPEAKERS[slug] ?? {
    name: fallbackName,
    role: 'All Our Programs Speakers',
    org: 'Japan Youth Summit 2025',
  };

  // util kecil untuk ambil path foto berdasarkan slug
  const getPhoto = (s: string) =>
    s === 'kyoka-sugahara'
      ? '/img/speaker1.png'
      : s === 'fawad-afridi'
      ? '/img/speaker2.png'
      : s === 'ayik-abdillah'
      ? '/img/speaker3.png'
      : '/img/bannerpeople.png';

  // kumpulan speaker lain biar user bisa lanjut eksplor tanpa back
  const otherSpeakers = Object.entries(SPEAKERS)
    .filter(([key]) => key !== slug)
    .map(([key, sp]) => ({
      name: sp.name,
      title: sp.role,
      org: sp.org,
      photo: getPhoto(key),
      href: `/speakers/${key}`,
    }));

  return (
    <main className="relative">
      <HeroSection
        title={data.name}
        subtitle={`${data.role} • ${data.org}`}
        breadcrumb={[
          { href: '/', label: 'Home' },
          { href: '/programs', label: 'Programs' },
          { label: data.name },
        ]}
        decorVariant="compact"
        heightClass="min-h-[300px] md:min-h-[360px]"
      />

      {/* isi detail speaker — bio + expertise + connect */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* kiri: semua konten (bio + expertise + connect) */}
            <div className="order-2 space-y-6 lg:order-1">
              {/* bio */}
              <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200">
                <div className="border-b border-gray-200 p-5">
                  <h2 className="text-xl font-extrabold text-blue-950">Biography</h2>
                </div>
                <div className="p-5">
                  <p className="leading-7 text-slate-700 whitespace-pre-line">{data.bio ?? 'Belum ada biografi.'}</p>
                </div>
              </div>

              {/* expertise */}
              <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200">
                <div className="border-b border-gray-200 p-5">
                  <h3 className="text-lg font-extrabold text-blue-950">Areas of Expertise</h3>
                </div>
                <div className="p-5">
                  {data.expertise && data.expertise.length ? (
                    <div className="flex flex-wrap gap-2">
                      {data.expertise.map((tag, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center rounded-full border border-pink-200 bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600">Belum ada daftar expertise.</p>
                  )}
                </div>
              </div>

              {/* connect */}
              <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200">
                <div className="border-b border-gray-200 p-5">
                  <h3 className="text-lg font-extrabold text-blue-950">Connect with Speaker</h3>
                </div>
                <div className="p-5">
                  {data.contact?.email || data.contact?.website || data.contact?.socials?.length ? (
                    <ul className="space-y-2 text-sm text-slate-700">
                      {data.contact?.email ? (
                        <li>
                          Email: <a className="text-pink-700 hover:underline" href={`mailto:${data.contact.email}`}>{data.contact.email}</a>
                        </li>
                      ) : null}
                      {data.contact?.website ? (
                        <li>
                          Website: <a className="text-pink-700 hover:underline" href={data.contact.website} target="_blank" rel="noopener noreferrer">{data.contact.website}</a>
                        </li>
                      ) : null}
                      {data.contact?.socials?.map((s, i) => (
                        <li key={i}>
                          <a className="text-pink-700 hover:underline" href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-600">No contact information available</p>
                  )}
                </div>
              </div>
            </div>

            {/* kanan: foto sticky biar elegan */}
            <div className="order-1 lg:order-2 lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200">
                <div className="relative aspect-[4/5] w/full">
                  <Image
                    src={
                      slug === 'kyoka-sugahara'
                        ? '/img/speaker1.png'
                        : slug === 'fawad-afridi'
                        ? '/img/speaker2.png'
                        : slug === 'ayik-abdillah'
                        ? '/img/speaker3.png'
                        : '/img/bannerpeople.png'
                    }
                    alt={data.name}
                    fill
                    sizes="(min-width:1024px) 520px, 90vw"
                    className="object-cover"
                  />
                  <span className="absolute left-3 top-3 inline-flex items-center rounded-full border border-pink-200 bg-pink-600/95 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow">
                    Featured
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* speaker-speakernya yang lain */}
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
