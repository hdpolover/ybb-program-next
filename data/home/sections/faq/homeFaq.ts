export type HomeFaqItem = {
  q: string;
  a: string;
};

export type HomeFaqGroup = {
  label: string;
  faqs: HomeFaqItem[];
};

export type HomeFaqCopy = {
  title: string;
  subtitle: string;
  groups: HomeFaqGroup[];
};

export const HOME_FAQ_COPY: HomeFaqCopy = {
  title: "Got Questions? We've Got Answers.",
  subtitle:
    'Explore frequently asked questions to better understand the program flow, requirements, and important information.',
  groups: [
    {
      label: 'Event Details',
      faqs: [
        {
          q: 'What is Japan Youth Summit?',
          a: 'Japan Youth Summit is an international youth program that brings together young leaders to collaborate, discuss global issues, and experience cultural exchange in Japan.',
        },
        {
          q: 'Where and when will the program take place?',
          a: 'The summit is scheduled to be held in Japan with detailed dates, venue, and agenda shared in the official guidebook and announcement channels.',
        },
        {
          q: 'Who can join Japan Youth Summit?',
          a: 'The program is open to youth and young professionals from various countries who are passionate about leadership, collaboration, and global citizenship.',
        },
      ],
    },
    {
      label: 'Registration',
      faqs: [
        {
          q: 'How do I apply for the program?',
          a: 'You can apply by filling in the registration form on the official website and following the instructions listed in the program guidebook.',
        },
        {
          q: 'Is there any selection process?',
          a: 'Yes. All applications will be reviewed based on motivation, alignment with program values, and potential impact in your community.',
        },
        {
          q: 'Can I edit my application after submission?',
          a: 'Minor corrections may be allowed before the deadline. Please refer to the guidebook or contact our support team for assistance.',
        },
      ],
    },
    {
      label: 'Payments',
      faqs: [
        {
          q: 'What does the program fee cover?',
          a: 'The fee generally includes program sessions, materials, on-site activities, and a certificate of participation. Travel, visa, and personal expenses are usually excluded unless stated otherwise.',
        },
        {
          q: 'Are there any scholarship or funded opportunities?',
          a: 'Some editions may provide self-funded and fully funded tracks. Please check the latest information on the website or guidebook for available schemes.',
        },
        {
          q: 'What payment methods are available?',
          a: 'Payment options such as bank transfer or other channels will be explained clearly in the payment instruction section and official announcements.',
        },
      ],
    },
  ],
};
