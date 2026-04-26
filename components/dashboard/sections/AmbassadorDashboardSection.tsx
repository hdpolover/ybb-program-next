'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  Users,
  CheckCircle2,
  Copy,
  ExternalLink,
  AlertTriangle,
  TrendingUp,
  Search,
  Share2,
  UserRound,
  Clock3,
} from 'lucide-react';
import DashboardPageSkeleton from '@/components/dashboard/ui/DashboardPageSkeleton';
import { useDashboardData, type AmbassadorData } from '@/components/dashboard/DashboardDataContext';
import { getEnvelopeData, getMessage } from '@/lib/api/response';
import { toAmbassadorData, type AmbassadorReferral, type AmbassadorReferralStatus } from '@/lib/dashboard/ambassador';

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

const STATUS_OPTIONS: Array<{ value: 'all' | AmbassadorReferralStatus; label: string }> = [
  { value: 'all', label: 'All statuses' },
  { value: 'referred', label: 'Referred' },
  { value: 'registered', label: 'Registered' },
  { value: 'applied', label: 'Applied' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'completed', label: 'Completed' },
];

const FUNNEL_STATUS_OPTIONS: Array<{ value: AmbassadorReferralStatus; label: string }> = [
  { value: 'referred', label: 'Referred' },
  { value: 'registered', label: 'Registered' },
  { value: 'applied', label: 'Applied' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'completed', label: 'Completed' },
];

function formatDate(value?: string): string {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function formatDuration(value?: number): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '-';
  return `${value} day${value === 1 ? '' : 's'}`;
}

function getLatestMilestone(referral: AmbassadorReferral): string {
  if (referral.completedAt) return formatDate(referral.completedAt);
  if (referral.acceptedAt) return formatDate(referral.acceptedAt);
  if (referral.appliedAt) return formatDate(referral.appliedAt);
  if (referral.registeredAt) return formatDate(referral.registeredAt);
  return formatDate(referral.referredAt);
}

