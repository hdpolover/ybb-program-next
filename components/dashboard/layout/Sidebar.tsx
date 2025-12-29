'use client';
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
  return (
    <aside className="sticky top-20 h-[calc(100dvh-5rem)] w-full max-w-[260px] shrink-0 overflow-auto rounded-2xl bg-[url('/img/bg3striplurus.png')] bg-cover bg-center p-3 shadow-[0_8px_30px_rgba(2,6,23,0.06)] ring-1 ring-slate-200">
      <nav className="space-y-1 rounded-xl bg-white/70 p-2 backdrop-blur ring-1 ring-white/40">
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
                    active ? 'bg-pink-50 text-pink-700 ring-1 ring-pink-200' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                  aria-expanded={expanded}
                  aria-controls={`submenu-${item.href}`}
                >
                  <span>{item.label}</span>
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
                    active ? 'bg-pink-50 text-pink-700 ring-1 ring-pink-200' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.label}</span>
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
                              ? 'bg-pink-50 text-pink-700 ring-1 ring-pink-200'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
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
    </aside>
  );
}
