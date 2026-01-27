import { RundownItem } from '@/components/programs/ProgramRundowns';

export const PROGRAM_DETAIL_HERO = {
  backgroundImage: '/img/bgprogramoverview.png',
};

export const PROGRAM_DETAIL_INFO_STRIP = {
  programDate: {
    label: 'Program Date',
    value: 'March 12 - March 15, 2026',
  },
  location: {
    label: 'Location',
    value: 'Osaka, Japan',
  },
  duration: {
    label: 'Duration',
    value: '4 Days',
  },
  capacity: {
    label: 'Capacity',
    value: '200 Slots',
  },
};

export const PROGRAM_DETAIL_GUIDELINES = {
  eyebrow: 'Guidelines',
  title: 'Registration Guidelines',
  body:
    'Download our comprehensive registration guide to understand the application process, requirements, and important deadlines for this program.',
  ctaLabel: 'Download Guidelines',
  ctaHref:
    'https://drive.google.com/drive/folders/12b2NpJJFpWv5I_HrOHW0Vjiz8xckt5Wt?usp=drive_link',
};

export const PROGRAM_DETAIL_OVERVIEW = {
  eyebrow: 'Overview',
  title: 'Overview',
  intro:
    'Japan Youth Summit, organized by the Youth Break the Boundaries (YBB) Foundation, is an international innovation competition and youth summit designed to inspire emerging leaders and drive real impact.',
  bullets: [
    'Collaborate across diverse fields to implement strategies under the theme “Pioneering Innovation for Sustainable Futures.”',
    'Elevate leadership through discussions, cultural exchange, and hands-on sessions.',
    'Advance Sustainable Development Goals (SDGs): Education (SDG 4), Economy (SDG 8), Industry & Innovation (SDG 9), Sustainable Cities (SDG 11), and Climate Action (SDG 13).',
  ],
};

export const PROGRAM_DETAIL_APPLICATION = {
  title: 'Join our Japan Youth Summit 2025',
  subtitle: 'Secure your spot and be part of an inspiring cohort of young leaders.',
};

export const PROGRAM_DETAIL_SPEAKERS = [
  {
    name: 'Kyoka Sugahara',
    title: 'CEO of BuzzSell',
    org: 'BuzzSell',
    photo: '/img/speaker1.png',
    href: '/speakers/kyoka-sugahara',
  },
  {
    name: 'Fawad Afridi',
    title: 'CEO of Scholarships Corner',
    org: 'Scholarships Corner',
    photo: '/img/speaker2.png',
    href: '/speakers/fawad-afridi',
  },
  {
    name: 'Ayik Abdillah',
    title: 'PhD Student at Kyoto University',
    org: 'Kyoto University',
    photo: '/img/speaker3.png',
    href: '/speakers/ayik-abdillah',
  },
];

export const PROGRAM_DETAIL_RUNDOWN_DAYS: { label: string; items: RundownItem[] }[] = [
  {
    label: 'Day 1',
    items: [
      {
        dateLabel: 'Oct 12, 2025',
        activitiesCount: 1,
        timeRange: '12:00 PM - 03:00 PM',
        duration: 'Duration: 3h',
        title: 'Airport Assistance, Registration (Hotel Check-in)',
        description:
          'Airport assistance will be provided exclusively at Kansai International Airport, with an estimated schedule of two pickup sessions at approximately 12:00 PM and 2:00 PM local time.',
      },
    ],
  },
  {
    label: 'Day 2',
    items: [
      {
        dateLabel: 'Oct 13, 2025',
        activitiesCount: 1,
        timeRange: '08:00 AM - 06:00 PM',
        duration: 'Duration: 10h',
        title: 'City Tour Osaka',
        description:
          'Enjoying a day trip to several destinations in Osaka, including Osaka World Expo 2025',
      },
    ],
  },
  {
    label: 'Day 3',
    items: [
      {
        dateLabel: 'Oct 14, 2025',
        activitiesCount: 1,
        timeRange: '08:00 AM - 06:00 PM',
        duration: 'Duration: 10h',
        title:
          'International Youth Summit & Panel Discussion, International Innovation Competition, Cultural and Awarding Night',
        description:
          'On this day, all participants will gather in one main hall to take part in the International Symposium, Panel Discussion, and Innovate Project Competition. Delegates will engage in meaningful dialogue with official speakers, and showcase their innovative projects to a panel of judges. Selected participants may also receive early international recognition from the Japan Youth Summit Committee.',
      },
    ],
  },
  {
    label: 'Day 4',
    items: [
      {
        dateLabel: 'Oct 15, 2025',
        activitiesCount: 1,
        timeRange: '10:00 AM - 12:00 PM',
        duration: 'Duration: 2h',
        title: 'Certificate Claims, Hotel Check-out, Airport Assistance',
        description:
          'Airport assistance will be provided exclusively at Participants Hotel, with an estimated schedule at approximately 10.00 AM local time',
      },
    ],
  },
];

