export function getServerApiBaseUrl(): string {
  const configuredBaseUrl = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL;

  if (!configuredBaseUrl) {
    throw new Error("API_INTERNAL_URL or NEXT_PUBLIC_API_URL must be configured.");
  }

  return configuredBaseUrl.replace(/\/v1\/?$/, "");
}
