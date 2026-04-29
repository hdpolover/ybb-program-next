import Image from 'next/image';
import { headers } from 'next/headers';
import { getSettingsForBrandDomain } from '@/lib/api/settings';

type ProgramDestination = {
  id: string;
  name: string;
  logoIconUrl: string | null;
  href: string | null;
};

function toProgramsHref(rawUrl?: string | null): string | null {
  const raw = (rawUrl || '').trim();
  if (!raw) return null;
  const origin = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return `${origin.replace(/\/+$/, '')}/programs`;
}

function extractHost(input?: string | null): string {
  const raw = (input || '').trim();
  if (!raw) return '';
  const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    return new URL(normalized).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return normalized
      .replace(/^https?:\/\//i, '')
      .split('/')[0]
      .split(':')[0]
      .replace(/^www\./, '')
      .toLowerCase();
  }
}

function initial(name: string): string {
  const cleaned = name.trim();
  return cleaned ? cleaned.charAt(0).toUpperCase() : '?';
}

export default async function DiscoverProgramsPage() {
  const host = (await headers()).get('host') || '';
  const settings = await getSettingsForBrandDomain(host);

  const currentName = settings?.brand?.name || 'Current Program';
  const currentLogo = settings?.brand?.logo_icon_url || null;
  const normalizedCurrentHost = extractHost(host);
  const currentNameLower = currentName.trim().toLowerCase();

  const others: ProgramDestination[] = (settings.available_brands || [])
    .map((entry) => ({
      id: entry.id,
      name: entry.name,
      logoIconUrl: entry.logo_icon_url?.trim() || null,
      href: toProgramsHref(entry.landing_url || entry.website_url),
      host: extractHost(entry.landing_url || entry.website_url),
    }))
    .filter((entry) => {
      const sameHost = normalizedCurrentHost ? entry.host === normalizedCurrentHost : false;
      const sameName = entry.name.trim().toLowerCase() === currentNameLower;
      return !sameHost && !sameName;
    })
    .map(({ host: _ignored, ...entry }) => entry);

  const openNow = others.filter((entry) => Boolean(entry.href));
  const comingSoon = others.filter((entry) => !entry.href);

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Explore Programs</h1>
        <p className="mt-2 text-sm text-slate-600">
          Browse all available program destinations and open them in a new tab.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="/programs"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-3 rounded-xl border border-[var(--brand-accent)] bg-[var(--brand-accent-soft)] px-4 py-3 text-[var(--brand-accent)]"
          >
            <span className="flex min-w-0 items-center gap-2">
              {currentLogo ? (
                <Image
                  src={currentLogo}
                  alt={`${currentName} logo`}
                  width={32}
                  height={32}
                  className="h-7 w-7 shrink-0 rounded-full border border-[var(--brand-accent)]/30 object-cover"
                  unoptimized
                />
              ) : (
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[var(--brand-accent)]/30 bg-white text-xs font-bold uppercase">
                  {initial(currentName)}
                </span>
              )}
              <span className="truncate text-sm font-semibold">{currentName}</span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wide">Current</span>
          </a>
        </div>

        {openNow.length > 0 && (
          <>
            <h2 className="mt-8 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Open now</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {openNow.map((entry) => (
                <a
                  key={entry.id}
                  href={entry.href || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 transition-colors hover:border-[var(--brand-accent)] hover:bg-[var(--brand-accent-soft)]/50"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    {entry.logoIconUrl ? (
                      <Image
                        src={entry.logoIconUrl}
                        alt={`${entry.name} logo`}
                        width={32}
                        height={32}
                        className="h-7 w-7 shrink-0 rounded-full border border-slate-200 object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-slate-200 bg-slate-50 text-xs font-bold uppercase text-slate-500">
                        {initial(entry.name)}
                      </span>
                    )}
                    <span className="truncate text-sm font-medium text-slate-700">{entry.name}</span>
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 transition-colors group-hover:text-[var(--brand-accent)]">
                    Open
                  </span>
                </a>
              ))}
            </div>
          </>
        )}

        {comingSoon.length > 0 && (
          <>
            <h2 className="mt-8 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Coming soon</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {comingSoon.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-400"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    {entry.logoIconUrl ? (
                      <Image
                        src={entry.logoIconUrl}
                        alt={`${entry.name} logo`}
                        width={32}
                        height={32}
                        className="h-7 w-7 shrink-0 rounded-full border border-slate-200 object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-xs font-bold uppercase text-slate-500">
                        {initial(entry.name)}
                      </span>
                    )}
                    <span className="truncate text-sm font-medium">{entry.name}</span>
                  </span>
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    Soon
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

