// app/(dashboard)/dashboard/pay/page.tsx
//
// Checkout landing for the "pick a fee and pay" flow (/apply -> signup ->
// onboarding -> here). Mints the registration invoice through the same
// ensure-invoice endpoint the payments list uses, then hands off to the
// make-payment screen. Never an end state: it either redirects or shows why not.
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDashboardData } from "@/components/dashboard/DashboardDataContext";
import DashboardPageSkeleton from "@/components/dashboard/ui/DashboardPageSkeleton";
import { getEnvelopeData, isRecord } from "@/lib/api/response";
import {
  chooseActiveProgramId,
  readActiveProgramId,
  resolveActiveProgramId,
} from "@/lib/dashboard/activeProgram";
import { getPaymentErrorMessage } from "@/lib/dashboard/paymentOutcome";
import { clearPayIntent, decidePayTarget, readPayIntent } from "@/lib/checkout/payIntent";

export default function PayLandingPage() {
  const router = useRouter();
  const { me } = useDashboardData();
  const [error, setError] = useState<string | null>(null);
  const [joinProgramName, setJoinProgramName] = useState<string | null>(null);

  useEffect(() => {
    // `me` loads with the dashboard layout; the program cannot be resolved before it.
    if (!me) return;

    const intent = readPayIntent();
    if (!intent) {
      router.replace("/dashboard/payments");
      return;
    }

    const programs = me.registeredPrograms ?? [];
    const target = decidePayTarget(intent, programs, me.joinableProgram);

    if (target.kind === 'join') {
      // Intent is kept: the layout's "Apply for <program>" button joins, which
      // refreshes `me` and re-runs this effect on the new registration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setJoinProgramName(target.programName);
      return;
    }
    if (target.kind === 'abort') {
      clearPayIntent();
      setError("That program isn't on your account yet, so we can't open its payment. Pick it from the program list, or start again from the Apply page.");
      return;
    }

    setJoinProgramName(null);
    const programId =
      target.kind === 'pay' ? target.programId : resolveActiveProgramId(programs, readActiveProgramId());
    // The tier belongs to one edition; a participant holding several must be
    // pointed at that one or the API answers "Payment option not found".
    if (target.kind === 'pay') chooseActiveProgramId(target.programId);

    let cancelled = false;
    (async () => {
      try {
        const response = await fetch(
          `/api/portal/payments/tiers/${encodeURIComponent(intent.tierId)}/ensure-invoice`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ program_id: programId || undefined }),
          },
        );
        const json = (await response.json().catch(() => null)) as unknown;
        if (!response.ok) {
          throw new Error(getPaymentErrorMessage(json, "We could not prepare your invoice."));
        }

        const payload = getEnvelopeData(json);
        const invoiceId =
          isRecord(payload) && typeof payload.invoice_id === "string" ? payload.invoice_id : null;
        if (!invoiceId) throw new Error("The server did not return an invoice.");

        clearPayIntent();
        if (!cancelled) {
          router.replace(`/dashboard/payments/${invoiceId}/make-payment?checkout=1`);
        }
      } catch (err) {
        // Cleared so a rejected tier (closed window, wrong category) does not
        // bounce the participant back here on every visit to the dashboard.
        clearPayIntent();
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "We could not prepare your invoice.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [me, router]);

  if (joinProgramName) {
    return (
      <section className="mx-auto max-w-xl space-y-2 p-6 text-center">
        <h1 className="text-lg font-semibold text-slate-900">Join {joinProgramName} first</h1>
        <p className="text-sm text-slate-600">
          Use the &quot;Apply for {joinProgramName}&quot; button above. Your registration fee invoice opens right after.
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-xl space-y-3 p-6 text-center">
        <h1 className="text-lg font-semibold text-slate-900">We could not open your payment</h1>
        <p className="text-sm text-slate-600">{error}</p>
        <Link
          href="/dashboard/payments"
          className="inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
        >
          Go to Payments
        </Link>
      </section>
    );
  }

  return <DashboardPageSkeleton variant="payments-list" />;
}
