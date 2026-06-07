function requireServerApiBaseUrl(): string {
  const configuredBaseUrl = process.env.API_INTERNAL_URL?.trim();

  if (!configuredBaseUrl) {
    throw new Error('API_INTERNAL_URL must be configured.');
  }

  return configuredBaseUrl;
}

export function getServerApiBaseUrl(): string {
  return requireServerApiBaseUrl().replace(/\/v1\/?$/, '');
}

export function getServerApiV1BaseUrl(): string {
  return `${getServerApiBaseUrl()}/v1`;
}
