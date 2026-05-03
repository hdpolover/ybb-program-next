# PR1 Baseline + Flags + Smoke Checklist

This document is the baseline artifact for optimization PR #1. It intentionally does **not** change runtime behavior.

## 1. Baseline Metrics Snapshot (Template)

Fill these with current values before enabling behavior-changing optimizations.

| Area | Metric | Current value | Source/dashboard link |
| --- | --- | --- | --- |
| API | p95 latency | _TBD_ | _TBD_ |
| API | p99 latency | _TBD_ | _TBD_ |
| API | top slow Prisma queries | _TBD_ | _TBD_ |
| Cache | Redis hit ratio | _TBD_ | _TBD_ |
| Frontend | LCP | _TBD_ | _TBD_ |
| Frontend | CLS | _TBD_ | _TBD_ |
| Frontend | INP | _TBD_ | _TBD_ |
| Payment | payment success/failure rate | _TBD_ | _TBD_ |

## 2. Dashboard/Observability Links

Set canonical links used during rollout and regression checks.

- API observability: _TBD_
- Database observability: _TBD_
- Redis observability: _TBD_
- Frontend Web Vitals: _TBD_
- Payment operations dashboard: _TBD_
- Alerting board/on-call runbook: _TBD_

## 3. Feature Flags Added in PR1

These flags are now plumbed in code and env examples. Keep defaults `false` until rollout steps require them.

- `ENABLE_BRAND_SCOPED_CACHE`
- `ENABLE_CSRF_GUARD`
- `ENABLE_FILE_SERVICE_AUTH_REQUIRED`
- `ENABLE_PAYMENT_OUTBOX`
- `ENABLE_STRICT_REVALIDATE_AUTH`
- `ENABLE_THIRD_PARTY_SCRIPT_GATING`

## 4. Smoke Coverage Added in PR1

Playwright smoke checks:

- `GET /api/health` returns `200` and `{ status: "ok" }`
- `GET /api/app-version` returns `200` and non-empty `version`
- `/` navigates without `5xx` response

## 5. Execution Notes

- Keep behavior-changing features behind flags.
- Use this file as the per-PR baseline snapshot and link to run evidence.
