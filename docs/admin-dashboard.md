# Admin dashboard

Open `/admin` and sign in with the configured administrator account. The default account is `care.savioursai@gmail.com`; the password is stored as a server-side bcrypt hash. Set `ADMIN_PASSWORD_HASH` to override the default hash. `JWT_SECRET` is required. Login is rate limited; the session is an HttpOnly cookie. Admin data pages, APIs and plan actions check this session.

## Metrics

Overview, Revenue and Features default to **1 November 2026, 00:00 IST** as the standalone-business boundary. Their reporting-period selector can switch to **All time**. The Users directory is deliberately always all-time so historical students remain searchable and manageable regardless of the selected analytics period.

- **Total signups:** registered user records, excluding `demo@saviours.test`.
- **Paid users:** current paid entitlements, including legacy paid access and manual grants; expired access is excluded. This is not a count of verified purchases.
- **Free ebooks claimed:** users with `ebookSpinAt` set; one claim per account. Later upgrades do not erase the claim.
- **Online now:** distinct users with a visible dashboard heartbeat in the past two minutes. Visible dashboard tabs heartbeat every minute. Multiple tabs update the same presence record.
- **Active today:** users whose most recent dashboard heartbeat is today in IST.
- **Most opened features:** feature navigation events, deduplicated per user/feature/minute. These are distinct from completed tasks or server-recorded AI requests.
- Signup dates and daily charts use Asia/Kolkata and show every day from 1 November 2026, including zero days.

Presence and feature opens are stored in the existing `audit_logs` table and begin with this release. No schema migration or external analytics service is required. Only allowlisted feature identifiers are collected; page content and complete URLs are not sent. The panel refreshes every 30 seconds while visible.

## Captured payment ledger

Revenue is loaded read-only from Razorpay's Payments API and cached for five minutes. Only captures created from 1 November 2026 onward are included. It reports refunds, fees, product notes, payment methods and recent customers. If Razorpay is temporarily unavailable, the page falls back to post-boundary webhook captures. Keep `payment.captured` (and `subscription.charged` for legacy subscriptions) enabled on `/api/razorpay/webhook` with `RAZORPAY_WEBHOOK_SECRET`; the webhook remains responsible for entitlement grants and the fallback ledger.

The overview can show the latest Instagram follower count through Meta's official API. Configure `INSTAGRAM_USER_ID`, a long-lived `INSTAGRAM_ACCESS_TOKEN` with `instagram_business_basic`, and optionally `INSTAGRAM_USERNAME`. The count is cached for 15 minutes. `INSTAGRAM_GRAPH_BASE_URL` and `INSTAGRAM_GRAPH_VERSION` can override the defaults for a different Meta login flow.

Manual plan changes and referral grants do not create payment records.

## Verification

Start a local Next server, then run:

```sh
ADMIN_TEST_URL=http://localhost:3102 ADMIN_TEST_PASSWORD='<admin password>' npx tsx scripts/check-admin-dashboard.ts
```

The check uses temporary users in the configured database and removes them in `finally`. It checks login/logout, protected data/APIs, active versus expired paid access, claims and search, heartbeat/feature deduplication, captured-payment deduplication, plan changes, and mobile layout. Chrome must be installed. Screenshots are saved under `output/admin/`.

## Deployment

`npm run build` generates Prisma Client and builds Next.js. It does not run database migrations: parallel preview/production builds must not compete for Prisma's migration advisory lock. This admin release uses existing tables and adds no migration.

For future schema releases, run `npm run db:migrate` once in a serialised release step against the target database before promoting the application. Use Neon's direct (non-pooler) connection for that migration job, supplied as its `DATABASE_URL`; retain the pooled URL for the application. Keep advisory locking enabled. If another migration owns the lock, let it finish and retry the migration job. Do not skip pending schema migrations or mark them applied without executing them.
