import Sidebar from '@/components/dashboard/layout/Sidebar';
import GreetingWithClock from '@/components/dashboard/GreetingWithClock';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // shell grid: sidebar kiri + konten kanan
  return (
    <main className="relative">
      <section className="min-h-screen bg-[url('/img/bgourprogram.png')] bg-cover bg-center bg-no-repeat px-6 py-8 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[260px,1fr]">
          <Sidebar />
          <div className="space-y-6">
            {/* Greeting and Clock - Global for all dashboard pages */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(2,6,23,0.06)]">
              <GreetingWithClock name="HENDRA" />
            </div>
            
            {/* Page Content */}
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}
