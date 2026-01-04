"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Clock,
  Mail,
  MessageCircle,
  Tag,
  Info,
  CalendarClock,
  CreditCard,
  Printer,
  ShieldCheck,
  Globe2,
} from "lucide-react";
import HistoryList, { type HistoryItem } from "@/components/dashboard/payments/HistoryList";
import HistoryPanel from "@/components/dashboard/payments/HistoryPanel";

interface PaymentDetailSectionProps {
  paymentId: string;
}

export default function PaymentDetailSection({ paymentId }: PaymentDetailSectionProps) {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<"gateway" | "manual">("gateway");
  const [agreeSelfFunded, setAgreeSelfFunded] = useState(false);
  const [agreeJoinSummit, setAgreeJoinSummit] = useState(false);

  // Konten di-hardcode biar cepat, disesuaiin sama kasus realistis di Overview
  const invoice = {
    id: paymentId,
    label: "Program Fee (Final)",
    category: "Program Fee",
    amount: 450,
    dueDate: "Dec 05, 2025",
    status: "unpaid" as const,
  };

  const currency = (v: number) => `$${v.toFixed(2)}`;
  const overdue = false;

  const history: Array<{
    id: string;
    method: string;
    amount: number;
    date: string;
    time: string;
    status: "cancelled" | "failed" | "processing" | "paid";
    note: string;
  }> = [
    {
      id: "h1",
      method: "Virtual Account",
      amount: 450,
      date: "Nov 10, 2025",
      time: "09:00 AM",
      status: "processing",
      note: "Invoice issued for Program Fee (Final). Payment link generated and sent to your email.",
    },
    {
      id: "h2",
      method: "Email Reminder",
      amount: 450,
      date: "Nov 25, 2025",
      time: "08:15 AM",
      status: "processing",
      note: "Reminder sent. Please complete payment before Dec 05, 2025 to secure your seat.",
    },
  ];

  if (!invoice) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl bg-white p-4 shadow-[0_8px_30px_rgba(2,6,23,0.06)] ring-1 ring-slate-200">
          <p className="text-sm text-slate-700">Payment not found.</p>
        </div>
        <Link
          href="/dashboard/payments"
          className="inline-flex items-center gap-2 text-sm font-semibold text-pink-700 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Payments
        </Link>
      </div>
    );
  }

  const items: HistoryItem[] = history.map(h => ({
    id: h.id,
    title:
      h.status === "cancelled"
        ? "Payment Cancelled"
        : h.status === "paid"
        ? "Payment Completed"
        : h.status === "failed"
        ? "Payment Rejected"
        : h.status === "processing"
        ? "Payment Update"
        : "Payment Created",
    method: h.method,
    amountLabel: currency(h.amount),
    date: h.date,
    time: h.time,
    badge: h.status === "cancelled" ? { label: "Cancelled", tone: "red" } : undefined,
    note: h.note,
    // Detail buat modal — diisi spesifik buat contoh
    details:
      h.id === "h1"
        ? {
            code: "TR-17190-1759390503",
            paymentMethod: "Vakif Bank",
            dateTime: "October 02, 2025 02:35 PM",
            accountName: "tretrt",
            amountLabel: "$10.00",
            source: "trtrt",
            proofUrl: "/img/galeri1.png",
          }
        : {
            code: "TR-88110-1759400111",
            paymentMethod: h.method,
            dateTime: `${h.date} ${h.time}`,
            accountName: "Hilmi",
            amountLabel: currency(h.amount),
            source: "Dashboard",
            proofUrl: "/img/galeri2.png",
          },
    status:
      h.status === "processing"
        ? "pending"
        : h.status === "paid"
        ? "completed"
        : h.status === "cancelled"
        ? "cancelled"
        : h.status === "failed"
        ? "rejected"
        : "created",
  }));

  return (
    <div className="space-y-6">
      {/* Local breadcrumb for payment detail */}
      <nav className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        <Link href="/dashboard/payments" className="text-slate-700 hover:text-slate-900">
          Payments
        </Link>
        <span className="mx-1.5 text-slate-400">/</span>
        <span className="text-pink-600">Payment Details</span>
      </nav>

      {/* Page title */}
      <h1 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
        Payment Details
      </h1>

      <div className="grid gap-6 lg:grid-cols-[1fr,360px]">
        {/* Kolom kiri */}
        <div className="space-y-6">
          {/* Kartu info pembayaran */}
          <div className="rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(2,6,23,0.06)] ring-1 ring-slate-200">
            <p className="text-sm font-extrabold text-slate-900">Payment Information</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <InfoRow
                label="Payment Name"
                value={invoice.label}
                icon={<Tag className="h-4 w-4" />}
              />
              <TagRow label="Category" tag={invoice.category} icon={<Tag className="h-4 w-4" />} />
              <InfoRow
                label="Description"
                value="Japan Youth Summit — Final program fee for self-funded participant"
                icon={<Info className="h-4 w-4" />}
              />
              <InfoRow
                label="Amount"
                value={currency(invoice.amount)}
                icon={<CreditCard className="h-4 w-4" />}
              />
              <InfoRow
                label="Due Date"
                value={`${invoice.dueDate}`}
                overdue={overdue}
                icon={<CalendarClock className="h-4 w-4" />}
              />
            </div>
          </div>

          {/* Payment history section */}
          {items.length === 0 ? (
            <div className="rounded-2xl bg-white p-6 text-center shadow-[0_8px_30px_rgba(2,6,23,0.06)] ring-1 ring-slate-200">
              <div className="mx-auto mb-3 text-pink-600">
                <Clock className="h-10 w-10" />
              </div>
              <p className="text-sm font-extrabold text-slate-900">No Payment History Found</p>
              <p className="mt-1 text-sm text-slate-600">
                There is no payment history available for this payment yet. Once you complete a payment, it will
                appear here.
              </p>
              <button className="mt-4 inline-flex items-center justify-center gap-2 rounded-md bg-pink-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-pink-700">
                <CreditCard className="h-4 w-4" />
                <span>Make First Payment</span>
              </button>
            </div>
          ) : (
            <div className="rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(2,6,23,0.06)] ring-1 ring-slate-200">
              <p className="text-sm font-extrabold text-slate-900">Payment History</p>
              <div className="mt-3">
                <HistoryPanel items={items} pageSize={1} />
              </div>
            </div>
          )}
        </div>

        {/* Kolom kanan */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(2,6,23,0.06)] ring-1 ring-slate-200">
            <div className="px-5 py-3">
              <p className="text-sm font-extrabold text-slate-900">Payment Actions</p>
            </div>
            <div className="space-y-4 px-5 pb-5">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-44 w-full items-center justify-center">
                  <Image
                    src="/img/paymentrequired.png"
                    alt="Payment required illustration"
                    width={320}
                    height={320}
                    className="h-auto w-auto max-h-44"
                  />
                </div>
                <p className="mt-3 text-sm font-extrabold text-slate-900">Payment Required</p>
                <p className="mt-1 text-sm text-slate-600">
                  This payment requires your attention. Please complete your payment before the due date.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-pink-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-700"
              >
                <CreditCard className="h-4 w-4" />
                <span>Make Payment</span>
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(2,6,23,0.06)] ring-1 ring-slate-200">
            <div className="px-5 py-3">
              <p className="text-sm font-extrabold text-slate-900">Quick Actions</p>
            </div>
            <div className="space-y-2 px-5 pb-5">
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800">
                <Printer className="h-4 w-4" />
                <span>Print Details</span>
              </button>

              <a
                href="mailto:support@ybbfoundation.org?subject=Payment%20Assistance"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-pink-50 px-3 py-2 text-sm font-semibold text-pink-700 ring-1 ring-pink-100 transition hover:bg-pink-100"
              >
                <Mail className="h-4 w-4" />
                <span>Contact Administrator</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Payment modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6">
          <div className="flex w-full max-w-xl flex-col rounded-2xl bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.35)] ring-1 ring-slate-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Make Payment</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Although the amount is displayed in USD, payments will be processed in IDR (Indonesian Rupiah).
                  The current conversion rate is 1 USD = 16,900.00 IDR.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-800"
              >
                Close
              </button>
            </div>

            <div className="mt-4 max-h-[60vh] space-y-4 overflow-y-auto pr-1">
              <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 ring-1 ring-amber-100">
                <div className="mt-0.5">
                  <Info className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-700">
                    Important currency information
                  </p>
                  <p className="mt-1 text-xs">
                    Note: The final amount on the payment gateway may slightly differ due to processing fees, taxes,
                    or updated exchange rates.
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Payment Type
                </label>
                <select
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  value={paymentType}
                  onChange={e => setPaymentType(e.target.value === "manual" ? "manual" : "gateway")}
                >
                  <option value="gateway">
                    Payment Gateway (Credit/Debit Card, Virtual Account, QRIS, etc.)
                  </option>
                  <option value="manual">Manual Payment (Bank Transfer, Paypal, etc.)</option>
                </select>
              </div>

              {paymentType === "gateway" ? (
                <div className="space-y-2 pb-1">
                  <p className="text-sm font-extrabold text-slate-900">Automatic Secure Payment Gateway</p>
                  <ol className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-600 text-[11px] font-semibold leading-none text-white">
                        1
                      </span>
                      <span>
                        <span className="font-semibold">Debit or Credit Card (Visa or Mastercard)</span>
                        <br />
                        Use a Visa or Mastercard for payment. You may use either a debit or credit card. Make sure the
                        card number entered is correct and active for use on international websites.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-600 text-[11px] font-semibold leading-none text-white">
                        2
                      </span>
                      <span>
                        <span className="font-semibold">Go to the checkout page</span>
                        <br />
                        After choosing your service, proceed to Checkout on the website or app that uses the payment
                        gateway.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-600 text-[11px] font-semibold leading-none text-white">
                        3
                      </span>
                      <span>
                        <span className="font-semibold">Select "Credit/Debit Card" as the payment method</span>
                        <br />
                        The gateway will show several options like credit/debit cards, virtual accounts, and e-wallets.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-600 text-[11px] font-semibold leading-none text-white">
                        4
                      </span>
                      <span>
                        <span className="font-semibold">Enter your card details</span>
                        <br />
                        Fill in your 16-digit card number, expiry date (MM/YY), CVV, and cardholder name.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-600 text-[11px] font-semibold leading-none text-white">
                        5
                      </span>
                      <span>
                        <span className="font-semibold">Verify with 3D Secure (OTP)</span>
                        <br />
                        You will receive a one-time password (OTP) via SMS or your banking app. Enter the OTP to confirm
                        the transaction.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-600 text-[11px] font-semibold leading-none text-white">
                        6
                      </span>
                      <span>
                        <span className="font-semibold">Payment confirmation</span>
                        <br />
                        If successful, you will see a confirmation page from the payment gateway or merchant and may
                        also receive an email or SMS notification.
                      </span>
                    </li>
                  </ol>
                </div>
              ) : (
                <div className="space-y-4 pb-1">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Payment Method
                    </label>
                    <select className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500">
                      <option value="">Select bank</option>
                      <option value="bca">BCA</option>
                      <option value="bni">BNI</option>
                      <option value="bri">BRI</option>
                      <option value="mandiri">Mandiri</option>
                      <option value="other">Other Bank</option>
                    </select>
                  </div>

                  <div className="flex gap-3 rounded-lg border border-indigo-200 bg-indigo-50 p-3 text-xs text-slate-700 ring-1 ring-indigo-100">
                    <div className="mt-0.5">
                      <Info className="h-4 w-4 text-indigo-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-700">
                        Important bank information
                      </p>
                      <p className="text-xs font-medium text-slate-900">
                        If you pay by this method you have to contact our admin and send your payment proof.
                      </p>
                      <ul className="mt-1 space-y-1 text-xs">
                        <li>
                          <span className="font-semibold">Account Name:</span> Youth Break the Boundaries Foundation
                        </li>
                        <li>
                          <span className="font-semibold">Bank Name:</span> Bank Central Asia (BCA)
                        </li>
                        <li>
                          <span className="font-semibold">Bank Account Number:</span> 1234 5678 90
                        </li>
                        <li>
                          <span className="font-semibold">Swift Code:</span> CENAIDJA
                        </li>
                        <li>
                          <span className="font-semibold">Bank Address:</span> Jakarta, Indonesia
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-extrabold text-slate-900">Bank Transfer Instructions</p>
                    <ol className="space-y-2 text-sm text-slate-700">
                      <li className="flex gap-2">
                        <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-pink-600 text-[11px] font-semibold leading-none text-white">
                          1
                        </span>
                        <span>Log in to your online banking account or visit your bank's branch.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-pink-600 text-[11px] font-semibold leading-none text-white">
                          2
                        </span>
                        <span>Navigate to the "Transfer" or "Send Money" section.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-pink-600 text-[11px] font-semibold leading-none text-white">
                          3
                        </span>
                        <span>Enter the recipient's bank details exactly as shown above.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-pink-600 text-[11px] font-semibold leading-none text-white">
                          4
                        </span>
                        <span>Input the transfer amount and select the currency (if applicable).</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-pink-600 text-[11px] font-semibold leading-none text-white">
                          5
                        </span>
                        <span>Review all details carefully to ensure accuracy.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-pink-600 text-[11px] font-semibold leading-none text-white">
                          6
                        </span>
                        <span>Confirm the transfer and save the transaction confirmation for your records.</span>
                      </li>
                    </ol>
                  </div>

                  <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700 md:grid-cols-2">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Registration Type
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{invoice.category}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Registration Fee
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{currency(invoice.amount)}</p>
                    </div>
                  </div>

                  <div className="grid gap-3 text-xs text-slate-700 md:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Account Name
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                        placeholder="Your bank account name"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Source Name
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                        placeholder="Payer name or organization"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Payment Date
                      </label>
                      <input
                        type="date"
                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Payment Proof (Upload File)
                      </label>
                      <input
                        type="file"
                        className="block w-full text-xs text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-pink-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-pink-700 hover:file:bg-pink-100"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Additional Notes
                      </label>
                      <textarea
                        rows={3}
                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                        placeholder="Any additional information for the finance team"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="flex items-center gap-3 rounded-md bg-pink-50 px-3 py-2 text-xs text-slate-700 ring-1 ring-pink-100">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-pink-600 focus:ring-pink-500"
                    checked={agreeSelfFunded}
                    onChange={e => setAgreeSelfFunded(e.target.checked)}
                  />
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-pink-600" />
                    <span className="leading-snug">
                      If I am not selected as a fully funded participant, I agree to continue as a self-funded
                      participant, and the payment is non-refundable.
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 rounded-md bg-indigo-50 px-3 py-2 text-xs text-slate-700 ring-1 ring-indigo-100">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    checked={agreeJoinSummit}
                    onChange={e => setAgreeJoinSummit(e.target.checked)}
                  />
                  <div className="flex items-center gap-2">
                    <Globe2 className="h-4 w-4 text-indigo-600" />
                    <span className="leading-snug">
                      I am ready to join the Japan Youth Summit 2026 in Kyoto, Japan.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!agreeSelfFunded || !agreeJoinSummit}
                className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition
                  ${!agreeSelfFunded || !agreeJoinSummit
                    ? "cursor-not-allowed bg-pink-200 text-white"
                    : "bg-pink-600 text-white hover:bg-pink-700"}`}
              >
                Complete Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
  overdue?: boolean;
  icon: React.ReactNode;
}

function InfoRow({ label, value, overdue, icon }: InfoRowProps) {
  return (
    <div className="flex gap-3">
      <div className="mt-1 text-pink-600">{icon}</div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-1 text-sm text-slate-700">
          {value}{" "}
          {overdue ? (
            <span className="ml-2 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-700 ring-1 ring-red-200">
              Overdue
            </span>
          ) : null}
        </p>
      </div>
    </div>
  );
}

interface TagRowProps {
  label: string;
  tag: string;
  icon: React.ReactNode;
}

function TagRow({ label, tag, icon }: TagRowProps) {
  return (
    <div className="flex gap-3">
      <div className="mt-1 text-pink-600">{icon}</div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <span className="mt-1 inline-block rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
          {tag}
        </span>
      </div>
    </div>
  );
}
