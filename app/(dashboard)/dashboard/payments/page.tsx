import { mockApplication, mockInvoices } from '@/lib/dashboard/mock';
import { CheckCircle2, Clock, AlertTriangle, DollarSign, Info } from 'lucide-react';

export default function PaymentsPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const app = mockApplication;
  const now = new Date();
  const parse = (s?: string) => (s ? new Date(s) : null);
  const isOverdue = (status: string, due?: string) =>
    status !== 'paid' && !!due && (parse(due) as Date) < now;
  const complete = mockInvoices.filter(i => i.status === 'paid').length;
  const overdue = mockInvoices.filter(i => isOverdue(i.status, i.dueDate)).length;
  const pending = mockInvoices.filter(
    i => i.status !== 'paid' && !isOverdue(i.status, i.dueDate)
  ).length;
  const totalRequired = mockInvoices
    .filter(i => i.status !== 'paid')
    .reduce((sum, i) => sum + i.amount, 0);

  const daysLeft = (due?: string) => {
    const d = parse(due);
    if (!d) return null;
    const ms = d.getTime() - now.getTime();
    return Math.ceil(ms / (1000 * 60 * 60 * 24));
  };

  const currency = (v: number) => `$${v.toFixed(2)}`;

  // pagination untuk tabel utama (maks 3 item)
  const pageSize = 3;
  const page = Math.max(1, Number(searchParams?.page ?? '1') || 1);
  const totalPages = Math.max(1, Math.ceil(mockInvoices.length / pageSize));
  const start = (page - 1) * pageSize;
  const pageInvoices = mockInvoices.slice(start, start + pageSize);

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-white p-4 shadow-[0_8px_30px_rgba(2,6,23,0.06)] ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-600">Complete Payments</p>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-blue-950">{complete}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-[0_8px_30px_rgba(2,6,23,0.06)] ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-600">Pending Payments</p>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-amber-50 text-amber-600 ring-1 ring-amber-200">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-blue-950">{pending}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-[0_8px_30px_rgba(2,6,23,0.06)] ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-600">Overdue Payments</p>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-red-50 text-red-600 ring-1 ring-red-200">
              <AlertTriangle className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-blue-950">{overdue}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-[0_8px_30px_rgba(2,6,23,0.06)] ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-600">Total Required</p>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-pink-50 text-pink-600 ring-1 ring-pink-200">
              <DollarSign className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-blue-950">{currency(totalRequired)}</p>
        </div>
      </div>

      {/* Info banner */}
      <div className="rounded-2xl bg-blue-50 p-4 text-blue-900 ring-1 ring-blue-200">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid h-8 w-8 place-items-center rounded-full bg-white text-blue-600 ring-1 ring-blue-200">
            <Info className="h-4 w-4" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold">Category Switch Available</p>
            <p className="mt-1 text-sm">
              Important Notice: Your current registration payment period has expired. You can
              continue by switching to Self Funded status.
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              <li>Continue with your program participation</li>
              <li>Access self-funded payment options</li>
              <li>Complete your registration and program fees</li>
            </ul>
            <button className="mt-3 inline-flex items-center gap-2 rounded-md bg-pink-600 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-pink-600/20 hover:bg-pink-700">
              Switch to Self Funded
            </button>
          </div>
        </div>
      </div>

      {/* Detailed table */}
      <div className="rounded-2xl bg-white p-0 shadow-[0_8px_30px_rgba(2,6,23,0.06)] ring-1 ring-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">#</th>
                <th className="px-4 py-3 font-semibold">Payment Information</th>
                <th className="px-4 py-3 font-semibold">Period</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Payment Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageInvoices.map((inv, idx) => {
                const dueDays = daysLeft(inv.dueDate);
                const overdueRow = isOverdue(inv.status, inv.dueDate);
                return (
                  <tr key={inv.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 align-top text-slate-600">{start + idx + 1}</td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-blue-950">{inv.label}</p>
                        <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                          Registration Fee
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="space-y-1">
                        <p className="text-sm text-slate-700">{inv.dueDate ?? '—'}</p>
                        {dueDays !== null && dueDays > 0 && !overdueRow && (
                          <span className="inline-block rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-200">
                            {dueDays} day{dueDays === 1 ? '' : 's'} remaining
                          </span>
                        )}
                        {overdueRow && (
                          <span className="inline-block rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-700 ring-1 ring-red-200">
                            Expired
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">{currency(inv.amount)}</td>
                    <td className="px-4 py-3 align-top">
                      <span
                        className={`rounded-full px-2 py-1 text-[11px] font-semibold ring-1 ${
                          inv.status === 'paid'
                            ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                            : overdueRow
                              ? 'bg-red-50 text-red-700 ring-red-200'
                              : 'bg-amber-50 text-amber-700 ring-amber-200'
                        }`}
                      >
                        {overdueRow ? 'Cancelled' : inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-center gap-2">
                        <a
                          href={`/dashboard/payments/${inv.id}`}
                          className="rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                        >
                          See Details
                        </a>
                        {inv.status !== 'paid' && !overdueRow ? (
                          <button className="rounded-md bg-pink-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-pink-700">
                            Pay
                          </button>
                        ) : null}
                        {overdueRow && (
                          <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-700">
                            <Clock className="h-3 w-3" /> Expired
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Pagination controls untuk tabel */}
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2 text-sm">
          <p className="text-xs text-slate-600">
            Showing {start + 1}-{Math.min(start + pageSize, mockInvoices.length)} of {mockInvoices.length}
          </p>
          <div className="flex items-center gap-2">
            <a
              href={`?page=${Math.max(1, page - 1)}`}
              className={`rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 ${
                page === 1 ? 'pointer-events-none opacity-50' : 'hover:bg-slate-50'
              }`}
            >
              Prev
            </a>
            <span className="text-xs text-slate-600">
              Page {page} / {totalPages}
            </span>
            <a
              href={`?page=${Math.min(totalPages, page + 1)}`}
              className={`rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 ${
                page === totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-slate-50'
              }`}
            >
              Next
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
