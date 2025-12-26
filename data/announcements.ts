import type { AnnouncementItem } from '@/components/announcements/AnnouncementsGrid';

// data dummy — nanti tinggal diganti fetch dari CMS/API
export const announcementsData: AnnouncementItem[] = [
  {
    id: 'jys-2025-app-deadline',
    image: '/img/programoverview.png',
    title: 'Japan Youth Summit 2025 - Deadline Extended',
    excerpt:
      'We are extending the application deadline to November 30, 2025 to give more time for candidates to finalize documents.',
    author: 'YBB Secretariat',
    date: 'Nov 7, 2025',
    href: '#',
    category: 'program-news',
  },
  {
    id: 'visa-briefing',
    image: '/img/jysprogram1.jpg',
    title: 'Visa Briefing for Selected Delegates',
    excerpt:
      'All delegates must attend the online visa briefing next week. We will cover documents, timelines, and best practices for interviews.',
    author: 'Program Team',
    date: 'Nov 5, 2025',
    href: '#',
    category: 'conference',
  },
  {
    id: 'scholarship-update',
    image: '/img/programhighlight1.jpg',
    title: 'Scholarship - Additional Partial Available',
    excerpt:
      'Thanks to new partner support, we are adding limited partial scholarships for community leaders focusing on SDGs 4, 8, and 13.',
    author: 'Scholarship Committee',
    date: 'Nov 3, 2025',
    href: '#',
    category: 'scholarship',
  },
  {
    id: 'shortlist-batch-1',
    image: '/img/galeri1.png',
    title: 'Shortlist Announcement - Batch 1',
    excerpt:
      'Congratulations to the first batch of shortlisted candidates. Please check your email for next steps and document verification schedule.',
    author: 'Selection Committee',
    date: 'Nov 1, 2025',
    href: '#',
  },
  {
    id: 'webinar-orientation',
    image: '/img/osaka.jpg',
    title: 'Pre-Program Orientation Webinar',
    excerpt:
      'Join our live orientation to learn about agendas, assessment criteria, travel plans, and how to prepare a strong application.',
    author: 'Community Team',
    date: 'Oct 30, 2025',
    href: '#',
  },
  {
    id: 'mentor-lineup',
    image: '/img/galeri3.png',
    title: 'Introducing 2025 Mentor Lineup',
    excerpt:
      'Meet our mentors from academia, industry, and NGOs. Tracks include Climate Action, Digital Innovation, and Social Entrepreneurship.',
    author: 'Programs & Curriculum',
    date: 'Oct 28, 2025',
    href: '#',
  },
  {
    id: 'partnership-mou',
    image: '/img/YAFlogo.png',
    title: 'New Partnership MoU Signed for Cultural Exchange Activities',
    excerpt:
      'We signed an MoU with a cultural foundation to expand immersion activities, language exchange, and local community visits.',
    author: 'Partnerships Office',
    date: 'Oct 26, 2025',
    href: '#',
  },
  {
    id: 'travel-grant-policy',
    image: '/img/galeri6.png',
    title: 'Travel Grant Policy: Reimbursement and Timeline Clarification',
    excerpt:
      'Clarifying reimbursement caps, required receipts, and disbursement timelines to ensure smooth processing for eligible delegates.',
    author: 'Finance Desk',
    date: 'Oct 24, 2025',
    href: '#',
  },
  {
    id: 'venue-announcement',
    image: '/img/galeri7.png',
    title: 'Official Venue Announcement - Osaka International Convention Center',
    excerpt:
      'JYS 2025 will be hosted at the Osaka International Convention Center. Venue details and nearby accommodation list are now available.',
    author: 'Operations Team',
    date: 'Oct 20, 2025',
    href: '#',
  },
  // Award winners — used in "Meet Our Awardees" section on announcements page
  {
    id: 'best-participants-2025',
    image: '/img/galeri1.png',
    title: 'Meet the Best Participants of Japan Youth Summit 2025',
    excerpt: '',
    author: 'Awards Committee',
    date: 'Oct 18, 2025',
    href: '#',
    category: 'awards',
    winners: [
      'Badar Salim Sulaiman Alfarsi',
      'Samantha Annisa Nurfadilla',
      'Maria Fernanda Camara',
      'Abdul Rahim Ali Mussa',
    ],
  },
  {
    id: 'best-group-2025',
    image: '/img/galeri3.png',
    title: 'Best Group Award – Japan Youth Summit 2025',
    excerpt: '',
    author: 'Awards Committee',
    date: 'Oct 18, 2025',
    href: '#',
    category: 'awards',
    winners: ['Team Sakura', 'Team Fuji'],
  },
  {
    id: 'best-leader-2025',
    image: '/img/galeri6.png',
    title: 'Best Leader and Best Presenter of Japan Youth Summit 2025',
    excerpt: '',
    author: 'Awards Committee',
    date: 'Oct 18, 2025',
    href: '#',
    category: 'awards',
    winners: ['Best Leader: Aiko Tanaka', 'Best Presenter: Jonathan Lee'],
  },
];
