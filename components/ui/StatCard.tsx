// Kartu statistik reusable buat angka-angka impact biar seragam
export default function StatCard({
  icon,
  value,
  label,
  ring = 'ring-accent/30',
}: {
  icon?: React.ReactNode;
  value: string;
  label: string;
  ring?: string;
}) {
  return (
    <div
      className={`rounded-2xl bg-white p-6 shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-1 ${ring} transition hover:-translate-y-0.5 hover:shadow-[0_16px_60px_rgba(2,6,23,0.12)]`}
    >
      {icon ? (
        <div className="bg-accent text-accent-foreground mb-3 inline-grid h-10 w-10 place-items-center rounded-full">
          {icon}
        </div>
      ) : null}
      <p className="text-3xl font-extrabold text-blue-950 sm:text-4xl">{value}</p>
      <p className="mt-1 text-sm text-slate-700">{label}</p>
    </div>
  );
}
