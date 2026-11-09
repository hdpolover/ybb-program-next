// lib/dashboard/applicationStatus.ts
import type { PortalDashboardSummary } from '@/components/dashboard/DashboardDataContext';
import { formatDate, parseApiDate } from '@/lib/utils';

type ActiveApplication = NonNullable<PortalDashboardSummary['activeApplication']>;

export type ApplicationStatusTone = 'warning' | 'success' | 'info';

export type ApplicationStatusView = {
  tone: ApplicationStatusTone;
  title: string;
  body: string;
  /** Only present when the API supplied submissionChecklist; never guessed. */
  checklist?: Array<{ label: string; done: boolean }>;
  /** Pre-formatted, e.g. "March 3, 2027". */
  deadline?: string;
  cta?: 'continue' | 'switch';
  /** Plain text shown instead of a CTA (e.g. why switching is locked). */
  note?: string;
  /** Append a link to the contact page after `note`. */
  showContactLink?: boolean;
};

const CATEGORY_LABEL = { fully_funded: 'Fully Funded', self_funded: 'Self Funded' } as const;

/**
 * Where does the applicant stand? First match wins; null means "not this card's
 * job" (accepted, rejected, ... are handled by the rest of the dashboard).
 * Every new API field is optional, so an old API degrades to status +
 * submissionDeadline instead of making a claim it cannot back up.
 */
export function deriveApplicationStatus(
  application: ActiveApplication | null | undefined,
  now: Date = new Date(),
): ApplicationStatusView | null {
  if (!application) return null;
  const { status, category } = application;
  const label =
    category === 'fully_funded' || category === 'self_funded' ? CATEGORY_LABEL[category] : null;
  const program = application.programName?.trim() || 'the program';

  if (status === 'draft') {
    if (application.isSubmissionClosed) {
      return {
        tone: 'warning',
        title: 'Application not submitted — registration closed',
        body: `You started ${label ? `a ${label}` : 'an'} application for ${program} but never submitted it, so it was not included in the selection. Only submitted applications with a paid registration fee are reviewed.`,
      };
    }
    const checklist = application.submissionChecklist;
    const deadlineDate = parseApiDate(application.submissionDeadline);
    return {
      tone: 'warning',
      title: 'Not submitted yet',
      body: `Your ${label ? `${label} ` : ''}application is not in the selection until ${checklist ? 'all steps below are done' : 'you submit it'}.`,
      checklist: checklist && [
        { label: 'Complete the application form', done: checklist.formComplete },
        { label: 'Pay the registration fee', done: checklist.registrationFeePaid },
        { label: 'Submit your application', done: checklist.submitted },
      ],
      deadline: Number.isNaN(deadlineDate.getTime()) ? undefined : formatDate(deadlineDate),
      cta: 'continue',
    };
  }

  if (status !== 'submitted') return null;

  if (category === 'self_funded') {
    return {
      tone: 'success',
      title: 'Application submitted',
      body: `Your Self Funded application for ${program} has been received.`,
    };
  }
  if (category !== 'fully_funded') return null;

  if (application.fundingDecision === 'awarded') {
    return {
      tone: 'success',
      title: 'Awarded Fully Funded',
      body: `Congratulations — you've been selected for the Fully Funded track of ${program}. Check your email for next steps.`,
    };
  }
  if (application.fundingDecision === 'not_awarded') {
    const message = application.switchCategoryMessage?.trim();
    const canSwitch = application.canSwitchCategory === true;
    return {
      tone: 'info',
      title: 'Not selected for Fully Funded',
      body: `You can still join ${program} as a Self Funded participant.`,
      cta: canSwitch ? 'switch' : undefined,
      note: canSwitch
        ? undefined
        : message || 'Reply to your results email or contact our team to continue as Self Funded.',
      showContactLink: !canSwitch && !message,
    };
  }

  const announced = parseApiDate(application.fundingResultsAnnouncedAt);
  if (!application.fundingResultsAnnouncedAt || Number.isNaN(announced.getTime())) {
    return {
      tone: 'info',
      title: 'In Fully Funded selection',
      body: "Your application is complete. We'll email your result — no action needed right now.",
    };
  }
  if (announced.getTime() <= now.getTime()) {
    return {
      tone: 'info',
      title: `Fully Funded results were emailed on ${formatDate(announced)}`,
      body: 'Check your inbox and spam folder for an email from us. If you were not selected, you can still join as Self Funded.',
    };
  }
  return {
    tone: 'info',
    title: 'In Fully Funded selection',
    body: `Your application is complete. Results will be emailed on ${formatDate(announced)}.`,
  };
}
