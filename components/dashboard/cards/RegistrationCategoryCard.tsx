// Kartu kategori pendaftaran — vibes mirip referensi tapi tetep tema kita
import StatusBadge from '@/components/dashboard/ui/StatusBadge';

export default function RegistrationCategoryCard({
  funding = 'fully_funded',
}: {
  funding?: 'fully_funded' | 'self_funded' | 'partial';
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white p-5 shadow-[0_12px_40px_rgba(2,6,23,0.12)] ring-1 ring-slate-200">
      {/* header mini */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
            ✓
          </span>
          <h3 className="text-lg font-extrabold text-blue-950">Your Registration Category</h3>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="#"
            className="rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
          >
            Learn More
          </a>
          <button className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700">
            Switch to Self Funded
          </button>
        </div>
      </div>

      {/* isi ringkasan */}
      <div className="mt-4 rounded-xl bg-white p-4 ring-1 ring-slate-200">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge type={'fully_funded'} />
          <span className="text-sm font-medium text-slate-600">Reimbursement System</span>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-700">
          {/* nulis penjelasan simple aja, biar peserta paham alurnya */}
          You're registered as a <span className="font-semibold">Fully Funded</span> participant.
          Complete all requirements including essays and interviews. You'll pay program fees in
          scheduled batches, and if selected after the evaluation process, all your payments will be
          reimbursed.
        </p>
        <div className="mt-3 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800 ring-1 ring-emerald-200">
          <span className="font-semibold">Switch Available:</span> You can switch to Self Funded
          registration for guaranteed program participation with standard payment requirements.
        </div>
      </div>
    </div>
  );
}
