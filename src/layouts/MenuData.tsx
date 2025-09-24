import { YBB_ROUTES } from "@/constants/ybb";

export interface MenuItem {
  id: number;
  label: string;
  icon?: string;
  link?: string;
  click?: () => void;
  stateVariables?: boolean;
  subItems?: MenuItem[];
  isHeader?: boolean;
  badgeName?: string;
  badgeColor?: string;
  parentId?: number;
  isChildItem?: boolean;
  childItems?: MenuItem[];
}

// Public navigation menu
export const getPublicMenuItems = (): MenuItem[] => {
  return [
    {
      id: 1,
      label: "Home",
      icon: "ri-home-4-line",
      link: YBB_ROUTES.HOME,
    },
    {
      id: 2,
      label: "Programs",
      icon: "ri-graduation-cap-line",
      link: YBB_ROUTES.PROGRAMS,
      subItems: [
        {
          id: 21,
          label: "Program Overview",
          link: YBB_ROUTES.PROGRAMS,
          icon: "ri-information-line"
        },
        {
          id: 22,
          label: "Insights & Analytics",
          link: YBB_ROUTES.INSIGHTS,
          icon: "ri-bar-chart-line"
        },
        {
          id: 23,
          label: "Photo Gallery",
          link: YBB_ROUTES.GALLERY,
          icon: "ri-image-line"
        },
        {
          id: 24,
          label: "Testimonials",
          link: YBB_ROUTES.TESTIMONIALS,
          icon: "ri-chat-quote-line"
        }
      ]
    },
    {
      id: 3,
      label: "Partners & Sponsors",
      icon: "ri-team-line",
      link: YBB_ROUTES.PARTNERS,
    },
    {
      id: 4,
      label: "Announcements",
      icon: "ri-megaphone-line",
      link: YBB_ROUTES.ANNOUNCEMENTS,
    }
  ];
};

// Participant dashboard menu
export const getParticipantMenuItems = (): MenuItem[] => {
  return [
    {
      id: 10,
      label: "Dashboard",
      icon: "ri-dashboard-2-line",
      link: YBB_ROUTES.PARTICIPANT.DASHBOARD,
    },
    {
      id: 11,
      label: "Applications",
      icon: "ri-file-text-line",
      subItems: [
        {
          id: 111,
          label: "My Submissions",
          link: YBB_ROUTES.PARTICIPANT.SUBMISSIONS,
        },
        {
          id: 112,
          label: "New Application",
          link: YBB_ROUTES.PARTICIPANT.SUBMISSIONS + "/new",
        }
      ]
    },
    {
      id: 12,
      label: "Documents",
      icon: "ri-folder-line",
      link: YBB_ROUTES.PARTICIPANT.DOCUMENTS,
    },
    {
      id: 13,
      label: "Payments",
      icon: "ri-secure-payment-line",
      link: YBB_ROUTES.PARTICIPANT.PAYMENTS,
    },
    {
      id: 14,
      label: "Profile",
      icon: "ri-user-line",
      link: YBB_ROUTES.PARTICIPANT.PROFILE,
    }
  ];
};

// Ambassador dashboard menu  
export const getAmbassadorMenuItems = (): MenuItem[] => {
  return [
    {
      id: 20,
      label: "Dashboard",
      icon: "ri-dashboard-2-line",
      link: YBB_ROUTES.AMBASSADOR.DASHBOARD,
    },
    {
      id: 21,
      label: "Referrals",
      icon: "ri-user-add-line",
      link: YBB_ROUTES.AMBASSADOR.REFERRALS,
    },
    {
      id: 22,
      label: "Earnings",
      icon: "ri-money-dollar-circle-line",
      link: YBB_ROUTES.AMBASSADOR.EARNINGS,
    },
    {
      id: 23,
      label: "Performance",
      icon: "ri-line-chart-line",
      link: YBB_ROUTES.AMBASSADOR.PERFORMANCE,
    },
    {
      id: 24,
      label: "Profile",
      icon: "ri-user-line",
      link: YBB_ROUTES.AMBASSADOR.PROFILE,
    }
  ];
};