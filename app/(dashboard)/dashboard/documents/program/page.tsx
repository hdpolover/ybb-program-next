"use client";
import { FolderOpen } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

type Doc = {
  id: string;
  name: string;
  description: string;
  type: 'Upload Required' | 'Can Generate' | 'Reference';
  href?: string;
};

export default function ProgramDocumentsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  // data mock realistis
  const docs: Doc[] = [
    {
      id: 'd1',
      name: 'Participant Agreement',
      description: 'Agreement form to be signed by participant',
      type: 'Upload Required',
    },
    {
      id: 'd2',
      name: 'Invitation Letter',
      description: 'Auto-generated letter for visa and admin purposes',
      type: 'Can Generate',
      href: '/img/coverjysbrosur.png',
    },
    {
      id: 'd3',
      name: 'Program Handbook',
      description: 'Guidelines, agenda, and procedures',
      type: 'Reference',
      href: '/img/programoverview.png',
    },
    {
      id: 'd4',
      name: 'Medical Certificate',
      description: 'Upload your medical fitness certificate',
      type: 'Upload Required',
    },
  ];

  const tab = (searchParams.get('tab') ?? 'all').toLowerCase();
  const filterMatch = (t: string) =>
    tab === 'all' || t.toLowerCase().replace(/\s+/g, '-') === tab;
  const filtered = docs.filter(d => filterMatch(d.type));

  const tabLink = (key: string, label: string) => {
    const active = tab === key;
    return (
      <button
        onClick={() => router.push(`?tab=${key}`)}
        className={
          `rounded-md px-2 py-1 text-[11px] font-semibold ` +
          (active
            ? 'bg-blue-600 text-white'
            : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50')
        }
        aria-pressed={active}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-0 shadow-[0_8px_30px_rgba(2,6,23,0.06)] ring-1 ring-slate-200">
        {/* Header + Tabs */}
        <div className="flex items-center justify-between px-4 pb-3 pt-4">
          <p className="text-sm font-semibold text-blue-950">Available Program Documents</p>
          <div className="flex items-center gap-2">
            {tabLink('all', 'All')}
            {tabLink('upload-required', 'Upload Required')}
            {tabLink('can-generate', 'Can Generate')}
            {tabLink('reference', 'Reference')}
          </div>
        </div>

        {/* Description */}
        <div className="px-4 pb-4 text-sm text-slate-600">
          Access and download important program materials. These documents contain essential information to ensure your successful program completion.
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">#</th>
                <th className="px-4 py-3 font-semibold">Document Name</th>
                <th className="px-4 py-3 font-semibold">Description</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr className="border-t border-slate-100">
                  <td colSpan={5} className="px-4 py-14">
                    <div className="flex flex-col items-center justify-center text-center text-slate-500">
                      <span className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400 ring-1 ring-slate-200">
                        <FolderOpen className="h-6 w-6" />
                      </span>
                      <p className="text-sm font-semibold text-blue-950">No documents available yet</p>
                      <p className="mt-1 text-sm text-slate-600">Program documents will be available here when published.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((d, idx) => (
                  <tr key={d.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 align-top text-slate-600">{idx + 1}</td>
                    <td className="px-4 py-3 align-top">
                      <p className="font-semibold text-blue-950">{d.name}</p>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <p className="text-slate-700">{d.description}</p>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200">
                        {d.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top">
                      {d.type === 'Upload Required' ? (
                        <button className="rounded-md bg-pink-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-pink-700">Upload</button>
                      ) : d.type === 'Can Generate' ? (
                        <button className="rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100">Generate</button>
                      ) : (
                        <a href={d.href ?? '#'} className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Download</a>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Separate info card (English) */}
      <div className="rounded-2xl bg-white p-4 text-slate-700 shadow-[0_8px_30px_rgba(2,6,23,0.06)] ring-1 ring-slate-200">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-950">Document Tips</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              <li><span className="rounded-full bg-slate-50 px-1.5 py-0.5 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200">Upload Required</span> label means you need to upload the file before the deadline.</li>
              <li><span className="rounded-full bg-slate-50 px-1.5 py-0.5 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200">Can Generate</span> label can be created automatically—just click <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">Generate</span>.</li>
              <li>Reference documents can be downloaded and read anytime.</li>
            </ul>
          </div>
          <div className="shrink-0">
            <a href="#" className="rounded-md bg-pink-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-pink-700">Contact Support</a>
          </div>
        </div>
      </div>
    </div>
  );
}
