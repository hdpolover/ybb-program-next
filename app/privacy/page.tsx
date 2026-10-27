// app/privacy/page.tsx
import type { Metadata } from 'next';
import LegalDocumentPage, { LEGAL_PAGE_META } from '@/components/legal/LegalDocumentPage';

// Brand-scoped content, so render per request.
export const dynamic = 'force-dynamic';

const meta = LEGAL_PAGE_META.privacy;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: meta.path },
  openGraph: { title: meta.title, description: meta.description, url: meta.path, type: 'website' },
};

export default function PrivacyPage() {
  return <LegalDocumentPage type="privacy" />;
}
