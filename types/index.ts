/**
 * Global type definitions
 */

export interface BaseResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type Locale = 'en' | 'id';

export interface LocaleMetadata {
  locale: Locale;
  name: string;
  flag: string;
}

