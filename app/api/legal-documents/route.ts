import { NextResponse } from 'next/server';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';

type SupportedType = 'terms' | 'privacy';

type BrandItem = {
  id: string;
  slug: string;
  websiteUrl?: string | null;
};

type LegalDocument = {
  id: string;
  title: string;
  slug: string;
  content: string;
  version: string;
  publishedAt?: string | null;
};

function getApiBaseUrl(): string {
  return (process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'https://staging-api.ybbhub.com').replace(
    /\/v1\/?$/,
    '',
  );
}

function extractData<T>(payload: unknown): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

function getCandidateSlugs(type: SupportedType): string[] {
  if (type === 'terms') {
    return ['terms-of-service', 'terms-and-conditions', 'terms'];
  }
  return ['privacy-policy', 'privacy'];
}

function pickDocumentFromList(type: SupportedType, docs: LegalDocument[]): LegalDocument | null {
  const needles = type === 'terms' ? ['terms', 'conditions'] : ['privacy'];
  return (
    docs.find(doc => {
      const slug = (doc.slug || '').toLowerCase();
      const title = (doc.title || '').toLowerCase();
      return needles.some(needle => slug.includes(needle) || title.includes(needle));
    }) || null
  );
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const rawType = (url.searchParams.get('type') || '').toLowerCase();

    if (rawType !== 'terms' && rawType !== 'privacy') {
      return NextResponse.json(
        { statusCode: 400, message: 'Query param type must be terms or privacy', data: null },
        { status: 400 },
      );
    }

    const type = rawType as SupportedType;
    const brandDomain = resolveBrandDomainFromRequest(request);
    const apiBaseUrl = getApiBaseUrl();

    const brandsRes = await fetch(new URL('/v1/brands', apiBaseUrl).toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-brand-domain': brandDomain,
      },
      cache: 'no-store',
    });

    const brandsJson = await brandsRes.json().catch(() => ({}));
    if (!brandsRes.ok) {
      return NextResponse.json(
        {
          statusCode: brandsRes.status,
          message: (brandsJson as { message?: string })?.message || 'Failed to resolve brand context',
          data: null,
        },
        { status: brandsRes.status },
      );
    }

    const brands = extractData<BrandItem[]>(brandsJson) || [];
    const needle = (brandDomain || '').toLowerCase();
    const brand =
      brands.find(item => (item.websiteUrl || '').toLowerCase().includes(needle)) ||
      brands.find(item => (item.websiteUrl || '').toLowerCase().includes(needle.replace(/^www\./, ''))) ||
      null;

    if (!brand?.slug) {
      return NextResponse.json(
        { statusCode: 404, message: 'Brand not found for current domain', data: null },
        { status: 404 },
      );
    }

    const candidates = getCandidateSlugs(type);
    for (const candidate of candidates) {
      const docRes = await fetch(
        new URL(`/v1/brands/${brand.slug}/legal-documents/${candidate}`, apiBaseUrl).toString(),
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-brand-domain': brandDomain,
          },
          cache: 'no-store',
        },
      );

      if (!docRes.ok) continue;

      const docJson = await docRes.json().catch(() => ({}));
      const doc = extractData<LegalDocument | null>(docJson);
      if (doc) {
        return NextResponse.json({
          statusCode: 200,
          message: 'Success',
          data: {
            title: doc.title,
            slug: doc.slug,
            content: doc.content,
            version: doc.version,
            publishedAt: doc.publishedAt ?? null,
          },
        });
      }
    }

    const listRes = await fetch(
      new URL(`/v1/brands/${brand.slug}/legal-documents`, apiBaseUrl).toString(),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-brand-domain': brandDomain,
        },
        cache: 'no-store',
      },
    );

    const listJson = await listRes.json().catch(() => ({}));
    if (!listRes.ok) {
      return NextResponse.json(
        {
          statusCode: listRes.status,
          message: (listJson as { message?: string })?.message || 'Failed to fetch legal documents',
          data: null,
        },
        { status: listRes.status },
      );
    }

    const docs = extractData<LegalDocument[]>(listJson) || [];
    const doc = pickDocumentFromList(type, docs);

    if (!doc) {
      return NextResponse.json(
        { statusCode: 404, message: 'Requested legal document is not available', data: null },
        { status: 404 },
      );
    }

    return NextResponse.json({
      statusCode: 200,
      message: 'Success',
      data: {
        title: doc.title,
        slug: doc.slug,
        content: doc.content,
        version: doc.version,
        publishedAt: doc.publishedAt ?? null,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        statusCode: 500,
        message,
        data: null,
      },
      { status: 500 },
    );
  }
}
