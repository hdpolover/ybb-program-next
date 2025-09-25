// Dashboard Configuration Manager
"use client";

import { createContext, useContext, ReactNode } from "react";
import { useDashboard, useDashboardNotifications, useDashboardPreferences } from "../hooks/useDashboard";

interface DashboardContextType {
  dashboard: ReturnType<typeof useDashboard>;
  notifications: ReturnType<typeof useDashboardNotifications>;
  preferences: ReturnType<typeof useDashboardPreferences>;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const dashboard = useDashboard();
  const notifications = useDashboardNotifications();
  const preferences = useDashboardPreferences();

  const value = {
    dashboard,
    notifications,
    preferences,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboardContext must be used within a DashboardProvider");
  }
  return context;
};

// Dashboard Configuration Utils
export const DASHBOARD_ROUTES = {
  OVERVIEW: "/participant/dashboard",
  SUBMISSIONS: "/participant/submissions",
  DOCUMENTS: "/participant/documents",
  PAYMENTS: "/participant/payments",
  PROFILE: "/participant/profile",
  SETTINGS: "/participant/settings",
} as const;

export const DASHBOARD_PERMISSIONS = {
  VIEW_STATS: "view:stats",
  MANAGE_SUBMISSIONS: "manage:submissions",
  UPLOAD_DOCUMENTS: "upload:documents",
  MAKE_PAYMENTS: "make:payments",
  EDIT_PROFILE: "edit:profile",
  VIEW_ANALYTICS: "view:analytics",
} as const;

export const DASHBOARD_FEATURES = {
  QUICK_ACTIONS: "quickActions",
  RECENT_ACTIVITIES: "recentActivities", 
  UPCOMING_TASKS: "upcomingTasks",
  PROGRESS_TRACKING: "progressTracking",
  NOTIFICATIONS: "notifications",
  ANALYTICS: "analytics",
  AUTO_SAVE: "autoSave",
  OFFLINE_MODE: "offlineMode",
} as const;

// Performance optimization settings
export const DASHBOARD_PERFORMANCE = {
  // Data refresh intervals (in milliseconds)
  STATS_REFRESH_INTERVAL: 30000,
  ACTIVITIES_REFRESH_INTERVAL: 60000,
  NOTIFICATIONS_REFRESH_INTERVAL: 15000,
  
  // Pagination settings
  ACTIVITIES_PER_PAGE: 10,
  TASKS_PER_PAGE: 5,
  NOTIFICATIONS_PER_PAGE: 20,
  
  // Cache settings
  CACHE_DURATION: 300000, // 5 minutes
  MAX_CACHE_SIZE: 50, // Maximum cached items
  
  // Loading states
  SKELETON_DELAY: 200,
  ERROR_RETRY_DELAY: 5000,
  
  // Auto-save settings
  AUTO_SAVE_DELAY: 2000,
  AUTO_SAVE_MAX_ATTEMPTS: 3,
} as const;

// Dashboard accessibility settings
export const DASHBOARD_A11Y = {
  // ARIA labels
  STATS_CARD: "Dashboard statistics card",
  QUICK_ACTION: "Quick action button",
  ACTIVITY_ITEM: "Recent activity item",
  TASK_ITEM: "Upcoming task item",
  
  // Keyboard navigation
  TAB_INDEX_START: 1,
  SKIP_LINK_TARGET: "#main-content",
  
  // Screen reader announcements
  LOADING_MESSAGE: "Loading dashboard data...",
  ERROR_MESSAGE: "Error loading dashboard. Please try again.",
  SUCCESS_MESSAGE: "Dashboard updated successfully.",
  
  // Focus management
  FOCUS_TIMEOUT: 100,
  FOCUS_VISIBLE_TIMEOUT: 300,
} as const;

// Dashboard responsive breakpoints
export const DASHBOARD_BREAKPOINTS = {
  XS: 0,
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
  XXL: 1400,
} as const;

// Dashboard theme configuration
export const DASHBOARD_THEME = {
  COLORS: {
    PRIMARY: "#556ee6",
    SUCCESS: "#34c38f",
    INFO: "#50a5f1",
    WARNING: "#f1b44c",
    DANGER: "#f46a6a",
    SECONDARY: "#74788d",
  },
  GRADIENTS: {
    PRIMARY: "linear-gradient(135deg, #556ee6 0%, #3b82f6 100%)",
    SUCCESS: "linear-gradient(135deg, #34c38f 0%, #10b981 100%)",
    INFO: "linear-gradient(135deg, #50a5f1 0%, #3b82f6 100%)",
    WARNING: "linear-gradient(135deg, #f1b44c 0%, #f59e0b 100%)",
    DANGER: "linear-gradient(135deg, #f46a6a 0%, #ef4444 100%)",
  },
  SHADOWS: {
    SM: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    MD: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    LG: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },
  TRANSITIONS: {
    DEFAULT: "all 0.2s ease-in-out",
    FAST: "all 0.1s ease-in-out",
    SLOW: "all 0.3s ease-in-out",
  },
} as const;

// Dashboard validation rules
export const DASHBOARD_VALIDATION = {
  PROFILE: {
    REQUIRED_FIELDS: [
      "firstName",
      "lastName",
      "email",
      "phone",
      "dateOfBirth",
    ],
    MIN_COMPLETION_PERCENTAGE: 70,
  },
  DOCUMENTS: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ["pdf", "doc", "docx", "jpg", "jpeg", "png"],
    MIN_REQUIRED_DOCS: 3,
  },
  SUBMISSIONS: {
    MIN_ESSAY_LENGTH: 100,
    MAX_ESSAY_LENGTH: 5000,
    REQUIRED_SECTIONS: ["personal", "essays", "additional"],
  },
} as const;

// Dashboard error handling
export const DASHBOARD_ERRORS = {
  NETWORK_ERROR: "Network connection error. Please check your internet connection.",
  UNAUTHORIZED: "You are not authorized to view this content.",
  FORBIDDEN: "Access to this resource is forbidden.",
  NOT_FOUND: "The requested resource was not found.",
  SERVER_ERROR: "Server error. Please try again later.",
  VALIDATION_ERROR: "Please check your input and try again.",
  TIMEOUT_ERROR: "Request timed out. Please try again.",
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
} as const;

// Dashboard analytics events
export const DASHBOARD_ANALYTICS = {
  PAGE_VIEW: "dashboard_page_view",
  STAT_CLICK: "dashboard_stat_click",
  QUICK_ACTION_CLICK: "dashboard_quick_action_click",
  TASK_COMPLETE: "dashboard_task_complete",
  DOCUMENT_UPLOAD: "dashboard_document_upload",
  PROFILE_UPDATE: "dashboard_profile_update",
  SUBMISSION_SAVE: "dashboard_submission_save",
  PAYMENT_INITIATE: "dashboard_payment_initiate",
} as const;

export default {
  DASHBOARD_ROUTES,
  DASHBOARD_PERMISSIONS,
  DASHBOARD_FEATURES,
  DASHBOARD_PERFORMANCE,
  DASHBOARD_A11Y,
  DASHBOARD_BREAKPOINTS,
  DASHBOARD_THEME,
  DASHBOARD_VALIDATION,
  DASHBOARD_ERRORS,
  DASHBOARD_ANALYTICS,
};