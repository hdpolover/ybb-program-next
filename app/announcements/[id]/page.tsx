import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { AnnouncementDateLabel } from '@/components/announcements/AnnouncementDateLabel';
import { getAnnouncementsPageData } from '@/lib/api/announcements';
import {
  formatAnnouncementCategoryLabel,
  getAnnouncementActionHref,
  isExternalHref,
  toAnnouncementHtml,
} from '@/lib/announcements';
import { resolveBrandDomain } from '@/lib/server/envContext';
import type { AnnouncementListSection } from '@/types/announcements';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const host = await resolveBrandDomain();
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  try {
    const pageData = await getAnnouncementsPageData(host);
    const listSection = pageData.sections.find(
      (section): section is AnnouncementListSection => section.type === 'announcement_list',
    );
    const item = listSection?.data.find((entry) => String(entry.id) === id);

    if (!item) {
      return {
        metadataBase: new URL(baseUrl),
        title: 'Announcement Not Found',
        robots: { index: false, follow: true },
      };
    }

    const title = item.title?.trim() || 'Announcement';
    const description =
      item.excerpt?.trim() ||
      item.content?.trim()?.slice(0, 160) ||
      'Read the latest announcement from Youth Break the Boundaries.';
    const image = item.image?.trim() || '/img/announcementbackground.png';

    return {
      metadataBase: new URL(baseUrl),
      title,
      description,
      alternates: {
        canonical: `/announcements/${encodeURIComponent(String(item.id))}`,
      },
      openGraph: {
        title,
        description,
        type: 'article',
        url: `/announcements/${encodeURIComponent(String(item.id))}`,
        images: [{ url: image }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch {
    return {
      metadataBase: new URL(baseUrl),
      title: 'Announcement',
      alternates: {
        canonical: `/announcements/${encodeURIComponent(String(id))}`,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  }
}

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
  const image = item.image?.trim() || '/img/announcementbackground.png';
  const content = toAnnouncementHtml(item.content?.trim() || excerpt);
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
            {author} <span className="text-slate-500"> - </span> <AnnouncementDateLabel value={item.date} />
          </p>
          <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700">
            {excerpt}
          </p>
          <p className="text-sm font-semibold text-blue-900">
            Full announcement
          </p>
          <div
            className="prose prose-slate max-w-none text-slate-700 prose-headings:my-3 prose-headings:text-blue-950 prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0 prose-a:text-primary prose-a:underline prose-a:underline-offset-4 prose-img:rounded-xl"
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
