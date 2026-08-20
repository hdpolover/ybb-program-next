export type PortalSubmissionFieldOption =
  | string
  | {
      label: string;
      value: string;
      description?: string;
    };

export type PortalFieldHelpAsset = {
  kind: 'link' | 'video' | 'file';
  label: string;
  url: string;
};

export type PortalSubmissionField = {
  id: string;
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  helpText?: string;
  mediaUrl?: string;
  mediaAlt?: string;
  helpAssets?: PortalFieldHelpAsset[];
  options?: PortalSubmissionFieldOption[];
  validationRules?: Record<string, unknown>;
  isRequired: boolean;
  order: number;
};

export type PortalSubmissionSection = {
  id: string;
  title: string;
  description?: string;
  fields: PortalSubmissionField[];
  values: Record<string, unknown>;
  status: 'pending' | 'in_progress' | 'completed' | string;
};

export type PortalSubmissionEssay = {
  id: string;
  question: string;
  isRequired: boolean;
  wordLimit?: number;
  order: number;
  answer?: string;
};

export type PortalSubmissionRequirement = {
  id: string;
  name: string;
  description?: string;
  type: string;
  isRequired: boolean;
  order: number;
  uploadedFile?: Record<string, unknown>;
};

export type PortalProgramOption = {
  id: string;
  name: string;
};

export type PortalSubmissionDetail = {
  applicationId: string;
  programId: string;
  programName: string;
  status: string;
  overallProgress: number;
  sections: PortalSubmissionSection[];
  essays: PortalSubmissionEssay[];
  requirements: PortalSubmissionRequirement[];
  essayGuidelineText?: string;
  essayGuidelineUrl?: string;
  programs?: PortalProgramOption[];
  participantName?: string;
  participantId?: string;
  participantAccountId?: string;
  participantLocation?: string;
  participantAvatarUrl?: string;
  termsAndConditions?: string | null;
  previewChecklistItems?: string[];
  previewPrimaryAction?: {
    type: 'submit_application' | 'complete_payment' | string;
    label: string;
    enabled: boolean;
    reason?: string;
    /** True when the program deadline has passed. Unlike other blockers this is not fixable by the participant. */
    deadlinePassed?: boolean;
  };
  isRegistrationPaymentRequired?: boolean;
  isRegistrationPaymentSettled?: boolean;
};

export type PortalSubmissionProgressSection = {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'issues' | string;
  isRequired: boolean;
  updatedAt?: string;
};

export type PortalSubmissionProgress = {
  applicationId: string;
  programName: string;
  status: string;
  overallProgress: number;
  sections: PortalSubmissionProgressSection[];
};
