import Link from 'next/link';
import { AlertTriangle, ArrowLeft, Clock, Mail, MessageCircle } from 'lucide-react';
import HistoryList, { type HistoryItem } from '@/components/dashboard/payments/HistoryList';
import HistoryPanel from '@/components/dashboard/payments/HistoryPanel';

export default function PaymentDetailPage({ params }: { params: { id: string } }) {
  // Konten di-hardcode biar cepat, disesuaiin sama kasus realistis di Overview
  const invoice = {
    id: params.id,
    label: 'Program Fee (Final)',
    category: 'Program Fee',
    amount: 450,
    dueDate: 'Dec 05, 2025',
    status: 'unpaid' as const,
  };

  const currency = (v: number) => `$${v.toFixed(2)}`;
  const overdue = false;

  const history: Array<{
    id: string;
    method: string;
    amount: number;
    date: string;
    time: string;
    status: 'cancelled' | 'failed' | 'processing' | 'paid';
    note: string;
  }> = [
    {
      id: 'h1',
      method: 'Virtual Account',
      amount: 450,
      date: 'Nov 10, 2025',
      time: '09:00 AM',
      status: 'processing',
      note: 'Invoice issued for Program Fee (Final). Payment link generated and sent to your email.',
    },
    {
      id: 'h2',
      method: 'Email Reminder',
      amount: 450,
      date: 'Nov 25, 2025',
      time: '08:15 AM',
      status: 'processing',
      note: 'Reminder sent. Please complete payment before Dec 05, 2025 to secure your seat.',
    },
  ];

  if (!invoice) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl bg-white p-4 shadow-[0_8px_30px_rgba(2,6,23,0.06)] ring-1 ring-slate-200">
          <p className="text-sm text-slate-700">Payment not found.</p>
        </div>
        <Link
          href="/dashboard/payments"
          className="inline-flex items-center gap-2 text-sm font-semibold text-pink-700 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Payments
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr,360px]">
        {/* Kolom kiri */}
        <div className="space-y-6">
          {/* Kartu info pembayaran */}
          <div className="rounded-2xl bg-white p-4 shadow-[0_8px_30px_rgba(2,6,23,0.06)] ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-blue-950">Payment Information</p>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <InfoRow label="Payment Name" value={invoice.label} />
              <TagRow label="Category" tag={invoice.category} />
              <InfoRow
                label="Description"
                value="Japan Youth Summit — Final program fee for self-funded participant"
              />
              <InfoRow label="Amount" value={currency(invoice.amount)} />
              <InfoRow label="Due Date" value={`${invoice.dueDate}`} overdue={overdue} />
            </div>
          </div>

          {/* Riwayat pembayaran (paginasi 1 item + filter) */}
          {(() => {
            const items: HistoryItem[] = history.map(h => ({
              id: h.id,
              title:
                h.status === 'cancelled'
                  ? 'Payment Cancelled'
                  : h.status === 'paid'
                    ? 'Payment Completed'
                    : h.status === 'failed'
                      ? 'Payment Rejected'
                      : h.status === 'processing'
                        ? 'Payment Update'
                        : 'Payment Created',
              method: h.method,
              amountLabel: currency(h.amount),
              date: h.date,
              time: h.time,
              badge: h.status === 'cancelled' ? { label: 'Cancelled', tone: 'red' } : undefined,
              note: h.note,
              // Detail buat modal — diisi spesifik buat contoh
              details:
                h.id === 'h1'
                  ? {
                      code: 'TR-17190-1759390503',
                      paymentMethod: 'Vakif Bank',
                      dateTime: 'October 02, 2025 02:35 PM',
                      accountName: 'tretrt',
                      amountLabel: '$10.00',
                      source: 'trtrt',
                      proofUrl: '/img/galeri1.png',
                    }
                  : {
                      code: 'TR-88110-1759400111',
                      paymentMethod: h.method,
                      dateTime: `${h.date} ${h.time}`,
                      accountName: 'Hendra',
                      amountLabel: currency(h.amount),
                      source: 'Dashboard',
                      proofUrl: '/img/galeri2.png',
                    },
              status:
                h.status === 'processing'
                  ? 'pending'
                  : h.status === 'paid'
                    ? 'completed'
                    : h.status === 'cancelled'
                      ? 'cancelled'
                      : h.status === 'failed'
                        ? 'rejected'
                        : 'created',
            }));
            return <HistoryPanel items={items} pageSize={1} />;
          })()}
        </div>

        {/* Kolom kanan */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(2,6,23,0.06)] ring-1 ring-slate-200">
            <div className="bg-blue-600 px-5 py-3 text-white">
              <p className="text-sm font-semibold">Payment Actions</p>
            </div>
            <div className="space-y-3 p-5">
              <div className="flex flex-col items-center text-center">
                <Clock className="h-10 w-10 text-amber-600" />
                <p className="mt-2 font-semibold text-blue-950">Awaiting Payment</p>
                <p className="mt-1 text-sm text-slate-600">
                  Please complete your payment before the due date.
                </p>
              </div>
              <button className="w-full rounded-md bg-pink-600 px-3 py-2 text-sm font-semibold text-white hover:bg-pink-700">
                Pay Now
              </button>

              <div className="pt-2">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Quick Actions
                </p>
                <div className="space-y-2">
                  <button className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                    Print Details
                  </button>
                  {/* Dropdown kontak admin: pake <details> biar simpel tanpa JS */}
                  <details className="group">
                    <summary className="flex w-full cursor-pointer list-none items-center justify-between rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white ring-1 ring-teal-600/20 transition hover:bg-teal-700">
                      Contact Administrator
                      <svg
                        viewBox="0 0 20 20"
                        className="h-4 w-4 transition group-open:rotate-180"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.13l3.71-2.9a.75.75 0 1 1 .92 1.18l-4.2 3.29a.75.75 0 0 1-.92 0l-4.2-3.29a.75.75 0 0 1 .02-1.2Z" />
                      </svg>
                    </summary>
                    <div className="grid transition-all group-open:grid-rows-[1fr] group-open:opacity-100 grid-rows-[0fr] opacity-0">
                      <div className="min-h-0 overflow-hidden">
                        <div className="mt-2 space-y-2 rounded-md border border-slate-200 bg-white p-2">
                          <a
                            href="mailto:support@ybbfoundation.org?subject=Payment%20Assistance"
                            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <Mail className="h-4 w-4 text-slate-600" /> Via Email
                          </a>
                          <a
                            href="https://wa.me/6281234567890?text=Halo%20Admin%2C%20saya%20butuh%20bantuan%20pembayaran"
                            target="_blank"
                            rel="noreferrer noopener"
                            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <MessageCircle className="h-4 w-4 text-slate-600" /> Via WhatsApp
                          </a>
                        </div>
                      </div>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, overdue }: { label: string; value: string; overdue?: boolean }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm text-slate-700">
        {value}{' '}
        {overdue ? (
          <span className="ml-2 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-700 ring-1 ring-red-200">
            Overdue
          </span>
        ) : null}
      </p>
    </div>
  );
}

function TagRow({ label, tag }: { label: string; tag: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <span className="mt-1 inline-block rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
        {tag}
      </span>
    </div>
  );
}
