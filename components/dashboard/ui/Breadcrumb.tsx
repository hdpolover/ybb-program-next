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
    <nav aria-label="Breadcrumb" className="flex items-center gap-2">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <div key={index} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronRight className="h-5 w-5 text-slate-400" />
            )}
            
            {isLast ? (
              <span className="text-base font-bold text-primary">
                {item.label}
              </span>
            ) : item.href ? (
              <Link
                href={item.href}
                className="text-base font-normal text-slate-700 hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-base font-normal text-slate-700">
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
