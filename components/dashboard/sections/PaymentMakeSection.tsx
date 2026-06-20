"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
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
import { upsertCachedPaymentPreview } from "@/lib/dashboard/payments-cache";
import EnglishTextInput from "@/components/ui/EnglishTextInput";
import EnglishTextArea from "@/components/ui/EnglishTextArea";

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
  exchangeRate?: number | null;
  usdPrice?: number | null;
  idrPrice?: number | null;
  paymentInfoHtml?: string | null;
}

interface PendingPaymentData {
  actionUrl?: string;
  paymentMethod?: string;
  accountName?: string;
  sourceName?: string;
  paymentDate?: string;
  proofUrl?: string;
}

function hasHtmlMarkup(value: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(value);
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
    exchangeRate:
      typeof value.exchangeRate === "number" && Number.isFinite(value.exchangeRate) && value.exchangeRate > 0
        ? value.exchangeRate
        : null,
    usdPrice:
      typeof value.usdPrice === "number" && Number.isFinite(value.usdPrice)
        ? value.usdPrice
        : null,
    idrPrice:
      typeof value.idrPrice === "number" && Number.isFinite(value.idrPrice)
        ? value.idrPrice
        : null,
    paymentInfoHtml:
      typeof value.paymentInfoHtml === "string" && value.paymentInfoHtml.trim().length > 0
        ? value.paymentInfoHtml
        : null,
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

function getPendingPaymentData(payload: unknown): PendingPaymentData | null {
  if (!isRecord(payload)) return null;
  const history = Array.isArray(payload.history) ? payload.history : [];
  const processingRow = history.find((row) => isRecord(row) && String(row.status ?? "").toLowerCase() === "processing");
  if (!isRecord(processingRow)) return null;

  return {
    actionUrl: typeof processingRow.actionUrl === "string" ? processingRow.actionUrl : undefined,
    paymentMethod:
      typeof processingRow.paymentMethod === "string"
        ? processingRow.paymentMethod
        : typeof processingRow.method === "string"
          ? processingRow.method
          : undefined,
    accountName: typeof processingRow.accountName === "string" ? processingRow.accountName : undefined,
    sourceName: typeof processingRow.sourceName === "string" ? processingRow.sourceName : undefined,
    paymentDate: typeof processingRow.paymentDate === "string" ? processingRow.paymentDate : undefined,
    proofUrl: typeof processingRow.proofUrl === "string" ? processingRow.proofUrl : undefined,
  };
}

export default function PaymentMakeSection({ paymentId }: PaymentMakeSectionProps) {
  const { settings } = useSettings();
  const router = useRouter();

  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [pendingPayment, setPendingPayment] = useState<PendingPaymentData | null>(null);
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
          const payloadRecord = isRecord(payload) ? payload : null;
          const invoicePayload = payloadRecord?.invoice;
          setInvoice(toInvoiceData(invoicePayload));
          setPendingPayment(getPendingPaymentData(payloadRecord));
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

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodData[]>([]);
  const [methodsLoading, setMethodsLoading] = useState(false);
  const [paymentType, setPaymentType] = useState<"gateway" | "manual">("gateway");
  const [manualMethod, setManualMethod] = useState<string>("");
  const [gatewayMethod, setGatewayMethod] = useState<string>("");

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

          if (firstGateway && firstManual) {
            setPaymentType("gateway");
          } else if (firstManual) {
            setPaymentType("manual");
          } else if (firstGateway) {
            setPaymentType("gateway");
          }

          if (firstManual) {
            setManualMethod(firstManual.code);
          } else {
            setManualMethod("");
          }

          if (firstGateway) {
            setGatewayMethod(firstGateway.code);
          } else {
            setGatewayMethod("");
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

  const [manualAccountName, setManualAccountName] = useState("");
  const [manualSourceName, setManualSourceName] = useState("");
  const [manualPaymentDate, setManualPaymentDate] = useState("");
  const [manualProofFile, setManualProofFile] = useState<File | null>(null);
  const [manualNotes, setManualNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [cancellingPending, setCancellingPending] = useState(false);
  const [cancelPendingError, setCancelPendingError] = useState<string | null>(null);

  const fallbackRateToIdr =
    typeof settings?.currency?.rate_to_idr === "number" && Number.isFinite(settings.currency.rate_to_idr) && settings.currency.rate_to_idr > 0
      ? settings.currency.rate_to_idr
      : 16900;
  const invoiceCurrency = (invoice?.currency ?? "USD").toUpperCase();
  const rateToIdr = invoiceCurrency === "USD" ? invoice?.exchangeRate ?? null : fallbackRateToIdr;
  const amountUsd = invoice?.amount ?? 0;
  const normalizedInvoiceStatus = String(invoice?.status ?? '').toLowerCase();
  const missingGatewayExchangeRate = invoiceCurrency === "USD" && (!rateToIdr || rateToIdr <= 0);

  // Dual-pricing tier fields with safe fallbacks to legacy invoice amount
  const tierUsdPrice = invoice?.usdPrice ?? amountUsd;
  const tierIdrPrice = invoice?.idrPrice ?? 0;
  const paymentInfoHtml = invoice?.paymentInfoHtml ?? null;

  const currencyUsd = (v: number) => `$${v.toFixed(2)}`;
  const currencyIdr = (v: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);

  const normalizeMethodType = (method: PaymentMethodData) => method.type?.trim().toLowerCase() ?? "";
  const manualMethods = paymentMethods.filter((method) => normalizeMethodType(method) === "manual");
  const gatewayMethods = paymentMethods.filter((method) => normalizeMethodType(method) === "automatic");
  const hasManualMethods = manualMethods.length > 0;
  const hasGatewayMethods = gatewayMethods.length > 0;
  const hasAnyMethods = hasManualMethods || hasGatewayMethods;
  const gatewayOptionDisabled =
    (!methodsLoading && !hasGatewayMethods) || missingGatewayExchangeRate || tierUsdPrice <= 0;
  const manualOptionDisabled = (!methodsLoading && !hasManualMethods) || tierIdrPrice <= 0;

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
  const isGatewayComplete =
    paymentType === "gateway" &&
    allAgreementsChecked &&
    gatewayMethod !== "" &&
    !missingGatewayExchangeRate;
  const isManualComplete =
    paymentType === "manual" &&
    allAgreementsChecked &&
    manualMethod !== "" &&
    manualAccountName.trim() !== "" &&
    manualSourceName.trim() !== "" &&
    manualPaymentDate.trim() !== "" &&
    manualProofFile !== null;
  const isFormComplete = isGatewayComplete || isManualComplete;

  useEffect(() => {
    // Defer setState to avoid synchronous setState in effect body
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (paymentType === "gateway" && gatewayOptionDisabled && hasManualMethods && !manualOptionDisabled) {
      timer = setTimeout(() => setPaymentType("manual"), 0);
    } else if (paymentType === "manual" && manualOptionDisabled && hasGatewayMethods && !gatewayOptionDisabled) {
      timer = setTimeout(() => setPaymentType("gateway"), 0);
    }
    return () => { if (timer !== null) clearTimeout(timer); };
  }, [gatewayOptionDisabled, manualOptionDisabled, hasGatewayMethods, hasManualMethods, paymentType]);

  const handleCancelPendingPayment = useCallback(async () => {
    if (cancellingPending) return;
    setCancellingPending(true);
    setCancelPendingError(null);
    try {
      const response = await fetch(`/api/portal/payments/${paymentId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const json = (await response.json().catch(() => null)) as unknown;
      if (!response.ok) {
        throw new Error(getErrorMessage(json, "Failed to cancel pending payment"));
      }

      const currentInvoice = invoice;
      if (!currentInvoice) {
        router.push(`/dashboard/payments/${paymentId}`);
        return;
      }

      upsertCachedPaymentPreview(readActiveProgramId(), {
        id: currentInvoice.id,
        label: currentInvoice.label,
        status: "unpaid",
        paymentType: currentInvoice.category,
        amountLabel: `${currentInvoice.currency ?? "USD"} ${currentInvoice.amount.toFixed(2)}`,
        syncDate: currentInvoice.dueDate || "-",
        hasInvoice: true,
      });
      router.push(`/dashboard/payments/${paymentId}`);
      router.refresh();
    } catch (err) {
      setCancelPendingError(err instanceof Error ? err.message : "Failed to cancel pending payment");
    } finally {
      setCancellingPending(false);
    }
  }, [cancellingPending, invoice, paymentId, router]);

  const handleSubmit = useCallback(async () => {
    if (!isFormComplete || submitting) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      if (paymentType === "manual" && !manualMethod) {
        throw new Error("Please select a manual payment method");
      }

      if (paymentType === "manual" && !manualProofFile) {
        throw new Error("Please upload payment proof before completing a manual payment");
      }

      if (paymentType === "gateway" && !gatewayMethod) {
        throw new Error("Please select a gateway payment method");
      }

      const body: Record<string, unknown> = {
        payment_type: paymentType,
        payment_method_id: paymentType === "manual" ? manualMethod : gatewayMethod,
      };

      if (paymentType === "manual") {
        const proofFile = manualProofFile;
        if (!proofFile) {
          throw new Error("Please upload payment proof before completing a manual payment");
        }

        const uploadForm = new FormData();
        uploadForm.append("file", proofFile);

        const uploadResponse = await fetch("/api/portal/payments/proof", {
          method: "POST",
          body: uploadForm,
        });
        const uploadJson = (await uploadResponse.json().catch(() => null)) as unknown;
        if (!uploadResponse.ok) {
          throw new Error(getErrorMessage(uploadJson, "Failed to upload payment proof"));
        }

        const uploadPayload = getEnvelopeData(uploadJson);
        if (!isRecord(uploadPayload)) {
          throw new Error("Failed to parse uploaded payment proof metadata");
        }

        const proofFileId = typeof uploadPayload.fileId === "string" ? uploadPayload.fileId : "";
        const proofFileUrl = typeof uploadPayload.fileUrl === "string" ? uploadPayload.fileUrl : "";
        if (!proofFileId || !proofFileUrl) {
          throw new Error("Uploaded payment proof is missing file metadata");
        }

        body.account_name = manualAccountName;
        body.source_name = manualSourceName;
        body.payment_date = manualPaymentDate;
        body.proof_file_id = proofFileId;
        body.proof_file_url = proofFileUrl;
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
  }, [isFormComplete, submitting, paymentType, manualMethod, manualProofFile, gatewayMethod, manualAccountName, manualSourceName, manualPaymentDate, manualNotes, paymentId, router]);

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

  if (normalizedInvoiceStatus === 'paid') {
    return (
      <section className={paymentsTheme.sectionWrapper}>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <CheckCircle2 className="h-6 w-6 text-emerald-600" />
          <p className="mt-2 text-sm text-slate-700">This invoice has already been paid.</p>
          <Link href={`/dashboard/payments/${paymentId}`} className="mt-4 text-sm text-primary underline">
            Back to Payment Details
          </Link>
        </div>
      </section>
    );
  }

  if (normalizedInvoiceStatus === "processing") {
    const hasCheckoutLink = typeof pendingPayment?.actionUrl === "string" && pendingPayment.actionUrl.length > 0;
    const hasProofImage = typeof pendingPayment?.proofUrl === "string" && pendingPayment.proofUrl.length > 0;
    const paymentMethodLabel = pendingPayment?.paymentMethod ?? invoice.label;

    return (
      <section className={paymentsTheme.sectionWrapper}>
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

        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          <p className="font-semibold">A payment is already pending for this item.</p>
          <p className="mt-1">
            You cannot create a new payment until this one is completed or rejected.
          </p>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Pending Payment Details</p>
          <dl className="mt-3 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Method</dt>
              <dd className="mt-1">{paymentMethodLabel || "-"}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Account Name</dt>
              <dd className="mt-1">{pendingPayment?.accountName || "-"}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Source Name</dt>
              <dd className="mt-1">{pendingPayment?.sourceName || "-"}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Payment Date</dt>
              <dd className="mt-1">{pendingPayment?.paymentDate || "-"}</dd>
            </div>
          </dl>

          {hasProofImage ? (
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Payment Proof</p>
              <a href={pendingPayment?.proofUrl} target="_blank" rel="noreferrer noopener" className="inline-block">
                <Image
                  src={pendingPayment?.proofUrl ?? ""}
                  alt="Manual payment proof"
                  width={400}
                  height={288}
                  unoptimized
                  className="max-h-72 w-auto rounded-xl border border-slate-200 object-contain"
                />
              </a>
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-3">
            {hasCheckoutLink ? (
              <a
                href={pendingPayment?.actionUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
              >
                Continue Pending Checkout
              </a>
            ) : null}
            <button
              type="button"
              onClick={handleCancelPendingPayment}
              disabled={cancellingPending}
              className="inline-flex items-center rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cancellingPending ? "Cancelling..." : "Cancel Pending Payment"}
            </button>
            <Link href={`/dashboard/payments/${paymentId}`} className={paymentsTheme.backButton}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Payment Details</span>
            </Link>
          </div>
          {cancelPendingError ? (
            <p className="mt-3 text-sm text-red-600">{cancelPendingError}</p>
          ) : null}
        </div>
      </section>
    );
  }

  const formattedRate = rateToIdr ? new Intl.NumberFormat("id-ID").format(rateToIdr) : null;
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

              {/* Admin-editable prose, or default */}
              {paymentInfoHtml ? (
                <div
                  className="prose prose-sm text-xs max-w-none"
                  dangerouslySetInnerHTML={{ __html: paymentInfoHtml }}
                />
              ) : (
                <p className="text-xs">
                  Although the amount is displayed in USD for gateway payments, payments will be processed in IDR (Indonesian Rupiah).
                  Manual transfers are denominated directly in IDR.
                </p>
              )}

              {/* Auto-rendered numeric block */}
              {missingGatewayExchangeRate && tierIdrPrice <= 0 ? (
                <p className="text-xs text-rose-700">
                  Payment is unavailable because neither a gateway exchange rate nor a manual IDR price is configured for this program.
                </p>
              ) : (
                <div className="mt-2 pt-2 border-t border-amber-200/50 text-xs space-y-1">
                  {hasGatewayMethods && !missingGatewayExchangeRate && tierUsdPrice > 0 && (
                    <p>
                      <span className="font-semibold">Gateway:</span>{" "}
                      {currencyUsd(tierUsdPrice)} USD
                      {rateToIdr
                        ? ` ≈ ${currencyIdr(tierUsdPrice * rateToIdr)} (rate: 1 USD = ${formattedRate ?? ""} IDR)`
                        : ""}
                    </p>
                  )}
                  {hasManualMethods && tierIdrPrice > 0 && (
                    <p>
                      <span className="font-semibold">Manual transfer:</span>{" "}
                      {currencyIdr(tierIdrPrice)} (fixed)
                    </p>
                  )}
                </div>
              )}

              {/* Method-aware total wording */}
              {paymentType === "gateway" && tierUsdPrice > 0 && !missingGatewayExchangeRate && (
                <p className="mt-2 text-sm">
                  <span className="font-semibold">Estimated total:</span>{" "}
                  {currencyUsd(tierUsdPrice)}
                  {rateToIdr ? ` (≈ ${currencyIdr(tierUsdPrice * rateToIdr)})` : ""}
                </p>
              )}
              {paymentType === "manual" && tierIdrPrice > 0 && (
                <p className="mt-2 text-sm">
                  <span className="font-semibold">Total to pay:</span>{" "}
                  {currencyIdr(tierIdrPrice)}
                </p>
              )}
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
                  onClick={() => {
                    if (!gatewayOptionDisabled) setPaymentType("gateway");
                  }}
                  disabled={gatewayOptionDisabled}
                  aria-disabled={gatewayOptionDisabled}
                  className={`rounded-2xl border p-4 text-left transition-all ${
                    gatewayOptionDisabled
                      ? "cursor-not-allowed border-dashed border-slate-200 bg-slate-100/60 opacity-60"
                      : ""
                  } ${
                    paymentType === "gateway" && !gatewayOptionDisabled
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
                      {tierUsdPrice > 0 && !missingGatewayExchangeRate && (
                        <p className="mt-1 text-xs font-semibold text-slate-700">
                          {currencyUsd(tierUsdPrice)}
                          {rateToIdr ? ` ≈ ${currencyIdr(tierUsdPrice * rateToIdr)}` : ""}
                        </p>
                      )}
                      {gatewayOptionDisabled && (
                        <p className="mt-1 text-[11px] font-medium text-slate-500">Unavailable right now</p>
                      )}
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  role="radio"
                  aria-checked={paymentType === "manual"}
                  onClick={() => {
                    if (!manualOptionDisabled) setPaymentType("manual");
                  }}
                  disabled={manualOptionDisabled}
                  aria-disabled={manualOptionDisabled}
                  className={`rounded-2xl border p-4 text-left transition-all ${
                    manualOptionDisabled
                      ? "cursor-not-allowed border-dashed border-slate-200 bg-slate-100/60 opacity-60"
                      : ""
                  } ${
                    paymentType === "manual" && !manualOptionDisabled
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
                      <p className="mt-1 text-xs font-semibold text-slate-700">
                        {tierIdrPrice > 0 ? currencyIdr(tierIdrPrice) : "—"}
                      </p>
                      {manualOptionDisabled && (
                        <p className="mt-1 text-[11px] font-medium text-slate-500">Unavailable right now</p>
                      )}
                    </div>
                  </div>
                </button>
              </div>

              <div className={paymentsTheme.selectionSummaryRow}>
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>
                  {!methodsLoading && !hasAnyMethods ? (
                    <>No payment type is currently available.</>
                  ) : (
                    <>
                      Selected: <span className="font-semibold">{paymentTypeOptionMeta[paymentType].title}</span>. {paymentTypeOptionMeta[paymentType].helper}
                    </>
                  )}
                </span>
              </div>
            </div>

            {!methodsLoading && !hasAnyMethods ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-5 text-sm text-amber-800">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <p className="font-semibold">No payment methods are available yet</p>
                    <p className="mt-1 text-amber-700">
                      Our team has not configured payment methods for this program yet. Please contact support or check back later.
                    </p>
                  </div>
                </div>
              </div>
            ) : paymentType === "gateway" ? (
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
                {!methodsLoading && !hasGatewayMethods && hasManualMethods && (
                  <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                    Automatic methods are currently unavailable. Please use Manual Transfer instead.
                  </p>
                )}

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
                              <Image
                                src={method.icon}
                                alt={label}
                                width={48}
                                height={24}
                                unoptimized
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
                {!methodsLoading && !hasManualMethods && hasGatewayMethods && (
                  <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                    Manual transfer is currently unavailable. Please use Payment Gateway instead.
                  </p>
                )}

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
                                <Image
                                  src={method.icon}
                                  alt={label}
                                  width={48}
                                  height={24}
                                  unoptimized
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
                          <dd className={paymentsTheme.bankDetailsValue}>
                            {hasHtmlMarkup(selectedManualMethodObj.instructions) ? (
                              <div
                                className="prose prose-sm max-w-none text-slate-700 prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0 prose-a:text-primary"
                                dangerouslySetInnerHTML={{ __html: selectedManualMethodObj.instructions }}
                              />
                            ) : (
                              <div className="whitespace-pre-line">{selectedManualMethodObj.instructions}</div>
                            )}
                          </dd>
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
                      <EnglishTextInput
                        id="manual-account-name"
                        type="text"
                        restrictMode="name"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30"
                        value={manualAccountName}
                        onChange={(e) => setManualAccountName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold" htmlFor="manual-source-name">
                        Source Name
                      </label>
                      <EnglishTextInput
                        id="manual-source-name"
                        type="text"
                        restrictMode="name"
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
                        onChange={(e) => setManualProofFile(e.target.files?.[0] ?? null)}
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-semibold" htmlFor="manual-notes">
                        Additional Notes
                      </label>
                      <EnglishTextArea
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
            {!methodsLoading && !hasAnyMethods && !submitError && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-700">
                Payment cannot be submitted because no method is currently available.
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
