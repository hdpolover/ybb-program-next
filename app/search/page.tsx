import Link from 'next/link';
import { headers } from 'next/headers';
import { getSettingsForBrandDomain } from '@/lib/api/settings';
import { getAnnouncementsPageData } from '@/lib/api/announcements';
import { getFaqsPageData } from '@/lib/api/faqs';
import type { AnnouncementListSection } from '@/types/announcements';
import type { FaqListSection } from '@/types/faqs';
import type { SettingsAvailableBrand } from '@/types/settings';

type SearchPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

type SearchResult = {
  id: string;
  title: string;
  description: string;
  href: string;
  category: 'programs' | 'announcements' | 'faq' | 'pages';
  external?: boolean;
};

function readQuery(value: string | string[] | undefined): { raw: string; normalized: string } {
  const raw = Array.isArray(value) ? (value[0] || '').trim() : (value || '').trim();
  return { raw, normalized: raw.toLowerCase() };
}

function toProgramsHref(rawUrl?: string | null): string | null {
  const raw = (rawUrl || '').trim();
  if (!raw) return null;
  const origin = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return `${origin.replace(/\/+$/, '')}/programs`;
}

function searchText(...parts: Array<string | null | undefined>): string {
  return parts.filter(Boolean).join(' ').toLowerCase();
}

function toProgramResult(brand: SettingsAvailableBrand): SearchResult {
  const location = (brand.location || [brand.city, brand.country].filter(Boolean).join(', ') || brand.address || '').trim();
  const href = toProgramsHref(brand.landing_url || brand.website_url) || '/programs/discover';
  return {
    id: `program-${brand.id}`,
    title: brand.name,
    description: location || 'Program destination',
    href,
    category: 'programs',
    external: /^https?:\/\//i.test(href),
  };
}

function matchesQuery(result: SearchResult, query: string): boolean {
  if (!query) return true;
  return searchText(result.title, result.description).includes(query);
}

function CategoryHeading({ label }: { label: string }) {
  return <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">{label}</h2>;
}

function ResultCard({ result }: { result: SearchResult }) {
  const className = 'block rounded-xl border border-slate-200 bg-white px-4 py-3 transition-colors hover:border-[var(--brand-accent)] hover:bg-[var(--brand-accent-soft)]/40';

  if (result.external) {
    return (
      <a href={result.href} target="_blank" rel="noopener noreferrer" className={className}>
        <p className="text-sm font-semibold text-slate-900">{result.title}</p>
        <p className="mt-1 text-sm text-slate-600">{result.description}</p>
      </a>
    );
  }

  return (
    <Link href={result.href} className={className}>
      <p className="text-sm font-semibold text-slate-900">{result.title}</p>
      <p className="mt-1 text-sm text-slate-600">{result.description}</p>
    </Link>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const { raw: queryRaw, normalized: query } = readQuery(resolvedSearchParams.q);
  const host = (await headers()).get('host') || '';

  const [settingsResult, announcementsResult, faqsResult] = await Promise.allSettled([
    getSettingsForBrandDomain(host),
    getAnnouncementsPageData(host),
    getFaqsPageData(host),
  ]);

  const programResults: SearchResult[] =
    settingsResult.status === 'fulfilled'
      ? (settingsResult.value.available_brands || []).map(toProgramResult).filter((item) => matchesQuery(item, query))
      : [];

  const announcementItems =
    announcementsResult.status === 'fulfilled'
      ? (announcementsResult.value.sections.find((section): section is AnnouncementListSection => section.type === 'announcement_list')?.data || [])
      : [];
  const announcementResults: SearchResult[] = announcementItems
    .map((item) => {
      const href = item.href?.trim() || '/announcements';
      return {
        id: `announcement-${item.id}`,
        title: item.title?.trim() || 'Announcement',
        description: item.excerpt?.trim() || item.category?.trim() || 'Latest update',
        href,
        category: 'announcements',
        external: /^https?:\/\//i.test(href),
      } as SearchResult;
    })
    .filter((item) => matchesQuery(item, query));

  const faqItems =
    faqsResult.status === 'fulfilled'
      ? (faqsResult.value.sections.find((section): section is FaqListSection => section.type === 'faq_list')?.content.items || [])
      : [];
  const faqResults: SearchResult[] = faqItems
    .map<SearchResult>((item) => ({
      id: `faq-${item.id}`,
      title: item.question,
      description: item.answer,
      href: '/faq',
      category: 'faq',
    }))
    .filter((item) => matchesQuery(item, query));

  const pageResults: SearchResult[] = [
    { id: 'page-home', title: 'Home', description: 'Main landing page', href: '/', category: 'pages' },
    { id: 'page-programs', title: 'Programs', description: 'Program landing and highlights', href: '/programs', category: 'pages' },
    { id: 'page-partners', title: 'Partners & Sponsors', description: 'Partnership opportunities and sponsors', href: '/partners', category: 'pages' },
    { id: 'page-announcements', title: 'Announcements', description: 'Latest news and updates', href: '/announcements', category: 'pages' },
    { id: 'page-faq', title: 'FAQ', description: 'Frequently asked questions', href: '/faq', category: 'pages' },
  ] satisfies SearchResult[];
  const filteredPageResults = pageResults.filter((item) => matchesQuery(item, query));

  const totalResults = programResults.length + announcementResults.length + faqResults.length + filteredPageResults.length;

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Search</h1>
        <p className="mt-2 text-sm text-slate-600">Search across programs, announcements, FAQ, and key pages.</p>
        {queryRaw ? (
          <p className="mt-2 text-sm text-slate-600">
            Showing results for <span className="font-semibold text-slate-900">&quot;{queryRaw}&quot;</span> ({totalResults})
          </p>
        ) : (
          <p className="mt-2 text-sm text-slate-600">Enter a keyword from the navbar search box.</p>
        )}

        {queryRaw && totalResults === 0 ? (
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            No results found for <span className="font-semibold text-slate-900">&quot;{queryRaw}&quot;</span>.
          </div>
        ) : (
          <div className="mt-6 space-y-8">
            {filteredPageResults.length > 0 && (
              <section>
                <CategoryHeading label="Pages" />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredPageResults.map((result) => <ResultCard key={result.id} result={result} />)}
                </div>
              </section>
            )}

            {programResults.length > 0 && (
              <section>
                <CategoryHeading label="Programs" />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {programResults.map((result) => <ResultCard key={result.id} result={result} />)}
                </div>
              </section>
            )}

            {announcementResults.length > 0 && (
              <section>
                <CategoryHeading label="Announcements" />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {announcementResults.map((result) => <ResultCard key={result.id} result={result} />)}
                </div>
              </section>
            )}

            {faqResults.length > 0 && (
              <section>
                <CategoryHeading label="FAQ" />
                <div className="grid gap-3 sm:grid-cols-2">
                  {faqResults.map((result) => <ResultCard key={result.id} result={result} />)}
                </div>
              </section>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
