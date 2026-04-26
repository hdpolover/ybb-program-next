# Copilot instructions for this repository

## Build, test, and lint commands

```bash
npm install
npm run dev
npm run lint
npm run type-check
npm run build
npm run test:e2e
```

Single-test examples for the existing Playwright setup:

```bash
npm run test:e2e -- e2e/<spec>.ts
npm run test:e2e -- -g "test name"
npm run test:e2e -- --project=chromium e2e/<spec>.ts
```

Notes taken from the current config and docs:

- `npm run dev` starts Next.js with `next dev --webpack`.
- `npm run build` requires `APP_BUILD_ID` in production; `next.config.js` throws if it is missing.
- Playwright is configured in `playwright.config.ts` and auto-starts the app with `npm run dev`.
- The `e2e/` folder is configured as the Playwright test directory.
- Copilot cloud-agent setup lives in `.github/workflows/copilot-setup-steps.yml` and preinstalls npm dependencies plus Playwright browsers for future sessions.

## High-level architecture

This is a Next.js App Router frontend for YBB program sites. The frontend is not the system of record: most business data comes from an external backend API, and the app's own `app/api/**` route handlers mostly act as thin server-side adapters around that backend.

The app is multi-brand / multi-domain:

- `proxy.ts` reads the incoming host, stores it in the `x-hostname` request header, and checks maintenance mode before allowing normal page rendering.
- `lib/server/envContext.ts` is the shared source of truth for resolving the active brand domain. Use it instead of reading `host` headers ad hoc.
- Backend requests usually include `x-brand-domain` so the backend can return brand-specific content.

Rendering is split between public marketing pages, application flows, and the authenticated dashboard:

- Public pages live directly under `app/` and are mostly server components that assemble many section components from backend-provided content.
- The dashboard lives under the route group `app/(dashboard)/dashboard/**`; the `(dashboard)` segment is structural only and is not part of the URL.
- Onboarding and login are client-heavy flows that call internal Next.js API routes such as `/api/auth/*`, `/api/participants/*`, and `/api/metadata/*`.

Brand settings and theming are centralized in the root layout:

- `app/layout.tsx` fetches home/settings data server-side, computes CSS custom properties for the active brand color, and wraps the app in `SettingsProvider`.
- `lib/api/settings.ts` caches settings on the server with `unstable_cache`, and `components/providers/SettingsProvider.tsx` mirrors that data into `localStorage` for client reuse.
- `AppVersionWatcher` polls `/api/app-version`; production deploys rely on `APP_BUILD_ID` / `NEXT_PUBLIC_APP_BUILD_ID` so clients can hard-refresh into the latest build.

## Key conventions

- Prefer shared API helpers in `lib/api/**` over raw `fetch` when talking to the backend. The common backend response shape is `{ statusCode, message, data }`, and `apiGetWithEnvelope` / `getEnvelopeData` are the normal helpers for that envelope.
- When adding brand-aware backend calls, pass the resolved brand domain through `x-brand-domain`. Reuse `resolveBrandDomain()` or `resolveBrandDomainFromRequest()` instead of rebuilding hostname parsing.
- Internal route handlers usually keep browser concerns inside Next.js and backend concerns in the external API. Typical examples are auth routes that exchange credentials with the backend, then set or clear `accessToken` / `refreshToken` cookies in Next.js.
- Dashboard chrome is gated client-side by pathname helpers such as `ClientNavbarGate`, `ClientFooterGate`, and `ClientCTAGate`. If a new route should hide global marketing UI, update those gates together.
- Settings changes are expected to flow through the cache layer, not direct cache-busting in components. Use the existing `settings` cache tag and `/api/settings/revalidate` route for settings invalidation.
- Home page content is data-driven: `app/page.tsx` maps backend section `type` values to React sections. When backend section schemas change, update both the section type definitions in `types/home.ts` and the section selection/rendering logic in `app/page.tsx`.
