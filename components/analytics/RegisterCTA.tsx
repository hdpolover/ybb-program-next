// components/analytics/RegisterCTA.tsx
'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { trackInitiateCheckout } from '@/lib/analytics/metaPixel';

interface RegisterCTAProps {
  href: string;
  className?: string;
  children: ReactNode;
  contentName?: string;
}

export function RegisterCTA({ href, className, children, contentName }: RegisterCTAProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => trackInitiateCheckout(contentName ? { content_name: contentName } : undefined)}
    >
      {children}
    </Link>
  );
}
