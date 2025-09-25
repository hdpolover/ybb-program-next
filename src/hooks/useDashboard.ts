// Dashboard Hook for managing dashboard state and data
"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  DASHBOARD_STATS, 
  QUICK_ACTIONS, 
  RECENT_ACTIVITIES, 
  UPCOMING_TASKS,
  DASHBOARD_CONFIG,
  DashboardStats,
  ActivityItem,
  UpcomingTask,
  QuickAction,
  calculateProfileCompletion,
  getRelativeTime
} from "../config/dashboard";

interface DashboardData {
  stats: DashboardStats[];
  activities: ActivityItem[];
  tasks: UpcomingTask[];
  quickActions: QuickAction[];
  profileCompletion: number;
  isLoading: boolean;
  error: string | null;
}

interface DashboardActions {
  refreshData: () => Promise<void>;
  markTaskComplete: (taskId: string) => void;
  addActivity: (activity: Omit<ActivityItem, 'id'>) => void;
  updateStats: (statId: string, newValue: string | number) => void;
}

export const useDashboard = (): [DashboardData, DashboardActions] => {
  const [data, setData] = useState<DashboardData>({
    stats: DASHBOARD_STATS,
    activities: RECENT_ACTIVITIES,
    tasks: UPCOMING_TASKS,
    quickActions: QUICK_ACTIONS,
    profileCompletion: 85,
    isLoading: false,
    error: null,
  });

  // Simulate API call to fetch dashboard data
  const fetchDashboardData = useCallback(async (): Promise<Partial<DashboardData>> => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          stats: DASHBOARD_STATS.map(stat => ({
            ...stat,
            // Simulate some dynamic data updates
            value: stat.id === 'profile-completion' ? '87%' : stat.value,
          })),
          activities: RECENT_ACTIVITIES.map(activity => ({
            ...activity,
            timestamp: getRelativeTime(activity.timestamp),
          })),
          tasks: UPCOMING_TASKS,
          quickActions: QUICK_ACTIONS,
          profileCompletion: 87,
        });
      }, 1000);
    });
  }, []);

  // Refresh dashboard data
  const refreshData = useCallback(async () => {
    setData(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const newData = await fetchDashboardData();
      setData(prev => ({
        ...prev,
        ...newData,
        isLoading: false,
      }));
    } catch (error) {
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to fetch dashboard data',
      }));
    }
  }, [fetchDashboardData]);

  // Mark task as complete
  const markTaskComplete = useCallback((taskId: string) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === taskId ? { ...task, completed: true } : task
      ),
    }));
    
    // Add activity for completed task
    const completedTask = data.tasks.find(task => task.id === taskId);
    if (completedTask) {
      addActivity({
        action: `Task completed: ${completedTask.task}`,
        timestamp: new Date().toISOString(),
        status: 'completed',
        icon: 'ri-check-line',
      });
    }
  }, [data.tasks]);

  // Add new activity
  const addActivity = useCallback((activity: Omit<ActivityItem, 'id'>) => {
    const newActivity: ActivityItem = {
      id: Date.now().toString(),
      ...activity,
    };
    
    setData(prev => ({
      ...prev,
      activities: [newActivity, ...prev.activities.slice(0, DASHBOARD_CONFIG.maxRecentActivities - 1)],
    }));
  }, []);

  // Update stats
  const updateStats = useCallback((statId: string, newValue: string | number) => {
    setData(prev => ({
      ...prev,
      stats: prev.stats.map(stat =>
        stat.id === statId ? { ...stat, value: newValue } : stat
      ),
    }));
  }, []);

  // Auto-refresh data
  useEffect(() => {
    refreshData();
    
    const interval = setInterval(() => {
      refreshData();
    }, DASHBOARD_CONFIG.refreshInterval);
    
    return () => clearInterval(interval);
  }, [refreshData]);

  // Calculate real-time profile completion based on user data
  useEffect(() => {
    // In a real app, this would use actual user profile data
    const mockProfile = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      dateOfBirth: '1995-06-15',
      nationality: 'us',
      address: '123 Main Street',
      currentEducation: 'University',
      institution: 'Harvard University',
    };
    
    const completion = calculateProfileCompletion(mockProfile);
    
    setData(prev => ({
      ...prev,
      profileCompletion: completion,
      stats: prev.stats.map(stat =>
        stat.id === 'profile-completion' 
          ? { ...stat, value: `${completion}%` }
          : stat
      ),
    }));
  }, []);

  const actions: DashboardActions = {
    refreshData,
    markTaskComplete,
    addActivity,
    updateStats,
  };

  return [data, actions];
};

// Hook for managing dashboard notifications
export const useDashboardNotifications = () => {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'success' | 'warning' | 'error' | 'info';
    message: string;
    timestamp: string;
    read: boolean;
  }>>([]);

  const addNotification = useCallback((
    type: 'success' | 'warning' | 'error' | 'info',
    message: string
  ) => {
    const notification = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    setNotifications(prev => [notification, ...prev]);
    
    // Auto-remove after duration
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, DASHBOARD_CONFIG.notificationDuration);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    markAsRead,
    clearAll,
  };
};

// Hook for managing dashboard preferences
export const useDashboardPreferences = () => {
  const [preferences, setPreferences] = useState({
    theme: 'light' as 'light' | 'dark',
    language: 'en',
    timezone: 'America/New_York',
    autoRefresh: true,
    compactView: false,
    showQuickActions: true,
    showRecentActivities: true,
    showUpcomingTasks: true,
  });

  const updatePreference = useCallback(<K extends keyof typeof preferences>(
    key: K,
    value: typeof preferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    
    // Save to localStorage
    localStorage.setItem('dashboardPreferences', JSON.stringify({
      ...preferences,
      [key]: value,
    }));
  }, [preferences]);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('dashboardPreferences');
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse dashboard preferences:', error);
      }
    }
  }, []);

  return {
    preferences,
    updatePreference,
  };
};

export default useDashboard;