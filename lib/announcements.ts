import { parseApiDate } from '@/lib/utils';

export function formatAnnouncementDateLabel(
  value?: string | null,
  opts?: { timeZone?: string },
): string {
  const raw = (value || '').trim();
  if (!raw) return 'Date TBA';

  const parsed = parseApiDate(raw);
  if (Number.isNaN(parsed.getTime())) return raw;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...(opts?.timeZone ? { timeZone: opts.timeZone } : {}),
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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function markdownToHtml(value: string): string {
  const escaped = escapeHtml(value);
  const withBlocks = escaped
    .replace(/^### (.*)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*)$/gm, '<h1>$1</h1>')
    .replace(/^\s*[-*] (.*)$/gm, '<li>$1</li>');

  const withInline = withBlocks
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');

  const groupedLists = withInline.replace(/(?:<li>.*<\/li>\n?)+/g, (chunk) => `<ul>${chunk}</ul>`);

  return groupedLists
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      if (block.startsWith('<h') || block.startsWith('<ul>') || block.startsWith('<ol>')) {
        return block;
      }

      return `<p>${block.replace(/\n/g, '<br />')}</p>`;
    })
    .join('');
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

export function toAnnouncementHtml(value?: string | null): string {
  const raw = decodePossiblyEncodedHtml((value ?? '').trim());
  if (!raw) return '';

  const hasHtml = /<\/?[a-z][\s\S]*>/i.test(raw);
  const html = hasHtml ? raw : markdownToHtml(raw);
  return sanitizeAnnouncementHtml(html);
}
