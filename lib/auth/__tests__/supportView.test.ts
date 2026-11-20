// lib/auth/__tests__/supportView.test.ts
import { describe, expect, it } from 'vitest';
import { isReadOnlySupportToken } from '@/lib/auth/supportView';

const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString('base64url');
const token = (payload: object) => `${b64({ alg: 'HS256' })}.${b64(payload)}.sig`;

describe('isReadOnlySupportToken', () => {
  it('is true for a read_only impersonation token', () => {
    expect(isReadOnlySupportToken(token({ impersonationMode: 'read_only' }))).toBe(true);
  });

  it('is false for a full impersonation or an ordinary token', () => {
    expect(isReadOnlySupportToken(token({ impersonationTicketId: 't1' }))).toBe(false);
    expect(isReadOnlySupportToken(token({ sub: 'u1' }))).toBe(false);
  });

  it('is false for missing or malformed tokens', () => {
    expect(isReadOnlySupportToken(undefined)).toBe(false);
    expect(isReadOnlySupportToken('')).toBe(false);
    expect(isReadOnlySupportToken('not-a-jwt')).toBe(false);
    expect(isReadOnlySupportToken('a.%%%.c')).toBe(false);
  });
});
