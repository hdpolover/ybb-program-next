// lib/dashboard/__tests__/applicationStatus.test.ts
import { describe, it, expect } from 'vitest';
import type { PortalDashboardSummary } from '@/components/dashboard/DashboardDataContext';
import { deriveApplicationStatus } from '../applicationStatus';

type App = NonNullable<PortalDashboardSummary['activeApplication']>;

const NOW = new Date('2027-03-10T00:00:00Z');
const base: App = { id: 'a1', programName: 'MEYS 2027', status: 'submitted', category: 'fully_funded' };
const derive = (o: Partial<App>) => deriveApplicationStatus({ ...base, ...o }, NOW);

describe('deriveApplicationStatus', () => {
  it('1: closed draft is a warning with no CTA', () => {
    const v = derive({ status: 'draft', isSubmissionClosed: true });
    expect(v).toMatchObject({ tone: 'warning', title: 'Application not submitted — registration closed' });
    expect(v?.body).toContain('You started a Fully Funded application for MEYS 2027 but never submitted it');
    expect(v?.cta).toBeUndefined();
  });

  it('1 beats 2 even when a checklist is present', () => {
    const v = derive({
      status: 'draft',
      isSubmissionClosed: true,
      submissionChecklist: { formComplete: true, registrationFeePaid: false, submitted: false },
    });
    expect(v?.title).toMatch(/registration closed/);
    expect(v?.checklist).toBeUndefined();
  });

  it('2: open draft shows checklist, deadline and continue CTA', () => {
    const v = derive({
      status: 'draft',
      isSubmissionClosed: false,
      submissionDeadline: '2027-04-01T00:00:00Z',
      submissionChecklist: { formComplete: true, registrationFeePaid: false, submitted: false },
    });
    expect(v).toMatchObject({ tone: 'warning', title: 'Not submitted yet', cta: 'continue' });
    expect(v?.body).toBe(
      'Your Fully Funded application is not in the selection until all steps below are done.',
    );
    expect(v?.checklist).toEqual([
      { label: 'Complete the application form', done: true },
      { label: 'Pay the registration fee', done: false },
      { label: 'Submit your application', done: false },
    ]);
    expect(v?.deadline).toBe('April 1, 2027');
  });

  it('2 (old API): no checklist, no claim about steps below, still has continue CTA', () => {
    const v = derive({ status: 'draft' });
    expect(v?.title).toBe('Not submitted yet');
    expect(v?.checklist).toBeUndefined();
    expect(v?.body).not.toMatch(/below/);
    expect(v?.deadline).toBeUndefined();
    expect(v?.cta).toBe('continue');
  });

  it('3: awarded', () => {
    expect(derive({ fundingDecision: 'awarded' })).toMatchObject({
      tone: 'success',
      title: 'Awarded Fully Funded',
    });
  });

  it('4: not awarded offers the switch when allowed', () => {
    const v = derive({ fundingDecision: 'not_awarded', canSwitchCategory: true });
    expect(v).toMatchObject({ tone: 'info', title: 'Not selected for Fully Funded', cta: 'switch' });
    expect(v?.note).toBeUndefined();
  });

  it('4: not awarded and blocked shows the backend message', () => {
    const v = derive({
      fundingDecision: 'not_awarded',
      canSwitchCategory: false,
      switchCategoryMessage: ' Pay first. ',
    });
    expect(v?.cta).toBeUndefined();
    expect(v?.note).toBe('Pay first.');
    expect(v?.showContactLink).toBe(false);
  });

  it('4: not awarded and blocked without a message falls back to contact copy', () => {
    const v = derive({ fundingDecision: 'not_awarded', canSwitchCategory: false });
    expect(v?.note).toMatch(/contact our team/);
    expect(v?.showContactLink).toBe(true);
  });

  it('5: announcement date in the past', () => {
    const v = derive({ fundingResultsAnnouncedAt: '2027-03-01T00:00:00Z' });
    expect(v?.title).toBe('Fully Funded results were emailed on March 1, 2027');
    expect(v?.body).toMatch(/inbox and spam/);
  });

  it('6: announcement date in the future', () => {
    const v = derive({ fundingResultsAnnouncedAt: '2027-03-20T00:00:00Z' });
    expect(v?.title).toBe('In Fully Funded selection');
    expect(v?.body).toBe('Your application is complete. Results will be emailed on March 20, 2027.');
  });

  it.each([[undefined], [null], ['not-a-date']])('7: no usable announcement date (%s)', (value) => {
    const v = derive({ fundingResultsAnnouncedAt: value });
    expect(v?.title).toBe('In Fully Funded selection');
    expect(v?.body).toMatch(/no action needed/);
  });

  it('8: submitted self funded ignores any funding decision', () => {
    const v = derive({ category: 'self_funded', fundingDecision: 'not_awarded' });
    expect(v).toMatchObject({ tone: 'success', title: 'Application submitted' });
    expect(v?.body).toBe('Your Self Funded application for MEYS 2027 has been received.');
  });

  it('returns null for other statuses, unknown category and no application', () => {
    expect(derive({ status: 'accepted' })).toBeNull();
    expect(derive({ status: undefined })).toBeNull();
    expect(derive({ category: undefined })).toBeNull();
    expect(deriveApplicationStatus(null, NOW)).toBeNull();
    expect(deriveApplicationStatus(undefined, NOW)).toBeNull();
  });

  it('falls back to generic wording when programName and category are missing', () => {
    const v = derive({ status: 'draft', isSubmissionClosed: true, programName: undefined, category: undefined });
    expect(v?.body).toContain('You started an application for the program');
  });
});
