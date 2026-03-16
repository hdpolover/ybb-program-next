export type PortalSubmissionFieldOption =
  | string
  | {
      label: string;
      value: string;
      description?: string;
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

export type PortalSubmissionDetail = {
  applicationId: string;
  programId: string;
  programName: string;
  status: string;
  overallProgress: number;
  sections: PortalSubmissionSection[];
  essays: PortalSubmissionEssay[];
  requirements: PortalSubmissionRequirement[];
};