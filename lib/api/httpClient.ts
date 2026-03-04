export interface ApiGetOptions {
  query?: Record<string, string | number | boolean | undefined>;
  headers?: HeadersInit;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
}

export interface ApiPostOptions {
  query?: Record<string, string | number | boolean | undefined>;
  headers?: HeadersInit;
  body?: unknown;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
}

export class ApiRequestError extends Error {
  status: number;
  statusText: string;
  url: string;

  constructor(params: { status: number; statusText: string; url: string }) {
    super(`API request failed: ${params.status} ${params.statusText} (${params.url})`);
    this.name = 'ApiRequestError';
    this.status = params.status;
    this.statusText = params.statusText;
    this.url = params.url;
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://staging-api.ybbhub.com';

export async function apiGet<T>(path: string, options: ApiGetOptions = {}): Promise<T> {
  const url = new URL(path, API_BASE_URL);

  if (options.query) {
    Object.entries(options.query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    cache: options.cache,
    next: options.next,
  });

  if (!res.ok) {
    throw new ApiRequestError({ status: res.status, statusText: res.statusText, url: url.toString() });
  }

  return (await res.json()) as T;
}

export async function apiPost<T>(path: string, options: ApiPostOptions = {}): Promise<T> {
  const url = new URL(path, API_BASE_URL);

  if (options.query) {
    Object.entries(options.query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: options.cache,
    next: options.next,
  });

  if (!res.ok) {
    throw new ApiRequestError({ status: res.status, statusText: res.statusText, url: url.toString() });
  }

  return (await res.json()) as T;
}

// Generic helper for APIs that wrap payloads in { statusCode, message, data }
export type ApiEnvelope<T> = {
  statusCode: number;
  message: string;
  data: T;
};

export async function apiGetWithEnvelope<TData>(
  path: string,
  options: ApiGetOptions = {},
): Promise<TData> {
  const json = await apiGet<ApiEnvelope<TData>>(path, options);

  if (json.statusCode !== 200 || !json.data) {
    throw new Error(json.message || 'Unexpected API response');
  }

  return json.data;
}
