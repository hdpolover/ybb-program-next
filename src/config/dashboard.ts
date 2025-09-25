// Dashboard Configuration
import { YBB_ROUTES } from "../constants/ybb";

export interface DashboardStats {
  id: string;
  title: string;
  value: string | number;
  subValue?: string;
  color: string;
  icon: string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    percentage: number;
  };
  link?: string;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  link: string;
}

export interface ActivityItem {
  id: string;
  action: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  icon?: string;
}

export interface UpcomingTask {
  id: string;
  task: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  completed?: boolean;
}

export const DASHBOARD_STATS: DashboardStats[] = [
  {
    id: 'application-status',
    title: 'Application Status',
    value: 'In Progress',
    color: 'warning',
    icon: 'ri-file-text-line',
    link: '/submissions',
  },
  {
    id: 'documents',
    title: 'Documents',
    value: 3,
    subValue: '/ 5',
    color: 'info',
    icon: 'ri-folder-line',
    trend: {
      direction: 'up',
      percentage: 60,
    },
    link: '/documents',
  },
  {
    id: 'payment-status',
    title: 'Payment Status',
    value: 'Pending',
    color: 'warning',
    icon: 'ri-bank-card-line',
    link: '/payments',
  },
  {
    id: 'profile-completion',
    title: 'Profile Completion',
    value: '85%',
    color: 'primary',
    icon: 'ri-user-line',
    trend: {
      direction: 'up',
      percentage: 85,
    },
    link: '/profile',
  },
];

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'continue-application',
    title: 'Continue Application',
    description: 'Complete your submission',
    icon: 'ri-file-edit-line',
    color: 'primary',
    link: '/submissions',
  },
  {
    id: 'upload-documents',
    title: 'Upload Documents',
    description: 'Add required documents',
    icon: 'ri-upload-cloud-line',
    color: 'success',
    link: '/documents',
  },
  {
    id: 'make-payment',
    title: 'Make Payment',
    description: 'Complete payment process',
    icon: 'ri-secure-payment-line',
    color: 'warning',
    link: '/payments',
  },
  {
    id: 'update-profile',
    title: 'Update Profile',
    description: 'Manage your information',
    icon: 'ri-user-settings-line',
    color: 'info',
    link: '/profile',
  },
];

export const RECENT_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    action: 'Application started',
    timestamp: '2024-01-15 10:30 AM',
    status: 'completed',
    icon: 'ri-file-add-line',
  },
  {
    id: '2',
    action: 'Personal details updated',
    timestamp: '2024-01-14 3:45 PM',
    status: 'completed',
    icon: 'ri-user-settings-line',
  },
  {
    id: '3',
    action: 'Document uploaded',
    timestamp: '2024-01-13 2:15 PM',
    status: 'completed',
    icon: 'ri-upload-line',
  },
  {
    id: '4',
    action: 'Payment initiated',
    timestamp: '2024-01-12 11:20 AM',
    status: 'pending',
    icon: 'ri-money-dollar-circle-line',
  },
];

export const UPCOMING_TASKS: UpcomingTask[] = [
  {
    id: '1',
    task: 'Complete essay questions',
    priority: 'high',
    dueDate: '2024-01-20',
    completed: false,
  },
  {
    id: '2',
    task: 'Upload passport copy',
    priority: 'medium',
    dueDate: '2024-01-25',
    completed: false,
  },
  {
    id: '3',
    task: 'Submit application',
    priority: 'high',
    dueDate: '2024-01-30',
    completed: false,
  },
  {
    id: '4',
    task: 'Complete payment',
    priority: 'medium',
    dueDate: '2024-01-28',
    completed: false,
  },
];

export const NOTIFICATION_SETTINGS = {
  email: {
    applicationUpdates: true,
    paymentReminders: true,
    documentRequests: true,
    deadlineReminders: true,
  },
  browser: {
    realTimeUpdates: true,
    messageNotifications: false,
  },
  sms: {
    urgentAlerts: false,
    paymentConfirmations: false,
  },
};

export const DASHBOARD_THEMES = {
  light: {
    primary: '#556ee6',
    success: '#34c38f',
    info: '#50a5f1',
    warning: '#f1b44c',
    danger: '#f46a6a',
    dark: '#343a40',
  },
  dark: {
    primary: '#556ee6',
    success: '#34c38f',
    info: '#50a5f1',
    warning: '#f1b44c',
    danger: '#f46a6a',
    light: '#f8f9fa',
  },
};

// Sidebar theme configuration for better YBB dashboard experience
export const SIDEBAR_THEMES = {
  LIGHT: 'light',    // Clean white background
  DARK: 'dark',      // Primary color background with white text (better contrast)
  GRADIENT: 'gradient',  // Gradient background
  GRADIENT_2: 'gradient-2',
  GRADIENT_3: 'gradient-3', 
  GRADIENT_4: 'gradient-4',
} as const;

export const getBadgeColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    // Application statuses
    draft: 'warning',
    'in-progress': 'info',
    submitted: 'primary',
    'under-review': 'info',
    approved: 'success',
    rejected: 'danger',
    
    // Payment statuses
    pending: 'warning',
    paid: 'success',
    failed: 'danger',
    refunded: 'secondary',
    
    // Document statuses
    uploaded: 'info',
    verified: 'success',
    
    // General statuses
    active: 'success',
    inactive: 'secondary',
    completed: 'success',
  };
  
  return statusColors[status.toLowerCase()] || 'secondary';
};

export const getProgressColor = (percentage: number): string => {
  if (percentage >= 80) return 'success';
  if (percentage >= 60) return 'info';
  if (percentage >= 40) return 'warning';
  return 'danger';
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatDate = (dateString: string, format: 'short' | 'long' = 'short'): string => {
  const date = new Date(dateString);
  
  if (format === 'long') {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(dateString);
};

export const calculateProfileCompletion = (profile: any): number => {
  const requiredFields = [
    'firstName',
    'lastName', 
    'email',
    'phone',
    'dateOfBirth',
    'nationality',
    'address',
    'currentEducation',
    'institution',
  ];
  
  const completedFields = requiredFields.filter(field => 
    profile[field] && profile[field].toString().trim() !== ''
  );
  
  return Math.round((completedFields.length / requiredFields.length) * 100);
};

export const DASHBOARD_CONFIG = {
  refreshInterval: 30000, // 30 seconds
  maxRecentActivities: 5,
  maxUpcomingTasks: 4,
  autoSaveInterval: 10000, // 10 seconds for forms
  notificationDuration: 5000, // 5 seconds
};