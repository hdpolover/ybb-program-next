export default function CertificatesPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const rows = [
    {
      id: 'CERT-2025-0001',
      award: 'Participation Certificate',
      assignment: 'IYS 2025 Program Completion',
      status: 'Available',
      href: '/img/jysprogram1.jpg',
    },
    {
      id: 'CERT-2025-0002',
      award: 'Best Team Award',
      assignment: 'Team Project Showcase',
      status: 'Processing',
      href: undefined,
    },
    {
      id: 'CERT-2025-0003',
      award: 'Leadership Certificate',
      assignment: 'Workshop & Leadership Track',
      status: 'Available',
      href: '/img/osaka.jpg',
    },
  ];

  const badge = (s: string) =>
    s === 'Available'
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
      : s === 'Processing'
        ? 'bg-amber-50 text-amber-700 ring-amber-200'
        : 'bg-slate-50 text-slate-700 ring-slate-200';

  // pagination (maks 3 item per halaman)
  const pageSize = 3;
  const page = Math.max(1, Number(searchParams?.page ?? '1') || 1);
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const start = (page - 1) * pageSize;
  const pageRows = rows.slice(start, start + pageSize);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-0 shadow-[0_8px_30px_rgba(2,6,23,0.06)] ring-1 ring-slate-200">
        <div className="px-4 pb-3 pt-4">
          <p className="text-sm font-semibold text-blue-950">Your Achievement Certificates</p>
          <p className="mt-1 text-sm text-slate-600">
            View and download your earned certificates. These documents certify your successful completion of program milestones and achievements.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Certificate ID</th>
                <th className="px-4 py-3 font-semibold">Award Details</th>
                <th className="px-4 py-3 font-semibold">Assignment Info</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr className="border-t border-slate-100">
                  <td colSpan={5} className="px-4 py-14 text-center text-slate-600">
                    <div className="flex flex-col items-center justify-center">
                      <span className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400 ring-1 ring-slate-200">
                        <span className="i">🔖</span>
                      </span>
                      <p className="text-sm font-semibold text-blue-950">No certificates available yet</p>
                      <p className="mt-1 text-sm text-slate-600">Your certificates will appear here as you complete program achievements.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                pageRows.map(r => (
                  <tr key={r.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 align-top text-slate-700">{r.id}</td>
                    <td className="px-4 py-3 align-top font-semibold text-blue-950">{r.award}</td>
                    <td className="px-4 py-3 align-top text-slate-700">{r.assignment}</td>
                    <td className="px-4 py-3 align-top">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${badge(r.status)}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top">
                      {r.href ? (
                        <div className="flex items-center gap-2">
                          <a
                            href={r.href}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                          >
                            View
                          </a>
                          <a
                            href={r.href}
                            download
                            className="rounded-md bg-pink-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-pink-700"
                          >
                            Download
                          </a>
                        </div>
                      ) : (
                        <span className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
                          Not Ready
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination controls */}
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2 text-sm">
          <p className="text-xs text-slate-600">
            Showing {start + 1}-{Math.min(start + pageSize, rows.length)} of {rows.length}
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
            <span className="text-xs text-slate-600">Page {page} / {totalPages}</span>
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

      {/* Footer info panel biar nggak kosong */}
      <div className="rounded-2xl bg-white p-4 text-slate-700 shadow-[0_8px_30px_rgba(2,6,23,0.06)] ring-1 ring-slate-200">
        <p className="text-sm font-semibold text-blue-950">Certificate Notes</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
          <li>Certificates marked <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">Available</span> can be viewed and downloaded.</li>
          <li><span className="rounded-full bg-amber-50 px-1.5 py-0.5 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-200">Processing</span> means the document is being prepared by the committee.</li>
          <li>Need help? Contact support via email for assistance.</li>
        </ul>
      </div>
    </div>
  );
}
