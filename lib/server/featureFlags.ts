type ProcessEnv = Record<string, string | undefined>;

const TRUE_VALUES = new Set(['1', 'true', 'yes', 'on']);

function parseBooleanFlag(value: string | undefined, defaultValue = false): boolean {
  if (value === undefined) return defaultValue;
  return TRUE_VALUES.has(value.trim().toLowerCase());
}

export const FEATURE_FLAG_ENV_KEYS = {
  enableCsrfGuard: 'ENABLE_CSRF_GUARD',
  enableFileServiceAuthRequired: 'ENABLE_FILE_SERVICE_AUTH_REQUIRED',
  enablePaymentOutbox: 'ENABLE_PAYMENT_OUTBOX',
  enableStrictRevalidateAuth: 'ENABLE_STRICT_REVALIDATE_AUTH',
  enableThirdPartyScriptGating: 'ENABLE_THIRD_PARTY_SCRIPT_GATING',
} as const;

export type FeatureFlags = Readonly<{
  enableCsrfGuard: boolean;
  enableFileServiceAuthRequired: boolean;
  enablePaymentOutbox: boolean;
  enableStrictRevalidateAuth: boolean;
  enableThirdPartyScriptGating: boolean;
}>;

export function getFeatureFlags(env: ProcessEnv = process.env): FeatureFlags {
  return {
    enableCsrfGuard: parseBooleanFlag(env[FEATURE_FLAG_ENV_KEYS.enableCsrfGuard]),
    enableFileServiceAuthRequired: parseBooleanFlag(env[FEATURE_FLAG_ENV_KEYS.enableFileServiceAuthRequired]),
    enablePaymentOutbox: parseBooleanFlag(env[FEATURE_FLAG_ENV_KEYS.enablePaymentOutbox]),
    enableStrictRevalidateAuth: parseBooleanFlag(env[FEATURE_FLAG_ENV_KEYS.enableStrictRevalidateAuth]),
    enableThirdPartyScriptGating: parseBooleanFlag(
      env[FEATURE_FLAG_ENV_KEYS.enableThirdPartyScriptGating],
    ),
  };
}
