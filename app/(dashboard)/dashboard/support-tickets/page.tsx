'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw, Search } from 'lucide-react';
import { useSettings } from '@/components/providers/SettingsProvider';
import { formatDate } from '@/lib/utils';

type TicketStatus = 'open' | 'in_progress' | 'waiting_response' | 'resolved' | 'closed';
type TicketPriority = 'low' | 'normal' | 'high' | 'urgent';

type TicketSummary = {
  id: string;
  ticketNumber: string;
  category: string;
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
    attachments?: string[];
  }>;
};

const PRIORITIES: Array<{ value: 'low' | 'normal' | 'high'; label: string }> = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
];

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
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [category, setCategory] = useState('general');
  const [subCategory, setSubCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high'>('normal');
  const [replyMessage, setReplyMessage] = useState('');

  const filteredTickets = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tickets;
    return tickets.filter(
      (ticket) =>
        ticket.ticketNumber.toLowerCase().includes(q) ||
        ticket.subject.toLowerCase().includes(q) ||
        ticket.category.toLowerCase().includes(q),
    );
  }, [search, tickets]);

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

  const loadTicketDetail = useCallback(
    async (id: string) => {
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
        setSelectedTicket((json?.data as TicketDetail) ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load support ticket detail');
      } finally {
        setLoadingDetail(false);
      }
    },
    [],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadTickets();
  }, [loadTickets]);

  useEffect(() => {
    if (!selectedId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadTicketDetail(selectedId);
  }, [loadTicketDetail, selectedId]);

  async function handleCreateTicket(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programId: programId || undefined,
          category: category.trim(),
          subCategory: subCategory.trim() || undefined,
          subject: subject.trim(),
          description: description.trim(),
          priority,
        }),
      });
      const json = (await res.json().catch(() => null)) as { message?: string; data?: { id?: string } } | null;
      if (!res.ok) {
        throw new Error(json?.message ?? 'Failed to create support ticket');
      }
      setSubject('');
      setDescription('');
      setSubCategory('');
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
    if (!selectedId || !replyMessage.trim()) return;
    setReplying(true);
    setError(null);
    try {
      const res = await fetch(`/api/support/tickets/${selectedId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyMessage.trim() }),
      });
      const json = (await res.json().catch(() => null)) as { message?: string } | null;
      if (!res.ok) {
        throw new Error(json?.message ?? 'Failed to send reply');
      }
      setReplyMessage('');
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
          Support
        </div>
        <h1 className="mt-1 text-lg font-bold text-zinc-900">Support Tickets</h1>
        <p className="text-sm text-zinc-500">
          Submit questions or issues and track replies from our support team.
        </p>
      </section>

      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <section className="grid gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <form onSubmit={handleCreateTicket} className="space-y-3">
              <h2 className="text-sm font-semibold text-zinc-900">Create Ticket</h2>

              <label className="block text-xs font-medium text-zinc-600">
                Category
                <input
                  type="text"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border border-zinc-200 px-2.5 py-2 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="general / payment / technical"
                />
              </label>

              <label className="block text-xs font-medium text-zinc-600">
                Sub-category (optional)
                <input
                  type="text"
                  value={subCategory}
                  onChange={(event) => setSubCategory(event.target.value)}
                  className="mt-1 block w-full rounded-md border border-zinc-200 px-2.5 py-2 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="optional detail"
                />
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

              <label className="block text-xs font-medium text-zinc-600">
                Priority
                <select
                  value={priority}
                  onChange={(event) => setPriority(event.target.value as 'low' | 'normal' | 'high')}
                  className="mt-1 block w-full rounded-md border border-zinc-200 px-2.5 py-2 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {PRIORITIES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-xs font-medium text-zinc-600">
                Description
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  required
                  rows={4}
                  className="mt-1 block w-full rounded-md border border-zinc-200 px-2.5 py-2 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Describe the issue in detail"
                />
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-md bg-blue-500 px-3 py-2 text-xs font-semibold text-white disabled:opacity-60 hover:bg-blue-600"
              >
                {submitting ? 'Submitting...' : 'Submit Ticket'}
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
                placeholder="Search tickets"
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
                    onClick={() => setSelectedId(ticket.id)}
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
                <p className="text-xs text-zinc-500">
                  {selectedTicket.status} · {selectedTicket.priority} · Created {formatDate(selectedTicket.createdAt)}
                </p>
              </div>

              <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-xs font-medium text-zinc-700">Original Description</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-700">{selectedTicket.description}</p>
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
                      <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-700">{message.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-zinc-500">No replies yet.</p>
                )}
              </div>

              <form onSubmit={handleReply} className="space-y-2">
                <label className="block text-xs font-medium text-zinc-600">
                  Send reply
                  <textarea
                    value={replyMessage}
                    onChange={(event) => setReplyMessage(event.target.value)}
                    rows={3}
                    required
                    className="mt-1 block w-full rounded-md border border-zinc-200 px-2.5 py-2 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="Write your message to support"
                  />
                </label>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={replying || !replyMessage.trim()}
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
    </main>
  );
}
