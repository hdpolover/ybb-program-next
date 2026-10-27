// lib/checkout/selection.ts
//
// Pure resolution of "which edition + funding type is in the cart" against the
// authoritative config. Kept free of React/storage so it is unit-testable.
import type { CartCategory, CartLine } from './cart';
import type { CheckoutConfig, CheckoutEdition, CheckoutOption } from './checkoutConfig';

export type Selection = {
  edition: CheckoutEdition;
  option: CheckoutOption;
  line: CartLine;
  /** True when the stored cart line no longer matched the config and we fell back. */
  fellBack: boolean;
};

export function findOption(edition: CheckoutEdition, category: CartCategory): CheckoutOption | undefined {
  return edition.options.find((o) => o.category === category);
}

function toSelection(edition: CheckoutEdition, option: CheckoutOption, fellBack: boolean): Selection {
  return {
    edition,
    option,
    fellBack,
    line: { programSlug: edition.programSlug, tierId: option.tierId, category: option.category },
  };
}

/** Cart line first, then config.selected, then the first edition's first option. Null when nothing is offered. */
export function resolveSelection(config: CheckoutConfig, stored: CartLine | null): Selection | null {
  const match = (line: CartLine | null): Selection | null => {
    if (!line) return null;
    const edition = config.editions.find((e) => e.programSlug === line.programSlug);
    const option = edition ? findOption(edition, line.category) : undefined;
    // A tier id that moved under the same slug+category counts as invalid: the stored price context is stale.
    return edition && option && option.tierId === line.tierId ? toSelection(edition, option, false) : null;
  };

  const fromCart = match(stored);
  if (fromCart) return fromCart;

  const fromConfig = match(config.selected);
  if (fromConfig) return { ...fromConfig, fellBack: stored !== null };

  const edition = config.editions[0];
  const option = edition?.options[0];
  return edition && option ? toSelection(edition, option, stored !== null) : null;
}

/** Switching edition keeps the funding type when the new edition offers it, else takes its first option. */
export function selectEdition(config: CheckoutConfig, current: Selection, programSlug: string): Selection | null {
  const edition = config.editions.find((e) => e.programSlug === programSlug);
  if (!edition) return null;
  const option = findOption(edition, current.option.category) ?? edition.options[0];
  return toSelection(edition, option, false);
}

export function selectCategory(current: Selection, category: CartCategory): Selection | null {
  const option = findOption(current.edition, category);
  return option ? toSelection(current.edition, option, false) : null;
}