export default function AmbassadorDashboardSection() {
  const { ambassadorData, isAmbassadorDataLoading } = useDashboardData();
  const [data, setData] = useState<AmbassadorData | null>(ambassadorData);
  const [loading, setLoading] = useState(isAmbassadorDataLoading && !ambassadorData);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AmbassadorReferralStatus>('all');

  useEffect(() => {
    if (ambassadorData) {
      setData(ambassadorData);
      setLoading(false);
      setError(null);
      return;
    }

    if (isAmbassadorDataLoading) {
      setLoading(true);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/participants/ambassador', { cache: 'no-store' });
        const json = (await res.json().catch(() => null)) as unknown;
        if (!res.ok) throw new Error(getMessage(json) ?? 'Failed to load ambassador data');
        if (!cancelled) setData(toAmbassadorData(getEnvelopeData(json)));
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [ambassadorData, isAmbassadorDataLoading]);

  const handleCopy = async () => {
    if (!data?.shareLink) return;
    await navigator.clipboard.writeText(data.shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = async () => {
    if (!data?.referralCode) return;
    await navigator.clipboard.writeText(data.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleShare = async () => {
    if (!data?.shareLink || typeof navigator.share !== 'function') return;

    try {
      setShareLoading(true);
      await navigator.share({
        title: `${data.programName} Ambassador Link`,
        text: `Join ${data.programName} using my ambassador referral link.`,
        url: data.shareLink,
      });
    } finally {
      setShareLoading(false);
    }
  };

  const conversionRate = useMemo(() => {
    if (!data?.totalReferrals) return 0;
    return Math.round((data.successfulReferrals / data.totalReferrals) * 100);
  }, [data]);

  const statusCounts = useMemo(() => {
    const counts: Record<AmbassadorReferralStatus, number> = {
      referred: 0,
      registered: 0,
      applied: 0,
      accepted: 0,
      completed: 0,
    };

    data?.referrals.forEach((referral) => {
      counts[referral.status] += 1;
    });

    return counts;
  }, [data]);

  const filteredReferrals = useMemo(() => {
    if (!data) return [];

    const keyword = searchQuery.trim().toLowerCase();

    return data.referrals.filter((referral) => {
      if (statusFilter !== 'all' && referral.status !== statusFilter) {
        return false;
      }

      if (!keyword) return true;

      return (
        referral.participantName.toLowerCase().includes(keyword) ||
        referral.status.toLowerCase().includes(keyword)
      );
    });
  }, [data, searchQuery, statusFilter]);

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
      <div className="grid gap-4 md:grid-cols-3">
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

        <div className="rounded-xl border bg-card p-4 space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <BarChart3 className="w-4 h-4" />
            <span>Conversion Rate</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{conversionRate}%</p>
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
          {typeof navigator !== 'undefined' && typeof navigator.share === 'function' ? (
            <button
              type="button"
              onClick={handleShare}
              disabled={shareLoading}
              className="shrink-0 flex items-center gap-1.5 text-xs border rounded px-3 py-2 hover:bg-muted transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{shareLoading ? 'Sharing...' : 'Share'}</span>
            </button>
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">
          Share this link or referral code to credit new participants to your ambassador account.
        </p>
      </div>

      {/* Referral code */}
      <div className="rounded-xl border bg-muted/40 p-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground">Referral Code</p>
          <p className="text-lg font-mono font-bold tracking-widest mt-0.5">{data.referralCode}</p>
        </div>
        <button
          onClick={handleCopyCode}
          className="text-xs border rounded px-3 py-2 hover:bg-background transition-colors flex items-center gap-1.5"
        >
          <Copy className="w-3.5 h-3.5" />
          {copiedCode ? 'Copied' : 'Copy Code'}
        </button>
      </div>

      <div className="rounded-xl border bg-card p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Referral Funnel</h2>
            <p className="text-sm text-slate-500">
              Track who used your code and how far they have progressed.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {FUNNEL_STATUS_OPTIONS.map((option) => (
              <span
                key={option.value}
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                  STATUS_COLORS[option.value]
                }`}
              >
                {option.label}: {statusCounts[option.value]}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search participant name or status"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
            />
          </label>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'all' | AmbassadorReferralStatus)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-100 md:w-52"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {filteredReferrals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-200">
              <UserRound className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-900">No referrals found</h3>
            <p className="mt-2 text-sm text-slate-500">
              {data.referrals.length === 0
                ? 'Once participants use your link or code, they will appear here.'
                : 'Try another search term or status filter.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Participant</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Referred</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Latest Milestone</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Cycle Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredReferrals.map((referral) => (
                  <tr key={referral.id} className="align-top">
                    <td className="px-4 py-4">
                      <div className="font-medium text-slate-900">{referral.participantName}</div>
                      <div className="mt-1 text-xs text-slate-500">ID: {referral.participantId}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                          STATUS_COLORS[referral.status]
                        }`}
                      >
                        {STATUS_LABELS[referral.status]}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-700">{formatDate(referral.referredAt)}</td>
                    <td className="px-4 py-4">
                      <div className="text-slate-900">{getLatestMilestone(referral)}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        {referral.status === 'completed'
                          ? 'Completed journey'
                          : referral.status === 'accepted'
                            ? 'Accepted into program'
                            : referral.status === 'applied'
                              ? 'Application submitted'
                              : referral.status === 'registered'
                                ? 'Registration completed'
                                : 'Referral recorded'}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-slate-900">
                        <Clock3 className="h-4 w-4 text-slate-400" />
                        <span>{formatDuration(referral.totalConversionDays ?? referral.daysToAccept ?? referral.daysToApply ?? referral.daysToRegister)}</span>
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        Register: {formatDuration(referral.daysToRegister)} · Apply: {formatDuration(referral.daysToApply)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
