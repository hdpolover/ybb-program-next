// lib/awards/awardVisual.ts
// Admin-set award color/icon from the home payload, validated before they reach markup.
const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;
// YIQ brightness below this reads better with white text on top.
const LIGHT_TEXT_MAX_BRIGHTNESS = 128;

/** The admin hex color, or null when unset/invalid so the caller keeps its keyword styling. */
export function awardAccentColor(value: string | null | undefined): string | null {
  return typeof value === 'string' && HEX_COLOR.test(value) ? value : null;
}

/** True when white text/icons are the readable choice on a validated `#rrggbb` background. */
export function prefersLightText(hex: string): boolean {
  const n = parseInt(hex.slice(1), 16);
  const brightness = ((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000;
  return brightness < LIGHT_TEXT_MAX_BRIGHTNESS;
}

/** The icon URL when it is an absolute http(s) URL, else null. */
export function awardIconUrl(value: string | null | undefined): string | null {
  if (typeof value !== 'string' || value.trim() === '') return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
  } catch {
    return null;
  }
}
