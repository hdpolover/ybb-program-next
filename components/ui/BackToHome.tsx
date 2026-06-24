'use client';

import { usePathname } from 'next/navigation';
import { Home } from 'lucide-react';
import { componentsTheme } from '@/lib/theme/components';
import { useEffect, useState } from 'react';

const EXCLUDED_PATHS = [
  '/',
  '/dashboard',
  '/login',
  '/onboarding',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
];

export default function BackToHome() {
  const pathname = usePathname();
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Check if current path should be excluded
  const isExcluded = EXCLUDED_PATHS.some(path => pathname === path || pathname.startsWith(path + '/'));

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setShouldAnimate(true), 50);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (isExcluded) return null;

  return (
    <button
      type="button"
      onClick={() => window.location.href = '/'}
      className="fixed right-0 bottom-24 z-[100] flex items-center gap-2 rounded-l-xl bg-primary px-4 py-3 text-white shadow-xl transition-all duration-300 hover:bg-primary/90 hover:pl-5 focus:outline-none focus:ring-2 focus:ring-primary/50"
      style={{
        animation: shouldAnimate ? 'slideInRight 0.3s ease-out forwards' : 'none'
      }}
      aria-label="Back to home"
    >
      <Home className="h-5 w-5" />
      <span className="hidden font-semibold sm:inline">Home</span>
    </button>
  );
}
