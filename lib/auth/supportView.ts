// lib/auth/supportView.ts
//
// Detects the read-only customer-support session minted by the API
// (impersonationMode=read_only claim). Display-only: the payload is NOT
// verified here, so this may only drive courtesy UI. The API refuses every
// write made with such a token, which is the actual enforcement.

export function isReadOnlySupportToken(accessToken: string | undefined): boolean {
  if (!accessToken) return false;
  const parts = accessToken.split('.');
  if (parts.length !== 3) return false;

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const payload = JSON.parse(atob(padded)) as { impersonationMode?: unknown };
    return payload.impersonationMode === 'read_only';
  } catch {
    return false;
  }
}
