"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
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

const paymentsTheme = componentsTheme.dashboardPayments;

interface PaymentMakeSectionProps {
  paymentId: string;
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

export default function PaymentMakeSection({ paymentId }: PaymentMakeSectionProps) {
  const { settings } = useSettings();
  const router = useRouter();
  const rateToIdr = settings?.currency?.rate_to_idr ?? 16900;

  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        const json = (await response.json().catch(() => ({}))) as any;
        if (!response.ok) {
          throw new Error(json?.message || "Failed to load payment details");
        }

        if (!cancelled) {
          setInvoice(json?.data?.invoice ?? null);
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

  const [paymentType, setPaymentType] = useState<"gateway" | "manual">("gateway");
  const [manualMethod, setManualMethod] = useState<
    "bca" | "bni" | "bri" | "mandiri" | "paypal"
  >("bca");
  const [agreeFunding, setAgreeFunding] = useState(false);
  const [agreeReady, setAgreeReady] = useState(false);
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

  // NOTE: Bank methods are hardcoded as UI config for now.
  // These could be moved to an API endpoint in the future (e.g. /api/portal/payment-methods).
  const bankMethods: {
    id: "bca" | "bni" | "bri" | "mandiri" | "paypal";
    label: string;
    logoSrc: string;
  }[] = [
    { id: "bca", label: "BCA Bank Transfer", logoSrc: "/img/bca-logo.png" },
    { id: "bni", label: "BNI Bank Transfer", logoSrc: "/img/bni-logo.png" },
    { id: "bri", label: "BRI Bank Transfer", logoSrc: "/img/bri-logo.png" },
    { id: "mandiri", label: "Mandiri Bank Transfer", logoSrc: "/img/mandiri-logo.png" },
    { id: "paypal", label: "PayPal", logoSrc: "/img/paypal-logo.png" },
  ];

  const isGatewayComplete = paymentType === "gateway" && agreeFunding && agreeReady;
  const isManualComplete =
    paymentType === "manual" &&
    agreeFunding &&
    agreeReady &&
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
      const body: Record<string, unknown> = {
        payment_type: paymentType,
        payment_method_id: paymentType === "manual" ? manualMethod : "credit_card",
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

      const json = (await response.json().catch(() => ({}))) as any;

      if (!response.ok) {
        throw new Error(json?.message || "Payment submission failed");
      }

      const data = json?.data ?? {};

      // Gateway: redirect to payment gateway URL if provided
      if (data.action?.url) {
        window.location.href = data.action.url;
        return;
      }

      // Success — go back to the payment detail page
      router.push(`/dashboard/payments/${paymentId}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Payment submission failed");
    } finally {
      setSubmitting(false);
    }
  }, [isFormComplete, submitting, paymentType, manualMethod, manualAccountName, manualSourceName, manualPaymentDate, manualNotes, paymentId, router]);

  if (loading) {
    return (
      <section className={paymentsTheme.sectionWrapper}>
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-sm text-slate-500">Loading payment details...</span>
        </div>
      </section>
    );
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

            <div className={paymentsTheme.pillSelectWrapper}>
              <label htmlFor="payment-type-select" className="block">
                Select Payment Type
              </label>
              <select
                id="payment-type-select"
                className={`${paymentsTheme.pillSelect} w-full sm:max-w-xs`}
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value as "gateway" | "manual")}
              >
                <option value="gateway">
                  Payment Gateway (Credit/Debit Card, Virtual Account, QRIS, etc.)
                </option>
                <option value="manual">
                  Manual Payment (Bank Transfer, Paypal, etc.)
                </option>
              </select>

              <div className={paymentsTheme.selectionSummaryRow}>
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>
                  {paymentType === "gateway"
                    ? "You selected: Payment Gateway (Credit/Debit Card, Virtual Account, QRIS, etc.)"
                    : "You selected: Manual Payment (Bank Transfer, Paypal, etc.)"}
                </span>
              </div>
            </div>

            {paymentType === "gateway" ? (
              <div className="space-y-3">
                <p className={paymentsTheme.fieldLabelSmall}>
                  Automatic Secure Payment Gateway
                </p>

                <div className={paymentsTheme.stepWrapper}>
                  <div className={paymentsTheme.stepRow}>
                    <div className={paymentsTheme.stepNumberCircle}>
                      1
                    </div>
                    <div>
                      <p className={paymentsTheme.stepTextTitle}>
                        Debit or Credit Card (Visa or Mastercard)
                      </p>
                      <p className={paymentsTheme.stepTextBody}>
                        Use a Visa or Mastercard for payment. Make sure your card is active and enabled for
                        international online transactions.
                      </p>
                    </div>
                  </div>

                  <div className={paymentsTheme.stepRow}>
                    <div className={paymentsTheme.stepNumberCircle}>
                      2
                    </div>
                    <div>
                      <p className={paymentsTheme.stepTextTitle}>Go to the checkout page</p>
                      <p className={paymentsTheme.stepTextBody}>
                        After choosing your service, proceed to the checkout page that uses our official
                        payment gateway.
                      </p>
                    </div>
                  </div>

                  <div className={paymentsTheme.stepRow}>
                    <div className={paymentsTheme.stepNumberCircle}>
                      3
                    </div>
                    <div>
                      <p className={paymentsTheme.stepTextTitle}>
                        Select "Credit/Debit Card" as the payment method
                      </p>
                      <p className={paymentsTheme.stepTextBody}>
                        The payment gateway will show several options such as:
                      </p>
                      <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-slate-700">
                        <li>Credit/Debit Card (Visa, Mastercard, JCB)</li>
                        <li>Virtual Account (BCA, BNI, Mandiri, etc.)</li>
                        <li>E-wallets (GoPay, ShopeePay, OVO, etc.)</li>
                      </ul>
                    </div>
                  </div>

                  <div className={paymentsTheme.stepRow}>
                    <div className={paymentsTheme.stepNumberCircle}>
                      4
                    </div>
                    <div>
                      <p className={paymentsTheme.stepTextTitle}>Enter your card details</p>
                      <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-slate-700">
                        <li>Card number (16 digits)</li>
                        <li>Expiry date (MM/YY)</li>
                        <li>CVV (3-digit code on the back of the card)</li>
                        <li>Cardholder name</li>
                      </ul>
                    </div>
                  </div>

                  <div className={paymentsTheme.stepRow}>
                    <div className={paymentsTheme.stepNumberCircle}>
                      5
                    </div>
                    <div>
                      <p className={paymentsTheme.stepTextTitle}>Verify with 3D Secure (OTP)</p>
                      <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-slate-700">
                        <li>You will receive an OTP (One-Time Password) via SMS or your banking app.</li>
                        <li>Enter the OTP to confirm the transaction.</li>
                      </ul>
                    </div>
                  </div>

                  <div className={paymentsTheme.stepRow}>
                    <div className={paymentsTheme.stepNumberCircle}>
                      6
                    </div>
                    <div>
                      <p className={paymentsTheme.stepTextTitle}>Payment confirmation</p>
                      <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-slate-700">
                        <li>
                          If successful, you will see a confirmation page from the payment gateway or the
                          merchant (Youth Break the Boundaries).
                        </li>
                        <li>You will also receive an email and/or SMS notification.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={paymentsTheme.manualPaymentWrapper}>
                <div className="space-y-2">
                  <p className={paymentsTheme.fieldLabelSmall}>
                    Payment Method
                  </p>
                  <p className="text-xs text-slate-600">
                    Choose one of the available bank transfer options below. You will need to contact our admin
                    and send your payment proof after completing the transfer.
                  </p>

                  <div className={paymentsTheme.pillSelectWrapper}>
                    <label htmlFor="manual-method-select" className="block">
                      Select Bank / Method
                    </label>

                    <div className={paymentsTheme.bankMethodGrid} id="manual-method-select">
                      {bankMethods.map((method) => {
                        const isSelected = manualMethod === method.id;
                        return (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() =>
                              setManualMethod(
                                method.id as "bca" | "bni" | "bri" | "mandiri" | "paypal",
                              )
                            }
                            className={`${paymentsTheme.bankMethodCard} ${
                              isSelected ? paymentsTheme.bankMethodCardSelected : ""
                            }`}
                          >
                            <span className={paymentsTheme.bankMethodLogoWrapper}>
                              <img
                                src={method.logoSrc}
                                alt={method.label}
                                className={paymentsTheme.bankMethodLogoImage}
                              />
                            </span>
                            <span className="text-center leading-snug">{method.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className={paymentsTheme.selectionSummaryRow}>
                      {manualMethod === "paypal" ? (
                        <Globe2 className="h-4 w-4 text-primary" />
                      ) : (
                        <CreditCard className="h-4 w-4 text-primary" />
                      )}
                      <span>
                        {manualMethod === "paypal"
                          ? "You selected: PayPal (International participants)"
                          : `You selected: Bank Transfer - ${
                              manualMethod === "bca"
                                ? "BCA"
                                : manualMethod === "bni"
                                ? "BNI"
                                : manualMethod === "bri"
                                ? "BRI"
                                : "Mandiri"
                            }`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className={paymentsTheme.fieldLabelSmall}>
                    Bank Transfer Instructions
                  </p>
                  <p className={paymentsTheme.manualNote}>If you pay by this method you have to contact our admin and send your payment proof.</p>

                  <dl className={paymentsTheme.bankDetailsGrid}>
                    <div>
                      <dt className={paymentsTheme.bankDetailsTerm}>Account Name</dt>
                      <dd className={paymentsTheme.bankDetailsValue}>YOUTH BREAK THE BOUNDARIES</dd>
                    </div>
                    <div>
                      <dt className={paymentsTheme.bankDetailsTerm}>Bank Name</dt>
                      <dd className={paymentsTheme.bankDetailsValue}>Bank Central Asia (BCA)</dd>
                    </div>
                    <div>
                      <dt className={paymentsTheme.bankDetailsTerm}>Bank Account Number</dt>
                      <dd className={paymentsTheme.bankDetailsValue}>1234 5678 90</dd>
                    </div>
                    <div>
                      <dt className={paymentsTheme.bankDetailsTerm}>Swift Code</dt>
                      <dd className={paymentsTheme.bankDetailsValue}>CENAIDJA</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className={paymentsTheme.bankDetailsTerm}>Bank Address</dt>
                      <dd className={paymentsTheme.bankDetailsValue}>
                        Jl. Example Address No. 123, Jakarta, Indonesia
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-2 space-y-3">
                    <div className={paymentsTheme.stepRow}>
                      <div className={paymentsTheme.stepNumberCircle}>
                        1
                      </div>
                      <p className="flex items-center gap-2 text-sm text-slate-700">
                        <CreditCard className="h-4 w-4 text-primary" />
                        <span>Log in to your online banking account or visit your bank's branch.</span>
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <div className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white shadow-sm">
                        2
                      </div>
                      <p className="flex items-center gap-2 text-sm text-slate-700">
                        <CalendarClock className="h-4 w-4 text-primary" />
                        <span>Navigate to the "Transfer" or "Send Money" section.</span>
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <div className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white shadow-sm">
                        3
                      </div>
                      <p className="flex items-center gap-2 text-sm text-slate-700">
                        <Info className="h-4 w-4 text-primary" />
                        <span>Enter the recipient's bank details as listed above.</span>
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <div className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white shadow-sm">
                        4
                      </div>
                      <p className="flex items-center gap-2 text-sm text-slate-700">
                        <CreditCard className="h-4 w-4 text-primary" />
                        <span>Input the transfer amount and select the currency (if applicable).</span>
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <div className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white shadow-sm">
                        5
                      </div>
                      <p className="flex items-center gap-2 text-sm text-slate-700">
                        <Info className="h-4 w-4 text-primary" />
                        <span>Review the details for accuracy.</span>
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <div className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white shadow-sm">
                        6
                      </div>
                      <p className="flex items-center gap-2 text-sm text-slate-700">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <span>
                          Confirm the transfer and authorize the payment, then save the transaction confirmation
                          for your records.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
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
            <label className={paymentsTheme.agreementRowBrand}>
              <input
                type="checkbox"
                className={paymentsTheme.agreementCheckboxBrand}
                checked={agreeFunding}
                onChange={(e) => setAgreeFunding(e.target.checked)}
              />
              <div className={paymentsTheme.agreementRowInner}>
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="leading-snug">
                  If I am not selected as a fully funded participant, I agree to continue as a self-funded participant,
                  and the payment is non-refundable.
                </span>
              </div>
            </label>

            <label className={paymentsTheme.agreementRowIndigo}>
              <input
                type="checkbox"
                className={paymentsTheme.agreementCheckboxIndigo}
                checked={agreeReady}
                onChange={(e) => setAgreeReady(e.target.checked)}
              />
              <div className={paymentsTheme.agreementRowInner}>
                <Globe2 className="h-4 w-4 text-primary" />
                <span className="leading-snug">
                  I am ready to join the Japan Youth Summit 2026 in Kyoto, Japan.
                </span>
              </div>
            </label>
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
