import type { ApplicationSummary, Invoice, MessageItem } from './types';

export const mockApplication: ApplicationSummary = {
  program: 'Japan Youth Summit',
  cohort: '2025',
  funding: 'self_funded',
  stage: 'shortlist',
  progress: 45,
};

export const mockMessages: MessageItem[] = [
  { id: 'm1', title: 'Visa briefing schedule', excerpt: 'Please join the mandatory visa briefing next week…', date: 'Nov 12, 2025', unread: true },
  { id: 'm2', title: 'Document verification', excerpt: 'Your academic transcript has been verified.', date: 'Nov 10, 2025' },
];

export const mockInvoices: Invoice[] = [
  { id: 'inv-1023', label: 'Program Fee (Deposit)', amount: 250, status: 'paid' },
  { id: 'inv-1041', label: 'Program Fee (Final)', amount: 450, status: 'unpaid', dueDate: 'Dec 05, 2025' },
];
