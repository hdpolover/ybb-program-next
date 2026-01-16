/**
 * API endpoints constants
 */
export const API_ENDPOINTS = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  HEALTH: '/health',
  HOME: '/v1/landing/home',
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
  },
} as const;

