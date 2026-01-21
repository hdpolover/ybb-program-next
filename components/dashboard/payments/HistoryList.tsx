"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Clock, XCircle, CheckCircle2 } from "lucide-react";
import { jysSectionTheme } from "@/lib/theme/jys-components";

const paymentsTheme = jysSectionTheme.dashboardPayments;

export type HistoryItem = {
  id: string;
  title: string; // contoh: Pembayaran Dibatalkan
  method: string;
  amountLabel: string; // format mata uang
  date: string; // contoh: 02 Okt 2025
  time: string; // contoh: 02:35 PM
  badge?: { label: string; tone: 'red' | 'amber' | 'emerald' };
  note: string;
  status?: 'created' | 'pending' | 'completed' | 'cancelled' | 'rejected';
  // Detail buat modal (opsional, kalo ada ya ditampilin)
  details?: {
    code: string;
    paymentMethod: string;
    dateTime: string;
    accountName: string;
    amountLabel: string;
    source: string;
    proofUrl?: string; // url gambar bukti
  };
};

export default function HistoryList({
  items,
  pageSize = 2,
}: {
  items: HistoryItem[];
  pageSize?: number;
}) {
  const [page, setPage] = useState(1);
  const [active, setActive] = useState<HistoryItem | null>(null); // item yang lagi dibuka modanya
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const badgeClass = (tone: "red" | "amber" | "emerald") =>
    tone === "red"
      ? "bg-red-50 text-red-700 ring-red-200"
      : tone === "amber"
        ? "bg-amber-50 text-amber-700 ring-amber-200"
        : "bg-emerald-50 text-emerald-700 ring-emerald-200";

  const iconTone = (status?: HistoryItem['status']) => {
    switch (status) {
      case 'completed':
        return { Icon: CheckCircle2, cls: 'text-emerald-600 bg-emerald-50 ring-emerald-200' };
      case 'cancelled':
      case 'rejected':
        return { Icon: XCircle, cls: 'text-red-600 bg-red-50 ring-red-200' };
      case 'pending':
      default:
        return { Icon: Clock, cls: 'text-amber-600 bg-amber-50 ring-amber-200' };
    }
  };

  return (
    <div className={paymentsTheme.historyListWrapper}>
      {/* state modal sederhana */}
      {active && (
        <Modal onClose={() => setActive(null)}>
          <div className="space-y-4">
            <p className="text-base font-extrabold text-blue-950">Transaction Details</p>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Transaction Information
                </p>
                <div className={paymentsTheme.historyModalSectionBody}>
                  <div>
                    <span className="font-semibold">Transaction Code:</span>{" "}
                    {active.details?.code ?? '-'}
                  </div>
                  <div>
                    <span className="font-semibold">Payment Method:</span>{" "}
                    {active.details?.paymentMethod ?? active.method}
                  </div>
                  <div>
                    <span className="font-semibold">Date:</span>{" "}
                    {active.details?.dateTime ?? `${active.date} ${active.time}`}
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Payment Information
                </p>
                <div className={paymentsTheme.historyModalSectionBody}>
                  <div>
                    <span className="font-semibold">Account Name:</span>{" "}
                    {active.details?.accountName ?? '-'}
                  </div>
                  <div>
                    <span className="font-semibold">Amount:</span>{" "}
                    {active.details?.amountLabel ?? active.amountLabel}
                  </div>
                  <div>
                    <span className="font-semibold">Source:</span> {active.details?.source ?? '-'}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Payment Proof
              </p>
              {active.details?.proofUrl ? (
                <div className={paymentsTheme.historyProofImageWrapper}>
                  <div className={paymentsTheme.historyProofImageInner}>
                    <Image
                      src={active.details.proofUrl}
                      alt="Payment proof"
                      width={800}
                      height={600}
                      className={paymentsTheme.historyProofImage}
                    />
                  </div>
                  <div className={paymentsTheme.historyProofActionsRow}>
                    <a
                      href={active.details.proofUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className={paymentsTheme.historyProofLinkButton}
                    >
                      View Full Image
                    </a>
                    <a
                      href={active.details.proofUrl}
                      download
                      className={paymentsTheme.historyProofDownloadButton}
                    >
                      Download
                    </a>
                  </div>
                </div>
              ) : (
                <p className={paymentsTheme.historyEmptyProofText}>Belum ada bukti pembayaran.</p>
              )}
            </div>
          </div>
        </Modal>
      )}

      <ul className={paymentsTheme.historyList}>
        {pageItems.map(it => (
          <li key={it.id} className={paymentsTheme.historyListItem}>
            <div className={paymentsTheme.historyListItemHeader}>
              {(() => {
                const i = iconTone(it.status);
                const Icon = i.Icon;
                return (
                  <span className={`${paymentsTheme.historyStatusIconCircle} ${i.cls}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                );
              })()}
              <div className="flex-1">
                <p className={paymentsTheme.historyTitle}>
                  {it.title}
                  {it.badge ? (
                    <span
                      className={`ml-2 ${jysSectionTheme.dashboardDocuments.statusBadgeBase} ${badgeClass(it.badge.tone)}`}
                    >
                      {it.badge.label}
                    </span>
                  ) : null}
                </p>
                <div className={paymentsTheme.historyMetaRow}>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                    {it.method}
                  </span>
                  <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                    {it.amountLabel}
                  </span>
                  <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                    {it.date}
                  </span>
                  <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                    {it.time}
                  </span>
                </div>
                <p className={paymentsTheme.historyNote}>{it.note}</p>
                <div className="mt-3">
                  <button
                    className={paymentsTheme.historyViewDetailsButton}
                    onClick={() => setActive(it)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Paginasi, tanpa scroll konten */}
      <div className={paymentsTheme.historyPaginationRow}>
        <p className={paymentsTheme.historyPaginationText}>
          Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, items.length)} of{" "}
          {items.length}
        </p>
        <div className="flex items-center gap-2">
          <button
            className={paymentsTheme.historyPaginationButton}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          <span className={paymentsTheme.historyPaginationPageLabel}>
            Page {page} / {totalPages}
          </span>
          <button
            className={paymentsTheme.historyPaginationButton}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal super ringan (tanpa lib) — klik backdrop buat nutup
function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  // bikin animasi masuk/keluar yang halus
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && handleClose();
    document.addEventListener('keydown', onKey);
    // next tick biar transition kepicu
    const t = setTimeout(() => setVisible(true), 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    // kasih waktu transition selesai baru unmount
    setTimeout(() => onClose(), 200);
  };

  return (
    <div className={paymentsTheme.historyModalOverlay}>
      <div
        className={`${paymentsTheme.historyModalBackdrop} ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />
      <div
        className={`${paymentsTheme.historyModalCard} ${
          visible ? "translate-y-0 scale-100 opacity-100" : "-translate-y-2 scale-95 opacity-0"
        }`}
      >
        <div className={paymentsTheme.historyModalHeaderRow}>
          <span className={paymentsTheme.historyModalHeaderTitle}>Detail Transactions</span>
          <button
            onClick={handleClose}
            className={paymentsTheme.historyModalHeaderCloseButton}
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
