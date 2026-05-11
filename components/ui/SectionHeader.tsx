// Header section reusable biar semua judul/subjudul konsisten tampilannya
export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  colorScheme = 'dark',
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  /** 'dark' = dark text (default, for light/neutral backgrounds); 'light' = white text (for dark backgrounds) */
  colorScheme?: 'dark' | 'light';
}) {
  const alignCls = align === 'left' ? 'text-left' : 'text-center';
  const subtitleAlignCls = align === 'left' ? '' : 'mx-auto';
  const eyebrowColor = colorScheme === 'light' ? 'text-white/80' : 'text-accent';
  const titleColor = colorScheme === 'light' ? 'text-white' : 'text-blue-950';
  const subtitleColor = colorScheme === 'light' ? 'text-white/70' : 'text-slate-600';
  return (
    <div className={`mb-8 ${alignCls}`}>
      {eyebrow ? (
        <p className={`text-xs font-semibold uppercase tracking-wider ${eyebrowColor}`}>{eyebrow}</p>
      ) : null}
      <h2 className={`mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl ${titleColor}`}>
        {title}
      </h2>
      {subtitle ? (
        <p className={`mt-3 max-w-2xl text-sm leading-relaxed ${subtitleColor} ${subtitleAlignCls}`}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
