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
  if (raw && (/^https?:\/\//i.test(raw) || raw.startsWith('/'))) return raw;
  return `/announcements/${encodeURIComponent(String(id))}`;
}

export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}
