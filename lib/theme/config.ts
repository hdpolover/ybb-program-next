export type ProgramId = 'jys';

export type Theme = {
  primary: string;
  primaryForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
};

export const themes: Record<ProgramId, Theme> = {
  jys: {
    primary: '#1c57b3',
    primaryForeground: '#ffffff',
    accent: '#db2777',
    accentForeground: '#ffffff',
    background: '#ffffff',
    foreground: '#020617',
  },
};

export function getTheme(program: ProgramId = 'jys'): Theme {
  return themes[program];
}
