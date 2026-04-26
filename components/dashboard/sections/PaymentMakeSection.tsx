"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CreditCard,
  Globe2,
  Info,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { componentsTheme } from "@/lib/theme/components";
import { useSettings } from "@/components/providers/SettingsProvider";
import PaymentPageSkeleton from "@/components/dashboard/payments/PaymentPageSkeleton";
import { getEnvelopeData, getErrorMessage, isRecord } from "@/lib/api/response";
import { toPortalSubmissionDetail } from "@/lib/dashboard/submissionParser";
import {
  ACTIVE_PROGRAM_CHANGED_EVENT,
  appendProgramId,
  readActiveProgramId,
} from "@/lib/dashboard/activeProgram";

const paymentsTheme = componentsTheme.dashboardPayments;

interface PaymentMakeSectionProps {
  paymentId: string;
}

interface PaymentMethodData {
  id: string;
  code: string;
  display_name: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  instructions: string;
  icon: string;
  requires_proof: boolean;
  type: string;
}

interface InvoiceData {
  id: string;
  label: string;
  category: string;
  amount: number;
  dueDate: string;
  status: string;
  currency?: string;
}

function buildDefaultChecklistItems(programName?: string | null): string[] {
  return [
    "If I am not selected as a fully funded participant, I agree to continue as a self-funded participant, and the payment is non-refundable.",
    `I am ready to join ${programName?.trim() || "this program"}.`,
  ];
}

function toPaymentMethodData(value: unknown): PaymentMethodData | null {
  if (!isRecord(value)) return null;

  const code = typeof value.code === "string" ? value.code : null;
  if (!code) return null;

  return {
    id: typeof value.id === "string" ? value.id : code,
    code,
    display_name:
      typeof value.display_name === "string" && value.display_name.length > 0
        ? value.display_name
        : code,
    bank_name: typeof value.bank_name === "string" ? value.bank_name : "",
    account_number: typeof value.account_number === "string" ? value.account_number : "",
    account_name: typeof value.account_name === "string" ? value.account_name : "",
    instructions: typeof value.instructions === "string" ? value.instructions : "",
    icon: typeof value.icon === "string" ? value.icon : "",
    requires_proof: typeof value.requires_proof === "boolean" ? value.requires_proof : false,
    type: typeof value.type === "string" ? value.type : "",
  };
}

function toInvoiceData(value: unknown): InvoiceData | null {
  if (!isRecord(value)) return null;

  const id = typeof value.id === "string" ? value.id : null;
  if (!id) return null;

  return {
    id,
    label: typeof value.label === "string" ? value.label : "Payment",
    category: typeof value.category === "string" ? value.category : "payment",
    amount: typeof value.amount === "number" && Number.isFinite(value.amount) ? value.amount : 0,
    dueDate: typeof value.dueDate === "string" ? value.dueDate : "",
    status: typeof value.status === "string" ? value.status : "unpaid",
    currency: typeof value.currency === "string" ? value.currency : "USD",
  };
}

function normalizeMethodsPayload(payload: unknown): PaymentMethodData[] {
  const source =
    Array.isArray(payload)
      ? payload
      : isRecord(payload) && Array.isArray(payload.data)
        ? payload.data
        : isRecord(payload) && Array.isArray(payload.methods)
          ? payload.methods
          : [];

  return source
    .map(toPaymentMethodData)
    .filter((method): method is PaymentMethodData => method !== null);
}

function getActionUrl(payload: unknown): string | null {
  if (!isRecord(payload)) return null;
  const action = payload.action;
  if (!isRecord(action)) return null;
  return typeof action.url === "string" && action.url.length > 0 ? action.url : null;
}

