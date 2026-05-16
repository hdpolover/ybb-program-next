import { parseApiDate } from '@/lib/utils';

export function formatAnnouncementDateLabel(value?: string | null): string {
  const raw = (value || '').trim();
  if (!raw) return 'Date TBA';

  const parsed = parseApiDate(raw);
  if (Number.isNaN(parsed.getTime())) return raw;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed);
}

export function resolveAnnouncementHref(id: string | number, href?: string | null): string {
  const raw = (href || '').trim();
  if (raw.startsWith('/announcements/')) return raw;
  return `/announcements/${encodeURIComponent(String(id))}`;
}

export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

export function getAnnouncementActionHref(href?: string | null): string | null {
  const raw = (href || '').trim();
  return raw.length > 0 ? raw : null;
}

export function formatAnnouncementCategoryLabel(value?: string | null): string {
  const normalized = (value || '').trim();
  if (!normalized) return 'General';

  return normalized
    .replace(/[_-]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

export function decodePossiblyEncodedHtml(value: string): string {
  if (!value.includes('&lt;')) return value;
  return value
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&amp;/gi, '&');
}

export function sanitizeAnnouncementHtml(value: string): string {
  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/\s(href|src)\s*=\s*(['"])\s*javascript:[\s\S]*?\2/gi, '');
}
