import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getAnnouncementsPageData } from '@/lib/api/announcements';
import { formatAnnouncementDateLabel, resolveAnnouncementHref } from '@/lib/announcements';
import type { AnnouncementListSection } from '@/types/announcements';

export default async function AnnouncementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const host = (await headers()).get('host') || '';
  const pageData = await getAnnouncementsPageData(host);
  const listSection = pageData.sections.find(
    (section): section is AnnouncementListSection => section.type === 'announcement_list',
  );

  const item = listSection?.data.find(entry => String(entry.id) === id);
  if (!item) notFound();

  const title = item.title?.trim() || 'Announcement';
  const excerpt = item.excerpt?.trim() || 'No additional details available.';
  const author = item.author?.trim() || 'YBB';
  const dateLabel = formatAnnouncementDateLabel(item.date);
  const image = item.image?.trim() || '/img/announcementbackground.png';
  const href = resolveAnnouncementHref(item.id, item.href);

  if (href.startsWith('http://') || href.startsWith('https://')) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="relative h-64 w-full sm:h-80">
            <Image src={image} alt={title} fill className="object-cover" />
          </div>
          <div className="space-y-4 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">{item.category || 'General'}</p>
            <h1 className="text-3xl font-extrabold text-blue-950">{title}</h1>
            <p className="text-sm leading-7 text-slate-700">{excerpt}</p>
            <p className="text-sm font-semibold text-blue-900">
              {author} <span className="text-slate-500"> - </span> {dateLabel}
            </p>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
            >
              Open source
            </a>
          </div>
        </article>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-6">
        <Link href="/announcements" className="text-sm font-semibold text-primary hover:underline">
          Back to announcements
        </Link>
      </div>
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="relative h-64 w-full sm:h-80">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>
        <div className="space-y-4 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">{item.category || 'General'}</p>
          <h1 className="text-3xl font-extrabold text-blue-950">{title}</h1>
          <p className="text-sm leading-7 text-slate-700">{excerpt}</p>
          <p className="text-sm font-semibold text-blue-900">
            {author} <span className="text-slate-500"> - </span> {dateLabel}
          </p>
        </div>
      </article>
    </main>
  );
}
