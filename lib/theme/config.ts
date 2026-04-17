export type ProgramId = string;

export type Theme = {
  primary: string;
  primaryForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
};

// Theme sekarang diambil dari CSS variables yang di-set oleh API/settings per domain
export function getTheme(): Theme {
  return {
    primary: 'var(--brand-primary)',
    primaryForeground: 'var(--brand-primary-foreground)',
    accent: 'var(--brand-accent)',
    accentForeground: 'var(--brand-accent-foreground)',
    background: 'var(--color-background)',
    foreground: 'var(--color-foreground)',
  };
}
