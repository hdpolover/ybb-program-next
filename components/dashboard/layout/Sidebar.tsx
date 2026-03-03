"use client";
import Image from "next/image";
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
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { jysSectionTheme } from "@/lib/theme/jys-components";

const layoutTheme = jysSectionTheme.dashboardLayout;

// Sidebar kiri buat navigasi dashboard — simple dan konsisten sama tema
export default function Sidebar({
  profileEmail,
}: {
  profileEmail?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  // Pas SSR dibuat ketutup dulu biar ga bentrok hidrasi, ntar dibuka pas komponen udah kepasang
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    // Ambil state yang kependem di localStorage, abis itu auto-buka sesuai path yang lagi aktif
    let next: Record<string, boolean> = {};
    try {
      const raw = window.localStorage.getItem("dashboard_sidebar_open");
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
      window.localStorage.setItem("dashboard_sidebar_open", JSON.stringify(open));
    } catch {}
  }, [open, mounted]);

  const renderIcon = (href: string) => {
    if (href === "/dashboard") return <LayoutDashboard className="h-4 w-4" />;
    if (href.startsWith("/dashboard/submission")) return <Upload className="h-4 w-4" />;
    if (href.startsWith("/dashboard/documents")) return <FolderClosed className="h-4 w-4" />;
    if (href.startsWith("/dashboard/payments")) return <CreditCard className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const onLogout = async () => {
    if (logoutLoading) return;
    setLogoutLoading(true);
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } finally {
      router.push('/login');
      setLogoutLoading(false);
    }
  };

  return (
    <aside className={layoutTheme.sidebarWrapper}>
      {/* Logo header */}
      <div className={layoutTheme.sidebarLogoRow}>
        <div className={layoutTheme.sidebarLogoImageWrapper}>
          <Image src="/img/jysfooters.png" alt="Japan Youth Summit" fill className="object-contain" />
        </div>
      </div>

      <div className={layoutTheme.sidebarMainColumn}>
        <nav className={layoutTheme.sidebarNavWrapper}>
          {dashboardNav.map(item => {
          const active =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const hasChildren = !!(item.children && item.children.length);
          const expanded = hasChildren ? !!open[item.href] && mounted : false;
          return (
            <div key={item.href} className={layoutTheme.navGroupWrapper}>
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() => setOpen(prev => ({ ...prev, [item.href]: !prev[item.href] }))}
                  className={`${layoutTheme.navParentButtonBase} ${
                    active
                      ? layoutTheme.navParentButtonActive
                      : layoutTheme.navParentButtonInactive
                  }`}
                  aria-expanded={expanded}
                  aria-controls={`submenu-${item.href}`}
                >
                  <span className={layoutTheme.navParentLabelRow}>
                    {renderIcon(item.href)}
                    <span>{item.label}</span>
                  </span>
                  <svg
                    aria-hidden
                    viewBox="0 0 20 20"
                    className={`${layoutTheme.navParentChevron} ${
                      expanded ? 'rotate-180' : ''
                    }`}
                    fill="currentColor"
                  >
                    <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.133l3.71-2.9a.75.75 0 1 1 .92 1.183l-4.2 3.285a.75.75 0 0 1-.92 0l-4.2-3.285a.75.75 0 0 1 .02-1.206z" />
                  </svg>
                </button>
              ) : (
                <a
                  href={item.href}
                  className={`${layoutTheme.navLinkBase} ${
                    active
                      ? layoutTheme.navLinkActive
                      : layoutTheme.navLinkInactive
                  }`}
                >
                  <span className={layoutTheme.navParentLabelRow}>
                    {renderIcon(item.href)}
                    <span>{item.label}</span>
                  </span>
                  {active ? <span className={layoutTheme.navActiveDot} /> : null}
                </a>
              )}

              {hasChildren ? (
                <div
                  id={`submenu-${item.href}`}
                  className={`${layoutTheme.navSubmenuGrid} ${
                    expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className={layoutTheme.navSubmenuInner}>
                    {item.children!.map(child => {
                      const childActive = pathname === child.href;
                      return (
                        <a
                          key={child.href}
                          href={child.href}
                          className={`${layoutTheme.navSubLinkBase} ${
                            childActive
                              ? layoutTheme.navSubLinkActive
                              : layoutTheme.navSubLinkInactive
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
        <div className={layoutTheme.profileSectionWrapper}>
          <div className={layoutTheme.profileRow}>
            <div className={layoutTheme.profileAvatarWrapper}>
              <Image
                src="/img/photoprofile.png"
                alt="Dashboard profile"
                fill
                className={layoutTheme.profileAvatarImage}
                sizes="36px"
              />
            </div>
            <div>
              <div className={layoutTheme.profileName}>{profileEmail || 'Participant'}</div>
            </div>
          </div>
          <button
            type="button"
            className={layoutTheme.profileActionButton}
          >
            <span className={layoutTheme.profileActionLabelRow}>
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </span>
          </button>

          <button
            type="button"
            className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium text-white/90 transition hover:bg-white/10"
            onClick={onLogout}
            disabled={logoutLoading}
          >
            <span className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span>{logoutLoading ? 'Logging out...' : 'Log out'}</span>
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
