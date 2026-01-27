export type BrandKey = 'jys' | 'iys';

export type BrandTheme = {
  /**
   * Warna aksen utama brand (dipakai untuk button utama, badge, highlight utama)
   */
  accent: string;
  /**
   * Versi lembut dari accent (background badge, chip, dsb.)
   */
  accentSoft: string;
  /**
   * Warna teks di atas accent
   */
  accentForeground: string;
  /**
   * Warna utama brand (biasanya untuk heading besar, link utama)
   */
  primary: string;
  primaryForeground: string;
  /**
   * Warna teks body default
   */
  text: string;
  /**
   * Warna untuk border/outline brand (opsional)
   */
  border: string;
};

export const BRAND_THEMES: Record<BrandKey, BrandTheme> = {
  jys: {
    // Sesuai nuansa pink sekarang (Tailwind kira-kira: pink-600)
    accent: '#EC4899',
    accentSoft: '#FCE7F3',
    accentForeground: '#FFFFFF',
    // Biru tua untuk heading (mirip blue-950)
    primary: '#020617',
    primaryForeground: '#FFFFFF',
    // Teks body netral
    text: '#0F172A',
    // Border bernuansa pink
    border: '#FB7185',
  },
  iys: {
    // Contoh: biru neon / biru muda terang
    // (bisa di-adjust nanti sesuai brand guideline IYS)
    accent: '#38BDF8', // neon-ish light blue (approx sky-400)
    accentSoft: '#E0F2FE',
    accentForeground: '#020617',
    // Biru tua untuk heading / background utama
    primary: '#0F172A', // dark navy
    primaryForeground: '#F9FAFB',
    // Teks utama dominan hitam / hampir hitam
    text: '#020617',
    // Border biru terang
    border: '#0EA5E9',
  },
};
