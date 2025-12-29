// tipe-tipe dasar buat dashboard peserta (biar rapi dan reusable)
export type FundingType = 'fully_funded' | 'self_funded' | 'partial';
export type ApplicationStage = 'applied' | 'shortlist' | 'interview' | 'final' | 'confirmed';

export type ApplicationSummary = {
  program: string;
  cohort: string;
  funding: FundingType;
  stage: ApplicationStage;
  progress: number; // 0..100
};

export type MessageItem = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  unread?: boolean;
};

export type Invoice = {
  id: string;
  label: string;
  amount: number; // in USD
  status: 'paid' | 'unpaid' | 'overdue';
  dueDate?: string;
};
