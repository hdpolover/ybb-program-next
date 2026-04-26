'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronDown, LogOut, Settings, UserCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Props = {
  profileName?: string;
  profileEmail?: string;
  profileImageUrl?: string;
  isAmbassador?: boolean;
};

export default function UserMenuPopover({
  profileName,
  profileEmail,
  profileImageUrl,
  isAmbassador = false,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    if (logoutLoading) return;
    setLogoutLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      router.push('/login');
    }
  };

  const displayName = profileName?.trim() || profileEmail || 'Participant';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:shadow-md"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {/* Avatar */}
        <span className="relative flex h-7 w-7 shrink-0 overflow-hidden rounded-full bg-primary/10">
          {profileImageUrl ? (
            <Image
              src={profileImageUrl}
              alt={displayName}
              fill
              className="object-cover"
              sizes="28px"
              unoptimized
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-xs font-bold text-primary">
              {initial}
            </span>
          )}
        </span>
        <span className="hidden max-w-[120px] truncate capitalize sm:block">{displayName}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-slate-200 bg-white py-2 shadow-xl">
          {/* Profile header */}
          <div className="border-b border-slate-100 px-4 pb-3 pt-1">
            <p className="truncate text-sm font-semibold capitalize text-slate-800">{displayName}</p>
            {profileEmail && (
              <p className="truncate text-xs text-slate-500">{profileEmail}</p>
            )}
            {isAmbassador && (
              <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                <UserCircle2 className="h-3 w-3" />
                Ambassador
              </span>
            )}
          </div>

          <div className="py-1">
            {/* Profile / Settings */}
            <Link
              href="/dashboard/settings"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              <Settings className="h-4 w-4 text-slate-400" />
              <span>Profile &amp; Settings</span>
            </Link>

            <div className="my-1 border-t border-slate-100" />

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              disabled={logoutLoading}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              <span>{logoutLoading ? 'Logging out…' : 'Log out'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
