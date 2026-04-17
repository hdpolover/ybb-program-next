import { ButtonHTMLAttributes, AnchorHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import type { LinkProps } from 'next/link';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  href?: string;
  asExternal?: boolean;
} & Partial<AnchorHTMLAttributes<HTMLAnchorElement>> & Partial<LinkProps>;

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', href, asExternal, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variants = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary',
      secondary: 'bg-accent text-accent-foreground hover:bg-accent/90 focus:ring-accent',
      outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-400',
      ghost: 'bg-transparent text-slate-700 hover:bg-slate-50 focus:ring-slate-400',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg',
      icon: 'h-10 w-10',
    };

    const classes = cn(baseStyles, variants[variant], sizes[size], className);

    if (href) {
      if (asExternal) {
        return (
          <a
            ref={ref as React.Ref<HTMLAnchorElement>}
            href={href}
            className={classes}
            {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
          />
        );
      }
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
        />
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
      />
    );
  }
);

Button.displayName = 'Button';
