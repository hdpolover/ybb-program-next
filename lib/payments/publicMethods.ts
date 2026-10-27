// lib/payments/publicMethods.ts

// Mirrors GET /v1/landing/payment-methods. The API whitelists these three
// fields on purpose (no account details); do not widen this type to "just in case" fields.
export type PublicPaymentMethod = {
  name: string;
  type: string;
  logo_url: string | null;
};

export type ProgramPaymentMethods = {
  program_id: string;
  program_slug: string;
  methods: PublicPaymentMethod[];
};

export type PublicPaymentMethodsData = {
  programs: ProgramPaymentMethods[];
};

const TYPE_LABELS: Record<string, string> = {
  manual: 'Manual transfer',
  automatic: 'Online payment',
};

export function formatPaymentMethodType(type: string): string {
  const known = TYPE_LABELS[type];
  if (known) return known;
  const spaced = type.replace(/[_-]+/g, ' ').trim();
  return spaced ? spaced.charAt(0).toUpperCase() + spaced.slice(1) : '';
}

/**
 * Distinct methods for the given programs, in first-seen order. When none of the
 * ids match (e.g. the single-edition fallback view has no real program id), all
 * programs are used rather than showing nothing.
 */
export function collectPaymentMethods(
  data: PublicPaymentMethodsData | null,
  programIds: readonly string[],
): PublicPaymentMethod[] {
  const programs = data?.programs ?? [];
  const matched = programs.filter((p) => programIds.includes(p.program_id));
  const source = matched.length > 0 ? matched : programs;

  const seen = new Set<string>();
  const result: PublicPaymentMethod[] = [];
  for (const program of source) {
    for (const method of program.methods ?? []) {
      const key = `${method.name}|${method.type}`;
      if (seen.has(key)) continue;
      seen.add(key);
      result.push(method);
    }
  }
  return result;
}
