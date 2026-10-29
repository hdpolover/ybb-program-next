// lib/marketing/optIn.ts

/**
 * Wording shown next to every marketing-email opt-in. The API stores its own canonical
 * copy on each consent audit row (MARKETING_CONSENT_TEXT in ybb-platform); if this text
 * changes meaning, bump MARKETING_CONSENT_VERSION there too.
 */
export const MARKETING_OPT_IN_LABEL = 'Send me updates about upcoming YBB programs';

/** Only an explicit tick is sent; omitted means "not subscribed" for old and new API alike. */
export function marketingOptInField(checked: boolean): { marketingOptIn?: true } {
  return checked ? { marketingOptIn: true } : {};
}
