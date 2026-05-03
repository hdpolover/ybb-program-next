'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ExternalLink, ImagePlus, Loader2, Paperclip, RefreshCw, Search, Trash2, X } from 'lucide-react';
import { useSettings } from '@/components/providers/SettingsProvider';
import { formatDate } from '@/lib/utils';

type TicketStatus = 'open' | 'in_progress' | 'waiting_response' | 'resolved' | 'closed';
type TicketPriority = 'low' | 'normal' | 'high' | 'urgent';

type SupportTicketAttachment = {
  fileId: string;
  fileName: string;
  fileUrl: string;
  mimeType?: string;
  uploadedAt?: string;
};

type TicketSummary = {
  id: string;
  ticketNumber: string;
  category: string;
  subCategory?: string | null;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
};

type TicketDetail = TicketSummary & {
  description: string;
  messages?: Array<{
    id: string;
    message: string;
    isFromAdmin: boolean;
    senderName: string;
    createdAt: string;
    attachments?: SupportTicketAttachment[];
  }>;
};

type CategoryOption = {
  value: string;
  label: string;
  subCategories: Array<{ value: string; label: string }>;
};

const CATEGORY_OPTIONS: CategoryOption[] = [
  {
    value: 'application',
    label: 'Application',
    subCategories: [
      { value: 'registration', label: 'Registration Form' },
      { value: 'eligibility', label: 'Eligibility' },
      { value: 'submission-status', label: 'Submission Status' },
    ],
  },
  {
    value: 'payment',
    label: 'Payment',
    subCategories: [
      { value: 'payment-proof', label: 'Payment Proof' },
      { value: 'payment-method', label: 'Payment Method' },
      { value: 'invoice-receipt', label: 'Invoice / Receipt' },
    ],
  },
  {
    value: 'technical',
    label: 'Technical',
    subCategories: [
      { value: 'login-access', label: 'Login / Access' },
      { value: 'dashboard-error', label: 'Dashboard Error' },
      { value: 'document-issue', label: 'Document Issue' },
    ],
  },
  {
    value: 'program',
    label: 'Program Information',
    subCategories: [
      { value: 'schedule', label: 'Schedule' },
      { value: 'requirements', label: 'Program Requirements' },
      { value: 'certificate', label: 'Certificate' },
    ],
  },
  {
    value: 'other',
    label: 'Other',
    subCategories: [{ value: 'general-inquiry', label: 'General Inquiry' }],
  },
];

function sanitizeRichHtml(value: string): string {
  if (!value.trim()) return '';
  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/<(?!\/?(p|br|strong|b|em|i|u|ul|ol|li|blockquote|code|pre)\b)[^>]*>/gi, '');
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildTicketDescription(
  description: string,
  attachments: SupportTicketAttachment[],
): string {
  const sanitizedDescription = sanitizeRichHtml(description);
  if (attachments.length === 0) return sanitizedDescription;

  const attachmentList = attachments
    .map(
      (attachment) =>
        `<li><strong>${escapeHtml(attachment.fileName)}</strong>: ${escapeHtml(attachment.fileUrl)}</li>`,
    )
    .join('');

  return `${sanitizedDescription}<p><strong>Uploaded screenshots</strong></p><ul>${attachmentList}</ul>`;
}

function stripUploadedScreenshotsSection(value: string): string {
  return value
    .replace(/<p>\s*<strong>\s*Uploaded screenshots\s*<\/strong>\s*<\/p>\s*<ul>[\s\S]*?<\/ul>/i, '')
    .trim();
}

