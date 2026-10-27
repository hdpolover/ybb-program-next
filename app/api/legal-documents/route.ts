import { NextResponse } from 'next/server';
import { getServerApiBaseUrl } from '@/lib/server/apiBaseUrl';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';
import { forwardedForHeader } from '@/lib/server/forwardedFor';
import {
  extractData,
  getCandidateSlugs,
  matchBrand,
  pickDocumentFromList,
  type LegalDocument,
  type LegalDocumentType,
} from '@/lib/legal/legalDocuments';

type SupportedType = LegalDocumentType;

function getApiBaseUrl(): string {
  return getServerApiBaseUrl();
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
        ...forwardedForHeader(request),
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

    const brands = extractData<Parameters<typeof matchBrand>[0]>(brandsJson) || [];
    const brand = matchBrand(brands, brandDomain);

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
            ...forwardedForHeader(request),
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
          ...forwardedForHeader(request),
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
