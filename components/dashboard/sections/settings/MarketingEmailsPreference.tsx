// components/dashboard/sections/settings/MarketingEmailsPreference.tsx
'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { getEnvelopeData, isRecord } from '@/lib/api/response';
import { MARKETING_OPT_IN_LABEL } from '@/lib/marketing/optIn';

type LoadState = 'loading' | 'ready' | 'error';

function readFlag(payload: unknown): boolean | null {
  const data = getEnvelopeData(payload);
  return isRecord(data) && typeof data.marketingEmails === 'boolean' ? data.marketingEmails : null;
}

/** Opt-in/out switch for marketing emails. The API writes the consent audit row on each change. */
export default function MarketingEmailsPreference() {
  const [state, setState] = useState<LoadState>('loading');
  const [enabled, setEnabled] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/portal/preferences', { cache: 'no-store' });
        const flag = res.ok ? readFlag(await res.json().catch(() => null)) : null;
        if (cancelled) return;
        if (flag === null) return setState('error');
        setEnabled(flag);
        setState('ready');
      } catch {
        if (!cancelled) setState('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = async () => {
    if (saving || state !== 'ready') return;
    const next = !enabled;
    setSaving(true);
    try {
      const res = await fetch('/api/portal/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marketingEmails: next }),
      });
      const flag = res.ok ? readFlag(await res.json().catch(() => null)) : null;
      if (flag === null) throw new Error('save failed');
      setEnabled(flag);
      toast.success(flag ? 'You will get program updates by email.' : 'You are unsubscribed from program updates.');
    } catch {
      toast.error('Could not save your email preference. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (state === 'loading') {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500" role="status">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading preferences...</span>
      </div>
    );
  }

  if (state === 'error') {
    return <p className="text-sm text-slate-500">Email preferences are unavailable right now. Please try again later.</p>;
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-800" id="marketing-emails-label">
          {MARKETING_OPT_IN_LABEL}
        </p>
        <p className="mt-0.5 text-xs text-slate-500">
          Off by default. You can change this at any time. Account and payment emails are not affected.
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-labelledby="marketing-emails-label"
        onClick={toggle}
        disabled={saving}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-wait disabled:opacity-70 ${
          enabled ? 'bg-primary' : 'bg-slate-300'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
            enabled ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}
