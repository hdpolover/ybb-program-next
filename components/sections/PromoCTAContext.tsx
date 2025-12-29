'use client';

import { createContext, useContext, useMemo, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import PromoCTA from './PromoCTA';
import { getCTAPreset } from './PromoCTAPresets';

type Ctx = {
  content: ReactNode | null;
  setContent: (node: ReactNode | null) => void;
};

const PromoCtx = createContext<Ctx | null>(null);

export function PromoCTAProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ReactNode | null>(null);
  const value = useMemo(() => ({ content, setContent }), [content]);
  return <PromoCtx.Provider value={value}>{children}</PromoCtx.Provider>;
}

export function usePromoCTA() {
  const ctx = useContext(PromoCtx);
  if (!ctx) throw new Error('usePromoCTA must be used within PromoCTAProvider');
  return ctx;
}

export function PromoCTASlot() {
  const ctx = useContext(PromoCtx);
  const pathname = usePathname();
  // Kalo providernya belum kepasang, render preset sesuai route atau default aja
  if (!ctx) return getCTAPreset(pathname) ?? <PromoCTA />;
  return <>{ctx.content ?? getCTAPreset(pathname) ?? <PromoCTA />}</>;
}

export function SetPromoCTA({ children }: { children: ReactNode }) {
  const { setContent } = usePromoCTA();
  useEffect(() => {
    setContent(children);
    return () => setContent(null);
  }, [children, setContent]);
  return null;
}
