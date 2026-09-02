"use client";

import { decodeHtmlEntities, sanitizeRichTextHtml } from "@/lib/content/richText";

interface FieldHelpTextProps {
  html?: string | null;
  className?: string;
}

export function plainTextFromRichText(html?: string | null): string {
  if (!html) return "";

  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h1|h2|h3|h4|h5|h6|blockquote)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+\n/g, "\n")
    .replace(/\n\s+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

export function hasRichTextContent(html?: string | null): boolean {
  return plainTextFromRichText(html).length > 0;
}

export function FieldHelpText({ html, className }: FieldHelpTextProps) {
  const safeHtml = sanitizeRichTextHtml(decodeHtmlEntities(html ?? ""));
  if (!hasRichTextContent(safeHtml)) return null;

  return (
    <div
      className={[
        "prose prose-sm max-w-none text-slate-600 prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0 prose-a:text-primary",
        className ?? "",
      ].join(" ").trim()}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
