// components/legal/LegalDocumentContent.tsx
//
// Renders a brand legal document body (Terms of Service / Privacy Policy). The
// CMS stores either HTML or plain text; shared by the login modals and the
// /terms and /privacy pages so they cannot drift.
import { sanitizeRichTextHtml } from '@/lib/content/richText';

const LOOKS_LIKE_HTML = /<\/?[a-z][\s\S]*>/i;

export default function LegalDocumentContent({ content }: { content: string }) {
  if (LOOKS_LIKE_HTML.test(content)) {
    return (
      <div
        className="prose prose-slate max-w-none text-sm"
        dangerouslySetInnerHTML={{ __html: sanitizeRichTextHtml(content) }}
      />
    );
  }
  return <div className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{content}</div>;
}
