import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 * @param inputs - Class names to merge
 * @returns Merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to readable string
 * @param date - Date to format
 * @param locale - Locale for formatting
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, locale: string = 'en-US'): string {
  const dateObj = parseApiDate(date);
  if (Number.isNaN(dateObj.getTime())) return '-';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

/** Parse backend date values consistently before local rendering. */
export function parseApiDate(date: Date | string | null | undefined): Date {
  if (!date) return new Date('');
  if (date instanceof Date) return date;

  const raw = date.trim();
  if (!raw) return new Date('');

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return new Date(`${raw}T00:00:00`);
  }

  const normalized = /(?:[zZ]|[+-]\d{2}:\d{2})$/.test(raw) ? raw : `${raw}Z`;
  return new Date(normalized);
}

/** Convert local datetime-local input value to UTC ISO string for API writes. */
export function toUtcIsoFromLocalInput(value: string | null | undefined): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

/** Convert UTC/ISO backend value to datetime-local input value in user locale. */
export function toLocalDatetimeInputValue(value: Date | string | null | undefined): string {
  const parsed = parseApiDate(value);
  if (Number.isNaN(parsed.getTime())) return '';

  const pad = (n: number) => String(n).padStart(2, '0');
  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}T${pad(parsed.getHours())}:${pad(parsed.getMinutes())}`;
}

/**
 * Format number to readable string
 * @param number - Number to format
 * @param locale - Locale for formatting
 * @returns Formatted number string
 */
export function formatNumber(number: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(number);
}

/**
 * Format tokenized values like `event_details` into user-friendly labels.
 */
export function formatTokenLabel(value: string | null | undefined, fallback = '-'): string {
  if (!value) return fallback;

  return value
    .replace(/[_-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