export default function PaymentMakeSection({ paymentId }: PaymentMakeSectionProps) {
  const { settings } = useSettings();
  const router = useRouter();
  const rateToIdr = settings?.currency?.rate_to_idr ?? 16900;

  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [programSelectionReady, setProgramSelectionReady] = useState(false);
  const [programName, setProgramName] = useState<string | null>(null);
  const [agreementItems, setAgreementItems] = useState<string[]>([]);
  const [agreementChecked, setAgreementChecked] = useState<boolean[]>([]);

  useEffect(() => {
    const syncSelectedProgram = () => {
      setSelectedProgramId(readActiveProgramId());
      setProgramSelectionReady(true);
    };

    syncSelectedProgram();
    window.addEventListener(ACTIVE_PROGRAM_CHANGED_EVENT, syncSelectedProgram as EventListener);

    return () => {
      window.removeEventListener(ACTIVE_PROGRAM_CHANGED_EVENT, syncSelectedProgram as EventListener);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/portal/payments/${paymentId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        const json = (await response.json().catch(() => null)) as unknown;
        if (!response.ok) {
          throw new Error(getErrorMessage(json, "Failed to load payment details"));
        }

        if (!cancelled) {
          const payload = getEnvelopeData(json);
          const invoicePayload = isRecord(payload) ? payload.invoice : null;
          setInvoice(toInvoiceData(invoicePayload));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load payment details");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [paymentId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setMethodsLoading(true);
      try {
        const res = await fetch('/api/portal/payment-methods', { cache: 'no-store' });
        const json = (await res.json().catch(() => null)) as unknown;
        const payload = getEnvelopeData(json);
        const methods = normalizeMethodsPayload(payload);

        if (!cancelled && res.ok) {
          setPaymentMethods(methods);

          const firstManual = methods.find((method) => method.type?.toLowerCase() === "manual");
          const firstGateway = methods.find((method) => method.type?.toLowerCase() === "automatic");

          if (firstManual) {
            setManualMethod(firstManual.code);
          }

          if (firstGateway) {
            setGatewayMethod(firstGateway.code);
          }
        }
      } catch {
        // fall through — methods stay empty, UI shows fallback
      } finally {
        if (!cancelled) setMethodsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!programSelectionReady) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(appendProgramId("/api/portal/submissions/detail", selectedProgramId), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        const json = (await res.json().catch(() => null)) as unknown;
        if (!res.ok) {
          throw new Error(getErrorMessage(json, "Failed to load submission detail"));
        }

        const detail = toPortalSubmissionDetail(getEnvelopeData(json));
        const nextProgramName = detail?.programName ?? null;
        const previewChecklistItems = detail?.previewChecklistItems ?? [];
        const nextAgreementItems: string[] =
          previewChecklistItems.length > 0
            ? previewChecklistItems
            : buildDefaultChecklistItems(nextProgramName ?? settings?.active_program?.name ?? null);

        if (!cancelled) {
          setProgramName(nextProgramName);
          setAgreementItems(nextAgreementItems);
          setAgreementChecked(nextAgreementItems.map(() => false));
        }
      } catch {
        if (!cancelled) {
          const fallbackItems = buildDefaultChecklistItems(settings?.active_program?.name ?? null);
          setAgreementItems(fallbackItems);
          setAgreementChecked(fallbackItems.map(() => false));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [programSelectionReady, selectedProgramId, settings?.active_program?.name]);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodData[]>([]);
  const [methodsLoading, setMethodsLoading] = useState(false);

  const [paymentType, setPaymentType] = useState<"gateway" | "manual">("gateway");
  const [manualMethod, setManualMethod] = useState<string>("");
  const [gatewayMethod, setGatewayMethod] = useState<string>("");
  const [manualAccountName, setManualAccountName] = useState("");
  const [manualSourceName, setManualSourceName] = useState("");
  const [manualPaymentDate, setManualPaymentDate] = useState("");
  const [manualProofUploaded, setManualProofUploaded] = useState(false);
  const [manualNotes, setManualNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const amountUsd = invoice?.amount ?? 0;
  const amountIdr = amountUsd * rateToIdr;

  const currencyUsd = (v: number) => `$${v.toFixed(2)}`;
  const currencyIdr = (v: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);

  const normalizeMethodType = (method: PaymentMethodData) => method.type?.trim().toLowerCase() ?? "";
  const manualMethods = paymentMethods.filter((method) => normalizeMethodType(method) === "manual");
  const gatewayMethods = paymentMethods.filter((method) => normalizeMethodType(method) === "automatic");

  const selectedManualMethodObj = manualMethods.find((method) => method.code === manualMethod) ?? null;
  const selectedGatewayMethodObj = gatewayMethods.find((method) => method.code === gatewayMethod) ?? null;
  const displayedAgreementItems =
    agreementItems.length > 0
      ? agreementItems
      : buildDefaultChecklistItems(programName ?? settings?.active_program?.name ?? null);

  const renderMethodCardSkeletons = (prefix: string) =>
    Array.from({ length: 4 }).map((_, index) => (
      <div
        key={`${prefix}-${index}`}
        className={`${paymentsTheme.bankMethodCard} pointer-events-none cursor-default`}
        aria-hidden="true"
      >
        <span className={`${paymentsTheme.bankMethodLogoWrapper} animate-pulse bg-slate-200/80`} />
        <span className="mt-2 h-3 w-20 animate-pulse rounded-full bg-slate-200/80" />
      </div>
    ));

  const allAgreementsChecked =
    displayedAgreementItems.length > 0 &&
    displayedAgreementItems.every((_, index) => agreementChecked[index] === true);
  const isGatewayComplete = paymentType === "gateway" && allAgreementsChecked && gatewayMethod !== "";
  const isManualComplete =
    paymentType === "manual" &&
    allAgreementsChecked &&
    manualMethod !== "" &&
    manualAccountName.trim() !== "" &&
    manualSourceName.trim() !== "" &&
    manualPaymentDate.trim() !== "" &&
    manualProofUploaded;
  const isFormComplete = isGatewayComplete || isManualComplete;

  const handleSubmit = useCallback(async () => {
    if (!isFormComplete || submitting) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      if (paymentType === "manual" && !manualMethod) {
        throw new Error("Please select a manual payment method");
      }

      if (paymentType === "gateway" && !gatewayMethod) {
        throw new Error("Please select a gateway payment method");
      }

      const body: Record<string, unknown> = {
        payment_type: paymentType,
        payment_method_id: paymentType === "manual" ? manualMethod : gatewayMethod,
      };

      if (paymentType === "manual") {
        body.account_name = manualAccountName;
        body.source_name = manualSourceName;
        body.payment_date = manualPaymentDate;
        body.notes = manualNotes || undefined;
      }

      const response = await fetch(`/api/portal/payments/${paymentId}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = (await response.json().catch(() => null)) as unknown;

      if (!response.ok) {
        throw new Error(getErrorMessage(json, "Payment submission failed"));
      }

      const payload = getEnvelopeData(json);
      const actionUrl = getActionUrl(payload);

      // Gateway: redirect to payment gateway URL if provided
      if (actionUrl) {
        window.location.href = actionUrl;
        return;
      }

      // Success — go back to the payment detail page
      router.push(`/dashboard/payments/${paymentId}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Payment submission failed");
    } finally {
      setSubmitting(false);
    }
  }, [isFormComplete, submitting, paymentType, manualMethod, gatewayMethod, manualAccountName, manualSourceName, manualPaymentDate, manualNotes, paymentId, router]);

  if (loading) {
    return <PaymentPageSkeleton variant="make-payment" />;
  }

  if (error || !invoice) {
    return (
      <section className={paymentsTheme.sectionWrapper}>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertTriangle className="h-6 w-6 text-red-500" />
          <p className="mt-2 text-sm text-red-600">{error || "Payment not found"}</p>
          <Link href="/dashboard/payments" className="mt-4 text-sm text-primary underline">
            Back to Payments
          </Link>
        </div>
      </section>
    );
  }

  const formattedRate = new Intl.NumberFormat("id-ID").format(rateToIdr);
  const paymentTypeOptionMeta: Record<"gateway" | "manual", { title: string; subtitle: string; helper: string }> = {
    gateway: {
      title: "Payment Gateway",
      subtitle: "Card, Virtual Account, QRIS, e-wallet",
      helper: "Instant verification via secure payment gateway.",
    },
    manual: {
      title: "Manual Transfer",
      subtitle: "Bank transfer with proof upload",
      helper: "Best for direct transfer and manual confirmation.",
    },
  };

  return (
    <section className={paymentsTheme.sectionWrapper}>
      {/* Breadcrumb + heading */}
      <nav className={paymentsTheme.breadcrumbNav}>
        <Link href="/dashboard/payments" className={paymentsTheme.breadcrumbLink}>
          Payments
        </Link>
        <span className={paymentsTheme.breadcrumbSeparator}>/</span>
        <Link href={`/dashboard/payments/${paymentId}`} className={paymentsTheme.breadcrumbLink}>
          Payment Details
        </Link>
        <span className={paymentsTheme.breadcrumbSeparator}>/</span>
        <span className={paymentsTheme.breadcrumbCurrent}>Make Payment</span>
      </nav>

      <div className={paymentsTheme.headingRow}>
        <h1 className={paymentsTheme.headingTitle}>
          Make Payment
        </h1>
        <Link
          href={`/dashboard/payments/${paymentId}`}
          className={paymentsTheme.backButton}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Details</span>
        </Link>
      </div>

      {/* Info + form cards */}
      <div className={paymentsTheme.layoutGrid}>
        <div className="space-y-4">
          {/* Currency info */}
          <div className={paymentsTheme.currencyInfoCard}>
            <div className="mt-0.5">
              <Info className={paymentsTheme.currencyInfoIcon} />
            </div>
            <div className={paymentsTheme.currencyInfoBody}>
              <p className={paymentsTheme.currencyInfoTitle}>Important currency information</p>
              <p className="text-xs">
                Although the amount is displayed in USD, payments will be processed in IDR (Indonesian Rupiah).
                The current conversion rate used is <span className="font-semibold">1 USD = {formattedRate} IDR</span>.
              </p>
              <p className="text-xs">
                <span className="font-semibold">Estimated total:</span> {currencyUsd(amountUsd)}
                (<span className="font-semibold">{currencyIdr(amountIdr)}</span>)
              </p>
            </div>
          </div>
          {/* Payment type selector + gateway steps (no card) */}
          <div className={`${paymentsTheme.sectionBodyText} space-y-4`}>
            <div className="space-y-1">
              <p className={paymentsTheme.tableTitle}>Payment Type</p>
              <p className={paymentsTheme.tableSubtitle}>
                Choose how you want to complete your payment for this registration.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Select Payment Type</p>
              <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Payment type">
                <button
                  type="button"
                  role="radio"
                  aria-checked={paymentType === "gateway"}
                  onClick={() => setPaymentType("gateway")}
                  className={`rounded-2xl border p-4 text-left transition-all ${
                    paymentType === "gateway"
                      ? "border-primary bg-primary/5 shadow-[0_10px_30px_rgba(37,99,235,0.12)]"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${
                        paymentType === "gateway" ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Globe2 className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{paymentTypeOptionMeta.gateway.title}</p>
                      <p className="mt-0.5 text-xs text-slate-600">{paymentTypeOptionMeta.gateway.subtitle}</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  role="radio"
                  aria-checked={paymentType === "manual"}
                  onClick={() => setPaymentType("manual")}
                  className={`rounded-2xl border p-4 text-left transition-all ${
                    paymentType === "manual"
                      ? "border-primary bg-primary/5 shadow-[0_10px_30px_rgba(37,99,235,0.12)]"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${
                        paymentType === "manual" ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Building2 className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{paymentTypeOptionMeta.manual.title}</p>
                      <p className="mt-0.5 text-xs text-slate-600">{paymentTypeOptionMeta.manual.subtitle}</p>
                    </div>
                  </div>
                </button>
              </div>

              <div className={paymentsTheme.selectionSummaryRow}>
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>
                  Selected: <span className="font-semibold">{paymentTypeOptionMeta[paymentType].title}</span>. {paymentTypeOptionMeta[paymentType].helper}
                </span>
              </div>
            </div>

            {paymentType === "gateway" ? (
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-1">
                    <p className={paymentsTheme.fieldLabelSmall}>Automatic Secure Payment Gateway</p>
                    <p className="text-xs text-slate-600">
                      Choose a gateway method provided by the backend configuration.
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {gatewayMethods.length} method{gatewayMethods.length === 1 ? "" : "s"}
                  </span>
                </div>

                <div className={paymentsTheme.bankMethodGrid} id="gateway-method-select">
                  {methodsLoading ? (
                    renderMethodCardSkeletons("gateway-method-skeleton")
                  ) : gatewayMethods.length === 0 ? (
                    <p className="col-span-full rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                      No automatic gateway methods are available yet. Please contact support.
                    </p>
                  ) : (
                    gatewayMethods.map((method) => {
                      const isSelected = gatewayMethod === method.code;
                      const label = method.display_name || method.code;

                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setGatewayMethod(method.code)}
                          className={`${paymentsTheme.bankMethodCard} ${
                            isSelected ? paymentsTheme.bankMethodCardSelected : ""
                          }`}
                        >
                          <span className={paymentsTheme.bankMethodLogoWrapper}>
                            {method.icon ? (
                              <img
                                src={method.icon}
                                alt={label}
                                className={paymentsTheme.bankMethodLogoImage}
                              />
                            ) : (
                              <CreditCard className="h-6 w-6 text-slate-400" />
                            )}
                          </span>
                          <span className="text-center leading-snug">{label}</span>
                        </button>
                      );
                    })
                  )}
                </div>

                {selectedGatewayMethodObj && (
                  <div className={paymentsTheme.selectionSummaryRow}>
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>You selected: {selectedGatewayMethodObj.display_name || selectedGatewayMethodObj.code}</span>
                  </div>
                )}

                <details className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                  <summary className="cursor-pointer text-sm font-semibold text-slate-700">
                    View gateway payment steps
                  </summary>
                  <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-slate-600">
                    <li>Select your preferred method from the list above.</li>
                    <li>Click Complete Payment to open the secure gateway checkout.</li>
                    <li>Complete OTP or 3D Secure verification in the gateway page.</li>
                    <li>Return to your dashboard while the payment status is updated.</li>
                  </ol>
                </details>
              </div>
            ) : (
              <div className={paymentsTheme.manualPaymentWrapper}>
                <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="space-y-1">
                      <p className={paymentsTheme.fieldLabelSmall}>Manual Payment Method</p>
                      <p className="text-xs text-slate-600">
                        Choose a transfer method and submit payment proof for manual verification.
                      </p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {manualMethods.length} method{manualMethods.length === 1 ? "" : "s"}
                    </span>
                  </div>

                  <div className={paymentsTheme.bankMethodGrid} id="manual-method-select">
                    {methodsLoading ? (
                      renderMethodCardSkeletons("manual-method-skeleton")
                    ) : manualMethods.length === 0 ? (
                      <p className="col-span-full rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                        No manual payment methods are available at the moment.
                      </p>
                    ) : (
                      manualMethods.map((method) => {
                        const isSelected = manualMethod === method.code;
                        const label = method.display_name || method.code;

                        return (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => setManualMethod(method.code)}
                            className={`${paymentsTheme.bankMethodCard} ${
                              isSelected ? paymentsTheme.bankMethodCardSelected : ""
                            }`}
                          >
                            <span className={paymentsTheme.bankMethodLogoWrapper}>
                              {method.icon ? (
                                <img
                                  src={method.icon}
                                  alt={label}
                                  className={paymentsTheme.bankMethodLogoImage}
                                />
                              ) : (
                                <CreditCard className="h-6 w-6 text-slate-400" />
                              )}
                            </span>
                            <span className="text-center leading-snug">{label}</span>
                          </button>
                        );
                      })
                    )}
                  </div>

                  {selectedManualMethodObj && (
                    <div className={paymentsTheme.selectionSummaryRow}>
                      <CreditCard className="h-4 w-4 text-primary" />
                      <span>You selected: {selectedManualMethodObj.display_name || selectedManualMethodObj.code}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <p className={paymentsTheme.fieldLabelSmall}>Recipient Account Details</p>

                  {selectedManualMethodObj ? (
                    <dl className={paymentsTheme.bankDetailsGrid}>
                      {selectedManualMethodObj.account_name && (
                        <div>
                          <dt className={paymentsTheme.bankDetailsTerm}>Account Name</dt>
                          <dd className={paymentsTheme.bankDetailsValue}>{selectedManualMethodObj.account_name}</dd>
                        </div>
                      )}
                      {selectedManualMethodObj.bank_name && (
                        <div>
                          <dt className={paymentsTheme.bankDetailsTerm}>Bank Name</dt>
                          <dd className={paymentsTheme.bankDetailsValue}>{selectedManualMethodObj.bank_name}</dd>
                        </div>
                      )}
                      {selectedManualMethodObj.account_number && (
                        <div>
                          <dt className={paymentsTheme.bankDetailsTerm}>Account Number</dt>
                          <dd className={paymentsTheme.bankDetailsValue}>{selectedManualMethodObj.account_number}</dd>
                        </div>
                      )}
                      {selectedManualMethodObj.instructions && (
                        <div className="sm:col-span-2">
                          <dt className={paymentsTheme.bankDetailsTerm}>Instructions</dt>
                          <dd className={`${paymentsTheme.bankDetailsValue} whitespace-pre-line`}>{selectedManualMethodObj.instructions}</dd>
                        </div>
                      )}
                    </dl>
                  ) : (
                    <p className="text-sm text-slate-500">Select a payment method above to see account details.</p>
                  )}

                  <details className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                    <summary className="cursor-pointer text-sm font-semibold text-slate-700">
                      View transfer instructions
                    </summary>
                    <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-slate-600">
                      <li>Transfer the exact invoice amount to the selected account.</li>
                      <li>Keep your transfer proof (screenshot or receipt).</li>
                      <li>Complete the form below using the same transfer details.</li>
                      <li>Submit payment and wait for manual verification from our team.</li>
                    </ol>
                  </details>
                </div>

                <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <p className={paymentsTheme.fieldLabelSmall}>
                    Bank Transfer Details Form
                  </p>
                  <div className="grid gap-3 text-xs text-slate-700 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="font-semibold" htmlFor="manual-account-name">
                        Account Name
                      </label>
                      <input
                        id="manual-account-name"
                        type="text"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30"
                        value={manualAccountName}
                        onChange={(e) => setManualAccountName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold" htmlFor="manual-source-name">
                        Source Name
                      </label>
                      <input
                        id="manual-source-name"
                        type="text"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30"
                        value={manualSourceName}
                        onChange={(e) => setManualSourceName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold" htmlFor="manual-payment-date">
                        Payment Date
                      </label>
                      <input
                        id="manual-payment-date"
                        type="date"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30"
                        value={manualPaymentDate}
                        onChange={(e) => setManualPaymentDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold" htmlFor="manual-payment-proof">
                        Payment Proof (Upload)
                      </label>
                      <input
                        id="manual-payment-proof"
                        type="file"
                        className="block w-full text-xs text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary hover:file:bg-primary/20"
                        onChange={(e) => setManualProofUploaded(!!e.target.files && e.target.files.length > 0)}
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-semibold" htmlFor="manual-notes">
                        Additional Notes
                      </label>
                      <textarea
                        id="manual-notes"
                        rows={3}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30"
                        value={manualNotes}
                        onChange={(e) => setManualNotes(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Agreement section */}
          <div className={paymentsTheme.agreementCard}>
            <p className={paymentsTheme.agreementTitle}>Before you continue</p>
            {displayedAgreementItems.map((item, index) => {
              const rowClassName = index % 2 === 0 ? paymentsTheme.agreementRowBrand : paymentsTheme.agreementRowIndigo;
              const checkboxClassName =
                index % 2 === 0 ? paymentsTheme.agreementCheckboxBrand : paymentsTheme.agreementCheckboxIndigo;
              const Icon = index % 2 === 0 ? ShieldCheck : Globe2;

              return (
                <label key={`${item}-${index}`} className={rowClassName}>
                  <input
                    type="checkbox"
                    className={checkboxClassName}
                    checked={agreementChecked[index] ?? false}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setAgreementChecked((current) => {
                        const next = displayedAgreementItems.map((_, itemIndex) => current[itemIndex] ?? false);
                        next[index] = checked;
                        return next;
                      });
                    }}
                  />
                  <div className={paymentsTheme.agreementRowInner}>
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="leading-snug">{item}</span>
                  </div>
                </label>
              );
            })}
          </div>

          <div className={paymentsTheme.completeButtonWrapper}>
            {submitError && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>{submitError}</span>
              </div>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              className={`${
                isFormComplete && !submitting
                  ? paymentsTheme.completeButtonEnabled
                  : paymentsTheme.completeButtonDisabled
              } ${paymentsTheme.completeButtonBase}`}
              disabled={!isFormComplete || submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  <span>Complete Payment</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
