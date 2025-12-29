'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full bg-pink-600 text-white shadow-lg ring-1 ring-pink-300 transition hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-400 animate-heartbeat"
      aria-label="Back to top"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
