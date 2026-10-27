// components/consent/ConsentBanner.tsx
'use client';

import { Button } from '@/components/ui/button';
import { canTrack, writeConsent, type ConsentStatus } from '@/lib/consent/consent';
import { useConsentPrompt } from '@/lib/consent/useConsent';
import { clearStoredClickIds } from '@/lib/analytics/pixels';

function choose(status: ConsentStatus): void {
  const wasTracking = canTrack();
  writeConsent(status);
  if (status === 'denied') {
    clearStoredClickIds();
    // Loaded scripts can't be unloaded; only a reload gets rid of them.
    if (wasTracking) window.location.reload();
  }
}

// Same button treatment on both choices: rejecting must be as easy as accepting.
const CHOICE = 'min-w-24 flex-1 border-slate-900 font-semibold text-slate-900 sm:flex-none';

/**
 * Stacks above the sticky register bar and the WhatsApp button (both z-50,
 * bottom-anchored): full-width on phones, a bottom-left card from md up so the
 * WhatsApp button on the right stays reachable.
 */
export default function ConsentBanner() {
  const prompt = useConsentPrompt();
  if (!prompt) return null;

  const isBanner = prompt === 'banner';
  const privacyLink = (
    <a href="/privacy" className="font-medium text-primary underline underline-offset-2">
      Privacy Policy
    </a>
  );

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-slate-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl md:inset-x-auto md:bottom-4 md:left-4 md:max-w-md md:rounded-2xl md:border"
    >
      <p className="text-sm text-slate-700">
        {isBanner
          ? <>We would like to use cookies for analytics and ads. Nothing is tracked unless you accept. See our {privacyLink}.</>
          : <>We use cookies for analytics and ads. {privacyLink}.</>}
      </p>
      <div className="mt-3 flex gap-2">
        <Button variant="outline" size="sm" className={CHOICE} onClick={() => choose('granted')}>
          {isBanner ? 'Accept' : 'OK'}
        </Button>
        <Button variant="outline" size="sm" className={CHOICE} onClick={() => choose('denied')}>
          {isBanner ? 'Reject' : 'Decline'}
        </Button>
      </div>
    </div>
  );
}
