import { timingSafeEqual } from 'node:crypto';

function safeCompare(input: string, expected: string): boolean {
  const inputBuffer = Buffer.from(input, 'utf8');
  const expectedBuffer = Buffer.from(expected, 'utf8');

  if (inputBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(inputBuffer, expectedBuffer);
}

export function getBearerToken(request: Request): string {
  const authHeader = request.headers.get('authorization') ?? '';
  return authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
}

export function isRevalidateAuthorized(request: Request, secret: string): boolean {
  const token = getBearerToken(request);
  if (!token || !secret) return false;
  return safeCompare(token, secret);
}

