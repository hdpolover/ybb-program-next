// components/dashboard/BrandMismatchState.tsx

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui';
import BrandMismatchSignOutButton from './BrandMismatchSignOutButton';

type SessionBrand = { name: string; url: string };

type BrandMismatchStateProps = {
  /** The brand this domain belongs to — what the participant is currently looking at. */
  hostBrandName: string;
  /** The brand their signed-in account actually belongs to, when it's resolvable. */
  sessionBrand: SessionBrand | null;
  /** Only set when the host brand has an open program to register into. */
  registerUrl: string | null;
};

function toAbsoluteUrl(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

/**
 * Full-page takeover for a signed-in participant whose account brand doesn't
 * match the brand domain they're browsing (accounts are per brand — see
 * lib/dashboard/brandMismatch.ts). Replaces the entire dashboard shell so
 * they're never shown another programme's chrome, then a broken page inside
 * it (e.g. "No active application found").
 *
 * Styled after app/unavailable and app/maintenance — the repo's existing
 * full-page state pattern — rather than the content-area EmptyState, since
 * this replaces the whole dashboard, not a section within it.
 */
export default function BrandMismatchState({
  hostBrandName,
  sessionBrand,
  registerUrl,
}: BrandMismatchStateProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 py-16">
      <div className="mx-auto w-full max-w-xl text-center">
        <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/25">
          <AlertTriangle className="h-6 w-6" aria-hidden="true" />
        </div>
        <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-primary">
          Wrong programme
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          This isn&rsquo;t your {hostBrandName} account
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          {sessionBrand
            ? `You're signed in with an account registered to ${sessionBrand.name}, not ${hostBrandName}. Accounts are separate for each programme.`
            : `You're signed in with an account that isn't registered to ${hostBrandName}. Accounts are separate for each programme.`}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
          <BrandMismatchSignOutButton />
          {registerUrl ? (
            <Button href={registerUrl} variant="outline" size="lg">
              Register for {hostBrandName}
            </Button>
          ) : null}
          {sessionBrand ? (
            <Button href={toAbsoluteUrl(sessionBrand.url)} asExternal variant="ghost" size="lg">
              Go to {sessionBrand.name}
            </Button>
          ) : null}
        </div>
      </div>
    </main>
  );
}
