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
    },
    {
      id: 3,
      label: "Insights",
      icon: "ri-lightbulb-line",
      link: YBB_ROUTES.INSIGHTS,
    },
    {
      id: 4,
      label: "Announcements",
      icon: "ri-notification-2-line",
      link: YBB_ROUTES.ANNOUNCEMENTS,
    },
    {
      id: 5,
      label: "Partners",
      icon: "ri-team-line",
      link: YBB_ROUTES.PARTNERS,
    },
    {
      id: 6,
      label: "About",
      icon: "ri-information-line",
      link: YBB_ROUTES.ABOUT,
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