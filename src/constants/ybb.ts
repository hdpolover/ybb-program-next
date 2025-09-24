// YBB Platform Constants

export const YBB_MODULES = {
  PARTICIPANTS: 'participants',
  AMBASSADORS: 'ambassadors',
  PROGRAMS: 'programs',
  ANALYTICS: 'analytics'
} as const;

export const YBB_ROUTES = {
  // Public routes
  HOME: "/",
  PROGRAMS: "/programs",
  INSIGHTS: "/programs/insights", 
  GALLERY: "/programs/gallery",
  TESTIMONIALS: "/programs/testimonials",
  ANNOUNCEMENTS: "/announcements",
  PARTNERS: "/partners",
  ABOUT: "/about",
  CONTACT: "/contact",
  
  // Program specific routes
  PROGRAM_DETAIL: "/programs/istanbul-youth-summit-2026",
  APPLY: "/apply",
  REGISTER_SELF_FUNDED: "/apply?type=self-funded",
  REGISTER_FULLY_FUNDED: "/apply?type=fully-funded",
  
  // Authentication routes
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password"
  },
  
  // Participant routes
  PARTICIPANT: {
    DASHBOARD: "/participant/dashboard",
    SUBMISSIONS: "/participant/submissions",
    DOCUMENTS: "/participant/documents", 
    PAYMENTS: "/participant/payments",
    PROFILE: "/participant/profile"
  },
  
  // Ambassador routes
  AMBASSADOR: {
    DASHBOARD: "/ambassador/dashboard",
    REFERRALS: "/ambassador/referrals",
    EARNINGS: "/ambassador/earnings",
    PERFORMANCE: "/ambassador/performance",
    PROFILE: "/ambassador/profile"
  }
} as const;

export const YBB_API_ENDPOINTS = {
  // Auth endpoints
  AUTH_SIGNIN: '/auth/signin',
  AUTH_SIGNUP: '/auth/signup',
  AUTH_REFRESH: '/auth/refresh',
  AUTH_LOGOUT: '/auth/logout',
  
  // Participant endpoints
  PARTICIPANTS: '/participants',
  PARTICIPANT_SUBMISSIONS: '/participants/submissions',
  PARTICIPANT_DOCUMENTS: '/participants/documents',
  PARTICIPANT_PAYMENTS: '/participants/payments',
  
  // Ambassador endpoints
  AMBASSADORS: '/ambassadors',
  AMBASSADOR_REFERRALS: '/ambassadors/referrals',
  AMBASSADOR_ANALYTICS: '/ambassadors/analytics',
  
  // Public endpoints
  PROGRAMS: '/programs',
  INSIGHTS: '/insights',
  ANNOUNCEMENTS: '/announcements',
  PARTNERS: '/partners',
} as const;

export const YBB_CONFIG = {
  APP_NAME: 'YBB Platform',
  APP_DESCRIPTION: 'Young Boss Business Conference Platform',
  DEFAULT_THEME: 'light',
  ITEMS_PER_PAGE: 10,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
} as const;

export const SUBMISSION_STEPS = {
  PERSONAL_DETAILS: 'personal-details',
  ESSAYS: 'essays',
  MISCELLANEOUS: 'miscellaneous',
  PREVIEW: 'preview',
} as const;

export const USER_ROLES = {
  PARTICIPANT: 'participant',
  AMBASSADOR: 'ambassador',
  ADMIN: 'admin',
} as const;

export const SUBMISSION_STATUS = {
  DRAFT: 'draft',
  IN_PROGRESS: 'in_progress',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;