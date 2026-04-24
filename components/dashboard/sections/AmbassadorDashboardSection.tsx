'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  CheckCircle2,
  Copy,
  ExternalLink,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import DashboardPageSkeleton from '@/components/dashboard/ui/DashboardPageSkeleton';
import { getEnvelopeData, getMessage, isRecord } from '@/lib/api/response';

interface AmbassadorDashboard {
  id: string;
  referralCode: string;
  shareLink: string;
  totalReferrals: number;
  successfulReferrals: number;
  isActive: boolean;
  programName: string;
}

function toAmbassadorDashboard(payload: unknown): AmbassadorDashboard | null {
  if (!isRecord(payload)) return null;

  const id = typeof payload.id === 'string' ? payload.id : null;
  const referralCode = typeof payload.referralCode === 'string' ? payload.referralCode : null;
  const shareLink = typeof payload.shareLink === 'string' ? payload.shareLink : null;
  const totalReferrals =
    typeof payload.totalReferrals === 'number' && Number.isFinite(payload.totalReferrals)
      ? payload.totalReferrals
      : null;
  const successfulReferrals =
    typeof payload.successfulReferrals === 'number' && Number.isFinite(payload.successfulReferrals)
      ? payload.successfulReferrals
      : null;
  const isActive = typeof payload.isActive === 'boolean' ? payload.isActive : null;
  const programName = typeof payload.programName === 'string' ? payload.programName : null;

  if (
    !id ||
    !referralCode ||
    !shareLink ||
    totalReferrals === null ||
    successfulReferrals === null ||
    isActive === null ||
    !programName
  ) {
    return null;
  }

  return {
    id,
    referralCode,
    shareLink,
    totalReferrals,
    successfulReferrals,
    isActive,
    programName,
  };
}

const STATUS_LABELS: Record<string, string> = {
  referred: 'Referred',
  registered: 'Registered',
  applied: 'Applied',
  accepted: 'Accepted',
  completed: 'Completed',
};

const STATUS_COLORS: Record<string, string> = {
  referred: 'bg-gray-100 text-gray-700',
  registered: 'bg-blue-100 text-blue-700',
  applied: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-green-100 text-green-700',
  completed: 'bg-emerald-100 text-emerald-800 font-semibold',
};

export default function AmbassadorDashboardSection() {
  const [data, setData] = useState<AmbassadorDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/participants/ambassador', { cache: 'no-store' });
        const json = (await res.json().catch(() => null)) as unknown;
        if (!res.ok) throw new Error(getMessage(json) ?? 'Failed to load ambassador data');
        if (!cancelled) setData(toAmbassadorDashboard(getEnvelopeData(json)));
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  const handleCopy = async () => {
    if (!data?.shareLink) return;
    await navigator.clipboard.writeText(data.shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <DashboardPageSkeleton variant="ambassador" className="space-y-6 p-4 md:p-6" />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3 text-center">
        <AlertTriangle className="w-8 h-8 text-destructive" />
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <section className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ambassador Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">{data.programName}</p>
        {!data.isActive && (
          <span className="inline-block mt-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
            Account Inactive
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border bg-card p-4 space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Users className="w-4 h-4" />
            <span>Total Referrals</span>
          </div>
          <p className="text-3xl font-bold">{data.totalReferrals}</p>
        </div>

        <div className="rounded-xl border bg-card p-4 space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>Successful</span>
          </div>
          <p className="text-3xl font-bold text-green-600">{data.successfulReferrals}</p>
        </div>
      </div>

      {/* Share Link */}
      <div className="rounded-xl border bg-card p-4 space-y-3">
        <p className="text-sm font-medium">Your Referral Link</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 truncate text-xs bg-muted rounded px-3 py-2 font-mono">
            {data.shareLink}
          </code>
          <button
            onClick={handleCopy}
            className="shrink-0 flex items-center gap-1.5 text-xs border rounded px-3 py-2 hover:bg-muted transition-colors"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                <span className="text-green-600">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
          <a
            href={data.shareLink}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-1.5 text-xs border rounded px-3 py-2 hover:bg-muted transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="sr-only">Open</span>
          </a>
        </div>
        <p className="text-xs text-muted-foreground">
          Share this link to track your referrals. The token is anonymous.
        </p>
      </div>

      {/* Referral code */}
      <div className="rounded-xl border bg-muted/40 p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Referral Code</p>
          <p className="text-lg font-mono font-bold tracking-widest mt-0.5">{data.referralCode}</p>
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(data.referralCode)}
          className="text-xs border rounded px-3 py-2 hover:bg-background transition-colors flex items-center gap-1.5"
        >
          <Copy className="w-3.5 h-3.5" />
          Copy Code
        </button>
      </div>
    </section>
  );
}
