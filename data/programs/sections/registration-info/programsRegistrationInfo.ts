export type ProgramsRegistrationCopy = {
  requirementsTitle: string;
  selfFundedCtaLabel: string;
  fullyFundedCtaLabel: string;
  selfFundedSubtitle: string;
  fullyFundedSubtitle: string;
  feeLabel: string;
  periodLabel: string;
  selfFundedRequirements: string[];
  fullyFundedRequirements: string[];
  selfFundedBenefitTitle: string;
  fullyFundedBenefitTitle: string;
  infoSide: {
    title: string;
    intro: string;
    footer: string;
  };
};

export const PROGRAMS_REGISTRATION_COPY: ProgramsRegistrationCopy = {
  requirementsTitle: 'Requirements',
  selfFundedCtaLabel: 'See Details',
  fullyFundedCtaLabel: 'See Details',
  selfFundedSubtitle: 'Registration',
  fullyFundedSubtitle: 'Reimbursement System',
  feeLabel: 'Registration Fee',
  periodLabel: 'Registration Period:',
  selfFundedRequirements: [
    'Complete registration form and documentation',
    'Submit required documents on time',
    'Pay fees according to scheduled payment batches',
  ],
  fullyFundedRequirements: [
    'Complete registration form and documentation',
    'Submit detailed essays and applications',
    'Participate in interviews and evaluations',
  ],
  selfFundedBenefitTitle: 'Benefit',
  fullyFundedBenefitTitle: 'Benefit (If Selected)',
  infoSide: {
    title: 'Registration Information',
    intro:
      'Make sure you understand the key details about payments, selection, guarantees, and important deadlines before choosing your registration type. This overview is designed to help you make a well-informed decision.',
    footer:
      'For complete terms and conditions, please read the official guidebook and FAQ on the official program website and check regularly for the most recent updates from the organizing committee.',
  },
};
