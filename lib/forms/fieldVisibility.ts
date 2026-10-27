// lib/forms/fieldVisibility.ts

/**
 * Conditional visibility for dynamic form fields: validationRules.visibleWhen =
 * { field, equals }. Hidden fields are not rendered, not required, and do not
 * count toward section status. Mirror of the API helper
 * ybb-platform/services/api/src/shared/utils/field-visibility.util.ts; keep the
 * matching rules in sync (the API is the submit gate).
 */
interface VisibleWhenRule {
  field: string;
  equals: string | string[];
}

interface FieldWithRules {
  name: string;
  validationRules?: unknown;
}

const normalize = (value: unknown): string => String(value ?? '').trim().toLowerCase();

function readRule(rules: unknown): VisibleWhenRule | null {
  if (!rules || typeof rules !== 'object') return null;
  const rule = (rules as { visibleWhen?: unknown }).visibleWhen;
  if (!rule || typeof rule !== 'object') return null;
  const { field, equals } = rule as Partial<VisibleWhenRule>;
  if (typeof field !== 'string' || !field) return null;
  if (typeof equals !== 'string' && !Array.isArray(equals)) return null;
  return { field, equals };
}

/** Single-field check against current answers (ignores whether the controller is itself hidden). */
export function isFieldVisible(rules: unknown, values: Record<string, unknown>): boolean {
  const rule = readRule(rules);
  if (!rule) return true;
  const expected = (Array.isArray(rule.equals) ? rule.equals : [rule.equals]).map(normalize);
  const actual = values[rule.field];
  const actualList = Array.isArray(actual) ? actual : [actual];
  return actualList.some(item => item != null && expected.includes(normalize(item)));
}

/**
 * Names of fields hidden by their rule. Fails closed like the API: a field is
 * hidden only when its controller is in `fields`, is itself visible, and does
 * not match. Missing controller, hidden controller, or a rule cycle => visible.
 */
export function getHiddenFieldNames(fields: FieldWithRules[], values: Record<string, unknown>): Set<string> {
  const byName = new Map(fields.map(field => [field.name, field]));
  const controllerOf = (field: FieldWithRules): FieldWithRules | undefined => {
    const rule = readRule(field.validationRules);
    return rule ? byName.get(rule.field) : undefined;
  };
  const hasCycle = (field: FieldWithRules): boolean => {
    const seen = new Set<string>();
    for (let current: FieldWithRules | undefined = field; current; current = controllerOf(current)) {
      if (seen.has(current.name)) return true;
      seen.add(current.name);
    }
    return false;
  };
  const isHidden = (field: FieldWithRules): boolean => {
    const controller = controllerOf(field);
    if (!controller || hasCycle(field)) return false;
    if (isHidden(controller)) return false;
    return !isFieldVisible(field.validationRules, values);
  };

  return new Set(fields.filter(isHidden).map(field => field.name));
}
