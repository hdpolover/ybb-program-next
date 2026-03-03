import type { Locale } from '@/types';

/**
 * Dapet local dari req atau default
 */
export function getLocaleFromHeaders(headers: Headers): Locale {
  const acceptLanguage = headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage.split(',')[0].split('-')[0];
    if (preferredLocale === 'id' || preferredLocale === 'en') {
      return preferredLocale;
    }
  }
  return 'en';
}

/**
 * Nge-load file terjemahan buat locale tertentu
 */
export async function getTranslations(locale: Locale, namespace: string = 'common') {
  try {
    const translations = await import(`@/locales/${locale}/${namespace}.json`);
    return translations.default;
  } catch (error) {
    console.error(`Failed to load translations for ${locale}/${namespace}:`, error);
    // Kalo gagal, fallback ke bahasa Inggris dulu nih
    if (locale !== 'en') {
      const fallback = await import(`@/locales/en/${namespace}.json`);
      return fallback.default;
    }
    return {};
  }
}
