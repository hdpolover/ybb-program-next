// config menu dashboard biar gampang diubah-ubah
export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const dashboardNav: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Submission', href: '/dashboard/submission' },
  { label: 'Payments', href: '/dashboard/payments' },
  { label: 'Document', href: '/dashboard/documents' },
];

export const ambassadorNav: NavItem[] = [
  { label: 'Overview', href: '/dashboard/ambassador' },
];
