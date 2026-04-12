# Project: Saviours AI 2027

ICSE Class 10 board exam preparation platform with AI-powered study tools.

## Stack
- Next.js 16 (App Router), React 19, tRPC 11, Prisma 5, PostgreSQL (Neon), gpt-4o-mini, Razorpay
- Inline CSS only — no Tailwind, no CSS modules
- Fonts: ScotchDisplay Bold (--font-display), Coolvetica (--font-body), Helvetica Neue, ScotchDisplay Italic (--font-tagline) via @font-face
- CSS variables design system: --bg-base, --bg-surface, --bg-elevated, --bg-border, --accent-gold, --accent-gold-border, --text-primary, --text-secondary, --text-muted
- Custom JWT auth (jose + bcryptjs) with HttpOnly cookies — NOT NextAuth
- Deployment: Vercel (savioursai2027.vercel.app) with two Neon databases (preview + production)

## Commands
- `npm run dev` — start dev server
- `npm run build` — runs `prisma generate && next build`
- `npx prisma db push` — push schema to database
- `npx prisma studio` — open database GUI

## What's been built so far
- Full dashboard with dynamic plan badge (Free/Monthly/Yearly) and upgrade button for free users
- AI Doubt Solver (gpt-4o-mini with image/PDF support)
- Smart Planner (daily study plan generator)
- Monthly Mission (12-month ICSE prep checklist, localStorage persistence)
- ChronoScroll (history timeline with Quick Recall)
- Competency Test (PYQ-based timed practice)
- Customise Test (custom MCQ generator)
- Flip the Question (reverse-engineer from answers)
- Focus Mode (distraction-free timer)
- Razorpay payment system: Monthly (subscription, plan_SaTud9otdxFFZf, 11 cycles) + Yearly (one-time order, Rs599)
- Razorpay webhook handler for subscription lifecycle (charged, cancelled, halted, completed)
- Lazy demotion: monthly users auto-demoted to FREE when subscription expires
- Payment warning banner on dashboard (amber for cancelled autopay, red for expired)
- Domin8 Pro bundle activation (code entry, codes start with capital W — secret)
- Google OAuth + credentials auth with mandatory phone collection
- Onboarding flow (6-step cinematic sequence with pricing selection)
- Feature flags system (src/lib/featureFlags.ts + src/config/feature-flags.ts)
- Plan-based access control (src/lib/planAccess.ts + src/lib/tier-config.ts)
- Vercel Analytics integration

## Tier structure
- **Free**: Dashboard, Smart Planner, Monthly Mission only
- **Monthly/Yearly**: All features (AI Doubt Solver, Competency Test, Customise Test, Flip the Question, Focus Mode, ChronoScroll)
- **Domin8 Pro**: Activated via secret code (starts with W), grants Yearly access

## Current state / what's in progress
- Payments working in production with live Razorpay keys
- Google OAuth needs redirect URIs added in Google Cloud Console for all URL variants
- The /pricing page (src/app/pricing/page.tsx) uses older styling, doesn't match the new design system
- Demo mode available at login for testing (demo@saviours.test)

## Conventions
- All styling is inline CSS using the design system CSS variables
- Button classes: btn-gold (primary gold CTA), btn-ghost (secondary transparent)
- tRPC routers in src/server/routers/, combined in src/server/routers/index.ts
- API routes in src/app/api/ for non-tRPC endpoints (auth, Razorpay, webhooks)
- Feature access checks via canAccess() from src/lib/planAccess.ts
- Route locking via FREE_ROUTES and LOCKED_ROUTES in src/lib/tier-config.ts
- Profile type casting: `(profile as any)?.planType` pattern used in dashboard

## Don't touch
- prisma/schema.prisma — only modify when explicitly adding new fields/models
- src/app/api/razorpay/webhook/route.ts — production webhook, tested and working
- src/actions/verify-payment.ts — handles both subscription and order signature verification
- src/lib/auth.ts — core JWT session logic, changes here break all auth
- .env — contains live Razorpay keys and production secrets
