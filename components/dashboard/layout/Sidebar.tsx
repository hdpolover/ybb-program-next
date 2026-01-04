'use client';
import Image from 'next/image';
import {
  CreditCard,
  FileText,
  FolderClosed,
  LayoutDashboard,
  LogOut,
  Settings,
  Upload,
  UserCircle2,
} from 'lucide-react';
import { dashboardNav } from '@/lib/dashboard/nav';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

// Sidebar kiri buat navigasi dashboard — simple dan konsisten sama tema
export default function Sidebar() {
  const pathname = usePathname();
  // Pas SSR dibuat ketutup dulu biar ga bentrok hidrasi, ntar dibuka pas komponen udah kepasang
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Ambil state yang kependem di localStorage, abis itu auto-buka sesuai path yang lagi aktif
    let next: Record<string, boolean> = {};
    try {
      const raw = window.localStorage.getItem('dashboard_sidebar_open');
      if (raw) next = JSON.parse(raw) || {};
    } catch {}
    dashboardNav.forEach(it => {
      if (it.children && pathname.startsWith(it.href)) next[it.href] = true;
    });
    setOpen(next);
    setMounted(true);
  }, [pathname]);

  useEffect(() => {
    if (!mounted) return;
    try {
      window.localStorage.setItem('dashboard_sidebar_open', JSON.stringify(open));
    } catch {}
  }, [open, mounted]);

  const renderIcon = (href: string) => {
    if (href === '/dashboard') return <LayoutDashboard className="h-4 w-4" />;
    if (href.startsWith('/dashboard/submission')) return <Upload className="h-4 w-4" />;
    if (href.startsWith('/dashboard/documents')) return <FolderClosed className="h-4 w-4" />;
    if (href.startsWith('/dashboard/payments')) return <CreditCard className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };
  return (
    <aside className="sticky top-0 flex h-screen w-[260px] shrink-0 flex-col border-r border-slate-200 bg-[#e53b8c] px-3 py-6">
      {/* Logo header */}
      <div className="mb-5 flex justify-start">
        <div className="relative h-14 w-32">
          <Image src="/img/jysfooters.png" alt="Japan Youth Summit" fill className="object-contain" />
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4">
        <nav className="w-full space-y-1">
          {dashboardNav.map(item => {
          const active =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const hasChildren = !!(item.children && item.children.length);
          const expanded = hasChildren ? !!open[item.href] && mounted : false;
          return (
            <div key={item.href} className="space-y-1">
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() => setOpen(prev => ({ ...prev, [item.href]: !prev[item.href] }))}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold transition ${
                    active
                      ? 'bg-white text-pink-700 ring-1 ring-pink-200'
                      : 'text-white/85 hover:bg-white/10'
                  }`}
                  aria-expanded={expanded}
                  aria-controls={`submenu-${item.href}`}
                >
                  <span className="flex items-center gap-2">
                    {renderIcon(item.href)}
                    <span>{item.label}</span>
                  </span>
                  <svg
                    aria-hidden
                    viewBox="0 0 20 20"
                    className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
                    fill="currentColor"
                  >
                    <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.133l3.71-2.9a.75.75 0 1 1 .92 1.183l-4.2 3.285a.75.75 0 0 1-.92 0l-4.2-3.285a.75.75 0 0 1 .02-1.206z" />
                  </svg>
                </button>
              ) : (
                <a
                  href={item.href}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    active
                      ? 'bg-white text-pink-700 ring-1 ring-pink-200'
                      : 'text-white/85 hover:bg-white/10'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {renderIcon(item.href)}
                    <span>{item.label}</span>
                  </span>
                  {active ? <span className="inline-block h-2 w-2 rounded-full bg-pink-600" /> : null}
                </a>
              )}

              {hasChildren ? (
                <div
                  id={`submenu-${item.href}`}
                  className={`grid transition-all ${expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'} ml-3 pl-3`}
                >
                  <div className="min-h-0 border-l border-slate-200 pl-2">
                    {item.children!.map(child => {
                      const childActive = pathname === child.href;
                      return (
                        <a
                          key={child.href}
                          href={child.href}
                          className={`block rounded-lg px-2 py-1.5 text-[13px] font-medium transition ${
                            childActive
                              ? 'bg-white text-pink-700 ring-1 ring-pink-200'
                              : 'text-white/80 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {child.label}
                        </a>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
        </nav>

        {/* Bottom profile + settings */}
        <div className="mt-4 space-y-3 border-t border-white/30 pt-4 text-sm text-white/90">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-full bg-white/90 ring-2 ring-white/60">
              <Image
                src="/img/photoprofile.png"
                alt="Dashboard profile"
                fill
                className="object-cover"
                sizes="36px"
              />
            </div>
            <div>
              <div className="text-sm font-semibold leading-tight">Hilmi Farrel F.</div>
              <div className="mt-0.5 inline-flex items-center rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
                JYS Participant
              </div>
            </div>
          </div>
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium text-white/90 transition hover:bg-white/10"
          >
            <span className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </span>
          </button>

          <button
            type="button"
            className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium text-white/90 transition hover:bg-white/10"
          >
            <span className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
