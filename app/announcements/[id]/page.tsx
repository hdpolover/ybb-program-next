import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getAnnouncementsPageData } from '@/lib/api/announcements';
import {
  decodePossiblyEncodedHtml,
  formatAnnouncementCategoryLabel,
  formatAnnouncementDateLabel,
  getAnnouncementActionHref,
  isExternalHref,
  sanitizeAnnouncementHtml,
} from '@/lib/announcements';
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
  const content = sanitizeAnnouncementHtml(decodePossiblyEncodedHtml(item.content?.trim() || excerpt));
  const actionHref = getAnnouncementActionHref(item.href);
  const tags = (item.tags ?? []).filter((tag) => tag.trim().length > 0);

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
          <div className="flex flex-wrap items-center gap-2">
            <p className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              {formatAnnouncementCategoryLabel(item.category)}
            </p>
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl font-extrabold text-blue-950">{title}</h1>
          <p className="text-sm font-semibold text-blue-900">
            {author} <span className="text-slate-500"> - </span> {dateLabel}
          </p>
          <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700">
            {excerpt}
          </p>
          <p className="text-sm font-semibold text-blue-900">
            Full announcement
          </p>
          <div
            className="prose prose-slate max-w-none prose-headings:text-blue-950 prose-a:text-primary"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          {actionHref ? (
            isExternalHref(actionHref) ? (
              <a
                href={actionHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
              >
                Open related link
              </a>
            ) : (
              <Link
                href={actionHref}
                className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
              >
                Open related link
              </Link>
            )
          ) : null}
        </div>
      </article>
    </main>
  );
}
