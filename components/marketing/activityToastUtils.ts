// components/marketing/activityToastUtils.ts
import type { ActivityItem } from '@/lib/api/activity';

export const FIRST_DELAY_MIN_MS = 8_000;
export const FIRST_DELAY_MAX_MS = 15_000;
export const GAP_MIN_MS = 25_000;
export const GAP_MAX_MS = 60_000;
export const TOAST_DURATION_MS = 6_000;
export const MOBILE_BREAKPOINT_PX = 640;
export const SESSION_DISMISS_KEY = 'ybb:activity-toast:dismissed';

const REGIONAL_INDICATOR_BASE = 0x1f1e6;
const LETTER_A = 65;

export function toFlagEmoji(countryCode: string): string {
  if (!/^[A-Za-z]{2}$/.test(countryCode)) return '';

  return String.fromCodePoint(
    ...[...countryCode.toUpperCase()].map(
      (char) => REGIONAL_INDICATOR_BASE + char.charCodeAt(0) - LETTER_A,
    ),
  );
}

export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function randomBetween(minMs: number, maxMs: number): number {
  return Math.floor(minMs + Math.random() * (maxMs - minMs));
}

export function buildActivityMessage(item: ActivityItem): string {
  if (item.type === 'accepted') {
    return `${item.name} from ${item.country} has been accepted as a delegate of ${item.programName}.`;
  }
  return `${item.name} from ${item.country} just registered for ${item.programName}.`;
}
