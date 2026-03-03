// Header section reusable biar semua judul/subjudul konsisten tampilannya
export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}) {
  const alignCls = align === 'left' ? 'text-left' : 'text-center';
  const subtitleAlignCls = align === 'left' ? '' : 'mx-auto';
  return (
    <div className={`mb-8 ${alignCls}`}>
      {eyebrow ? (
        <p className="text-accent text-xs font-semibold uppercase tracking-wider">{eyebrow}</p>
      ) : null}
      <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-blue-950 sm:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className={`mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 ${subtitleAlignCls}`}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
