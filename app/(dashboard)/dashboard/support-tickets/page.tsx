'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ImagePlus, Loader2, Paperclip, RefreshCw, Search, Trash2, X } from 'lucide-react';
import { useSettings } from '@/components/providers/SettingsProvider';
import EnglishTextInput from '@/components/ui/EnglishTextInput';

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

function formatDateTime(value?: string): string {
  if (!value) return 'Unknown';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown';

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
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

function CompactAttachmentGrid({
  attachments,
}: {
  attachments: SupportTicketAttachment[];
}) {
  if (attachments.length === 0) return null;

  return (
    <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
      {attachments.map((attachment) => {
        const isImage =
          (attachment.mimeType ?? '').startsWith('image/') ||
          /\.(png|jpe?g|gif|webp|bmp|svg)(\?|#|$)/i.test(attachment.fileUrl);

        if (!isImage) {
          return (
            <a
              key={attachment.fileId}
              href={getAttachmentAccessUrl(attachment)}
              target="_blank"
              rel="noreferrer"
              className="line-clamp-2 rounded-md border border-zinc-200 bg-white px-2 py-1 text-[11px] font-medium text-blue-700 hover:bg-zinc-50"
            >
              {attachment.fileName}
            </a>
          );
        }

        return (
          <a
            key={attachment.fileId}
            href={getAttachmentAccessUrl(attachment)}
            target="_blank"
            rel="noreferrer"
            className="overflow-hidden rounded-md border border-zinc-200 bg-zinc-100 hover:border-zinc-300"
            title={attachment.fileName}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getAttachmentAccessUrl(attachment)} alt={attachment.fileName} className="h-16 w-full object-cover" />
          </a>
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
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);

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
      setIsCreateDrawerOpen(false);
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

  function handleSelectTicket(ticketId: string) {
    if (selectedId === ticketId) {
      if (!selectedTicket && !loadingDetail) {
        void loadTicketDetail(ticketId);
      }
      return;
    }

    latestRequestedIdRef.current = ticketId;
    setSelectedId(ticketId);
    setSelectedTicket(null);
  }

  return (
    <main className="space-y-5">
      <section className="flex items-center justify-end">
        <button
          type="button"
          onClick={() => setIsCreateDrawerOpen(true)}
          className="rounded-md bg-blue-500 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-600"
        >
          Create Ticket
        </button>
      </section>

      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <section className="grid gap-5 lg:grid-cols-[520px_minmax(0,1fr)]">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">My Tickets</h2>
              <p className="text-[11px] text-zinc-500">
                {filteredTickets.length} of {tickets.length} ticket(s)
              </p>
            </div>
            <button
              type="button"
              onClick={() => void loadTickets()}
              className="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-2 py-1 text-[11px] text-zinc-600 hover:bg-zinc-50"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </button>
          </div>

          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by ticket number, subject, category, or status"
              className="w-full rounded-md border border-zinc-200 py-2 pl-8 pr-3 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="max-h-[720px] overflow-auto rounded-lg border border-zinc-200">
            <table className="min-w-full divide-y divide-zinc-200 text-xs">
              <thead className="bg-zinc-50 text-left text-[11px] font-semibold uppercase tracking-wide text-zinc-600">
                <tr>
                  <th className="px-3 py-2">Ticket</th>
                  <th className="px-3 py-2">Subject</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Priority</th>
                  <th className="px-3 py-2">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 bg-white">
                {loadingList ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-6 text-center text-zinc-500">
                      Loading tickets...
                    </td>
                  </tr>
                ) : filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-6 text-center text-zinc-500">
                      No tickets found.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSelectTicket(ticket.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          handleSelectTicket(ticket.id);
                        }
                      }}
                      className={`cursor-pointer ${
                        selectedId === ticket.id ? 'bg-blue-50' : 'hover:bg-zinc-50'
                      }`}
                    >
                      <td className="px-3 py-2 align-top">
                        <p className="font-semibold text-zinc-800">{ticket.ticketNumber}</p>
                        <p className="text-[11px] text-zinc-500">{toTitleCaseFromToken(ticket.category)}</p>
                      </td>
                      <td className="px-3 py-2 align-top">
                        <p className="line-clamp-2 font-medium text-zinc-800">{ticket.subject}</p>
                        <p className="line-clamp-1 text-[11px] text-zinc-500">
                          {ticket.subCategory ? toTitleCaseFromToken(ticket.subCategory) : '-'}
                        </p>
                      </td>
                      <td className="px-3 py-2 align-top text-zinc-700">{toTitleCaseFromToken(ticket.status)}</td>
                      <td className="px-3 py-2 align-top text-zinc-700">{toTitleCaseFromToken(ticket.priority)}</td>
                      <td className="px-3 py-2 align-top text-zinc-600">{formatDateTime(ticket.updatedAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          {!selectedId ? <p className="text-sm text-zinc-500">Select a ticket to view details.</p> : null}
          {selectedId && loadingDetail ? <p className="text-sm text-zinc-500">Loading ticket detail...</p> : null}
          {selectedId && !loadingDetail && !selectedTicket ? (
            <p className="text-sm text-zinc-500">Unable to load ticket detail. Try selecting again or refresh.</p>
          ) : null}
          {selectedTicket ? (
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                  {selectedTicket.ticketNumber}
                </p>
                <h3 className="text-base font-semibold text-zinc-900">{selectedTicket.subject}</h3>
                <div className="mt-3 grid gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Category</p>
                    <p className="text-sm font-medium text-zinc-800">{toTitleCaseFromToken(selectedTicket.category)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Sub-category</p>
                    <p className="text-sm font-medium text-zinc-800">
                      {selectedTicket.subCategory ? toTitleCaseFromToken(selectedTicket.subCategory) : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Status</p>
                    <p className="text-sm font-medium text-zinc-800">{toTitleCaseFromToken(selectedTicket.status)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Priority</p>
                    <p className="text-sm font-medium text-zinc-800">{toTitleCaseFromToken(selectedTicket.priority)}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Created</p>
                    <p className="text-sm font-medium text-zinc-800">{formatDateTime(selectedTicket.createdAt)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-zinc-900">Conversation</h4>
                {selectedTicket.messages && selectedTicket.messages.length > 0 ? (
                  selectedTicket.messages.map((message, index) => {
                    const isMainThread = originalMessage
                      ? message.id === originalMessage.id
                      : !message.isFromAdmin && index === 0;
                    const attachmentsForDisplay = isMainThread
                      ? Array.from(
                          new Map(
                            [...(message.attachments ?? []), ...originalAttachments]
                              .filter((attachment) => attachment.fileUrl)
                              .map((attachment) => [attachment.fileUrl, attachment]),
                          ).values(),
                        )
                      : (message.attachments ?? []);
                    const messageTypeLabel = isMainThread
                      ? 'Main thread'
                      : message.isFromAdmin
                        ? 'Support reply'
                        : 'Participant reply';

                    return (
                      <div
                        key={message.id}
                        className={`rounded-md border p-3 ${
                          isMainThread
                            ? 'border-amber-200 bg-amber-50/40'
                            : message.isFromAdmin
                              ? 'border-blue-200 bg-blue-50/50'
                              : 'border-zinc-200 bg-white'
                        }`}
                      >
                        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-700">
                              {messageTypeLabel}
                            </span>
                            <p className="text-xs font-semibold text-zinc-700">{message.senderName}</p>
                          </div>
                          <p className="text-[11px] text-zinc-500">{formatDateTime(message.createdAt)}</p>
                        </div>
                        <div
                          className="prose prose-sm max-w-none text-zinc-700"
                          dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(message.message) }}
                        />
                        {attachmentsForDisplay.length > 0 ? (
                          <CompactAttachmentGrid attachments={attachmentsForDisplay} />
                        ) : null}
                      </div>
                    );
                  })
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

      {isCreateDrawerOpen ? (
        <div className="fixed inset-0 z-50 flex">
          <button
            type="button"
            aria-label="Close create ticket drawer"
            className="h-full flex-1 bg-black/50"
            onClick={() => setIsCreateDrawerOpen(false)}
          />
          <aside className="h-full w-full max-w-xl overflow-y-auto border-l border-zinc-200 bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between gap-2 border-b border-zinc-200 pb-3">
              <div>
                <p className="text-sm font-semibold text-zinc-900">Create Ticket</p>
                <p className="text-xs text-zinc-500">Describe your issue and add screenshots when needed.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateDrawerOpen(false)}
                className="rounded-md border border-zinc-200 p-1.5 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700"
                aria-label="Close drawer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="mt-4 space-y-3">
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
                <EnglishTextInput
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
          </aside>
        </div>
      ) : null}

    </main>
  );
}
