// Topbar simple — judul halaman + aksi cepat
export default function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(2,6,23,0.06)]">
      <h1 className="text-2xl font-extrabold text-blue-950">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
    </div>
  );
}
