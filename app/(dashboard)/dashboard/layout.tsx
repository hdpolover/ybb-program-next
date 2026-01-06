"use client";

import Image from 'next/image';
import { Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/dashboard/layout/Sidebar';
import ProgramSelector from '@/components/dashboard/layout/ProgramSelector';
import GreetingWithClock from '@/components/dashboard/GreetingWithClock';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  let sectionLabel: string | null = null;
  let subLabel: string | null = null;
  if (pathname === '/dashboard') {
    sectionLabel = 'Overview';
  } else if (pathname?.startsWith('/dashboard/submission')) {
    sectionLabel = 'Submission';
    if (pathname === '/dashboard/submission/edit') {
      subLabel = 'Edit';
    }
  } else if (pathname?.startsWith('/dashboard/payments')) {
    sectionLabel = 'Payments';
  } else if (pathname?.startsWith('/dashboard/documents')) {
    sectionLabel = 'Documents';
  }

  let pageTitle = 'Dashboard';
  let pageSubtitle = 'Overview of your program, submissions, and payments.';
  if (pathname === '/dashboard') {
    pageTitle = 'Dashboard Overview';
    pageSubtitle = 'See your registration status, program details, and important guidebook info.';
  } else if (pathname?.startsWith('/dashboard/submission')) {
    pageTitle = 'Submission';
    pageSubtitle = 'Review and manage your application submission details.';
  } else if (pathname?.startsWith('/dashboard/payments')) {
    pageTitle = 'Payments';
    pageSubtitle = 'Track your payment status and manage your registration payments.';
  } else if (pathname?.startsWith('/dashboard/documents')) {
    pageTitle = 'Available Program Documents';
    pageSubtitle = 'Access and download important program materials. These documents contain essential information to ensure your successful program completion.';
  }

  // shell grid: sidebar kiri + konten kanan
  return (
    <main className="relative min-h-screen bg-white">
      <div className="flex min-h-screen">
        {/* Sidebar nempel di kiri */}
        <Sidebar />

        {/* Kolom kanan: navbar atas + konten */}
        <div className="flex min-h-screen flex-1 flex-col">
          {/* Navbar dashboard */}
          <header className="sticky top-0 z-30 flex items-center gap-6 border-b border-slate-100 bg-white px-6 py-4 lg:px-8">
            {/* Spacer kiri (bisa dipakai untuk breadcrumb nanti) */}
            <div className="hidden flex-1 md:block" />

            {/* Search bar di tengah */}
            <div className="flex flex-[2] justify-center">
              <div className="w-full max-w-xl">
                <div className="flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-sm ring-1 ring-slate-200">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search in dashboard..."
                    className="w-full border-none bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
            </div>

            {/* Program selector di kanan */}
            <div className="flex flex-1 justify-end">
              <ProgramSelector />
            </div>
          </header>

          {/* Konten utama dashboard */}
          <section className="flex-1 px-6 py-6 lg:px-8">
            <div className="mx-auto max-w-6xl space-y-4">
              {/* Header halaman (disembunyiin kalau lagi di halaman payments) */}
              {!pathname?.startsWith('/dashboard/payments') && (
                <div className="space-y-1">
                  <h1 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
                    {pageTitle}
                  </h1>
                  <p className="text-xs text-slate-500 sm:text-sm">{pageSubtitle}</p>
                </div>
              )}

              {/* Greeting cuma nongol di halaman utama dashboard overview */}
              {pathname === '/dashboard' && (
                <GreetingWithClock name="HILMI FARREL FIRJATULLAH" />
              )}

              {/* Konten utama halaman */}
              {children}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
