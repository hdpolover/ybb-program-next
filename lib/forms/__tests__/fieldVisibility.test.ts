// lib/forms/__tests__/fieldVisibility.test.ts
import { describe, expect, it } from 'vitest';
import { getHiddenFieldNames, isFieldVisible } from '../fieldVisibility';

const field = (name: string, visibleWhen?: unknown) => ({
  name,
  validationRules: visibleWhen === undefined ? {} : { visibleWhen },
});

describe('isFieldVisible', () => {
  it('is visible without a rule', () => {
    expect(isFieldVisible({}, {})).toBe(true);
    expect(isFieldVisible(undefined, {})).toBe(true);
  });

  it('matches case/space-insensitively and supports lists', () => {
    const rules = { visibleWhen: { field: 'is_alumni', equals: ['Yes', 'Maybe'] } };
    expect(isFieldVisible(rules, { is_alumni: ' yes ' })).toBe(true);
    expect(isFieldVisible(rules, { is_alumni: 'No' })).toBe(false);
    expect(isFieldVisible(rules, {})).toBe(false);
  });

  it('matches multi-select arrays and ignores malformed rules', () => {
    expect(isFieldVisible({ visibleWhen: { field: 't', equals: 'x' } }, { t: ['y', 'x'] })).toBe(true);
    expect(isFieldVisible({ visibleWhen: { field: '', equals: 'x' } }, {})).toBe(true);
    expect(isFieldVisible({ visibleWhen: 'nope' }, {})).toBe(true);
  });
});

describe('getHiddenFieldNames', () => {
  const fields = [
    field('is_alumni'),
    field('alumni_program', { field: 'is_alumni', equals: 'Yes' }),
    field('alumni_year', { field: 'alumni_program', equals: ['IYS', 'KYS'] }),
  ];

  it('hides a dependent when its visible controller does not match', () => {
    const hidden = getHiddenFieldNames(fields, { is_alumni: 'No' });
    expect([...hidden]).toEqual(['alumni_program']);
  });

  it('keeps a field visible when its controller is itself hidden (fail closed)', () => {
    const hidden = getHiddenFieldNames(fields, { is_alumni: 'No', alumni_program: 'IYS' });
    expect([...hidden]).toEqual(['alumni_program']);
  });

  it('keeps a field visible when the controller is not in the field set, even with a crafted value', () => {
    const orphan = [field('alumni_program', { field: 'is_alumni', equals: 'Yes' })];
    expect(getHiddenFieldNames(orphan, { is_alumni: 'No' }).size).toBe(0);
  });

  it('hides nothing when every link matches', () => {
    expect(getHiddenFieldNames(fields, { is_alumni: 'Yes', alumni_program: 'KYS' }).size).toBe(0);
  });

  it('keeps every field visible on circular rules', () => {
    const cyclic = [field('a', { field: 'b', equals: '1' }), field('b', { field: 'a', equals: '1' })];
    expect(getHiddenFieldNames(cyclic, { a: '0', b: '0' }).size).toBe(0);
  });
});
