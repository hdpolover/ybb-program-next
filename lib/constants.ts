/**
 * Application constants
 */

export const APP_NAME = 'Japan Youth Summit';
export const APP_DESCRIPTION = 'International website built with Next.js';
export const APP_VERSION = '1.0.0';

export const SUPPORTED_LOCALES = ['en', 'id'] as const;
export const DEFAULT_LOCALE = 'en';

export const API_ENDPOINTS = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  HEALTH: '/health',
} as const;

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
} as const;
