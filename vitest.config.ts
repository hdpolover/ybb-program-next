import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules', 'e2e'],
    env: {
      // middleware.ts reads this at module-scope (getServerApiBaseUrl()) purely
      // to build API_BASE_URL; unit tests never actually hit the network, but
      // the module throws on import without it. Dummy value only, test-only.
      API_INTERNAL_URL: 'http://localhost:4000',
    },
  },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./', import.meta.url)) },
  },
});
