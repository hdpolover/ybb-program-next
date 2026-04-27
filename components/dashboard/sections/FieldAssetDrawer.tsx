"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ImageIcon, X } from "lucide-react";

interface FieldAssetDrawerProps {
  open: boolean;
  onClose: () => void;
  src: string;
  alt: string;
}

export function FieldAssetDrawer({ open, onClose, src, alt }: FieldAssetDrawerProps) {
  const isRemote = /^https?:\/\//.test(src);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end justify-end sm:items-start"
      role="dialog"
      aria-modal="true"
      aria-label={`Reference: ${alt}`}
    >
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full w-full max-w-lg flex-col bg-white shadow-2xl sm:h-screen sm:rounded-none">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-2 text-slate-800">
            <ImageIcon className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">{alt}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="focus:ring-primary/40 inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-2"
            aria-label="Close reference drawer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-1 items-center justify-center overflow-auto bg-slate-50 p-6">
          <div className="relative w-full">
            <Image
              src={src}
              alt={alt}
              width={800}
              height={600}
              className="h-auto w-full rounded-xl object-contain shadow-sm"
              unoptimized={isRemote}
            />
          </div>
        </div>

        <div className="border-t border-slate-200 px-5 py-3 text-xs text-slate-500">{alt}</div>
      </div>
    </div>,
    document.body,
  );
}
