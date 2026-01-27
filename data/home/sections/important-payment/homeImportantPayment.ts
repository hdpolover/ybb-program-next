export type ImportantPaymentIconKey =
  | 'payment_schedule'
  | 'selection_quota'
  | 'fully_funded_process'
  | 'self_funded_guarantee';

export type ImportantPaymentItem = {
  id: string;
  icon: ImportantPaymentIconKey;
  title: string;
  body: string;
};

export type HomeImportantPaymentContent = {
  eyebrow: string;
  title: string;
  introText: string;
  items: ImportantPaymentItem[];
  note: string;
};

export const HOME_IMPORTANT_PAYMENT_CONTENT: HomeImportantPaymentContent = {
  eyebrow: 'Payment & Selection',
  title: 'Important information before you apply',
  introText:
    'Understand how the payment schedule and fully funded selection work so you can choose the best registration type for you.',
  items: [
    {
      id: 'payment-schedule',
      icon: 'payment_schedule',
      title: 'Payment Schedule',
      body:
        'All participants pay program fees in scheduled batches over time, not as a single upfront payment.',
    },
    {
      id: 'selection-quota',
      icon: 'selection_quota',
      title: 'Selection Quota',
      body:
        'Fully funded slots are limited and competitive based on qualifications and available funding.',
    },
    {
      id: 'fully-funded-process',
      icon: 'fully_funded_process',
      title: 'Fully Funded Process',
      body:
        'You still follow the same payment schedule, then receive a full reimbursement if you are selected.',
    },
    {
      id: 'self-funded-guarantee',
      icon: 'self_funded_guarantee',
      title: 'Self Funded Guarantee',
      body:
        'If you follow the payment schedule, your participation is guaranteed without competitive selection.',
    },
  ],
  note:
    'Important: If you are not selected for fully funded, you will continue as self funded with no refund of payments already made.',
};
