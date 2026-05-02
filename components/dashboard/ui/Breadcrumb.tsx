"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 sm:gap-2">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <div key={index} className="flex min-w-0 items-center gap-1.5 sm:gap-2">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 sm:h-5 sm:w-5" />
            )}
            
            {isLast ? (
              <span className="max-w-[12rem] truncate text-sm font-bold text-primary sm:max-w-none sm:text-base">
                {item.label}
              </span>
            ) : item.href ? (
              <Link
                href={item.href}
                className="max-w-[8.5rem] truncate text-sm font-normal text-slate-700 transition-colors hover:text-primary sm:max-w-none sm:text-base"
              >
                {item.label}
              </Link>
            ) : (
              <span className="max-w-[8.5rem] truncate text-sm font-normal text-slate-700 sm:max-w-none sm:text-base">
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