export type ProgramDetailFaqGroup = {
  label: string;
  fqs: { q: string; a: string }[];
};

export const PROGRAM_DETAIL_FAQ_GROUPS: ProgramDetailFaqGroup[] = [
  {
    label: 'Event Details',
    fqs: [
      {
        q: 'Where is the main event location?',
        a: 'The main event takes place in Osaka, Japan. Detailed venue information (hotel and main hall) will be announced closer to the event date.',
      },
      {
        q: 'What is Japan Youth Summit',
        a: 'Japan Youth Summit is an international youth gathering and innovation competition that brings together students and young professionals to learn, discuss, and collaborate to create impactful solutions.',
      },
      {
        q: 'What is the theme of the Japan Youth Summit?',
        a: "This year's theme is “Collaboration in Diversity”. Sub-themes and discussion focus will be shared in the official booklet and agenda.",
      },
      {
        q: 'What are the agendas at the Japan Youth Summit?',
        a: 'Symposium & panel discussions, International Innovation Competition, networking & mentoring, cultural/awarding night, and an educational city tour.',
      },
      {
        q: 'What are the objectives of the Japan Youth Summit?',
        a: 'To empower global youth, foster cross-cultural collaboration, and spark SDG-aligned innovation through discussions, competition, and networking.',
      },
      {
        q: 'If my parents ask me who is the Project Manager and Public Relations of this event, whose contact I should give?',
        a: 'Official PIC (Project Manager/PR) contact will be shared in the LOA/acceptance email and displayed in your participant Dashboard. For general inquiries, use the Contact page or Support Center.',
      },
      {
        q: 'Why should you join Japan Youth Summit?',
        a: 'Access international speakers, build a global network, gain cross-cultural experience, strengthen your competition portfolio, and get international recognition for your project/research.',
      },
      {
        q: 'How to join the Japan Youth Summit & get the fully funded program?',
        a: 'Apply via the Apply page, complete the documents and motivation essay. Fully-funded slots are very limited and merit/impact-based; eligibility is assessed from your documents and track record.',
      },
    ],
  },
  {
    label: 'Registration',
    fqs: [
      {
        q: 'When will I get the announcement for the selected participants?',
        a: 'Selected participants are scheduled to be announced on September 1–10, 2025 via email and the Dashboard.',
      },
      {
        q: "Why can't I register myself?",
        a: 'Registration may be closed, the quota is full, or you do not meet the age/criteria requirements. Please try in the next batch or contact support.',
      },
      {
        q: 'How to register for the Japan Youth Summit?',
        a: 'Click Apply, create an account, fill out the online form, upload documents, then submit. Track all progress in your Dashboard.',
      },
      {
        q: 'Where should I submit my application?',
        a: 'All documents must be submitted through the Dashboard. Submissions via email are not accepted.',
      },
      {
        q: 'Am I eligible for the fully funded participant?',
        a: 'Candidates are selected based on achievement/impact, motivation essay, and theme fit. Fully-funded slots are highly competitive and limited.',
      },
      {
        q: 'What documents should we prepare for the application?',
        a: 'ID/Passport, CV/Resume, motivation essay (300–500 words), proof of achievement/portfolio (optional), and recommendation letter (optional). See the Registration Guidelines for details.',
      },
      {
        q: 'Is English required for joining the Japan Youth Summit?',
        a: 'Active English skills are recommended as most sessions are in English. The committee will provide basic guidance to support communication.',
      },
      {
        q: 'How can I know if my application & payment is submitted successfully?',
        a: 'Status appears in real time in the Dashboard (Submitted/Paid) and you will receive an email notification. Keep proof of payment for verification if needed.',
      },
      {
        q: 'What are the requirements to join the Japan Youth Summit?',
        a: 'Aged 17–30 at the time of the event, interest in the theme, an active passport (or in process), and willingness to attend the full program.',
      },
    ],
  },
  {
    label: 'Payments',
    fqs: [
      {
        q: 'I made a payment but it is still pending. Why?',
        a: 'Payment verification can take 24–72 hours depending on the method/bank. Ensure the reference number is correct and avoid duplicate payments. If it takes longer than 72 hours, contact support through the Dashboard.',
      },
      {
        q: 'If I can’t attend the Japan Youth Summit, can I get a refund?',
        a: 'Refund follows official policy: partial refund before certain deadline; non-refundable after administrative process/visa/travel arrangement. See Registration Guidelines for complete details.',
      },
    ],
  },
];
