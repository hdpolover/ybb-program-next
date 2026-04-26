import { isRecord } from '@/lib/api/response';

export interface DocumentItem {
  id: string;
  title: string;
  description?: string;
  category?: string;
  fileUrl?: string;
  status?: string;
  submissionStatus?: string;
  signedCopyUrl?: string;
  rejectionReason?: string;
  documentType: string;
  updatedAt?: string;
}

function toTitleCaseFromToken(value: string | null | undefined): string {
  if (!value) return '-';

  return value
    .replace(/[_-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function toDocumentItem(value: unknown): DocumentItem | null {
  if (!isRecord(value)) return null;

  const id = typeof value.id === 'string' ? value.id : null;
  const title = typeof value.title === 'string' ? value.title : null;
  if (!id || !title) return null;

  return {
    id,
    title,
    description: typeof value.description === 'string' ? value.description : undefined,
    category: typeof value.category === 'string' ? value.category : undefined,
    fileUrl: typeof value.fileUrl === 'string' ? value.fileUrl : undefined,
    status: typeof value.status === 'string' ? value.status : undefined,
    submissionStatus:
      typeof value.submissionStatus === 'string' ? value.submissionStatus : undefined,
    signedCopyUrl: typeof value.signedCopyUrl === 'string' ? value.signedCopyUrl : undefined,
    rejectionReason: typeof value.rejectionReason === 'string' ? value.rejectionReason : undefined,
    documentType: typeof value.documentType === 'string' ? value.documentType : 'document',
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : undefined,
  };
}

export function formatDocumentStatusLabel(value?: string): string {
  if (!value) return 'Available';
  return toTitleCaseFromToken(value);
}

export function formatDocumentCategoryLabel(value?: string): string {
  if (!value) return 'Program Document';
  return toTitleCaseFromToken(value);
}

export function formatDocumentDateLabel(value?: string): string {
  if (!value) return 'Not available';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return 'Not available';
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed);
}

export function getProgramResourceDetailHref(id: string): string {
  return `/dashboard/documents/resources/${encodeURIComponent(id)}`;
}
