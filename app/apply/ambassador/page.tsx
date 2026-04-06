'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Phone, Building, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

interface FormState {
  fullName: string;
  phoneNumber: string;
  institution: string;
}

const PROGRAM_ID = process.env.NEXT_PUBLIC_PROGRAM_ID || '';

export default function ApplyAmbassadorPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({ fullName: '', phoneNumber: '', institution: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim()) {
      setError('Full name is required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/participants/ambassador/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          programId: PROGRAM_ID,
          phoneNumber: form.phoneNumber.trim() || undefined,
          institution: form.institution.trim() || undefined,
        }),
      });

      const json = (await res.json().catch(() => ({}))) as any;

      if (!res.ok) {
        throw new Error(json?.message || 'Application failed. Please try again.');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto" />
          <h1 className="text-2xl font-bold">Application Submitted!</h1>
          <p className="text-muted-foreground text-sm">
            Your ambassador application has been received. You will be notified once reviewed.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-lg px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
          >
            Go to Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-2">
            <Users className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Become an Ambassador</h1>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Share your unique referral link and help others discover this program. You earn recognition for every successful referral.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label htmlFor="fullName" className="text-sm font-medium">
              Full Name <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="fullName"
                type="text"
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                placeholder="Your full name"
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone Number <span className="text-muted-foreground text-xs font-normal">(optional)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="phone"
                type="tel"
                value={form.phoneNumber}
                onChange={(e) => setForm((f) => ({ ...f, phoneNumber: e.target.value }))}
                placeholder="+62 812 ..."
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                disabled={loading}
              />
            </div>
          </div>

          {/* Institution */}
          <div className="space-y-1.5">
            <label htmlFor="institution" className="text-sm font-medium">
              Institution / University <span className="text-muted-foreground text-xs font-normal">(optional)</span>
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="institution"
                type="text"
                value={form.institution}
                onChange={(e) => setForm((f) => ({ ...f, institution: e.target.value }))}
                placeholder="Your school or organization"
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-2.5">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !form.fullName.trim()}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-lg px-5 py-3 text-sm font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                Apply as Ambassador <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
