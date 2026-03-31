// Badge status funding — gampang dibedain warna-warnanya
export default function StatusBadge({ type }: { type: 'fully_funded' | 'self_funded' | 'partial' }) {
  const styles: Record<string, string> = {
    fully_funded: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    self_funded: 'bg-amber-50 text-amber-700 ring-amber-200',
    partial: 'bg-primary/5 text-primary ring-primary/30',
  };
  const label: Record<string, string> = {
    fully_funded: 'Fully Funded',
    self_funded: 'Self Funded',
    partial: 'Partial',
  };
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${styles[type]}`}>{label[type]}</span>;
}
