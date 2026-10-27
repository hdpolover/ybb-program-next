// lib/legal/legalDocuments.ts
//
// Brand legal documents (Terms of Service / Privacy Policy). Shared by the
// /api/legal-documents BFF route (login modals) and the SSR /terms and /privacy pages.
import { getServerApiBaseUrl } from '@/lib/server/apiBaseUrl';

export type LegalDocumentType = 'terms' | 'privacy';

export type LegalDocument = {
  id: string;
  title: string;
  slug: string;
  content: string;
  version: string;
  publishedAt?: string | null;
};

type BrandItem = { id: string; slug: string; websiteUrl?: string | null };

const REVALIDATE_SECONDS = 300;

export function extractData<T>(payload: unknown): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

export function getCandidateSlugs(type: LegalDocumentType): string[] {
  if (type === 'terms') {
    return ['terms-of-service', 'terms-and-conditions', 'terms'];
  }
  return ['privacy-policy', 'privacy'];
}

export function pickDocumentFromList(type: LegalDocumentType, docs: LegalDocument[]): LegalDocument | null {
  const needles = type === 'terms' ? ['terms', 'conditions'] : ['privacy'];
  return (
    docs.find((doc) => {
      const slug = (doc.slug || '').toLowerCase();
      const title = (doc.title || '').toLowerCase();
      return needles.some((needle) => slug.includes(needle) || title.includes(needle));
    }) || null
  );
}

export function matchBrand(brands: BrandItem[], brandDomain: string): BrandItem | null {
  const needle = (brandDomain || '').toLowerCase();
  return (
    brands.find((item) => (item.websiteUrl || '').toLowerCase().includes(needle)) ||
    brands.find((item) => (item.websiteUrl || '').toLowerCase().includes(needle.replace(/^www\./, ''))) ||
    null
  );
}

async function getJson(path: string, brandDomain: string): Promise<unknown | null> {
  const res = await fetch(new URL(path, getServerApiBaseUrl()).toString(), {
    headers: { 'Content-Type': 'application/json', 'x-brand-domain': brandDomain },
    next: { revalidate: REVALIDATE_SECONDS },
  });
  return res.ok ? res.json().catch(() => null) : null;
}

/** Server-side lookup for SSR pages. Null when the brand or document cannot be found. */
export async function fetchLegalDocument(type: LegalDocumentType, brandDomain: string): Promise<LegalDocument | null> {
  const brands = extractData<BrandItem[]>(await getJson('/v1/brands', brandDomain)) || [];
  const brand = matchBrand(brands, brandDomain);
  if (!brand?.slug) return null;

  for (const candidate of getCandidateSlugs(type)) {
    const doc = extractData<LegalDocument | null>(
      await getJson(`/v1/brands/${brand.slug}/legal-documents/${candidate}`, brandDomain),
    );
    if (doc?.content) return doc;
  }

  const docs = extractData<LegalDocument[]>(await getJson(`/v1/brands/${brand.slug}/legal-documents`, brandDomain)) || [];
  return pickDocumentFromList(type, docs);
}
