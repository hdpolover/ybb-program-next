// config menu dashboard biar gampang diubah-ubah
export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const dashboardNav: NavItem[] = [
  { label: 'Overview', href: '/dashboard' },
  { label: 'Submission', href: '/dashboard/submission' },
  {
    label: 'Documents',
    href: '/dashboard/documents',
    children: [
      { label: 'Program Documents', href: '/dashboard/documents/program' },
      { label: 'Certificates', href: '/dashboard/documents/certificates' },
    ],
  },
  { label: 'Payments', href: '/dashboard/payments' },
];
