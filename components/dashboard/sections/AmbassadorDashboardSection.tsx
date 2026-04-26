'use client';

import Link from "next/link";
import { useMemo, useState } from 'react';
import {
  BarChart3,
  Users,
  CheckCircle2,
  Copy,
  ExternalLink,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Share2,
} from 'lucide-react';
import DashboardPageSkeleton from '@/components/dashboard/ui/DashboardPageSkeleton';
import { useAmbassadorSectionData } from "@/components/dashboard/sections/useAmbassadorSectionData";

export default function AmbassadorDashboardSection() {
  const { data, loading, error } = useAmbassadorSectionData();
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);

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

  if (loading) {
    return <DashboardPageSkeleton variant="ambassador" className="space-y-6" />;
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
    <section className="space-y-6">
      {data.programName ? (
        <p className="text-sm text-muted-foreground">{data.programName}</p>
      ) : null}

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

      <div className="rounded-xl border bg-card p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-slate-900">Referral Funnel</h2>
            <p className="text-sm text-slate-500">
              Open the dedicated referral page from the sidebar to search, filter, and review referral progress.
            </p>
          </div>
          <Link
            href="/dashboard/referrals"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
          >
            <span>Open Referral Funnel</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
