"use client";
import Image from "next/image";
import Link from "next/link";
import {
  House,
  BarChart3,
  CreditCard,
  FileText,
  FolderClosed,
  LayoutDashboard,
  Upload,
  Users,
} from 'lucide-react';
import { dashboardNav, ambassadorNav } from '@/lib/dashboard/nav';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { componentsTheme } from "@/lib/theme/components";
import { useSettings } from "@/components/providers/SettingsProvider";

const layoutTheme = componentsTheme.dashboardLayout;

// Sidebar kiri buat navigasi dashboard — simple dan konsisten sama tema
export default function Sidebar({
  isAmbassador = false,
  isAmbassadorDataLoading = false,
}: {
  isAmbassador?: boolean;
  isAmbassadorDataLoading?: boolean;
}) {
  const pathname = usePathname();
  const { settings } = useSettings();
  const activeNav = isAmbassador ? ambassadorNav : dashboardNav;
  // Pas SSR dibuat ketutup dulu biar ga bentrok hidrasi, ntar dibuka pas komponen udah kepasang
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

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
    ambassadorNav.forEach(it => {
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
    if (isAmbassador && href === "/dashboard") return <Users className="h-4 w-4" />;
    if (href.startsWith("/dashboard/referrals")) return <BarChart3 className="h-4 w-4" />;
    if (href === "/dashboard") return <LayoutDashboard className="h-4 w-4" />;
    if (href.startsWith("/dashboard/ambassador")) return <Users className="h-4 w-4" />;
    if (href.startsWith("/dashboard/submission")) return <Upload className="h-4 w-4" />;
    if (href.startsWith("/dashboard/documents")) return <FolderClosed className="h-4 w-4" />;
    if (href.startsWith("/dashboard/payments")) return <CreditCard className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  return (
    <aside className={layoutTheme.sidebarWrapper}>
      {/* Logo header */}
      <div className={layoutTheme.sidebarLogoRow}>
        <div className={layoutTheme.sidebarLogoImageWrapper}>
          
          {settings?.brand?.logo_url ? (
            <Image
              src={settings.brand.logo_url}
              alt={settings?.brand?.name || "Logo"}
              fill
              className="object-contain object-left brightness-0 invert"
              priority
              unoptimized
            />
          ) : (
            <span className="text-white font-bold text-xl">{settings?.brand?.name || "Dashboard"}</span>
          )}

        </div>
      </div>

      <div className={layoutTheme.sidebarMainColumn}>
        <nav className={layoutTheme.sidebarNavWrapper}>
          {activeNav.map(item => {
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
                <Link
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
                </Link>
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
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`${layoutTheme.navSubLinkBase} ${
                            childActive
                              ? layoutTheme.navSubLinkActive
                              : layoutTheme.navSubLinkInactive
                          }`}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
        </nav>

        <div className="w-full pt-4">
          <Link
            href="/"
            className="flex w-full items-center justify-between rounded-xl border border-white/20 px-3 py-2 text-sm font-semibold text-white/90 transition hover:border-white/35 hover:bg-white/10"
          >
            <span className={layoutTheme.navParentLabelRow}>
              <House className="h-4 w-4" />
              <span>Back to Landing Page</span>
            </span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
