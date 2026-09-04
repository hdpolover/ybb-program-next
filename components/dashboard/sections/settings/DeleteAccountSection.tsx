// components/dashboard/sections/settings/DeleteAccountSection.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';

const CONFIRMATION_PHRASE = 'DELETE';

type DeletionConsequences = {
  hasPaidInvoice: boolean;
  paidInvoiceCount: number;
  hasNonDraftApplication: boolean;
  nonDraftApplicationCount: number;
};

type DeletionRequestData = {
  scheduledDeletionDate?: string;
  consequences?: DeletionConsequences;
};

type ApiResponse<T> = {
  statusCode: number;
  message: string;
  data: T | null;
};

/**
 * Clears the same per-browser caches UserMenuPopover clears on a normal
 * logout, so the next account signed into on this browser doesn't inherit a
 * stale ambassador-role view.
 */
function clearAmbassadorStatusCache() {
  try {
    localStorage.removeItem('ybb_ambassador_status');
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith('ybb_ambassador_status:')) {
        localStorage.removeItem(key);
      }
    }
  } catch {
    // ignore storage errors
  }
}

type SectionState = 'idle' | 'confirming' | 'submitting';

export default function DeleteAccountSection() {
  const router = useRouter();
  const [state, setState] = useState<SectionState>('idle');
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');

  const canConfirm = confirmText === CONFIRMATION_PHRASE;

  const handleOpenConfirm = () => {
    setState('confirming');
    setConfirmText('');
    setError('');
  };

  const handleCancel = () => {
    setState('idle');
    setConfirmText('');
    setError('');
  };

  const handleDelete = async () => {
    if (!canConfirm || state === 'submitting') return;

    setState('submitting');
    setError('');

    try {
      const res = await fetch('/api/auth/deletion-request', { method: 'POST' });
      const json = (await res.json().catch(() => ({}))) as ApiResponse<DeletionRequestData>;

      if (!res.ok) {
        throw new Error(json.message || 'Failed to request account deletion.');
      }

      // The account is deactivated on the server the moment the request above
      // succeeds — every subsequent authenticated call in this dashboard shell
      // (nav badges, background polling, etc.) would start 401ing. Sign out
      // and leave immediately rather than lingering here.
      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => undefined);
      clearAmbassadorStatusCache();

      const consequences = json.data?.consequences;
      const params = new URLSearchParams();
      if (json.data?.scheduledDeletionDate) {
        params.set('scheduledDeletionDate', json.data.scheduledDeletionDate);
      }
      if (consequences) {
        params.set('paidInvoiceCount', String(consequences.paidInvoiceCount));
        params.set('nonDraftApplicationCount', String(consequences.nonDraftApplicationCount));
      }

      router.push(`/auth/account-deletion-scheduled?${params.toString()}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to request account deletion.';
      setError(message);
      setState('confirming');
      toast.error(message);
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-red-200 bg-red-50/40 shadow-sm">
      <div className="border-b border-red-100 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <h2 className="text-sm font-semibold text-red-700">Delete Account</h2>
        </div>
      </div>

      <div className="space-y-4 px-4 py-5 sm:px-6">
        <div className="space-y-1.5 text-sm text-slate-600">
          <p>Deleting your account:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Deactivates it immediately — you&apos;ll be signed out and can&apos;t log back in.</li>
            <li>Permanently deletes it in 30 days.</li>
            <li>
              Can be undone during those 30 days via a cancellation link we&apos;ll email you right away.
            </li>
          </ul>
        </div>

        {state === 'idle' ? (
          <button
            type="button"
            onClick={handleOpenConfirm}
            className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 shadow-sm transition hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete My Account
          </button>
        ) : (
          <div className="space-y-3 rounded-xl border border-red-200 bg-white p-4">
            <p className="text-sm font-medium text-slate-800">
              This can&apos;t be undone after 30 days. To confirm, type{' '}
              <span className="font-mono font-semibold text-red-700">{CONFIRMATION_PHRASE}</span> below.
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(event) => setConfirmText(event.target.value)}
              disabled={state === 'submitting'}
              placeholder={CONFIRMATION_PHRASE}
              aria-label={`Type ${CONFIRMATION_PHRASE} to confirm account deletion`}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-200"
              autoComplete="off"
            />
            {error ? <p className="text-xs text-red-600">{error}</p> : null}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleDelete}
                disabled={!canConfirm || state === 'submitting'}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {state === 'submitting' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                {state === 'submitting' ? 'Deleting…' : 'Permanently Delete My Account'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={state === 'submitting'}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