function guessMimeTypeFromUrl(url: string): string | undefined {
  return /\.(png|jpe?g|gif|webp|bmp|svg)(\?|#|$)/i.test(url) ? 'image/*' : undefined;
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function getAttachmentAccessUrl(attachment: SupportTicketAttachment): string {
  return isUuid(attachment.fileId)
    ? `/api/support/attachments/${encodeURIComponent(attachment.fileId)}`
    : attachment.fileUrl;
}

function toTitleCaseFromToken(value: string): string {
  return value
    .replace(/[_-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function getStatusChipClass(status: TicketStatus): string {
  switch (status) {
    case 'open':
      return 'border-blue-200 bg-blue-50 text-blue-700';
    case 'in_progress':
      return 'border-amber-200 bg-amber-50 text-amber-700';
    case 'waiting_response':
      return 'border-purple-200 bg-purple-50 text-purple-700';
    case 'resolved':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    case 'closed':
      return 'border-zinc-200 bg-zinc-100 text-zinc-700';
    default:
      return 'border-zinc-200 bg-zinc-100 text-zinc-700';
  }
}

function getPriorityChipClass(priority: TicketPriority): string {
  switch (priority) {
    case 'urgent':
      return 'border-red-200 bg-red-50 text-red-700';
    case 'high':
      return 'border-orange-200 bg-orange-50 text-orange-700';
    case 'normal':
      return 'border-sky-200 bg-sky-50 text-sky-700';
    case 'low':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    default:
      return 'border-zinc-200 bg-zinc-100 text-zinc-700';
  }
}

function extractScreenshotAttachments(value: string): SupportTicketAttachment[] {
  if (!value.trim()) return [];
  const normalized = value.replace(/&amp;/gi, '&');
  const matches = normalized.match(/https?:\/\/[^\s<>"')]+/gi) ?? [];
  const urls = Array.from(new Set(matches.map((url) => url.replace(/[),.;]+$/, ''))));

  return urls.map((fileUrl, index) => {
    let fileName = `Screenshot ${index + 1}`;
    try {
      const pathName = decodeURIComponent(new URL(fileUrl).pathname);
      const lastSegment = pathName.split('/').filter(Boolean).pop();
      if (lastSegment) fileName = lastSegment;
    } catch {
      // Keep default label for malformed URLs.
    }

    return {
      fileId: `external-${index}`,
      fileName,
      fileUrl,
      mimeType: guessMimeTypeFromUrl(fileUrl),
    };
  });
}

function richTextToPlain(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h1|h2|h3|h4|h5|h6|blockquote)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+\n/g, '\n')
    .replace(/\n\s+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function RichTextEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const runCommand = (command: 'bold' | 'italic' | 'underline' | 'insertUnorderedList') => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command);
    onChange(editorRef.current.innerHTML);
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white">
      <div className="flex items-center gap-1 border-b border-zinc-200 p-2">
        <button
          type="button"
          onClick={() => runCommand('bold')}
          className="rounded border border-zinc-200 px-2 py-1 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => runCommand('italic')}
          className="rounded border border-zinc-200 px-2 py-1 text-[11px] italic text-zinc-700 hover:bg-zinc-50"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => runCommand('underline')}
          className="rounded border border-zinc-200 px-2 py-1 text-[11px] underline text-zinc-700 hover:bg-zinc-50"
        >
          U
        </button>
        <button
          type="button"
          onClick={() => runCommand('insertUnorderedList')}
          className="rounded border border-zinc-200 px-2 py-1 text-[11px] text-zinc-700 hover:bg-zinc-50"
        >
          • List
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        role="textbox"
        aria-label={placeholder}
        className="min-h-[140px] w-full p-3 text-sm text-zinc-700 outline-none [&_li]:ml-4 [&_p]:mb-1"
        onInput={() => onChange(editorRef.current?.innerHTML ?? '')}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
    </div>
  );
}

function AttachmentPreview({
  attachments,
  onRemove,
}: {
  attachments: SupportTicketAttachment[];
  onRemove?: (fileId: string) => void;
}) {
  if (attachments.length === 0) return null;

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {attachments.map((attachment) => {
        const isImage = (attachment.mimeType ?? '').startsWith('image/');
        return (
          <div key={attachment.fileId} className="rounded-md border border-zinc-200 bg-zinc-50 p-2">
            {isImage ? (
              <a href={getAttachmentAccessUrl(attachment)} target="_blank" rel="noreferrer" className="block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getAttachmentAccessUrl(attachment)}
                  alt={attachment.fileName}
                  className="h-28 w-full rounded object-cover"
                />
              </a>
            ) : (
              <a
                href={getAttachmentAccessUrl(attachment)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
              >
                <Paperclip className="h-3.5 w-3.5" />
                Open file
              </a>
            )}
            <div className="mt-1 flex items-start justify-between gap-2">
              <p className="line-clamp-1 text-[11px] text-zinc-600">{attachment.fileName}</p>
              {onRemove ? (
                <button
                  type="button"
                  onClick={() => onRemove(attachment.fileId)}
                  className="rounded p-1 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700"
                  aria-label={`Remove ${attachment.fileName}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function SupportTicketsPage() {
  const { settings } = useSettings();
  const programId = settings?.active_program?.id ?? '';

  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<TicketDetail | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [replying, setReplying] = useState(false);
  const [uploadingCreateAttachment, setUploadingCreateAttachment] = useState(false);
  const [uploadingReplyAttachment, setUploadingReplyAttachment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const latestRequestedIdRef = useRef<string | null>(null);
  const [search, setSearch] = useState('');

  const [category, setCategory] = useState(CATEGORY_OPTIONS[0].value);
  const [subCategory, setSubCategory] = useState(CATEGORY_OPTIONS[0].subCategories[0]?.value ?? '');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [createAttachments, setCreateAttachments] = useState<SupportTicketAttachment[]>([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyAttachments, setReplyAttachments] = useState<SupportTicketAttachment[]>([]);
  const [isScreenshotDrawerOpen, setIsScreenshotDrawerOpen] = useState(false);

  const selectedCategoryOption = useMemo(
    () => CATEGORY_OPTIONS.find((option) => option.value === category) ?? CATEGORY_OPTIONS[0],
    [category],
  );

  const filteredTickets = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tickets;
    return tickets.filter(
      (ticket) =>
        ticket.ticketNumber.toLowerCase().includes(q) ||
        ticket.subject.toLowerCase().includes(q) ||
        ticket.category.toLowerCase().includes(q) ||
        (ticket.subCategory ?? '').toLowerCase().includes(q),
    );
  }, [search, tickets]);

  const descriptionPlainText = useMemo(() => richTextToPlain(description), [description]);
  const replyPlainText = useMemo(() => richTextToPlain(replyMessage), [replyMessage]);
  const originalMessage = useMemo(
    () => selectedTicket?.messages?.find((message) => !message.isFromAdmin),
    [selectedTicket],
  );
  const originalContent =
    selectedTicket?.description?.trim() ? selectedTicket.description : (originalMessage?.message ?? '');
  const originalDescription = useMemo(() => {
    return sanitizeRichHtml(stripUploadedScreenshotsSection(originalContent));
  }, [originalContent]);
  const extractedOriginalAttachments = useMemo(
    () => extractScreenshotAttachments(originalContent),
    [originalContent],
  );
  const originalAttachments = useMemo(() => {
    const merged = new Map<string, SupportTicketAttachment>();
    const combined = [...(originalMessage?.attachments ?? []), ...extractedOriginalAttachments];

    combined.forEach((attachment, index) => {
      if (!attachment.fileUrl) return;
      if (merged.has(attachment.fileUrl)) return;

      merged.set(attachment.fileUrl, {
        ...attachment,
        fileId: attachment.fileId || `${attachment.fileUrl}-${index}`,
        fileName: attachment.fileName || `Screenshot ${merged.size + 1}`,
        mimeType: attachment.mimeType ?? guessMimeTypeFromUrl(attachment.fileUrl),
      });
    });

    return Array.from(merged.values());
  }, [extractedOriginalAttachments, originalMessage?.attachments]);

  const loadTickets = useCallback(async () => {
    setLoadingList(true);
    setError(null);
    try {
      const res = await fetch('/api/support/tickets', { cache: 'no-store' });
      const json = (await res.json().catch(() => null)) as
        | { message?: string; data?: TicketSummary[] }
        | null;

      if (!res.ok) {
        throw new Error(json?.message ?? 'Failed to load support tickets');
      }

      const items = Array.isArray(json?.data) ? json.data : [];
      setTickets(items);
      if (items.length > 0 && !selectedId) {
        setSelectedId(items[0].id);
      }
      if (items.length === 0) {
        setSelectedId(null);
        setSelectedTicket(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load support tickets');
    } finally {
      setLoadingList(false);
    }
  }, [selectedId]);

  const loadTicketDetail = useCallback(async (id: string) => {
    latestRequestedIdRef.current = id;
    setLoadingDetail(true);
    setError(null);
    try {
      const res = await fetch(`/api/support/tickets/${id}`, { cache: 'no-store' });
      const json = (await res.json().catch(() => null)) as
        | { message?: string; data?: TicketDetail }
        | null;
      if (!res.ok) {
        throw new Error(json?.message ?? 'Failed to load support ticket detail');
      }
      if (latestRequestedIdRef.current === id) {
        setSelectedTicket((json?.data as TicketDetail) ?? null);
      }
    } catch (err) {
      if (latestRequestedIdRef.current === id) {
        setError(err instanceof Error ? err.message : 'Failed to load support ticket detail');
      }
    } finally {
      if (latestRequestedIdRef.current === id) {
        setLoadingDetail(false);
      }
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadTickets();
  }, [loadTickets]);

  useEffect(() => {
    if (!selectedId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadTicketDetail(selectedId);
  }, [loadTicketDetail, selectedId]);

  async function uploadAttachment(file: File): Promise<SupportTicketAttachment> {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/support/attachments', {
      method: 'POST',
      body: form,
    });
    const json = (await res.json().catch(() => null)) as
      | { message?: string; data?: SupportTicketAttachment }
      | null;
    if (!res.ok || !json?.data) {
      throw new Error(json?.message ?? 'Failed to upload attachment');
    }
    return json.data;
  }

  async function handleAttachmentSelection(
    files: FileList | null,
    target: 'create' | 'reply',
  ) {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    if (target === 'create') setUploadingCreateAttachment(true);
    if (target === 'reply') setUploadingReplyAttachment(true);
    setError(null);
    try {
      const uploaded = await Promise.all(fileArray.map(uploadAttachment));
      if (target === 'create') {
        setCreateAttachments((prev) => [...prev, ...uploaded].slice(0, 6));
      } else {
        setReplyAttachments((prev) => [...prev, ...uploaded].slice(0, 6));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload attachment');
    } finally {
      if (target === 'create') setUploadingCreateAttachment(false);
      if (target === 'reply') setUploadingReplyAttachment(false);
    }
  }

  async function handleCreateTicket(event: React.FormEvent) {
    event.preventDefault();
    if (!descriptionPlainText) {
      setError('Description cannot be empty.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programId: programId || undefined,
          category: category.trim(),
          subCategory: subCategory || undefined,
          subject: subject.trim(),
          description: sanitizeRichHtml(description),
          attachments: createAttachments,
        }),
      });

      let json = (await res.json().catch(() => null)) as { message?: string; data?: { id?: string } } | null;
      let finalResponse = res;
      const createErrorMessage = (json?.message ?? '').toLowerCase();
      const hasUnsupportedFieldError =
        createErrorMessage.includes('should not exist') &&
        (createErrorMessage.includes('programid') || createErrorMessage.includes('attachments'));

      if (!res.ok && hasUnsupportedFieldError) {
        finalResponse = await fetch('/api/support/tickets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: category.trim(),
            subCategory: subCategory || undefined,
            subject: subject.trim(),
            description: buildTicketDescription(description, createAttachments),
          }),
        });
        json = (await finalResponse.json().catch(() => null)) as { message?: string; data?: { id?: string } } | null;
      }

      if (!finalResponse.ok) {
        throw new Error(json?.message ?? 'Failed to create support ticket');
      }
      setSubject('');
      setDescription('');
      setCreateAttachments([]);
      setSubCategory(selectedCategoryOption.subCategories[0]?.value ?? '');
      await loadTickets();
      if (json?.data?.id) {
        setSelectedId(json.data.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create support ticket');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReply(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedId || (!replyPlainText && replyAttachments.length === 0)) return;
    setReplying(true);
    setError(null);
    try {
      const res = await fetch(`/api/support/tickets/${selectedId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: sanitizeRichHtml(replyMessage), attachments: replyAttachments }),
      });
      const json = (await res.json().catch(() => null)) as { message?: string } | null;
      if (!res.ok) {
        throw new Error(json?.message ?? 'Failed to send reply');
      }
      setReplyMessage('');
      setReplyAttachments([]);
      await loadTicketDetail(selectedId);
      await loadTickets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reply');
    } finally {
      setReplying(false);
    }
  }

  return (
    <main className="space-y-4">
      <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
          Support Center
        </div>
        <h1 className="mt-1 text-xl font-bold text-zinc-900">Support Tickets</h1>
        <p className="text-sm text-zinc-500">
          Report issues with rich details, screenshots, and track replies from our support team.
        </p>
      </section>

      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <section className="grid gap-4 lg:grid-cols-[380px_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <form onSubmit={handleCreateTicket} className="space-y-3">
              <h2 className="text-sm font-semibold text-zinc-900">Create Ticket</h2>

              <label className="block text-xs font-medium text-zinc-600">
                Category
                <select
                  value={category}
                  onChange={(event) => {
                    const nextCategory = event.target.value;
                    const nextOption =
                      CATEGORY_OPTIONS.find((option) => option.value === nextCategory) ?? CATEGORY_OPTIONS[0];
                    setCategory(nextCategory);
                    setSubCategory(nextOption.subCategories[0]?.value ?? '');
                  }}
                  required
                  className="mt-1 block w-full rounded-md border border-zinc-200 px-2.5 py-2 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-xs font-medium text-zinc-600">
                Sub-category
                <select
                  value={subCategory}
                  onChange={(event) => setSubCategory(event.target.value)}
                  className="mt-1 block w-full rounded-md border border-zinc-200 px-2.5 py-2 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {selectedCategoryOption.subCategories.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-xs font-medium text-zinc-600">
                Subject
                <input
                  type="text"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border border-zinc-200 px-2.5 py-2 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Brief summary of your issue"
                />
              </label>

              <div className="space-y-1">
                <p className="text-xs font-medium text-zinc-600">Description</p>
                <RichTextEditor
                  value={description}
                  onChange={setDescription}
                  placeholder="Describe your issue in detail (steps, expected result, actual result)."
                />
              </div>

              <div className="space-y-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50">
                  <ImagePlus className="h-3.5 w-3.5" />
                  {uploadingCreateAttachment ? 'Uploading images...' : 'Attach screenshots'}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(event) => {
                      void handleAttachmentSelection(event.target.files, 'create');
                      event.currentTarget.value = '';
                    }}
                  />
                </label>
                <AttachmentPreview
                  attachments={createAttachments}
                  onRemove={(fileId) =>
                    setCreateAttachments((prev) => prev.filter((attachment) => attachment.fileId !== fileId))
                  }
                />
              </div>

              <button
                type="submit"
                disabled={submitting || uploadingCreateAttachment || !subject.trim() || !descriptionPlainText}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-500 px-3 py-2 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 hover:bg-blue-600"
                aria-busy={submitting || uploadingCreateAttachment}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Submitting ticket...
                  </>
                ) : uploadingCreateAttachment ? (
                  'Uploading screenshots...'
                ) : (
                  'Submit Ticket'
                )}
              </button>
            </form>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-900">My Tickets</h2>
              <button
                type="button"
                onClick={() => void loadTickets()}
                className="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-2 py-1 text-[11px] text-zinc-600 hover:bg-zinc-50"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </button>
            </div>
            <div className="relative mb-2">
              <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by ticket number or subject"
                className="w-full rounded-md border border-zinc-200 py-2 pl-8 pr-3 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="max-h-[320px] space-y-2 overflow-y-auto">
              {loadingList ? <p className="text-xs text-zinc-500">Loading tickets...</p> : null}
              {!loadingList && filteredTickets.length === 0 ? (
                <p className="text-xs text-zinc-500">No tickets found.</p>
              ) : null}
              {!loadingList &&
                filteredTickets.map((ticket) => (
                  <button
                    key={ticket.id}
                    type="button"
                     onClick={() => {
                       latestRequestedIdRef.current = ticket.id;
                       setIsScreenshotDrawerOpen(false);
                       setSelectedId(ticket.id);
                       setSelectedTicket(null);
                     }}
                    className={`w-full rounded-md border p-2 text-left ${
                      selectedId === ticket.id
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-zinc-200 bg-white hover:bg-zinc-50'
                    }`}
                  >
                    <p className="text-[11px] font-semibold text-zinc-700">{ticket.ticketNumber}</p>
                    <p className="line-clamp-1 text-xs font-medium text-zinc-800">{ticket.subject}</p>
                    <p className="text-[11px] text-zinc-500">
                      {ticket.status} · {ticket.priority}
                      {ticket.subCategory ? ` · ${ticket.subCategory}` : ''}
                    </p>
                  </button>
                ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          {!selectedId ? <p className="text-sm text-zinc-500">Select a ticket to view details.</p> : null}
          {selectedId && loadingDetail ? <p className="text-sm text-zinc-500">Loading ticket detail...</p> : null}
          {selectedTicket ? (
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                  {selectedTicket.ticketNumber}
                </p>
                <h3 className="text-base font-semibold text-zinc-900">{selectedTicket.subject}</h3>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                    {toTitleCaseFromToken(selectedTicket.category)}
                  </span>
                  {selectedTicket.subCategory ? (
                    <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
                      {toTitleCaseFromToken(selectedTicket.subCategory)}
                    </span>
                  ) : null}
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${getStatusChipClass(selectedTicket.status)}`}
                  >
                    {toTitleCaseFromToken(selectedTicket.status)}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${getPriorityChipClass(selectedTicket.priority)}`}
                  >
                    Priority: {toTitleCaseFromToken(selectedTicket.priority)}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-700">
                    Created {formatDate(selectedTicket.createdAt)}
                  </span>
                </div>
              </div>

              <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-xs font-medium text-zinc-700">Original Description</p>
                {originalDescription ? (
                  <div
                    className="prose prose-sm mt-1 max-w-none text-zinc-700"
                    dangerouslySetInnerHTML={{ __html: originalDescription }}
                  />
                ) : (
                  <p className="mt-1 text-sm text-zinc-500">No description provided.</p>
                )}
                {originalAttachments.length > 0 ? (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => setIsScreenshotDrawerOpen(true)}
                      className="inline-flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                    >
                      <ImagePlus className="h-3.5 w-3.5" />
                      View screenshots ({originalAttachments.length})
                    </button>
                  </div>
                ) : null}
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-zinc-900">Conversation</h4>
                {selectedTicket.messages && selectedTicket.messages.length > 0 ? (
                  selectedTicket.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`rounded-md border p-3 ${
                        message.isFromAdmin ? 'border-blue-200 bg-blue-50/50' : 'border-zinc-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-semibold text-zinc-700">{message.senderName}</p>
                        <p className="text-[11px] text-zinc-500">{formatDate(message.createdAt)}</p>
                      </div>
                      <div
                        className="prose prose-sm mt-1 max-w-none text-zinc-700"
                        dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(message.message) }}
                      />
                      {message.attachments && message.attachments.length > 0 ? (
                        <div className="mt-2">
                          <AttachmentPreview attachments={message.attachments} />
                        </div>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-zinc-500">No replies yet.</p>
                )}
              </div>

              <form onSubmit={handleReply} className="space-y-2">
                <p className="text-xs font-medium text-zinc-600">Send reply</p>
                <RichTextEditor
                  value={replyMessage}
                  onChange={setReplyMessage}
                  placeholder="Add extra details or follow-up screenshots."
                />
                <div className="space-y-2">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50">
                    <ImagePlus className="h-3.5 w-3.5" />
                    {uploadingReplyAttachment ? 'Uploading images...' : 'Attach screenshots'}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(event) => {
                        void handleAttachmentSelection(event.target.files, 'reply');
                        event.currentTarget.value = '';
                      }}
                    />
                  </label>
                  <AttachmentPreview
                    attachments={replyAttachments}
                    onRemove={(fileId) =>
                      setReplyAttachments((prev) => prev.filter((attachment) => attachment.fileId !== fileId))
                    }
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={replying || (!replyPlainText && replyAttachments.length === 0)}
                    className="rounded-md bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60 hover:bg-blue-600"
                  >
                    {replying ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </form>
            </div>
          ) : null}
        </div>
      </section>

      {isScreenshotDrawerOpen ? (
        <div className="fixed inset-0 z-50 flex">
          <button
            type="button"
            aria-label="Close screenshots drawer"
            className="h-full flex-1 bg-black/50"
            onClick={() => setIsScreenshotDrawerOpen(false)}
          />
          <aside className="h-full w-full max-w-xl border-l border-zinc-200 bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between gap-2 border-b border-zinc-200 pb-3">
              <div>
                <p className="text-sm font-semibold text-zinc-900">Ticket screenshots</p>
                <p className="text-xs text-zinc-500">{originalAttachments.length} file(s)</p>
              </div>
              <button
                type="button"
                onClick={() => setIsScreenshotDrawerOpen(false)}
                className="rounded-md border border-zinc-200 p-1.5 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700"
                aria-label="Close drawer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3 overflow-y-auto pr-1">
              {originalAttachments.map((attachment) => {
                const isImage =
                  (attachment.mimeType ?? '').startsWith('image/') ||
                  /\.(png|jpe?g|gif|webp|bmp|svg)(\?|#|$)/i.test(attachment.fileUrl);

                return (
                  <div key={attachment.fileId} className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
                    {isImage ? (
                        <a href={getAttachmentAccessUrl(attachment)} target="_blank" rel="noreferrer" className="block">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getAttachmentAccessUrl(attachment)}
                            alt={attachment.fileName}
                            className="h-44 w-full rounded-md object-cover"
                          />
                        </a>
                      ) : null}
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <p className="line-clamp-1 text-xs font-medium text-zinc-700">{attachment.fileName}</p>
                      <a
                        href={getAttachmentAccessUrl(attachment)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-md border border-zinc-300 bg-white px-2 py-1 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-100"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Open
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      ) : null}
    </main>
  );
}
